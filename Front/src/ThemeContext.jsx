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

  // **** BLOCO useEffect ****
  useEffect(() => {
    if (document.body) {
      const bodyClassList = document.body.classList;
      bodyClassList.remove(mode === "light" ? "dark" : "light");
      bodyClassList.add(mode);
    }
  }, [mode]);

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

  // --- AQUI ESTÁ A ALTERAÇÃO ---
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light"
            ? {
                // MODO CLARO
                primary: { main: "#C00000" },
                background: { default: "#f4f4f4", paper: "#ffffff" },
                sidebar: {
                  background: "#1A2E44", // Azul Escuro (do seu CSS)
                  text: "rgba(255, 255, 255, 0.7)",
                  textActive: "#ffffff",
                  icon: "rgba(255, 255, 255, 0.7)",
                  hover: "rgba(255, 255, 255, 0.08)",
                },
              }
            : {
                // MODO ESCURO
                primary: { main: "#C00000" },
                background: { default: "#121212", paper: "#1e1e1e" },
                sidebar: {
                  background: "#000000", // Preto
                  text: "rgba(255, 255, 255, 0.7)",
                  textActive: "#ffffff",
                  icon: "rgba(255, 255, 255, 0.7)",
                  hover: "rgba(255, 255, 255, 0.08)",
                },
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