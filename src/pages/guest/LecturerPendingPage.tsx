import {
  Add,
  Assignment as AssignmentIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  Female as FemaleIcon,
  Grade as GradeIcon,
  Link as LinkIcon,
  LocationOn as LocationIcon,
  Male as MaleIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Save as SaveIcon,
  School as SchoolIcon,
  Work as WorkIcon,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Autocomplete,
  Avatar,
  Button,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  alpha,
} from "@mui/material";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import LinearProgress from "@mui/material/LinearProgress";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UploadCertificationModal from "../../components/lecturer-dialog/CreateCertificationDialog";
import CreateDegreeModal from "../../components/lecturer-dialog/CreateDegreeModal";
import { setPendingLecturer } from "../../redux/slice/PendingLectuererSlice";
import { clearUserProfile, setUserProfile } from "../../redux/slice/userSlice";
import { colors } from "../../theme/colors";
import {
  jobFieldAutoComplete,
  majorsAutoComplete,
} from "../../utils/AutoComplete";
import { formatDate, getStatus, getStatusColor } from "../../utils/ChangeText";
import { API } from "../../utils/Fetch";
import { navigateToRole } from "../../utils/navigationRole";
import { validateLecturerInfo } from "../../utils/Validate";
import type { DegreeCreateReq } from "../../types/Degree";
import type { CertificationCreateReq } from "../../types/Certification";

// Cấu hình dayjs locale
dayjs.locale("vi");

const LecturerPendingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pendingLecturer = useSelector((state: any) => state.pendingLecturer);

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

  // DegreeTab-like states
  const [openDegreeModal, setOpenDegreeModal] = useState(false);
  const [editDegree, setEditDegree] = useState<any>(null);
  const [deleteDegreeDialogOpen, setDeleteDegreeDialogOpen] = useState(false);
  const [degreeToDelete, setDegreeToDelete] = useState<any>(null);

  // CertificatesTab-like states
  const [openCertificateModal, setOpenCertificateModal] = useState(false);
  const [editCertificate, setEditCertificate] = useState<any>(null);
  const [deleteCertificateDialogOpen, setDeleteCertificateDialogOpen] =
    useState(false);
  const [certificateToDelete, setCertificateToDelete] = useState<any>(null);

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
        return;
      }
      const updatedPendingLecturer = {
        ...pendingLecturer,
        lecturer: updatedLecturer,
      };
      setOpenConfirmDialog(false);
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

  const handleAddDegree = async (degree: DegreeCreateReq) => {
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
    certification: CertificationCreateReq,
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

  // DegreeTab-like handlers
  const handleOpenDegreeModal = () => {
    setEditDegree(null);
    setOpenDegreeModal(true);
  };

  const handleEditDegreeModal = (degree: any) => {
    setEditDegree(degree);
    setOpenDegreeModal(true);
  };

  const handleCloseDegreeModal = () => {
    setOpenDegreeModal(false);
    setEditDegree(null);
  };

  const handleSubmitDegreeModal = async (degree: any) => {
    try {
      if (editDegree) {
        // Edit mode
        if (degree.status === "APPROVED") {
          const response = await API.user.editDegree(degree);
          if (response.data.success) {
            const updatedResponse = await API.user.getPendingLecturer();
            dispatch(setPendingLecturer(updatedResponse.data.data));
            toast.success("Đã gửi thông tin đến admin");
          }
        } else if (
          degree.status === "REJECTED" ||
          degree.status === "PENDING"
        ) {
          const response = await API.user.updateDegree(degree);
          if (response.data.success) {
            const updatedResponse = await API.user.getPendingLecturer();
            dispatch(setPendingLecturer(updatedResponse.data.data));
            toast.success("Đã gửi thông tin đến admin");
          }
        }
      } else {
        // Add mode
        const response = await API.user.createDegree([degree]);
        if (response.data.success) {
          const updatedResponse = await API.user.getPendingLecturer();
          dispatch(setPendingLecturer(updatedResponse.data.data));
          toast.success("Đã gửi thông tin đến admin");
        }
      }
    } catch (error) {
      console.error("Error saving degree:", error);
      toast.error("Lỗi khi lưu bằng cấp");
    }
    setOpenDegreeModal(false);
    setEditDegree(null);
  };

  const handleDeleteDegreeTab = (degree: any) => {
    setDegreeToDelete(degree);
    setDeleteDegreeDialogOpen(true);
  };

  const handleConfirmDeleteDegreeTab = async () => {
    if (!degreeToDelete) return;
    try {
      await API.user.deleteDegree(degreeToDelete.id);
      const updatedResponse = await API.user.getPendingLecturer();
      dispatch(setPendingLecturer(updatedResponse.data.data));
      toast.success("Xóa thành công");
    } catch (error) {
      console.error("Error deleting degree:", error);
      toast.error("Có lỗi xảy ra khi xóa");
    } finally {
      setDeleteDegreeDialogOpen(false);
      setDegreeToDelete(null);
    }
  };

  const handleCancelDeleteDegreeTab = () => {
    setDeleteDegreeDialogOpen(false);
    setDegreeToDelete(null);
  };

  // CertificatesTab-like handlers
  const handleOpenCertificateModal = () => {
    setEditCertificate(null);
    setOpenCertificateModal(true);
  };

  const handleEditCertificateModal = (certificate: any) => {
    setEditCertificate(certificate);
    setOpenCertificateModal(true);
  };

  const handleCloseCertificateModal = () => {
    setOpenCertificateModal(false);
    setEditCertificate(null);
  };

  const handleSubmitCertificateModal = async (certificate: any) => {
    try {
      if (editCertificate) {
        // Edit mode
        if (certificate.status === "APPROVED") {
          const response = await API.user.editCertification(certificate);
          if (response.data.success) {
            const updatedResponse = await API.user.getPendingLecturer();
            dispatch(setPendingLecturer(updatedResponse.data.data));
            toast.success("Đã gửi thông tin đến admin");
          }
        } else if (
          certificate.status === "REJECTED" ||
          certificate.status === "PENDING"
        ) {
          const response = await API.user.updateCertification(certificate);
          if (response.data.success) {
            const updatedResponse = await API.user.getPendingLecturer();
            dispatch(setPendingLecturer(updatedResponse.data.data));
            toast.success("Đã gửi thông tin đến admin");
          }
        }
      } else {
        // Add mode
        const response = await API.user.createCertification([certificate]);
        if (response.data.success) {
          const updatedResponse = await API.user.getPendingLecturer();
          dispatch(setPendingLecturer(updatedResponse.data.data));
          toast.success("Đã gửi thông tin đến admin");
        }
      }
    } catch (error) {
      console.error("Error saving certification:", error);
      toast.error("Lỗi khi lưu chứng chỉ");
    }
    setOpenCertificateModal(false);
    setEditCertificate(null);
  };

  const handleDeleteCertificateTab = (certificate: any) => {
    setCertificateToDelete(certificate);
    setDeleteCertificateDialogOpen(true);
  };

  const handleConfirmDeleteCertificateTab = async () => {
    if (!certificateToDelete) return;
    try {
      await API.user.deleteCertification(certificateToDelete.id);
      const updatedResponse = await API.user.getPendingLecturer();
      dispatch(setPendingLecturer(updatedResponse.data.data));
      toast.success("Xóa thành công");
    } catch (error) {
      console.error("Error deleting certification:", error);
      toast.error("Có lỗi xảy ra khi xóa");
    } finally {
      setDeleteCertificateDialogOpen(false);
      setCertificateToDelete(null);
    }
  };

  const handleCancelDeleteCertificateTab = () => {
    setDeleteCertificateDialogOpen(false);
    setCertificateToDelete(null);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `
          linear-gradient(135deg, ${colors.background.secondary} 0%, ${alpha(colors.primary[50], 0.3)} 100%),
          url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${colors.primary[100].slice(1)}' fill-opacity='0.02'%3E%3Cpath d='M50 50c27.614 0 50-22.386 50-50H50z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
        `,
        py: 4,
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 50%, ${alpha(colors.primary[100], 0.1)} 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, ${alpha(colors.secondary[100], 0.1)} 0%, transparent 50%)
          `,
          zIndex: -1,
        },
      }}
    >
      <Container maxWidth="xl">
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            background: colors.background.primary,
            border: `1px solid ${colors.border.light}`,
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `
                radial-gradient(circle at 10% 20%, ${alpha(colors.primary[50], 0.3)} 0%, transparent 50%),
                url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${colors.primary[100].slice(1)}' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
              `,
              zIndex: 0,
            },
          }}
        >
          {/* Enhanced Header */}
          <Box
            sx={{
              background: `
                ${colors.background.gradient.primary},
                url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M0 40c20 0 40-20 40-40H0v40zm40 0c0 20 20 40 40 40V40H40z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
              `,
              color: "white",
              p: 6,
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                top: "20%",
                right: "-5%",
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.05)",
                animation: "float 6s ease-in-out infinite",
                "@keyframes float": {
                  "0%, 100%": { transform: "translateY(0px) scale(1)" },
                  "50%": { transform: "translateY(-20px) scale(1.05)" },
                },
              },
            }}
          >
            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Typography
                variant="h3"
                gutterBottom
                sx={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 700,
                  mb: 2,
                  textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                Thông tin giảng viên chờ duyệt
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  opacity: 0.9,
                  fontFamily: "'Inter', sans-serif",
                  maxWidth: 600,
                }}
              >
                Cập nhật và quản lý thông tin hồ sơ giảng viên của bạn
              </Typography>
            </Box>
          </Box>

          <Box sx={{ p: 6, position: "relative", zIndex: 1 }}>
            <Box sx={{ display: "flex", gap: 6, minHeight: "600px" }}>
              {/* Left Side - Enhanced Personal Information */}
              <Box
                sx={{
                  flex: "0 0 40%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                {/* Enhanced Profile Card */}
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    border: `1px solid ${colors.border.light}`,
                    background: `
                      linear-gradient(135deg, ${colors.background.primary} 0%, ${alpha(colors.primary[50], 0.1)} 100%),
                      url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23${colors.primary[100].slice(1)}' fill-opacity='0.03'%3E%3Cpath d='M20 20c0-11.046-8.954-20-20-20v20h20z'/%3E%3C/g%3E%3C/svg%3E")
                    `,
                    overflow: "hidden",
                  }}
                >
                  <CardHeader
                    avatar={
                      <Box sx={{ position: "relative" }}>
                        <Avatar
                          src={lecturer.avatarUrl}
                          alt={lecturer.fullName}
                          sx={{
                            width: 80,
                            height: 80,
                            border: `3px solid ${colors.primary[200]}`,
                            boxShadow: `0 4px 20px ${alpha(colors.primary[500], 0.2)}`,
                          }}
                        />
                      </Box>
                    }
                    title={
                      <Typography
                        variant="h5"
                        sx={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 700,
                          color: colors.text.primary,
                        }}
                      >
                        {fullName || "Chưa cập nhật"}
                      </Typography>
                    }
                    subheader={
                      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                        <Chip
                          label={getStatus(status)}
                          color={getStatusColor(status)}
                          size="small"
                          sx={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 600,
                            boxShadow: `0 2px 8px ${alpha(
                              status === "PENDING"
                                ? colors.warning[500]
                                : status === "APPROVED"
                                  ? colors.success[500]
                                  : colors.error[500],
                              0.2,
                            )}`,
                          }}
                        />
                      </Stack>
                    }
                  />
                  <CardContent sx={{ pt: 0 }}>
                    <Alert
                      severity="info"
                      sx={{
                        borderRadius: 2,
                        backgroundColor: alpha(colors.neutral[100], 0.5),
                      }}
                    >
                      {lecturer.adminNote || "Không có ghi chú"}
                    </Alert>
                  </CardContent>
                </Paper>

                {/* Enhanced Personal Information */}
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    border: `1px solid ${colors.border.light}`,
                    background: colors.background.primary,
                    position: "relative",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: 4,
                      height: "100%",
                      background: colors.background.gradient.primary,
                      borderRadius: "2px 0 0 2px",
                    },
                  }}
                >
                  <CardHeader
                    avatar={
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          background: alpha(colors.primary[500], 0.1),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: `1px solid ${alpha(colors.primary[300], 0.3)}`,
                        }}
                      >
                        <PersonIcon
                          sx={{ color: colors.primary[600], fontSize: 24 }}
                        />
                      </Box>
                    }
                    title={
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 700,
                          color: colors.text.primary,
                        }}
                      >
                        Thông tin cá nhân
                      </Typography>
                    }
                    subheader={
                      <Typography
                        variant="body2"
                        sx={{
                          color: colors.text.tertiary,
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        Thông tin cơ bản và liên lạc
                      </Typography>
                    }
                  />
                  <CardContent>
                    <Stack spacing={3}>
                      <TextField
                        label="Họ và tên"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        fullWidth
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            backgroundColor: colors.background.secondary,
                            transition: "all 0.3s ease",
                            "&:hover": {
                              backgroundColor: colors.background.primary,
                              boxShadow: `0 2px 8px ${alpha(colors.primary[500], 0.1)}`,
                            },
                            "&.Mui-focused": {
                              backgroundColor: colors.background.primary,
                              boxShadow: `0 4px 12px ${alpha(colors.primary[500], 0.15)}`,
                            },
                          },
                        }}
                      />

                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 3,
                        }}
                      >
                        <TextField
                          label="Số CCCD"
                          value={citizenId}
                          onChange={(e) => setCitizenId(e.target.value)}
                          variant="outlined"
                          InputProps={{
                            startAdornment: (
                              <PersonIcon
                                sx={{ mr: 1, color: colors.text.tertiary }}
                              />
                            ),
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                              backgroundColor: colors.background.secondary,
                              "&:hover": {
                                backgroundColor: colors.background.primary,
                              },
                            },
                          }}
                        />
                        <LocalizationProvider
                          dateAdapter={AdapterDayjs}
                          adapterLocale="vi"
                        >
                          <DatePicker
                            label="Ngày sinh"
                            value={dateOfBirth ? dayjs(dateOfBirth) : null}
                            onChange={(newValue) => {
                              if (newValue && dayjs.isDayjs(newValue)) {
                                setDateOfBirth(newValue.format("YYYY-MM-DD"));
                              } else {
                                setDateOfBirth("");
                              }
                            }}
                            format="DD/MM/YYYY"
                            slotProps={{
                              textField: {
                                variant: "outlined",
                                fullWidth: true,
                                InputProps: {
                                  startAdornment: (
                                    <CalendarIcon
                                      sx={{
                                        mr: 1,
                                        color: colors.text.tertiary,
                                      }}
                                    />
                                  ),
                                },
                                sx: {
                                  "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
                                    backgroundColor:
                                      colors.background.secondary,
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                      backgroundColor:
                                        colors.background.primary,
                                      boxShadow: `0 2px 8px ${alpha(colors.primary[500], 0.1)}`,
                                    },
                                    "&.Mui-focused": {
                                      backgroundColor:
                                        colors.background.primary,
                                      boxShadow: `0 4px 12px ${alpha(colors.primary[500], 0.15)}`,
                                    },
                                  },
                                },
                              },
                            }}
                          />
                        </LocalizationProvider>
                      </Box>

                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 3,
                        }}
                      >
                        <TextField
                          label="Số điện thoại"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          variant="outlined"
                          InputProps={{
                            startAdornment: (
                              <PhoneIcon
                                sx={{ mr: 1, color: colors.text.tertiary }}
                              />
                            ),
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                              backgroundColor: colors.background.secondary,
                            },
                          }}
                        />
                        <TextField
                          label="Địa chỉ"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          variant="outlined"
                          InputProps={{
                            startAdornment: (
                              <LocationIcon
                                sx={{ mr: 1, color: colors.text.tertiary }}
                              />
                            ),
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                              backgroundColor: colors.background.secondary,
                            },
                          }}
                        />
                      </Box>

                      <Box>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            mb: 2,
                            color: colors.text.secondary,
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 600,
                          }}
                        >
                          Giới tính
                        </Typography>
                        <Stack direction="row" spacing={2}>
                          <Button
                            variant={gender === true ? "contained" : "outlined"}
                            startIcon={<MaleIcon />}
                            onClick={() => setGender(true)}
                            sx={{
                              borderRadius: 2,
                              px: 3,
                              py: 1,
                              fontFamily: "'Inter', sans-serif",
                              fontWeight: 600,
                              ...(gender === true && {
                                background: colors.background.gradient.primary,
                                boxShadow: `0 4px 12px ${alpha(colors.primary[500], 0.3)}`,
                              }),
                            }}
                          >
                            Nam
                          </Button>
                          <Button
                            variant={
                              gender === false ? "contained" : "outlined"
                            }
                            startIcon={<FemaleIcon />}
                            onClick={() => setGender(false)}
                            sx={{
                              borderRadius: 2,
                              px: 3,
                              py: 1,
                              fontFamily: "'Inter', sans-serif",
                              fontWeight: 600,
                              ...(gender === false && {
                                background: colors.background.gradient.primary,
                                boxShadow: `0 4px 12px ${alpha(colors.primary[500], 0.3)}`,
                              }),
                            }}
                          >
                            Nữ
                          </Button>
                        </Stack>
                      </Box>
                    </Stack>
                  </CardContent>
                </Paper>

                {/* Enhanced Academic Information */}
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    border: `1px solid ${colors.border.light}`,
                    background: colors.background.primary,
                    position: "relative",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: 4,
                      height: "100%",
                      background: colors.background.gradient.secondary,
                      borderRadius: "2px 0 0 2px",
                    },
                  }}
                >
                  <CardHeader
                    avatar={
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          background: alpha(colors.secondary[500], 0.1),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: `1px solid ${alpha(colors.secondary[300], 0.3)}`,
                        }}
                      >
                        <SchoolIcon
                          sx={{ color: colors.secondary[600], fontSize: 24 }}
                        />
                      </Box>
                    }
                    title={
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 700,
                          color: colors.text.primary,
                        }}
                      >
                        Thông tin học thuật
                      </Typography>
                    }
                    subheader={
                      <Typography
                        variant="body2"
                        sx={{
                          color: colors.text.tertiary,
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        Chuyên môn và kinh nghiệm
                      </Typography>
                    }
                  />
                  <CardContent>
                    <Stack spacing={3}>
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 3,
                        }}
                      >
                        <FormControl fullWidth variant="outlined">
                          <InputLabel>Học vị</InputLabel>
                          <Select
                            value={academicRank}
                            onChange={(e) => setAcademicRank(e.target.value)}
                            label="Học vị"
                          >
                            <MenuItem value="KS">Kỹ sư</MenuItem>
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
                              <WorkIcon
                                sx={{ mr: 1, color: colors.text.tertiary }}
                              />
                            ),
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                              backgroundColor: colors.background.secondary,
                            },
                          }}
                        />
                      </Box>

                      <Autocomplete
                        freeSolo // cho phép nhập giá trị không nằm trong danh sách
                        options={majorsAutoComplete}
                        value={specialization}
                        onChange={(_, newValue) =>
                          setSpecialization(newValue || "")
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Chuyên ngành"
                            placeholder="Ví dụ: Công nghệ thông tin, Kinh tế, Y học..."
                            variant="outlined"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                backgroundColor: colors.background.secondary,
                              },
                            }}
                          />
                        )}
                      />

                      <Autocomplete
                        freeSolo // cho phép nhập ngoài danh sách
                        options={jobFieldAutoComplete}
                        value={jobField}
                        onChange={(_, newValue) => setJobField(newValue || "")}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Lĩnh vực công việc"
                            placeholder="Ví dụ: Giáo dục, Công nghệ, Y tế, Kinh doanh..."
                            variant="outlined"
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <>
                                  <WorkIcon
                                    sx={{ mr: 1, color: colors.text.tertiary }}
                                  />
                                  {params.InputProps.startAdornment}
                                </>
                              ),
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                backgroundColor: colors.background.secondary,
                              },
                            }}
                          />
                        )}
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
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            backgroundColor: colors.background.secondary,
                          },
                        }}
                      />

                      {/* Save Changes Button */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          mt: 4,
                        }}
                      >
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
                            px: 6,
                            py: 2,
                            borderRadius: 3,
                            fontWeight: 600,
                            fontSize: "1rem",
                            fontFamily: "'Inter', sans-serif",
                            background: colors.background.gradient.primary,
                            boxShadow: `0 6px 16px ${alpha(colors.primary[500], 0.3)}`,
                            textTransform: "none",
                            "&:hover": {
                              transform: "translateY(-2px)",
                              boxShadow: `0 8px 20px ${alpha(colors.primary[500], 0.4)}`,
                            },
                            "&:disabled": {
                              background: colors.neutral[300],
                              color: colors.neutral[500],
                            },
                            transition: "all 0.3s ease",
                          }}
                        >
                          {loading ? "Đang lưu..." : "Lưu thay đổi"}
                        </Button>
                      </Box>
                    </Stack>
                  </CardContent>
                </Paper>
                <Box>
                  <Box flex={1} flexDirection={"row"} mb={2}>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        fontFamily: "'Inter', sans-serif",
                        mb: 1,
                        display: "block",
                      }}
                    >
                      Ngày tạo
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        fontSize: "1rem",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {lecturer.createdAt
                        ? new Date(lecturer.createdAt).toLocaleString("vi-VN", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Chưa cập nhật"}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: colors.warning[700],
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        fontFamily: "'Inter', sans-serif",
                        mb: 1,
                        display: "block",
                      }}
                    >
                      Cập nhật gần nhất
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: colors.text.primary,
                        fontWeight: 600,
                        fontSize: "1rem",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {lecturer.updatedAt
                        ? new Date(lecturer.updatedAt).toLocaleString("vi-VN", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Chưa cập nhật"}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Right Side - DegreesTab-like Degrees Section */}
              <Box
                sx={{
                  flex: "0 0 60%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                {/* Enhanced Degrees Section */}
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    border: `1px solid ${colors.border.light}`,
                    background: colors.background.primary,
                    flex: 1,
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `
                        radial-gradient(circle at 10% 90%, ${alpha(colors.accent.lightBlue, 0.1)} 0%, transparent 50%),
                        url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23${colors.accent.lightBlue.slice(1)}' fill-opacity='0.02'%3E%3Cpath d='M30 30c16.569 0 30-13.431 30-30H30z'/%3E%3C/g%3E%3C/svg%3E")
                      `,
                      zIndex: 0,
                    },
                  }}
                >
                  <CardHeader
                    avatar={
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          background: alpha(colors.primary[500], 0.1),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: `1px solid ${alpha(colors.primary[300], 0.3)}`,
                        }}
                      >
                        <SchoolIcon
                          sx={{ color: colors.primary[600], fontSize: 24 }}
                        />
                      </Box>
                    }
                    title={
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 700,
                          color: colors.text.primary,
                        }}
                      >
                        Danh sách bằng cấp ({degrees?.length || 0})
                      </Typography>
                    }
                    subheader={
                      <Typography
                        variant="body2"
                        sx={{
                          color: colors.text.tertiary,
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        Quản lý thông tin bằng cấp của bạn
                      </Typography>
                    }
                    action={
                      <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleOpenDegreeModal}
                        sx={{
                          background: colors.background.gradient.primary,
                          color: "white",
                          fontWeight: 600,
                          textTransform: "none",
                          borderRadius: 3,
                          px: 3,
                          py: 1.5,
                          boxShadow: `0 4px 12px ${alpha(colors.primary[500], 0.3)}`,
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: `0 6px 16px ${alpha(colors.primary[500], 0.4)}`,
                          },
                          transition: "all 0.3s ease",
                        }}
                      >
                        Thêm bằng cấp
                      </Button>
                    }
                  />
                  <CardContent
                    sx={{
                      pt: 0,
                      maxHeight: "450px",
                      overflow: "auto",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    {degrees && degrees.length > 0 ? (
                      <Stack spacing={2}>
                        {degrees.map((item: any) => (
                          <Accordion
                            key={item.id}
                            sx={{
                              borderRadius: 3,
                              border: `1px solid ${colors.border.light}`,
                              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                              background: `
                                linear-gradient(135deg, ${colors.background.primary} 0%, ${alpha(colors.primary[50], 0.3)} 100%)
                              `,
                              "&:before": { display: "none" },
                              "&.Mui-expanded": {
                                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                                transform: "translateY(-2px)",
                              },
                              transition: "all 0.3s ease",
                            }}
                          >
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              sx={{
                                background: colors.background.gradient.primary,
                                color: "white",
                                borderRadius: "12px",
                                minHeight: 80,
                                position: "relative",
                                "& .MuiAccordionSummary-expandIconWrapper": {
                                  color: "white",
                                },
                                "&.Mui-expanded": {
                                  borderRadius: "12px 12px 0 0",
                                },
                                "&::after": {
                                  content: '""',
                                  position: "absolute",
                                  bottom: 0,
                                  left: 0,
                                  right: 0,
                                  height: 1,
                                  background: `linear-gradient(90deg, transparent, ${alpha(colors.primary[300], 0.5)}, transparent)`,
                                },
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                  flex: 1,
                                  pr: 2,
                                }}
                              >
                                <Box
                                  sx={{
                                    width: 52,
                                    height: 52,
                                    borderRadius: 2.5,
                                    background: "rgba(255,255,255,0.15)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: "1px solid rgba(255,255,255,0.2)",
                                  }}
                                >
                                  <SchoolIcon
                                    sx={{ color: "white", fontSize: 28 }}
                                  />
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                  <Typography
                                    variant="h6"
                                    sx={{
                                      color: "white",
                                      fontWeight: 700,
                                      fontFamily: "'Inter', sans-serif",
                                      mb: 0.5,
                                    }}
                                  >
                                    {item.name}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color: "rgba(255,255,255,0.85)",
                                      fontFamily: "'Inter', sans-serif",
                                      mb: 0.5,
                                    }}
                                  >
                                    {item.major}
                                  </Typography>
                                  {item.referenceId && (
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: "rgba(255,255,255,0.7)",
                                        fontFamily: "'Inter', sans-serif",
                                        fontSize: "0.7rem",
                                      }}
                                    >
                                      ID: {item.referenceId}
                                    </Typography>
                                  )}
                                </Box>
                                <Chip
                                  label={getStatus(item.status)}
                                  color={getStatusColor(item.status)}
                                  size="small"
                                  sx={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontWeight: 600,
                                    fontSize: "0.75rem",
                                    background: "rgba(255,255,255,0.9)",
                                    color:
                                      item.status === "APPROVED"
                                        ? "#047857"
                                        : item.status === "PENDING"
                                          ? "#D97706"
                                          : "#DC2626",
                                    boxShadow: `0 2px 8px ${alpha(
                                      item.status === "PENDING"
                                        ? colors.warning[500]
                                        : item.status === "APPROVED"
                                          ? colors.success[500]
                                          : colors.error[500],
                                      0.25,
                                    )}`,
                                  }}
                                />
                              </Box>
                            </AccordionSummary>
                            <AccordionDetails
                              sx={{
                                p: 0,
                                background: "white",
                                borderRadius: "0 0 12px 12px",
                              }}
                            >
                              <Box sx={{ p: 3 }}>
                                <Box
                                  sx={{
                                    display: "grid",
                                    gridTemplateColumns:
                                      "repeat(auto-fit, minmax(200px, 1fr))",
                                    gap: 2,
                                    mb: 3,
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1.5,
                                      p: 2,
                                      borderRadius: 2,
                                      background: alpha(
                                        colors.primary[50],
                                        0.5,
                                      ),
                                      border: `1px solid ${alpha(colors.primary[500], 0.3)}`,
                                    }}
                                  >
                                    <BusinessIcon
                                      sx={{
                                        color: colors.primary[600],
                                        fontSize: 20,
                                      }}
                                    />
                                    <Box>
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          color: colors.text.tertiary,
                                          fontWeight: 600,
                                          fontSize: "0.7rem",
                                          textTransform: "uppercase",
                                          letterSpacing: "0.5px",
                                        }}
                                      >
                                        Trường/Tổ chức
                                      </Typography>
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          fontWeight: 600,
                                          color: colors.text.primary,
                                          fontSize: "0.875rem",
                                        }}
                                      >
                                        {item.institution}
                                      </Typography>
                                    </Box>
                                  </Box>

                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1.5,
                                      p: 2,
                                      borderRadius: 2,
                                      background: alpha(
                                        colors.success[50],
                                        0.5,
                                      ),
                                      border: `1px solid ${alpha(colors.success[500], 0.3)}`,
                                    }}
                                  >
                                    <CalendarIcon
                                      sx={{
                                        color: colors.success[600],
                                        fontSize: 20,
                                      }}
                                    />
                                    <Box>
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          color: colors.text.tertiary,
                                          fontWeight: 600,
                                          fontSize: "0.7rem",
                                          textTransform: "uppercase",
                                          letterSpacing: "0.5px",
                                        }}
                                      >
                                        Thời gian học
                                      </Typography>
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          fontWeight: 600,
                                          color: colors.text.primary,
                                          fontSize: "0.875rem",
                                        }}
                                      >
                                        {item.startYear} - {item.graduationYear}
                                      </Typography>
                                    </Box>
                                  </Box>

                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1.5,
                                      p: 2,
                                      borderRadius: 2,
                                      background: alpha(
                                        colors.secondary[50],
                                        0.5,
                                      ),
                                      border: `1px solid ${alpha(colors.secondary[500], 0.3)}`,
                                    }}
                                  >
                                    <GradeIcon
                                      sx={{
                                        color: colors.secondary[600],
                                        fontSize: 20,
                                      }}
                                    />
                                    <Box>
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          color: colors.text.tertiary,
                                          fontWeight: 600,
                                          fontSize: "0.7rem",
                                          textTransform: "uppercase",
                                          letterSpacing: "0.5px",
                                        }}
                                      >
                                        Trình độ
                                      </Typography>
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          fontWeight: 600,
                                          color: colors.text.primary,
                                          fontSize: "0.875rem",
                                        }}
                                      >
                                        {item.level}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Box>

                                {/* Description */}
                                {item.description && (
                                  <Box
                                    sx={{
                                      mb: 3,
                                      p: 3,
                                      borderRadius: 2,
                                      background: alpha(
                                        colors.neutral[50],
                                        0.5,
                                      ),
                                      border: `1px solid ${alpha(colors.neutral[500], 0.3)}`,
                                    }}
                                  >
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: colors.text.tertiary,
                                        fontWeight: 600,
                                        fontSize: "0.7rem",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.5px",
                                        mb: 1,
                                        display: "block",
                                      }}
                                    >
                                      Mô tả
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        color: colors.text.secondary,
                                        lineHeight: 1.6,
                                        fontFamily: "'Inter', sans-serif",
                                      }}
                                    >
                                      {item.description}
                                    </Typography>
                                  </Box>
                                )}

                                {/* Admin Note */}
                                {item.adminNote && (
                                  <Box
                                    sx={{
                                      mb: 3,
                                      p: 3,
                                      borderRadius: 2,
                                      background: alpha(
                                        colors.warning[50],
                                        0.7,
                                      ),
                                      border: `1px solid ${colors.warning[500]}`,
                                      position: "relative",
                                      "&::before": {
                                        content: '""',
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: 4,
                                        height: "100%",
                                        background: colors.warning[500],
                                        borderRadius: "2px 0 0 2px",
                                      },
                                    }}
                                  >
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: colors.warning[700],
                                        fontWeight: 600,
                                        fontSize: "0.7rem",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.5px",
                                        mb: 1,
                                        display: "block",
                                      }}
                                    >
                                      Ghi chú từ quản trị viên
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        color: colors.warning[700],
                                        lineHeight: 1.6,
                                        fontFamily: "'Inter', sans-serif",
                                      }}
                                    >
                                      {item.adminNote}
                                    </Typography>
                                  </Box>
                                )}

                                {/* Action Buttons */}
                                <Box
                                  sx={{
                                    display: "flex",
                                    gap: 2,
                                    flexWrap: "wrap",
                                  }}
                                >
                                  {item.url && (
                                    <Button
                                      variant="contained"
                                      size="small"
                                      startIcon={<LinkIcon />}
                                      href={item.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      sx={{
                                        background:
                                          colors.background.gradient.primary,
                                        color: "white",
                                        fontWeight: 600,
                                        textTransform: "none",
                                        borderRadius: 2,
                                        px: 3,
                                        "&:hover": {
                                          transform: "translateY(-1px)",
                                          boxShadow: `0 4px 12px ${alpha(colors.primary[500], 0.3)}`,
                                        },
                                      }}
                                    >
                                      Xem tài liệu
                                    </Button>
                                  )}
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<EditIcon />}
                                    onClick={() => handleEditDegreeModal(item)}
                                    sx={{
                                      borderColor: colors.primary[500],
                                      color: colors.primary[600],
                                      fontWeight: 600,
                                      textTransform: "none",
                                      borderRadius: 2,
                                      px: 3,
                                      "&:hover": {
                                        borderColor: colors.primary[600],
                                        backgroundColor: colors.primary[50],
                                        transform: "translateY(-1px)",
                                      },
                                    }}
                                  >
                                    Chỉnh sửa
                                  </Button>
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<DeleteIcon />}
                                    onClick={() => handleDeleteDegreeTab(item)}
                                    sx={{
                                      borderColor: colors.error[500],
                                      color: colors.error[600],
                                      fontWeight: 600,
                                      textTransform: "none",
                                      borderRadius: 2,
                                      px: 3,
                                      "&:hover": {
                                        borderColor: colors.error[600],
                                        backgroundColor: colors.error[50],
                                        transform: "translateY(-1px)",
                                      },
                                    }}
                                  >
                                    Xóa
                                  </Button>
                                </Box>
                              </Box>
                            </AccordionDetails>
                          </Accordion>
                        ))}
                      </Stack>
                    ) : (
                      <Box
                        sx={{
                          textAlign: "center",
                          py: 6,
                          px: 4,
                          borderRadius: 3,
                          background: `
                            linear-gradient(135deg, ${alpha(colors.primary[50], 0.3)} 0%, ${alpha(colors.secondary[50], 0.2)} 100%)
                          `,
                          border: `1px solid ${alpha(colors.primary[200], 0.3)}`,
                        }}
                      >
                        <SchoolIcon
                          sx={{
                            fontSize: 64,
                            color: alpha(colors.primary[400], 0.5),
                            mb: 2,
                          }}
                        />
                        <Typography
                          variant="h6"
                          sx={{
                            color: colors.text.secondary,
                            fontWeight: 600,
                            mb: 1,
                            fontFamily: "'Inter', sans-serif",
                          }}
                        >
                          Chưa có bằng cấp nào
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: colors.text.tertiary,
                            mb: 3,
                            fontFamily: "'Inter', sans-serif",
                          }}
                        >
                          Thêm bằng cấp đầu tiên để hoàn thiện hồ sơ của bạn
                        </Typography>
                        <Button
                          variant="contained"
                          startIcon={<Add />}
                          onClick={handleOpenDegreeModal}
                          sx={{
                            background: colors.background.gradient.primary,
                            color: "white",
                            fontWeight: 600,
                            textTransform: "none",
                            borderRadius: 3,
                            px: 4,
                            py: 1.5,
                          }}
                        >
                          Thêm bằng cấp đầu tiên
                        </Button>
                      </Box>
                    )}
                  </CardContent>
                </Paper>
                {/* Enhanced Certifications Section */}
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    border: `1px solid ${colors.border.light}`,
                    background: colors.background.primary,
                    flex: 1,
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `
                        radial-gradient(circle at 10% 90%, ${alpha(colors.accent.lightBlue, 0.1)} 0%, transparent 50%),
                        url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23${colors.accent.lightBlue.slice(1)}' fill-opacity='0.02'%3E%3Cpath d='M30 30c16.569 0 30-13.431 30-30H30z'/%3E%3C/g%3E%3C/svg%3E")
                      `,
                      zIndex: 0,
                    },
                  }}
                >
                  <CardHeader
                    avatar={
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          background: alpha(colors.accent.lightBlue, 0.1),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: `1px solid ${alpha(colors.accent.lightBlue, 0.3)}`,
                        }}
                      >
                        <AssignmentIcon
                          sx={{ color: colors.accent.lightBlue, fontSize: 24 }}
                        />
                      </Box>
                    }
                    title={
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 700,
                          color: colors.text.primary,
                        }}
                      >
                        Danh sách chứng chỉ ({certifications?.length || 0})
                      </Typography>
                    }
                    subheader={
                      <Typography
                        variant="body2"
                        sx={{
                          color: colors.text.tertiary,
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        Quản lý thông tin chứng chỉ của bạn
                      </Typography>
                    }
                    action={
                      <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleOpenCertificateModal}
                        sx={{
                          background: `linear-gradient(135deg, ${colors.accent.lightBlue} 0%, #059669 100%)`,
                          color: "white",
                          fontWeight: 600,
                          textTransform: "none",
                          borderRadius: 3,
                          px: 3,
                          py: 1.5,
                          boxShadow: `0 4px 12px ${alpha(colors.accent.lightBlue, 0.3)}`,
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: `0 6px 16px ${alpha(colors.accent.lightBlue, 0.4)}`,
                          },
                          transition: "all 0.3s ease",
                        }}
                      >
                        Thêm chứng chỉ
                      </Button>
                    }
                  />
                  <CardContent
                    sx={{
                      pt: 0,
                      maxHeight: "450px",
                      overflow: "auto",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    {certifications && certifications.length > 0 ? (
                      <Stack spacing={2}>
                        {certifications.map((item: any) => (
                          <Accordion
                            key={item.id}
                            sx={{
                              borderRadius: 3,
                              border: `1px solid ${colors.border.light}`,
                              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                              background: `
                                linear-gradient(135deg, ${colors.background.primary} 0%, ${alpha(colors.accent.lightBlue, 0.05)} 100%)
                              `,
                              "&:before": { display: "none" },
                              "&.Mui-expanded": {
                                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                                transform: "translateY(-2px)",
                              },
                              transition: "all 0.3s ease",
                            }}
                          >
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              sx={{
                                background: `linear-gradient(135deg, ${colors.accent.lightBlue} 0%, #059669 100%)`,
                                color: "white",
                                borderRadius: "12px",
                                minHeight: 80,
                                position: "relative",
                                "& .MuiAccordionSummary-expandIconWrapper": {
                                  color: "white",
                                },
                                "&.Mui-expanded": {
                                  borderRadius: "12px 12px 0 0",
                                },
                                "&::after": {
                                  content: '""',
                                  position: "absolute",
                                  bottom: 0,
                                  left: 0,
                                  right: 0,
                                  height: 1,
                                  background: `linear-gradient(90deg, transparent, ${alpha(colors.accent.lightBlue, 0.5)}, transparent)`,
                                },
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                  flex: 1,
                                  pr: 2,
                                }}
                              >
                                <Box
                                  sx={{
                                    width: 52,
                                    height: 52,
                                    borderRadius: 2.5,
                                    background: "rgba(255,255,255,0.15)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: "1px solid rgba(255,255,255,0.2)",
                                  }}
                                >
                                  <AssignmentIcon
                                    sx={{ color: "white", fontSize: 28 }}
                                  />
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                  <Typography
                                    variant="h6"
                                    sx={{
                                      color: "white",
                                      fontWeight: 700,
                                      fontFamily: "'Inter', sans-serif",
                                      mb: 0.5,
                                    }}
                                  >
                                    {item.name}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color: "rgba(255,255,255,0.85)",
                                      fontFamily: "'Inter', sans-serif",
                                      mb: 0.5,
                                    }}
                                  >
                                    {item.issuedBy}
                                  </Typography>
                                  {item.referenceId && (
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: "rgba(255,255,255,0.7)",
                                        fontFamily: "'Inter', sans-serif",
                                        fontSize: "0.7rem",
                                      }}
                                    >
                                      ID: {item.referenceId}
                                    </Typography>
                                  )}
                                </Box>
                                <Chip
                                  label={getStatus(item.status)}
                                  color={getStatusColor(item.status)}
                                  size="small"
                                  sx={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontWeight: 600,
                                    fontSize: "0.75rem",
                                    background: "rgba(255,255,255,0.9)",
                                    color:
                                      item.status === "APPROVED"
                                        ? "#047857"
                                        : item.status === "PENDING"
                                          ? "#D97706"
                                          : "#DC2626",
                                    boxShadow: `0 2px 8px ${alpha(
                                      item.status === "PENDING"
                                        ? colors.warning[500]
                                        : item.status === "APPROVED"
                                          ? colors.success[500]
                                          : colors.error[500],
                                      0.25,
                                    )}`,
                                  }}
                                />
                              </Box>
                            </AccordionSummary>
                            <AccordionDetails
                              sx={{
                                p: 0,
                                background: "white",
                                borderRadius: "0 0 12px 12px",
                              }}
                            >
                              <Box sx={{ p: 3 }}>
                                <Box
                                  sx={{
                                    display: "grid",
                                    gridTemplateColumns:
                                      "repeat(auto-fit, minmax(200px, 1fr))",
                                    gap: 2,
                                    mb: 3,
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1.5,
                                      p: 2,
                                      borderRadius: 2,
                                      background: alpha(
                                        colors.accent.lightBlue,
                                        0.1,
                                      ),
                                      border: `1px solid ${alpha(colors.accent.lightBlue, 0.2)}`,
                                    }}
                                  >
                                    <GradeIcon
                                      sx={{
                                        color: colors.accent.lightBlue,
                                        fontSize: 20,
                                      }}
                                    />
                                    <Box>
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          color: colors.text.tertiary,
                                          fontWeight: 600,
                                          fontSize: "0.7rem",
                                          textTransform: "uppercase",
                                          letterSpacing: "0.5px",
                                        }}
                                      >
                                        Cấp độ
                                      </Typography>
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          fontWeight: 600,
                                          color: colors.text.primary,
                                          fontSize: "0.875rem",
                                        }}
                                      >
                                        {item.level}
                                      </Typography>
                                    </Box>
                                  </Box>

                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1.5,
                                      p: 2,
                                      borderRadius: 2,
                                      background: alpha(
                                        colors.success[50],
                                        0.5,
                                      ),
                                      border: `1px solid ${alpha(colors.success[500], 0.3)}`,
                                    }}
                                  >
                                    <BusinessIcon
                                      sx={{
                                        color: colors.success[600],
                                        fontSize: 20,
                                      }}
                                    />
                                    <Box>
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          color: colors.text.tertiary,
                                          fontWeight: 600,
                                          fontSize: "0.7rem",
                                          textTransform: "uppercase",
                                          letterSpacing: "0.5px",
                                        }}
                                      >
                                        Đơn vị cấp
                                      </Typography>
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          fontWeight: 600,
                                          color: colors.text.primary,
                                          fontSize: "0.875rem",
                                        }}
                                      >
                                        {item.issuedBy}
                                      </Typography>
                                    </Box>
                                  </Box>

                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1.5,
                                      p: 2,
                                      borderRadius: 2,
                                      background: alpha(
                                        colors.primary[50],
                                        0.5,
                                      ),
                                      border: `1px solid ${alpha(colors.primary[200], 0.3)}`,
                                    }}
                                  >
                                    <CalendarIcon
                                      sx={{
                                        color: colors.primary[600],
                                        fontSize: 20,
                                      }}
                                    />
                                    <Box>
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          color: colors.text.tertiary,
                                          fontWeight: 600,
                                          fontSize: "0.7rem",
                                          textTransform: "uppercase",
                                          letterSpacing: "0.5px",
                                        }}
                                      >
                                        Ngày cấp
                                      </Typography>
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          fontWeight: 600,
                                          color: colors.text.primary,
                                          fontSize: "0.875rem",
                                        }}
                                      >
                                        {formatDate(item.issueDate)} -{" "}
                                        {formatDate(item.expiryDate) ||
                                          "Không thời hạn"}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Box>

                                {/* Description */}
                                {item.description && (
                                  <Box
                                    sx={{
                                      mb: 3,
                                      p: 3,
                                      borderRadius: 2,
                                      background: alpha(
                                        colors.neutral[50],
                                        0.5,
                                      ),
                                      border: `1px solid ${alpha(colors.neutral[500], 0.3)}`,
                                    }}
                                  >
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: colors.text.tertiary,
                                        fontWeight: 600,
                                        fontSize: "0.7rem",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.5px",
                                        mb: 1,
                                        display: "block",
                                      }}
                                    >
                                      Mô tả
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        color: colors.text.secondary,
                                        lineHeight: 1.6,
                                        fontFamily: "'Inter', sans-serif",
                                      }}
                                    >
                                      {item.description}
                                    </Typography>
                                  </Box>
                                )}

                                {/* Admin Note */}
                                {item.adminNote && (
                                  <Box
                                    sx={{
                                      mb: 3,
                                      p: 3,
                                      borderRadius: 2,
                                      background: alpha(
                                        colors.warning[50],
                                        0.7,
                                      ),
                                      border: `1px solid ${colors.warning[500]}`,
                                      position: "relative",
                                      "&::before": {
                                        content: '""',
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: 4,
                                        height: "100%",
                                        background: colors.warning[500],
                                        borderRadius: "2px 0 0 2px",
                                      },
                                    }}
                                  >
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: colors.warning[700],
                                        fontWeight: 600,
                                        fontSize: "0.7rem",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.5px",
                                        mb: 1,
                                        display: "block",
                                      }}
                                    >
                                      Ghi chú từ quản trị viên
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        color: colors.warning[700],
                                        lineHeight: 1.6,
                                        fontFamily: "'Inter', sans-serif",
                                      }}
                                    >
                                      {item.adminNote}
                                    </Typography>
                                  </Box>
                                )}

                                {/* Action Buttons */}
                                <Box
                                  sx={{
                                    display: "flex",
                                    gap: 2,
                                    flexWrap: "wrap",
                                    pt: 2,
                                    borderTop: `1px solid ${alpha(colors.border.light, 0.5)}`,
                                  }}
                                >
                                  {item.certificateUrl && (
                                    <Button
                                      variant="contained"
                                      size="small"
                                      startIcon={<LinkIcon />}
                                      href={item.certificateUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      sx={{
                                        background: `linear-gradient(135deg, ${colors.accent.lightBlue} 0%, #059669 100%)`,
                                        color: "white",
                                        fontWeight: 600,
                                        textTransform: "none",
                                        borderRadius: 2,
                                        px: 3,
                                        "&:hover": {
                                          transform: "translateY(-1px)",
                                          boxShadow: `0 4px 12px ${alpha(colors.accent.lightBlue, 0.3)}`,
                                        },
                                      }}
                                    >
                                      Xem tài liệu
                                    </Button>
                                  )}
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<EditIcon />}
                                    onClick={() =>
                                      handleEditCertificateModal(item)
                                    }
                                    sx={{
                                      borderColor: colors.accent.lightBlue,
                                      color: colors.accent.lightBlue,
                                      fontWeight: 600,
                                      textTransform: "none",
                                      borderRadius: 2,
                                      px: 3,
                                      "&:hover": {
                                        borderColor: "#047857",
                                        backgroundColor: alpha(
                                          colors.accent.lightBlue,
                                          0.1,
                                        ),
                                        transform: "translateY(-1px)",
                                      },
                                    }}
                                  >
                                    Chỉnh sửa
                                  </Button>
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<DeleteIcon />}
                                    onClick={() =>
                                      handleDeleteCertificateTab(item)
                                    }
                                    sx={{
                                      borderColor: colors.error[500],
                                      color: colors.error[600],
                                      fontWeight: 600,
                                      textTransform: "none",
                                      borderRadius: 2,
                                      px: 3,
                                      "&:hover": {
                                        borderColor: colors.error[600],
                                        backgroundColor: colors.error[50],
                                        transform: "translateY(-1px)",
                                      },
                                    }}
                                  >
                                    Xóa
                                  </Button>
                                </Box>
                              </Box>
                            </AccordionDetails>
                          </Accordion>
                        ))}
                      </Stack>
                    ) : (
                      <Box
                        sx={{
                          textAlign: "center",
                          py: 6,
                          px: 4,
                          borderRadius: 3,
                          background: `
                            linear-gradient(135deg, ${alpha(colors.accent.lightBlue, 0.1)} 0%, ${alpha(colors.success[50], 0.2)} 100%)
                          `,
                          border: `1px solid ${alpha(colors.accent.lightBlue, 0.2)}`,
                        }}
                      >
                        <AssignmentIcon
                          sx={{
                            fontSize: 64,
                            color: alpha(colors.accent.lightBlue, 0.5),
                            mb: 2,
                          }}
                        />
                        <Typography
                          variant="h6"
                          sx={{
                            color: colors.text.secondary,
                            fontWeight: 600,
                            mb: 1,
                            fontFamily: "'Inter', sans-serif",
                          }}
                        >
                          Chưa có chứng chỉ nào
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: colors.text.tertiary,
                            mb: 3,
                            fontFamily: "'Inter', sans-serif",
                          }}
                        >
                          Thêm chứng chỉ đầu tiên để hoàn thiện hồ sơ của bạn
                        </Typography>
                        <Button
                          variant="contained"
                          startIcon={<Add />}
                          onClick={handleOpenCertificateModal}
                          sx={{
                            background: `linear-gradient(135deg, ${colors.accent.lightBlue} 0%, #059669 100%)`,
                            color: "white",
                            fontWeight: 600,
                            textTransform: "none",
                            borderRadius: 3,
                            px: 4,
                            py: 1.5,
                          }}
                        >
                          Thêm chứng chỉ đầu tiên
                        </Button>
                      </Box>
                    )}
                  </CardContent>
                </Paper>
              </Box>
            </Box>

            {loading && (
              <Box sx={{ width: "100%", mt: 3 }}>
                <LinearProgress
                  sx={{
                    borderRadius: 2,
                    height: 6,
                    backgroundColor: alpha(colors.primary[200], 0.3),
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: colors.primary[500],
                      borderRadius: 2,
                    },
                  }}
                />
              </Box>
            )}
          </Box>
        </Paper>

        {/* Floating Background Elements */}
        <Box
          sx={{
            position: "fixed",
            top: "20%",
            right: "10%",
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${alpha(colors.primary[200], 0.1)} 0%, transparent 70%)`,
            animation: "float 8s ease-in-out infinite",
            zIndex: -1,
          }}
        />
        <Box
          sx={{
            position: "fixed",
            bottom: "25%",
            left: "5%",
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${alpha(colors.secondary[200], 0.1)} 0%, transparent 70%)`,
            animation: "float 6s ease-in-out infinite 2s",
            zIndex: -1,
          }}
        />
      </Container>

      <CreateDegreeModal
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

      {/* DegreesTab-like Modal */}
      <CreateDegreeModal
        open={openDegreeModal}
        onClose={handleCloseDegreeModal}
        onSubmit={handleSubmitDegreeModal}
        editMode={!!editDegree}
        editData={editDegree}
      />

      {/* DegreesTab-like Delete Confirmation Dialog */}
      <Dialog
        open={deleteDegreeDialogOpen}
        onClose={handleCancelDeleteDegreeTab}
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 400,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, color: colors.primary[700] }}>
          Xác nhận xóa
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: colors.text.secondary, mb: 2 }}>
            Bạn có chắc chắn muốn xóa bằng cấp này không? Hành động này không
            thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={handleCancelDeleteDegreeTab}
            variant="outlined"
            sx={{
              borderColor: colors.primary[300],
              color: colors.primary[600],
              fontWeight: 600,
              borderRadius: 2,
              textTransform: "none",
              "&:hover": {
                borderColor: colors.primary[400],
                backgroundColor: colors.primary[50],
              },
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleConfirmDeleteDegreeTab}
            variant="contained"
            color="error"
            sx={{
              fontWeight: 600,
              borderRadius: 2,
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#d32f2f",
              },
            }}
          >
            Xác nhận xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* CertificatesTab-like Modal */}
      <UploadCertificationModal
        open={openCertificateModal}
        onClose={handleCloseCertificateModal}
        onSubmit={handleSubmitCertificateModal}
        editMode={!!editCertificate}
        editData={editCertificate}
      />

      {/* CertificatesTab-like Delete Confirmation Dialog */}
      <Dialog
        open={deleteCertificateDialogOpen}
        onClose={handleCancelDeleteCertificateTab}
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 400,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, color: colors.primary[700] }}>
          Xác nhận xóa
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: colors.text.secondary, mb: 2 }}>
            Bạn có chắc chắn muốn xóa chứng chỉ này không? Hành động này không
            thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={handleCancelDeleteCertificateTab}
            variant="outlined"
            sx={{
              borderColor: colors.primary[300],
              color: colors.primary[600],
              fontWeight: 600,
              borderRadius: 2,
              textTransform: "none",
              "&:hover": {
                borderColor: colors.primary[400],
                backgroundColor: colors.primary[50],
              },
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleConfirmDeleteCertificateTab}
            variant="contained"
            color="error"
            sx={{
              fontWeight: 600,
              borderRadius: 2,
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#d32f2f",
              },
            }}
          >
            Xác nhận xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LecturerPendingPage;
