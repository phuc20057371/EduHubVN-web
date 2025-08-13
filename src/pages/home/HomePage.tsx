import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Paper,
  Avatar,
  Chip,
  Stack,
  alpha,
} from "@mui/material";
import {
  School,
  Person,
  Business,
  ArrowForward,
  CheckCircle,
  Groups,
  Star,
  TrendingUp,
  Security,
} from "@mui/icons-material";
import { colors } from "../../theme/colors";
import eduhubLogo from "../../assets/eduhub-03.png";

interface ProfileOption {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  route: string;
  features: string[];
  badge?: string;
  stats: { label: string; value: string };
  targetAudience: string[];
}

const HomePage = () => {
  const navigate = useNavigate();
  const [selectedProfile, setSelectedProfile] = useState<string>("lecturer");

  const profileOptions: ProfileOption[] = [
    {
      id: "lecturer",
      title: "Giảng viên",
      subtitle: "Chia sẻ kiến thức - Tạo thu nhập",
      description:
        "Nền tảng dành cho các chuyên gia muốn chia sẻ kiến thức và xây dựng thương hiệu cá nhân",
      icon: <Person sx={{ fontSize: 48 }} />,
      gradient: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[700]} 100%)`,
      route: "/register-lecturer",
      badge: "Phổ biến nhất",
      stats: { label: "Giảng viên tham gia", value: "1,200+" },
      targetAudience: [
        "Chuyên gia IT",
        "Giáo viên",
        "Freelancer",
        "Consultant",
      ],
      features: [
        "Tạo và bán khóa học online",
        "Nhận lời mời giảng dạy từ doanh nghiệp",
        "Quản lý học viên và tiến độ học tập",
        "Theo dõi doanh thu và thống kê chi tiết",
        "Xây dựng thương hiệu cá nhân",
        "Hỗ trợ marketing và quảng bá",
      ],
    },
    {
      id: "institution",
      title: "Trường học",
      subtitle: "Đào tạo chất lượng - Hợp tác bền vững",
      description:
        "Giải pháp toàn diện cho các trường học và trung tâm đào tạo muốn nâng cao chất lượng giáo dục",
      icon: <School sx={{ fontSize: 48 }} />,
      gradient: `linear-gradient(135deg, ${colors.secondary[500]} 0%, ${colors.secondary[700]} 100%)`,
      route: "/register-institution",
      badge: "Đối tác uy tín",
      stats: { label: "Trường đối tác", value: "350+" },
      targetAudience: [
        "Trường đại học",
        "Trung tâm đào tạo",
        "Học viện",
      ],
      features: [
        "Tìm kiếm giảng viên chất lượng cao",
        "Mua khóa học cho sinh viên với giá ưu đãi",
        "Hợp tác phát triển chương trình đào tạo",
        "Quản lý sinh viên và tiến độ học tập",
        "Báo cáo và thống kê chi tiết",
        "Hỗ trợ kỹ thuật 24/7",
      ],
    },
    {
      id: "partner",
      title: "Doanh nghiệp",
      subtitle: "Đào tạo nhân sự - Phát triển bền vững",
      description:
        "Nền tảng hợp tác chiến lược cho các doanh nghiệp muốn đầu tư vào phát triển nguồn nhân lực",
      icon: <Business sx={{ fontSize: 48 }} />,
      gradient: `linear-gradient(135deg, ${colors.accent.lightBlue} 0%, #059669 100%)`,
      route: "/register-partner",
      badge: "Giải pháp doanh nghiệp",
      stats: { label: "Doanh nghiệp tin tướng", value: "180+" },
      targetAudience: ["Công ty công nghệ", "Tập đoàn", "Startup", "SME"],
      features: [
        "Tuyển dụng giảng viên cho dự án nội bộ",
        "Đào tạo nhân viên với chương trình tùy chỉnh",
        "Quản lý và theo dõi tiến độ đào tạo",
        "Phát triển chương trình đào tạo riêng",
        "Báo cáo hiệu quả đào tạo chi tiết",
        "Tư vấn chiến lược phát triển nhân lực",
      ],
    },
  ];

  const handleCardClick = (profileId: string) => {
    setSelectedProfile(profileId);
  };

  const handleContinue = () => {
    if (selectedProfile) {
      const selectedOption = profileOptions.find(
        (option) => option.id === selectedProfile,
      );
      if (selectedOption) {
        navigate(selectedOption.route);
      }
    }
  };

  const selectedOption = profileOptions.find(
    (option) => option.id === selectedProfile,
  );

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: colors.background.secondary }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: colors.background.gradient.primary,
          py: 8,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1000 100\" fill=\"%23ffffff\" opacity=\"0.1\"><polygon points=\"1000,100 1000,0 0,100\"/></svg>')",
            backgroundSize: "100% 100%",
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Box sx={{ textAlign: "center", color: "white" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 3,
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: 3,
                  background: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(20px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 3,
                  border: "1px solid rgba(255,255,255,0.3)",
                }}
              >
                <img
                  src={eduhubLogo}
                  style={{ width: "50px", height: "50px" }}
                  alt="EduHub Logo"
                />
              </Box>
              <Box>
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                    mb: 1,
                  }}
                >
                  EduHubVN
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontFamily: "'Inter', sans-serif",
                    opacity: 0.9,
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    fontSize: "0.9rem",
                  }}
                >
                  Education Platform
                </Typography>
              </Box>
            </Box>

            <Typography
              variant="h4"
              sx={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                mb: 2,
                maxWidth: 800,
                mx: "auto",
              }}
            >
              Kết nối tri thức - Tạo nên thành công
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontFamily: "'Inter', sans-serif",
                opacity: 0.9,
                fontWeight: 400,
                maxWidth: 600,
                mx: "auto",
                lineHeight: 1.6,
              }}
            >
              Chọn hành trình phù hợp để bắt đầu trải nghiệm nền tảng giáo dục
              hàng đầu Việt Nam
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Profile Selection Section */}
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            color: colors.text.primary,
            mb: 2,
          }}
        >
          Chọn vai trò của bạn
        </Typography>
        <Typography
          variant="body1"
          sx={{
            textAlign: "center",
            color: colors.text.tertiary,
            mb: 6,
            fontSize: "1.1rem",
          }}
        >
          Mỗi vai trò đều có những tính năng và lợi ích riêng biệt
        </Typography>

        {/* Profile Cards */}
        <Box
          sx={{
            display: "flex",
            gap: 4,
            mb: 6,
            flexDirection: { xs: "column", lg: "row" },
            alignItems: "stretch",
          }}
        >
          {profileOptions.map((option) => (
            <Card
              key={option.id}
              sx={{
                flex: 1,
                position: "relative",
                borderRadius: 4,
                overflow: "hidden",
                cursor: "pointer",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                transform:
                  selectedProfile === option.id
                    ? "translateY(-8px)"
                    : "translateY(0)",
                boxShadow:
                  selectedProfile === option.id
                    ? `0 20px 40px ${alpha(
                        option.gradient.includes(colors.primary[500])
                          ? colors.primary[500]
                          : option.gradient.includes(colors.secondary[500])
                          ? colors.secondary[500]
                          : colors.accent.lightBlue,
                        0.3,
                      )}`
                    : "0 4px 20px rgba(0,0,0,0.08)",
                border:
                  selectedProfile === option.id
                    ? `2px solid ${option.gradient.includes(colors.primary[500])
                        ? colors.primary[500]
                        : option.gradient.includes(colors.secondary[500])
                        ? colors.secondary[500]
                        : colors.accent.lightBlue}`
                    : "2px solid transparent",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
                },
              }}
              onClick={() => handleCardClick(option.id)}
            >
              {/* Header with gradient */}
              <Box
                sx={{
                  background: option.gradient,
                  p: 4,
                  color: "white",
                  position: "relative",
                }}
              >
                {/* Badge */}
                {option.badge && (
                  <Chip
                    label={option.badge}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      bgcolor: "rgba(255,255,255,0.2)",
                      color: "white",
                      fontWeight: 600,
                      border: "1px solid rgba(255,255,255,0.3)",
                    }}
                  />
                )}

                {/* Selection Indicator */}
                {selectedProfile === option.id && (
                  <Box sx={{ position: "absolute", top: 16, left: 16 }}>
                    <CheckCircle sx={{ color: "white", fontSize: 28 }} />
                  </Box>
                )}

                <Box sx={{ textAlign: "center", mt: option.badge ? 2 : 0 }}>
                  <Avatar
                    sx={{
                      bgcolor: "rgba(255,255,255,0.2)",
                      width: 80,
                      height: 80,
                      mx: "auto",
                      mb: 2,
                      border: "2px solid rgba(255,255,255,0.3)",
                    }}
                  >
                    {option.icon}
                  </Avatar>

                  <Typography
                    variant="h4"
                    sx={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 700,
                      mb: 1,
                    }}
                  >
                    {option.title}
                  </Typography>

                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontFamily: "'Inter', sans-serif",
                      opacity: 0.9,
                      fontWeight: 500,
                      mb: 2,
                    }}
                  >
                    {option.subtitle}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                      bgcolor: "rgba(255,255,255,0.2)",
                      borderRadius: 2,
                      px: 2,
                      py: 1,
                    }}
                  >
                    <Star sx={{ fontSize: 16 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {option.stats.value}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      {option.stats.label}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Content */}
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="body1"
                  sx={{
                    color: colors.text.secondary,
                    mb: 3,
                    lineHeight: 1.6,
                    fontSize: "1rem",
                  }}
                >
                  {option.description}
                </Typography>

                {/* Target Audience */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      color: colors.text.primary,
                      mb: 1,
                    }}
                  >
                    Dành cho:
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                    gap={1}
                  >
                    {option.targetAudience.map((audience, index) => (
                      <Chip
                        key={index}
                        label={audience}
                        size="small"
                        sx={{
                          bgcolor: alpha(
                            option.gradient.includes(colors.primary[500])
                              ? colors.primary[500]
                              : option.gradient.includes(colors.secondary[500])
                              ? colors.secondary[500]
                              : colors.accent.lightBlue,
                            0.1,
                          ),
                          color:
                            option.gradient.includes(colors.primary[500])
                              ? colors.primary[700]
                              : option.gradient.includes(colors.secondary[500])
                              ? colors.secondary[700]
                              : "#059669",
                          fontWeight: 500,
                        }}
                      />
                    ))}
                  </Stack>
                </Box>

                {/* Features */}
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      color: colors.text.primary,
                      mb: 2,
                    }}
                  >
                    Tính năng chính:
                  </Typography>
                  <Box sx={{ display: "grid", gap: 1 }}>
                    {option.features.slice(0, 4).map((feature, index) => (
                      <Box
                        key={index}
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <CheckCircle
                          sx={{
                            color: option.gradient.includes(colors.primary[500])
                              ? colors.primary[500]
                              : option.gradient.includes(colors.secondary[500])
                              ? colors.secondary[500]
                              : colors.accent.lightBlue,
                            fontSize: 16,
                            mr: 1,
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{ color: colors.text.tertiary, fontSize: "0.9rem" }}
                        >
                          {feature}
                        </Typography>
                      </Box>
                    ))}
                    {option.features.length > 4 && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: colors.text.tertiary,
                          fontStyle: "italic",
                          mt: 1,
                        }}
                      >
                        +{option.features.length - 4} tính năng khác
                      </Typography>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Continue Button */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleContinue}
            endIcon={<ArrowForward />}
            sx={{
              px: 8,
              py: 2.5,
              fontSize: "1.2rem",
              fontWeight: 600,
              background:
                selectedOption?.gradient || colors.background.gradient.primary,
              borderRadius: 4,
              textTransform: "none",
              boxShadow: `0 8px 24px ${alpha(
                selectedOption?.gradient.includes(colors.primary[500])
                  ? colors.primary[500]
                  : selectedOption?.gradient.includes(colors.secondary[500])
                  ? colors.secondary[500]
                  : colors.accent.lightBlue,
                0.3,
              )}`,
              border: "none",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: `0 12px 32px ${alpha(
                  selectedOption?.gradient.includes(colors.primary[500])
                    ? colors.primary[500]
                    : selectedOption?.gradient.includes(colors.secondary[500])
                    ? colors.secondary[500]
                    : colors.accent.lightBlue,
                  0.4,
                )}`,
              },
              transition: "all 0.3s ease",
            }}
          >
            Bắt đầu với {selectedOption?.title}
          </Button>
        </Box>

        {/* Why Choose Us Section */}
        <Paper
          elevation={0}
          sx={{
            p: 6,
            borderRadius: 4,
            background: colors.background.gradient.secondary,
            color: "white",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              mb: 4,
            }}
          >
            Tại sao chọn EduHubVN?
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              gap: 4,
              mt: 4,
            }}
          >
            {[
              {
                icon: <Security sx={{ fontSize: 48 }} />,
                title: "Bảo mật tuyệt đối",
                description: "Dữ liệu được mã hóa và bảo vệ tối đa",
              },
              {
                icon: <TrendingUp sx={{ fontSize: 48 }} />,
                title: "Tăng trưởng nhanh",
                description: "Hơn 90% người dùng đạt mục tiêu sau 6 tháng",
              },
              // {
              //   icon: <AutoAwesome sx={{ fontSize: 48 }} />,
              //   title: "Công nghệ tiên tiến",
              //   description: "AI hỗ trợ tối ưu trải nghiệm học tập",
              // },
              {
                icon: <Groups sx={{ fontSize: 48 }} />,
                title: "Cộng đồng lớn",
                description: "Kết nối với hàng nghìn chuyên gia",
              },
            ].map((item, index) => (
              <Box key={index} sx={{ textAlign: "center" }}>
                <Box
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    width: 80,
                    height: 80,
                    borderRadius: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  {item.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {item.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ opacity: 0.9, lineHeight: 1.5 }}
                >
                  {item.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default HomePage;
