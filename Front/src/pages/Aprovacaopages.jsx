// Em: src/pages/AprovacoesPage.jsx
import React, { useState } from "react"; // Import React
import { Box, Container, Typography, Tab, Tabs } from "@mui/material";

// Importa os componentes das tabelas
import TabelaRequisicoes from "../components/TableComponete";
import TabelaPedidosCompra from "../components/TabelaComponentePedido";

function AprovacoesPage() {
  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 3, backgroundColor: "background.default" }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          component="h1"
          fontWeight="bold"
          sx={{ mb: 2 }}
        >
          Central de Aprovações
        </Typography>

        {/* As Abas */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs
            value={tabIndex}
            onChange={handleChange}
            aria-label="Abas de aprovação"
          >
            <Tab
              label="Retirada de Estoque"
              id="tab-retirada"
              aria-controls="panel-retirada"
            />
            <Tab
              label="Pedidos de Compra"
              id="tab-compra"
              aria-controls="panel-compra"
            />
          </Tabs>
        </Box>

        {/* Painel da Aba 1 (Retirada de Estoque) */}
        <Box
          role="tabpanel"
          hidden={tabIndex !== 0}
          id="panel-retirada"
          aria-labelledby="tab-retirada"
        >
          {tabIndex === 0 && ( // Renderiza só quando a aba está ativa
            <TabelaRequisicoes />
          )}
        </Box>

        {/* Painel da Aba 2 (Pedidos de Compra) */}
        <Box
          role="tabpanel"
          hidden={tabIndex !== 1}
          id="panel-compra"
          aria-labelledby="tab-compra"
        >
          {tabIndex === 1 && ( // Renderiza só quando a aba está ativa
            <TabelaPedidosCompra />
          )}
        </Box>
      </Container>
    </Box>
  );
}

export default AprovacoesPage;
