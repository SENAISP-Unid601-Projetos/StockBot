import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
  Switch,
  FormControlLabel, // <-- 1. Importar Switch e FormControlLabel
} from "@mui/material";
import {
  LayoutDashboard,
  Wrench,
  History,
  ArchiveRestore,
  Settings,
  LogOut,
  Moon,
  Sun, // <-- 2. Importar Ícones de Tema
  CheckSquare,
} from "lucide-react";

import { isAdmin } from "../services/authService";
import { useColorMode } from "../useColorMode.js"; // <-- 3. Importar o hook do tema

const menuItems = [
  { text: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/" },
  { text: "Componentes", icon: <Wrench size={20} />, path: "/componentes" },
  { text: "Histórico", icon: <History size={20} />, path: "/historico" },
  { text: "Reposição", icon: <ArchiveRestore size={20} />, path: "/reposicao" },
];

const drawerWidth = 250;

function Sidebar() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { toggleColorMode } = useColorMode(); // <-- 4. Usar o hook
  const [isUserAdmin, setIsUserAdmin] = useState(false);

  useEffect(() => {
    setIsUserAdmin(isAdmin());
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt-token");
    navigate("/login");
  };

  // Define o estado do switch com base no tema atual
  const isDarkMode = theme.palette.mode === "dark";

  const drawerContent = (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="h5" component="h2" fontWeight="bold" color="white">
          StockBot
        </Typography>
      </Box>

      <List sx={{ p: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={NavLink}
              to={item.path}
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                borderRadius: 2,
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.08)" },
                "&.active": {
                  backgroundColor: "primary.main",
                  color: "white",
                  fontWeight: "bold",
                  ".MuiListItemIcon-root": { color: "white" },
                },
              }}
            >
              <ListItemIcon
                sx={{ color: "rgba(255, 255, 255, 0.7)", minWidth: 40 }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <List sx={{ p: 1, mt: "auto" }}>
        {/* 5. SWITCH DO MODO ESCURO MOVIDO PARA AQUI */}
        <ListItem sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
          <ListItemIcon
            sx={{ color: "rgba(255, 255, 255, 0.7)", minWidth: 40 }}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </ListItemIcon>
          <FormControlLabel
            control={
              <Switch
                checked={isDarkMode}
                onChange={toggleColorMode}
                color="primary"
              />
            }
            label="Modo Escuro"
            sx={{ m: 0, flexGrow: 1 }}
          />
        </ListItem>

        <> {/* <-- 2. Adicione um fragmento para agrupar os links de admin */}
            
            {/* 3. ADICIONE ESTE BLOCO NOVO PARA "APROVAÇÕES" */}
            <ListItem disablePadding>
              <ListItemButton
                component={NavLink}
                to="/aprovacoes"
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  borderRadius: 2,
                  "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.08)" },
                  "&.active": {
                    backgroundColor: "primary.main",
                    color: "white",
                    ".MuiListItemIcon-root": { color: "white" },
                  },
                }}
              >
                <ListItemIcon
                  sx={{ color: "rgba(255, 255, 255, 0.7)", minWidth: 40 }}
                >
                  <CheckSquare size={20} />
                </ListItemIcon>
                <ListItemText primary="Aprovações" />
              </ListItemButton>
            </ListItem>

        {/* Link de Configurações (só para ADMIN) */}
        {isUserAdmin && (
          <ListItem disablePadding>
            <ListItemButton
              component={NavLink}
              to="/configuracoes"
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                borderRadius: 2,
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.08)" },
                "&.active": {
                  backgroundColor: "primary.main",
                  color: "white",
                  ".MuiListItemIcon-root": { color: "white" },
                },
              }}
            >
              <ListItemIcon
                sx={{ color: "rgba(255, 255, 255, 0.7)", minWidth: 40 }}
              >
                <Settings size={20} />
              </ListItemIcon>
              <ListItemText primary="Configurações" />
            </ListItemButton>
          </ListItem>
        )}
      </> {/* <-- 4. Feche o fragmento */}

        {/* Botão Sair */}
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              borderRadius: 2,
              "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.08)" },
            }}
          >
            <ListItemIcon
              sx={{ color: "rgba(255, 255, 255, 0.7)", minWidth: 40 }}
            >
              <LogOut size={20} />
            </ListItemIcon>
            <ListItemText primary="Sair" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor:
            theme.palette.mode === "dark" ? "#1e1e1e" : "#1A2E44",
          borderRight: "none",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}

export default Sidebar;
