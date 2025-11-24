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
  Card,
  CardContent,
  useTheme,
} from "@mui/material";
import {
  Inventory,
  Security,
  Timeline,
  ShoppingCart,
} from "@mui/icons-material";
import ParticlesBackground from "../components/ParticlesBackground";

function LandingPage() {
  const theme = useTheme();

  const features = [
    {
      icon: <Inventory fontSize="large" color="primary" />,
      title: "Controle Total",
      desc: "Gerencie entradas, saídas e movimentações de estoque em tempo real.               ",
    },
    {
      icon: <ShoppingCart fontSize="large" color="primary" />,
      title: "Fluxo de Compras",
      desc: "Solicite materiais, aprove pedidos e confirme recebimentos em um fluxo unificado.",
    },
    {
      icon: <Timeline fontSize="large" color="primary" />,
      title: "Histórico Detalhado",
      desc: "Rastreabilidade completa de quem mexeu no quê e quando.                          ",
    },
    {
      icon: <Security fontSize="large" color="primary" />,
      title: "Segurança Avançada",
      desc: "Controle de acesso por níveis (Admin/Usuário) e recuperação de senha segura.",
    },
  ];

  return (
    <Box
      sx={{
        minWidth: "100vh",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* --- HEADER --- */}
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{ zIndex: 10 }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
            {/* Logo / Nome */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                component="img"
                src="/bot.svg"
                alt="Logo StockBot"
                sx={{
                  width: 40,
                  height: 40,
                  filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.2))",
                }}
              />
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{ color: "#fff", letterSpacing: 1 }}
              >
                StockBot
              </Typography>
            </Box>

            {/* Botões */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                sx={{
                  color: "#fff",
                  borderColor: "#fff",
                  "&:hover": { borderColor: "#C00000", color: "#C00000" },
                }}
              >
                Entrar
              </Button>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                sx={{
                  backgroundColor: "#C00000",
                  "&:hover": { backgroundColor: "#a40000" },
                }}
              >
                Criar Conta
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* --- HERO SECTION --- */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          position: "relative",
          color: "#fff",
          py: 8,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: -1,
          }}
        >
          <ParticlesBackground />
        </div>

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                fontWeight="800"
                sx={{
                  mb: 2,
                  background: "-webkit-linear-gradient(45deg, #fff, #ccc)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Gestão de Estoque Inteligente e Simples.
              </Typography>
              <Typography
                variant="h6"
                sx={{ mb: 4, opacity: 0.8, lineHeight: 1.6 }}
              >
                O StockBot moderniza o almoxarifado da sua escola ou empresa.
                Controle itens, aprove compras e acompanhe tudo em um só lugar.
              </Typography>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: "#C00000",
                  fontSize: "1.1rem",
                  px: 4,
                  py: 1.5,
                  "&:hover": { backgroundColor: "#a40000" },
                }}
              >
                Começar Agora Grátis
              </Button>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{ display: { xs: "none", md: "block" }, textAlign: "center" }}
            >
              {/* Espaço para imagem futura */}
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box sx={{ backgroundColor: "#f5f5f5", py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            fontWeight="bold"
            textAlign="center"
            sx={{ mb: 6, color: "#333" }}
          >
            Por que escolher o StockBot?
          </Typography>
          

          {/* 'alignItems="stretch"' garante que todos os itens do grid tenham a mesma altura */}
          <Grid container spacing={4} alignItems="stretch">
            {features.map((feature, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                key={index}
                sx={{ display: "flex" }}
              >
                <Card
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    textAlign: "center",
                    p: 2,
                    transition: "0.3s",
                    "&:hover": { transform: "translateY(-5px)", boxShadow: 6 },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* --- FOOTER --- */}
      <Box
        sx={{
          backgroundColor: "#000000ff",
          color: "#fff",
          py: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="body2" sx={{ opacity: 0.7 }}>
          © {new Date().getFullYear()} StockBot. Todos os direitos reservados.
        </Typography>
      </Box>
    </Box>
  );
}

export default LandingPage;
