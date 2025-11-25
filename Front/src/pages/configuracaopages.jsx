import { useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button as MuiButton,
  Grid,
  TextField,
} from "@mui/material";

function ConfiguracoesPage() {
  // Estados para troca de senha
  const [passData, setPassData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loadingPass, setLoadingPass] = useState(false);

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

        <Grid container spacing={3} direction="column">
          {/* BLOCO: Alterar Senha */}
          <Grid item xs={12}>
            <Paper sx={{ p: 4, boxShadow: 5, borderRadius: 2, maxWidth: "600px" }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Alterar Minha Senha
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Mantenha sua conta segura atualizando sua senha periodicamente.
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
                  value={passData.currentPassword}
                  onChange={(e) =>
                    setPassData({ ...passData, currentPassword: e.target.value })
                  }
                />
                <TextField
                  label="Nova Senha"
                  type="password"
                  required
                  fullWidth
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
                  value={passData.confirmPassword}
                  onChange={(e) =>
                    setPassData({ ...passData, confirmPassword: e.target.value })
                  }
                />
                <MuiButton
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loadingPass}
                  sx={{ mt: 1 }}
                >
                  {loadingPass ? "Alterando..." : "Salvar Nova Senha"}
                </MuiButton>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
export default ConfiguracoesPage;