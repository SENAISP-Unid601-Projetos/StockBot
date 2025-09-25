import { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

// 1. IMPORTAÇÕES DE COMPONENTES DO MUI PARA O DIÁLOGO
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Box
} from '@mui/material';

function ModalComponente({ isVisible, onClose, onComponenteAdicionado, componenteParaEditar }) {
  // A sua lógica de estado continua a mesma
  const [nome, setNome] = useState('');
  const [codigoPatrimonio, setCodigoPatrimonio] = useState('');
  const [quantidade, setQuantidade] = useState(1);

  // O seu useEffect para popular o formulário continua o mesmo
  useEffect(() => {
    if (componenteParaEditar) {
      setNome(componenteParaEditar.nome);
      setCodigoPatrimonio(componenteParaEditar.codigoPatrimonio);
      setQuantidade(componenteParaEditar.quantidade);
    } else {
      setNome('');
      setCodigoPatrimonio('');
      setQuantidade(1);
    }
  }, [componenteParaEditar, isVisible]);

  // A sua lógica de submissão do formulário continua a mesma
  const handleSubmit = async (event) => {
    event.preventDefault();
    const dadosComponente = { nome, codigoPatrimonio, quantidade, localizacao: "Padrão", categoria: "Geral", observacoes: "" };

    try {
      if (componenteParaEditar) {
        await api.put(`/api/componentes/${componenteParaEditar.id}`, dadosComponente);
        toast.success('Componente atualizado com sucesso!');
      } else {
        await api.post('/api/componentes', dadosComponente);
        toast.success('Componente adicionado com sucesso!');
      }
      onComponenteAdicionado();
      onClose();
    } catch (error) {
      console.error("Erro ao salvar componente:", error);
      toast.error('Falha ao salvar componente. Verifique os dados.');
    }
  };

  // 2. A ESTRUTURA VISUAL AGORA USA O COMPONENTE <Dialog> DO MUI
  // A prop 'open' controla a visibilidade. A prop 'onClose' é chamada quando o utilizador clica fora do modal.
  return (
    <Dialog open={isVisible} onClose={onClose}>
      {/* Usamos Box com component="form" para que o formulário envolva o conteúdo do Dialog */}
      <Box component="form" onSubmit={handleSubmit}>
        {/* DialogTitle é o cabeçalho do nosso modal */}
        <DialogTitle fontWeight="bold">
          {componenteParaEditar ? 'Editar Componente' : 'Adicionar Novo Componente'}
        </DialogTitle>

        {/* DialogContent é o corpo, onde colocamos os campos do formulário */}
        <DialogContent>
          {/* TextField é o input superpoderoso do MUI */}
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
            onChange={e => setNome(e.target.value)}
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
            onChange={e => setCodigoPatrimonio(e.target.value)}
          />
          <TextField
            required
            margin="dense"
            id="quantidade"
            label="Quantidade"
            type="number"
            fullWidth
            variant="outlined"
            value={quantidade}
            onChange={e => setQuantidade(parseInt(e.target.value))}
            InputProps={{ inputProps: { min: 1 } }} // Garante que a quantidade não seja menor que 1
          />
        </DialogContent>

        {/* DialogActions é o rodapé, onde colocamos os botões de ação */}
        <DialogActions sx={{ p: '0 24px 16px' }}>
          <Button onClick={onClose} color="secondary">Cancelar</Button>
          <Button type="submit" variant="contained" color="primary">Salvar</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default ModalComponente;