import { useState, useEffect, useCallback } from "react"; // Adicionado useCallback
import { toast } from "react-toastify";
import _ from "lodash"; // Importe lodash (npm install lodash)

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
  TablePagination, // O componente de paginação!
  Typography,
  IconButton,
  Stack,
  TextField, // Importado
  InputAdornment, // Importado
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search"; // Importado

import ModalComponente from "../components/modalcomponente";
import api from "../services/api";
import { isAdmin } from "../services/authService"; // Importado

function ComponentesPage() {
  const [componentes, setComponentes] = useState([]);
  const [loading, setLoading] = useState(true);
  // 'page' armazena o índice da página atual (começa em 0).
  const [page, setPage] = useState(0);
  // 'rowsPerPage' armazena quantos itens são exibidos por página.
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // 'totalElements' armazena o número total de itens no backend (para a paginação).
  const [totalElements, setTotalElements] = useState(0);
  // 'isModalVisible' controla se o modal de adição/edição está aberto.
  const [isModalVisible, setModalVisible] = useState(false);
  const [componenteEmEdicao, setComponenteEmEdicao] = useState(null);
  const [isUserAdmin, setIsUserAdmin] = useState(false); // Estado para admin
  const [termoBusca, setTermoBusca] = useState(""); // Estado da busca

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. A API de componentes NÃO é paginada no backend.
      // Removemos os parâmetros ?page= e &size= da URL.
      const response = await api.get("/api/componentes");

      // 2. A resposta (response.data) É o próprio array de componentes.
      // Guardamos ele em 'todosComponentes'. Usamos '|| []' como segurança.
      const todosComponentes = response.data || [];

      // 3. O total de elementos (para a paginação) é o tamanho do array COMPLETO.
      setTotalElements(todosComponentes.length);

      // 4. Nós simulamos a paginação manualmente no frontend.
      // Calcula o índice inicial da "fatia" do array.
      const inicio = page * rowsPerPage;
      // Calcula o índice final.
      const fim = inicio + rowsPerPage;
      // Atualiza o estado 'componentes' apenas com os itens da página atual.
      setComponentes(todosComponentes.slice(inicio, fim));

    } catch (error) {
      console.error("Erro ao buscar componentes:", error);
      toast.error("Não foi possível carregar os componentes.");
      setComponentes([]); // Garante um array vazio em caso de erro.
      setTotalElements(0); // Zera a paginação.
    } finally {
      // Executa dando certo ou errado.
      setLoading(false); // Desativa o ícone de carregamento.
    }
  }, [
      // 5. Dependências do useCallback.
      // A função 'fetchData' será recriada se qualquer um destes valores mudar.
      // Isso é crucial para a paginação funcionar no frontend.
      page,
      rowsPerPage,
      setComponentes,
      setTotalElements,
      setLoading
    ]);

  // Debounce para não chamar a API a cada tecla digitada
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetchData = useCallback(_.debounce(fetchData, 500), []);

  useEffect(() => {
    setIsUserAdmin(isAdmin());
        fetchData(); // Busca inicial
      }, [fetchData]);
  // 4. Funções para lidar com as ações de paginação do MUI.
  // Chamada quando o usuário clica para mudar de página.
  const handleChangePage = (event, newPage) => {
    setPage(newPage); // Atualiza o estado da página, o que aciona o 'fetchData'.
  };

  // Chamada quando o usuário muda o número de "itens por página".
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10)); // Atualiza o N° de itens.
    setPage(0); // Volta para a primeira página.
  };

  // Chamada quando o usuário clica no ícone de editar.
  // Efeito para buscar quando o termo muda
  useEffect(() => {
    debouncedFetchData(termoBusca);
  }, [termoBusca, debouncedFetchData]);

  const handleBuscaChange = (event) => {
    setTermoBusca(event.target.value);
  };

  const handleEdit = (componente) => {
    setComponenteEmEdicao(componente); // Define o item a ser editado.
    setModalVisible(true); // Abre o modal.
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("Você tem certeza que deseja excluir este componente?")
    ) {
      try {
        await api.delete(`/api/componentes/${id}`);
        toast.success("Componente excluído com sucesso!");
        fetchData(termoBusca); // Recarrega mantendo a busca atual

        // 3. CHAME O FETCHDATA AQUI!
        // Recarrega os dados da página atual para refletir a exclusão.
        fetchData();

      } catch (error) {
        toast.error("Falha ao excluir o componente.");
        console.error(error);
      }
    }
  };

  const handleAdd = () => {
    setComponenteEmEdicao(null); // Garante que não há item em edição (modo "criação").
    setModalVisible(true); // Abre o modal.
  };

  const handleComponenteAdicionado = () => {
    fetchData(termoBusca);
  };

  return (
    <>
      <Box
        component="main" // Define a tag HTML (semanticamente, é o conteúdo principal).
        sx={{ // 'sx' é a prop do MUI para estilos CSS.
          flexGrow: 1, // Permite que o conteúdo cresça e ocupe o espaço.
          p: 3, // Adiciona padding (espaçamento interno).
          minHeight: "100vh", // Altura mínima de 100% da tela.
          backgroundColor: "background.default", // Usa a cor de fundo do tema.
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography variant="h4" component="h1" fontWeight="bold">
              Gerenciamento de Itens
            </Typography>

            {/* --- BARRA DE PESQUISA ADICIONADA --- */}
            <TextField
              variant="outlined"
              size="small"
              placeholder="Buscar por nome ou id"
              value={termoBusca}
              onChange={handleBuscaChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: "250px", backgroundColor: "background.paper" }}
            />

            {isUserAdmin && (
              <Button
                variant="contained"
                onClick={handleAdd}
                sx={{
                  backgroundColor: "#ce0000",
                  "&:hover": { backgroundColor: "#a40000" },
                }}
              >
                Novo Item
              </Button>
            )}
          </Box>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: 5 }}>
              <TableContainer>
                <Table stickyHeader aria-label="tabela de componentes">
                  <TableHead>
                    <TableRow
                      sx={{
                        // O seletor "& th" aplica o estilo a todas as células de cabeçalho dentro desta linha
                        "& th": {
                          backgroundColor: "#2a3c61ff", // Cor de fundo preta
                          color: "#ffffff", // Texto branco (essencial para contraste)
                          fontWeight: "bold",
                        },
                      }}
                    >
                      <TableCell align="center">Id</TableCell>
                      <TableCell align="center">Nome</TableCell>
                      <TableCell align="center">Patrimônio</TableCell>
                      <TableCell align="center">Quantidade</TableCell>
                      <TableCell align="center">Localização</TableCell>
                      <TableCell align="center">Categoria</TableCell>
                      <TableCell align="center">Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {componentes.length > 0 ? (
                      componentes.map((componente) => (
                        <TableRow hover key={componente.id}>
                          <TableCell align="center">{componente.id}</TableCell>
                          <TableCell align="center">
                            {componente.nome}
                          </TableCell>
                          <TableCell align="center">
                            {componente.codigoPatrimonio}
                          </TableCell>
                          <TableCell align="center">
                            {componente.quantidade}
                          </TableCell>
                          <TableCell align="center">
                            {componente.localizacao || "-"}
                          </TableCell>
                          <TableCell align="center">
                            {componente.categoria || "-"}
                          </TableCell>
                          {isUserAdmin && (
                            <TableCell align="right">
                              <Stack
                                direction="row"
                                spacing={1}
                                justifyContent="center"
                              >
                                <IconButton
                                  color="info"
                                  size="small"
                                  onClick={() => handleEdit(componente)}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  color="error"
                                  size="small"
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
                            Nenhum componente encontrado.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* 5. O Componente de Paginação do MUI */}
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]} // Opções de "itens por página".
                component="div" // Renderiza como <div>.
                count={totalElements} // N° total de itens (para calcular as páginas).
                rowsPerPage={rowsPerPage} // N° de itens por página selecionado.
                page={page} // Página atual.
                onPageChange={handleChangePage} // Função p/ mudar de página.
                onRowsPerPageChange={handleChangeRowsPerPage} // Função p/ mudar N° de itens.
                labelRowsPerPage="Itens por página:" // Texto customizado.
              />
            </Paper>
          )}
        </Container>
      </Box>

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