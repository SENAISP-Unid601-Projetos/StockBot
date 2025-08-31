import { useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import api from '../services/api';
import { ThemeContext } from '../context/ThemeContext.jsx';
import Sidebar from '../components/sidebar';
import UserManagement from '../components/usermanagement';
import ModalAddUser from '../components/modaladduser.jsx';
import { ClipLoader } from 'react-spinners';

import '../styles/configuracoespage.css'; // Certifique-se de que o ficheiro CSS está corretamente nomeado
function ConfiguracoesPage() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddUserModalVisible, setAddUserModalVisible] = useState(false);
  
  const [isVerified, setIsVerified] = useState(false); 
  const [password, setPassword] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('jwt-token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userRoles = decodedToken.roles || [];
        if (userRoles.includes('ROLE_ADMIN')) {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Erro ao descodificar o token:", error);
      }
    }
  }, []);
  
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/users');
      setUsers(response.data);
    } catch (error) {
      toast.error("Não foi possível carregar a lista de utilizadores.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/auth/verify-password', { password });
      setIsVerified(true);
      fetchUsers(); 
    } catch (error) {
      toast.error("Senha incorreta. Acesso negado.");
      setIsVerified(false);
    } finally {
      setLoading(false);
    }
  };
  
  const handleRoleChange = async (userId, newRole) => {
      if (window.confirm(`Tem a certeza que quer alterar o cargo deste utilizador para ${newRole}?`)) {
        try {
          await api.put(`/api/users/${userId}/role`, { role: newRole });
          toast.success("Cargo do utilizador atualizado com sucesso!");
          fetchUsers();
        } catch (error) { toast.error("Não foi possível alterar o cargo."); }
      }
  };

  const handleDeleteUser = async (userId) => {
      if (window.confirm("Tem a certeza que quer excluir este utilizador?")) {
        try {
          await api.delete(`/api/users/${userId}`);
          toast.success("Utilizador excluído com sucesso!");
          fetchUsers();
        } catch (error) { toast.error("Não foi possível excluir o utilizador."); }
      }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <div className="header-dashboard"><h1>Configurações</h1></div>
        
        <div className="settings-section">
          <div className="setting-item">
            <span>Modo Escuro</span>
            <label className="switch">
              <input type="checkbox" onChange={toggleTheme} checked={theme === 'dark'} />
              <span className="slider round"></span>
            </label>
          </div>
        </div>

        <div className="settings-section">
          {isAdmin ? (
            <div>
              <div className="section-header">
                <h2>Gestão de Utilizadores</h2>
                <button className="action-button" onClick={() => setAddUserModalVisible(true)}>Adicionar Utilizador</button>
              </div>
              
              {!isVerified ? (
                <form onSubmit={handleVerifyPassword} className="verify-form">
                  <p>Para aceder a esta área, por favor confirme a sua senha.</p>
                  <div className="input-group">
                    <input
                      type="password"
                      placeholder="Digite a sua senha de admin"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button type="submit" className="action-button" disabled={loading}>
                      {loading ? <ClipLoader size={18} color="#fff" /> : 'Confirmar Acesso'}
                    </button>
                  </div>
                </form>
              ) : (
                loading ? (
                  <div className="loading-spinner-container">
                     <ClipLoader color={"var(--vermelhoSenai)"} size={35} />
                  </div>
                ) : (
                  <UserManagement 
                    users={users} 
                    onRoleChange={handleRoleChange} 
                    onDeleteUser={handleDeleteUser} 
                  />
                )
              )}
            </div>
          ) : (
            <p>Apenas administradores podem ver esta secção.</p>
          )}
        </div>
      </main>
      <ModalAddUser 
        isVisible={isAddUserModalVisible}
        onClose={() => setAddUserModalVisible(false)}
        onUserAdded={fetchUsers}
      />
    </div>
  );
}

export default ConfiguracoesPage;
