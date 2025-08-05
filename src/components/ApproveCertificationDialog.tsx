import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  Chip,
  Stack,
  Card,
  CardContent,
  Divider,
  IconButton,
} from "@mui/material";
import {
  Close as CloseIcon,
  Assignment as AssignmentIcon,
  Visibility as VisibilityIcon,
  CalendarToday as CalendarIcon,
  Business as BusinessIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";

interface ApproveCertificationDialogProps {
  open: boolean;
  onClose: () => void;
  data: any;
}

const ApproveCertificationDialog: React.FC<ApproveCertificationDialogProps> = ({
  open,
  onClose,
  data,
}) => {
  const [adminNote, setAdminNote] = useState("");

  if (!data) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "success";
      case "REJECTED":
        return "error";
      case "PENDING":
        return "warning";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "Đã duyệt";
      case "REJECTED":
        return "Từ chối";
      case "PENDING":
        return "Chờ duyệt";
      default:
        return status;
    }
  };

  const handleApprove = () => {
    // TODO: Implement approve functionality
    console.log("Approve certification:", data.id, "Note:", adminNote);
    onClose();
  };

  const handleReject = () => {
    // TODO: Implement reject functionality
    console.log("Reject certification:", data.id, "Note:", adminNote);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AssignmentIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Chi tiết chứng chỉ
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pb: 2 }}>
        <Stack spacing={3}>
          {/* Status */}
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Chip
              label={getStatusText(data.status)}
              color={getStatusColor(data.status)}
              sx={{ px: 2, py: 1, fontSize: "1rem" }}
            />
          </Box>

          {/* Basic Information */}
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Thông tin chứng chỉ
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AssignmentIcon color="primary" fontSize="small" />
                  <Typography variant="body1">
                    <strong>Tên chứng chỉ:</strong> {data.name}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <BusinessIcon color="primary" fontSize="small" />
                  <Typography variant="body1">
                    <strong>Tổ chức cấp:</strong> {data.issuedBy}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <DescriptionIcon color="primary" fontSize="small" />
                  <Typography variant="body1">
                    <strong>Chuyên ngành:</strong> {data.specialization || "Không có"}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AssignmentIcon color="primary" fontSize="small" />
                  <Typography variant="body1">
                    <strong>Trình độ:</strong> {data.level}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CalendarIcon color="primary" fontSize="small" />
                  <Typography variant="body1">
                    <strong>Ngày cấp:</strong> {data.issueDate}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CalendarIcon color="primary" fontSize="small" />
                  <Typography variant="body1">
                    <strong>Ngày hết hạn:</strong> {data.expiryDate || "Không có"}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* Description */}
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Mô tả
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {data.description || "Không có mô tả"}
              </Typography>
            </CardContent>
          </Card>

          {/* File Preview */}
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Tài liệu đính kèm
              </Typography>
              <Button
                variant="outlined"
                startIcon={<VisibilityIcon />}
                href={data.certificateUrl}
                target="_blank"
                rel="noopener noreferrer"
                fullWidth
                sx={{ py: 1.5 }}
              >
                Xem tài liệu chứng chỉ
              </Button>
            </CardContent>
          </Card>

          {/* Current Admin Note */}
          {data.adminNote && (
            <Card variant="outlined" sx={{ borderRadius: 2, bgcolor: "grey.50" }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Ghi chú hiện tại của admin
                </Typography>
                <Typography variant="body2">{data.adminNote}</Typography>
              </CardContent>
            </Card>
          )}

          <Divider />

          {/* Admin Action */}
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Ghi chú duyệt
              </Typography>
              <TextField
                label="Ghi chú của admin"
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                placeholder="Nhập ghi chú về việc duyệt/từ chối chứng chỉ này..."
              />
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Thông tin thời gian
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2">
                  <strong>Ngày tạo:</strong>{" "}
                  {new Date(data.createdAt).toLocaleString("vi-VN")}
                </Typography>
                <Typography variant="body2">
                  <strong>Cập nhật lần cuối:</strong>{" "}
                  {new Date(data.updatedAt).toLocaleString("vi-VN")}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button onClick={onClose} variant="outlined" sx={{ minWidth: 100 }}>
          Đóng
        </Button>
        <Button
          onClick={handleReject}
          variant="contained"
          color="error"
          sx={{ minWidth: 100 }}
        >
          Từ chối
        </Button>
        <Button
          onClick={handleApprove}
          variant="contained"
          color="success"
          sx={{ minWidth: 100 }}
        >
          Duyệt
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApproveCertificationDialog;
