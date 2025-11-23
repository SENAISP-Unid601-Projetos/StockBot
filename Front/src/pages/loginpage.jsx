import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
    CircularProgress, 
    Box, 
    TextField, 
    Button, 
    Typography, 
    Container, 
    Card,
    InputAdornment,
    IconButton
} from '@mui/material';
import { LoginOutlined, Visibility, VisibilityOff, Business } from '@mui/icons-material';

const apiUrl = 'http://localhost:8080/api/auth';

// 1. SCHEMA DE VALIDAÇÃO (Incluindo o domínio que seu back pede)
const schema = yup.object().shape({
    dominioEmpresa: yup.string()
        .required('O domínio da empresa é obrigatório'),
    email: yup.string()
        .email('Formato de e-mail inválido')
        .required('O e-mail é obrigatório'),
    senha: yup.string()
        .required('A senha é obrigatória'),
});

function LoginPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Configuração do React Hook Form
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await axios.post(`${apiUrl}/login`, { 
                email: data.email, 
                senha: data.senha,
                dominioEmpresa: data.dominioEmpresa 
            });

            // Padronizando a chave do token (use a mesma em todo o app)
            const token = response.data.token;
            localStorage.setItem('token', token); 
            // DICA: Se seu backend espera 'jwt-token', mude a linha acima para 'jwt-token'

            toast.success("Login realizado com sucesso!", { theme: "colored" });
            
            // Pequeno delay para o usuário ler a mensagem
            setTimeout(() => navigate('/dashboard'), 1500);

        } catch (error) {
            console.error('Erro de login:', error);
            const msg = error.response?.data?.message || 'Credenciais inválidas. Verifique os dados.';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ mt: 8, mb: 4, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ToastContainer position="top-right" autoClose={3000} />
            
            <Card elevation={6} sx={{ p: 4, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 3 }}>
                
                <Box sx={{ p: 2, bgcolor: 'primary.main', borderRadius: '50%', mb: 2 }}>
                    <LoginOutlined sx={{ fontSize: 32, color: 'white' }} />
                </Box>

                <Typography component="h1" variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
                    Acessar StockBot
                </Typography>

                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ width: '100%' }}>
                    
                    {/* Campo Domínio (Obrigatório no seu sistema) */}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="dominio"
                        label="Domínio da Empresa"
                        placeholder="ex: coca-cola"
                        autoFocus
                        disabled={loading}
                        {...register('dominioEmpresa')}
                        error={!!errors.dominioEmpresa}
                        helperText={errors.dominioEmpresa?.message}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Business color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="E-mail"
                        autoComplete="email"
                        disabled={loading}
                        {...register('email')}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Senha"
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        autoComplete="current-password"
                        disabled={loading}
                        {...register('senha')}
                        error={!!errors.senha}
                        helperText={errors.senha?.message}
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

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: 'bold' }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'ENTRAR'}
                    </Button>

                    <Box display="flex" justifyContent="center" mt={2}>
                        <Typography variant="body2">
                            Não tem uma conta?{' '}
                            <Link to="/register" style={{ textDecoration: 'none', fontWeight: 'bold', color: '#1976d2' }}>
                                Crie agora
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Card>
        </Container>
    );
}

export default LoginPage;