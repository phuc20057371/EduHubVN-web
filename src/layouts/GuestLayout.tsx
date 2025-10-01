import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Logo from "../assets/Eduhub_logo_new.png";
import EduHubSpeedDial from "../components/EduHubSpeedDial";
import Footer from "../components/Footer";
import { useColors } from "../hooks/useColors";

const GuestLayout = () => {
  const navigate = useNavigate();
  const colors = useColors();
  const [activeMenu, setActiveMenu] = useState<string>("");

  // Function to scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      setActiveMenu(sectionId);
    }
  };

  // Listen for scroll events to update active menu
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['khoahoc', 'giangvien', 'truonghoc', 'doanhnghiep', 'tintuc', 'lienhe'];
      const scrollPosition = window.scrollY + 100;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveMenu(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

          {/* Navigation Menu */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 3,
              alignItems: "center",
              flex: 1,
              justifyContent: "center",
            }}
          >
            <Button
              onClick={() => scrollToSection("khoahoc")}
              sx={{
                color: activeMenu === "khoahoc" ? colors.primary.main : colors.text.primary,
                fontWeight: activeMenu === "khoahoc" ? 700 : 600,
                fontSize: "0.95rem",
                textTransform: "none",
                backgroundColor: activeMenu === "khoahoc" ? `${colors.primary.main}15` : "transparent",
                borderRadius: "8px",
                px: 2,
                py: 1,
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: activeMenu === "khoahoc" ? `${colors.primary.main}25` : `${colors.primary.main}10`,
                  color: colors.primary.main,
                },
              }}
            >
              Khóa học
            </Button>
            <Button
              onClick={() => scrollToSection("giangvien")}
              sx={{
                color: activeMenu === "giangvien" ? colors.primary.main : colors.text.primary,
                fontWeight: activeMenu === "giangvien" ? 700 : 600,
                fontSize: "0.95rem",
                textTransform: "none",
                backgroundColor: activeMenu === "giangvien" ? `${colors.primary.main}15` : "transparent",
                borderRadius: "8px",
                px: 2,
                py: 1,
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: activeMenu === "giangvien" ? `${colors.primary.main}25` : `${colors.primary.main}10`,
                  color: colors.primary.main,
                },
              }}
            >
              Giảng viên
            </Button>
            <Button
              onClick={() => scrollToSection("truonghoc")}
              sx={{
                color: activeMenu === "truonghoc" ? colors.primary.main : colors.text.primary,
                fontWeight: activeMenu === "truonghoc" ? 700 : 600,
                fontSize: "0.95rem",
                textTransform: "none",
                backgroundColor: activeMenu === "truonghoc" ? `${colors.primary.main}15` : "transparent",
                borderRadius: "8px",
                px: 2,
                py: 1,
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: activeMenu === "truonghoc" ? `${colors.primary.main}25` : `${colors.primary.main}10`,
                  color: colors.primary.main,
                },
              }}
            >
              Trường học
            </Button>
            <Button
              onClick={() => scrollToSection("doanhnghiep")}
              sx={{
                color: activeMenu === "doanhnghiep" ? colors.primary.main : colors.text.primary,
                fontWeight: activeMenu === "doanhnghiep" ? 700 : 600,
                fontSize: "0.95rem",
                textTransform: "none",
                backgroundColor: activeMenu === "doanhnghiep" ? `${colors.primary.main}15` : "transparent",
                borderRadius: "8px",
                px: 2,
                py: 1,
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: activeMenu === "doanhnghiep" ? `${colors.primary.main}25` : `${colors.primary.main}10`,
                  color: colors.primary.main,
                },
              }}
            >
              Doanh nghiệp
            </Button>
            <Button
              onClick={() => scrollToSection("tintuc")}
              sx={{
                color: activeMenu === "tintuc" ? colors.primary.main : colors.text.primary,
                fontWeight: activeMenu === "tintuc" ? 700 : 600,
                fontSize: "0.95rem",
                textTransform: "none",
                backgroundColor: activeMenu === "tintuc" ? `${colors.primary.main}15` : "transparent",
                borderRadius: "8px",
                px: 2,
                py: 1,
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: activeMenu === "tintuc" ? `${colors.primary.main}25` : `${colors.primary.main}10`,
                  color: colors.primary.main,
                },
              }}
            >
              Tin tức
            </Button>
            <Button
              onClick={() => scrollToSection("lienhe")}
              sx={{
                color: activeMenu === "lienhe" ? colors.primary.main : colors.text.primary,
                fontWeight: activeMenu === "lienhe" ? 700 : 600,
                fontSize: "0.95rem",
                textTransform: "none",
                backgroundColor: activeMenu === "lienhe" ? `${colors.primary.main}15` : "transparent",
                borderRadius: "8px",
                px: 2,
                py: 1,
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: activeMenu === "lienhe" ? `${colors.primary.main}25` : `${colors.primary.main}10`,
                  color: colors.primary.main,
                },
              }}
            >
              Liên hệ
            </Button>
          </Box>

          {/* Right side buttons */}
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "stretch", sm: "center" },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            {/* Search Icon */}
            {/* <Button
              sx={{
                minWidth: "auto",
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                backgroundColor: colors.background.secondary,
                color: colors.text.primary,
              }}
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            </Button> */}

            {/* Theme Toggle */}
            {/* <ThemeToggle /> */}

            <Button
              variant="contained"
              onClick={() => navigate("/register")}
              sx={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.9rem",
                bgcolor: colors.primary.main,
                color: colors.isDark ? "black" : "white",
                fontWeight: 600,
                px: 3,
                py: 1,
                boxShadow: "0 6px 20px rgba(0, 178, 255, 0.4)",
                transition: "all 0.3s ease",
                width: { xs: "100%", sm: "120px" },
                minWidth: "100px",
                height: "44px",
                textTransform: "none",
                borderRadius: "12px",
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
                fontSize: "0.9rem",
                bgcolor: colors.secondary.main,
                color: colors.isDark ? "black" : "white",
                fontWeight: 700,
                px: 2,
                py: 1,
                transition: "all 0.3s ease",
                width: { xs: "100%", sm: "120px" },
                minWidth: "100px",
                height: "44px",
                textTransform: "none",
                borderRadius: "12px",
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
