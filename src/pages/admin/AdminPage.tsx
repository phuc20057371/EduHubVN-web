import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  LinearProgress,
  Alert,
} from "@mui/material";
import {
  Dashboard,
  TrendingUp,
  People,
  School,
  Business,
  MenuBook,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  Info,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { API } from "../../utils/Fetch";
import { setLecturers } from "../../redux/slice/LecturerSlice";
import { setInstitutions } from "../../redux/slice/InstitutionSlice";
import { setPartner } from "../../redux/slice/PartnerSlice";
import WebSocketService from "../../services/WebSocketService";

interface StatCard {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  change: string;
  trend: "up" | "down" | "stable";
}

interface RecentActivity {
  id: number;
  type: "lecturer" | "institution" | "partner" | "course";
  title: string;
  description: string;
  timestamp: string;
  status: "pending" | "approved" | "rejected";
}

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  route: string;
}

const AdminPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const lecturers = useSelector((state: any) => state.lecturer || []);
  const institutions = useSelector((state: any) => state.institution || []);
  const partners = useSelector((state: any) => state.partner || []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.admin.getAllLecturers();
        dispatch(setLecturers(res.data.data));
        const res2 = await API.admin.getAllInstitutions();
        dispatch(setInstitutions(res2.data.data));
        const res3 = await API.admin.getAllPartners();
        dispatch(setPartner(res3.data.data));
      } catch (error) {
        console.error("Error initializing AdminLecturerPage:", error);
      }
    };
    fetchData();

    setLoading(false);
    return () => WebSocketService.disconnect();
  }, []);

  const statsData: StatCard[] = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const calculateChange = (
      items: any[],
      statusField: string | null = "status",
    ): { percentChange: string; trend: "up" | "down" | "stable" } => {
      if (!Array.isArray(items))
        return { percentChange: "0%", trend: "stable" };

      const current = items.filter((item) => {
        const createdAt = new Date(item.createdAt);
        return (
          (!statusField || item[statusField] === "APPROVED") &&
          createdAt.getMonth() === currentMonth &&
          createdAt.getFullYear() === currentYear
        );
      }).length;

      const last = items.filter((item) => {
        const createdAt = new Date(item.createdAt);
        return (
          (!statusField || item[statusField] === "APPROVED") &&
          createdAt.getMonth() === lastMonth &&
          createdAt.getFullYear() === lastMonthYear
        );
      }).length;

      const diff = current - last;
      const percent = last === 0 ? 100 : Math.round((diff / last) * 100);
      const trend: "up" | "down" | "stable" =
        diff > 0 ? "up" : diff < 0 ? "down" : "stable";

      return { percentChange: `${percent}%`, trend };
    };

    const lecturerStats = calculateChange(lecturers, "status");
    const institutionStats = calculateChange(institutions, "status");
    const partnerStats = calculateChange(partners, "status");

    return [
      {
        title: "Tổng Giảng viên",
        value: lecturers.filter((l: any) => l.status === "APPROVED").length,
        icon: <People sx={{ fontSize: 40 }} />,
        color: "#2e7d32",
        change: lecturerStats.percentChange,
        trend: lecturerStats.trend,
      },
      {
        title: "Trung tâm Đào tạo",
        value: institutions.filter((i: any) => i.status === "APPROVED").length,
        icon: <School sx={{ fontSize: 40 }} />,
        color: "#1976d2",
        change: institutionStats.percentChange,
        trend: institutionStats.trend,
      },
      {
        title: "Đối tác",
        value: partners.filter((p: any) => p.status === "APPROVED").length,
        icon: <Business sx={{ fontSize: 40 }} />,
        color: "#ed6c02",
        change: partnerStats.percentChange,
        trend: partnerStats.trend,
      },
    ];
  }, [lecturers, institutions, partners]);

  const recentActivities: RecentActivity[] = [
    {
      id: 1,
      type: "lecturer",
      title: "Nguyễn Văn A đăng ký làm giảng viên",
      description: "Chuyên ngành: Khoa học máy tính",
      timestamp: "2 phút trước",
      status: "pending",
    },
    {
      id: 2,
      type: "institution",
      title: "Trường Đại học XYZ yêu cầu hợp tác",
      description: "Ngành: Công nghệ thông tin",
      timestamp: "15 phút trước",
      status: "approved",
    },
    {
      id: 3,
      type: "course",
      title: "Khóa học React.js được tạo mới",
      description: "Giảng viên: Trần Thị B",
      timestamp: "1 giờ trước",
      status: "approved",
    },
    {
      id: 4,
      type: "partner",
      title: "Công ty ABC đăng ký đối tác",
      description: "Lĩnh vực: Phần mềm",
      timestamp: "3 giờ trước",
      status: "pending",
    },
  ];

  const quickActions: QuickAction[] = [
    {
      title: "Quản lý Giảng viên",
      description: "Xem, duyệt và quản lý hồ sơ giảng viên",
      icon: <People sx={{ fontSize: 32 }} />,
      color: "#2e7d32",
      route: "/admin/lecturers",
    },
    {
      title: "Quản lý Trung tâm",
      description: "Quản lý các trung tâm đào tạo",
      icon: <School sx={{ fontSize: 32 }} />,
      color: "#1976d2",
      route: "/admin/institutions",
    },
    {
      title: "Quản lý Đối tác",
      description: "Quản lý các đối tác và doanh nghiệp",
      icon: <Business sx={{ fontSize: 32 }} />,
      color: "#ed6c02",
      route: "/admin/partners",
    },
    {
      title: "Quản lý Khóa học",
      description: "Xem và quản lý tất cả khóa học",
      icon: <MenuBook sx={{ fontSize: 32 }} />,
      color: "#9c27b0",
      route: "/admin/courses",
    },
  ];

  const getStatusChip = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Chip
            label="Chờ duyệt"
            size="small"
            color="warning"
            icon={<Warning />}
          />
        );
      case "approved":
        return (
          <Chip
            label="Đã duyệt"
            size="small"
            color="success"
            icon={<CheckCircle />}
          />
        );
      case "rejected":
        return (
          <Chip
            label="Từ chối"
            size="small"
            color="error"
            icon={<ErrorIcon />}
          />
        );
      default:
        return (
          <Chip label="Khác" size="small" color="default" icon={<Info />} />
        );
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "lecturer":
        return <People sx={{ color: "#2e7d32" }} />;
      case "institution":
        return <School sx={{ color: "#1976d2" }} />;
      case "partner":
        return <Business sx={{ color: "#ed6c02" }} />;
      case "course":
        return <MenuBook sx={{ color: "#9c27b0" }} />;
      default:
        return <Info />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6">Đang tải dữ liệu...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Dashboard sx={{ fontSize: 32, color: "primary.main", mr: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            Dashboard Quản trị
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Tổng quan hệ thống EduHubVN - Cập nhật lúc{" "}
          {new Date().toLocaleString("vi-VN")}
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 4 }}>
        {statsData.map((stat, index) => (
          <Card
            key={index}
            sx={{
              flex: {
                xs: "1 1 100%",
                sm: "1 1 calc(50% - 12px)",
                lg: "1 1 calc(25% - 18px)",
              },
              minWidth: "250px",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {stat.title}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
                    {stat.value.toLocaleString()}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <TrendingUp
                      sx={{ fontSize: 16, color: stat.color, mr: 0.5 }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ color: stat.color, fontWeight: "bold" }}
                    >
                      {stat.change}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ ml: 0.5 }}
                    >
                      so với tháng trước
                    </Typography>
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: stat.color, width: 64, height: 64 }}>
                  {stat.icon}
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        {/* Quick Actions */}
        <Card sx={{ flex: { xs: "1 1 100%", lg: "1 1 calc(50% - 12px)" } }}>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: "bold", mb: 3 }}
            >
              Thao tác nhanh
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {quickActions.map((action, index) => (
                <Card
                  key={index}
                  variant="outlined"
                  sx={{
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: 2,
                      transform: "translateY(-2px)",
                    },
                  }}
                  onClick={() => navigate(action.route)}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar sx={{ bgcolor: action.color, mr: 2 }}>
                        {action.icon}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: "bold" }}
                        >
                          {action.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {action.description}
                        </Typography>
                      </Box>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ color: action.color, borderColor: action.color }}
                      >
                        Xem
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card sx={{ flex: { xs: "1 1 100%", lg: "1 1 calc(50% - 12px)" } }}>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: "bold", mb: 3 }}
            >
              Hoạt động gần đây
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {recentActivities.map((activity) => (
                <Box
                  key={activity.id}
                  sx={{ p: 2, bgcolor: "background.default", borderRadius: 1 }}
                >
                  <Box sx={{ display: "flex", alignItems: "start", gap: 2 }}>
                    <Avatar sx={{ width: 40, height: 40 }}>
                      {getActivityIcon(activity.type)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: "bold" }}
                      >
                        {activity.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        {activity.description}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          {activity.timestamp}
                        </Typography>
                        {getStatusChip(activity.status)}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* System Alerts */}
      <Box sx={{ mt: 4 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 2 }}
        >
          Thông báo hệ thống
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Alert
            severity="info"
            action={
              <Button color="inherit" size="small">
                Xem chi tiết
              </Button>
            }
          >
            <strong>Cập nhật hệ thống</strong> - Phiên bản 1.0 đã được triển
            khai thành công
          </Alert>
          <Alert
            severity="warning"
            action={
              <Button color="inherit" size="small">
                Xử lý
              </Button>
            }
          >
            <strong>Cảnh báo</strong> - Có 15 đơn đăng ký giảng viên đang chờ
            duyệt
          </Alert>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminPage;
