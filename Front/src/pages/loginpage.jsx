import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
  Grid,
  Link,
  CircularProgress,
} from "@mui/material";

console.log("🔑 LoginPage carregada");

const schema = yup.object().shape({
  dominio: yup.string().required("O domínio é obrigatório"),
  email: yup.string().email("Email inválido").required("O email é obrigatório"),
  senha: yup.string().required("A senha é obrigatória"),
});

function LoginPage() {
  console.log("🎯 Componente LoginPage renderizado");

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: "", senha: "", dominio: "" },
  });

  const onSubmit = async (data) => {
    console.log("📤 Tentando fazer login com:", { ...data, senha: "***" });
    setLoading(true);
    try {
      const response = await api.post(`/auth/login`, data);
      console.log("🔍 Response data completo:", response.data);

      // 🚨 BUSCA INTELIGENTE - tenta TODAS as combinações possíveis
      const responseData = response.data;

      // Procura token em todas as chaves possíveis
      const token =
        responseData.token ||
        responseData.accessToken ||
        responseData.jwt ||
        responseData.access_token;

      // Procura usuário em todas as chaves possíveis
      const usuario =
        responseData.user ||
        responseData.usuario ||
        responseData.usuarioDTO ||
        responseData.userData ||
        responseData.userInfo;

      console.log("🔐 Token encontrado:", token);
      console.log("👤 Usuário encontrado:", usuario);

      if (!token) {
        console.error("❌ NENHUMA chave de token encontrada!");
        console.error("📦 Chaves disponíveis:", Object.keys(responseData));
        toast.error("Erro: Estrutura de resposta inesperada do servidor");
        return;
      }

      // 🎯 SALVA COM SUCESSO
      localStorage.setItem("jwt-token", token);
      localStorage.setItem("user-data", JSON.stringify(usuario || {}));
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      console.log("✅ Login concluído com sucesso!");
      console.log("🔄 Redirecionando para dashboard...");

      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("❌ Erro de login:", error);
      toast.error(
        error.response?.data?.message || "E-mail, senha ou domínio inválidos."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 2,
        }}
      >
        <Typography component="h1" variant="h5" fontWeight="bold">
          Acessar o StockBot
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 1, width: "100%" }}
        >
          <Stack spacing={2}>
            <Controller
              name="dominio"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="normal"
                  required
                  fullWidth
                  label="Domínio da Empresa"
                  autoComplete="organization"
                  autoFocus
                  error={!!errors.dominio}
                  helperText={errors.dominio?.message}
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="normal"
                  required
                  fullWidth
                  label="Endereço de E-mail"
                  autoComplete="email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />

            <Controller
              name="senha"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="normal"
                  required
                  fullWidth
                  label="Senha"
                  type="password"
                  autoComplete="current-password"
                  error={!!errors.senha}
                  helperText={errors.senha?.message}
                />
              )}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Entrar"
              )}
            </Button>

            <Grid container justifyContent="center">
              <Grid item>
                <Link component={RouterLink} to="/register" variant="body2">
                  Não tem uma conta? Cadastre-se
                </Link>
              </Grid>
            </Grid>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}

export default LoginPage;
