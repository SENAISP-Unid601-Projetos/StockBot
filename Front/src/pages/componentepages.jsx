import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import _ from "lodash";
import { useMemo } from "react";

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
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import UploadFileIcon from "@mui/icons-material/UploadFile";

import ModalComponente from "../components/modalcomponente";
import api from "../services/api";
import { isAdmin } from "../services/authService";

function ComponentesPage() {
  // --- ESTADOS ---
  const [componentes, setComponentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);
  const [componenteEmEdicao, setComponenteEmEdicao] = useState(null);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [termoBusca, setTermoBusca] = useState("");

  // Estados para o Dialog de Exclusão
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

  // Referência para o input de arquivo (CSV)
  const fileInputRef = useRef(null);

  // --- LÓGICA DE BUSCA ---
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

        // Paginação no Front (já que o back retorna tudo na busca simples)
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

  const debouncedFetchData = useMemo(
    () =>
      _.debounce((termo) => {
        fetchData(termo);
      }, 500),
    [fetchData]
  );

  useEffect(() => {
    setIsUserAdmin(isAdmin());
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    debouncedFetchData(termoBusca);
  }, [termoBusca, debouncedFetchData]);

  // --- HANDLERS DE PAGINAÇÃO E BUSCA ---
  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleBuscaChange = (event) => setTermoBusca(event.target.value);

  // --- HANDLERS DE EDIÇÃO E ADIÇÃO ---
  const handleEdit = (componente) => {
    setComponenteEmEdicao(componente);
    setModalVisible(true);
  };

  const handleAdd = () => {
    setComponenteEmEdicao(null);
    setModalVisible(true);
  };

  const handleComponenteAdicionado = () => {
    fetchData(termoBusca);
  };

  // --- HANDLERS DE EXCLUSÃO ---
  const handleDeleteClick = (id) => {
    setIdToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setIdToDelete(null);
  };

  const handleConfirmDelete = async () => {
    handleCloseDeleteDialog();
    if (!idToDelete) return;

    try {
      await api.delete(`/api/componentes/${idToDelete}`);
      toast.success("Componente excluído com sucesso!");
      fetchData(termoBusca);
    } catch (error) {
      toast.error("Falha ao excluir o componente.");
      console.error(error);
    }
  };

  // --- HANDLERS DE IMPORTAÇÃO/EXPORTAÇÃO (CSV) ---
  const handleImportClick = () => fileInputRef.current.click();

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file); // Esse nome "file" tem que bater com o Java

    setLoading(true);
    try {
      // --- CORREÇÃO AQUI ---
      // 1. Removi o objeto { headers: ... }. O Axios faz isso automático corretamente.
      await api.post("/api/componentes/importar", formData);

      toast.success("Importação realizada com sucesso!");
      fetchData(termoBusca);
    } catch (error) {
      console.error("Erro upload:", error);

      // --- MELHORIA AQUI ---
      // 2. Pegamos a mensagem que o seu Java mandou no "body" do ResponseEntity
      // Se o Java mandar "Erro: Arquivo vazio", o Toast vai mostrar isso.
      const mensagemDoBack = error.response?.data || "Erro ao importar CSV.";
      toast.error(mensagemDoBack);
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleExportClick = async () => {
    try {
      const response = await api.get("/api/componentes/exportar", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "estoque.csv");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Erro export:", error);
      toast.error("Erro ao exportar CSV.");
    }
  };

  // --- RENDERIZAÇÃO ---
  return (
    <>
      {/* Input Oculto para Upload */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept=".csv"
        onChange={handleFileUpload}
      />

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

            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
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
                <>
                  <Button
                    variant="outlined"
                    startIcon={<FileDownloadIcon />}
                    onClick={handleExportClick}
                  >
                    Exportar
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<UploadFileIcon />}
                    onClick={handleImportClick}
                  >
                    Importar
                  </Button>

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
                </>
              )}
            </Box>
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
                        <TableCell colSpan={isUserAdmin ? 7 : 6} align="center">
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
            backgroundColor: "background.paper",
            backgroundImage: "none",
          },
        }}
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{ fontWeight: "bold", color: "#d32f2f" }}
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
