import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
// CORREÇÃO 1: Import único do Contexto (verifique se o nome do arquivo é ThemeContext.js)
import { ThemeContext } from "../context/themecontext";
import api from "../services/api";
import { jwtDecode } from "jwt-decode";

import {
  Box,
  Container,
  Typography,
  Paper,
  FormControlLabel,
  Switch,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";

import ModalAddUser from "../components/ModalAddUser"; // Era 'modaladduser.jsx'

function ConfiguracoesPage() {
  // --- ESTADOS ---
  const {
    theme,
    toggleTheme,
    increaseFontSize,
    decreaseFontSize,
    // CORREÇÃO 3: cycleColorMode já vem do mesmo contexto
    cycleColorMode,
  } = useContext(ThemeContext);

  const [isAdmin, setIsAdmin] = useState(false);
  // const [users, setUsers] = useState([]); // Não usado se não tiver a tabela aqui
  const [loading, setLoading] = useState(false);
  const [isAddUserModalVisible, setAddUserModalVisible] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [limiteEstoque, setLimiteEstoque] = useState(5);

  useEffect(() => {
    const token = localStorage.getItem("jwt-token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        // Verifica se role existe e é ADMIN
        setIsAdmin(decodedToken.role === "ADMIN");
      } catch (e) {
        console.error("Erro ao decodificar token", e);
      }
    }
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await api.get("/configuracoes/limiteEstoqueBaixo");
        setLimiteEstoque(response.data);
      } catch (error) {
        console.error("Não foi possível buscar o limite de estoque.", error);
      }
    };
    if (isAdmin) {
      fetchInitialData();
    }
  }, [isAdmin]);

  // Handlers
  const handleSalvarLimite = async () => {
    try {
      await api.put("/configuracoes/limiteEstoqueBaixo", {
        threshold: parseInt(limiteEstoque, 10),
      });
      toast.success("Limite de estoque baixo atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar limite:", error);
      toast.error("Falha ao atualizar o limite.");
    }
  };

  const handleVerifyPassword = async () => {
    setLoading(true);
    try {
      // Dica: Certifique-se que essa rota existe no backend ou ajuste a lógica
      await api.post("/auth/verify-password", { password });
      setIsVerified(true);
      toast.success("Identidade verificada com sucesso!");
    } catch (error) {
      console.error("Erro na verificação de senha:", error);
      toast.error("Senha incorreta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 3, backgroundColor: "background.default" }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          component="h1"
          fontWeight="bold"
          sx={{ mb: 4 }}
        >
          Configurações
        </Typography>

        {/* --- APARÊNCIA --- */}
        <Paper sx={{ p: 3, mb: 4, boxShadow: 3 }}>
          <Typography variant="h6" gutterBottom>
            Aparência
          </Typography>

          <FormControlLabel
            control={
              <Switch checked={theme === "dark"} onChange={toggleTheme} />
            }
            label="Modo Escuro"
          />

          <Box sx={{ mt: 2 }}>
            <Typography variant="body1">Tamanho da Fonte</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button variant="outlined" onClick={decreaseFontSize}>
                A-
              </Button>
              <Button variant="outlined" onClick={increaseFontSize}>
                A+
              </Button>
            </Box>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Button
              variant="outlined"
              onClick={cycleColorMode}
              color="secondary"
            >
              Alternar Modo Daltônico
            </Button>
          </Box>
        </Paper>

        {/* --- ESTOQUE (ADMIN) --- */}
        {isAdmin && (
          <Paper sx={{ p: 3, mb: 4, boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom>
              Configurações de Estoque
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <TextField
                label="Limite para Estoque Baixo"
                type="number"
                size="small"
                value={limiteEstoque}
                onChange={(e) => setLimiteEstoque(e.target.value)}
              />
              <Button variant="contained" onClick={handleSalvarLimite}>
                Salvar
              </Button>
            </Box>
          </Paper>
        )}

        {/* --- AREA SENSÍVEL (ADMIN) --- */}
        {isAdmin && (
          <Paper sx={{ p: 3, boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom>
              Adicionar Admin / Gestão Rápida
            </Typography>

            {!isVerified ? (
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}
              >
                <TextField
                  label="Confirme sua senha"
                  type="password"
                  size="small"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  variant="contained"
                  onClick={handleVerifyPassword}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : "Verificar"}
                </Button>
              </Box>
            ) : (
              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setAddUserModalVisible(true)}
                >
                  Adicionar Novo Usuário
                </Button>

                <Typography
                  variant="caption"
                  display="block"
                  sx={{ mt: 2, color: "text.secondary" }}
                >
                  Para gestão completa, acesse o menu "Usuários" na barra
                  lateral.
                </Typography>
              </Box>
            )}
          </Paper>
        )}
      </Container>

      <ModalAddUser
        isVisible={isAddUserModalVisible}
        onClose={() => setAddUserModalVisible(false)}
        onUserAdded={() => toast.success("Usuário criado!")}
      />
    </Box>
  );
}

export default ConfiguracoesPage;
