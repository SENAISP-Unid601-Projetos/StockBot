import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress
} from "@mui/material";
import api from "../services/api";
import { toast } from "react-toastify";

function Recebimentopage() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAprovados = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/pedidos-compra/aprovados");
      setPedidos(response.data || []);
    } catch (error) {
      toast.error("Erro ao carregar recebimentos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAprovados();
  }, []);

  // --- LÓGICA DE PAGINAÇÃO ---
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Cria a "fatia" de dados para exibir na página atual
  const pedidosPaginados = pedidos.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // --- LÓGICA DO DIALOG ---
  const handleOpenConfirmDialog = (id) => {
    setSelectedPedidoId(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPedidoId(null);
  };

  const executeConfirmarChegada = async () => {
    handleCloseDialog();
    if (!selectedPedidoId) return;

    try {
      const toastId = toast.loading("Atualizando estoque...");
      await api.put(`/api/pedidos-compra/${selectedPedidoId}/receber`);
      toast.update(toastId, {
        render: "Estoque atualizado com sucesso!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      fetchAprovados();
    } catch (error) {
      toast.error("Erro ao confirmar recebimento.");
    }
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        backgroundColor: "background.default",
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
          Recebimento de Compras
        </Typography>

        <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: 5 }}>
          <TableContainer>
            <Table stickyHeader>
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
                  <TableCell align="center">Item</TableCell>
                  <TableCell align="center">Qtd.</TableCell>
                  <TableCell align="center">Solicitante</TableCell>
                  <TableCell align="center">Data Pedido</TableCell>
                  <TableCell align="center">Ação</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : pedidosPaginados.length > 0 ? (
                  pedidosPaginados.map((pedido) => (
                    <TableRow hover key={pedido.id}>
                      <TableCell align="center">
                        {pedido.componenteNome}
                      </TableCell>

                      <TableCell
                        align="center"
                        sx={{ fontWeight: "bold", fontSize: "1.1rem" }}
                      >
                        {pedido.quantidade}
                      </TableCell>

                      <TableCell align="center">
                        {pedido.solicitanteEmail}
                      </TableCell>
                      <TableCell align="center">
                        {new Date(pedido.dataRequisicao).toLocaleDateString(
                          "pt-BR"
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          startIcon={<CheckCircleIcon />}
                          onClick={() => handleOpenConfirmDialog(pedido.id)}
                        >
                          Confirmar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={5} align="center">Nenhum pedido aguardando recebimento.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </Box>
  );
}

export default Recebimentopage;