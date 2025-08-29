// src/components/categoriachart.jsx
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './categoriachart.css';

// Registra os plugins necessários do Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

function CategoryChart({ componentes }) {

  // MUDANÇA: Agora processamos os dados por NOME do componente, não por categoria.
  const dadosGrafico = {};
  componentes.forEach(comp => {
    // Usamos o nome do componente como chave e somamos a sua quantidade
    dadosGrafico[comp.nome] = (dadosGrafico[comp.nome] || 0) + comp.quantidade;
  });

  // Prepara os dados para o formato que o Chart.js entende
  const chartData = {
    labels: Object.keys(dadosGrafico), // Os nomes dos componentes
    datasets: [
      {
        label: 'Quantidade em Stock',
        data: Object.values(dadosGrafico), // As quantidades de cada componente
        backgroundColor: [ // Adicionei mais cores para mais componentes
          '#002D5B', '#C00000', '#FFD700', '#2ecc71', '#9b59b6',
          '#3498db', '#e67e22', '#1abc9c', '#e74c3c', '#f1c40f'
        ],
        borderColor: '#ffffff',
        borderWidth: 2,
        hoverOffset: 8
      },
    ],
  };

  // Opções para customizar a aparência do gráfico
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Distribuição de Quantidade por Componente', // Título atualizado
        font: {
          size: 18
        }
      },
    },
  };

  return (
    <div className="chart-card">
      <Doughnut data={chartData} options={chartOptions} />
    </div>
  );
}

export default CategoryChart;
