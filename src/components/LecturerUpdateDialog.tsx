// Removed duplicate Dialog, DialogTitle, DialogContent, DialogActions imports
import {
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
import type { Lecturer } from "../types/Lecturer";
// Removed duplicate useState import
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setLecturers } from "../redux/slice/LecturerSlice";
import { API } from "../utils/Fetch";

interface LecturerUpdateDialogProps {
  open: boolean;
  onClose: () => void;
  lecturer?: Lecturer;
}

const LecturerUpdateDialog = ({
  open,
  onClose,
  lecturer,
}: LecturerUpdateDialogProps) => {
  if (!open || !lecturer) return null;
  const lecturers = useSelector((state: any) => state.lecturer || []);
  const dispatch = useDispatch();
  const [fullName, setFullName] = useState(lecturer.fullName || "");
  const [citizenId, setCitizenId] = useState(lecturer.citizenId || "");
  const [email] = useState((lecturer as any).email || "");
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
    
    // Validation - Ràng buộc dữ liệu
    const errors = [];
    
    // Kiểm tra họ tên
    if (!fullName || fullName.trim().length < 2) {
      errors.push("Họ tên phải có ít nhất 2 ký tự");
    }
    
    // Kiểm tra CCCD
    if (!citizenId || citizenId.trim().length !== 11) {
      errors.push("CCCD phải có đúng 11 số");
    } else if (!/^\d{11}$/.test(citizenId.trim())) {
      errors.push("CCCD chỉ được chứa số");
    }
    
    // Kiểm tra số điện thoại
    if (!phoneNumber || phoneNumber.trim().length < 10) {
      errors.push("Số điện thoại phải có ít nhất 10 số");
    } else if (!/^[0-9+\-\s()]+$/.test(phoneNumber.trim())) {
      errors.push("Số điện thoại không hợp lệ");
    }
    
    // Kiểm tra ngày sinh
    if (!dateOfBirth) {
      errors.push("Vui lòng chọn ngày sinh");
    } else {
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18 || age > 100) {
        errors.push("Tuổi phải từ 18 đến 100");
      }
    }
    
    // Kiểm tra giới tính
    if (!gender) {
      errors.push("Vui lòng chọn giới tính");
    }
    
    // Kiểm tra học vị
    if (!academicRank) {
      errors.push("Vui lòng chọn học vị");
    }
    
    // Kiểm tra chuyên ngành
    if (!specialization || specialization.trim().length < 2) {
      errors.push("Chuyên ngành phải có ít nhất 2 ký tự");
    }
    
    // Kiểm tra lĩnh vực
    if (!jobField || jobField.trim().length < 2) {
      errors.push("Lĩnh vực phải có ít nhất 2 ký tự");
    }
    
    // Kiểm tra số năm kinh nghiệm
    const expYears = Number(experienceYears);
    if (isNaN(expYears) || expYears < 0) {
      errors.push("Số năm kinh nghiệm phải >= 0");
    }
    
    // Kiểm tra địa chỉ
    if (!address || address.trim().length === 0) {
      errors.push("Địa chỉ không được để trống");
    }
    
    // Nếu có lỗi validation, hiển thị và dừng
    if (errors.length > 0) {
      toast.error(`Vui lòng kiểm tra lại:\n${errors.join('\n')}`);
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
      
      const res = await API.admin.updateLecturer(updatedLecturer);
      dispatch(
        setLecturers(
          lecturers.map((l: Lecturer) =>
            l.id === lecturer.id ? res.data.data : l,
          ),
        ),
      );
      console.log("Update response:", res.data);
      // Print the updated lecturer object
      console.log("Lecturer to update:", updatedLecturer);
      toast.success("Cập nhật thông tin giảng viên thành công");
      onClose();
    } catch (error) {
      console.error("Error updating lecturer:", error);
      toast.error("Cập nhật thông tin giảng viên thất bại");
      return;
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
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
                        background: "linear-gradient(45deg, #f093fb 0%, #f5576c 100%)",
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
                            background: "linear-gradient(45deg, #FFD700, #FFA500)",
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
                          textShadow: "0 1px 2px rgba(0,0,0,0.2)"
                        }}
                      >
                        📧 {email || "Chưa có email"}
                      </Typography>
                    </Box>

                    {/* Status Section */}
                    <Box display="flex" flexDirection="column" alignItems="center">
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
                        label={lecturer.status === "APPROVED" ? "Đã duyệt" : 
                               lecturer.status === "REJECTED" ? "Đã từ chối" : "Chờ duyệt"}
                        color={
                          lecturer.status === "APPROVED" ? "success" :
                          lecturer.status === "REJECTED" ? "error" : "warning"
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
                          <TextField
                            label="Chuyên ngành"
                            value={specialization}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) => setSpecialization(e.target.value)}
                            sx={{ flex: "1 1 auto" }}
                            variant="outlined"
                          />
                        </Box>

                        {/* Lĩnh vực và Số năm kinh nghiệm */}
                        <Box display="flex" gap={2}>
                          <TextField
                            label="Lĩnh vực"
                            value={jobField}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) => setJobField(e.target.value)}
                            sx={{ flex: "1 1 auto" }}
                            variant="outlined"
                          />
                          <TextField
                            label="Kinh nghiệm (năm)"
                            value={experienceYears}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) => setExperienceYears(e.target.value)}
                            sx={{ maxWidth: 150, flex: "0 0 auto" }}
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
                          rows={3}
                          variant="outlined"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              </Box>

              {/* Second Row */}
              <Box
                display="flex"
                flexDirection={{ xs: "column", lg: "row" }}
                gap={3}
              ></Box>

              {/* System Information Card */}
              <Card elevation={1} sx={{ bgcolor: "grey.50" }}>
                <CardHeader
                  title="Thông tin hệ thống"
                  titleTypographyProps={{ variant: "h6" }}
                />
                <CardContent>
                  <Box
                    display="flex"
                    flexDirection={{ xs: "column", md: "row" }}
                    gap={3}
                  >
                    <Box flex={1}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        ID
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        #{lecturer.id}
                      </Typography>
                    </Box>
                    <Box sx={{ display: { xs: "none", md: "block" } }}>
                      <Divider orientation="vertical" flexItem />
                    </Box>
                    <Box flex={1}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Được tạo lúc
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {lecturer.createdAt
                          ? new Date(lecturer.createdAt).toLocaleString("vi-VN")
                          : "Chưa cập nhật"}
                      </Typography>
                    </Box>
                    <Box sx={{ display: { xs: "none", md: "block" } }}>
                      <Divider orientation="vertical" flexItem />
                    </Box>
                    <Box flex={1}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Cập nhật lúc
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {lecturer.updatedAt
                          ? new Date(lecturer.updatedAt).toLocaleString("vi-VN")
                          : "Chưa cập nhật"}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
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

export default LecturerUpdateDialog;
