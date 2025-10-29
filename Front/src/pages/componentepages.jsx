// Em: src/pages/componentepages.jsx

import { useState, useEffect, useCallback } from 'react'; // 1. Adicione useCallback
import { toast } from 'react-toastify';
import _ from 'lodash'; // Importe o lodash (se não tiver, instale com: npm install lodash)
import ModalComponente from '../components/modalcomponente'; // Verifique se o caminho e o nome do arquivo estão corretos// ... (outras importações do MUI)
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
  Stack,
  TextField, // 2. Importe o TextField
  InputAdornment // 3. Para adicionar ícone dentro do TextField
} from '@mui/material';
import api from '../services/api';
import { isAdmin } from '../services/authService';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search'; // 4. Ícone de busca

// ... (import Sidebar, ModalComponente, api, isAdmin)

function ComponentesPage() {
  const [componentes, setComponentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [componenteEmEdicao, setComponenteEmEdicao] = useState(null);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [termoBusca, setTermoBusca] = useState(''); // 5. Estado para o termo de busca

  // 6. Função fetchData modificada para aceitar o termo de busca
  const fetchData = async (termo = '') => {
    setLoading(true);
    try {
      // Adiciona o parâmetro 'termo' na chamada da API
      const response = await api.get(`/api/componentes?termo=${encodeURIComponent(termo)}`);
      setComponentes(response.data);
    } catch (error) {
      console.error("Erro ao buscar componentes:", error);
      toast.error("Não foi possível carregar os componentes.");
    } finally {
      setLoading(false);
    }
  };

  // 7. Debounce para a busca (evita chamar a API a cada tecla)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetchData = useCallback(_.debounce(fetchData, 500), []);

  useEffect(() => {
    setIsUserAdmin(isAdmin());
    // Busca inicial sem termo
    fetchData();

  }, []); // Mantém a busca inicial apenas uma vez

  // 8. useEffect para reagir à mudança do termo de busca
  useEffect(() => {
    // Chama a função com debounce
    debouncedFetchData(termoBusca);
  }, [termoBusca, debouncedFetchData]);

  // Handler para atualizar o estado do termo de busca
  const handleBuscaChange = (event) => {
    setTermoBusca(event.target.value);
  };

  // ... (handleEdit, handleDelete, handleAdd continuam iguais)
  const handleEdit = (componente) => {
    setComponenteEmEdicao(componente);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("Você tem certeza que deseja excluir este componente?")
    ) {
      try {
        await api.delete(`/api/componentes/${id}`);
        toast.success("Componente excluído com sucesso!");
        // Re-busca os dados APÓS deletar, mantendo o termo de busca atual
        fetchData(termoBusca);
      } catch (error) {
        toast.error("Falha ao excluir o componente.");
        console.error(error);
      }
    }
  };

  const handleAdd = () => {
    setComponenteEmEdicao(null);
    setModalVisible(true);
  };
  const handleComponenteAdicionado = () => {
     // Re-busca os dados APÓS adicionar/editar, mantendo o termo de busca atual
     fetchData(termoBusca);
  }


  return (
    <>
      <Box component="main" sx={{ flexGrow: 1, p: 3, minHeight: '100vh' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Gerenciamento de Itens
            </Typography>

            {/* 9. Adiciona o TextField de Busca */}
            <TextField
              variant="outlined"
              size="small"
              placeholder="Buscar por nome ou patrimônio..."
              value={termoBusca}
              onChange={handleBuscaChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: '250px' }} // Para evitar que fique muito pequeno
            />

            {isUserAdmin && (
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

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: 3 }}>
              <TableContainer>
                {/* A Tabela continua a mesma */}
                 <Table stickyHeader aria-label="tabela de componentes">
                   <TableHead>
                     <TableRow>
                       <TableCell sx={{ fontWeight: "bold" }}>Nome</TableCell>
                       <TableCell sx={{ fontWeight: "bold" }}>
                         Patrimônio
                       </TableCell>
                       <TableCell sx={{ fontWeight: "bold" }}>
                         Quantidade
                       </TableCell>
                       {/* Adiciona as colunas que faltavam */}
                       <TableCell sx={{ fontWeight: "bold" }}>Localização</TableCell>
                       <TableCell sx={{ fontWeight: "bold" }}>Categoria</TableCell>
                       {isUserAdmin && (
                         <TableCell sx={{ fontWeight: "bold", textAlign: 'right' }}>Ações</TableCell>
                       )}
                     </TableRow>
                   </TableHead>
                   <TableBody>
                     {componentes.length > 0 ? (
                       componentes.map((componente) => (
                         <TableRow hover key={componente.id}>
                           <TableCell>{componente.nome}</TableCell>
                           <TableCell>{componente.codigoPatrimonio}</TableCell>
                           <TableCell>{componente.quantidade}</TableCell>
                           {/* Adiciona as colunas que faltavam */}
                           <TableCell>{componente.localizacao || '-'}</TableCell>
                           <TableCell>{componente.categoria || '-'}</TableCell>
                           {isUserAdmin && (
                             <TableCell align="right"> {/* Ajusta alinhamento */}
                               <Stack direction="row" spacing={1} justifyContent="flex-end"> {/* Ajusta justificação */}
                                 <IconButton
                                   color="info"
                                   size="small" // Deixa os botões menores
                                   onClick={() => handleEdit(componente)}
                                 >
                                   <EditIcon />
                                 </IconButton>
                                 <IconButton
                                   color="error"
                                   size="small" // Deixa os botões menores
                                   onClick={() => handleDelete(componente.id)}
                                 >
                                   <DeleteIcon />
                                 </IconButton>
                               </Stack>
                             </TableCell>
                           )}
                         </TableRow>
                       ))
                     ) : (
                      <TableRow>
                        <TableCell colSpan={isUserAdmin ? 6 : 5} align="center">
                          <Typography color="text.secondary" sx={{ p: 3 }}>
                            Nenhum componente encontrado {termoBusca && `para "${termoBusca}"`}.
                          </Typography>
                        </TableCell>
                      </TableRow>
                     )}
                   </TableBody>
                 </Table>
              </TableContainer>
            </Paper>
          )}
        </Container>
      </Box>

      {/* Passa a função correta para onComponenteAdicionado */}
      <ModalComponente
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onComponenteAdicionado={handleComponenteAdicionado}
        componenteParaEditar={componenteEmEdicao}
      />
    </>
  );
}

export default ComponentesPage;