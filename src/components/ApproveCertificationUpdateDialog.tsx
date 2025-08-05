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

interface ApproveCertificationUpdateDialogProps {
  open: boolean;
  onClose: () => void;
  data: any;
}

const ApproveCertificationUpdateDialog: React.FC<ApproveCertificationUpdateDialogProps> = ({
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
    console.log("Approve certification update:", data.id, "Note:", adminNote);
    onClose();
  };

  const handleReject = () => {
    console.log("Reject certification update:", data.id, "Note:", adminNote);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
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
            Cập nhật chứng chỉ
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pb: 2 }}>
        <Stack spacing={3}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Chip
              label={getStatusText(data.status)}
              color={getStatusColor(data.status)}
              sx={{ px: 2, py: 1, fontSize: "1rem" }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 3 }}>
            {/* Original Data */}
            <Card variant="outlined" sx={{ borderRadius: 2, flex: 1 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "error.main" }}>
                  Thông tin hiện tại
                </Typography>
                <Stack spacing={2}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AssignmentIcon color="error" fontSize="small" />
                    <Typography variant="body1">
                      <strong>Tên chứng chỉ:</strong> {data.content?.original?.name}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <BusinessIcon color="error" fontSize="small" />
                    <Typography variant="body1">
                      <strong>Tổ chức cấp:</strong> {data.content?.original?.issuedBy}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <DescriptionIcon color="error" fontSize="small" />
                    <Typography variant="body1">
                      <strong>Chuyên ngành:</strong> {data.content?.original?.specialization || "Không có"}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AssignmentIcon color="error" fontSize="small" />
                    <Typography variant="body1">
                      <strong>Trình độ:</strong> {data.content?.original?.level}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CalendarIcon color="error" fontSize="small" />
                    <Typography variant="body1">
                      <strong>Ngày cấp:</strong> {data.content?.original?.issueDate}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CalendarIcon color="error" fontSize="small" />
                    <Typography variant="body1">
                      <strong>Ngày hết hạn:</strong> {data.content?.original?.expiryDate || "Không có"}
                    </Typography>
                  </Box>
                </Stack>
                <Button
                  variant="outlined"
                  startIcon={<VisibilityIcon />}
                  href={data.content?.original?.certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  fullWidth
                  sx={{ mt: 2, py: 1.5 }}
                  color="error"
                >
                  Xem tài liệu hiện tại
                </Button>
              </CardContent>
            </Card>

            {/* Updated Data */}
            <Card variant="outlined" sx={{ borderRadius: 2, flex: 1 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "success.main" }}>
                  Thông tin cập nhật
                </Typography>
                <Stack spacing={2}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AssignmentIcon color="success" fontSize="small" />
                    <Typography variant="body1">
                      <strong>Tên chứng chỉ:</strong> {data.content?.updated?.name}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <BusinessIcon color="success" fontSize="small" />
                    <Typography variant="body1">
                      <strong>Tổ chức cấp:</strong> {data.content?.updated?.issuedBy}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <DescriptionIcon color="success" fontSize="small" />
                    <Typography variant="body1">
                      <strong>Chuyên ngành:</strong> {data.content?.updated?.specialization || "Không có"}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AssignmentIcon color="success" fontSize="small" />
                    <Typography variant="body1">
                      <strong>Trình độ:</strong> {data.content?.updated?.level}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CalendarIcon color="success" fontSize="small" />
                    <Typography variant="body1">
                      <strong>Ngày cấp:</strong> {data.content?.updated?.issueDate}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CalendarIcon color="success" fontSize="small" />
                    <Typography variant="body1">
                      <strong>Ngày hết hạn:</strong> {data.content?.updated?.expiryDate || "Không có"}
                    </Typography>
                  </Box>
                </Stack>
                <Button
                  variant="outlined"
                  startIcon={<VisibilityIcon />}
                  href={data.content?.updated?.certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  fullWidth
                  sx={{ mt: 2, py: 1.5 }}
                  color="success"
                >
                  Xem tài liệu mới
                </Button>
              </CardContent>
            </Card>
          </Box>

          <Divider />

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
                placeholder="Nhập ghi chú về việc duyệt/từ chối cập nhật chứng chỉ này..."
              />
            </CardContent>
          </Card>

          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Thông tin thời gian
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2">
                  <strong>Ngày tạo:</strong>{" "}
                  {new Date(data.createdAt || Date.now()).toLocaleString("vi-VN")}
                </Typography>
                <Typography variant="body2">
                  <strong>Cập nhật lần cuối:</strong>{" "}
                  {new Date(data.updatedAt || Date.now()).toLocaleString("vi-VN")}
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

export default ApproveCertificationUpdateDialog;
