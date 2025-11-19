// Em: src/components/ModalResetPassword.jsx
import { useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

// Imports do MUI
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  FormHelperText,
  CircularProgress,
  Box,
} from "@mui/material";

function ModalResetPassword({ isVisible, onClose, userToReset }) {
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Limpa o formulário ao fechar
  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setNewPassword("");
      setError("");
    }, 300);
  };

  // Envia o formulário para o back-end
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (newPassword.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      // Chama o novo endpoint que criamos no back-end
      await api.put(`/users/${userToReset.id}/reset-password`, {
        newPassword: newPassword,
      });
      toast.success(`Senha para ${userToReset.nome} resetada com sucesso!`);
      handleClose();
    } catch (err) {
      console.error("Erro ao resetar senha:", err);
      setError(err.response?.data?.message || "Ocorreu um erro.");
    } finally {
      setLoading(false);
    }
  };

  // Se o usuário não estiver carregado, não renderize o modal
  if (!userToReset) return null;

  return (
    <Dialog open={isVisible} onClose={handleClose}>
      <DialogTitle fontWeight="bold">Resetar Senha</DialogTitle>

      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Digite uma nova senha temporária para{" "}
          <strong>
            {userToReset.nome} ({userToReset.email})
          </strong>
          .
        </DialogContentText>

        {/* Formulário */}
        <Box component="form" id="reset-password-form" onSubmit={handleSubmit}>
          <TextField
            autoFocus
            required
            margin="dense"
            id="password"
            label="Nova Senha Temporária"
            type="password"
            fullWidth
            variant="outlined"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={!!error} // Mostra o campo em vermelho se houver erro
          />
          {error && (
            <FormHelperText error sx={{ mt: 1 }}>
              {error}
            </FormHelperText>
          )}
        </Box>
      </DialogContent>

      {/* Botões de Ação */}
      <DialogActions sx={{ p: "0 24px 24px 24px" }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          type="submit"
          form="reset-password-form"
          variant="contained"
          disabled={loading}
          color="warning" // Cor de "aviso" para a ação
        >
          {loading ? <CircularProgress size={24} /> : "Resetar e Salvar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ModalResetPassword;
