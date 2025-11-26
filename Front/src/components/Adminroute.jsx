// Em: src/components/AdminRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isAdmin } from "../services/authService";

// Este componente funciona como um "porteiro" para rotas
function AdminRoute() {
  const isUserAdmin = isAdmin(); // Verifica se o usuário logado é Admin

  if (!isUserAdmin) {
    // Se NÃO for Admin, ele "expulsa" o usuário,
    // redirecionando para a página inicial (Dashboard)
    return <Navigate to="/" replace />;
  }

  // Se FOR Admin, ele permite o acesso e renderiza
  // a página que está "dentro" dele no main.jsx (usando o <Outlet />)
  return <Outlet />;
}

export default AdminRoute;
