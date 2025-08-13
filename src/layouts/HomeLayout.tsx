import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { setUserProfile } from "../redux/slice/userSlice";
import { API } from "../utils/Fetch";
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
  Badge,
  Chip,
  Paper,
} from "@mui/material";
import {
  AccountCircle,
  Settings,
  Logout,
  Notifications,
  KeyboardArrowDown,
  Help,
  Security,
  Language,
} from "@mui/icons-material";
import { colors } from "../theme/colors";
import Logoweb from "../assets/eduhub-02.png";

const HomeLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userProfile = useSelector((state: any) => state.userProfile);
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
        return colors.primary[500];
      case "INSTITUTION":
        return colors.secondary[500];
      case "PARTNER":
        return colors.accent.lightBlue;
      case "ADMIN":
        return colors.error[500];
      default:
        return colors.neutral[500];
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Enhanced Header */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: colors.background.gradient.primary,
          borderBottom: `1px solid ${colors.border.light}`,
          backdropFilter: "blur(20px)",
          alignItems: "center",
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            alignItems: "center",
            minHeight: { xs: 64, md: 80 },
            py: 1,
            px: 3, // Add padding instead of Container
            justifyContent: "space-between",
            width: "80%", // Full width
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
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${colors.accent.blue}, ${colors.accent.indigo})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 2,
                boxShadow: "0 8px 25px rgba(6, 182, 212, 0.3)",
              }}
            >
              <img
                src={Logoweb}
                alt="EduHubVN Logo"
                style={{
                  height: 28,
                  filter: "brightness(0) invert(1)",
                }}
              />
            </Box>
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 800,
                  color: "white",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                EduHubVN
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontFamily: "'Inter', sans-serif",
                  color: "rgba(255,255,255,0.8)",
                  fontSize: "0.7rem",
                  fontWeight: 500,
                  letterSpacing: "1px",
                }}
              >
                EDUCATION PLATFORM
              </Typography>
            </Box>
          </Box>

          {/* User Profile luôn nằm phía bên phải */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Notifications */}
            <IconButton
              onClick={handleNotificationOpen}
              sx={{
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              <Badge badgeContent={3} color="error">
                <Notifications />
              </Badge>
            </IconButton>

            {/* User Profile */}
            <Paper
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                px: 2,
                py: 1,
                backgroundColor: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 3,
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.15)",
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
                  border: "2px solid rgba(255,255,255,0.3)",
                }}
              >
                {userProfile?.email?.charAt(0)}
              </Avatar>
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontFamily: "'Inter', sans-serif",
                    color: "white",
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
              <KeyboardArrowDown sx={{ color: "rgba(255,255,255,0.8)" }} />
            </Paper>
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
                    backgroundColor: colors.primary[50],
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
                      color: colors.text.tertiary,
                    }}
                  >
                    {userProfile?.email}
                  </Typography>
                  <Chip
                    label={getRoleDisplayName(userProfile?.role)}
                    size="small"
                    sx={{
                      mt: 1,
                      backgroundColor: colors.primary[50],
                      color: colors.primary[700],
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 500,
                    }}
                  />
                </Box>
              </Box>
            </Box>

            <MenuItem onClick={handleProfile}>
              <AccountCircle sx={{ mr: 2, color: colors.primary[600] }} />
              <Typography>Hồ sơ cá nhân</Typography>
            </MenuItem>

            <MenuItem onClick={handleMenuClose}>
              <Settings sx={{ mr: 2, color: colors.neutral[600] }} />
              <Typography>Cài đặt tài khoản</Typography>
            </MenuItem>

            <MenuItem onClick={handleMenuClose}>
              <Security sx={{ mr: 2, color: colors.neutral[600] }} />
              <Typography>Bảo mật</Typography>
            </MenuItem>

            <MenuItem onClick={handleMenuClose}>
              <Language sx={{ mr: 2, color: colors.neutral[600] }} />
              <Typography>Ngôn ngữ</Typography>
            </MenuItem>

            <MenuItem onClick={handleMenuClose}>
              <Help sx={{ mr: 2, color: colors.neutral[600] }} />
              <Typography>Trợ giúp & Hỗ trợ</Typography>
            </MenuItem>

            <Divider sx={{ my: 1 }} />

            <MenuItem
              onClick={handleLogout}
              sx={{
                color: colors.error[600],
                "&:hover": {
                  backgroundColor: colors.error[50],
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
                      color: colors.text.tertiary,
                      mt: 0.5,
                    }}
                  >
                    Đây là nội dung thông báo mẫu...
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: "'Inter', sans-serif",
                      color: colors.text.tertiary,
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
                  color: colors.primary[600],
                  fontWeight: 600,
                }}
              >
                Xem tất cả thông báo
              </Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: colors.background.secondary,
          minHeight: "calc(100vh - 160px)",
        }}
      >
        <Outlet />
      </Box>

      {/* Enhanced Footer */}
      <Box
        component="footer"
        sx={{
          background: colors.background.gradient.dark,
          color: "white",
          pt: 6,
          pb: 4,
          mt: "auto",
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "center", md: "flex-start" },
              gap: { xs: 4, md: 6 },
            }}
          >
            {/* Logo and Description */}
            <Box
              sx={{
                textAlign: { xs: "center", md: "left" },
                flex: 1,
                order: { xs: 1, md: 1 },
              }}
            >
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
                  alt="EduHubVN Logo"
                  style={{ height: 32, marginRight: 12 }}
                />
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    color: colors.accent.blue,
                  }}
                >
                  EduHubVN
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "'Inter', sans-serif",
                  opacity: 0.9,
                  lineHeight: 1.6,
                  maxWidth: 400,
                  mx: { xs: "auto", md: 0 },
                }}
              >
                Nền tảng giáo dục trực tuyến hàng đầu Việt Nam, kết nối giảng
                viên và học viên với cơ hội học tập và phát triển nghề nghiệp.
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "'Inter', sans-serif",
                  opacity: 0.7,
                  mt: 2,
                }}
              >
                © {new Date().getFullYear()} EduHub Vietnam. Tất cả quyền được
                bảo lưu.
              </Typography>
            </Box>

            {/* Quick Links */}
            <Box sx={{ flex: 1, order: { xs: 2, md: 2 } }}>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  mb: 2,
                  color: colors.accent.blue,
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                Liên kết nhanh
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "row", md: "column" },
                  flexWrap: { xs: "wrap", md: "nowrap" },
                  gap: { xs: 2, md: 1 },
                  justifyContent: { xs: "center", md: "flex-start" },
                }}
              >
                {[
                  "Điều khoản sử dụng",
                  "Chính sách bảo mật",
                  "Hỗ trợ khách hàng",
                  "Câu hỏi thường gặp",
                ].map((link) => (
                  <Button
                    key={link}
                    sx={{
                      fontFamily: "'Inter', sans-serif",
                      color: "rgba(255,255,255,0.8)",
                      textTransform: "none",
                      fontWeight: 400,
                      p: 0,
                      minWidth: "auto",
                      justifyContent: { xs: "center", md: "flex-start" },
                      "&:hover": {
                        color: colors.accent.blue,
                        backgroundColor: "transparent",
                      },
                    }}
                  >
                    {link}
                  </Button>
                ))}
              </Box>
            </Box>

            {/* Contact Info & User Account */}
            <Box sx={{ flex: 1, order: { xs: 3, md: 3 }, width: "100%" }}>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  mb: 2,
                  color: colors.accent.blue,
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                Liên hệ
              </Typography>
              <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "'Inter', sans-serif",
                    opacity: 0.8,
                    mb: 1,
                  }}
                >
                  📧 support@eduhubvn.com
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "'Inter', sans-serif",
                    opacity: 0.8,
                    mb: 1,
                  }}
                >
                  📞 (+84) 123 456 789
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "'Inter', sans-serif",
                    opacity: 0.8,
                  }}
                >
                  📍 123 Đường ABC, Quận 1, TP.HCM
                </Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomeLayout;
