// Em: src/components/TabelaPedidosCompra.jsx (CORRIGIDO)
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
  Typography,
  // ✅ 1. IMPORTE OS COMPONENTES DO MODAL (DIALOG)
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";

function TabelaPedidosCompra() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ 2. ESTADOS PARA CONTROLAR O MODAL E O MOTIVO
  const [motivo, setMotivo] = useState("");
  const [modalState, setModalState] = useState({
    open: false,
    acao: null, // 'aprovar' ou 'recusar'
    pedidoId: null,
  });

  const fetchPedidos = async () => {
    setLoading(true);
    try {
      const response = await api.get("/pedidos-compra/pendentes");
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

  // ✅ 3. FUNÇÕES PARA ABRIR E FECHAR O MODAL
  const handleAbrirModal = (id, acao) => {
    setModalState({ open: true, acao: acao, pedidoId: id });
    setMotivo(""); // Limpa o motivo anterior
  };

  const handleFecharModal = () => {
    setModalState({ open: false, acao: null, pedidoId: null });
    setMotivo("");
  };

  // ✅ 4. FUNÇÃO QUE CHAMA A API (QUANDO O ADMIN CONFIRMA)
  // ESTA FUNÇÃO SUBSTITUI O 'handleAprovar' e 'handleRecusar'
  const handleConfirmarAcao = async () => {
    const { acao, pedidoId } = modalState;

    if (!motivo) {
      toast.error("O motivo da ação é obrigatório.");
      return;
    }

    // O body que o seu novo backend espera!
    const body = { motivo };
    const url = `/pedidos-compra/${pedidoId}/${acao}`; // ex: /api/pedidos-compra/1/aprovar

    // Reutiliza o 'loading' para travar os botões
    setLoading(true);
    try {
      // CHAMA A API NOVA!
      await api.put(url, body);

      toast.success(
        `Pedido ${acao === "aprovar" ? "aprovado" : "recusado"} com sucesso!`
      );
      handleFecharModal();
      fetchPedidos(); // Atualiza a lista
    } catch (error) {
      // O 'error.response.data' pode ter mais detalhes do backend
      toast.error(error.response?.data?.message || "Falha ao processar ação.");
      console.error("Erro ao confirmar ação:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && pedidos.length === 0) {
    // Só mostra o loading grande se a tabela estiver vazia
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {/* Adiciona um Fragment para o Modal ficar fora da Tabela */}
      <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: 3 }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Item Solicitado
                </TableCell>
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
                      {/* ✅ 5. BOTÕES AGORA ABREM O MODAL */}
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
                          disabled={loading} // Desabilita se já estiver carregando
                        >
                          Aprovar
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          color="error"
                          onClick={() => handleAbrirModal(req.id, "recusar")}
                          disabled={loading}
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
      {/* ✅ 6. O MODAL DE CONFIRMAÇÃO (JSX) */}
      <Dialog
        open={modalState.open}
        onClose={handleFecharModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {modalState.acao === "aprovar" ? "Aprovar" : "Recusar"} Pedido de
          Compra
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Por favor, insira uma justificativa (motivo) para esta ação. Este
            motivo será salvo no histórico de auditoria.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="motivo"
            label="Motivo da Ação"
            type="text"
            fullWidth
            variant="outlined" // Mudei para 'outlined'
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleFecharModal}
            color="secondary"
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmarAcao}
            variant="contained"
            color={modalState.acao === "aprovar" ? "success" : "error"}
            disabled={loading || !motivo} // Desabilita se não tiver motivo
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              `Confirmar ${
                modalState.acao === "aprovar" ? "Aprovação" : "Recusa"
              }`
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default TabelaPedidosCompra;
