import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import api from '../services/api';
import { toast } from 'react-toastify';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  InputAdornment,
  IconButton,
  Box,
  CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff, PersonAdd } from '@mui/icons-material';

// 1. SCHEMA DE VALIDAÇÃO
const schema = yup.object().shape({
  email: yup.string()
    .email('Formato de e-mail inválido')
    .required('O e-mail é obrigatório'),
  senha: yup.string()
    .min(6, 'A senha deve ter no mínimo 6 caracteres')
    .required('A senha é obrigatória'),
  role: yup.string()
    .required('Selecione um nível de permissão'),
});

function ModalAddUser({ open, onClose, onUserAdded }) { // Mudei 'isVisible' para 'open' (padrão MUI)
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      role: 'USER'
    }
  });

  // Limpa o formulário toda vez que o modal fecha ou abre
  useEffect(() => {
    if (open) {
      reset({ email: '', senha: '', role: 'USER' });
      setLoading(false);
    }
  }, [open, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post('/api/users', data);
      
      toast.success(`Usuário ${data.email} criado com sucesso!`);
      onUserAdded(); // Atualiza a lista no componente pai
      onClose();     // Fecha o modal

    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      const msg = error.response?.data?.message || "Erro ao conectar com o servidor.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={!loading ? onClose : undefined} // Impede fechar clicando fora se estiver carregando
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'primary.main', color: 'white' }}>
        <PersonAdd />
        Adicionar Novo Usuário
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={2} pt={1}>
            
            <TextField
              label="E-mail do Usuário"
              type="email"
              fullWidth
              disabled={loading}
              error={!!errors.email}
              helperText={errors.email?.message}
              {...register('email')}
            />

            <TextField
              label="Senha Provisória"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              disabled={loading}
              error={!!errors.senha}
              helperText={errors.senha?.message}
              {...register('senha')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              select // Transformar TextField em Select nativo do MUI
              label="Nível de Permissão"
              fullWidth
              defaultValue="USER"
              disabled={loading}
              error={!!errors.role}
              helperText={errors.role?.message}
              {...register('role')}
            >
              <MenuItem value="USER">Usuário Padrão (Leitura/Escrita básica)</MenuItem>
              <MenuItem value="ADMIN">Administrador (Acesso total)</MenuItem>
            </TextField>

          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} color="inherit" disabled={loading}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            {loading ? 'Criando...' : 'Criar Usuário'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default ModalAddUser;