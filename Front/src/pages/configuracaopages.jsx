import { useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button as MuiButton,
  Grid,
  TextField,
} from "@mui/material";
import TextIncreaseIcon from "@mui/icons-material/TextIncrease";
import TextDecreaseIcon from "@mui/icons-material/TextDecrease";

function ConfiguracoesPage() {
  const themeMui = useTheme();
  const [passData, setPassData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loadingPass, setLoadingPass] = useState(false);

  useEffect(() => {
    const savedFontSize = localStorage.getItem("stockbot_font_size");
    if (savedFontSize) {
      document.documentElement.style.fontSize = savedFontSize + "px";
    }
  }, []);

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

  const alterarFonte = (increment) => {
    const currentStyle = getComputedStyle(document.documentElement).fontSize;
    const current = parseFloat(currentStyle) || 16;
    
    const newSize = current + increment;

    if (newSize < 10 || newSize > 24) return;

    document.documentElement.style.fontSize = newSize + "px";
    localStorage.setItem("stockbot_font_size", newSize);
  };

  const aumentarFonte = () => alterarFonte(1);
  const diminuirFonte = () => alterarFonte(-1);

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
      {/* MUDANÇA PRINCIPAL AQUI:
          Alterado de maxWidth="lg" para maxWidth={false}.
          Isso remove a trava de largura e deixa o conteúdo expandir até as bordas.
      */}
      <Container maxWidth={false}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
          Configurações
        </Typography>

        <Grid container spacing={3}>
          {/* Card Alterar Senha */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 9, boxShadow: 3, width: "100%", height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Alterar Minha Senha
              </Typography>
              <Box
                component="form"
                onSubmit={handleChangePassword}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <TextField
                  label="Senha Atual"
                  type="password"
                  required
                  fullWidth
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

          {/* Card Acessibilidade */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 10, boxShadow: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Acessibilidade
              </Typography>
              <Typography sx={{ mb: 2 }}>Ajustar tamanho da fonte do sistema</Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <MuiButton
                  variant="contained"
                  color="primary"
                  startIcon={<TextIncreaseIcon />}
                  onClick={aumentarFonte}
                  fullWidth
                >
                  Aumentar
                </MuiButton>
                <MuiButton
                  variant="contained"
                  color="secondary"
                  startIcon={<TextDecreaseIcon />}
                  onClick={diminuirFonte}
                  fullWidth
                >
                  Diminuir
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