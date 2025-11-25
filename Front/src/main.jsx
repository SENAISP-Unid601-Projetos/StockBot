import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

import { ThemeProvider } from "./ThemeContext.jsx";
import MainApp from "./MainApp.jsx"; // Wrapper do Toast/Router

// --- PÁGINAS PÚBLICAS ---
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/loginpage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import RecuperarSenhaPage from "./pages/RecuperarSenhaPage.jsx";

// --- PÁGINAS DO SISTEMA (INTERNAS) ---
import App from "./App.jsx"; // Layout com Sidebar/Navbar
import DashboardPage from "./pages/dashboardpage.jsx";
import ComponentesPage from "./pages/componentepages.jsx";
import HistoricoPage from "./pages/historicopage.jsx";
import ConfiguracoesPage from "./pages/configuracaopages.jsx";
import ReposicaoPage from "./pages/reposicaopage.jsx";
import Aprovacaopages from "./pages/Aprovacaopages.jsx";
import PedidosPage from "./pages/pedidosPage.jsx";
import Recebimentopage from "./pages/Recebimentopage.jsx";

// --- SEGURANÇA ---
import AdminRoute from "./components/Adminroute.jsx";

const router = createBrowserRouter([
  // =================================================================
  // 1. ROTAS PÚBLICAS (Qualquer um acessa)
  // =================================================================
  {
    path: "/",
    element: <LandingPage />, // A Raiz agora é a Landing Page bonita
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/recuperar-senha", element: <RecuperarSenhaPage /> },

  // =================================================================
  // 2. ROTAS DO SISTEMA (Protegidas pelo <App />)
  // =================================================================
  {
    // Não definimos path aqui, o <App> serve como um Layout Wrapper
    element: <App />, 
    children: [
      // Quando logar, vamos para /dashboard
      { path: "/dashboard", element: <DashboardPage /> },
      
      { path: "/componentes", element: <ComponentesPage /> },
      { path: "/historico", element: <HistoricoPage /> },
      { path: "/reposicao", element: <ReposicaoPage /> },
      { path: "/pedidos", element: <PedidosPage /> },

      // --- ÁREA ADMIN ---
      {
        element: <AdminRoute />, 
        children: [
          { path: "/configuracoes", element: <ConfiguracoesPage /> },
          { path: "/aprovacoes", element: <Aprovacaopages /> },
          { path: "/recebimento", element: <Recebimentopage /> },
        ],
      },
    ],
  },

  // Rota "Coringa": Se digitar algo errado, vai pra Landing Page
  { path: "*", element: <LandingPage /> }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <MainApp router={router} />
    </ThemeProvider>
  </React.StrictMode>
);