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
} from "@mui/material";
import {
  AccountCircle,
  Settings,
  Logout,
  School,
  Dashboard,
  MenuBook,
  Assignment,
  Person,
  Notifications,
  Menu as MenuIcon,
  Grade,
  Schedule,
} from "@mui/icons-material";
import { setLecturerProfile } from "../redux/slice/LecturerProfileSlice";

const LecturerLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userProfile = useSelector((state: any) => state.user);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

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
          navigateToRole(response.data.data, navigate);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.lecturer.getLecturerProfile();
        if (!response.data.success) {
          throw new Error("Failed to fetch lecturer profile");
        }
        dispatch(setLecturerProfile(response.data.data));
        console.log("Lecturer Profile:", response.data.data);
      } catch (error) {
        console.error("Error fetching lecturer profile:", error);
        navigate("/error"); // Redirect to an error page if needed
      }
    };
    fetchData();
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
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

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/lecturer" },
    { text: "Khóa học của tôi", icon: <MenuBook />, path: "/lecturer/courses" },
    { text: "Lịch dạy", icon: <Schedule />, path: "/lecturer/schedule" },
    { text: "Chấm điểm", icon: <Grade />, path: "/lecturer/grading" },
    { text: "Hồ sơ", icon: <Person />, path: "/lecturer/profile" },
    { text: "Chứng chỉ", icon: <Assignment />, path: "/lecturer/certificates" },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        EduHub - Giảng viên
      </Typography>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              sx={{ textAlign: "center" }}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon sx={{ minWidth: "auto", mr: 1 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: "#2e7d32" }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Mobile menu button */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: "none" } }}
            >
              <MenuIcon />
            </IconButton>

            {/* Logo */}
            <School sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                mr: 2,
                display: { xs: "flex", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
                flexGrow: { xs: 1, md: 0 },
              }}
            >
              EduHubVN
            </Typography>

            {/* Navigation */}
            <Box
              sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, gap: 2 }}
            >
              <Button
                onClick={() => navigate("/lecturer")}
                sx={{
                  my: 2,
                  color: "white",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 1,
                  backgroundColor: isActivePath("/lecturer")
                    ? "rgba(255, 255, 255, 0.2)"
                    : "transparent",
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: isActivePath("/lecturer")
                      ? "rgba(255, 255, 255, 0.3)"
                      : "rgba(255, 255, 255, 0.1)",
                  },
                }}
                startIcon={<Dashboard />}
              >
                Trang chủ
              </Button>
              <Button
                onClick={() => navigate("/lecturer/courses")}
                sx={{
                  my: 2,
                  color: "white",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 1,
                  backgroundColor: isActivePath("/lecturer/courses")
                    ? "rgba(255, 255, 255, 0.2)"
                    : "transparent",
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: isActivePath("/lecturer/courses")
                      ? "rgba(255, 255, 255, 0.3)"
                      : "rgba(255, 255, 255, 0.1)",
                  },
                }}
                startIcon={<MenuBook />}
              >
                Lời mời khóa học
              </Button>
              <Button
                onClick={() => navigate("/lecturer/schedule")}
                sx={{
                  my: 2,
                  color: "white",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 1,
                  backgroundColor: isActivePath("/lecturer/schedule")
                    ? "rgba(255, 255, 255, 0.2)"
                    : "transparent",
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: isActivePath("/lecturer/schedule")
                      ? "rgba(255, 255, 255, 0.3)"
                      : "rgba(255, 255, 255, 0.1)",
                  },
                }}
                startIcon={<Schedule />}
              >
                Hợp đồng
              </Button>
            </Box>

            {/* Notifications */}
            <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
              <IconButton color="inherit">
                <Notifications />
              </IconButton>
            </Box>

            {/* User Menu */}
            <Box sx={{ flexGrow: 0 }}>
              <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                <Avatar
                  alt={userProfile?.fullName || "User"}
                  src="/static/images/avatar/2.jpg"
                />
              </IconButton>
              <Menu
                sx={{ mt: "45px" }}
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
                <MenuItem onClick={handleProfile}>
                  <AccountCircle sx={{ mr: 1 }} />
                  <Typography textAlign="center">Hồ sơ</Typography>
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <Settings sx={{ mr: 1 }} />
                  <Typography textAlign="center">Cài đặt</Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <Logout sx={{ mr: 1 }} />
                  <Typography textAlign="center">Đăng xuất</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: "#f5f5f5", py: 3 }}>
        <Container maxWidth="xl">
          <Outlet />
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 4,
          px: 2,
          mt: "auto",
          backgroundColor: "#2e7d32",
          color: "white",
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "center", md: "center" },
              gap: { xs: 2, md: 0 },
            }}
          >
            <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
              <Typography variant="h6" gutterBottom>
                EduHub - Giảng viên
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Nền tảng quản lý giảng dạy chuyên nghiệp
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                © 2025 EduHub Vietnam. Tất cả quyền được bảo lưu.
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: { xs: 1, md: 2 },
                alignItems: "center",
              }}
            >
              <Button color="inherit" size="small">
                Hướng dẫn sử dụng
              </Button>
              <Button color="inherit" size="small">
                Hỗ trợ kỹ thuật
              </Button>
              <Button color="inherit" size="small">
                Liên hệ
              </Button>
              <Button color="inherit" size="small">
                Quy định
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LecturerLayout;
