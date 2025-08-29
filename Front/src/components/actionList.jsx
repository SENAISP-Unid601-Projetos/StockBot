// src/components/ActionList.jsx
import './ActionList.css';

// O componente recebe um título e um array de itens
function ActionList({ title, items }) {
  return (
    <div className="action-card">
      <h3>{title}</h3>
      <ul>
        {/* Verificamos se a lista de itens tem algo.
          Se tiver, usamos .map() para transformar cada item em um <li>.
          Se não, mostramos uma mensagem.
        */}
        {items.length > 0 ? (
          items.map(item => (
            <li key={item.id}>
              {item.nome}
              <span className={`badge ${item.quantidade <= 0 ? 'red' : 'orange'}`}>
                {item.quantidade} un.
              </span>
            </li>
          ))
        ) : (
          <li><p style={{ textAlign: 'center' }}>Nenhum item encontrado.</p></li>
        )}
      </ul>
    </div>
  );
}

export default ActionList;