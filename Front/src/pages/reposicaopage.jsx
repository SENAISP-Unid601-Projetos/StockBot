import { useState, useEffect } from "react";
import api from "../services/api"; // CORREÇÃO: Revertendo para o caminho sem .js, conforme outros arquivos
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useNavigate } from "react-router-dom"; // 1. Importar o hook de navegação

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
  Paper, // Para a tabela
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination, // Para a paginação
  Chip, // Para o status
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"; // 2. Importar ícone para o botão

// Removido 'ActionList' pois não será mais usado

function ReposicaoPage() {
  const [componentes, setComponentes] = useState([]);
  const [loading, setLoading] = useState(true);
  // 3. Remover o estado 'threshold'. Não precisamos mais do limite global.
  // const [threshold, setThreshold] = useState(5);

  // 4. Adicionar estados de paginação (copiado de componentepages.jsx)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate(); // Hook para navegação

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 5. Simplificar o fetch: só precisamos dos componentes.
        // A API já envia 'nivelMinimoEstoque' em cada componente.
        const componentesResponse = await api.get("/api/componentes");

        if (Array.isArray(componentesResponse.data)) {
          setComponentes(componentesResponse.data);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Não foi possível carregar os dados.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // 6. Remover 'threshold' das dependências

  // 7. Lógica principal: filtrar usando o nível mínimo INDIVIDUAL
  const itensParaRepor = componentes.filter(
    (comp) => comp.quantidade <= comp.nivelMinimoEstoque
  );
  const necessitaReposicao = itensParaRepor.length > 0;

  // 8. Handlers de Paginação (copiado de componentepages.jsx)
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Volta para a primeira página
  };

  // 9. Lógica de paginação no frontend
  const totalElements = itensParaRepor.length;
  const inicio = page * rowsPerPage;
  const fim = inicio + rowsPerPage;
  const itensPaginados = itensParaRepor.slice(inicio, fim);

  // 10. Atualizar o PDF para usar a nova lógica e colunas
  const handleGerarPedidoPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Relatório de Reposição de Estoque", 14, 22);

    // Usar 'itensParaRepor' (a lista completa, não apenas a paginada)
    const tableData = itensParaRepor.map((comp) => [
      comp.nome || "Sem nome",
      comp.codigoPatrimonio || "-",
      comp.quantidade <= 0 ? "ESGOTADO" : "ESTOQUE BAIXO",
      comp.quantidade || 0,
      comp.nivelMinimoEstoque,
      comp.nivelMinimoEstoque - comp.quantidade, // Quantidade a Repor
    ]);

    autoTable(doc, {
      head: [
        [
          "Nome",
          "Patrimônio",
          "Status",
          "Qtd. Atual",
          "Nível Mínimo",
          "Repor Qtd.",
        ],
      ],
      body: tableData,
      startY: 30,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [66, 66, 66] }, // Cor escura para o cabeçalho
      // Adiciona cores às linhas com base no status
      didParseCell: function (data) {
        if (data.column.index === 2 && data.cell.section === "body") {
          if (data.cell.raw === "ESGOTADO") {
            data.cell.styles.textColor = [211, 47, 47]; // Vermelho
            data.cell.styles.fontStyle = "bold";
          }
          if (data.cell.raw === "ESTOQUE BAIXO") {
            data.cell.styles.textColor = [237, 108, 2]; // Laranja
          }
        }
      },
    });
    doc.save("relatorio-reposicao-estoque.pdf");
  };

  // 11. Handler para o novo botão "Solicitar"
  const handleSolicitarClick = () => {
    // Redireciona para a página de pedidos manuais
    navigate("/pedidos");
    toast.info(
      "Redirecionando para a página de Pedidos. Use-a para solicitar um novo item."
    );
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Container maxWidth="lg">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4" component="h1" fontWeight="bold">
            Relatório de Reposição
          </Typography>

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
            Estoque em dia! Nenhum item necessitando reposição com base no seu
            nível mínimo.
          </Alert>
        )}

        {/* 12. Substituir o <Grid> e <ActionList> pela Tabela */}
        {necessitaReposicao && (
          <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: 3 }}>
            <TableContainer>
              <Table stickyHeader aria-label="tabela de reposição">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Nome</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Patrimônio
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="center">
                      Qtd. Atual
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="center">
                      Nível Mínimo
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="center">
                      Repor Qtd.
                    </TableCell>
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
                          label={
                            comp.quantidade <= 0
                              ? "ESGOTADO"
                              : "ESTOQUE BAIXO"
                          }
                          color={comp.quantidade <= 0 ? "error" : "warning"}
                          size="small"
                          sx={{ fontWeight: "bold" }}
                        />
                      </TableCell>
                      <TableCell align="center">{comp.quantidade}</TableCell>
                      <TableCell align="center">
                        {comp.nivelMinimoEstoque}
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: "bold" }}>
                        {comp.nivelMinimoEstoque - comp.quantidade}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<ShoppingCartIcon />}
                          onClick={handleSolicitarClick}
                          title="Ir para a página de solicitação manual"
                        >
                          Solicitar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* 13. Adicionar o componente de paginação */}
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
