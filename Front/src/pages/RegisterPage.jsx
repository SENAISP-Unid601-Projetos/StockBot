import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './loginpage.css'; // Reutiliza o CSS

const apiUrl = 'http://localhost:8080/api/auth';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [dominioEmpresa, setDominioEmpresa] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    setError('');

    if (senha !== confirmarSenha) {
      setError('As senhas não coincidem.');
      return;
    }

    if (senha.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${apiUrl}/register`, { email, senha, dominioEmpresa });

      alert('Cadastro realizado com sucesso! Você já pode fazer o login.');
      navigate('/login');

    } catch (error) {
      console.error('Erro no cadastro:', error);
      if (error.response && error.response.data) {
        setError(error.response.data.message || 'Erro ao realizar o cadastro. Verifique os dados.');
      } else {
        setError('Não foi possível conectar ao servidor.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="form-wrapper">
        {/* ALTERAÇÃO AQUI: id="register-form" para className="auth-form" */}
        <form className="auth-form" onSubmit={handleRegister}>
          <h2>Criar Conta no StockBot</h2>

          <label htmlFor="dominio">Domínio da Empresa</label>
          <input
            type="text"
            id="dominio"
            value={dominioEmpresa}
            onChange={(e) => setDominioEmpresa(e.target.value)}
            required
            disabled={loading}
          />

          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <label htmlFor="password">Senha (mín. 6 caracteres)</label>
          <input
            type="password"
            id="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            disabled={loading}
          />

          <label htmlFor="confirm-password">Confirmar Senha</label>
          <input
            type="password"
            id="confirm-password"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            required
            disabled={loading}
          />

          {error && <p className="error-message">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'A registar...' : 'Registar'}
          </button>
        </form>

        <div className="login-link">
          <p>Já tem uma conta? <Link to="/login">Faça o login</Link></p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;