// Em: src/pages/AprovacoesPage.jsx
import React, { useState } from "react";
import { Box, Container, Typography, Tab, Tabs } from "@mui/material";

//
// 1. CORRIJA SEUS IMPORTS AQUI
//
// ❌ (ERRADO) import TabelaRequisicoes from "../components/TableComponete";
// ❌ (ERRADO) import TabelaPedidosCompra from "../components/TabelaComponentePedido";

// ✅ (CERTO) Importe os componentes que TÊM os modais
import TabelaRequisicoes from "./requisicaopage"; // (Este é o que tem o modal de "motivo" para retirada)
import TabelaPedidosCompra from "../components/TabelaComponentePedido"; // (Este é o que tem o modal de "motivo" para compra)
//
// (O resto do arquivo não precisa mudar)
//

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
            <Tab label="Retirada de Estoque" id="tab-retirada" />
            <Tab label="Pedidos de Compra" id="tab-compra" />
          </Tabs>
        </Box>

        {/* Painel da Aba 1 (Retirada de Estoque) */}
        <Box role="tabpanel" hidden={tabIndex !== 0} id="panel-retirada">
          {tabIndex === 0 && (
            <TabelaRequisicoes /> // <-- Agora usa o componente certo
          )}
        </Box>

        {/* Painel da Aba 2 (Pedidos de Compra) */}
        <Box role="tabpanel" hidden={tabIndex !== 1} id="panel-compra">
          {tabIndex === 1 && (
            <TabelaPedidosCompra /> // <-- Agora usa o componente certo
          )}
        </Box>
      </Container>
    </Box>
  );
}

export default AprovacoesPage;
