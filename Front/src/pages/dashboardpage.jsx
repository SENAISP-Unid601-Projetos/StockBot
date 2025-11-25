import React, { useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

// Imports do MUI
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Checkbox,
  ListItemText,
  Tooltip,
  Badge,
  Skeleton,
} from "@mui/material";

// Ícones
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import FilterListIcon from "@mui/icons-material/FilterList";
import {
  Inventory,
  AttachMoney,
  WarningAmber,
  Assignment,
  ShoppingCart,
} from "@mui/icons-material";

// Componentes
import KpiCard from "../components/KpiCard"; // Verifique se o nome do arquivo é KpiCard ou kpicard
import CategoryChart from "../components/categoriachart"; // Verifique o nome do arquivo

// ChartJS para o Gráfico de Barras
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";

// Registra os componentes do ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend
);

function DashboardPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [todosComponentes, setTodosComponentes] = useState([]); // Lista completa para o filtro
  const [loading, setLoading] = useState(true);

  // Filtro do Gráfico de Barras
  const [selectedNames, setSelectedNames] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Busca dados rápidos (KPIs + Pizza) do endpoint otimizado
        const resDashboard = await api.get("/api/dashboard");
        setDashboardData(resDashboard.data);

        // 2. Busca lista detalhada para o gráfico de barras (Pega até 100 itens para filtrar)
        const resComponentes = await api.get("/api/componentes?size=100");
        const lista = resComponentes.data.content || [];
        setTodosComponentes(lista);

        // Seleção inicial: Primeiros 10 itens
        setSelectedNames(lista.slice(0, 10).map((c) => c.nome));
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar dados.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- Lógica do Filtro ---
  const handleFilterClick = (event) => setAnchorEl(event.currentTarget);
  const handleFilterClose = () => setAnchorEl(null);

  const handleToggleItem = (nome) => {
    const currentIndex = selectedNames.indexOf(nome);
    const newSelected = [...selectedNames];

    if (currentIndex === -1) {
      if (newSelected.length >= 15) {
        toast.warning("Limite de 15 itens para visualização.");
        return;
      }
      newSelected.push(nome);
    } else {
      newSelected.splice(currentIndex, 1);
    }
    setSelectedNames(newSelected);
  };

  // Prepara os dados para o Gráfico de Barras baseado na seleção
  const dadosBarras = {
    labels: selectedNames,
    datasets: [
      {
        label: "Quantidade em Estoque",
        data: selectedNames.map(
          (nome) =>
            todosComponentes.find((c) => c.nome === nome)?.quantidade || 0
        ),
        backgroundColor: "rgba(53, 162, 235, 0.6)",
        borderColor: "rgb(53, 162, 235)",
        borderWidth: 1,
      },
      {
        label: "Estoque Mínimo",
        data: selectedNames.map(
          (nome) =>
            todosComponentes.find((c) => c.nome === nome)?.nivelMinimoEstoque ||
            0
        ),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgb(255, 99, 132)",
        borderWidth: 1,
      },
    ],
  };

  const handleGeneratePdf = () => {
    window.print();
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Skeleton variant="rectangular" height={400} />
      </Container>
    );
  }

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 3,
        bgcolor: "background.default",
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="xl">
        {/* Cabeçalho */}
        <Box
          display="flex"
          justifyContent="space-between"
          mb={6}
          alignItems="center"
        >
          <Typography variant="h4" fontWeight="bold" color="text.primary">
            Dashboard
          </Typography>
          <Button
            variant="contained"
            startIcon={<PictureAsPdfIcon />}
            onClick={handleGeneratePdf}
          >
            Imprimir Relatório
          </Button>
        </Box>

        {/* --- 1. KPIs (Cartões) --- */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={2.4}>
            <KpiCard
              title="Total Itens"
              value={dashboardData?.totalItens}
              icon={<Inventory />}
              color="#1976d2"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <KpiCard
              title="Estoque Total"
              value={dashboardData?.totalQuantidadeEstoque}
              icon={<AttachMoney />}
              color="#2e7d32"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <KpiCard
              title="Em Falta"
              value={dashboardData?.itensEmFalta}
              icon={<WarningAmber />}
              color="#d32f2f"
              isCritical={dashboardData?.itensEmFalta > 0}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <KpiCard
              title="Req. Pendentes"
              value={dashboardData?.requisicoesPendentes}
              icon={<Assignment />}
              color="#ed6c02"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <KpiCard
              title="Compras Pendentes"
              value={dashboardData?.pedidosCompraPendentes}
              icon={<ShoppingCart />}
              color="#9c27b0"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* --- 2. Gráfico de Pizza (Agregado) --- */}
          <Grid item xs={12} md={4}>
            {/* Passamos os dados formatados para o componente que já criamos */}
            <CategoryChart
              componentes={dashboardData?.distribuicaoPorCategoria.map((d) => ({
                categoria: d.categoria || "Outros",
                quantidade: d.quantidade,
              }))}
            />
          </Grid>

          {/* --- 3. Gráfico de Barras (Com Filtro) --- */}
          <Grid item xs={12} md={8}>
            <Paper
              sx={{
                p: 3,
                height: "100%",
                position: "relative",
                minHeight: 400,
                boxShadow: 3,
              }}
            >
              {/* Botão de Filtro (Posicionado no canto) */}
              <Box position="absolute" top={16} right={16} zIndex={10}>
                <Tooltip title="Filtrar Itens">
                  <IconButton onClick={handleFilterClick} color="primary">
                    <Badge
                      badgeContent={selectedNames.length}
                      color="secondary"
                    >
                      <FilterListIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>

                {/* Menu Dropdown */}
                <Menu
                  anchorEl={anchorEl}
                  open={openMenu}
                  onClose={handleFilterClose}
                  // AQUI ESTA A CORREÇÃO: Usamos 'sx' dentro de SlotProps ou PaperProps
                  PaperProps={{
                    sx: { maxHeight: 300, width: 250 },
                  }}
                >
                  <MenuItem disabled>
                    <Typography variant="caption">
                      Selecione até 15 itens
                    </Typography>
                  </MenuItem>
                  {todosComponentes.map((comp) => (
                    <MenuItem
                      key={comp.id}
                      onClick={() => handleToggleItem(comp.nome)}
                      dense
                    >
                      <Checkbox
                        checked={selectedNames.includes(comp.nome)}
                        size="small"
                      />
                      <ListItemText primary={comp.nome} />
                    </MenuItem>
                  ))}
                </Menu>
              </Box>

              <Typography variant="h6" gutterBottom fontWeight="bold">
                Comparativo de Estoque (Item a Item)
              </Typography>

              <Box height={320} mt={4}>
                <Bar
                  data={dadosBarras}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: "top" },
                    },
                    scales: {
                      y: { beginAtZero: true },
                    },
                  }}
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default DashboardPage;
