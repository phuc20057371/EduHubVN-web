import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { API } from "../utils/Fetch";
import { setUserProfile } from "../redux/slice/userSlice";
import { navigateToRole } from "../utils/navigationRole";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Badge,
  Chip,
  Card,
  CardContent,
  alpha,
} from "@mui/material";
import {
  AccountCircle,
  Settings,
  Logout,
  Dashboard,
  MenuBook,
  Assignment,
  Person,
  Notifications,
  Menu as MenuIcon,
  KeyboardArrowDown,
  Search,
  LightMode,
  DarkMode,
  TrendingUp,
  School,
} from "@mui/icons-material";
import { setLecturerProfile } from "../redux/slice/LecturerProfileSlice";
import { colors } from "../theme/colors";
import Logoweb from "../assets/eduhub-02.png";
import WebSocketService from "../services/WebSocketService";
import { useGlobalWebSocket } from "../hooks/useGlobalWebSocket";
import { LecturerMessageHandler } from "../services/LecturerMessageHandler";

const LecturerLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userProfile = useSelector((state: any) => state.userProfile);
  const lecturerProfile = useSelector((state: any) => state.lecturerProfile);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
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
    <Box sx={{ height: "100%", background: colors.background.secondary }}>
      {/* Logo Section */}
      <Box
        sx={{
          p: 3,
          background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[700]} 100%)`,
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
                borderRadius: 2,
                minHeight: 56,
                backgroundColor: isActivePath(item.path)
                  ? colors.primary[50]
                  : "transparent",
                border: isActivePath(item.path)
                  ? `1px solid ${colors.primary[200]}`
                  : "1px solid transparent",
                "&:hover": {
                  backgroundColor: isActivePath(item.path)
                    ? colors.primary[100]
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
                    ? colors.primary[600]
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
                      ? colors.primary[700]
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
                    bgcolor: colors.primary[500],
                    borderRadius: 2,
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
            background: `linear-gradient(135deg, ${colors.accent.lightBlue} 0%, ${colors.accent.sky} 100%)`,
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
      {/* Modern Header */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[700]} 100%)`,
          borderBottom: `1px solid ${colors.border.light}`,
          backdropFilter: "blur(10px)",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: 70 }}>
            {/* Mobile menu button */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                mr: 2,
                display: { md: "none" },
                bgcolor: alpha("#fff", 0.1),
                "&:hover": {
                  bgcolor: alpha("#fff", 0.2),
                },
              }}
            >
              <MenuIcon />
            </IconButton>

            {/* Logo and Brand */}
            <Box sx={{ display: "flex", alignItems: "center", mr: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 1,
                  borderRadius: 2,
                  bgcolor: alpha("#fff", 0.1),
                  mr: 2,
                }}
              >
                <img
                  src={Logoweb}
                  style={{ width: "36px", height: "36px" }}
                  alt="EduHubVN"
                />
              </Box>
              <Box>
                <Typography
                  variant="h5"
                  component="div"
                  sx={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 700,
                    letterSpacing: "-0.5px",
                    color: "white",
                    lineHeight: 1.2,
                    display: { xs: "none", sm: "block" },
                  }}
                >
                  EduHubVN
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: alpha("#fff", 0.8),
                    fontWeight: 500,
                    display: { xs: "none", sm: "block" },
                  }}
                >
                  Lecturer Dashboard
                </Typography>
              </Box>
            </Box>

            {/* Desktop Navigation */}
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
                gap: 1,
                ml: 2,
              }}
            >
              {menuItems.map((item) => (
                <Button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  startIcon={item.icon}
                  sx={{
                    color: "white",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    backgroundColor: isActivePath(item.path)
                      ? alpha("#fff", 0.2)
                      : "transparent",
                    border: isActivePath(item.path)
                      ? `1px solid ${alpha("#fff", 0.3)}`
                      : "1px solid transparent",
                    "&:hover": {
                      backgroundColor: alpha("#fff", 0.15),
                      transform: "translateY(-1px)",
                      boxShadow: `0 4px 12px ${alpha("#000", 0.15)}`,
                    },
                    transition: "all 0.2s ease-in-out",
                    textTransform: "none",
                    fontWeight: isActivePath(item.path) ? 600 : 500,
                    fontSize: "0.9rem",
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>

            {/* Right side actions */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {/* Search Button */}
              <IconButton
                color="inherit"
                sx={{
                  bgcolor: alpha("#fff", 0.1),
                  "&:hover": {
                    bgcolor: alpha("#fff", 0.2),
                  },
                }}
              >
                <Search />
              </IconButton>

              {/* Theme Toggle */}
              <IconButton
                onClick={toggleTheme}
                color="inherit"
                sx={{
                  bgcolor: alpha("#fff", 0.1),
                  "&:hover": {
                    bgcolor: alpha("#fff", 0.2),
                  },
                }}
              >
                {isDarkMode ? <LightMode /> : <DarkMode />}
              </IconButton>

              {/* Notifications */}
              <IconButton
                color="inherit"
                sx={{
                  bgcolor: alpha("#fff", 0.1),
                  "&:hover": {
                    bgcolor: alpha("#fff", 0.2),
                  },
                }}
              >
                <Badge badgeContent={3} color="error" variant="dot">
                  <Notifications />
                </Badge>
              </IconButton>

              {/* User Menu */}
              <Button
                onClick={handleMenuOpen}
                endIcon={<KeyboardArrowDown />}
                sx={{
                  color: "white",
                  ml: 1,
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  bgcolor: alpha("#fff", 0.1),
                  "&:hover": {
                    bgcolor: alpha("#fff", 0.2),
                  },
                  textTransform: "none",
                }}
              >
                <Avatar
                  alt={
                    lecturerProfile?.fullName ||
                    userProfile?.fullName ||
                    "Lecturer"
                  }
                  src={lecturerProfile?.avatarUrl || userProfile?.avatarUrl}
                  sx={{
                    width: 32,
                    height: 32,
                    mr: 1,
                    bgcolor: colors.secondary[500],
                    fontSize: "0.9rem",
                    fontWeight: 600,
                  }}
                >
                  {lecturerProfile?.lecturer?.fullName?.charAt(0) ||
                    userProfile?.fullName?.charAt(0) ||
                    "L"}
                </Avatar>
                <Box
                  sx={{
                    textAlign: "left",
                    display: { xs: "none", sm: "block" },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, lineHeight: 1.2 }}
                  >
                    {lecturerProfile?.lecturer?.fullName || "Giảng viên"}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ opacity: 0.8, lineHeight: 1 }}
                  >
                    Giảng viên
                  </Typography>
                </Box>
              </Button>

              {/* Enhanced User Menu */}
              <Menu
                sx={{
                  mt: "45px",
                  "& .MuiPaper-root": {
                    borderRadius: 2,
                    minWidth: 200,
                    boxShadow: `0 8px 24px ${alpha("#000", 0.12)}`,
                    border: `1px solid ${colors.border.light}`,
                  },
                }}
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <Box
                  sx={{
                    px: 2,
                    py: 1.5,
                    borderBottom: `1px solid ${colors.border.light}`,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, color: colors.text.primary }}
                  >
                    {lecturerProfile?.fullName ||
                      userProfile?.fullName ||
                      "Giảng viên"}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: colors.text.tertiary }}
                  >
                    {lecturerProfile?.email ||
                      userProfile?.email ||
                      "lecturer@eduhubvn.com"}
                  </Typography>
                </Box>

                <MenuItem
                  onClick={handleProfile}
                  sx={{
                    py: 1.5,
                    "&:hover": {
                      bgcolor: colors.primary[50],
                    },
                  }}
                >
                  <AccountCircle sx={{ mr: 2, color: colors.primary[500] }} />
                  <Typography>Hồ sơ cá nhân</Typography>
                </MenuItem>

                <MenuItem
                  onClick={handleMenuClose}
                  sx={{
                    py: 1.5,
                    "&:hover": {
                      bgcolor: colors.primary[50],
                    },
                  }}
                >
                  <Settings sx={{ mr: 2, color: colors.primary[500] }} />
                  <Typography>Cài đặt tài khoản</Typography>
                </MenuItem>

                <Divider sx={{ my: 1 }} />

                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    py: 1.5,
                    color: colors.error[600],
                    "&:hover": {
                      bgcolor: colors.error[50],
                    },
                  }}
                >
                  <Logout sx={{ mr: 2 }} />
                  <Typography>Đăng xuất</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

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
          background: `linear-gradient(180deg, ${colors.background.tertiary} 0%, ${colors.background.secondary} 100%)`,
          position: "relative",
          overflow: "auto",
          minHeight: 0, // Important for flex children to scroll properly
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

      {/* Modern Footer */}
      <Box
        component="footer"
        sx={{
          background: `linear-gradient(135deg, ${colors.neutral[800]} 0%, ${colors.neutral[900]} 100%)`,
          color: "white",
          mt: "auto",
          position: "relative",
          overflow: "auto",
        }}
      >
        {/* Footer Background Pattern */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at 10% 20%, ${alpha(colors.primary[500], 0.1)} 0%, transparent 50%),
                        radial-gradient(circle at 90% 80%, ${alpha(colors.secondary[500], 0.1)} 0%, transparent 50%)`,
            zIndex: 0,
          }}
        />

        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
          <Box sx={{ py: 4 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "center", md: "flex-start" },
                gap: { xs: 3, md: 4 },
                mb: 3,
              }}
            >
              {/* Brand Section */}
              <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                    justifyContent: { xs: "center", md: "flex-start" },
                  }}
                >
                  <img
                    src={Logoweb}
                    style={{
                      width: "32px",
                      height: "32px",
                      marginRight: "12px",
                    }}
                    alt="EduHubVN"
                  />
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, fontSize: "1.25rem" }}
                  >
                    EduHub Lecturer
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{ opacity: 0.8, mb: 1, maxWidth: 300 }}
                >
                  Nền tảng quản lý giảng dạy chuyên nghiệp dành cho giảng viên
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.6 }}>
                  © 2025 EduHub Vietnam. Tất cả quyền được bảo lưu.
                </Typography>
              </Box>

              {/* Quick Links */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                  },
                  gap: 3,
                  minWidth: { md: "400px" },
                }}
              >
                {/* Teaching Links */}
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      mb: 1.5,
                      color: colors.primary[300],
                    }}
                  >
                    Giảng dạy
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}
                  >
                    <Button
                      color="inherit"
                      size="small"
                      sx={{
                        justifyContent: "flex-start",
                        opacity: 0.8,
                        "&:hover": { opacity: 1, color: colors.primary[300] },
                      }}
                      onClick={() => navigate("/lecturer/courses")}
                    >
                      Khóa học của tôi
                    </Button>
                    <Button
                      color="inherit"
                      size="small"
                      sx={{
                        justifyContent: "flex-start",
                        opacity: 0.8,
                        "&:hover": { opacity: 1, color: colors.primary[300] },
                      }}
                      onClick={() => navigate("/lecturer/schedule")}
                    >
                      Lịch giảng dạy
                    </Button>
                    <Button
                      color="inherit"
                      size="small"
                      sx={{
                        justifyContent: "flex-start",
                        opacity: 0.8,
                        "&:hover": { opacity: 1, color: colors.primary[300] },
                      }}
                      onClick={() => navigate("/lecturer/analytics")}
                    >
                      Thống kê hiệu quả
                    </Button>
                  </Box>
                </Box>

                {/* Support Links */}
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      mb: 1.5,
                      color: colors.primary[300],
                    }}
                  >
                    Hỗ trợ
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}
                  >
                    <Button
                      color="inherit"
                      size="small"
                      sx={{
                        justifyContent: "flex-start",
                        opacity: 0.8,
                        "&:hover": { opacity: 1, color: colors.primary[300] },
                      }}
                    >
                      Hướng dẫn giảng dạy
                    </Button>
                    <Button
                      color="inherit"
                      size="small"
                      sx={{
                        justifyContent: "flex-start",
                        opacity: 0.8,
                        "&:hover": { opacity: 1, color: colors.primary[300] },
                      }}
                    >
                      Hỗ trợ kỹ thuật
                    </Button>
                    <Button
                      color="inherit"
                      size="small"
                      sx={{
                        justifyContent: "flex-start",
                        opacity: 0.8,
                        "&:hover": { opacity: 1, color: colors.primary[300] },
                      }}
                    >
                      Cộng đồng giảng viên
                    </Button>
                  </Box>
                </Box>

                {/* Account Info */}
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      mb: 1.5,
                      color: colors.primary[300],
                    }}
                  >
                    Tài khoản
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}
                  >
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                      Trạng thái: Hoạt động
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                      Cập nhật: 13/08/2025
                    </Typography>
                    <Chip
                      label="Giảng viên"
                      size="small"
                      sx={{
                        bgcolor: colors.success[500],
                        color: "white",
                        fontSize: "0.7rem",
                        height: "20px",
                        width: "fit-content",
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Bottom Border */}
            <Divider sx={{ borderColor: alpha("#fff", 0.1), mb: 2 }} />

            {/* Bottom Footer */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Typography variant="caption" sx={{ opacity: 0.6 }}>
                Được phát triển với ❤️ bởi đội ngũ EduHub Vietnam
              </Typography>

              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <Typography variant="caption" sx={{ opacity: 0.6 }}>
                  Hỗ trợ giảng viên 24/7
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.6 }}>
                  •
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.6 }}>
                  lecturer-support@eduhubvn.com
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.6 }}>
                  •
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.6 }}>
                  (+84) 123 456 789
                </Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LecturerLayout;
