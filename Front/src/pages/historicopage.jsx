import { useState, useEffect } from "react";
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
} from "@mui/material";

function HistoricoPage() {
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get(
          `/api/historico?page=${page}&size=${rowsPerPage}`
        );
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
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          component="h1"
          sx={{
            mb: 4,
            fontWeight: "bold",
            letterSpacing: 0.5,
            textAlign: "center",
          }}
        >
          Histórico de Movimentações
        </Typography>

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
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#2a3c61ff" }}>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Id
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Item
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Quantidade
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Tipo
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Data e Hora
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
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
                ) : (
                  historico.map((item, index) => (
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
                            transform: "scale(1.01)",
                            boxShadow: "0px 3px 10px rgba(0,0,0,0.15)",
                          },
                        }}
                      >
                        <TableCell sx={{ fontWeight: 500 }}>
                          {item.id}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 500 }}>
                          {item.componenteNome}
                        </TableCell>
                        <TableCell>{item.quantidade}</TableCell>

                        <TableCell>
                          <Chip
                            label={item.tipo}
                            color={
                              item.tipo === "ENTRADA" ? "success" : "error"
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
