import React, { useState, useMemo, createContext, useContext } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Importações do MUI para o tema
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import App from "./App.jsx";
import LoginPage from "./pages/loginpage.jsx";
import CadastroUsuariospages from "./pages/cadastroUsuariopages.jsx";
import DashboardPage from "./pages/dashboardpage.jsx";
import ComponentesPage from './pages/componentepages.jsx'
import HistoricoPage from "./pages/historicopage.jsx";
import ConfiguracoesPage from './pages/configuracaopages.jsx';
import ReposicaoPage from './pages/reposicaopage.jsx';
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
  {
    path: "/cadastro",
    element: <CadastroUsuariospages />,
  },
]);

// 1. Criamos um contexto simples para passar a função de toggle
const ColorModeContext = createContext({ toggleColorMode: () => {} });

// Hook customizado para facilitar o uso do contexto
export const useColorMode = () => useContext(ColorModeContext);

// 2. Componente principal que gerenciará o estado do tema
function MainApp() {
  const [mode, setMode] = useState(() => localStorage.getItem('themeMode') || 'light');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light';
          localStorage.setItem('themeMode', newMode);
          return newMode;
        });
      },
    }),
    [],
  );

  // 3. Criamos o tema do MUI dinamicamente com base no estado 'mode'
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode, // 'light' ou 'dark'
          ...(mode === 'light'
            ? {
                // Paleta para o modo claro
                primary: { main: '#C00000' }, // Vermelho SENAI
                background: { default: '#f4f4f4', paper: '#ffffff' },
              }
            : {
                // Paleta para o modo escuro
                primary: { main: '#C00000' },
                background: { default: '#121212', paper: '#1e1e1e' },
              }),
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <MuiThemeProvider theme={theme}>
        {/* CssBaseline aplica um reset de CSS e a cor de fundo do tema */}
        <CssBaseline />
        <RouterProvider router={router} />
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          theme="colored"
        />
      </MuiThemeProvider>
    </ColorModeContext.Provider>
  );
}


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MainApp />
  </React.StrictMode>
);

