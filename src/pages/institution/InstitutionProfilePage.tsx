import {
  Assignment,
  Edit,
  Email,
  Language,
  LocationOn,
  Phone,
  School
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
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import InstitutionUpdateInfoDialog from "../../components/institution-dialog/InstitutionUpdateInfoDialog";
import { setInstitutionProfile } from "../../redux/slice/InstitutionProfileSlice";
import { InstitutionMessageHandler } from "../../services/InstitutionMessageHandler";
import WebSocketService from "../../services/WebSocketService";
import { colors } from "../../theme/colors";
import {
  getInstitutionTypeText,
  getStatus,
  getStatusColor
} from "../../utils/ChangeText";
import { API } from "../../utils/Fetch";
import { Typography } from "@mui/material";

const InstitutionProfilePage = () => {
  const dispatch = useDispatch();
  const userProfile = useSelector((state: any) => state.userProfile);
  const institutionProfile = useSelector(
    (state: any) => state.institutionProfile,
  );

  // Local state
  const [loading, setLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await API.institution.getInstitutionProfile();
        if (!response.data.success) {
          throw new Error("Failed to fetch institution profile");
        }
        const data = response.data.data;
        dispatch(setInstitutionProfile(data));
      } catch (error) {
        console.error("Error fetching institution profile:", error);
        toast.error("Không thể tải thông tin trường/trung tâm");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (userProfile && userProfile.role === "SCHOOL") {
      WebSocketService.connect(
        userProfile,
        () => console.log("✅ School WebSocket connected"),
        (message) => {
          InstitutionMessageHandler.handleIncomingMessage(message, dispatch);
        },
      );
    }

    return () => {
      WebSocketService.disconnect();
    };
  }, [userProfile, dispatch]);

  const handleEditClick = () => {
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
  };

  if (loading && !institutionProfile) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6">Đang tải thông tin...</Typography>
        </Box>
      </Box>
    );
  }

  const institution = institutionProfile?.institution || {};
  const institutionUpdate = institutionProfile?.institutionUpdate || null;

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.background.secondary }}
    >
      <Container maxWidth="xl" className="py-8">
        {/* Header Section - Banner tương tự LecturerProfilePage */}
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
              <Avatar
                src={institution.logoUrl}
                sx={{
                  width: 140,
                  height: 140,
                  border: "4px solid rgba(255,255,255,0.5)",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
                  fontSize: "3rem",
                  fontWeight: 700,
                  backgroundColor: colors.background.primary,
                }}
              >
                <School sx={{ fontSize: "4rem", color: colors.primary[500] }} />
              </Avatar>
              
            </Box>

            {/* Institution Info */}
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
                  {/* Tên trường/trung tâm */}
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      mb: 0,
                      color: "#fff",
                      textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                    }}
                  >
                    {institution.institutionName || "Chưa cập nhật"}
                  </Typography>

                  {/* Loại trường */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    <Chip
                      label={getInstitutionTypeText(institution.institutionType)}
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

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: { xs: "center", md: "flex-end" } }}>
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
                    ) : (
                      institutionUpdate ? "Xem lại chỉnh sửa" : "Chỉnh sửa"
                    )}
                  </Button>
                  
                  {/* Chip trạng thái bên dưới nút */}
                  {institutionUpdate && (
                    <Chip
                      label={`Trạng thái: ${getStatus(institutionUpdate.status)}`}
                      size="medium"
                      color={getStatusColor(institutionUpdate.status)}
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
                  <span>ĐKKD: {institution.businessRegistrationNumber}</span>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Email fontSize="small" />
                  {institution.email || userProfile?.email || "Chưa cập nhật"}
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Phone fontSize="small" />
                  {institution.phoneNumber}
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <LocationOn fontSize="small" />
                  {institution.address}
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Language fontSize="small" />
                  {institution.website}
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Institution Update Dialog */}
        <InstitutionUpdateInfoDialog
          open={editDialogOpen}
          onClose={handleCloseEditDialog}
          institution={institution}
          institutionUpdate={institutionUpdate}
        />
      </Container>
    </div>
  );
};

export default InstitutionProfilePage;
