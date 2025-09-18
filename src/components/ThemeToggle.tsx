import { Box, Switch, Typography } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme } from '../theme/ThemeProvider';

interface ThemeToggleProps {
  showLabels?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

export default function ThemeToggle({ 
  showLabels = false,
  orientation = 'horizontal'
}: ThemeToggleProps) {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        flexDirection: orientation === 'vertical' ? 'column' : 'row',
        padding: 1,
        borderRadius: 2,
        backgroundColor: 'rgba(0,0,0,0.03)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {showLabels && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
          <Brightness7 sx={{ 
            fontSize: 20, 
            color: isDarkMode ? '#666' : '#ff9800',
            filter: isDarkMode ? 'none' : 'drop-shadow(0 0 4px rgba(255,152,0,0.5))'
          }} />
          <Typography 
            variant="body2" 
            sx={{ 
              fontSize: '0.9rem',
              fontWeight: 600,
              color: isDarkMode ? '#888' : '#333',
              textShadow: isDarkMode ? 'none' : '0 1px 2px rgba(0,0,0,0.1)'
            }}
          >
            Light
          </Typography>
        </Box>
      )}
      
      <Switch
        checked={isDarkMode}
        onChange={toggleTheme}
        size="medium"
        sx={{
          width: 72,
          height: 34,
          padding: 0,
          '& .MuiSwitch-switchBase': {
            margin: 1,
            padding: 0,
            transform: 'translateX(6px)',
            '&.Mui-checked': {
              color: '#fff',
              transform: 'translateX(32px)',
              '& + .MuiSwitch-track': {
                backgroundColor: '#9e9e9e',
                opacity: 1,
                border: 0,
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
              },
              '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.5,
              },
            },
            '&.Mui-focusVisible .MuiSwitch-thumb': {
              color: '#33cf4d',
              border: '6px solid #fff',
            },
            '&:hover .MuiSwitch-thumb': {
              boxShadow: '0 4px 12px rgba(0,0,0,0.4), 0 2px 6px rgba(0,0,0,0.3)',
            },
            '&:hover + .MuiSwitch-track': {
              boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.15)',
            },
            '&.Mui-disabled .MuiSwitch-thumb': {
              color: '#f5f5f5',
            },
            '&.Mui-disabled + .MuiSwitch-track': {
              opacity: 0.3,
            },
          },
          '& .MuiSwitch-thumb': {
            boxSizing: 'border-box',
            width: 22,
            height: 22,
            backgroundColor: isDarkMode ? '#1976d2' : '#ff9800',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)',
            transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
            '&:before': {
              content: "''",
              position: 'absolute',
              width: '100%',
              height: '100%',
              left: 0,
              top: 0,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 24 24" fill="white"><path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"/></svg>')`,
            },
          },
          '& .MuiSwitch-switchBase.Mui-checked .MuiSwitch-thumb': {
            backgroundColor: '#1976d2',
            boxShadow: '0 3px 8px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.3)',
            '&:before': {
              backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 24 24" fill="white"><path d="M9.37,5.51C9.19,6.15,9.1,6.82,9.1,7.5c0,4.08,3.32,7.4,7.4,7.4c0.68,0,1.35-0.09,1.99-0.27C17.45,17.19,14.93,19,12,19 c-3.86,0-7-3.14-7-7C5,9.07,6.81,6.55,9.37,5.51z"/></svg>')`,
            },
          },
          '& .MuiSwitch-track': {
            borderRadius: 34 / 2,
            backgroundColor: '#9e9e9e',
            opacity: 1,
            transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.1)',
          },
        }}
      />
      
      {showLabels && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
          <Brightness4 sx={{ 
            fontSize: 20, 
            color: isDarkMode ? '#bb86fc' : '#666',
            filter: isDarkMode ? 'drop-shadow(0 0 4px rgba(187,134,252,0.5))' : 'none'
          }} />
          <Typography 
            variant="body2" 
            sx={{ 
              fontSize: '0.9rem',
              fontWeight: 600,
              color: isDarkMode ? '#bb86fc' : '#888',
              textShadow: isDarkMode ? '0 0 4px rgba(187,134,252,0.3)' : 'none'
            }}
          >
            Dark
          </Typography>
        </Box>
      )}
    </Box>
  );
}