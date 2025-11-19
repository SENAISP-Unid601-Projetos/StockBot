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
  // NOVOS IMPORTS PARA O MODAL
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  DialogContentText,
} from "@mui/material";

function TabelaRequisicoes() {
  const [requisicoes, setRequisicoes] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- ESTADOS DO MODAL ---
  const [open, setOpen] = useState(false);
  const [acao, setAcao] = useState(null); // 'aprovar' ou 'recusar'
  const [selectedId, setSelectedId] = useState(null);
  const [motivo, setMotivo] = useState("");
  const [processing, setProcessing] = useState(false);

  const fetchRequisicoes = async () => {
    setLoading(true);
    try {
      const response = await api.get("/requisicoes/pendentes");
      setRequisicoes(response.data.content || []);
    } catch (error) {
      console.error("Erro ao buscar requisições:", error);

      toast.error("Falha ao carregar requisições de estoque.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchRequisicoes();
  }, []);

  // 1. Abre o Modal em vez de chamar a API direto
  const handleOpenDialog = (id, tipoAcao) => {
    setSelectedId(id);
    setAcao(tipoAcao);
    setMotivo(""); // Limpa o campo
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedId(null);
    setAcao(null);
  };

  // 2. Envia para o Backend com o motivo
  const handleSubmit = async () => {
    if (acao === "recusar" && !motivo.trim()) {
      toast.warning("Para recusar, é obrigatório informar o motivo.");
      return;
    }

    setProcessing(true);
    try {
      const endpoint = `/requisicoes/${selectedId}/${acao}`; // /aprovar ou /recusar

      // O PULO DO GATO: Enviamos o objeto { motivo: ... }
      await api.put(endpoint, { motivo: motivo });

      toast.success(
        `Requisição ${
          acao === "aprovar" ? "APROVADA" : "RECUSADA"
        } com sucesso!`
      );
      fetchRequisicoes(); // Atualiza a lista
      handleClose(); // Fecha o modal
    } catch (error) {
      const msg = error.response?.data?.message || "Erro ao processar ação.";
      toast.error(msg);
      console.error(`Erro handle${acao}:`, error);
    } finally {
      setProcessing(false);
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
    <>
      <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: 3 }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Item</TableCell>
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
                        ? new Date(req.dataRequisicao).toLocaleDateString(
                            "pt-BR"
                          )
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="center"
                      >
                        <Button
                          variant="contained"
                          size="small"
                          color="success"
                          // Chama a função que abre o modal
                          onClick={() => handleOpenDialog(req.id, "aprovar")}
                        >
                          Aprovar
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          color="error"
                          // Chama a função que abre o modal
                          onClick={() => handleOpenDialog(req.id, "recusar")}
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

      {/* --- MODAL DE CONFIRMAÇÃO --- */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {acao === "aprovar" ? "Confirmar Aprovação" : "Confirmar Recusa"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {acao === "aprovar"
              ? "Aprovar esta requisição irá baixar o estoque automaticamente. Deseja adicionar uma observação?"
              : "Por favor, informe o motivo da recusa:"}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Motivo / Observação"
            fullWidth
            multiline
            rows={3}
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            variant="outlined"
            // Torna obrigatório se for recusar
            required={acao === "recusar"}
            error={acao === "recusar" && motivo.trim() === ""}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={processing}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color={acao === "aprovar" ? "success" : "error"}
            disabled={
              processing || (acao === "recusar" && motivo.trim() === "")
            }
          >
            {processing ? "Processando..." : "Confirmar"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default TabelaRequisicoes;
