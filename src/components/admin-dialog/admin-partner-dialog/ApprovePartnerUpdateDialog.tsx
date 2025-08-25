import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { API } from "../../../utils/Fetch";
import { useDispatch } from "react-redux";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { toast } from "react-toastify";
import { setPartner } from "../../../redux/slice/PartnerSlice";
import { setPartnerPendingUpdate } from "../../../redux/slice/PartnerPendingUpdateSlice";

interface PartnerDetailUpdateDialogProps {
  open: boolean;
  onClose: () => void;
  oldData: any;
  newData: any;
}

const fieldGroups = [
  {
    title: "Thông tin tổ chức",
    icon: <BusinessIcon />,
    fields: [
      { label: "Tên tổ chức", key: "organizationName" },
      { label: "Ngành nghề", key: "industry" },
      { label: "Số ĐKKD", key: "businessRegistrationNumber" },
      { label: "Năm thành lập", key: "establishedYear" },
      { label: "Địa chỉ", key: "address" },
      { label: "Số điện thoại", key: "phoneNumber" },
      {
        label: "Website",
        key: "website",
        render: (v: any) =>
          v ? (
            <a
              href={v}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#1976d2", textDecoration: "underline" }}
            >
              {v}
            </a>
          ) : (
            "-"
          ),
      },
      { label: "Mô tả", key: "description" },
    ],
  },
  {
    title: "Người đại diện",
    icon: <PersonIcon />,
    fields: [
      { label: "Họ và tên", key: "representativeName" },
      { label: "Chức vụ", key: "position" },
    ],
  },
];

