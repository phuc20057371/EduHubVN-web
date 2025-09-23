import {
  AccountCircle,
  Help,
  KeyboardArrowDown,
  Language,
  Logout,
  Notifications,
  Security,
  Settings,
} from "@mui/icons-material";
import {
  Avatar,
  Badge,
  Box,
  Chip,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import Logoweb from "../assets/Eduhub_logo_new.png";
import EduHubSpeedDial from "../components/EduHubSpeedDial";
import Footer from "../components/Footer";
import { useColors } from "../hooks/useColors";
import { setUserProfile } from "../redux/slice/userSlice";
import WebSocketService from "../services/WebSocketService";
import { API } from "../utils/Fetch";
import { navigateToRole } from "../utils/navigationRole";

const HomeLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userProfile = useSelector((state: any) => state.userProfile);
  const colors = useColors();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] =
    useState<null | HTMLElement>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await API.user.getUserProfile();
        dispatch(setUserProfile(response.data.data));
        if (response.data.data) {
          navigateToRole(response.data.data, navigate);
        }
      } catch (error) {
        navigate("/guest");
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  // WebSocket connection effect
  useEffect(() => {
    if (userProfile) {
      WebSocketService.connect(
        userProfile,
        () => console.log("✅ Home WebSocket connected"),
        (message) => {
          console.log("📨 Home received message:", message);
          // Xử lý message chung cho tất cả user
        }
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

  const handleNotificationOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
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

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "LECTURER":
        return "Giảng viên";
      case "INSTITUTION":
        return "Trường học";
      case "PARTNER":
        return "Đối tác";
      case "ADMIN":
        return "Quản trị viên";
      default:
        return "Người dùng";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "LECTURER":
        return colors.primary.main;
      case "INSTITUTION":
        return colors.secondary.main;
      case "PARTNER":
        return colors.accent.blue;
      case "ADMIN":
        return "#ef4444";
      default:
        return colors.text.secondary;
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Enhanced Header */}
      <Box
        sx={{
          background: colors.isDark ? colors.gradients.primary : "#ffffff",
          boxShadow: `0 4px 20px ${colors.border.medium}`,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          overflow: "hidden",
          width: "100vw",
          minWidth: "100vw",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          transition: "all 0.3s ease",
          borderBottom: colors.isDark
            ? "none"
            : `1px solid ${colors.border.light}`,
        }}
      >
        <Box
          sx={{
            maxWidth: "1440px",
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            py: 2,
            px: { xs: 2, md: 4 },
            width: "100%",
          }}
        >
          {/* Enhanced Logo */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
            onClick={() => navigate("/")}
          >
            <img
              src={Logoweb}
              alt="EduHubVN Logo"
              style={{
                height: 60,
                marginRight: 1,
                filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))",
              }}
            />
          </Box>

          {/* User Profile luôn nằm phía bên phải */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Theme Toggle */}
            {/* <ThemeToggle /> */}
            
            {/* Notifications */}
            <IconButton
              onClick={handleNotificationOpen}
              sx={{
                color: colors.isDark ? "white" : colors.primary.main,
                "&:hover": {
                  backgroundColor: colors.isDark 
                    ? "rgba(255,255,255,0.1)" 
                    : "rgba(0, 178, 255, 0.1)",
                },
              }}
            >
              <Badge badgeContent={3} color="error">
                <Notifications />
              </Badge>
            </IconButton>

            {/* User Profile */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                px: 2,
                py: 1,
                backgroundColor: colors.isDark
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0, 178, 255, 0.1)",
                backdropFilter: "blur(20px)",
                border: colors.isDark
                  ? "1px solid rgba(255,255,255,0.2)"
                  : `1px solid ${colors.border.light}`,
                borderRadius: 3,
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: colors.isDark
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(0, 178, 255, 0.15)",
                  transform: "translateY(-1px)",
                },
              }}
              onClick={handleMenuOpen}
            >
              <Avatar
                alt={userProfile?.email || "User"}
                src={userProfile?.avatarUrl}
                sx={{
                  width: 36,
                  height: 36,
                  border: colors.isDark
                    ? "2px solid rgba(255,255,255,0.3)"
                    : `2px solid ${colors.border.light}`,
                }}
              >
                {userProfile?.email?.charAt(0)}
              </Avatar>
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontFamily: "'Inter', sans-serif",
                    color: colors.isDark ? "white" : colors.text.primary,
                    fontWeight: 600,
                    lineHeight: 1,
                  }}
                >
                  {userProfile?.email || "User"}
                </Typography>
                <Chip
                  label={getRoleDisplayName(userProfile?.role)}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: "0.7rem",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 500,
                    backgroundColor: getRoleColor(userProfile?.role),
                    color: "white",
                    mt: 0.5,
                  }}
                />
              </Box>
              <KeyboardArrowDown 
                sx={{ 
                  color: colors.isDark 
                    ? "rgba(255,255,255,0.8)" 
                    : colors.text.secondary 
                }} 
              />
            </Box>
          </Box>

          {/* User Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 280,
                borderRadius: 3,
                boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                border: `1px solid ${colors.border.light}`,
                "& .MuiMenuItem-root": {
                  fontFamily: "'Inter', sans-serif",
                  borderRadius: 2,
                  mx: 1,
                  my: 0.5,
                  "&:hover": {
                    backgroundColor: colors.isDark 
                      ? "rgba(255,255,255,0.1)" 
                      : "rgba(0, 178, 255, 0.1)",
                  },
                },
              },
            }}
          >
            {/* User Info Header */}
            <Box
              sx={{ p: 3, borderBottom: `1px solid ${colors.border.light}` }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  src={userProfile?.avatarUrl}
                  sx={{ width: 50, height: 50 }}
                >
                  {userProfile?.fullName?.charAt(0)}
                </Avatar>
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      color: colors.text.primary,
                    }}
                  >
                    {userProfile?.fullName}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "'Inter', sans-serif",
                      color: colors.text.secondary,
                    }}
                  >
                    {userProfile?.email}
                  </Typography>
                  <Chip
                    label={getRoleDisplayName(userProfile?.role)}
                    size="small"
                    sx={{
                      mt: 1,
                      backgroundColor: colors.isDark 
                        ? "rgba(255,255,255,0.1)" 
                        : "rgba(0, 178, 255, 0.1)",
                      color: colors.primary.main,
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 500,
                    }}
                  />
                </Box>
              </Box>
            </Box>

            <MenuItem onClick={handleProfile}>
              <AccountCircle sx={{ mr: 2, color: colors.primary.main }} />
              <Typography>Hồ sơ cá nhân</Typography>
            </MenuItem>

            <MenuItem onClick={handleMenuClose}>
              <Settings sx={{ mr: 2, color: colors.text.secondary }} />
              <Typography>Cài đặt tài khoản</Typography>
            </MenuItem>

            <MenuItem onClick={handleMenuClose}>
              <Security sx={{ mr: 2, color: colors.text.secondary }} />
              <Typography>Bảo mật</Typography>
            </MenuItem>

            <MenuItem onClick={handleMenuClose}>
              <Language sx={{ mr: 2, color: colors.text.secondary }} />
              <Typography>Ngôn ngữ</Typography>
            </MenuItem>

            <MenuItem onClick={handleMenuClose}>
              <Help sx={{ mr: 2, color: colors.text.secondary }} />
              <Typography>Trợ giúp & Hỗ trợ</Typography>
            </MenuItem>

            <Divider sx={{ my: 1 }} />

            <MenuItem
              onClick={handleLogout}
              sx={{
                color: "#ef4444",
                "&:hover": {
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                },
              }}
            >
              <Logout sx={{ mr: 2 }} />
              <Typography>Đăng xuất</Typography>
            </MenuItem>
          </Menu>

          {/* Notification Menu */}
          <Menu
            anchorEl={notificationAnchor}
            open={Boolean(notificationAnchor)}
            onClose={handleNotificationClose}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 350,
                maxHeight: 400,
                borderRadius: 3,
                boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                border: `1px solid ${colors.border.light}`,
              },
            }}
          >
            <Box
              sx={{ p: 3, borderBottom: `1px solid ${colors.border.light}` }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  color: colors.text.primary,
                }}
              >
                Thông báo
              </Typography>
            </Box>

            {/* Sample notifications */}
            {[1, 2, 3].map((item) => (
              <MenuItem key={item} sx={{ px: 3, py: 2 }}>
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      color: colors.text.primary,
                    }}
                  >
                    Thông báo mẫu {item}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "'Inter', sans-serif",
                      color: colors.text.secondary,
                      mt: 0.5,
                    }}
                  >
                    Đây là nội dung thông báo mẫu...
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: "'Inter', sans-serif",
                      color: colors.text.secondary,
                      mt: 1,
                      display: "block",
                    }}
                  >
                    5 phút trước
                  </Typography>
                </Box>
              </MenuItem>
            ))}

            <Divider />
            <MenuItem sx={{ justifyContent: "center", py: 2 }}>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "'Inter', sans-serif",
                  color: colors.primary.main,
                  fontWeight: 600,
                }}
              >
                Xem tất cả thông báo
              </Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: colors.background.secondary,
          minHeight: "calc(100vh - 160px)",
          pt: "100px", // Add padding-top for fixed header
        }}
      >
        <Outlet />
      </Box>

      {/* Footer */}
      <Footer />
      
      {/* EduHub Speed Dial */}
      <EduHubSpeedDial 
        userRole={userProfile?.role?.toLowerCase() as 'admin' | 'institution' | 'lecturer' | 'partner'}
      />
    </Box>
  );
};

export default HomeLayout;