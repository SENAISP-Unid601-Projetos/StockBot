import { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

// Imports do MUI
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Select,
  MenuItem,
  FormControl,
  CircularProgress,
  Avatar,
  Button,
  Stack,
  IconButton,
  TablePagination,
} from "@mui/material";

// Ícones
import AddIcon from "@mui/icons-material/Add";
import KeyIcon from "@mui/icons-material/Key";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonIcon from "@mui/icons-material/Person";

// Modais
import ModalAddUser from "../components/ModalAddUser";
import ModalResetPassword from "../components/ModalUserResetPassword";

// Lógica para pegar a URL base das fotos
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
const SERVER_URL = API_URL.endsWith("/api") ? API_URL.slice(0, -4) : API_URL;
const FOTOS_URL_BASE = `${SERVER_URL}/user-photos/`;

function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modais
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [userToReset, setUserToReset] = useState(null);

  // Paginação
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  // 1. Busca Usuários
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/users", {
        params: {
          page: page,
          size: rowsPerPage,
          sort: "nome,asc",
        },
      });

      setUsers(response.data.content || []);
      setTotalElements(response.data.totalElements);
    } catch (error) {
      toast.error("Falha ao carregar usuários.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // --- Handlers ---

  const handleUserAdded = () => {
    toast.success("Novo usuário criado com sucesso!");
    setPage(0);
    fetchUsers();
  };

  const handleRoleChange = async (userId, newRole) => {
    // Otimização visual (Optimistic UI update)
    const oldUsers = [...users];
    setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));

    try {
      await api.put(`/users/${userId}/role`, { role: newRole });
      toast.success("Permissão atualizada!");
    } catch (error) {
      // --- CORREÇÃO AQUI ---
      // Usamos o 'error' para logar no console, assim o aviso some e você consegue debugar
      console.error("Erro ao alterar permissão:", error);

      setUsers(oldUsers); // Reverte se der erro
      toast.error("Erro ao alterar permissão.");
    }
  };

  // Paginação
  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        bgcolor: "background.default",
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="lg">
        {/* Cabeçalho */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            Gerenciamento de Usuários
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Novo Usuário
          </Button>
        </Box>

        {/* Tabela */}
        <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: 3 }}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Perfil</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Nome</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Função</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="right">
                    Ações
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow hover key={user.id}>
                      <TableCell>
                        <Avatar
                          src={
                            user.caminhoFotoPerfil
                              ? `${FOTOS_URL_BASE}${user.caminhoFotoPerfil}`
                              : undefined
                          }
                          alt={user.nome}
                        >
                          {user.nome?.charAt(0).toUpperCase()}
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {user.nome}
                        </Typography>
                        {user.dominio && (
                          <Typography variant="caption" color="textSecondary">
                            @{user.dominio}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <FormControl size="small" variant="standard">
                          <Select
                            value={user.role}
                            onChange={(e) =>
                              handleRoleChange(user.id, e.target.value)
                            }
                            disableUnderline
                            sx={{
                              fontSize: "0.875rem",
                              fontWeight: "bold",
                              color:
                                user.role === "ADMIN"
                                  ? "primary.main"
                                  : "text.secondary",
                            }}
                            IconComponent={() => null}
                            renderValue={(value) => (
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1}
                              >
                                {value === "ADMIN" ? (
                                  <AdminPanelSettingsIcon fontSize="small" />
                                ) : (
                                  <PersonIcon fontSize="small" />
                                )}
                                <span>
                                  {value === "ADMIN"
                                    ? "Administrador"
                                    : "Usuário"}
                                </span>
                              </Stack>
                            )}
                          >
                            <MenuItem value="ADMIN">Administrador</MenuItem>
                            <MenuItem value="USER">Usuário Padrão</MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          size="small"
                          color="warning"
                          startIcon={<KeyIcon />}
                          onClick={() => setUserToReset(user)}
                        >
                          Senha
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={totalElements}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage="Usuários por página:"
          />
        </Paper>
      </Container>

      {/* Modais */}
      <ModalAddUser
        isVisible={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onUserAdded={handleUserAdded}
      />

      <ModalResetPassword
        isVisible={!!userToReset}
        onClose={() => setUserToReset(null)}
        userToReset={userToReset}
      />
    </Box>
  );
}

export default UserManagementPage;
