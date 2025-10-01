import {
  ArrowForward,
  Business,
  CheckCircle,
  Person,
  School,
  Star
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Stack,
  Typography,
  alpha
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import eduhubLogo from "../../assets/eduhub-03.png";
import { useColors } from "../../hooks/useColors";

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
  const colors = useColors();
  const [selectedProfile, setSelectedProfile] = useState<string>("lecturer");

  const profileOptions: ProfileOption[] = [
    {
      id: "lecturer",
      title: "Giảng viên",
      subtitle: "Chia sẻ kiến thức - Tạo dựng thương hiệu",
      description:
        "Nền tảng dành cho các chuyên gia muốn chia sẻ kiến thức và xây dựng thương hiệu cá nhân",
      icon: <Person sx={{ fontSize: 48 }} />,
      gradient: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.dark} 100%)`,
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
        "Nhận lời mời giảng dạy từ doanh nghiệp",
        "Theo dõi doanh thu và thống kê chi tiết",
        "Xây dựng thương hiệu cá nhân",
      ],
    },
    {
      id: "institution",
      title: "Trường học",
      subtitle: "Đào tạo chất lượng - Hợp tác bền vững",
      description:
        "Tìm kiếm giảng viên và khóa học chất lượng cao cho sinh viên của bạn",
      icon: <School sx={{ fontSize: 48 }} />,
      gradient: `linear-gradient(135deg, ${colors.secondary.main} 0%, ${colors.secondary.dark} 100%)`,
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
        "Báo cáo và thống kê chi tiết",
      ],
    },
    {
      id: "partner",
      title: "Doanh nghiệp",
      subtitle: "Đào tạo nhân sự - Phát triển bền vững",
      description:
        "Nền tảng hợp tác chiến lược cho các doanh nghiệp muốn đầu tư vào phát triển nguồn nhân lực",
      icon: <Business sx={{ fontSize: 48 }} />,
      gradient: `linear-gradient(135deg, ${colors.accent.blue} 0%, #059669 100%)`,
      route: "/register-partner",
      badge: "Giải pháp doanh nghiệp",
      stats: { label: "Doanh nghiệp tin tướng", value: "180+" },
      targetAudience: ["Công ty công nghệ", "Tập đoàn", "Startup", "SME"],
      features: [
        "Tuyển dụng giảng viên cho dự án nội bộ",
        "Phát triển chương trình đào tạo riêng",
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
          background: colors.gradients.primary,
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
                  borderRadius: 1,
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
                borderRadius: 1,
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
                        option.id === "lecturer"
                          ? colors.primary.main
                          : option.id === "institution"
                          ? colors.secondary.main
                          : colors.accent.blue,
                        0.3,
                      )}`
                    : "0 4px 20px rgba(0,0,0,0.08)",
                border:
                  selectedProfile === option.id
                    ? `2px solid ${option.id === "lecturer"
                        ? colors.primary.main
                        : option.id === "institution"
                        ? colors.secondary.main
                        : colors.accent.blue}`
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
                      borderRadius: 1,
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
                            option.id === "lecturer"
                              ? colors.primary.main
                              : option.id === "institution"
                              ? colors.secondary.main
                              : colors.accent.blue,
                            0.1,
                          ),
                          color:
                            option.id === "lecturer"
                              ? colors.primary.dark
                              : option.id === "institution"
                              ? colors.secondary.dark
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
                            color: option.id === "lecturer"
                              ? colors.primary.main
                              : option.id === "institution"
                              ? colors.secondary.main
                              : colors.accent.blue,
                            fontSize: 16,
                            mr: 1,
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{ color: colors.text.primary, fontSize: "0.9rem" }}
                        >
                          {feature}
                        </Typography>
                      </Box>
                    ))}
                    {option.features.length > 4 && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: colors.text.primary,
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
                selectedOption?.gradient || colors.gradients.primary,
              borderRadius: 1,
              textTransform: "none",
              boxShadow: `0 8px 24px ${alpha(
                selectedOption?.id === "lecturer"
                  ? colors.primary.main
                  : selectedOption?.id === "institution"
                  ? colors.secondary.main
                  : colors.accent.blue,
                0.3,
              )}`,
              border: "none",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: `0 12px 32px ${alpha(
                  selectedOption?.id === "lecturer"
                    ? colors.primary.main
                    : selectedOption?.id === "institution"
                    ? colors.secondary.main
                    : colors.accent.blue,
                  0.4,
                )}`,
              },
              transition: "all 0.3s ease",
            }}
          >
            Bắt đầu với {selectedOption?.title}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
