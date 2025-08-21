import {
  Add,
  CalendarToday,
  Delete,
  Edit,
  ExpandMore,
  Link as LinkIcon,
  LocationOn,
  School,
  Group,
  AttachMoney,
  Language,
  Description,
  Category,
  TrendingUp,
  CheckCircle,
  CheckBox,
  CheckBoxOutlineBlank,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Chip,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { colors } from "../../../theme/colors";
import { getStatusText, getVietnameseScale, getVietnameseCourseType } from "../../../utils/ChangeText";
import { API } from "../../../utils/Fetch";
import { setLecturerProfile } from "../../../redux/slice/LecturerProfileSlice";

interface CoursesTabProps {
  attendedTrainingCourses: any[];
  ownedTrainingCourses: any[];
  getStatusColor: (status: string) => string;
  formatDate: (dateString: string) => string;
  onAddAttended?: () => void;
  onAddOwned?: () => void;
  onEdit?: (item: any) => void;
}

const CoursesTab = ({
  attendedTrainingCourses,
  ownedTrainingCourses,
  formatDate,
  onAddAttended,
  onAddOwned,
  onEdit,
}: CoursesTabProps) => {
  const dispatch = useDispatch();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [deleteType, setDeleteType] = useState<'owned' | 'attended'>('owned');

  const handleDelete = (item: any, type: 'owned' | 'attended') => {
    setItemToDelete(item);
    setDeleteType(type);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      if (deleteType === 'owned') {
        const response = await API.lecturer.deleteOwnedCourse(itemToDelete.id);
        if (response.data.success) {
          const response = await API.lecturer.getLecturerProfile();
          dispatch(setLecturerProfile(response.data.data));
          toast.success("Xóa khóa học sở hữu thành công");
        }
      } else {
        const response = await API.lecturer.deleteAttendedCourse(itemToDelete.id);
        if (response.data.success) {
          const response = await API.lecturer.getLecturerProfile();
          dispatch(setLecturerProfile(response.data.data));
          toast.success("Xóa khóa học đã tham gia thành công");
        }
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Có lỗi xảy ra khi xóa khóa học");
    } finally {
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
    setItemToDelete(null);
  };

  const renderCourseCard = (item: any, isOwned: boolean = false) => (
    <Accordion
      key={item.id}
      className="transition-all duration-300"
      sx={{
        borderRadius: 3,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        "&:before": {
          display: "none",
        },
        "&.Mui-expanded": {
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          transform: "translateY(-2px)",
        },
        mb: 2,
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        sx={{
          background: isOwned 
            ? "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)"
            : "linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)",
          color: "white",
          borderRadius: "10px",
          minHeight: "80px",
          "& .MuiAccordionSummary-content": {
            margin: "16px 0",
          },
          "& .MuiAccordionSummary-expandIconWrapper": {
            color: "white",
          },
          "&.Mui-expanded": {
            borderRadius: "10px 10px 0 0",
            minHeight: "80px",
          },
        }}
      >
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-4">
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "12px",
                background: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isOwned ? (
                <School sx={{ color: "white", fontSize: 24 }} />
              ) : (
                <Group sx={{ color: "white", fontSize: 24 }} />
              )}
            </Box>
            <div className="flex-1">
              <Typography
                variant="h6"
                sx={{ 
                  color: "white",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  mb: 0.5,
                }}
              >
                {item.name || item.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{ 
                  color: "rgba(255,255,255,0.9)",
                  fontSize: "0.875rem",
                }}
              >
                {isOwned ? `Chủ đề: ${item.topic || 'Không xác định'}` : `Tổ chức: ${item.organizer || 'Không xác định'}`}
              </Typography>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Chip
              label={getStatusText(item.status)}
              size="small"
              sx={{
                fontWeight: 600,
                background: "rgba(255,255,255,0.9)",
                height: "28px",
                color:
                  item.status === "APPROVED"
                    ? "#047857"
                    : item.status === "PENDING"
                      ? "#D97706"
                      : "#DC2626",
              }}
            />
          </div>
        </div>
      </AccordionSummary>

      <AccordionDetails
        sx={{
          p: 0,
          background: "white",
          borderRadius: "0 0 10px 10px",
        }}
      >
        <Box sx={{ p: 3 }}>
          {/* Header with Edit/Delete buttons in top-right */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
            <Typography
              variant="h6"
              sx={{
                color: colors.text.primary,
                fontWeight: 700,
                fontSize: "0.95rem",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Category sx={{ fontSize: 18, color: "#8b5cf6" }} />
              Thông tin khóa học
            </Typography>
            
            {/* Edit and Delete buttons in top-right corner */}
            <Box sx={{ display: "flex", gap: 1 }}>
              {onEdit && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => onEdit(item)}
                  sx={{
                    minWidth: "auto",
                    width: 32,
                    height: 32,
                    borderRadius: "8px",
                    borderColor: isOwned ? "#8B5CF6" : "#14B8A6",
                    color: isOwned ? "#8B5CF6" : "#14B8A6",
                    "&:hover": {
                      borderColor: isOwned ? "#6D28D9" : "#0D9488",
                      backgroundColor: "rgba(139, 92, 246, 0.05)",
                    },
                  }}
                >
                  <Edit sx={{ fontSize: 16 }} />
                </Button>
              )}

              <Button
                variant="outlined"
                size="small"
                onClick={() => handleDelete(item, isOwned ? 'owned' : 'attended')}
                sx={{
                  minWidth: "auto",
                  width: 32,
                  height: 32,
                  borderRadius: "8px",
                  borderColor: "#EF4444",
                  color: "#EF4444",
                  "&:hover": {
                    borderColor: "#DC2626",
                    backgroundColor: "#FEF2F2",
                  },
                }}
              >
                <Delete sx={{ fontSize: 16 }} />
              </Button>
            </Box>
          </Box>
          
          {/* Thumbnail - Compact display */}
          {isOwned && item.thumbnailUrl && (
            <Box sx={{ mb: 2 }}>
              <img
                src={item.thumbnailUrl}
                alt={item.title || item.name}
                style={{
                  width: "100%",
                  maxWidth: "150px",
                  height: "90px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  border: "1px solid #E5E7EB",
                }}
              />
            </Box>
          )}

          {/* Chips Section - Compact */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
            {/* Price as Chip */}
            {isOwned && item.price && (
              <Chip
                icon={<AttachMoney sx={{ fontSize: 16, color: "white !important" }} />}
                label={`${item.price.toLocaleString('vi-VN')} VNĐ`}
                size="small"
                sx={{
                  background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                  color: "white",
                  fontWeight: 600,
                  "& .MuiChip-icon": {
                    color: "white",
                  },
                }}
              />
            )}

            {/* Language as Chip */}
            {isOwned && item.language && (
              <Chip
                icon={<Language sx={{ fontSize: 16, color: "white !important" }} />}
                label={item.language === "Vietnamese" ? "Tiếng Việt" : item.language}
                size="small"
                sx={{
                  background: "linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)",
                  color: "white",
                  fontWeight: 600,
                  "& .MuiChip-icon": {
                    color: "white",
                  },
                }}
              />
            )}
          </Box>

          {/* Action Buttons - Compact */}
          <Box sx={{ mb: 2 }}>
            <div className="flex flex-wrap gap-2">
              {/* Link khóa học - Course URL */}
              {isOwned && item.courseUrl && (
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<LinkIcon />}
                  href={item.courseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
                    color: "white",
                    fontWeight: 600,
                    textTransform: "none",
                    borderRadius: 2,
                    px: 2,
                    py: 0.5,
                    fontSize: "0.8rem",
                    "&:hover": {
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  Link khóa học
                </Button>
              )}

              {/* Xem tài liệu - Content URL */}
              {((!isOwned && (item.url || item.contentUrl)) || (isOwned && item.contentUrl)) && (
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<Description />}
                  href={isOwned ? item.contentUrl : (item.url || item.contentUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    background: isOwned
                      ? "linear-gradient(135deg, #10B981 0%, #059669 100%)"
                      : "linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)",
                    color: "white",
                    fontWeight: 600,
                    textTransform: "none",
                    borderRadius: 2,
                    px: 2,
                    py: 0.5,
                    fontSize: "0.8rem",
                    "&:hover": {
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  Xem tài liệu
                </Button>
              )}
            </div>
          </Box>

          {/* Basic Information Grid - Compact */}
          <Box sx={{ mb: 2 }}>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {/* Số giờ (for attended courses) */}
              {!isOwned && item.numberOfHour && (
                <div
                  className="flex items-center gap-3 rounded-lg p-3"
                  style={{
                    background: colors.background.tertiary,
                    border: "1px solid #E5E7EB",
                  }}
                >
                  <AttachMoney className="text-purple-600" fontSize="small" />
                  <div className="flex-1">
                    <Typography
                      variant="caption"
                      sx={{
                        color: colors.text.tertiary,
                        fontWeight: 600,
                        display: "block",
                      }}
                    >
                      Số giờ
                    </Typography>
                    <Typography variant="body2" className="font-medium">
                      {item.numberOfHour} giờ
                    </Typography>
                  </div>
                </div>
              )}

              {/* Loại khóa học */}
              {item.courseType && (
                <div
                  className="flex items-center gap-3 rounded-lg p-3"
                  style={{
                    background: colors.background.tertiary,
                    border: "1px solid #E5E7EB",
                  }}
                >
                  <Category className="text-indigo-600" fontSize="small" />
                  <div className="flex-1">
                    <Typography
                      variant="caption"
                      sx={{
                        color: colors.text.tertiary,
                        fontWeight: 600,
                        display: "block",
                      }}
                    >
                      Loại khóa học
                    </Typography>
                    <Typography variant="body2" className="font-medium">
                      {getVietnameseCourseType(item.courseType)}
                    </Typography>
                  </div>
                </div>
              )}

              {/* Quy mô */}
              {item.scale && (
                <div
                  className="flex items-center gap-3 rounded-lg p-3"
                  style={{
                    background: colors.background.tertiary,
                    border: "1px solid #E5E7EB",
                  }}
                >
                  <TrendingUp className="text-orange-600" fontSize="small" />
                  <div className="flex-1">
                    <Typography
                      variant="caption"
                      sx={{
                        color: colors.text.tertiary,
                        fontWeight: 600,
                        display: "block",
                      }}
                    >
                      Quy mô
                    </Typography>
                    <Typography variant="body2" className="font-medium">
                      {getVietnameseScale(item.scale)}
                    </Typography>
                  </div>
                </div>
              )}

              {/* Trình độ (chỉ hiển thị cho owned courses) */}
              {isOwned && item.level && (
                <div
                  className="flex items-center gap-3 rounded-lg p-3"
                  style={{
                    background: colors.background.tertiary,
                    border: "1px solid #E5E7EB",
                  }}
                >
                  <CheckCircle className="text-emerald-600" fontSize="small" />
                  <div className="flex-1">
                    <Typography
                      variant="caption"
                      sx={{
                        color: colors.text.tertiary,
                        fontWeight: 600,
                        display: "block",
                      }}
                    >
                      Trình độ
                    </Typography>
                    <Typography variant="body2" className="font-medium">
                      {item.level}
                    </Typography>
                  </div>
                </div>
              )}
            </div>
          </Box>

          {/* Nhóm Thời gian & Địa điểm & Hình thức - Compact */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              sx={{
                color: colors.text.primary,
                fontWeight: 700,
                mb: 1.5,
                fontSize: "0.95rem",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <CalendarToday sx={{ fontSize: 18, color: "#6366f1" }} />
              Thông tin thời gian & địa điểm
            </Typography>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {/* Thời gian */}
              <div
                className="flex items-center gap-3 rounded-lg p-3"
                style={{
                  background: colors.background.tertiary,
                  border: "1px solid #E5E7EB",
                }}
              >
                <CalendarToday className="text-blue-600" fontSize="small" />
                <div className="flex-1">
                  <Typography
                    variant="caption"
                    sx={{
                      color: colors.text.tertiary,
                      fontWeight: 600,
                      display: "block",
                    }}
                  >
                    Thời gian
                  </Typography>
                  <Typography variant="body2" className="font-medium">
                    {formatDate(item.startDate)} -{" "}
                    {formatDate(item.endDate)}
                  </Typography>
                </div>
              </div>

              {/* Địa điểm */}
              <div
                className="flex items-center gap-3 rounded-lg p-3"
                style={{
                  background: colors.background.tertiary,
                  border: "1px solid #E5E7EB",
                }}
              >
                <LocationOn className="text-green-600" fontSize="small" />
                <div className="flex-1">
                  <Typography
                    variant="caption"
                    sx={{
                      color: colors.text.tertiary,
                      fontWeight: 600,
                      display: "block",
                    }}
                  >
                    {isOwned ? "Địa điểm/Link" : "Địa điểm"}
                  </Typography>
                  <Typography variant="body2" className="font-medium">
                    {item.location || item.address || "Không có thông tin"}
                  </Typography>
                </div>
              </div>

              {/* Hình thức học as simple checkbox (chỉ hiển thị cho owned courses) */}
              {isOwned && typeof item.isOnline !== 'undefined' && (
                <div className="flex items-center gap-2">
                  {item.isOnline ? (
                    <CheckBox sx={{ color: "#10B981", fontSize: 20 }} />
                  ) : (
                    <CheckBoxOutlineBlank sx={{ color: "#6B7280", fontSize: 20 }} />
                  )}
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {item.isOnline ? "Online" : "Offline"}
                  </Typography>
                </div>
              )}
            </div>
          </Box>

          {/* Yêu cầu (chỉ hiển thị cho owned courses) - Compact */}
          {isOwned && item.requirements && (
            <Box
              sx={{ 
                mb: 2,
                p: 3,
                borderRadius: "8px",
                background: "rgba(139, 92, 246, 0.08)",
                border: "1px solid rgba(139, 92, 246, 0.2)",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: colors.text.tertiary,
                  fontWeight: 600,
                  display: "block",
                  mb: 1,
                }}
              >
                Yêu cầu
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: colors.text.secondary,
                  lineHeight: 1.6,
                }}
              >
                {item.requirements}
              </Typography>
            </Box>
          )}

          {/* Mô tả - Compact */}
          {item.description && (
            <Box
              sx={{ 
                mb: 2,
                p: 3,
                borderRadius: "8px",
                background: isOwned 
                  ? "rgba(139, 92, 246, 0.1)" 
                  : "rgba(20, 184, 166, 0.1)",
                border: `1px solid ${isOwned ? "rgba(139, 92, 246, 0.3)" : "rgba(20, 184, 166, 0.3)"}`,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: colors.text.tertiary,
                  fontWeight: 600,
                  display: "block",
                  mb: 1,
                }}
              >
                Mô tả
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: colors.text.secondary,
                  lineHeight: 1.6,
                }}
              >
                {item.description}
              </Typography>
            </Box>
          )}

          {/* Admin Note - Compact */}
          {item.adminNote && (
            <Box
              sx={{
                p: 3,
                borderRadius: "8px",
                background: "#FEF3C7",
                border: "1px solid #F59E0B",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "#92400E",
                  fontWeight: 600,
                  display: "block",
                  mb: 1,
                }}
              >
                Ghi chú của quản trị viên
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#92400E" }}
              >
                {item.adminNote}
              </Typography>
            </Box>
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Typography
          variant="h6"
          sx={{ color: colors.text.primary, fontWeight: 600 }}
        >
          Kinh nghiệm Đào tạo ({(attendedTrainingCourses?.length || 0) + (ownedTrainingCourses?.length || 0)})
        </Typography>
      </div>

      {/* Owned Training Courses Section */}
      {(ownedTrainingCourses?.length > 0 || onAddOwned) && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(139, 92, 246, 0.3)",
                }}
              >
                <School sx={{ color: "white", fontSize: 24 }} />
              </Box>
              <div>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#6D28D9",
                    fontWeight: 700,
                    fontSize: "1.2rem",
                  }}
                >
                  Khóa học đang sở hữu ({ownedTrainingCourses?.length || 0})
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: colors.text.tertiary,
                    fontSize: "0.875rem",
                  }}
                >
                  Các khóa học bạn đang sở hữu và quản lý
                </Typography>
              </div>
            </div>
            {onAddOwned && (
              <Button
                variant="outlined"
                startIcon={<Add sx={{ fontSize: 18 }} />}
                onClick={onAddOwned}
                size="small"
                sx={{
                  borderColor: "#8B5CF6",
                  color: "#8B5CF6",
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: 2,
                  px: 2,
                  py: 0.5,
                  fontSize: "0.875rem",
                  minWidth: "auto",
                  height: "32px",
                  "&:hover": {
                    borderColor: "#6D28D9",
                    backgroundColor: "rgba(139, 92, 246, 0.05)",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                Thêm
              </Button>
            )}
          </div>
          
          {ownedTrainingCourses && ownedTrainingCourses.length > 0 ? (
            <div className="space-y-4">
              {ownedTrainingCourses.map((item: any) => renderCourseCard(item, true))}
            </div>
          ) : (
            <Box
              sx={{
                p: 6,
                borderRadius: 4,
                background: "rgba(139, 92, 246, 0.05)",
                border: "2px dashed #8B5CF6",
                textAlign: "center",
              }}
            >
              <School sx={{ fontSize: 56, color: "#8B5CF6", mb: 2 }} />
              <Typography
                variant="h6"
                sx={{ color: "#6D28D9", fontWeight: 700, mb: 1 }}
              >
                Chưa có khóa học nào đang sở hữu
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: colors.text.tertiary }}
              >
                Thêm thông tin về các khóa học bạn đang sở hữu và quản lý
              </Typography>
            </Box>
          )}
        </div>
      )}

      {/* Attended Training Courses Section */}
      {(attendedTrainingCourses?.length > 0 || onAddAttended) && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(20, 184, 166, 0.3)",
                }}
              >
                <Group sx={{ color: "white", fontSize: 24 }} />
              </Box>
              <div>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#0D9488",
                    fontWeight: 700,
                    fontSize: "1.2rem",
                  }}
                >
                  Khóa học đã tham gia ({attendedTrainingCourses?.length || 0})
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: colors.text.tertiary,
                    fontSize: "0.875rem",
                  }}
                >
                  Các khóa học bạn đã tham gia và hoàn thành
                </Typography>
              </div>
            </div>
            {onAddAttended && (
              <Button
                variant="contained"
                startIcon={<Add sx={{ fontSize: 18 }} />}
                onClick={onAddAttended}
                size="small"
                sx={{
                  background: "linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)",
                  color: "white",
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: 2,
                  px: 2,
                  py: 0.5,
                  fontSize: "0.875rem",
                  minWidth: "auto",
                  height: "32px",
                  boxShadow: "0 2px 8px rgba(20, 184, 166, 0.3)",
                  "&:hover": {
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 12px rgba(20, 184, 166, 0.4)",
                  },
                }}
              >
                Thêm
              </Button>
            )}
          </div>
          
          {attendedTrainingCourses && attendedTrainingCourses.length > 0 ? (
            <div className="space-y-4">
              {attendedTrainingCourses.map((item: any) => renderCourseCard(item, false))}
            </div>
          ) : (
            <Box
              sx={{
                p: 6,
                borderRadius: 4,
                background: "rgba(20, 184, 166, 0.05)",
                border: "2px dashed #14B8A6",
                textAlign: "center",
              }}
            >
              <Group sx={{ fontSize: 56, color: "#14B8A6", mb: 2 }} />
              <Typography
                variant="h6"
                sx={{ color: "#0D9488", fontWeight: 700, mb: 1 }}
              >
                Chưa có khóa học nào đã tham gia
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: colors.text.tertiary }}
              >
                Thêm thông tin về các khóa học bạn đã tham gia
              </Typography>
            </Box>
          )}
        </div>
      )}

      {/* No data state */}
      {(!attendedTrainingCourses || attendedTrainingCourses.length === 0) &&
       (!ownedTrainingCourses || ownedTrainingCourses.length === 0) && (
        <Alert severity="info" className="text-center">
          Chưa có thông tin về kinh nghiệm đào tạo
        </Alert>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleCancelDelete}
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 400,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, color: colors.primary[700] }}>
          Xác nhận xóa
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: colors.text.secondary, mb: 2 }}>
            Bạn có chắc chắn muốn xóa {deleteType === 'owned' ? 'khóa học sở hữu' : 'khóa học đã tham gia'} này không? Hành động này không
            thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={handleCancelDelete}
            variant="outlined"
            sx={{
              borderColor: colors.primary[300],
              color: colors.primary[600],
              fontWeight: 600,
              borderRadius: 2,
              textTransform: "none",
              "&:hover": {
                borderColor: colors.primary[400],
                backgroundColor: colors.primary[50],
              },
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            sx={{
              fontWeight: 600,
              borderRadius: 2,
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#d32f2f",
              },
            }}
          >
            Xác nhận xóa
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CoursesTab;
