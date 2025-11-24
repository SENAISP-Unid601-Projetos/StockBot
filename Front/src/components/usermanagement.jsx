import React from "react";
import { IconButton, Chip, Typography, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import "./usermanagement.css";

function UserManagement({ users, onDeleteUser }) {
  // Adicione esta verificação de segurança
  if (!users || users.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography color="text.secondary">
          Nenhum utilizador encontrado nesta empresa.
        </Typography>
      </Box>
    );
  }

  return (
    <div className="user-management-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Cargo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>
                <Chip
                  label={user.role}
                  size="small"
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "var(--cinzaClaro)",
                    color:
                      user.role === "ADMIN"
                        ? "var(--vermelhoSenai)"
                        : "#041dffff",
                    border: "1px solid #ccc",
                  }}
                />
              </td>
              <td>
                <IconButton color="error" onClick={() => onDeleteUser(user.id)}>
                  <DeleteIcon />
                </IconButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserManagement;
