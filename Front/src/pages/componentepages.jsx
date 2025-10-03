import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

// 1. IMPORTAÇÕES DE COMPONENTES DO MUI
import {
Box,
Button,
CircularProgress,
Container,
Paper,
Table,
TableBody,
TableCell,
TableContainer,
TableHead,
TableRow,
Typography,
IconButton,
Stack
} from '@mui/material';

// 2. IMPORTAÇÕES DE ÍCONES DO MUI
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import Sidebar from '../components/sidebar';
import ModalComponente from '../components/modalcomponente'; // Manteremos o seu modal por enquanto
import api from '../services/api';
import { isAdmin } from '../services/authService';

function ComponentesPage() {
const [componentes, setComponentes] = useState([]);
const [loading, setLoading] = useState(true);
const [isModalVisible, setModalVisible] = useState(false);
const [componenteEmEdicao, setComponenteEmEdicao] = useState(null);
const [isUserAdmin, setIsUserAdmin] = useState(false);

const fetchData = async () => {
// ... (a sua função fetchData continua exatamente igual)
setLoading(true);
try {
const response = await api.get('/api/componentes');
setComponentes(response.data);
} catch (error) {
console.error("Erro ao buscar componentes:", error);
toast.error("Não foi possível carregar os componentes.");
} finally {
setLoading(false);
}
};

useEffect(() => {
setIsUserAdmin(isAdmin());
fetchData();
}, []);

const handleEdit = (componente) => {
setComponenteEmEdicao(componente);
setModalVisible(true);
};

const handleDelete = async (id) => {
// ... (a sua função handleDelete continua exatamente igual)
if (window.confirm("Você tem certeza que deseja excluir este componente?")) {
try {
await api.delete(`/api/componentes/${id}`);
toast.success('Componente excluído com sucesso!');
setComponentes(listaAtual => listaAtual.filter(componente => componente.id !== id));
} catch (error) {
toast.error('Falha ao excluir o componente.');
console.error(error);
}
}
};

const handleAdd = () => {
setComponenteEmEdicao(null);
setModalVisible(true);
};

// 3. A NOVA ESTRUTURA VISUAL COM COMPONENTES MUI
return (
// Box: Pense nele como uma div superpoderosa. Usamo-lo para layouts.
<>
    {/* O conteúdo principal da página */}
    <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        {/* Header da página */}
        <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            {/* Typography: Use sempre para textos. Garante consistência. */}
            <Typography variant="h4" component="h1" fontWeight="bold">
                Gerenciamento de Itens
            </Typography>
            {isUserAdmin && (
                // Button: O nosso novo componente de botão, com ícone.
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAdd}
                    sx={{ backgroundColor: '#ce0000', '&:hover': { backgroundColor: '#a40000' } }}
                >
                    Adicionar Item
                </Button>
            )}
        </Box>
