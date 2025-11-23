import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import ParticlesBackground from "../components/ParticlesBackground";
import "./loginpage.css"; // Reusa estilos

function RecuperarSenhaPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRecover = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      await api.post("/api/auth/forgot-password", { email });
      setMessage("Se o e-mail existir, você receberá uma nova senha temporária em instantes.");
    } catch (err) {
      setError(err.response?.data || "Erro ao solicitar recuperação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={{ position: "relative", minHeight: "100vh" }}>
      <ParticlesBackground />
      <div className="form-wrapper" style={{ position: "relative", zIndex: 10 }}>
        <form className="auth-form" onSubmit={handleRecover}>
          <h2>Recuperar Senha</h2>
          <p style={{color: 'white', marginBottom: '1rem', fontSize: '0.9rem'}}>
            Digite seu e-mail cadastrado. Enviaremos uma senha temporária para ele.
          </p>

          <label>E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          {message && <p style={{color: '#2ecc71', padding: '10px', background: 'rgba(46, 204, 113, 0.1)', borderRadius: '5px'}}>{message}</p>}
          {error && <p className="error-message">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Enviando..." : "Recuperar Senha"}
          </button>
        </form>

        <div className="login-link">
          <p>Lembrou a senha? <Link to="/login">Voltar ao Login</Link></p>
        </div>
      </div>
    </div>
  );
}

export default RecuperarSenhaPage;