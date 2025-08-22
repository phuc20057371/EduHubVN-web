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
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Typography,
  Tab,
  Tabs,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import type { Lecturer } from "../types/Lecturer";
// Removed duplicate useState import
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ScienceIcon from "@mui/icons-material/Science";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setLecturers } from "../redux/slice/LecturerSlice";
import { API } from "../utils/Fetch";
import { validateLecturerInfo } from "../utils/Validate";
import { formatDate, getAcademicRank, getStatusColor, getStatusText } from "../utils/ChangeText";

interface LecturerUpdateDialogProps {
  open: boolean;
  onClose: () => void;
  lecturer?: Lecturer;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`lecturer-tabpanel-${index}`}
      aria-labelledby={`lecturer-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const LecturerUpdateDialog = ({
  open,
  onClose,
  lecturer,
}: LecturerUpdateDialogProps) => {
  if (!open || !lecturer) return null;
  const dispatch = useDispatch();

  // Tab state
  const [tabValue, setTabValue] = useState(0);

  // Lecturer profile data
  const [lecturerData, setLecturerData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Basic info states
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

  // Fetch full lecturer data when dialog opens
  useEffect(() => {
    if (open && lecturer?.id) {
      fetchLecturerData();
    }
  }, [open, lecturer?.id]);

  const fetchLecturerData = async () => {
    try {
      setLoading(true);
      const response = await API.admin.getLecturerAllProfile({ id: lecturer.id });
      if (response.data.success) {
        setLecturerData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching lecturer data:", error);
      toast.error("Không thể tải dữ liệu giảng viên");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Render functions for different sections
  const renderBasicInfo = () => (
    <Box display="flex" flexDirection="column" gap={3}>
      {/* Profile Header Card - Same as before */}
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
                  label={getAcademicRank(lecturer.academicRank)}
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
                📧 {email || "Chưa có email"}
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
                label={getStatusText(lecturer.status)}
                color={getStatusColor(lecturer.status) as any}
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

      {/* Form Cards Grid - Same as before */}
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
                  {lecturer.createdAt
                    ? new Date(lecturer.createdAt).toLocaleString("vi-VN")
                    : "Chưa cập nhật"}
                </Typography>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Cập nhật lúc:{" "}
                  {lecturer.updatedAt
                    ? new Date(lecturer.updatedAt).toLocaleString("vi-VN")
                    : "Chưa cập nhật"}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );

  const renderDegrees = () => (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h6">
          Bằng cấp ({lecturerData?.degrees?.length || 0})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            /* TODO: Add degree */
          }}
        >
          Thêm bằng cấp
        </Button>
      </Box>

      {lecturerData?.degrees?.map((degree: any) => (
        <Card key={degree.id} sx={{ mb: 2 }}>
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="start"
            >
              <Box flex={1}>
                <Typography variant="h6" gutterBottom>
                  {degree.name}
                </Typography>
                <Box display="flex" gap={2}>
                  <Box flex={1}>
                    <Typography variant="body2" color="text.secondary">
                      Chuyên ngành: {degree.major}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Trường: {degree.institution}
                    </Typography>
                  </Box>
                  <Box flex={1}>
                    <Typography variant="body2" color="text.secondary">
                      Năm bắt đầu: {degree.startYear}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Năm tốt nghiệp: {degree.graduationYear}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {degree.description}
                </Typography>
                <Box mt={1}>
                  <Chip
                    label={getStatusText(degree.status)}
                    color={getStatusColor(degree.status) as any}
                    size="small"
                  />
                </Box>
              </Box>
              <Box display="flex" flexDirection="column" gap={1}>
                <IconButton
                  size="small"
                  onClick={() => window.open(degree.url, "_blank")}
                >
                  <VisibilityIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => {
                    /* TODO: Edit degree */
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => {
                    /* TODO: Delete degree */
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  const renderCertifications = () => (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h6">
          Chứng chỉ ({lecturerData?.certifications?.length || 0})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            /* TODO: Add certification */
          }}
        >
          Thêm chứng chỉ
        </Button>
      </Box>

      {lecturerData?.certifications?.map((cert: any) => (
        <Card key={cert.id} sx={{ mb: 2 }}>
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="start"
            >
              <Box flex={1}>
                <Typography variant="h6" gutterBottom>
                  {cert.name}
                </Typography>
                <Box display="flex" gap={2}>
                  <Box flex={1}>
                    <Typography variant="body2" color="text.secondary">
                      Cấp bởi: {cert.issuedBy}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Ngày cấp: {formatDate(cert.issueDate)}
                    </Typography>
                  </Box>
                  <Box flex={1}>
                    <Typography variant="body2" color="text.secondary">
                      Ngày hết hạn:{" "}
                      {cert.expiryDate
                        ? formatDate(cert.expiryDate)
                        : "Không có"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Cấp độ: {cert.level}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {cert.description}
                </Typography>
                <Box mt={1}>
                  <Chip
                    label={getStatusText(cert.status)}
                    color={getStatusColor(cert.status) as any}
                    size="small"
                  />
                </Box>
              </Box>
              <Box display="flex" flexDirection="column" gap={1}>
                <IconButton
                  size="small"
                  onClick={() => window.open(cert.certificateUrl, "_blank")}
                >
                  <VisibilityIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => {
                    /* TODO: Edit certification */
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => {
                    /* TODO: Delete certification */
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  const renderCourses = () => (
    <Box>
      {/* Owned Courses Section */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">
            Khóa học sở hữu ({lecturerData?.ownedTrainingCourses?.length || 0})
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box display="flex" justifyContent="flex-end" mb={2}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                /* TODO: Add owned course */
              }}
            >
              Thêm khóa học sở hữu
            </Button>
          </Box>

          {lecturerData?.ownedTrainingCourses?.map((course: any) => (
            <Card key={course.id} sx={{ mb: 2 }}>
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="start"
                >
                  <Box flex={1}>
                    <Typography variant="h6" gutterBottom>
                      {course.title}
                    </Typography>
                    <Box display="flex" gap={2}>
                      <Box flex={1}>
                        <Typography variant="body2" color="text.secondary">
                          Chủ đề: {course.topic}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Loại khóa học: {course.courseType}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Quy mô: {course.scale}
                        </Typography>
                      </Box>
                      <Box flex={1}>
                        <Typography variant="body2" color="text.secondary">
                          Bắt đầu: {formatDate(course.startDate)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Kết thúc: {formatDate(course.endDate)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Giá: {formatCurrency(course.price)}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {course.description}
                    </Typography>
                    <Box mt={1}>
                      <Chip
                        label={getStatusText(course.status)}
                        color={getStatusColor(course.status) as any}
                        size="small"
                      />
                    </Box>
                  </Box>
                  <Box display="flex" flexDirection="column" gap={1}>
                    <IconButton
                      size="small"
                      onClick={() => window.open(course.courseUrl, "_blank")}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => {
                        /* TODO: Edit course */
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        /* TODO: Delete course */
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </AccordionDetails>
      </Accordion>

      {/* Attended Courses Section */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">
            Khóa học đã tham gia (
            {lecturerData?.attendedTrainingCourses?.length || 0})
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box display="flex" justifyContent="flex-end" mb={2}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                /* TODO: Add attended course */
              }}
            >
              Thêm khóa học đã tham gia
            </Button>
          </Box>

          {lecturerData?.attendedTrainingCourses?.map((course: any) => (
            <Card key={course.id} sx={{ mb: 2 }}>
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="start"
                >
                  <Box flex={1}>
                    <Typography variant="h6" gutterBottom>
                      {course.title}
                    </Typography>
                    <Box display="flex" gap={2}>
                      <Box flex={1}>
                        <Typography variant="body2" color="text.secondary">
                          Chủ đề: {course.topic}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Tổ chức: {course.organizer}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Địa điểm: {course.location}
                        </Typography>
                      </Box>
                      <Box flex={1}>
                        <Typography variant="body2" color="text.secondary">
                          Bắt đầu: {formatDate(course.startDate)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Kết thúc: {formatDate(course.endDate)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Số giờ: {course.numberOfHour}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {course.description}
                    </Typography>
                    <Box mt={1}>
                      <Chip
                        label={getStatusText(course.status)}
                        color={getStatusColor(course.status) as any}
                        size="small"
                      />
                    </Box>
                  </Box>
                  <Box display="flex" flexDirection="column" gap={1}>
                    <IconButton
                      size="small"
                      onClick={() => window.open(course.courseUrl, "_blank")}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => {
                        /* TODO: Edit course */
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        /* TODO: Delete course */
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </AccordionDetails>
      </Accordion>
    </Box>
  );

  const renderResearchProjects = () => (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h6">
          Dự án nghiên cứu ({lecturerData?.researchProjects?.length || 0})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            /* TODO: Add research project */
          }}
        >
          Thêm dự án nghiên cứu
        </Button>
      </Box>

      {lecturerData?.researchProjects?.map((project: any) => (
        <Card key={project.id} sx={{ mb: 2 }}>
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="start"
            >
              <Box flex={1}>
                <Typography variant="h6" gutterBottom>
                  {project.title}
                </Typography>
                <Box display="flex" gap={2}>
                  <Box flex={1}>
                    <Typography variant="body2" color="text.secondary">
                      Lĩnh vực: {project.researchArea}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Quy mô: {project.scale}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Vai trò: {project.roleInProject}
                    </Typography>
                  </Box>
                  <Box flex={1}>
                    <Typography variant="body2" color="text.secondary">
                      Bắt đầu: {formatDate(project.startDate)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Kết thúc: {formatDate(project.endDate)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Kinh phí: {formatCurrency(project.foundingAmount)}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {project.description}
                </Typography>
                <Box mt={1}>
                  <Chip
                    label={getStatusText(project.status)}
                    color={getStatusColor(project.status) as any}
                    size="small"
                  />
                </Box>
              </Box>
              <Box display="flex" flexDirection="column" gap={1}>
                <IconButton
                  size="small"
                  onClick={() => window.open(project.publishedUrl, "_blank")}
                >
                  <VisibilityIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => {
                    /* TODO: Edit project */
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => {
                    /* TODO: Delete project */
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );

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

      const res = await API.admin.updateLecturer(updatedLecturer);
      if (res.data.success === false) {
        toast.error(res.data.error);
        return;
      }
      const response = await API.admin.getAllLecturers();
      dispatch(setLecturers(response.data.data));
      toast.success("Cập nhật thông tin giảng viên thành công");
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
                Quản lý thông tin giảng viên
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {lecturer?.fullName} #{lecturer?.id}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>

        <Box sx={{ borderBottom: 1, borderColor: "divider", px: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab
              icon={<PersonIcon />}
              label="Thông tin cơ bản"
              id="lecturer-tab-0"
              aria-controls="lecturer-tabpanel-0"
            />
            <Tab
              icon={<SchoolIcon />}
              label="Bằng cấp"
              id="lecturer-tab-1"
              aria-controls="lecturer-tabpanel-1"
            />
            <Tab
              icon={<WorkIcon />}
              label="Chứng chỉ"
              id="lecturer-tab-2"
              aria-controls="lecturer-tabpanel-2"
            />
            <Tab
              icon={<MenuBookIcon />}
              label="Khóa học"
              id="lecturer-tab-3"
              aria-controls="lecturer-tabpanel-3"
            />
            <Tab
              icon={<ScienceIcon />}
              label="Nghiên cứu"
              id="lecturer-tab-4"
              aria-controls="lecturer-tabpanel-4"
            />
          </Tabs>
        </Box>

        <DialogContent sx={{ p: 0, height: "70vh", overflow: "auto" }}>
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              <Typography>Đang tải dữ liệu...</Typography>
            </Box>
          ) : (
            <>
              <TabPanel value={tabValue} index={0}>
                {renderBasicInfo()}
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                {renderDegrees()}
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                {renderCertifications()}
              </TabPanel>
              <TabPanel value={tabValue} index={3}>
                {renderCourses()}
              </TabPanel>
              <TabPanel value={tabValue} index={4}>
                {renderResearchProjects()}
              </TabPanel>
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={onClose}
            color="inherit"
            variant="outlined"
            size="large"
          >
            Đóng
          </Button>
          {tabValue === 0 && (
            <Button
              onClick={handleSave}
              color="primary"
              variant="contained"
              size="large"
              startIcon={<EditIcon />}
            >
              Lưu thay đổi
            </Button>
          )}
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
