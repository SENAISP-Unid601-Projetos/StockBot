// Em: src/components/ModalSolicitarItem.jsx

import { useState, useEffect } from "react";
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
  CircularProgress,
  Box,
} from "@mui/material";

// Recebe o item que o usuário quer pedir
function ModalSolicitarItem({
  isVisible,
  onClose,
  itemParaSolicitar,
  onSolicitado,
}) {
  const [quantidade, setQuantidade] = useState(1);
  const [observacao, setObservacao] = useState("");
  const [loading, setLoading] = useState(false);

  // Zera o formulário sempre que o modal abre para um novo item
  useEffect(() => {
    if (isVisible) {
      setQuantidade(1);
      setObservacao("");
    }
  }, [isVisible]);

  // Limpa o formulário ao fechar (para não piscar)
  const handleClose = () => {
    onClose();
    // Não precisa mais do setTimeout se zerarmos no useEffect
  };

  // Envia o formulário (o DTO) para o back-end
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    // 1. Monta o DTO que o nosso back-end espera
    const dto = {
      componenteId: itemParaSolicitar.id,
      quantidade: quantidade,
      observacao: observacao,
    };

    // 2. Validação Rápida (Não deixar pedir mais do que tem)
    if (quantidade > itemParaSolicitar.quantidade) {
      toast.error(
        `Não é possível solicitar ${quantidade}. Em estoque: ${itemParaSolicitar.quantidade}`
      );
      setLoading(false);
      return;
    }

    try {
      // 3. Chama o POST /api/requisicoes (que já criamos no back-end)
      await api.post("/requisicoes", dto);
      toast.success("Solicitação enviada com sucesso para aprovação!");
      onSolicitado(); // Avisa a ComponentesPage que deu certo
      handleClose();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Falha ao enviar solicitação."
      );
    } finally {
      setLoading(false);
    }
  };

  // Não renderiza nada se o item não foi carregado
  if (!itemParaSolicitar) return null;

  return (
    <Dialog open={isVisible} onClose={handleClose}>
      <DialogTitle fontWeight="bold">Solicitar Item</DialogTitle>

      {/* Usamos o <Box> como formulário */}
      <Box component="form" id="solicitar-item-form" onSubmit={handleSubmit}>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Você está solicitando o item:{" "}
            <strong>{itemParaSolicitar.nome}</strong>.
            <br />
            (Em estoque: {itemParaSolicitar.quantidade})
          </DialogContentText>

          <TextField
            autoFocus
            required
            margin="dense"
            id="quantidade"
            label="Quantidade Desejada"
            type="number"
            fullWidth
            variant="outlined"
            value={quantidade}
            onChange={(e) => setQuantidade(parseInt(e.target.value) || 1)}
            slotProps={{ input: { min: 1, max: itemParaSolicitar.quantidade } }} // Limita o máximo
          />
          <TextField
            margin="dense"
            id="observacao"
            label="Justificativa (Opcional)"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
          />
        </DialogContent>

        <DialogActions sx={{ p: "0 24px 24px 24px" }}>
          <Button onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            form="solicitar-item-form"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Enviar Solicitação"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default ModalSolicitarItem;
