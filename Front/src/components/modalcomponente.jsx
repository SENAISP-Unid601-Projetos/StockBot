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
  const [localizacao, setLocalizacao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [quantidade, setQuantidade] = useState(1);

  const [tipoMovimentacao, setTipoMovimentacao] = useState("ENTRADA");
  const [quantidadeMovimentar, setQuantidadeMovimentar] = useState(0);
  const [nivelMinimoEstoque, setNivelMinimoEstoque] = useState(1);

  // --- useEffect ---
  useEffect(() => {
    if (componenteParaEditar) {
      // EDIÇÃO
      setNome(componenteParaEditar.nome);
      setLocalizacao(componenteParaEditar.localizacao);
      setCategoria(componenteParaEditar.categoria);
      setTipoMovimentacao("ENTRADA");
      setQuantidadeMovimentar(0);
      setNivelMinimoEstoque(componenteParaEditar.nivelMinimoEstoque || 0);
    } else {
      // CRIAÇÃO
      setNome("");
      setLocalizacao("");
      setCategoria("");
      setQuantidade(1);
      setNivelMinimoEstoque(1);
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
          quantidade: novaQuantidade,
          localizacao: localizacaoFinal,
          categoria: categoriaFinal,
          nivelMinimoEstoque: parseInt(nivelMinimoEstoque) || 0,
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
           nivelMinimoEstoque: parseInt(nivelMinimoEstoque) || 0,
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
              {/* --- 6. ADICIONAR CAMPO DE NÍVEL MÍNIMO NA EDIÇÃO --- */}
              <TextField
                margin="dense"
                id="nivelMinimo"
                label="Nível Mínimo de Estoque"
                type="number"
                fullWidth
                variant="outlined"
                value={nivelMinimoEstoque}
                onChange={(e) => setNivelMinimoEstoque(e.target.value)}
                InputProps={{ inputProps: { min: 0 } }}
                helperText="Define o alerta de 'Estoque Baixo'"
              />

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
            // --- CAMPOS PARA O MODO DE CRIAÇÃO ---
            <>
              <TextField
                required
                margin="dense"
                id="quantidade"
                label="Quantidade Inicial"
                type="number"
                fullWidth
                variant="outlined"
                value={quantidade}
                // *** CORREÇÃO AQUI ***
                // Apenas define o valor (string), deixa o parseInt para o handleSubmit
                onChange={(e) => setQuantidade(e.target.value)}
                InputProps={{ inputProps: { min: 0 } }} // Garante que não seja negativo
              />

              {/* --- 7. ADICIONAR CAMPO DE NÍVEL MÍNIMO NA CRIAÇÃO --- */}
              <TextField
                margin="dense"
                id="nivelMinimo"
                label="Nível Mínimo de Estoque"
                type="number"
                fullWidth
                variant="outlined"
                value={nivelMinimoEstoque}
                onChange={(e) => setNivelMinimoEstoque(e.target.value)}
                InputProps={{ inputProps: { min: 0 } }}
                helperText="Define o alerta de 'Estoque Baixo'"
              />
            </>
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
