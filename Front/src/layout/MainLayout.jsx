import { Outlet } from "react-router-dom";
import {
  Box,
  AppBar,
  Toolbar,
  CssBaseline,
  IconButton,
  Avatar,
  Typography,
  Tooltip, // Adicionei Tooltip para ficar mais bonito
} from "@mui/material";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../contexts/AuthContext";
import LogoutIcon from "@mui/icons-material/Logout";

const drawerWidth = 250;

// Lógica para montar a URL da foto (igual usamos nas outras páginas)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
const SERVER_URL = API_URL.endsWith("/api") ? API_URL.slice(0, -4) : API_URL;
const FOTOS_URL_BASE = `${SERVER_URL}/user-photos/`;

function MainLayout() {
  const { user, logout } = useAuth();

  // REMOVIDO: const [anchorEl, setAnchorEl] ...
  // Não precisamos disso pois o botão de sair é direto, sem menu dropdown.

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* 1. HEADER (AppBar) */}
      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          backgroundColor: "background.paper",
          color: "text.primary",
          borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
        }}
      >
        <Toolbar>
          <Box sx={{ flexGrow: 1 }} />

          {/* Área do Usuário no Topo */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Texto (Nome e Empresa) - Some em telas muito pequenas */}
            <Box
              sx={{ textAlign: "right", display: { xs: "none", sm: "block" } }}
            >
              <Typography variant="body2" fontWeight="bold">
                {user?.nome || "Usuário"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.dominio ? `@${user.dominio}` : "Empresa"}
              </Typography>
            </Box>

            {/* Avatar */}
            <Avatar
              sx={{ bgcolor: "primary.main", width: 40, height: 40 }}
              src={
                user?.caminhoFotoPerfil
                  ? `${FOTOS_URL_BASE}${user.caminhoFotoPerfil}`
                  : undefined
              }
              alt={user?.nome}
            >
              {user?.nome?.charAt(0).toUpperCase()}
            </Avatar>

            {/* Botão Sair */}
            <Tooltip title="Sair do sistema">
              <IconButton onClick={logout} color="error">
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* 2. SIDEBAR */}
      <Sidebar />

      {/* 3. CONTEÚDO DA PÁGINA */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${drawerWidth}px)`,
          backgroundColor: "background.default",
          minHeight: "100vh",
        }}
      >
        <Toolbar /> {/* Espaço para o conteúdo não ficar atrás do Header */}
        <Outlet /> {/* AQUI É ONDE AS PÁGINAS ENTRAM */}
      </Box>
    </Box>
  );
}

export default MainLayout;
