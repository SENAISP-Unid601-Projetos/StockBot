import React from "react";

// Imports de Componentes e Ícones do MUI
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber"; // Ícone de aviso

function ActionList({ title, items }) {
  return (
    // Paper: O nosso "card" padrão para envolver o conteúdo
    <Paper sx={{ p: 2, height: "100%", boxShadow: 3 }}>
      {/* Typography: Para o título da lista */}
      <Typography variant="h6" component="h3" gutterBottom>
        {title}
      </Typography>

      {items.length > 0 ? (
        // List: O componente do MUI para criar listas
        <List>
          {items.map((item) => (
            <React.Fragment key={item.id}>
              {/* ListItem: Cada item da nossa lista */}
              <ListItem>
                {/* ListItemIcon: Um espaço reservado para ícones */}
                <ListItemIcon>
                  <WarningAmberIcon color="warning" />
                </ListItemIcon>

                {/* ListItemText: Organiza o texto principal e secundário */}
                <ListItemText
                  primary={item.nome}
                  secondary={`Património: ${item.codigoPatrimonio} | Stock: ${item.quantidade}`}
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
      ) : (
        // Mensagem de placeholder se a lista estiver vazia
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "80%",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Nenhum item nesta categoria.
          </Typography>
        </Box>
      )}
    </Paper>
  );
}

export default ActionList;
