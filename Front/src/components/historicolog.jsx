import './historicolog.css';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

// Este componente recebe a lista de histórico já processada
function HistoricoLog({ historicoProcessado }) {
  // Função para formatar a data para o padrão brasileiro
  const formatarData = (dataString) => {
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dataString).toLocaleString('pt-BR', options);
  };

  return (
    <div className="historico-container">
      {historicoProcessado.length === 0 ? (
        <p>Nenhuma movimentação encontrada.</p>
      ) : (
        <ul className="timeline">
          {historicoProcessado.map(item => (
            <li key={item.id} className="timeline-item">
              <div className={`timeline-icon ${item.tipo?.toLowerCase()}`}>
                {item.tipo === 'ENTRADA' ? <ArrowUpCircle /> : <ArrowDownCircle />}
              </div>
              <div className="timeline-content">
                <span className="timeline-header">
                  <strong>{item.nomeComponente || `Componente ID: ${item.componenteId}`}</strong>
                  <span className="timeline-user">por {item.usuario || 'Sistema'}</span>
                </span>
                <p>
                  {item.tipo === 'ENTRADA' ? 'Entrada de' : 'Saída de'} <strong>{item.quantidade}</strong> unidade(s).
                </p>
                <span className="timeline-date">{formatarData(item.dataHora)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default HistoricoLog;
