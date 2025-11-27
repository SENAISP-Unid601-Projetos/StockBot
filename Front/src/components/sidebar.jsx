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
  FormControlLabel,
} from "@mui/material";
import {
  LayoutDashboard,
  Wrench,
  History,
  ArchiveRestore,
  Settings,
  LogOut,
  Moon,
  Sun,
  CheckSquare,
  ShoppingCart,
  PackageCheck,
  Users,
  CircleHelp,
} from "lucide-react";

import { isAdmin } from "../services/authService";
import { useColorMode } from "../useColorMode.js";

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
  const { toggleColorMode } = useColorMode();
  const [isUserAdmin, setIsUserAdmin] = useState(false);

  useEffect(() => {
    setIsUserAdmin(isAdmin());
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt-token");
    navigate("/login");
  };

  const isDarkMode = theme.palette.mode === "dark";

  const listItemSx = {
    color: "#FFFFFF",
    borderRadius: 2,
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
    "&.active": {
      backgroundColor: "primary.main",
      color: "#FFFFFF",
      fontWeight: "bold",
      ".MuiListItemIcon-root": {
        color: "#FFFFFF",
      },
    },
  };

  const iconSx = {
    color: "#FFFFFF",
    minWidth: 40,
  };

  const drawerContent = (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography
          variant="h5"
          component="h2"
          fontWeight="bold"
          color="#FFFFFF"
        >
          StockBot
        </Typography>
      </Box>

      {/* --- MENU SUPERIOR (Conteúdo Principal) --- */}
      <List sx={{ p: 1 }}>
        {/* Itens Padrão (Dashboard, Componentes, etc.) */}
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={NavLink} to={item.path} sx={listItemSx}>
              <ListItemIcon sx={iconSx}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}

        <ListItem disablePadding>
          <ListItemButton component={NavLink} to="/pedidos" sx={listItemSx}>
            <ListItemIcon sx={iconSx}>
              <ShoppingCart size={20} />
            </ListItemIcon>
            <ListItemText primary="Pedido de Compra" />
          </ListItemButton>
        </ListItem>

        {/* --- 1. ITENS DE ADMIN --- */}
        {isUserAdmin && (
          <>
            <ListItem disablePadding>
              <ListItemButton
                component={NavLink}
                to="/aprovacoes"
                sx={listItemSx}
              >
                <ListItemIcon sx={iconSx}>
                  <CheckSquare size={20} />
                </ListItemIcon>
                <ListItemText primary="Aprovações" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                component={NavLink}
                to="/recebimento"
                sx={listItemSx}
              >
                <ListItemIcon sx={iconSx}>
                  <PackageCheck size={20} />
                </ListItemIcon>
                <ListItemText primary="Recebimento" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                component={NavLink}
                to="/usuarios"
                sx={listItemSx}
              >
                <ListItemIcon sx={iconSx}>
                  <Users size={20} />
                </ListItemIcon>
                <ListItemText primary="Usuários" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>

      {/* --- Espaçador (Empurra o restante para o fundo) --- */}
      <Box sx={{ flexGrow: 1 }} />

      {/* --- MENU INFERIOR (Configurações e Sistema) --- */}
      <List sx={{ p: 1, mt: "auto" }}>
        {/* 2. MODO ESCURO */}
        <ListItem sx={{ color: "#FFFFFF" }}>
          <ListItemIcon sx={iconSx}>
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </ListItemIcon>
          <FormControlLabel
            control={
              <Switch
                checked={isDarkMode}
                onChange={toggleColorMode}
                color="primary"
                sx={{
                  // Estado DESLIGADO (Modo Claro): Barra Cinza
                  "& .MuiSwitch-track": {
                    backgroundColor: "#808080",
                    opacity: 0.7,
                  },
                  // Estado LIGADO (Modo Escuro): Barra Vermelha
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: "#C00000", // Vermelho Senai
                    opacity: 1, // Opacidade 100% para ficar bem vivo
                  },
                }}
              />
            }
            label="Modo Escuro"
            sx={{ m: 0, flexGrow: 1 }}
          />
        </ListItem>

        {/* 3. CONFIGURAÇÕES */}
        <ListItem disablePadding>
          <ListItemButton
            component={NavLink}
            to="/configuracoes"
            sx={listItemSx}
          >
            <ListItemIcon sx={iconSx}>
              <Settings size={20} />
            </ListItemIcon>
            <ListItemText primary="Configurações" />
          </ListItemButton>
        </ListItem>

        {/* 4. AJUDA */}
        <ListItem disablePadding>
          <ListItemButton component={NavLink} to="/ajuda" sx={listItemSx}>
            <ListItemIcon sx={iconSx}>
              <CircleHelp size={20} />
            </ListItemIcon>
            <ListItemText primary="Ajuda" />
          </ListItemButton>
        </ListItem>

        {/* 5. SAIR */}
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              color: "#FFFFFF",
              borderRadius: 2,
              "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
            }}
          >
            <ListItemIcon sx={iconSx}>
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
          backgroundColor: "#000000",
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
