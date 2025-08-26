import React, { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import {
  formatDate,
  getAcademicRank,
  getStatus,
  getStatusColor,
} from "../../../../utils/ChangeText";
import { validateLecturerInfo } from "../../../../utils/Validate";
import { API } from "../../../../utils/Fetch";
import { setLecturers } from "../../../../redux/slice/LecturerSlice";
import ApproveLecturerUpdateDialog from "../ApproveLecturerUpdateDialog";
import GeneralConfirmDialog from "../../../general-dialog/GeneralConfirmDialog";

interface LecturerBasicInfoTabProps {
  lecturerData: any;
  onRefreshData: () => Promise<void>;
}

const LecturerBasicInfoTab: React.FC<LecturerBasicInfoTabProps> = ({
  lecturerData,
  onRefreshData,
}) => {
  const dispatch = useDispatch();
  // Lấy trực tiếp object giảng viên từ lecturerData
  const lecturer = lecturerData;
  // Safe avatar url
  const avatarUrl = lecturer?.avatarUrl || undefined;
  
  // Basic info states
  const [fullName, setFullName] = useState<string>("");
  const [citizenId, setCitizenId] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [academicRank, setAcademicRank] = useState<string>("");
  const [specialization, setSpecialization] = useState<string>("");
  const [jobField, setJobField] = useState<string>("");
  const [experienceYears, setExperienceYears] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  
  // Dialog states
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Initialize states from lecturer data
  useEffect(() => {
    if (lecturer) {
      setFullName(lecturer.fullName || "");
      setCitizenId(lecturer.citizenId || "");
      setEmail(lecturer.email || "");
      setAcademicRank(lecturer.academicRank || "");
      setSpecialization(lecturer.specialization || "");
      setJobField(lecturer.jobField || "");
      setExperienceYears(String(lecturer.experienceYears || 0));
      setPhoneNumber(lecturer.phoneNumber || "");
      setDateOfBirth(lecturer.dateOfBirth || "");
      setGender(lecturer.gender ? "true" : "false");
      setAddress(lecturer.address || "");
      setBio(lecturer.bio || "");
      console.log("lecturer", lecturer);

    }
  }, [lecturer]);

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
      const updateLecturerRequest = {
        ...lecturer,
        fullName: fullName.trim(),
        citizenId: citizenId.trim(),
        email: email.trim(),
        academicRank,
        specialization: specialization.trim(),
        jobField: jobField.trim(),
        experienceYears: Number(experienceYears),
        phoneNumber: phoneNumber.trim(),
        dateOfBirth,
        gender: gender === "true",
        address: address.trim(),
        bio: bio.trim(),
      };

      const response = await API.admin.updateLecturer(updateLecturerRequest);
      if (response.data.success) {
        toast.success("Cập nhật thông tin giảng viên thành công!");
        onRefreshData(); // Refresh data
        const res = await API.admin.getAllLecturers();
        dispatch(setLecturers(res.data.data));
      } else {
        toast.error(
          response.data.error || "Có lỗi xảy ra khi cập nhật thông tin!",
        );
      }
    } catch (error: any) {
      console.error("Error updating lecturer:", error);
      if (error.response?.data?.message?.includes("đã tồn tại")) {
        toast.error("Số CCCD/CMND đã được đăng ký trước đó.");
      } else {
        toast.error("Có lỗi xảy ra khi cập nhật thông tin!");
      }
    }
  };

  const handleCancel = () => {
    setConfirmOpen(false);
  };

  return (
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
            <Avatar
              src={avatarUrl}
              alt={lecturer?.fullName || ""}
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
                {lecturer?.fullName || "Chưa có tên"}
              </Typography>

              <Box display="flex" alignItems="center" gap={2} mb={1}>
                <Chip
                  label={getAcademicRank(lecturer?.academicRank)}
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
                  textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                }}
              >
                📧 {lecturer?.email || "Chưa có email"}
              </Typography>
            </Box>

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
                label={getStatus(lecturer?.status)}
                color={getStatusColor(lecturer?.status) as any}
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

      {/* Show lecturer update request if exists */}
      {lecturerData?.lecturerUpdate && (
        <Card
          elevation={2}
          sx={{
            borderLeft: 4,
            borderColor: "warning.main",
            backgroundColor: "warning.50",
          }}
        >
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: "warning.main" }}>
                <EditIcon />
              </Avatar>
            }
            title="Yêu cầu cập nhật thông tin cá nhân"
            subheader={`Trạng thái: ${getStatus(lecturerData.lecturerUpdate.status)}`}
          />
          <CardContent>
            <Typography variant="body2" color="warning.main" gutterBottom>
              Giảng viên đã gửi yêu cầu cập nhật thông tin cá nhân:
            </Typography>
            <Box display="flex" gap={2} mb={2}>
              <Box flex={1}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Họ tên mới:</strong> {lecturerData.lecturerUpdate.fullName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>CCCD mới:</strong> {lecturerData.lecturerUpdate.citizenId}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>SĐT mới:</strong> {lecturerData.lecturerUpdate.phoneNumber}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Ngày sinh mới:</strong> {formatDate(lecturerData.lecturerUpdate.dateOfBirth)}
                </Typography>
              </Box>
              <Box flex={1}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Giới tính mới:</strong> {lecturerData.lecturerUpdate.gender ? "Nam" : "Nữ"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Học vị mới:</strong> {getAcademicRank(lecturerData.lecturerUpdate.academicRank)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Chuyên ngành mới:</strong> {lecturerData.lecturerUpdate.specialization}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Lĩnh vực mới:</strong> {lecturerData.lecturerUpdate.jobField}
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary" mb={2}>
              <strong>Địa chỉ mới:</strong> {lecturerData.lecturerUpdate.address}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              <strong>Tiểu sử mới:</strong> {lecturerData.lecturerUpdate.bio}
            </Typography>
            {lecturerData.lecturerUpdate.adminNote && (
              <Typography variant="body2" color="warning.main" sx={{ fontStyle: 'italic' }}>
                <strong>Ghi chú:</strong> {lecturerData.lecturerUpdate.adminNote}
              </Typography>
            )}
            <Box mt={2} display="flex" gap={2}>
              <Button
                variant="contained"
                color="success"
                onClick={() => setShowApprovalDialog(true)}
              >
                Duyệt yêu cầu
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => setShowApprovalDialog(true)}
              >
                Từ chối yêu cầu
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Form Cards Grid */}
      <Box display="flex" flexDirection={{ xs: "column", lg: "row" }} gap={3}>
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setCitizenId(e.target.value)
                    }
                    fullWidth
                    variant="outlined"
                  />
                  <TextField
                    label="Ngày sinh"
                    value={dateOfBirth}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setDateOfBirth(e.target.value)
                    }
                    fullWidth
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                  />
                </Box>

                <TextField
                  label="Số điện thoại"
                  value={phoneNumber}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPhoneNumber(e.target.value)
                  }
                  fullWidth
                  variant="outlined"
                />

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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setSpecialization(e.target.value)
                    }
                    sx={{ flex: "1 1 auto" }}
                    variant="outlined"
                  />
                </Box>

                <Box display="flex" gap={2}>
                  <TextField
                    label="Lĩnh vực"
                    value={jobField}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setJobField(e.target.value)
                    }
                    sx={{ flex: "1 1 auto" }}
                    variant="outlined"
                  />
                  <TextField
                    label="Năm KN"
                    value={experienceYears}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setExperienceYears(e.target.value)
                    }
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

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Được tạo lúc:{" "}
                  {lecturer?.createdAt
                    ? new Date(lecturer.createdAt).toLocaleString("vi-VN")
                    : "Chưa cập nhật"}
                </Typography>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Cập nhật lúc:{" "}
                  {lecturer?.updatedAt
                    ? new Date(lecturer?.updatedAt).toLocaleString("vi-VN")
                    : "Chưa cập nhật"}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Save Button */}
        <Box display="flex" justifyContent="center" mt={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1.5,
              fontSize: "1rem",
              fontWeight: 600,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
              },
            }}
          >
            Lưu thay đổi
          </Button>
        </Box>
      </Box>

      {/* Approve Lecturer Update Dialog */}
      {lecturerData?.lecturerUpdate && (
        <ApproveLecturerUpdateDialog
          open={showApprovalDialog}
          onClose={() => setShowApprovalDialog(false)}
          lecturer={lecturer}
          lecturerUpdate={lecturerData.lecturerUpdate}
          onDataReloaded={onRefreshData}
        />
      )}

      {/* Confirm Dialog */}
      <GeneralConfirmDialog
        open={confirmOpen}
        title="Xác nhận cập nhật"
        message="Bạn có chắc chắn muốn cập nhật thông tin giảng viên này không?"
        onConfirm={handleConfirm}
        onClose={handleCancel}
      />
    </Box>
  );
};

export default LecturerBasicInfoTab;
