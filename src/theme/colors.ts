import type { ThemeMode } from './ThemeProvider';

// Base color palette (unchanged)
const baseColors = {
  // Primary Colors (Blue)
  primary: {
    25: "#f0f9ff",
    50: "#f0f9ff",
    100: "#e0f2fe", 
    200: "#bae6fd",
    300: "#7dd3fc",
    400: "#38bdf8",
    500: "#136fb4", // Main primary
    600: "#0ea5e9",
    700: "#0284c7",
    800: "#0369a1",
    900: "#0c4a6e",
    950: "#082f49"
  },

  // Secondary Colors (Light Blue)
  secondary: {
    50: "#f0f9ff",
    100: "#e0f2fe",
    200: "#bae6fd", 
    300: "#7dd3fc",
    400: "#38bdf8",
    500: "#0ea5e9", // Main secondary
    600: "#0284c7",
    700: "#0369a1",
    800: "#075985",
    900: "#0c4a6e",
    950: "#082f49"
  },

  // Accent Colors
  accent: {
    blue: "#136fb4",
    lightBlue: "#0ea5e9", 
    sky: "#38bdf8",
    indigo: "#6366f1"
  },

  // Neutral Colors
  neutral: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1", 
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
    950: "#020617"
  },

  // Semantic Colors
  success: {
    50: "#f0fdf4",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d"
  },

  error: {
    50: "#fef2f2", 
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c"
  },

  warning: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706", 
    700: "#b45309"
  },

  // Info Colors
  info: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a"
  },
};

// Light theme colors
const lightThemeColors = {
  ...baseColors,
  
  // Background Colors
  background: {
    primary: "#ffffff",
    secondary: "#f8fafc",
    tertiary: "#f0f9ff",
    dark: "#0c4a6e",
    gradient: {
      primary: "linear-gradient(135deg, #0284c7 0%, #0369a1 50%, #075985 100%)",
      secondary: "linear-gradient(135deg, #136fb4 0%, #0ea5e9 100%)",
      dark: "linear-gradient(135deg, #0c4a6e 0%, #082f49 100%)"
    }
  },

  // Text Colors
  text: {
    primary: "#0c4a6e",
    secondary: "#0369a1", 
    tertiary: "#64748b",
    light: "rgba(255,255,255,0.9)",
    muted: "rgba(3, 105, 161, 0.7)"
  },

  // Border Colors
  border: {
    light: "rgba(19, 111, 180, 0.1)",
    medium: "rgba(19, 111, 180, 0.2)",
    strong: "rgba(3, 105, 161, 0.4)"
  }
};

// Dark theme colors
const darkThemeColors = {
  ...baseColors,
  
  // Background Colors
  background: {
    primary: "#0f172a",
    secondary: "#1e293b",
    tertiary: "#334155",
    dark: "#020617",
    gradient: {
      primary: "linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)",
      secondary: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      dark: "linear-gradient(135deg, #020617 0%, #0f172a 100%)"
    }
  },

  // Text Colors
  text: {
    primary: "#f8fafc",
    secondary: "#e2e8f0", 
    tertiary: "#cbd5e1",
    light: "rgba(248, 250, 252, 0.9)",
    muted: "rgba(226, 232, 240, 0.7)"
  },

  // Border Colors
  border: {
    light: "rgba(248, 250, 252, 0.1)",
    medium: "rgba(248, 250, 252, 0.2)",
    strong: "rgba(226, 232, 240, 0.4)"
  }
};

// Function to get colors based on theme mode
export const getColors = (mode: ThemeMode = 'light') => {
  return mode === 'dark' ? darkThemeColors : lightThemeColors;
};

// Export base colors as default (backward compatibility)
export const colors = lightThemeColors;

// Utility functions
export const getColorWithOpacity = (color: string, opacity: number): string => {
  return `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
};

export const hexToRgba = (hex: string, alpha: number): string => {
  // Handle hex colors with or without #
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.slice(0, 2), 16);
  const g = parseInt(cleanHex.slice(2, 4), 16);
  const b = parseInt(cleanHex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Export color object as default for easier imports
export default colors;
