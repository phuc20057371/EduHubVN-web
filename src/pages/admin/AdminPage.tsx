
import { useState, useEffect } from "react";
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

  // Mock data - in real app, fetch from API
  const statsData: StatCard[] = [
    {
      title: "Tổng Giảng viên",
      value: 1247,
      icon: <People sx={{ fontSize: 40 }} />,
      color: "#2e7d32",
      change: "+12%",
      trend: "up"
    },
    {
      title: "Trung tâm Đào tạo",
      value: 89,
      icon: <School sx={{ fontSize: 40 }} />,
      color: "#1976d2",
      change: "+5%",
      trend: "up"
    },
    {
      title: "Đối tác",
      value: 156,
      icon: <Business sx={{ fontSize: 40 }} />,
      color: "#ed6c02",
      change: "+8%",
      trend: "up"
    },
    {
      title: "Khóa học Hoạt động",
      value: 342,
      icon: <MenuBook sx={{ fontSize: 40 }} />,
      color: "#9c27b0",
      change: "+15%",
      trend: "up"
    }
  ];

  const recentActivities: RecentActivity[] = [
    {
      id: 1,
      type: "lecturer",
      title: "Nguyễn Văn A đăng ký làm giảng viên",
      description: "Chuyên ngành: Khoa học máy tính",
      timestamp: "2 phút trước",
      status: "pending"
    },
    {
      id: 2,
      type: "institution",
      title: "Trường Đại học XYZ yêu cầu hợp tác",
      description: "Ngành: Công nghệ thông tin",
      timestamp: "15 phút trước",
      status: "approved"
    },
    {
      id: 3,
      type: "course",
      title: "Khóa học React.js được tạo mới",
      description: "Giảng viên: Trần Thị B",
      timestamp: "1 giờ trước",
      status: "approved"
    },
    {
      id: 4,
      type: "partner",
      title: "Công ty ABC đăng ký đối tác",
      description: "Lĩnh vực: Phần mềm",
      timestamp: "3 giờ trước",
      status: "pending"
    }
  ];

  const quickActions: QuickAction[] = [
    {
      title: "Quản lý Giảng viên",
      description: "Xem, duyệt và quản lý hồ sơ giảng viên",
      icon: <People sx={{ fontSize: 32 }} />,
      color: "#2e7d32",
      route: "/admin/lecturers"
    },
    {
      title: "Quản lý Trung tâm",
      description: "Quản lý các trung tâm đào tạo",
      icon: <School sx={{ fontSize: 32 }} />,
      color: "#1976d2",
      route: "/admin/institutions"
    },
    {
      title: "Quản lý Đối tác",
      description: "Quản lý các đối tác và doanh nghiệp",
      icon: <Business sx={{ fontSize: 32 }} />,
      color: "#ed6c02",
      route: "/admin/partners"
    },
    {
      title: "Quản lý Khóa học",
      description: "Xem và quản lý tất cả khóa học",
      icon: <MenuBook sx={{ fontSize: 32 }} />,
      color: "#9c27b0",
      route: "/admin/courses"
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusChip = (status: string) => {
    switch (status) {
      case "pending":
        return <Chip label="Chờ duyệt" size="small" color="warning" icon={<Warning />} />;
      case "approved":
        return <Chip label="Đã duyệt" size="small" color="success" icon={<CheckCircle />} />;
      case "rejected":
        return <Chip label="Từ chối" size="small" color="error" icon={<ErrorIcon />} />;
      default:
        return <Chip label="Khác" size="small" color="default" icon={<Info />} />;
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
          Tổng quan hệ thống EduHub - Cập nhật lúc {new Date().toLocaleString("vi-VN")}
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 4 }}>
        {statsData.map((stat, index) => (
          <Card 
            key={index} 
            sx={{ 
              flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 12px)", lg: "1 1 calc(25% - 18px)" },
              minWidth: "250px"
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {stat.title}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
                    {stat.value.toLocaleString()}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <TrendingUp sx={{ fontSize: 16, color: stat.color, mr: 0.5 }} />
                    <Typography variant="body2" sx={{ color: stat.color, fontWeight: "bold" }}>
                      {stat.change}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
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
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
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
                      transform: "translateY(-2px)"
                    }
                  }}
                  onClick={() => navigate(action.route)}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar sx={{ bgcolor: action.color, mr: 2 }}>
                        {action.icon}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
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
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
              Hoạt động gần đây
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {recentActivities.map((activity) => (
                <Box key={activity.id} sx={{ p: 2, bgcolor: "background.default", borderRadius: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "start", gap: 2 }}>
                    <Avatar sx={{ width: 40, height: 40 }}>
                      {getActivityIcon(activity.type)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                        {activity.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {activity.description}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", mb: 2 }}>
          Thông báo hệ thống
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Alert severity="info" action={
            <Button color="inherit" size="small">
              Xem chi tiết
            </Button>
          }>
            <strong>Cập nhật hệ thống</strong> - Phiên bản 2.1.0 đã được triển khai thành công
          </Alert>
          <Alert severity="warning" action={
            <Button color="inherit" size="small">
              Xử lý
            </Button>
          }>
            <strong>Cảnh báo</strong> - Có 15 đơn đăng ký giảng viên đang chờ duyệt
          </Alert>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminPage