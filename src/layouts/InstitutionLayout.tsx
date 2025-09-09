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
  Chip,
  Card,
  CardContent,
} from "@mui/material";
import {
  AccountCircle,
  Settings,
  Logout,
  School,
  Dashboard,
  MenuBook,
  People,
  Assignment,
  Notifications,
  Menu as MenuIcon,
  Person,
  KeyboardArrowDown,
  Search,
  LightMode,
  DarkMode,
} from "@mui/icons-material";
import { alpha } from "@mui/material/styles";
import colors from "../theme/colors";
import Logoweb from "../assets/eduhub-01.png";
import WebSocketService from "../services/WebSocketService";
import { InstitutionMessageHandler } from "../services/InstitutionMessageHandler";

const InstitutionLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userProfile = useSelector((state: any) => state.userProfile);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Function to check if current path matches button path

  const isActivePath = (path: string) => {
    if (path === "/institution") {
      return (
        location.pathname === "/institution" ||
        location.pathname === "/institution/"
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
          // Only navigate if at root, login, or /institution
          const currentPath = location.pathname;
          const isAtRootOrLogin =
            currentPath === "/" ||
            currentPath === "/login" ||
            currentPath === "/institution";
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
    if (userProfile && userProfile.role === "SCHOOL") {
      WebSocketService.connect(
        userProfile,
        () => console.log("✅ Institution WebSocket connected"),
        (message) => {
          InstitutionMessageHandler.handleIncomingMessage(message, dispatch);
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
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
    handleMenuClose();
  };

  const handleProfile = () => {
    navigate("/institution/profile");
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
      path: "/institution",
      description: "Tổng quan và thống kê",
    },
    {
      text: "Đề tài",
      icon: <MenuBook />,
      path: "/institution/projects",
      description: "Quản lý đề tài nghiên cứu",
    },
    {
      text: "Khóa học",
      icon: <MenuBook />,
      path: "/institution/courses",
      description: "Quản lý khóa học",
    },
    {
      text: "Hợp đồng",
      icon: <Assignment />,
      path: "/institution/contracts",
      description: "Quản lý hợp đồng",
    },
    {
      text: "Giảng viên",
      icon: <People />,
      path: "/institution/lecturers",
      description: "Quản lý giảng viên",
    },
    {
      text: "Hồ sơ",
      icon: <Person />,
      path: "/institution/profile",
      description: "Thông tin tổ chức",
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
            sx={{ fontWeight: 700, fontSize: "1.1rem", letterSpacing: "0.5px" }}
          >
            EduHubVN
          </Typography>
        </Box>
        <Chip
          label="Tổ chức"
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
                  "& .MuiSvgIcon-root": { fontSize: "1.3rem" },
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
              Tổ chức
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              Hệ thống quản lý tổ chức
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
                "&:hover": { bgcolor: alpha("#fff", 0.2) },
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
                  Institution Dashboard
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
                  key={item.text}
                  onClick={() => navigate(item.path)}
                  sx={{
                    color: isActivePath(item.path)
                      ? colors.primary[700]
                      : "white",
                    fontWeight: isActivePath(item.path) ? 700 : 500,
                    bgcolor: isActivePath(item.path)
                      ? alpha(colors.primary[50], 0.7)
                      : alpha("#fff", 0.1),
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    mx: 0.5,
                    textTransform: "none",
                    "&:hover": {
                      bgcolor: isActivePath(item.path)
                        ? colors.primary[100]
                        : alpha("#fff", 0.2),
                    },
                  }}
                  startIcon={item.icon}
                >
                  {item.text}
                </Button>
              ))}
            </Box>

            {/* Right side actions */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton
                color="inherit"
                sx={{
                  bgcolor: alpha("#fff", 0.1),
                  "&:hover": { bgcolor: alpha("#fff", 0.2) },
                }}
              >
                <Search />
              </IconButton>
              <IconButton
                color="inherit"
                sx={{
                  bgcolor: alpha("#fff", 0.1),
                  "&:hover": { bgcolor: alpha("#fff", 0.2) },
                }}
              >
                <Notifications />
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
                  "&:hover": { bgcolor: alpha("#fff", 0.2) },
                  textTransform: "none",
                }}
              >
                <Avatar
                  alt={userProfile?.fullName || "School"}
                  src="/static/images/avatar/2.jpg"
                  sx={{ width: 28, height: 28, mr: 1 }}
                />
                {userProfile?.type === "UNIVERSITY" ? "Trường" : "Trung tâm"}
              </Button>
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
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                keepMounted
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                {/* Show email at the top of the menu */}
                {userProfile?.email && (
                  <Box sx={{ px: 2, py: 1, textAlign: "center" }}>
                    <Typography
                      variant="body2"
                      sx={{ color: colors.primary[700], fontWeight: 600 }}
                    >
                      {userProfile.email}
                    </Typography>
                  </Box>
                )}
                <Divider sx={{ my: 1 }} />
                <MenuItem onClick={handleProfile}>
                  <AccountCircle sx={{ mr: 1 }} />
                  <Typography textAlign="center">Hồ sơ</Typography>
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <Settings sx={{ mr: 1 }} />
                  <Typography textAlign="center">Cài đặt</Typography>
                </MenuItem>
                <Divider sx={{ my: 1 }} />
                <MenuItem onClick={handleLogout}>
                  <Logout sx={{ mr: 1 }} />
                  <Typography textAlign="center">Đăng xuất</Typography>
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
        ModalProps={{ keepMounted: true }}
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
          minHeight: 0,
        }}
      >
        <Container
          maxWidth="xl"
          sx={{ py: 4, position: "relative", height: "100%", overflow: "auto" }}
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
              <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
                <Typography variant="h6" gutterBottom>
                  EduHubVN
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Nền tảng quản lý giáo dục hàng đầu Việt Nam
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  © 2025 EduHubVN. Tất cả quyền được bảo lưu.
                </Typography>
              </Box>
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
                <Button color="inherit" size="small">
                  Về chúng tôi
                </Button>
                <Button color="inherit" size="small">
                  Hỗ trợ
                </Button>
                <Button color="inherit" size="small">
                  Liên hệ
                </Button>
                <Button color="inherit" size="small">
                  Chính sách bảo mật
                </Button>
              </Box>
            </Box>
            <Divider sx={{ borderColor: alpha("#fff", 0.1), mb: 2 }} />
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
                {/* Social icons or links can be added here */}
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default InstitutionLayout;
