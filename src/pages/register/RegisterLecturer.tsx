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
  Edit,
  Description,
  AccountCircle,
  Psychology,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { getAcademicRankLabel, jobFieldsAutoComplete, majorAutoComplete } from "../../utils/ValidateRegisterLecturer";

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
      if (fullName === "" || fullName.length > 30) {
        toast.error(
          "Họ và tên không được để trống hoặc quá dài (tối đa 30 ký tự)",
        );
        return;
      }
      if (citizenId === "" || citizenId.length != 11) {
        toast.error("Vui lòng nhập số CCCD/CMND hợp lệ (11 ký tự)");
        return;
      }
      if (gender === "") {
        toast.error("Vui lòng chọn giới tính");
        return;
      }
      if (phoneNumber === "" || !/^0\d{9,10}$/.test(phoneNumber)) {
        toast.error(
          "Vui lòng nhập số điện thoại hợp lệ (bắt đầu bằng 0 và có 10-11 chữ số)",
        );
        return;
      }
      const now = new Date();
      const minDate = new Date("1900-01-01");
      const dob = new Date(dateOfBirth);

      // Tính tuổi
      const age = now.getFullYear() - dob.getFullYear();
      const hasBirthdayPassed =
        now.getMonth() > dob.getMonth() ||
        (now.getMonth() === dob.getMonth() && now.getDate() >= dob.getDate());
      const actualAge = hasBirthdayPassed ? age : age - 1;

      if (
        !dateOfBirth ||
        isNaN(dob.getTime()) ||
        dob >= now ||
        dob < minDate ||
        actualAge < 18
      ) {
        toast.error("Vui lòng chọn ngày sinh hợp lệ ( >= 18 tuổi).");
        return;
      }
      if (academicRank === "") {
        toast.error("Vui lòng chọn học hàm");
        return;
      }
      if (specialization === "" || specialization.length > 70) {
        toast.error("Vui lòng nhập chuyên ngành hợp lệ (tối đa 70 ký tự)");
        return;
      }
      if (
        experienceYears === "" ||
        Number(experienceYears) < 0 ||
        Number(experienceYears) > 80 ||
        isNaN(Number(experienceYears))
      ) {
        toast.error("Vui lòng nhập số năm kinh nghiệm hợp lệ");
        return;
      }
      if (jobField === "" || jobField.length > 50) {
        toast.error(
          "Vui lòng nhập lĩnh vực công việc hợp lệ (tối đa 50 ký tự)",
        );
        return;
      }
      if (address === "" || address.length > 100) {
        toast.error("Vui lòng nhập địa chỉ");
        return;
      }
      if (bio.length > 200 || bio === "") {
        toast.error("Giới thiệu bản thân không được quá 200 ký tự");
        return;
      }
    }
    if (activeStep === 2) {
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
        await API.user.registerLecturer(lecturerData);
        if (degrees.length > 0) {
          await API.user.createDegree(degrees);
        }
        if (certifications.length > 0) {
          await API.user.createCertification(certifications);
        }

        localStorage.removeItem("registerLecturerForm");
        navigate("/pending-lecturer");
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

  const renderPersonalInfoStep = () => (
    <Fade in={activeStep === 0} timeout={500}>
      <div className="mx-auto mt-8 w-full max-w-6xl px-4">
        <Paper
          elevation={8}
          className="overflow-hidden rounded-3xl bg-gradient-to-br from-white via-blue-50 to-indigo-50"
          sx={{
            background:
              "linear-gradient(135deg, #ffffff 0%, #f0f9ff 50%, #e0f2fe 100%)",
            backdropFilter: "blur(10px)",
          }}
        >
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 px-8 py-12 text-white">
            <div className="flex flex-col items-center text-center">
              <Avatar
                className="mb-6 shadow-2xl"
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: "white",
                  color: "#2563eb",
                }}
              >
                <Person sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h3" className="mb-4 font-bold">
                Thông tin cá nhân
              </Typography>
              <Typography variant="h6" className="max-w-2xl opacity-90">
                Vui lòng điền đầy đủ thông tin để hoàn tất quá trình đăng ký
                giảng viên
              </Typography>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8 md:p-12">
            {/* Basic Information Section */}
            <div className="mb-12">
              <div className="mb-8 flex items-center">
                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                  <AccountCircle className="text-2xl text-blue-600" />
                </div>
                <div>
                  <Typography variant="h5" className="font-bold text-gray-800">
                    Thông tin cơ bản
                  </Typography>
                  <Typography variant="body2" className="text-gray-500">
                    Thông tin định danh và liên hệ của bạn
                  </Typography>
                </div>
              </div>
              <Divider className="mb-8" />

              <div className="space-y-8">
                {/* Full Name */}
                <TextField
                  fullWidth
                  label="Họ và tên"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: <Badge className="mr-3 text-blue-500" />,
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                      },
                      "&.Mui-focused": {
                        backgroundColor: "white",
                        boxShadow: "0 8px 25px rgba(37, 99, 235, 0.15)",
                      },
                    },
                  }}
                />

                {/* ID and Phone Row */}
                <div className="flex flex-col gap-6 lg:flex-row">
                  <TextField
                    fullWidth
                    label="Số CCCD/CMND"
                    value={citizenId}
                    onChange={(e) => setCitizenId(e.target.value)}
                    required
                    variant="outlined"
                    InputProps={{
                      startAdornment: <Badge className="mr-3 text-green-500" />,
                    }}
                    className="lg:flex-1"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
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
                    InputProps={{
                      startAdornment: (
                        <Phone className="mr-3 text-purple-500" />
                      ),
                    }}
                    className="lg:flex-1"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                        },
                      },
                    }}
                  />
                </div>

                {/* Birth Date, Gender and Address Row */}
                <div className="flex flex-col gap-6 lg:flex-row">
                  <TextField
                    fullWidth
                    label="Ngày sinh"
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    required
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <CalendarToday className="mr-3 text-orange-500" />
                      ),
                    }}
                    className="lg:flex-1"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
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
                    className="lg:flex-1"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                      },
                    }}
                  >
                    <MenuItem value="male">Nam</MenuItem>
                    <MenuItem value="female">Nữ</MenuItem>
                  </TextField>
                </div>

                <TextField
                  fullWidth
                  label="Địa chỉ"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <LocationOn className="mr-3 text-red-500" />
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                      },
                    },
                  }}
                />
              </div>
            </div>

            {/* Professional Information Section */}
            <div className="mb-12">
              <div className="mb-8 flex items-center">
                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
                  <Work className="text-2xl text-purple-600" />
                </div>
                <div>
                  <Typography variant="h5" className="font-bold text-gray-800">
                    Thông tin nghề nghiệp
                  </Typography>
                  <Typography variant="body2" className="text-gray-500">
                    Kinh nghiệm và chuyên môn của bạn
                  </Typography>
                </div>
              </div>
              <Divider className="mb-8" />

              <div className="space-y-8">
                {/* Academic Rank and Specialization Row */}
                <div className="flex flex-col gap-6 lg:flex-row">
                  <TextField
                    select
                    fullWidth
                    label="Học hàm"
                    value={academicRank}
                    onChange={(e) => setAcademicRank(e.target.value)}
                    required
                    variant="outlined"
                    className="lg:flex-1"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                      },
                    }}
                  >
                    <MenuItem value="">Chọn học hàm</MenuItem>
                    <MenuItem value="CN">Cử nhân</MenuItem>
                    <MenuItem value="THS">Thạc sĩ</MenuItem>
                    <MenuItem value="TS">Tiến sĩ</MenuItem>
                    <MenuItem value="PGS">Phó giáo sư</MenuItem>
                    <MenuItem value="GS">Giáo sư</MenuItem>
                  </TextField>

                  <Autocomplete
                    freeSolo
                    options={majorAutoComplete}
                    value={specialization}
                    className="lg:flex-1"
                    onChange={(_event, newValue) =>
                      setSpecialization(newValue || "")
                    }
                    onInputChange={(_event, newInputValue) =>
                      setSpecialization(newInputValue)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Chuyên ngành"
                        required
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                          },
                        }}
                      />
                    )}
                  />
                </div>

                {/* Job Field and Experience Row */}
                <div className="flex flex-col gap-6 lg:flex-row">
                  <Autocomplete
                    freeSolo
                    options={jobFieldsAutoComplete}
                    value={jobField}
                    className="lg:flex-1"
                    onChange={(_e, newValue) => setJobField(newValue || "")}
                    onInputChange={(_e, newInputValue) =>
                      setJobField(newInputValue)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Lĩnh vực công việc"
                        required
                        variant="outlined"
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <>
                              <Work className="mr-3 text-teal-500" />
                              {params.InputProps.startAdornment}
                            </>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
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
                    InputProps={{
                      startAdornment: (
                        <Psychology className="mr-3 text-indigo-500" />
                      ),
                    }}
                    className="lg:flex-1"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                      },
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div>
              <div className="mb-8 flex items-center">
                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                  <Description className="text-2xl text-green-600" />
                </div>
                <div>
                  <Typography variant="h5" className="font-bold text-gray-800">
                    Giới thiệu bản thân
                  </Typography>
                  <Typography variant="body2" className="text-gray-500">
                    Chia sẻ về kinh nghiệm và mục tiêu của bạn
                  </Typography>
                </div>
              </div>
              <Divider className="mb-8" />

              <TextField
                fullWidth
                label="Giới thiệu bản thân"
                multiline
                rows={5}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Chia sẻ về kinh nghiệm, thành tích và mục tiêu nghề nghiệp của bạn..."
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "white",
                      boxShadow: "0 8px 25px rgba(37, 99, 235, 0.15)",
                    },
                  },
                }}
              />
            </div>
          </div>
        </Paper>
      </div>
    </Fade>
  );

  const renderCredentialsStep = () => (
    <Fade in={activeStep === 1} timeout={500}>
      <div className="mx-auto mt-8 w-full max-w-7xl px-4">
        <div className="flex flex-col gap-8 xl:flex-row">
          {/* Degrees Section */}
          <div className="flex-1">
            <Paper
              elevation={8}
              className="h-full overflow-hidden rounded-3xl"
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar
                      sx={{
                        width: 56,
                        height: 56,
                        bgcolor: "white",
                        color: "#2563eb",
                        mr: 3,
                      }}
                    >
                      <School sx={{ fontSize: 28 }} />
                    </Avatar>
                    <div>
                      <Typography variant="h5" className="mb-1 font-bold">
                        Bằng cấp
                      </Typography>
                      <Typography variant="body1" className="opacity-80">
                        {degrees.length} bằng cấp đã thêm
                      </Typography>
                    </div>
                  </div>
                  <Chip
                    label={degrees.length}
                    sx={{
                      bgcolor: "white",
                      color: "#2563eb",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                      height: 40,
                      minWidth: 60,
                    }}
                  />
                </div>
              </div>

              {/* Content */}
              <div className="bg-white p-6 md:p-8">
                <div className="mb-8 max-h-96 space-y-4 overflow-y-auto pr-2">
                  {degrees.length === 0 ? (
                    <div className="py-16 text-center">
                      <School className="mx-auto mb-6 text-8xl text-gray-300" />
                      <Typography
                        variant="h5"
                        className="mb-3 font-bold text-gray-500"
                      >
                        Chưa có bằng cấp nào
                      </Typography>
                      <Typography
                        variant="body1"
                        className="mx-auto max-w-md text-gray-400"
                      >
                        Thêm bằng cấp để nâng cao uy tín và chứng minh trình độ
                        chuyên môn của bạn
                      </Typography>
                    </div>
                  ) : (
                    degrees.map((degree, index) => (
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
                    ))
                  )}
                </div>

                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setOpenModal(true)}
                  fullWidth
                  size="large"
                  className="py-4 text-lg font-semibold"
                  sx={{
                    borderRadius: 3,
                    background:
                      "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                    boxShadow: "0 6px 20px rgba(33, 203, 243, .4)",
                    "&:hover": {
                      background:
                        "linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 25px rgba(33, 203, 243, .5)",
                    },
                  }}
                >
                  Thêm bằng cấp
                </Button>
              </div>
            </Paper>
          </div>

          {/* Certifications Section */}
          <div className="flex-1">
            <Paper elevation={8} className="h-full overflow-hidden rounded-3xl">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-purple-800 px-6 py-8 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar
                      sx={{
                        width: 56,
                        height: 56,
                        bgcolor: "white",
                        color: "#9333ea",
                        mr: 3,
                      }}
                    >
                      <Badge sx={{ fontSize: 28 }} />
                    </Avatar>
                    <div>
                      <Typography variant="h5" className="mb-1 font-bold">
                        Chứng chỉ
                      </Typography>
                      <Typography variant="body1" className="opacity-80">
                        {certifications.length} chứng chỉ đã thêm
                      </Typography>
                    </div>
                  </div>
                  <Chip
                    label={certifications.length}
                    sx={{
                      bgcolor: "white",
                      color: "#9333ea",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                      height: 40,
                      minWidth: 60,
                    }}
                  />
                </div>
              </div>

              {/* Content */}
              <div className="bg-white p-6 md:p-8">
                <div className="mb-8 max-h-96 space-y-4 overflow-y-auto pr-2">
                  {certifications.length === 0 ? (
                    <div className="py-16 text-center">
                      <Badge className="mx-auto mb-6 text-8xl text-gray-300" />
                      <Typography
                        variant="h5"
                        className="mb-3 font-bold text-gray-500"
                      >
                        Chưa có chứng chỉ nào
                      </Typography>
                      <Typography
                        variant="body1"
                        className="mx-auto max-w-md text-gray-400"
                      >
                        Thêm chứng chỉ để chứng minh năng lực chuyên môn và kinh
                        nghiệm thực tế
                      </Typography>
                    </div>
                  ) : (
                    certifications.map((cert, index) => (
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
                              borderColor: "#9333ea",
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
                                    ? new Date(cert.expiryDate).toLocaleDateString("vi-VN")
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
                    ))
                  )}
                </div>

                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setOpenCertificationModal(true)}
                  fullWidth
                  size="large"
                  className="py-4 text-lg font-semibold"
                  sx={{
                    borderRadius: 3,
                    background:
                      "linear-gradient(45deg, #9C27B0 30%, #E91E63 90%)",
                    boxShadow: "0 6px 20px rgba(156, 39, 176, .4)",
                    "&:hover": {
                      background:
                        "linear-gradient(45deg, #7B1FA2 30%, #C2185B 90%)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 25px rgba(156, 39, 176, .5)",
                    },
                  }}
                >
                  Thêm chứng chỉ
                </Button>
              </div>
            </Paper>
          </div>
        </div>
      </div>
    </Fade>
  );

  const renderConfirmationStep = () => (
    <Fade in={activeStep === 2} timeout={500}>
      <div className="mx-auto mt-8 w-full max-w-6xl px-4">
        <Paper
          elevation={8}
          className="overflow-hidden rounded-3xl"
          sx={{
            background:
              "linear-gradient(135deg, #ffffff 0%, #f0fdf4 50%, #ecfdf5 100%)",
          }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-800 px-8 py-12 text-white">
            <div className="flex flex-col items-center text-center">
              <Avatar
                className="mb-6 shadow-2xl"
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: "white",
                  color: "#16a34a",
                }}
              >
                <CheckCircle sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h3" className="mb-4 font-bold">
                Xác nhận thông tin
              </Typography>
              <Typography variant="h6" className="max-w-3xl opacity-90">
                Kiểm tra lại thông tin trước khi gửi yêu cầu đăng ký. Sau khi
                gửi, tài khoản sẽ chờ phê duyệt
              </Typography>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 md:p-12">
            <Alert
              severity="info"
              className="mb-8"
              sx={{
                borderRadius: 3,
                fontSize: "1.1rem",
                "& .MuiAlert-icon": {
                  fontSize: "2rem",
                },
              }}
            >
              <AlertTitle className="text-lg font-bold">
                Thông tin quan trọng
              </AlertTitle>
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
          </div>
        </Paper>
      </div>
    </Fade>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <Container maxWidth="xl">
        {/* Header */}
        <Paper
          elevation={8}
          className="mb-8 overflow-hidden rounded-3xl"
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          <div className=" bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-800 px-8 py-12 text-white">
            <Typography variant="h3" className="mb-4 text-center font-bold">
              Đăng ký tài khoản Giảng viên
            </Typography>
            {/* <Typography
              variant="h5"
              className="mb-8 text-center font-light opacity-90"
            >
              Hoàn thành các bước sau để tạo tài khoản giảng viên chuyên nghiệp
            </Typography> */}

            <Stepper
              activeStep={activeStep}
              alternativeLabel
              className="mb-8"
              sx={{
                "& .MuiStepConnector-line": {
                  borderTopWidth: "4px",
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
                          bgcolor:
                            index <= activeStep
                              ? "#fff"
                              : "rgba(255,255,255,0.3)",
                          color: index <= activeStep ? "#2563eb" : "#fff",
                          width: 56,
                          height: 56,
                          fontSize: "1.5rem",
                          boxShadow:
                            index <= activeStep
                              ? "0 8px 25px rgba(0,0,0,0.2)"
                              : "none",
                        }}
                      >
                        {step.icon}
                      </Avatar>
                    }
                  >
                    <div className="mt-4">
                      <Typography
                        variant="h6"
                        className={`font-bold ${index === activeStep ? "text-white" : "text-gray-200"}`}
                      >
                        {step.label}
                      </Typography>
                      <Typography
                        variant="body1"
                        className={`${index === activeStep ? "text-gray-100" : "text-gray-300"}`}
                      >
                        {step.description}
                      </Typography>
                    </div>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>

            {isSubmitting && (
              <div className="mt-8">
                <LinearProgress
                  sx={{
                    borderRadius: 3,
                    height: 10,
                    backgroundColor: "rgba(255,255,255,0.3)",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "#fff",
                      borderRadius: 3,
                    },
                  }}
                />
                <Typography
                  variant="h6"
                  className="mt-4 text-center text-gray-100"
                >
                  Đang xử lý đăng ký của bạn...
                </Typography>
              </div>
            )}
          </div>
        </Paper>

        {/* Step Content */}
        {activeStep === 0 && renderPersonalInfoStep()}
        {activeStep === 1 && renderCredentialsStep()}
        {activeStep === 2 && renderConfirmationStep()}

        {/* Navigation Buttons */}
        <Paper
          elevation={4}
          className="mt-8 rounded-3xl p-8"
          sx={{
            background: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
              size="large"
              className="order-2 px-8 py-4 text-lg font-semibold md:order-1"
              sx={{
                borderRadius: 3,
                borderWidth: 2,
                minWidth: 150,
                "&:hover": {
                  borderWidth: 2,
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                },
              }}
            >
              Trở lại
            </Button>

            <div className="order-1 flex items-center gap-4 md:order-2">
              {isStepOptional(activeStep) && (
                <Button
                  color="inherit"
                  onClick={handleSkip}
                  size="large"
                  className="px-6 py-4 text-lg font-semibold"
                  sx={{
                    borderRadius: 3,
                    minWidth: 120,
                    "&:hover": {
                      backgroundColor: "rgba(0,0,0,0.04)",
                    },
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
                className="px-8 py-4 text-lg font-semibold"
                sx={{
                  borderRadius: 3,
                  minWidth: 200,
                  background:
                    "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                  boxShadow: "0 6px 20px rgba(33, 203, 243, .4)",
                  "&:hover": {
                    background:
                      "linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 25px rgba(33, 203, 243, .5)",
                  },
                  "&:disabled": {
                    background: "#ccc",
                  },
                }}
              >
                {activeStep === steps.length - 1
                  ? "Hoàn tất đăng ký"
                  : "Tiếp tục"}
              </Button>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <Typography variant="h6" className="font-semibold text-gray-600">
                Bước {activeStep + 1} / {steps.length}
              </Typography>
              <Typography variant="h6" className="font-semibold text-gray-600">
                {Math.round(((activeStep + 1) / steps.length) * 100)}% hoàn
                thành
              </Typography>
            </div>
            <LinearProgress
              variant="determinate"
              value={((activeStep + 1) / steps.length) * 100}
              sx={{
                borderRadius: 3,
                height: 8,
                backgroundColor: "#e5e7eb",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#3b82f6",
                  borderRadius: 3,
                },
              }}
            />
          </div>
        </Paper>

        {/* Completion Status */}
        {activeStep === steps.length - 1 && (
          <Slide direction="up" in={true} timeout={500}>
            <Alert
              severity="success"
              className="mt-8 rounded-3xl"
              sx={{
                fontSize: "1.1rem",
                padding: "24px",
                "& .MuiAlert-icon": {
                  fontSize: "2.5rem",
                },
              }}
            >
              <AlertTitle className="mb-2 text-xl font-bold">
                Sẵn sàng hoàn tất!
              </AlertTitle>
              <Typography variant="body1" className="text-lg">
                Bạn đã hoàn thành tất cả các bước! Nhấn "Hoàn tất đăng ký" để
                gửi yêu cầu đến quản trị viên.
              </Typography>
            </Alert>
          </Slide>
        )}
      </Container>

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
    </div>
  );
};

export default RegisterLecturer;
