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
      // Chama o endpoint novo que criamos no Controller
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

  const handleConfirmarChegada = async (id) => {
    if(!window.confirm("Confirmar que este material chegou fisicamente? O estoque será atualizado.")) return;
    
    try {
      await api.put(`/api/pedidos-compra/${id}/receber`);
      toast.success("Recebimento confirmado! Estoque atualizado.");
      fetchAprovados(); // Recarrega a lista
    } catch (error) {
      toast.error("Erro ao confirmar recebimento.");
    }
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
          Recebimento de Compras
        </Typography>

        <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: 3 }}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Item</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Qtd.</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Solicitante</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Data Pedido</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Ação</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={5} align="center"><CircularProgress /></TableCell></TableRow>
                ) : pedidos.length > 0 ? (
                  pedidos.map((pedido) => (
                    <TableRow hover key={pedido.id}>
                      <TableCell>{pedido.componenteNome}</TableCell>
                      <TableCell>{pedido.quantidade}</TableCell>
                      <TableCell>{pedido.solicitanteEmail}</TableCell>
                      <TableCell>{new Date(pedido.dataRequisicao).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell>
                        <Button 
                          variant="contained" 
                          color="primary" 
                          onClick={() => handleConfirmarChegada(pedido.id)}
                        >
                          Confirmar Chegada
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