import { createContext, useContext } from "react";

// 1. Cria e exporta o Contexto
export const ColorModeContext = createContext({ toggleColorMode: () => {} });

// 2. Cria e exporta o Hook customizado
export const useColorMode = () => useContext(ColorModeContext);