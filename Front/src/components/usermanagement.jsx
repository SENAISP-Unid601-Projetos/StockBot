import './usermanagement.css';

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
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td><span className={`role-badge ${user.role.toLowerCase()}`}>{user.role}</span></td>
              <td>
                <button 
                  className="btn-delete" 
                  onClick={() => onDeleteUser(user.id)}
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

export default UserManagement;
