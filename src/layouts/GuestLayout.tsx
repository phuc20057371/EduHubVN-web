import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Logo from "../assets/Eduhub_logo_new.png";
import EduHubSpeedDial from "../components/EduHubSpeedDial";
import Footer from "../components/Footer";
import { useColors } from "../hooks/useColors";
// import { ThemeToggle } from "../components";

const GuestLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const colors = useColors();
  
  // Function to determine active menu based on current pathname
  const getActiveMenuFromPath = (pathname: string): string => {
    if (pathname.includes('/guest/introduce')) {
      return 'gioithieu';
    } else if (pathname.includes('/guest/lecturers')) {
      return 'giangvien';
    } else if (pathname.includes('/guest/training-programs')) {
      return 'chuongtrinhdaotao';
    } else if (pathname === '/guest' || pathname === '/') {
      return 'trangchu';
    } else {
      return 'trangchu'; // default fallback
    }
  };

  const [activeMenu, setActiveMenu] = useState<string>(() => 
    getActiveMenuFromPath(location.pathname)
  );

  // Function to get menu button styles
  const getMenuButtonStyles = (sectionId: string) => ({
    color: activeMenu === sectionId ? colors.primary.main : colors.text.primary,
    fontWeight: activeMenu === sectionId ? 700 : 600,
    fontSize: "0.8rem",
    textTransform: "none",
    backgroundColor: activeMenu === sectionId ? "#e3f2fd" : "transparent", // Light blue background when active
    borderRadius: "8px",
    px: 1.2,
    py: 0.6,
    transition: "all 0.3s ease",
    boxShadow: activeMenu === sectionId ? "0 2px 4px rgba(33, 150, 243, 0.2)" : "none",
    transform: activeMenu === sectionId ? "translateY(-1px)" : "translateY(0)",
    "&:hover": {
      backgroundColor: activeMenu === sectionId ? "#bbdefb" : "#f5f5f5", // Slightly darker blue on hover when active, light gray when inactive
      color: activeMenu === sectionId ? colors.primary.dark : colors.primary.main,
      transform: "translateY(-1px)",
      boxShadow: "0 4px 8px rgba(33, 150, 243, 0.15)",
    },
  });

  // Function to handle intro menu click
  const handleIntroClick = () => {
    setActiveMenu("gioithieu");
    navigate("/guest/introduce");
  };

  // Function to handle contact menu click - scroll to bottom
  const handleContactClick = () => {
    setActiveMenu("lienhe");
    window.scrollTo({ 
      top: document.documentElement.scrollHeight, 
      behavior: 'smooth' 
    });
  };

  // Update active menu when location changes
  useEffect(() => {
    const newActiveMenu = getActiveMenuFromPath(location.pathname);
    setActiveMenu(newActiveMenu);
  }, [location.pathname]);

  // Listen for scroll events to update active menu (only on home page)
  useEffect(() => {
    const handleScroll = () => {
      // Only update active menu based on scroll when on home page
      if (location.pathname === '/guest' || location.pathname === '/') {
        const sections = ['trangchu', 'gioithieu', 'giangvien', 'chuongtrinhdaotao', 'lienhe'];
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
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

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
              justifyContent: "flex-start",
              flexWrap: "wrap",
              ml: 4, // Add margin left for spacing from logo
            }}
          >
            <Button
              onClick={() => {
                setActiveMenu("trangchu");
                window.scrollTo({ top: 0, behavior: 'smooth' });
                navigate("/guest");
              }}
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
              onClick={() => {
                setActiveMenu("giangvien");
                navigate("/guest/lecturers");
              }}
              sx={getMenuButtonStyles("giangvien")}
            >
              GIẢNG VIÊN
            </Button>

            <Button
              onClick={() => {
                setActiveMenu("chuongtrinhdaotao");
                navigate("/guest/training-programs");
              }}
              sx={getMenuButtonStyles("chuongtrinhdaotao")}
            >
              CHƯƠNG TRÌNH ĐÀO TẠO
            </Button>

            <Button
              onClick={handleContactClick}
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
          pt: "90px", // Add padding-top for fixed header
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
