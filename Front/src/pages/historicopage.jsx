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
  Fade,
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
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
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
              backgroundColor: "rgba(255,255,255,0.5)",
              borderRadius: 1,
            }}
          />
        </Box>

        {/* --- Paper com Estilo (Sombra e Blur) Padronizado --- */}
        <Paper
          sx={{
            width: "100%",
            overflow: "hidden",
            borderRadius: 3,
            backdropFilter: "blur(6px)",
            boxShadow: "0px 6px 25px rgba(0,0,0,0.2)",
          }}
        >
          <TableContainer>
            <Table stickyHeader>
              {/* --- APLICAÇÃO DA COR #2a3c61ff NA LINHA E EM TODAS AS CÉLULAS --- */}
              <TableHead>
    <TableRow>
        <TableCell
            // CORREÇÃO: Aplicando a cor de fundo diretamente na célula
            sx={{
                backgroundColor: "#2a3c61ff",
                color: "#fff",
                fontWeight: "bold",
                borderBottom: 0,
            }}
        >
            Id
        </TableCell>
        <TableCell
            // CORREÇÃO: Aplicando a cor de fundo diretamente na célula
            sx={{
                backgroundColor: "#2a3c61ff",
                color: "#fff",
                fontWeight: "bold",
                borderBottom: 0,
            }}
        >
            Item
        </TableCell>
        <TableCell
            // CORREÇÃO: Aplicando a cor de fundo diretamente na célula
            sx={{
                backgroundColor: "#2a3c61ff",
                color: "#fff",
                fontWeight: "bold",
                borderBottom: 0,
            }}
        >
            Quantidade
        </TableCell>
        <TableCell
            // CORREÇÃO: Aplicando a cor de fundo diretamente na célula
            sx={{
                backgroundColor: "#2a3c61ff",
                color: "#fff",
                fontWeight: "bold",
                borderBottom: 0,
            }}
        >
            Tipo
        </TableCell>
        <TableCell
            // CORREÇÃO: Aplicando a cor de fundo diretamente na célula
            sx={{
                backgroundColor: "#2a3c61ff",
                color: "#fff",
                fontWeight: "bold",
                borderBottom: 0,
            }}
        >
            Data e Hora
        </TableCell>
        <TableCell
            // CORREÇÃO: Aplicando a cor de fundo diretamente na célula
            sx={{
                backgroundColor: "#2a3c61ff",
                color: "#fff",
                fontWeight: "bold",
                borderBottom: 0,
            }}
        >
            Utilizador
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
                ) : historicoFiltrado.length > 0 ? (
                  historicoFiltrado.map((item, index) => (
                    <Fade in timeout={300 + index * 60} key={item.id}>
                      <TableRow
                        hover
                        sx={{
                          backgroundColor:
                            index % 2 === 0
                              ? "rgba(255,255,255,0.04)"
                              : "transparent",
                          transition: "0.25s",
                          "&:hover": {
                            backgroundColor: "rgba(25,118,210,0.15)",
                            transform: "scale(1.005)",
                          },
                        }}
                      >
                        <TableCell sx={{ fontWeight: 500 }}>
                          {item.id}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 500 }}>
                          {item.componenteNome || "N/A"}
                        </TableCell>
                        <TableCell>{item.quantidade}</TableCell>

                        <TableCell>
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
                            sx={{
                              fontWeight: "bold",
                              px: 1.5,
                              py: 0.5,
                              boxShadow: "0px 1px 6px rgba(0,0,0,0.15)",
                            }}
                          />
                        </TableCell>

                        <TableCell sx={{ opacity: 0.9 }}>
                          {new Date(item.dataHora).toLocaleString("pt-BR")}
                        </TableCell>

                        <TableCell sx={{ opacity: 0.9 }}>
                          {item.usuario}
                        </TableCell>
                      </TableRow>
                    </Fade>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography color="text.secondary" sx={{ p: 3 }}>
                        {termoBusca
                          ? `Nenhum registo encontrado para "${termoBusca}".`
                          : "Nenhum registo de histórico nesta página."}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalElements}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Itens por página:"
            sx={{
              borderTop: "1px solid rgba(255,255,255,0.1)",
              backgroundColor: "rgba(0,0,0,0.1)",
            }}
          />
        </Paper>
      </Container>
    </Box>
  );
}

export default HistoricoPage;