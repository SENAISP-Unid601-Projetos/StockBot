import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  // List, ListItem, ListItemIcon, ListItemText, Divider, FiberManualRecordIcon, removidos pois não são mais necessários
} from "@mui/material";
// Ícones removidos

function KpiCard({
  title,
  value,
  description,
  isCritical = false,
  // 'items' foi removido da desestruturação, pois não é mais usado
}) {
  return (
    <Card
      sx={{
        height: "100%",
        boxShadow: 3,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          // Garante que o conteúdo não transborde o padding
          minHeight: 0,
        }}
      >
        {/* --- PARTE 1: NÚMEROS --- */}
        <Typography color="text.secondary" gutterBottom>
          {title}
        </Typography>

        <Typography
          variant="h4"
          component="div"
          fontWeight="bold"
          sx={{
            // Usa a cor vermelha se for crítico e o valor for maior que zero
            color: isCritical && value > 0 ? "error.main" : "text.primary",
          }}
        >
          {value}
        </Typography>

        <Typography sx={{ mt: 1.5 }} color="text.secondary">
          {description}
        </Typography>

        {/* --- PARTE 2: A LISTA DE NOMES (REMOVIDA) --- */}
        
      </CardContent>
    </Card>
  );
}

export default KpiCard;