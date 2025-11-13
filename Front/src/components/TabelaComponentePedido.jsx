// Em: src/components/TabelaPedidosCompra.jsx
import { useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Typography, // Adicione Typography
} from "@mui/material";

function TabelaPedidosCompra() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPedidos = async () => {
    setLoading(true);
    try {
      const response = await api.get("/pedidos-compra/pendentes"); // Endpoint /api/pedidos-compra/pendentes
      setPedidos(response.data.content || []); // Garante array
    } catch (error) {
      toast.error("Falha ao carregar pedidos de compra.");
      console.error("Erro fetchPedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  const handleAprovar = async (id) => {
    try {
      await api.put(`/pedidos-compra/${id}/aprovar`); // Endpoint /api/pedidos-compra/{id}/aprovar
      toast.success("Pedido de compra APROVADO!");
      fetchPedidos();
    } catch (error) {
      toast.error("Falha ao aprovar.");
      console.error("Erro handleAprovar Pedido:", error);
    }
  };

  const handleRecusar = async (id) => {
    try {
      await api.put(`/pedidos-compra/${id}/recusar`); // Endpoint /api/pedidos-compra/{id}/recusar
      toast.warn("Pedido de compra RECUSADO.");
      fetchPedidos();
    } catch (error) {
      toast.error("Falha ao recusar.");
      console.error("Erro handleRecusar Pedido:", error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: 3 }}>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Item Solicitado</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Qtd.</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Justificativa</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Solicitante</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Data</TableCell>
              <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                Ações
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pedidos.length > 0 ? (
              pedidos.map((req) => (
                <TableRow hover key={req.id}>
                  <TableCell>{req.nomeItem}</TableCell>
                  <TableCell>{req.quantidade}</TableCell>
                  <TableCell>{req.justificativa || "-"}</TableCell>
                  <TableCell>{req.usuarioNome || "N/A"}</TableCell>
                  <TableCell>
                    {req.dataPedido
                      ? new Date(req.dataPedido).toLocaleString("pt-BR")
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Button
                        variant="contained"
                        size="small"
                        color="success"
                        onClick={() => handleAprovar(req.id)}
                      >
                        Aprovar
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        color="error"
                        onClick={() => handleRecusar(req.id)}
                      >
                        Recusar
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="text.secondary" sx={{ p: 2 }}>
                    Nenhum pedido de compra pendente.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default TabelaPedidosCompra;
