import { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  TablePagination, // ✅ Componente essencial
  Chip,
} from "@mui/material";

function RequisicoesPage() {
  // Estados de Dados
  const [requisicoes, setRequisicoes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados de Paginação (Correção Principal)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  // Estados do Modal de Aprovação/Recusa
  const [motivo, setMotivo] = useState("");
  const [modalState, setModalState] = useState({
    open: false,
    acao: null, // "aprovar" ou "recusar"
    requisicaoId: null,
  });

  // --- BUSCAR REQUISIÇÕES PENDENTES ---
  const fetchRequisicoes = useCallback(async () => {
    setLoading(true);
    try {
      // ✅ Envia page e size para a API
      const response = await api.get(
        `/requisicoes/pendentes?page=${page}&size=${rowsPerPage}&sort=dataRequisicao,asc`
      );

      // ✅ Lê o objeto Page corretamente
      setRequisicoes(response.data.content || []);
      setTotalElements(response.data.totalElements);
    } catch (error) {
      toast.error("Falha ao carregar as requisições pendentes.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchRequisicoes();
  }, [fetchRequisicoes]);

  // --- HANDLERS DE PAGINAÇÃO ---
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // --- MODAL E AÇÕES ---
  const handleAbrirModal = (id, acao) => {
    setModalState({ open: true, acao: acao, requisicaoId: id });
    setMotivo(""); // Limpa o motivo anterior
  };

  const handleFecharModal = () => {
    setModalState({ open: false, acao: null, requisicaoId: null });
    setMotivo("");
  };

  const handleConfirmarAcao = async () => {
    const { acao, requisicaoId } = modalState;

    if (!motivo.trim()) {
      toast.warning("Por favor, digite um motivo/justificativa.");
      return;
    }

    const url = `/requisicoes/${requisicaoId}/${acao}`;

    // Loading local do botão
    // (opcional, mas aqui usamos o loading geral para simplificar)
    setLoading(true);

    try {
      await api.put(url, { motivo });

      toast.success(
        `Requisição ${
          acao === "aprovar" ? "aprovada" : "recusada"
        } com sucesso!`
      );

      handleFecharModal();

      // Lógica inteligente: Se aprovou o último item da página, volta uma página
      if (requisicoes.length === 1 && page > 0) {
        setPage(page - 1);
      } else {
        fetchRequisicoes();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Falha ao processar ação.");
      console.error("Erro ao confirmar ação:", error);
    } finally {
      setLoading(false);
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
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
          Aprovações Pendentes (Estoque)
        </Typography>

        <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: 3 }}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Item Solicitado
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Patrimônio</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Qtd.</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Solicitante</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Data</TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                    Ações
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : requisicoes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                      <Typography color="text.secondary">
                        Nenhuma requisição pendente.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  requisicoes.map((req) => (
                    <TableRow hover key={req.id}>
                      <TableCell>{req.componenteNome}</TableCell>
                      <TableCell>
                        {req.componenteCodigoPatrimonio || "-"}
                      </TableCell>
                      <TableCell>
                        <Chip label={req.quantidade} size="small" />
                      </TableCell>
                      <TableCell>{req.usuarioNome}</TableCell>
                      <TableCell>
                        {new Date(req.dataRequisicao).toLocaleDateString(
                          "pt-BR"
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="center"
                        >
                          <Button
                            variant="contained"
                            size="small"
                            color="success"
                            onClick={() => handleAbrirModal(req.id, "aprovar")}
                          >
                            Aprovar
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            color="error"
                            onClick={() => handleAbrirModal(req.id, "recusar")}
                          >
                            Recusar
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* ✅ COMPONENTE DE PAGINAÇÃO */}
          <TablePagination
            component="div"
            count={totalElements}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage="Linhas:"
          />
        </Paper>
      </Container>

      {/* --- MODAL DE CONFIRMAÇÃO --- */}
      <Dialog
        open={modalState.open}
        onClose={handleFecharModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            color:
              modalState.acao === "aprovar" ? "success.main" : "error.main",
          }}
        >
          {modalState.acao === "aprovar"
            ? "Confirmar Aprovação"
            : "Confirmar Recusa"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Por favor, insira um motivo ou observação para esta ação. Isso
            ficará salvo no histórico.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Motivo / Observação"
            type="text"
            fullWidth
            variant="outlined"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            multiline
            rows={3}
            placeholder={
              modalState.acao === "aprovar"
                ? "Ex: Retirada autorizada."
                : "Ex: Estoque reservado para outro projeto."
            }
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleFecharModal} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmarAcao}
            variant="contained"
            color={modalState.acao === "aprovar" ? "success" : "error"}
            disabled={!motivo.trim()} // Obriga a digitar algo
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default RequisicoesPage;
