import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import {
  School,
  Business,
  Groups,
  CheckCircle,
  Star,
  Assignment,
  Search,
  Handshake,
  Person,
} from "@mui/icons-material";

const GuestPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <School className="text-teal-600" />,
      title: "Giảng viên chuyên nghiệp",
      description: "Kết nối với hàng nghìn giảng viên có kinh nghiệm và chuyên môn cao",
      color: "teal"
    },
    {
      icon: <Business className="text-emerald-600" />,
      title: "Trường & Trung tâm",
      description: "Mạng lưới các trường đại học và trung tâm đào tạo uy tín",
      color: "emerald"
    },
    {
      icon: <Groups className="text-cyan-600" />,
      title: "Đối tác doanh nghiệp",
      description: "Các doanh nghiệp và tổ chức có nhu cầu đào tạo chuyên sâu",
      color: "cyan"
    },
    {
      icon: <Assignment className="text-sky-600" />,
      title: "Đề tài đa dạng",
      description: "Kho tàng đề tài nghiên cứu và đào tạo phong phú",
      color: "sky"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Đăng ký tài khoản",
      description: "Tạo hồ sơ chi tiết với thông tin chuyên môn",
      icon: <Person className="text-teal-600" />
    },
    {
      number: "02", 
      title: "Tìm kiếm cơ hội",
      description: "Duyệt qua các đề tài và dự án phù hợp",
      icon: <Search className="text-emerald-600" />
    },
    {
      number: "03",
      title: "Kết nối & Hợp tác",
      description: "Liên hệ và bắt đầu các dự án hợp tác",
      icon: <Handshake className="text-cyan-600" />
    }
  ];

  const stats = [
    { number: "1000+", label: "Giảng viên", icon: <School /> },
    { number: "500+", label: "Trường & Trung tâm", icon: <Business /> },
    { number: "200+", label: "Đối tác", icon: <Groups /> },
    { number: "2000+", label: "Dự án hoàn thành", icon: <CheckCircle /> }
  ];

  const testimonials = [
    {
      name: "TS. Nguyễn Văn A",
      position: "Giảng viên Đại học Bách Khoa",
      content: "EduHubVN đã giúp tôi tìm được nhiều cơ hội hợp tác với các doanh nghiệp. Nền tảng rất chuyên nghiệp và dễ sử dụng.",
      avatar: "/avatar1.jpg",
      rating: 5
    },
    {
      name: "Trung tâm ABC",
      position: "Trung tâm Đào tạo",
      content: "Chúng tôi đã tìm được nhiều giảng viên chất lượng thông qua EduHubVN. Quy trình kết nối rất thuận tiện.",
      avatar: "/avatar2.jpg", 
      rating: 5
    },
    {
      name: "Công ty XYZ",
      position: "Đối tác doanh nghiệp",
      content: "Nền tảng giúp chúng tôi dễ dàng tìm kiếm giảng viên phù hợp cho các chương trình đào tạo nội bộ.",
      avatar: "/avatar3.jpg",
      rating: 5
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #0891b2 0%, #0e7490 50%, #155e75 100%)",
          color: "white",
          py: { xs: 10, md: 16 },
          position: "relative",
          overflow: "hidden",
          minHeight: "75vh",
          display: "flex",
          alignItems: "center",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "radial-gradient(circle at 30% 50%, rgba(255,255,255,0.08) 0%, transparent 70%)",
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Box 
            sx={{ 
              textAlign: "center", 
              maxWidth: "900px", 
              mx: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontFamily: "'Inter'",
                fontWeight: 800,
                mb: 4,
                fontSize: { xs: "2.8rem", md: "4.2rem", lg: "4.8rem" },
                textShadow: "0 4px 12px rgba(0,0,0,0.25)",
                lineHeight: 1.1,
                letterSpacing: "-0.03em"
              }}
            >
              Kết nối Giáo dục
              <br />
              <Box component="span" sx={{ color: "#06b6d4", display: "inline-block", mt: 1 }}>
                Kiến tạo Tương lai
              </Box>
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontFamily: "'Inter'",
                mb: 6,
                opacity: 0.92,
                lineHeight: 1.65,
                fontSize: { xs: "1.15rem", md: "1.45rem", lg: "1.65rem" },
                maxWidth: "720px",
                fontWeight: 400,
                color: "rgba(255,255,255,0.9)"
              }}
            >
              Nền tảng kết nối giảng viên, trường đại học, trung tâm đào tạo và doanh nghiệp. 
              Tìm kiếm cơ hội hợp tác và phát triển nghề nghiệp trong lĩnh vực giáo dục.
            </Typography>
            <Box 
              sx={{ 
                display: "flex", 
                gap: 4, 
                justifyContent: "center", 
                flexDirection: { xs: "column", sm: "row" },
                width: { xs: "100%", sm: "auto" }
              }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/register")}
                sx={{
                  fontFamily: "'Inter'",
                  background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
                  px: { xs: 4, md: 6 },
                  py: { xs: 1.8, md: 2.2 },
                  fontSize: { xs: "1.1rem", md: "1.25rem" },
                  fontWeight: 600,
                  borderRadius: 3,
                  boxShadow: "0 8px 32px rgba(6, 182, 212, 0.35)",
                  minWidth: 200,
                  textTransform: "none",
                  "&:hover": {
                    background: "linear-gradient(135deg, #0891b2 0%, #0e7490 100%)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 40px rgba(6, 182, 212, 0.4)"
                  }
                }}
              >
                Bắt đầu ngay
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate("/login")}
                sx={{
                  fontFamily: "'Inter'",
                  borderColor: "rgba(255,255,255,0.7)",
                  color: "white",
                  borderWidth: 2,
                  px: { xs: 4, md: 6 },
                  py: { xs: 1.8, md: 2.2 },
                  fontSize: { xs: "1.1rem", md: "1.25rem" },
                  fontWeight: 600,
                  borderRadius: 3,
                  minWidth: 200,
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "#06b6d4",
                    color: "#06b6d4",
                    backgroundColor: "rgba(6, 182, 212, 0.08)",
                    transform: "translateY(-1px)"
                  }
                }}
              >
                Đăng nhập
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: { xs: 10, md: 14 }, bgcolor: "#f0fdfa" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 10 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontFamily: "'Inter'",
                fontWeight: 700, 
                mb: 3, 
                color: "#134e4a",
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                letterSpacing: "-0.02em"
              }}
            >
              Tại sao chọn EduHubVN?
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: "'Inter'",
                color: "#0f766e", 
                maxWidth: "700px", 
                mx: "auto",
                fontSize: { xs: "1.1rem", md: "1.3rem" },
                lineHeight: 1.6,
                fontWeight: 400
              }}
            >
              Chúng tôi mang đến giải pháp toàn diện cho việc kết nối và hợp tác trong lĩnh vực giáo dục
            </Typography>
          </Box>
          
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
              justifyContent: "center",
              alignItems: "stretch"
            }}
          >
            {features.map((feature, index) => (
              <Box
                key={index}
                sx={{
                  flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 16px)", lg: "1 1 calc(25% - 24px)" },
                  minWidth: { xs: "100%", sm: "280px", lg: "250px" },
                  maxWidth: { xs: "100%", sm: "400px", lg: "300px" }
                }}
              >
                <Card
                  sx={{
                    height: "100%",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    borderRadius: 4,
                    border: "1px solid rgba(20, 184, 166, 0.1)",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 20px 40px rgba(20, 184, 166, 0.15)",
                      borderColor: "rgba(20, 184, 166, 0.2)"
                    }
                  }}
                >
                  <CardContent sx={{ p: 5, textAlign: "center", height: "100%" }}>
                    <Box
                      sx={{
                        width: 90,
                        height: 90,
                        borderRadius: "50%",
                        backgroundColor: `${feature.color === "teal" ? "#ccfbf1" : 
                          feature.color === "emerald" ? "#d1fae5" :
                          feature.color === "cyan" ? "#cffafe" : "#e0f2fe"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 4,
                        "& svg": {
                          fontSize: "2.5rem",
                          color: `${feature.color === "teal" ? "#14b8a6" : 
                            feature.color === "emerald" ? "#10b981" :
                            feature.color === "cyan" ? "#06b6d4" : "#0284c7"}`
                        }
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontFamily: "'Inter'",
                        fontWeight: 600, 
                        mb: 3,
                        color: "#134e4a",
                        fontSize: "1.4rem"
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontFamily: "'Inter'",
                        color: "#0f766e", 
                        lineHeight: 1.65,
                        fontSize: "1.05rem",
                        fontWeight: 400
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ py: { xs: 10, md: 14 }, bgcolor: "white" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 12 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontFamily: "'Inter'",
                fontWeight: 700, 
                mb: 3, 
                color: "#134e4a",
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                letterSpacing: "-0.02em"
              }}
            >
              Cách thức hoạt động
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: "'Inter'",
                color: "#0f766e", 
                maxWidth: "700px", 
                mx: "auto",
                fontSize: { xs: "1.1rem", md: "1.3rem" },
                lineHeight: 1.6,
                fontWeight: 400
              }}
            >
              Quy trình đơn giản để bắt đầu hành trình kết nối và hợp tác
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: { xs: 6, md: 8 },
              justifyContent: "center",
              alignItems: "flex-start"
            }}
          >
            {steps.map((step, index) => (
              <Box
                key={index}
                sx={{
                  flex: { xs: "1 1 100%", md: "1 1 300px" },
                  maxWidth: { xs: "100%", md: "350px" },
                  textAlign: "center",
                  position: "relative"
                }}
              >
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #14b8a6 0%, #0891b2 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 4,
                    position: "relative",
                    boxShadow: "0 12px 32px rgba(20, 184, 166, 0.25)",
                    "& svg": {
                      fontSize: "3rem",
                      color: "white"
                    }
                  }}
                >
                  {step.icon}
                  <Box
                    sx={{
                      position: "absolute",
                      top: -15,
                      right: -15,
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      backgroundColor: "#06b6d4",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1rem",
                      fontWeight: 700,
                      fontFamily: "'Inter'",
                      color: "white",
                      boxShadow: "0 4px 12px rgba(6, 182, 212, 0.3)"
                    }}
                  >
                    {step.number}
                  </Box>
                </Box>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontFamily: "'Inter'",
                    fontWeight: 600, 
                    mb: 3,
                    color: "#134e4a",
                    fontSize: "1.4rem"
                  }}
                >
                  {step.title}
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontFamily: "'Inter'",
                    color: "#0f766e",
                    fontSize: "1.05rem",
                    lineHeight: 1.65,
                    fontWeight: 400
                  }}
                >
                  {step.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Statistics Section */}
      <Box sx={{ py: { xs: 10, md: 14 }, bgcolor: "#134e4a", color: "white" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 10 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontFamily: "'Inter'",
                fontWeight: 700, 
                mb: 3,
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                letterSpacing: "-0.02em"
              }}
            >
              Thành tựu của chúng tôi
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: "'Inter'",
                opacity: 0.9,
                fontSize: { xs: "1.1rem", md: "1.3rem" },
                fontWeight: 400
              }}
            >
              Những con số ấn tượng sau hành trình phát triển
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: { xs: 4, md: 6 },
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            {stats.map((stat, index) => (
              <Box
                key={index}
                sx={{
                  flex: { xs: "1 1 calc(50% - 16px)", md: "1 1 200px" },
                  textAlign: "center",
                  minWidth: { xs: "140px", md: "180px" }
                }}
              >
                <Box
                  sx={{
                    color: "#06b6d4",
                    mb: 3,
                    display: "flex",
                    justifyContent: "center",
                    "& svg": {
                      fontSize: { xs: "2.5rem", md: "3rem" }
                    }
                  }}
                >
                  {stat.icon}
                </Box>
                <Typography
                  variant="h2"
                  sx={{ 
                    fontFamily: "'Inter'",
                    fontWeight: 800, 
                    mb: 2, 
                    color: "#06b6d4",
                    fontSize: { xs: "2.5rem", md: "3.5rem" },
                    letterSpacing: "-0.02em"
                  }}
                >
                  {stat.number}
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontFamily: "'Inter'",
                    opacity: 0.95,
                    fontWeight: 500,
                    fontSize: { xs: "1rem", md: "1.2rem" }
                  }}
                >
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: { xs: 10, md: 14 }, bgcolor: "#f0fdfa" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 10 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontFamily: "'Inter'",
                fontWeight: 700, 
                mb: 3, 
                color: "#134e4a",
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                letterSpacing: "-0.02em"
              }}
            >
              Khách hàng nói gì về chúng tôi
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: "'Inter'",
                color: "#0f766e",
                fontSize: { xs: "1.1rem", md: "1.3rem" },
                fontWeight: 400
              }}
            >
              Những phản hồi tích cực từ cộng đồng người dùng
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
              justifyContent: "center",
              alignItems: "stretch"
            }}
          >
            {testimonials.map((testimonial, index) => (
              <Box
                key={index}
                sx={{
                  flex: { xs: "1 1 100%", md: "1 1 calc(33.333% - 24px)" },
                  minWidth: { xs: "100%", md: "300px" },
                  maxWidth: { xs: "100%", md: "400px" }
                }}
              >
                <Card
                  sx={{
                    height: "100%",
                    p: 4,
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    borderRadius: 4,
                    border: "1px solid rgba(20, 184, 166, 0.1)",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 15px 35px rgba(20, 184, 166, 0.12)",
                      borderColor: "rgba(20, 184, 166, 0.2)"
                    }
                  }}
                >
                  <CardContent sx={{ p: 0, height: "100%", display: "flex", flexDirection: "column" }}>
                    <Box sx={{ display: "flex", mb: 3 }}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} sx={{ color: "#06b6d4", fontSize: "1.5rem" }} />
                      ))}
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{ 
                        fontFamily: "'Inter'",
                        mb: 4, 
                        fontStyle: "italic", 
                        lineHeight: 1.7,
                        fontSize: "1.05rem",
                        flex: 1,
                        color: "#0f766e",
                        fontWeight: 400
                      }}
                    >
                      "{testimonial.content}"
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        src={testimonial.avatar}
                        sx={{ 
                          width: 60, 
                          height: 60, 
                          mr: 3,
                          bgcolor: "#14b8a6"
                        }}
                      >
                        {testimonial.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontFamily: "'Inter'",
                            fontWeight: 600,
                            color: "#134e4a",
                            fontSize: "1.1rem"
                          }}
                        >
                          {testimonial.name}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontFamily: "'Inter'",
                            color: "#0f766e",
                            fontSize: "0.95rem",
                            fontWeight: 400
                          }}
                        >
                          {testimonial.position}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: { xs: 10, md: 16 },
          background: "linear-gradient(135deg, #0891b2 0%, #0e7490 50%, #155e75 100%)",
          color: "white",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "radial-gradient(circle at 70% 30%, rgba(255,255,255,0.06) 0%, transparent 70%)",
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h2"
              sx={{ 
                fontFamily: "'Inter'",
                fontWeight: 700, 
                mb: 4, 
                fontSize: { xs: "2.5rem", md: "4rem" },
                textShadow: "0 2px 8px rgba(0,0,0,0.2)",
                letterSpacing: "-0.02em"
              }}
            >
              Sẵn sàng bắt đầu hành trình?
            </Typography>
            <Typography
              variant="h6"
              sx={{ 
                fontFamily: "'Inter'",
                mb: 6, 
                opacity: 0.92, 
                maxWidth: "700px", 
                mx: "auto",
                fontSize: { xs: "1.2rem", md: "1.5rem" },
                lineHeight: 1.6,
                fontWeight: 400,
                color: "rgba(255,255,255,0.9)"
              }}
            >
              Tham gia cộng đồng EduHubVN ngay hôm nay và khám phá những cơ hội hợp tác tuyệt vời
            </Typography>
            <Box 
              sx={{ 
                display: "flex", 
                gap: 4, 
                justifyContent: "center", 
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center"
              }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/register")}
                sx={{
                  fontFamily: "'Inter'",
                  background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
                  px: { xs: 6, md: 8 },
                  py: { xs: 2.2, md: 2.8 },
                  fontSize: { xs: "1.2rem", md: "1.35rem" },
                  fontWeight: 600,
                  borderRadius: 3,
                  boxShadow: "0 8px 32px rgba(6, 182, 212, 0.35)",
                  minWidth: 250,
                  textTransform: "none",
                  "&:hover": {
                    background: "linear-gradient(135deg, #0891b2 0%, #0e7490 100%)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 40px rgba(6, 182, 212, 0.4)"
                  }
                }}
              >
                Đăng ký miễn phí
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  fontFamily: "'Inter'",
                  borderColor: "rgba(255,255,255,0.7)",
                  color: "white",
                  borderWidth: 2,
                  px: { xs: 6, md: 8 },
                  py: { xs: 2.2, md: 2.8 },
                  fontSize: { xs: "1.2rem", md: "1.35rem" },
                  fontWeight: 600,
                  borderRadius: 3,
                  minWidth: 250,
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "#06b6d4",
                    color: "#06b6d4",
                    backgroundColor: "rgba(6, 182, 212, 0.08)",
                    transform: "translateY(-1px)"
                  }
                }}
              >
                Tìm hiểu thêm
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default GuestPage;
