import { useState } from 'react';
import api from '../services/api';
import './mudaluser.css'; 

function ModalAddUser({ isVisible, onClose, onUserAdded }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [role, setRole] = useState('USER'); // Cargo padrão
  const [error, setError] = useState('');

  if (!isVisible) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const novoUsuario = { email, senha, role };

    try {
      await api.post('/api/users', novoUsuario);
      onUserAdded(); // Atualiza a lista na página principal
      onClose(); // Fecha o modal
      // Limpa os campos para a próxima vez
      setEmail('');
      setSenha('');
      setRole('USER');
    } catch (err) {
      console.error("Erro ao criar utilizador:", err);
      setError(err.response?.data?.message || "Ocorreu um erro ao criar o utilizador.");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Adicionar Novo Utilizador</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="E-mail do utilizador" 
            value={email}
            onChange={e => setEmail(e.target.value)}
            required 
          />
          <input 
            type="password" 
            placeholder="Senha provisória" 
            value={senha}
            onChange={e => setSenha(e.target.value)}
            required 
          />
          <select value={role} onChange={e => setRole(e.target.value)}>
            <option value="USER">Utilizador Padrão</option>
            <option value="ADMIN">Administrador</option>
          </select>
          <button type="submit">Criar Utilizador</button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default ModalAddUser;
