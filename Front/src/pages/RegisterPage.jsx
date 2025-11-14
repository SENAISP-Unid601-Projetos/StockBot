import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import "./loginpage.css"; // Reutiliza o CSS
import { toast } from "react-toastify"; // Usar toast para erros
import ParticlesBackground from "../components/ParticlesBackground";


function RegisterPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [dominioEmpresa, setDominioEmpresa] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    setError("");

    if (senha !== confirmarSenha) {
      setError("As senhas não coincidem.");
      return;
    }

    if (senha.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/auth/register", { email, senha, dominioEmpresa });

      toast.success("Empresa registrada com sucesso!");
      navigate("/login");
    } catch (error) {
      console.error("Erro no cadastro:", error);
      // Pega a mensagem de erro específica do backend (que definimos agora)
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data ||
        "Erro ao realizar o cadastro. Tente novamente.";
      setError(errorMsg);
      // toast.error(errorMsg); // Pode usar toast ou o <p>
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* 🎇 Fundo animado de partículas */}
      <ParticlesBackground />
      <div className="form-wrapper">
        <form className="auth-form" onSubmit={handleRegister}>
          <h2>Registrar Nova Empresa</h2>

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
            {loading ? "A registrar..." : "Registrar"}
          </button>
        </form>

        <div className="login-link">
          <p>
            Já tem uma conta? <Link to="/login">Faça o login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
