import { useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

// 1. Imports de Componentes do MUI
import {
  Box,
  CircularProgress,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination, // O componente de paginação!
  Chip,
  Typography,
} from "@mui/material";

function HistoricoPage() {
  // 2. Novos estados para controlar a paginação
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0); // A página atual (começa em 0)
  const [rowsPerPage, setRowsPerPage] = useState(10); // Itens por página
  const [totalElements, setTotalElements] = useState(0); // Total de registos no backend

  // 3. O useEffect agora reage a mudanças na página ou no número de itens por página
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // A chamada à API agora inclui os parâmetros de paginação
        const response = await api.get(
          `/api/historico?page=${page}&size=${rowsPerPage}`
        );

        // O backend paginado retorna um objeto com os dados e informações da página
        setHistorico(response.data.content);
        setTotalElements(response.data.totalElements);
      } catch (error) {
        console.error("Erro ao buscar histórico:", error);
        toast.error("Não foi possível carregar o histórico.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, rowsPerPage]); // A cláusula do "contrato" com o React

  // 4. Funções para lidar com as ações de paginação
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Volta para a primeira página sempre que muda o número de itens
  };

  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 3, backgroundColor: "#f8f9fa" }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          component="h1"
          fontWeight="bold"
          sx={{ mb: 4 }}
        >
          Histórico de Movimentações
        </Typography>

        {/* Paper: Um "pedaço de papel" elevado que envolve a nossa tabela */}
        <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: 3 }}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Data e Hora</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Item</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Tipo</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Quantidade</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Utilizador</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : (
                  historico.map((item) => (
                    <TableRow hover key={item.id}>
                      <TableCell>
                        {new Date(item.dataHora).toLocaleString("pt-BR")}
                      </TableCell>
                      <TableCell>{item.componenteNome}</TableCell>
                      <TableCell>
                        <Chip
                          label={item.tipo}
                          color={item.tipo === "ENTRADA" ? "success" : "error"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{item.quantidade}</TableCell>
                      <TableCell>{item.usuario}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* 5. O Componente de Paginação do MUI */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalElements}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Itens por página:"
          />
        </Paper>
      </Container>
    </Box>
  );
}

export default HistoricoPage;
