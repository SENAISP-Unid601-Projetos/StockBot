import { useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { isAdmin } from "../services/authService";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button as MuiButton,
  Grid,
  TextField,
} from "@mui/material";
import UserManagement from "../components/UserManagement"; // Ajuste maiúscula/minúscula se precisar
import ModalAddUser from "../components/ModalAddUser"; // Ajuste maiúscula/minúscula se precisar

function ConfiguracoesPage() {
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal
  const [isAddUserModalVisible, setAddUserModalVisible] = useState(false);

  // Estados para troca de senha
  const [passData, setPassData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loadingPass, setLoadingPass] = useState(false);

  // Estados para Configuração de Estoque Baixo
  const [lowStockThreshold, setLowStockThreshold] = useState(5);
  const [loadingThreshold, setLoadingThreshold] = useState(false);

  useEffect(() => {
    const adminStatus = isAdmin();
    setIsUserAdmin(adminStatus);
    if (adminStatus) {
      fetchUsers();
      fetchThreshold(); // Busca a configuração atual
    }
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // O Back retorna Page<UsuarioDTO>. Pegamos .content
      // Podemos passar ?size=100 se quiser listar muitos
      const response = await api.get("/api/users?size=50");

      // CORREÇÃO AQUI:
      setUsers(response.data.content || []);
    } catch (error) {
      toast.error("Erro ao buscar usuários.");
    } finally {
      setLoading(false);
    }
  };

  const fetchThreshold = async () => {
    try {
      const response = await api.get("/api/settings/lowStockThreshold");
      setLowStockThreshold(response.data);
    } catch (error) {
      console.error("Erro ao buscar config:", error);
    }
  };

  const handleUpdateThreshold = async () => {
    setLoadingThreshold(true);
    try {
      await api.put("/api/settings/lowStockThreshold", {
        threshold: lowStockThreshold,
      });
      toast.success("Limite de estoque atualizado!");
    } catch (error) {
      toast.error("Erro ao atualizar configuração.");
    } finally {
      setLoadingThreshold(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este usuário?")) return;

    try {
      await api.delete(`/api/users/${id}`);
      toast.success("Usuário removido.");
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data || "Erro ao excluir usuário.");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passData.newPassword !== passData.confirmPassword) {
      return toast.error("A nova senha e a confirmação não coincidem.");
    }
    setLoadingPass(true);
    try {
      await api.put("/api/users/me/password", {
        currentPassword: passData.currentPassword,
        newPassword: passData.newPassword,
      });
      toast.success("Senha alterada com sucesso!");
      setPassData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error.response?.data || "Erro ao alterar senha.");
    } finally {
      setLoadingPass(false);
    }
  };

  return (
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
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
          Configurações
        </Typography>

        <Grid container spacing={3}>
          {/* BLOCO 1: Alterar Senha (Para TODOS) */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, boxShadow: 3, height: "100%" }}>
              <Typography variant="h6" gutterBottom>
                Alterar Minha Senha
              </Typography>
              <Box
                component="form"
                onSubmit={handleChangePassword}
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                <TextField
                  label="Senha Atual"
                  type="password"
                  required
                  fullWidth
                  size="small"
                  value={passData.currentPassword}
                  onChange={(e) =>
                    setPassData({
                      ...passData,
                      currentPassword: e.target.value,
                    })
                  }
                />
                <TextField
                  label="Nova Senha"
                  type="password"
                  required
                  fullWidth
                  size="small"
                  value={passData.newPassword}
                  onChange={(e) =>
                    setPassData({ ...passData, newPassword: e.target.value })
                  }
                />
                <TextField
                  label="Confirmar Nova Senha"
                  type="password"
                  required
                  fullWidth
                  size="small"
                  value={passData.confirmPassword}
                  onChange={(e) =>
                    setPassData({
                      ...passData,
                      confirmPassword: e.target.value,
                    })
                  }
                />
                <MuiButton
                  type="submit"
                  variant="contained"
                  disabled={loadingPass}
                >
                  {loadingPass ? "Alterando..." : "Salvar Nova Senha"}
                </MuiButton>
              </Box>
            </Paper>
          </Grid>

          {/* BLOCO 2: Configurações da Empresa (Apenas Admin) */}
          {isUserAdmin && (
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, boxShadow: 3, height: "100%" }}>
                <Typography variant="h6" gutterBottom>
                  Parâmetros da Empresa
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Defina a quantidade mínima para considerar um item como
                    "Estoque Baixo" nos relatórios.
                  </Typography>
                  <TextField
                    label="Limite de Estoque Baixo"
                    type="number"
                    fullWidth
                    size="small"
                    value={lowStockThreshold}
                    onChange={(e) =>
                      setLowStockThreshold(Number(e.target.value))
                    }
                  />
                  <MuiButton
                    variant="contained"
                    color="warning"
                    onClick={handleUpdateThreshold}
                    disabled={loadingThreshold}
                  >
                    {loadingThreshold ? "Salvando..." : "Atualizar Regra"}
                  </MuiButton>
                </Box>
              </Paper>
            </Grid>
          )}

          {/* BLOCO 3: Gestão de Usuários (Apenas Admin) */}
          {isUserAdmin && (
            <Grid item xs={12}>
              <Paper sx={{ p: 3, boxShadow: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h6">Colaboradores</Typography>
                  <MuiButton
                    variant="contained"
                    onClick={() => setAddUserModalVisible(true)}
                  >
                    Adicionar Novo
                  </MuiButton>
                </Box>

                {/* Passamos a lista correta agora */}
                <UserManagement users={users} onDeleteUser={handleDeleteUser} />
              </Paper>
            </Grid>
          )}
        </Grid>
      </Container>

      {/* Modal de Adicionar Usuário */}
      <ModalAddUser
        open={isAddUserModalVisible} // Mudei de isVisible para open (padrão MUI)
        onClose={() => setAddUserModalVisible(false)}
        onUserAdded={fetchUsers}
      />
    </Box>
  );
}
export default ConfiguracoesPage;
