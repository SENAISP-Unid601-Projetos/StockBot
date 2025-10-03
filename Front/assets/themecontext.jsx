import React, { createContext, useState, useMemo, useContext } from "react";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// 1. Cria o contexto
export const ThemeContext = createContext();

// 2. Cria o componente Provedor do Tema
export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => localStorage.getItem("themeMode") || "light");

  // Função simples para trocar o tema
  const toggleTheme = () => {
    const newMode = mode === "light" ? "dark" : "light";
    localStorage.setItem("themeMode", newMode);
    setMode(newMode);
  };

  // Cria o tema do Material-UI. É aqui que a mágica acontece.
  const muiTheme = useMemo(() =>
    createTheme({
      palette: {
        mode: mode, // A MÁGICA ACONTECE AQUI
        primary: {
          main: '#e30613', // Usando sua cor do Senai diretamente
        },
      },
    }),
    [mode]
  );

  // Valor que será compartilhado com os outros componentes
  const value = {
    theme: mode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}