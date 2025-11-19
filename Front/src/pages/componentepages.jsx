import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import { CSVLink } from "react-csv";
import Papa from "papaparse";

import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
  TextField,
  Paper,
  TablePagination,
  InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SearchIcon from "@mui/icons-material/Search";

import api from "../services/api";

// 1. MUDANÇA: Usar o Hook do Contexto
import { useAuth } from "../context/Authcontext";

// 2. MUDANÇA: Imports com letras Maiúsculas (PascalCase) para evitar erro no Render
import ComponentesTable from "../components/componentestable"; // Verifique se o arquivo é ComponentesTable.jsx
import ModalComponente from "../components/modalcomponente";
import ModalSolicitarItem from "../components/ModalSolicitarItem";

function ComponentesPage() {
  // Usando o Contexto
  const { isAdmin } = useAuth();
  const isUserAdmin = isAdmin(); // Verifica permissão dinamicamente

  const [componentes, setComponentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  // Estados dos Modais
  const [isModalVisible, setModalVisible] = useState(false);
  const [componenteEmEdicao, setComponenteEmEdicao] = useState(null);
  const [itemParaSolicitar, setItemParaSolicitar] = useState(null);

  // Paginação e Busca
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [termoDeBusca, setTermoDeBusca] = useState("");
  const [debouncedTermo, setDebouncedTermo] = useState("");

  // Efeito de Debounce (Otimização de Busca)
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedTermo(termoDeBusca);
      setPage(0); // Reseta para página 1 na nova busca
    }, 500);

    return () => clearTimeout(timerId);
  }, [termoDeBusca]);

  // Função de Busca na API
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // 3. MUDANÇA: Passando params via objeto (Mais seguro)
      const response = await api.get("/componentes", {
        params: {
          page: page,
          size: rowsPerPage,
          termo: debouncedTermo,
          sort: "nome,asc",
        },
      });

      setComponentes(response.data.content || []);
      setTotalElements(response.data.totalElements || 0);
    } catch (error) {
      console.error("Erro ao buscar componentes:", error);
      // Evita toast repetitivo se for apenas cancelamento de request
      if (error.code !== "ERR_CANCELED") {
        toast.error("Não foi possível carregar os componentes.");
      }
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, debouncedTermo]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Handlers ---

  const handleAdd = () => {
    setComponenteEmEdicao(null);
    setModalVisible(true);
  };

  const handleEdit = (componente) => {
    setComponenteEmEdicao(componente);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Você tem certeza que deseja excluir este item?")) {
      try {
        await api.delete(`/componentes/${id}`);
        toast.success("Item excluído com sucesso!");
        fetchData();
      } catch (error) {
        console.error("Erro ao excluir:", error);
        toast.error(
          error.response?.data?.message || "Falha ao excluir o item."
        );
      }
    }
  };

  const handleOpenSolicitar = (componente) => setItemParaSolicitar(componente);
  const handleCloseSolicitar = () => setItemParaSolicitar(null);

  const handleSolicitado = () => {
    handleCloseSolicitar();
    fetchData();
  };

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // --- Importação CSV ---
  const handleImportClick = () => fileInputRef.current.click();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    toast.info("Processando arquivo CSV...");

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          await api.post("/componentes/batch", results.data);
          toast.success(`${results.data.length} linhas processadas!`);
          setPage(0);
          fetchData();
        } catch (error) {
          console.error("Erro import CSV:", error);
          toast.error("Falha ao importar dados. Verifique o formato.");
        } finally {
          setLoading(false);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      },
      error: () => {
        setLoading(false);
        toast.error("Erro ao ler o arquivo CSV.");
      },
    });
  };

  const headers = [
    { label: "ID", key: "id" },
    { label: "Nome", key: "nome" },
    { label: "Patrimônio", key: "codigoPatrimonio" },
    { label: "Qtd", key: "quantidade" },
    { label: "Local", key: "localizacao" },
    { label: "Categoria", key: "categoria" },
  ];

  // Nota: Exporta apenas a página atual da tabela
  const csvReport = {
    data: componentes,
    headers: headers,
    filename: "estoque_atual.csv",
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3, minHeight: "100vh" }}>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept=".csv"
        onChange={handleFileUpload}
      />

      <Container maxWidth="xl">
        {/* Cabeçalho */}
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
          <Typography variant="h4" component="h1" fontWeight="bold">
            Gerenciamento de Estoque
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            {isUserAdmin && (
              <>
                <Button
                  variant="contained"
                  startIcon={<UploadFileIcon />}
                  onClick={handleImportClick}
                >
                  Importar
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAdd}
                  color="primary"
                >
                  Novo Item
                </Button>
              </>
            )}
            <CSVLink {...csvReport} style={{ textDecoration: "none" }}>
              <Button variant="outlined" startIcon={<FileDownloadIcon />}>
                Exportar
              </Button>
            </CSVLink>
          </Box>
        </Box>

        {/* Barra de Busca */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Pesquisar por nome, patrimônio ou categoria..."
            value={termoDeBusca}
            onChange={(e) => setTermoDeBusca(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Paper>

        {/* Tabela */}
        <Paper sx={{ boxShadow: 3, overflow: "hidden" }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <ComponentesTable
                componentes={componentes}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSolicitar={handleOpenSolicitar}
                isAdmin={isUserAdmin}
              />
              <TablePagination
                component="div"
                count={totalElements}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
                labelRowsPerPage="Itens por página:"
              />
            </>
          )}
        </Paper>
      </Container>

      {/* Modais */}
      <ModalComponente
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onComponenteAdicionado={fetchData}
        componenteParaEditar={componenteEmEdicao}
      />

      <ModalSolicitarItem
        isVisible={!!itemParaSolicitar}
        onClose={handleCloseSolicitar}
        onSolicitado={handleSolicitado}
        itemParaSolicitar={itemParaSolicitar}
      />
    </Box>
  );
}

export default ComponentesPage;
