import { useState, useEffect } from "react";
import { toast } from "react-toastify";

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
  TextField,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import ModalComponente from "../components/modalcomponente";
import api from "../services/api";

function ComponentesPage() {
  const [componentes, setComponentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [componenteEmEdicao, setComponenteEmEdicao] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/componentes");
      setComponentes(response.data);
    } catch (error) {
      console.error("Erro ao buscar componentes:", error);
      toast.error("Não foi possível carregar os componentes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
        setComponentes((listaAtual) =>
          listaAtual.filter((componente) => componente.id !== id)
        );
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

  return (
    // *** 1. ADICIONA O FRAGMENTO AQUI (elemento "pai" único) ***
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
          {/* Header da página */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Typography variant="h4" component="h1" fontWeight="bold">
              Gerenciamento de Itens
            </Typography>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAdd}
              sx={{
                backgroundColor: "#ce0000",
                "&:hover": { backgroundColor: "#a40000" },
              }}
            >
              Adicionar Item
            </Button>
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
                      <TableCell sx={{ fontWeight: "bold" }}>Nome</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Patrimônio
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Quantidade
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {componentes.map((componente) => (
                      <TableRow hover key={componente.id}>
                        <TableCell>{componente.nome}</TableCell>
                        <TableCell>{componente.codigoPatrimonio}</TableCell>
                        <TableCell>{componente.quantidade}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <IconButton
                              color="info"
                              onClick={() => handleEdit(componente)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              color="error"
                              onClick={() => handleDelete(componente.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </Container>
      </Box>

      {/* O Modal agora é "irmão" do Box, mas DENTRO do fragmento */}
      {isModalVisible && (
        <ModalComponente
          isVisible={isModalVisible}
          onClose={() => setModalVisible(false)}
          onComponenteAdicionado={fetchData}
          componenteParaEditar={componenteEmEdicao}
        />
      )}

      {/* *** 2. FECHA O FRAGMENTO AQUI *** */}
    </>
  );
}

export default ComponentesPage;
