import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import _ from "lodash";

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
  TablePagination,
  Typography,
  IconButton,
  Stack,
  TextField,
  InputAdornment,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";

import ModalComponente from "../components/modalcomponente";
import api from "../services/api";
import { isAdmin } from "../services/authService";

function ComponentesPage() {
  const [componentes, setComponentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);
  const [componenteEmEdicao, setComponenteEmEdicao] = useState(null);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [termoBusca, setTermoBusca] = useState("");

const fetchData = useCallback(async (termo = "") => {
    setLoading(true);
    try {
      const queryParam = typeof termo === 'string' ? termo : "";
      
      const response = await api.get("/api/componentes", {
        params: { termo: queryParam } 
      });

      const todosComponentes = response.data || [];

      setTotalElements(todosComponentes.length);

      const inicio = page * rowsPerPage;
      const fim = inicio + rowsPerPage;
      
      setComponentes(todosComponentes.slice(inicio, fim));

    } catch (error) {
      console.error("Erro ao buscar componentes:", error);
      toast.error("Não foi possível carregar os componentes.");
      setComponentes([]);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  }, [
      page,
      rowsPerPage,
      setComponentes,
      setTotalElements,
      setLoading
    ]);

  const debouncedFetchData = useCallback(_.debounce(fetchData, 500), []);

  useEffect(() => {
    setIsUserAdmin(isAdmin());
        fetchData();
      }, [fetchData]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    debouncedFetchData(termoBusca);
  }, [termoBusca, debouncedFetchData]);

  const handleBuscaChange = (event) => {
    setTermoBusca(event.target.value);
  };

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
        fetchData(termoBusca);
        fetchData();

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
    fetchData(termoBusca);
  };

  return (
    <>
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