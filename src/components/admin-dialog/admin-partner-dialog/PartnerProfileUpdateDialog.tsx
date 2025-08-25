import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Avatar,
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";

import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import type { Partner } from "../../../types/Parner";
import { API } from "../../../utils/Fetch";
import { setPartner } from "../../../redux/slice/PartnerSlice";
import { validatePartnerInfo } from "../../../utils/Validate";

interface PartnerEditDialogProps {
  open: boolean;
  onClose: () => void;
  partner?: Partner;
}

const PartnerProfileUpdateDialog = ({
  open,
  onClose,
  partner,
}: PartnerEditDialogProps) => {
  if (!open || !partner) return null;

  const dispatch = useDispatch();

  const [organizationName, setOrganizationName] = useState(
    partner.organizationName || "",
  );
  const [industry, setIndustry] = useState(partner.industry || "");
  const [phoneNumber, setPhoneNumber] = useState(partner.phoneNumber || "");
  const [website, setWebsite] = useState(partner.website || "");
  const [address, setAddress] = useState(partner.address || "");
  const [representativeName, setRepresentativeName] = useState(
    partner.representativeName || "",
  );
  const [position, setPosition] = useState(partner.position || "");
  const [description, setDescription] = useState(partner.description || "");
  const [establishedYear, setEstablishedYear] = useState(
    partner.establishedYear?.toString() || "",
  );
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleSave = () => {
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    setConfirmOpen(false);
    try {
      const updatedPartner: Partner = {
        ...partner,
        organizationName,
        industry,
        phoneNumber,
        website,
        address,
        representativeName,
        position,
        description,
        establishedYear: Number(establishedYear) || null,
        logoUrl: partner.logoUrl || "",
        id: partner.id,
        adminNote: partner.adminNote,
      };

      const validationResult = validatePartnerInfo(updatedPartner);
      if (validationResult && !validationResult.success) {
        toast.error(
          validationResult?.error || "Thông tin đối tác không hợp lệ",
        );
        return;
      }
      await API.admin.updatePartner(updatedPartner);
      const res = await API.admin.getAllPartners();
      dispatch(setPartner(res.data.data));
      toast.success("Cập nhật thông tin đối tác thành công");
      onClose();
    } catch (error: any) {
      if (error.response?.data?.message?.includes("đã tồn tại")) {
        toast.error("Số đăng ký kinh doanh đã tồn tại trong hệ thống.");
      } else {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
      }
    }
  };

  const handleCancel = () => {
    setConfirmOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            {/* Thay Avatar bằng icon giống LecturerUpdateDialog */}
            <BusinessIcon sx={{ fontSize: 40, color: "primary.main" }} />
            <Box>
              <Typography variant="h5" component="div" sx={{ fontWeight: 700 }}>
                Chỉnh sửa thông tin đối tác
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {partner.organizationName} #{partner.id}
              </Typography>
            </Box>
          </Box>
          <Button
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 16,
              top: 16,
              minWidth: 0,
              p: 1,
              color: "primary.main",
              background: "rgba(240,240,240,0.8)",
              "&:hover": {
                bgcolor: "primary.light",
                color: "white",
              },
              borderRadius: "50%",
            }}
          >
            <CloseIcon />
          </Button>
        </DialogTitle>
        <DialogContent dividers sx={{ bgcolor: "#f9f9f9" }}>
          <Box display="flex" flexDirection="column" gap={3}>
            {/* Header Card */}
            <Card
              elevation={4}
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" gap={3}>
                  <Avatar
                    src={partner.logoUrl || undefined}
                    alt={partner.organizationName}
                    sx={{
                      width: 80,
                      height: 80,
                      border: "3px solid rgba(255,255,255,0.9)",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                      background:
                        "linear-gradient(45deg, #f093fb 0%, #f5576c 100%)",
                    }}
                  >
                    <BusinessIcon sx={{ fontSize: 40, color: "white" }} />
                  </Avatar>
                  <Box flex={1}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: "white",
                        textShadow: "0 1px 3px rgba(0,0,0,0.3)",
                        mb: 1,
                      }}
                    >
                      {organizationName}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "rgba(255,255,255,0.9)",
                        fontWeight: 500,
                        textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                      }}
                    >
                      Ngành nghề: {industry || "Chưa cập nhật"}
                    </Typography>
                  </Box>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: "rgba(255,255,255,0.8)",
                        fontWeight: 500,
                        mb: 1,
                      }}
                    >
                      Trạng thái
                    </Typography>
                    <Chip
                      label={
                        partner.status === "APPROVED"
                          ? "Đã duyệt"
                          : partner.status === "REJECTED"
                            ? "Đã từ chối"
                            : "Chờ duyệt"
                      }
                      color={
                        partner.status === "APPROVED"
                          ? "success"
                          : partner.status === "REJECTED"
                            ? "error"
                            : "warning"
                      }
                      variant="filled"
                      size="medium"
                      sx={{
                        fontWeight: "bold",
                        fontSize: "0.8rem",
                        minWidth: 90,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                      }}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Form Cards Grid */}
            <Box
              display="flex"
              flexDirection={{ xs: "column", lg: "row" }}
              gap={3}
            >
              {/* Organization Info Card */}
              <Box flex={1}>
                <Card elevation={1} sx={{ height: "100%" }}>
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: "info.main" }}>
                        <BusinessIcon />
                      </Avatar>
                    }
                    title="Thông tin tổ chức"
                  />
                  <CardContent>
                    <Box display="flex" flexDirection="column" gap={2}>
                      <TextField
                        label="Tên tổ chức"
                        value={organizationName}
                        onChange={(e) => setOrganizationName(e.target.value)}
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: !!organizationName }}
                      />
                      <TextField
                        label="Ngành nghề"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: !!industry }}
                      />
                      <TextField
                        label="Năm thành lập"
                        value={establishedYear}
                        onChange={(e) => setEstablishedYear(e.target.value)}
                        fullWidth
                        type="number"
                        variant="outlined"
                        InputLabelProps={{ shrink: !!establishedYear }}
                      />
                      <TextField
                        label="Số điện thoại"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: !!phoneNumber }}
                      />
                      <TextField
                        label="Website"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: !!website }}
                      />
                      <TextField
                        label="Địa chỉ"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: !!address }}
                      />
                      {/* ĐÃ CHUYỂN MÔ TẢ SANG BOX NGƯỜI ĐẠI DIỆN */}
                    </Box>
                  </CardContent>
                </Card>
              </Box>
              {/* Representative Info Card */}
              <Box flex={1} display="flex" flexDirection="column" gap={3}>
                <Card elevation={1} sx={{ height: "fit-content" }}>
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: "success.main" }}>
                        <PersonIcon />
                      </Avatar>
                    }
                    title="Người đại diện"
                  />
                  <CardContent>
                    <Box display="flex" flexDirection="column" gap={2}>
                      <TextField
                        label="Tên người đại diện"
                        value={representativeName}
                        onChange={(e) => setRepresentativeName(e.target.value)}
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: !!representativeName }}
                      />
                      <TextField
                        label="Chức vụ"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: !!position }}
                      />
                      <TextField
                        label="Mô tả tổ chức"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={4}
                        InputLabelProps={{ shrink: !!description }}
                      />
                    </Box>
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
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={onClose}
            color="inherit"
            variant="outlined"
            size="large"
            sx={{ textTransform: "none", fontWeight: "bold", borderRadius: 2 }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSave}
            color="primary"
            variant="contained"
            size="large"
            sx={{ textTransform: "none", fontWeight: "bold", borderRadius: 2 }}
          >
            Lưu thay đổi
          </Button>
        </DialogActions>
      </Dialog>
      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={handleCancel}>
        <DialogTitle>Xác nhận lưu thay đổi</DialogTitle>
        <DialogContent>
          Bạn có chắc chắn muốn lưu các thay đổi cho đối tác này?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirm} color="primary" variant="contained">
            Xác nhận
          </Button>
          <Button onClick={handleCancel} color="inherit">
            Hủy
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PartnerProfileUpdateDialog;
