import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";
import Sidebar from "../components/sidebar";
import ComponentesTable from "../components/componentestable";
import ModalComponente from "../components/modalcomponente";
import { toast } from "react-toastify";
import { ClipLoader } from 'react-spinners';
import '../styles/compoenetepages.css';

function ComponentesPage() {
  const [componentes, setComponentes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingComponente, setEditingComponente] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  console.log("🎬 ComponentesPage renderizando...");
  console.log("📊 Estado - componentes:", componentes);
  console.log("📊 Estado - isModalOpen:", isModalOpen);
  console.log("📊 Estado - editingComponente:", editingComponente);
  console.log("📊 Estado - isAdmin:", isAdmin);
  console.log("⏳ Estado - loading:", loading);

  useEffect(() => {
    console.log("🔍 useEffect executando - verificação de token e fetch data");
    
    const token = localStorage.getItem("jwt-token");
    console.log("📝 Token encontrado no localStorage:", token ? "SIM" : "NÃO");
    
    if (token) {
      try {
        console.log("🔓 Tentando decodificar token...");
        const decodedToken = jwtDecode(token);
        console.log("📋 Token decodificado:", decodedToken);
        
        const userRoles = decodedToken.roles || [];
        console.log("👥 Roles do usuário:", userRoles);
        
        const adminCheck = userRoles.includes("ROLE_ADMIN");
        console.log("🛡️  É admin?", adminCheck);
        
        setIsAdmin(adminCheck);
      } catch (error) {
        console.error("❌ Erro ao decodificar o token:", error);
        console.error("🔧 Detalhes do erro:", error.message);
      }
    } else {
      console.warn("⚠️  Nenhum token encontrado no localStorage");
    }
    
    fetchData();
  }, []);

  const fetchData = async () => {
    console.log("🔄 Iniciando fetchData...");
    console.log("⏳ Ativando loading...");
    setLoading(true);
    
    try {
      console.log("🌐 Fazendo requisição GET para /api/componentes");
      const response = await api.get("/api/componentes");
      console.log("✅ Resposta da API recebida");
      console.log("📦 Status da resposta:", response.status);
      console.log("📊 Dados recebidos:", response.data);
      console.log("🔢 Número de componentes:", response.data.length);
      
      setComponentes(response.data);
      console.log("🗃️ Componentes atualizados no estado");
      
    } catch (error) {
      console.error("❌ Erro ao buscar componentes:", error);
      console.error("🔧 Status do erro:", error.response?.status);
      console.error("📝 Mensagem do erro:", error.response?.data || error.message);
      console.error("🔗 URL da requisição:", error.config?.url);
      toast.error("Não foi possível carregar os componentes.");
    } finally {
      console.log("⏳ Desativando loading...");
      setLoading(false);
      console.log("✅ FetchData concluído");
    }
  };

  const handleAdd = () => {
    console.log("➕ Botão Adicionar clicado");
    setEditingComponente(null);
    setIsModalOpen(true);
    console.log("📱 Modal aberto para adicionar novo componente");
  };

  const handleEdit = (componente) => {
    console.log("✏️  Botão Editar clicado para componente:", componente);
    console.log("🔍 ID do componente para edição:", componente?.id);
    setEditingComponente(componente);
    setIsModalOpen(true);
    console.log("📱 Modal aberto para edição");
  };

  const handleDelete = async (id) => {
    console.log("🗑️  Tentativa de excluir componente ID:", id);
    if (window.confirm("Tem a certeza que quer excluir este componente?")) {
      try {
        console.log("🌐 Fazendo requisição DELETE para /api/componentes/" + id);
        const response = await api.delete(`/api/componentes/${id}`);
        console.log("✅ Componente excluído com sucesso");
        console.log("📋 Status da resposta:", response.status);
        toast.success("Componente excluído com sucesso!");
        fetchData();
      } catch (error) {
        console.error("❌ Erro ao excluir componente:", error);
        console.error("🔧 Status do erro:", error.response?.status);
        console.error("📝 Mensagem do erro:", error.response?.data || error.message);
        toast.error("Erro ao excluir componente.");
      }
    } else {
      console.log("❌ Exclusão cancelada pelo usuário");
    }
  };

  const handleSave = () => {
    console.log("💾 Salvamento concluído no modal");
    setIsModalOpen(false);
    console.log("📱 Modal fechado");
    fetchData();
  };

  console.log("🎯 Renderizando interface...");
  console.log("👤 Permissões de admin para renderizar botão:", isAdmin);
  console.log("📋 Número de componentes na tabela:", componentes.length);
  console.log("⏳ Mostrando spinner?", loading);

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

        {/* Adiciona o spinner enquanto os dados carregam */}
        {loading ? (
          <div className="loading-spinner-container">
            <ClipLoader color={"var(--vermelhoSenai)"} size={50} />
          </div>
        ) : (
          <ComponentesTable
            componentes={componentes}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isAdmin={isAdmin}
          />
        )}

        {isModalOpen && (
          <ModalComponente
            onClose={() => {
              console.log("❌ Modal fechado pelo usuário");
              setIsModalOpen(false);
            }}
            onSave={handleSave}
            componente={editingComponente}
          />
        )}
      </main>
    </div>
  );
}

export default ComponentesPage;