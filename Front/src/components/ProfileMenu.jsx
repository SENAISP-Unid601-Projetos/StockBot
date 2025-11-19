// Em src/components/ProfileMenu.jsx (VERSÃO FINAL CORRIGIDA)
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Skeleton,
} from "@mui/material";

// ✅ CORREÇÃO: Usa a URL do Back-end (Render) em vez de localhost
// Pega a URL da API (ex: https://.../api) e remove o /api do final para achar a pasta de fotos
const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:8080/api"
).replace("/api", "");
const FOTOS_URL_BASE = `${API_BASE_URL}/user-photos/`;

function ProfileMenu() {
  // Lê os dados do localStorage (Rápido e sem API)
  const [user] = useState(() => {
    const data = localStorage.getItem("user-data");
    try {
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error("Falha ao ler 'user-data' do localStorage", e);
      return null;
    }
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem("jwt-token");
    localStorage.removeItem("user-data");
    navigate("/login");
    window.location.reload();
  };

  if (!user) {
    return <Skeleton variant="circular" width={40} height={40} />;
  }

  // Define a fonte da imagem (agora com a URL correta do Render)
  const avatarSrc = user.caminhoFotoPerfil
    ? `${FOTOS_URL_BASE}${user.caminhoFotoPerfil}`
    : "";

  return (
    <Box>
      <IconButton onClick={handleClick} size="small">
        <Avatar
          src={avatarSrc}
          sx={{ width: 40, height: 40, bgcolor: "primary.main" }}
        >
          {user.nome ? user.nome[0].toUpperCase() : "?"}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="body1" fontWeight="bold">
            {user.nome}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user.email}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Domínio: <strong>{user.dominio}</strong>
          </Typography>
        </Box>
        <MenuItem onClick={handleLogout}>Sair</MenuItem>
      </Menu>
    </Box>
  );
}

export default ProfileMenu;
