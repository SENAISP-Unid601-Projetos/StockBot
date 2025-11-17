import { useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  Typography,
  MenuItem,
} from "@mui/material";

function ModalComponente({
  isVisible,
  onClose,
  onComponenteAdicionado,
  componenteParaEditar,
}) {
  // --- ESTADOS ---
  const [nome, setNome] = useState("");
  const [codigoPatrimonio, setCodigoPatrimonio] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [quantidade, setQuantidade] = useState(1);

  const [tipoMovimentacao, setTipoMovimentacao] = useState("ENTRADA");
  const [quantidadeMovimentar, setQuantidadeMovimentar] = useState(0);

  // --- useEffect ---
  useEffect(() => {
    if (componenteParaEditar) {
      // EDIÇÃO
      setNome(componenteParaEditar.nome);
      setCodigoPatrimonio(componenteParaEditar.codigoPatrimonio);
      setLocalizacao(componenteParaEditar.localizacao);
      setCategoria(componenteParaEditar.categoria);
      setTipoMovimentacao("ENTRADA");
      setQuantidadeMovimentar(0);
    } else {
      // CRIAÇÃO
      setNome("");
      setCodigoPatrimonio("");
      setLocalizacao("");
      setCategoria("");
      setQuantidade(1);
    }
  }, [componenteParaEditar, isVisible]);

  // --- handleSubmit ---
  const handleSubmit = async (event) => {
  event.preventDefault();

  try {
    const localizacaoFinal =
      localizacao.trim() === "" ? "Padrão" : localizacao;
    const categoriaFinal = categoria.trim() === "" ? "Geral" : categoria;

    if (componenteParaEditar) {
      // --- EDIÇÃO ---
      let novaQuantidade = componenteParaEditar.quantidade;
      const valorMovimentar = parseInt(quantidadeMovimentar) || 0;

      if (valorMovimentar > 0) {
        novaQuantidade =
          tipoMovimentacao === "ENTRADA"
            ? novaQuantidade + valorMovimentar
            : novaQuantidade - valorMovimentar;
      }

      if (novaQuantidade < 0) {
        toast.error("A quantidade em estoque não pode ser negativa.");
        return;
      }

      const dadosComponente = {
        id: componenteParaEditar.id,
        nome,
        codigoPatrimonio: componenteParaEditar.codigoPatrimonio,
        quantidade: novaQuantidade,
        localizacao: localizacaoFinal,
        categoria: categoriaFinal,
        // Removido observacoes e nivelMinimoEstoque
      };

      await api.put(
        `/api/componentes/${componenteParaEditar.id}`,
        dadosComponente
      );

      toast.success("Estoque atualizado com sucesso!");
    } else {
      // --- CRIAÇÃO ---
      const dadosComponente = {
        nome,
        quantidade: parseInt(quantidade),
        localizacao: localizacaoFinal,
        categoria: categoriaFinal,
        // Removido observacoes e nivelMinimoEstoque
      };

      await api.post("/api/componentes", dadosComponente);
      toast.success("Componente adicionado com sucesso!");
    }

    onComponenteAdicionado();
    onClose();
  } catch (error) {
    console.error("Erro ao salvar componente:", error);
    const errorMsg =
      error.response?.data?.message ||
      "Falha ao salvar componente. Verifique os dados.";
    toast.error(errorMsg);
  }
};


  return (
    <Dialog open={isVisible} onClose={onClose}>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle fontWeight="bold">
          {componenteParaEditar
            ? "Editar Componente"
            : "Adicionar Novo Componente"}
        </DialogTitle>

        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="nome"
            label="Nome do Componente"
            type="text"
            fullWidth
            variant="outlined"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          {/* MOSTRA O CÓDIGO APENAS SE ESTIVER EDITANDO */}
          {componenteParaEditar && (
            <TextField
              margin="dense"
              id="codigoPatrimonio"
              label="Código de Patrimônio"
              type="text"
              fullWidth
              variant="outlined"
              value={codigoPatrimonio}
              disabled // Sempre desabilitado pois é gerado pelo sistema
            />
          )}

          <TextField
            margin="dense"
            id="localizacao"
            label="Localização (opcional)"
            type="text"
            fullWidth
            variant="outlined"
            value={localizacao}
            onChange={(e) => setLocalizacao(e.target.value)}
          />

          <TextField
            margin="dense"
            id="categoria"
            label="Categoria (opcional)"
            type="text"
            fullWidth
            variant="outlined"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          />

          {componenteParaEditar ? (
            <>
              <Typography variant="body1" sx={{ mt: 2, mb: 1 }}>
                Quantidade Atual:{" "}
                <strong>{componenteParaEditar.quantidade}</strong>
              </Typography>

              <TextField
                select
                margin="dense"
                id="tipoMovimentacao"
                label="Tipo de Movimentação"
                fullWidth
                variant="outlined"
                value={tipoMovimentacao}
                onChange={(e) => setTipoMovimentacao(e.target.value)}
              >
                <MenuItem value="ENTRADA">Adicionar (Entrada)</MenuItem>
                <MenuItem value="SAIDA">Remover (Saída)</MenuItem>
              </TextField>

              <TextField
                margin="dense"
                id="quantidadeMovimentar"
                label="Quantidade a Movimentar"
                type="number"
                fullWidth
                variant="outlined"
                value={quantidadeMovimentar}
                onChange={(e) => setQuantidadeMovimentar(e.target.value)}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </>
          ) : (
            <TextField
              margin="dense"
              id="quantidade"
              label="Quantidade Inicial"
              type="number"
              fullWidth
              variant="outlined"
              required
              value={quantidade}
              onChange={(e) => setQuantidade(parseInt(e.target.value))}
              InputProps={{ inputProps: { min: 0 } }}
            />
          )}
        </DialogContent>

        <DialogActions sx={{ p: "0 24px 16px" }}>
          <Button onClick={onClose} color="secondary">
            Cancelar
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default ModalComponente;
