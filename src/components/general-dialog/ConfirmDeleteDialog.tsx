import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  Box,
  Avatar,
} from "@mui/material";
import { Warning as WarningIcon, Delete as DeleteIcon } from "@mui/icons-material";
import type { Lecturer } from "../../types/Lecturer";

interface ConfirmDeleteDialogProps {
  open: boolean;
  lecturer: Lecturer | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  open,
  lecturer,
  loading = false,
  onClose,
  onConfirm,
}) => {
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !loading) {
      onConfirm();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      onKeyDown={handleKeyPress}
      sx={{
        "& .MuiBackdrop-root": {
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(4px)",
        },
      }}
    >
      <DialogTitle 
        sx={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 2,
          background: "linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)",
          borderBottom: "1px solid #ffcdd2",
        }}
      >
        <Box
          sx={{
            p: 1,
            borderRadius: "50%",
            background: "rgba(244, 67, 54, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <WarningIcon sx={{ color: "#f44336", fontSize: 28 }} />
        </Box>
        <Typography variant="h6" sx={{ color: "#d32f2f", fontWeight: 600 }}>
          Xác nhận xóa giảng viên
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            "& .MuiAlert-icon": {
              alignItems: "center",
            },
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            Hành động này không thể hoàn tác!
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
            Tất cả dữ liệu liên quan đến giảng viên này sẽ bị xóa vĩnh viễn.
          </Typography>
        </Alert>

        {lecturer && (
          <Box
            sx={{
              p: 3,
              borderRadius: 2,
              background: "linear-gradient(135deg, #f5f5f5 0%, #eeeeee 100%)",
              border: "1px solid #e0e0e0",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Avatar
              sx={{
                width: 56,
                height: 56,
                bgcolor: "#1976d2",
                fontSize: "1.5rem",
                fontWeight: 600,
              }}
            >
              {lecturer.fullName?.charAt(0)?.toUpperCase() || "?"}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                {lecturer.fullName || "Không có tên"}
              </Typography>
              <Typography variant="body2" sx={{ color: "#666", mb: 0.5 }}>
                ID: {lecturer.id}
              </Typography>
              <Typography variant="body2" sx={{ color: "#666" }}>
                Chuyên ngành: {lecturer.specialization || "Không xác định"}
              </Typography>
              {lecturer.phoneNumber && (
                <Typography variant="body2" sx={{ color: "#666" }}>
                  SĐT: {lecturer.phoneNumber}
                </Typography>
              )}
            </Box>
          </Box>
        )}

        <Typography 
          variant="body1" 
          sx={{ 
            mt: 3, 
            fontWeight: 500, 
            color: "#d32f2f",
            textAlign: "center",
          }}
        >
          Bạn có chắc chắn muốn xóa giảng viên này không?
        </Typography>
      </DialogContent>

      <DialogActions 
        sx={{ 
          p: 3, 
          pt: 2,
          gap: 2,
          background: "#fafafa",
          borderTop: "1px solid #e0e0e0",
        }}
      >
        <Button 
          onClick={onClose} 
          variant="outlined" 
          disabled={loading}
          sx={{
            minWidth: 100,
            textTransform: "none",
            borderColor: "#9e9e9e",
            color: "#616161",
            "&:hover": {
              borderColor: "#757575",
              backgroundColor: "#f5f5f5",
            },
          }}
        >
          Hủy
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          disabled={loading}
          startIcon={<DeleteIcon />}
          sx={{
            minWidth: 120,
            textTransform: "none",
            fontWeight: 600,
            background: "linear-gradient(135deg, #f44336 0%, #d32f2f 100%)",
            boxShadow: "0 4px 12px rgba(244, 67, 54, 0.3)",
            "&:hover": {
              background: "linear-gradient(135deg, #d32f2f 0%, #c62828 100%)",
              boxShadow: "0 6px 16px rgba(244, 67, 54, 0.4)",
            },
            "&:disabled": {
              background: "#bdbdbd",
              boxShadow: "none",
            },
          }}
        >
          {loading ? "Đang xóa..." : "Xóa giảng viên"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
