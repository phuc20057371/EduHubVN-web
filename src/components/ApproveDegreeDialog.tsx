import React, { useEffect, useState, useCallback } from "react";
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
  IconButton,
  Avatar,
  Alert,
} from "@mui/material";
import {
  Close as CloseIcon,
  School as SchoolIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";

import LocationCityIcon from "@mui/icons-material/LocationCity";
import PsychologyIcon from "@mui/icons-material/Psychology";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import DateRangeIcon from "@mui/icons-material/DateRange";
import FingerprintIcon from "@mui/icons-material/Fingerprint";

import { API } from "../utils/Fetch";
import { toast } from "react-toastify";
import { setLecturerRequests } from "../redux/slice/LecturerRquestSlice";
import { useDispatch } from "react-redux";

interface ApproveDegreeDialogProps {
  open: boolean;
  onClose: () => void;
  data: any;
}

const ApproveDegreeDialog: React.FC<ApproveDegreeDialogProps> = ({
  open,
  onClose,
  data,
}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (open) {
      console.log("ApproveDegreeDialog opened with data:", data);
    }
  }, []);
  const [adminNote, setAdminNote] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState<
    "approve" | "reject" | null
  >(null);
  const [loading, setLoading] = useState(false);

  if (!data) return null;

  const contentData = data.content;
  const lecturerInfo = data.lecturerInfo;

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

  const getAcademicRankLabel = (rank: string) => {
    switch (rank) {
      case "CN":
        return "Cử nhân";
      case "THS":
        return "Thạc sĩ";
      case "TS":
        return "Tiến sĩ";
      case "PGS":
        return "Phó giáo sư";
      case "GS":
        return "Giáo sư";
      default:
        return rank;
    }
  };

  const handleApprove = useCallback(async () => {
    setLoading(true);
    try {
      await API.admin.approveDegree({ id: contentData.id });
      const responseData = await API.admin.getLecturerRequests();
      dispatch(setLecturerRequests(responseData.data.data));
      toast.success("Đã duyệt bằng cấp thành công!");
      setShowConfirmDialog(null);
      setAdminNote(""); // Reset admin note
      onClose();
    } catch (error) {
      toast.error("Có lỗi xảy ra khi duyệt bằng cấp!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [contentData.id, dispatch, onClose]);

  const handleReject = useCallback(async () => {
    if (!adminNote.trim()) {
      toast.error("Vui lòng nhập ghi chú từ chối!");
      return;
    }

    setLoading(true);
    try {
      await API.admin.rejectDegree({
        id: contentData.id,
        adminNote: adminNote.trim(),
      });
      const responseData = await API.admin.getLecturerRequests();
      dispatch(setLecturerRequests(responseData.data.data));
      toast.success("Đã từ chối bằng cấp thành công!");
      setShowConfirmDialog(null);
      setAdminNote(""); // Reset admin note
      onClose();
    } catch (error) {
      toast.error("Có lỗi xảy ra khi từ chối bằng cấp!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [adminNote, contentData.id, dispatch, onClose]);

  const handleCloseConfirmDialog = useCallback(() => {
    setShowConfirmDialog(null);
    setAdminNote(""); // Reset admin note when closing dialog
  }, []);

  return (
    <>
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
            <SchoolIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Chi tiết bằng cấp
            </Typography>
            {contentData.id}
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ px: 3, pb: 2 }}>
          <Stack spacing={3}>
            {/* Lecturer Info Banner */}
            <Card
              variant="outlined"
              sx={{ borderRadius: 2, bgcolor: "primary.50" }}
            >
              <CardContent sx={{ py: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    src={lecturerInfo?.avatarUrl || ""}
                    sx={{ width: 60, height: 60 }}
                  >
                    {lecturerInfo?.fullName?.charAt(0) || ""}
                  </Avatar>

                  <Box sx={{ flexGrow: 1 }}>
                    {/* Hàng 1: Tên và Học hàm */}
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        gap: 1,
                        mb: 0.5,
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {lecturerInfo?.fullName}
                      </Typography>
                      <Chip
                        size="small"
                        label={getAcademicRankLabel(lecturerInfo?.academicRank)}
                        color="primary"
                        variant="outlined"
                      />
                    </Box>

                    {/* Email */}
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary", mb: 0.5 }}
                    >
                      {lecturerInfo?.email}
                    </Typography>

                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary", mt: 0.5 }}
                      >
                        {lecturerInfo?.experienceYears} năm kinh nghiệm trong
                        lĩnh vực {lecturerInfo?.specialization}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card variant="outlined" sx={{ borderRadius: 2 }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                    flexWrap: "wrap", // Giúp responsive trên màn nhỏ
                    gap: 1,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Thông tin bằng cấp
                  </Typography>
                  <Chip
                    label={getStatusText(contentData.status)}
                    color={getStatusColor(contentData.status)}
                    sx={{ px: 2, py: 1, fontSize: "1rem" }}
                  />
                </Box>
                <Stack spacing={2}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <SchoolIcon color="primary" fontSize="small" />
                    <Typography variant="body1">
                      <strong>Tên bằng cấp:</strong> {contentData.name}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LocationCityIcon color="primary" fontSize="small" />
                    <Typography variant="body1">
                      <strong>Trường/Tổ chức:</strong> {contentData.institution}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <PsychologyIcon color="primary" fontSize="small" />
                    <Typography variant="body1">
                      <strong>Chuyên ngành:</strong> {contentData.major}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <MilitaryTechIcon color="primary" fontSize="small" />
                    <Typography variant="body1">
                      <strong>Trình độ:</strong> {contentData.level}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <DateRangeIcon color="primary" fontSize="small" />
                    <Typography variant="body1">
                      <strong>Thời gian:</strong> {contentData.startYear} -{" "}
                      {contentData.graduationYear}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <FingerprintIcon color="primary" fontSize="small" />
                    <Typography variant="body1">
                      <strong>Mã tham chiếu:</strong> {contentData.referenceId}
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
                  {contentData.description || "Không có mô tả"}
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
                  href={contentData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  fullWidth
                  sx={{ py: 1.5 }}
                >
                  Xem tài liệu bằng cấp
                </Button>
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
                    <strong>Cập nhật lần cuối:</strong>{" "}
                    {new Date(contentData.updatedAt).toLocaleString("vi-VN")}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={() => setShowConfirmDialog("reject")}
            variant="contained"
            color="error"
            sx={{ minWidth: 100 }}
          >
            Từ chối
          </Button>
          <Button
            onClick={() => setShowConfirmDialog("approve")}
            variant="contained"
            color="success"
            sx={{ minWidth: 100 }}
          >
            Duyệt
          </Button>
        </DialogActions>
      </Dialog>

      {showConfirmDialog && (
        <Dialog
          open={true}
          onClose={handleCloseConfirmDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {showConfirmDialog === "approve" ? (
              <>
                <CheckCircleIcon color="success" />
                <Typography variant="h6">Xác nhận duyệt bằng cấp</Typography>
              </>
            ) : (
              <>
                <CancelIcon color="error" />
                <Typography variant="h6">Xác nhận từ chối bằng cấp</Typography>
              </>
            )}
          </DialogTitle>
          <DialogContent>
            {showConfirmDialog === "approve" ? (
              <Alert severity="info">
                Bạn có chắc chắn muốn duyệt bằng cấp "{contentData.name}" của
                giảng viên {lecturerInfo.fullName}?
              </Alert>
            ) : (
              <Stack spacing={2}>
                <Alert severity="warning">
                  Bạn có chắc chắn muốn từ chối bằng cấp "{contentData.name}" của
                  giảng viên {lecturerInfo.fullName}?
                </Alert>
                <TextField
                  label="Lý do từ chối *"
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  fullWidth
                  multiline
                  rows={3}
                  variant="outlined"
                  placeholder="Nhập lý do từ chối bằng cấp này..."
                  required
                />
              </Stack>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button
              onClick={handleCloseConfirmDialog}
              variant="outlined"
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              onClick={
                showConfirmDialog === "approve" ? handleApprove : handleReject
              }
              variant="contained"
              color={showConfirmDialog === "approve" ? "success" : "error"}
              disabled={loading}
              sx={{ minWidth: 100 }}
            >
              {loading
                ? "Đang xử lý..."
                : showConfirmDialog === "approve"
                  ? "Duyệt"
                  : "Từ chối"}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default ApproveDegreeDialog;
