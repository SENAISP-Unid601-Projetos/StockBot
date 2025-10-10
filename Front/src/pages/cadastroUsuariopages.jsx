import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './loginpage.css'; // Reutilizando o mesmo CSS da página de login

const apiUrl = 'http://localhost:8080/api/auth';

function CadastroUsuariopages() {
  // Estados para todos os campos do formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [nomeEmpresa, setNomeEmpresa] = useState('');
  const [dominioEmpresa, setDominioEmpresa] = useState('');
  
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();

    // 1. Validação: Verifica se as senhas coincidem
    if (senha !== confirmarSenha) {
      alert('As senhas não coincidem. Por favor, verifique.');
      return; // Interrompe a execução se as senhas forem diferentes
    }

    try {
      // 2. Envio dos dados para a API (ajuste os campos conforme seu backend)
      await axios.post(`${apiUrl}/register`, { 
        nome, 
        email, 
        senha, 
        nomeEmpresa, 
        dominioEmpresa 
      });

      // 3. Sucesso: Informa o usuário e redireciona para a tela de login
      alert('Cadastro realizado com sucesso! Você será redirecionado para a tela de login.');
      navigate('/login'); // Redireciona para a página de login após o sucesso

    } catch (error) {
      // 4. Erro: Exibe uma mensagem de erro genérica
      console.error('Erro no cadastro:', error);
      alert('Não foi possível realizar o cadastro. Verifique os dados e tente novamente.');
    }
  };

  return (
    <div className="login-container">
      <div className="form-wrapper">
        <form id="register-form" onSubmit={handleRegister}>
          <h2>Criar Conta no StockBot</h2>

          <label htmlFor="nome">Nome Completo</label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
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
          
          <label htmlFor="nomeEmpresa">Nome da Empresa</label>
          <input
            type="text"
            id="nomeEmpresa"
            value={nomeEmpresa}
            onChange={(e) => setNomeEmpresa(e.target.value)}
            required
          />

          <label htmlFor="dominio">Domínio da Empresa</label>
          <input
            type="text"
            id="dominio"
            placeholder="ex: minhaempresa.com"
            value={dominioEmpresa}
            onChange={(e) => setDominioEmpresa(e.target.value)}
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

          <label htmlFor="confirm-password">Confirmar Senha</label>
          <input 
            type="password" 
            id="confirm-password"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            required 
          />

          <button type="submit">Cadastrar</button>
        </form>
      </div>
    </div>
  );
}

export default CadastroUsuariopages;