import React from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Tooltip,
  IconButton,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { getLoggedUser } from "../services/authService";

function UserManagement({ users, onDeleteUser }) {
  const currentUser = getLoggedUser();

  return (
    <TableContainer component={Paper}>
      <Table stickyHeader aria-label="tabela de usuários">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Nome</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Cargo</TableCell>
            <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>
              Ações
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} align="center">
                Nenhum usuário encontrado para este domínio.
              </TableCell>
            </TableRow>
          )}

          {users.map((user) => (
            <TableRow hover key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.nome}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Chip
                  label={user.role}
                  color={user.role === "ADMIN" ? "secondary" : "default"}
                  size="small"
                />
              </TableCell>
              <TableCell align="right">
                <Tooltip title="Excluir Usuário">
                  {/* Span necessário para o Tooltip funcionar em botão disabled */}
                  <span>
                    <IconButton
                      color="error"
                      onClick={() => onDeleteUser(user.id)}
                      // ✅ A CORREÇÃO ESTÁ AQUI:
                      // Desabilita se o ID for igual ao SEU ID (currentUser.id)
                      disabled={user.id === currentUser?.id}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default UserManagement;
