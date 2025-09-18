import { useTheme } from '@mui/material/styles';

/**
 * Custom hook for accessing typography variants
 * This hook provides easy access to the custom typography system
 */
export const useTypography = () => {
  const theme = useTheme();

  return {
    // Headings
    heading: theme.typography.h1, // 56px (reduced from 64px)
    subHeading1: theme.typography.h2, // 36px (reduced from 40px)
    subHeading2: theme.typography.h3, // 24px (reduced from 26px)
    
    // Body text
    bodyText1: theme.typography.body1, // 22px (reduced from 24px)
    bodyText2: theme.typography.body2, // 18px (reduced from 20px)
    
    // Additional variants
    h4: theme.typography.h4, // 22px (reduced from 24px)
    h5: theme.typography.h5, // 18px (reduced from 20px)
    h6: theme.typography.h6, // 16px (reduced from 18px)
    
    // Full typography object
    typography: theme.typography,
  };
};

/**
 * Typography size constants for inline styles
 */
export const TYPOGRAPHY_SIZES = {
  heading: '3.5rem', // 56px (reduced from 64px)
  subHeading1: '2.25rem', // 36px (reduced from 40px)
  subHeading2: '1.5rem', // 24px (reduced from 26px)
  bodyText1: '1.375rem', // 22px (reduced from 24px)
  bodyText2: '1.125rem', // 18px (reduced from 20px)
  h4: '1.375rem', // 22px (reduced from 24px)
  h5: '1.125rem', // 18px (reduced from 20px)
  h6: '1rem', // 16px (reduced from 18px)
} as const;

export type TypographyVariant = keyof typeof TYPOGRAPHY_SIZES;