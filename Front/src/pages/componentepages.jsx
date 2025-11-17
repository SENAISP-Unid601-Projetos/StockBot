import { useState, useEffect, useCallback } from "react";
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
  TablePagination, // O componente de paginação!
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
  // 2. Novos estados para controlar a paginação
  const [componentes, setComponentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0); // A página atual (começa em 0)
  const [rowsPerPage, setRowsPerPage] = useState(10); // Itens por página
  const [totalElements, setTotalElements] = useState(0); // Total de registos no backend
  const [isModalVisible, setModalVisible] = useState(false);
  const [componenteEmEdicao, setComponenteEmEdicao] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `/api/componentes?page=${page}&size=${rowsPerPage}`
      );

      // 1. VEJA O QUE ESTÁ VINDO DA API (PRÓXIMO PASSO)
      console.log("Resposta da API:", response.data); 

      // 2. CORREÇÃO DEFENSIVA:
      // Se response.data.content não existir, use um array vazio []
      setComponentes(response.data.content || []); 
      
      // Faça o mesmo para totalElements, por segurança
      setTotalElements(response.data.totalElements || 0);

    } catch (error) {
      console.error("Erro ao buscar componentes:", error);
      toast.error("Não foi possível carregar os componentes.");
      setComponentes([]); // Em caso de erro, garanta um array vazio
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
  // 2. O useEffect agora apenas chama o fetchData
  useEffect(() => {
    fetchData();
  }, [fetchData]); // A dependência agora é a própria função

  // 4. Funções para lidar com as ações de paginação
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Volta para a primeira página sempre que muda o número de itens
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
        
        // 3. CHAME O FETCHDATA AQUI!
        fetchData(); 
        // Isso substitui a linha:
        // setComponentes((listaAtual) => ...);

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

              {/* 5. O Componente de Paginação do MUI */}
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

      {/* O Modal agora é "irmão" do Box, mas DENTRO do fragmento */}
      {isModalVisible && (
        <ModalComponente
          isVisible={isModalVisible}
          onClose={() => setModalVisible(false)}
          // 3. AGORA ISSO FUNCIONA!
          onComponenteAdicionado={fetchData} 
          componenteParaEditar={componenteEmEdicao}
    />
  )}

      {/* *** 2. FECHA O FRAGMENTO AQUI *** */}
    </>
  );
}

export default ComponentesPage;
