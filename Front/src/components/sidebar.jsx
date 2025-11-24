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
  PackageCheck, // <-- 1. NOVO ÍCONE PARA RECEBIMENTO
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
  const theme = useTheme(); // O tema agora contém as cores da sidebar
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

  const drawerContent = (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography
          variant="h5"
          component="h2"
          fontWeight="bold"
          // Usa a cor de texto ativa definida no tema da sidebar
          color={theme.palette.sidebar.textActive}
        >
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
                // --- CORES CONECTADAS AO TEMA ---
                color: theme.palette.sidebar.text,
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: theme.palette.sidebar.hover,
                },
                "&.active": {
                  backgroundColor: "primary.main",
                  color: theme.palette.sidebar.textActive,
                  fontWeight: "bold",
                  ".MuiListItemIcon-root": {
                    color: theme.palette.sidebar.textActive,
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  // Cor do ícone vinda do tema
                  color: theme.palette.sidebar.icon,
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}

      <ListItem disablePadding>
        <ListItemButton
          component={NavLink}
          to="/pedidos"
          sx={{
            color: theme.palette.sidebar.text,
            borderRadius: 2,
            "&:hover": { backgroundColor: theme.palette.sidebar.hover },
            "&.active": {
              backgroundColor: "primary.main",
              color: theme.palette.sidebar.textActive,
              ".MuiListItemIcon-root": {
                color: theme.palette.sidebar.textActive,
              },
            },
          }}
        >
          <ListItemIcon
            sx={{ color: theme.palette.sidebar.icon, minWidth: 40 }}
          >
            <ShoppingCart size={20} />
          </ListItemIcon>
          <ListItemText primary="Fazer Pedido de Compra" />
        </ListItemButton>
      </ListItem>

      <Box sx={{ flexGrow: 1 }} />

      <List sx={{ p: 1, mt: "auto" }}>
        <ListItem sx={{ color: theme.palette.sidebar.text }}>
          <ListItemIcon
            sx={{ color: theme.palette.sidebar.icon, minWidth: 40 }}
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

        <>
          <ListItem disablePadding>
            <ListItemButton
              component={NavLink}
              to="/aprovacoes"
              sx={{
                color: theme.palette.sidebar.text,
                borderRadius: 2,
                "&:hover": { backgroundColor: theme.palette.sidebar.hover },
                "&.active": {
                  backgroundColor: "primary.main",
                  color: theme.palette.sidebar.textActive,
                  ".MuiListItemIcon-root": {
                    color: theme.palette.sidebar.textActive,
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{ color: theme.palette.sidebar.icon, minWidth: 40 }}
              >
                <CheckSquare size={20} />
              </ListItemIcon>
              <ListItemText primary="Aprovações" />
            </ListItemButton>
          </ListItem>

          {isUserAdmin && (
            <ListItem disablePadding>
              <ListItemButton
                component={NavLink}
                to="/configuracoes"
                sx={{
                  color: theme.palette.sidebar.text,
                  borderRadius: 2,
                  "&:hover": { backgroundColor: theme.palette.sidebar.hover },
                  "&.active": {
                    backgroundColor: "primary.main",
                    color: theme.palette.sidebar.textActive,
                    ".MuiListItemIcon-root": {
                      color: theme.palette.sidebar.textActive,
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{ color: theme.palette.sidebar.icon, minWidth: 40 }}
                >
                  <Settings size={20} />
                </ListItemIcon>
                <ListItemText primary="Configurações" />
              </ListItemButton>
            </ListItem>
          )}
        </>

        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              color: theme.palette.sidebar.text,
              borderRadius: 2,
              "&:hover": { backgroundColor: theme.palette.sidebar.hover },
            }}
          >
            <ListItemIcon
              sx={{ color: theme.palette.sidebar.icon, minWidth: 40 }}
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
          // --- CONEXÃO PRINCIPAL DO FUNDO DA SIDEBAR ---
          backgroundColor: theme.palette.sidebar.background,
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