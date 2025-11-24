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

import ModalComponente from "../components/ModalComponente"; // Verifique se o nome do arquivo é minúsculo ou maiúsculo
import api from "../services/api";
import { isAdmin } from "../services/authService";

function ComponentesPage() {
  const [componentes, setComponentes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Paginação
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  const [isModalVisible, setModalVisible] = useState(false);
  const [componenteEmEdicao, setComponenteEmEdicao] = useState(null);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [termoBusca, setTermoBusca] = useState("");

  const fetchData = useCallback(
    async (termo = "") => {
      setLoading(true);
      try {
        // Configura os parâmetros para o Spring Boot
        const params = {
          page: page,
          size: rowsPerPage,
          // Se tiver termo, manda. Se não, não manda nada.
          ...(termo && { termo: termo }),
        };

        const response = await api.get("/api/componentes", { params });

        // --- CORREÇÃO AQUI ---
        // O Spring retorna um objeto Page, não uma lista direta.
        // A lista está dentro de .content
        const data = response.data;

        setComponentes(data.content || []); // Pega a lista de dentro do content
        setTotalElements(data.totalElements || 0); // Pega o total real do banco
      } catch (error) {
        console.error("Erro ao buscar componentes:", error);
        toast.error("Não foi possível carregar os componentes.");
        setComponentes([]);
        setTotalElements(0);
      } finally {
        setLoading(false);
      }
    },
    [page, rowsPerPage]
  ); // Recarrega se mudar página ou tamanho

  // Debounce para não chamar a API a cada letra digitada
  const debouncedFetchData = useCallback(
    _.debounce((termo) => {
      setPage(0); // Volta para a página 1 ao pesquisar
      fetchData(termo);
    }, 500),
    [fetchData]
  );

  useEffect(() => {
    setIsUserAdmin(isAdmin());
    fetchData(termoBusca);
  }, [page, rowsPerPage]); // Dispara quando muda página/tamanho

  // Dispara busca quando digita (usando debounce)
  useEffect(() => {
    // Só chama o debounce se o termo mudou, para evitar loop com o useEffect de cima
    if (termoBusca !== "") {
      debouncedFetchData(termoBusca);
    } else {
      fetchData(""); // Se limpar a busca, carrega tudo normal
    }
  }, [termoBusca]); // Removido debouncedFetchData da dependência para evitar loop

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
      } catch (error) {
        toast.error("Falha ao excluir o componente.");
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
                startIcon={<AddIcon />}
                sx={{
                  backgroundColor: "#ce0000",
                  "&:hover": { backgroundColor: "#a40000" },
                }}
              >
                Novo Item
              </Button>
            )}
          </Box>

          {loading && componentes.length === 0 ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Paper
              sx={{
                width: "100%",
                overflow: "hidden",
                boxShadow: 3,
                borderRadius: 2,
              }}
            >
              <TableContainer>
                <Table stickyHeader aria-label="tabela de componentes">
                  <TableHead>
                    <TableRow
                      sx={{
                        "& th": {
                          backgroundColor: "#2a3c61",
                          color: "#ffffff",
                          fontWeight: "bold",
                        },
                      }}
                    >
                      <TableCell align="center">Id</TableCell>
                      <TableCell align="left">Nome</TableCell>
                      <TableCell align="center">Patrimônio</TableCell>
                      <TableCell align="center">Qtd</TableCell>
                      <TableCell align="center">Local</TableCell>
                      <TableCell align="center">Categoria</TableCell>
                      {isUserAdmin && (
                        <TableCell align="center">Ações</TableCell>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {componentes.length > 0 ? (
                      componentes.map((componente) => (
                        <TableRow hover key={componente.id}>
                          <TableCell
                            align="center"
                            sx={{
                              color: "text.secondary",
                              fontFamily: "monospace",
                            }}
                          >
                            #{componente.id}
                          </TableCell>
                          <TableCell align="left" sx={{ fontWeight: 500 }}>
                            {componente.nome}
                          </TableCell>
                          <TableCell align="center">
                            {componente.codigoPatrimonio}
                          </TableCell>
                          <TableCell align="center">
                            <Typography
                              variant="body2"
                              sx={{
                                color:
                                  componente.quantidade <=
                                  componente.nivelMinimoEstoque
                                    ? "error.main"
                                    : "text.primary",
                                fontWeight:
                                  componente.quantidade <=
                                  componente.nivelMinimoEstoque
                                    ? "bold"
                                    : "normal",
                              }}
                            >
                              {componente.quantidade}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            {componente.localizacao || "-"}
                          </TableCell>
                          <TableCell align="center">
                            {componente.categoria || "-"}
                          </TableCell>

                          {isUserAdmin && (
                            <TableCell align="center">
                              <Stack
                                direction="row"
                                spacing={1}
                                justifyContent="center"
                              >
                                <IconButton
                                  color="primary"
                                  size="small"
                                  onClick={() => handleEdit(componente)}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  color="error"
                                  size="small"
                                  onClick={() => handleDelete(componente.id)}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Stack>
                            </TableCell>
                          )}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={isUserAdmin ? 7 : 6} align="center">
                          <Typography color="text.secondary" sx={{ p: 4 }}>
                            Nenhum componente encontrado.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={totalElements}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Itens por página:"
              />
            </Paper>
          )}
        </Container>
      </Box>

      <ModalComponente
        open={isModalVisible} // Mudei isVisible para open, se o seu modal novo usar Dialog do MUI
        onClose={() => setModalVisible(false)}
        onComponenteAdicionado={handleComponenteAdicionado}
        componenteParaEditar={componenteEmEdicao}
      />
    </>
  );
}

export default ComponentesPage;
