// Em: src/services/authService.js (O CÓDIGO CORRETO)
export const isAuthenticated = () => {
  const token = localStorage.getItem("jwt-token");
  const userData = localStorage.getItem("user-data");

  // A versão correta verifica AMBOS
  return token != null && userData != null;
};

export const isAdmin = () => {
  try {
    const userDataString = localStorage.getItem("user-data");
    if (!userDataString) {
      return false;
    }
    const userData = JSON.parse(userDataString);
    return userData.role === "ADMIN";
  } catch (error) {
    console.error("Erro ao verificar 'role' do usuário:", error);
    return false;
  }
};

export const getLoggedUser = () => {
  try {
    const userDataString = localStorage.getItem("user-data");
    return userDataString ? JSON.parse(userDataString) : null;
  } catch (error) {
    console.error("Erro ao ler dados do usuário:", error);
    return null;
  }
};
