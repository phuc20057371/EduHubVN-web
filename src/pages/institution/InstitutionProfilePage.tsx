import { Edit, Email, LocationOn, Phone, School } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import { colors } from "../../theme/colors";

const InstitutionProfilePage = () => {
  // Giả sử dữ liệu trung tâm lấy từ redux
  // const institutionProfile = useSelector((state: any) => state.institutionProfile);
  const userProfile = useSelector((state: any) => state.userProfile);


  const institution = userProfile?.educationInstitution;
  if (!institution) {
    return (
      <Container className="py-8">
        <div className="flex h-64 items-center justify-center">
          <Typography variant="h6" className="text-gray-600">
            Đang tải thông tin trung tâm...
          </Typography>
        </div>
      </Container>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.background.secondary }}
    >
      <Container maxWidth="xl" className="py-8">
        {/* Banner cá nhân Trung tâm đào tạo */}
        <Card
          className="mb-8 overflow-hidden"
          sx={{
            borderRadius: 4,
            boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
            background: `linear-gradient(135deg, ${colors.primary[600]} 0%, ${colors.secondary[700]} 100%)`,
            color: "white",
            position: "relative",
          }}
        >
          {/* Pattern overlay */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3C/g%3E%3C/svg%3E")`,
              zIndex: 0,
            }}
          />

          <CardContent
            sx={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "center", md: "flex-start" },
              gap: 4,
              p: { xs: 4, md: 6 },
            }}
          >
            {/* Avatar */}
            <Box sx={{ position: "relative" }}>
              <Avatar
                src={institution.avatarUrl || ""}
                sx={{
                  width: 140,
                  height: 140,
                  border: "4px solid rgba(255,255,255,0.5)",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
                  fontSize: "3rem",
                  fontWeight: 700,
                }}
              >
                {institution.name?.charAt(0)}
              </Avatar>
            </Box>

            {/* Info */}
            <Box sx={{ flex: 1 }}>
              {/* Name & Buttons */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  justifyContent: "space-between",
                  alignItems: { xs: "center", md: "flex-start" },
                  gap: 2,
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {/* Tên trung tâm */}
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      mb: 0,
                      color: "#fff",
                      textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                    }}
                  >
                    {institution.name}
                  </Typography>

                  {/* Lĩnh vực chuyên ngành */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    <Chip
                      label={institution.specialization || "Chưa cập nhật"}
                      size="medium"
                      sx={{
                        background: "linear-gradient(135deg, #FF9800, #FFC107)",
                        color: "#fff",
                        fontWeight: 600,
                        border: "none",
                        borderRadius: "16px",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                      }}
                    />
                  </Box>
                </Box>

                <Box gap={2} display="flex">
                  <Button
                    variant="contained"
                    startIcon={<Edit />}
                    sx={{
                      background: colors.background.gradient.secondary,
                      color: "white",
                      fontWeight: 600,
                      borderRadius: 3,
                      textTransform: "none",
                      "&:hover": {
                        background: `linear-gradient(135deg, ${colors.primary[600]} 0%, ${colors.secondary[700]} 100%)`,
                        transform: "translateY(-1px)",
                      },
                    }}
                  >
                    Chỉnh sửa hồ sơ
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() =>
                      window.open(
                        `/institution-info/${institution.id}`,
                        "_blank",
                      )
                    }
                    sx={{
                      background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.secondary[600]} 100%)`,
                      color: "white",
                      fontWeight: 600,
                      borderRadius: 3,
                      textTransform: "none",
                      "&:hover": {
                        background: `linear-gradient(135deg, ${colors.primary[600]} 0%, ${colors.secondary[700]} 100%)`,
                        transform: "translateY(-1px)",
                      },
                    }}
                  >
                    CV của trung tâm
                  </Button>
                </Box>
              </Box>

              {/* Contact info */}
              <Box
                sx={{
                  mt: 3,
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 2,
                }}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <School fontSize="small" />{" "}
                  {institution.type || "Trung tâm đào tạo"}
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Email fontSize="small" />{" "}
                  {institution.email || userProfile?.email || "Chưa cập nhật"}
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <LocationOn fontSize="small" />{" "}
                  {institution.address || "Chưa cập nhật"}
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Phone fontSize="small" />{" "}
                  {institution.phoneNumber || "Chưa cập nhật"}
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
        {/* ...các phần khác của trang... */}
      </Container>
    </div>
  );
};

export default InstitutionProfilePage;
