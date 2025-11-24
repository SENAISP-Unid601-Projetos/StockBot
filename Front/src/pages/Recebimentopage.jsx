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
  CircularProgress,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import api from "../services/api";
import { toast } from "react-toastify";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function Recebimentopage() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- ESTADOS DE PAGINAÇÃO ---
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // --- ESTADOS DO DIALOG (AVISO) ---
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPedidoId, setSelectedPedidoId] = useState(null);

  // Busca dados
  const fetchAprovados = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/pedidos-compra/aprovados");
      setPedidos(response.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar lista de recebimento.");
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
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                      <Typography color="text.secondary">
                        Nenhum pedido aguardando chegada.
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
            count={pedidos.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Itens por página:"
          />
        </Paper>

        {/* --- AVISO PERSONALIZADO (Dialog) --- */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          // CORREÇÃO: Força a cor de fundo a seguir o tema (escuro ou claro)
          PaperProps={{
            sx: {
              backgroundColor: "background.paper",
              backgroundImage: "none",
            },
          }}
        >
          <DialogTitle
            id="alert-dialog-title"
            // CORREÇÃO: Vermelho no título para chamar atenção em qualquer modo
            sx={{ fontWeight: "bold", color: "#d32f2f" }}
          >
            {"Confirmar Recebimento?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              id="alert-dialog-description"
              // CORREÇÃO: Garante que o texto fique claro no modo escuro e escuro no modo claro
              sx={{ color: "text.primary" }}
            >
              Você está prestes a confirmar que este material chegou
              fisicamente.
              <br />
              <br />
              Isso irá aumentar automaticamente o estoque do item. Tem a
              certeza?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseDialog}
              // CORREÇÃO: Cor neutra visível em ambos os modos
              sx={{ color: "text.secondary" }}
            >
              Cancelar
            </Button>
            <Button
              onClick={executeConfirmarChegada}
              variant="contained"
              color="success"
              autoFocus
            >
              Sim, Confirmar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}

export default Recebimentopage;
