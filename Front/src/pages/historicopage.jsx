import { useState, useEffect } from 'react';
import api from '../services/api';
import Sidebar from '../components/sidebar';
import HistoricoLog from '../components/historicolog'; // Importa o nosso novo componente

function HistoricoPage() {
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Busca os dois conjuntos de dados em paralelo para ser mais rápido
        const [historicoResponse, componentesResponse] = await Promise.all([
          api.get('/api/historico'),
          api.get('/api/componentes')
        ]);

        const historicoData = historicoResponse.data;
        const componentesData = componentesResponse.data;

        // 2. Cria um "mapa" para encontrar facilmente o nome de um componente pelo seu ID
        const mapaComponentes = new Map(
          componentesData.map(comp => [comp.id, comp.nome])
        );

        // 3. Processa a lista de histórico, adicionando o nome do componente a cada item
        const historicoProcessado = historicoData.map(item => ({
          ...item,
          nomeComponente: mapaComponentes.get(item.componenteId) || 'Componente Desconhecido'
        }));
        
        // Ordena o histórico do mais recente para o mais antigo
        historicoProcessado.sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora));

        setHistorico(historicoProcessado);

      } catch (error) {
        console.error("Erro ao buscar histórico:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <div className="header-dashboard">
          <h1>Histórico de Movimentações</h1>
          <p>Veja todas as entradas e saídas do seu estoque.</p>
        </div>

        {loading ? (
          <p>A carregar histórico...</p>
        ) : (
          <HistoricoLog historicoProcessado={historico} />
        )}
      </main>
    </div>
  );
}

export default HistoricoPage;
