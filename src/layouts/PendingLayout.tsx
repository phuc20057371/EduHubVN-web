import {
  Help,
  KeyboardArrowDown,
  Logout,
  Notifications,

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
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Logoweb from "../assets/Eduhub_logo_new.png";
import { setUserProfile } from "../redux/slice/userSlice";
import { UserMessageHandler } from "../services/UserMessageHandler";
import WebSocketService from "../services/WebSocketService";
import { useColors } from "../hooks/useColors";
import { getStatus, getStatusColor } from "../utils/ChangeText";
import { API } from "../utils/Fetch";
import { navigateToRole } from "../utils/navigationRole";
import EduHubSpeedDial from "../components/EduHubSpeedDial";
import ThemeToggle from "../components/ThemeToggle";
import Footer from "../components/Footer";

const PendingLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const colors = useColors();
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

  // const handleProfile = () => {
  //   navigate("/profile");
  //   handleMenuClose();
  // };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header - HomeLayout Style */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: colors.isDark ? colors.gradients.primary : "#ffffff",
          borderBottom: `1px solid ${colors.border.light}`,
          backdropFilter: "blur(20px)",
          alignItems: "center",
          zIndex: (theme) => theme.zIndex.drawer + 1,
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
            <Box>
              <img
                src={Logoweb}
                alt="EduHubVN Logo"
                style={{
                  height: 60,
                  filter: colors.isDark ? "brightness(0) invert(1)" : "none",
                }}
              />
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
                  backgroundColor: colors.isDark
                    ? alpha(colors.primary.light, 0.2)
                    : "rgba(255,255,255,0.1)",
                },
              }}
            >
              <Notifications />
            </IconButton>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Profile - HomeLayout Style */}
            <Paper
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                px: 2,
                py: 1,

                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 1,
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: colors.isDark
                    ? alpha(colors.primary.light, 0.2)
                    : "rgba(255,255,255,0.15)",
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
                    fontWeight: 600,
                    lineHeight: 1,
                  }}
                >
                  {userProfile?.email || "User"}
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
                minWidth: 250,
                borderRadius: 1,
                boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                border: `1px solid ${colors.border.light}`,
                "& .MuiMenuItem-root": {
                  fontFamily: "'Inter', sans-serif",
                  borderRadius: 2,
                  mx: 1,
                  my: 0.5,
                  "&:hover": {
                    backgroundColor: colors.isDark
                      ? alpha(colors.primary.light, 0.2)
                      : colors.primary.light,
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

            <MenuItem onClick={handleMenuClose}>
              <Help sx={{ mr: 2, color: colors.neutral[600] }} />
              <Typography>Hướng dẫn đăng ký</Typography>
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
          background: colors.isDark
            ? colors.gradients.secondary
            : `linear-gradient(135deg, ${colors.background.secondary} 0%, ${alpha(
                colors.warning[50],
                0.3,
              )} 100%)`,
          py: 4,
          pt: "100px", // Add padding-top for fixed header (larger because it's bigger)
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: colors.isDark
              ? "none"
              : `
                radial-gradient(circle at 20% 50%, ${alpha(colors.warning[50], 0.1)} 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, ${alpha(colors.primary.light, 0.1)} 0%, transparent 50%)
              `,
            zIndex: -1,
          },
        }}
      >
        <Container maxWidth="xl">
          <Outlet />
        </Container>
      </Box>

      {/* Footer */}
      <Footer />

      {/* EduHub Speed Dial for Pending Users */}
      <EduHubSpeedDial userRole="partner" />
    </Box>
  );
};

export default PendingLayout;
