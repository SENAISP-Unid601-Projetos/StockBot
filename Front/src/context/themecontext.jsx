import { createContext, useState, useEffect, useMemo } from 'react';

// 1. Cria o Context
export const ThemeContext = createContext();

// 2. Cria o Provedor do Context
export function ThemeProvider({ children }) {
  // O estado 'theme' guarda 'light' ou 'dark'
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  // Efeito para adicionar/remover a classe 'dark' do <body>
  useEffect(() => {
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
    localStorage.setItem('theme', theme); // Salva a preferência
  }, [theme]);

  // Função para alternar o tema
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // useMemo otimiza o valor para que não seja recriado a cada renderização
  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
