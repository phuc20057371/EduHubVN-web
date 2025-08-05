import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
} from "@mui/material";
import { PersonOutline, SchoolOutlined } from "@mui/icons-material";

interface ApproveDegreeUpdateDialogProps {
  open: boolean;
  onClose: () => void;
  data: any;
}

const ApproveDegreeUpdateDialog: React.FC<ApproveDegreeUpdateDialogProps> = ({
  open,
  onClose,
  data,
}) => {
  // Always call useEffect first - this must always run
  useEffect(() => {
    if (open && data) {
      console.log("Dialog opened with data:", data);
    }
  }, [open, data]);

  // Always call these function definitions - they don't contain hooks
  const formatDate = (dateString: string) => {
    if (!dateString) return "Không có dữ liệu";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "success";
      case "PENDING":
        return "warning";
      case "REJECTED":
        return "error";
      default:
        return "default";
    }
  };

  const isValueChanged = (originalValue: any, updateValue: any) => {
    return originalValue !== updateValue;
  };

  // Always define these constants
  const comparisonRows = [
    { label: "Tên bằng cấp", originalKey: "name", updateKey: "name" },
    { label: "Chuyên ngành", originalKey: "major", updateKey: "major" },
    {
      label: "Cơ sở đào tạo",
      originalKey: "institution",
      updateKey: "institution",
    },
    { label: "Năm bắt đầu", originalKey: "startYear", updateKey: "startYear" },
    {
      label: "Năm tốt nghiệp",
      originalKey: "graduationYear",
      updateKey: "graduationYear",
    },
    { label: "Trình độ", originalKey: "level", updateKey: "level" },
    { label: "Mô tả", originalKey: "description", updateKey: "description" },
    {
      label: "Ghi chú quản trị",
      originalKey: "adminNote",
      updateKey: "adminNote",
    },
  ];

  // Handle invalid data case in JSX instead of early return
  if (!data || !data.content || !data.lecturerInfo) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Lỗi dữ liệu</DialogTitle>
        <DialogContent>
          <Typography>Không có dữ liệu để hiển thị.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Đóng</Button>
        </DialogActions>
      </Dialog>
    );
  }

  const { content, lecturerInfo } = data;
  const { original, update } = content;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <SchoolOutlined color="primary" />
          <Typography variant="h6">Phê duyệt cập nhật bằng cấp</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Lecturer Info Banner */}
        <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: "#f8f9fa" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Avatar
              src={lecturerInfo?.avatarUrl}
              sx={{ width: 64, height: 64 }}
            >
              <PersonOutline />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {lecturerInfo?.fullName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {lecturerInfo?.email} • {lecturerInfo?.phoneNumber}
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                <Chip
                  label={lecturerInfo?.academicRank}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  label={lecturerInfo?.specialization}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  label={`${lecturerInfo?.experienceYears} năm kinh nghiệm`}
                  size="small"
                  variant="outlined"
                />
              </Box>
            </Box>
            <Chip
              label={lecturerInfo?.status}
              color={getStatusColor(lecturerInfo?.status)}
              variant="filled"
            />
          </Box>
        </Paper>

        <Divider sx={{ my: 2 }} />

        {/* Comparison Table */}
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          So sánh thông tin bằng cấp
        </Typography>

        <TableContainer component={Paper} elevation={1}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold", width: "25%" }}>
                  Trường thông tin
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", width: "37.5%" }}>
                  Thông tin gốc
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", width: "37.5%" }}>
                  Thông tin cập nhật
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {comparisonRows.map((row) => {
                const originalValue = original?.[row.originalKey];
                const updateValue = update?.[row.updateKey];
                const isChanged = isValueChanged(originalValue, updateValue);

                return (
                  <TableRow key={row.label}>
                    <TableCell sx={{ fontWeight: "medium" }}>
                      {row.label}
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          color: isChanged ? "text.secondary" : "text.primary",
                          textDecoration: isChanged ? "line-through" : "none",
                        }}
                      >
                        {originalValue || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          color: isChanged ? "primary.main" : "text.primary",
                          fontWeight: isChanged ? "bold" : "normal",
                        }}
                      >
                        {updateValue || "—"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Status Info */}
        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="body2" color="text.secondary">
              Mã tham chiếu gốc: {original?.referenceId}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Mã yêu cầu cập nhật: {update?.referenceId}
            </Typography>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="body2" color="text.secondary">
              Ngày tạo: {formatDate(update?.createdAt)}
            </Typography>
            <Chip
              label={update?.status}
              color={getStatusColor(update?.status)}
              size="small"
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button onClick={onClose} variant="outlined">
          Đóng
        </Button>
        <Button variant="contained" color="error">
          Từ chối
        </Button>
        <Button variant="contained" color="success">
          Phê duyệt
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApproveDegreeUpdateDialog;
