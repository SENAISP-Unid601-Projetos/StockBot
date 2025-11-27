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
            <TableRow
              sx={{
                "& th": {
                  backgroundColor: "#2a3c61ff",
                  color: "#ffffff",
                  fontWeight: "bold",
                },
              }}
            >
              {/* ADICIONADO align="center" nas colunas abaixo */}
              <TableCell align="center" width="25%">ID</TableCell>
              <TableCell align="center" width="25%">Email</TableCell>
              <TableCell align="center" width="25%">Cargo</TableCell>
              <TableCell align="center" width="25%">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users && users.length > 0 ? (
              usersPaginados.map((user) => (
                <TableRow hover key={user.id}>
                  {/* ADICIONADO align="center" nas células abaixo */}
                  <TableCell align="center">{user.id}</TableCell>
                  <TableCell align="center">{user.email}</TableCell>

                  <TableCell align="center">
                    <Chip
                      label={user.role}
                      size="small"
                      color={user.role === "ADMIN" ? "error" : "info"}
                      variant="filled"
                      sx={{
                        fontWeight: "bold",
                        minWidth: "80px",
                        // FORÇA O TEXTO A SER BRANCO
                        color: "#ffffff"
                      }}
                    />
                  </TableCell>

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