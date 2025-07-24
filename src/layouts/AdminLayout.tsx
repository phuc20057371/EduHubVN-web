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
  Dashboard,
  School,
  Business,
  Person,
  Notifications,
  Menu as MenuIcon,
} from "@mui/icons-material";
import LogoWeb from "../assets/eduhub-03.png";

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userProfile = useSelector((state: any) => state.user);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Function to check if current path matches button path
  const isActivePath = (path: string) => {
    if (path === "/admin") {
      return location.pathname === "/admin" || location.pathname === "/admin/";
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
  }, [dispatch, navigate]);

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
    navigate("/admin/profile");
    handleMenuClose();
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/admin" },
    { text: "Giảng viên", icon: <Person />, path: "/admin/lecturers" },
    {
      text: "Trung tâm đào tạo",
      icon: <School />,
      path: "/admin/institutions",
    },
    { text: "Đơn vị tổ chức", icon: <Business />, path: "/admin/partners" },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography
        variant="h6"
        sx={{ my: 2, color: "primary.main", fontWeight: "bold" }}
      >
        EduHubVN
      </Typography>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              sx={{
                textAlign: "center",
                backgroundColor: isActivePath(item.path)
                  ? "rgba(25, 118, 210, 0.1)"
                  : "transparent",
                "&:hover": {
                  backgroundColor: isActivePath(item.path)
                    ? "rgba(25, 118, 210, 0.2)"
                    : "rgba(0, 0, 0, 0.04)",
                },
              }}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon
                sx={{
                  minWidth: "auto",
                  mr: 1,
                  color: isActivePath(item.path) ? "primary.main" : "inherit",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  color: isActivePath(item.path) ? "primary.main" : "inherit",
                  fontWeight: isActivePath(item.path) ? "bold" : "normal",
                }}
              />
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
            {/* <AdminPanelSettings sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} /> */}
            <div className="flex items-center bg-white rounded-full p-1">
              <img
                src={LogoWeb}
                style={{ width: "40px", height: "40px" }}
                alt=""
              />
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
            </div>

            {/* Navigation */}
            <Box
              sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, gap: 1 }}
            >
              <Button
                onClick={() => navigate("/admin")}
                sx={{
                  my: 2,
                  color: "white",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 1,
                  backgroundColor: isActivePath("/admin")
                    ? "rgba(255, 255, 255, 0.2)"
                    : "transparent",
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: isActivePath("/admin")
                      ? "rgba(255, 255, 255, 0.3)"
                      : "rgba(255, 255, 255, 0.1)",
                  },
                }}
                startIcon={<Dashboard />}
              >
                Trang chủ
              </Button>
              <Button
                onClick={() => navigate("/admin/lecturers")}
                sx={{
                  my: 2,
                  color: "white",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 1,
                  backgroundColor: isActivePath("/admin/lecturers")
                    ? "rgba(255, 255, 255, 0.2)"
                    : "transparent",
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: isActivePath("/admin/lecturers")
                      ? "rgba(255, 255, 255, 0.3)"
                      : "rgba(255, 255, 255, 0.1)",
                  },
                }}
                startIcon={<Person />}
              >
                Giảng viên
              </Button>
              <Button
                onClick={() => navigate("/admin/institutions")}
                sx={{
                  my: 2,
                  color: "white",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 1,
                  backgroundColor: isActivePath("/admin/institutions")
                    ? "rgba(255, 255, 255, 0.2)"
                    : "transparent",
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: isActivePath("/admin/institutions")
                      ? "rgba(255, 255, 255, 0.3)"
                      : "rgba(255, 255, 255, 0.1)",
                  },
                }}
                startIcon={<School />}
              >
                Trung tâm
              </Button>
              <Button
                onClick={() => navigate("/admin/partners")}
                sx={{
                  my: 2,
                  color: "white",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 1,
                  backgroundColor: isActivePath("/admin/partners")
                    ? "rgba(255, 255, 255, 0.2)"
                    : "transparent",
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: isActivePath("/admin/partners")
                      ? "rgba(255, 255, 255, 0.3)"
                      : "rgba(255, 255, 255, 0.1)",
                  },
                }}
                startIcon={<Business />}
              >
                Đối tác
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
                  alt={userProfile?.fullName || "Admin"}
                  src="/static/images/avatar/admin.jpg"
                  sx={{ bgcolor: "secondary.main" }}
                >
                  {userProfile?.fullName?.charAt(0) || "A"}
                </Avatar>
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
                EduHub - Admin Panel
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Hệ thống quản trị nền tảng giáo dục
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
                Hướng dẫn quản trị
              </Button>
              <Button color="inherit" size="small">
                Hỗ trợ kỹ thuật
              </Button>
              <Button color="inherit" size="small">
                Báo cáo
              </Button>
              <Button color="inherit" size="small">
                Bảo mật
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default AdminLayout;
