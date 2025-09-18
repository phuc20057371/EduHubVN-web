import { Outlet, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Logo from "../assets/Eduhub_logo_new.png";
import EduHubSpeedDial from "../components/EduHubSpeedDial";
import ThemeToggle from "../components/ThemeToggle";
import Footer from "../components/Footer";
import { useColors } from "../hooks/useColors";

const GuestLayout = () => {
  const navigate = useNavigate();
  const colors = useColors();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
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
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 2, md: 0 },
          }}
        >
          {/* Logo bên trái */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
              },
              mb: { xs: 2, md: 0 },
            }}
            onClick={() => navigate("/")}
          >
            <img
              src={Logo}
              alt="EduHubVN Logo"
              style={{
                height: 60,
                marginRight: 1,
                filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))",
              }}
            />
          </Box>

          {/* Nút bên phải */}
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "stretch", sm: "center" },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            {/* Theme Toggle */}
            <ThemeToggle />

            <Button
              variant="contained"
              onClick={() => navigate("/register")}
              sx={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.9rem", // Fixed font size
                bgcolor: colors.primary.main,
                color: colors.isDark ? "black" : "white",
                fontWeight: 600,
                px: 3,
                py: 1,
                boxShadow: "0 6px 20px rgba(0, 178, 255, 0.4)",
                transition: "all 0.3s ease",
                width: { xs: "100%", sm: "150px" }, // Fixed width for consistency
                minWidth: "100px",
                height: "44px", // Fixed height
                textTransform: "none",
                "&:hover": {
                  background: colors.isDark
                    ? `linear-gradient(45deg, ${colors.primary.dark} 30%, ${colors.primary.main} 90%)`
                    : colors.primary.dark,
                  transform: "translateY(-2px)",
                  boxShadow: `0 8px 25px rgba(0, 178, 255, 0.5)`,
                },
              }}
            >
              Đăng ký
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate("/login")}
              sx={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.9rem", // Fixed font size
                bgcolor: colors.secondary.main,
                color: colors.isDark ? "black" : "white",
                fontWeight: 700,
                px: 3,
                py: 1,
                transition: "all 0.3s ease",
                width: { xs: "100%", sm: "150px" }, // Fixed width for consistency
                minWidth: "120px",
                height: "44px", // Fixed height
                textTransform: "none",
                "&:hover": {
                  borderColor: colors.primary.main,
                  backgroundColor: `rgba(0, 178, 255, 0.1)`,
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
                },
              }}
            >
              Đăng nhập
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Content */}
      <Box
        sx={{
          flex: 1,
          bgcolor: colors.background.primary,
          width: "100%",
          pt: "80px", // Add padding-top for fixed header
          transition: "background-color 0.3s ease",
        }}
      >
        <Outlet />
      </Box>

      {/* Footer */}
      <Footer />

      {/* EduHub Speed Dial for Guest */}
      <EduHubSpeedDial userRole="partner" />
    </div>
  );
};

export default GuestLayout;
