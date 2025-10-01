import {
  AccountCircle,
  KeyboardArrowDown,
  Logout,
  Menu as MenuIcon,
  Notifications,
  Search,
  Settings,
} from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  alpha,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import Logoweb from "../assets/Eduhub_logo_new.png";
import { useColors } from "../hooks/useColors";

export interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path: string;
  description: string;
}

export interface HeaderProps {
  userProfile?: any;
  profile?: any;
  menuItems: MenuItem[];
  userRole: string;
  userRoleDisplay: string;
  anchorEl: null | HTMLElement;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
  onMenuClose: () => void;
  onLogout: () => void;
  onProfile: () => void;
  onDrawerToggle: () => void;
  isActivePath: (path: string) => boolean;
}

const Header: React.FC<HeaderProps> = ({
  userProfile,
  profile,
  menuItems,
  userRole,
  userRoleDisplay,
  anchorEl,
  onMenuOpen,
  onMenuClose,
  onLogout,
  onProfile,
  onDrawerToggle,
  isActivePath,
}) => {
  const navigate = useNavigate();
  const colors = useColors();

  return (
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
            onClick={onDrawerToggle}
            sx={{
              mr: 2,
              display: { md: "none" },
              bgcolor: alpha("#fff", 0.1),
              "&:hover": {
                bgcolor: colors.isDark
                  ? alpha("#fff", 0.2)
                  : alpha("#000", 0.1),
              },
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo and Brand */}
          <Box sx={{ display: "flex", alignItems: "center", mr: 4 }}>
            <Box>
              <img
                src={Logoweb}
                style={{ width: "auto", height: "60px" }}
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
                    backgroundColor: colors.isDark
                      ? alpha("#fff", 0.15)
                      : alpha("#000", 0.08),
                    transform: "translateY(-1px)",
                    boxShadow: colors.isDark
                      ? `0 4px 12px ${alpha("#000", 0.15)}`
                      : `0 4px 12px ${alpha("#000", 0.1)}`,
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
            <IconButton
              color="inherit"
              sx={{
                bgcolor: alpha("#fff", 0.1),
                "&:hover": {
                  bgcolor: colors.isDark
                    ? alpha("#fff", 0.2)
                    : alpha("#000", 0.1),
                },
              }}
            >
              <Search />
            </IconButton>

            {/* Theme Toggle */}
            {/* <ThemeToggle /> */}

            {/* Notifications */}
            <IconButton
              color="inherit"
              sx={{
                bgcolor: alpha("#fff", 0.1),
                "&:hover": {
                  bgcolor: colors.isDark
                    ? alpha("#fff", 0.2)
                    : alpha("#000", 0.1),
                },
              }}
            >
              <Badge badgeContent={3} color="error" variant="dot">
                <Notifications />
              </Badge>
            </IconButton>

            {/* User Menu */}
            <Button
              onClick={onMenuOpen}
              endIcon={<KeyboardArrowDown />}
              sx={{
                color: "white",
                ml: 1,
                px: 2,
                py: 1,
                borderRadius: 1,
                bgcolor: alpha("#fff", 0.1),
                "&:hover": {
                  bgcolor: colors.isDark
                    ? alpha("#fff", 0.2)
                    : alpha("#000", 0.1),
                },
                textTransform: "none",
              }}
            >
              <Avatar
                alt={
                  profile?.fullName || userProfile?.fullName || userRoleDisplay
                }
                src={
                  profile?.lecturer?.avatarUrl ||
                  profile?.educationInstitution?.logoUrl ||
                  profile?.partnerOrganization?.logoUrl
                }
                sx={{
                  width: 50,
                  height: 50,
                  mr: 1,
                  border: `2px solid ${colors.border.light}`,
                  fontSize: "0.9rem",
                  fontWeight: 600,
                }}
              >
                {profile?.lecturer?.fullName?.charAt(0) ||
                  profile?.fullName?.charAt(0) ||
                  userProfile?.fullName?.charAt(0) ||
                  userRoleDisplay.charAt(0)}
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
                  {profile?.lecturer?.fullName ||
                    profile?.fullName ||
                    userProfile?.fullName ||
                    userRoleDisplay}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ opacity: 0.8, lineHeight: 1 }}
                >
                  {userRoleDisplay}
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
              onClose={onMenuClose}
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
                  {profile?.fullName ||
                    userProfile?.fullName ||
                    userRoleDisplay}
                </Typography>
                <Typography variant="caption">
                  {profile?.email ||
                    userProfile?.email ||
                    `${userRole}@eduhubvn.com`}
                </Typography>
              </Box>

              <MenuItem
                onClick={onProfile}
                sx={{
                  py: 1.5,
                  "&:hover": {
                    bgcolor: colors.isDark
                      ? `${colors.primary.main}20`
                      : colors.primary.light,
                  },
                }}
              >
                <AccountCircle sx={{ mr: 2, color: colors.primary.main }} />
                <Typography>Hồ sơ cá nhân</Typography>
              </MenuItem>

              <MenuItem
                onClick={onMenuClose}
                sx={{
                  py: 1.5,
                  "&:hover": {
                    bgcolor: colors.isDark
                      ? `${colors.primary.main}20`
                      : colors.primary.light,
                  },
                }}
              >
                <Settings sx={{ mr: 2, color: colors.primary.main }} />
                <Typography>Cài đặt tài khoản</Typography>
              </MenuItem>

              <Divider sx={{ my: 1 }} />

              <MenuItem
                onClick={onLogout}
                sx={{
                  py: 1.5,
                  color: colors.error[600],
                  "&:hover": {
                    bgcolor: colors.isDark
                      ? alpha(colors.error[500], 0.2)
                      : colors.error[50],
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
  );
};

export default Header;
