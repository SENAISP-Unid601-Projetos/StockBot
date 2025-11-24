import React from 'react';
import { Bar } from 'react-chartjs-2'; 
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'; 
import { Box, Paper, Typography, useTheme } from '@mui/material';

// Registra os plugins necessários do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function CategoryChart({
  componentes,
  title = 'Distribuição de Itens por Quantidade Total',
  yAxisLabel = 'Quantidade em Estoque',
  dataKey = 'quantidade'
}) {
  // Acessa o tema do MUI
  const theme = useTheme();

  // Processamento de dados para o gráfico: Agrupando por NOME do componente
  const dadosGrafico = {};
  componentes.forEach(comp => {
    // Usa a chave dinâmica (dataKey) para acessar o valor correto (quantidade ou nivelMinimoEstoque)
    const valor = comp[dataKey] !== undefined ? comp[dataKey] : 0;
    dadosGrafico[comp.nome] = (dadosGrafico[comp.nome] || 0) + valor;
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
        label: yAxisLabel,
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
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true, // Exibe um título claro
        text: title,
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
                // ALTERAÇÃO AQUI: Definir rotação para 0 força o texto a ficar horizontal
                maxRotation: 0,
                minRotation: 0,
            },
            grid: {
                display: false, // Remove linhas verticais
            },
        },
        y: {
            // Eixo Y (Valores): Quantidade em Stock
            title: {
                display: true,
                text: yAxisLabel,
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
    <Paper sx={{ p: 1.5, display: 'flex', flexDirection: 'column', width: '100%', boxShadow: 3 }}>
      {/* Título menor e mais compacto */}
      <Typography variant="subtitle2" component="h3" align="center" sx={{ mb: 0.5, fontWeight: 'bold', opacity: 0.8 }}>
      </Typography>

      {/* Altura do gráfico forçada para 150px */}
      <Box sx={{ position: 'relative', width: '100%', height: '275px' }}>
        <Bar data={chartData} options={chartOptions} />
      </Box>
    </Paper>
  );
}

export default CategoryChart;