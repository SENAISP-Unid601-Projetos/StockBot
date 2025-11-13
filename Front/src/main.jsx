import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

import { ThemeProvider } from "./ThemeContext.jsx";
import App from "./App.jsx";
import LoginPage from "./pages/loginpage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx"; // <-- ADICIONAR IMPORTAÇÃO
import DashboardPage from "./pages/dashboardpage.jsx";
import ComponentesPage from "./pages/componentepages.jsx";
import HistoricoPage from "./pages/historicopage.jsx";
import ConfiguracoesPage from "./pages/configuracaopages.jsx";
import ReposicaoPage from "./pages/reposicaopage.jsx";
import AprovacoesPage from "./pages/aprovacoesPage.jsx";
import PedidosPage from "./pages/pedidosPage.jsx";
import MainApp from "./MainApp.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "/componentes", element: <ComponentesPage /> },
      { path: "/historico", element: <HistoricoPage /> },
      { path: "/reposicao", element: <ReposicaoPage /> },
      { path: "/configuracoes", element: <ConfiguracoesPage /> },
      { path: "/aprovacoes", element: <AprovacoesPage /> },
      { path: "/pedidos", element: <PedidosPage /> },
    ],
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> }, // <-- ADICIONAR ROTA
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <MainApp router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
