import { jwtDecode } from "jwt-decode";

/**
 * Verifica se existe um token válido e não expirado no localStorage.
 * @returns {boolean} - Retorna true se o utilizador estiver autenticado, false caso contrário.
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem("jwt-token");

  // 1. Se não houver token, não está autenticado.
  if (!token) {
    return false;
  }

  try {
    // 2. Decodifica o token para aceder à data de expiração (exp).
    const decodedToken = jwtDecode(token);

    // 3. A data de expiração (exp) vem em segundos. Convertemos para milissegundos para comparar com a data atual.
    const currentTime = Date.now() / 1000;

    // 4. Se a data de expiração for menor que a data atual, o token expirou.
    if (decodedToken.exp < currentTime) {
      localStorage.removeItem("jwt-token"); // Limpa o token expirado
      return false;
    }
  } catch (error) {
    // Se houver um erro ao decodificar, o token é inválido.
    console.error("Token inválido:", error);
    return false;
  }

  // Se passou por todas as verificações, está autenticado.
  return true;
};

/**
 * Verifica se o utilizador logado tem a permissão de ADMIN.
 * @returns {boolean} - Retorna true se for ADMIN, false caso contrário.
 */
export const isAdmin = () => {
  // Primeiro, verifica se está autenticado. Se não estiver, não pode ser admin.
  if (!isAuthenticated()) {
    return false;
  }

  const token = localStorage.getItem("jwt-token");

  try {
    const decodedToken = jwtDecode(token);
    // O campo 'roles' é um array. Verificamos se ele inclui 'ROLE_ADMIN'.
    return decodedToken.roles && decodedToken.roles.includes("ROLE_ADMIN");
  } catch (error) {
    console.error(
      "Erro ao decodificar o token para verificação de admin:",
      error
    );
    return false;
  }
};
