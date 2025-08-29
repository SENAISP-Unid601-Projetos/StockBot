// src/pages/ReposicaoPage.jsx
import { useState, useEffect } from 'react';
import api from '../services/api';
import Sidebar from '../components/sidebar';
import ActionList from '../components/actionlist'; // Reutiliza o componente de lista de ação
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';

// Imports para o PDF
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function ReposicaoPage() {
  const [componentes, setComponentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [threshold, setThreshold] = useState(5); // Estado para o limite de stock baixo

  useEffect(() => {
    fetchData();
    fetchThreshold(); // Busca o limite ao carregar a página
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/api/componentes');
      if (Array.isArray(response.data)) {
        setComponentes(response.data);
      }
    } catch (error) {
      console.error("Erro ao buscar dados!", error);
      toast.error("Não foi possível carregar os dados de reposição.");
    } finally {
      setLoading(false);
    }
  };

  const fetchThreshold = async () => {
    try {
      const response = await api.get('/api/settings/lowStockThreshold');
      setThreshold(response.data); // Atualiza o limite com o valor do backend
    } catch (error) {
      console.error("Erro ao buscar limite de stock baixo!", error);
      toast.error("Não foi possível carregar o limite de stock baixo.");
      setThreshold(5); // Volta para o padrão se houver erro
    }
  };

  const itensEmFalta = componentes.filter(comp => comp.quantidade <= 0);
  const itensEstoqueBaixo = componentes.filter(comp => comp.quantidade > 0 && comp.quantidade <= threshold); // Usa o limite dinâmico

  // MUDANÇA: NOVA FUNÇÃO PARA GERAR PDF DE PEDIDO
  const handleGerarPedidoPDF = () => {
    const itensParaPedido = [...itensEmFalta, ...itensEstoqueBaixo];

    if (itensParaPedido.length === 0) {
      toast.warn("Não há itens em falta ou com estoque baixo para gerar um pedido.");
      return;
    }

    toast.info("A gerar o PDF do pedido de compra...");

    try {
      const doc = new jsPDF();
      
      // Título do documento
      doc.setFontSize(18);
      doc.text("Pedido de Compra - Itens em Reposição", 14, 22);
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 14, 30);
      doc.text(`Limite de Estoque Baixo: ${threshold} unidades`, 14, 37);

      const tableColumn = ["Nome do Componente", "Património", "Stock Atual", "Sugestão de Compra"];
      const tableRows = [];

      itensParaPedido.forEach(item => {
        // Sugestão simples: comprar 10 unidades ou até ter 10 no total, o que for maior
        const quantidadeAtual = item.quantidade;
        const quantidadeSugerida = Math.max(10, threshold + 5 - quantidadeAtual); // Ex: Se limiar=5, sugere 10 para zerado, ou 5+5-2=8 para 2 em stock.
        
        tableRows.push([
          item.nome,
          item.codigoPatrimonio,
          quantidadeAtual,
          quantidadeSugerida
        ]);
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 45,
        styles: { fontSize: 10, cellPadding: 3, overflow: 'linebreak' },
        headStyles: { fillColor: [200, 0, 0], textColor: [255, 255, 255] }, // Vermelho SENAI para o cabeçalho
        alternateRowStyles: { fillColor: [240, 240, 240] },
      });

      // Salva o PDF
      doc.save('pedido-de-compra.pdf');
      toast.success("PDF de pedido de compra gerado com sucesso!");

    } catch (error) {
      console.error("Erro ao gerar PDF de pedido:", error);
      toast.error("Não foi possível gerar o PDF do pedido de compra.");
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <div className="header-dashboard">
          <div className="header-title">
             <h1>Ações de Reposição</h1>
             <p>Gerencie aqui os componentes que precisam de atenção imediata.</p>
          </div>
          {/* Botão para gerar o PDF */}
          <button className="action-button" onClick={handleGerarPedidoPDF}>
            Gerar PDF de Pedido
          </button>
        </div>

        {loading ? (
          <div className="loading-spinner-container">
            <ClipLoader color={"var(--vermelhoSenai)"} loading={loading} size={50} />
          </div>
        ) : (
          <div className="action-grid">
            {/* Itens em Falta */}
            <div className="action-list-wrapper">
              <ActionList title="Itens em Falta (Estoque Zerado)" items={itensEmFalta} />
            </div>

            {/* Itens com Estoque Baixo */}
            <div className="action-list-wrapper">
              <ActionList title={`Itens com Estoque Baixo (abaixo de ${threshold} un.)`} items={itensEstoqueBaixo} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ReposicaoPage;
