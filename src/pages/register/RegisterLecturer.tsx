import {
  Box,
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
  LocationOn,
  Phone,
  CalendarToday,
} from "@mui/icons-material";
import { toast } from "react-toastify";

const RegisterLecturer = () => {
  const steps = [
    { label: "Thông tin cá nhân", icon: <Person /> },
    { label: "Chứng chỉ và bằng cấp", icon: <School /> },
    { label: "Xác nhận và hoàn tất", icon: <CheckCircle /> },
  ];
  const navigate = useNavigate();

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

  const handleDeleteDegree = (indexToDelete: number) => {
    setDegrees((prev) => prev.filter((_, index) => index !== indexToDelete));
  };

  const handleDeleteCertification = (indexToDelete: number) => {
    setCertifications((prev) =>
      prev.filter((_, index) => index !== indexToDelete),
    );
  };

  const isStepOptional = (step: number) => {
    return step === 1;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = async () => {
    if (activeStep === 2) {
      if (fullName === "") {
        toast.error("Vui lòng nhập họ và tên");
        return;
      }
      if (gender === "") {
        toast.error("Vui lòng chọn giới tính");
        return;
      }

      setIsSubmitting(true);

      const lecturerData = {
        citizenId,
        phoneNumber,
        fullName,
        dateOfBirth,
        gender: gender === "male" ? true : false,
        bio,
        address,
        academicRank,
        specialization,
        experienceYears,
        avatarUrl: "",
        jobField,
      };

      try {
        const resLecturer = await API.user.registerLeccturer(lecturerData);
        const lecturerId = resLecturer.data.data.id;

        if (degrees.length > 0) {
          const degreePayload = degrees.map((deg) => ({ ...deg, lecturerId }));
          await API.user.createDegree(degreePayload);
        }

        if (certifications.length > 0) {
          const certificationPayload = certifications.map((cert) => ({
            ...cert,
            lecturerId,
          }));
          await API.user.createCertification(certificationPayload);
        }

        localStorage.removeItem("registerLecturerForm");
        navigate("/");
      } catch (error) {
        console.error("❌ Lỗi gửi dữ liệu:", error);
        alert("Có lỗi xảy ra. Vui lòng kiểm tra lại.");
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

  // const handleReset = () => {
  //   setActiveStep(0);
  // };

  useEffect(() => {
    const formData = {
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

  const getAcademicRankLabel = (rank: string) => {
    const ranks: { [key: string]: string } = {
      CN: "Cử nhân",
      THS: "Thạc sĩ",
      TS: "Tiến sĩ",
      PGS: "Phó giáo sư",
      GS: "Giáo sư",
    };
    return ranks[rank] || rank;
  };

  const renderPersonalInfoStep = () => (
    <div className="mx-auto mt-6 w-full max-w-4xl">
      <Paper elevation={2} className="p-6">
        <div className="mb-6 flex items-center">
          <Person className="mr-3 text-3xl text-blue-600" />
          <Typography variant="h5" className="font-bold text-blue-600">
            Thông tin cá nhân
          </Typography>
        </div>

        <div className="space-y-6">
          {/* Full Name */}
          <TextField
            fullWidth
            label="Họ và tên"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            InputProps={{
              startAdornment: <Badge className="mr-2 text-gray-500" />,
            }}
            className="mb-4"
          />

          {/* ID and Phone */}
          <div className="flex flex-col gap-4 md:flex-row">
            <TextField
              fullWidth
              label="Số CCCD/CMND"
              value={citizenId}
              onChange={(e) => setCitizenId(e.target.value)}
              required
              className="flex-1"
            />
            <TextField
              fullWidth
              label="Số điện thoại"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              InputProps={{
                startAdornment: <Phone className="mr-2 text-gray-500" />,
              }}
              className="flex-1"
            />
          </div>

          {/* Birth Date and Gender */}
          <div className="flex flex-col gap-4 md:flex-row">
            <TextField
              fullWidth
              label="Ngày sinh"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <CalendarToday className="mr-2 text-gray-500" />
                ),
              }}
              className="flex-1"
            />
            <TextField
              select
              fullWidth
              label="Giới tính"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
              className="flex-1"
            >
              <MenuItem value="">Chọn giới tính</MenuItem>
              <MenuItem value="male">Nam</MenuItem>
              <MenuItem value="female">Nữ</MenuItem>
              <MenuItem value="other">Khác</MenuItem>
            </TextField>
          </div>

          {/* Academic Rank and Experience */}
          <div className="flex flex-col gap-4 md:flex-row">
            <TextField
              select
              fullWidth
              label="Học hàm"
              value={academicRank}
              onChange={(e) => setAcademicRank(e.target.value)}
              required
              className="flex-1"
            >
              <MenuItem value="">Chọn học hàm</MenuItem>
              <MenuItem value="CN">Cử nhân</MenuItem>
              <MenuItem value="THS">Thạc sĩ</MenuItem>
              <MenuItem value="TS">Tiến sĩ</MenuItem>
              <MenuItem value="PGS">Phó giáo sư</MenuItem>
              <MenuItem value="GS">Giáo sư</MenuItem>
            </TextField>

            {/* Specialization */}
            <TextField
              label="Chuyên ngành"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-4 md:flex-row">
            <TextField
              className="flex-1"
              label="Lĩnh vực công việc"
              value={jobField}
              onChange={(e) => setJobField(e.target.value)}
              required
              InputProps={{
                startAdornment: <Work className="mr-2 text-gray-500" />,
              }}
            />
            <TextField
              label="Số năm kinh nghiệm"
              type="number"
              value={experienceYears}
              onChange={(e) => setExperienceYears(e.target.value)}
              required
              InputProps={{
                startAdornment: <Work className="mr-2 text-gray-500" />,
              }}
              className="flex-2"
            />
          </div>

          {/* Address */}
          <TextField
            fullWidth
            label="Địa chỉ"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            InputProps={{
              startAdornment: <LocationOn className="mr-2 text-gray-500" />,
            }}
          />

          {/* Bio */}
          <TextField
            fullWidth
            label="Giới thiệu bản thân"
            multiline
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Chia sẻ về kinh nghiệm, thành tích và mục tiêu nghề nghiệp của bạn..."
            // InputProps={{
            //   startAdornment: (
            //     <Description className="mr-2 mt-3 self-start text-gray-500" />
            //   ),
            // }}
          />
        </div>
      </Paper>
    </div>
  );

  const renderCredentialsStep = () => (
    <div className="mx-auto mt-6 w-full max-w-6xl">
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Degrees Section */}
        <div className="flex-1">
          <Paper elevation={2} className="h-fit p-6">
            <div className="mb-4 flex items-center">
              <School className="mr-3 text-blue-600" />
              <Typography variant="h6" className="font-bold text-blue-600">
                Bằng cấp ({degrees.length})
              </Typography>
            </div>

            <div className="mb-4 max-h-96 space-y-3 overflow-y-auto pr-2">
              {degrees.map((degree, index) => (
                <Card key={index} variant="outlined" className="relative">
                  <CardContent className="pb-2">
                    <IconButton
                      onClick={() => handleDeleteDegree(index)}
                      className="absolute right-2 top-2 text-red-500 hover:text-red-700"
                      size="small"
                    >
                      <Delete />
                    </IconButton>

                    <Typography
                      variant="subtitle1"
                      className="mb-2 pr-10 font-bold"
                    >
                      {degree.name}
                    </Typography>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>
                        <strong>Ngành:</strong> {degree.major}
                      </p>
                      <p>
                        <strong>Trường:</strong> {degree.institution}
                      </p>
                      <p>
                        <strong>Năm:</strong> {degree.startYear} -{" "}
                        {degree.graduationYear}
                      </p>
                    </div>
                    <Chip
                      label={degree.level}
                      size="small"
                      color="primary"
                      variant="outlined"
                      className="mt-2"
                    />
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenModal(true)}
              fullWidth
              className="bg-blue-600 hover:bg-blue-700"
            >
              Thêm bằng cấp
            </Button>
          </Paper>
        </div>

        {/* Certifications Section */}
        <div className="flex-1">
          <Paper elevation={2} className="h-fit p-6">
            <div className="mb-4 flex items-center">
              <Box className="mr-3 text-purple-600" />
              <Typography variant="h6" className="font-bold text-purple-600">
                Chứng chỉ ({certifications.length})
              </Typography>
            </div>

            <div className="mb-4 max-h-96 space-y-3 overflow-y-auto pr-2">
              {certifications.map((cert, index) => (
                <Card key={index} variant="outlined" className="relative">
                  <CardContent className="pb-2">
                    <IconButton
                      onClick={() => handleDeleteCertification(index)}
                      className="absolute right-2 top-2 text-red-500 hover:text-red-700"
                      size="small"
                    >
                      <Delete />
                    </IconButton>

                    <Typography
                      variant="subtitle1"
                      className="mb-2 pr-10 font-bold"
                    >
                      {cert.name}
                    </Typography>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>
                        <strong>Cấp bởi:</strong> {cert.issuedBy}
                      </p>
                      <p>
                        <strong>Ngày cấp:</strong>{" "}
                        {new Date(cert.issueDate).toLocaleDateString("vi-VN")}
                      </p>
                      <p>
                        <strong>Hết hạn:</strong>{" "}
                        {new Date(cert.expiryDate).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                    <Chip
                      label={cert.level}
                      size="small"
                      color="secondary"
                      variant="outlined"
                      className="mt-2"
                    />
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenCertificationModal(true)}
              fullWidth
              className="bg-purple-600 hover:bg-purple-700"
            >
              Thêm chứng chỉ
            </Button>
          </Paper>
        </div>
      </div>
    </div>
  );

  const renderConfirmationStep = () => (
    <div className="mx-auto mt-6 w-full max-w-4xl">
      <Paper elevation={2} className="p-6">
        <div className="mb-6 flex items-center">
          <CheckCircle className="mr-3 text-3xl text-green-600" />
          <Typography variant="h5" className="font-bold text-green-600">
            Xác nhận thông tin
          </Typography>
        </div>

        <Alert severity="info" className="mb-6">
          <AlertTitle>Thông tin quan trọng</AlertTitle>
          Vui lòng kiểm tra kỹ thông tin trước khi gửi yêu cầu. Sau khi gửi, tài
          khoản của bạn sẽ chờ được quản trị viên phê duyệt.
        </Alert>

        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex-1">
            <Typography variant="h6" className="mb-4 font-bold text-blue-600">
              Thông tin cá nhân
            </Typography>
            <div className="space-y-2 text-sm">
              <div className="flex">
                <span className="w-32 font-semibold">Họ tên:</span>{" "}
                <span>{fullName}</span>
              </div>
              <div className="flex">
                <span className="w-32 font-semibold">CCCD:</span>{" "}
                <span>{citizenId}</span>
              </div>
              <div className="flex">
                <span className="w-32 font-semibold">Điện thoại:</span>{" "}
                <span>{phoneNumber}</span>
              </div>
              <div className="flex">
                <span className="w-32 font-semibold">Ngày sinh:</span>{" "}
                <span>{dateOfBirth}</span>
              </div>
              <div className="flex">
                <span className="w-32 font-semibold">Giới tính:</span>{" "}
                <span>
                  {gender === "male"
                    ? "Nam"
                    : gender === "female"
                      ? "Nữ"
                      : "Khác"}
                </span>
              </div>
              <div className="flex">
                <span className="w-32 font-semibold">Học hàm:</span>{" "}
                <span>{getAcademicRankLabel(academicRank)}</span>
              </div>
              <div className="flex">
                <span className="w-32 font-semibold">Chuyên ngành:</span>{" "}
                <span>{specialization}</span>
              </div>
              <div className="flex">
                <span className="w-32 font-semibold">Kinh nghiệm:</span>{" "}
                <span>{experienceYears} năm</span>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <Typography variant="h6" className="mb-4 font-bold text-purple-600">
              Chứng chỉ & Bằng cấp
            </Typography>
            <div className="mb-4 space-y-2 text-sm">
              <div className="flex">
                <span className="w-32 font-semibold">Bằng cấp:</span>{" "}
                <span>{degrees.length} bằng</span>
              </div>
              <div className="flex">
                <span className="w-32 font-semibold">Chứng chỉ:</span>{" "}
                <span>{certifications.length} chứng chỉ</span>
              </div>
            </div>

            {bio && (
              <div className="mt-4">
                <Typography variant="subtitle2" className="mb-2 font-bold">
                  Giới thiệu:
                </Typography>
                <div className="rounded-lg bg-gray-50 p-4 text-sm italic text-gray-700">
                  {bio}
                </div>
              </div>
            )}
          </div>
        </div>
      </Paper>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Container maxWidth="lg">
        {/* Header */}
        <Paper elevation={1} className="mb-6 p-6">
          <Typography
            variant="h4"
            className="mb-2 text-center font-bold text-blue-600"
          >
            Đăng ký tài khoản Giảng viên
          </Typography>
          <Typography
            variant="body1"
            className="mb-6 text-center text-gray-600"
          >
            Hoàn thành các bước sau để tạo tài khoản giảng viên
          </Typography>

          <Stepper activeStep={activeStep} alternativeLabel className="mb-4">
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel
                  icon={step.icon}
                  sx={{
                    "& .MuiStepIcon-root": {
                      fontSize: "2rem",
                      color: index <= activeStep ? "#2563eb" : "#d1d5db",
                    },
                    "& .MuiStepIcon-text": {
                      fill: "white",
                      fontWeight: "bold",
                    },
                    "& .MuiStepLabel-label": {
                      color: index <= activeStep ? "#2563eb" : "#6b7280",
                      fontWeight: index === activeStep ? "bold" : "normal",
                    },
                  }}
                >
                  <span className="font-medium">{step.label}</span>
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Step Description */}
          <div className="mt-4 text-center">
            <Typography variant="body2" className="text-gray-500">
              {activeStep === 0 && "Điền thông tin cá nhân của bạn để bắt đầu"}
              {activeStep === 1 && "Tải lên các bằng cấp và chứng chỉ của bạn"}
              {activeStep === 2 &&
                "Xem lại và xác nhận thông tin trước khi gửi"}
            </Typography>
          </div>

          {isSubmitting && <LinearProgress className="mt-4" />}
        </Paper>

        {/* Step Content */}
        {activeStep === 0 && renderPersonalInfoStep()}
        {activeStep === 1 && renderCredentialsStep()}
        {activeStep === 2 && renderConfirmationStep()}

        {/* Navigation Buttons with Step Info */}
        <div className="mt-8 flex justify-between px-4">
          <div className="flex items-center">
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
              size="large"
              className="px-8"
            >
              Trở lại
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {isStepOptional(activeStep) && (
              <Button
                color="inherit"
                onClick={handleSkip}
                size="large"
                className="px-6"
              >
                Bỏ qua
              </Button>
            )}
            <Button
              onClick={handleNext}
              variant="contained"
              size="large"
              disabled={isSubmitting}
              className="bg-blue-600 px-8 hover:bg-blue-700"
            >
              {activeStep === steps.length - 1
                ? "Hoàn tất đăng ký"
                : "Tiếp tục"}
            </Button>
          </div>
        </div>

        {/* Completion Status */}
        {activeStep === steps.length - 1 && (
          <div className="mt-6 rounded-lg bg-green-50 p-4">
            <div className="flex items-center justify-center">
              <CheckCircle className="mr-2 text-green-600" />
              <Typography
                variant="body1"
                className="font-medium text-green-700"
              >
                Bạn đã hoàn thành tất cả các bước! Nhấn "Hoàn tất đăng ký" để
                gửi yêu cầu.
              </Typography>
            </div>
          </div>
        )}
      </Container>

      {/* Modals */}
      <UploadDegreeModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={(degree) => {
          setDegrees((prev) => [...prev, degree]);
        }}
      />
      <UploadCertificationModal
        open={openCertificationModal}
        onClose={() => setOpenCertificationModal(false)}
        onSubmit={(cert) => {
          setCertifications((prev) => [...prev, cert]);
        }}
      />
    </div>
  );
};

export default RegisterLecturer;
