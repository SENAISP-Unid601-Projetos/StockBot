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
  Typography,
  Checkbox,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Badge
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import FilterListIcon from "@mui/icons-material/FilterList";
import KpiCard from "../components/kpicard";
import ActionList from "../components/actionList";
import CategoryChart from "../components/categoriachart";

function DashboardPage() {
  const [componentes, setComponentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [threshold, setThreshold] = useState(5);

  // Estado para armazenar os nomes dos itens selecionados para o gráfico
  const [selectedNames, setSelectedNames] = useState([]);

  // Estados para controlar o Menu do filtro
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [componentesResponse, thresholdResponse] = await Promise.all([
        api.get("/api/componentes"),
        api.get("/api/settings/lowStockThreshold").catch(() => ({ data: 5 })),
      ]);

      if (Array.isArray(componentesResponse.data)) {
        const todosComponentes = componentesResponse.data;
        setComponentes(todosComponentes);

        // Seleção inicial: Primeiros 16 itens
        const selecaoInicial = todosComponentes.slice(0, 16).map(c => c.nome);
        setSelectedNames(selecaoInicial);
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

  // --- Handlers do Filtro ---

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleToggleItem = (nome) => {
    const currentIndex = selectedNames.indexOf(nome);
    const newSelected = [...selectedNames];

    if (currentIndex === -1) {
      if (newSelected.length >= 16) {
        toast.warning("Limite de 16 itens atingido. Desmarque um para adicionar outro.");
        return;
      }
      newSelected.push(nome);
    } else {
      newSelected.splice(currentIndex, 1);
    }

    setSelectedNames(newSelected);
  };

  const componentesFiltradosParaGrafico = componentes.filter(comp =>
    selectedNames.includes(comp.nome)
  );

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
        overflowX: "hidden",
      }}
    >
      <Container maxWidth={false} disableGutters sx={{ px: 3 }}>
        {/* --- CABEÇALHO --- */}
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
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            
            {/* --- BLOCO 1: OS 4 CARDS --- */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                  md: "1fr 1fr 1fr 1fr",
                },
                gap: 3,
                width: "100%",
              }}
            >
              <KpiCard
                title="Total de Itens"
                value={componentes.length}
                description="Tipos de itens cadastrados"
              />
              <KpiCard
                title="Unidades em Estoque"
                value={totalUnidades}
                description="Total de unidades no inventário"
              />
              <KpiCard
                title="Itens em Falta"
                value={itensEmFalta.length}
                description="Itens com estoque zerado"
                isCritical={true}
              />
              <KpiCard
                title="Estoque Baixo"
                value={itensEstoqueBaixo.length}
                description={`Itens abaixo do mínimo`}
                isCritical={
                  itensEstoqueBaixo.length > 0 && itensEmFalta.length === 0
                }
              />
            </Box>

            {/* --- BLOCO 3: GRÁFICOS --- */}
            <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 3 }}>

              {/* Envolvemos o primeiro gráfico num Box com position relative
                  para posicionar o botão de filtro sobre ele
              */}
              <Box sx={{ position: "relative", width: "100%" }}>

                {/* --- BOTÃO DE FILTRO (Posição Absoluta) --- */}
                <Box sx={{ position: "absolute", top: 16, right: 16, zIndex: 10 }}>
                  <Tooltip title="Filtrar Itens do Gráfico">
                    <IconButton onClick={handleFilterClick} color="primary" size="small">
                      <FilterListIcon />
                    </IconButton>
                  </Tooltip>

                  <Menu
                    anchorEl={anchorEl}
                    open={openMenu}
                    onClose={handleFilterClose}
                    PaperProps={{
                      style: {
                        maxHeight: 300,
                        width: 280,
                      },
                    }}
                  >
                    <MenuItem disabled>
                      <Typography variant="caption" fontWeight="bold">
                        Selecione até 16 itens para visualizar
                      </Typography>
                    </MenuItem>
                    {componentes.map((comp) => (
                      <MenuItem key={comp.id} onClick={() => handleToggleItem(comp.nome)} dense>
                        <Checkbox
                          checked={selectedNames.indexOf(comp.nome) > -1}
                          size="small"
                        />
                        <ListItemText primary={comp.nome} />
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>

                {/* GRÁFICO 1 */}
                <CategoryChart
                  componentes={componentesFiltradosParaGrafico}
                  title="Distribuição de Itens por Quantidade Total"
                  yAxisLabel="Quantidade em Stock"
                  dataKey="quantidade"
                />
              </Box>

              {/* GRÁFICO 2 (Sem filtro individual por enquanto, usa o mesmo filtro ou dados gerais) */}
              <CategoryChart
                componentes={componentesFiltradosParaGrafico}
                title="Nível Mínimo de Estoque por Item"
                yAxisLabel="Nível Mínimo Definido"
                dataKey="nivelMinimoEstoque"
              />
            </Box>

          </Box>
        )}
      </Container>
    </Box>
  );
}

export default DashboardPage;