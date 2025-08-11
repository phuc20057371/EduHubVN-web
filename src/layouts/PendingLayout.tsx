import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
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
} from "@mui/material";
import {
  AccountCircle,
  Settings,
  Logout,
  HourglassEmpty,
  Notifications,
} from "@mui/icons-material";
import { toast } from "react-toastify";

const PendingLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userProfile = useSelector((state: any) => state.user);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await API.user.getUserProfile();
        dispatch(setUserProfile(response.data.data));
        if (response.data.data) {
          navigateToRole(response.data.data, navigate);
        }
      } catch (error) {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
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
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
    handleMenuClose();
  };

  const handleProfile = () => {
    navigate("/profile");
    handleMenuClose();
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: "#f57c00" }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Logo */}
            <HourglassEmpty
              sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
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
                flexGrow: 1,
              }}
            >
              EduHubVN
            </Typography>

            {/* Status Badge */}
            <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
              <Typography
                variant="body2"
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  px: 2,
                  py: 0.5,
                  borderRadius: 1,
                  fontWeight: 500,
                }}
              >
                Tài khoản đang chờ duyệt
              </Typography>
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

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: "#fff3e0", py: 3 }}>
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
          backgroundColor: "#f57c00",
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
                EduHub - Đang chờ duyệt
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Tài khoản của bạn đang được xem xét
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                © {new Date().getFullYear()} EduHub Vietnam. Vui lòng chờ quản
                trị viên duyệt tài khoản của bạn.
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
                Hướng dẫn đăng ký
              </Button>
              <Button color="inherit" size="small">
                Hỗ trợ kỹ thuật
              </Button>
              <Button color="inherit" size="small">
                Liên hệ
              </Button>
              <Button color="inherit" size="small">
                Câu hỏi thường gặp
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default PendingLayout;
