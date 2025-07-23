import { useEffect } from "react";
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
  People,
  Assignment,
  Notifications,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { useState } from "react";

const InstitutionLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userProfile = useSelector((state: any) => state.user);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

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
          navigateToRole(response.data.data, navigate);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);



  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    handleMenuClose();
  };

  const handleProfile = () => {
    // Navigate to profile page
    handleMenuClose();
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/institution" },
    { text: "Đề tài", icon: <MenuBook />, path: "/institution/courses" },
    { text: "Hợp đồng", icon: <People />, path: "/institution/lecturers" },
    {
      text: "Chứng chỉ",
      icon: <Assignment />,
      path: "/institution/certificates",
    },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        EduHubVN
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
      <AppBar position="static" sx={{ bgcolor: "#1976d2" }}>
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
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, gap: 2 }}>
              <Button
                onClick={() => navigate("/institution")}
                sx={{
                  my: 2,
                  color: "white",
                  display: "flex",
                  gap: 1,
                  alignItems: "center",
                  backgroundColor: isActivePath("/institution")
                    ? "rgba(255, 255, 255, 0.2)"
                    : "transparent",
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: isActivePath("/institution")
                      ? "rgba(255, 255, 255, 0.3)"
                      : "rgba(255, 255, 255, 0.1)",
                  },
                }}
                startIcon={<Dashboard />}
              >
                Trang chủ
              </Button>
              <Button
                onClick={() => navigate("/institution/courses")}
                sx={{
                  my: 2,
                  color: "white",
                  display: "flex",
                  backgroundColor: isActivePath("/institution/courses")
                    ? "rgba(255, 255, 255, 0.2)"
                    : "transparent",
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: isActivePath("/institution/courses")
                      ? "rgba(255, 255, 255, 0.3)"
                      : "rgba(255, 255, 255, 0.1)",
                  },
                }}
                startIcon={<MenuBook />}
              >
                ĐỀ TÀI
              </Button>
              <Button
                onClick={() => navigate("/institution/lecturers")}
                sx={{
                  my: 2,
                  color: "white",
                  display: "flex",
                  backgroundColor: isActivePath("/institution/lecturers")
                    ? "rgba(255, 255, 255, 0.2)"
                    : "transparent",
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: isActivePath("/institution/lecturers")
                      ? "rgba(255, 255, 255, 0.3)"
                      : "rgba(255, 255, 255, 0.1)",
                  },
                }}
                startIcon={<People />}
              >
                HỢP ĐỒNG
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
          backgroundColor: "#1976d2",
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
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: { xs: 1, md: 2 },
                alignItems: "center",
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
        </Container>
      </Box>
    </Box>
  );
};

export default InstitutionLayout;
