import React from 'react';

// 1. IMPORTAÇÕES DE COMPONENTES DO MUI
import { Card, CardContent, Typography } from '@mui/material';

// O componente recebe as mesmas props de antes
function KpiCard({ title, value, description, isCritical = false }) {
  return (
    // 2. O <div className="kpi-card"> é substituído pelo <Card> do MUI.
    // Ele já vem com fundo, bordas arredondadas e sombra do nosso tema.
    // 'sx' é uma prop para adicionar estilos customizados. 'height: 100%' garante que todos os cards na mesma linha tenham a mesma altura.
    <Card sx={{ height: '100%', boxShadow: 3 }}>
      {/* CardContent adiciona um espaçamento (padding) interno padrão. */}
      <CardContent>
        {/* 3. Todos os textos são substituídos por <Typography> para consistência. */}
        <Typography
          color="text.secondary" // Usa a cor de texto secundária do nosso tema
          gutterBottom
        >
          {title}
        </Typography>

        <Typography 
          variant="h4" 
          component="div" 
          fontWeight="bold"
          // 4. A lógica 'isCritical' agora é feita com a prop 'sx'.
          // Se for crítico, usa a cor de erro do tema, senão, usa a cor primária de texto.
          sx={{ color: isCritical ? 'error.main' : 'text.primary' }}
        >
          {value}
        </Typography>

        <Typography sx={{ mt: 1.5 }} color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default KpiCard;