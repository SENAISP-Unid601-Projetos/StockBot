import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

// Seu interceptor de requisição (perfeito, sem alterações)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- SUGESTÃO: Adicionar Interceptor de Resposta ---
api.interceptors.response.use(
  // 1. O que fazer com respostas de SUCESSO (status 2xx)
  (response) => {
    // Apenas retorna a resposta
    return response;
  },
  // 2. O que fazer com respostas de ERRO
  (error) => {
    // Se o erro for 401 (Não Autorizado)
    if (error.response && error.response.status === 401) {
      // a. Limpe o token do localStorage
      localStorage.removeItem('jwt-token');

      // b. Redirecione o usuário para a página de login
      //    (Evita que ele fique em uma tela que exige autenticação)
      window.location.href = '/login'; 
      
      // Você também pode mostrar uma mensagem de "Sessão expirada".
    }

    // Para outros erros, apenas rejeita a promessa para que
    // o bloco .catch() do seu componente possa lidar com eles.
    return Promise.reject(error);
  }
);


export default api;