import React from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EmailIcon from "@mui/icons-material/Email";
import ParticlesBackground from "../components/ParticlesBackground";

function LandingPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden", // Evita scroll horizontal indesejado
      }}
    >
      {/* --- FUNDO DE PARTÍCULAS --- */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
          backgroundColor: "#121212", // Fundo base escuro para as partículas
        }}
      >
        <ParticlesBackground />
      </Box>

      {/* --- NAVBAR / CABEÇALHO --- */}
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{ zIndex: 10, pt: 2 }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
            {/* Logo */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{ color: "#fff", letterSpacing: 1 }}
              >
                StockBot
              </Typography>
            </Box>

            {/* Botão Entrar */}
            <Button
              component={Link}
              to="/login"
              variant="contained"
              sx={{
                color: "#fff",
                borderColor: "rgba(255,255,255,0.5)",
                textTransform: "none",
                px: 3,
                "&:hover": {
                  borderColor: "#C00000",
                  color: "#ffffffff",
                  backgroundColor: "rgba(209, 20, 20, 0.66)",
                },
              }}
            >
              Entrar
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      {/* --- CONTEÚDO PRINCIPAL (HERO SECTION) --- */}
      <Container
        maxWidth="lg"
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          py: 8,
          zIndex: 1,
        }}
      >
        <Grid container spacing={6} alignItems="center">
          {/* LADO ESQUERDO: TEXTO E CTA */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="overline"
              sx={{
                color: "#2ecc71",
                fontWeight: "bold",
                letterSpacing: 2,
                fontSize: "0.9rem",
              }}
            >
              100% GRATUITO
            </Typography>

            <Typography
              variant="h2"
              fontWeight="500"
              sx={{
                mt: 1,
                mb: 3,
                color: "#fff",
                lineHeight: 1.1,
                fontSize: { xs: "2.5rem", md: "3.5rem" },
              }}
            >
              Controle seu estoque da forma{" "}
              <span style={{ color: "#C00000" }}>correta</span>
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: "rgba(255,255,255,0.8)",
                mb: 4,
                lineHeight: 1.6,
                fontWeight: 400,
              }}
            >
              O StockBot moderniza a gestão do seu estoque. Centralize o
              controle de todas as movimentações em uma única plataforma
              eficiente.
            </Typography>

            {/* LISTA DE BENEFÍCIOS (Estilo Hostinger) */}
            <List sx={{ mb: 4 }}>
              {[
                "Sistema totalmente gratuito",
                "Controle Total",
                "Fluxo de Compras",
                "Histórico Detalhado",
                "Segurança Avançada",
                "Painéis visuais intuitivos",
              ].map((text, index) => (
                <ListItem key={index} disableGutters sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 35 }}>
                    <CheckCircleIcon sx={{ color: "#2ecc71" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={text}
                    primaryTypographyProps={{
                      style: { color: "#fff", fontWeight: 500 },
                    }}
                  />
                </ListItem>
              ))}
            </List>

            {/* BOTÃO DE AÇÃO */}
            <Button
              component={Link}
              to="/register"
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "#C00000",
                color: "#fff",
                fontSize: "1.1rem",
                fontWeight: "bold",
                px: 5,
                py: 1.8,
                boxShadow: "0 10px 30px rgba(192, 0, 0, 0.3)",
                "&:hover": {
                  backgroundColor: "#a40000",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s",
              }}
            >
              Começar agora
            </Button>
          </Grid>

          {/* LADO DIREITO: VISUAL/MOCKUP */}
          <Grid item xs={12} md={6}>
            {/* Simulação da Interface do Sistema (Mockup CSS) */}
            <Box
              sx={{
                position: "relative",
                perspective: "1000px",
              }}
            ></Box>
          </Grid>
        </Grid>
      </Container>

      {/* --- RODAPÉ SIMPLES --- */}
      <Box
        sx={{
          backgroundColor: "rgba(0,0,0,0.8)",
          py: 4,
          borderTop: "1px solid rgba(255,255,255,0.1)",
          zIndex: 2,
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)" }}>
              © {new Date().getFullYear()} StockBot. Todos os direitos
              reservados.
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "#fff",
              }}
            >
              <EmailIcon fontSize="small" sx={{ color: "#C00000" }} />
              <Typography
                variant="body2"
                component="a"
                href="mailto:stockbotdevstest@gmail.com"
                sx={{
                  color: "#fff",
                  textDecoration: "none",
                  "&:hover": { color: "#C00000" },
                }}
              >
                stockbotdevstest@gmail.com
              </Typography>
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* CSS para animação de flutuação */}
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
            100% { transform: translateY(0px); }
          }
        `}
      </style>
    </Box>
  );
}

export default LandingPage;
