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
  CircularProgress,
  // (Adicione Grid se quiser layout 2 colunas)
} from "@mui/material";

function ModalComponente({
  isVisible,
  onClose,
  onComponenteAdicionado,
  componenteParaEditar,
}) {
  const [nome, setNome] = useState("");
  const [codigoPatrimonio, setCodigoPatrimonio] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [localizacao, setLocalizacao] = useState("");
  const [categoria, setCategoria] = useState("");
  
  // --- ✅ 1. ADICIONAR O NOVO ESTADO ---
  const [nivelMinimoEstoque, setNivelMinimoEstoque] = useState(5); 
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (componenteParaEditar) {
      setNome(componenteParaEditar.nome);
      setCodigoPatrimonio(componenteParaEditar.codigoPatrimonio);
      setQuantidade(componenteParaEditar.quantidade);
      setLocalizacao(componenteParaEditar.localizacao || "");
      setCategoria(componenteParaEditar.categoria || "");
      
      // --- ✅ 2. ATUALIZAR O NOVO ESTADO ---
      setNivelMinimoEstoque(componenteParaEditar.nivelMinimoEstoque || 5);
    
    } else {
      // Limpa o formulário
      setNome("");
      setCodigoPatrimonio("");
      setQuantidade(1);
      setLocalizacao("");
      setCategoria("");
      
      // --- ✅ 3. RESETAR O NOVO ESTADO ---
      setNivelMinimoEstoque(5); 
    }
  }, [componenteParaEditar, isVisible]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const dadosComponente = {
      nome,
      codigoPatrimonio,
      quantidade,
      localizacao,
      categoria,
      
      // --- ✅ 4. ENVIAR O NOVO CAMPO PARA A API ---
      nivelMinimoEstoque,
      
      // (observacoes ainda não está implementado)
      observacoes: "", 
    };

    try {
      if (componenteParaEditar) {
        await api.put(
          `/componentes/${componenteParaEditar.id}`,
          dadosComponente
        );
        toast.success("Componente atualizado com sucesso!");
      } else {
        await api.post("/componentes", dadosComponente);
        toast.success("Componente adicionado com sucesso!");
      }
      onComponenteAdicionado(); // Recarrega a tabela
      onClose(); // Fecha o modal
    } catch (error) {
      console.error("Erro ao salvar componente:", error);
      toast.error(
        error.response?.data?.message || "Falha ao salvar. Verifique o Patrimônio."
      );
    } finally {
      setLoading(false);
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
          />
          
          {/* (Sugestão: Colocar Quantidade e Nível Mínimo lado a lado) */}
          <TextField
            required
            margin="dense"
            id="quantidade"
            label="Quantidade Atual"
            type="number"
            fullWidth
            variant="outlined"
            value={quantidade}
            onChange={(e) => setQuantidade(parseInt(e.target.value) || 0)}
            InputProps={{ inputProps: { min: 0 } }} // (Permitir 0)
          />

          {/* --- ✅ 5. ADICIONAR O CAMPO NO FORMULÁRIO --- */}
          <TextField
            required
            margin="dense"
            id="nivelMinimo"
            label="Nível Mínimo de Estoque"
            type="number"
            fullWidth
            variant="outlined"
            value={nivelMinimoEstoque}
            onChange={(e) => setNivelMinimoEstoque(parseInt(e.target.value) || 1)}
            InputProps={{ inputProps: { min: 1 } }} // (Mínimo não deve ser 0)
            helperText="O sistema alertará quando a Qtd. for igual ou menor que este valor."
          />

          <TextField
            required
            margin="dense"
            id="categoria"
            label="Categoria"
            type="text"
            fullWidth
            variant="outlined"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          />
          <TextField
            required
            margin="dense"
            id="localizacao"
            label="Localização"
            type="text"
            fullWidth
            variant="outlined"
            value={localizacao}
            onChange={(e) => setLocalizacao(e.target.value)}
          />
        </DialogContent>

        <DialogActions sx={{ p: "0 24px 16px" }}>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Salvar"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default ModalComponente;