const ApprovePartnerUpdateDialog = ({
  open,
  onClose,
  oldData,
  newData,
}: PartnerDetailUpdateDialogProps) => {
  const [confirmType, setConfirmType] = useState<null | "approve" | "reject">(
    null,
  );
  const [adminNote, setAdminNote] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const dispatch = useDispatch();

  if (!open) return null;

  const handleConfirm = async (type: "approve" | "reject") => {
    if (type === "reject" && !adminNote.trim()) {
      toast.error("Vui lòng nhập lý do từ chối");
      return;
    }

    setIsProcessing(true);
    try {
      if (type === "approve") {
        const response = await API.admin.approvePartnerUpdate({
          id: newData?.id,
        });
        if (response.data.success) {
          toast.success("Cập nhật đối tác đã được duyệt thành công");
        }
        const res = await API.admin.getAllPartners();
        dispatch(setPartner(res.data.data));
        const updateResponse = await API.admin.getPartnerPendingUpdate();
        dispatch(setPartnerPendingUpdate(updateResponse.data.data));
      } else if (type === "reject") {
        const response = await API.admin.rejectPartnerUpdate({
          id: newData?.id,
          adminNote,
        });
        if (response.data.success) {
          toast.success("Cập nhật đối tác đã bị từ chối");
        }
        const res = await API.admin.getAllPartners();
        dispatch(setPartner(res.data.data));
        const updateResponse = await API.admin.getPartnerPendingUpdate();
        dispatch(setPartnerPendingUpdate(updateResponse.data.data));
      }
      setConfirmType(null);
      setAdminNote("");
      if (typeof onClose === "function") onClose();
    } catch (error) {
      console.error("Error processing partner update:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    }
    setIsProcessing(false);
  };

  const handleCancelConfirm = () => {
    setConfirmType(null);
    setAdminNote("");
  };

  const renderFieldValue = (field: any, value: any) => {
    if (field.render) {
      return field.render(value);
    }
    return value ?? "-";
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              src={newData?.logoUrl || oldData?.logoUrl || ""}
              sx={{ bgcolor: "primary.main", width: 48, height: 48 }}
            >
              <BusinessIcon />
            </Avatar>
            <Box flex={1}>
              <Typography variant="h5" component="div">
                So sánh thông tin cập nhật
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {oldData?.organizationName || newData?.organizationName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ID: {oldData?.id || newData?.id}
              </Typography>
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
          {/* Status Card */}
          <Card
            elevation={0}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              borderRadius: 2,
              mb: 3,
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
                    <CompareArrowsIcon sx={{ color: "white", fontSize: 24 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight={600} color="white">
                      Xét duyệt cập nhật thông tin đối tác
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "rgba(255,255,255,0.8)" }}
                    >
                      So sánh và quyết định phê duyệt
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label="Chờ duyệt"
                  sx={{
                    bgcolor: "rgba(255, 193, 7, 0.9)",
                    color: "white",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    px: 2,
                    py: 1,
                  }}
                />
              </Box>
            </CardContent>
          </Card>

          {/* Comparison Content */}
          {fieldGroups.map((group) => (
            <Card key={group.title} elevation={1} sx={{ mb: 3 }}>
              <CardHeader
                avatar={
                  <Avatar
                    sx={{ bgcolor: "primary.main", width: 32, height: 32 }}
                  >
                    {group.icon}
                  </Avatar>
                }
                title={group.title}
                sx={{ pb: 1 }}
              />
              <CardContent sx={{ pt: 0, p: 0 }}>
                {/* Header row */}
                <Box display="flex" sx={{ borderBottom: "2px solid #e0e0e0" }}>
                  <Box flex={1} sx={{ borderRight: "1px solid #e0e0e0" }}>
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={1}
                      py={2}
                      px={3}
                      sx={{ bgcolor: "#f5f5f5" }}
                    >
                      <Avatar
                        sx={{ bgcolor: "info.main", width: 24, height: 24 }}
                      >
                        📋
                      </Avatar>
                      <Typography variant="subtitle1" fontWeight={600}>
                        Thông tin hiện tại
                      </Typography>
                    </Box>
                  </Box>
                  <Box flex={1}>
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={1}
                      py={2}
                      px={3}
                      sx={{ bgcolor: "#f5f5f5" }}
                    >
                      <Avatar
                        sx={{ bgcolor: "warning.main", width: 24, height: 24 }}
                      >
                        ✏️
                      </Avatar>
                      <Typography variant="subtitle1" fontWeight={600}>
                        Thông tin cập nhật
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Field rows */}
                {group.fields.map((field, index) => {
                  const oldVal = oldData?.[field.key];
                  const newVal = newData?.[field.key];
                  const hasChanged = oldVal !== newVal;

                  return (
                    <Box key={field.key}>
                      <Box display="flex" minHeight={60}>
                        {/* Current Data */}
                        <Box flex={1} sx={{ borderRight: "1px solid #e0e0e0" }}>
                          <Box
                            display="flex"
                            flexDirection="column"
                            py={2}
                            px={3}
                            height="100%"
                          >
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontWeight: 500, mb: 1 }}
                            >
                              {field.label}:
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                wordBreak: "break-word",
                                fontWeight: 500,
                                flex: 1,
                              }}
                            >
                              {renderFieldValue(field, oldVal)}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Updated Data */}
                        <Box flex={1}>
                          <Box
                            display="flex"
                            flexDirection="column"
                            py={2}
                            px={3}
                            height="100%"
                          >
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontWeight: 500, mb: 1 }}
                            >
                              {field.label}:
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                wordBreak: "break-word",
                                fontWeight: 500,
                                flex: 1,
                                ...(hasChanged
                                  ? {
                                      backgroundColor: "#fff9c4",
                                      px: 1,
                                      py: 0.5,
                                      borderRadius: 1,
                                    }
                                  : {}),
                              }}
                            >
                              {renderFieldValue(field, newVal)}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      {index < group.fields.length - 1 && <Divider />}
                    </Box>
                  );
                })}
              </CardContent>
              <Box>
                <Divider />
                <Box
                  display="flex"
                  justifyContent="flex-end"
                  p={2}
                  sx={{ bgcolor: "#f5f5f5" }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {newData?.updatedAt
                      ? `Cập nhật lúc: ${new Date(newData.updatedAt).toLocaleString()}`
                      : "Chưa có thông tin cập nhật"}
                  </Typography>
                </Box>
              </Box>
            </Card>
          ))}
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            variant="contained"
            color="success"
            onClick={() => setConfirmType("approve")}
            startIcon={<CheckCircleIcon />}
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              borderRadius: 2,
              px: 3,
            }}
          >
            Duyệt
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => setConfirmType("reject")}
            startIcon={<CancelIcon />}
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              borderRadius: 2,
              px: 3,
            }}
          >
            Từ chối
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={!!confirmType}
        onClose={handleCancelConfirm}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            bgcolor: confirmType === "approve" ? "success.main" : "error.main",
            color: "white",
            fontWeight: "bold",
          }}
        >
          Xác nhận {confirmType === "approve" ? "duyệt" : "từ chối"} cập nhật
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {confirmType === "approve"
              ? "Bạn có chắc chắn muốn duyệt thông tin cập nhật này?"
              : "Bạn có chắc chắn muốn từ chối thông tin cập nhật này?"}
          </Typography>
          {confirmType === "reject" && (
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
            onClick={() => handleConfirm(confirmType!)}
            variant="contained"
            disabled={
              isProcessing || (confirmType === "reject" && !adminNote.trim())
            }
            sx={{
              bgcolor:
                confirmType === "approve" ? "success.main" : "error.main",
              "&:hover": {
                bgcolor:
                  confirmType === "approve" ? "success.dark" : "error.dark",
              },
              textTransform: "none",
              fontWeight: "bold",
              borderRadius: 2,
            }}
          >
            {isProcessing
              ? "Đang xử lý..."
              : confirmType === "approve"
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

export default ApprovePartnerUpdateDialog;
