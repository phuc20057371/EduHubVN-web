import {
  Alert,
  Autocomplete,
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import { useState } from "react";
import { toast } from "react-toastify";
import { API } from "../../../utils/Fetch";
import { validateLecturerInfo } from "../../../utils/Validate";
import {
  jobFieldAutoComplete,
  specializationAutoComplete,
} from "../../../utils/AutoComplete";
import type { RequestLecturerFromAdmin } from "../../../types/RequestLecturerFromAdmin";

interface CreateLecturerDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateLecturerDialog = ({
  open,
  onClose,
  onSuccess,
}: CreateLecturerDialogProps) => {
  // Form states
  const [fullName, setFullName] = useState("");
  const [citizenId, setCitizenId] = useState("");
  const [email, setEmail] = useState("");
  const [academicRank, setAcademicRank] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [jobField, setJobField] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<dayjs.Dayjs | null>(null);
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [bio, setBio] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI states
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (!fullName.trim()) {
      toast.error("Vui lòng nhập họ tên");
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
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    setConfirmOpen(false);
    setIsSubmitting(true);

    const formData = {
      fullName,
      citizenId,
      phoneNumber,
      dateOfBirth,
      gender,
      academicRank,
      specialization,
      jobField,
      experienceYears,
      address,
      bio,
    };

    const error = validateLecturerInfo(formData);
    if (error.success === false) {
      toast.error(error.error);
      setIsSubmitting(false);
      return;
    }

    try {
      // Convert dateOfBirth from dayjs to Date object
      let dateOfBirthObj = null;
      if (dateOfBirth && dateOfBirth.isValid()) {
        dateOfBirthObj = dateOfBirth.toDate();
      }

      const newLecturer: RequestLecturerFromAdmin = {
        email: email.trim(),
        password: password.trim(),
        fullName: fullName.trim(),
        citizenId: citizenId.trim(),
        academicRank,
        specialization: specialization.trim(),
        jobField: jobField.trim(),
        experienceYears: Number(experienceYears) || 0,
        phoneNumber: phoneNumber.trim(),
        dateOfBirth: dateOfBirthObj || new Date(),
        gender: gender === "true",
        address: address.trim(),
        bio: bio.trim(),
        avatarUrl: "", // Default empty avatar URL
      };

      const res = await API.admin.createLecturer(newLecturer);

      if (res.data.success === false) {
        toast.error(res.data.error);
        setIsSubmitting(false);
        return;
      }

      toast.success("Tạo tài khoản giảng viên thành công!");
      handleClose();
      onSuccess?.();
    } catch (error: any) {
      if (error.response?.data?.message.includes("email")) {
        toast.error("Email đã tồn tại trong hệ thống.");
      } else if (error.response?.data?.message.includes("citizenId")) {
        toast.error("Số căn cước công dân đã tồn tại trong hệ thống.");
      } else {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
      }
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset form
    setFullName("");
    setCitizenId("");
    setEmail("");
    setAcademicRank("");
    setSpecialization("");
    setJobField("");
    setExperienceYears("");
    setPhoneNumber("");
    setDateOfBirth(null);
    setGender("");
    setAddress("");
    setBio("");
    setPassword("");
    setConfirmPassword("");
    setConfirmOpen(false);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 1,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: "primary.main",
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: 3,
          }}
        >
          <Avatar sx={{ bgcolor: "primary.dark" }}>
            <PersonAddIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Tạo mới tài khoản Giảng viên
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Nhập thông tin để tạo tài khoản giảng viên mới
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ p: 3 }}>
            {/* Account Information Card */}
            <Card sx={{ mb: 3, borderRadius: 1, border: "1px solid #e0e0e0" }}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: "secondary.main" }}>
                    <PersonIcon />
                  </Avatar>
                }
                title="Thông tin tài khoản"
                titleTypographyProps={{ variant: "h6", fontWeight: 600 }}
                sx={{ pb: 1 }}
              />
              <CardContent sx={{ pt: 0 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Email *"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    variant="outlined"
                    size="small"
                  />
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <TextField
                      fullWidth
                      label="Mật khẩu *"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      variant="outlined"
                      size="small"
                    />
                    <TextField
                      fullWidth
                      label="Xác nhận mật khẩu *"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Personal Information Card */}
            <Card sx={{ mb: 3, borderRadius: 1, border: "1px solid #e0e0e0" }}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: "success.main" }}>
                    <PersonIcon />
                  </Avatar>
                }
                title="Thông tin cá nhân"
                titleTypographyProps={{ variant: "h6", fontWeight: 600 }}
                sx={{ pb: 1 }}
              />
              <CardContent sx={{ pt: 0 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <TextField
                      fullWidth
                      label="Họ và tên *"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      variant="outlined"
                      size="small"
                    />
                    <TextField
                      fullWidth
                      label="CCCD/CMND"
                      value={citizenId}
                      onChange={(e) => setCitizenId(e.target.value)}
                      variant="outlined"
                      size="small"
                    />
                  </Box>

                  <Box sx={{ display: "flex", gap: 2 }}>
                    <TextField
                      fullWidth
                      label="Số điện thoại"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      variant="outlined"
                      size="small"
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
                      <DatePicker
                        label="Ngày sinh"
                        value={dateOfBirth}
                        onChange={(newValue) => setDateOfBirth(newValue as dayjs.Dayjs | null)}
                        format="DD/MM/YYYY"
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: "small",
                            variant: "outlined"
                          }
                        }}
                      />
                    </LocalizationProvider>
                  </Box>

                  <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <Typography variant="body2" sx={{ minWidth: 80 }}>
                      Giới tính:
                    </Typography>
                    <RadioGroup
                      row
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <FormControlLabel
                        value="true"
                        control={<Radio size="small" />}
                        label="Nam"
                      />
                      <FormControlLabel
                        value="false"
                        control={<Radio size="small" />}
                        label="Nữ"
                      />
                    </RadioGroup>
                  </Box>

                  <TextField
                    fullWidth
                    label="Địa chỉ"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    variant="outlined"
                    size="small"
                    multiline
                    rows={2}
                  />
                </Box>
              </CardContent>
            </Card>

            {/* Academic Information Card */}
            <Card sx={{ mb: 3, borderRadius: 1, border: "1px solid #e0e0e0" }}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: "warning.main" }}>
                    <SchoolIcon />
                  </Avatar>
                }
                title="Thông tin học thuật"
                titleTypographyProps={{ variant: "h6", fontWeight: 600 }}
                sx={{ pb: 1 }}
              />
              <CardContent sx={{ pt: 0 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Học hàm</InputLabel>
                    <Select
                      value={academicRank}
                      label="Học hàm"
                      onChange={(e) => setAcademicRank(e.target.value)}
                    >
                      <MenuItem value="CN">Cử nhân</MenuItem>
                      <MenuItem value="THS">Thạc sĩ</MenuItem>
                      <MenuItem value="TS">Tiến sĩ</MenuItem>
                      <MenuItem value="PGS">Phó giáo sư</MenuItem>
                      <MenuItem value="GS">Giáo sư</MenuItem>
                    </Select>
                  </FormControl>

                  <Autocomplete
                    fullWidth
                    size="small"
                    options={specializationAutoComplete}
                    value={specialization}
                    onChange={(_, newValue) =>
                      setSpecialization(newValue || "")
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Chuyên ngành" />
                    )}
                    freeSolo
                  />

                  <Autocomplete
                    fullWidth
                    size="small"
                    options={jobFieldAutoComplete}
                    value={jobField}
                    onChange={(_, newValue) => setJobField(newValue || "")}
                    renderInput={(params) => (
                      <TextField {...params} label="Lĩnh vực công việc" />
                    )}
                    freeSolo
                  />

                  <TextField
                    fullWidth
                    label="Số năm kinh nghiệm"
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    variant="outlined"
                    size="small"
                    inputProps={{ min: 0 }}
                  />

                  <TextField
                    fullWidth
                    label="Mô tả bản thân"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    variant="outlined"
                    size="small"
                    multiline
                    rows={3}
                    placeholder="Giới thiệu ngắn về bản thân, kinh nghiệm làm việc..."
                  />
                </Box>
              </CardContent>
            </Card>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            disabled={isSubmitting}
            sx={{ minWidth: 100 }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={isSubmitting}
            sx={{ minWidth: 100 }}
          >
            {isSubmitting ? "Đang tạo..." : "Tạo tài khoản"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" component="div">
            Xác nhận tạo tài khoản
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              Bạn có chắc chắn muốn tạo tài khoản giảng viên với thông tin đã
              nhập?
            </Typography>
          </Alert>
          <Typography variant="body1">
            Email: <strong>{email}</strong>
          </Typography>
          <Typography variant="body1">
            Họ tên: <strong>{fullName}</strong>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmOpen(false)}
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

export default CreateLecturerDialog;
