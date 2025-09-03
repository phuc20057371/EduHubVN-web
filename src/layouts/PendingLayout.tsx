import {
  AccountCircle,
  Email,
  Facebook,
  Help,
  KeyboardArrowDown,
  LinkedIn,
  LocationOn,
  Logout,
  Notifications,
  Phone,
  Settings,
  Support,
  Twitter,
} from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Box,
  Chip,
  Container,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Toolbar,
  Typography,
  alpha,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Logoweb from "../assets/eduhub-02.png";
import { setUserProfile } from "../redux/slice/userSlice";
import { UserMessageHandler } from "../services/UserMessageHandler";
import WebSocketService from "../services/WebSocketService";
import { colors } from "../theme/colors";
import { getStatus, getStatusColor } from "../utils/ChangeText";
import { API } from "../utils/Fetch";
import { navigateToRole } from "../utils/navigationRole";

const PendingLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userProfile = useSelector((state: any) => state.userProfile);
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
  useEffect(() => {
    if (userProfile && userProfile.role === "USER") {
      WebSocketService.connect(
        userProfile,
        () => console.log("✅ User WebSocket connected"),
        (message) => {
          UserMessageHandler.handleIncomingMessage(message, dispatch);
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
      {/* Header - HomeLayout Style */}
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
            px: 3,
            justifyContent: "space-between",
            width: "80%",
          }}
        >
          {/* Logo Section - HomeLayout Style */}
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

          {/* Right Section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Status Badge with Enhanced Styling */}
            {/* <Paper
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                px: 3,
                py: 1.5,
                backgroundColor: "rgba(255, 152, 0, 0.2)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 193, 7, 0.3)",
                borderRadius: 3,
                animation: "pulse 2s infinite",
                "@keyframes pulse": {
                  "0%, 100%": { opacity: 1 },
                  "50%": { opacity: 0.8 },
                },
              }}
            >
              <HourglassEmpty
                sx={{
                  color: "#fff3cd",
                  fontSize: 20,
                  animation: "rotate 2s linear infinite",
                  "@keyframes rotate": {
                    "0%": { transform: "rotate(0deg)" },
                    "100%": { transform: "rotate(180deg)" },
                  },
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  color: "white",
                }}
              >
                Đang chờ phê duyệt
              </Typography>
            </Paper> */}

            {/* Notifications */}
            <IconButton
              sx={{
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              <Notifications />
            </IconButton>

            {/* User Profile - HomeLayout Style */}
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
                alt={userProfile?.lecturer?.fullName || "User"}
                src={userProfile?.avatarUrl}
                sx={{
                  width: 36,
                  height: 36,
                  border: "2px solid rgba(255,255,255,0.3)",
                }}
              >
                {userProfile?.lecturer?.fullName?.charAt(0)}
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
                  {userProfile?.lecturer?.fullName || "User"}
                </Typography>
                <Chip
                  label={getStatus(
                    userProfile?.lecturer?.status ||
                      userProfile?.educationInstitution?.status ||
                      userProfile?.partnerOrganization?.status ||
                      "Chờ duyệt",
                  )}
                  size="small"
                  color={getStatusColor(
                    userProfile?.lecturer?.status ||
                      userProfile?.educationInstitution?.status ||
                      userProfile?.partnerOrganization?.status ||
                      "Chờ duyệt",
                  )}
                  sx={{
                    height: 18,
                    fontSize: "0.7rem",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 500,
                    mt: 0.5,
                  }}
                />
              </Box>
              <KeyboardArrowDown sx={{ color: "rgba(255,255,255,0.8)" }} />
            </Paper>
          </Box>

          {/* Enhanced User Menu */}
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
                  {userProfile?.lecturer?.fullName?.charAt(0)}
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
                    {userProfile?.lecturer?.fullName}
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
              <Help sx={{ mr: 2, color: colors.neutral[600] }} />
              <Typography>Hướng dẫn đăng ký</Typography>
            </MenuItem>

            <MenuItem onClick={handleMenuClose}>
              <Support sx={{ mr: 2, color: colors.neutral[600] }} />
              <Typography>Hỗ trợ kỹ thuật</Typography>
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
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          background: `
            linear-gradient(135deg, ${colors.background.secondary} 0%, ${alpha(
              colors.warning[50],
              0.3,
            )} 100%),
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${colors.warning[50].slice(
              1,
            )}' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
          `,
          py: 4,
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 50%, ${alpha(colors.warning[50], 0.1)} 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, ${alpha(colors.primary[100], 0.1)} 0%, transparent 50%)
            `,
            zIndex: -1,
          },
        }}
      >
        <Container maxWidth="xl">
          <Outlet />
        </Container>
      </Box>

      {/* Footer - GuestLayout Style */}
      <Box
        component="footer"
        sx={{
          background: "linear-gradient(135deg, #134e4a 0%, #0f3b36 100%)",
          color: "white",
          pt: 6,
          pb: 3,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            {/* Logo và mô tả */}
            <Box
              sx={{ flex: { xs: "1 1 100%", md: "1 1 300px" }, minWidth: 220 }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <img
                  src={Logoweb}
                  alt="EduHubVN Logo"
                  style={{ height: 32, marginRight: 12 }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: "#14b8a6",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  EduHubVN
                </Typography>
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  mb: 2,
                  color: colors.warning[300],
                }}
              >
                Tài khoản đang chờ phê duyệt
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#a0aec0",
                  lineHeight: 1.6,
                  mb: 3,
                  fontSize: { xs: "0.85rem", md: "1rem" },
                }}
              >
                Hồ sơ của bạn đang được xem xét bởi đội ngũ quản trị viên. Chúng
                tôi sẽ thông báo kết quả trong thời gian sớm nhất.
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                {[Facebook, Twitter, LinkedIn, Email].map((Icon, index) => (
                  <IconButton
                    key={index}
                    sx={{
                      color: "#14b8a6",
                      bgcolor: "rgba(20, 184, 166, 0.1)",
                      "&:hover": {
                        bgcolor: "#14b8a6",
                        color: "white",
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    <Icon />
                  </IconButton>
                ))}
              </Box>
            </Box>

            {/* Hỗ trợ */}
            <Box
              sx={{ flex: { xs: "1 1 100%", sm: "1 1 150px" }, minWidth: 150 }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: "#14b8a6",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Hỗ trợ
              </Typography>
              {[
                "Hướng dẫn đăng ký",
                "Câu hỏi thường gặp",
                "Hỗ trợ kỹ thuật",
                "Chính sách bảo mật",
                "Điều khoản sử dụng",
              ].map((item) => (
                <Link
                  key={item}
                  to="#"
                  style={{
                    display: "block",
                    color: "#a0aec0",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    transition: "color 0.3s ease",
                  }}
                >
                  {item}
                </Link>
              ))}
            </Box>

            {/* Dịch vụ */}
            <Box
              sx={{ flex: { xs: "1 1 100%", sm: "1 1 200px" }, minWidth: 180 }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: "#14b8a6",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Dịch vụ
              </Typography>
              {[
                "Đào tạo trực tuyến",
                "Chứng chỉ nghề nghiệp",
                "Tư vấn học tập",
                "Hỗ trợ kỹ thuật",
              ].map((item) => (
                <Link
                  key={item}
                  to="#"
                  style={{
                    display: "block",
                    color: "#a0aec0",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    transition: "color 0.3s ease",
                  }}
                >
                  {item}
                </Link>
              ))}
            </Box>

            {/* Thông tin liên hệ */}
            <Box
              sx={{ flex: { xs: "1 1 100%", md: "1 1 250px" }, minWidth: 200 }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: "#14b8a6",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Liên hệ
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  color: "#a0aec0",
                  fontSize: { xs: "0.9rem", md: "1rem" },
                }}
              >
                <LocationOn sx={{ mr: 2, color: "#14b8a6" }} />
                <Typography variant="body2">
                  123 Đường ABC, Quận 1, TP.HCM
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  color: "#a0aec0",
                  fontSize: { xs: "0.9rem", md: "1rem" },
                }}
              >
                <Phone sx={{ mr: 2, color: "#14b8a6" }} />
                <Typography variant="body2">(+84) 123 456 789</Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  color: "#a0aec0",
                  fontSize: { xs: "0.9rem", md: "1rem" },
                }}
              >
                <Email sx={{ mr: 2, color: "#14b8a6" }} />
                <Typography variant="body2">support@eduhubvn.com</Typography>
              </Box>
            </Box>
          </Box>

          {/* Copyright */}
          <Box
            sx={{
              borderTop: "1px solid rgba(255,255,255,0.1)",
              mt: 4,
              pt: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: "#a0aec0", fontSize: { xs: "0.85rem", md: "1rem" } }}
            >
              © {new Date().getFullYear()} EduHubVN. All rights reserved.
            </Typography>
            <Box sx={{ display: "flex", gap: 3 }}>
              {[
                "Chính sách bảo mật",
                "Điều khoản sử dụng",
                "Cookie Policy",
              ].map((item) => (
                <Link
                  key={item}
                  to="#"
                  style={{
                    color: "#a0aec0",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    transition: "color 0.3s ease",
                  }}
                >
                  {item}
                </Link>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default PendingLayout;
