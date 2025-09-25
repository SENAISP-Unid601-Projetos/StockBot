import { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar';
import api from '../services/api';
import { toast } from 'react-toastify';
import './requisicaopage.css' // Crie um ficheiro CSS para estilizar se necessário

function RequisicoesPage() {
  // Estado para guardar as requisições e o loading
  const [requisicoes, setRequisicoes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Busca os dados do backend quando a página carrega
  const fetchRequisicoes = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/requisicoes/pendentes');
      setRequisicoes(response.data);
    } catch (error) {
      toast.error("Falha ao carregar as requisições pendentes.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequisicoes();
  }, []);

  // Função para marcar uma requisição como concluída
  const handleMarcarConcluido = async (id) => {
    try {
      await api.put(`/api/requisicoes/${id}/concluir`);
      toast.success("Requisição marcada como concluída!");
      // Atualiza a lista, removendo o item concluído
      fetchRequisicoes();
    } catch (error) {
      toast.error("Falha ao atualizar a requisição.");
      console.error(error);
    }
  };

  return (
    <div className="requisicoes-page">
      <Sidebar />
      <main className="main-content">
        <h1>Requisições Pendentes</h1>
        {loading ? (
          <p>A carregar requisições...</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Identificador</th>
                  <th>Data da Requisição</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {requisicoes.length > 0 ? (
                  requisicoes.map(req => (
                    <tr key={req.id}>
                      <td>{req.componente.nome}</td>
                      <td>{req.componente.codigoPatrimonio}</td>
                      <td>{new Date(req.dataRequisicao).toLocaleString()}</td>
                      <td>
                        <button 
                          className="action-button"
                          onClick={() => handleMarcarConcluido(req.id)}
                        >
                          Marcar como Concluído
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">Nenhuma requisição pendente.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default RequisicoesPage;