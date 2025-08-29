import { useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';
import { ThemeContext } from '../context/ThemeContext.jsx';
import Sidebar from '../components/sidebar';
import UserManagement from '../components/usermanagement';
import ModalAddUser from '../components/mudaluser.jsx';
import Button from '../components/button.jsx';

function ConfiguracoesPage() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('jwt-token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userRoles = decodedToken.roles || [];
        
        if (userRoles.includes('ROLE_ADMIN')) {
          setIsAdmin(true);
          fetchUsers();
        }
      } catch (error) {
        console.error("Erro ao descodificar o token:", error);
      }
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error("Erro ao buscar utilizadores:", error);
    }
  };

  const handleDeleteUser = async (id) => {
    // AVISO: window.confirm() pode ser substituído por um modal no futuro
    if (window.confirm('Tem a certeza de que deseja excluir este utilizador?')) {
      try {
        await api.delete(`/api/users/${id}`);
        fetchUsers();
      } catch (error) {
        console.error("Erro ao excluir utilizador:", error);
        alert('Falha ao excluir o utilizador.');
      }
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <div className="header-dashboard">
          <h1>Configurações</h1>
        </div>

        {/* Secção de Aparência */}
        <div className="settings-section">
          <div className="setting-item">
            <span>Modo Escuro</span>
            <label className="switch">
              <input type="checkbox" onChange={toggleTheme} checked={theme === 'dark'} />
              <span className="slider round"></span>
            </label>
          </div>
        </div>

        {/* Secção de Gestão de Utilizadores */}
        {isAdmin && (
          <div className="settings-section">
            <div className="section-header">
              <h2>Gestão de Utilizadores</h2>
              
              {/* 2. SUBSTITUA O <button> ANTIGO PELO NOVO COMPONENTE <Button> */}
              <Button variant="primary" onClick={() => setModalVisible(true)}>
                Adicionar Utilizador
              </Button>

            </div>

            <UserManagement users={users} onDeleteUser={handleDeleteUser} />
          </div>
        )}
      </main>

      <ModalAddUser 
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onUserAdded={fetchUsers}
      />
    </div>
  );
}

export default ConfiguracoesPage;
