import { createContext, useContext } from "react";

// 1. Cria o Contexto
export const AuthContext = createContext({});

// 2. Cria o Hook e exporta
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
