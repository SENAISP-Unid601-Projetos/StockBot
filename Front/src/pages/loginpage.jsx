import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './loginpage.css';

const apiUrl = 'http://localhost:8080/api/auth';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [dominioEmpresa, setDominioEmpresa] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${apiUrl}/login`, { email, senha, dominioEmpresa });
      const token = response.data.token;
      localStorage.setItem('jwt-token', token);
      navigate('/');
    } catch (error) {
      console.error('Erro de login:', error);
      setError('Credenciais inválidas. Verifique o e-mail, senha e domínio.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="form-wrapper">
        {/* ALTERAÇÃO AQUI: id="login-form" para className="auth-form" */}
        <form className="auth-form" onSubmit={handleLogin}>
          <h2>Acessar o StockBot</h2>

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

          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            disabled={loading}
          />

          {error && <p className="error-message">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'A entrar...' : 'Entrar'}
          </button>
        </form>

        <div className="register-link">
          <p>Não tem uma conta? <Link to="/register">Crie uma conta</Link></p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;