// src/components/ActionList.jsx (REFORMADO)
import React from "react";
import { Box, List, Paper, Typography } from "@mui/material";

// 1. As props agora são "title" e "children"
function ActionList({ title, children }) {
  // 2. Verificamos se algum "filho" (children) foi passado
  const hasItems = React.Children.count(children) > 0;

  return (
    <Paper sx={{ p: 2, height: "100%", boxShadow: 3 }}>
      <Typography variant="h6" component="h3" gutterBottom>
        {title}
      </Typography>

      {hasItems ? (
        // 3. Se temos filhos, renderizamos eles dentro da lista
        <List>{children}</List>
      ) : (
        // 4. Se não, mostramos o placeholder (nenhuma mudança aqui)
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
