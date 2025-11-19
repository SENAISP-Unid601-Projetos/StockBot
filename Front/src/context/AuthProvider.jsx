import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import {
  isAuthenticated,
  getLoggedUser,
  isAdmin as checkIsAdmin,
} from "../services/authService";

// IMPORTA O CONTEXTO DO OUTRO ARQUIVO
import { AuthContext } from "./Authcontext";

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const recoverUser = () => {
      if (isAuthenticated()) {
        const userData = getLoggedUser();
        setUser(userData);
        const token = localStorage.getItem("jwt-token");
        if (token) {
          api.defaults.headers.Authorization = `Bearer ${token}`;
        }
      }
      setLoading(false);
    };

    recoverUser();
  }, []);

  const login = async (email, senha, dominio) => {
    try {
      const response = await api.post("/auth/login", { email, senha, dominio });
      const { token, usuario } = response.data;

      localStorage.setItem("jwt-token", token);
      localStorage.setItem("user-data", JSON.stringify(usuario));

      api.defaults.headers.Authorization = `Bearer ${token}`;
      setUser(usuario);

      toast.success(`Bem-vindo, ${usuario.nome}!`);
      navigate("/");
    } catch (error) {
      console.error("Erro no login:", error);
      const msg =
        error.response?.data?.message || "Erro ao tentar fazer login.";
      toast.error(msg);
    }
  };

  const logout = () => {
    localStorage.removeItem("jwt-token");
    localStorage.removeItem("user-data");
    api.defaults.headers.Authorization = undefined;
    setUser(null);
    navigate("/login");
  };

  const isAdmin = () => checkIsAdmin();

  return (
    <AuthContext.Provider
      value={{
        authenticated: !!user,
        user,
        loading,
        login,
        logout,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
