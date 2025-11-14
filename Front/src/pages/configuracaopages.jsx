import { useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { useTheme } from "@mui/material/styles";
import { isAdmin } from "../services/authService";

import {
  Box,
  Container,
  Typography,
  Paper,
  Button as MuiButton,
  CircularProgress,
  Grid,
} from "@mui/material";

import UserManagement from "../components/usermanagement.jsx";
import ModalAddUser from "../components/modaladduser.jsx";

function ConfiguracoesPage() {
  const themeMui = useTheme();

  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddUserModalVisible, setAddUserModalVisible] = useState(false);

  // 🔹 Verifica se é admin e carrega utilizadores automaticamente
  useEffect(() => {
    const adminStatus = isAdmin();
    setIsUserAdmin(adminStatus);
    if (adminStatus) {
      fetchUsers();
    }
  }, []);

  // 🔹 Busca todos os usuários (apenas se admin)
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

  // 🔹 Deletar usuário
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

          {/* Grid container define o espaçamento entre os itens */}
          <Grid container spacing={3} direction="column">
            {/* CORREÇÃO: 'item' e 'xs={12}' garantem que ocupa a largura total.
               Removemos o width: 220% que quebrava o layout.
            */}

            {/* Bloco de Configurações da Empresa */}
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 3,
                  boxShadow: 3,
                  width: "100%", // Garante que ocupa a largura correta do container
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

            {/* Bloco de Gestão de Utilizadores (apenas Admin) */}
            {isUserAdmin && (
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 3,
                    boxShadow: 3,
                    width: "100%", // Garante a mesma largura do bloco de cima
                    // mt: 3, // Removido pois o spacing={3} do Grid já trata disto
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6">Gestão de Usuários</Typography>
                    <MuiButton
                      variant="contained"
                      onClick={() => setAddUserModalVisible(true)}
                      sx={{
                        backgroundColor: "#ce0000",
                        "&:hover": { backgroundColor: "#a40000" },
                      }}
                    >
                      Adicionar
                    </MuiButton>
                  </Box>

                  {loading ? (
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
