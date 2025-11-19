import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

// Imports do React Hook Form
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Imports do MUI
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

// IMPORTANTE: Importa o helper para pegar o domínio do admin
import { getLoggedUser } from "../services/authService";

// Schema de validação (Agora com NOME)
const schema = yup.object().shape({
  nome: yup.string().required("O nome é obrigatório"),
  email: yup.string().email("Email inválido").required("O email é obrigatório"),
  senha: yup
    .string()
    .min(6, "Mínimo 6 caracteres")
    .required("Senha obrigatória"),
  role: yup.string().required("Função obrigatória"),
});

function ModalAddUser({ isVisible, onClose, onUserAdded }) {
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nome: "",
      email: "",
      senha: "",
      role: "USER",
    },
  });

  useEffect(() => {
    if (!isVisible) reset();
  }, [isVisible, reset]);

  const onSubmit = async (data) => {
    setLoading(true);

    // 1. PEGA O USUÁRIO ADMIN LOGADO
    const adminUser = getLoggedUser();

    if (!adminUser || !adminUser.dominio) {
      toast.error("Erro: Não foi possível identificar o domínio da empresa.");
      setLoading(false);
      return;
    }

    // 2. CRIA O PAYLOAD COM O DOMÍNIO
    const payload = {
      ...data,
      dominio: adminUser.dominio, // <-- AQUI ESTÁ A CORREÇÃO MÁGICA
    };

    try {
      await api.post("/users", payload);
      toast.success("Usuário criado com sucesso!");
      onUserAdded();
      onClose();
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      toast.error(error.response?.data?.message || "Falha ao criar usuário.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isVisible} onClose={onClose}>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle fontWeight="bold">Adicionar Novo Usuário</DialogTitle>
        <DialogContent>
          {/* Campo NOME (Novo) */}
          <Controller
            name="nome"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                autoFocus
                required
                margin="dense"
                label="Nome Completo"
                fullWidth
                error={!!errors.nome}
                helperText={errors.nome?.message}
              />
            )}
          />

          {/* Campo EMAIL */}
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                required
                margin="dense"
                label="Email"
                type="email"
                fullWidth
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />

          {/* Campo SENHA */}
          <Controller
            name="senha"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                required
                margin="dense"
                label="Senha Provisória"
                type="password"
                fullWidth
                error={!!errors.senha}
                helperText={errors.senha?.message}
              />
            )}
          />

          {/* Campo ROLE */}
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth required margin="dense">
                <InputLabel id="role-label">Função</InputLabel>
                <Select
                  {...field}
                  labelId="role-label"
                  label="Função"
                  error={!!errors.role}
                >
                  <MenuItem value="USER">User (Usuário Padrão)</MenuItem>
                  <MenuItem value="ADMIN">Admin (Administrador)</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Criar"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default ModalAddUser;
