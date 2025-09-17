import { useTheme as useMuiTheme } from '@mui/material/styles';
import { getColors } from '../theme/colors';
import type { ThemeMode } from '../theme/ThemeProvider';

export const useColors = () => {
  const theme = useMuiTheme();
  const mode: ThemeMode = theme.palette.mode as ThemeMode;
  return getColors(mode);
};