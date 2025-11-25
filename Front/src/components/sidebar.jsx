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

  const drawerContent = (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="h5" component="h2" fontWeight="bold" color="white">
          StockBot
        </Typography>
      </Box>

      {/* MENU GERAL (Para todos) */}
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

        {/* Link Pedidos (Para todos) */}
        <ListItem disablePadding>
          <ListItemButton
            component={NavLink}
            to="/pedidos"
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
              <ShoppingCart size={20} />
            </ListItemIcon>
            <ListItemText primary="Pedido de Compra" />
          </ListItemButton>
        </ListItem>
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <List sx={{ p: 1, mt: "auto" }}>
        {/* Switch Modo Escuro */}
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

        {/* --- MENU ADMINISTRATIVO (Apenas Admin) --- */}
        {isUserAdmin && (
          <>
            {/* Aprovações */}
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

            {/* 2. Recebimento (NOVO) */}
            <ListItem disablePadding>
              <ListItemButton
                component={NavLink}
                to="/recebimento"
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
                  <PackageCheck size={20} />
                </ListItemIcon>
                <ListItemText primary="Recebimento" />
              </ListItemButton>
            </ListItem>

            {/* Configurações */}
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
          </>
        )}

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
            theme.palette.mode === "dark" ? "#000000ff" : "#000000ff",
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