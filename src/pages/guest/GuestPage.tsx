
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
} from "@mui/material";
import {
  School,
  Person,
  Business,
  ArrowForward,
  CheckCircle,
} from "@mui/icons-material";

interface ProfileOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  route: string;
  features: string[];
}

const GuestPage = () => {
  const navigate = useNavigate();
  const [selectedProfile, setSelectedProfile] = useState<string>("");

  const profileOptions: ProfileOption[] = [
    {
      id: "lecturer",
      title: "Giảng viên",
      description: "Dành cho các giảng viên, giáo viên muốn tham gia giảng dạy",
      icon: <Person sx={{ fontSize: 40 }} />,
      color: "#2e7d32",
      route: "/register-lecturer",
      features: [
        "Quản lý hồ sơ cá nhân",
        "Nhận lời mời giảng dạy",
        "Quản lý khóa học",
        "Theo dõi lịch trình"
      ]
    },
    {
      id: "institution",
      title: "Cơ sở Giáo dục",
      description: "Dành cho các trường học, trung tâm đào tạo",
      icon: <School sx={{ fontSize: 40 }} />,
      color: "#1976d2",
      route: "/register-institution",
      features: [
        "Tìm kiếm giảng viên",
        "Hợp tác đào tạo",
        "Mua khóa học",
    
      ]
    },
    {
      id: "partner",
      title: "Đối tác",
      description: "Dành cho các doanh nghiệp, tổ chức muốn hợp tác",
      icon: <Business sx={{ fontSize: 40 }} />,
      color: "#ed6c02",
      route: "/register-partner",
      features: [
        "Tìm kiếm giảng viên",
        "Tuyển dụng nhân tài",
        "Quản lý đề tài",
      
      ]
    }
  ];

  const handleCardClick = (profileId: string) => {
    setSelectedProfile(profileId);
  };

  const handleContinue = () => {
    if (selectedProfile) {

      const selectedOption = profileOptions.find(option => option.id === selectedProfile);
      console.log("Selected Option:", selectedOption?.route);
      
      if (selectedOption) {
        navigate(selectedOption.route);
      }
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
            Chào mừng đến với EduHub
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            Nền tảng kết nối giáo dục hàng đầu Việt Nam
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Chọn loại hồ sơ phù hợp để bắt đầu hành trình của bạn
          </Typography>
        </Box>

        {/* Profile Options */}
        <Box 
          sx={{ 
            display: "flex", 
            flexWrap: "wrap", 
            gap: 4, 
            mb: 4,
            justifyContent: "center"
          }}
        >
          {profileOptions.map((option) => (
            <Box 
              key={option.id}
              sx={{ 
                flex: { xs: "1 1 100%", md: "1 1 calc(33.333% - 32px)" },
                maxWidth: { xs: "100%", md: "400px" }
              }}
            >
              <Card
                sx={{
                  height: "100%",
                  position: "relative",
                  transition: "all 0.3s ease",
                  transform: selectedProfile === option.id ? "scale(1.05)" : "scale(1)",
                  border: selectedProfile === option.id ? `3px solid ${option.color}` : "1px solid #e0e0e0",
                  "&:hover": {
                    transform: "scale(1.02)",
                    boxShadow: 3,
                  }
                }}
              >
                <CardActionArea
                  onClick={() => handleCardClick(option.id)}
                  sx={{ height: "100%", p: 3 }}
                >
                  <CardContent sx={{ textAlign: "center", height: "100%" }}>
                    {/* Selection Indicator */}
                    {selectedProfile === option.id && (
                      <Box sx={{ position: "absolute", top: 16, right: 16 }}>
                        <CheckCircle sx={{ color: option.color, fontSize: 28 }} />
                      </Box>
                    )}

                    {/* Icon */}
                    <Avatar
                      sx={{
                        bgcolor: option.color,
                        width: 80,
                        height: 80,
                        mx: "auto",
                        mb: 2,
                      }}
                    >
                      {option.icon}
                    </Avatar>

                    {/* Title */}
                    <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: "bold" }}>
                      {option.title}
                    </Typography>

                    {/* Description */}
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      {option.description}
                    </Typography>

                    {/* Features */}
                    <Box sx={{ textAlign: "left" }}>
                      {option.features.map((feature, index) => (
                        <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                          <CheckCircle sx={{ color: option.color, fontSize: 16, mr: 1 }} />
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
        <Box sx={{ textAlign: "center" }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleContinue}
            disabled={!selectedProfile}
            endIcon={<ArrowForward />}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: "1.1rem",
              bgcolor: selectedProfile ? profileOptions.find(o => o.id === selectedProfile)?.color : "grey.400",
              "&:hover": {
                bgcolor: selectedProfile ? profileOptions.find(o => o.id === selectedProfile)?.color : "grey.400",
                opacity: 0.9,
              }
            }}
          >
            {selectedProfile ? "Tiếp tục đăng ký" : "Vui lòng chọn loại hồ sơ"}
          </Button>
        </Box>

        {/* Additional Info */}
        <Paper sx={{ mt: 6, p: 4, bgcolor: "primary.main", color: "white" }}>
          <Typography variant="h6" gutterBottom sx={{ textAlign: "center" }}>
            Tại sao chọn EduHub
          </Typography>
          <Box 
            sx={{ 
              display: "flex", 
              flexWrap: "wrap", 
              gap: 3, 
              mt: 2,
              justifyContent: "center"
            }}
          >
            <Box 
              sx={{ 
                flex: { xs: "1 1 100%", md: "1 1 calc(33.333% - 24px)" },
                textAlign: "center",
                minWidth: "250px"
              }}
            >
              <School sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" gutterBottom>Chất lượng cao</Typography>
              <Typography variant="body2">
                 Some text
              </Typography>
            </Box>
            <Box 
              sx={{ 
                flex: { xs: "1 1 100%", md: "1 1 calc(33.333% - 24px)" },
                textAlign: "center",
                minWidth: "250px"
              }}
            >
              <Business sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" gutterBottom>Kết nối rộng</Typography>
              <Typography variant="body2">
                Some text
              </Typography>
            </Box>
            <Box 
              sx={{ 
                flex: { xs: "1 1 100%", md: "1 1 calc(33.333% - 24px)" },
                textAlign: "center",
                minWidth: "250px"
              }}
            >
              <Person sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" gutterBottom>Hỗ trợ 24/7</Typography>
              <Typography variant="body2">
                Đội ngũ hỗ trợ chuyên nghiệp luôn sẵn sàng giúp đỡ
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default GuestPage;