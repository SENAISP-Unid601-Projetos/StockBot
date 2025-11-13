import React, { useState } from "react";
import { Box, Container, Typography, Tab, Tabs } from "@mui/material";

// Importa apenas a tabela de requisições (Retirada de Estoque)
import TabelaRequisicoes from "../components/TableComponente"; 
// NOTA: Verifique se o nome do arquivo importado acima corresponde exatamente ao que está na sua pasta components. 
// No contexto fornecido, o arquivo chamava-se "TableComponente.jsx".

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
            {/* ABA DE PEDIDOS REMOVIDA DAQUI */}
          </Tabs>
        </Box>

        {/* Painel da Aba 1 (Retirada de Estoque) */}
        <Box
          role="tabpanel"
          hidden={tabIndex !== 0}
          id="panel-retirada"
          aria-labelledby="tab-retirada"
        >
          {tabIndex === 0 && (
            <TabelaRequisicoes />
          )}
        </Box>
      </Container>
    </Box>
  );
}

export default AprovacoesPage;