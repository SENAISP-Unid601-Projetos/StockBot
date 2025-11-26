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

import { isAdmin } from "../services/authService";

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
        {/* Cabeçalho */}

        <Paper
          elevation={0}
          sx={{
            p: 4,

            mb: 4,

            backgroundColor: "primary.main",

            color: "#fff",

            borderRadius: 2,
          }}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <HelpOutline sx={{ fontSize: 40 }} />

            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold">
                Central de Ajuda
              </Typography>

              <Typography variant="subtitle1">
                {isUserAdmin
                  ? "Guia completo de Administração do Sistema."
                  : "Guia rápido para colaboradores."}
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Typography
          variant="h6"
          gutterBottom
          sx={{ mt: 2, color: "text.secondary" }}
        >
          Funcionalidades Gerais
        </Typography>

        {/* 1. Dashboard (Para TODOS) */}

        <Accordion sx={{ mb: 1 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box display="flex" alignItems="center" gap={2}>
              <Dashboard color="primary" />

              <Typography variant="h6" fontWeight="bold">
                Dashboard
              </Typography>
            </Box>
          </AccordionSummary>

          <AccordionDetails>
            <Typography>
              A tela inicial mostra um resumo do estoque:
              <ul>
                <li>Total de itens cadastrados.</li>

                <li>
                  Alertas de <strong>Estoque Baixo</strong> ou em Falta.
                </li>

                <li>Resumo de suas solicitações pendentes.</li>
              </ul>
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* 2. Componentes (Para TODOS) */}

        <Accordion sx={{ mb: 1 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box display="flex" alignItems="center" gap={2}>
              <Build color="primary" />

              <Typography variant="h6" fontWeight="bold">
                Estoque e Itens
              </Typography>
            </Box>
          </AccordionSummary>

          <AccordionDetails>
            <Typography component="div">
              Na aba <strong>Componentes</strong>, você pode visualizar todo o
              inventário.
              <ul>
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

        {/* 3. SEÇÃO EXCLUSIVA DE ADMIN */}

        {isUserAdmin && (
          <>
            <Divider sx={{ my: 4 }}>
              <Chip
                label="ÁREA ADMINISTRATIVA"
                color="error"
                variant="outlined"
              />
            </Divider>

            <Accordion sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box display="flex" alignItems="center" gap={2}>
                  <FactCheck color="error" />

                  <Typography variant="h6" fontWeight="bold">
                    Aprovações
                  </Typography>
                </Box>
              </AccordionSummary>

              <AccordionDetails>
                <Typography>
                  Gerencie os pedidos de compra e requisições internas. Você
                  pode <strong>Aprovar</strong> ou <strong>Recusar</strong>{" "}
                  solicitações feitas pelos colaboradores.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box display="flex" alignItems="center" gap={2}>
                  <AssignmentTurnedIn color="error" />

                  <Typography variant="h6" fontWeight="bold">
                    Recebimento
                  </Typography>
                </Box>
              </AccordionSummary>

              <AccordionDetails>
                <Typography>
                  Utilize esta tela quando chegarem novos materiais físicos. Ao
                  confirmar um recebimento, o estoque do item aumenta
                  automaticamente.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box display="flex" alignItems="center" gap={2}>
                  <People color="error" />

                  <Typography variant="h6" fontWeight="bold">
                    Gestão de Usuários
                  </Typography>
                </Box>
              </AccordionSummary>

              <AccordionDetails>
                <Typography>
                  Cadastre novos colaboradores, remova acessos antigos e defina
                  quem tem permissão de Administrador.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </>
        )}

        <Divider sx={{ my: 4 }} />

        {/* 4. Configurações (Texto Dinâmico) */}

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box display="flex" alignItems="center" gap={2}>
              <Settings color="action" />

              <Typography variant="h6" fontWeight="bold">
                Configurações
              </Typography>
            </Box>
          </AccordionSummary>

          <AccordionDetails>
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
