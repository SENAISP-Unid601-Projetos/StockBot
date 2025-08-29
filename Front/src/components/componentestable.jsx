// src/components/componentestable.jsx
import { Edit, Trash2 } from "lucide-react";
import "./componentestable.css";

function ComponentesTable({ componentes, onEdit, onDelete, isAdmin }) {
  // Recebe isAdmin como prop
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Património</th>
            <th>Categoria</th>
            <th>Localização</th>
            <th>Quantidade</th>
            {/* A coluna "Ações" só aparece se for admin */}
            {isAdmin && <th>Ações</th>}
          </tr>
        </thead>
        <tbody>
          {componentes.length > 0 ? (
            componentes.map((componente) => (
              <tr key={componente.id}>
                <td>{componente.nome}</td>
                <td>{componente.codigoPatrimonio}</td>
                <td>{componente.categoria}</td>
                <td>{componente.localizacao}</td>
                <td>{componente.quantidade}</td>
                {/* As ações só aparecem se for admin */}
                {isAdmin && (
                  <td>
                    <button
                      onClick={() => onEdit(componente)}
                      className="icon-button"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(componente.id)}
                      className="icon-button delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={isAdmin ? "6" : "5"}>
                Nenhum componente encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ComponentesTable;
