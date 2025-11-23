import { useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { useTheme } from "@mui/material/styles";
import { isAdmin } from "../services/authService";
import {
  Box, Container, Typography, Paper, Button as MuiButton, CircularProgress, Grid, TextField
} from "@mui/material";
import UserManagement from "../components/usermanagement.jsx";
import ModalAddUser from "../components/modaladduser.jsx";

function ConfiguracoesPage() {
  const themeMui = useTheme();
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddUserModalVisible, setAddUserModalVisible] = useState(false);

  // Estados para troca de senha
  const [passData, setPassData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [loadingPass, setLoadingPass] = useState(false);

  useEffect(() => {
    const adminStatus = isAdmin();
    setIsUserAdmin(adminStatus);
    if (adminStatus) fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/users");
      setUsers(response.data);
    } catch (error) {
      toast.error("Erro ao buscar usuários.");
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteUser = async (id) => {
    try {
      await api.delete(`/api/users/${id}`);
      toast.success("Usuário removido.");
      fetchUsers();
    } catch (error) {
      toast.error("Erro ao excluir usuário.");
    }
  };

  // Lógica de Troca de Senha
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passData.newPassword !== passData.confirmPassword) {
        return toast.error("A nova senha e a confirmação não coincidem.");
    }
    setLoadingPass(true);
    try {
        await api.put("/api/users/me/password", {
            currentPassword: passData.currentPassword,
            newPassword: passData.newPassword
        });
        toast.success("Senha alterada com sucesso!");
        setPassData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
        toast.error(error.response?.data || "Erro ao alterar senha.");
    } finally {
        setLoadingPass(false);
    }
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3, minHeight: "100vh", backgroundColor: "background.default" }}>
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>Configurações</Typography>

        <Grid container spacing={3} direction="column">
          
          {/* BLOCO 1: Alterar Senha (Para TODOS os usuários) */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, boxShadow: 3, width: "100%" }}>
              <Typography variant="h6" gutterBottom>Alterar Minha Senha</Typography>
              <Box component="form" onSubmit={handleChangePassword} sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: '400px' }}>
                <TextField 
                    label="Senha Atual" type="password" required fullWidth 
                    value={passData.currentPassword}
                    onChange={(e) => setPassData({...passData, currentPassword: e.target.value})}
                />
                <TextField 
                    label="Nova Senha" type="password" required fullWidth 
                    value={passData.newPassword}
                    onChange={(e) => setPassData({...passData, newPassword: e.target.value})}
                />
                <TextField 
                    label="Confirmar Nova Senha" type="password" required fullWidth 
                    value={passData.confirmPassword}
                    onChange={(e) => setPassData({...passData, confirmPassword: e.target.value})}
                />
                <MuiButton type="submit" variant="contained" disabled={loadingPass}>
                    {loadingPass ? "Alterando..." : "Salvar Nova Senha"}
                </MuiButton>
              </Box>
            </Paper>
          </Grid>

          {/* BLOCO 2: Gestão de Usuários (Apenas Admin) - Código existente mantido */}
          {isUserAdmin && (
            <Grid item xs={12}>
               {/* ... Seu código do Paper de Gestão de Usuários ... */}
               {/* Vou resumir para caber na resposta, mantenha o seu UserManagement aqui */}
               <Paper sx={{ p: 3, boxShadow: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Typography variant="h6">Gestão de Usuários</Typography>
                    <MuiButton variant="contained" onClick={() => setAddUserModalVisible(true)}>Adicionar</MuiButton>
                  </Box>
                  <UserManagement users={users} onDeleteUser={handleDeleteUser} />
               </Paper>
            </Grid>
          )}
        </Grid>
      </Container>
      
      {isAddUserModalVisible && (
          <ModalAddUser isVisible={isAddUserModalVisible} onClose={() => setAddUserModalVisible(false)} onUserAdded={fetchUsers} />
      )}
    </Box>
  );
}
export default ConfiguracoesPage;