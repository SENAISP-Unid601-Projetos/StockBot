import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TablePagination, // ✅ Importante para a correção
  Chip,
} from "@mui/material";
import api from "../services/api";
import { toast } from "react-toastify";

function PedidosPage() {
  // Estados de Dados
  const [meusPedidos, setMeusPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingForm, setLoadingForm] = useState(false);

  // Estados de Paginação (A Correção Principal)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  // Estados do Formulário
  const [nomeItem, setNomeItem] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [justificativa, setJustificativa] = useState("");

  // --- BUSCAR PEDIDOS (Paginado e Ordenado) ---
  const fetchMeusPedidos = useCallback(async () => {
    setLoading(true);
    try {
      // ✅ Envia page, size e sort para o Back-end
      const response = await api.get(
        `/pedidos-compra/me?page=${page}&size=${rowsPerPage}&sort=dataPedido,desc`
      );

      // ✅ Lê corretamente o objeto Page do Spring
      setMeusPedidos(response.data.content || []);
      setTotalElements(response.data.totalElements);
    } catch (error) {
      toast.error("Falha ao carregar seus pedidos.");
      console.error("Erro fetchMeusPedidos:", error);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  // Carrega ao iniciar ou mudar de página
  useEffect(() => {
    fetchMeusPedidos();
  }, [fetchMeusPedidos]);

  // --- HANDLERS DE PAGINAÇÃO ---
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // --- ENVIAR NOVO PEDIDO ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nomeItem) return;

    setLoadingForm(true);
    try {
      await api.post("/pedidos-compra", {
        nomeItem,
        quantidade,
        justificativa,
      });

      toast.success("Pedido enviado com sucesso!");

      // Limpa o form e recarrega a lista na primeira página
      setNomeItem("");
      setQuantidade(1);
      setJustificativa("");
      setPage(0);
      fetchMeusPedidos(); // Recarrega os dados
    } catch (error) {
      toast.error(error.response?.data?.message || "Falha ao enviar pedido.");
    } finally {
      setLoadingForm(false);
    }
  };

  // Helper para cor do status
  const getStatusColor = (status) => {
    switch (status) {
      case "APROVADO":
        return "success";
      case "RECUSADO":
        return "error";
      default:
        return "warning"; // PENDENTE
    }
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        bgcolor: "background.default",
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="lg">
        {/* --- SEÇÃO 1: FORMULÁRIO --- */}
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
          Solicitar Compra
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Solicite itens que não existem no estoque atual.
        </Typography>

        <Paper sx={{ p: 3, mb: 5, boxShadow: 3 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Nome do Item (ex: Furadeira, Café)"
              value={nomeItem}
              onChange={(e) => setNomeItem(e.target.value)}
              required
              fullWidth
              margin="normal"
            />
            <TextField
              label="Quantidade"
              type="number"
              value={quantidade}
              onChange={(e) => setQuantidade(parseInt(e.target.value) || 1)}
              required
              fullWidth
              margin="normal"
              InputProps={{ inputProps: { min: 1 } }}
            />
            <TextField
              label="Justificativa (Opcional)"
              value={justificativa}
              onChange={(e) => setJustificativa(e.target.value)}
              multiline
              rows={2}
              fullWidth
              margin="normal"
              placeholder="Para que será usado?"
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{ mt: 2 }}
              disabled={loadingForm || !nomeItem}
            >
              {loadingForm ? <CircularProgress size={24} /> : "Enviar Pedido"}
            </Button>
          </Box>
        </Paper>

        {/* --- SEÇÃO 2: TABELA DE MEUS PEDIDOS --- */}
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
          Histórico de Pedidos
        </Typography>

        <Paper sx={{ boxShadow: 3, width: "100%", overflow: "hidden" }}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Item</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Qtd.</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Data</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Obs. Admin</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : meusPedidos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                      <Typography color="text.secondary">
                        Nenhum pedido realizado ainda.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  meusPedidos.map((pedido) => (
                    <TableRow hover key={pedido.id}>
                      <TableCell>{pedido.nomeItem}</TableCell>
                      <TableCell>{pedido.quantidade}</TableCell>
                      <TableCell>
                        {pedido.dataPedido
                          ? new Date(pedido.dataPedido).toLocaleDateString(
                              "pt-BR"
                            )
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={pedido.status}
                          color={getStatusColor(pedido.status)}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{pedido.motivoAcao || "-"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* ✅ COMPONENTE DE PAGINAÇÃO (Essencial) */}
          <TablePagination
            component="div"
            count={totalElements}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage="Linhas por página:"
          />
        </Paper>
      </Container>
    </Box>
  );
}

export default PedidosPage;
