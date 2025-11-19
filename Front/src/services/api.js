import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor de Requisição (Está 100% correto)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de Resposta (A CORREÇÃO ESTÁ AQUI)
// Interceptor de Resposta (VERSÃO DEBUG)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log("🔍 Interceptor de erro:", {
      status: error.response?.status,
      url: error.config?.url,
      pathname: window.location.pathname,
    });

    // 🚨 TEMPORARIAMENTE COMENTA O REDIRECT
    /*
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      if (window.location.pathname !== '/login') {
        localStorage.removeItem('jwt-token');
        localStorage.removeItem('user-data');
        window.location.href = '/login'; 
      }
    }
    */

    return Promise.reject(error);
  }
);
export default api;
