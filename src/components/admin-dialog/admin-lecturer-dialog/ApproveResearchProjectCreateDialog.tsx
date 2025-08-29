import { Close as CloseIcon, School as SchoolIcon } from "@mui/icons-material";
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
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setLecturerProfileUpdate } from "../../../redux/slice/LecturerProfileUpdateSlice";
import { setResearchProjectRequests } from "../../../redux/slice/RequestResearchProjectSlice";
import { API } from "../../../utils/Fetch";
import ConfirmDialog from "../../general-dialog/ConfirmDialog";
import { getProjectType, getScale } from "../../../utils/ChangeText";

interface ResearchProjectCreateDialogProps {
  open: boolean;
  data: any;
  onClose: () => void;
}

const ApproveResearchProjectCreateDialog: React.FC<
  ResearchProjectCreateDialogProps
> = ({ open, data, onClose }) => {
  const dispatch = useDispatch();
  const [adminNote, setAdminNote] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState<
    "approve" | "reject" | null
  >(null);
  const [loading, setLoading] = useState(false);

  const handleApprove = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.admin.approveResearchProject({
        id: data.content.id,
      });
      if (!res.data.success) {
        alert("Duyệt dự án không thành công!");
        return;
      }
      toast.success("Khóa học đã được duyệt thành công!");
      const responseData = await API.admin.getResearchProjectRequests();
      dispatch(setResearchProjectRequests(responseData.data.data));
      setShowConfirmDialog(null);
      onClose();
      const response = await API.admin.getLecturerAllProfile({
        id: lecturerInfo.id,
      });
      if (response.data.success) {
        dispatch(setLecturerProfileUpdate(response.data.data));
      }
    } catch (error) {
      console.error("Error approving:", error);
    } finally {
      setLoading(false);
    }
  }, [onClose]);

  const handleReject = useCallback(async () => {
    if (!adminNote.trim()) {
      alert("Vui lòng nhập ghi chú từ chối!");
      return;
    }
    setLoading(true);
    try {
      const res = await API.admin.rejectResearchProject({
        id: data.content.id,
        adminNote,
      });
      if (!res.data.success) {
        toast.error("Từ chối dự án không thành công!");
        return;
      }
      toast.success("Dự án đã bị từ chối thành công!");
      const responseData = await API.admin.getResearchProjectRequests();
      dispatch(setResearchProjectRequests(responseData.data.data));
      setShowConfirmDialog(null);
      setAdminNote("");
      onClose();
      const response = await API.admin.getLecturerAllProfile({
        id: lecturerInfo.id,
      });
      if (response.data.success) {
        dispatch(setLecturerProfileUpdate(response.data.data));
      }
    } catch (error) {
      console.error("Error rejecting:", error);
    } finally {
      setLoading(false);
    }
  }, [adminNote, onClose]);

  const handleCloseConfirmDialog = useCallback(() => {
    setShowConfirmDialog(null);
    setAdminNote("");
  }, []);

  if (!data) {
    return null;
  }

  const { content, lecturerInfo } = data;

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ bgcolor: "primary.main", width: 48, height: 48 }}>
              <SchoolIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Yêu cầu tạo mới dự án nghiên cứu
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                ID: {content.id}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} size="large">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ px: 4, py: 4, backgroundColor: "#f8fafc" }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 4,
              paddingTop: 2,
            }}
          >
            {/* Left Column */}
            <Stack spacing={3}>
              {/* Project Details */}
              <Card
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                  border: "1px solid rgba(255,255,255,0.8)",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, mb: 1, color: "#1e293b" }}
                  >
                    {content.title}
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}
                  >
                    <Chip
                      label={content.researchArea}
                      size="small"
                      sx={{
                        backgroundColor: "#e0f2fe",
                        color: "#0277bd",
                        fontWeight: 600,
                      }}
                    />
                    <Chip
                      label={getScale(content.scale)}
                      size="small"
                      sx={{
                        backgroundColor: "#e8f5e8",
                        color: "#2e7d32",
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.6 }}
                  >
                    {content.description || "Không có mô tả"}
                  </Typography>
                </CardContent>
              </Card>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                  border: "1px solid rgba(255,255,255,0.8)",
                  mb: 2,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, mb: 2, color: "#1e293b" }}
                  >
                    🔗 Liên kết dự án
                  </Typography>
                  <Button
                    variant="contained"
                    href={content.publishedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    fullWidth
                    sx={{
                      py: 1.5,
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      borderRadius: 2,
                      fontWeight: 600,
                      textTransform: "none",
                      boxShadow: "0 4px 20px rgba(102, 126, 234, 0.4)",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 25px rgba(102, 126, 234, 0.5)",
                      },
                    }}
                  >
                    Xem công bố dự án
                  </Button>
                </CardContent>
              </Card>
              {/* Lecturer Info */}
              <Card
                sx={{
                  borderRadius: 3,
                  background:
                    "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                  border: "1px solid rgba(99, 102, 241, 0.2)",
                  boxShadow: "0 4px 20px rgba(99, 102, 241, 0.1)",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, mb: 2, color: "#4f46e5" }}
                  >
                    Thông tin giảng viên
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <Avatar
                      src={lecturerInfo?.avatarUrl || ""}
                      sx={{
                        width: 80,
                        height: 80,
                        border: "3px solid white",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                      }}
                    >
                      {lecturerInfo?.fullName?.charAt(0) || ""}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, color: "#1e293b" }}
                      >
                        {lecturerInfo?.fullName}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#64748b", mb: 0.5 }}
                      >
                        📧 {lecturerInfo?.email}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#64748b" }}>
                        🎓 {lecturerInfo?.experienceYears} năm kinh nghiệm •{" "}
                        {lecturerInfo?.specialization}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Stack>

            {/* Right Column */}
            <Stack spacing={3}>
              {/* Project Metadata */}
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                  border: "1px solid rgba(255,255,255,0.8)",
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, mb: 3, color: "#1e293b" }}
                  >
                    📋 Thông tin chi tiết
                  </Typography>
                  <Stack spacing={3}>
                    {/* Liên kết dự án */}

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 2,
                        p: 2,
                        backgroundColor: "#f8fafc",
                        borderRadius: 2,
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#64748b",
                          fontWeight: 600,
                          textTransform: "uppercase",
                        }}
                      >
                        Loại
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: "#1e293b", mt: 0.5 }}
                      >
                        {getProjectType(content.projectType)}
                      </Typography>

                      <Typography
                        variant="caption"
                        sx={{
                          color: "#64748b",
                          fontWeight: 600,
                          textTransform: "uppercase",
                        }}
                      >
                        Vai trò
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: "#1e293b", mt: 0.5 }}
                      >
                        {content.roleInProject}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 2,
                        p: 2,
                        backgroundColor: "#f8fafc",
                        borderRadius: 2,
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#64748b",
                          fontWeight: 600,
                          textTransform: "uppercase",
                        }}
                      >
                        Kinh phí
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: "#1e293b", mt: 0.5 }}
                      >
                        {content.foundingAmount?.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#64748b",
                          fontWeight: 600,
                          textTransform: "uppercase",
                        }}
                      >
                        Nguồn kinh phí
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: "#1e293b", mt: 0.5 }}
                      >
                        {content.foundingSource}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        borderRadius: 3,
                        background:
                          "linear-gradient(135deg, #fef3c7 0%, #fcd34d 100%)",
                        boxShadow: "0 8px 32px rgba(252, 211, 77, 0.3)",
                        p: 3,
                        mb: 2,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, mb: 2, color: "#92400e" }}
                      >
                        📅 Thời gian dự án
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Box sx={{ textAlign: "center" }}>
                          <Typography
                            variant="caption"
                            sx={{ color: "#92400e", fontWeight: 600 }}
                          >
                            Bắt đầu
                          </Typography>
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 700, color: "#92400e" }}
                          >
                            {content.startDate
                              ? new Date(content.startDate).toLocaleDateString(
                                  "vi-VN",
                                  { timeZone: "UTC" },
                                )
                              : "Không xác định"}
                          </Typography>
                        </Box>
                        <Box sx={{ color: "#92400e", fontSize: "1.5rem" }}>
                          →
                        </Box>
                        <Box sx={{ textAlign: "center" }}>
                          <Typography
                            variant="caption"
                            sx={{ color: "#92400e", fontWeight: 600 }}
                          >
                            Kết thúc
                          </Typography>
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 700, color: "#92400e" }}
                          >
                            {content.endDate
                              ? new Date(content.endDate).toLocaleDateString(
                                  "vi-VN",
                                  { timeZone: "UTC" },
                                )
                              : "Không xác định"}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
              {/* Thông tin thời gian tạo/cập nhật */}
              <div style={{ marginTop: 24, textAlign: "right" }}>
                <Typography variant="body2" color="text.secondary">
                  Được tạo lúc:{" "}
                  {content.createdAt
                    ? new Date(content.createdAt).toLocaleString("vi-VN")
                    : "Chưa cập nhật"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Cập nhật lần cuối:{" "}
                  {content.updatedAt
                    ? new Date(content.updatedAt).toLocaleString("vi-VN")
                    : "Chưa cập nhật"}
                </Typography>
              </div>
            </Stack>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            px: 4,
            py: 3,
            backgroundColor: "#f8fafc",
            borderTop: "1px solid #e2e8f0",
            gap: 2,
          }}
        >
          <Button
            onClick={() => setShowConfirmDialog("reject")}
            variant="contained"
            sx={{
              minWidth: 120,
              py: 1.5,
              backgroundColor: "#dc2626",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: 2,
              boxShadow: "0 4px 20px rgba(220, 38, 38, 0.3)",
              "&:hover": {
                backgroundColor: "#b91c1c",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 25px rgba(220, 38, 38, 0.4)",
              },
            }}
          >
            Từ chối
          </Button>
          <Button
            onClick={() => setShowConfirmDialog("approve")}
            variant="contained"
            sx={{
              minWidth: 120,
              py: 1.5,
              backgroundColor: "#059669",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: 2,
              boxShadow: "0 4px 20px rgba(5, 150, 105, 0.3)",
              "&:hover": {
                backgroundColor: "#047857",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 25px rgba(5, 150, 105, 0.4)",
              },
            }}
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
              ? "Xác nhận duyệt dự án"
              : "Xác nhận từ chối dự án"
          }
          message={
            showConfirmDialog === "approve"
              ? `Bạn có chắc chắn muốn duyệt dự án "${content.title}"?`
              : `Bạn có chắc chắn muốn từ chối dự án "${content.title}"?`
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

export default ApproveResearchProjectCreateDialog;
