import { useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
// import { useColorMode } from "../useColorMode.js" // <-- Removido (não é mais necessário aqui)
import { useTheme } from "@mui/material/styles"; // <-- Pode ser removido se não usar o themeMui
import { isAdmin } from "../services/authService";

import {
  Box,
  Container,
  Typography,
  Paper,
  // FormControlLabel, // <-- Removido
  // Switch, // <-- Removido
  TextField,
  Button as MuiButton,
  CircularProgress,
  Grid,
} from "@mui/material";
import UserManagement from "../components/usermanagement.jsx";
import ModalAddUser from "../components/modaladduser.jsx";

function ConfiguracoesPage() {
  const themeMui = useTheme(); // <-- Mantido caso queira usar para o placeholder
  // const { toggleColorMode } = useColorMode(); // <-- Removido

  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [isAddUserModalVisible, setAddUserModalVisible] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    setIsUserAdmin(isAdmin());
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
    setVerifyLoading(true);
    try {
      await api.post("/api/auth/verify-password", { password });
      setIsVerified(true);
      fetchUsers();
    } catch (error) {
      console.error("Erro na verificação de senha:", error);
      toast.error("Senha incorreta. Acesso negado.");
      setIsVerified(false);
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (
      window.confirm("Tem a certeza de que deseja excluir este utilizador?")
    ) {
      setLoading(true);
      try {
        await api.delete(`/api/users/${id}`);
        toast.success("Utilizador excluído com sucesso!");
        fetchUsers();
      } catch (error) {
        console.error("Erro ao excluir utilizador:", error);
        toast.error(
          error.response?.data?.message || "Falha ao excluir o utilizador."
        );
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          minHeight: "100vh",
          backgroundColor: "background.default",
        }}
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

          <Grid container spacing={3}>
            {/* *** BLOCO DE APARÊNCIA REMOVIDO DAQUI *** */}

            {/* Bloco de Placeholder (Ocupa o espaço) */}
            <Grid xs={12}>
              {" "}
              {/* Ocupa a linha inteira agora */}
              <Paper
                sx={{
                  p: 3,
                  boxShadow: 3,
                  height: "100%",
                  backgroundColor: themeMui.palette.background.default,
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ opacity: 0.7 }}>
                  Configurações da Empresa
                </Typography>
                <Typography sx={{ opacity: 0.5, mt: 2 }}>
                  (Em breve: alterar nome da empresa, cor do tema, etc.)
                </Typography>
              </Paper>
            </Grid>

            {/* Bloco de Gestão de Utilizadores (só para Admin) */}
            {isUserAdmin && (
              <Grid xs={12}>
                <Paper sx={{ p: 3, boxShadow: 3, mt: 3 }}>
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
                      disabled={!isVerified}
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
                      sx={{
                        mt: 2,
                        display: "flex",
                        gap: 2,
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        type="password"
                        label="Confirmar Senha de Administrador"
                        variant="outlined"
                        size="small"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <MuiButton
                        type="submit"
                        variant="contained"
                        disabled={verifyLoading}
                      >
                        {verifyLoading ? (
                          <CircularProgress size={24} />
                        ) : (
                          "Verificar"
                        )}
                      </MuiButton>
                    </Box>
                  ) : loading ? (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", mt: 4 }}
                    >
                      <CircularProgress />
                    </Box>
                  ) : (
                    <UserManagement
                      users={users}
                      onDeleteUser={handleDeleteUser}
                    />
                  )}
                </Paper>
              </Grid>
            )}
          </Grid>
        </Container>

        {isAddUserModalVisible && (
          <ModalAddUser
            isVisible={isAddUserModalVisible}
            onClose={() => setAddUserModalVisible(false)}
            onUserAdded={fetchUsers}
          />
        )}
      </Box>
    </>
  );
}

export default ConfiguracoesPage;
