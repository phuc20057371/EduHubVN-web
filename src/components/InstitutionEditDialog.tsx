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
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import type { Institution } from "../types/Institution";
import { API } from "../utils/Fetch";
import { setInstitutions } from "../redux/slice/InstitutionSlice";
import { validateInstitutionInfo } from "../utils/Validate";
import type {
  EducationInstitutionType,
  InstitutionRequest,
} from "../types/InstitutionRequest";

interface InstitutionEditDialogProps {
  open: boolean;
  onClose: () => void;
  institution?: Institution;
}

const InstitutionEditDialog = ({
  open,
  onClose,
  institution,
}: InstitutionEditDialogProps) => {
  if (!open || !institution) return null;

  const dispatch = useDispatch();

  const [institutionName, setInstitutionName] = useState(
    institution.institutionName || "",
  );
  const [institutionType, setInstitutionType] = useState(
    institution.institutionType || "",
  );
  const [phoneNumber, setPhoneNumber] = useState(institution.phoneNumber || "");
  const [website, setWebsite] = useState(institution.website || "");
  const [address, setAddress] = useState(institution.address || "");
  const [representativeName, setRepresentativeName] = useState(
    institution.representativeName || "",
  );
  const [position, setPosition] = useState(institution.position || "");
  const [description, setDescription] = useState(institution.description || "");
  const [establishedYear, setEstablishedYear] = useState(
    institution.establishedYear || 0,
  );
  const [businessRegistrationNumber, setBusinessRegistrationNumber] = useState(
    institution.businessRegistrationNumber || "",
  );
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleSave = () => {
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    setConfirmOpen(false);
    try {
      const updatedInstitution: Institution = {
        ...institution,
        businessRegistrationNumber,
        institutionName,
        institutionType,
        phoneNumber,
        website,
        address,
        representativeName,
        position,
        description,
        establishedYear,
        logoUrl: institution.logoUrl || "",
      };

      const updatedInstitutionRequest: InstitutionRequest = {
        businessRegistrationNumber,
        institutionName,
        institutionType: institutionType as EducationInstitutionType, // ✅ ép kiểu ở đây
        phoneNumber,
        website,
        address,
        representativeName,
        position,
        description,
        establishedYear: Number(establishedYear) || null,
        logoUrl: institution.logoUrl || "",
      };

      const validate = validateInstitutionInfo(updatedInstitutionRequest);
      if (validate && !validate.success) {
        toast.error(validate?.error || "Thông tin cơ sở giáo dục không hợp lệ");
        return;
      }
      await API.admin.updateInstitution(updatedInstitution);
      const res = await API.admin.getAllInstitutions();
      dispatch(setInstitutions(res.data.data));
      toast.success("Cập nhật thông tin cơ sở giáo dục thành công");
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
            <SchoolIcon sx={{ fontSize: 40, color: "primary.main" }} />
            <Box>
              <Typography variant="h5" component="div" sx={{ fontWeight: 700 }}>
                Chỉnh sửa thông tin cơ sở giáo dục
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {institution.institutionName} #{institution.id}
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 16,
              top: 16,
              color: "primary.main",
            }}
          >
            <CloseIcon />
          </IconButton>
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
                    src={institution.logoUrl || undefined}
                    alt={institution.institutionName}
                    sx={{
                      width: 80,
                      height: 80,
                      border: "3px solid rgba(255,255,255,0.9)",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                      background:
                        "linear-gradient(45deg, #f093fb 0%, #f5576c 100%)",
                    }}
                  >
                    <SchoolIcon sx={{ fontSize: 40, color: "white" }} />
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
                      {institutionName}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "rgba(255,255,255,0.9)",
                        fontWeight: 500,
                        textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                      }}
                    >
                      Loại: {institutionType || "Chưa cập nhật"}
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
                      label={institution.status || "Chưa cập nhật"}
                      color="primary"
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
              {/* Institution Info Card */}
              <Box flex={1}>
                <Card elevation={1} sx={{ height: "100%" }}>
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: "info.main" }}>
                        <SchoolIcon />
                      </Avatar>
                    }
                    title="Thông tin cơ sở"
                  />
                  <CardContent>
                    <Box display="flex" flexDirection="column" gap={2}>
                      <TextField
                        label="Tên cơ sở giáo dục"
                        value={institutionName}
                        onChange={(e) => setInstitutionName(e.target.value)}
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: !!institutionName }}
                      />
                      <TextField
                        label="Loại cơ sở"
                        value={institutionType}
                        onChange={(e) => setInstitutionType(e.target.value)}
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: !!institutionType }}
                      />
                      <TextField
                        label="Năm thành lập"
                        value={establishedYear}
                        onChange={(e) =>
                          setEstablishedYear(Number(e.target.value))
                        }
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
                      <TextField
                        label="Số đăng ký kinh doanh"
                        value={businessRegistrationNumber}
                        onChange={(e) =>
                          setBusinessRegistrationNumber(e.target.value)
                        }
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{
                          shrink: !!businessRegistrationNumber,
                        }}
                      />
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
                        label="Mô tả cơ sở"
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
                    Được tạo lúc:{" "}
                    {institution.createdAt
                      ? new Date(institution.createdAt).toLocaleString("vi-VN")
                      : "Chưa cập nhật"}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Cập nhật lúc:{" "}
                    {institution.updatedAt
                      ? new Date(institution.updatedAt).toLocaleString("vi-VN")
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
          Bạn có chắc chắn muốn lưu các thay đổi cho cơ sở giáo dục này?
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

export default InstitutionEditDialog;
