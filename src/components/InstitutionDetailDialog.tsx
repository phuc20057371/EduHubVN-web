import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import BusinessIcon from "@mui/icons-material/Business";
import DescriptionIcon from "@mui/icons-material/Description";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { API } from "../utils/Fetch";
import TextField from "@mui/material/TextField";
import { setInstitutionPendingCreate } from "../redux/slice/InstitutionPendingCreateSlice";
import { formatDateToVietnamTime } from "../utils/ChangeText";
import { setInstitutions } from "../redux/slice/InstitutionSlice";

interface InstitutionDetailDialogProps {
  open: boolean;
  onClose: () => void;
  institution: any;
}

const InstitutionDetailDialog = ({
  open,
  onClose,
  institution,
}: InstitutionDetailDialogProps) => {
  const dispatch = useDispatch();
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    action: "",
    title: "",
    message: "",
  });
  const [adminNote, setAdminNote] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!open) return null;

  const handleApprove = () => {
    setConfirmDialog({
      open: true,
      action: "approve",
      title: "Xác nhận duyệt cơ sở",
      message: "Bạn có chắc chắn muốn duyệt cơ sở này?",
    });
  };

  const handleReject = () => {
    setConfirmDialog({
      open: true,
      action: "reject",
      title: "Xác nhận từ chối cơ sở",
      message: "Bạn có chắc chắn muốn từ chối cơ sở này?",
    });
  };

  const handleConfirmAction = async () => {
    if (confirmDialog.action === "reject" && !adminNote.trim()) {
      toast.error("Vui lòng nhập lý do từ chối.");
      return;
    }
    setIsProcessing(true);
    try {
      if (confirmDialog.action === "approve") {
        await API.admin.approveInstitution({ id: institution.id });
        const response = await API.admin.getInstitutionPendingCreate();
        dispatch(setInstitutionPendingCreate(response.data.data));
        const res = await API.admin.getAllInstitutions();
        dispatch(setInstitutions(res.data.data));
        toast.success("Yêu cầu đã được duyệt thành công!");
      } else if (confirmDialog.action === "reject") {
        await API.admin.rejectInstitution({ id: institution.id, adminNote });
        const response = await API.admin.getInstitutionPendingCreate();
        dispatch(setInstitutionPendingCreate(response.data.data));
        const res = await API.admin.getAllInstitutions();
        dispatch(setInstitutions(res.data.data));
        toast.success("Yêu cầu đã được từ chối thành công!");
      }
      setConfirmDialog({ open: false, action: "", title: "", message: "" });
      setAdminNote("");
      onClose();
    } catch (error) {
      console.error("Error updating institution status:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    }
    setIsProcessing(false);
  };

  const handleCancelConfirm = () => {
    setConfirmDialog({ open: false, action: "", title: "", message: "" });
    setAdminNote("");
  };

  // Trạng thái hiển thị
  const statusLabel =
    institution.status === "approved"
      ? "Đã duyệt"
      : institution.status === "rejected"
        ? "Đã từ chối"
        : "Chờ duyệt";
  const statusColor =
    institution.status === "approved"
      ? "rgba(76, 175, 80, 0.9)"
      : institution.status === "rejected"
        ? "rgba(244, 67, 54, 0.9)"
        : "rgba(255, 193, 7, 0.9)";

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: "primary.main", width: 48, height: 48 }}>
              <BusinessIcon />
            </Avatar>
            <Box>
              <Typography variant="h5" component="div">
                {institution.institutionName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Chi tiết cơ sở
              </Typography>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  ID: {institution.id}
                </Typography>
              </Box>
            </Box>
          </Box>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "primary.main",
              background: "rgba(240,240,240,0.8)",
              "&:hover": {
                bgcolor: "primary.light",
                color: "white",
              },
              transition: "all 0.2s",
            }}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={3}>
            {/* Status Card */}
            <Card
              elevation={0}
              sx={{
                background: "linear-gradient(135deg, #1976d2 0%, #43cea2 100%)",
                color: "white",
                borderRadius: 2,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={2}
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar
                      sx={{
                        bgcolor: "rgba(255,255,255,0.2)",
                        width: 48,
                        height: 48,
                      }}
                    >
                      <BusinessIcon sx={{ color: "white", fontSize: 24 }} />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={600} color="white">
                        Trạng thái duyệt cơ sở
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "rgba(255,255,255,0.8)" }}
                      >
                        Quản lý phê duyệt cơ sở
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label={statusLabel}
                    sx={{
                      bgcolor: statusColor,
                      color: "white",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      px: 2,
                      py: 1,
                    }}
                  />
                </Box>
                {institution.status === "pending" && (
                  <Box display="flex" alignItems="center" gap={2}>
                    <Button
                      variant="contained"
                      sx={{
                        bgcolor: "rgba(76, 175, 80, 0.9)",
                        color: "white",
                        fontWeight: 600,
                        px: 3,
                        py: 1,
                        borderRadius: 2,
                        "&:hover": {
                          bgcolor: "rgba(76, 175, 80, 1)",
                          transform: "translateY(-2px)",
                          boxShadow: "0 8px 20px rgba(76, 175, 80, 0.3)",
                        },
                        transition: "all 0.3s ease",
                      }}
                      onClick={handleApprove}
                      startIcon={<CheckCircleIcon />}
                    >
                      Duyệt
                    </Button>
                    <Button
                      variant="contained"
                      sx={{
                        bgcolor: "rgba(244, 67, 54, 0.9)",
                        color: "white",
                        fontWeight: 600,
                        px: 3,
                        py: 1,
                        borderRadius: 2,
                        "&:hover": {
                          bgcolor: "rgba(244, 67, 54, 1)",
                          transform: "translateY(-2px)",
                          boxShadow: "0 8px 20px rgba(244, 67, 54, 0.3)",
                        },
                        transition: "all 0.3s ease",
                      }}
                      onClick={handleReject}
                      startIcon={<CancelIcon />}
                    >
                      Từ chối
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Info Cards Row */}
            <Box display="flex" flexDirection="row" gap={3}>
              {/* Organization Info Card */}
              <Card elevation={1} sx={{ flex: 1 }}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: "info.main" }}>
                      <BusinessIcon />
                    </Avatar>
                  }
                  title="Thông tin cơ sở"
                />
                <CardContent>
                  <Box display="flex" flexDirection="column" gap={1.5}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Tên cơ sở:
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {institution.institutionName}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Loại:
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {institution.institutionType}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Số ĐKKD:
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {institution.businessRegistrationNumber}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Năm thành lập:
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {institution.establishedYear}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Địa chỉ:
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight={500}
                        sx={{ textAlign: "right", maxWidth: "60%" }}
                      >
                        {institution.address}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        SĐT:
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {institution.phoneNumber}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Website:
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight={500}
                        sx={{
                          color: "primary.main",
                          textDecoration: "underline",
                          cursor: "pointer",
                          maxWidth: "60%",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        onClick={() =>
                          institution.website &&
                          window.open(institution.website)
                        }
                      >
                        {institution.website}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Right side: 2 cards stacked vertically */}
              <Box display="flex" flexDirection="column" gap={3} flex={1}>
                {/* Representative Info Card */}
                <Card elevation={1}>
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: "success.main" }}>
                        <PersonIcon />
                      </Avatar>
                    }
                    title="Người đại diện"
                  />
                  <CardContent>
                    <Box display="flex" flexDirection="column" gap={1.5}>
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          Tên:
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {institution.representativeName}
                        </Typography>
                      </Box>
                      <Divider />
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          Chức vụ:
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {institution.position}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>

                {/* Description Card */}
                <Card elevation={1}>
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: "secondary.main" }}>
                        <DescriptionIcon />
                      </Avatar>
                    }
                    title="Mô tả cơ sở"
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {institution.description || "Không có mô tả"}
                    </Typography>
                  </CardContent>
                </Card>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Thời gian cập nhật:{" "}
                    {formatDateToVietnamTime(institution.updatedAt) ||
                      "Không có mô tả"}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="success"
            onClick={handleApprove}
            startIcon={<CheckCircleIcon />}
          >
            Duyệt
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleReject}
            startIcon={<CancelIcon />}
          >
            Từ chối
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={handleCancelConfirm}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            bgcolor:
              confirmDialog.action === "approve"
                ? "primary.main"
                : "error.main",
            color: "white",
            fontWeight: "bold",
          }}
        >
          {confirmDialog.title}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {confirmDialog.message}
          </Typography>
          {confirmDialog.action === "reject" && (
            <TextField
              label="Lý do từ chối (bắt buộc)"
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              required
              error={!adminNote.trim()}
              helperText={
                !adminNote.trim() ? "Vui lòng nhập lý do từ chối" : ""
              }
            />
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={handleConfirmAction}
            variant="contained"
            disabled={
              isProcessing ||
              (confirmDialog.action === "reject" && !adminNote.trim())
            }
            sx={{
              bgcolor:
                confirmDialog.action === "approve"
                  ? "success.main"
                  : "error.main",
              "&:hover": {
                bgcolor:
                  confirmDialog.action === "approve"
                    ? "success.dark"
                    : "error.dark",
              },
              textTransform: "none",
              fontWeight: "bold",
              borderRadius: 2,
            }}
          >
            {isProcessing
              ? "Đang xử lý..."
              : confirmDialog.action === "approve"
                ? "Xác nhận duyệt"
                : "Xác nhận từ chối"}
          </Button>
          <Button
            onClick={handleCancelConfirm}
            variant="outlined"
            disabled={isProcessing}
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              borderRadius: 2,
            }}
          >
            Hủy
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InstitutionDetailDialog;
