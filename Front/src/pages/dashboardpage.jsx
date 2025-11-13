import { useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import KpiCard from "../components/kpicard";
import ActionList from "../components/actionlist";
import CategoryChart from "../components/categoriachart";

function DashboardPage() {
  const [componentes, setComponentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [threshold, setThreshold] = useState(5); // <-- 1. Adicionar estado para o limite

  const fetchData = async () => {
    setLoading(true);
    try {
      // 2. Buscar componentes E o limite em paralelo
      const [componentesResponse, thresholdResponse] = await Promise.all([
        api.get("/api/componentes"),
        api
          .get("/api/settings/lowStockThreshold") // <-- Buscar o limite
          .catch(() => ({ data: 5 })), // Fallback
      ]);

      if (Array.isArray(componentesResponse.data)) {
        setComponentes(componentesResponse.data);
      }
      setThreshold(thresholdResponse.data); // 3. Definir o limite
    } catch (error) {
      console.error("Erro ao buscar dados!", error);
      toast.error("Não foi possível carregar os dados do dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGeneratePdf = async () => {
    toast.info("A gerar o relatório em PDF...");
    try {
      const historicoResponse = await api.get("/api/historico?size=100");
      const historicoData = historicoResponse.data.content;

      const mapaComponentes = new Map(
        componentes.map((comp) => [comp.id, comp.nome])
      );
      const historicoProcessado = historicoData.map((item) => ({
        ...item,
        nomeComponente: mapaComponentes.get(item.componenteId) || "N/A",
      }));

      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text("Relatório de Movimentações de Estoque", 14, 22);
      doc.setFontSize(11);
      doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")}`, 14, 30);

      const tableColumn = [
        "Data/Hora",
        "Componente",
        "Tipo",
        "Qtd.",
        "Utilizador",
      ];
      const tableRows = [];
      historicoProcessado.forEach((item) => {
        const itemData = [
          new Date(item.dataHora).toLocaleString("pt-BR"),
          item.nomeComponente,
          item.tipo,
          item.quantidade,
          item.usuario,
        ];
        tableRows.push(itemData);
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 40,
      });

      doc.save("relatorio-historico.pdf");
      toast.success("Relatório gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Não foi possível gerar o relatório.");
    }
  };

  const totalUnidades = componentes.reduce(
    (total, comp) => total + comp.quantidade,
    0
  );
  const itensEmFalta = componentes.filter((comp) => comp.quantidade <= 0);

  // 4. Usar o 'threshold' do estado, em vez do valor '5' fixo
  const itensEstoqueBaixo = componentes.filter(
    (comp) => comp.quantidade > 0 && comp.quantidade <= threshold
  );

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: "background.default",
          minHeight: "100vh",
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Typography variant="h4" component="h1" fontWeight="bold">
              Dashboard
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PictureAsPdfIcon />}
              onClick={handleGeneratePdf}
            >
              Gerar Relatório
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={2}>
              {/* --- LINHA 1: KPI CARDS --- */}
              {/*
               *
               * MUDANÇA 1: Adicionamos 'sx' ao Grid e a prop 'items' ao KpiCard
               *
               */}
              <Grid xs={12} md={4} sx={{ display: "flex" }}>
                <KpiCard
                  title="Total de Itens"
                  value={componentes.length}
                  description="Tipos de itens cadastrados"
                  items={componentes} // <-- Passa a lista de TODOS os itens
                />
            <Grid container spacing={3}>
              <Grid xs={12} md={4}>
                <KpiCard
                  title="Total de Itens"
                  value={componentes.length}
                  description="Tipos de itens cadastrados"
                />
              </Grid>

              {/* Card de Unidades não precisa de lista */}
              <Grid xs={12} md={4} sx={{ display: "flex" }}>
                <KpiCard
                  title="Unidades em Estoque"
                  value={totalUnidades}
                  description="Total de unidades no inventário"
                  // Sem lista aqui
                />
              <Grid xs={12} md={4}>
                <KpiCard
                  title="Unidades em Stock"
                  value={totalUnidades}
                  description="Total de unidades no inventário"
                />
              </Grid>

              {/*
               *
               * MUDANÇA 2: Adicionamos 'sx' ao Grid e a prop 'items' ao KpiCard
               *
               */}
              <Grid xs={12} md={4} sx={{ display: "flex" }}>
                <KpiCard
                  title="Itens em Falta"
                  value={itensEmFalta.length}
                  description="Itens com estoque zerado"
                  isCritical={true}
                  items={itensEmFalta} // <-- Passa a lista de ITENS EM FALTA
                />
              <Grid xs={12} md={4}>
                <KpiCard
                  title="Itens em Falta"
                  value={itensEmFalta.length}
                  description="Itens com stock zerado"
                  isCritical={true}
                />
              </Grid>

              {/* --- LINHA 2: GRÁFICO E LISTAS --- */}
              <Grid xs={12} lg={8}>
                <Paper sx={{ p: 0, height: "100%" }}>
              <Grid xs={12} lg={8}>
                <Paper sx={{ p: 2, height: "100%" }}>
                  <CategoryChart componentes={componentes} />
                </Paper>
              </Grid>

              {/*
               *
               * MUDANÇA 3: A coluna da direita agora só tem a lista de "Stock Baixo"
               *
               */}
              <Grid xs={12} lg={4}>
                <Paper sx={{ p: 2, height: "100%" }}>
                  <ActionList
                    title={"Itens com Estoque Baixo"}
                    items={itensEstoqueBaixo}
                  />
              <Grid xs={12} lg={4}>
                <Paper sx={{ p: 2, height: "100%" }}>
                  {/* 5. Passar o 'threshold' para o ActionList */}
                  <ActionList
                    title={`Itens com Stock Baixo (≤ ${threshold})`}
                    items={itensEstoqueBaixo}
                  />
                </Paper>
              </Grid>
            </Grid>
          )}
        </Container>
      </Box>
    </>
  );
}

export default DashboardPage;
