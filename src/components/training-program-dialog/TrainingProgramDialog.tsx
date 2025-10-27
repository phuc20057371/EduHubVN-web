import {
  Assignment as AssignmentIcon,
  Business as BusinessIcon,
  Close as CloseIcon,
  Description as DescriptionIcon,
  MenuBook as MenuBookIcon,
  School as SchoolIcon,
  Star as StarIcon,
  AccessTime as TimeIcon,
  Restore as RestoreIcon,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import type { TrainingProgram } from "../../types/TrainingProgram";
import { getProgramMode, getProgramType } from "../../utils/ChangeText";
import { API } from "../../utils/Fetch";
import { toast } from "react-toastify";
import ConfirmUnarchiveTrainingProgramDialog from "../general-dialog/ConfirmUnarchiveTrainingProgramDialog";

interface TrainingProgramDialogProps {
  open: boolean;
  onClose: () => void;
  program: TrainingProgram | null;
  onProgramUpdated?: () => void;
}

const TrainingProgramDialog: React.FC<TrainingProgramDialogProps> = ({
  open,
  onClose,
  program,
  onProgramUpdated,
}) => {
  const theme = useTheme();
  const userProfile = useSelector((state: any) => state.userProfile);
  
  // State cho dialog khôi phục
  const [unarchiveDialogOpen, setUnarchiveDialogOpen] = useState(false);
  const [unarchiveLoading, setUnarchiveLoading] = useState(false);
  
  if (!program) return null;

  // Xử lý khôi phục chương trình
  const handleUnarchiveProgram = () => {
    setUnarchiveDialogOpen(true);
  };

  const handleConfirmUnarchive = async () => {
    if (!program) return;

    try {
      setUnarchiveLoading(true);
      const response = await API.program.unarchiveTrainingProgram(program.id);
      
      if (response.data && response.data.success) {
        toast.success("Khôi phục chương trình đào tạo thành công!");
        setUnarchiveDialogOpen(false);
        onProgramUpdated?.();
        onClose();
      } else {
        toast.error("Khôi phục chương trình đào tạo không thành công!");
      }
    } catch (error: any) {
      console.error("Error unarchiving training program:", error);
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi khôi phục chương trình đào tạo"
      );
    } finally {
      setUnarchiveLoading(false);
    }
  };

  const handleUnarchiveDialogClose = () => {
    if (!unarchiveLoading) {
      setUnarchiveDialogOpen(false);
    }
  };

  // Helper functions
  const formatDate = (date: Date) => {
    if (!date) return "Chưa xác định";
    try {
      return format(new Date(date), "dd/MM/yyyy", { locale: vi });
    } catch {
      return "Ngày không hợp lệ";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getProgramStatusLabel = (status: string) => {
    switch (status) {
      case "REVIEW":
        return "Đang xét duyệt";
      case "PUBLISHED":
        return "Đã xuất bản";
      case "UNLISTED":
        return "Chưa niêm yết";
      case "ARCHIVED":
        return "Đã lưu trữ";
      default:
        return status;
    }
  };

  const getProgramStatusColor = (status: string) => {
    switch (status) {
      case "REVIEW":
        return "warning";
      case "PUBLISHED":
        return "success";
      case "UNLISTED":
        return "info";
      case "ARCHIVED":
        return "error";
      default:
        return "default";
    }
  };

  const getRequestStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Chờ xử lý";
      case "APPROVED":
        return "Đã phê duyệt";
      case "REJECTED":
        return "Đã từ chối";
      default:
        return status;
    }
  };

  const getRequestStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "warning";
      case "APPROVED":
        return "success";
      case "REJECTED":
        return "error";
      default:
        return "default";
    }
  };

  const renderInternalInfo = () => (
    <Card>
      <CardContent>
        <Typography
          variant="h6"
          sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
        >
          <BusinessIcon color="primary" />
          Thông tin nội bộ
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* First row */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="body2" color="textSecondary">
                Mã chương trình:
              </Typography>
              <Typography variant="body1" fontWeight="500">
                {program.trainingProgramId || "Chưa có"}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="body2" color="textSecondary">
                Trạng thái:
              </Typography>
              <Chip
                label={getProgramStatusLabel(program.programStatus)}
                color={getProgramStatusColor(program.programStatus) as any}
                size="small"
              />
            </Box>
          </Box>

          {/* Second row */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="body2" color="textSecondary">
                Giá niêm yết:
              </Typography>
              <Typography variant="body1" fontWeight="500" color="primary">
                {formatCurrency(program.listedPrice || program.publicPrice)}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="body2" color="textSecondary">
                Giá nội bộ:
              </Typography>
              <Typography variant="body1" fontWeight="500" color="error">
                {formatCurrency(program.internalPrice)}
              </Typography>
            </Box>
          </Box>

          {/* Third row */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="body2" color="textSecondary">
                Hiển thị giá:
              </Typography>
              <Chip
                label={program.priceVisible ? "Có" : "Không"}
                color={program.priceVisible ? "success" : "default"}
                size="small"
              />
            </Box>
          </Box>

          {/* Tài liệu đính kèm */}
          {program.trainingProgramRequest?.fileUrl && (
            <Box>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                Tài liệu đính kèm
              </Typography>
              <Button
                variant="outlined"
                startIcon={<DescriptionIcon />}
                href={program.trainingProgramRequest.fileUrl}
                target="_blank"
                size="small"
              >
                Xem tài liệu
              </Button>
            </Box>
          )}

          {/* Giáo trình */}
          {program.syllabusFileUrl && (
            <Box>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                Đề cương
              </Typography>
              <Button
                variant="outlined"
                startIcon={<MenuBookIcon />}
                href={program.syllabusFileUrl}
                target="_blank"
                size="small"
              >
                Xem giáo trình
              </Button>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );

  const renderPublicInfo = () => (
    <Card>
      <CardContent>
        <Typography
          variant="h6"
          sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
        >
          <SchoolIcon color="primary" />
          Thông tin công khai
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Banner */}
          {program.bannerUrl && (
            <Box>
              <img
                src={program.bannerUrl}
                alt="Program Banner"
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: theme.shape.borderRadius,
                }}
              />
            </Box>
          )}

          {/* Title */}
          <Box>
            <Typography variant="h5" fontWeight="600" sx={{ mb: 1 }}>
              {program.title}
            </Typography>
            {program.subTitle && (
              <Typography variant="h6" color="textSecondary">
                {program.subTitle}
              </Typography>
            )}
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <Box sx={{ minWidth: 200, flex: 1 }}>
              <Typography variant="body2" color="textSecondary">
                Giá công khai
              </Typography>
              <Typography variant="body1" fontWeight="600" color="primary">
                {formatCurrency(program.publicPrice)}
              </Typography>
            </Box>
            <Box sx={{ minWidth: 200, flex: 1 }}>
              <Typography variant="body2" color="textSecondary">
                Đánh giá
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <StarIcon color="warning" fontSize="small" />
                <Typography variant="body1">
                  {program.rating ? program.rating.toFixed(1) : "Chưa có"}
                </Typography>
              </Box>
            </Box>
          </Box>
          {program.tags && program.tags.length > 0 && (
            <Box>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                Tags
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {program.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Program Details */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Row 1: Training Mode + Location/Classroom Link */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <Box sx={{ minWidth: 200, flex: 1 }}>
                <Typography variant="body2" color="textSecondary">
                  Hình thức đào tạo
                </Typography>
                <Chip
                  label={getProgramMode(program.programMode)}
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              </Box>
              <Box sx={{ minWidth: 200, flex: 1 }}>
                <Typography variant="body2" color="textSecondary">
                  {program.programMode === "ONLINE"
                    ? "Link phòng học"
                    : "Địa điểm"}
                </Typography>
                {program.classroomLink ? (
                  <Typography variant="body1">
                    {program.classroomLink}
                  </Typography>
                ) : (
                  <Typography variant="body1">Chưa có</Typography>
                )}
              </Box>
            </Box>

            {/* Row 2: Program Type + Schedule */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <Box sx={{ minWidth: 200, flex: 1 }}>
                <Typography variant="body2" color="textSecondary">
                  Loại chương trình
                </Typography>
                <Typography variant="body1">
                  {getProgramType(program.programType)}
                </Typography>
              </Box>
              <Box sx={{ minWidth: 200, flex: 1 }}>
                <Typography variant="body2" color="textSecondary">
                  Lịch học
                </Typography>
                <Typography variant="body1">
                  {program.scheduleDetail || "Chưa xác định"}
                </Typography>
              </Box>
            </Box>

            {/* Row 3: Time Period */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <Box sx={{ minWidth: 200, flex: 1 }}>
                <Typography variant="body2" color="textSecondary">
                  Thời gian
                </Typography>
                <Typography variant="body1">
                  {formatDate(program.startDate)} -{" "}
                  {formatDate(program.endDate)}
                </Typography>
              </Box>
              <Box sx={{ minWidth: 200, flex: 1 }}>
                <Typography variant="body2" color="textSecondary">
                  Quy mô
                </Typography>
                <Typography variant="body1">
                  {program.scale || "Chưa xác định"}
                </Typography>
              </Box>
            </Box>

            {/* Row 4: Duration + Students */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <Box sx={{ minWidth: 200, flex: 1 }}>
                <Typography variant="body2" color="textSecondary">
                  Thời lượng
                </Typography>
                <Typography variant="body1">
                  {program.durationHours} giờ ({program.durationSessions} buổi)
                </Typography>
              </Box>
              <Box sx={{ minWidth: 200, flex: 1 }}>
                <Typography variant="body2" color="textSecondary">
                  Số học viên
                </Typography>
                <Typography variant="body1">
                  {program.minStudents} - {program.maxStudents}
                </Typography>
              </Box>
            </Box>

            {/* Row 5: Certificate Type + Certificate Issuer */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <Box sx={{ minWidth: 200, flex: 1 }}>
                <Typography variant="body2" color="textSecondary">
                  Loại chứng chỉ
                </Typography>
                <Typography variant="body1">
                  {program.completionCertificateType || "Chưa xác định"}
                </Typography>
              </Box>
              <Box sx={{ minWidth: 200, flex: 1 }}>
                <Typography variant="body2" color="textSecondary">
                  Đơn vị cấp chứng chỉ
                </Typography>
                <Typography variant="body1">
                  {program.certificateIssuer || "Chưa xác định"}
                </Typography>
              </Box>
            </Box>

            {/* Row 6: Opening Condition + Equipment Requirement */}
            {(program.openingCondition || program.equipmentRequirement) && (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                <Box sx={{ minWidth: 200, flex: 1 }}>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    Điều kiện khai giảng
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                    {program.openingCondition || "Chưa có thông tin"}
                  </Typography>
                </Box>
                <Box sx={{ minWidth: 200, flex: 1 }}>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    Yêu cầu thiết bị
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                    {program.equipmentRequirement || "Chưa có thông tin"}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>

          {/* Additional Info */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* First row: Learning Objectives + Target Audience */}
            <Box
              sx={{
                display: "flex",
                gap: 3,
                flexDirection: { xs: "column", md: "row" },
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mb: 1 }}
                >
                  Kiến thức được học
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                  {program.learningObjectives || "Chưa có thông tin"}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mb: 1 }}
                >
                  Đối tượng học viên
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                  {program.targetAudience || "Chưa có thông tin"}
                </Typography>
              </Box>
            </Box>

            {/* Second row: Requirements + Learning Outcomes */}
            <Box
              sx={{
                display: "flex",
                gap: 3,
                flexDirection: { xs: "column", md: "row" },
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mb: 1 }}
                >
                  Yêu cầu đầu vào
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                  {program.requirements || "Chưa có thông tin"}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mb: 1 }}
                >
                  Kết quả đầu ra
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                  {program.learningOutcomes || "Chưa có thông tin"}
                </Typography>
              </Box>
            </Box>

            <Divider />
            <Typography variant="body1" paragraph>
              {program.shortDescription}
            </Typography>
            {program.description && (
              <Typography variant="body1" paragraph>
                {program.description}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const renderUnits = () => (
    <Card
      sx={{ height: "fit-content", maxHeight: { xs: "100vh", lg: "150vh" } }}
    >
      <CardContent>
        <Typography
          variant="h6"
          sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
        >
          <MenuBookIcon color="primary" />
          Danh sách bài học ({program.units?.length || 0})
        </Typography>

        {program.units && program.units.length > 0 ? (
          <Box
            sx={{
              maxHeight: {
                xs: "calc(70vh - 120px)",
                lg: "calc(150vh - 180px)",
              },
              overflowY: "auto",
              overflowX: "hidden",
              pr: 1,
              pt: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                background: theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                borderRadius: "10px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: theme.palette.mode === "dark" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)",
                borderRadius: "10px",
                "&:hover": {
                  background: theme.palette.mode === "dark" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
                },
              },
            }}
          >
            {[...program.units]
              .sort((a, b) => a.orderSection - b.orderSection)
              .map((unit) => (
                <Card
                  key={unit.id}
                  variant="outlined"
                  sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    minHeight: "300px",
                    display: "flex",
                    flexDirection: "column",
                    "&:hover": {
                      boxShadow: theme.shadows[2],
                      transform: "translateY(-1px)",
                    },
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  <CardContent sx={{ p: 2, flex: 1, display: "flex", flexDirection: "column" }}>
                    {/* Header: Số thứ tự + Tiêu đề */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h6" fontWeight="600" sx={{ mb: 0.5 }}>
                        {unit.orderSection}. {unit.title}
                        {/* {unit.lead && (
                          <Chip
                            label="Lead"
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ ml: 1 }}
                          />
                        )} */}
                      </Typography>
                      
                      {/* Số giờ */}
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <TimeIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="primary" fontWeight="500">
                          {unit.durationSection} giờ
                        </Typography>
                      </Box>
                    </Box>

                    {/* Mô tả */}
                    <Typography 
                      variant="body2" 
                      color="textSecondary" 
                      sx={{ 
                        mb: 2, 
                        lineHeight: 1.5,
                        flex: 1,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        minHeight: "3.6em", // Đảm bảo có chiều cao tối thiểu cho 3 dòng
                      }}
                    >
                      {unit.description || "Chưa có mô tả"}
                    </Typography>

                    {/* Banner thông tin giảng viên */}
                    <Paper
                      sx={{
                        p: 2,
                        bgcolor: theme.palette.mode === "dark" ? "grey.900" : "grey.50",
                        borderRadius: 1,
                        border: `1px solid ${theme.palette.divider}`,
                        mt: "auto", // Đẩy xuống dưới
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        {/* Avatar giảng viên */}
                        <Avatar
                          src={unit.lecturer.avatarUrl}
                          sx={{ 
                            width: 48, 
                            height: 48,
                            bgcolor: "primary.main"
                          }}
                        >
                          {unit.lecturer.fullName?.charAt(0) || "G"}
                        </Avatar>

                        {/* Thông tin giảng viên */}
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 0.5 }}>
                            {unit.lecturer.academicRank 
                              ? `${unit.lecturer.academicRank}. ${unit.lecturer.fullName}`
                              : unit.lecturer.fullName
                            }
                            {unit.lead && (
                              <Typography
                                component="span"
                                variant="body2"
                                color="primary"
                                sx={{ ml: 1, fontWeight: 500 }}
                              >
                                (Lead)
                              </Typography>
                            )}
                          </Typography>
                          
                          {/* Chip năm kinh nghiệm - lĩnh vực */}
                          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                            {unit.lecturer.experienceYears && (
                              <Chip
                                label={`${unit.lecturer.experienceYears} năm kinh nghiệm`}
                                size="small"
                                color="info"
                                variant="outlined"
                              />
                            )}
                            {unit.lecturer.specialization && (
                              <Chip
                                label={unit.lecturer.specialization}
                                size="small"
                                color="secondary"
                                variant="outlined"
                              />
                            )}
                          </Box>
                        </Box>
                      </Box>
                    </Paper>
                  </CardContent>
                </Card>
              ))}
          </Box>
        ) : (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <MenuBookIcon
              sx={{ fontSize: 64, color: "text.disabled", mb: 2 }}
            />
            <Typography variant="body1" color="textSecondary">
              Chưa có đơn vị đào tạo nào
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const renderRequest = () => (
    <Card>
      <CardContent>
        <Typography
          variant="h6"
          sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
        >
          <AssignmentIcon color="primary" />
          Yêu cầu đào tạo
        </Typography>

        {program.trainingProgramRequest ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Request Status */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Trạng thái:
              </Typography>
              <Chip
                label={getRequestStatusLabel(
                  program.trainingProgramRequest.status,
                )}
                color={
                  getRequestStatusColor(
                    program.trainingProgramRequest.status,
                  ) as any
                }
                size="small"
              />
            </Box>

            {/* Request Details */}
            <Box>
              <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 1 }}>
                {program.trainingProgramRequest.title}
              </Typography>
              <Typography variant="body1" paragraph>
                {program.trainingProgramRequest.description}
              </Typography>
            </Box>

            {/* Partner Organization */}
            {program.trainingProgramRequest.partnerOrganization && (
              <Paper
                sx={{
                  p: 2,
                  bgcolor:
                    theme.palette.mode === "dark" ? "grey.900" : "grey.50",
                  borderRadius: 1,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 2 }}>
                  Tổ chức đối tác
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  {/* Logo */}
                  <Avatar
                    src={program.trainingProgramRequest.partnerOrganization.logoUrl}
                    sx={{ 
                      width: 56, 
                      height: 56,
                      bgcolor: "primary.main"
                    }}
                  >
                    {program.trainingProgramRequest.partnerOrganization.organizationName?.charAt(0) || "P"}
                  </Avatar>

                  {/* Thông tin tổ chức */}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight="600" sx={{ mb: 0.5 }}>
                      {program.trainingProgramRequest.partnerOrganization.organizationName}
                    </Typography>
                    
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                      {program.trainingProgramRequest.partnerOrganization.industry}
                    </Typography>

                    <Typography variant="body2" color="text.primary">
                      <strong>Đại diện:</strong> {program.trainingProgramRequest.partnerOrganization.representativeName} 
                      {program.trainingProgramRequest.partnerOrganization.position && 
                        ` - ${program.trainingProgramRequest.partnerOrganization.position}`
                      }
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            )}
          </Box>
        ) : (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <AssignmentIcon
              sx={{ fontSize: 64, color: "text.disabled", mb: 2 }}
            />
            <Typography variant="body1" color="textSecondary">
              Chưa có yêu cầu đào tạo
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 1,
          maxHeight: "95vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${theme.palette.divider}`,
          pb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar sx={{ bgcolor: "primary.main" }}>
            <SchoolIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="600">
              Chi tiết chương trình đào tạo
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {program.title}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, overflowY: "auto" }}>
        {/* Main layout: Public Info on left, Internal Info + Units on right */}
        <Box
          sx={{
            display: "flex",
            gap: 3,
            mb: 3,
            flexDirection: { xs: "column", lg: "row" },
            alignItems: "stretch",
            pt: 3,
          }}
        >
          {/* Left: Public Info */}
          <Box
            sx={{
              flex: { lg: "1 1 350px", xl: "1 1 400px" },
              minWidth: { lg: 350, xl: 400 },
              order: { xs: 1, lg: 1 },
            }}
          >
            {renderPublicInfo()}
          </Box>

          {/* Right: Internal Info + Units */}
          <Box
            sx={{
              flex: { lg: "0 0 380px", xl: "0 0 420px" },
              minWidth: { lg: 380, xl: 420 },
              order: { xs: 2, lg: 2 },
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            {/* Internal Info at top */}
            {renderInternalInfo()}

            {/* Units below */}
            {renderUnits()}
          </Box>
        </Box>

        {/* Bottom: Training Program Request */}
        {program.trainingProgramRequest && renderRequest()}

        {/* Date info at bottom right */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mt: 3,
            pt: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 4,
              flexDirection: { xs: "row", sm: "row" },
              alignItems: { xs: "flex-end", sm: "center" },
            }}
          >
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="body2" color="textSecondary">
                Ngày tạo
              </Typography>
              <Typography variant="body2" fontWeight="500">
                {formatDate(program.createdAt)}
              </Typography>
            </Box>
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="body2" color="textSecondary">
                Cập nhật lần cuối
              </Typography>
              <Typography variant="body2" fontWeight="500">
                {formatDate(program.updatedAt)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{ borderTop: `1px solid ${theme.palette.divider}`, p: 3 }}
      >
        <Box sx={{ display: "flex", gap: 2, width: "100%", justifyContent: "flex-end" }}>
          {program.programStatus === "ARCHIVED" && 
           (userProfile?.role === "ADMIN" || userProfile?.permissions?.includes("PROGRAM_ARCHIVE")) && (
            <Button 
              onClick={handleUnarchiveProgram}
              variant="contained" 
              color="success"
              startIcon={<RestoreIcon />}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 1,
                background: "linear-gradient(135deg, #4caf50 0%, #388e3c 100%)",
                boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)",
                "&:hover": {
                  background: "linear-gradient(135deg, #388e3c 0%, #2e7d32 100%)",
                  boxShadow: "0 6px 16px rgba(76, 175, 80, 0.4)",
                },
              }}
            >
              Khôi phục
            </Button>
          )}
          <Button onClick={onClose} variant="outlined">
            Đóng
          </Button>
        </Box>
      </DialogActions>

      {/* Dialog xác nhận khôi phục */}
      <ConfirmUnarchiveTrainingProgramDialog
        open={unarchiveDialogOpen}
        onClose={handleUnarchiveDialogClose}
        program={program}
        loading={unarchiveLoading}
        onConfirm={handleConfirmUnarchive}
      />
    </Dialog>
  );
};

export default TrainingProgramDialog;
