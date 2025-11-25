import React, { useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Stack,
  Typography,
  Chip,
  Tooltip
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

function UserManagement({ users, onDeleteUser }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // --- Handlers de Paginação ---
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Cálculo dos dados para a página atual
  const usersPaginados = users 
    ? users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : [];

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: 3 }}>
      <TableContainer>
        <Table stickyHeader aria-label="tabela de usuários">
          <TableHead>
            <TableRow>
              {/* Padrão ComponentesTable: Alinhamento à esquerda para texto, Negrito no header */}
              <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
              {/* Centralizamos Cargo e Ações para melhor visualização dos botões/chips */}
              <TableCell align="center" sx={{ fontWeight: "bold" }}>Cargo</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users && users.length > 0 ? (
              usersPaginados.map((user) => (
                <TableRow hover key={user.id}>
                  {/* Dados alinhados à esquerda (Padrão) */}
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  
                  {/* Cargo Centralizado e com cor Azul para User */}
                  <TableCell align="center">
                    <Chip
                      label={user.role}
                      size="small"
                      // Se for ADMIN usa 'error' (vermelho), se for outro (USER) usa 'info' (azul)
                      color={user.role === "ADMIN" ? "error" : "info"}
                      variant={user.role === "ADMIN" ? "filled" : "outlined"}
                      sx={{ fontWeight: "bold", minWidth: "80px" }}
                    />
                  </TableCell>
                  
                  {/* Ações Centralizadas */}
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title="Excluir usuário">
                        <IconButton
                          aria-label="excluir"
                          color="error"
                          onClick={() => onDeleteUser(user.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography color="text.secondary" sx={{ p: 3 }}>
                    Nenhum utilizador encontrado nesta empresa.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Paginação */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={users ? users.length : 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Linhas por página:"
      />
    </Paper>
  );
}

export default UserManagement;