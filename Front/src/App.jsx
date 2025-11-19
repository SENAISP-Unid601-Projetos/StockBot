import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CircularProgress, Box } from "@mui/material";

// --- 1. IMPORTAR CONTEXTOS (Providers) ---
import { AuthProvider } from "./context/AuthProvider";
import { ThemeProvider } from "./context/ThemeProvider";

// --- 2. IMPORTAR LAYOUT E PROTEÇÃO ---
import MainLayout from "./layout/MainLayout";
import { PrivateRoute } from "./Route/PrivateRoute"; // Usa aquele componente único que criamos

// --- 3. LAZY LOADING DAS PÁGINAS ---
// Certifique-se que os nomes dos arquivos estão exatos (Case Sensitive no Render!)
const LoginPage = lazy(() => import("./pages/loginpage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const DashboardPage = lazy(() => import("./pages/dashboardpage"));
const ComponentesPage = lazy(() => import("./pages/componentepages"));
const HistoricoPage = lazy(() => import("./pages/historicopage"));
const ReposicaoPage = lazy(() => import("./pages/reposicaopage"));
const ConfiguracoesPage = lazy(() => import("./pages/configuracaopages")); // Verifique o nome
const AjudaPage = lazy(() => import("./pages/ajudapage"));
const UserManagementPage = lazy(() => import("./pages/UserManagementpage"));
const AprovacoesPage = lazy(() => import("./pages/Aprovacaopages")); // Verifique o nome
const PedidosPage = lazy(() => import("./pages/Pedidopages")); // Verifique o nome

// Componente de Loading para o Suspense
const Loading = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  >
    <CircularProgress />
  </Box>
);

function App() {
  return (
    <BrowserRouter>
      {/* 1. O TEMA envolve tudo (para que o Login já tenha estilo) */}
      <ThemeProvider>
        {/* 2. A AUTENTICAÇÃO vem dentro (para usar o navigate do Router) */}
        <AuthProvider>
          {/* 3. SUSPENSE lida com o carregamento das páginas lazy */}
          <Suspense fallback={<Loading />}>
            <Routes>
              {/* --- ROTAS PÚBLICAS --- */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* --- ROTAS PROTEGIDAS (Obrigatório estar logado) --- */}
              {/* O PrivateRoute verifica o login. Se passar, renderiza o MainLayout */}
              <Route element={<PrivateRoute />}>
                <Route element={<MainLayout />}>
                  {/* Rotas Acessíveis para USER e ADMIN */}
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/componentes" element={<ComponentesPage />} />
                  <Route path="/historico" element={<HistoricoPage />} />
                  <Route path="/reposicao" element={<ReposicaoPage />} />
                  <Route path="/pedidos" element={<PedidosPage />} />
                  <Route
                    path="/configuracoes"
                    element={<ConfiguracoesPage />}
                  />
                  <Route path="/ajuda" element={<AjudaPage />} />

                  {/* --- ROTAS EXCLUSIVAS DE ADMIN --- */}
                  {/* Passamos adminOnly={true} para a proteção extra */}
                  <Route element={<PrivateRoute adminOnly={true} />}>
                    <Route
                      path="/gerenciar-usuarios"
                      element={<UserManagementPage />}
                    />
                    <Route path="/aprovacoes" element={<AprovacoesPage />} />
                  </Route>
                </Route>
              </Route>

              {/* Rota Coringa (404) -> Redireciona para a Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>

          {/* Notificações globais */}
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            theme="colored"
          />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
