import { useState, useEffect, useMemo } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

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
  TablePagination,
  Chip,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

function HistoricoPage() {
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [termoBusca, setTermoBusca] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get(
          `/api/historico?page=${page}&size=${rowsPerPage}`
        );

        setHistorico(response.data.content || []);
        setTotalElements(response.data.totalElements);
      } catch (error) {
        console.error("Erro ao buscar histórico:", error);
        if (error.response?.status !== 401) {
          toast.error("Não foi possível carregar o histórico.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, rowsPerPage]);

  const historicoFiltrado = useMemo(() => {
    if (!termoBusca) {
      return historico;
    }
    const termoLower = termoBusca.toLowerCase();
    return historico.filter(
      (item) =>
        item.componenteNome?.toLowerCase().includes(termoLower) ||
        item.usuario?.toLowerCase().includes(termoLower)
    );
  }, [historico, termoBusca]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleBuscaChange = (event) => {
    setTermoBusca(event.target.value);
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        backgroundColor: "background.default",
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="lg">
        {/* --- Cabeçalho com Título e Barra de Busca --- */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: "bold",
              letterSpacing: 0.5,
            }}
          >
            Histórico de Movimentações
          </Typography>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Filtrar por item ou utilizador..."
            value={termoBusca}
            onChange={handleBuscaChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              minWidth: "300px",
              backgroundColor: "background.paper",
            }}
          />
        </Box>

        {/* --- Paper Padronizado --- */}
        <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: 5 }}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                {/* ESTILO DO CABEÇALHO PADRONIZADO */}
                <TableRow
                  sx={{
                    "& th": {
                      backgroundColor: "#2a3c61ff", // Azul escuro
                      color: "#ffffff", // Texto branco
                      fontWeight: "bold",
                    },
                  }}
                >
                  <TableCell align="center">Id</TableCell>
                  <TableCell align="center">Item</TableCell>
                  <TableCell align="center">Quantidade</TableCell>
                  <TableCell align="center">Tipo</TableCell>
                  <TableCell align="center">Data e Hora</TableCell>
                  <TableCell align="center">Utilizador</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : historicoFiltrado.length > 0 ? (
                  historicoFiltrado.map((item) => (
                    <TableRow hover key={item.id}>
                      <TableCell align="center">{item.id}</TableCell>

                      <TableCell align="center" sx={{ fontWeight: 500 }}>
                        {item.componenteNome || "N/A"}
                      </TableCell>

                      <TableCell align="center">{item.quantidade}</TableCell>

                      <TableCell align="center">
                        <Chip
                          label={item.tipo}
                          color={
                            item.tipo === "ENTRADA"
                              ? "success"
                              : item.tipo === "SAIDA"
                              ? "error"
                              : "warning"
                          }
                          size="small"
                          sx={{ fontWeight: "bold", minWidth: "80px" }}
                        />
                      </TableCell>

                      <TableCell align="center">
                        {new Date(item.dataHora).toLocaleString("pt-BR")}
                      </TableCell>

                      <TableCell align="center">{item.usuario}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography color="text.secondary" sx={{ p: 3 }}>
                        {termoBusca
                          ? `Nenhum registro encontrado para "${termoBusca}".`
                          : "Nenhum registro de histórico nesta página."}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Paginação Padronizada (Fundo Branco) */}
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
