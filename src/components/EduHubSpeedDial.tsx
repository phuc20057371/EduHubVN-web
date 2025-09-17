import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import MessageIcon from '@mui/icons-material/Message';

interface EduHubSpeedDialProps {
  userRole?: 'admin' | 'institution' | 'lecturer' | 'partner';
}

export default function EduHubSpeedDial({ 
  userRole = 'admin'
}: EduHubSpeedDialProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <Box sx={{ 
      position: 'fixed', 
      bottom: 24, 
      right: 24, 
      zIndex: 999 // Lower than header but still high
    }}>
      <SpeedDial
        ariaLabel={`EduHub ${userRole} messages`}
        icon={<SpeedDialIcon openIcon={<MessageIcon />} />}
        onClick={handleDialogOpen}
        sx={{
          '& .MuiSpeedDial-fab': {
            backgroundColor: '#1976d2',
            '&:hover': {
              backgroundColor: '#1565c0',
            },
          },
        }}
      />
      
      {/* Message Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Tin nhắn
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" color="textSecondary">
            Chức năng tin nhắn đang được phát triển...
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}