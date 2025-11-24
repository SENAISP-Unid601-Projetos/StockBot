import React, { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  CircularProgress,
  Tabs,
  Tab,
} from "@mui/material";
import TabelaRequisicoes from "../components/TableComponente";

function Aprovacaopages() {
  const [tabIndex, setTabIndex] = useState(0);

  // --- ESTADOS PARA PEDIDOS DE COMPRA ---
  const [pedidosPaginados, setPedidosPaginados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const fetchPedidosCompra = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/pedidos-compra/pendentes");
      const todosPedidos = response.data || [];
      setTotalElements(todosPedidos.length);

      const inicio = page * rowsPerPage;
      const fim = inicio + rowsPerPage;
      setPedidosPaginados(todosPedidos.slice(inicio, fim));
    } catch (error) {
      toast.error("Falha ao carregar pedidos de compra.");
      setPedidosPaginados([]);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    if (tabIndex === 0) {
      fetchPedidosCompra();
    }
  }, [tabIndex, fetchPedidosCompra]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAprovarCompra = async (id) => {
    setUpdatingId(id);
    try {
      await api.put(`/api/pedidos-compra/${id}/aprovar`);
      toast.success("Pedido aprovado!");
      fetchPedidosCompra();
    } catch (error) {
      toast.error("Erro ao aprovar.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRecusarCompra = async (id) => {
    setUpdatingId(id);
    try {
      await api.put(`/api/pedidos-compra/${id}/recusar`);
      toast.warn("Pedido recusado.");
      fetchPedidosCompra();
    } catch (error) {
      toast.error("Erro ao recusar.");
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
          sx={{ mb: 2 }}
        >
          Central de Aprovações
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs value={tabIndex} onChange={handleTabChange}>
            <Tab label="Pedidos de Compra" />
          </Tabs>
        </Box>

        {/* === ABA 0: PEDIDOS DE COMPRA === */}
        {tabIndex === 0 && (
          <Paper sx={{ width: "100%", boxShadow: 5, overflow: "hidden" }}>
            <TableContainer>
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Table stickyHeader>
                  <TableHead>
                    {/* ESTILO PADRONIZADO */}
                    <TableRow
                      sx={{
                        "& th": {
                          backgroundColor: "#2a3c61ff",
                          color: "#ffffff",
                          fontWeight: "bold",
                        },
                      }}
                    >
                      <TableCell align="center">Item</TableCell>
                      <TableCell align="center">Qtd.</TableCell>
                      <TableCell align="center">Justificativa</TableCell>
                      <TableCell align="center">Solicitante</TableCell>
                      <TableCell align="center">Data</TableCell>
                      <TableCell align="center">Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pedidosPaginados.length > 0 ? (
                      pedidosPaginados.map((req) => (
                        <TableRow hover key={req.id}>
                          <TableCell align="center">
                            {req.componenteNome}
                          </TableCell>
                          <TableCell align="center">{req.quantidade}</TableCell>
                          <TableCell align="center">
                            {req.justificativa}
                          </TableCell>
                          <TableCell align="center">
                            {req.solicitanteEmail}
                          </TableCell>
                          <TableCell align="center">
                            {new Date(req.dataRequisicao).toLocaleDateString(
                              "pt-BR"
                            )}
                          </TableCell>
                          <TableCell align="center">
                            <Box
                              sx={{
                                display: "flex",
                                gap: 1,
                                justifyContent: "center",
                              }}
                            >
                              <Button
                                variant="contained"
                                color="success"
                                size="small"
                                onClick={() => handleAprovarCompra(req.id)}
                                disabled={updatingId === req.id}
                              >
                                Aprovar
                              </Button>
                              <Button
                                variant="contained"
                                color="error"
                                size="small"
                                onClick={() => handleRecusarCompra(req.id)}
                                disabled={updatingId === req.id}
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
            <TablePagination
              rowsPerPageOptions={[5, 10]}
              component="div"
              count={totalElements}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Itens:"
            />
          </Paper>
        )}

        {/* === ABA 1: SOLICITAÇÕES DE ESTOQUE === */}
        {tabIndex === 1 && <TabelaRequisicoes />}
      </Container>
    </Box>
  );
}

export default Aprovacaopages;
