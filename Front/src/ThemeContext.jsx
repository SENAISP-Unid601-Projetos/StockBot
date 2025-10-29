import React, { useState, useMemo, useEffect } from "react";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ColorModeContext } from "./useColorMode.js"; // Importa o contexto do toggle

// Provedor que gerencia o estado e aplica o tema MUI
export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => localStorage.getItem('themeMode') || 'light');

  // Este hook aplica a classe 'dark' ou 'light' ao <body>
  useEffect(() => {
    const bodyClassList = document.body.classList;
    // Remove a classe oposta e adiciona a classe atual
    bodyClassList.remove(mode === 'light' ? 'dark' : 'light');
    bodyClassList.add(mode);
    // Salva a preferência no localStorage (já estava no toggle, mas é bom garantir aqui também)
    // localStorage.setItem('themeMode', mode); // Removido daqui pois já está no toggleColorMode
  }, [mode]); // Executa sempre que o 'mode' mudar

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light';
          localStorage.setItem('themeMode', newMode); // Salva a preferência aqui
          return newMode;
        });
      },
    }),
    [],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                primary: { main: '#C00000' }, // Vermelho SENAI
                background: { default: '#f4f4f4', paper: '#ffffff' },
                // Pode adicionar cores 'secondary', 'error', 'warning', 'info', 'success' aqui se quiser personalizar
              }
            : {
                primary: { main: '#C00000' }, // Vermelho SENAI
                background: { default: '#121212', paper: '#1e1e1e' },
                // Cores escuras correspondentes
              }),
        },
        // Pode adicionar outras configurações de tema aqui (typography, components, etc.)
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline /> {/* Aplica reset e cor de fundo base do tema MUI */}
        {children} {/* Renderiza o resto da aplicação */}
      </MuiThemeProvider>
    </ColorModeContext.Provider>
  );
}