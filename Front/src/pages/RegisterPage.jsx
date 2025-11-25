import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";
import ParticlesBackground from "../components/ParticlesBackground";
import * as Yup from "yup"; 

import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  CircularProgress,
   Grid, 
  InputAdornment,
  IconButton
} from "@mui/material";
import { Visibility, VisibilityOff, Domain, Email, Lock } from "@mui/icons-material";

function RegisterPage() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    dominioEmpresa: "",
    email: "",
    senha: "",
    confirmarSenha: ""
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); 

  const validationSchema = Yup.object().shape({
    dominioEmpresa: Yup.string()
      .required("O nome da empresa é obrigatório.")
      .min(3, "O nome deve ter pelo menos 3 letras."),
    email: Yup.string()
      .email("Digite um e-mail válido.")
      .required("O e-mail é obrigatório."),
    senha: Yup.string()
      .min(6, "A senha deve ter no mínimo 6 caracteres.")
      .required("A senha é obrigatória."),
    confirmarSenha: Yup.string()
      .oneOf([Yup.ref('senha'), null], 'As senhas não coincidem.')
      .required("A confirmação de senha é obrigatória.")
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrors({}); 

    try {
      await validationSchema.validate(formData, { abortEarly: false });

      await api.post("/api/auth/register", {
        email: formData.email,
        senha: formData.senha,
        dominioEmpresa: formData.dominioEmpresa
      });

      toast.success("Empresa registrada com sucesso!");
      navigate("/login");

    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const validationErrors = {};
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
      } else {
        console.error("Erro no cadastro:", err);
        const msg = err.response?.data?.message || 
                    err.response?.data || 
                    "Erro ao registrar. Tente novamente.";
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Fundo */}
      <Box sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: -1, bgcolor: "#121212" }}>
        <ParticlesBackground />
      </Box>

      <Container maxWidth="sm" sx={{ zIndex: 1 }}>
        <Paper
          elevation={6}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            bgcolor: "rgba(0, 0, 0, 0)",
            borderRadius: 3,
          }}
        >
          <Typography component="h1" variant="h4" fontWeight="bold" color="black" mb={1}>
            Criar Conta
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Cadastre sua empresa e comece a gerenciar.
          </Typography>

          <Box component="form" onSubmit={handleRegister} noValidate sx={{ mt: 1, width: "100%" }}>
            <Grid container spacing={2}>
                
              <Grid size={12}>
                <TextField
                  required
                  fullWidth
                  id="dominioEmpresa"
                  label="Nome da Empresa"
                  name="dominioEmpresa"
                  autoFocus
                  value={formData.dominioEmpresa}
                  onChange={handleChange}
                  error={!!errors.dominioEmpresa}
                  helperText={errors.dominioEmpresa}
                  // Modernizado para slotProps (MUI v6)
                  slotProps={{
                    input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Domain color="action" />
                          </InputAdornment>
                        ),
                    }
                  }}
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="E-mail Corporativo"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  slotProps={{
                    input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email color="action" />
                          </InputAdornment>
                        ),
                    }
                  }}
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  required
                  fullWidth
                  name="senha"
                  label="Senha"
                  type={showPassword ? "text" : "password"}
                  id="senha"
                  autoComplete="new-password"
                  value={formData.senha}
                  onChange={handleChange}
                  error={!!errors.senha}
                  helperText={errors.senha}
                  slotProps={{
                    input: {
                        startAdornment: <InputAdornment position="start"><Lock color="action" /></InputAdornment>,
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                    }
                  }}
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmarSenha"
                  label="Confirmar Senha"
                  type="password"
                  id="confirmarSenha"
                  value={formData.confirmarSenha}
                  onChange={handleChange}
                  error={!!errors.confirmarSenha}
                  helperText={errors.confirmarSenha}
                  slotProps={{
                    input: {
                        startAdornment: <InputAdornment position="start"><Lock color="action" /></InputAdornment>,
                    }
                  }}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 4, mb: 2, py: 1.5, fontWeight: "bold", fontSize: "1rem" }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "REGISTRAR EMPRESA"}
            </Button>

            <Grid container justifyContent="center">
              <Grid>
                <Link to="/login" style={{ textDecoration: "none", color: "#fc0000ff", fontWeight: 500 }}>
                  Já tem uma conta? Faça Login
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default RegisterPage;