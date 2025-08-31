import React from 'react';
import { jwtDecode } from 'jwt-decode';
import '../styles/usertable.css'; 

function UserTable({ users, onRoleChange, onDelete }) {
  // Pega o email do utilizador logado para não se poder auto-modificar
  const token = localStorage.getItem('jwt-token');
  const currentUserEmail = token ? jwtDecode(token).sub : null;

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Cargo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>
                <span className={`role-badge role-${user.role.toLowerCase()}`}>
                  {user.role}
                </span>
              </td>
              <td className="actions">
                {user.role === 'ADMIN' ? (
                  <button 
                    onClick={() => onRoleChange(user.id, 'USER')} 
                    className="action-button role-button"
                    disabled={user.email === currentUserEmail} // Desativa o botão para o próprio admin
                  >
                    Remover Admin
                  </button>
                ) : (
                  <button 
                    onClick={() => onRoleChange(user.id, 'ADMIN')} 
                    className="action-button role-button"
                  >
                    Tornar Admin
                  </button>
                )}
                <button 
                  onClick={() => onDelete(user.id)} 
                  className="action-button delete-button"
                  disabled={user.email === currentUserEmail} // Desativa o botão para o próprio admin
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;
