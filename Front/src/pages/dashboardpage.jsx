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
import ActionList from "../components/actionList";
import CategoryChart from "../components/categoriachart";

function DashboardPage() {
  const [componentes, setComponentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [threshold, setThreshold] = useState(5);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [componentesResponse, thresholdResponse] = await Promise.all([
        api.get("/api/componentes"),
        api.get("/api/settings/lowStockThreshold").catch(() => ({ data: 5 })),
      ]);

      if (Array.isArray(componentesResponse.data)) {
        setComponentes(componentesResponse.data);
      }
      setThreshold(thresholdResponse.data);
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
      const historicoData = historicoResponse.data.content || [];

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
    (total, comp) => total + (comp.quantidade || 0),
    0
  );
  const itensEmFalta = componentes.filter(
    (comp) => (comp.quantidade || 0) <= 0
  );
  const itensEstoqueBaixo = componentes.filter(
    (comp) => (comp.quantidade || 0) > 0 && (comp.quantidade || 0) <= threshold
  );

  return (
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
          <Grid container spacing={3}>
            {/* --- LINHA 1: KPI CARDS (4 COLUNAS) --- */}
            <Grid item xs={12}>
              <Grid container spacing={3}>
                
                {/* KPI 1: Total de Itens */}
                <Grid item xs={12} sm={6} md={3}>
                  <KpiCard
                    title="Total de Itens"
                    value={componentes.length}
                    description="Tipos de itens cadastrados"
                    // Removido 'items' e 'isCritical' desnecessários no novo KpiCard
                  />
                </Grid>

                {/* KPI 2: Unidades em Estoque */}
                <Grid item xs={12} sm={6} md={3}>
                  <KpiCard
                    title="Unidades em Estoque"
                    value={totalUnidades}
                    description="Total de unidades no inventário"
                  />
                </Grid>

                {/* KPI 3: Itens em Falta (CRÍTICO - Vermelho) */}
                <Grid item xs={12} sm={6} md={3}>
                  <KpiCard
                    title="Itens em Falta"
                    value={itensEmFalta.length}
                    description="Itens com estoque zerado"
                    isCritical={true} // Ativa a cor de alerta
                  />
                </Grid>
                
                {/* KPI 4 (NOVO): Estoque Baixo (AVISO - Laranja) */}
                <Grid item xs={12} sm={6} md={3}>
                  <KpiCard
                    title="Estoque Baixo"
                    value={itensEstoqueBaixo.length}
                    description={`Itens abaixo do limite (≤ ${threshold})`}
                    isCritical={itensEstoqueBaixo.length > 0 && itensEmFalta.length === 0} // Apenas aviso se não houver falta
                    // Usando 'isCritical' temporariamente, mas um futuro "isWarning" seria melhor
                  />
                </Grid>
              </Grid>
            </Grid>
            
            {/* --- LINHA 3: Gráfico de Categoria + Lista de Ações --- */}
            <Grid item xs={12}>
              <Grid container spacing={3}>
                
                {/* GRÁFICO DE CATEGORIA (2/3 da largura) */}
                <Grid item xs={12} lg={8}>
                  <CategoryChart componentes={componentes} />
                </Grid>
              </Grid>
            </Grid>

          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default DashboardPage;
