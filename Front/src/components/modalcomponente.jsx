import { useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

// 1. IMPORTAÇÕES DE COMPONENTES DO MUI PARA O DIÁLOGO
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  Typography, // Adicionado para mostrar a quantidade atual
  MenuItem,   // Adicionado para o <select>
} from "@mui/material";

function ModalComponente({
  isVisible,
  onClose,
  onComponenteAdicionado,
  componenteParaEditar,
}) {
  // --- NOVOS ESTADOS ---
  const [nome, setNome] = useState("");
  const [codigoPatrimonio, setCodigoPatrimonio] = useState("");
  
  // State 'quantidade' é usado APENAS para o modo de CRIAÇÃO
  const [quantidade, setQuantidade] = useState(1); 
  
  // States novos, usados APENAS para o modo de EDIÇÃO
  const [tipoMovimentacao, setTipoMovimentacao] = useState("ENTRADA");
  const [quantidadeMovimentar, setQuantidadeMovimentar] = useState(0);

  // --- useEffect ATUALIZADO ---
  // Popula o formulário de forma diferente para "Criar" vs "Editar"
  useEffect(() => {
    if (componenteParaEditar) {
      // MODO DE EDIÇÃO
      setNome(componenteParaEditar.nome);
      setCodigoPatrimonio(componenteParaEditar.codigoPatrimonio);
      
      // Reseta os campos de movimentação
      setTipoMovimentacao("ENTRADA");
      setQuantidadeMovimentar(0);
      
      // Não mexemos no state 'quantidade', pois ele só é usado na criação
    } else {
      // MODO DE CRIAÇÃO
      setNome("");
      setCodigoPatrimonio("");
      setQuantidade(1); // Define a quantidade inicial para 1
    }
  }, [componenteParaEditar, isVisible]);

  // --- handleSubmit ATUALIZADO ---
  // Contém a lógica separada para Criar (POST) e Editar (PUT)
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (componenteParaEditar) {
        // --- LÓGICA DE EDIÇÃO (Movimentação) ---
        
        let novaQuantidade = componenteParaEditar.quantidade;
        const valorMovimentar = parseInt(quantidadeMovimentar) || 0;

        if (valorMovimentar > 0) {
          if (tipoMovimentacao === "ENTRADA") {
            novaQuantidade += valorMovimentar;
          } else { // "SAIDA"
            novaQuantidade -= valorMovimentar;
          }
        }

        if (novaQuantidade < 0) {
          toast.error("A quantidade em estoque não pode ser negativa.");
          return;
        }

        // Mantém todos os dados antigos e atualiza apenas os campos do formulário
        const dadosComponente = {
          ...componenteParaEditar, 
          nome: nome,
          codigoPatrimonio: codigoPatrimonio,
          quantidade: novaQuantidade, // Envia a NOVA QUANTIDADE TOTAL calculada
        };

        await api.put(
          `/api/componentes/${componenteParaEditar.id}`,
          dadosComponente
        );
        toast.success("Estoque atualizado com sucesso!");

      } else {
        // --- LÓGICA DE CRIAÇÃO (Original) ---
        const dadosComponente = {
          nome,
          codigoPatrimonio,
          quantidade: parseInt(quantidade),
          localizacao: "Padrão",
          categoria: "Geral",
          observacoes: "",
          nivelMinimoEstoque: 0 // Adicionando campo que faltava
        };

        await api.post("/api/componentes", dadosComponente);
        toast.success("Componente adicionado com sucesso!");
      }

      onComponenteAdicionado(); // Atualiza a tabela na página
      onClose(); // Fecha o modal
    } catch (error) {
      console.error("Erro ao salvar componente:", error);
      toast.error("Falha ao salvar componente. Verifique os dados.");
    }
  };

  // --- JSX ATUALIZADO (Renderização Condicional) ---
  return (
    <Dialog open={isVisible} onClose={onClose}>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle fontWeight="bold">
          {componenteParaEditar
            ? "Editar Componente"
            : "Adicionar Novo Componente"}
        </DialogTitle>

        <DialogContent>
          {/* Campos que aparecem em ambos os modos */}
          <TextField
            autoFocus
            required
            margin="dense"
            id="nome"
            label="Nome do Componente"
            type="text"
            fullWidth
            variant="outlined"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <TextField
            required
            margin="dense"
            id="patrimonio"
            label="Código do Patrimônio"
            type="text"
            fullWidth
            variant="outlined"
            value={codigoPatrimonio}
            onChange={(e) => setCodigoPatrimonio(e.target.value)}
            // No modo "Criar", o backend ignora este campo e gera um novo.
            // No modo "Editar", ele permite a alteração.
          />

          {componenteParaEditar ? (
            // --- CAMPOS PARA O MODO DE EDIÇÃO ---
            <>
              <Typography variant="body1" sx={{ mt: 2, mb: 1 }}>
                Quantidade Atual: <strong>{componenteParaEditar.quantidade}</strong>
              </Typography>
              
              <TextField
                select // Transforma em um <select>
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
            // --- CAMPO PARA O MODO DE CRIAÇÃO ---
            <TextField
              required
              margin="dense"
              id="quantidade"
              label="Quantidade Inicial"
              type="number"
              fullWidth
              variant="outlined"
              value={quantidade}
              onChange={(e) => setQuantidade(parseInt(e.target.value))}
              InputProps={{ inputProps: { min: 0 } }} // Garante que não seja negativo
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