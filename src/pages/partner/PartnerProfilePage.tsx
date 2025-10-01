import {
  Assignment,
  Business,
  Edit,
  Email,
  Language,
  LocationOn,
  Phone,
  CameraAlt,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  LinearProgress,
  Typography,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import PartnerProfileUpdateDialog from "../../components/parner-dialog/PartnerUpdateInfoDialog";
import { setPartnerProfile } from "../../redux/slice/PartnerProfileSlice";
import { colors } from "../../theme/colors";
import {
  getIndustryText,
  getStatus,
  getStatusColor,
} from "../../utils/ChangeText";
import { API } from "../../utils/Fetch";

const PartnerProfilePage = () => {
  const dispatch = useDispatch();
  const userProfile = useSelector((state: any) => state.userProfile);
  const partnerProfile = useSelector((state: any) => state.partnerProfile);
  const [loading, setLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await API.partner.getPartnerProfile();
        if (!response.data.success) {
          throw new Error("Failed to fetch partner profile");
        }
        const data = response.data.data;
        dispatch(setPartnerProfile(data));
      } catch (error) {
        console.error("Error fetching partner profile:", error);
        toast.error("Không thể tải thông tin đối tác");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);



  const handleEditClick = () => {
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
  };

  const handleLogoClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = handleLogoUpload;
    input.click();
  };

  const handleLogoUpload = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file hình ảnh!");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File không được vượt quá 5MB!");
      return;
    }

    try {
      setIsUploadingLogo(true);
      
      // Upload logo using API from Fetch.ts
      const response = await API.user.updateLogoPartner(file);
      
      if (response.data.success) {
        // Refresh partner profile to get updated logo URL
        const profileResponse = await API.partner.getPartnerProfile();
        dispatch(setPartnerProfile(profileResponse.data.data));
        toast.success("Cập nhật logo thành công!");
      } else {
        toast.error("Có lỗi xảy ra khi cập nhật logo!");
      }
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast.error("Có lỗi xảy ra khi cập nhật logo!");
    } finally {
      setIsUploadingLogo(false);
    }
  };

  if (loading && !partnerProfile) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6">Đang tải thông tin...</Typography>
        </Box>
      </Box>
    );
  }

  const partner = partnerProfile?.partner || {};
  const partnerUpdate = partnerProfile?.partnerUpdate || null;

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.background.secondary }}
    >
      <Container maxWidth="xl" className="py-8">
        {/* Header Section - Banner tương tự InstitutionProfilePage */}
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
            {/* Logo */}
            <Box sx={{ position: "relative" }}>
              <Tooltip title="Click để thay đổi logo" arrow>
                <Avatar
                  src={partner.logoUrl}
                  onClick={handleLogoClick}
                  sx={{
                    width: 140,
                    height: 140,
                    border: "4px solid rgba(255,255,255,0.5)",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
                    fontSize: "3rem",
                    fontWeight: 700,
                    backgroundColor: colors.background.primary,
                    cursor: "pointer",
                    "&:hover": {
                      opacity: 0.8,
                      transform: "scale(1.02)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  <Business
                    sx={{ fontSize: "4rem", color: colors.primary[500] }}
                  />
                </Avatar>
              </Tooltip>
              
              {/* Camera overlay on hover */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: "50%",
                  background: "rgba(0,0,0,0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0,
                  cursor: "pointer",
                  transition: "opacity 0.3s ease",
                  "&:hover": {
                    opacity: 1,
                  },
                }}
                onClick={handleLogoClick}
              >
                {isUploadingLogo ? (
                  <CircularProgress size={32} sx={{ color: "white" }} />
                ) : (
                  <CameraAlt sx={{ fontSize: "2rem", color: "white" }} />
                )}
              </Box>
            </Box>

            {/* Partner Info */}
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
                  {/* Tên tổ chức */}
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      mb: 0,
                      color: "#fff",
                      textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                    }}
                  >
                    {partner.organizationName || "Chưa cập nhật"}
                  </Typography>

                  {/* Lĩnh vực hoạt động */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    <Chip
                      label={getIndustryText(partner.industry)}
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

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    alignItems: { xs: "center", md: "flex-end" },
                  }}
                >
                  <Button
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={handleEditClick}
                    disabled={loading}
                    sx={{
                      background: "rgba(255,255,255,0.2)",
                      color: "white",
                      fontWeight: 600,
                      borderRadius: 3,
                      textTransform: "none",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.3)",
                      "&:hover": {
                        background: "rgba(255,255,255,0.3)",
                        transform: "translateY(-1px)",
                      },
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : partnerUpdate ? (
                      "Xem lại chỉnh sửa"
                    ) : (
                      "Chỉnh sửa"
                    )}
                  </Button>

                  {/* Chip trạng thái bên dưới nút */}
                  {partnerUpdate && (
                    <Chip
                      label={`Trạng thái: ${getStatus(partnerUpdate.status)}`}
                      size="medium"
                      color={getStatusColor(partnerUpdate.status)}
                      sx={{
                        color: "#fff",
                        fontWeight: 600,
                        borderRadius: "16px",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                      }}
                    />
                  )}
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
                  <Assignment fontSize="small" />
                  <span>
                    ĐKKD:{" "}
                    {partner.businessRegistrationNumber || "Chưa cập nhật"}
                  </span>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Email fontSize="small" />
                  {partner.email || userProfile?.email || "Chưa cập nhật"}
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Phone fontSize="small" />
                  {partner.phoneNumber || "Chưa cập nhật"}
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <LocationOn fontSize="small" />
                  {partner.address || "Chưa cập nhật"}
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Language fontSize="small" />
                  {partner.website || "Chưa cập nhật"}
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Partner Update Dialog */}
        <PartnerProfileUpdateDialog
          open={editDialogOpen}
          onClose={handleCloseEditDialog}
          partner={partner}
          partnerUpdate={partnerUpdate}
        />
      </Container>
    </div>
  );
};

export default PartnerProfilePage;
