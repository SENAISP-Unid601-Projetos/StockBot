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

  // Estilo comum para os itens do menu (para evitar repetição e garantir cor branca)
  const listItemSx = {
    color: "#FFFFFF", // Texto sempre branco
    borderRadius: 2,
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.1)", // Hover sutil claro
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

  // Estilo comum para ícones
  const iconSx = {
    color: "#FFFFFF", // Ícone sempre branco
    minWidth: 40,
  };

  const drawerContent = (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography
          variant="h5"
          component="h2"
          fontWeight="bold"
          color="#FFFFFF" // Título branco
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
              sx={listItemSx}
            >
              <ListItemIcon sx={iconSx}>
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
            sx={listItemSx}
          >
            <ListItemIcon sx={iconSx}>
              <ShoppingCart size={20} />
            </ListItemIcon>
            <ListItemText primary="Pedido de Compra" />
          </ListItemButton>
        </ListItem>
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <List sx={{ p: 1, mt: "auto" }}>
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
              />
            }
            label="Modo Escuro"
            sx={{ m: 0, flexGrow: 1 }}
          />
        </ListItem>

      <>
        {/* Item de Aprovações */}
        <ListItem disablePadding>
          <ListItemButton component={NavLink} to="/aprovacoes" sx={listItemSx}>
            <ListItemIcon sx={iconSx}>
              <CheckSquare size={20} />
            </ListItemIcon>
            <ListItemText primary="Aprovações" />
          </ListItemButton>
        </ListItem>

        {/* --- BLOCO DE ADMINISTRAÇÃO --- */}
        {isUserAdmin && (
          <>
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

            {/* Item de Configurações */}
            <ListItem disablePadding>
              <ListItemButton component={NavLink} to="/configuracoes" sx={listItemSx}>
                <ListItemIcon sx={iconSx}>
                  <Settings size={20} />
                </ListItemIcon>
                <ListItemText primary="Configurações" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </>


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
          // --- FUNDO FORÇADO PARA PRETO ---
          backgroundColor: "#000000", 
          borderRight: "none", // Remove borda se desejar visual clean
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