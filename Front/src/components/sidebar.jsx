// src/components/sidebar.jsx

import { NavLink, useNavigate } from 'react-router-dom';
// 1. IMPORTAMOS O NOVO ÍCONE
import { LayoutDashboard, Wrench, History, ArchiveRestore, Settings, LogOut } from 'lucide-react';
import './sidebar.css';

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('jwt-token');
    navigate('/login');
  };

  return (
    <nav className="sidebar">
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>StockBot</h2>
      
      <NavLink to="/" className="nav-link"> 
        <LayoutDashboard size={20} /> <span>Dashboard</span> 
      </NavLink>

      <NavLink to="/componentes" className="nav-link">
        <Wrench size={20} /> <span>Componentes</span>
      </NavLink>

      <NavLink to="/historico" className="nav-link">
        <History size={20} /> <span>Histórico</span>
      </NavLink>
      
      {/* 2. ADICIONAMOS O NOVO LINK AQUI */}
      <NavLink to="/reposicao" className="nav-link">
        <ArchiveRestore size={20} /> <span>Reposição</span>
      </NavLink>
      
      <div style={{ flexGrow: 1 }}></div>
      
      <NavLink to="/configuracoes" className="nav-link">
        <Settings size={20} /> <span>Configurações</span>
      </NavLink>
      
      <button onClick={handleLogout} className="nav-link logout-button">
        <LogOut size={20} /> <span>Sair</span>
      </button>
    </nav>
  );
}

export default Sidebar;
