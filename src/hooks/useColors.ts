import { useTheme as useMuiTheme } from "@mui/material/styles";
import { getColors } from "../theme/colors";
import type { ThemeMode } from "../theme/ThemeProvider";

/**
 * Custom hook for accessing the new color scheme
 * Provides easy access to the new color palette
 */
export const useColors = () => {
  const theme = useMuiTheme();
  const mode: ThemeMode = theme.palette.mode as ThemeMode;
  const colors = getColors(mode);
  const isDark = mode === "dark";

  return {
    ...colors,

    // Quick access to new primary colors
    primary: {
      main: "#00B2FF",
      light: "#33c1ff",
      dark: "#0099e6",
      contrast: isDark ? "#000000" : "#ffffff",
    },

    // Quick access to new secondary colors
    secondary: {
      main: "#E7AD19",
      light: "#ffdf66",
      dark: "#d49c16",
      contrast: isDark ? "#000000" : "#ffffff",
    },

    success: {
      50: "#e6f4ea",
      100: "#c6e8ce",
      200: "#a3d9b0",
      300: "#81c99a",
      400: "#4dbd7c",
      500: "#22c55e",
      600: "#16a34a",
      700: "#15803d",
    },
    warning: {
      50: "#fff8e1",
      100: "#ffecb3",
      200: "#ffe082",
      300: "#ffd54f",
      400: "#ffca28",
      500: "#FFC107",
      600: "#FFB300",
      700: "#FFA000",
    },
    info: {
      50: "#e3f2fd",
      100: "#bbdefb",
      200: "#90caf9",
      300: "#64b5f6",
      400: "#42a5f5",
      500: "#2196f3",
      600: "#1e88e5",
      700: "#1976d2",
    },
    error: {
      50: "#ffebee",
      100: "#ffcdd2",
      200: "#ef9a9a",
      300: "#e57373",
      400: "#ef5350",
      500: "#f44336",
      600: "#e53935",
      700: "#d32f2f",
    },

    // Background colors (dựa vào PartnerUpdateTab)
    background: {
      primary: isDark ? "#1a1a1a" : "#ffffff",
      secondary: isDark ? "#333333" : "#e6e6e6ff",
    },

    // Text colors (dựa vào PartnerUpdateTab)
    text: {
      primary: isDark ? "#ffffff" : "#212121",
      secondary: isDark ? "#bdbdbd" : "#757575",
    },

    // Gradients
    gradients: {
      primary: isDark
        ? "linear-gradient(135deg, #1a1a1a 0%, #333333 50%, #4d4d4d 100%)"
        : "linear-gradient(135deg, #00B2FF 0%, #0099e6 50%, #0080cc 100%)",
      secondary: isDark
        ? "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)"
        : "linear-gradient(135deg, #E7AD19 0%, #d49c16 100%)",
    },

    // Utility
    mode,
    isDark,
    isLight: !isDark,
    WHITE: "#ffffff",
    BLACK: "#000000",
  };
};

/**
 * Color constants for direct use
 */
export const COLOR_CONSTANTS = {
  PRIMARY_BLUE: "#00B2FF",
  SECONDARY_ORANGE: "#E7AD19",
  WHITE: "#ffffff",
  BLACK: "#000000",

  // Light mode
  LIGHT_BACKGROUND: "#ffffff",
  LIGHT_TEXT: "#000000",

  // Dark mode
  DARK_BACKGROUND: "#000000",
  DARK_TEXT: "#ffffff",
} as const;

export type ColorConstant = keyof typeof COLOR_CONSTANTS;
