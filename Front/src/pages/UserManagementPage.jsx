import { useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import UserManagement from "../components/usermanagement.jsx";
import ModalAddUser from "../components/modaladduser.jsx";

function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddUserModalVisible, setAddUserModalVisible] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/users");
      setUsers(response.data);
    } catch (error) {
      toast.error("Erro ao buscar usuários.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Tem a certeza que deseja remover este utilizador?")) {
      try {
        await api.delete(`/api/users/${id}`);
        toast.success("Utilizador removido.");
        fetchUsers();
      } catch (error) {
        toast.error("Erro ao excluir utilizador.");
      }
    }
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        minHeight: "100vh",
        backgroundColor: "background.default",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            Gestão de Usuários
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setAddUserModalVisible(true)}
            sx={{
              backgroundColor: "#ce0000",
              "&:hover": { backgroundColor: "#a40000" },
            }}
          >
            Adicionar Usuário
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          // O componente UserManagement já contém o Paper e a tabela estilizada
          <UserManagement users={users} onDeleteUser={handleDeleteUser} />
        )}
      </Container>

      {isAddUserModalVisible && (
        <ModalAddUser
          isVisible={isAddUserModalVisible}
          onClose={() => setAddUserModalVisible(false)}
          onUserAdded={fetchUsers}
        />
      )}
    </Box>
  );
}

export default UserManagementPage;
