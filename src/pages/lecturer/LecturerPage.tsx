import {
  ArrowDownward,
  ArrowUpward,
  Assignment,
  CalendarToday,
  LocationOn,
  MenuBook,
  MoreVert,
  PersonOutline,
  PlayArrow,
  Schedule,
  School,
  Timeline,
  VideocamOutlined,
} from "@mui/icons-material";
import {
  Alert,
  alpha,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography
} from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { colors } from "../../theme/colors";

const LecturerPage = () => {
  const lecturerProfile = useSelector((state: any) => state.lecturerProfile);
  // const userProfile = useSelector((state: any) => state.userProfile);

  // Mock data - in real app, this would come from API
  const dashboardStats = [
    {
      title: "Khóa học đang dạy",
      value: "8",
      change: "+2",
      changeType: "increase",
      icon: <School />,
      color: colors.primary[500],
      background: colors.primary[50],
    },
    {
      title: "Đề tài nghiên cứu",
      value: "5",
      change: "+1",
      changeType: "increase",
      icon: <Assignment />,
      color: colors.accent.lightBlue,
      background: colors.secondary[50],
    },
    {
      title: "Bài viết chia sẻ",
      value: "23",
      change: "+3",
      changeType: "increase",
      icon: <MenuBook />,
      color: colors.warning[500],
      background: colors.warning[50],
    },
  ];

  const recentCourses = [
    {
      id: 1,
      title: "Lập trình React Advanced",
      subject: "Công nghệ thông tin",
      progress: 75,
      status: "active",
      nextClass: "2025-08-16 09:00",
      type: "online",
      weeklyHours: 6,
    },
    {
      id: 2,
      title: "JavaScript Fundamentals",
      subject: "Lập trình cơ bản",
      progress: 60,
      status: "active",
      nextClass: "2025-08-16 14:00",
      type: "offline",
      weeklyHours: 4,
    },
    {
      id: 3,
      title: "Node.js Backend Development",
      subject: "Phát triển phần mềm",
      progress: 45,
      status: "active",
      nextClass: "2025-08-17 10:00",
      type: "online",
      weeklyHours: 8,
    },
  ];

  const upcomingSchedule = [
    {
      id: 1,
      title: "React Advanced - Bài 8: Hooks nâng cao",
      time: "09:00 - 11:00",
      date: "16/08/2025",
      type: "online",
      room: "Zoom Meeting",
      duration: "2 giờ",
    },
    {
      id: 2,
      title: "JavaScript Fundamentals - Bài 5: DOM Manipulation",
      time: "14:00 - 16:00",
      date: "16/08/2025",
      type: "offline",
      room: "Phòng A101",
      duration: "2 giờ",
    },
    {
      id: 3,
      title: "Node.js Backend - Bài 3: Express Framework",
      time: "10:00 - 12:00",
      date: "17/08/2025",
      type: "online",
      room: "Google Meet",
      duration: "2 giờ",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      action: "Chia sẻ bài viết mới",
      course: "Kinh nghiệm giảng dạy React",
      time: "2 giờ trước",
      icon: <MenuBook />,
    },
    {
      id: 2,
      action: "Cập nhật đề tài nghiên cứu",
      course: "Ứng dụng AI trong giáo dục",
      time: "4 giờ trước",
      icon: <Assignment />,
    },
    {
      id: 3,
      action: "Tạo bài giảng mới",
      course: "Node.js Backend Development",
      time: "6 giờ trước",
      icon: <PlayArrow />,
    },
  ];

  return (
    <Box sx={{ p: 0 }}>
      {/* Compact Lecturer Profile Banner */}
      {/* <Paper
        elevation={3}
        sx={{
          background: `linear-gradient(135deg, ${colors.primary[700]} 0%, ${colors.primary[900]} 100%)`,
          borderRadius: 4,
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
                      borderRadius: 2,
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
            <Card sx={{ borderRadius: 3 }}>
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
                    Khóa học đang giảng dạy
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ textTransform: "none" }}
                  >
                    Xem tất cả
                  </Button>
                </Box>

                <Stack spacing={2}>
                  {recentCourses.map((course) => (
                    <Card
                      key={course.id}
                      sx={{
                        border: `1px solid ${colors.border.light}`,
                        "&:hover": {
                          bgcolor: colors.background.tertiary,
                        },
                        transition: "all 0.2s ease-in-out",
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
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: 600, mb: 1 }}
                            >
                              {course.title}
                            </Typography>
                            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                              <Chip
                                icon={<PersonOutline sx={{ fontSize: 16 }} />}
                                label={course.subject}
                                size="small"
                                variant="outlined"
                              />
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
                              <Chip
                                icon={<Schedule sx={{ fontSize: 16 }} />}
                                label={`${course.weeklyHours}h/tuần`}
                                size="small"
                                color="default"
                              />
                            </Stack>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 1,
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{ mr: 2, minWidth: "80px" }}
                              >
                                Tiến độ: {course.progress}%
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={course.progress}
                                sx={{
                                  flex: 1,
                                  height: 6,
                                  borderRadius: 3,
                                  bgcolor: colors.neutral[200],
                                  "& .MuiLinearProgress-bar": {
                                    borderRadius: 3,
                                    bgcolor: colors.primary[500],
                                  },
                                }}
                              />
                            </Box>
                            <Typography
                              variant="body2"
                              sx={{ color: colors.text.secondary }}
                            >
                              Lớp tiếp theo:{" "}
                              {new Date(course.nextClass).toLocaleDateString(
                                "vi-VN",
                              )}{" "}
                              lúc{" "}
                              {new Date(course.nextClass).toLocaleTimeString(
                                "vi-VN",
                                { hour: "2-digit", minute: "2-digit" },
                              )}
                            </Typography>
                          </Box>
                          <IconButton size="small">
                            <MoreVert />
                          </IconButton>
                        </Box>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<PlayArrow />}
                            sx={{ textTransform: "none" }}
                          >
                            Bắt đầu lớp học
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Assignment />}
                            sx={{ textTransform: "none" }}
                          >
                            Quản lý
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </CardContent>
            </Card>

            {/* Experience Sharing Section */}
            <Card sx={{ borderRadius: 3 }}>
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
            </Card>

            {/* Research Topics Section - Suggested by System */}
            <Card sx={{ borderRadius: 3 }}>
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
            </Card>
          </Stack>
        </Box>

        {/* Right Sidebar */}
        <Box sx={{ flex: { lg: "1 1 34%" } }}>
          <Stack spacing={3}>
            {/* Upcoming Schedule */}
            <Card sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <CalendarToday sx={{ mr: 1, color: colors.primary[500] }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Lịch giảng dạy
                  </Typography>
                </Box>

                <Stack spacing={2}>
                  {upcomingSchedule.map((schedule) => (
                    <Box
                      key={schedule.id}
                      sx={{
                        p: 2,
                        border: `1px solid ${colors.border.light}`,
                        borderRadius: 2,
                        bgcolor: colors.background.secondary,
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 600, mb: 1 }}
                      >
                        {schedule.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: colors.text.secondary, mb: 1 }}
                      >
                        {schedule.date} • {schedule.time}
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        <Chip
                          size="small"
                          label={
                            schedule.type === "online"
                              ? "Trực tuyến"
                              : schedule.room
                          }
                          color={
                            schedule.type === "online" ? "primary" : "secondary"
                          }
                        />
                        <Chip
                          size="small"
                          label={schedule.duration}
                          variant="outlined"
                        />
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Timeline sx={{ mr: 1, color: colors.primary[500] }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Hoạt động gần đây
                  </Typography>
                </Box>

                <List sx={{ p: 0 }}>
                  {recentActivities.map((activity, index) => (
                    <React.Fragment key={activity.id}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              bgcolor: colors.primary[50],
                              color: colors.primary[500],
                              width: 40,
                              height: 40,
                            }}
                          >
                            {activity.icon}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={activity.action}
                          secondary={`${activity.course} • ${activity.time}`}
                          sx={{
                            "& .MuiListItemText-primary": {
                              fontWeight: 600,
                              fontSize: "0.9rem",
                            },
                            "& .MuiListItemText-secondary": {
                              fontSize: "0.8rem",
                            },
                          }}
                        />
                      </ListItem>
                      {index < recentActivities.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default LecturerPage;
