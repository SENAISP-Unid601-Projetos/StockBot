import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";
import Sidebar from "../components/sidebar";
import ComponentesTable from "../components/componentestable";
import ModalComponente from "../components/modalcomponente";
import { toast } from "react-toastify";
import '../styles/compoenetepages.css';

function ComponentesPage() {
  const [componentes, setComponentes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingComponente, setEditingComponente] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwt-token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userRoles = decodedToken.roles || [];
        setIsAdmin(userRoles.includes("ROLE_ADMIN"));
      } catch (error) {
        console.error("Erro ao decodificar o token:", error);
      }
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get("/api/componentes");
      setComponentes(response.data);
    } catch (error) {
      console.error("Erro ao buscar componentes:", error);
    }
  };

  const handleAdd = () => {
    setEditingComponente(null);
    setIsModalOpen(true);
  };

  const handleEdit = (componente) => {
    setEditingComponente(componente);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem a certeza que quer excluir este componente?")) {
      try {
        await api.delete(`/api/componentes/${id}`);
        toast.success("Componente excluído com sucesso!");
        fetchData();
      } catch (error) {
        toast.error("Erro ao excluir componente.");
      }
    }
  };

  const handleSave = () => {
    setIsModalOpen(false);
    fetchData();
  };

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <div className="header-dashboard">
          <h1>Gestão de Componentes</h1>
          {isAdmin && (
            <button 
              type="button"
              className="action-button" 
              onClick={handleAdd}
            >
              Adicionar Componente
            </button>
          )}
        </div>

        <ComponentesTable
          componentes={componentes}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isAdmin={isAdmin}
        />

        {isModalOpen && (
          <ModalComponente
            isVisible={isModalOpen} // <-- CORRIGIDO
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
            componente={editingComponente}
          />
        )}
      </main>
    </div>
  );
}

export default ComponentesPage;
