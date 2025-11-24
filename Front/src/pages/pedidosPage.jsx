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
  Autocomplete, // Novo
  FormControlLabel, // Novo
  Switch, // Novo
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

  // Carregar lista de componentes se o switch estiver ativo
  useEffect(() => {
    if (isItemExistente) {
      api.get("/api/componentes")
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
    
    // Validação
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
        // Se existente, manda ID. Se novo, manda nome.
        componenteId: isItemExistente ? componenteSelecionado.id : null,
        nomeItem: isItemExistente ? componenteSelecionado.nome : nomeItem,
        quantidade,
        justificativa,
      });
      
      toast.success("Pedido enviado com sucesso!");
      
      // Reset
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
    <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: "background.default" }}>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 2 }}>
          Solicitar Compra
        </Typography>

        <Paper sx={{ p: 4, mb: 4, boxShadow: 3 }}>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            
            {/* Switch para escolher o modo */}
            <FormControlLabel
              control={
                <Switch
                  checked={isItemExistente}
                  onChange={(e) => setIsItemExistente(e.target.checked)}
                />
              }
              label={isItemExistente ? "Item já cadastrado no sistema" : "Item novo (não cadastrado)"}
              sx={{ mb: 2, display: "block" }}
            />

            {isItemExistente ? (
              <Autocomplete
                options={listaComponentes}
                getOptionLabel={(option) => `${option.nome} (Patrimônio: ${option.codigoPatrimonio})`}
                value={componenteSelecionado}
                onChange={(event, newValue) => setComponenteSelecionado(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Selecione o Item" required margin="normal" />
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
            <Button type="submit" variant="contained" size="large" sx={{ mt: 2 }} disabled={loadingForm}>
              {loadingForm ? <CircularProgress size={24} /> : "Enviar Solicitação"}
            </Button>
          </Box>
        </Paper>

        {/* Tabela de Meus Pedidos (igual ao anterior) */}
        <Typography variant="h5" component="h2" fontWeight="bold" sx={{ mb: 3 }}>
          Meus Pedidos
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <Paper sx={{ boxShadow: 3, overflow: "hidden" }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell>Qtd.</TableCell>
                    <TableCell>Data</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {meusPedidosPaginados.map((pedido) => (
                    <TableRow hover key={pedido.id}>
                      <TableCell>{pedido.nomeItem}</TableCell>
                      <TableCell>{pedido.quantidade}</TableCell>
                      <TableCell>{pedido.dataPedido ? new Date(pedido.dataPedido).toLocaleDateString("pt-BR") : "-"}</TableCell>
                      <TableCell>{pedido.status}</TableCell>
                    </TableRow>
                  ))}
                  {meusPedidosPaginados.length === 0 && (
                      <TableRow><TableCell colSpan={4} align="center">Nenhum pedido.</TableCell></TableRow>
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
            />
          </Paper>
        )}
      </Container>
    </Box>
  );
}

export default PedidosPage;