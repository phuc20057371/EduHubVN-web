import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  AlertTitle,
  Box,
} from "@mui/material";

interface GeneralConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: "primary" | "secondary" | "error" | "warning" | "info" | "success";
  alertSeverity?: "error" | "warning" | "info" | "success";
  showAlert?: boolean;
  alertTitle?: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const GeneralConfirmDialog: React.FC<GeneralConfirmDialogProps> = ({
  open,
  title,
  message,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  confirmColor = "primary",
  alertSeverity = "info",
  showAlert = true,
  alertTitle,
  loading = false,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pb: 2 }}>
        {showAlert ? (
          <Alert severity={alertSeverity} sx={{ mb: 2 }}>
            {alertTitle && <AlertTitle>{alertTitle}</AlertTitle>}
            <Typography variant="body2">{message}</Typography>
          </Alert>
        ) : (
          <Box sx={{ py: 1 }}>
            <Typography variant="body1">{message}</Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button 
          onClick={onClose} 
          color="inherit" 
          disabled={loading}
          variant="outlined"
          sx={{ minWidth: 100 }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          color={confirmColor}
          variant="contained"
          disabled={loading}
          sx={{ minWidth: 100 }}
        >
          {loading ? "Đang xử lý..." : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GeneralConfirmDialog;
