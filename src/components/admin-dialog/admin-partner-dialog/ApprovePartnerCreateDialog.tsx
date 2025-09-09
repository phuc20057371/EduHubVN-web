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
import { API } from "../../../utils/Fetch";
import { TextField } from "@mui/material";
import { setPartnerPendingCreate } from "../../../redux/slice/PartnerPendingCreateSlice";
import { setPartner } from "../../../redux/slice/PartnerSlice";

interface PartnerDetailDialogProps {
  open: boolean;
  onClose: () => void;
  partner: any;
}

const ApprovePartnerCreateDialog = ({
  open,
  onClose,
  partner,
}: PartnerDetailDialogProps) => {
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
      title: "Xác nhận duyệt đối tác",
      message: "Bạn có chắc chắn muốn duyệt đối tác này?",
    });
  };

  const handleReject = () => {
    setConfirmDialog({
      open: true,
      action: "reject",
      title: "Xác nhận từ chối đối tác",
      message: "Bạn có chắc chắn muốn từ chối đối tác này?",
    });
  };

  const handleConfirmAction = async () => {
    if (confirmDialog.action === "reject" && !adminNote.trim()) {
      toast.error("Vui lòng nhập lý do từ chối");
      return;
    }

    setIsProcessing(true);
    try {
      let sendMailData: { to: string; subject: string; body: string } | null =
        null;
      if (confirmDialog.action === "approve") {
        const response = await API.admin.approvePartner({ id: partner.id });
        if (response.data.success) {
          toast.success("Đối tác đã được duyệt thành công");
        }
        const responseData = await API.admin.getPartnerPendingCreate();
        dispatch(setPartnerPendingCreate(responseData.data.data));
        const res = await API.admin.getAllPartners();
        dispatch(setPartner(res.data.data));

        // Chuẩn bị gửi email duyệt
        if (partner.email) {
          sendMailData = {
            to: partner.email,
            subject: "Hồ sơ Đối tác đã được duyệt",
            body: `
            <div style="font-family: Arial, sans-serif; background: #f6f8fa; padding: 32px;">
              <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 32px;">
                <h2 style="color: #3f51b5; margin-bottom: 16px;">Chúc mừng tổ chức của bạn đã được duyệt!</h2>
                <p style="font-size: 16px; color: #333;">
                  Xin chào <strong>${partner.representativeName || ""}</strong>,<br/><br/>
                  Hồ sơ đăng ký của tổ chức <strong>${partner.organizationName || ""}</strong> trên hệ thống <strong>EduHubVN</strong> đã được duyệt.<br/>
                  Quý vị có thể truy cập hệ thống và sử dụng các chức năng dành cho Đối tác.<br/><br/>
                  <b>Thông tin tổ chức:</b><br/>
                  - Tên tổ chức: ${partner.organizationName || ""}<br/>
                  - Mã số kinh doanh: ${partner.businessRegistrationNumber || ""}<br/>
                  - Năm thành lập: ${partner.establishedYear || ""}<br/>
                  - Ngành nghề: ${partner.industry || ""}<br/>
                  - Người đại diện: ${partner.representativeName || ""} (${partner.position || ""})<br/>
                  - Số điện thoại: ${partner.phoneNumber || ""}<br/>
                  - Email liên hệ: ${partner.email}<br/>
                  - Website: ${partner.website || ""}<br/>
                  - Địa chỉ: ${partner.address || ""}<br/>
                  <br/>
                  Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ qua email: <a href="mailto:support@eduhubvn.com">support@eduhubvn.com</a>.<br/><br/>
                  Trân trọng,<br/>
                  <span style="color: #3f51b5; font-weight: bold;">EduHubVN Team</span>
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
      } else if (confirmDialog.action === "reject") {
        const response = await API.admin.rejectPartner({
          id: partner.id,
          adminNote,
        });
        if (response.data.success) {
          toast.success("Đối tác đã bị từ chối thành công");
        }
        const responseData = await API.admin.getPartnerPendingCreate();
        dispatch(setPartnerPendingCreate(responseData.data.data));
        const res = await API.admin.getAllPartners();
        dispatch(setPartner(res.data.data));

        // Chuẩn bị gửi email từ chối
        if (partner.email) {
          sendMailData = {
            to: partner.email,
            subject: "Hồ sơ Đối tác bị từ chối",
            body: `
            <div style="font-family: Arial, sans-serif; background: #f6f8fa; padding: 32px;">
              <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 32px;">
                <h2 style="color: #e53935; margin-bottom: 16px;">Hồ sơ của tổ chức đã bị từ chối</h2>
                <p style="font-size: 16px; color: #333;">
                  Xin chào <strong>${partner.representativeName || ""}</strong>,<br/><br/>
                  Rất tiếc! Hồ sơ đăng ký của tổ chức <strong>${partner.organizationName || ""}</strong> trên hệ thống <strong>EduHubVN</strong> đã bị từ chối.<br/>
                  <b>Lý do từ chối:</b><br/>
                  <span style="color: #e53935;">${adminNote || "Không có lý do cụ thể."}</span><br/><br/>
                  Nếu bạn cần hỗ trợ, vui lòng liên hệ qua email: <a href="mailto:support@eduhubvn.com">support@eduhubvn.com</a>.<br/><br/>
                  Trân trọng,<br/>
                  <span style="color: #3f51b5; font-weight: bold;">EduHubVN Team</span>
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

      setConfirmDialog({ open: false, action: "", title: "", message: "" });
      setAdminNote("");
      onClose();

      // Gửi email sau khi xử lý xong, không chặn giao diện
      if (sendMailData) {
        setTimeout(() => {
          API.other.sendEmail(sendMailData);
        }, 0);
      }
    } catch (error) {
      console.error("Error updating partner status:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    }
    setIsProcessing(false);
  };

  const handleCancelConfirm = () => {
    setConfirmDialog({ open: false, action: "", title: "", message: "" });
    setAdminNote("");
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              src={partner.logoUrl || ""}
              sx={{ bgcolor: "primary.main", width: 48, height: 48 }}
            >
              <BusinessIcon />
            </Avatar>
            <Box>
              <Typography variant="h5" component="div">
                Yêu cầu tạo mới đối tác
              </Typography>
              <Typography variant="body2" color="text.secondary"></Typography>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  ID: {partner.id}
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
            {/* Partner Status Card */}
            <Card
              elevation={0}
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
                        Trạng thái duyệt đối tác
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "rgba(255,255,255,0.8)" }}
                      >
                        Quản lý phê duyệt đối tác
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label={
                      partner.status === "approved"
                        ? "Đã duyệt"
                        : partner.status === "rejected"
                          ? "Đã từ chối"
                          : "Chờ duyệt"
                    }
                    sx={{
                      bgcolor:
                        partner.status === "approved"
                          ? "rgba(76, 175, 80, 0.9)"
                          : partner.status === "rejected"
                            ? "rgba(244, 67, 54, 0.9)"
                            : "rgba(255, 193, 7, 0.9)",
                      color: "white",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      px: 2,
                      py: 1,
                    }}
                  />
                </Box>

                {partner.status === "pending" && (
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
                    >
                      ✓ Duyệt
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
                    >
                      ✕ Từ chối
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Organization and Representative Info Cards Row */}
            <Box display="flex" flexDirection="row" gap={3}>
              {/* Organization Info Card */}
              <Card elevation={1} sx={{ flex: 1 }}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: "info.main" }}>
                      <BusinessIcon />
                    </Avatar>
                  }
                  title="Thông tin tổ chức"
                />
                <CardContent>
                  <Box display="flex" flexDirection="column" gap={1.5}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Tên tổ chức:
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {partner.organizationName}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Ngành nghề:
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {partner.industry}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Số ĐKKD:
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {partner.businessRegistrationNumber}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Năm thành lập:
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {partner.establishedYear}
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
                        {partner.address}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        SĐT:
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {partner.phoneNumber}
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
                          partner.website && window.open(partner.website)
                        }
                      >
                        {partner.website}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Right side: 3 cards stacked vertically */}
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
                          {partner.representativeName}
                        </Typography>
                      </Box>
                      <Divider />
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          Chức vụ:
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {partner.position}
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
                    title="Mô tả tổ chức"
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {partner.description || "Không có mô tả"}
                    </Typography>
                  </CardContent>
                </Card>
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Được tạo lúc :{" "}
                    {partner.createdAt
                      ? new Date(partner.createdAt).toLocaleString("vi-VN")
                      : "Chưa cập nhật"}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Cập nhật lúc{" "}
                    {partner.updatedAt
                      ? new Date(partner.updatedAt).toLocaleString("vi-VN")
                      : "Chưa cập nhật"}
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
            bgcolor: "primary.main",
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

export default ApprovePartnerCreateDialog;
