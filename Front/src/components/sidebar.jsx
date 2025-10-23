import { NavLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme
} from '@mui/material';
import {
  LayoutDashboard,
  Wrench,
  History,
  ArchiveRestore,
  Settings,
  LogOut
} from 'lucide-react';

const menuItems = [
  { text: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
  { text: 'Componentes', icon: <Wrench size={20} />, path: '/componentes' },
  { text: 'Histórico', icon: <History size={20} />, path: '/historico' },
  { text: 'Reposição', icon: <ArchiveRestore size={20} />, path: '/reposicao' },
];

const drawerWidth = 250;

function Sidebar() {
  const navigate = useNavigate();
  const theme = useTheme(); // Acessa o tema atual do MUI

  const handleLogout = () => {
    localStorage.removeItem('jwt-token');
    navigate('/login');
  };

  const drawerContent = (
    <div>
      <Box sx={{ p: 2, textAlign: 'center' }}>
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
                color: 'rgba(255, 255, 255, 0.7)',
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                },
                '&.active': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  fontWeight: 'bold',
                  '.MuiListItemIcon-root': {
                    color: 'white',
                  }
                }
              }}
            >
              <ListItemIcon sx={{ color: 'rgba(255, 255, 255, 0.7)', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <List sx={{ p: 1, mt: 'auto' }}>
        <ListItem disablePadding>
          <ListItemButton
            component={NavLink}
            to="/configuracoes"
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              borderRadius: 2,
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' },
              '&.active': {
                backgroundColor: 'primary.main',
                color: 'white',
                '.MuiListItemIcon-root': { color: 'white' }
              }
            }}
          >
            <ListItemIcon sx={{ color: 'rgba(255, 255, 255, 0.7)', minWidth: 40 }}>
              <Settings size={20} />
            </ListItemIcon>
            <ListItemText primary="Configurações" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout} sx={{ color: 'rgba(255, 255, 255, 0.7)', borderRadius: 2, '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' } }}>
            <ListItemIcon sx={{ color: 'rgba(255, 255, 255, 0.7)', minWidth: 40 }}>
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
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          // Aqui está a mágica! A cor muda com o tema.
          backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#1A2E44',
          borderRight: 'none',
          display: 'flex',
          flexDirection: 'column'
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}

export default Sidebar;