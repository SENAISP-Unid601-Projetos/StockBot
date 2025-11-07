// src/ThemeContext.jsx

import React, { useState, useMemo, useEffect } from "react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ColorModeContext } from "./useColorMode.js";

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(
    () => localStorage.getItem("themeMode") || "light"
  );

  // **** BLOCO useEffect CORRIGIDO ****
  useEffect(() => {
    // Adiciona uma verificação para garantir que document.body existe
    if (document.body) {
      const bodyClassList = document.body.classList;
      bodyClassList.remove(mode === "light" ? "dark" : "light");
      bodyClassList.add(mode);
    }
  }, [mode]); // Executa sempre que 'mode' mudar
  // **** FIM DO BLOCO useEffect ****

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === "light" ? "dark" : "light";
          localStorage.setItem("themeMode", newMode);
          return newMode;
        });
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light"
            ? {
                primary: { main: "#C00000" },
                background: { default: "#f4f4f4", paper: "#ffffff" },
              }
            : {
                primary: { main: "#C00000" },
                background: { default: "#121212", paper: "#1e1e1e" },
              }),
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ColorModeContext.Provider>
  );
}
