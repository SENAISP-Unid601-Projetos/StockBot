// 1. Importar 'useCallback'
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
  TablePagination, // 2. Importar TablePagination
} from "@mui/material";
import api from "../services/api";
import { toast } from "react-toastify";

function PedidosPage() {
  // 3. Renomear estado da tabela e adicionar estados de paginação
  const [meusPedidosPaginados, setMeusPedidosPaginados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingForm, setLoadingForm] = useState(false);

  // Estados de paginação (para a tabela)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Um valor menor para esta tabela
  const [totalElements, setTotalElements] = useState(0);

  // Form states (não mudam)
  const [nomeItem, setNomeItem] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [justificativa, setJustificativa] = useState("");

  // 4. Transformar 'fetchMeusPedidos' em 'useCallback' com lógica de paginação
  const fetchMeusPedidos = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/pedidos-compra/me");
      const todosPedidos = response.data || [];

      // Define o total de elementos
      setTotalElements(todosPedidos.length);

      // Simula a paginação no frontend (slice)
      const inicio = page * rowsPerPage;
      const fim = inicio + rowsPerPage;
      setMeusPedidosPaginados(todosPedidos.slice(inicio, fim));
    } catch (error) {
      toast.error("Falha ao carregar seus pedidos.");
      console.error("Erro fetchMeusPedidos:", error);
      setMeusPedidosPaginados([]); // Garante array vazio
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
    // Depende da página e itens por página
  }, [page, rowsPerPage, setMeusPedidosPaginados, setTotalElements, setLoading]);

  // 5. useEffect agora depende do 'fetchMeusPedidos'
  useEffect(() => {
    fetchMeusPedidos();
  }, [fetchMeusPedidos]);

  // 6. Adicionar os handlers de paginação
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Volta para a primeira página
  };

  // O 'handleSubmit' (formulário) já chama 'fetchMeusPedidos()',
  // então ele recarregará a tabela paginada automaticamente.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingForm(true);
    try {
      await api.post("/api/pedidos-compra", {
        nomeItem,
        quantidade,
        justificativa,
      });
      toast.success("Pedido de compra enviado para aprovação!");
      setNomeItem("");
      setQuantidade(1);
      setJustificativa("");
      
      // Se estivermos em uma página diferente da primeira, voltamos para a primeira
      // para que o usuário veja o novo item (que geralmente é o mais recente).
      if (page !== 0) {
        setPage(0); 
      } else {
        // Se já estiver na primeira página, apenas atualiza os dados
        fetchMeusPedidos();
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Falha ao enviar pedido.");
      console.error("Erro handleSubmit Pedido:", error);
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
        {/* Seção 1: Formulário de Pedido (Não muda) */}
        <Typography
          variant="h4"
          component="h1"
          fontWeight="bold"
          sx={{ mb: 2 }}
        >
          Solicitar Compra de Novo Item
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Use este formulário para solicitar a compra de um item que NÃO existe
          no estoque (Ex: "Makita", "Novos Computadores").
        </Typography>

        <Paper sx={{ p: 5, mb: 4, boxShadow: 3 }}>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              label="Nome do Item"
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
              label="Justificativa (Por que você precisa disso?)"
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
              disabled={loadingForm || !nomeItem}
            >
              {loadingForm ? (
                <CircularProgress size={24} />
              ) : (
                "Enviar Solicitação de Compra"
              )}
            </Button>
          </Box>
        </Paper>

        {/* Seção 2: Meus Pedidos Anteriores (Com Paginação) */}
        <Typography
          variant="h5"
          component="h2"
          fontWeight="bold"
          sx={{ mb: 3 }}
        >
          Meus Pedidos de Compra Anteriores
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
                  {/* 7. Mapear o estado paginado */}
                  {meusPedidosPaginados.length > 0 ? (
                    meusPedidosPaginados.map((pedido) => (
                      <TableRow hover key={pedido.id}>
                        <TableCell>{pedido.nomeItem}</TableCell>
                        <TableCell>{pedido.quantidade}</TableCell>
                        <TableCell>
                          {pedido.dataPedido
                            ? new Date(pedido.dataPedido).toLocaleDateString(
                                "pt-BR"
                              )
                            : "N/A"}
                        </TableCell>
                        <TableCell>{pedido.status}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Typography color="text.secondary" sx={{ p: 2 }}>
                          Você ainda não fez nenhum pedido de compra.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            
            {/* 8. Adicionar o componente de paginação */}
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
  );
}

export default PedidosPage;