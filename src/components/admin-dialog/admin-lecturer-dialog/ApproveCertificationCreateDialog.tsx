import {
  Assignment as AssignmentIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
  Fingerprint as FingerprintIcon,
  MilitaryTech as MilitaryTechIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useCallback, useState } from "react";

import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setLecturerProfileUpdate } from "../../../redux/slice/LecturerProfileUpdateSlice";
import { setCertificationRequests } from "../../../redux/slice/RequestCertificationSlice";
import {
  formatDate,
  formatDateToVietnamTime,
  getAcademicRank,
} from "../../../utils/ChangeText";
import { API } from "../../../utils/Fetch";

interface ApproveCertificationCreateDialogProps {
  open: boolean;
  onClose: () => void;
  data: any;
}

const ApproveCertificationCreateDialog: React.FC<
  ApproveCertificationCreateDialogProps
> = ({ open, onClose, data }) => {
  const dispatch = useDispatch();
  const [adminNote, setAdminNote] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState<
    "approve" | "reject" | null
  >(null);
  const [loading, setLoading] = useState(false);

  // Always define these variables, but handle null safely
  const contentData = data?.content;
  const lecturerInfo = data?.lecturerInfo;

  const handleApprove = useCallback(async () => {
    if (!contentData?.id) return;

    setLoading(true);
    try {
      await API.admin.approveCertification({ id: contentData.id });
      const responseData = await API.admin.getCertificationRequests();
      dispatch(setCertificationRequests(responseData.data.data));
      toast.success("Đã duyệt chứng chỉ thành công!");
      setShowConfirmDialog(null);
      setAdminNote(""); // Reset admin note
      onClose();
      const response = await API.admin.getLecturerAllProfile({
        id: lecturerInfo.id,
      });
      if (response.data.success) {
        dispatch(setLecturerProfileUpdate(response.data.data));
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi duyệt chứng chỉ!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [contentData?.id, dispatch, onClose]);

  const handleReject = useCallback(async () => {
    if (!adminNote.trim()) {
      toast.error("Vui lòng nhập ghi chú từ chối!");
      return;
    }

    if (!contentData?.id) return;

    setLoading(true);
    try {
      await API.admin.rejectCertification({
        id: contentData.id,
        adminNote: adminNote.trim(),
      });
      const responseData = await API.admin.getCertificationRequests();
      dispatch(setCertificationRequests(responseData.data.data));
      toast.success("Đã từ chối chứng chỉ thành công!");
      setShowConfirmDialog(null);
      setAdminNote(""); // Reset admin note
      onClose();
      const response = await API.admin.getLecturerAllProfile({
        id: lecturerInfo.id,
      });
      if (response.data.success) {
        dispatch(setLecturerProfileUpdate(response.data.data));
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi từ chối chứng chỉ!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [adminNote, contentData?.id, dispatch, onClose]);

  const handleCloseConfirmDialog = useCallback(() => {
    setShowConfirmDialog(null);
    setAdminNote(""); // Reset admin note when closing dialog
  }, []);

  // Handle the case where data is null or invalid
  if (!data || !contentData || !lecturerInfo) {
    return null;
  }

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
            <Avatar
              src={""}
              sx={{ bgcolor: "primary.main", width: 48, height: 48 }}
            >
              <AssignmentIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Yêu cầu tạo mới chứng chỉ
              </Typography>
              <Typography variant="body2">ID: {contentData.id}</Typography>
            </Box>
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
                        label={getAcademicRank(lecturerInfo?.academicRank)}
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
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Thông tin chứng chỉ
                  </Typography>
                </Box>
                <Stack spacing={2}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AssignmentIcon color="primary" fontSize="small" />
                    <Typography variant="body1">
                      <strong>Tên chứng chỉ:</strong> {contentData.name}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <BusinessIcon color="primary" fontSize="small" />
                    <Typography variant="body1">
                      <strong>Tổ chức cấp:</strong> {contentData.issuedBy}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <MilitaryTechIcon color="primary" fontSize="small" />
                    <Typography variant="body1">
                      <strong>Trình độ:</strong> {contentData.level}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CalendarIcon color="primary" fontSize="small" />
                    <Typography variant="body1">
                      <strong>Thời gian:</strong>{" "}
                      {formatDate(contentData.issueDate)}
                    </Typography>
                    <Typography variant="body1">
                      - {formatDate(contentData.expiryDate) || "Không thời hạn"}
                    </Typography>
                  </Box>
                  {contentData.expiryDate && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CalendarIcon color="primary" fontSize="small" />
                      <Typography variant="body1">
                        <strong>Ngày hết hạn:</strong>{" "}
                        {formatDate(contentData.expiryDate)}
                      </Typography>
                    </Box>
                  )}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <FingerprintIcon color="primary" fontSize="small" />
                    <Typography variant="body1">
                      <strong>Reference ID:</strong> {contentData.referenceId}
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
                  href={contentData.certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  fullWidth
                  sx={{ py: 1.5 }}
                >
                  Xem tài liệu chứng chỉ
                </Button>
              </CardContent>
            </Card>

            {/* Timestamps */}

            <Box
              sx={{
                mt: 3,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ textAlign: "right", width: "100%" }}>
                <Typography variant="body2" color="text.secondary">
                  Được tạo lúc:{" "}
                  {formatDateToVietnamTime(contentData?.createdAt)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Cập nhật lần cuối:{" "}
                  {formatDateToVietnamTime(contentData?.updatedAt)}
                </Typography>
              </Box>
            </Box>
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
                <Typography variant="h6">Xác nhận duyệt chứng chỉ</Typography>
              </>
            ) : (
              <>
                <CancelIcon color="error" />
                <Typography variant="h6">Xác nhận từ chối chứng chỉ</Typography>
              </>
            )}
          </DialogTitle>
          <DialogContent>
            {showConfirmDialog === "approve" ? (
              <Alert severity="info">
                Bạn có chắc chắn muốn duyệt chứng chỉ "{contentData.name}" của
                giảng viên {lecturerInfo.fullName}?
              </Alert>
            ) : (
              <Stack spacing={2}>
                <Alert severity="warning">
                  Bạn có chắc chắn muốn từ chối chứng chỉ "{contentData.name}"
                  của giảng viên {lecturerInfo.fullName}?
                </Alert>
                <TextField
                  label="Lý do từ chối *"
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  fullWidth
                  multiline
                  rows={3}
                  variant="outlined"
                  placeholder="Nhập lý do từ chối chứng chỉ này..."
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

export default ApproveCertificationCreateDialog;
