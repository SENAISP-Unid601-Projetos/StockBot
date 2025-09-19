import { useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";
import { toast } from "react-toastify";
import { ThemeContext } from "../context/ThemeContext.jsx";

// Componentes do MUI e outros
import {
  Box,
  Container,
  Typography,
  Paper,
  FormControlLabel,
  Switch,
  TextField,
  Button as MuiButton,
  CircularProgress,
} from "@mui/material";
import Sidebar from "../components/sidebar";
import UserManagement from "../components/usermanagement.jsx";
import ModalAddUser from "../components/modaladduser.jsx";

function ConfiguracoesPage() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddUserModalVisible, setAddUserModalVisible] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("jwt-token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.roles?.includes("ROLE_ADMIN")) {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Erro ao descodificar o token:", error);
      }
    }
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Erro ao carregar utilizadores:", error);
      toast.error("Não foi possível carregar a lista de utilizadores.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/auth/verify-password", { password });
      setIsVerified(true);
      fetchUsers(); // fetchUsers já gere o seu próprio loading state
    } catch (error) {
      console.error("Erro na verificação de senha:", error);
      toast.error("Senha incorreta. Acesso negado.");
      setIsVerified(false);
      setLoading(false); // Precisamos de parar o loading aqui no caso de erro
    }
    // O finally foi removido daqui porque o fetchUsers já o tem.
    // O setLoading(false) só é necessário no catch agora.
  };

  const handleDeleteUser = async (id) => {
    if (
      window.confirm("Tem a certeza de que deseja excluir este utilizador?")
    ) {
      setLoading(true); // ← MELHORIA: Inicia o loading
      try {
        await api.delete(`/api/users/${id}`);
        toast.success("Utilizador excluído com sucesso!");
        fetchUsers(); // ← IMPORTANTE: Recarregar a lista após exclusão
      } catch (error) {
        console.error("Erro ao excluir utilizador:", error);
        toast.error("Falha ao excluir o utilizador.");
      } finally {
        setLoading(false); // ← IMPORTANTE: Parar o loading em qualquer caso
      }
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, backgroundColor: "#f8f9fa" }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            sx={{ mb: 4 }}
          >
            Configurações
          </Typography>

          {/* Secção de Aparência com componentes MUI */}
          <Paper sx={{ p: 3, mb: 4, boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom>
              Aparência
            </Typography>
            <FormControlLabel
              control={
                <Switch checked={theme === "dark"} onChange={toggleTheme} />
              }
              label="Modo Escuro"
            />
          </Paper>

          {/* Secção de Gestão de Utilizadores */}
          {isAdmin && (
            <Paper sx={{ p: 3, boxShadow: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6">Gestão de Utilizadores</Typography>
                <MuiButton
                  variant="contained"
                  onClick={() => setAddUserModalVisible(true)}
                  sx={{
                    backgroundColor: "#ce0000",
                    "&:hover": { backgroundColor: "#a40000" },
                  }}
                >
                  Adicionar Utilizador
                </MuiButton>
              </Box>

              {!isVerified ? (
                <Box
                  component="form"
                  onSubmit={handleVerifyPassword}
                  sx={{ mt: 2, display: "flex", gap: 2, alignItems: "center" }}
                >
                  <TextField
                    type="password"
                    label="Senha de Administrador"
                    variant="outlined"
                    size="small"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <MuiButton type="submit" variant="contained">
                    Verificar
                  </MuiButton>
                </Box>
              ) : loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <UserManagement users={users} onDeleteUser={handleDeleteUser} />
              )}
            </Paper>
          )}
        </Container>
        <ModalAddUser
          isVisible={isAddUserModalVisible}
          onClose={() => setAddUserModalVisible(false)}
          onUserAdded={fetchUsers}
        />
      </Box>
    </Box>
  );
}

export default ConfiguracoesPage;
