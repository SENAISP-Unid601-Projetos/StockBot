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
  const [isModalVisible, setModalVisible] = useState(false);
  const [componenteEmEdicao, setComponenteEmEdicao] = useState(null);
  const [isUserAdmin, setIsUserAdmin] = useState(false); // Estado para admin
  const [termoBusca, setTermoBusca] = useState(""); // Estado da busca

  // Busca dados com parâmetro opcional
  const fetchData = async (termo = "") => {
    setLoading(true);
    try {
      // Envia o termo para o backend filtrar
      const response = await api.get(
        `/api/componentes?termo=${encodeURIComponent(termo)}`
      );
      setComponentes(response.data);
    } catch (error) {
      console.error("Erro ao buscar componentes:", error);
      toast.error("Não foi possível carregar os componentes.");
    } finally {
      setLoading(false);
    }
  };

  // Debounce para não chamar a API a cada tecla digitada
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetchData = useCallback(_.debounce(fetchData, 500), []);

  useEffect(() => {
    setIsUserAdmin(isAdmin());
    fetchData(); // Busca inicial
  }, []);

  // Efeito para buscar quando o termo muda
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
        fetchData(termoBusca); // Recarrega mantendo a busca atual
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

            {/* --- BARRA DE PESQUISA ADICIONADA --- */}
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
            <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: 3 }}>
              <TableContainer>
                <Table stickyHeader aria-label="tabela de componentes">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" sx={{ fontWeight: "bold" }}>
                        Nome
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: "bold" }}>
                        Patrimônio
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: "bold" }}>
                        Quantidade
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: "bold" }}>
                        Localização
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: "bold" }}>
                        Categoria
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: "bold" }}>
                        Ações
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {componentes.length > 0 ? (
                      componentes.map((componente) => (
                        <TableRow hover key={componente.id}>
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
