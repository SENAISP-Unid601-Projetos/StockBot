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
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";

import ActionList from "../components/actionlist";

function ReposicaoPage() {
  const [componentes, setComponentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [threshold, setThreshold] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Buscar dados em paralelo para melhor performance
        const [componentesResponse, thresholdResponse] = await Promise.all([
          api.get("/api/componentes"),
          api
            .get("/api/configuracoes/limiteEstoqueBaixo")
            .catch(() => ({ data: 5 })), // Fallback para 5 se der erro
        ]);

        if (Array.isArray(componentesResponse.data)) {
          setComponentes(componentesResponse.data);
        }

        setThreshold(thresholdResponse.data);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Não foi possível carregar os dados.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleGerarPedidoPDF = () => {
    const doc = new jsPDF();

    // Adicionar título
    doc.setFontSize(18);
    doc.text("Relatório de Reposição de Estoque", 14, 22);

    // Preparar dados para a tabela
    const tableData = componentes
      .filter((comp) => comp.quantidade <= threshold)
      .map((comp) => [
        comp.id || comp.codigo || "-",
        comp.nome || "Sem nome",
        comp.quantidade || 0,
        comp.quantidade <= 0 ? "ESGOTADO" : "BAIXO",
      ]);

    // Adicionar tabela
    autoTable(doc, {
      head: [["Código", "Nome", "Quantidade", "Status"]],
      body: tableData,
      startY: 30,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [66, 66, 66] },
    });

    // Salvar PDF
    doc.save("relatorio-reposicao-estoque.pdf");
  };

  const itensEmFalta = componentes.filter((comp) => comp.quantidade <= 0);
  const itensEstoqueBaixo = componentes.filter(
    (comp) => comp.quantidade > 0 && comp.quantidade <= threshold
  );
  const necessitaReposicao =
    itensEmFalta.length > 0 || itensEstoqueBaixo.length > 0;

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 3, backgroundColor: "#f8f9fa" }}
    >
      <Container maxWidth="lg">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4" component="h1">
            Relatório de Reposição
          </Typography>

          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={handleGerarPedidoPDF}
            disabled={componentes.length === 0}
          >
            Gerar PDF
          </Button>
        </Box>

        {!necessitaReposicao && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Estoque em dia! Não há itens necessitando reposição.
          </Alert>
        )}

        <Grid container spacing={3}>
          {itensEmFalta.length > 0 && (
            <Grid item xs={12} md={6}>
              <ActionList
                title="Itens Esgotados"
                items={itensEmFalta}
                severity="error"
                emptyMessage="Nenhum item completamente esgotado"
              />
            </Grid>
          )}

          {itensEstoqueBaixo.length > 0 && (
            <Grid item xs={12} md={6}>
              <ActionList
                title={`Itens com Estoque Baixo (≤ ${threshold} unidades)`}
                items={itensEstoqueBaixo}
                severity="warning"
                emptyMessage="Nenhum item com estoque baixo"
              />
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
}

export default ReposicaoPage;
