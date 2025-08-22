import React, { useState, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Avatar,
  Card,
  CardContent,
  Chip,
  Stack,
  TextField,
} from "@mui/material";
import { School as SchoolIcon, Close as CloseIcon } from "@mui/icons-material";
import { API } from "../utils/Fetch";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setLecturerRequests } from "../redux/slice/LecturerRquestSlice";

interface ResearchProjectCreateDialogProps {
  open: boolean;
  data: any;
  onClose: () => void;
}

const ResearchProjectCreateDialog: React.FC<
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
      const responseData = await API.admin.getLecturerRequests();
      dispatch(setLecturerRequests(responseData.data.data));
      setShowConfirmDialog(null);
      onClose();
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
      const responseData = await API.admin.getLecturerRequests();
      dispatch(setLecturerRequests(responseData.data.data));
      setShowConfirmDialog(null);
      setAdminNote("");
      onClose();
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
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 2,
            pt: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                color: "white",
                width: 48,
                height: 48,
              }}
            >
              <SchoolIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Chi tiết dự án nghiên cứu
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {content.title}
              </Typography>
            </Box>
          </Box>
          <Button onClick={onClose} size="large" sx={{ color: "white" }}>
            <CloseIcon />
          </Button>
        </DialogTitle>

        <DialogContent sx={{ px: 4, py: 4, backgroundColor: "#f8fafc" }}>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
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
                      label={content.scale}
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
                  <Stack spacing={2.5}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: "#64748b", fontWeight: 600 }}
                      >
                        Loại dự án:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: "#1e293b" }}
                      >
                        {content.projectType}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: "#64748b", fontWeight: 600 }}
                      >
                        Vai trò:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: "#1e293b" }}
                      >
                        {content.roleInProject}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: "#64748b", fontWeight: 600 }}
                      >
                        Thời gian:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: "#1e293b" }}
                      >
                        {content.startDate} - {content.endDate}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: "#64748b", fontWeight: 600 }}
                      >
                        Kinh phí:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: "#1e293b" }}
                      >
                        {content.foundingAmount.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: "#64748b", fontWeight: 600 }}
                      >
                        Nguồn kinh phí:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: "#1e293b" }}
                      >
                        {content.foundingSource}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: "#64748b", fontWeight: 600 }}
                      >
                        Liên kết:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: "#1e293b",
                          textDecoration: "underline",
                        }}
                        component="a"
                        href={content.publishedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Xem tại đây
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
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
        <Dialog
          open={true}
          onClose={handleCloseConfirmDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {showConfirmDialog === "approve"
              ? "Xác nhận duyệt dự án"
              : "Xác nhận từ chối dự án"}
          </DialogTitle>
          <DialogContent>
            {showConfirmDialog === "approve" ? (
              <Typography>
                Bạn có chắc chắn muốn duyệt dự án "{content.title}"?
              </Typography>
            ) : (
              <>
                <Typography>
                  Bạn có chắc chắn muốn từ chối dự án "{content.title}"?
                </Typography>
                <TextField
                  label="Lý do từ chối *"
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  fullWidth
                  multiline
                  rows={3}
                  variant="outlined"
                  placeholder="Nhập lý do từ chối dự án này..."
                  required
                  sx={{ mt: 2 }}
                />
              </>
            )}
          </DialogContent>
          <DialogActions>
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

export default ResearchProjectCreateDialog;
