import {
  Assignment,
  Cake,
  Edit,
  Email,
  LocationOn,
  Person,
  Phone,
  School,
  Science,
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
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LecturerUpdateInfoDialog from "../../components/LecturerUpdateInfoDialog";
import CreateOwnedCourseDialog from "../../components/CreateOwnedCourseDialog";
import CreateAttendedCourseDialog from "../../components/CreateAttendedCourseDialog";
import CreateResearchProjectDialog from "../../components/CreateResearchProjectDialog";
import { setLecturerProfile } from "../../redux/slice/LecturerProfileSlice";
import { colors } from "../../theme/colors";
import { API } from "../../utils/Fetch";
import {
  OverviewTab,
  DegreesTab,
  CertificatesTab,
  CoursesTab,
  ResearchTab,
} from "./tab";
import { toast } from "react-toastify";
import type { OwnedCourse } from "../../types/OwnedCourse";
import type {
  AttendedCourse,
  AttendedCourseRequest,
} from "../../types/AttendedCourse";
import {
  formatDate,
  getAcademicRank,
  getStatusColor,
} from "../../utils/ChangeText";

const LecturerProfilePage = () => {
  const dispatch = useDispatch();
  const lecturerProfile = useSelector((state: any) => state.lecturerProfile);
  const userProfile = useSelector((state: any) => state.userProfile);
  const [activeSection, setActiveSection] = useState("overview");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createOwnedCourseDialogOpen, setCreateOwnedCourseDialogOpen] =
    useState(false);
  const [createAttendedCourseDialogOpen, setCreateAttendedCourseDialogOpen] =
    useState(false);
  const [createResearchProjectDialogOpen, setCreateResearchProjectDialogOpen] =
    useState(false);
  const [editOwnedCourseData, setEditOwnedCourseData] = useState<any>(null);
  const [editAttendedCourseData, setEditAttendedCourseData] =
    useState<any>(null);
  const [editResearchProjectData, setEditResearchProjectData] =
    useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

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

  const handleAddAttendedCourse = () => {
    setIsEditMode(false);
    setEditAttendedCourseData(null);
    setEditingItem(null);
    setCreateAttendedCourseDialogOpen(true);
  };

  const handleAddOwnedCourse = () => {
    setIsEditMode(false);
    setEditOwnedCourseData(null);
    setEditingItem(null);
    setCreateOwnedCourseDialogOpen(true);
  };

  const handleSubmitAttendedCourse = async (
    courseData: AttendedCourseRequest,
  ) => {
    try {
      console.log("Submitting attended course:", courseData);

      if (isEditMode && editingItem) {
        if (editingItem.status === "APPROVED") {
          await API.lecturer.editAttendedCourse(courseData as AttendedCourse);
          toast.success("Đã gửi yêu cầu cập nhật!");
        } else if (
          editAttendedCourseData.status === "PENDING" ||
          editAttendedCourseData.status === "REJECTED"
        ) {
          await API.lecturer.updateAttendedCourse(courseData as AttendedCourse);
          toast.success("Cập nhật khóa học thành công!");
        }
      } else {
        // Create mode
        await API.lecturer.createAttendedCourse(courseData);
        toast.success("Đã gửi yêu cầu tạo mới!");
      }

      // Refresh lecturer profile data
      const response = await API.lecturer.getLecturerProfile();
      dispatch(setLecturerProfile(response.data.data));
    } catch (error) {
      console.error("Error submitting attended course:", error);
      const errorMessage = isEditMode
        ? "Có lỗi xảy ra khi cập nhật khóa học"
        : "Có lỗi xảy ra khi tạo khóa học";
      toast.error(errorMessage);
    }
  };

  const handleSubmitOwnedCourse = async (courseData: OwnedCourse) => {
    try {
      console.log("Submitting owned course:", courseData);

      if (isEditMode && editingItem) {
        if (editingItem.status === "APPROVED") {
          console.log("Edit:", courseData);
          console.log("Item:", editingItem);
          await API.lecturer.editOwnedCourse(courseData);
          toast.success("Đã gửi yêu cầu cập nhật!");
        } else if (
          editOwnedCourseData.status === "PENDING" ||
          editOwnedCourseData.status === "REJECTED"
        ) {
          await API.lecturer.updateOwnedCourse(courseData);
          toast.success("Cập nhật khóa học thành công!");
        }
      } else {
        // Create mode
        await API.lecturer.createOwnedCourse(courseData);
        toast.success("Đã gửi yêu cầu tạo mới!");
      }

      // Refresh lecturer profile data
      const response = await API.lecturer.getLecturerProfile();
      dispatch(setLecturerProfile(response.data.data));
    } catch (error) {
      console.error("Error submitting owned course:", error);
      const errorMessage = isEditMode
        ? "Có lỗi xảy ra khi cập nhật khóa học"
        : "Có lỗi xảy ra khi tạo khóa học";
      toast.error(errorMessage);
    }
  };

  const handleAddResearchProject = () => {
    setIsEditMode(false);
    setEditResearchProjectData(null);
    setEditingItem(null);
    setCreateResearchProjectDialogOpen(true);
  };
  const handleSubmitResearchProject = async (projectData: any) => {
    try {
      console.log("Submitting research project:", projectData);

      if (isEditMode && editingItem) {
        if (editingItem.status === "APPROVED") {
          await API.lecturer.editResearchProject(projectData);
          toast.success("Đã gửi yêu cầu cập nhật!");
        } else if (
          editResearchProjectData.status === "PENDING" ||
          editResearchProjectData.status === "REJECTED"
        ) {
          await API.lecturer.updateResearchProject(projectData);
          toast.success("Cập nhật dự án nghiên cứu thành công!");
        }
      } else {
        // Create mode
        await API.lecturer.createResearchProject(projectData);
        toast.success("Đã gửi yêu cầu tạo mới!");
      }

      // Refresh lecturer profile data
      const response = await API.lecturer.getLecturerProfile();
      dispatch(setLecturerProfile(response.data.data));
    } catch (error) {
      console.error("Error submitting research project:", error);
      const errorMessage = isEditMode
        ? "Có lỗi xảy ra khi cập nhật dự án nghiên cứu"
        : "Có lỗi xảy ra khi tạo dự án nghiên cứu";
      toast.error(errorMessage);
    }
  };

  const handleCloseCreateAttendedCourseDialog = () => {
    setCreateAttendedCourseDialogOpen(false);
    setIsEditMode(false);
    setEditAttendedCourseData(null);
    setEditingItem(null);
  };

  const handleCloseCreateOwnedCourseDialog = () => {
    setCreateOwnedCourseDialogOpen(false);
    setIsEditMode(false);
    setEditOwnedCourseData(null);
    setEditingItem(null);
  };

  const handleCloseCreateResearchProjectDialog = () => {
    setCreateResearchProjectDialogOpen(false);
    setIsEditMode(false);
    setEditResearchProjectData(null);
    setEditingItem(null);
  };

  const handleEdit = (item: any) => {
    console.log("Edit item:", item);
    if (item) {
      // Check if item has organizer field to identify it as AttendedCourse
      if (item.organizer) {
        // This is an AttendedCourse
        const editData: AttendedCourse = item as AttendedCourse;
        setEditAttendedCourseData(editData);
        setEditingItem(item);
        setIsEditMode(true);
        setCreateAttendedCourseDialogOpen(true);
      } else if (item.price !== undefined || item.thumbnailUrl !== undefined) {
        // This is an OwnedCourse
        const editData: OwnedCourse = item as OwnedCourse;
        setEditOwnedCourseData(editData);
        setEditingItem(item);
        setIsEditMode(true);
        setCreateOwnedCourseDialogOpen(true);
      } else if (
        item.researchArea ||
        item.foundingSource ||
        item.foundingAmount
      ) {
        // This is a ResearchProject
        setEditResearchProjectData(item);
        setEditingItem(item);
        setIsEditMode(true);
        setCreateResearchProjectDialogOpen(true);
      } else {
        // Handle other types of edits (degrees, certificates, etc.)
        // TODO: Implement other edit logic
      }
    }
  };

  const handleEditProfile = () => {
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
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
    // lecturerUpdate,
    degrees,
    certificates,
    ownedTrainingCourses,
    attendedTrainingCourses,
    researchProjects,
  } = lecturerProfile;

  const menuItems = [
    {
      id: "overview",
      label: "Tổng quan",
      icon: <Person />,
      description: "Thông tin chung",
    },
    {
      id: "degrees",
      label: "Bằng cấp",
      icon: <School />,
      count: degrees?.length || 0,
      description: "Bằng cấp và học vị",
    },
    {
      id: "certificates",
      label: "Chứng chỉ",
      icon: <Assignment />,
      count: certificates?.length || 0,
      description: "Chứng chỉ nghề nghiệp",
    },
    {
      id: "courses",
      label: "Kinh nghiệm Đào tạo",
      icon: <WorkHistory />,
      count:
        (attendedTrainingCourses?.length || 0) +
        (ownedTrainingCourses?.length || 0),
      description: "Khóa học và đào tạo",
    },
    {
      id: "research",
      label: "Kinh nghiệm nghiên cứu",
      icon: <Science />,
      count: researchProjects?.length || 0,
      description: "Dự án nghiên cứu",
    },
  ];

  const renderOverview = () => (
    <OverviewTab
      lecturer={lecturer}
      degrees={degrees}
      certificates={certificates}
      getStatusColor={getStatusColor}
    />
  );

  const renderSection = (items: any[], type: string) => {
    switch (type) {
      case "degrees":
        return (
          <DegreesTab
            degrees={items}
          />
        );
      case "certificates":
        return (
          <CertificatesTab
            certificates={items}
            getStatusColor={getStatusColor}
            formatDate={formatDate}
          />
        );
      case "courses":
        return (
          <CoursesTab
            attendedTrainingCourses={attendedTrainingCourses || []}
            ownedTrainingCourses={ownedTrainingCourses || []}
            getStatusColor={getStatusColor}
            formatDate={formatDate}
            onAddAttended={handleAddAttendedCourse}
            onAddOwned={handleAddOwnedCourse}
            onEdit={handleEdit}
          />
        );
      case "research":
        return (
          <ResearchTab
            researchProjects={items}
            getStatusColor={getStatusColor}
            formatDate={formatDate}
            onAdd={handleAddResearchProject}
            onEdit={handleEdit}
          />
        );
      default:
        return (
          <Alert severity="info" className="text-center">
            Chưa có thông tin trong mục này
          </Alert>
        );
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.background.secondary }}
    >
      <Container maxWidth="xl" className="py-8">
        {/* Header Section */}
        <Card
          className="mb-8 overflow-hidden"
          sx={{
            borderRadius: 4,
            boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
            background: `linear-gradient(135deg, ${colors.primary[600]} 0%, ${colors.secondary[700]} 100%)`,
            color: "white",
            position: "relative",
          }}
        >
          {/* Pattern overlay */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3C/g%3E%3C/svg%3E")`,
              zIndex: 0,
            }}
          />

          <CardContent
            sx={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "center", md: "flex-start" },
              gap: 4,
              p: { xs: 4, md: 6 },
            }}
          >
            {/* Avatar */}
            <Box sx={{ position: "relative" }}>
              <Avatar
                src={lecturer.avatarUrl}
                sx={{
                  width: 140,
                  height: 140,
                  border: "4px solid rgba(255,255,255,0.5)",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
                  fontSize: "3rem",
                  fontWeight: 700,
                }}
              >
                {lecturer.fullName?.charAt(0)}
              </Avatar>
              {/* {lecturerUpdate?.status === "PENDING" && (
                <Chip
                  label="Chờ duyệt"
                  color="warning"
                  size="small"
                  sx={{
                    position: "absolute",
                    top: -8,
                    right: -8,
                    fontWeight: 600,
                  }}
                />
              )} */}
            </Box>

            {/* Info */}
            <Box sx={{ flex: 1 }}>
              {/* Name & Buttons */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  justifyContent: "space-between",
                  alignItems: { xs: "center", md: "flex-start" },
                  gap: 2,
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {/* Tên giảng viên */}
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      mb: 0,
                      color: "#fff", // trắng để nổi trên nền xanh
                      textShadow: "0 2px 4px rgba(0,0,0,0.3)", // tạo chiều sâu
                    }}
                  >
                    {lecturer.fullName}
                  </Typography>

                  {/* Học hàm + chuyên ngành */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    <Chip
                      label={getAcademicRank(lecturer.academicRank)}
                      size="medium"
                      sx={{
                        background: "linear-gradient(135deg, #FF9800, #FFC107)", // Gradient cam-vàng nổi bật
                        color: "#fff",
                        fontWeight: 600,
                        border: "none",
                        borderRadius: "16px",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                      }}
                    />
                    <Typography
                      variant="h6"
                      sx={{
                        opacity: 0.9,
                        fontWeight: 500,
                        color: "#f5f5f5", // xám nhạt để mềm hơn
                      }}
                    >
                      {lecturer.specialization}
                    </Typography>
                  </Box>
                </Box>

                <Box gap={2} display="flex">
                  <Button
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={handleEditProfile}
                    sx={{
                      background: colors.background.gradient.secondary,
                      color: "white",
                      fontWeight: 600,
                      borderRadius: 3,
                      textTransform: "none",
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
                      background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.secondary[600]} 100%)`,
                      color: "white",
                      fontWeight: 600,
                      borderRadius: 3,
                      textTransform: "none",
                      "&:hover": {
                        background: `linear-gradient(135deg, ${colors.primary[600]} 0%, ${colors.secondary[700]} 100%)`,
                        transform: "translateY(-1px)",
                      },
                    }}
                  >
                    CV của tôi
                  </Button>
                </Box>
              </Box>

              {/* Contact info */}
              <Box
                sx={{
                  mt: 3,
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 2,
                }}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <WorkHistory fontSize="small" />{" "}
                  <span>
                    {lecturer.experienceYears} năm • {lecturer.jobField}
                  </span>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Cake fontSize="small" /> {formatDate(lecturer.dateOfBirth)}
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Email fontSize="small" />{" "}
                  {lecturer.email || userProfile?.email || "Chưa cập nhật"}
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <LocationOn fontSize="small" /> {lecturer.address}
                </Box>

                <Box display="flex" alignItems="center" gap={1}>
                  <Phone fontSize="small" /> {lecturer.phoneNumber}
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Enhanced Sidebar Navigation - Made wider */}
          <div className="lg:w-96">
            <Card
              className="sticky top-8"
              sx={{
                borderRadius: 4,
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                border: `1px solid ${colors.primary[100]}`,
                overflow: "hidden",
              }}
            >
              <CardContent className="p-0">
                {/* Menu Items - Enhanced spacing */}
                <div className="p-5">
                  {menuItems.map((item) => (
                    <div key={item.id} className="mb-4">
                      <button
                        onClick={() => setActiveSection(item.id)}
                        className="group relative w-full overflow-hidden rounded-xl p-5 transition-all duration-300"
                        style={{
                          background:
                            activeSection === item.id
                              ? `linear-gradient(135deg, ${colors.primary[50]} 0%, ${colors.secondary[50]} 100%)`
                              : "transparent",
                          border:
                            activeSection === item.id
                              ? `2px solid ${colors.primary[300]}`
                              : "2px solid transparent",
                          transform:
                            activeSection === item.id
                              ? "scale(1.02)"
                              : "scale(1)",
                        }}
                      >
                        {/* Hover effect background */}
                        <div
                          className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                          style={{
                            background: `linear-gradient(135deg, ${colors.primary[25]} 0%, ${colors.secondary[50]} 100%)`,
                          }}
                        />

                        <div className="relative z-10 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Box
                              className="rounded-lg p-3 transition-all duration-300"
                              sx={{
                                background:
                                  activeSection === item.id
                                    ? `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.secondary[500]} 100%)`
                                    : `${colors.primary[100]}`,
                                color:
                                  activeSection === item.id
                                    ? "white"
                                    : colors.primary[600],
                              }}
                            >
                              {item.icon}
                            </Box>
                            <div className="text-left">
                              <Typography
                                variant="subtitle1"
                                sx={{
                                  fontFamily: "'Inter', sans-serif",
                                  fontWeight: 600,
                                  color:
                                    activeSection === item.id
                                      ? colors.primary[700]
                                      : colors.text.primary,
                                  fontSize: "1rem",
                                }}
                              >
                                {item.label}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color:
                                    activeSection === item.id
                                      ? colors.primary[600]
                                      : colors.text.tertiary,
                                  fontSize: "0.8rem",
                                  lineHeight: 1.4,
                                }}
                              >
                                {item.description}
                              </Typography>
                            </div>
                          </div>

                          {item.count !== undefined && (
                            <Chip
                              label={item.count}
                              size="small"
                              sx={{
                                background:
                                  activeSection === item.id
                                    ? "linear-gradient(135deg, #FF9800, #F57C00)"
                                    : colors.background.tertiary,
                                color:
                                  activeSection === item.id
                                    ? "#fff"
                                    : colors.text.secondary,
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 700,
                                minWidth: "32px",
                                height: "28px",
                                fontSize: "0.75rem",
                              }}
                            />
                          )}
                        </div>
                      </button>
                    </div>
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
            {activeSection === "courses" && renderSection([], "courses")}
            {activeSection === "research" &&
              renderSection(researchProjects, "research")}
          </div>
        </div>

        {/* Edit Profile Dialog */}
        <LecturerUpdateInfoDialog
          open={editDialogOpen}
          onClose={handleCloseEditDialog}
          lecturer={lecturer}
        />

        {/* Create Owned Course Dialog */}
        <CreateOwnedCourseDialog
          open={createOwnedCourseDialogOpen}
          onClose={handleCloseCreateOwnedCourseDialog}
          onSubmit={handleSubmitOwnedCourse}
          editMode={isEditMode}
          editData={editOwnedCourseData}
        />

        {/* Create Attended Course Dialog */}
        <CreateAttendedCourseDialog
          open={createAttendedCourseDialogOpen}
          onClose={handleCloseCreateAttendedCourseDialog}
          onSubmit={handleSubmitAttendedCourse}
          editMode={isEditMode}
          editData={editAttendedCourseData}
        />

        {/* Create Research Project Dialog */}
        <CreateResearchProjectDialog
          open={createResearchProjectDialogOpen}
          onClose={handleCloseCreateResearchProjectDialog}
          onSubmit={handleSubmitResearchProject}
          editMode={isEditMode}
          editData={editResearchProjectData}
        />
      </Container>
    </div>
  );
};

export default LecturerProfilePage;
