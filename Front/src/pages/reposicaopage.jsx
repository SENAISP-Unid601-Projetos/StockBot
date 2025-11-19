import { useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

function ReposicaoPage() {
  const [componentes, setComponentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Carrega os dados
        const response = await api.get("/api/componentes");
        if (Array.isArray(response.data)) {
          setComponentes(response.data);
        }
      } catch (error) {
        toast.error("Não foi possível carregar os dados.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filtra itens que atingiram o nível mínimo
  const itensParaRepor = componentes.filter(
    (comp) => comp.quantidade <= (comp.nivelMinimoEstoque || 0)
  );
  const necessitaReposicao = itensParaRepor.length > 0;

  // Handlers de Paginação
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Dados paginados
  const totalElements = itensParaRepor.length;
  const inicio = page * rowsPerPage;
  const fim = inicio + rowsPerPage;
  const itensPaginados = itensParaRepor.slice(inicio, fim);

  // Gerar PDF
  const handleGerarPedidoPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Relatório de Reposição de Estoque", 14, 22);

    const tableData = itensParaRepor.map((comp) => [
      comp.nome || "Sem nome",
      comp.codigoPatrimonio || "-",
      comp.quantidade <= 0 ? "ESGOTADO" : "ESTOQUE BAIXO",
      comp.quantidade || 0,
      comp.nivelMinimoEstoque || 0,
      (comp.nivelMinimoEstoque || 0) - (comp.quantidade || 0),
    ]);

    autoTable(doc, {
      head: [["Nome", "Patrimônio", "Status", "Qtd. Atual", "Nível Mínimo", "Repor Qtd."]],
      body: tableData,
      startY: 30,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [66, 66, 66] },
      didParseCell: function (data) {
        if (data.column.index === 2 && data.cell.section === "body") {
          if (data.cell.raw === "ESGOTADO") {
            data.cell.styles.textColor = [211, 47, 47];
            data.cell.styles.fontStyle = "bold";
          }
          if (data.cell.raw === "ESTOQUE BAIXO") {
            data.cell.styles.textColor = [237, 108, 2];
          }
        }
      },
    });
    doc.save("relatorio-reposicao.pdf");
  };

  const handleSolicitarClick = () => {
    navigate("/pedidos");
    toast.info("Redirecionando para a página de Pedidos.");
  };

  // --- AQUI ESTAVA O ERRO: REMOVIDO O BLOCO IF ERRADO ---

  if (loading) return <CircularProgress sx={{ display: "block", margin: "20px auto" }} />;

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
          <Typography variant="h4" component="h1" fontWeight="bold">Relatório de Reposição</Typography>
          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={handleGerarPedidoPDF}
            disabled={!necessitaReposicao}
          >
            Gerar PDF
          </Button>
        </Box>

        {!necessitaReposicao && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Estoque em dia! Nenhum item necessitando reposição.
          </Alert>
        )}

        {necessitaReposicao && (
          <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: 3 }}>
            <TableContainer>
              <Table stickyHeader aria-label="tabela de reposição">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Nome</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Patrimônio</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="center">Qtd. Atual</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="center">Nível Mínimo</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="center">Repor Qtd.</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {itensPaginados.map((comp) => (
                    <TableRow hover key={comp.id}>
                      <TableCell>{comp.nome}</TableCell>
                      <TableCell>{comp.codigoPatrimonio}</TableCell>
                      <TableCell>
                        <Chip
                          label={comp.quantidade <= 0 ? "ESGOTADO" : "ESTOQUE BAIXO"}
                          color={comp.quantidade <= 0 ? "error" : "warning"}
                          size="small"
                          sx={{ fontWeight: "bold" }}
                        />
                      </TableCell>
                      <TableCell align="center">{comp.quantidade}</TableCell>
                      <TableCell align="center">{comp.nivelMinimoEstoque}</TableCell>
                      <TableCell align="center" sx={{ fontWeight: "bold" }}>
                        {(comp.nivelMinimoEstoque || 0) - (comp.quantidade || 0)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<ShoppingCartIcon />}
                          onClick={handleSolicitarClick}
                        >
                          Solicitar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
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

export default ReposicaoPage;