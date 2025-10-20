import {
  Assignment as AssignmentIcon,
  Business as BusinessIcon,
  Close as CloseIcon,
  Description as DescriptionIcon,
  MenuBook as MenuBookIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Star as StarIcon,
  AccessTime as TimeIcon,
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
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import React from "react";
import type { TrainingProgram } from "../../types/TrainingProgram";

interface TrainingProgramDialogProps {
  open: boolean;
  onClose: () => void;
  program: TrainingProgram | null;
}

const TrainingProgramDialog: React.FC<TrainingProgramDialogProps> = ({
  open,
  onClose,
  program,
}) => {
  const theme = useTheme();

  if (!program) return null;

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

  const getProgramModeLabel = (mode: string) => {
    switch (mode) {
      case "ONLINE":
        return "Trực tuyến";
      case "OFFLINE":
        return "Trực tiếp";
      case "HYBRID":
        return "Kết hợp";
      default:
        return mode;
    }
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
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <Box sx={{ minWidth: 200, flex: 1 }}>
              <Typography variant="body2" color="textSecondary">
                Mã chương trình
              </Typography>
              <Typography variant="body1" fontWeight="500">
                {program.trainingProgramId || "Chưa có"}
              </Typography>
            </Box>
            <Box sx={{ minWidth: 200, flex: 1 }}>
              <Typography variant="body2" color="textSecondary">
                Giá nội bộ
              </Typography>
              <Typography variant="body1" fontWeight="500" color="error">
                {formatCurrency(program.internalPrice)}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <Box sx={{ minWidth: 200, flex: 1 }}>
              <Typography variant="body2" color="textSecondary">
                Trạng thái
              </Typography>
              <Chip
                label={getProgramStatusLabel(program.programStatus)}
                color={getProgramStatusColor(program.programStatus) as any}
                size="small"
                sx={{ mt: 0.5 }}
              />
            </Box>
            <Box sx={{ minWidth: 200, flex: 1 }}>
              <Typography variant="body2" color="textSecondary">
                Hiển thị giá
              </Typography>
              <Chip
                label={program.priceVisible ? "Có" : "Không"}
                color={program.priceVisible ? "success" : "default"}
                size="small"
                sx={{ mt: 0.5 }}
              />
            </Box>
          </Box>

          {program.user && (
            <Box>
              <Typography variant="body2" color="textSecondary">
                {" "}
              </Typography>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}
              >
                <Avatar sx={{ width: 24, height: 24 }}>
                  <PersonIcon fontSize="small" />
                </Avatar>
                <Typography variant="body1">{program.user.email}</Typography>
              </Box>
            </Box>
          )}

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
                Giáo trình
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

          {/* Title and Description */}
          <Box>
            <Typography variant="h5" fontWeight="600" sx={{ mb: 1 }}>
              {program.title}
            </Typography>
            {program.subTitle && (
              <Typography variant="h6" color="textSecondary" sx={{ mb: 2 }}>
                {program.subTitle}
              </Typography>
            )}
            <Typography variant="body1" paragraph>
              {program.shortDescription}
            </Typography>
            {program.description && (
              <Typography variant="body1" paragraph>
                {program.description}
              </Typography>
            )}
          </Box>

          {/* Program Details */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <Box sx={{ minWidth: 200, flex: 1 }}>
                <Typography variant="body2" color="textSecondary">
                  Hình thức đào tạo
                </Typography>
                <Chip
                  label={getProgramModeLabel(program.programMode)}
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              </Box>
              <Box sx={{ minWidth: 200, flex: 1 }}>
                <Typography variant="body2" color="textSecondary">
                  Loại chương trình
                </Typography>
                <Typography variant="body1">{program.programType}</Typography>
              </Box>
            </Box>

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
                  Lịch học
                </Typography>
                <Typography variant="body1">
                  {program.scheduleDetail || "Chưa xác định"}
                </Typography>
              </Box>
            </Box>

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
                  {program.minStudents} - {program.maxStudents} học viên
                </Typography>
              </Box>
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
          </Box>

          {/* Additional Info */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                Mục tiêu học tập
              </Typography>
              <Typography variant="body1">
                {program.learningObjectives || "Chưa có thông tin"}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                Đối tượng học viên
              </Typography>
              <Typography variant="body1">
                {program.targetAudience || "Chưa có thông tin"}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                Yêu cầu đầu vào
              </Typography>
              <Typography variant="body1">
                {program.requirements || "Chưa có thông tin"}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                Kết quả đào tạo
              </Typography>
              <Typography variant="body1">
                {program.learningOutcomes || "Chưa có thông tin"}
              </Typography>
            </Box>

            {program.tags && program.tags.length > 0 && (
              <Box>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mb: 1 }}
                >
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
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const renderUnits = () => (
    <Card sx={{ height: "fit-content", maxHeight: { xs: "60vh", lg: "75vh" } }}>
      <CardContent>
        <Typography
          variant="h6"
          sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
        >
          <MenuBookIcon color="primary" />
          Danh sách đơn vị đào tạo ({program.units?.length || 0})
        </Typography>

        {program.units && program.units.length > 0 ? (
          <Box
            sx={{
              maxHeight: { xs: "calc(60vh - 120px)", lg: "calc(75vh - 120px)" },
              overflowY: "auto",
              pr: 1,
            }}
          >
            <List>
              {[...program.units]
                .sort((a, b) => a.orderSection - b.orderSection)
                .map((unit, index) => (
                  <React.Fragment key={unit.id}>
                    <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: "primary.main" }}>
                          {unit.orderSection}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mb: 1,
                            }}
                          >
                            <Typography variant="subtitle1" fontWeight="600">
                              {unit.title}
                            </Typography>
                            {unit.lead && (
                              <Chip
                                label="Lead"
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              paragraph
                            >
                              {unit.description}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                flexWrap: "wrap",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                }}
                              >
                                <TimeIcon fontSize="small" color="action" />
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  {unit.durationSection} giờ
                                </Typography>
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                }}
                              >
                                <PersonIcon fontSize="small" color="action" />
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  {unit.lecturer.fullName}
                                </Typography>
                              </Box>
                              {unit.lecturer.specialization && (
                                <Chip
                                  label={unit.lecturer.specialization}
                                  size="small"
                                  variant="outlined"
                                />
                              )}
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < program.units.length - 1 && (
                      <Divider component="li" />
                    )}
                  </React.Fragment>
                ))}
            </List>
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
                }}
              >
                <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 2 }}>
                  Tổ chức đối tác
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {program.trainingProgramRequest.partnerOrganization
                      .logoUrl && (
                      <Avatar
                        src={
                          program.trainingProgramRequest.partnerOrganization
                            .logoUrl
                        }
                        sx={{ width: 48, height: 48 }}
                      />
                    )}
                    <Box>
                      <Typography variant="subtitle1" fontWeight="600">
                        {
                          program.trainingProgramRequest.partnerOrganization
                            .organizationName
                        }
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {
                          program.trainingProgramRequest.partnerOrganization
                            .industry
                        }
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                    <Box sx={{ minWidth: 200, flex: 1 }}>
                      <Typography variant="body2" color="textSecondary">
                        Đại diện
                      </Typography>
                      <Typography variant="body1">
                        {
                          program.trainingProgramRequest.partnerOrganization
                            .representativeName
                        }{" "}
                        -{" "}
                        {
                          program.trainingProgramRequest.partnerOrganization
                            .position
                        }
                      </Typography>
                    </Box>
                    <Box sx={{ minWidth: 200, flex: 1 }}>
                      <Typography variant="body2" color="textSecondary">
                        Mã số kinh doanh
                      </Typography>
                      <Typography variant="body1">
                        {
                          program.trainingProgramRequest.partnerOrganization
                            .businessRegistrationNumber
                        }
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                    <Box sx={{ minWidth: 200, flex: 1 }}>
                      <Typography variant="body2" color="textSecondary">
                        Điện thoại
                      </Typography>
                      <Typography variant="body1">
                        {
                          program.trainingProgramRequest.partnerOrganization
                            .phoneNumber
                        }
                      </Typography>
                    </Box>
                    <Box sx={{ minWidth: 200, flex: 1 }}>
                      <Typography variant="body2" color="textSecondary">
                        Website
                      </Typography>
                      <Typography
                        variant="body1"
                        component="a"
                        href={`https://${program.trainingProgramRequest.partnerOrganization.website}`}
                        target="_blank"
                        sx={{ color: "primary.main", textDecoration: "none" }}
                      >
                        {
                          program.trainingProgramRequest.partnerOrganization
                            .website
                        }
                      </Typography>
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Địa chỉ
                    </Typography>
                    <Typography variant="body1">
                      {
                        program.trainingProgramRequest.partnerOrganization
                          .address
                      }
                    </Typography>
                  </Box>

                  {program.trainingProgramRequest.partnerOrganization
                    .description && (
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        Mô tả
                      </Typography>
                      <Typography variant="body1">
                        {
                          program.trainingProgramRequest.partnerOrganization
                            .description
                        }
                      </Typography>
                    </Box>
                  )}
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
          borderRadius: 2,
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

      <DialogContent sx={{ p: 3 }}>
        {/* Main layout: 3 columns - Internal Info, Public Info, Units */}
        <Box
          sx={{
            display: "flex",
            gap: 3,
            mb: 3,
            flexDirection: { xs: "column", lg: "row" },
            alignItems: "stretch",
          }}
        >
          {/* Left: Internal Info */}
          <Box
            sx={{
              flex: { lg: "0 0 300px", xl: "0 0 320px" },
              minWidth: { lg: 300, xl: 320 },
              order: { xs: 1, lg: 1 },
            }}
          >
            {renderInternalInfo()}
          </Box>

          {/* Center: Public Info */}
          <Box
            sx={{
              flex: { lg: "1 1 350px", xl: "1 1 400px" },
              minWidth: { lg: 350, xl: 400 },
              order: { xs: 2, lg: 2 },
            }}
          >
            {renderPublicInfo()}
          </Box>

          {/* Right: Units */}
          <Box
            sx={{
              flex: { lg: "0 0 350px", xl: "0 0 400px" },
              minWidth: { lg: 350, xl: 400 },
              order: { xs: 3, lg: 3 },
            }}
          >
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
        <Button onClick={onClose} variant="outlined">
          Đóng
        </Button>
        <Button variant="contained" startIcon={<SchoolIcon />}>
          Chỉnh sửa
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TrainingProgramDialog;
