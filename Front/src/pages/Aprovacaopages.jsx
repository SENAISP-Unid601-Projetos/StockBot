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
import TabelaRequisicoes from "../components/TableComponente"; // Importa a tabela de estoque antiga

function Aprovacaopages() {
  const [tabIndex, setTabIndex] = useState(0); // 0 = Compras, 1 = Estoque

  // --- ESTADOS PARA PEDIDOS DE COMPRA (Aba 0) ---
  const [pedidosPaginados, setPedidosPaginados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  // Handler de Abas
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  // --- LÓGICA DE PEDIDOS DE COMPRA (Aba 0) ---
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

  // Carrega dados apenas se estiver na aba de Compras
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
      toast.success("Pedido aprovado! Enviado para recebimento.");
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
    <Box component="main" sx={{ flexGrow: 1, p: 3, minHeight: "100vh", backgroundColor: "background.default" }}>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 2 }}>
          Central de Aprovações
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs value={tabIndex} onChange={handleTabChange}>
            <Tab label="Pedidos de Compra" />
            <Tab label="Solicitações de Estoque" />
          </Tabs>
        </Box>

        {/* === ABA 0: PEDIDOS DE COMPRA === */}
        {tabIndex === 0 && (
          <Paper sx={{ width: "100%", boxShadow: 3, overflow: "hidden" }}>
            <TableContainer>
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}><CircularProgress /></Box>
              ) : (
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>Item</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Qtd.</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Justificativa</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Solicitante</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Data</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pedidosPaginados.length > 0 ? (
                      pedidosPaginados.map((req) => (
                        <TableRow hover key={req.id}>
                          <TableCell>{req.componenteNome}</TableCell>
                          <TableCell>{req.quantidade}</TableCell>
                          <TableCell>{req.justificativa}</TableCell>
                          <TableCell>{req.solicitanteEmail}</TableCell>
                          <TableCell>{new Date(req.dataRequisicao).toLocaleDateString("pt-BR")}</TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", gap: 1 }}>
                              <Button 
                                variant="contained" color="success" size="small"
                                onClick={() => handleAprovarCompra(req.id)}
                                disabled={updatingId === req.id}
                              >
                                Aprovar
                              </Button>
                              <Button 
                                variant="contained" color="error" size="small"
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
                        <TableCell colSpan={6} align="center">Nenhum pedido de compra pendente.</TableCell>
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

        {/* === ABA 1: SOLICITAÇÕES DE ESTOQUE (Tabela antiga) === */}
        {tabIndex === 1 && (
          <TabelaRequisicoes />
        )}

      </Container>
    </Box>
  );
}

export default Aprovacaopages;