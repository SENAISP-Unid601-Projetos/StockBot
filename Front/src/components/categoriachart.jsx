import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Box, Paper, Typography, useTheme } from '@mui/material';

// Registra os plugins necessários do Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

function CategoryChart({ componentes }) {
  // Acessa o tema do MUI
  const theme = useTheme();

  // Processamento de dados para o gráfico
  const dadosGrafico = {};
  componentes.forEach(comp => {
    dadosGrafico[comp.nome] = (dadosGrafico[comp.nome] || 0) + comp.quantidade;
  });

  const chartData = {
    labels: Object.keys(dadosGrafico),
    datasets: [
      {
        label: 'Quantidade em Stock',
        data: Object.values(dadosGrafico),
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.secondary.main,
          '#FFC107', // Amarelo
          '#28a745', // Verde
          '#6f42c1', // Roxo
          '#17a2b8', // Ciano
          '#fd7e14', // Laranja
          '#e83e8c', // Rosa
        ],
        borderColor: theme.palette.background.paper,
        borderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  // Opções do gráfico usando o tema do MUI
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: theme.palette.text.secondary,
          font: {
            family: theme.typography.fontFamily,
          },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        titleFont: {
          family: theme.typography.fontFamily,
        },
        bodyFont: {
          family: theme.typography.fontFamily,
        },
      }
    },
    cutout: '60%',
  };

  return (
    <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" component="h3" gutterBottom>
        Distribuição de Itens
      </Typography>
      <Box sx={{ position: 'relative', flexGrow: 1, minHeight: '300px' }}>
        <Doughnut data={chartData} options={chartOptions} />
      </Box>
    </Paper>
  );
}

export default CategoryChart;