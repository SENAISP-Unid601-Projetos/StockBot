import React from "react";

import ReactDOM from "react-dom/client";

import { createBrowserRouter } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";

import "./index.css";

import { ThemeProvider } from "./ThemeContext.jsx";

import App from "./App.jsx";

import LoginPage from "./pages/loginpage.jsx";

import RegisterPage from "./pages/RegisterPage.jsx";

import DashboardPage from "./pages/dashboardpage.jsx";

import ComponentesPage from "./pages/componentepages.jsx";

import HistoricoPage from "./pages/historicopage.jsx";

import ConfiguracoesPage from "./pages/configuracaopages.jsx";

import ReposicaoPage from "./pages/reposicaopage.jsx";

import Aprovacaopages from "./pages/Aprovacaopages.jsx";

import PedidosPage from "./pages/pedidosPage.jsx";

import Recebimentopage from "./pages/Recebimentopage.jsx";

import UserManagementPage from "./pages/UserManagementPage.jsx"; // <-- 1. IMPORTAR A NOVA PÁGINA

import RecuperarSenhaPage from "./pages/RecuperarSenhaPage.jsx";

import AdminRoute from "./components/Adminroute.jsx";

import MainApp from "./MainApp.jsx";

import LandingPage from "./pages/LandingPage.jsx";

import AjudaPage from "./pages/Ajudapage.jsx";

const router = createBrowserRouter([
  {
    path: "/",

    element: <App />,

    children: [
      // --- ROTAS PÚBLICAS ---

      { index: true, element: <DashboardPage /> },

      { path: "/componentes", element: <ComponentesPage /> },

      { path: "/historico", element: <HistoricoPage /> },

      { path: "/reposicao", element: <ReposicaoPage /> },

      { path: "/pedidos", element: <PedidosPage /> },

      { path: "/configuracoes", element: <ConfiguracoesPage /> },

      { path: "/ajuda", element: <AjudaPage /> },

      // --- ROTAS PROTEGIDAS (Admin) ---

      {
        element: <AdminRoute />,

        children: [
          { path: "/aprovacoes", element: <Aprovacaopages /> },

          { path: "/recebimento", element: <Recebimentopage /> },

          { path: "/usuarios", element: <UserManagementPage /> }, // <-- 2. ADICIONAR A ROTA
        ],
      },
    ],
  },

  { path: "/welcome", element: <LandingPage /> },

  { path: "/login", element: <LoginPage /> },

  { path: "/register", element: <RegisterPage /> },

  { path: "/recuperar-senha", element: <RecuperarSenhaPage /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <MainApp router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
