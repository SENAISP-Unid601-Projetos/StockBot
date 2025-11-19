import React from 'react';
import { Bar } from 'react-chartjs-2'; 
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'; 
import { Box, Paper, Typography, useTheme } from '@mui/material';

// Registra os plugins necessários do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function CategoryChart({ componentes }) {
  // Acessa o tema do MUI
  const theme = useTheme();

  // Processamento de dados para o gráfico: Agrupando por NOME do componente
  const dadosGrafico = {};
  componentes.forEach(comp => {
    dadosGrafico[comp.nome] = (dadosGrafico[comp.nome] || 0) + comp.quantidade;
  });

  // A lista de cores é mantida para que cada barra tenha uma cor diferente
  const colors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    '#FFC107', // Amarelo
    '#28a745', // Verde
    '#6f42c1', // Roxo
    '#17a2b8', // Ciano
    '#fd7e14', // Laranja
    '#e83e8c', // Rosa
  ];

  const chartData = {
    labels: Object.keys(dadosGrafico),
    datasets: [
      {
        label: 'Quantidade em Stock',
        data: Object.values(dadosGrafico),
        backgroundColor: colors,
        // É um único dataset, logo, barras individuais.
      },
    ],
  };

  // Opções do gráfico otimizadas para um Bar Chart Vertical (Padrão)
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Permite que o gráfico seja grande dentro do contêiner
    // A remoção de 'indexAxis: "y"' garante que o gráfico seja VERTICAL.
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true, // Exibe um título claro
        text: 'Distribuição de Itens por Quantidade Total', 
        font: {
          size: 16,
          family: theme.typography.fontFamily,
        },
        color: theme.palette.text.primary,
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
    scales: {
        x: {
            // Eixo X (Categorias): Nomes dos Itens
            title: {
                display: true,
                text: 'Item (Nome do Componente)', 
                color: theme.palette.text.secondary,
            },
            ticks: {
                color: theme.palette.text.secondary,
                maxRotation: 45, // Rotação para evitar sobreposição de nomes longos
                minRotation: 45,
            },
            grid: {
                display: false, // Remove linhas verticais
            },
        },
        y: {
            // Eixo Y (Valores): Quantidade em Stock
            title: {
                display: true,
                text: 'Quantidade em Stock', 
                color: theme.palette.text.secondary,
            },
            ticks: {
                color: theme.palette.text.secondary,
                beginAtZero: true,
                precision: 0,
            },
            grid: {
                color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            },
        },
    },
  };

  return (
    <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" component="h3" gutterBottom>
        Distribuição de Itens
      </Typography>
      <Box sx={{ position: 'relative', flexGrow: 1, minHeight: '300px' }}>
        {/* Renderiza o componente Bar (Vertical) */}
        <Bar data={chartData} options={chartOptions} />
      </Box>
    </Paper>
  );
}

export default CategoryChart;