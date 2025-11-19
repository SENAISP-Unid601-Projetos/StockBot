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
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import ActionList from "../components/actionList";
import PrintIcon from "@mui/icons-material/Print";
import WarningAmberIcon from "@mui/icons-material/WarningAmber"; // Para estoque baixo
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline"; // Para esgotado
import React from "react"; // (Necessário para o React.Fragment)

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
          api.get("/componentes"),
          api
            .get("/configuracoes/limiteEstoqueBaixo")
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
      sx={{
        flexGrow: 1,
        p: 3,
        backgroundColor: "background.default",
      }}
    >
      <Container maxWidth="lg">
        {/* Header (estava perfeito) */}
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
            disabled={!necessitaReposicao} // Desabilita se não precisar de reposição
          >
            Gerar PDF
          </Button>
        </Box>

        {/* Alerta de Sucesso (estava perfeito) */}
        {!necessitaReposicao && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Estoque em dia! Não há itens necessitando reposição.
          </Alert>
        )}

        {/* ✅ GRID CORRIGIDO COM A PROP 'SIZE' */}
        <Grid container spacing={3}>
          {itensEmFalta.length > 0 && (
            // 👇 CORRIGIDO AQUI
            <Grid size={{ xs: 12, md: 6 }}>
              <ActionList
                title="Itens Esgotados (0 unidades)"
                emptyMessage="Nenhum item completamente esgotado"
              >
                {itensEmFalta.map((item) => (
                  <React.Fragment key={item.id}>
                    <ListItem>
                      <ListItemIcon>
                        <ErrorOutlineIcon color="error" />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.nome}
                        secondary={`Patrimônio: ${item.codigoPatrimonio}`}
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </ActionList>
            </Grid>
          )}

          {itensEstoqueBaixo.length > 0 && (
            // 👇 CORRIGIDO AQUI
            <Grid size={{ xs: 12, md: 6 }}>
              <ActionList
                title={`Itens com Estoque Baixo (≤ ${threshold} unidades)`}
                emptyMessage="Nenhum item com estoque baixo"
              >
                {itensEstoqueBaixo.map((item) => (
                  <React.Fragment key={item.id}>
                    <ListItem>
                      <ListItemIcon>
                        <WarningAmberIcon color="warning" />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.nome}
                        secondary={`Patrimônio: ${item.codigoPatrimonio} | Stock: ${item.quantidade}`}
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </ActionList>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
}

export default ReposicaoPage;
