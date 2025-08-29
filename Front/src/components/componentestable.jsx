import './componentestable.css';

// O componente agora recebe as funções onEdit e onDelete
function ComponentesTable({ componentes, onEdit, onDelete }) {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Categoria</th>
            <th>Quantidade</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {componentes.length === 0 ? (
            <tr>
              <td colSpan="5">Nenhum componente encontrado.</td>
            </tr>
          ) : (
            componentes.map(comp => (
              <tr key={comp.id}>
                <td>{comp.id}</td>
                <td>{comp.nome}</td>
                <td>{comp.categoria}</td>
                <td>{comp.quantidade}</td>
                <td className="actions">
                  <button className="btn-edit" onClick={() => onEdit(comp)}>
                    Editar
                  </button>
                  <button className="btn-delete" onClick={() => onDelete(comp.id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ComponentesTable;
