import { useState, useEffect } from "react";
import api from "../services/api";
import Sidebar from "../components/sidebar";
import HistoricoLog from "../components/historicolog.jsx";
import { ClipLoader } from "react-spinners";

function HistoricoPage() {
  const [historicoProcessado, setHistoricoProcessado] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Busca os dois conjuntos de dados em paralelo
        const [historicoResponse, componentesResponse] = await Promise.all([
          api.get("/api/historico"),
          api.get("/api/componentes"),
        ]);

        const historicoData = historicoResponse.data;
        const componentesData = componentesResponse.data;

        // 2. Cria um "mapa" para encontrar o nome do componente facilmente
        const mapaComponentes = new Map(
          componentesData.map((comp) => [comp.id, comp.nome])
        );

        // 3. Junta os dados: adiciona o nome do componente a cada registo de histórico
        const processado = historicoData
          .map((item) => ({
            ...item,
            nomeComponente:
              mapaComponentes.get(item.componenteId) ||
              "Componente Desconhecido",
          }))
          // Ordena pela data mais recente primeiro
          .sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora));

        setHistoricoProcessado(processado);
      } catch (error) {
        console.error("Erro ao buscar dados do histórico:", error);
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
          <p>Veja todas as entradas e saídas do seu stock.</p>
        </div>

        {loading ? (
          <div className="loading-spinner-container">
            <ClipLoader
              color={"var(--vermelhoSenai)"}
              loading={loading}
              size={50}
            />
          </div>
        ) : (
          <HistoricoLog historicoProcessado={historicoProcessado} />
        )}
      </main>
    </div>
  );
}

export default HistoricoPage;
