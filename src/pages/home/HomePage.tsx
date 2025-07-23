import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Button,
  Paper,
  Avatar,
  Chip,
} from "@mui/material";
import {
  School,
  Person,
  Business,
  ArrowForward,
  CheckCircle,
  Groups,
  WorkspacePremium,
} from "@mui/icons-material";
import eduhubLogo from "../../assets/eduhub-03.png";

interface ProfileOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  route: string;
  features: string[];
  badge?: string;
}

const HomePage = () => {
  const navigate = useNavigate();
  const [selectedProfile, setSelectedProfile] = useState<string>("lecturer");

  const profileOptions: ProfileOption[] = [
    {
      id: "lecturer",
      title: "Giảng viên",
      description: "Dành cho các giảng viên, giáo viên muốn tham gia giảng dạy",
      icon: <Person sx={{ fontSize: 40 }} />,
      color: "#2e7d32",
      route: "/register-lecturer",
      badge: "Phổ biến",
      features: [
        "Quản lý hồ sơ cá nhân",
        "Nhận lời mời giảng dạy",
        "Quản lý khóa học",
        "Theo dõi lịch trình",
      ],
    },
    {
      id: "institution",
      title: "Trường/Trung tâm đào tạo",
      description: "Dành cho các trường học, trung tâm đào tạo",
      icon: <School sx={{ fontSize: 40 }} />,
      color: "#1976d2",
      route: "/register-institution",
      badge: "Đối tác",
      features: [
        "Tìm kiếm giảng viên",
        "Hợp tác đào tạo",
        "Mua khóa học",
        "Quản lý sinh viên",
      ],
    },
    {
      id: "partner",
      title: "Đơn vị tổ chức",
      description: "Dành cho các doanh nghiệp, tổ chức muốn hợp tác",
      icon: <Business sx={{ fontSize: 40 }} />,
      color: "#ed6c02",
      route: "/register-partner",
      badge: "Doanh nghiệp",
      features: [
        "Tìm kiếm giảng viên",
        "Tuyển dụng nhân tài",
        "Quản lý đề tài",
        "Phát triển chương trình",
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

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <img
              src={eduhubLogo}
              style={{ width: "100px", height: "100px" }}
              alt="EduHub Logo"
            />
            <Typography
              variant="h3"
              component="h1"
              sx={{ fontWeight: "bold", color: "primary.main" }}
            >
              EduHubVN
            </Typography>
          </Box>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
            Chọn loại hồ sơ để bắt đầu đăng ký
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {/* Tham gia cộng đồng giáo dục lớn nhất Việt Nam */}
          </Typography>
        </Box>

        {/* Profile Options */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
            mb: 4,
            justifyContent: "center",
          }}
        >
          {profileOptions.map((option) => (
            <Box
              key={option.id}
              sx={{
                flex: { xs: "1 1 100%", md: "1 1 calc(33.333% - 24px)" },
                maxWidth: { xs: "100%", md: "380px" },
                minWidth: "300px",
              }}
            >
              <Card
                sx={{
                  height: "100%",
                  position: "relative",
                  transition: "all 0.3s ease",
                  transform:
                    selectedProfile === option.id ? "scale(1.05)" : "scale(1)",
                  border:
                    selectedProfile === option.id
                      ? `3px solid ${option.color}`
                      : "2px solid transparent",
                  boxShadow: selectedProfile === option.id ? 4 : 1,
                  "&:hover": {
                    transform: "scale(1.02)",
                    boxShadow: 3,
                    cursor: "pointer",
                  },
                }}
              >
                <CardActionArea
                  onClick={() => handleCardClick(option.id)}
                  sx={{ height: "100%", p: 3 }}
                >
                  <CardContent
                    sx={{
                      textAlign: "center",
                      height: "100%",
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
                          top: 0,
                          right: 0,
                          bgcolor: option.color,
                          color: "white",
                          fontWeight: "bold",
                        }}
                      />
                    )}

                    {/* Selection Indicator */}
                    {selectedProfile === option.id && (
                      <Box sx={{ position: "absolute", top: 8, left: 8 }}>
                        <CheckCircle
                          sx={{ color: option.color, fontSize: 32 }}
                        />
                      </Box>
                    )}

                    {/* Icon */}
                    <Avatar
                      sx={{
                        bgcolor: option.color,
                        width: 90,
                        height: 90,
                        mx: "auto",
                        mb: 2,
                        boxShadow: 2,
                      }}
                    >
                      {option.icon}
                    </Avatar>

                    {/* Title */}
                    <Typography
                      variant="h5"
                      component="h2"
                      gutterBottom
                      sx={{
                        fontWeight: "bold",
                        color:
                          selectedProfile === option.id
                            ? option.color
                            : "text.primary",
                      }}
                    >
                      {option.title}
                    </Typography>

                    {/* Description */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 3, minHeight: "48px" }}
                    >
                      {option.description}
                    </Typography>

                    {/* Features */}
                    <Box sx={{ textAlign: "left" }}>
                      {option.features.map((feature, index) => (
                        <Box
                          key={index}
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}
                        >
                          <CheckCircle
                            sx={{ color: option.color, fontSize: 16, mr: 1 }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {feature}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Box>
          ))}
        </Box>

        {/* Continue Button */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleContinue}
            endIcon={<ArrowForward />}
            sx={{
              px: 6,
              py: 2,
              fontSize: "1.2rem",
              fontWeight: "bold",
              bgcolor: selectedProfile
                ? profileOptions.find((o) => o.id === selectedProfile)?.color
                : "primary.main",
              borderRadius: 3,
              textTransform: "none",
              boxShadow: 3,
              "&:hover": {
                bgcolor: selectedProfile
                  ? profileOptions.find((o) => o.id === selectedProfile)?.color
                  : "primary.dark",
                opacity: 0.9,
                transform: "translateY(-2px)",
                boxShadow: 4,
              },
              transition: "all 0.3s ease",
            }}
          >
            Tiếp tục đăng ký
          </Button>
        </Box>

        {/* Stats Section */}
        <Paper
          elevation={2}
          sx={{
            p: 4,
            bgcolor: "background.paper",
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{ textAlign: "center", mb: 3 }}
          >
            Tham gia cộng đồng EduHub
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <Box sx={{ textAlign: "center", minWidth: "150px" }}>
              <School sx={{ fontSize: 48, color: "success.main", mb: 1 }} />
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", color: "success.main" }}
              >
                1000+
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Giảng viên
              </Typography>
            </Box>

            <Box sx={{ textAlign: "center", minWidth: "150px" }}>
              <Groups sx={{ fontSize: 48, color: "primary.main", mb: 1 }} />
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", color: "primary.main" }}
              >
                200+
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Trường/Trung tâm
              </Typography>
            </Box>

            <Box sx={{ textAlign: "center", minWidth: "150px" }}>
              <WorkspacePremium
                sx={{ fontSize: 48, color: "warning.main", mb: 1 }}
              />
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", color: "warning.main" }}
              >
                500+
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Đề tài nghiên cứu
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default HomePage;
