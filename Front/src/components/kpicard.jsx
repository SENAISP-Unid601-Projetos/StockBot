// src/components/KpiCard.jsx
import './KpiCard.css'; // Vamos criar este arquivo de estilo a seguir

// Este componente recebe "props" (propriedades) com os dados a serem exibidos.
function KpiCard({ title, value, description, isCritical = false }) {
  
  // Define a classe CSS com base na propriedade 'isCritical'
  const cardClassName = isCritical ? "kpi-card critical" : "kpi-card";

  return (
    <div className={cardClassName}>
      <div className="card-header">
        <span>{title}</span>
        {/* Aqui você pode adicionar um ícone depois, se quiser */}
      </div>
      <span className="number">{value}</span>
      <span className="description">{description}</span>
    </div>
  );
}

export default KpiCard;