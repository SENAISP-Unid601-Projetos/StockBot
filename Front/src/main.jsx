import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import App from "./App.jsx";
import LoginPage from "./pages/loginpage.jsx";
import DashboardPage from "./pages/dashboardpage.jsx";
import ComponentesPage from './pages/componentepages.jsx'
import HistoricoPage from "./pages/historicopage.jsx";
import ConfiguracoesPage from './pages/configuracaopages.jsx';
import ReposicaoPage from './pages/reposicaopage.jsx'; 
import { ThemeProvider } from './context/ThemeContext.jsx'; 
import './index.css'

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
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
      <ToastContainer 
        position="bottom-right"
        autoClose={3000} 
        hideProgressBar={false}
        theme="colored"
      />
    </ThemeProvider>
  </React.StrictMode>
);

