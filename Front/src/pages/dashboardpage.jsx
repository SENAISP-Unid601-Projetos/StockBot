import React, { useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

// Imports do MUI v6
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
import KpiCard from "../components/KpiCard";
import CategoryChart from "../components/categoriachart"; // Gráfico de Pizza

// ChartJS para o Gráfico de Barras (Comparativo)
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend
);

function DashboardPage() {
  // 1. Dados Agregados (Vem do endpoint rápido /dashboard)
  const [dashboardData, setDashboardData] = useState(null);
  
  // 2. Dados Detalhados (Vem de /componentes para alimentar o filtro)
  const [todosComponentes, setTodosComponentes] = useState([]); 
  
  const [loading, setLoading] = useState(true);

  // Filtro do Gráfico de Barras
  const [selectedNames, setSelectedNames] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Busca paralela para ser mais rápido
        const [resDashboard, resComponentes] = await Promise.all([
            api.get("/api/dashboard"),           // KPIs e Pizza
            api.get("/api/componentes?size=100") // Lista para o filtro (limitado a 100 para não pesar)
        ]);

        setDashboardData(resDashboard.data);
        
        const lista = resComponentes.data.content || [];
        setTodosComponentes(lista);

        // Seleção inicial automática: Primeiros 10 itens
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

  // --- Lógica do Filtro (Trazida do Fork) ---
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

  // Prepara os dados para o Gráfico de Barras (ChartJS)
  const dadosBarras = {
    labels: selectedNames,
    datasets: [
      {
        label: "Estoque Atual",
        data: selectedNames.map(
          (nome) => todosComponentes.find((c) => c.nome === nome)?.quantidade || 0
        ),
        backgroundColor: "rgba(53, 162, 235, 0.7)",
        borderColor: "rgb(53, 162, 235)",
        borderWidth: 1,
      },
      {
        label: "Mínimo Exigido",
        data: selectedNames.map(
          (nome) => todosComponentes.find((c) => c.nome === nome)?.nivelMinimoEstoque || 0
        ),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgb(255, 99, 132)",
        borderWidth: 1,
        borderDash: [5, 5], // Linha tracejada para diferenciar
      },
    ],
  };

  const handleGeneratePdf = () => {
    window.print(); // Mantendo a simplicidade do print nativo
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
      </Container>
    );
  }

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 3, bgcolor: "background.default", minHeight: "100vh" }}>
      <Container maxWidth="xl">
        
        {/* Cabeçalho */}
        <Box display="flex" justifyContent="space-between" mb={4} alignItems="center">
          <Box>
            <Typography variant="h4" fontWeight="bold" color="text.primary">
              Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Visão geral e comparativo de estoque
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<PictureAsPdfIcon />}
            onClick={handleGeneratePdf}
          >
            Relatório
          </Button>
        </Box>

        {/* --- 1. KPIs (Dados Rápidos) --- */}
        <Grid container spacing={3} mb={4}>
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <KpiCard title="Total Itens" value={dashboardData?.totalItens} icon={<Inventory />} color="#1976d2" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <KpiCard title="Estoque Total" value={dashboardData?.totalQuantidadeEstoque} icon={<AttachMoney />} color="#2e7d32" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <KpiCard title="Em Falta" value={dashboardData?.itensEmFalta} icon={<WarningAmber />} color="#d32f2f" isCritical={dashboardData?.itensEmFalta > 0} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <KpiCard title="Req. Pendentes" value={dashboardData?.requisicoesPendentes} icon={<Assignment />} color="#ed6c02" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <KpiCard title="Compras Pendentes" value={dashboardData?.pedidosCompraPendentes} icon={<ShoppingCart />} color="#9c27b0" />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          
          {/* --- 2. Gráfico de Pizza (Agregado por Categoria) --- */}
          <Grid size={{ xs: 12, md: 4 }}>
            {/* Reutilizamos o componente que já criamos */}
            <CategoryChart
              componentes={dashboardData?.distribuicaoPorCategoria.map((d) => ({
                categoria: d.categoria || "Outros",
                quantidade: d.quantidade,
              }))}
            />
          </Grid>

          {/* --- 3. Gráfico de Barras (Comparativo Item a Item com Filtro) --- */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper
              sx={{
                p: 3,
                height: "100%",
                position: "relative",
                minHeight: 400,
                boxShadow: 3,
                borderRadius: 2
              }}
            >
              {/* Botão de Filtro Flutuante */}
              <Box position="absolute" top={16} right={16} zIndex={10}>
                <Tooltip title="Filtrar Itens">
                  <IconButton onClick={handleFilterClick} color="primary">
                    <Badge badgeContent={selectedNames.length} color="secondary">
                      <FilterListIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>

                <Menu
                  anchorEl={anchorEl}
                  open={openMenu}
                  onClose={handleFilterClose}
                  // CORREÇÃO DO ERRO DE TIPO: Usamos slotProps ou sx direto
                  PaperProps={{
                    sx: { maxHeight: 300, width: 250 }
                  }}
                >
                  <MenuItem disabled>
                    <Typography variant="caption">Selecione até 15 itens</Typography>
                  </MenuItem>
                  {todosComponentes.map((comp) => (
                    <MenuItem key={comp.id} onClick={() => handleToggleItem(comp.nome)} dense>
                      <Checkbox checked={selectedNames.includes(comp.nome)} size="small" />
                      <ListItemText primary={comp.nome} />
                    </MenuItem>
                  ))}
                </Menu>
              </Box>

              <Typography variant="h6" gutterBottom fontWeight="bold">
                Comparativo: Estoque Atual vs Mínimo
              </Typography>
              
              <Box height={320} mt={2}>
                <Bar
                  data={dadosBarras}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: "top" },
                      tooltip: {
                        callbacks: {
                            // Dica: Mostra se está acima ou abaixo da meta
                            afterLabel: function(context) {
                                if (context.datasetIndex === 0) { // Se for a barra azul
                                    const item = todosComponentes.find(c => c.nome === context.label);
                                    if (item && item.quantidade <= item.nivelMinimoEstoque) {
                                        return "⚠️ ATENÇÃO: Estoque Baixo!";
                                    }
                                }
                            }
                        }
                      }
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