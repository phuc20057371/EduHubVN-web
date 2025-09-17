import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Define theme mode type
export type ThemeMode = 'light' | 'dark';

// Theme context interface
interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
  isDarkMode: boolean;
}

// Create context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Custom hook to use theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Light theme configuration
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#136fb4',
      light: '#38bdf8',
      dark: '#0284c7',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#0ea5e9',
      light: '#38bdf8',
      dark: '#0284c7',
      contrastText: '#ffffff',
    },
    background: {
      default: '#ffffff',
      paper: '#f8fafc',
    },
    text: {
      primary: '#0c4a6e',
      secondary: '#0369a1',
    },
    divider: 'rgba(19, 111, 180, 0.1)',
    success: {
      main: '#22c55e',
      light: '#16a34a',
      dark: '#15803d',
    },
    error: {
      main: '#ef4444',
      light: '#dc2626',
      dark: '#b91c1c',
    },
    warning: {
      main: '#f59e0b',
      light: '#d97706',
      dark: '#b45309',
    },
    info: {
      main: '#3b82f6',
      light: '#2563eb',
      dark: '#1d4ed8',
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(19, 111, 180, 0.1)',
        },
      },
    },
  },
});

// Dark theme configuration
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#38bdf8',
      light: '#7dd3fc',
      dark: '#0284c7',
      contrastText: '#0c4a6e',
    },
    secondary: {
      main: '#0ea5e9',
      light: '#38bdf8',
      dark: '#0284c7',
      contrastText: '#0c4a6e',
    },
    background: {
      default: '#0f172a',
      paper: '#1e293b',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
    },
    divider: 'rgba(248, 250, 252, 0.1)',
    success: {
      main: '#22c55e',
      light: '#16a34a',
      dark: '#15803d',
    },
    error: {
      main: '#ef4444',
      light: '#dc2626',
      dark: '#b91c1c',
    },
    warning: {
      main: '#f59e0b',
      light: '#d97706',
      dark: '#b45309',
    },
    info: {
      main: '#3b82f6',
      light: '#2563eb',
      dark: '#1d4ed8',
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: {
      fontWeight: 700,
      color: '#f8fafc',
    },
    h2: {
      fontWeight: 700,
      color: '#f8fafc',
    },
    h3: {
      fontWeight: 600,
      color: '#f8fafc',
    },
    h4: {
      fontWeight: 600,
      color: '#f8fafc',
    },
    h5: {
      fontWeight: 600,
      color: '#f8fafc',
    },
    h6: {
      fontWeight: 600,
      color: '#f8fafc',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          backgroundColor: '#1e293b',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#0f172a',
        },
      },
    },
  },
});

// Theme provider component
interface EduHubThemeProviderProps {
  children: ReactNode;
}

export const EduHubThemeProvider: React.FC<EduHubThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('light');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('eduHub-theme') as ThemeMode;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setMode(savedTheme);
    } else {
      // Detect system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setMode(prefersDark ? 'dark' : 'light');
    }
  }, []);

  // Save theme to localStorage when changed
  useEffect(() => {
    localStorage.setItem('eduHub-theme', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

  const isDarkMode = mode === 'dark';
  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  const contextValue: ThemeContextType = {
    mode,
    toggleTheme,
    isDarkMode,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={currentTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};