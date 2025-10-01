import {
  Alert,
  Autocomplete,
  Avatar,
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
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
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
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
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");

  // UI states
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file hình ảnh!");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 20 * 1024 * 1024) {
      toast.error("File không được vượt quá 20MB!");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to server
    try {
      setIsUploadingAvatar(true);
      const response = await API.user.uploadFileToServer(file);
      setAvatarUrl(response.data);
      toast.success("Tải lên avatar thành công!");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Tải lên avatar thất bại!");
      setAvatarPreview("");
      setAvatarUrl("");
    } finally {
      setIsUploadingAvatar(false);
    }
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

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // Check if target is textarea or multiline input - allow Enter for new line
    const target = event.target as HTMLElement;
    if (target.tagName === "TEXTAREA") {
      return;
    }

    // If Enter is pressed (without Shift) and not submitting, trigger save
    if (event.key === "Enter" && !event.shiftKey && !isSubmitting) {
      event.preventDefault();
      handleSave();
    }
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
        avatarUrl: avatarUrl || "", // Use uploaded avatar URL
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
    setAvatarUrl("");
    setAvatarPreview("");
    setConfirmOpen(false);
    setIsSubmitting(false);
    setIsUploadingAvatar(false);
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
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            pb: 2,
          }}
        >
          <PersonAddIcon color="primary" sx={{ fontSize: 28 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Tạo mới tài khoản Giảng viên
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Điền thông tin bên dưới để tạo tài khoản mới
            </Typography>
          </Box>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ pt: 3 }} onKeyDown={handleKeyDown}>
          {/* Account Information */}
          <Typography variant="subtitle2" color="primary" sx={{ mb: 2, fontWeight: 600 }}>
            Thông tin tài khoản
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              size="small"
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Mật khẩu"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                size="small"
              />
              <TextField
                fullWidth
                label="Xác nhận mật khẩu"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                size="small"
              />
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Personal Information */}
          <Typography variant="subtitle2" color="primary" sx={{ mb: 2, fontWeight: 600 }}>
            Thông tin cá nhân
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
            {/* Avatar Upload */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                src={avatarPreview}
                sx={{ width: 80, height: 80, bgcolor: "primary.light" }}
              >
                {!avatarPreview && <PersonAddIcon sx={{ fontSize: 40 }} />}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={isUploadingAvatar ? <CircularProgress size={20} /> : <CloudUploadIcon />}
                  disabled={isUploadingAvatar}
                  size="small"
                >
                  {isUploadingAvatar ? "Đang tải lên..." : "Chọn ảnh đại diện"}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </Button>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                  Chọn ảnh JPG, PNG (tối đa 20MB)
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Họ và tên"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                size="small"
              />
              <TextField
                fullWidth
                label="CCCD/CMND"
                value={citizenId}
                onChange={(e) => setCitizenId(e.target.value)}
                size="small"
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Số điện thoại"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
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
                    }
                  }}
                />
              </LocalizationProvider>
            </Box>
            <FormControl component="fieldset" size="small">
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Giới tính
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
            </FormControl>
            <TextField
              fullWidth
              label="Địa chỉ"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              size="small"
              multiline
              rows={2}
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Academic Information */}
          <Typography variant="subtitle2" color="primary" sx={{ mb: 2, fontWeight: 600 }}>
            Thông tin học thuật
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Học hàm</InputLabel>
                <Select
                  value={academicRank}
                  label="Học hàm"
                  onChange={(e) => setAcademicRank(e.target.value)}
                >
                  <MenuItem value="CN">Cử nhân</MenuItem>
                  <MenuItem value="KS">Kỹ sư</MenuItem>
                  <MenuItem value="THS">Thạc sĩ</MenuItem>
                  <MenuItem value="TS">Tiến sĩ</MenuItem>
                  <MenuItem value="PGS">Phó giáo sư</MenuItem>
                  <MenuItem value="GS">Giáo sư</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Số năm kinh nghiệm"
                type="number"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                size="small"
                inputProps={{ min: 0 }}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Autocomplete
                fullWidth
                size="small"
                options={specializationAutoComplete}
                value={specialization}
                onChange={(_, newValue) => setSpecialization(newValue || "")}
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
            </Box>
            <TextField
              fullWidth
              label="Mô tả bản thân"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              size="small"
              multiline
              rows={3}
              placeholder="Giới thiệu ngắn về bản thân, kinh nghiệm làm việc..."
            />
          </Box>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={isSubmitting}
            startIcon={<PersonAddIcon />}
          >
            {isSubmitting ? "Đang tạo..." : "Tạo tài khoản"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
        onKeyDown={(e) => {
          if (e.key === "Enter" && !isSubmitting) {
            e.preventDefault();
            handleConfirm();
          }
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          Xác nhận tạo tài khoản
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Bạn có chắc chắn muốn tạo tài khoản giảng viên với thông tin đã nhập?
          </Alert>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography variant="body2">
              <strong>Email:</strong> {email}
            </Typography>
            <Typography variant="body2">
              <strong>Họ tên:</strong> {fullName}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setConfirmOpen(false)}
            variant="outlined"
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button
            onClick={handleConfirm}
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
