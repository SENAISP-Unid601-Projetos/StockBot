// src/components/ActionList.jsx
import '../styles/actionlist.css'; // Certifique-se de que o ficheiro CSS está corretamente nomeado

// O componente recebe um título e um array de itens
function ActionList({ title, items }) {
  console.log("🎬 ActionList renderizando...");
  console.log("📋 Props recebidas - title:", title);
  console.log("📦 Props recebidas - items:", items);
  console.log("🔢 Quantidade de items:", items ? items.length : "null/undefined");

  // Verifica se items é válido antes de tentar acessar length
  if (!items) {
    console.warn("⚠️  A prop 'items' é null ou undefined");
  } else if (!Array.isArray(items)) {
    console.error("❌ A prop 'items' não é um array:", typeof items);
  }

  return (
    <div className="action-card">
      <h3>{title}</h3>
      <ul>
        {/* Verificamos se a lista de itens tem algo.
          Se tiver, usamos .map() para transformar cada item em um <li>.
          Se não, mostramos uma mensagem.
        */}
        {items && Array.isArray(items) && items.length > 0 ? (
          items.map(item => {
            console.log("📝 Processando item:", item);
            
            // Verifica se o item tem a estrutura esperada
            if (!item || typeof item !== 'object') {
              console.error("❌ Item inválido:", item);
              return null;
            }
            
            if (!item.id) {
              console.warn("⚠️  Item sem ID:", item);
            }
            
            return (
               <li key={item.id || index}>
                {item.nome || "Nome não disponível"}
                <span className={`badge ${item.quantidade <= 0 ? 'red' : 'orange'}`}>
                  {item.quantidade} un.
                </span>
              </li>
            );
          })
        ) : (
          <li>
            <p style={{ textAlign: 'center' }}>
              {!items ? "Dados não carregados" : 
               !Array.isArray(items) ? "Formato de dados inválido" : 
               "Nenhum item encontrado."}
            </p>
          </li>
        )}
      </ul>
    </div>
  );
}

export default ActionList;