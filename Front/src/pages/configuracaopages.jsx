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

  // Substitua este ID pelo real do usuário logado
  const userId = 1;

  useEffect(() => {
    const loadFont = async () => {
      try {
        const response = await api.get(
          `/api/preferences/font?userId=${userId}`
        );
        document.documentElement.style.fontSize = response.data + "px";
      } catch (error) {
        console.error("Erro ao carregar preferências de fonte");
      }
    };
    loadFont();
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

  const alterarFonte = async (increment) => {
    const current = parseFloat(
      getComputedStyle(document.documentElement).fontSize
    );
    const newSize = current + increment;
    document.documentElement.style.fontSize = newSize + "px";

    try {
      await api.post(
        `/api/preferences/font?userId=${userId}&fontSize=${newSize}`
      );
      toast.info(`Fonte ${increment > 0 ? "aumentada" : "diminuída"} e salva`);
    } catch {
      toast.error("Erro ao salvar tamanho da fonte");
    }
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
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
          Configurações
        </Typography>

        <Grid container spacing={3} direction="column">
          {/* Alterar Senha */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, boxShadow: 3, width: "100%" }}>
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
                  maxWidth: "400px",
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

          

          {/* Ajuste de Fonte */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, boxShadow: 3 }}>
              <Typography variant="h6" gutterBottom>
                Acessibilidade
              </Typography>
              <Typography sx={{ mb: 2 }}>Ajustar tamanho da fonte</Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <MuiButton
                  variant="contained"
                  color="primary"
                  startIcon={<TextIncreaseIcon />}
                  onClick={aumentarFonte}
                >
                  A+
                </MuiButton>
                <MuiButton
                  variant="contained"
                  color="secondary"
                  startIcon={<TextDecreaseIcon />}
                  onClick={diminuirFonte}
                >
                  A−
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
