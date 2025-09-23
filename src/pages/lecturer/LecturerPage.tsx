import {
  ArrowDownward,
  ArrowUpward,
  Assignment,
  Group,
  Link as LinkIcon,
  LocationOn,
  MenuBook,
  MoreVert,
  School,
  VideocamOutlined,
} from "@mui/icons-material";
import {
  Alert,
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCoursesOfLecturer } from "../../redux/slice/CoursesOfLecturer";
import { getColors } from "../../theme/colors";
import { API } from "../../utils/Fetch";
import { getCourseType } from "../../utils/ChangeText";

const LecturerPage = () => {
  const theme = useTheme();
  const colors = getColors(theme.palette.mode as any);
  const lecturerProfile = useSelector((state: any) => state.lecturerProfile);
  const coursesOfLecturer = useSelector(
    (state: any) => state.coursesOfLecturer,
  );
  // const userProfile = useSelector((state: any) => state.userProfile);

  const dispatch = useDispatch();

  // Calculate real stats from coursesOfLecturer data
  const calculateStats = () => {
    const courses = coursesOfLecturer?.courses || [];

    // Count active courses (those that are currently ongoing)
    const activeCourses = courses.filter((courseItem: any) => {
      const course = courseItem.course;
      const startDate = new Date(course.startDate);
      const endDate = new Date(course.endDate);
      const now = new Date();
      return startDate <= now && now <= endDate;
    }).length;

    // This would be calculated from research projects API in real implementation
    const researchProjects = lecturerProfile?.researchProjects?.length || 0;

    // This would be calculated from blog posts/articles API in real implementation
    const sharedArticles = 0; // Placeholder for now

    return {
      activeCourses,
      researchProjects,
      sharedArticles,
    };
  };

  const stats = calculateStats();

  // Dynamic dashboard stats based on real data
  const dashboardStats = [
    {
      title: "Khóa học đang dạy",
      value: stats.activeCourses.toString(),
      change: "+0", // Would need historical data to calculate change
      changeType: "increase",
      icon: <School />,
      color: colors.primary[500],
      background: colors.primary[50],
    },
    {
      title: "Đề tài nghiên cứu",
      value: stats.researchProjects.toString(),
      change: "+0", // Would need historical data to calculate change
      changeType: "increase",
      icon: <Assignment />,
      color: colors.secondary[500],
      background: colors.secondary[50],
    },
    {
      title: "Bài viết chia sẻ",
      value: stats.sharedArticles.toString(),
      change: "+0", // Would need historical data to calculate change
      changeType: "increase",
      icon: <MenuBook />,
      color: colors.warning[500],
      background: colors.warning[50],
    },
  ];

  // Convert real course data to display format
  const convertCoursesToDisplayFormat = () => {
    const courses = coursesOfLecturer?.courses || [];

    return courses.map((courseItem: any) => {
      const course = courseItem.course;

      // Calculate progress based on dates
      const startDate = new Date(course.startDate);
      const endDate = new Date(course.endDate);
      const now = new Date();

      let progress = 0;
      if (now >= endDate) {
        progress = 100;
      } else if (now >= startDate) {
        const totalDuration = endDate.getTime() - startDate.getTime();
        const elapsed = now.getTime() - startDate.getTime();
        progress = Math.round((elapsed / totalDuration) * 100);
      }

      // Determine status
      let status = "active";
      if (now < startDate) status = "upcoming";
      if (now > endDate) status = "completed";

      return {
        id: course.id,
        title: course.title,
        subject: course.topic,
        progress: Math.max(0, Math.min(100, progress)),
        status,
        nextClass: course.startDate, // Using start date as next class for upcoming courses
        endDate: course.endDate,
        type: course.isOnline ? "online" : "offline",
        weeklyHours: 6, // Default weekly hours - would need to be calculated from course schedule
        level: course.level,
        address: course.address,
        description: course.description,
        price: course.price,
        members: courseItem.members,
        thumbnailUrl: course.thumbnailUrl,
        contentUrl: course.contentUrl,
        language: course.language,
        requirements: course.requirements,
        isPublished: course.isPublished,
        courseType: course.courseType,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
      };
    });
  };

  const recentCourses = convertCoursesToDisplayFormat();

  // Generate upcoming schedule from real course data

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await API.lecturer.getAllCourses();
        console.log("✅ Courses fetched successfully:", response.data.data);
        dispatch(setCoursesOfLecturer(response.data.data));
      } catch (error) {
        console.error("❌ Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, [lecturerProfile, dispatch]);

  return (
    <Box sx={{ p: 0 }}>
      {/* Debug Info - Remove in production */}
      {/* {process.env.NODE_ENV === "development" && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="caption">
            Debug: Đã load {coursesOfLecturer?.courses?.length || 0} khóa học từ
            API
          </Typography>
        </Alert>
      )} */}

      {/* Compact Lecturer Profile Banner */}
      {/* <Paper
        elevation={3}
        sx={{
          background: `linear-gradient(135deg, ${colors.primary[700]} 0%, ${colors.primary[900]} 100%)`,
          borderRadius: 1,
          overflow: "hidden",
          position: "relative",
          mb: 4,
          color: "white",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <Box
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: 4,
            p: { xs: 3, md: 5 },
          }}
        >
          <Avatar
            src={lecturerProfile?.lecturer?.avatarUrl}
            sx={{
              width: { xs: 120, md: 150 },
              height: { xs: 120, md: 150 },
              border: `4px solid ${alpha("#fff", 0.4)}`,
              boxShadow: `0 8px 24px ${alpha("#000", 0.4)}`,
              fontSize: "3rem",
              fontWeight: 700,
            }}
          >
            {lecturerProfile?.fullName?.charAt(0) || "L"}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 1,
                textShadow: `0 2px 6px ${alpha("#000", 0.4)}`,
              }}
            >
              {lecturerProfile?.lecturer?.fullName || "Họ và tên"}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Chip
                size="small"
                label={
                  getAcademicRank(lecturerProfile?.lecturer?.academicRank) ||
                  "CN"
                }
                sx={{
                  bgcolor: alpha("#fff", 0.2),
                  color: "white",
                  fontWeight: 600,
                }}
              />
              <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 500 }}>
                {lecturerProfile?.lecturer?.specialization ||
                  "Khoa học máy tính"}
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ opacity: 0.85, mb: 1 }}>
              <strong>{lecturerProfile?.lecturer?.experienceYears || 0}</strong>{" "}
              năm kinh nghiệm •{" "}
              {lecturerProfile?.jobField || "Công nghệ thông tin"}
            </Typography>

          
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                mt: 2,
                fontSize: "0.95rem",
                opacity: 0.85,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                📧 {userProfile?.email || "email@example.com"}
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper> */}

      {/* Dashboard Stats */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: { xs: 2, md: 3 },
          mb: 4,
        }}
      >
        {dashboardStats.map((stat, index) => (
          <Box
            key={index}
            sx={{
              flex: { xs: "1 1 calc(50% - 8px)", sm: "1 1 calc(25% - 12px)" },
              minWidth: { xs: "140px", sm: "200px" },
            }}
          >
            <Card
              sx={{
                height: "100%",
                background: `linear-gradient(135deg, ${stat.background} 0%, ${alpha(stat.color, 0.1)} 100%)`,
                border: `1px solid ${alpha(stat.color, 0.2)}`,
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: `0 8px 24px ${alpha(stat.color, 0.2)}`,
                },
                transition: "all 0.3s ease-in-out",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 1,
                      bgcolor: alpha(stat.color, 0.1),
                      color: stat.color,
                      mr: 2,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700, color: stat.color }}
                    >
                      {stat.value}
                    </Typography>
                    <Box
                      sx={{ display: "flex", alignItems: "center", mt: 0.5 }}
                    >
                      {stat.changeType === "increase" ? (
                        <ArrowUpward
                          sx={{
                            fontSize: 16,
                            color: colors.success[500],
                            mr: 0.5,
                          }}
                        />
                      ) : (
                        <ArrowDownward
                          sx={{
                            fontSize: 16,
                            color: colors.error[500],
                            mr: 0.5,
                          }}
                        />
                      )}
                      <Typography
                        variant="caption"
                        sx={{
                          color:
                            stat.changeType === "increase"
                              ? colors.success[500]
                              : colors.error[500],
                          fontWeight: 600,
                        }}
                      >
                        {stat.change}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Typography
                  variant="body2"
                  sx={{ color: colors.text.secondary, fontWeight: 500 }}
                >
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      {/* Main Content Layout */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          gap: { xs: 3, lg: 4 },
        }}
      >
        {/* Main Content - Left Side */}
        <Box sx={{ flex: { lg: "1 1 66%" } }}>
          <Stack spacing={3}>
            {/* Teaching Courses */}
            <Card sx={{ borderRadius: 1 }}>
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Danh sách khóa học
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ textTransform: "none" }}
                  >
                    Xem tất cả
                  </Button>
                </Box>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
                    gap: 3,
                    "@media (min-width: 1200px)": {
                      gridTemplateColumns: "repeat(2, 1fr)",
                    },
                  }}
                >
                  {recentCourses.length > 0 ? (
                    recentCourses.map((course: any) => (
                      <Card
                        key={course.id}
                        sx={{
                          border: `1px solid ${colors.border.light}`,
                          borderRadius: 1,
                          overflow: "hidden",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          "&:hover": {
                            bgcolor: colors.background.tertiary,
                            transform: "translateY(-2px)",
                            boxShadow: `0 8px 24px ${alpha(colors.primary[500], 0.15)}`,
                          },
                          transition: "all 0.3s ease-in-out",
                        }}
                      >
                        {/* Course Header with Thumbnail */}
                        {course.thumbnailUrl && (
                          <Box
                            sx={{
                              height: 160,
                              backgroundImage: `url(${course.thumbnailUrl})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              position: "relative",
                            }}
                          >
                            <Box
                              sx={{
                                position: "absolute",
                                top: 12,
                                right: 12,
                                display: "flex",
                                gap: 1,
                              }}
                            >
                              <Chip
                                label={
                                  course.status === "active"
                                    ? "Đang diễn ra"
                                    : course.status === "upcoming"
                                      ? "Sắp bắt đầu"
                                      : "Đã kết thúc"
                                }
                                size="small"
                                color={
                                  course.status === "active"
                                    ? "success"
                                    : course.status === "upcoming"
                                      ? "warning"
                                      : "default"
                                }
                                sx={{ fontWeight: 600 }}
                              />
                              {course.isPublished !== undefined && (
                                <Chip
                                  label={
                                    course.isPublished
                                      ? "Đã xuất bản"
                                      : "Chưa xuất bản"
                                  }
                                  size="small"
                                  color={
                                    course.isPublished ? "primary" : "secondary"
                                  }
                                  sx={{ fontWeight: 600 }}
                                />
                              )}
                            </Box>
                          </Box>
                        )}

                        <CardContent
                          sx={{
                            p: 3,
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              mb: 2,
                            }}
                          >
                            <Box sx={{ flex: 1 }}>
                              {/* Course Title */}
                              <Typography
                                variant="h6"
                                sx={{
                                  fontWeight: 600,
                                  mb: 1,
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                }}
                              >
                                {course.title}
                              </Typography>

                              {/* Course Topic */}
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  color: colors.primary[600],
                                  fontWeight: 600,
                                  mb: 1,
                                }}
                              >
                                📚 {course.subject}
                              </Typography>

                              {/* Course Description */}
                              {course.description && (
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: colors.text.secondary,
                                    mb: 2,
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                  }}
                                >
                                  {course.description}
                                </Typography>
                              )}

                              {/* Course Info Chips */}
                              <Stack
                                direction="row"
                                spacing={1}
                                sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}
                              >
                                {course.courseType && (
                                  <Chip
                                    label={getCourseType(course.courseType)}
                                    size="small"
                                    color="primary"
                                  />
                                )}
                                <Chip
                                  icon={
                                    course.type === "online" ? (
                                      <VideocamOutlined sx={{ fontSize: 16 }} />
                                    ) : (
                                      <LocationOn sx={{ fontSize: 16 }} />
                                    )
                                  }
                                  label={
                                    course.type === "online"
                                      ? "Trực tuyến"
                                      : "Trực tiếp"
                                  }
                                  size="small"
                                  color={
                                    course.type === "online"
                                      ? "primary"
                                      : "secondary"
                                  }
                                />
                                {course.level && (
                                  <Chip
                                    label={course.level}
                                    size="small"
                                    color="info"
                                  />
                                )}
                                {course.language && (
                                  <Chip
                                    label={course.language}
                                    size="small"
                                    variant="outlined"
                                  />
                                )}
                              </Stack>

                              {/* Course Schedule & Address */}
                              <Box sx={{ mb: 2 }}>
                                <Typography
                                  variant="body2"
                                  sx={{ color: colors.text.secondary, mb: 1 }}
                                >
                                  📅 <strong>Thời gian:</strong>{" "}
                                  {new Date(
                                    course.nextClass,
                                  ).toLocaleDateString("vi-VN")}{" "}
                                  -{" "}
                                  {new Date(
                                    course.endDate || course.nextClass,
                                  ).toLocaleDateString("vi-VN")}
                                </Typography>
                                
                                {/* Address for offline courses */}
                                {course.address && (
                                  <Typography
                                    variant="body2"
                                    sx={{ 
                                      color: colors.text.secondary, 
                                      mb: 1,
                                      backgroundColor: alpha(colors.primary[500], 0.1),
                                      padding: "4px 8px",
                                      borderRadius: 1,
                                      display: "inline-block"
                                    }}
                                  >
                                    📍 <strong>Địa điểm:</strong>{" "}
                                    {course.address}
                                  </Typography>
                                )}
                                {course.requirements && (
                                  <Typography
                                    variant="body2"
                                    sx={{ color: colors.text.secondary, mb: 1 }}
                                  >
                                    📋 <strong>Yêu cầu:</strong>{" "}
                                    {course.requirements}
                                  </Typography>
                                )}
                              </Box>

                              {/* Members Info */}
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "flex-end",
                                  alignItems: "center",
                                  mb: 2,
                                }}
                              >
                                {course.members &&
                                  course.members.length > 0 && (
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                      }}
                                    >
                                      <Group
                                        sx={{
                                          fontSize: 16,
                                          color: colors.text.secondary,
                                        }}
                                      />
                                      <Typography
                                        variant="body2"
                                        sx={{ color: colors.text.secondary }}
                                      >
                                        {course.members.length} giảng viên
                                      </Typography>
                                    </Box>
                                  )}
                              </Box>
                            </Box>
                            <IconButton size="small">
                              <MoreVert />
                            </IconButton>
                          </Box>

                          {/* Action Buttons */}
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              flexWrap: "wrap",
                              mt: "auto",
                            }}
                          >
                            {course.contentUrl && (
                              <Button
                                variant="text"
                                size="small"
                                startIcon={<LinkIcon />}
                                sx={{ textTransform: "none" }}
                                onClick={() =>
                                  window.open(course.contentUrl, "_blank")
                                }
                              >
                                Nội dung
                              </Button>
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      Chưa có khóa học nào. Hãy tạo khóa học đầu tiên của bạn!
                    </Alert>
                  )}
                </Box>
              </CardContent>
            </Card>

            {/* Experience Sharing Section */}
            {/* <Card sx={{ borderRadius: 1 }}>
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Chia sẻ kinh nghiệm
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<MenuBook />}
                    sx={{ textTransform: "none" }}
                  >
                    Viết bài mới
                  </Button>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: { xs: 2, md: 3 },
                  }}
                >
                  <Box sx={{ flex: { md: 1 } }}>
                    <Card
                      sx={{
                        background: `linear-gradient(135deg, ${colors.primary[50]} 0%, ${colors.primary[100]} 100%)`,
                        border: `1px solid ${colors.primary[200]}`,
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            mb: 2,
                            color: colors.primary[700],
                          }}
                        >
                          Kinh nghiệm giảng dạy React
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: colors.text.secondary, mb: 2 }}
                        >
                          Chia sẻ những phương pháp hiệu quả khi dạy React cho
                          người mới bắt đầu...
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                          <Chip label="React" size="small" />
                          <Chip label="Giảng dạy" size="small" />
                          <Chip label="Tips" size="small" />
                        </Stack>
                        <Typography
                          variant="caption"
                          sx={{ color: colors.text.tertiary }}
                        >
                          Đăng 3 ngày trước • 142 lượt xem
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>

                  <Box sx={{ flex: { md: 1 } }}>
                    <Card
                      sx={{
                        background: `linear-gradient(135deg, ${colors.secondary[50]} 0%, ${colors.secondary[100]} 100%)`,
                        border: `1px solid ${colors.secondary[200]}`,
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            mb: 2,
                            color: colors.secondary[700],
                          }}
                        >
                          Phương pháp dạy trực tuyến hiệu quả
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: colors.text.secondary, mb: 2 }}
                        >
                          Những bí quyết để tăng tương tác và hiệu quả trong các
                          lớp học online...
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                          <Chip label="Online" size="small" />
                          <Chip label="Tương tác" size="small" />
                          <Chip label="Hiệu quả" size="small" />
                        </Stack>
                        <Typography
                          variant="caption"
                          sx={{ color: colors.text.tertiary }}
                        >
                          Đăng 1 tuần trước • 86 lượt xem
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                </Box>
              </CardContent>
            </Card> */}

            {/* Research Topics Section - Suggested by System */}
            {/* <Card sx={{ borderRadius: 1 }}>
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Đề tài nghiên cứu được gợi ý
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Assignment />}
                    sx={{ textTransform: "none" }}
                  >
                    Xem thêm gợi ý
                  </Button>
                </Box>

                <Alert severity="info" sx={{ mb: 3 }}>
                  <Typography variant="body2">
                    <strong>Gợi ý thông minh:</strong> Dựa trên{" "}
                    {lecturerProfile?.experienceYears || 22} năm kinh nghiệm
                    trong lĩnh vực{" "}
                    {lecturerProfile?.specialization || "Khoa học máy tính"}, hệ
                    thống đề xuất các đề tài phù hợp từ Trường/Trung tâm và đối
                    tác.
                  </Typography>
                </Alert>

                <Stack spacing={3}>
                  {[
                    {
                      title:
                        "Ứng dụng Machine Learning trong hệ thống quản lý học tập",
                      institution: "Trường Đại học ABC",
                      partner: "Công ty công nghệ XYZ",
                      status: "Mở đăng ký",
                      funding: "200 triệu VNĐ",
                      duration: "24 tháng",
                      requirements: [
                        "PhD Khoa học máy tính",
                        "5+ năm kinh nghiệm AI/ML",
                        "Có công bố quốc tế",
                      ],
                      deadline: "2025-09-30",
                      matchScore: 95,
                      color: colors.success[500],
                    },
                    {
                      title:
                        "Phát triển nền tảng giáo dục trực tuyến với AR/VR",
                      institution: "Viện Nghiên cứu Giáo dục",
                      partner: "Tập đoàn Giáo dục DEF",
                      status: "Sắp mở",
                      funding: "150 triệu VNĐ",
                      duration: "18 tháng",
                      requirements: [
                        "Thạc sĩ CNTT",
                        "3+ năm kinh nghiệm",
                        "Kinh nghiệm giảng dạy",
                      ],
                      deadline: "2025-10-15",
                      matchScore: 88,
                      color: colors.primary[500],
                    },
                    {
                      title:
                        "Nghiên cứu phương pháp đánh giá năng lực lập trình tự động",
                      institution: "Trường Đại học GHI",
                      partner: "Startup EdTech",
                      status: "Đang xét duyệt",
                      funding: "80 triệu VNĐ",
                      duration: "12 tháng",
                      requirements: [
                        "Cử nhân CNTT",
                        "Kinh nghiệm giảng dạy lập trình",
                        "Hiểu biết về testing",
                      ],
                      deadline: "2025-11-01",
                      matchScore: 82,
                      color: colors.warning[500],
                    },
                  ].map((topic, index) => (
                    <Card
                      key={index}
                      sx={{
                        border: `2px solid ${alpha(topic.color, 0.3)}`,
                        background: `linear-gradient(135deg, ${alpha(topic.color, 0.05)} 0%, ${alpha(topic.color, 0.1)} 100%)`,
                        "&:hover": {
                          boxShadow: `0 8px 24px ${alpha(topic.color, 0.2)}`,
                          transform: "translateY(-2px)",
                        },
                        transition: "all 0.3s ease-in-out",
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            mb: 2,
                          }}
                        >
                          <Box sx={{ flex: 1 }}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                mb: 2,
                              }}
                            >
                              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {topic.title}
                              </Typography>
                              <Chip
                                label={`${topic.matchScore}% phù hợp`}
                                size="small"
                                sx={{
                                  bgcolor: topic.color,
                                  color: "white",
                                  fontWeight: 600,
                                }}
                              />
                            </Box>

                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: { xs: "column", sm: "row" },
                                gap: 2,
                                mb: 2,
                              }}
                            >
                              <Chip
                                label={topic.status}
                                size="small"
                                sx={{
                                  bgcolor: alpha(topic.color, 0.1),
                                  color: topic.color,
                                  fontWeight: 600,
                                }}
                              />
                              <Chip
                                label={`Kinh phí: ${topic.funding}`}
                                size="small"
                                variant="outlined"
                              />
                              <Chip
                                label={`Thời gian: ${topic.duration}`}
                                size="small"
                                variant="outlined"
                              />
                            </Box>

                            <Box sx={{ mb: 2 }}>
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 600, mb: 1 }}
                              >
                                Đơn vị chủ trì: {topic.institution}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ color: colors.text.secondary, mb: 1 }}
                              >
                                Đối tác: {topic.partner}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ color: colors.text.secondary }}
                              >
                                Hạn nộp hồ sơ:{" "}
                                {new Date(topic.deadline).toLocaleDateString(
                                  "vi-VN",
                                )}
                              </Typography>
                            </Box>

                            <Box>
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 600, mb: 1 }}
                              >
                                Yêu cầu:
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 1,
                                }}
                              >
                                {topic.requirements.map((req, reqIndex) => (
                                  <Chip
                                    key={reqIndex}
                                    label={req}
                                    size="small"
                                    sx={{
                                      bgcolor: colors.neutral[100],
                                      fontSize: "0.75rem",
                                    }}
                                  />
                                ))}
                              </Box>
                            </Box>
                          </Box>
                          <IconButton size="small">
                            <MoreVert />
                          </IconButton>
                        </Box>

                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                          <Button
                            variant="contained"
                            size="small"
                            sx={{
                              textTransform: "none",
                              bgcolor: topic.color,
                              "&:hover": {
                                bgcolor: topic.color,
                                opacity: 0.9,
                              },
                            }}
                          >
                            Đăng ký tham gia
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            sx={{ textTransform: "none" }}
                          >
                            Xem chi tiết
                          </Button>
                          <Button
                            variant="text"
                            size="small"
                            sx={{ textTransform: "none" }}
                          >
                            Lưu để sau
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </CardContent>
            </Card> */}
          </Stack>
        </Box>

        {/* Right Sidebar */}
        <Box sx={{ flex: { lg: "1 1 34%" } }}>
          <Stack spacing={3}>

          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default LecturerPage;
