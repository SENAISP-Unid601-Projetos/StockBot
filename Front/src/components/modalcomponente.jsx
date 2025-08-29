  import { useState, useEffect } from 'react';
  import api from '../services/api';
  import './modalcomponente.css';
  import { toast } from 'react-toastify'; 

  function ModalComponente({ isVisible, onClose, onComponenteAdicionado, componenteParaEditar }) {
    const [nome, setNome] = useState('');
    const [codigoPatrimonio, setCodigoPatrimonio] = useState('');
    const [quantidade, setQuantidade] = useState(1);
  
    useEffect(() => {
      if (componenteParaEditar) {
        setNome(componenteParaEditar.nome);
        setCodigoPatrimonio(componenteParaEditar.codigoPatrimonio);
        setQuantidade(componenteParaEditar.quantidade);
      } else {
        // Limpa o formulário para o modo de adição
        setNome('');
        setCodigoPatrimonio('');
        setQuantidade(1);
      }
    }, [componenteParaEditar, isVisible]);

    if (!isVisible) return null;

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

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="close-button" onClick={onClose}>&times;</button>
          <h2>{componenteParaEditar ? 'Editar Componente' : 'Adicionar Novo Componente'}</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} required />
            <input type="text" placeholder="Patrimônio" value={codigoPatrimonio} onChange={e => setCodigoPatrimonio(e.target.value)} required />
            <input type="number" placeholder="Quantidade" value={quantidade} onChange={e => setQuantidade(parseInt(e.target.value))} required />
            <button type="submit">Salvar</button>
          </form>
        </div>
      </div>
    );
  }

  export default ModalComponente;
