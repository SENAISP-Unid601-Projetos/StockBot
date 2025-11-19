import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/Authcontext";
import { CircularProgress, Box } from "@mui/material";

// adminOnly = true significa que só ADMIN pode ver
export function PrivateRoute({ adminOnly = false }) {
  const { authenticated, loading, isAdmin } = useContext(AuthContext);

  if (loading) {
    return (
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
  }

  // 1. Se não estiver logado -> Manda pro Login
  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. Se a rota for só para ADMIN e o usuário não for -> Manda pro Dashboard (ou 403)
  if (adminOnly && !isAdmin()) {
    // O usuário está logado, mas não tem permissão.
    // Vamos redirecionar para a Home/Dashboard padrão
    return <Navigate to="/" replace />;
  }

  // 3. Se passou nos testes, renderiza a página filha (Outlet)
  return <Outlet />;
}
