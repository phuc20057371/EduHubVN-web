import { IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme } from '../theme/ThemeProvider';

interface ThemeToggleProps {
  size?: 'small' | 'medium' | 'large';
  showTooltip?: boolean;
}

export default function ThemeToggle({ 
  size = 'medium', 
  showTooltip = true 
}: ThemeToggleProps) {
  const { isDarkMode, toggleTheme } = useTheme();

  const toggleButton = (
    <IconButton
      onClick={toggleTheme}
      color="inherit"
      size={size}
      sx={{
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'scale(1.1)',
        },
      }}
    >
      {isDarkMode ? <Brightness7 /> : <Brightness4 />}
    </IconButton>
  );

  if (!showTooltip) {
    return toggleButton;
  }

  return (
    <Tooltip title={isDarkMode ? 'Chuyển sang Light Mode' : 'Chuyển sang Dark Mode'}>
      {toggleButton}
    </Tooltip>
  );
}