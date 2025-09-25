/*
* File: senaisp-unid601-projetos/stockbot/StockBot-19a9513533a1e735515fdc76ec3de9e98b02cee9/Front/src/pages/loginpage.jsx
*/
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Usa o axios normal
import './loginpage.css';

const apiUrl = 'http://localhost:8080/api/auth';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [dominioEmpresa, setDominioEmpresa] = useState(''); // Estado para o domínio da empresa
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/login`, { email, senha, dominioEmpresa });
      const token = response.data.token;
      localStorage.setItem('jwt-token', token);
      navigate('/');
    } catch (error) {
      console.error('Erro de login:', error);
      alert('Credenciais inválidas. Verifique o e-mail, senha e domínio.');
    }
  };

  return (
    <div className="login-container">
      <div className="form-wrapper">
        <form id="login-form" onSubmit={handleLogin}>
          <h2>Acessar o StockBot</h2>
          <label htmlFor="dominio">Domínio da Empresa</label>
          <input 
            type="text" 
            id="dominio"
            value={dominioEmpresa}
            onChange={(e) => setDominioEmpresa(e.target.value)}
            required 
          />
          <label htmlFor="email">E-mail</label>
          <input 
            type="email" 
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <label htmlFor="password">Senha</label>
          <input 
            type="password" 
            id="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required 
          />
          <button type="submit">Entrar</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;