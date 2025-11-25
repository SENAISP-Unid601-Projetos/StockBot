import React from 'react';
import { Doughnut } from 'react-chartjs-2'; // Usamos Pizza/Rosca para categorias
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Paper, Typography, Box } from '@mui/material';

ChartJS.register(ArcElement, Tooltip, Legend);

function CategoryChart({ componentes = [] }) {
  // Agrupa por categoria
  const dadosAgrupados = {};
  componentes.forEach(item => {
    const cat = item.categoria || 'Sem Categoria';
    dadosAgrupados[cat] = (dadosAgrupados[cat] || 0) + (item.quantidade || 0);
  });

  const data = {
    labels: Object.keys(dadosAgrupados),
    datasets: [
      {
        data: Object.values(dadosAgrupados),
        backgroundColor: [
          '#1976d2', '#2e7d32', '#ed6c02', '#9c27b0', '#d32f2f', '#0288d1'
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' },
    }
  };

  return (
    <Paper sx={{ p: 3, height: '100%', minHeight: 400, boxShadow: 3, display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom fontWeight="bold">Distribuição por Categoria</Typography>
      <Box sx={{ flexGrow: 1, position: 'relative' }}>
        <Doughnut data={data} options={options} />
      </Box>
    </Paper>
  );
}

export default CategoryChart;