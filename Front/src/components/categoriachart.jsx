import React, { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import { PieChartOutline } from '@mui/icons-material';

ChartJS.register(ArcElement, Tooltip, Legend);

function CategoryChart({ componentes = [] }) {
  // AQUI ESTÁ O SEGREDO: Puxamos o tema global
  const theme = useTheme();

  const chartData = useMemo(() => {
    if (!componentes.length) return null;

    // 1. Agrupamento por Categoria
    const agrupado = {};
    componentes.forEach((comp) => {
      const cat = comp.categoria || 'Sem Categoria';
      agrupado[cat] = (agrupado[cat] || 0) + (comp.quantidade || 0);
    });

    const labels = Object.keys(agrupado);
    const dataValues = Object.values(agrupado);

    return {
      labels,
      datasets: [
        {
          label: 'Total em Estoque',
          data: dataValues,
          // 2. USO DAS CORES DO TEMA
          // Em vez de '#28a745', usamos theme.palette.success.main
          backgroundColor: [
            theme.palette.primary.main,       // Cor da Empresa (#C00000)
            theme.palette.secondary.main,     // Cor Secundária (Roxo padrão do MUI)
            theme.palette.warning.main,       // Amarelo/Laranja (Aviso)
            theme.palette.success.main,       // Verde (Sucesso)
            theme.palette.info.main,          // Azul (Info)
            theme.palette.error.main,         // Vermelho (Erro)
            theme.palette.text.secondary,     // Cinza
            theme.palette.action.active,      // Cinza escuro
            theme.palette.divider,            // Linha divisória
          ],
          borderColor: theme.palette.background.paper, // A borda se adapta ao Dark/Light mode
          borderWidth: 2,
          hoverOffset: 10,
        },
      ],
    };
  }, [componentes, theme]); // Recalcula se o tema mudar (Dark/Light)

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          // A cor do texto da legenda agora respeita o modo escuro
          color: theme.palette.text.primary,
          usePointStyle: true,
          font: { family: theme.typography.fontFamily, size: 12 },
          boxWidth: 10,
        },
      },
      tooltip: {
        // Tooltip também se adapta
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
      }
    },
    cutout: '65%',
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 4,
        // Garante que o fundo do card esteja correto no Dark Mode
        bgcolor: 'background.paper' 
      }}
    >
      <Typography variant="h6" component="h3" fontWeight="bold" gutterBottom color="text.primary">
        Distribuição por Categoria
      </Typography>

      <Box sx={{ position: 'relative', flexGrow: 1, minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {chartData ? (
          <Doughnut data={chartData} options={chartOptions} />
        ) : (
          <Box textAlign="center" color="text.secondary">
            <PieChartOutline sx={{ fontSize: 60, opacity: 0.3, mb: 1 }} />
            <Typography variant="body2">Nenhum dado para exibir</Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
}

export default CategoryChart;