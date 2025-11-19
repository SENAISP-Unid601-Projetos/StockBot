// Em: src/components/Sidebar.jsx
import React from "react"; // Import React
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { NavLink } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
} from "@mui/material";
import {
  LayoutDashboard,
  Wrench,
  History,
  ArchiveRestore,
  Settings,
  LogOut,
} from "lucide-react";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket"; // ✅ Novo Ícone
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { isAdmin } from "../services/authService";

const drawerWidth = 250;

function Sidebar() {
  const isAdminUser = isAdmin();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar>
        <Typography variant="h6" component="h2" sx={{ fontWeight: "bold" }}>
          StockBot
        </Typography>
      </Toolbar>
      <Divider />

      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <List>
          {/* Dashboard, Componentes, Historico, Reposição (iguais aos seus) */}
          <ListItemButton
            component={NavLink}
            to="/"
            end
            sx={{ "&.active": { backgroundColor: "action.selected" } }}
          >
            <ListItemIcon>
              <LayoutDashboard size={20} />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
          <ListItemButton
            component={NavLink}
            to="/componentes"
            sx={{ "&.active": { backgroundColor: "action.selected" } }}
          >
            <ListItemIcon>
              <Wrench size={20} />
            </ListItemIcon>
            <ListItemText primary="Componentes" />
          </ListItemButton>
          <ListItemButton
            component={NavLink}
            to="/historico"
            sx={{ "&.active": { backgroundColor: "action.selected" } }}
          >
            <ListItemIcon>
              <History size={20} />
            </ListItemIcon>
            <ListItemText primary="Histórico" />
          </ListItemButton>
          <ListItemButton
            component={NavLink}
            to="/reposicao"
            sx={{ "&.active": { backgroundColor: "action.selected" } }}
          >
            <ListItemIcon>
              <ArchiveRestore size={20} />
            </ListItemIcon>
            <ListItemText primary="Reposição" />
          </ListItemButton>

          {/* ✅ NOVO LINK (para TODOS os usuários) */}
          <ListItemButton
            component={NavLink}
            to="/pedidos"
            sx={{ "&.active": { backgroundColor: "action.selected" } }}
          >
            <ListItemIcon>
              <ShoppingBasketIcon />
            </ListItemIcon>
            <ListItemText primary="Fazer Pedido de Compra" />
          </ListItemButton>
        </List>

        <Box sx={{ flexGrow: 1 }} />

        <List>
          <Divider />

          {/* ✅ LINK DE REQUISIÇÕES RENOMEADO (só para Admin) */}
          {isAdminUser && (
            <ListItemButton
              component={NavLink}
              to="/aprovacoes"
              sx={{ "&.active": { backgroundColor: "action.selected" } }}
            >
              <ListItemIcon>
                <AssignmentIcon />
              </ListItemIcon>
              <ListItemText primary="Aprovações" />
            </ListItemButton>
          )}

          {/* Gerenciar Usuários (só Admin), Configurações, Ajuda (iguais aos seus) */}
          {isAdminUser && (
            <ListItemButton
              component={NavLink}
              to="/gerenciar-usuarios"
              sx={{ "&.active": { backgroundColor: "action.selected" } }}
            >
              <ListItemIcon>
                <AdminPanelSettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Gerenciar Usuários" />
            </ListItemButton>
          )}
          <ListItemButton
            component={NavLink}
            to="/configuracoes"
            sx={{ "&.active": { backgroundColor: "action.selected" } }}
          >
            <ListItemIcon>
              <Settings size={20} />
            </ListItemIcon>
            <ListItemText primary="Configurações" />
          </ListItemButton>
          <ListItemButton
            component={NavLink}
            to="/ajuda"
            sx={{ "&.active": { backgroundColor: "action.selected" } }}
          >
            <ListItemIcon>
              <HelpOutlineIcon />
            </ListItemIcon>
            <ListItemText primary="Ajuda" />
          </ListItemButton>

          {/* O botão Sair não fica mais aqui, está no ProfileMenu */}
        </List>
      </Box>
    </Drawer>
  );
}

export default Sidebar;
