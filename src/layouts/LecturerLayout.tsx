import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { API } from "../utils/Fetch";
import { setUserProfile } from "../redux/slice/userSlice";
import { navigateToRole } from "../utils/navigationRole";
import {
  Typography,
  Box,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Chip,
  Card,
  CardContent,
  alpha,
} from "@mui/material";
import {
  Dashboard,
  MenuBook,
  Assignment,
  Person,
  TrendingUp,
  School,
} from "@mui/icons-material";
import { setLecturerProfile } from "../redux/slice/LecturerProfileSlice";
import { useColors } from "../hooks/useColors";
import Logoweb from "../assets/Eduhub_logo_new.png";
import WebSocketService from "../services/WebSocketService";
import { useGlobalWebSocket } from "../hooks/useGlobalWebSocket";
import { LecturerMessageHandler } from "../services/LecturerMessageHandler";
import EduHubSpeedDial from "../components/EduHubSpeedDial";
import Footer from "../components/Footer";
import { Header } from "../components";
import {
  Divider,
} from "@mui/material";

const LecturerLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const colors = useColors();
  const userProfile = useSelector((state: any) => state.userProfile);
  const lecturerProfile = useSelector((state: any) => state.lecturerProfile);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Sử dụng global WebSocket manager
  const { disconnect: disconnectWebSocket } = useGlobalWebSocket();

  // Function to check if current path matches button path
  const isActivePath = (path: string) => {
    if (path === "/lecturer") {
      return (
        location.pathname === "/lecturer" || location.pathname === "/lecturer/"
      );
    }
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await API.user.getUserProfile();
        dispatch(setUserProfile(response.data.data));
        if (response.data.data) {
          // Chỉ thực hiện navigation khi đang ở trang root hoặc chưa có path cụ thể
          const currentPath = location.pathname;
          const isAtRootOrLogin =
            currentPath === "/" ||
            currentPath === "/login" ||
            currentPath === "/lecturer";

          if (isAtRootOrLogin) {
            navigateToRole(response.data.data, navigate);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [dispatch, navigate, location.pathname]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.lecturer.getLecturerProfile();
        if (!response.data.success) {
          throw new Error("Failed to fetch lecturer profile");
        }
        dispatch(setLecturerProfile(response.data.data));
      } catch (error) {
        console.error("Error fetching lecturer profile:", error);
        navigate("/error");
      }
    };
    fetchData();
  }, [dispatch, navigate]);

  useEffect(() => {
    if (userProfile && userProfile.role === "LECTURER") {
      WebSocketService.connect(
        userProfile,
        () => console.log("✅ Lecturer WebSocket connected"),
        (message) => {
          LecturerMessageHandler.handleIncomingMessage(message, dispatch);
        },
      );
    }

    // Cleanup khi component unmount
    return () => {
      WebSocketService.disconnect();
    };
  }, [userProfile]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    console.log("🚪 Logging out - disconnecting WebSocket");
    disconnectWebSocket();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
    handleMenuClose();
  };

  const handleProfile = () => {
    navigate("/lecturer/profile");
    handleMenuClose();
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Enhanced menu items with new icons and descriptions
  const menuItems = [
    {
      text: "Trang chủ",
      icon: <Dashboard />,
      path: "/lecturer",
      description: "Tổng quan và thống kê",
    },
    {
      text: "Đề tài",
      icon: <Dashboard />,
      path: "/lecturer/projects",
      description: "Tổng quan và thống kê",
    },
    {
      text: "Khóa học",
      icon: <MenuBook />,
      path: "/lecturer/courses",
      description: "Quản lý khóa học giảng dạy",
    },
    {
      text: "Hợp đồng",
      icon: <Assignment />,
      path: "/lecturer/contracts",
      description: "Quản lý hợp đồng giảng dạy",
    },
    {
      text: "Thống kê",
      icon: <TrendingUp />,
      path: "/lecturer/statistics",
      description: "Phân tích hiệu quả giảng dạy",
    },
    {
      text: "Hồ sơ",
      icon: <Person />,
      path: "/lecturer/profile",
      description: "Thông tin cá nhân",
    },
  ];

  const drawer = (
    <Box sx={{ height: "100%", background: colors.isDark ? colors.background.primary : "none" }}>
      {/* Logo Section */}
      <Box
        sx={{
          p: 3,
          background: colors.isDark 
            ? colors.gradients.primary 
            : `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.dark} 100%)`,
          color: "white",
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 1,
          }}
        >
          <img
            src={Logoweb}
            style={{ width: "32px", height: "32px", marginRight: "12px" }}
            alt="EduHubVN"
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: "1.1rem",
              letterSpacing: "0.5px",
            }}
          >
            EduHubVN
          </Typography>
        </Box>
        <Chip
          label="Giảng viên"
          size="small"
          sx={{
            bgcolor: alpha("#fff", 0.2),
            color: "white",
            fontSize: "0.75rem",
            height: "20px",
          }}
        />
      </Box>

      <Divider sx={{ borderColor: colors.border.light }} />

      {/* Navigation Items */}
      <List sx={{ px: 2, py: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              sx={{
                borderRadius: 1,
                minHeight: 56,
                backgroundColor: isActivePath(item.path)
                  ? colors.primary.light
                  : "transparent",
                border: isActivePath(item.path)
                  ? `1px solid ${colors.primary.light}`
                  : "1px solid transparent",
                "&:hover": {
                  backgroundColor: isActivePath(item.path)
                    ? colors.primary.light
                    : colors.isDark 
                      ? `${colors.primary.main}20`
                      : colors.neutral[50],
                  transform: "translateX(4px)",
                  transition: "all 0.2s ease-in-out",
                },
                transition: "all 0.2s ease-in-out",
              }}
              onClick={() => {
                navigate(item.path);
                handleDrawerToggle();
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 44,
                  color: isActivePath(item.path)
                    ? colors.primary.dark
                    : colors.neutral[600],
                  "& .MuiSvgIcon-root": {
                    fontSize: "1.3rem",
                  },
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                secondary={item.description}
                sx={{
                  "& .MuiListItemText-primary": {
                    color: isActivePath(item.path)
                      ? colors.primary.dark
                      : colors.neutral[800],
                    fontWeight: isActivePath(item.path) ? 600 : 500,
                    fontSize: "0.95rem",
                  },
                  "& .MuiListItemText-secondary": {
                    color: colors.neutral[500],
                    fontSize: "0.75rem",
                    marginTop: "2px",
                  },
                }}
              />
              {isActivePath(item.path) && (
                <Box
                  sx={{
                    width: 4,
                    height: 20,
                    bgcolor: colors.primary.main,
                    borderRadius: 1,
                    ml: 1,
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Quick Stats or Info */}
      <Box sx={{ px: 3, py: 2, mt: "auto" }}>
        <Card
          sx={{
            background: `linear-gradient(135deg, ${colors.accent.blue} 0%, ${colors.accent.light} 100%)`,
            color: "white",
            textAlign: "center",
            py: 2,
          }}
        >
          <CardContent sx={{ py: "16px !important" }}>
            <School sx={{ fontSize: 28, mb: 1 }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Giảng viên
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              Hệ thống giảng dạy
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header Component */}
      <Header
        userProfile={userProfile}
        profile={lecturerProfile}
        menuItems={menuItems}
        userRole="lecturer"
        userRoleDisplay="Giảng viên"
        anchorEl={anchorEl}
        onMenuOpen={handleMenuOpen}
        onMenuClose={handleMenuClose}
        onLogout={handleLogout}
        onProfile={handleProfile}
        onDrawerToggle={handleDrawerToggle}
        isActivePath={isActivePath}
      />

      {/* Enhanced Mobile Navigation Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 280,
            border: "none",
            boxShadow: `0 8px 32px ${alpha("#000", 0.12)}`,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Modern Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          background: colors.isDark 
            ? colors.gradients.secondary 
            : `linear-gradient(180deg, ${colors.background.tertiary} 0%, ${colors.background.secondary} 100%)`,
          position: "relative",
          overflow: "auto",
          minHeight: 0, // Important for flex children to scroll properly
          pt: "70px", // Add padding-top for fixed header
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            py: 4,
            position: "relative",
            height: "100%",
            overflow: "auto",
          }}
        >
          <Outlet />
        </Container>
      </Box>

      {/* Footer */}
      <Footer />
      {/* EduHub Speed Dial for Lecturer */}
      <EduHubSpeedDial 
        userRole="lecturer"
      />
    </Box>
  );
};

export default LecturerLayout;
