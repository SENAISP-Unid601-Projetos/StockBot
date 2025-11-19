// src/components/categoriachart.jsx (VERSÃO PROFISSIONAL)
import { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Box, CircularProgress, Typography } from "@mui/material";
import api from "../services/api";

// Registra os plugins necessários do Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, Title);

// Função para gerar cores aleatórias (para o gráfico)
const generateColor = (num) => {
  const colors = [];
  for (let i = 0; i < num; i++) {
    colors.push(`hsl(${(i * 360) / num}, 70%, 50%)`);
  }
  return colors;
};

function CategoryChart() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. CHAMA A NOVA API (QUE JÁ TRAZ OS DADOS PRONTOS)
        const response = await api.get("/dashboard/stats-categorias");
        const data = response.data; // (Vem como [ { categoria: "...", quantidadeTotal: ... } ])

        // 2. Transforma os dados para o Chart.js
        const labels = data.map((item) => item.categoria || "Sem Categoria");
        const quantities = data.map((item) => item.quantidade);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Quantidade Total",
              data: quantities,
              backgroundColor: generateColor(labels.length),
              borderColor: "#ffffff",
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Erro ao buscar dados do gráfico:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Roda só uma vez

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Essencial para o layout do MUI
    plugins: {
      legend: {
        position: "right", // Posição da legenda
      },
      title: {
        display: false, // O título já está no 'DashboardPage.jsx'
      },
    },
  };

  // --- Renderização ---
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!chartData || chartData.labels.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <Typography color="text.secondary">
          Não há dados de estoque para exibir.
        </Typography>
      </Box>
    );
  }

  return (
    // Box flexível para preencher o espaço (necessário para 'maintainAspectRatio: false')
    <Box sx={{ position: "relative", height: "100%", width: "100%" }}>
      <Doughnut data={chartData} options={chartOptions} />
    </Box>
  );
}

export default CategoryChart;
