import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon, // <-- NOVO
  ListItemText,
  Divider,
} from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord"; // <-- NOVO

function KpiCard({
  title,
  value,
  description,
  isCritical = false,
  items = [],
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
            color: isCritical && value > 0 ? "error.main" : "text.primary",
          }}
        >
          {value}
        </Typography>

        <Typography sx={{ mt: 1.5 }} color="text.secondary">
          {description}
        </Typography>

        {/* --- PARTE 2: A LISTA DE NOMES --- */}
        {items && items.length > 0 && (
          <Box
            sx={{
              flexGrow: 1, // Faz o box crescer
              overflowY: "auto", // Adiciona scroll vertical
              mt: 2, // Adiciona margem

              // --- ESTILO DA SCROLLBAR (para Webkit: Chrome/Edge/Safari) ---
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                background: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(128, 128, 128, 0.5)", // Cor cinza sutil
                borderRadius: "3px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "rgba(128, 128, 128, 0.7)",
              },
            }}
          >
            <Divider />
            <List dense={true}>
              {items.map((item) => (
                <ListItem key={item.id} sx={{ py: 0, px: 1 }}>
                  {" "}
                  {/* Ajuste de padding */}
                  {/* --- ÍCONE DE MARCADOR --- */}
                  <ListItemIcon sx={{ minWidth: "24px" }}>
                    <FiberManualRecordIcon
                      sx={{ fontSize: "0.6rem", color: "text.secondary" }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.nome}
                    secondary={`Qtd: ${item.quantidade}`}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default KpiCard;