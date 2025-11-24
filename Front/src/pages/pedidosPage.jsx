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
  TablePagination,
  Autocomplete,
  FormControlLabel,
  Switch,
  Chip,
} from "@mui/material";
import api from "../services/api";
import { toast } from "react-toastify";

function PedidosPage() {
  const [meusPedidosPaginados, setMeusPedidosPaginados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingForm, setLoadingForm] = useState(false);

  // Paginação
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalElements, setTotalElements] = useState(0);

  // Form states
  const [nomeItem, setNomeItem] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [justificativa, setJustificativa] = useState("");

  // Novos estados para Item Existente
  const [isItemExistente, setIsItemExistente] = useState(true);
  const [listaComponentes, setListaComponentes] = useState([]);
  const [componenteSelecionado, setComponenteSelecionado] = useState(null);

  useEffect(() => {
    if (isItemExistente) {
      api
        .get("/api/componentes")
        .then((res) => setListaComponentes(res.data || []))
        .catch(() => toast.error("Erro ao carregar lista de itens."));
    }
  }, [isItemExistente]);

  const fetchMeusPedidos = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/pedidos-compra/me");
      const todosPedidos = response.data || [];
      setTotalElements(todosPedidos.length);
      const inicio = page * rowsPerPage;
      const fim = inicio + rowsPerPage;
      setMeusPedidosPaginados(todosPedidos.slice(inicio, fim));
    } catch (error) {
      toast.error("Falha ao carregar seus pedidos.");
      setMeusPedidosPaginados([]);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchMeusPedidos();
  }, [fetchMeusPedidos]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isItemExistente && !componenteSelecionado) {
      toast.error("Selecione um item da lista.");
      return;
    }
    if (!isItemExistente && !nomeItem) {
      toast.error("Digite o nome do item.");
      return;
    }

    setLoadingForm(true);
    try {
      await api.post("/api/pedidos-compra", {
        componenteId: isItemExistente ? componenteSelecionado.id : null,
        nomeItem: isItemExistente ? componenteSelecionado.nome : nomeItem,
        quantidade,
        justificativa,
      });

      toast.success("Pedido enviado com sucesso!");

      setNomeItem("");
      setComponenteSelecionado(null);
      setQuantidade(1);
      setJustificativa("");
      if (page !== 0) setPage(0);
      else fetchMeusPedidos();
    } catch (error) {
      toast.error(error.response?.data?.message || "Falha ao enviar pedido.");
    } finally {
      setLoadingForm(false);
    }
  };

  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 3, backgroundColor: "background.default" }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          component="h1"
          fontWeight="bold"
          sx={{ mb: 2 }}
        >
          Solicitar Compra
        </Typography>

        <Paper sx={{ p: 4, mb: 4, boxShadow: 5 }}>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <FormControlLabel
              control={
                <Switch
                  checked={isItemExistente}
                  onChange={(e) => setIsItemExistente(e.target.checked)}
                />
              }
              label={
                isItemExistente
                  ? "Item já cadastrado no sistema"
                  : "Item novo (não cadastrado)"
              }
              sx={{ mb: 2, display: "block" }}
            />

            {isItemExistente ? (
              <Autocomplete
                options={listaComponentes}
                getOptionLabel={(option) =>
                  `${option.nome} (Patrimônio: ${option.codigoPatrimonio})`
                }
                value={componenteSelecionado}
                onChange={(event, newValue) =>
                  setComponenteSelecionado(newValue)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Selecione o Item"
                    required
                    margin="normal"
                  />
                )}
                noOptionsText="Nenhum item encontrado"
              />
            ) : (
              <TextField
                label="Nome do Novo Item"
                value={nomeItem}
                onChange={(e) => setNomeItem(e.target.value)}
                required
                fullWidth
                margin="normal"
              />
            )}

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
              label="Justificativa"
              value={justificativa}
              onChange={(e) => setJustificativa(e.target.value)}
              multiline
              rows={3}
              fullWidth
              margin="normal"
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{ mt: 2 }}
              disabled={loadingForm}
            >
              {loadingForm ? (
                <CircularProgress size={24} />
              ) : (
                "Enviar Solicitação"
              )}
            </Button>
          </Box>
        </Paper>

        {/* --- TABELA DE MEUS PEDIDOS PADRONIZADA --- */}
        <Typography
          variant="h5"
          component="h2"
          fontWeight="bold"
          sx={{ mb: 3 }}
        >
          Meus Pedidos
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: 5 }}>
            <TableContainer>
              <Table stickyHeader>
                <TableHead>
                  {/* ESTILO DO CABEÇALHO PADRONIZADO */}
                  <TableRow
                    sx={{
                      "& th": {
                        backgroundColor: "#2a3c61ff", // Azul escuro
                        color: "#ffffff", // Texto branco
                        fontWeight: "bold",
                      },
                    }}
                  >
                    <TableCell align="center">Item</TableCell>
                    <TableCell align="center">Qtd.</TableCell>
                    <TableCell align="center">Data</TableCell>
                    <TableCell align="center">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {meusPedidosPaginados.map((pedido) => (
                    <TableRow hover key={pedido.id}>
                      <TableCell align="center">{pedido.nomeItem}</TableCell>
                      <TableCell align="center">{pedido.quantidade}</TableCell>
                      <TableCell align="center">
                        {pedido.dataPedido
                          ? new Date(pedido.dataPedido).toLocaleDateString(
                              "pt-BR"
                            )
                          : "-"}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={pedido.status}
                          size="small"
                          color={
                            pedido.status === "APROVADO"
                              ? "success"
                              : pedido.status === "RECUSADO"
                              ? "error"
                              : pedido.status === "RECEBIDO"
                              ? "info"
                              : "warning"
                          }
                          variant="outlined"
                          sx={{ fontWeight: "bold" }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  {meusPedidosPaginados.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                        <Typography color="text.secondary">
                          Nenhum pedido realizado.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10]}
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
  );
}

export default PedidosPage;
