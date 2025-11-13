import { useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

function AprovacoesPage() {
  const [tabValue, setTabValue] = useState(0);
  const [pedidosCompra, setPedidosCompra] = useState([]);
  const [loading, setLoading] = useState(true);

  // Busca os dados da API de requisições pendentes
  const fetchPedidosCompra = async () => {
    setLoading(true);
    try {
      // Usamos o endpoint que já existe no seu RequisicaoController
      const response = await api.get("/api/requisicoes/pendentes");
      setPedidosCompra(response.data);
    } catch (error) {
      toast.error("Falha ao carregar pedidos de compra pendentes.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Por enquanto, só carregamos dados para a aba "Pedidos de Compra"
    if (tabValue === 0) {
      // TODO: Lógica para "Retirada de Estoque"
    } else {
      fetchPedidosCompra();
    }
  }, [tabValue]); // Recarrega quando a aba muda

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  // Funções para os botões (Ainda não ligadas ao backend)
  const handleAprovar = (id) => {
    toast.info(`Aprovar item ${id} (não implementado)`);
    // Aqui viria a chamada à API, ex: api.put(`/api/requisicoes/${id}/aprovar`);
  };

  const handleRecusar = (id) => {
    toast.warn(`Recusar item ${id} (não implementado)`);
    // Aqui viria a chamada à API, ex: api.put(`/api/requisicoes/${id}/recusar`);
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        minHeight: "100vh",
        backgroundColor: "background.default",
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          component="h1"
          fontWeight="bold"
          sx={{ mb: 4 }}
        >
          Central de Aprovações
        </Typography>

        <Paper sx={{ width: "100%", boxShadow: 3 }}>
          {/* --- Abas (Tabs) --- */}
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabValue}
              onChange={handleChangeTab}
              aria-label="abas de aprovações"
              variant="fullWidth"
            >
              <Tab label="Retirada de Estoque" />
              <Tab label="Pedidos de Compra" />
            </Tabs>
          </Box>

          {/* --- Conteúdo da Aba "Retirada de Estoque" (Aba 0) --- */}
          {tabValue === 0 && (
            <Box sx={{ p: 3 }}>
              <Typography>
                Funcionalidade de "Retirada de Estoque" ainda não implementada.
              </Typography>
            </Box>
          )}

          {/* --- Conteúdo da Aba "Pedidos de Compra" (Aba 1) --- */}
          {tabValue === 1 && (
            <TableContainer>
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      {/* As colunas da imagem: */}
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Item Solicitado
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Qtd.</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Justificativa
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Solicitante
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Data</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pedidosCompra.length > 0 ? (
                      pedidosCompra.map((req) => (
                        <TableRow hover key={req.id}>
                          {/* NOTA: O seu Requisicao.java só tem 'componente' e 'data'.
                            Não temos Qtd, Justificativa ou Solicitante.
                            Vamos preencher o que temos.
                          */}
                          <TableCell>{req.componenteNome}</TableCell>
                          <TableCell>{req.quantidade ?? "N/A"}</TableCell>
                          <TableCell>{req.justificativa ?? "N/A"}</TableCell>
                          <TableCell>{req.solicitanteEmail ?? "N/A"}</TableCell>
                          <TableCell>
                            {new Date(req.dataRequisicao).toLocaleString(
                              "pt-BR"
                            )}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", gap: 1 }}>
                              <Button
                                variant="contained"
                                color="success"
                                size="small"
                                onClick={() => handleAprovar(req.id)}
                              >
                                Aprovar
                              </Button>
                              <Button
                                variant="contained"
                                color="error"
                                size="small"
                                onClick={() => handleRecusar(req.id)}
                              >
                                Recusar
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          Nenhum pedido de compra pendente.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </TableContainer>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

export default AprovacoesPage;
