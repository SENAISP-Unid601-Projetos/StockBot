```javascript
// Importa os hooks 'useState', 'useEffect' e 'useCallback' do React.
import { useState, useEffect, useCallback } from "react";
// Importa a biblioteca 'toast' para exibir notificações.
import { toast } from "react-toastify";

// Importa componentes de interface de usuário da biblioteca Material-UI (MUI).
import {
  Box,
  Button,
  CircularProgress, // Ícone de carregamento
  Container,
  Paper, // Um container com aparência de "papel"
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination, // O componente de paginação!
  Typography,
  IconButton,
  Stack, // Componente para empilhar elementos (ex: botões)
  TextField,
} from "@mui/material";

// Importa ícones do Material-UI.
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// Importa o componente do modal de adição/edição.
import ModalComponente from "../components/modalcomponente";
// Importa a instância configurada do Axios (para chamadas de API).
import api from "../services/api";

function ComponentesPage() {
  // --- DEFINIÇÃO DOS ESTADOS DO COMPONENTE ---

  // 'componentes' armazena a lista de itens *da página atual*. Começa vazio.
  const [componentes, setComponentes] = useState([]);
  // 'loading' controla a exibição do ícone de carregamento.
  const [loading, setLoading] = useState(true);
  // 'page' armazena o índice da página atual (começa em 0).
  const [page, setPage] = useState(0);
  // 'rowsPerPage' armazena quantos itens são exibidos por página.
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // 'totalElements' armazena o número total de itens no backend (para a paginação).
  const [totalElements, setTotalElements] = useState(0);
  // 'isModalVisible' controla se o modal de adição/edição está aberto.
  const [isModalVisible, setModalVisible] = useState(false);
  // 'componenteEmEdicao' armazena os dados do item sendo editado (ou null se for adição).
  const [componenteEmEdicao, setComponenteEmEdicao] = useState(null);

  // --- FUNÇÕES DE LÓGICA ---

  // Define a função 'fetchData' para buscar dados da API.
  // 'useCallback' memoriza a função, recriando-a apenas se suas dependências mudarem.
  const fetchData = useCallback(async () => {
    setLoading(true); // Ativa o ícone de carregamento.
    try {
      // 1. A API de componentes NÃO é paginada no backend.
      // Removemos os parâmetros ?page= e &size= da URL.
      const response = await api.get("/api/componentes");

      // 2. A resposta (response.data) É o próprio array de componentes.
      // Guardamos ele em 'todosComponentes'. Usamos '|| []' como segurança.
      const todosComponentes = response.data || [];
      
      // 3. O total de elementos (para a paginação) é o tamanho do array COMPLETO.
      setTotalElements(todosComponentes.length);

      // 4. Nós simulamos a paginação manualmente no frontend.
      // Calcula o índice inicial da "fatia" do array.
      const inicio = page * rowsPerPage;
      // Calcula o índice final.
      const fim = inicio + rowsPerPage;
      // Atualiza o estado 'componentes' apenas com os itens da página atual.
      setComponentes(todosComponentes.slice(inicio, fim)); 

    } catch (error) {
      // Em caso de falha na API...
      console.error("Erro ao buscar componentes:", error);
      toast.error("Não foi possível carregar os componentes.");
      setComponentes([]); // Garante um array vazio em caso de erro.
      setTotalElements(0); // Zera a paginação.
    } finally {
      // Executa dando certo ou errado.
      setLoading(false); // Desativa o ícone de carregamento.
    }
  }, [
      // 5. Dependências do useCallback.
      // A função 'fetchData' será recriada se qualquer um destes valores mudar.
      // Isso é crucial para a paginação funcionar no frontend.
      page, 
      rowsPerPage, 
      setComponentes, 
      setTotalElements, 
      setLoading
    ]);

  // 'useEffect' executa uma função quando o componente é montado ou suas dependências mudam.
  // 2. O useEffect agora apenas chama o fetchData.
  useEffect(() => {
    fetchData(); // Chama a função de busca de dados.
  }, [fetchData]); // A dependência é a própria função 'fetchData' memorizada.

  // --- HANDLERS (Funções de Evento) ---

  // 4. Funções para lidar com as ações de paginação do MUI.
  // Chamada quando o usuário clica para mudar de página.
  const handleChangePage = (event, newPage) => {
    setPage(newPage); // Atualiza o estado da página, o que aciona o 'fetchData'.
  };

  // Chamada quando o usuário muda o número de "itens por página".
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10)); // Atualiza o N° de itens.
    setPage(0); // Volta para a primeira página.
  };

  // Chamada quando o usuário clica no ícone de editar.
  const handleEdit = (componente) => {
    setComponenteEmEdicao(componente); // Define o item a ser editado.
    setModalVisible(true); // Abre o modal.
  };

  // Chamada quando o usuário clica no ícone de excluir.
  const handleDelete = async (id) => {
    // Exibe um pop-up nativo de confirmação.
    if (
      window.confirm("Você tem certeza que deseja excluir este componente?")
    ) {
      try {
        // Envia a requisição DELETE para a API.
        await api.delete(`/api/componentes/${id}`);
        toast.success("Componente excluído com sucesso!");
        
        // 3. CHAME O FETCHDATA AQUI!
        // Recarrega os dados da página atual para refletir a exclusão.
        fetchData(); 
        
      } catch (error) {
        toast.error("Falha ao excluir o componente.");
        console.error(error);
      }
    }
  };

  // Chamada quando o usuário clica no botão "Adicionar Item".
  const handleAdd = () => {
    setComponenteEmEdicao(null); // Garante que não há item em edição (modo "criação").
    setModalVisible(true); // Abre o modal.
  };

  // --- RENDERIZAÇÃO DO COMPONENTE (JSX) ---
  return (
    // React Fragment (<>): um "invólucro" invisível necessário pois
    // o componente retorna dois elementos irmãos (Box e ModalComponente).
    <>
      {/* Container principal da página */}
      <Box
        component="main" // Define a tag HTML (semanticamente, é o conteúdo principal).
        sx={{ // 'sx' é a prop do MUI para estilos CSS.
          flexGrow: 1, // Permite que o conteúdo cresça e ocupe o espaço.
          p: 3, // Adiciona padding (espaçamento interno).
          minHeight: "100vh", // Altura mínima de 100% da tela.
          backgroundColor: "background.default", // Usa a cor de fundo do tema.
        }}
      >
        <Container maxWidth="lg">
          {/* Header da página (Título e Botão Adicionar) */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between", // Alinha itens nas extremidades.
              alignItems: "center", // Alinha verticalmente.
              mb: 4, // 'margin-bottom' (margem inferior).
            }}
          >
            {/* Título da Página */}
            <Typography variant="h4" component="h1" fontWeight="bold">
              Gerenciamento de Itens
            </Typography>

            {/* Botão Adicionar Item */}
            <Button
              variant="contained" // Estilo "preenchido".
              startIcon={<AddIcon />} // Ícone no início do botão.
              onClick={handleAdd} // Define a função de clique.
              sx={{
                backgroundColor: "#ce0000", // Cor customizada.
                "&:hover": { backgroundColor: "#a40000" }, // Cor ao passar o mouse.
              }}
            >
              Adicionar Item
            </Button>
          </Box>

          {/* Renderização Condicional: ou mostra o loading ou a tabela. */}
          {loading ? (
            // Se 'loading' for true, exibe o CircularProgress no centro.
            <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
              <CircularProgress />
            </Box>
          ) : (
            // Se 'loading' for false, exibe a Tabela dentro do Paper.
            <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: 3 }}>
              <TableContainer>
                {/* 'stickyHeader' faz o cabeçalho ficar fixo no topo ao rolar. */}
                <Table stickyHeader aria-label="tabela de componentes">
                  <TableHead>
                    <TableRow>
                      {/* Células do Cabeçalho */}
                      <TableCell sx={{ fontWeight: "bold" }}>Nome</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Patrimônio
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Quantidade
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* Mapeia o array 'componentes' (apenas os da página atual) */}
                    {componentes.map((componente) => (
                      // 'key' é essencial para o React identificar cada item.
                      <TableRow hover key={componente.id}>
                        {/* Células do Corpo da Tabela */}
                        <TableCell>{componente.nome}</TableCell>
                        <TableCell>{componente.codigoPatrimonio}</TableCell>
                        <TableCell>{componente.quantidade}</TableCell>
                        <TableCell>
                          {/* 'Stack' organiza os botões de ação horizontalmente. */}
                          <Stack direction="row" spacing={1}>
                            <IconButton
                              color="info" // Cor do tema (azul).
                              onClick={() => handleEdit(componente)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              color="error" // Cor do tema (vermelho).
                              onClick={() => handleDelete(componente.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* 5. O Componente de Paginação do MUI */}
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]} // Opções de "itens por página".
                component="div" // Renderiza como <div>.
                count={totalElements} // N° total de itens (para calcular as páginas).
                rowsPerPage={rowsPerPage} // N° de itens por página selecionado.
                page={page} // Página atual.
                onPageChange={handleChangePage} // Função p/ mudar de página.
                onRowsPerPageChange={handleChangeRowsPerPage} // Função p/ mudar N° de itens.
                labelRowsPerPage="Itens por página:" // Texto customizado.
              />
            </Paper>
          )}
        </Container>
      </Box>

      {/* Renderização Condicional do Modal */}
      {/* O Modal só é renderizado no DOM se 'isModalVisible' for true. */}
      {isModalVisible && (
        <ModalComponente
          isVisible={isModalVisible}
          onClose={() => setModalVisible(false)} // Fecha o modal.
          // Passa o 'fetchData' para o modal poder recarregar a tabela após salvar.
          onComponenteAdicionado={fetchData} 
          componenteParaEditar={componenteEmEdicao} // Passa o item a ser editado.
        />
      )}
    </>
  );
}

// Exporta o componente para ser usado em outras partes da aplicação (ex: main.jsx).
export default ComponentesPage;
```