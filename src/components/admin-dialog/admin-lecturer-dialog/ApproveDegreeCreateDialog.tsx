import {
  Close,
  School as SchoolIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import {
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
  Typography,
} from "@mui/material";
import React, { useCallback, useState } from "react";

import DateRangeIcon from "@mui/icons-material/DateRange";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import PsychologyIcon from "@mui/icons-material/Psychology";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setLecturerProfileUpdate } from "../../../redux/slice/LecturerProfileUpdateSlice";
import { setDegreeRequests } from "../../../redux/slice/RequestDegreeSlice";
import {
  formatDateToVietnamTime,
  getAcademicRank,
} from "../../../utils/ChangeText";
import { API } from "../../../utils/Fetch";
import ConfirmDialog from "../../general-dialog/ConfirmDialog";

interface ApproveDegreeCreateDialogProps {
  open: boolean;
  onClose: () => void;
  data: any;
  onSuccess?: () => void;
}

const ApproveDegreeCreateDialog: React.FC<ApproveDegreeCreateDialogProps> = ({
  open,
  onClose,
  data,
  onSuccess,
}) => {
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
      await API.admin.approveDegree({ id: contentData.id });
      const responseData = await API.admin.getDegreeRequests();
      dispatch(setDegreeRequests(responseData.data.data));
      toast.success("Đã duyệt bằng cấp thành công!");
      setShowConfirmDialog(null);
      setAdminNote(""); // Reset admin note
      onSuccess?.();
      onClose();
      const response = await API.admin.getLecturerAllProfile({
        id: lecturerInfo.id,
      });
      if (response.data.success) {
        dispatch(setLecturerProfileUpdate(response.data.data));
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi duyệt bằng cấp!");
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
      await API.admin.rejectDegree({
        id: contentData.id,
        adminNote: adminNote.trim(),
      });
      const responseData = await API.admin.getDegreeRequests();
      dispatch(setDegreeRequests(responseData.data.data));
      toast.success("Đã từ chối bằng cấp thành công!");
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
      toast.error("Có lỗi xảy ra khi từ chối bằng cấp!");
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
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              src={""}
              sx={{ bgcolor: "primary.main", width: 48, height: 48 }}
            >
              <SchoolIcon />
            </Avatar>
            <Box flex={1}>
              <Typography variant="h5" component="div">
                Yêu cầu tạo mới bằng cấp
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {contentData?.fullName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ID: {contentData?.id}
              </Typography>
            </Box>
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: "primary.main",
                transition: "all 0.2s",
              }}
              size="small"
            >
              <Close />
            </IconButton>
          </Box>
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
                    flexWrap: "wrap", // Giúp responsive trên màn nhỏ
                    gap: 1,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Thông tin bằng cấp
                  </Typography>
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

            <Stack spacing={1} mt={2} alignItems="flex-end">
              <Typography variant="body2">
                Được tạo lúc: {formatDateToVietnamTime(contentData.createdAt)}
              </Typography>
              <Typography variant="body2">
                Cập nhật lần cuối:{" "}
                {formatDateToVietnamTime(contentData.updatedAt)}
              </Typography>
            </Stack>
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
        <ConfirmDialog
          open={true}
          type={showConfirmDialog}
          title={
            showConfirmDialog === "approve"
              ? "Xác nhận duyệt bằng cấp"
              : "Xác nhận từ chối bằng cấp"
          }
          message={
            showConfirmDialog === "approve"
              ? `Bạn có chắc chắn muốn duyệt bằng cấp "${contentData.name}" của giảng viên ${lecturerInfo.fullName}?`
              : `Bạn có chắc chắn muốn từ chối bằng cấp "${contentData.name}" của giảng viên ${lecturerInfo.fullName}?`
          }
          loading={loading}
          rejectNote={adminNote}
          onRejectNoteChange={setAdminNote}
          rejectNoteRequired={showConfirmDialog === "reject"}
          onClose={handleCloseConfirmDialog}
          onConfirm={
            showConfirmDialog === "approve" ? handleApprove : handleReject
          }
        />
      )}
    </>
  );
};

export default ApproveDegreeCreateDialog;
