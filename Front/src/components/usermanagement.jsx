import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Tooltip,
  Typography,
  Box,
  Avatar
} from '@mui/material';
import { 
  DeleteOutline, 
  AdminPanelSettings, 
  Person, 
  SupervisedUserCircle 
} from '@mui/icons-material';

function UserManagement({ users = [], onDeleteUser }) {

  // Função auxiliar para renderizar o "Crachá" do cargo
  const renderRoleBadge = (role) => {
    const isAdmin = role === 'ADMIN';
    return (
      <Chip
        icon={isAdmin ? <AdminPanelSettings /> : <Person />}
        label={isAdmin ? "Administrador" : "Usuário"}
        color={isAdmin ? "error" : "default"} // Admin vermelho, User cinza/padrão
        variant={isAdmin ? "filled" : "outlined"}
        size="small"
        sx={{ fontWeight: 'bold' }}
      />
    );
  };

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        width: '100%', 
        overflow: 'hidden', 
        borderRadius: 3,
        mb: 4 
      }}
    >
      {/* Cabeçalho da Seção */}
      <Box sx={{ p: 2, bgcolor: 'background.default', borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SupervisedUserCircle color="primary" />
          Gerenciamento de Usuários
        </Typography>
      </Box>

      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="tabela de usuarios">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.paper' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.paper' }}>Usuário</TableCell>
              <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.paper' }}>Cargo</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: 'background.paper' }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          
          <TableBody>
            {users.length === 0 ? (
              // Estado Vazio
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Nenhum usuário cadastrado.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow 
                  key={user.id} 
                  hover 
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Typography variant="caption" fontFamily="monospace" color="text.secondary">
                      #{user.id}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1.5}>
                      {/* Avatar gerado com a inicial do email */}
                      <Avatar sx={{ width: 32, height: 32, fontSize: 14, bgcolor: 'primary.light' }}>
                        {user.email?.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="body2" fontWeight={500}>
                        {user.email}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell>
                    {renderRoleBadge(user.role)}
                  </TableCell>

                  <TableCell align="right">
                    <Tooltip title="Excluir Usuário">
                      <IconButton 
                        color="error" 
                        onClick={() => onDeleteUser(user.id)}
                        size="small"
                      >
                        <DeleteOutline />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default UserManagement;