import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Logo from "../assets/Eduhub_logo_new.png";
import EduHubSpeedDial from "../components/EduHubSpeedDial";
import Footer from "../components/Footer";
import IntroductionDialog from "../components/IntroductionDialog";
import { useColors } from "../hooks/useColors";
// import { ThemeToggle } from "../components";

const GuestLayout = () => {
  const navigate = useNavigate();
  const colors = useColors();
  const [activeMenu, setActiveMenu] = useState<string>("");
  const [introDialogOpen, setIntroDialogOpen] = useState(false);

  // Function to get menu button styles
  const getMenuButtonStyles = (sectionId: string) => ({
    color: activeMenu === sectionId ? "white" : colors.text.primary,
    fontWeight: activeMenu === sectionId ? 700 : 600,
    fontSize: "0.8rem",
    textTransform: "none",
    backgroundColor: activeMenu === sectionId ? colors.primary.main : "transparent",
    borderRadius: "8px",
    px: 1.2,
    py: 0.6,
    transition: "all 0.3s ease",
    boxShadow: activeMenu === sectionId ? `0 2px 8px ${colors.primary.main}40` : "none",
    transform: activeMenu === sectionId ? "translateY(-1px)" : "translateY(0)",
    "&:hover": {
      backgroundColor: activeMenu === sectionId ? colors.primary.dark : `${colors.primary.main}15`,
      color: activeMenu === sectionId ? "white" : colors.primary.main,
      transform: "translateY(-1px)",
      boxShadow: `0 4px 12px ${colors.primary.main}30`,
    },
  });

  // Function to scroll to section
  const scrollToSection = (sectionId: string) => {
    // Set active menu immediately for instant feedback
    setActiveMenu(sectionId);
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      // If section doesn't exist, scroll to top for "TRANG CHỦ"
      if (sectionId === 'trangchu') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // Function to handle intro menu click
  const handleIntroClick = () => {
    setIntroDialogOpen(true);
    setActiveMenu("gioithieu");
  };

  // Listen for scroll events to update active menu
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['trangchu', 'gioithieu', 'giangvien', 'chuongtrinhdaotao', 'detainghiencuu', 'taikhoannguoidung', 'tintucsukien', 'hotro', 'lienhe'];
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
              gap: 1,
              alignItems: "center",
              flex: 1,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              onClick={() => scrollToSection("trangchu")}
              sx={getMenuButtonStyles("trangchu")}
            >
              TRANG CHỦ
            </Button>
            <Button
              onClick={handleIntroClick}
              sx={getMenuButtonStyles("gioithieu")}
            >
              GIỚI THIỆU
            </Button>
            <Button
              onClick={() => scrollToSection("giangvien")}
              sx={getMenuButtonStyles("giangvien")}
            >
              GIẢNG VIÊN
            </Button>
            <Button
              onClick={() => scrollToSection("chuongtrinhdaotao")}
              sx={getMenuButtonStyles("chuongtrinhdaotao")}
            >
              CHƯƠNG TRÌNH ĐÀO TẠO
            </Button>
            <Button
              onClick={() => scrollToSection("detainghiencuu")}
              sx={getMenuButtonStyles("detainghiencuu")}
            >
              ĐỀ TÀI NGHIÊN CỨU
            </Button>
            <Button
              onClick={() => scrollToSection("taikhoannguoidung")}
              sx={getMenuButtonStyles("taikhoannguoidung")}
            >
              TÀI KHOẢN NGƯỜI DÙNG
            </Button>
            <Button
              onClick={() => scrollToSection("tintucsukien")}
              sx={getMenuButtonStyles("tintucsukien")}
            >
              TIN TỨC & SỰ KIỆN
            </Button>
            <Button
              onClick={() => scrollToSection("hotro")}
              sx={getMenuButtonStyles("hotro")}
            >
              HỖ TRỢ
            </Button>
            <Button
              onClick={() => scrollToSection("lienhe")}
              sx={getMenuButtonStyles("lienhe")}
            >
              LIÊN HỆ
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

      {/* Introduction Dialog */}
      <IntroductionDialog 
        open={introDialogOpen} 
        onClose={() => setIntroDialogOpen(false)} 
      />
    </div>
  );
};

export default GuestLayout;
