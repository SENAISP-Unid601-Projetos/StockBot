import { useState } from "react";
import api from "../services/api";
import "./modalcomponente.css"; // <-- 1. ADICIONA O CSS BASE DO MODAL
import "./mudaluser.css";
import { toast } from "react-toastify";

function ModalAddUser({ isVisible, onClose, onUserAdded }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [role, setRole] = useState("USER");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isVisible) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const novoUsuario = { email, senha, role };

    try {
      await api.post("/api/users", novoUsuario);
      toast.success("Utilizador criado com sucesso!");
      onUserAdded();
      onClose();
      setEmail("");
      setSenha("");
      setRole("USER");
    } catch (err) {
      console.error("Erro ao criar utilizador:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data ||
        "Ocorreu um erro ao criar o utilizador.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    // 2. O '.modal-overlay' e '.modal-content' agora vão buscar o estilo ao CSS importado
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>Adicionar Novo Utilizador</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="E-mail do utilizador"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Senha provisória (mín. 6 caracteres)"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            minLength={6}
            disabled={loading}
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled={loading}
          >
            <option value="USER">Utilizador Padrão</option>
            <option value="ADMIN">Administrador</option>
          </select>
          <button type="submit" disabled={loading}>
            {loading ? "A criar..." : "Criar Utilizador"}
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default ModalAddUser;
