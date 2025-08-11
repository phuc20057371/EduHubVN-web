import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPendingLecturer } from "../../redux/slice/PendingLectuererSlice";
import { API } from "../../utils/Fetch";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  Avatar,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Paper,
  Container,
  Stack,
  CircularProgress,
  Button,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Save as SaveIcon,
  Visibility as VisibilityIcon,
  Male as MaleIcon,
  Female as FemaleIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Work as WorkIcon,
  Add,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import DegreeUpdateDialog from "../../components/DegreeUpdateDialog";
import CertificationUpdateDialog from "../../components/CertificationUpdateDialog";
import UploadDegreeModal from "../../components/UploadDegreeModal";
import UploadCertificationModal from "../../components/UploadCertificationModal";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import { clearUserProfile, setUserProfile } from "../../redux/slice/userSlice";
import { useNavigate } from "react-router-dom";
import { navigateToRole } from "../../utils/navigationRole";
import { toast } from "react-toastify";
import type { DegreeRequest } from "../../types/DegreeRequest";
import type { CertificationRequest } from "../../types/CertificationRequest";
import { validateLecturerInfo } from "../../utils/Validate";

const LecturerPendingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pendingLecturer = useSelector((state: any) => state.pendingLecturer);
  const [openDegreeDialog, setOpenDegreeDialog] = useState(false);
  const [selectedDegree, setSelectedDegree] = useState<any>(null);
  const [openCertificationDialog, setOpenCertificationDialog] = useState(false);
  const [selectedCertification, setSelectedCertification] = useState<any>(null);

  const [openAddDegreeModal, setOpenAddDegreeModal] = useState(false);
  const [openAddCertificationModal, setOpenAddCertificationModal] =
    useState(false);

  // Add states for delete confirmation
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<{
    open: boolean;
    type: "degree" | "certification";
    item: any;
    index: number;
  }>({
    open: false,
    type: "degree",
    item: null,
    index: -1,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await API.user.getUserProfile();
        dispatch(setUserProfile(response.data.data));
        if (response.data.data) {
          navigateToRole(response.data.data, navigate);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchPendingLecturers = async () => {
      try {
        const response = await API.user.getPendingLecturer();
        dispatch(setPendingLecturer(response.data.data));
        console.log("Pending lecturers:", response.data.data);
      } catch (error: any) {
        if (
          error.response?.data?.message?.includes("Không có quyền truy cập")
        ) {
          dispatch(clearUserProfile());
          localStorage.removeItem("accessToken");
          navigate("/guest");

          toast.error(
            "Phiên đăng nhập đã hết hạn hoặc tài khoản không khả dụng.",
          );
        } else {
          toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
        }
      }
    };
    fetchPendingLecturers();
  }, [dispatch]);

  const [citizenId, setCitizenId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState(false);
  const [bio, setBio] = useState("");
  const [address, setAddress] = useState("");
  const [academicRank, setAcademicRank] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [experienceYears, setExperienceYears] = useState(0);
  const [jobField, setJobField] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (pendingLecturer && pendingLecturer.lecturer) {
      setCitizenId(pendingLecturer.lecturer.citizenId || "");
      setPhoneNumber(pendingLecturer.lecturer.phoneNumber || "");
      setFullName(pendingLecturer.lecturer.fullName || "");
      setDateOfBirth(pendingLecturer.lecturer.dateOfBirth || "");
      setGender(pendingLecturer.lecturer.gender || false);
      setBio(pendingLecturer.lecturer.bio || "");
      setAddress(pendingLecturer.lecturer.address || "");
      setAcademicRank(pendingLecturer.lecturer.academicRank || "");
      setSpecialization(pendingLecturer.lecturer.specialization || "");
      setExperienceYears(pendingLecturer.lecturer.experienceYears || 0);
      setJobField(pendingLecturer.lecturer.jobField || "");
      setStatus(pendingLecturer.lecturer.status || "");
    }
  }, [pendingLecturer]);

  useEffect(() => {
    const isChanged = () => {
      if (!pendingLecturer || !pendingLecturer.lecturer) return false;
      const l = pendingLecturer.lecturer;
      return (
        citizenId !== (l.citizenId || "") ||
        phoneNumber !== (l.phoneNumber || "") ||
        fullName !== (l.fullName || "") ||
        dateOfBirth !== (l.dateOfBirth || "") ||
        gender !== (l.gender || false) ||
        bio !== (l.bio || "") ||
        address !== (l.address || "") ||
        academicRank !== (l.academicRank || "") ||
        specialization !== (l.specialization || "") ||
        experienceYears !== (l.experienceYears || 0) ||
        jobField !== (l.jobField || "") ||
        status !== (l.status || "")
      );
    };
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isChanged()) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [
    citizenId,
    phoneNumber,
    fullName,
    dateOfBirth,
    gender,
    bio,
    address,
    academicRank,
    specialization,
    experienceYears,
    jobField,
    status,
    pendingLecturer,
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "success";
      case "REJECTED":
        return "error";
      case "PENDING":
        return "warning";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "Đã duyệt";
      case "REJECTED":
        return "Từ chối";
      case "PENDING":
        return "Chờ duyệt";
      default:
        return status;
    }
  };

  if (!pendingLecturer || !pendingLecturer.lecturer) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            Không có thông tin giảng viên đang chờ duyệt.
          </Typography>
        </Paper>
      </Container>
    );
  }

  const { lecturer, degrees, certifications } = pendingLecturer;
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSaveChanges = () => {
    setOpenConfirmDialog(true);
  };

  const handleConfirmSave = async () => {
    if (!pendingLecturer || !pendingLecturer.lecturer) return;
    setLoading(true);
    try {
      const updatedLecturer = {
        ...pendingLecturer.lecturer,
        citizenId,
        phoneNumber,
        fullName,
        dateOfBirth,
        gender,
        bio,
        address,
        academicRank,
        specialization,
        experienceYears,
        jobField,
      };

      if (validateLecturerInfo(updatedLecturer).success === false) {
        toast.error(validateLecturerInfo(updatedLecturer).error);
        console.log(
          "Validation failed:",
          validateLecturerInfo(updatedLecturer).error,
        );

        return;
      }
      console.log("Updated lecturer:", updatedLecturer);
      const updatedPendingLecturer = {
        ...pendingLecturer,
        lecturer: updatedLecturer,
      };
      setOpenConfirmDialog(false);
      console.log("pendingLecturer sau khi cập nhật:", updatedPendingLecturer);
      const response = await API.user.updatePendingLecturer(
        updatedPendingLecturer,
      );
      if (response.data.success) {
        dispatch(setPendingLecturer(response.data.data));
      }
      toast.success("Đã lưu thay đổi thông tin giảng viên thành công");
    } catch (error: any) {
      if (error.response?.data?.message?.includes("đã tồn tại")) {
        toast.error("Số CCCD/CMND đã được đăng ký trước đó.");
        window.location.reload();
        return;
      } else {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
        window.location.reload();
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddDegree = async (degree: DegreeRequest) => {
    try {
      const response = await API.user.createDegree([degree]);
      if (response.data.success) {
        const updatedResponse = await API.user.getPendingLecturer();
        dispatch(setPendingLecturer(updatedResponse.data.data));
        toast.success("Đã thêm bằng cấp mới thành công");
      }
    } catch (error) {
      console.error("Error adding degree:", error);
      toast.error("Lỗi khi thêm bằng cấp");
    }
  };

  const handleAddCertification = async (
    certification: CertificationRequest,
  ) => {
    try {
      const response = await API.user.createCertification([certification]);
      if (response.data.success) {
        const updatedResponse = await API.user.getPendingLecturer();
        dispatch(setPendingLecturer(updatedResponse.data.data));
        toast.success("Đã thêm chứng chỉ mới thành công");
      }
    } catch (error) {
      console.error("Error adding certification:", error);
      toast.error("Lỗi khi thêm chứng chỉ");
    }
  };

  // Add delete handlers
  const handleDeleteDegree = (degree: any, index: number) => {
    setDeleteConfirmDialog({
      open: true,
      type: "degree",
      item: degree,
      index,
    });
  };

  const handleDeleteCertification = (certification: any, index: number) => {
    setDeleteConfirmDialog({
      open: true,
      type: "certification",
      item: certification,
      index,
    });
  };

  const handleConfirmDelete = async () => {
    const { type, item } = deleteConfirmDialog;

    try {
      if (type === "degree") {
        await API.user.deleteDegree(item.id);
        toast.success("Đã xóa bằng cấp thành công");
      } else {
        await API.user.deleteCertification(item.id);
        toast.success("Đã xóa chứng chỉ thành công");
      }

      // Refresh data after deletion
      const updatedResponse = await API.user.getPendingLecturer();
      dispatch(setPendingLecturer(updatedResponse.data.data));
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      toast.error(
        `Lỗi khi xóa ${type === "degree" ? "bằng cấp" : "chứng chỉ"}`,
      );
    } finally {
      setDeleteConfirmDialog({
        open: false,
        type: "degree",
        item: null,
        index: -1,
      });
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
        {/* Header */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            p: 3,
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Thông tin giảng viên chờ duyệt
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Cập nhật và quản lý thông tin hồ sơ giảng viên
          </Typography>
        </Box>

        <Box sx={{ p: 4 }}>
          <Box sx={{ display: "flex", gap: 4, minHeight: "600px" }}>
            {/* Left Side - Personal Information */}
            <Box
              sx={{
                flex: "0 0 60%",
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              {/* Profile Card */}
              <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
                <CardHeader
                  avatar={
                    <Avatar
                      src={lecturer.avatarUrl}
                      alt={lecturer.fullName}
                      sx={{ width: 80, height: 80 }}
                    />
                  }
                  title={
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {fullName || "Chưa cập nhật"}
                    </Typography>
                  }
                  subheader={
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      <Chip
                        label={getStatusText(status)}
                        color={getStatusColor(status)}
                        size="small"
                      />
                    </Stack>
                  }
                />
                <CardContent sx={{ pt: 0 }}>
                  <TextField
                    label="Ghi chú của admin"
                    value={lecturer.adminNote || "Không có ghi chú"}
                    InputProps={{ readOnly: true }}
                    fullWidth
                    multiline
                    rows={2}
                    variant="outlined"
                  />
                </CardContent>
              </Card>

              {/* Personal Information */}
              <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
                <CardHeader
                  avatar={<PersonIcon color="primary" />}
                  title="Thông tin cá nhân"
                  titleTypographyProps={{ variant: "h6", fontWeight: 600 }}
                />
                <CardContent>
                  <Stack spacing={2}>
                    <TextField
                      label="Họ và tên"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      fullWidth
                      variant="outlined"
                    />

                    <Box sx={{ display: "flex", gap: 2 }}>
                      <TextField
                        label="Số CCCD"
                        value={citizenId}
                        onChange={(e) => setCitizenId(e.target.value)}
                        fullWidth
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <PersonIcon
                              sx={{ mr: 1, color: "text.secondary" }}
                            />
                          ),
                        }}
                      />
                      <TextField
                        label="Ngày sinh"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <CalendarIcon
                              sx={{ mr: 1, color: "text.secondary" }}
                            />
                          ),
                        }}
                      />
                    </Box>

                    <Box sx={{ display: "flex", gap: 2 }}>
                      <TextField
                        label="Số điện thoại"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        fullWidth
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <PhoneIcon
                              sx={{ mr: 1, color: "text.secondary" }}
                            />
                          ),
                        }}
                      />
                      <TextField
                        label="Địa chỉ"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        fullWidth
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <LocationIcon
                              sx={{ mr: 1, color: "text.secondary" }}
                            />
                          ),
                        }}
                      />
                    </Box>

                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{ mb: 1, color: "text.secondary" }}
                      >
                        Giới tính
                      </Typography>
                      <Stack direction="row" spacing={2}>
                        <Button
                          variant={gender === true ? "contained" : "outlined"}
                          startIcon={<MaleIcon />}
                          onClick={() => setGender(true)}
                          size="small"
                        >
                          Nam
                        </Button>
                        <Button
                          variant={gender === false ? "contained" : "outlined"}
                          startIcon={<FemaleIcon />}
                          onClick={() => setGender(false)}
                          size="small"
                        >
                          Nữ
                        </Button>
                      </Stack>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

              {/* Academic Information */}
              <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
                <CardHeader
                  avatar={<SchoolIcon color="primary" />}
                  title="Thông tin học thuật"
                  titleTypographyProps={{ variant: "h6", fontWeight: 600 }}
                />
                <CardContent>
                  <Stack spacing={2}>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel>Học vị</InputLabel>
                        <Select
                          value={academicRank}
                          onChange={(e) => setAcademicRank(e.target.value)}
                          label="Học vị"
                        >
                          <MenuItem value="CN">Cử nhân</MenuItem>
                          <MenuItem value="THS">Thạc sĩ</MenuItem>
                          <MenuItem value="TS">Tiến sĩ</MenuItem>
                          <MenuItem value="PGS">Phó Giáo sư</MenuItem>
                          <MenuItem value="GS">Giáo sư</MenuItem>
                        </Select>
                      </FormControl>
                      <TextField
                        label="Số năm kinh nghiệm"
                        value={experienceYears}
                        type="number"
                        onChange={(e) =>
                          setExperienceYears(Number(e.target.value))
                        }
                        fullWidth
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <WorkIcon sx={{ mr: 1, color: "text.secondary" }} />
                          ),
                        }}
                      />
                    </Box>

                    <TextField
                      label="Chuyên ngành"
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      fullWidth
                      variant="outlined"
                      placeholder="Ví dụ: Công nghệ thông tin, Kinh tế, Y học..."
                    />

                    <TextField
                      label="Lĩnh vực công việc"
                      value={jobField}
                      onChange={(e) => setJobField(e.target.value)}
                      fullWidth
                      variant="outlined"
                      placeholder="Ví dụ: Giáo dục, Công nghệ, Y tế, Kinh doanh..."
                      InputProps={{
                        startAdornment: (
                          <WorkIcon sx={{ mr: 1, color: "text.secondary" }} />
                        ),
                      }}
                    />

                    <TextField
                      label="Giới thiệu"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      fullWidth
                      multiline
                      rows={3}
                      variant="outlined"
                      placeholder="Giới thiệu về kinh nghiệm, thành tích và mục tiêu nghề nghiệp..."
                    />
                  </Stack>
                </CardContent>
              </Card>

              {/* Timestamps */}
              <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
                <CardContent>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <TextField
                      label="Ngày tạo"
                      value={
                        lecturer.createdAt
                          ? new Date(lecturer.createdAt).toLocaleString("vi-VN")
                          : "Chưa cập nhật"
                      }
                      InputProps={{ readOnly: true }}
                      fullWidth
                      variant="outlined"
                      size="small"
                    />
                    <TextField
                      label="Cập nhật gần nhất"
                      value={
                        lecturer.updatedAt
                          ? new Date(lecturer.updatedAt).toLocaleString("vi-VN")
                          : "Chưa cập nhật"
                      }
                      InputProps={{ readOnly: true }}
                      fullWidth
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Box>

            {/* Right Side - Degrees and Certifications */}
            <Box
              sx={{
                flex: "0 0 40%",
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              {/* Degrees */}
              <Card sx={{ borderRadius: 2, boxShadow: 2, flex: 1 }}>
                <CardHeader
                  avatar={<SchoolIcon color="primary" />}
                  title="Bằng cấp"
                  titleTypographyProps={{ variant: "h6", fontWeight: 600 }}
                  subheader={`${degrees?.length || 0} bằng cấp`}
                  action={
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<Add />}
                      onClick={() => setOpenAddDegreeModal(true)}
                      sx={{
                        borderRadius: 2,
                        background:
                          "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                        boxShadow: "0 3px 8px rgba(33, 203, 243, .3)",
                        "&:hover": {
                          background:
                            "linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)",
                          transform: "translateY(-1px)",
                          boxShadow: "0 4px 12px rgba(33, 203, 243, .4)",
                        },
                      }}
                    >
                      Thêm mới
                    </Button>
                  }
                />
                <CardContent
                  sx={{ pt: 0, maxHeight: "400px", overflow: "auto" }}
                >
                  {degrees && degrees.length > 0 ? (
                    <Stack spacing={2}>
                      {degrees.map((deg: any, index: number) => (
                        <Paper
                          key={deg.id}
                          variant="outlined"
                          sx={{ borderRadius: 2 }}
                        >
                          <Accordion
                            sx={{
                              boxShadow: "none",
                              "&:before": { display: "none" },
                            }}
                          >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  width: "100%",
                                }}
                              >
                                <Box sx={{ flexGrow: 1 }}>
                                  <Typography
                                    variant="subtitle2"
                                    sx={{ fontWeight: 600 }}
                                  >
                                    {deg.name}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {deg.level} • {deg.institution}
                                  </Typography>
                                </Box>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <Chip
                                    label={getStatusText(deg.status)}
                                    color={getStatusColor(deg.status)}
                                    size="small"
                                  />
                                  <Button
                                    variant="outlined"
                                    color="error"
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteDegree(deg, index);
                                    }}
                                    sx={{
                                      minWidth: "auto",
                                      width: 32,
                                      height: 32,
                                      p: 0,
                                      borderRadius: 1,
                                    }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </Button>
                                </Box>
                              </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Stack spacing={1}>
                                <Typography variant="body2">
                                  <strong>Chuyên ngành:</strong> {deg.major}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Thời gian:</strong> {deg.startYear} -{" "}
                                  {deg.graduationYear}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Mô tả:</strong> {deg.description}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Ghi chú admin:</strong>{" "}
                                  {deg.adminNote || "Không có"}
                                </Typography>
                                <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<VisibilityIcon />}
                                    href={deg.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    Xem file
                                  </Button>
                                  <Button
                                    variant="contained"
                                    size="small"
                                    startIcon={<VisibilityIcon />}
                                    onClick={() => {
                                      setSelectedDegree(deg);
                                      setOpenDegreeDialog(true);
                                    }}
                                  >
                                    Chi tiết
                                  </Button>
                                  <Button
                                    variant="outlined"
                                    color="error"
                                    size="small"
                                    startIcon={<DeleteIcon />}
                                    onClick={() =>
                                      handleDeleteDegree(deg, index)
                                    }
                                    sx={{
                                      "&:hover": {
                                        backgroundColor:
                                          "rgba(211, 47, 47, 0.08)",
                                      },
                                    }}
                                  >
                                    Xóa
                                  </Button>
                                </Box>
                              </Stack>
                            </AccordionDetails>
                          </Accordion>
                        </Paper>
                      ))}
                    </Stack>
                  ) : (
                    <Box sx={{ textAlign: "center", py: 6 }}>
                      <SchoolIcon
                        sx={{ fontSize: 64, color: "text.disabled", mb: 2 }}
                      />
                      <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        Chưa có bằng cấp nào
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.disabled"
                        sx={{ mb: 3 }}
                      >
                        Thêm bằng cấp để nâng cao uy tín chuyên môn
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => setOpenAddDegreeModal(true)}
                        sx={{
                          borderRadius: 2,
                          background:
                            "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                        }}
                      >
                        Thêm bằng cấp đầu tiên
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>

              {/* Certifications */}
              <Card sx={{ borderRadius: 2, boxShadow: 2, flex: 1 }}>
                <CardHeader
                  avatar={<AssignmentIcon color="primary" />}
                  title="Chứng chỉ"
                  titleTypographyProps={{ variant: "h6", fontWeight: 600 }}
                  subheader={`${certifications?.length || 0} chứng chỉ`}
                  action={
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<Add />}
                      onClick={() => setOpenAddCertificationModal(true)}
                      sx={{
                        borderRadius: 2,
                        background:
                          "linear-gradient(45deg, #9C27B0 30%, #E91E63 90%)",
                        boxShadow: "0 3px 8px rgba(156, 39, 176, .3)",
                        "&:hover": {
                          background:
                            "linear-gradient(45deg, #7B1FA2 30%, #C2185B 90%)",
                          transform: "translateY(-1px)",
                          boxShadow: "0 4px 12px rgba(156, 39, 176, .4)",
                        },
                      }}
                    >
                      Thêm mới
                    </Button>
                  }
                />
                <CardContent
                  sx={{ pt: 0, maxHeight: "400px", overflow: "auto" }}
                >
                  {certifications && certifications.length > 0 ? (
                    <Stack spacing={2}>
                      {certifications.map((cert: any, index: number) => (
                        <Paper
                          key={cert.id}
                          variant="outlined"
                          sx={{ borderRadius: 2 }}
                        >
                          <Accordion
                            sx={{
                              boxShadow: "none",
                              "&:before": { display: "none" },
                            }}
                          >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  width: "100%",
                                }}
                              >
                                <Box sx={{ flexGrow: 1 }}>
                                  <Typography
                                    variant="subtitle2"
                                    sx={{ fontWeight: 600 }}
                                  >
                                    {cert.name}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {cert.level} • {cert.issuedBy}
                                  </Typography>
                                </Box>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <Chip
                                    label={getStatusText(cert.status)}
                                    color={getStatusColor(cert.status)}
                                    size="small"
                                  />
                                  <Button
                                    variant="outlined"
                                    color="error"
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteCertification(cert, index);
                                    }}
                                    sx={{
                                      minWidth: "auto",
                                      width: 32,
                                      height: 32,
                                      p: 0,
                                      borderRadius: 1,
                                    }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </Button>
                                </Box>
                              </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Stack spacing={1}>
                                <Typography variant="body2">
                                  <strong>Ngày cấp:</strong> {cert.issueDate}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Ngày hết hạn:</strong>{" "}
                                  {cert.expiryDate}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Mô tả:</strong> {cert.description}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Ghi chú admin:</strong>{" "}
                                  {cert.adminNote || "Không có"}
                                </Typography>
                                <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<VisibilityIcon />}
                                    href={cert.certificateUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    Xem file
                                  </Button>
                                  <Button
                                    variant="contained"
                                    size="small"
                                    startIcon={<VisibilityIcon />}
                                    onClick={() => {
                                      setSelectedCertification(cert);
                                      setOpenCertificationDialog(true);
                                    }}
                                  >
                                    Chi tiết
                                  </Button>
                                  <Button
                                    variant="outlined"
                                    color="error"
                                    size="small"
                                    startIcon={<DeleteIcon />}
                                    onClick={() =>
                                      handleDeleteCertification(cert, index)
                                    }
                                    sx={{
                                      "&:hover": {
                                        backgroundColor:
                                          "rgba(211, 47, 47, 0.08)",
                                      },
                                    }}
                                  >
                                    Xóa
                                  </Button>
                                </Box>
                              </Stack>
                            </AccordionDetails>
                          </Accordion>
                        </Paper>
                      ))}
                    </Stack>
                  ) : (
                    <Box sx={{ textAlign: "center", py: 6 }}>
                      <AssignmentIcon
                        sx={{ fontSize: 64, color: "text.disabled", mb: 2 }}
                      />
                      <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        Chưa có chứng chỉ nào
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.disabled"
                        sx={{ mb: 3 }}
                      >
                        Thêm chứng chỉ để chứng minh năng lực chuyên môn
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => setOpenAddCertificationModal(true)}
                        sx={{
                          borderRadius: 2,
                          background:
                            "linear-gradient(45deg, #9C27B0 30%, #E91E63 90%)",
                        }}
                      >
                        Thêm chứng chỉ đầu tiên
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Box>
          </Box>

          {/* Save Button */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={
                loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <SaveIcon />
                )
              }
              onClick={handleSaveChanges}
              disabled={loading}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
                },
              }}
            >
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </Box>

          {loading && (
            <Box sx={{ width: "100%", mt: 2 }}>
              <LinearProgress />
            </Box>
          )}
        </Box>
      </Paper>

      {/* Dialogs */}
      <DegreeUpdateDialog
        open={openDegreeDialog}
        onClose={() => {
          setOpenDegreeDialog(false);
          setSelectedDegree(null);
        }}
        data={selectedDegree}
      />
      <CertificationUpdateDialog
        open={openCertificationDialog}
        onClose={() => {
          setOpenCertificationDialog(false);
          setSelectedCertification(null);
        }}
        data={selectedCertification}
      />
      <UploadDegreeModal
        open={openAddDegreeModal}
        onClose={() => setOpenAddDegreeModal(false)}
        onSubmit={handleAddDegree}
        editMode={false}
      />
      <UploadCertificationModal
        open={openAddCertificationModal}
        onClose={() => setOpenAddCertificationModal(false)}
        onSubmit={handleAddCertification}
        editMode={false}
      />

      {/* Confirmation Dialog */}
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Xác nhận lưu thay đổi
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn lưu các thay đổi thông tin giảng viên? Thông
            tin sẽ được cập nhật và gửi lại để admin xem xét.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setOpenConfirmDialog(false)}
            variant="outlined"
          >
            Hủy bỏ
          </Button>
          <Button
            onClick={handleConfirmSave}
            variant="contained"
            sx={{ ml: 2 }}
          >
            Xác nhận lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmDialog.open}
        onClose={() =>
          setDeleteConfirmDialog({ ...deleteConfirmDialog, open: false })
        }
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <DeleteIcon color="error" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Xác nhận xóa{" "}
              {deleteConfirmDialog.type === "degree" ? "bằng cấp" : "chứng chỉ"}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Bạn có chắc chắn muốn xóa{" "}
              {deleteConfirmDialog.type === "degree" ? "bằng cấp" : "chứng chỉ"}{" "}
              này không?
            </Typography>
            {deleteConfirmDialog.item && (
              <Box
                sx={{
                  p: 2,
                  backgroundColor: "grey.50",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "grey.200",
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  {deleteConfirmDialog.item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {deleteConfirmDialog.type === "degree"
                    ? `${deleteConfirmDialog.item.level} • ${deleteConfirmDialog.item.institution}`
                    : `${deleteConfirmDialog.item.level} • ${deleteConfirmDialog.item.issuedBy}`}
                </Typography>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              p: 2,
              backgroundColor: "error.lighter",
              borderRadius: 2,
              border: "1px solid",
              borderColor: "error.light",
            }}
          >
            <Typography
              variant="body2"
              color="error.main"
              sx={{ fontWeight: 500 }}
            >
              ⚠️ Lưu ý: Hành động này không thể hoàn tác.{" "}
              {deleteConfirmDialog.type === "degree" ? "Bằng cấp" : "Chứng chỉ"}{" "}
              sẽ bị xóa vĩnh viễn khỏi hệ thống.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() =>
              setDeleteConfirmDialog({ ...deleteConfirmDialog, open: false })
            }
            variant="outlined"
            sx={{ minWidth: 100 }}
          >
            Hủy bỏ
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            sx={{
              ml: 2,
              minWidth: 100,
              "&:hover": {
                backgroundColor: "error.dark",
              },
            }}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LecturerPendingPage;
