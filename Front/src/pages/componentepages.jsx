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
  // Imports para o Dialog (Aviso Personalizado)
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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

  // --- ESTADOS PARA O DIALOG DE EXCLUSÃO ---
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

  const fetchData = useCallback(
    async (termo = "") => {
      setLoading(true);
      try {
        const queryParam = typeof termo === "string" ? termo : "";

        const response = await api.get("/api/componentes", {
          params: { termo: queryParam },
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
    },
    [page, rowsPerPage]
  );

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

  // --- LÓGICA DE EXCLUSÃO ATUALIZADA ---

  // 1. Abre o aviso
  const handleDeleteClick = (id) => {
    setIdToDelete(id);
    setOpenDeleteDialog(true);
  };

  // 2. Fecha o aviso
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setIdToDelete(null);
  };

  // 3. Confirma a exclusão
  const handleConfirmDelete = async () => {
    handleCloseDeleteDialog(); // Fecha o modal primeiro

    if (!idToDelete) return;

    try {
      await api.delete(`/api/componentes/${idToDelete}`);
      toast.success("Componente excluído com sucesso!");
      // Atualiza a lista
      fetchData(termoBusca);
    } catch (error) {
      toast.error("Falha ao excluir o componente.");
      console.error(error);
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

            {/* --- BARRA DE PESQUISA --- */}
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
                        "& th": {
                          backgroundColor: "#2a3c61ff",
                          color: "#ffffff",
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
                                  // ALTERADO: Agora chama a função que abre o Dialog
                                  onClick={() =>
                                    handleDeleteClick(componente.id)
                                  }
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
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onComponenteAdicionado={handleComponenteAdicionado}
        componenteParaEditar={componenteEmEdicao}
      />

      {/* --- AVISO PERSONALIZADO DE EXCLUSÃO --- */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            backgroundColor: "background.paper", // Adapta ao tema escuro/claro
            backgroundImage: "none",
          },
        }}
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{ fontWeight: "bold", color: "#d32f2f" }} // Título Vermelho
        >
          {"Excluir Componente?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            sx={{ color: "text.primary" }}
          >
            Tem a certeza que deseja excluir este componente?
            <br />
            Esta ação <strong>não pode ser desfeita</strong>.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDeleteDialog}
            sx={{ color: "text.secondary" }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            autoFocus
          >
            Sim, Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ComponentesPage;
