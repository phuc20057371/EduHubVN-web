import {
  Button,
  MenuItem,
  TextField,
  Paper,
  Card,
  CardContent,
  Chip,
  Typography,
  IconButton,
  Container,
  Alert,
  AlertTitle,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  Autocomplete,
  Avatar,
  Divider,
  Tooltip,
  Fade,
  Slide,
  Box,
  alpha,
} from "@mui/material";
import { useEffect, useState } from "react";
import UploadDegreeModal from "../../components/UploadDegreeModal";
import type { DegreeRequest } from "../../types/DegreeRequest";
import UploadCertificationModal from "../../components/UploadCertificationModal";
import type { CertificationRequest } from "../../types/CertificationRequest";
import { API } from "../../utils/Fetch";
import { useNavigate } from "react-router-dom";
import {
  Person,
  School,
  Delete,
  Add,
  CheckCircle,
  Badge,
  Work,
  Edit,
  Description,
  AccountCircle,
  ArrowBack,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import {
  getAcademicRankLabel,
  jobFieldsAutoComplete,
  majorAutoComplete,
} from "../../utils/ValidateRegisterLecturer";
import { validateLecturerInfo } from "../../utils/Validate";
import { useSelector } from "react-redux";
import { colors } from "../../theme/colors";

const RegisterLecturer = () => {
  const steps = [
    {
      label: "Thông tin cá nhân",
      icon: <Person />,
      description: "Điền thông tin cơ bản",
    },
    {
      label: "Chứng chỉ và bằng cấp",
      icon: <School />,
      description: "Tải lên bằng cấp",
    },
    {
      label: "Xác nhận và hoàn tất",
      icon: <CheckCircle />,
      description: "Xem lại thông tin",
    },
  ];

  const navigate = useNavigate();
  const userProfile = useSelector((state: any) => state.userProfile);

  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const savedData = JSON.parse(
    localStorage.getItem("registerLecturerForm") || "{}",
  );

  const [citizenId, setCitizenId] = useState(savedData.citizenId || "");
  const [phoneNumber, setPhoneNumber] = useState(savedData.phoneNumber || "");
  const [fullName, setFullName] = useState(savedData.fullName || "");
  const [dateOfBirth, setDateOfBirth] = useState(savedData.dateOfBirth || "");
  const [gender, setGender] = useState(savedData.gender || "");
  const [bio, setBio] = useState(savedData.bio || "");
  const [address, setAddress] = useState(savedData.address || "");
  const [academicRank, setAcademicRank] = useState(
    savedData.academicRank || "",
  );
  const [specialization, setSpecialization] = useState(
    savedData.specialization || "",
  );
  const [experienceYears, setExperienceYears] = useState(
    savedData.experienceYears || "",
  );
  const [jobField, setJobField] = useState(savedData.jobField || "");

  const [openModal, setOpenModal] = useState(false);
  const [degrees, setDegrees] = useState<DegreeRequest[]>([]);
  const [certifications, setCertifications] = useState<CertificationRequest[]>(
    [],
  );
  const [openCertificationModal, setOpenCertificationModal] = useState(false);

  // Add edit mode states
  const [editingDegreeIndex, setEditingDegreeIndex] = useState<number | null>(
    null,
  );
  const [editingCertificationIndex, setEditingCertificationIndex] = useState<
    number | null
  >(null);

  const personalInfo = [
    {
      label: "Họ tên",
      value: fullName,
    },
    {
      label: "CCCD",
      value: citizenId,
    },
    {
      label: "Điện thoại",
      value: phoneNumber,
    },
    {
      label: "Ngày sinh",
      value: new Date(dateOfBirth).toLocaleDateString("vi-VN"),
    },
    {
      label: "Giới tính",
      value: gender === "male" ? "Nam" : gender === "female" ? "Nữ" : "Khác",
    },
    {
      label: "Địa chỉ",
      value: address,
    },
    {
      label: "Học hàm",
      value: getAcademicRankLabel(academicRank),
    },
    {
      label: "Chuyên ngành",
      value: specialization,
    },
    {
      label: "Lĩnh vực",
      value: jobField,
    },
    {
      label: "Kinh nghiệm",
      value: `${experienceYears} năm`,
    },
  ];

  const handleDeleteDegree = (indexToDelete: number) => {
    setDegrees((prev) => prev.filter((_, index) => index !== indexToDelete));
  };

  const handleDeleteCertification = (indexToDelete: number) => {
    setCertifications((prev) =>
      prev.filter((_, index) => index !== indexToDelete),
    );
  };

  // Add edit handlers
  const handleEditDegree = (index: number) => {
    setEditingDegreeIndex(index);
    setOpenModal(true);
  };

  const handleEditCertification = (index: number) => {
    setEditingCertificationIndex(index);
    setOpenCertificationModal(true);
  };

  const handleSubmitDegree = (degree: DegreeRequest) => {
    if (editingDegreeIndex !== null) {
      // Update existing degree
      setDegrees((prev) =>
        prev.map((item, index) =>
          index === editingDegreeIndex ? degree : item,
        ),
      );
      setEditingDegreeIndex(null);
    } else {
      // Add new degree
      setDegrees((prev) => [...prev, degree]);
    }
  };

  const handleSubmitCertification = (cert: CertificationRequest) => {
    if (editingCertificationIndex !== null) {
      // Update existing certification
      setCertifications((prev) =>
        prev.map((item, index) =>
          index === editingCertificationIndex ? cert : item,
        ),
      );
      setEditingCertificationIndex(null);
    } else {
      // Add new certification
      setCertifications((prev) => [...prev, cert]);
    }
  };

  const handleCloseDegreeModal = () => {
    setOpenModal(false);
    setEditingDegreeIndex(null);
  };

  const handleCloseCertificationModal = () => {
    setOpenCertificationModal(false);
    setEditingCertificationIndex(null);
  };

  const isStepOptional = (step: number) => {
    return step === 1;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = async () => {
    if (activeStep === 0) {
      const formData = {
        fullName: fullName || "",
        citizenId: citizenId || "",
        gender: gender || "",
        phoneNumber: phoneNumber || "",
        dateOfBirth: dateOfBirth || "",
        academicRank: academicRank || "",
        specialization: specialization || "",
        experienceYears: experienceYears || "",
        jobField: jobField || "",
        address: address || "",
        bio: bio || "",
      };

      console.log("Form data before validation:", formData);

      if (!validateLecturerInfo(formData).success) {
        toast.error(validateLecturerInfo(formData).error);
        return;
      }
    }

    if (activeStep === 2) {
      setIsSubmitting(true);
      const lecturerData = {
        citizenId: citizenId || "",
        phoneNumber: phoneNumber || "",
        fullName: fullName || "",
        dateOfBirth: dateOfBirth || "",
        gender: gender === "male" ? true : false,
        bio: bio || "",
        address: address || "",
        academicRank: academicRank || "",
        specialization: specialization || "",
        experienceYears: Number(experienceYears) || 0,
        avatarUrl: "",
        jobField: jobField || "",
      };
      try {
        console.log("📤 Gửi dữ liệu giảng viên:", lecturerData);

        const response = await API.user.registerLecturer(lecturerData);
        console.log("✅ Dữ liệu giảng viên đã gửi thành công:", response.data);
        if (degrees.length > 0) {
          await API.user.createDegree(degrees);
        }
        if (certifications.length > 0) {
          await API.user.createCertification(certifications);
        }

        localStorage.removeItem("registerLecturerForm");
        navigate("/pending-lecturer", { replace: true });
        const res = await API.other.sendEmail({
          to: userProfile.email,
          subject: "Xác nhận đăng ký tài khoản Giảng Viên thành công",
          body: `
            <div style="font-family: Arial, sans-serif; background: #f6f8fa; padding: 32px;">
              <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 32px;">
                <h2 style="color: #2563eb; margin-bottom: 16px;">Chúc mừng bạn đã đăng ký thành công!</h2>
                <p style="font-size: 16px; color: #333;">
                  Xin chào <strong>${userProfile.fullName || ""}</strong>,<br/><br/>
                  Bạn đã đăng ký tài khoản Giảng Viên trên hệ thống <strong>EduHubVN</strong> thành công.<br/>
                  Hồ sơ của bạn đang được <span style="color: #f59e42; font-weight: bold;">chờ phê duyệt</span> bởi quản trị viên.<br/><br/>
                  <b>Thông tin đăng ký:</b><br/>
                  - Họ tên: ${lecturerData.fullName || ""}<br/>
                  - Email: ${userProfile.email}<br/>
                  <br/>
                  Chúng tôi sẽ kiểm tra thông tin và cập nhật trạng thái hồ sơ của bạn trong thời gian sớm nhất.<br/>
                  Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ qua email: <a href="mailto:support@eduhubvn.com">support@eduhubvn.com</a>.<br/><br/>
                  Trân trọng,<br/>
                  <span style="color: #2563eb; font-weight: bold;">EduHubVN Team</span>
                </p>
                <hr style="margin: 32px 0; border: none; border-top: 1px solid #eee;" />
                <div style="font-size: 13px; color: #888;">
                  Đây là email tự động, vui lòng không trả lời trực tiếp email này.
                </div>
              </div>
            </div>
          `,
        });
        console.log("✅ Email xác nhận đã gửi thành công:", res.data);

      } catch (error: any) {
        if (error.response?.data?.message?.includes("đã tồn tại")) {
          toast.error("Số CCCD/CMND đã được đăng ký trước đó.");
          setActiveStep(0);
          setSkipped(new Set([0])); // Reset to first step
          return;
        } else {
          toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
          return;
        }
      } finally {
        setIsSubmitting(false);
      }
    }

    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleBackToHome = () => {
    navigate(-1);
  };

  useEffect(() => {
    const formData = {
      citizenId: citizenId || "",
      phoneNumber: phoneNumber || "",
      fullName: fullName || "",
      dateOfBirth: dateOfBirth || "",
      gender: gender || "",
      bio: bio || "",
      address: address || "",
      academicRank: academicRank || "",
      specialization: specialization || "",
      experienceYears: experienceYears || "",
      jobField: jobField || "",
    };
    localStorage.setItem("registerLecturerForm", JSON.stringify(formData));
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
  ]);

  const renderPersonalInfoStep = () => (
    <Fade in={activeStep === 0} timeout={500}>
      <Box sx={{ mx: "auto", mt: 4, maxWidth: "1200px", px: 2 }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            background: colors.background.primary,
            border: `1px solid ${colors.border.light}`,
            overflow: "hidden",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `
                radial-gradient(circle at 20% 80%, ${alpha(colors.primary[100], 0.4)} 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, ${alpha(colors.secondary[100], 0.4)} 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, ${alpha(colors.accent.lightBlue, 0.1)} 0%, transparent 50%)
              `,
              zIndex: 0,
            },
          }}
        >
          {/* Enhanced Header with Pattern */}
          <Box
            sx={{
              background: `
                linear-gradient(135deg, ${colors.primary[600]} 0%, ${colors.secondary[600]} 100%),
                url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
              `,
              px: 6,
              py: 8,
              color: "white",
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%)",
                zIndex: 1,
              },
              "&::after": {
                content: '""',
                position: "absolute",
                top: "-50%",
                right: "-10%",
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.05)",
                zIndex: 0,
              },
            }}
          >
            <Box sx={{ textAlign: "center", position: "relative", zIndex: 2 }}>
              <Box
                sx={{
                  position: "relative",
                  display: "inline-block",
                  mb: 3,
                }}
              >
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: "rgba(255,255,255,0.2)",
                    backdropFilter: "blur(20px)",
                    border: "2px solid rgba(255,255,255,0.3)",
                    mx: "auto",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <Person sx={{ fontSize: 40 }} />
                </Avatar>
                {/* Floating particles */}
                <Box
                  sx={{
                    position: "absolute",
                    top: -10,
                    right: -10,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.3)",
                    animation: "float 3s ease-in-out infinite",
                    "@keyframes float": {
                      "0%, 100%": { transform: "translateY(0px)" },
                      "50%": { transform: "translateY(-10px)" },
                    },
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: -5,
                    left: -15,
                    width: 15,
                    height: 15,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.2)",
                    animation: "float 3s ease-in-out infinite 1s",
                  }}
                />
              </Box>
              
              <Typography
                variant="h3"
                sx={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 700,
                  mb: 2,
                  textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  background: "linear-gradient(45deg, #fff 30%, rgba(255,255,255,0.8) 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Thông tin cá nhân
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "'Inter', sans-serif",
                  opacity: 0.9,
                  maxWidth: 600,
                  mx: "auto",
                  lineHeight: 1.6,
                }}
              >
                Vui lòng điền đầy đủ thông tin để hoàn tất quá trình đăng ký giảng viên
              </Typography>
            </Box>
          </Box>

          {/* Form Content with Enhanced Background */}
          <Box sx={{ p: 6, position: "relative", zIndex: 1 }}>
            {/* Basic Information Section */}
            <Box sx={{ mb: 8 }}>
              <Box 
                sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  mb: 4,
                  position: "relative",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    left: -20,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 4,
                    height: 40,
                    background: colors.background.gradient.primary,
                    borderRadius: 2,
                  },
                }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 3,
                    background: `
                      linear-gradient(135deg, ${alpha(colors.primary[500], 0.1)} 0%, ${alpha(colors.primary[300], 0.05)} 100%),
                      url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23${colors.primary[200].slice(1)}' fill-opacity='0.1'%3E%3Cpath d='M0 0h20v20H0V0zm10 18a8 8 0 100-16 8 8 0 000 16z'/%3E%3C/g%3E%3C/svg%3E")
                    `,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 3,
                    border: `1px solid ${alpha(colors.primary[300], 0.3)}`,
                    boxShadow: `0 4px 12px ${alpha(colors.primary[500], 0.1)}`,
                  }}
                >
                  <AccountCircle sx={{ fontSize: 28, color: colors.primary[600] }} />
                </Box>
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 700,
                      color: colors.text.primary,
                      mb: 0.5,
                    }}
                  >
                    Thông tin cơ bản
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: colors.text.tertiary,
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Thông tin định danh và liên hệ của bạn
                  </Typography>
                </Box>
              </Box>

              {/* Enhanced Form Fields */}
              <Box sx={{ display: "grid", gap: 4 }}>
                <TextField
                  fullWidth
                  label="Họ và tên"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      background: `
                        linear-gradient(135deg, ${colors.background.secondary} 0%, rgba(255,255,255,0.8) 100%),
                        url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23${colors.primary[100].slice(1)}' fill-opacity='0.03'%3E%3Cpath d='M20 20c0-11.046-8.954-20-20-20v20h20z'/%3E%3C/g%3E%3C/svg%3E")
                      `,
                      transition: "all 0.3s ease",
                      border: `1px solid ${colors.border.light}`,
                      position: "relative",
                      "&:hover": {
                        background: colors.background.primary,
                        borderColor: colors.primary[300],
                        boxShadow: `0 4px 12px ${alpha(colors.primary[500], 0.15)}`,
                        transform: "translateY(-2px)",
                      },
                      "&.Mui-focused": {
                        background: colors.background.primary,
                        borderColor: colors.primary[500],
                        boxShadow: `0 4px 20px ${alpha(colors.primary[500], 0.2)}`,
                        transform: "translateY(-2px)",
                      },
                    },
                  }}
                />

                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 4 }}>
                  <TextField
                    fullWidth
                    label="Số CCCD/CMND"
                    value={citizenId}
                    onChange={(e) => setCitizenId(e.target.value)}
                    required
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        backgroundColor: colors.background.secondary,
                        transition: "all 0.3s ease",
                        border: `1px solid ${colors.border.light}`,
                        "&:hover": {
                          backgroundColor: colors.background.primary,
                          borderColor: colors.primary[300],
                        },
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        backgroundColor: colors.background.secondary,
                        transition: "all 0.3s ease",
                        border: `1px solid ${colors.border.light}`,
                        "&:hover": {
                          backgroundColor: colors.background.primary,
                          borderColor: colors.primary[300],
                        },
                      },
                    }}
                  />
                </Box>

                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 4 }}>
                  <TextField
                    fullWidth
                    label="Ngày sinh"
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    required
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        backgroundColor: colors.background.secondary,
                        border: `1px solid ${colors.border.light}`,
                      },
                    }}
                  />
                  <TextField
                    select
                    fullWidth
                    label="Giới tính"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        backgroundColor: colors.background.secondary,
                        border: `1px solid ${colors.border.light}`,
                      },
                    }}
                  >
                    <MenuItem value="male">Nam</MenuItem>
                    <MenuItem value="female">Nữ</MenuItem>
                  </TextField>
                </Box>

                <TextField
                  fullWidth
                  label="Địa chỉ"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      backgroundColor: colors.background.secondary,
                      border: `1px solid ${colors.border.light}`,
                      "&:hover": {
                        backgroundColor: colors.background.primary,
                        borderColor: colors.primary[300],
                      },
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Professional Information Section */}
            <Box sx={{ mb: 8 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 3,
                    background: alpha(colors.secondary[500], 0.1),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 3,
                  }}
                >
                  <Work sx={{ fontSize: 28, color: colors.secondary[600] }} />
                </Box>
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 700,
                      color: colors.text.primary,
                      mb: 0.5,
                    }}
                  >
                    Thông tin nghề nghiệp
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: colors.text.tertiary,
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Kinh nghiệm và chuyên môn của bạn
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "grid", gap: 4 }}>
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 4 }}>
                  <TextField
                    select
                    fullWidth
                    label="Học hàm"
                    value={academicRank}
                    onChange={(e) => setAcademicRank(e.target.value)}
                    required
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        backgroundColor: colors.background.secondary,
                        border: `1px solid ${colors.border.light}`,
                      },
                    }}
                  >
                    <MenuItem value="">Chọn học hàm</MenuItem>
                    <MenuItem value="CN">Cử nhân</MenuItem>
                    <MenuItem value="THS">Thạc sĩ</MenuItem>
                    <MenuItem value="TS">Tiến sĩ</MenuItem>
                    <MenuItem value="PGS">Phố giáo sư</MenuItem>
                    <MenuItem value="GS">Giáo sư</MenuItem>
                  </TextField>

                  <Autocomplete
                    freeSolo
                    options={majorAutoComplete}
                    value={specialization}
                    onChange={(_event, newValue) => setSpecialization(newValue || "")}
                    onInputChange={(_event, newInputValue) => setSpecialization(newInputValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Chuyên ngành"
                        required
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            backgroundColor: colors.background.secondary,
                            border: `1px solid ${colors.border.light}`,
                          },
                        }}
                      />
                    )}
                  />
                </Box>

                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 4 }}>
                  <Autocomplete
                    freeSolo
                    options={jobFieldsAutoComplete}
                    value={jobField || ""}
                    onChange={(_e, newValue) => setJobField(newValue || "")}
                    onInputChange={(_e, newInputValue) => setJobField(newInputValue || "")}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Lĩnh vực công việc"
                        required
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            backgroundColor: colors.background.secondary,
                            border: `1px solid ${colors.border.light}`,
                          },
                        }}
                      />
                    )}
                  />
                  <TextField
                    fullWidth
                    label="Số năm kinh nghiệm"
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    required
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        backgroundColor: colors.background.secondary,
                        border: `1px solid ${colors.border.light}`,
                      },
                    }}
                  />
                </Box>
              </Box>
            </Box>

            {/* Bio Section */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 3,
                    background: alpha(colors.accent.lightBlue, 0.1),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 3,
                  }}
                >
                  <Description sx={{ fontSize: 28, color: colors.accent.lightBlue }} />
                </Box>
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 700,
                      color: colors.text.primary,
                      mb: 0.5,
                    }}
                  >
                    Giới thiệu bản thân
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: colors.text.tertiary,
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Chia sẻ về kinh nghiệm và mục tiêu của bạn
                  </Typography>
                </Box>
              </Box>

              <TextField
                fullWidth
                label="Giới thiệu bản thân"
                multiline
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Chia sẻ về kinh nghiệm, thành tích và mục tiêu nghề nghiệp của bạn..."
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    backgroundColor: colors.background.secondary,
                    border: `1px solid ${colors.border.light}`,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: colors.background.primary,
                      borderColor: colors.primary[300],
                    },
                    "&.Mui-focused": {
                      backgroundColor: colors.background.primary,
                      borderColor: colors.primary[500],
                      boxShadow: `0 4px 20px ${alpha(colors.primary[500], 0.15)}`,
                    },
                  },
                }}
              />
            </Box>
          </Box>
        </Paper>
      </Box>
    </Fade>
  );

  const renderCredentialsStep = () => (
    <Fade in={activeStep === 1} timeout={500}>
      <Box sx={{ mx: "auto", mt: 4, maxWidth: "1400px", px: 2 }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" }, gap: 4 }}>
          {/* Enhanced Degrees Section */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: 4,
              background: colors.background.primary,
              border: `1px solid ${colors.border.light}`,
              overflow: "hidden",
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `
                  radial-gradient(circle at 10% 20%, ${alpha(colors.primary[50], 0.8)} 0%, transparent 50%),
                  url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${colors.primary[100].slice(1)}' fill-opacity='0.03'%3E%3Cpath d='M30 30c16.569 0 30-13.431 30-30H30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
                `,
                zIndex: 0,
              },
            }}
          >
            <Box
              sx={{
                background: `
                  ${colors.background.gradient.primary},
                  url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Cpath d='M0 40c20 0 40-20 40-40H0v40zm40 0c0 20 20 40 40 40V40H40z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
                `,
                p: 4,
                color: "white",
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  top: "10%",
                  right: "-5%",
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.1)",
                  animation: "pulse 4s ease-in-out infinite",
                  "@keyframes pulse": {
                    "0%, 100%": { transform: "scale(1)", opacity: 0.1 },
                    "50%": { transform: "scale(1.1)", opacity: 0.2 },
                  },
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      bgcolor: "rgba(255,255,255,0.2)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(255,255,255,0.3)",
                      mr: 3,
                    }}
                  >
                    <School sx={{ fontSize: 28 }} />
                  </Avatar>
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 700,
                        mb: 0.5,
                      }}
                    >
                      Bằng cấp
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      {degrees.length} bằng cấp đã thêm
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={degrees.length}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    height: 36,
                    minWidth: 50,
                  }}
                />
              </Box>
            </Box>

            <Box sx={{ p: 4, position: "relative", zIndex: 1 }}>
              <Box sx={{ maxHeight: 400, overflow: "auto", mb: 4 }}>
                {degrees.length === 0 ? (
                  <Box sx={{ py: 8, textAlign: "center" }}>
                    <School sx={{ fontSize: 80, color: colors.neutral[300], mb: 3 }} />
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: colors.text.tertiary,
                        mb: 2,
                      }}
                    >
                      Chưa có bằng cấp nào
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.text.tertiary }}>
                      Thêm bằng cấp để nâng cao uy tín và chứng minh trình độ
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: "grid", gap: 3 }}>
                    {degrees.map((degree, index) => (
                      <Slide
                        key={index}
                        direction="up"
                        in={true}
                        timeout={300 + index * 100}
                      >
                        <Card
                          variant="outlined"
                          className="relative transition-all duration-300 hover:shadow-xl"
                          sx={{
                            borderRadius: 3,
                            border: "2px solid #e5e7eb",
                            "&:hover": {
                              borderColor: "#3b82f6",
                              transform: "translateY(-4px)",
                            },
                          }}
                        >
                          <CardContent className="pb-4">
                            <div className="absolute right-3 top-3 flex gap-2">
                              <Tooltip title="Chỉnh sửa" arrow>
                                <IconButton
                                  onClick={() => handleEditDegree(index)}
                                  size="small"
                                  sx={{
                                    bgcolor: "rgba(59, 130, 246, 0.1)",
                                    color: "#3b82f6",
                                    "&:hover": {
                                      bgcolor: "rgba(59, 130, 246, 0.2)",
                                    },
                                  }}
                                >
                                  <Edit />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Xóa" arrow>
                                <IconButton
                                  onClick={() => handleDeleteDegree(index)}
                                  size="small"
                                  sx={{
                                    bgcolor: "rgba(239, 68, 68, 0.1)",
                                    color: "#ef4444",
                                    "&:hover": {
                                      bgcolor: "rgba(239, 68, 68, 0.2)",
                                    },
                                  }}
                                >
                                  <Delete />
                                </IconButton>
                              </Tooltip>
                            </div>

                            <Typography
                              variant="h6"
                              className="mb-4 pr-24 font-bold text-gray-800"
                            >
                              {degree.name}
                            </Typography>

                            <div className="mb-4 space-y-2">
                              <div className="flex flex-col sm:flex-row sm:justify-between">
                                <Typography
                                  variant="body2"
                                  className="text-gray-600"
                                >
                                  <span className="font-semibold">Ngành:</span>{" "}
                                  {degree.major}
                                </Typography>
                              </div>
                              <div className="flex flex-col sm:flex-row sm:justify-between">
                                <Typography
                                  variant="body2"
                                  className="text-gray-600"
                                >
                                  <span className="font-semibold">Trường:</span>{" "}
                                  {degree.institution}
                                </Typography>
                              </div>
                              <div className="flex flex-col sm:flex-row sm:justify-between">
                                <Typography
                                  variant="body2"
                                  className="text-gray-600"
                                >
                                  <span className="font-semibold">
                                    Thời gian:
                                  </span>{" "}
                                  {degree.startYear} - {degree.graduationYear}
                                </Typography>
                              </div>
                            </div>

                            <Chip
                              label={degree.level}
                              color="primary"
                              variant="filled"
                              className="font-medium"
                              sx={{ borderRadius: 2 }}
                            />
                          </CardContent>
                        </Card>
                      </Slide>
                    ))}
                  </Box>
                )}
              </Box>

              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setOpenModal(true)}
                fullWidth
                size="large"
                sx={{
                  borderRadius: 3,
                  background: `
                    ${colors.background.gradient.primary},
                    url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M0 0h20v20H0V0zm10 17a7 7 0 100-14 7 7 0 000 14z'/%3E%3C/g%3E%3C/svg%3E")
                  `,
                  py: 2,
                  fontSize: "1rem",
                  fontWeight: 600,
                  boxShadow: `0 4px 16px ${alpha(colors.primary[500], 0.3)}`,
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: "-100%",
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                    transition: "left 0.6s",
                  },
                  "&:hover": {
                    boxShadow: `0 6px 20px ${alpha(colors.primary[500], 0.4)}`,
                    transform: "translateY(-2px)",
                    "&::before": {
                      left: "100%",
                    },
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Thêm bằng cấp
              </Button>
            </Box>
          </Paper>

          {/* Enhanced Certifications Section - Similar structure */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: 4,
              background: colors.background.primary,
              border: `1px solid ${colors.border.light}`,
              overflow: "hidden",
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `
                  radial-gradient(circle at 10% 20%, ${alpha(colors.primary[50], 0.8)} 0%, transparent 50%),
                  url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${colors.primary[100].slice(1)}' fill-opacity='0.03'%3E%3Cpath d='M30 30c16.569 0 30-13.431 30-30H30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
                `,
                zIndex: 0,
              },
            }}
          >
            <Box
              sx={{
                background: `
                  ${colors.background.gradient.secondary},
                  url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.06'%3E%3Cpath d='M60 60c33.137 0 60-26.863 60-60H60v60zm0 0c-33.137 0-60 26.863-60 60h60V60z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
                `,
                p: 4,
                color: "white",
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  top: "10%",
                  right: "-5%",
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.1)",
                  animation: "pulse 4s ease-in-out infinite",
                  "@keyframes pulse": {
                    "0%, 100%": { transform: "scale(1)", opacity: 0.1 },
                    "50%": { transform: "scale(1.1)", opacity: 0.2 },
                  },
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      bgcolor: "rgba(255,255,255,0.2)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(255,255,255,0.3)",
                      mr: 3,
                    }}
                  >
                    <Badge sx={{ fontSize: 28 }} />
                  </Avatar>
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 700,
                        mb: 0.5,
                      }}
                    >
                      Chứng chỉ
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      {certifications.length} chứng chỉ đã thêm
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={certifications.length}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    height: 36,
                    minWidth: 50,
                  }}
                />
              </Box>
            </Box>

            <Box sx={{ p: 4, position: "relative", zIndex: 1 }}>
              <Box sx={{ maxHeight: 400, overflow: "auto", mb: 4 }}>
                {certifications.length === 0 ? (
                  <Box sx={{ py: 8, textAlign: "center" }}>
                    <Badge sx={{ fontSize: 80, color: colors.neutral[300], mb: 3 }} />
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: colors.text.tertiary,
                        mb: 2,
                      }}
                    >
                      Chưa có chứng chỉ nào
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.text.tertiary }}>
                      Thêm chứng chỉ để chứng minh năng lực chuyên môn và kinh nghiệm thực tế
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: "grid", gap: 3 }}>
                    {certifications.map((cert, index) => (
                      <Slide
                        key={index}
                        direction="up"
                        in={true}
                        timeout={300 + index * 100}
                      >
                        <Card
                          variant="outlined"
                          className="relative transition-all duration-300 hover:shadow-xl"
                          sx={{
                            borderRadius: 3,
                            border: "2px solid #e5e7eb",
                            "&:hover": {
                              borderColor: "#93333ea",
                              transform: "translateY(-4px)",
                            },
                          }}
                        >
                          <CardContent className="pb-4">
                            <div className="absolute right-3 top-3 flex gap-2">
                              <Tooltip title="Chỉnh sửa" arrow>
                                <IconButton
                                  onClick={() => handleEditCertification(index)}
                                  size="small"
                                  sx={{
                                    bgcolor: "rgba(59, 130, 246, 0.1)",
                                    color: "#3b82f6",
                                    "&:hover": {
                                      bgcolor: "rgba(59, 130, 246, 0.2)",
                                    },
                                  }}
                                >
                                  <Edit />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Xóa" arrow>
                                <IconButton
                                  onClick={() =>
                                    handleDeleteCertification(index)
                                  }
                                  size="small"
                                  sx={{
                                    bgcolor: "rgba(239, 68, 68, 0.1)",
                                    color: "#ef4444",
                                    "&:hover": {
                                      bgcolor: "rgba(239, 68, 68, 0.2)",
                                    },
                                  }}
                                >
                                  <Delete />
                                </IconButton>
                              </Tooltip>
                            </div>

                            <Typography
                              variant="h6"
                              className="mb-4 pr-24 font-bold text-gray-800"
                            >
                              {cert.name}
                            </Typography>

                            <div className="mb-4 space-y-2">
                              <Typography
                                variant="body2"
                                className="text-gray-600"
                              >
                                <span className="font-semibold">Cấp bởi:</span>{" "}
                                {cert.issuedBy}
                              </Typography>
                              <div className="flex flex-col sm:flex-row sm:justify-between">
                                <Typography
                                  variant="body2"
                                  className="text-gray-600"
                                >
                                  <span className="font-semibold">
                                    Ngày cấp:
                                  </span>{" "}
                                  {new Date(cert.issueDate).toLocaleDateString(
                                    "vi-VN",
                                  )}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  className="text-gray-600"
                                >
                                  <span className="font-semibold">
                                    Hết hạn:
                                  </span>{" "}
                                  {cert.expiryDate
                                    ? new Date(
                                        cert.expiryDate,
                                      ).toLocaleDateString("vi-VN")
                                    : "Vô thời hạn"}
                                </Typography>
                              </div>
                            </div>

                            <Chip
                              label={cert.level}
                              color="secondary"
                              variant="filled"
                              className="font-medium"
                              sx={{ borderRadius: 2 }}
                            />
                          </CardContent>
                        </Card>
                      </Slide>
                    ))}
                  </Box>
                )}
              </Box>

              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setOpenCertificationModal(true)}
                fullWidth
                size="large"
                sx={{
                  borderRadius: 3,
                  background: `
                    ${colors.background.gradient.secondary},
                    url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23${colors.primary[50].slice(1)}' fill-opacity='0.1'%3E%3Cpath d='M0 0h20v20H0V0zm10 17a7 7 0 100-14 7 7 0 000 14z'/%3E%3C/g%3E%3C/svg%3E")
                  `,
                  py: 2,
                  fontSize: "1rem",
                  fontWeight: 600,
                  boxShadow: `0 4px 16px ${alpha(colors.primary[500], 0.3)}`,
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: "-100%",
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                    transition: "left 0.6s",
                  },
                  "&:hover": {
                    boxShadow: `0 6px 20px ${alpha(colors.primary[500], 0.4)}`,
                    transform: "translateY(-2px)",
                    "&::before": {
                      left: "100%",
                    },
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Thêm chứng chỉ
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Fade>
  );

  const renderConfirmationStep = () => (
    <Fade in={activeStep === 2} timeout={500}>
      <Box sx={{ mx: "auto", mt: 4, maxWidth: "1200px", px: 2 }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            background: colors.background.primary,
            border: `1px solid ${colors.border.light}`,
            overflow: "hidden",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `
                radial-gradient(circle at 70% 30%, ${alpha(colors.success[50], 0.8)} 0%, transparent 50%),
                radial-gradient(circle at 30% 70%, ${alpha(colors.primary[50], 0.6)} 0%, transparent 50%),
                url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23${colors.success[50].slice(1)}' fill-opacity='0.03'%3E%3Cpath d='M50 50c27.614 0 50-22.386 50-50H50z'/%3E%3C/g%3E%3C/svg%3E")
              `,
              zIndex: 0,
            },
          }}
        >
          <Box
            sx={{
              background: `
                ${colors.background.gradient.secondary},
                url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.06'%3E%3Cpath d='M60 60c33.137 0 60-26.863 60-60H60v60zm0 0c-33.137 0-60 26.863-60 60h60V60z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
              `,
              p: 6,
              color: "white",
              textAlign: "center",
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: "20%",
                left: "10%",
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.08)",
                animation: "float 6s ease-in-out infinite",
              },
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: "20%",
                right: "15%",
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.06)",
                animation: "float 6s ease-in-out infinite 3s",
              },
            }}
          >
            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Box
                sx={{
                  position: "relative",
                  display: "inline-block",
                  mb: 3,
                }}
              >
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: "rgba(255,255,255,0.2)",
                    backdropFilter: "blur(20px)",
                    border: "2px solid rgba(255,255,255,0.3)",
                    mx: "auto",
                    position: "relative",
                    animation: "glow 2s ease-in-out infinite alternate",
                    "@keyframes glow": {
                      "0%": { boxShadow: "0 0 20px rgba(255,255,255,0.3)" },
                      "100%": { boxShadow: "0 0 30px rgba(255,255,255,0.5)" },
                    },
                  }}
                >
                  <CheckCircle sx={{ fontSize: 40 }} />
                </Avatar>
                {/* Success particles */}
                {[...Array(3)].map((_, i) => (
                  <Box
                    key={i}
                    sx={{
                      position: "absolute",
                      top: `${20 + i * 15}%`,
                      left: `${10 + i * 30}%`,
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.4)",
                      animation: `sparkle 2s ease-in-out infinite ${i * 0.5}s`,
                      "@keyframes sparkle": {
                        "0%, 100%": { opacity: 0, transform: "scale(0)" },
                        "50%": { opacity: 1, transform: "scale(1)" },
                      },
                    }}
                  />
                ))}
              </Box>
              <Typography
                variant="h3"
                sx={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 700,
                  mb: 2,
                }}
              >
                Xác nhận thông tin
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  opacity: 0.9,
                  maxWidth: 600,
                  mx: "auto",
                  lineHeight: 1.6,
                }}
              >
                Kiểm tra lại thông tin trước khi gửi yêu cầu đăng ký
              </Typography>
            </Box>
          </Box>

          <Box sx={{ p: 6, position: "relative", zIndex: 1 }}>
            <Alert
              severity="info"
              sx={{
                mb: 6,
                borderRadius: 3,
                border: `1px solid ${colors.info[200]}`,
                backgroundColor: colors.info[50],
              }}
            >
              <AlertTitle sx={{ fontWeight: 700 }}>Thông tin quan trọng</AlertTitle>
              Vui lòng kiểm tra kỹ thông tin trước khi gửi yêu cầu. Sau khi gửi,
              tài khoản của bạn sẽ chờ được quản trị viên phê duyệt.
            </Alert>

            <div className="flex flex-col gap-8 xl:flex-row">
              {/* Personal Information */}
              <div className="flex-1">
                <Paper
                  elevation={2}
                  className="h-full p-8"
                  sx={{
                    borderRadius: 3,
                    background:
                      "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                  }}
                >
                  <div className="mb-6 flex items-center">
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        bgcolor: "#dbeafe",
                        color: "#2563eb",
                        mr: 3,
                      }}
                    >
                      <Person />
                    </Avatar>
                    <div>
                      <Typography
                        variant="h5"
                        className="font-bold text-blue-600"
                      >
                        Thông tin cá nhân
                      </Typography>
                      <Typography variant="body2" className="text-gray-500">
                        Thông tin định danh và liên hệ
                      </Typography>
                    </div>
                  </div>
                  <Divider className="mb-6" />

                  <div className="space-y-4">
                    {personalInfo.map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col border-b border-gray-100 py-2 last:border-b-0 sm:flex-row sm:justify-between"
                      >
                        <Typography
                          variant="body2"
                          className="mb-1 font-semibold text-gray-600 sm:mb-0"
                        >
                          {item.label}:
                        </Typography>
                        <Typography
                          variant="body2"
                          className="text-gray-800 sm:text-right"
                        >
                          {item.value}
                        </Typography>
                      </div>
                    ))}
                  </div>
                </Paper>
              </div>

              {/* Credentials and Bio */}
              <div className="flex-1 space-y-8">
                {/* Credentials Summary */}
                <Paper
                  elevation={2}
                  className="p-8"
                  sx={{
                    borderRadius: 3,
                    background:
                      "linear-gradient(135deg, #ffffff 0%, #faf5ff 100%)",
                  }}
                >
                  <div className="mb-6 flex items-center">
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        bgcolor: "#f3e8ff",
                        color: "#9333ea",
                        mr: 3,
                      }}
                    >
                      <School />
                    </Avatar>
                    <div>
                      <Typography
                        variant="h5"
                        className="font-bold text-purple-600"
                      >
                        Chứng chỉ & Bằng cấp
                      </Typography>
                      <Typography variant="body2" className="text-gray-500">
                        Tổng quan về trình độ
                      </Typography>
                    </div>
                  </div>
                  <Divider className="mb-6" />

                  <div className="flex justify-around text-center">
                    <div className="flex-1">
                      <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
                        <Typography
                          variant="h4"
                          className="font-bold text-blue-600"
                        >
                          {degrees.length}
                        </Typography>
                      </div>
                      <Typography
                        variant="body1"
                        className="font-medium text-gray-700"
                      >
                        Bằng cấp
                      </Typography>
                    </div>
                    <Divider orientation="vertical" flexItem className="mx-4" />
                    <div className="flex-1">
                      <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-purple-100">
                        <Typography
                          variant="h4"
                          className="font-bold text-purple-600"
                        >
                          {certifications.length}
                        </Typography>
                      </div>
                      <Typography
                        variant="body1"
                        className="font-medium text-gray-700"
                      >
                        Chứng chỉ
                      </Typography>
                    </div>
                  </div>
                </Paper>

                {/* Bio */}
                {bio && (
                  <Paper
                    elevation={2}
                    className="p-8"
                    sx={{
                      borderRadius: 3,
                      background:
                        "linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)",
                    }}
                  >
                    <div className="mb-6 flex items-center">
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          bgcolor: "#dcfce7",
                          color: "#16a34a",
                          mr: 3,
                        }}
                      >
                        <Description />
                      </Avatar>
                      <div>
                        <Typography
                          variant="h5"
                          className="font-bold text-green-600"
                        >
                          Giới thiệu bản thân
                        </Typography>
                        <Typography variant="body2" className="text-gray-500">
                          Mô tả về bản thân
                        </Typography>
                      </div>
                    </div>
                    <Divider className="mb-6" />
                    <div className="rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 p-6">
                      <Typography
                        variant="body1"
                        className="italic leading-relaxed text-gray-700"
                      >
                        "{bio}"
                      </Typography>
                    </div>
                  </Paper>
                )}
              </div>
            </div>
          </Box>
        </Paper>
      </Box>
    </Fade>
  );

  return (
    <Box 
      sx={{ 
        minHeight: "100vh", 
        background: `
          linear-gradient(135deg, ${colors.background.secondary} 0%, ${alpha(colors.primary[50], 0.3)} 100%),
          url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${colors.primary[100].slice(1)}' fill-opacity='0.02'%3E%3Cpath d='M100 100c55.228 0 100-44.772 100-100H100z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
        `,
        py: 4,
        position: "relative",
        "&::before": {
          content: '""',
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 50%, ${alpha(colors.primary[100], 0.1)} 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, ${alpha(colors.secondary[100], 0.1)} 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, ${alpha(colors.accent.lightBlue, 0.05)} 0%, transparent 50%)
          `,
          zIndex: -1,
          animation: "backgroundShift 20s ease-in-out infinite",
          "@keyframes backgroundShift": {
            "0%, 100%": { transform: "translateX(0) translateY(0)" },
            "25%": { transform: "translateX(5px) translateY(-5px)" },
            "50%": { transform: "translateX(-5px) translateY(5px)" },
            "75%": { transform: "translateX(5px) translateY(5px)" },
          },
        },
      }}
    >
      <Container maxWidth="xl">
        {/* Enhanced Header */}
        <Paper
          elevation={0}
          sx={{
            mb: 4,
            borderRadius: 4,
            background: `
              ${colors.background.gradient.primary},
              url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M0 50c25 0 50-25 50-50H0v50zm50 0c0 25 25 50 50 50V50H50z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
            `,
            color: "white",
            border: `1px solid ${colors.border.light}`,
            overflow: "hidden",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: "-50%",
              left: "-50%",
              width: "200%",
              height: "200%",
              background: "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.05) 50%, transparent 70%)",
              animation: "shine 8s ease-in-out infinite",
              "@keyframes shine": {
                "0%": { transform: "translateX(-100%) translateY(-100%) rotate(45deg)" },
                "100%": { transform: "translateX(100%) translateY(100%) rotate(45deg)" },
              },
            },
          }}
        >
          <Box sx={{ p: 6, position: "relative", zIndex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 4 }}>
              <IconButton
                onClick={handleBackToHome}
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.3)",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <ArrowBack />
              </IconButton>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 700,
                  textAlign: "center",
                  flex: 1,
                }}
              >
                Đăng ký tài khoản Giảng viên
              </Typography>
              <Box sx={{ width: 48 }} /> {/* Spacer */}
            </Box>

            {/* Modern Stepper */}
            <Stepper
              activeStep={activeStep}
              alternativeLabel
              sx={{
                "& .MuiStepConnector-line": {
                  borderTopWidth: 2,
                  borderColor: "rgba(255,255,255,0.3)",
                },
                "& .MuiStepConnector-active .MuiStepConnector-line": {
                  borderColor: "#fff",
                },
                "& .MuiStepConnector-completed .MuiStepConnector-line": {
                  borderColor: "#fff",
                },
              }}
            >
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel
                    icon={
                      <Avatar
                        sx={{
                          bgcolor: index <= activeStep ? "#fff" : "rgba(255,255,255,0.3)",
                          color: index <= activeStep ? colors.primary[600] : "#fff",
                          width: 48,
                          height: 48,
                          fontSize: "1.2rem",
                          border: index <= activeStep ? "none" : "2px solid rgba(255,255,255,0.3)",
                          boxShadow: index <= activeStep ? `0 4px 12px ${alpha(colors.primary[500], 0.3)}` : "none",
                        }}
                      >
                        {step.icon}
                      </Avatar>
                    }
                  >
                    <Box sx={{ mt: 2 }}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 600,
                          color: index === activeStep ? "white" : "rgba(255,255,255,0.8)",
                        }}
                      >
                        {step.label}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: index === activeStep ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.6)",
                        }}
                      >
                        {step.description}
                      </Typography>
                    </Box>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>

            {isSubmitting && (
              <Box sx={{ mt: 4 }}>
                <LinearProgress
                  sx={{
                    borderRadius: 2,
                    height: 6,
                    backgroundColor: "rgba(255,255,255,0.3)",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "#fff",
                      borderRadius: 2,
                    },
                  }}
                />
                <Typography variant="body1" sx={{ mt: 2, textAlign: "center", opacity: 0.9 }}>
                  Đang xử lý đăng ký của bạn...
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>

        {/* Step Content */}
        {activeStep === 0 && renderPersonalInfoStep()}
        {activeStep === 1 && renderCredentialsStep()}
        {activeStep === 2 && renderConfirmationStep()}

        {/* Enhanced Navigation */}
        <Paper
          elevation={0}
          sx={{
            mt: 4,
            borderRadius: 4,
            background: `
              ${colors.background.primary},
              url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23${colors.primary[50].slice(1)}' fill-opacity='0.1'%3E%3Cpath d='M20 20c11.046 0 20-8.954 20-20H20z'/%3E%3C/g%3E%3C/svg%3E")
            `,
            border: `1px solid ${colors.border.light}`,
            p: 4,
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              background: colors.background.gradient.primary,
              borderRadius: "4px 4px 0 0",
            },
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
              size="large"
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.5,
                borderColor: colors.neutral[300],
                color: colors.text.secondary,
                "&:hover": {
                  borderColor: colors.primary[300],
                  backgroundColor: colors.primary[50],
                },
              }}
            >
              Trở lại
            </Button>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {isStepOptional(activeStep) && (
                <Button
                  color="inherit"
                  onClick={handleSkip}
                  size="large"
                  sx={{
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    color: colors.text.tertiary,
                  }}
                >
                  Bỏ qua
                </Button>
              )}
              <Button
                onClick={handleNext}
                variant="contained"
                size="large"
                disabled={isSubmitting}
                sx={{
                  borderRadius: 3,
                  px: 6,
                  py: 1.5,
                  background: colors.background.gradient.primary,
                  fontSize: "1rem",
                  fontWeight: 600,
                  boxShadow: `0 4px 16px ${alpha(colors.primary[500], 0.3)}`,
                  "&:hover": {
                    boxShadow: `0 6px 20px ${alpha(colors.primary[500], 0.4)}`,
                    transform: "translateY(-1px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                {activeStep === steps.length - 1 ? "Hoàn tất đăng ký" : "Tiếp tục"}
              </Button>
            </Box>
          </Box>

          {/* Progress */}
          <Box sx={{ mt: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: colors.text.secondary }}>
                Bước {activeStep + 1} / {steps.length}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: colors.text.secondary }}>
                {Math.round(((activeStep + 1 ) / steps.length) * 100)}% hoàn thành
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={((activeStep + 1) / steps.length) * 100}
              sx={{
                borderRadius: 2,
                height: 6,
                backgroundColor: colors.neutral[200],
                "& .MuiLinearProgress-bar": {
                  backgroundColor: colors.primary[500],
                  borderRadius: 2,
                },
              }}
            />
          </Box>
        </Paper>
      </Container>

      {/* Floating Background Elements */}
      <Box
        sx={{
          position: "fixed",
          top: "10%",
          right: "5%",
          width: 150,
          height: 150,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha(colors.primary[200], 0.1)} 0%, transparent 70%)`,
          animation: "float 8s ease-in-out infinite",
          zIndex: -1,
        }}
      />
      <Box
        sx={{
          position: "fixed",
          bottom: "15%",
          left: "8%",
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha(colors.secondary[200], 0.1)} 0%, transparent 70%)`,
          animation: "float 6s ease-in-out infinite 2s",
          zIndex: -1,
        }}
      />

      {/* Modals */}
      <UploadDegreeModal
        open={openModal}
        onClose={handleCloseDegreeModal}
        onSubmit={handleSubmitDegree}
        editMode={editingDegreeIndex !== null}
        editData={
          editingDegreeIndex !== null ? degrees[editingDegreeIndex] : undefined
        }
      />
      <UploadCertificationModal
        open={openCertificationModal}
        onClose={handleCloseCertificationModal}
        onSubmit={handleSubmitCertification}
        editMode={editingCertificationIndex !== null}
        editData={
          editingCertificationIndex !== null
            ? certifications[editingCertificationIndex]
            : undefined
        }
      />
    </Box>
  );
};

export default RegisterLecturer;
