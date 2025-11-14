import React from "react";

// 1. Importar os componentes do Material-UI
import { IconButton, Chip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

// 2. Importar o CSS
import "./usermanagement.css";

function UserManagement({ users, onDeleteUser }) {
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
                {/* 3. Chips atualizados com fundo --cinzaClaro */}
                <Chip
                  label={user.role}
                  size="small"
                  sx={{
                    textTransform: "uppercase",
                    fontWeight: "bold",
                    // AQUI: Fundo com a variável --cinzaClaro
                    backgroundColor: "var(--cinzaClaro)",
                    // Texto: Vermelho para Admin, Preto para User (para manter contraste)
                    color:
                      user.role === "ADMIN"
                        ? "var(--vermelhoSenai)"
                        : "#000000",
                    // Borda subtil para definir a "caixa" no fundo claro
                    border: "1px solid var(--cinzaMedio, #ccc)",
                  }}
                />
              </td>
              <td>
                <IconButton
                  aria-label="Excluir"
                  color="error"
                  onClick={() => onDeleteUser(user.id)}
                >
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
