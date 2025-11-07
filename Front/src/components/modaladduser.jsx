import { useState } from "react";
import api from "../services/api";
import "./mudaluser.css";
import { toast } from "react-toastify"; // <-- 1. Importar toast

function ModalAddUser({ isVisible, onClose, onUserAdded }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [role, setRole] = useState("USER"); // Cargo padrão
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // <-- 2. Adicionar estado de loading

  if (!isVisible) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true); // <-- 3. Ativar loading

    const novoUsuario = { email, senha, role }; // Payload está correto

    try {
      await api.post("/api/users", novoUsuario);
      toast.success("Utilizador criado com sucesso!"); // <-- 4. Usar toast
      onUserAdded(); // Atualiza a lista na página principal
      onClose(); // Fecha o modal
      // Limpa os campos
      setEmail("");
      setSenha("");
      setRole("USER");
    } catch (err) {
      console.error("Erro ao criar utilizador:", err);
      // Pega a mensagem de erro do backend (ex: "Email já em uso")
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data ||
        "Ocorreu um erro ao criar o utilizador.";
      setError(errorMsg);
    } finally {
      setLoading(false); // <-- 5. Desativar loading
    }
  };

  return (
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
            disabled={loading} // <-- 6. Desativar campos
          />
          <input
            type="password"
            placeholder="Senha provisória (mín. 6 caracteres)"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            minLength={6} // Validação de 6 caracteres
            disabled={loading} // <-- 6. Desativar campos
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
            {" "}
            {/* 7. Desativar botão */}
            {loading ? "A criar..." : "Criar Utilizador"}
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default ModalAddUser;