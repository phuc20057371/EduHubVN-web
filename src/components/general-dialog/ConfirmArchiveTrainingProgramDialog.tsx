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
import { Warning as WarningIcon, Archive as ArchiveIcon } from "@mui/icons-material";
import type { TrainingProgram } from "../../types/TrainingProgram";

interface ConfirmArchiveTrainingProgramDialogProps {
  open: boolean;
  program: TrainingProgram | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmArchiveTrainingProgramDialog: React.FC<ConfirmArchiveTrainingProgramDialogProps> = ({
  open,
  program,
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
          background: "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)",
          borderBottom: "1px solid #ffe0b2",
        }}
      >
        <Box
          sx={{
            p: 1,
            borderRadius: "50%",
            background: "rgba(255, 152, 0, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <WarningIcon sx={{ color: "#ff9800", fontSize: 28 }} />
        </Box>
        <Typography variant="h6" sx={{ color: "#e65100", fontWeight: 600 }}>
          Xác nhận lưu trữ chương trình đào tạo
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Alert 
          severity="warning" 
          sx={{ 
            mb: 3,
            "& .MuiAlert-icon": {
              alignItems: "center",
            },
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            Chương trình sẽ được chuyển sang trạng thái "Đã lưu trữ"
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
            Chương trình sẽ không hiển thị công khai nhưng vẫn có thể được khôi phục sau này.
          </Typography>
        </Alert>

        {program && (
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
                fontSize: "1.2rem",
                fontWeight: 600,
              }}
            >
              📚
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                {program.title || "Không có tên"}
              </Typography>
              <Typography variant="body2" sx={{ color: "#666", mb: 0.5 }}>
                Mã CT: {program.trainingProgramId || program.id?.slice(0, 8)}
              </Typography>
              <Typography variant="body2" sx={{ color: "#666" }}>
                Trạng thái hiện tại: {
                  program.programStatus === "PUBLISHED" ? "Đã xuất bản" :
                  program.programStatus === "REVIEW" ? "Đang xét duyệt" :
                  program.programStatus === "UNLISTED" ? "Chưa niêm yết" :
                  program.programStatus
                }
              </Typography>
              {program.listedPrice && (
                <Typography variant="body2" sx={{ color: "#666" }}>
                  Giá: {program.listedPrice.toLocaleString("vi-VN")} VND
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
            color: "#e65100",
            textAlign: "center",
          }}
        >
          Bạn có chắc chắn muốn lưu trữ chương trình đào tạo này không?
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
          color="warning"
          disabled={loading}
          startIcon={<ArchiveIcon />}
          sx={{
            minWidth: 140,
            textTransform: "none",
            fontWeight: 600,
            background: "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)",
            boxShadow: "0 4px 12px rgba(255, 152, 0, 0.3)",
            "&:hover": {
              background: "linear-gradient(135deg, #f57c00 0%, #ef6c00 100%)",
              boxShadow: "0 6px 16px rgba(255, 152, 0, 0.4)",
            },
            "&:disabled": {
              background: "#bdbdbd",
              boxShadow: "none",
            },
          }}
        >
          {loading ? "Đang lưu trữ..." : "Lưu trữ chương trình"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmArchiveTrainingProgramDialog;