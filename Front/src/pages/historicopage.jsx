import { useState, useEffect, useMemo } from "react"; // 1. Adicionado useMemo
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
  TextField,         // Campo de texto para busca
  InputAdornment   // Para ícone no campo de texto
  Fade,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search'; // Ícone de busca

function HistoricoPage() {
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [termoBusca, setTermoBusca] = useState(''); // 3. Estado para o termo de busca

  useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      // CORREÇÃO AQUI: Adicione /api no início da URL
      const response = await api.get(
        `/api/historico?page=${page}&size=${rowsPerPage}` // <-- Adicionado /api/
      );

      setHistorico(response.data.content || []);
      setTotalElements(response.data.totalElements);
    } catch (error) {
      console.error("Erro ao buscar histórico:", error);
      // O erro 403 provavelmente será tratado pelo interceptor de resposta em api.js
      // Mas podemos manter o toast aqui como fallback.
      if (error.response?.status !== 401) { // Evita duplicar msg de sessão expirada
          toast.error("Não foi possível carregar o histórico.");
      }
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, [page, rowsPerPage]);

  // 4. Filtragem no Frontend usando useMemo
  const historicoFiltrado = useMemo(() => {
    if (!termoBusca) {
      return historico; // Retorna todos os itens da página atual se não houver busca
    }
    const termoLower = termoBusca.toLowerCase();
    // Filtra por nome do componente OU nome do utilizador
    return historico.filter(item =>
      item.componenteNome?.toLowerCase().includes(termoLower) ||
      item.usuario?.toLowerCase().includes(termoLower)
    );
  }, [historico, termoBusca]); // Recalcula quando o histórico da página ou o termo mudam

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setPage(0);
  };

  // Handler para atualizar o estado da busca
  const handleBuscaChange = (event) => {
    setTermoBusca(event.target.value);
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Container maxWidth="lg">
        {/* 5. Header com Título e Barra de Busca */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
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
            sx={{ minWidth: '300px' }}
          />
        </Box>
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
                  // 6. Mapeia sobre o 'historicoFiltrado' em vez de 'historico'
                  historicoFiltrado.length > 0 ? (
                    historicoFiltrado.map((item) => (
                      <TableRow hover key={item.id}>
                        <TableCell>
                          {new Date(item.dataHora).toLocaleString("pt-BR")}
                        </TableCell>
                        <TableCell>{item.componenteNome || 'N/A'}</TableCell>
                        <TableCell>
                          <Chip
                            label={item.tipo}
                            // Ajuste para incluir 'PERDA' se existir no seu enum
                            color={item.tipo === "ENTRADA" ? "success" : (item.tipo === "SAIDA" ? "error" : "warning")}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{item.quantidade}</TableCell>
                        <TableCell>{item.usuario}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    // 7. Mensagem quando a busca não encontra resultados
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                         <Typography color="text.secondary" sx={{ p: 3 }}>
                            {termoBusca
                              ? `Nenhum registo encontrado para "${termoBusca}".`
                              : "Nenhum registo de histórico nesta página."}
                          </Typography>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalElements} // O total de itens SEM filtro
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