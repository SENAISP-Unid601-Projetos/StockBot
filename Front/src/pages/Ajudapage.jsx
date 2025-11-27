import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Chip,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  HelpOutline,
  Dashboard,
  Build,
  Settings,
  FactCheck,
  AssignmentTurnedIn,
  People,
} from "@mui/icons-material";

// Importa a lógica de segurança
import { isAdmin } from "../services/authService"; //

function AjudaPage() {
  const [isUserAdmin, setIsUserAdmin] = useState(false);

  useEffect(() => {
    // Verifica se é admin ao carregar a página
    setIsUserAdmin(isAdmin());
  }, []);

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        backgroundColor: "background.default",
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="md">
        {/* --- 1. CABEÇALHO CENTRALIZADO --- */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            backgroundColor: "primary.main",
            color: "#fff",
            borderRadius: 2,
            // Layout em coluna para centralizar ícone e texto
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          {/* Ícone maior e com margem inferior */}
          <HelpOutline sx={{ fontSize: 60, mb: 2 }} />

          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              Central de Ajuda
            </Typography>

            <Typography variant="subtitle1">
              {isUserAdmin
                ? "Guia completo de Administração do Sistema."
                : "Guia rápido para colaboradores."}
            </Typography>
          </Box>
        </Paper>

        {/* Título da Seção Centralizado */}
        <Typography
          variant="h6"
          gutterBottom
          align="center"
          sx={{ mt: 2, mb: 3, color: "text.secondary", fontWeight: "bold" }}
        >
          Funcionalidades Gerais
        </Typography>

        {/* --- 2. ACORDEÕES (DASHBOARD) --- */}
        <Accordion sx={{ mb: 1 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            {/* Centraliza o conteúdo do título na barra */}
            <Box
              display="flex"
              alignItems="center"
              gap={2}
              sx={{ width: "100%", justifyContent: "center" }}
            >
              <Dashboard color="primary" />
              <Typography variant="h6" fontWeight="bold">
                Dashboard
              </Typography>
            </Box>
          </AccordionSummary>

          {/* Conteúdo centralizado com ajuste na lista */}
          <AccordionDetails sx={{ textAlign: "center" }}>
            <Typography component="div">
              A tela inicial mostra um resumo do estoque:
              <ul style={{ listStylePosition: "inside", paddingLeft: 0, marginTop: '10px' }}>
                <li>Total de itens cadastrados.</li>
                <li>
                  Alertas de <strong>Estoque Baixo</strong> ou em Falta.
                </li>
                <li>Resumo de suas solicitações pendentes.</li>
              </ul>
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* --- 3. ACORDEÕES (ESTOQUE E ITENS) --- */}
        <Accordion sx={{ mb: 1 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box
              display="flex"
              alignItems="center"
              gap={2}
              sx={{ width: "100%", justifyContent: "center" }}
            >
              <Build color="primary" />
              <Typography variant="h6" fontWeight="bold">
                Estoque e Itens
              </Typography>
            </Box>
          </AccordionSummary>

          <AccordionDetails sx={{ textAlign: "center" }}>
            <Typography component="div">
              Na aba <strong>Componentes</strong>, você pode visualizar todo o
              inventário.
              <ul style={{ listStylePosition: "inside", paddingLeft: 0, marginTop: '10px' }}>
                <li>
                  Use a barra de pesquisa para encontrar itens por nome ou
                  patrimônio.
                </li>

                {isUserAdmin ? (
                  <li>
                    <strong>Como Admin:</strong> Você pode Adicionar, Editar e
                    Excluir itens do sistema.
                  </li>
                ) : (
                  <li>
                    <strong>Como Usuário:</strong> Você pode visualizar detalhes
                    e solicitar itens ao almoxarifado.
                  </li>
                )}
              </ul>
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* --- 4. SEÇÃO EXCLUSIVA DE ADMIN --- */}
        {isUserAdmin && (
          <>
            <Divider sx={{ my: 4 }}>
              <Chip
                label="ÁREA ADMINISTRATIVA"
                color="error"
                variant="outlined"
                sx={{ fontWeight: "bold" }}
              />
            </Divider>

            {/* Aprovações */}
            <Accordion sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box
                  display="flex"
                  alignItems="center"
                  gap={2}
                  sx={{ width: "100%", justifyContent: "center" }}
                >
                  <FactCheck color="error" />
                  <Typography variant="h6" fontWeight="bold">
                    Aprovações
                  </Typography>
                </Box>
              </AccordionSummary>

              <AccordionDetails sx={{ textAlign: "center" }}>
                <Typography>
                  Gerencie os pedidos de compra e requisições internas. Você
                  pode <strong>Aprovar</strong> ou <strong>Recusar</strong>{" "}
                  solicitações feitas pelos colaboradores.
                </Typography>
              </AccordionDetails>
            </Accordion>

            {/* Recebimento */}
            <Accordion sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box
                  display="flex"
                  alignItems="center"
                  gap={2}
                  sx={{ width: "100%", justifyContent: "center" }}
                >
                  <AssignmentTurnedIn color="error" />
                  <Typography variant="h6" fontWeight="bold">
                    Recebimento
                  </Typography>
                </Box>
              </AccordionSummary>

              <AccordionDetails sx={{ textAlign: "center" }}>
                <Typography>
                  Utilize esta tela quando chegarem novos materiais físicos. Ao
                  confirmar um recebimento, o estoque do item aumenta
                  automaticamente.
                </Typography>
              </AccordionDetails>
            </Accordion>

            {/* Gestão de Usuários */}
            <Accordion sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box
                  display="flex"
                  alignItems="center"
                  gap={2}
                  sx={{ width: "100%", justifyContent: "center" }}
                >
                  <People color="error" />
                  <Typography variant="h6" fontWeight="bold">
                    Gestão de Usuários
                  </Typography>
                </Box>
              </AccordionSummary>

              <AccordionDetails sx={{ textAlign: "center" }}>
                <Typography>
                  Cadastre novos colaboradores, remova acessos antigos e defina
                  quem tem permissão de Administrador.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </>
        )}

        <Divider sx={{ my: 4 }} />

        {/* --- 5. CONFIGURAÇÕES --- */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box
              display="flex"
              alignItems="center"
              gap={2}
              sx={{ width: "100%", justifyContent: "center" }}
            >
              <Settings color="action" />
              <Typography variant="h6" fontWeight="bold">
                Configurações
              </Typography>
            </Box>
          </AccordionSummary>

          <AccordionDetails sx={{ textAlign: "center" }}>
            <Typography>
              Aqui você pode alterar sua senha de acesso e alternar o tema
              (Claro/Escuro).
              {isUserAdmin && (
                <>
                  <br />
                  <br />
                  <strong>Apenas Admin:</strong> Você também pode definir o
                  nível global de alerta para estoque baixo (ex: avisar quando
                  tiver menos de 5 itens).
                </>
              )}
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Container>
    </Box>
  );
}

export default AjudaPage;