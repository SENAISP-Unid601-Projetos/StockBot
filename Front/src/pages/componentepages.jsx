// src/pages/componentepages.jsx
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Importa o decodificador de token
import api from "../services/api";
import Sidebar from "../components/sidebar";
import ComponentesTable from "../components/componentestable";
import ModalComponente from "../components/modalcomponente";
import { toast } from "react-toastify";
import "./compoenetepages.css"; // Mantenha o seu CSS

function ComponentesPage() {
  const [componentes, setComponentes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingComponente, setEditingComponente] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // Novo estado para verificar se é admin

  useEffect(() => {
    // Verifica o cargo do utilizador ao carregar a página
    const token = localStorage.getItem("jwt-token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const userRoles = decodedToken.roles || [];
      setIsAdmin(userRoles.includes("ROLE_ADMIN"));
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
        console.error("Erro ao excluir:", error);
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
          {/* O botão "Adicionar Componente" só aparece se for admin */}
          {isAdmin && (
            <button className="action-button" onClick={handleAdd}>
              Adicionar Componente
            </button>
          )}
        </div>

        <ComponentesTable
          componentes={componentes}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isAdmin={isAdmin} // Passa a informação se é admin para a tabela
        />

        {isModalOpen && (
          <ModalComponente
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
