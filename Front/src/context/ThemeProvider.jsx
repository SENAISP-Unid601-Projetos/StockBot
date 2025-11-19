import { useState, useEffect, useMemo, useCallback } from "react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { paletteColors } from "../context/color";

// IMPORTA O CONTEXTO DO OUTRO ARQUIVO (Isso resolve o erro do Fast Refresh)
import { ThemeContext } from "./themecontext";

export function ThemeProvider({ children }) {
  // --- ESTADOS ---
  const [mode, setMode] = useState(
    () => localStorage.getItem("themeMode") || "light"
  );
  const [fontSize, setFontSize] = useState(
    () => parseInt(localStorage.getItem("fontSize"), 10) || 14
  );
  const [colorMode, setColorMode] = useState(
    () => localStorage.getItem("colorMode") || "default"
  );

  // --- EFEITOS ---
  useEffect(() => localStorage.setItem("themeMode", mode), [mode]);
  useEffect(() => localStorage.setItem("fontSize", fontSize), [fontSize]);
  useEffect(() => localStorage.setItem("colorMode", colorMode), [colorMode]);

  // --- FUNÇÕES DE CONTROLE (Com useCallback para estabilizar) ---

  const toggleTheme = useCallback(() => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const increaseFontSize = useCallback(() => {
    setFontSize((prev) => Math.min(prev + 1, 20));
  }, []);

  const decreaseFontSize = useCallback(() => {
    setFontSize((prev) => Math.max(prev - 1, 12));
  }, []);

  const cycleColorMode = useCallback(() => {
    const modes = Object.keys(paletteColors);
    const currentIndex = modes.indexOf(colorMode);
    // Se por acaso o modo salvo não existir mais, volta pro 0 (default)
    const safeIndex = currentIndex === -1 ? 0 : currentIndex;
    const nextIndex = (safeIndex + 1) % modes.length;
    setColorMode(modes[nextIndex]);
  }, [colorMode]); // Depende do colorMode atual

  // --- CRIAÇÃO DO TEMA ---
  const muiTheme = useMemo(() => {
    const currentPalette = paletteColors[colorMode] || paletteColors.default;

    return createTheme({
      palette: {
        mode: mode,
        primary: { main: currentPalette.primary },
        secondary: { main: currentPalette.secondary },
        error: { main: currentPalette.error },
        success: { main: currentPalette.success },
        background: {
          default: mode === "light" ? currentPalette.background : "#121212",
          paper: mode === "light" ? currentPalette.paper : "#1e1e1e",
        },
      },
      typography: {
        fontSize: fontSize,
      },
      components: {
        MuiButton: {
          styleOverrides: { root: { fontSize: `${fontSize}px` } },
        },
        MuiTableCell: {
          styleOverrides: { root: { fontSize: `${fontSize}px` } },
        },
      },
    });
  }, [mode, fontSize, colorMode]);

  // --- VALOR EXPORTADO (Correção das dependências) ---
  const value = useMemo(
    () => ({
      themeMode: mode,
      colorMode,
      fontSize,
      toggleTheme, // Agora são estáveis graças ao useCallback
      cycleColorMode,
      increaseFontSize,
      decreaseFontSize,
    }),
    [
      mode,
      colorMode,
      fontSize,
      toggleTheme,
      cycleColorMode,
      increaseFontSize,
      decreaseFontSize,
    ]
  );

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
