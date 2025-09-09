import BusinessIcon from "@mui/icons-material/Business";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import DescriptionIcon from "@mui/icons-material/Description";
import PersonIcon from "@mui/icons-material/Person";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setInstitutionPendingCreate } from "../../../redux/slice/InstitutionPendingCreateSlice";
import { setInstitutions } from "../../../redux/slice/InstitutionSlice";
import {
  formatDateToVietnamTime,
  getInstitutionTypeText,
} from "../../../utils/ChangeText";
import { API } from "../../../utils/Fetch";
import ConfirmDialog from "../../general-dialog/ConfirmDialog";

interface InstitutionDetailDialogProps {
  open: boolean;
  onClose: () => void;
  institution: any;
}

const ApproveInstitutionCreateDialog = ({
  open,
  onClose,
  institution,
}: InstitutionDetailDialogProps) => {
  const dispatch = useDispatch();
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    type: "approve" as "approve" | "reject",
    title: "",
    message: "",
  });
  const [adminNote, setAdminNote] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!open) return null;

  const handleApprove = () => {
    setConfirmDialog({
      open: true,
      type: "approve",
      title: "Xác nhận duyệt cơ sở",
      message: "Bạn có chắc chắn muốn duyệt cơ sở này?",
    });
  };

  const handleReject = () => {
    setConfirmDialog({
      open: true,
      type: "reject",
      title: "Xác nhận từ chối cơ sở",
      message: "Bạn có chắc chắn muốn từ chối cơ sở này?",
    });
  };

  const handleConfirmAction = async () => {
    if (confirmDialog.type === "reject" && !adminNote.trim()) {
      toast.error("Vui lòng nhập lý do từ chối.");
      return;
    }
    setIsProcessing(true);
    try {
      let sendMailData: { to: string; subject: string; body: string } | null =
        null;
      if (confirmDialog.type === "approve") {
        await API.admin.approveInstitution({ id: institution.id });
        const response = await API.admin.getInstitutionPendingCreate();
        dispatch(setInstitutionPendingCreate(response.data.data));
        const res = await API.admin.getAllInstitutions();
        dispatch(setInstitutions(res.data.data));
        toast.success("Yêu cầu đã được duyệt thành công!");

        // Chuẩn bị gửi email duyệt
        if (institution.email) {
          // Tự động chọn "Quý trường" hoặc "Quý trung tâm"
          const recipient =
            institution.institutionType === "UNIVERSITY"
              ? "Quý trường"
              : institution.institutionType === "TRAINING_CENTER"
                ? "Quý trung tâm"
                : "Quý đơn vị";
          sendMailData = {
            to: institution.email,
            subject: "Hồ sơ Cơ sở Giáo dục đã được duyệt",
            body: `
            <div style="font-family: Arial, sans-serif; background: #f6f8fa; padding: 32px;">
              <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 32px;">
                <h2 style="color: #2563eb; margin-bottom: 16px;">${recipient} đã được duyệt!</h2>
                <p style="font-size: 16px; color: #333;">
                  Xin chào <strong>${institution.representativeName || ""}</strong>,<br/><br/>
                  Hồ sơ đăng ký của ${recipient.toLowerCase()} trên hệ thống <strong>EduHubVN</strong> đã được duyệt.<br/>
                  Quý vị có thể truy cập hệ thống và sử dụng các chức năng dành cho Cơ sở Giáo dục.<br/><br/>
                  <b>Thông tin cơ sở:</b><br/>
                  - Tên cơ sở: ${institution.institutionName || ""}<br/>
                  - Mã số kinh doanh: ${institution.businessRegistrationNumber || ""}<br/>
                  - Năm thành lập: ${institution.establishedYear || ""}<br/>
                  - Loại cơ sở: ${institution.institutionType || ""}<br/>
                  - Người đại diện: ${institution.representativeName || ""} (${institution.position || ""})<br/>
                  - Số điện thoại: ${institution.phoneNumber || ""}<br/>
                  - Email liên hệ: ${institution.email}<br/>
                  - Website: ${institution.website || ""}<br/>
                  - Địa chỉ: ${institution.address || ""}<br/>
                  <br/>
                  Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ qua email: <a href="mailto:support@eduhubvn.com">support@eduhubvn.com</a>.<br/><br/>
                  Trân trọng,<br/>
                  <span style="color: #2563eb; font-weight: bold;">EduHubVN Team</span>
                </p>
                <hr style="margin: 32px 0; border: none; border-top: 1px solid #eee;" />
                <div style="font-size: 13px; color: #888;">
                  Đây là email tự động, vui lòng không trả lời trực tiếp email này.
                </div>
              </div>
            </div>
          `,
          };
        }
      } else if (confirmDialog.type === "reject") {
        await API.admin.rejectInstitution({ id: institution.id, adminNote });
        const response = await API.admin.getInstitutionPendingCreate();
        dispatch(setInstitutionPendingCreate(response.data.data));
        const res = await API.admin.getAllInstitutions();
        dispatch(setInstitutions(res.data.data));
        toast.success("Yêu cầu đã được từ chối thành công!");

        // Chuẩn bị gửi email từ chối
        if (institution.email) {
          const recipient =
            institution.institutionType === "UNIVERSITY"
              ? "Quý trường"
              : institution.institutionType === "TRAINING_CENTER"
                ? "Quý trung tâm"
                : "Quý đơn vị";
          sendMailData = {
            to: institution.email,
            subject: "Hồ sơ Cơ sở Giáo dục bị từ chối",
            body: `
            <div style="font-family: Arial, sans-serif; background: #f6f8fa; padding: 32px;">
              <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 32px;">
                <h2 style="color: #e53935; margin-bottom: 16px;">Hồ sơ của ${recipient.toLowerCase()} đã bị từ chối</h2>
                <p style="font-size: 16px; color: #333;">
                  Xin chào <strong>${institution.representativeName || ""}</strong>,<br/><br/>
                  Rất tiếc! Hồ sơ đăng ký của ${recipient.toLowerCase()} trên hệ thống <strong>EduHubVN</strong> đã bị từ chối.<br/>
                  <b>Lý do từ chối:</b><br/>
                  <span style="color: #e53935;">${adminNote || "Không có lý do cụ thể."}</span><br/><br/>
                  Nếu bạn cần hỗ trợ, vui lòng liên hệ qua email: <a href="mailto:support@eduhubvn.com">support@eduhubvn.com</a>.<br/><br/>
                  Trân trọng,<br/>
                  <span style="color: #2563eb; font-weight: bold;">EduHubVN Team</span>
                </p>
                <hr style="margin: 32px 0; border: none; border-top: 1px solid #eee;" />
                <div style="font-size: 13px; color: #888;">
                  Đây là email tự động, vui lòng không trả lời trực tiếp email này.
                </div>
              </div>
            </div>
          `,
          };
        }
      }
      setConfirmDialog({ open: false, type: "approve", title: "", message: "" });
      setAdminNote("");
      onClose();

      // Gửi email sau khi xử lý xong, không chặn giao diện
      if (sendMailData) {
        setTimeout(() => {
          API.other.sendEmail(sendMailData);
        }, 0);
      }
    } catch (error) {
      console.error("Error updating institution status:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    }
    setIsProcessing(false);
  };

  const handleCancelConfirm = () => {
    setConfirmDialog({ open: false, type: "approve", title: "", message: "" });
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
                Yêu cầu tạo mới hồ sơ cơ sở giáo dục
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
                        {getInstitutionTypeText(institution.institutionType)}
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
            color="error"
            onClick={handleReject}
            startIcon={<CancelIcon />}
          >
            Từ chối
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleApprove}
            startIcon={<CheckCircleIcon />}
          >
            Duyệt
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        type={confirmDialog.type}
        title={confirmDialog.title}
        message={confirmDialog.message}
        loading={isProcessing}
        rejectNote={adminNote}
        onRejectNoteChange={setAdminNote}
        rejectNoteRequired={confirmDialog.type === "reject"}
        onClose={handleCancelConfirm}
        onConfirm={handleConfirmAction}
      />
    </>
  );
};

export default ApproveInstitutionCreateDialog;
