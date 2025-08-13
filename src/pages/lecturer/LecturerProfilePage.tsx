import {
  Assignment,
  Business,
  Cake,
  CalendarToday,
  Edit,
  Email,
  Grade,
  Link as LinkIcon,
  LocationOn,
  Person,
  Phone,
  School,
  Science,
  Timeline,
  WorkHistory,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLecturerProfile } from "../../redux/slice/LecturerProfileSlice";
import { colors } from "../../theme/colors";
import { API } from "../../utils/Fetch";

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  color: string;
}

const StatCard = ({ icon, title, value, color }: StatCardProps) => (
  <Card className="h-full">
    <CardContent className="p-6 text-center">
      <Box
        className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-${color}-100`}
      >
        {icon}
      </Box>
      <Typography variant="h4" className="mb-2 font-bold text-gray-800">
        {value}
      </Typography>
      <Typography variant="body2" className="text-gray-600">
        {title}
      </Typography>
    </CardContent>
  </Card>
);

const LecturerProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const lecturerProfile = useSelector((state: any) => state.lecturerProfile);
  const userProfile = useSelector((state: any) => state.userProfile);
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    const fetchLecturerProfile = async () => {
      try {
        const response = await API.lecturer.getLecturerProfile();
        dispatch(setLecturerProfile(response.data.data));
      } catch (error) {
        console.error("Error fetching lecturer profile:", error);
      }
    };

    fetchLecturerProfile();
  }, [dispatch]);



  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "success";
      case "PENDING":
        return "warning";
      case "REJECTED":
        return "error";
      default:
        return "default";
    }
  };

  const getAcademicRankDisplay = (rank: string) => {
    const ranks: { [key: string]: string } = {
      TS: "Tiến sĩ",
      ThS: "Thạc sĩ",
      CN: "Cử nhân",
      KS: "Kỹ sư",
      PGS: "Phó Giáo sư",
      GS: "Giáo sư",
    };
    return ranks[rank] || rank;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  if (!lecturerProfile?.lecturer) {
    return (
      <Container className="py-8">
        <div className="flex h-64 items-center justify-center">
          <Typography variant="h6" className="text-gray-600">
            Đang tải thông tin...
          </Typography>
        </div>
      </Container>
    );
  }

  const {
    lecturer,
    lecturerUpdate,
    degrees,
    certificates,
    ownedTrainingCourses,
    attendedTrainingCourses,
    researchProjects,
  } = lecturerProfile;

  const menuItems = [
    { id: "overview", label: "Tổng quan", icon: <Person /> },
    {
      id: "degrees",
      label: "Bằng cấp",
      icon: <School />,
      count: degrees?.length || 0,
    },
    {
      id: "certificates",
      label: "Chứng chỉ",
      icon: <Assignment />,
      count: certificates?.length || 0,
    },
    {
      id: "courses",
      label: "Khóa học",
      icon: <WorkHistory />,
      count:
        (attendedTrainingCourses?.length || 0) +
        (ownedTrainingCourses?.length || 0),
    },
    {
      id: "research",
      label: "Nghiên cứu",
      icon: <Science />,
      count: researchProjects?.length || 0,
    },
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<School className="text-blue-600" />}
          title="Bằng cấp"
          value={degrees?.length || 0}
          color="blue"
        />
        <StatCard
          icon={<Assignment className="text-green-600" />}
          title="Chứng chỉ"
          value={certificates?.length || 0}
          color="green"
        />
        <StatCard
          icon={<WorkHistory className="text-purple-600" />}
          title="Khóa học"
          value={
            (attendedTrainingCourses?.length || 0) +
            (ownedTrainingCourses?.length || 0)
          }
          color="purple"
        />
        <StatCard
          icon={<Science className="text-red-600" />}
          title="Nghiên cứu"
          value={researchProjects?.length || 0}
          color="red"
        />
      </div>

      {/* Bio Section */}
      {lecturer.bio && (
        <Card>
          <CardContent className="p-6">
            <Typography
              variant="h6"
              className="mb-4 flex items-center gap-2 font-semibold"
            >
              <Person className="text-blue-600" />
              Giới thiệu
            </Typography>
            <Typography
              variant="body1"
              className="leading-relaxed text-gray-700"
            >
              {lecturer.bio}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Recent Activities */}
      <Card>
        <CardContent className="p-6">
          <Typography
            variant="h6"
            className="mb-4 flex items-center gap-2 font-semibold"
          >
            <Timeline className="text-green-600" />
            Hoạt động gần đây
          </Typography>
          <div className="space-y-4">
            {degrees?.slice(0, 2).map((degree: any) => (
              <div
                key={degree.id}
                className="flex items-start gap-4 rounded-lg bg-gray-50 p-4"
              >
                <School className="mt-1 text-blue-600" />
                <div>
                  <Typography variant="subtitle2" className="font-medium">
                    {degree.name}
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    {degree.institution}
                  </Typography>
                  <Chip
                    label={degree.status}
                    color={getStatusColor(degree.status) as any}
                    size="small"
                    className="mt-2"
                  />
                </div>
              </div>
            ))}
            {certificates?.slice(0, 1).map((cert: any) => (
              <div
                key={cert.id}
                className="flex items-start gap-4 rounded-lg bg-gray-50 p-4"
              >
                <Assignment className="mt-1 text-green-600" />
                <div>
                  <Typography variant="subtitle2" className="font-medium">
                    {cert.name}
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    {cert.issuedBy}
                  </Typography>
                  <Chip
                    label={cert.status}
                    color={getStatusColor(cert.status) as any}
                    size="small"
                    className="mt-2"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSection = (items: any[], type: string) => (
    <div className="space-y-6">
      {items && items.length > 0 ? (
        items.map((item: any) => (
          <Card
            key={item.id}
            className="transition-shadow duration-300 hover:shadow-lg"
          >
            <CardContent className="p-6">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-start gap-4">
                  {type === "degrees" && (
                    <School className="mt-1 text-blue-600" />
                  )}
                  {type === "certificates" && (
                    <Assignment className="mt-1 text-green-600" />
                  )}
                  {type === "courses" && (
                    <WorkHistory className="mt-1 text-purple-600" />
                  )}
                  {type === "research" && (
                    <Science className="mt-1 text-red-600" />
                  )}
                  <div>
                    <Typography variant="h6" className="mb-1 font-semibold">
                      {item.name || item.title}
                    </Typography>
                    <Typography variant="body2" className="mb-2 text-gray-600">
                      {item.major ||
                        item.issuedBy ||
                        item.organizer ||
                        item.researchArea}
                    </Typography>
                  </div>
                </div>
                <Chip
                  label={item.status}
                  color={getStatusColor(item.status) as any}
                  size="small"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                {type === "degrees" && (
                  <>
                    <div className="flex items-center gap-2">
                      <Business className="text-gray-500" fontSize="small" />
                      <span className="text-gray-700">{item.institution}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarToday
                        className="text-gray-500"
                        fontSize="small"
                      />
                      <span className="text-gray-700">
                        {item.startYear} - {item.graduationYear}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Grade className="text-gray-500" fontSize="small" />
                      <span className="text-gray-700">{item.level}</span>
                    </div>
                  </>
                )}

                {type === "certificates" && (
                  <>
                    <div className="flex items-center gap-2">
                      <CalendarToday
                        className="text-gray-500"
                        fontSize="small"
                      />
                      <span className="text-gray-700">
                        Cấp: {formatDate(item.issueDate)}
                      </span>
                    </div>
                    {item.expiryDate && (
                      <div className="flex items-center gap-2">
                        <CalendarToday
                          className="text-gray-500"
                          fontSize="small"
                        />
                        <span className="text-gray-700">
                          Hết hạn: {formatDate(item.expiryDate)}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Grade className="text-gray-500" fontSize="small" />
                      <span className="text-gray-700">
                        Cấp độ: {item.level}
                      </span>
                    </div>
                  </>
                )}

                {type === "courses" && (
                  <>
                    <div className="flex items-center gap-2">
                      <CalendarToday
                        className="text-gray-500"
                        fontSize="small"
                      />
                      <span className="text-gray-700">
                        {formatDate(item.startDate)} -{" "}
                        {formatDate(item.endDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <LocationOn className="text-gray-500" fontSize="small" />
                      <span className="text-gray-700">{item.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Assignment className="text-gray-500" fontSize="small" />
                      <span className="text-gray-700">
                        {item.numberOfHour} giờ
                      </span>
                    </div>
                  </>
                )}

                {type === "research" && (
                  <>
                    <div className="flex items-center gap-2">
                      <CalendarToday
                        className="text-gray-500"
                        fontSize="small"
                      />
                      <span className="text-gray-700">
                        {formatDate(item.startDate)} -{" "}
                        {formatDate(item.endDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Business className="text-gray-500" fontSize="small" />
                      <span className="text-gray-700">
                        {item.foundingSource}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Person className="text-gray-500" fontSize="small" />
                      <span className="text-gray-700">
                        Vai trò: {item.roleInProject}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {item.description && (
                <>
                  <Divider className="my-4" />
                  <Typography variant="body2" className="text-gray-600">
                    {item.description}
                  </Typography>
                </>
              )}

              {(item.url || item.certificateUrl || item.publishedUrl) && (
                <div className="mt-4">
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<LinkIcon />}
                    href={item.url || item.certificateUrl || item.publishedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Xem chi tiết
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      ) : (
        <Alert severity="info" className="text-center">
          Chưa có thông tin trong mục này
        </Alert>
      )}
    </div>
  );

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.background.secondary }}
    >
      <Container maxWidth="xl" className="py-8">
        {/* Header Section */}
        <Card className="mb-8 overflow-hidden">
          <div
            className="h-32"
            style={{ background: colors.background.gradient.primary }}
          ></div>
          <CardContent className="relative -mt-16 p-8">
            <div className="flex flex-col items-start gap-6 lg:flex-row">
              <div className="relative">
                <Avatar
                  src={lecturer.avatarUrl}
                  className="h-32 w-32 border-4 border-white shadow-xl"
                  sx={{ width: 128, height: 128 }}
                >
                  {lecturer.fullName?.charAt(0)}
                </Avatar>
                {lecturerUpdate && lecturerUpdate.status === "PENDING" && (
                  <div className="absolute -right-2 -top-2">
                    <Chip
                      label="Chờ duyệt"
                      color="warning"
                      size="small"
                      className="shadow-md"
                    />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <Typography
                      variant="h4"
                      className="mb-2 font-bold text-gray-800"
                    >
                      <strong>{lecturer.fullName}</strong>
                    </Typography>
                    <Typography
                      variant="h6"
                      className="mb-4 pt-5 text-gray-600"
                    >
                      {getAcademicRankDisplay(lecturer.academicRank)} -{" "}
                      {lecturer.specialization}
                    </Typography>

                    <div className="mb-4 flex flex-col flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <WorkHistory fontSize="small" />
                        <Chip
                          label={`${lecturer.experienceYears} năm`}
                          size="small"
                          variant="outlined"
                          color="info"
                        />
                        <span>
                          kinh nghiệm trong lĩnh vực {lecturer.jobField}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone fontSize="small" />
                        <span>{lecturer.phoneNumber}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Email fontSize="small" />
                        <span>
                          {lecturer.email ||
                            userProfile?.email ||
                            "Chưa cập nhật email"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Cake fontSize="small" />
                        <span>{formatDate(lecturer.dateOfBirth)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <LocationOn fontSize="small" />
                        <span>{lecturer.address}</span>
                      </div>
                    </div>
                  </div>
                  <Box gap={2} className="flex flex-col lg:flex-row">
                    <Button
                      variant="contained"
                      startIcon={<Edit />}
                      onClick={() => navigate("/lecturer/edit-profile")}
                      sx={{
                        fontFamily: "'Inter', sans-serif",
                        background: colors.background.gradient.secondary,
                        color: "white",
                        fontWeight: 600,
                        textTransform: "none",
                        borderRadius: 3,
                        "&:hover": {
                          background: `linear-gradient(135deg, ${colors.primary[600]} 0%, ${colors.secondary[700]} 100%)`,
                          transform: "translateY(-1px)",
                        },
                      }}
                    >
                      Chỉnh sửa hồ sơ
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() =>
                        window.open(`/lecturer-info/${lecturer.id}`, "_blank")
                      }
                      sx={{
                        fontFamily: "'Inter', sans-serif",
                        background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.secondary[600]} 100%)`,
                        color: "white",
                        fontWeight: 600,
                        textTransform: "none",
                        borderRadius: 3,
                        "&:hover": {
                          background: `linear-gradient(135deg, ${colors.primary[600]} 0%, ${colors.secondary[700]} 100%)`,
                          transform: "translateY(-1px)",
                        },
                      }}
                    >
                      CV của tôi
                    </Button>
                  </Box>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar Navigation */}
          <div className="lg:w-80">
            <Card className="sticky top-8">
              <CardContent className="p-0">
                <div
                  className="border-b p-6"
                  style={{ backgroundColor: colors.background.tertiary }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      color: colors.text.primary,
                    }}
                  >
                    Menu
                  </Typography>
                </div>
                <div className="p-2">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className="mb-2 flex w-full items-center justify-between rounded-lg p-4 transition-colors"
                      style={{
                        backgroundColor:
                          activeSection === item.id
                            ? colors.primary[50]
                            : "transparent",
                        color:
                          activeSection === item.id
                            ? colors.primary[700]
                            : colors.text.tertiary,
                        border:
                          activeSection === item.id
                            ? `1px solid ${colors.primary[200]}`
                            : "1px solid transparent",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span
                          className="font-medium"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          {item.label}
                        </span>
                      </div>
                      {item.count !== undefined && (
                        <Chip
                          label={item.count}
                          size="small"
                          sx={{
                            backgroundColor:
                              activeSection === item.id
                                ? colors.primary[200]
                                : colors.neutral[200],
                            color:
                              activeSection === item.id
                                ? colors.primary[700]
                                : colors.neutral[600],
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 600,
                          }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeSection === "overview" && renderOverview()}
            {activeSection === "degrees" && renderSection(degrees, "degrees")}
            {activeSection === "certificates" &&
              renderSection(certificates, "certificates")}
            {activeSection === "courses" &&
              renderSection(
                [
                  ...(attendedTrainingCourses || []),
                  ...(ownedTrainingCourses || []),
                ],
                "courses",
              )}
            {activeSection === "research" &&
              renderSection(researchProjects, "research")}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default LecturerProfilePage;
