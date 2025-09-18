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
      main: '#00B2FF',
      light: '#33c1ff',
      dark: '#0099e6',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#E7AD19',
      light: '#ffdf66',
      dark: '#d49c16',
      contrastText: '#000000',
    },
    background: {
      default: '#ffffff', // Pure white
      paper: '#f9f9f9',
    },
    text: {
      primary: '#000000', // Pure black
      secondary: '#333333',
    },
    divider: 'rgba(0, 0, 0, 0.1)',
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
      main: '#00B2FF',
      light: '#33c1ff',
      dark: '#0099e6',
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    // Custom sizes based on requirements
    // Heading (reduced from 64px to 56px) -> h1
    h1: {
      fontSize: '3.5rem', // 56px (reduced from 64px)
      fontWeight: 700,
      lineHeight: 1.1,
      color: '#000000',
    },
    // Sub-heading 1 (reduced from 40px to 36px) -> h2
    h2: {
      fontSize: '2.25rem', // 36px (reduced from 40px)
      fontWeight: 700,
      lineHeight: 1.2,
      color: '#000000',
    },
    // Sub-heading 2 (reduced from 26px to 24px) -> h3
    h3: {
      fontSize: '1.5rem', // 24px (reduced from 26px)
      fontWeight: 600,
      lineHeight: 1.3,
      color: '#000000',
    },
    // Body text 1 (22px) -> h4/body1
    h4: {
      fontSize: '1.375rem', // 22px (reduced from 24px)
      fontWeight: 600,
      lineHeight: 1.4,
      color: '#000000',
    },
    // Body text 2 (18px) -> h5/body2
    h5: {
      fontSize: '1.125rem', // 18px (reduced from 20px)
      fontWeight: 600,
      lineHeight: 1.5,
      color: '#000000',
    },
    h6: {
      fontSize: '1rem', // 16px (reduced from 18px)
      fontWeight: 600,
      lineHeight: 1.5,
      color: '#000000',
    },
    // Body text variants
    body1: {
      fontSize: '1.375rem', // 22px - Body text 1 (reduced from 24px)
      lineHeight: 1.6,
      color: '#000000',
    },
    body2: {
      fontSize: '1.125rem', // 18px - Body text 2 (reduced from 20px)
      lineHeight: 1.6,
      color: '#333333',
    },
    subtitle1: {
      fontSize: '1rem', // 16px (reduced from 18px)
      fontWeight: 500,
      lineHeight: 1.5,
      color: '#000000',
    },
    subtitle2: {
      fontSize: '0.875rem', // 14px (reduced from 16px)
      fontWeight: 500,
      lineHeight: 1.5,
      color: '#333333',
    },
    caption: {
      fontSize: '0.75rem', // 12px (reduced from 14px)
      lineHeight: 1.4,
      color: '#666666',
    },
    button: {
      fontSize: '0.875rem', // 14px (reduced from 16px)
      fontWeight: 600,
      textTransform: 'none' as const,
      color: '#000000',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          scrollbarGutter: 'stable',
          overflowY: 'scroll',
        },
        body: {
          margin: 0,
          padding: 0,
          transition: 'background-color 0.3s ease, color 0.3s ease',
          overflowX: 'hidden',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
          transition: 'all 0.3s ease',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          transition: 'box-shadow 0.3s ease, background-color 0.3s ease',
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
      main: '#00B2FF',
      light: '#33c1ff',
      dark: '#0099e6',
      contrastText: '#000000',
    },
    secondary: {
      main: '#E7AD19',
      light: '#ffdf66',
      dark: '#d49c16',
      contrastText: '#000000',
    },
    background: {
      default: '#000000', // Pure black
      paper: '#1a1a1a',
    },
    text: {
      primary: '#ffffff', // Pure white
      secondary: '#f3f3f3',
    },
    divider: 'rgba(255, 255, 255, 0.1)',
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
      main: '#00B2FF',
      light: '#33c1ff',
      dark: '#0099e6',
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: {
      fontSize: '3.5rem', // 56px (reduced from 64px)
      fontWeight: 700,
      color: '#ffffff',
    },
    h2: {
      fontSize: '2.25rem', // 36px (reduced from 40px)
      fontWeight: 700,
      color: '#ffffff',
    },
    h3: {
      fontSize: '1.5rem', // 24px (reduced from 26px)
      fontWeight: 600,
      color: '#ffffff',
    },
    h4: {
      fontSize: '1.375rem', // 22px (reduced from 24px)
      fontWeight: 600,
      color: '#ffffff',
    },
    h5: {
      fontSize: '1.125rem', // 18px (reduced from 20px)
      fontWeight: 600,
      color: '#ffffff',
    },
    h6: {
      fontSize: '1rem', // 16px (reduced from 18px)
      fontWeight: 600,
      color: '#ffffff',
    },
    body1: {
      fontSize: '1.375rem', // 22px - Body text 1 (reduced from 24px)
      color: '#ffffff',
    },
    body2: {
      fontSize: '1.125rem', // 18px - Body text 2 (reduced from 20px)
      color: '#f3f3f3',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          scrollbarGutter: 'stable',
          overflowY: 'scroll',
        },
        body: {
          margin: 0,
          padding: 0,
          transition: 'background-color 0.3s ease, color 0.3s ease',
          overflowX: 'hidden',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
          transition: 'all 0.3s ease',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          backgroundColor: '#1a1a1a',
          transition: 'box-shadow 0.3s ease, background-color 0.3s ease',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000',
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
    // Add data-theme attribute to document element for CSS variables
    document.documentElement.setAttribute('data-theme', mode);
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