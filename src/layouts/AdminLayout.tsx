import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { API } from "../utils/Fetch";
import { setUserProfile } from "../redux/slice/userSlice";
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
  Badge,
  Chip,
  Card,
  CardContent,
  alpha,
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
  KeyboardArrowDown,
  AdminPanelSettings,
} from "@mui/icons-material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import LogoWeb from "../assets/Eduhub_logo_new.png";
import { useColors } from "../hooks/useColors";
import WebSocketService from "../services/WebSocketService";
import { AdminMessageHandler } from "../services/AdminMessageHandler";
import ThemeToggle from "../components/ThemeToggle";
import Footer from "../components/Footer";

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const colors = useColors();
  const userProfile = useSelector((state: any) => state.userProfile);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = userProfile && (userProfile.role === "ADMIN");
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
      } catch (error) {
        console.error("AdminLayout: Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [dispatch, navigate, location.pathname]);

  // WebSocket connection effect
  useEffect(() => {
    if (userProfile && userProfile.role === "ADMIN") {
      // Chỉ connect nếu chưa connected hoặc user khác
      if (
        !WebSocketService.isConnected() ||
        WebSocketService.getCurrentUser()?.id !== userProfile.id
      ) {
        WebSocketService.connect(
          userProfile,
          () => console.log("✅ Admin WebSocket connected"),
          (message) => {
            AdminMessageHandler.handleIncomingMessage(message, dispatch);
          },
        );
      }
    }
  }, [userProfile, dispatch]);

  useEffect(() => {
    return () => {
      console.log("🔄 AdminLayout cleanup triggered");
      WebSocketService.disconnect();
    };
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Disconnect WebSocket trước khi logout
    WebSocketService.disconnect();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
    handleMenuClose();
  };

  const handleProfile = () => {
    // navigate("/admin/profile");
    handleMenuClose();
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = useMemo(() => {
    const getAllMenuItems = () => [
      {
        text: "Trang chủ",
        icon: <Dashboard />,
        path: "/admin",
        description: "Tổng quan hệ thống",
        permissions: null, // Always visible
      },
      {
        text: "Giảng viên",
        icon: <Person />,
        path: "/admin/lecturers",
        description: "Quản lý giảng viên",
        permissions: ["LECTURER_READ", "LECTURER_APPROVE"],
      },
      {
        text: "Trung tâm đào tạo",
        icon: <School />,
        path: "/admin/institutions",
        description: "Quản lý trung tâm",
        permissions: ["SCHOOL_READ", "SCHOOL_APPROVE"],
      },
      {
        text: "Đơn vị tổ chức",
        icon: <Business />,
        path: "/admin/partners",
        description: "Quản lý đối tác",
        permissions: ["ORGANIZATION_READ", "ORGANIZATION_APPROVE"],
      },
      {
        text: "Khóa học",
        icon: <AccountBalanceWalletIcon />,
        path: "/admin/courses",
        description: "Quản lý khóa học",
        permissions: ["COURSE_READ"],
      },
    ];

    return getAllMenuItems().filter(item => {
      // ADMIN có thể xem tất cả
      if (userProfile?.role === "ADMIN") {
        return true;
      }
      
      // SUB_ADMIN kiểm tra quyền
      if (userProfile?.role === "SUB_ADMIN") {
        if (!item.permissions) {
          return true; // Trang chủ luôn hiển thị
        }
        // Kiểm tra xem user có ít nhất một trong các quyền cần thiết không
        return item.permissions.some(permission => 
          userProfile.permissions?.includes(permission)
        ) || false;
      }
      
      return false; // Các role khác không được xem
    });
  }, [userProfile]);

  const drawer = (
    <Box sx={{ height: "100%", background: colors.isDark ? colors.background.primary : colors.background.secondary }}>
      {/* Logo Section */}
      <Box
        sx={{
          p: 3,
          background: colors.isDark 
            ? colors.gradients.primary 
            : `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.dark} 100%)`,
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
            src={LogoWeb}
            style={{ width: "32px", height: "32px", marginRight: "12px" }}
            alt="EduHubVN"
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: "1.1rem",
              letterSpacing: "0.5px",
            }}
          >
            EduHubVN
          </Typography>
        </Box>
        <Chip
          label="Admin Panel"
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
                  ? colors.background.tertiary
                  : "transparent",
                border: isActivePath(item.path)
                  ? `1px solid ${colors.border.medium}`
                  : "1px solid transparent",
                "&:hover": {
                  backgroundColor: isActivePath(item.path)
                    ? colors.background.tertiary
                    : colors.isDark ? colors.background.primary : colors.background.secondary,
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
                    : colors.text.secondary,
                  "& .MuiSvgIcon-root": {
                    fontSize: "1.3rem",
                  },
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
                      ? colors.primary.dark
                      : colors.text.primary,
                    fontWeight: isActivePath(item.path) ? 600 : 500,
                    fontSize: "0.95rem",
                  },
                  "& .MuiListItemText-secondary": {
                    color: colors.text.secondary,
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
            background: `linear-gradient(135deg, ${colors.accent.blue} 0%, ${colors.accent.light} 100%)`,
            color: "white",
            textAlign: "center",
            py: 2,
          }}
        >
          <CardContent sx={{ py: "16px !important" }}>
            <AdminPanelSettings sx={{ fontSize: 28, mb: 1 }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Quản trị viên
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              Toàn quyền hệ thống
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
        position="fixed"
        elevation={0}
        sx={{
          background: colors.isDark 
            ? colors.gradients.primary 
            : `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.dark} 100%)`,
          borderBottom: `1px solid ${colors.border.light}`,
          backdropFilter: "blur(10px)",
          zIndex: (theme) => theme.zIndex.drawer + 1,
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
                "&:hover": {
                  bgcolor: alpha("#fff", 0.2),
                },
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
                 
                 
                  mr: 2,
                }}
              >
                <img
                  src={LogoWeb}
                  style={{ width: "auto", height: "80px" }}
                  alt="EduHubVN"
                />
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
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  startIcon={item.icon}
                  sx={{
                    color: "white",
                    px: 2,
                    py: 1,
                    borderRadius: 1,
                    backgroundColor: isActivePath(item.path)
                      ? alpha("#fff", 0.2)
                      : "transparent",
                    border: isActivePath(item.path)
                      ? `1px solid ${alpha("#fff", 0.3)}`
                      : "1px solid transparent",
                    "&:hover": {
                      backgroundColor: alpha("#fff", 0.15),
                      transform: "translateY(-1px)",
                      boxShadow: `0 4px 12px ${alpha("#000", 0.15)}`,
                    },
                    transition: "all 0.2s ease-in-out",
                    textTransform: "none",
                    fontWeight: isActivePath(item.path) ? 600 : 500,
                    fontSize: "0.9rem",
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>

            {/* Right side actions */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {/* Search Button */}
              {/* <IconButton 
                color="inherit"
                sx={{
                  bgcolor: alpha("#fff", 0.1),
                  "&:hover": {
                    bgcolor: alpha("#fff", 0.2),
                  }
                }}
              >
                <Search />
              </IconButton> */}

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Notifications */}
              <IconButton
                color="inherit"
                sx={{
                  bgcolor: alpha("#fff", 0.1),
                  "&:hover": {
                    bgcolor: alpha("#fff", 0.2),
                  },
                }}
              >
                <Badge badgeContent={3} color="error" variant="dot">
                  <Notifications />
                </Badge>
              </IconButton>

              {/* User Menu */}
              <Button
                onClick={handleMenuOpen}
                endIcon={<KeyboardArrowDown />}
                sx={{
                  color: "white",
                  ml: 1,
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                  bgcolor: alpha("#fff", 0.1),
                  "&:hover": {
                    bgcolor: alpha("#fff", 0.2),
                  },
                  textTransform: "none",
                }}
              >
                <Avatar
                  alt={userProfile?.fullName || "Admin"}
                  src="/static/images/avatar/admin.jpg"
                  sx={{
                    width: 32,
                    height: 32,
                    mr: 1,
                    bgcolor: colors.secondary.main,
                    fontSize: "0.9rem",
                    fontWeight: 600,
                  }}
                >
                  {userProfile?.fullName?.charAt(0) || "A"}
                </Avatar>
                <Box
                  sx={{
                    textAlign: "left",
                    display: { xs: "none", sm: "block" },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, lineHeight: 1.2 }}
                  >
                    {userProfile.role === "ADMIN" ? "Administrator" : "Mod"}
           
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ opacity: 0.8, lineHeight: 1 }}
                  >
                    Quản trị viên
                  </Typography>
                </Box>
              </Button>

              {/* Enhanced User Menu */}
              <Menu
                sx={{
                  mt: "45px",
                  "& .MuiPaper-root": {
                    borderRadius: 1,
                    minWidth: 200,
                    boxShadow: `0 8px 24px ${alpha("#000", 0.12)}`,
                    border: `1px solid ${colors.border.light}`,
                  },
                }}
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
                <Box
                  sx={{
                    px: 2,
                    py: 1.5,
                    borderBottom: `1px solid ${colors.border.light}`,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, color: colors.text.primary }}
                  >
                    {userProfile?.role === "ADMIN" ? "Administrator" : "Mod"}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: colors.text.tertiary }}
                  >
                    {userProfile?.email || "admin@eduhubvn.com"}
                  </Typography>
                </Box>

                <MenuItem
                  onClick={handleProfile}
                  sx={{
                    py: 1.5,
                    "&:hover": {
                      bgcolor: colors.background.tertiary,
                    },
                  }}
                >
                  <AccountCircle sx={{ mr: 2, color: colors.primary.main }} />
                  <Typography>Hồ sơ cá nhân</Typography>
                </MenuItem>
                {isAdmin && (
                  <MenuItem
                    onClick={() => {
                     
                      navigate("/admin/sub-admin");
                      handleMenuClose();
                    }}
                    sx={{
                      py: 1.5,
                      "&:hover": {
                        bgcolor: colors.background.tertiary,
                      },
                    }}
                  >
                    <Settings sx={{ mr: 2, color: colors.primary.main }} />
                    <Typography>Quản lí tài khoản</Typography>
                  </MenuItem>
                )}

                <Divider sx={{ my: 1 }} />

                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    py: 1.5,
                    color: colors.error[600],
                    "&:hover": {
                      bgcolor: colors.error[50],
                    },
                  }}
                >
                  <Logout sx={{ mr: 2 }} />
                  <Typography>Đăng xuất</Typography>
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
        ModalProps={{
          keepMounted: true,
        }}
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
          background: colors.isDark 
            ? colors.gradients.secondary 
            : `linear-gradient(180deg, ${colors.background.tertiary} 0%, ${colors.background.secondary} 100%)`,
          minHeight: "calc(100vh - 140px)",
          position: "relative",
          paddingTop: "70px", // Add padding to account for fixed header
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "200px",
            background: `radial-gradient(circle at 20% 20%, ${alpha(colors.primary.light, 0.3)} 0%, transparent 50%),
                        radial-gradient(circle at 80% 80%, ${alpha(colors.secondary.light, 0.3)} 0%, transparent 50%)`,
            zIndex: 0,
          }}
        />

        <Container
          maxWidth="xl"
          sx={{ py: 4, position: "relative", zIndex: 1 }}
        >
          <Outlet />
        </Container>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default AdminLayout;
