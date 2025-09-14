import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";
import { API } from "../../../utils/Fetch";
import { validateInstitutionInfo } from "../../../utils/Validate";
import type { RequestInstitutionFromAdmin } from "../../../types/RequestInstitutionFromAdmin";

interface CreateInstitutionDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateInstitutionDialog = ({
  open,
  onClose,
  onSuccess,
}: CreateInstitutionDialogProps) => {
  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [institutionName, setInstitutionName] = useState("");
  const [institutionType, setInstitutionType] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [representativeName, setRepresentativeName] = useState("");
  const [position, setPosition] = useState("");
  const [description, setDescription] = useState("");
  const [establishedYear, setEstablishedYear] = useState<number>(
    new Date().getFullYear(),
  );
  const [businessRegistrationNumber, setBusinessRegistrationNumber] =
    useState("");

  // UI states
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    if (isSubmitting) return;

    // Reset form
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setInstitutionName("");
    setInstitutionType("");
    setPhoneNumber("");
    setWebsite("");
    setAddress("");
    setRepresentativeName("");
    setPosition("");
    setDescription("");
    setEstablishedYear(new Date().getFullYear());
    setBusinessRegistrationNumber("");
    setConfirmOpen(false);
    onClose();
  };

  const handleSave = () => {
    // Check email first
    if (!email.trim()) {
      toast.error("Vui lòng nhập email");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error("Email không hợp lệ");
      return;
    }

    // Basic validation
    if (!institutionName.trim()) {
      toast.error("Vui lòng nhập tên cơ sở giáo dục");
      return;
    }
    if (!institutionType) {
      toast.error("Vui lòng chọn loại cơ sở giáo dục");
      return;
    }
    if (!password.trim()) {
      toast.error("Vui lòng nhập mật khẩu");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }
    if (!representativeName.trim()) {
      toast.error("Vui lòng nhập tên người đại diện");
      return;
    }
    if (!businessRegistrationNumber.trim()) {
      toast.error("Vui lòng nhập số đăng ký kinh doanh");
      return;
    }

    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    setConfirmOpen(false);
    setIsSubmitting(true);

    const formData = {
      institutionName,
      institutionType,
      phoneNumber,
      website,
      address,
      representativeName,
      position,
      description,
      establishedYear,
      businessRegistrationNumber,
    };

    const error = validateInstitutionInfo(formData);
    if (error.success === false) {
      toast.error(error.error);
      setIsSubmitting(false);
      return;
    }

    try {
      const newInstitution: RequestInstitutionFromAdmin = {
        email: email.trim(),
        password: password.trim(),
        institutionName: institutionName.trim(),
        institutionType,
        phoneNumber: phoneNumber.trim(),
        website: website.trim(),
        address: address.trim(),
        representativeName: representativeName.trim(),
        position: position.trim(),
        description: description.trim(),
        establishedYear: Number(establishedYear),
        businessRegistrationNumber: businessRegistrationNumber.trim(),
        logoUrl: "", // Default empty logo URL
      };

      const res = await API.admin.createInstitution(newInstitution);

      if (res.data.success === false) {
        toast.error(res.data.error);
        setIsSubmitting(false);
        return;
      }

      toast.success("Tạo tài khoản cơ sở giáo dục thành công!");
      handleClose();
      onSuccess?.();
    } catch (error: any) {
      console.error("Error creating institution:", error);
      if (error.response?.data?.message.includes("email")) {
        toast.error("Email đã tồn tại trong hệ thống.");
      } else if (error.response?.data?.message.includes("businessId")) {
        toast.error("Số đăng ký kinh doanh đã tồn tại trong hệ thống.");
      } else {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
      }
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setConfirmOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <SchoolIcon sx={{ fontSize: 40, color: "primary.main" }} />
            <Box>
              <Typography variant="h5" component="div" sx={{ fontWeight: 700 }}>
                Tạo mới cơ sở giáo dục
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Nhập thông tin để tạo tài khoản cơ sở giáo dục mới
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={handleClose}
            disabled={isSubmitting}
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
            {/* Account Info Card */}
            <Card elevation={1}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: "warning.main" }}>
                    <PersonIcon />
                  </Avatar>
                }
                title="Thông tin tài khoản"
              />
              <CardContent>
                <Box display="flex" flexDirection="column" gap={2}>
                  <TextField
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    variant="outlined"
                    type="email"
                    required
                  />
                  <Box display="flex" gap={2}>
                    <TextField
                      label="Mật khẩu"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      fullWidth
                      variant="outlined"
                      type="password"
                      required
                    />
                    <TextField
                      label="Xác nhận mật khẩu"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      fullWidth
                      variant="outlined"
                      type="password"
                      required
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
                        required
                      />
                      <FormControl fullWidth variant="outlined" required>
                        <InputLabel>Loại cơ sở</InputLabel>
                        <Select
                          value={institutionType}
                          onChange={(e) => setInstitutionType(e.target.value)}
                          label="Loại cơ sở"
                        >
                          <MenuItem value="UNIVERSITY">Đại học</MenuItem>
                          <MenuItem value="TRAINING_CENTER">
                            Trung tâm đào tạo
                          </MenuItem>
                        </Select>
                      </FormControl>

                      {/* Năm thành lập và Số đăng ký kinh doanh trên cùng một hàng */}
                      <Box display="flex" gap={2}>
                        <TextField
                          label="Năm thành lập"
                          value={establishedYear}
                          onChange={(e) =>
                            setEstablishedYear(Number(e.target.value))
                          }
                          fullWidth
                          type="number"
                          variant="outlined"
                        />
                        <TextField
                          label="Số đăng ký kinh doanh"
                          value={businessRegistrationNumber}
                          onChange={(e) =>
                            setBusinessRegistrationNumber(e.target.value)
                          }
                          fullWidth
                          variant="outlined"
                          required
                        />
                      </Box>

                      <TextField
                        label="Số điện thoại"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        fullWidth
                        variant="outlined"
                      />
                      <TextField
                        label="Website"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        fullWidth
                        variant="outlined"
                      />
                      <TextField
                        label="Địa chỉ"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        fullWidth
                        variant="outlined"
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
                        required
                      />
                      <TextField
                        label="Chức vụ"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        fullWidth
                        variant="outlined"
                      />
                    </Box>
                  </CardContent>
                </Card>

                {/* Mô tả cơ sở - Card riêng */}
                <Card elevation={1}>
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: "primary.main" }}>
                        <SchoolIcon />
                      </Avatar>
                    }
                    title="Mô tả cơ sở"
                  />
                  <CardContent>
                    <TextField
                      label="Mô tả chi tiết về cơ sở giáo dục"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      fullWidth
                      variant="outlined"
                      multiline
                      rows={6}
                    />
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={handleClose}
            color="inherit"
            variant="outlined"
            size="large"
            disabled={isSubmitting}
            sx={{ textTransform: "none", fontWeight: "bold", borderRadius: 2 }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSave}
            color="primary"
            variant="contained"
            size="large"
            disabled={isSubmitting}
            sx={{ textTransform: "none", fontWeight: "bold", borderRadius: 2 }}
          >
            {isSubmitting ? "Đang tạo..." : "Tạo mới"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={handleCancel}>
        <DialogTitle>Xác nhận tạo cơ sở giáo dục</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Bạn có chắc chắn muốn tạo tài khoản cơ sở giáo dục với email{" "}
            <strong>{email}</strong> không?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCancel}
            color="inherit"
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button
            onClick={handleConfirm}
            color="primary"
            variant="contained"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang tạo..." : "Xác nhận"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateInstitutionDialog;
