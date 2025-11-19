// 1. Importar 'useCallback'
import { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TablePagination, // 2. Importar o TablePagination
} from "@mui/material";

function AprovacoesPage() {
  // 3. Renomear estado para clareza e adicionar estados de paginação
  const [pedidosPaginados, setPedidosPaginados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Estados copiados da 'componentepages.jsx'
  const [page, setPage] = useState(0); // A página atual (começa em 0)
  const [rowsPerPage, setRowsPerPage] = useState(10); // Itens por página
  const [totalElements, setTotalElements] = useState(0); // Total de registos

  // 4. Transformar a busca de dados em um 'useCallback'
  //    Exatamente como na 'componentepages.jsx'
  const fetchPedidosCompra = useCallback(async () => {
    setLoading(true);
    try {
      // A API retorna a lista completa
      const response = await api.get("/api/pedidos-compra/pendentes");
      const todosPedidos = response.data || [];

      // Definimos o total de elementos
      setTotalElements(todosPedidos.length);

      // Calculamos a "fatia" (slice) para a paginação no frontend
      const inicio = page * rowsPerPage;
      const fim = inicio + rowsPerPage;
      setPedidosPaginados(todosPedidos.slice(inicio, fim));
    } catch (error) {
      toast.error("Falha ao carregar pedidos de compra pendentes.");
      console.error(error);
      setPedidosPaginados([]); // Garante array vazio em caso de erro
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
    // A função agora depende da página e dos itens por página
  }, [page, rowsPerPage, setPedidosPaginados, setTotalElements, setLoading]);

  // 5. O 'useEffect' agora reage à função 'fetchPedidosCompra'
  useEffect(() => {
    fetchPedidosCompra();
  }, [fetchPedidosCompra]);

  // 6. Adicionar os handlers de paginação
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Volta para a primeira página
  };

  // 7. Atualizar os handlers de aprovação/recusa
  const handleAprovar = async (id) => {
    setUpdatingId(id);
    try {
      await api.put(`/api/pedidos-compra/${id}/aprovar`);
      toast.success("Pedido aprovado com sucesso!");
      // Em vez de filtrar o estado local, chamamos 'fetchPedidosCompra'.
      // Isso recarrega a lista do servidor e re-aplica a paginação.
      fetchPedidosCompra();
    } catch (error) {
      toast.error("Falha ao aprovar o pedido.");
      console.error(error);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRecusar = async (id) => {
    setUpdatingId(id);
    try {
      await api.put(`/api/pedidos-compra/${id}/recusar`);
      toast.warn("Pedido recusado.");
      // Igualmente, chamamos 'fetchPedidosCompra' para atualizar a lista.
      fetchPedidosCompra();
    } catch (error) {
      toast.error("Falha ao recusar o pedido.");
      console.error(error);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
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
        <Typography
          variant="h4"
          component="h1"
          fontWeight="bold"
          sx={{ mb: 4 }}
        >
          Central de Aprovações
        </Typography>

        <Paper sx={{ width: "100%", boxShadow: 3, overflow: "hidden" }}>
          <TableContainer>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Item Solicitado
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Qtd.</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Justificativa
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Solicitante
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Data</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* 8. Mapear 'pedidosPaginados' em vez de 'pedidosCompra' */}
                  {pedidosPaginados.length > 0 ? (
                    pedidosPaginados.map((req) => (
                      <TableRow hover key={req.id}>
                        {/* O seu backend já mapeia os campos corretamente para RequisicaoDTO */}
                        <TableCell>{req.componenteNome}</TableCell>
                        <TableCell>{req.quantidade ?? "N/A"}</TableCell>
                        <TableCell>{req.justificativa ?? "N/A"}</TableCell>
                        <TableCell>{req.solicitanteEmail ?? "N/A"}</TableCell>
                        <TableCell>
                          {new Date(req.dataRequisicao).toLocaleString("pt-BR")}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              onClick={() => handleAprovar(req.id)}
                              disabled={loading || updatingId === req.id}
                            >
                              Aprovar
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              onClick={() => handleRecusar(req.id)}
                              disabled={loading || updatingId === req.id}
                            >
                              Recusar
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        Nenhum pedido de compra pendente.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </TableContainer>

          {/* 9. Adicionar o componente de paginação (copiado de componentepages.jsx) */}
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
      </Container>
    </Box>
  );
}

export default AprovacoesPage;
