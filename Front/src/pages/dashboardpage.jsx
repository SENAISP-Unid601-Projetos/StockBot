import { useState, useEffect } from 'react';
import api from '../services/api';

// Imports para o PDF
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // MUDANÇA 1: Importa a função diretamente

// Imports dos seus componentes
import Sidebar from '../components/sidebar';
import KpiCard from '../components/kpicard';
import ActionList from '../components/actionlist';
import CategoryChart from '../components/categoriachart';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

function DashboardPage() {
  const [componentes, setComponentes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await api.get('/api/componentes');
      if (Array.isArray(response.data)) {
        setComponentes(response.data);
      }
    } catch (error) {
      console.error("Erro ao buscar dados!", error);
      toast.error("Não foi possível carregar os dados do dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGeneratePdf = async () => {
    toast.info("A gerar o relatório em PDF...");
    try {
      const [historicoResponse, componentesResponse] = await Promise.all([
        api.get('/api/historico'),
        api.get('/api/componentes')
      ]);
      const historicoData = historicoResponse.data;
      const componentesData = componentesResponse.data;
      
      const mapaComponentes = new Map(componentesData.map(comp => [comp.id, comp.nome]));
      const historicoProcessado = historicoData
        .map(item => ({
          ...item,
          nomeComponente: mapaComponentes.get(item.componenteId) || 'N/A'
        }))
        .sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora));

      const doc = new jsPDF();
      
      doc.setFontSize(18);
      doc.text("Relatório de Movimentações de Stock", 14, 22);
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 30);

      const tableColumn = ["Data/Hora", "Componente", "Tipo", "Qtd.", "Utilizador"];
      const tableRows = [];
      historicoProcessado.forEach(item => {
        const itemData = [
          new Date(item.dataHora).toLocaleString('pt-BR'),
          item.nomeComponente,
          item.tipo,
          item.quantidade,
          item.usuario
        ];
        tableRows.push(itemData);
      });

      // MUDANÇA 2: Usa a função autoTable diretamente, passando o 'doc'
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 40,
      });

      doc.save('relatorio-historico.pdf');
      toast.success("Relatório gerado com sucesso!");

    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Não foi possível gerar o relatório.");
    }
  };

  const totalUnidades = componentes.reduce((total, comp) => total + comp.quantidade, 0);
  const itensEmFalta = componentes.filter(comp => comp.quantidade <= 0);
  const itensEstoqueBaixo = componentes.filter(comp => comp.quantidade > 0 && comp.quantidade <= 5);

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <div className="header-dashboard">
          <div className="header-title">
            <h1>Dashboard</h1>
            <p>Olá, Utilizador! Aqui está um resumo inteligente do seu stock.</p>
          </div>
          <button className="action-button" onClick={handleGeneratePdf}>
            Gerar Relatório
          </button>
        </div>

        {loading ? (
          <div className="loading-spinner-container">
            <ClipLoader color={"var(--vermelhoSenai)"} loading={loading} size={50} />
          </div>
        ) : (
          <>
            <div className="dashboard-grid">
              <KpiCard title="Total de Componentes" value={componentes.length} description="Componentes cadastrados" />
              <KpiCard title="Itens em Stock" value={totalUnidades} description="Unidades totais" />
              <KpiCard title="Itens em Falta" value={itensEmFalta.length} description="Ação imediata necessária" isCritical={true} />
            </div>
            <div className="section-title"><h2>Ação Imediata</h2></div>
            <div className="action-grid">
              <ActionList title="Itens em Falta (Stock Zerado)" items={itensEmFalta} />
              <ActionList title="Itens com Stock Baixo" items={itensEstoqueBaixo} />
            </div>
            <div className="charts-grid" style={{ marginTop: '2rem' }}>
              <CategoryChart componentes={componentes} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default DashboardPage;
