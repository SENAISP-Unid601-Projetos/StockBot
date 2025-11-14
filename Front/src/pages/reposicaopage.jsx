import { useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Typography,
  TextField,      // <--- Importado
  InputAdornment  // <--- Importado
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import SearchIcon from "@mui/icons-material/Search"; // <--- Importado

import ActionList from "../components/actionList";

function ReposicaoPage() {
  const [componentes, setComponentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [threshold, setThreshold] = useState(5);
  const [termoBusca, setTermoBusca] = useState(""); // <--- Estado da busca

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [componentesResponse, thresholdResponse] = await Promise.all([
          api.get("/api/componentes"), // Busca todos
          api.get("/api/settings/lowStockThreshold").catch(() => ({ data: 5 })),
        ]);

        if (Array.isArray(componentesResponse.data)) {
          setComponentes(componentesResponse.data);
        }
        setThreshold(thresholdResponse.data);
      } catch (error) {
        toast.error("Não foi possível carregar os dados.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleGerarPedidoPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Relatório de Reposição de Estoque", 14, 22);

    const tableData = componentes
      .filter((comp) => comp.quantidade <= threshold)
      .map((comp) => [
        comp.codigoPatrimonio || "-",
        comp.nome || "Sem nome",
        comp.quantidade || 0,
        comp.quantidade <= 0 ? "ESGOTADO" : "BAIXO",
      ]);

    autoTable(doc, {
      head: [["Código", "Nome", "Quantidade", "Status"]],
      body: tableData,
      startY: 30,
    });
    doc.save("relatorio-reposicao.pdf");
  };

  // --- LÓGICA DE FILTRAGEM ---
  const componentesFiltrados = componentes.filter((comp) => {
    const termo = termoBusca.toLowerCase();
    return (
      (comp.nome && comp.nome.toLowerCase().includes(termo)) ||
      (comp.codigoPatrimonio && comp.codigoPatrimonio.toLowerCase().includes(termo))
    );
  });

  const itensEmFalta = componentesFiltrados.filter((comp) => comp.quantidade <= 0);
  const itensEstoqueBaixo = componentesFiltrados.filter(
    (comp) => comp.quantidade > 0 && comp.quantidade <= threshold
  );
  
  // Verifica se há algo para repor no total (para o botão PDF)
  const totalParaRepor = componentes.some((comp) => comp.quantidade <= threshold);

  if (loading) return <CircularProgress sx={{display: 'block', margin: '20px auto'}} />;

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
          <Typography variant="h4" component="h1" fontWeight="bold">Relatório de Reposição</Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Filtrar itens..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              InputProps={{
                startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>),
              }}
              sx={{ minWidth: "250px", backgroundColor: 'background.paper' }}
            />
            <Button variant="contained" startIcon={<PrintIcon />} onClick={handleGerarPedidoPDF} disabled={!totalParaRepor}>
              Gerar PDF
            </Button>
          </Box>
        </Box>

        {!totalParaRepor && (
          <Alert severity="success" sx={{ mb: 3 }}>Estoque em dia!</Alert>
        )}

        <Grid container spacing={3}>
          {itensEmFalta.length > 0 && (
            <Grid item xs={12} md={6}>
              <ActionList title="Itens Esgotados" items={itensEmFalta} severity="error" />
            </Grid>
          )}
          {itensEstoqueBaixo.length > 0 && (
            <Grid item xs={12} md={6}>
              <ActionList title={`Estoque Baixo (≤ ${threshold})`} items={itensEstoqueBaixo} severity="warning" />
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
}

export default ReposicaoPage;