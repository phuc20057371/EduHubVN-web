import { Outlet, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import {
  Facebook,
  Twitter,
  LinkedIn,
  Email,
  Phone,
  LocationOn,
} from "@mui/icons-material";
import Logo from "../assets/eduhub-02.png";
import { Container } from "@mui/system";

const GuestLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #0891b2 0%, #0e7490 100%)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          position: "relative",
          overflow: "hidden",
          width: "100vw",
          minWidth: "100vw",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(10px)",
          },
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
                height: 40,
                marginRight: 12,
                filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))",
              }}
            />
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 800,
                  color: "white",
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                  letterSpacing: "-0.5px",
                  fontSize: { xs: "1.2rem", md: "1.5rem" },
                }}
              >
                EduHubVN
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(255,255,255,0.9)",
                  fontSize: { xs: "0.7rem", md: "0.75rem" },
                  fontWeight: 500,
                  letterSpacing: "1px",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                EDUCATION PLATFORM
              </Typography>
            </Box>
          </Box>

          {/* Nút bên phải */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "stretch", sm: "center" },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <Button
              variant="outlined"
              onClick={() => navigate("/login")}
              sx={{
                fontFamily: "'Inter', sans-serif",
                color: "white",
                borderColor: "rgba(255,255,255,0.6)",
                borderWidth: 2,
                fontWeight: 600,
                px: 3,
                py: 1,
                borderRadius: 3,
                transition: "all 0.3s ease",
                width: { xs: "100%", sm: "auto" },
                textTransform: "none",
                "&:hover": {
                  borderColor: "#06b6d4",
                  backgroundColor: "rgba(6, 182, 212, 0.1)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
                },
              }}
            >
              Đăng nhập
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate("/register")}
              sx={{
                fontFamily: "'Inter', sans-serif",
                background: "linear-gradient(45deg, #06b6d4 30%, #0891b2 90%)",
                color: "white",
                fontWeight: 600,
                px: 3,
                py: 1,
                borderRadius: 3,
                boxShadow: "0 6px 20px rgba(6, 182, 212, 0.4)",
                transition: "all 0.3s ease",
                width: { xs: "100%", sm: "auto" },
                textTransform: "none",
                "&:hover": {
                  background: "linear-gradient(45deg, #0891b2 30%, #0e7490 90%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 25px rgba(6, 182, 212, 0.5)",
                },
              }}
            >
              Đăng ký
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, bgcolor: "#f8fafc", width: "100%" }}>
        <Outlet />
      </Box>

      {/* Footer */}
      <Box
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
            <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 300px" }, minWidth: 220 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <img
                  src={Logo}
                  alt="EduHubVN Logo"
                  style={{ height: 32, marginRight: 12 }}
                />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: "#14b8a6", fontFamily: "'Inter', sans-serif" }}
                >
                  EduHubVN
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{ color: "#a0aec0", lineHeight: 1.6, mb: 3, fontSize: { xs: "0.85rem", md: "1rem" } }}
              >
                Nền tảng giáo dục hàng đầu Việt Nam, kết nối giảng viên và học
                viên với các khóa học chất lượng cao và cơ hội phát triển nghề
                nghiệp.
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

            {/* Liên kết nhanh */}
            <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 150px" }, minWidth: 150 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 2, color: "#14b8a6", fontFamily: "'Inter', sans-serif" }}
              >
                Liên kết
              </Typography>
              {[
                "Trang chủ",
                "Về chúng tôi",
                "Khóa học",
                "Giảng viên",
                "Tin tức",
              ].map((item) => (
                <Link
                  key={item}
                  href="#"
                  sx={{
                    display: "block",
                    color: "#a0aec0",
                    textDecoration: "none",
                    mb: 1,
                    fontSize: { xs: "0.9rem", md: "1rem" },
                    transition: "color 0.3s ease",
                    "&:hover": { color: "#14b8a6" },
                  }}
                >
                  {item}
                </Link>
              ))}
            </Box>

            {/* Dịch vụ */}
            <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 200px" }, minWidth: 180 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 2, color: "#14b8a6", fontFamily: "'Inter', sans-serif" }}
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
                  href="#"
                  sx={{
                    display: "block",
                    color: "#a0aec0",
                    textDecoration: "none",
                    mb: 1,
                    fontSize: { xs: "0.9rem", md: "1rem" },
                    transition: "color 0.3s ease",
                    "&:hover": { color: "#14b8a6" },
                  }}
                >
                  {item}
                </Link>
              ))}
            </Box>

            {/* Thông tin liên hệ */}
            <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 250px" }, minWidth: 200 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 2, color: "#14b8a6", fontFamily: "'Inter', sans-serif" }}
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
            <Typography variant="body2" sx={{ color: "#a0aec0", fontSize: { xs: "0.85rem", md: "1rem" } }}>
              © 2024 EduHubVN. All rights reserved.
            </Typography>
            <Box sx={{ display: "flex", gap: 3 }}>
              {[
                "Chính sách bảo mật",
                "Điều khoản sử dụng",
                "Cookie Policy",
              ].map((item) => (
                <Link
                  key={item}
                  href="#"
                  sx={{
                    color: "#a0aec0",
                    textDecoration: "none",
                    fontSize: { xs: "0.8rem", md: "0.875rem" },
                    transition: "color 0.3s ease",
                    "&:hover": { color: "#14b8a6" },
                  }}
                >
                  {item}
                </Link>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>
    </div>
  );
};

export default GuestLayout;
