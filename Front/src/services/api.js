import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

// --- Interceptor de Requisição ---
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Interceptor de Resposta ---
api.interceptors.response.use(
  // ✅ Resposta de sucesso
  (response) => response,

  // ❌ Resposta de erro
  (error) => {
    // Se o backend responder com 401 (não autorizado)
    if (error.response && error.response.status === 401) {
      // Remove o token expirado/inválido
      localStorage.removeItem("jwt-token");

      // Redireciona o utilizador para o login
      window.location.href = "/login";

      // Opcional: pode exibir uma mensagem amigável
      // toast.warn("Sessão expirada. Faça login novamente.");
    }

    // Rejeita o erro para que o .catch() do componente possa tratá-lo
    return Promise.reject(error);
  }
);

export default api;
