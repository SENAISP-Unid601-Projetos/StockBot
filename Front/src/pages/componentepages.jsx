import { useState, useEffect } from 'react';
import api from '../services/api';
import Sidebar from '../components/sidebar';
import ComponentesTable from '../components/componentestable';
import ModalComponente from '../components/modalcomponente';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners'; // 1. Importa o spinner

function ComponentesPage() {
  const [componentes, setComponentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [componenteEmEdicao, setComponenteEmEdicao] = useState(null);

  const fetchData = async () => {
    try {
      const response = await api.get('/api/componentes');
      setComponentes(response.data);
    } catch (error) {
      console.error("Erro ao buscar componentes:", error);
      toast.error("Não foi possível carregar os componentes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (componente) => {
    setComponenteEmEdicao(componente);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    const confirmar = window.confirm("Você tem certeza que deseja excluir este componente?");
    if (confirmar) {
      try {
        await api.delete(`/api/componentes/${id}`);
        toast.success('Componente excluído com sucesso!');
        fetchData(); 
      } catch (error) {
        console.error("Erro ao excluir componente:", error);
        toast.error('Falha ao excluir o componente.');
      }
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setComponenteEmEdicao(null);
  };

  const handleAdd = () => {
    setComponenteEmEdicao(null);
    setModalVisible(true);
  };

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <div className="header-dashboard">
          <h1>Gerenciamento de Componentes</h1>
          <button className="action-button" onClick={handleAdd}>
            Adicionar Componente
          </button>
        </div>

        {/* Lógica de carregamento atualizada */}
        {loading ? (
          <div className="loading-spinner-container">
            <ClipLoader color={"var(--vermelhoSenai)"} loading={loading} size={50} />
          </div>
        ) : (
          <ComponentesTable 
            componentes={componentes} 
            onEdit={handleEdit}
            onDelete={handleDelete} 
          />
        )}
      </main>

      <ModalComponente 
        isVisible={isModalVisible} 
        onClose={handleCloseModal}
        onComponenteAdicionado={fetchData}
        componenteParaEditar={componenteEmEdicao}
      />
    </div>
  );
}

export default ComponentesPage;
