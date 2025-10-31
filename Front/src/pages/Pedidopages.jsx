// Em: src/pages/PedidosPage.jsx
import React, { useState, useEffect } from "react"; // Import React
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
} from "@mui/material"; // Import TableContainer
import api from "../services/api";
import { toast } from "react-toastify";

function PedidosPage() {
  const [meusPedidos, setMeusPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingForm, setLoadingForm] = useState(false);

  // Form states
  const [nomeItem, setNomeItem] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [justificativa, setJustificativa] = useState("");

  const fetchMeusPedidos = async () => {
    setLoading(true);
    try {
      const response = await api.get("/pedidos-compra/me"); // Endpoint /api/pedidos-compra/me
      setMeusPedidos(response.data || []); // Garante array
    } catch (error) {
      toast.error("Falha ao carregar seus pedidos.");
      console.error("Erro fetchMeusPedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeusPedidos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingForm(true);
    try {
      // Endpoint /api/pedidos-compra (POST)
      await api.post("/pedidos-compra", {
        nomeItem,
        quantidade,
        justificativa,
      });
      toast.success("Pedido de compra enviado para aprovação!");
      // Limpa o form
      setNomeItem("");
      setQuantidade(1);
      setJustificativa("");
      // Atualiza a lista
      fetchMeusPedidos();
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
        {/* Seção 1: Formulário de Pedido */}
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

        <Paper sx={{ p: 3, mb: 4, boxShadow: 3 }}>
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
              slotProps={{ input: { min: 1 } }}
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
              disabled={loadingForm || !nomeItem} // Desabilita se estiver carregando ou sem nome
            >
              {loadingForm ? (
                <CircularProgress size={24} />
              ) : (
                "Enviar Solicitação de Compra"
              )}
            </Button>
          </Box>
        </Paper>

        {/* Seção 2: Meus Pedidos Anteriores */}
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
          <Paper sx={{ boxShadow: 3 }}>
            <TableContainer>
              {" "}
              {/* Adicionado TableContainer */}
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
                  {meusPedidos.length > 0 ? (
                    meusPedidos.map((pedido) => (
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
            </TableContainer>{" "}
            {/* Fechado TableContainer */}
          </Paper>
        )}
      </Container>
    </Box>
  );
}

export default PedidosPage;
