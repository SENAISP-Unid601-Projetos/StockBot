// Em: src/components/TabelaRequisicoes.jsx
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

function TabelaRequisicoes() {
  const [requisicoes, setRequisicoes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequisicoes = async () => {
    setLoading(true);
    try {
      const response = await api.get("/requisicoes/pendentes"); // Endpoint /api/requisicoes/pendentes
      setRequisicoes(response.data.content || []); // Garante que seja um array
    } catch (error) {
      toast.error("Falha ao carregar requisições de estoque.");
      console.error("Erro fetchRequisicoes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequisicoes();
  }, []);

  const handleAprovar = async (id) => {
    try {
      await api.put(`/requisicoes/${id}/aprovar`); // Endpoint /api/requisicoes/{id}/aprovar
      toast.success("Requisição de estoque APROVADA!");
      fetchRequisicoes();
    } catch (error) {
      toast.error("Falha ao aprovar.");
      console.error("Erro handleAprovar:", error);
    }
  };

  const handleRecusar = async (id) => {
    try {
      await api.put(`/requisicoes/${id}/recusar`); // Endpoint /api/requisicoes/{id}/recusar
      toast.warn("Requisição de estoque RECUSADA.");
      fetchRequisicoes();
    } catch (error) {
      toast.error("Falha ao recusar.");
      console.error("Erro handleRecusar:", error);
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
              <TableCell sx={{ fontWeight: "bold" }}>Item</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Patrimônio</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Qtd. Pedida</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Solicitante</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Data</TableCell>
              <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                Ações
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requisicoes.length > 0 ? (
              requisicoes.map((req) => (
                <TableRow hover key={req.id}>
                  <TableCell>{req.componenteNome || "N/A"}</TableCell>
                  <TableCell>
                    {req.componenteCodigoPatrimonio || "N/A"}
                  </TableCell>
                  <TableCell>{req.quantidade}</TableCell>
                  <TableCell>{req.usuarioNome || "N/A"}</TableCell>
                  <TableCell>
                    {req.dataRequisicao
                      ? new Date(req.dataRequisicao).toLocaleString("pt-BR")
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
                    Nenhuma requisição de estoque pendente.
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

export default TabelaRequisicoes;
