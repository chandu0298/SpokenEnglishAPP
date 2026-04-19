import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { Palettes, ThemeMode } from '../constants/Theme';
import { StatusBar } from 'expo-status-bar';

type ThemeContextType = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  colors: typeof Palettes.light;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>('light');

  // Sync with system theme on initial load if user hasn't chosen one
  useEffect(() => {
    if (systemScheme === 'dark') {
      // setMode('dark'); // Optional: auto-sync with system dark mode
    }
  }, [systemScheme]);

  const colors = Palettes[mode];

  return (
    <ThemeContext.Provider value={{ mode, setMode, colors }}>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
