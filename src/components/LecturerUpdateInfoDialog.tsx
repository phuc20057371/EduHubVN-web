// Removed duplicate Dialog, DialogTitle, DialogContent, DialogActions imports
import {
  Autocomplete,
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
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
import type { Lecturer } from "../types/Lecturer";
// Removed duplicate useState import
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { API } from "../utils/Fetch";
import { validateLecturerInfo } from "../utils/Validate";
import { setLecturerProfile } from "../redux/slice/LecturerProfileSlice";
import {
  jobFieldAutoComplete,
  specializationAutoComplete,
} from "../utils/AutoComplete";

interface LecturerUpdateDialogProps {
  open: boolean;
  onClose: () => void;
  lecturer?: Lecturer;
}

const LecturerUpdateInfoDialog = ({
  open,
  onClose,
  lecturer,
}: LecturerUpdateDialogProps) => {
  if (!open || !lecturer) return null;
  const dispatch = useDispatch();
  const [fullName, setFullName] = useState(lecturer.fullName || "");
  const [citizenId, setCitizenId] = useState(lecturer.citizenId || "");
  const [email] = useState((lecturer as Lecturer).email || "");
  const [academicRank, setAcademicRank] = useState(lecturer.academicRank || "");
  const [specialization, setSpecialization] = useState(
    lecturer.specialization || "",
  );
  const [jobField, setJobField] = useState(lecturer.jobField || "");
  const [experienceYears, setExperienceYears] = useState(
    lecturer.experienceYears || "",
  );
  const [phoneNumber, setPhoneNumber] = useState(lecturer.phoneNumber || "");
  const [dateOfBirth, setDateOfBirth] = useState(lecturer.dateOfBirth || "");
  const [gender, setGender] = useState(
    lecturer.gender === true || lecturer.gender
      ? "true"
      : lecturer.gender === false || lecturer.gender === "false"
        ? "false"
        : "",
  );
  const [address, setAddress] = useState(lecturer.address || "");
  const [bio, setBio] = useState(lecturer.bio || "");
  const [status] = useState(lecturer.status || "");
  const [adminNote] = useState(lecturer.adminNote || "");
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Helper function to convert academic rank abbreviations to full names
  const getAcademicRankLabel = (rank: string) => {
    switch (rank) {
      case "CN":
        return "Cử nhân";
      case "THS":
        return "Thạc sĩ";
      case "TS":
        return "Tiến sĩ";
      case "PGS":
        return "Phó giáo sư";
      case "GS":
        return "Giáo sư";
      default:
        return rank || "Chưa có học hàm";
    }
  };

  const handleSave = () => {
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    setConfirmOpen(false);

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
      return;
    }
    try {
      const updatedLecturer = {
        ...lecturer,
        fullName: fullName.trim(),
        citizenId: citizenId.trim(),
        email: email.trim(),
        academicRank,
        specialization: specialization.trim(),
        jobField: jobField.trim(),
        experienceYears: Number(experienceYears) || 0,
        phoneNumber: phoneNumber.trim(),
        dateOfBirth,
        gender: gender === "true",
        address: address.trim(),
        bio: bio.trim(),
        status,
        adminNote,
      };
      const res = await API.lecturer.updateProfile(updatedLecturer);
      if (res.data.success === false) {
        toast.error(res.data.error);
        return;
      }
      const response = await API.lecturer.getLecturerProfile();
      dispatch(setLecturerProfile(response.data.data));
      console.log("Update response:", res.data);
      toast.success("Hồ sơ cập nhật đã được gửi cho admin");
      onClose();
    } catch (error: any) {
      if (error.response?.data?.message?.includes("đã tồn tại")) {
        toast.error("Số CCCD/CMND đã được đăng ký trước đó.");
        return;
      } else {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
        return;
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
            <Avatar sx={{ bgcolor: "primary.main" }}>
              <EditIcon />
            </Avatar>
            <Box>
              <Typography variant="h5" component="div">
                Chỉnh sửa thông tin giảng viên
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {lecturer?.fullName} #{lecturer?.id}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {lecturer ? (
            <Box display="flex" flexDirection="column" gap={3}>
              {/* Profile Header Card */}
              <Card
                elevation={4}
                sx={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" gap={3}>
                    {/* Avatar Section */}
                    <Avatar
                      src={lecturer.avatarUrl || undefined}
                      alt={lecturer.fullName}
                      sx={{
                        width: 80,
                        height: 80,
                        border: "3px solid rgba(255,255,255,0.9)",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                        background:
                          "linear-gradient(45deg, #f093fb 0%, #f5576c 100%)",
                      }}
                    >
                      <PersonIcon sx={{ fontSize: 40, color: "white" }} />
                    </Avatar>

                    {/* Main Info Section */}
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
                        {lecturer.fullName}
                      </Typography>

                      <Box display="flex" alignItems="center" gap={2} mb={1}>
                        <Chip
                          label={getAcademicRankLabel(lecturer.academicRank)}
                          sx={{
                            background:
                              "linear-gradient(45deg, #FFD700, #FFA500)",
                            color: "#1a1a1a",
                            fontWeight: "bold",
                            fontSize: "0.85rem",
                            boxShadow: "0 2px 8px rgba(255,215,0,0.3)",
                          }}
                          size="small"
                        />
                      </Box>

                      <Typography
                        variant="body2"
                        sx={{
                          color: "rgba(255,255,255,0.9)",
                          fontWeight: 500,
                          textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                        }}
                      >
                        📧 {email || "Chưa có email"}
                      </Typography>
                    </Box>

                    {/* Status Section */}
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
                          lecturer.status === "APPROVED"
                            ? "Đã duyệt"
                            : lecturer.status === "REJECTED"
                              ? "Đã từ chối"
                              : "Chờ duyệt"
                        }
                        color={
                          lecturer.status === "APPROVED"
                            ? "success"
                            : lecturer.status === "REJECTED"
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
                {/* Personal Information Card */}
                <Box flex={1}>
                  <Card elevation={1} sx={{ height: "100%" }}>
                    <CardHeader
                      avatar={
                        <Avatar sx={{ bgcolor: "info.main" }}>
                          <PersonIcon />
                        </Avatar>
                      }
                      title="Thông tin cá nhân"
                    />
                    <CardContent>
                      <Box display="flex" flexDirection="column" gap={2}>
                        <TextField
                          label="Họ tên"
                          value={fullName}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFullName(e.target.value)
                          }
                          fullWidth
                          variant="outlined"
                        />

                        <Box display="flex" gap={2}>
                          <TextField
                            label="CCCD"
                            value={citizenId}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) => setCitizenId(e.target.value)}
                            fullWidth
                            variant="outlined"
                          />
                          <TextField
                            label="Ngày sinh"
                            value={dateOfBirth}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) => setDateOfBirth(e.target.value)}
                            fullWidth
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            variant="outlined"
                          />
                        </Box>
                        <Box>
                          <TextField
                            label="Số điện thoại"
                            value={phoneNumber}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) => setPhoneNumber(e.target.value)}
                            fullWidth
                            variant="outlined"
                          />
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" gutterBottom>
                            Giới tính
                          </Typography>
                          <RadioGroup
                            row
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                          >
                            <FormControlLabel
                              value="true"
                              control={<Radio />}
                              label="Nam"
                            />
                            <FormControlLabel
                              value="false"
                              control={<Radio />}
                              label="Nữ"
                            />
                          </RadioGroup>
                        </Box>

                        <TextField
                          label="Địa chỉ"
                          value={address}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setAddress(e.target.value)
                          }
                          fullWidth
                          multiline
                          rows={2}
                          variant="outlined"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Box>

                {/* Academic Information Card */}
                <Box flex={1}>
                  <Card elevation={1} sx={{ height: "100%" }}>
                    <CardHeader
                      avatar={
                        <Avatar sx={{ bgcolor: "success.main" }}>
                          <SchoolIcon />
                        </Avatar>
                      }
                      title="Thông tin học thuật"
                    />
                    <CardContent>
                      <Box display="flex" flexDirection="column" gap={2}>
                        {/* Học vị và Chuyên ngành */}
                        <Box display="flex" gap={2}>
                          <FormControl
                            variant="outlined"
                            sx={{ minWidth: 100, flex: "0 0 auto" }}
                          >
                            <InputLabel>Học vị</InputLabel>
                            <Select
                              value={academicRank}
                              onChange={(e) => setAcademicRank(e.target.value)}
                              label="Học vị"
                            >
                              <MenuItem value="">
                                <em>Chọn học vị</em>
                              </MenuItem>
                              <MenuItem value="CN">Cử nhân</MenuItem>
                              <MenuItem value="THS">Thạc sĩ</MenuItem>
                              <MenuItem value="TS">Tiến sĩ</MenuItem>
                              <MenuItem value="PGS">Phó giáo sư</MenuItem>
                              <MenuItem value="GS">Giáo sư</MenuItem>
                            </Select>
                          </FormControl>
                          <Autocomplete
                            freeSolo // Cho phép nhập tự do ngoài các lựa chọn có sẵn
                            options={specializationAutoComplete}
                            value={specialization}
                            onChange={(_event, newValue) => {
                              setSpecialization(newValue || "");
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Chuyên ngành"
                                variant="outlined"
                              />
                            )}
                            sx={{ flex: "1 1 auto" }}
                          />
                        </Box>

                        {/* Lĩnh vực và Số năm kinh nghiệm */}
                        <Box display="flex" gap={2}>
                          <Autocomplete
                            freeSolo // Cho phép nhập tự do
                            options={jobFieldAutoComplete}
                            value={jobField}
                            onChange={(_event, newValue) => {
                              setJobField(newValue || "");
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Lĩnh vực"
                                variant="outlined"
                              />
                            )}
                            sx={{ flex: "1 1 auto" }}
                          />
                          <TextField
                            label="Năm KN"
                            value={experienceYears}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) => setExperienceYears(e.target.value)}
                            sx={{ maxWidth: 120, flex: "0 0 auto" }}
                            type="number"
                            variant="outlined"
                          />
                        </Box>

                        <TextField
                          label="Tiểu sử"
                          value={bio}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setBio(e.target.value)
                          }
                          fullWidth
                          multiline
                          rows={5}
                          variant="outlined"
                        />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          Được tạo lúc :{" "}
                          {lecturer.createdAt
                            ? new Date(lecturer.createdAt).toLocaleString(
                                "vi-VN",
                              )
                            : "Chưa cập nhật"}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          Cập nhật lúc{" "}
                          {lecturer.updatedAt
                            ? new Date(lecturer.updatedAt).toLocaleString(
                                "vi-VN",
                              )
                            : "Chưa cập nhật"}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              </Box>
            </Box>
          ) : (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              py={8}
            >
              <Typography variant="h6" color="text.secondary">
                Không có dữ liệu giảng viên.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={onClose}
            color="inherit"
            variant="outlined"
            size="large"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSave}
            color="primary"
            variant="contained"
            size="large"
            startIcon={<EditIcon />}
          >
            Lưu thay đổi
          </Button>
        </DialogActions>
      </Dialog>
      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={handleCancel}>
        <DialogTitle>Xác nhận lưu thay đổi</DialogTitle>
        <DialogContent>
          Bạn có chắc chắn muốn lưu các thay đổi cho giảng viên này?
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

export default LecturerUpdateInfoDialog;
