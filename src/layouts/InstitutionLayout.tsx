import {
  Dashboard,
  Person,
  School
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Logoweb from "../assets/Eduhub_logo_new.png";
import { Header } from "../components";
import EduHubSpeedDial from "../components/EduHubSpeedDial";
import Footer from "../components/Footer";
import { useColors } from "../hooks/useColors";
import { setUserProfile } from "../redux/slice/userSlice";
import { InstitutionMessageHandler } from "../services/InstitutionMessageHandler";
import WebSocketService from "../services/WebSocketService";
import { API } from "../utils/Fetch";
import { navigateToRole } from "../utils/navigationRole";

const InstitutionLayout = () => {
  const colors = useColors();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userProfile = useSelector((state: any) => state.userProfile);
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

  // Enhanced menu items with new icons and descriptions
  const menuItems = [
    {
      text: "Trang chủ",
      icon: <Dashboard />,
      path: "/institution",
      description: "Tổng quan và thống kê",
    },

    // {
    //   text: "Khóa học",
    //   icon: <MenuBook />,
    //   path: "/institution/courses",
    //   description: "Quản lý khóa học",
    // },
    // {
    //   text: "Hợp đồng",
    //   icon: <Assignment />,
    //   path: "/institution/contracts",
    //   description: "Quản lý hợp đồng",
    // },
    {
      text: "Hồ sơ",
      icon: <Person />,
      path: "/institution/profile",
      description: "Thông tin tổ chức",
    },
  ];

  const drawer = (
    <Box
      sx={{
        height: "100%",
        background: colors.background.primary,
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          p: 3,
          background: colors.gradients.primary,

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
                borderRadius: 1,
                minHeight: 56,
                backgroundColor: isActivePath(item.path)
                  ? colors.isDark
                    ? colors.primary.dark
                    : colors.primary.light
                  : "transparent",
                border: isActivePath(item.path)
                  ? `1px solid ${colors.primary.main}`
                  : "1px solid transparent",
                "&:hover": {
                  backgroundColor: isActivePath(item.path)
                    ? colors.isDark
                      ? colors.primary.main
                      : colors.primary.light
                    : colors.isDark
                      ? `${colors.primary.main}20`
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
                    ? colors.primary.main
                    : colors.isDark
                      ? colors.text.primary
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
                      ? colors.primary.main
                      : colors.isDark
                        ? colors.text.primary
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
                    bgcolor: colors.primary.main,
                    borderRadius: 1,
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
            background: colors.gradients.primary,
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
      {/* Header Component */}
      <Header
        userProfile={userProfile}
        profile={userProfile}
        menuItems={menuItems}
        userRole="institution"
        userRoleDisplay={
          userProfile?.type === "UNIVERSITY" ? "Trường" : "Trung tâm"
        }
        anchorEl={anchorEl}
        onMenuOpen={handleMenuOpen}
        onMenuClose={handleMenuClose}
        onLogout={handleLogout}
        onProfile={handleProfile}
        onDrawerToggle={handleDrawerToggle}
        isActivePath={isActivePath}
      />

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
          background: colors.background.primary,
          position: "relative",
          overflow: "auto",
          minHeight: 0,
          pt: "70px", // Add padding-top for fixed header
        }}
      >
        <Container
          maxWidth="xl"
          sx={{ py: 4, position: "relative", height: "100%", overflow: "auto" }}
        >
          <Outlet />
        </Container>
      </Box>

      {/* Footer */}
      <Footer />

      {/* EduHub Speed Dial for Institution */}
      <EduHubSpeedDial userRole="institution" />
    </Box>
  );
};

export default InstitutionLayout;
