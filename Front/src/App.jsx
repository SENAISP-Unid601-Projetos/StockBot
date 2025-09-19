import React from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import Sidebar from "./components/sidebar";
import { Box } from "@mui/material";
import { isAuthenticated } from "./services/authService";

function App() {
  const location = useLocation();

  // 1. VERIFICAÇÃO DE SEGURANÇA (o seu código, que está perfeito)
  // Se o utilizador não estiver autenticado, redireciona para a página de login
  if (!isAuthenticated()) {
    // Usamos o `replace` para não deixar a página protegida no histórico do navegador
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. A MOLDURA (o layout visual)
  // Se o utilizador estiver autenticado, mostra a Sidebar e o conteúdo da página
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />

      {/* O Outlet renderiza aqui a "foto", ou seja, o componente da rota filha (Dashboard, Componentes, etc.) */}
      <Outlet />
    </Box>
  );
}

export default App;
