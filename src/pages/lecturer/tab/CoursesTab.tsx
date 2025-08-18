import {
  Add,
  Assignment,
  CalendarToday,
  Delete,
  Edit,
  ExpandMore,
  Link as LinkIcon,
  LocationOn,
  WorkHistory
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Chip,
  Typography
} from "@mui/material";
import { colors } from "../../../theme/colors";
import { getStatusText } from "../../../utils/ChangeText";

interface CoursesTabProps {
  attendedTrainingCourses: any[];
  ownedTrainingCourses: any[];
  getStatusColor: (status: string) => string;
  formatDate: (dateString: string) => string;
  onAddAttended?: () => void;
  onAddOwned?: () => void;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
}

const CoursesTab = ({ attendedTrainingCourses, ownedTrainingCourses, formatDate, onAddAttended, onAddOwned, onEdit, onDelete }: CoursesTabProps) => {
  const allCourses = [
    ...(attendedTrainingCourses || []),
    ...(ownedTrainingCourses || []),
  ];

  return (
    <div className="space-y-4">
      {/* Header with Add buttons */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <Typography variant="h6" sx={{ color: colors.text.primary, fontWeight: 600 }}>
          Kinh nghiệm Đào tạo ({allCourses?.length || 0})
        </Typography>
        <div className="flex gap-2">
          {onAddAttended && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={onAddAttended}
              sx={{
                background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
                color: "white",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: 2,
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                },
              }}
            >
              Khóa học đã tham gia
            </Button>
          )}
          {onAddOwned && (
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={onAddOwned}
              sx={{
                borderColor: "#8B5CF6",
                color: "#8B5CF6",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: 2,
                "&:hover": {
                  borderColor: "#6D28D9",
                  backgroundColor: "#F3F4F6",
                  transform: "translateY(-1px)",
                },
              }}
            >
              Khóa học đã tổ chức
            </Button>
          )}
        </div>
      </div>
      {allCourses && allCourses.length > 0 ? (
        allCourses.map((item: any) => (
          <Accordion
            key={item.id}
            className="transition-all duration-300"
            sx={{
              borderRadius: 3,
              border: `1px solid ${colors.primary[100]}`,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              "&:before": {
                display: "none",
              },
              "&.Mui-expanded": {
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                transform: "translateY(-2px)",
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              sx={{
                background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
                color: "white",
                borderRadius: "12px 12px 0 0",
                "& .MuiAccordionSummary-expandIconWrapper": {
                  color: "white",
                },
                "&.Mui-expanded": {
                  borderRadius: "12px 12px 0 0",
                },
              }}
            >
              <div className="flex items-center justify-between w-full mr-4">
                <div className="flex items-center gap-3">
                  <Box
                    className="p-2 rounded-lg"
                    sx={{
                      background: "rgba(255,255,255,0.2)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <WorkHistory className="text-white" />
                  </Box>
                  <div>
                    <Typography
                      variant="h6"
                      className="font-bold"
                      sx={{ color: "white" }}
                    >
                      {item.name || item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "rgba(255,255,255,0.9)" }}
                    >
                      {item.organizer}
                    </Typography>
                    {item.referenceId && (
                      <Typography
                        variant="caption"
                        sx={{ color: "rgba(255,255,255,0.7)" }}
                      >
                        ID: {item.referenceId}
                      </Typography>
                    )}
                  </div>
                </div>
                <Chip
                  label={getStatusText(item.status)}
                  size="small"
                  sx={{
                    fontWeight: 600,
                    background: "rgba(255,255,255,0.9)",
                    color:
                      item.status === "APPROVED"
                        ? "#047857"
                        : item.status === "PENDING"
                        ? "#D97706"
                        : "#DC2626",
                  }}
                />
              </div>
            </AccordionSummary>
            
            <AccordionDetails
              sx={{
                p: 0,
                background: "white",
                borderRadius: "0 0 12px 12px",
              }}
            >
              <Box className="p-6">
                <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
                  <div
                    className="flex items-center gap-3 p-3 rounded-lg"
                    style={{
                      background: colors.background.tertiary,
                    }}
                  >
                    <CalendarToday className="text-blue-600" fontSize="small" />
                    <div>
                      <Typography
                        variant="caption"
                        sx={{
                          color: colors.text.tertiary,
                          fontWeight: 600,
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
                  <div
                    className="flex items-center gap-3 p-3 rounded-lg"
                    style={{
                      background: colors.background.tertiary,
                    }}
                  >
                    <LocationOn className="text-green-600" fontSize="small" />
                    <div>
                      <Typography
                        variant="caption"
                        sx={{
                          color: colors.text.tertiary,
                          fontWeight: 600,
                        }}
                      >
                        Địa điểm
                      </Typography>
                      <Typography variant="body2" className="font-medium">
                        {item.location}
                      </Typography>
                    </div>
                  </div>
                  <div
                    className="flex items-center gap-3 p-3 rounded-lg"
                    style={{
                      background: colors.background.tertiary,
                    }}
                  >
                    <Assignment className="text-purple-600" fontSize="small" />
                    <div>
                      <Typography
                        variant="caption"
                        sx={{
                          color: colors.text.tertiary,
                          fontWeight: 600,
                        }}
                      >
                        Số giờ
                      </Typography>
                      <Typography variant="body2" className="font-medium">
                        {item.numberOfHour} giờ
                      </Typography>
                    </div>
                  </div>
                </div>

                {item.description && (
                  <Box
                    className="mb-4 p-4 rounded-lg"
                    sx={{ background: `${colors.primary[25]}` }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: colors.text.tertiary,
                        fontWeight: 600,
                      }}
                    >
                      Mô tả
                    </Typography>
                    <Typography
                      variant="body2"
                      className="mt-1"
                      sx={{
                        color: colors.text.secondary,
                        lineHeight: 1.6,
                      }}
                    >
                      {item.description}
                    </Typography>
                  </Box>
                )}

                {item.adminNote && (
                  <Box
                    className="mb-4 p-3 rounded-lg"
                    sx={{
                      background: "#FEF3C7",
                      border: "1px solid #F59E0B",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#92400E",
                        fontWeight: 600,
                      }}
                    >
                      Ghi chú của quản trị viên
                    </Typography>
                    <Typography
                      variant="body2"
                      className="mt-1"
                      sx={{ color: "#92400E" }}
                    >
                      {item.adminNote}
                    </Typography>
                  </Box>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 flex-wrap">
                  {item.url && (
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<LinkIcon />}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
                        color: "white",
                        fontWeight: 600,
                        textTransform: "none",
                        borderRadius: 2,
                        "&:hover": {
                          transform: "translateY(-1px)",
                        },
                      }}
                    >
                      Xem tài liệu
                    </Button>
                  )}
                  
                  {onEdit && (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Edit />}
                      onClick={() => onEdit(item)}
                      sx={{
                        borderColor: "#8B5CF6",
                        color: "#8B5CF6",
                        fontWeight: 600,
                        textTransform: "none",
                        borderRadius: 2,
                        "&:hover": {
                          borderColor: "#6D28D9",
                          backgroundColor: "#F9FAFB",
                          transform: "translateY(-1px)",
                        },
                      }}
                    >
                      Chỉnh sửa
                    </Button>
                  )}
                  
                  {onDelete && (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Delete />}
                      onClick={() => onDelete(item)}
                      sx={{
                        borderColor: "#EF4444",
                        color: "#EF4444",
                        fontWeight: 600,
                        textTransform: "none",
                        borderRadius: 2,
                        "&:hover": {
                          borderColor: "#DC2626",
                          backgroundColor: "#FEF2F2",
                          transform: "translateY(-1px)",
                        },
                      }}
                    >
                      Xóa
                    </Button>
                  )}
                </div>
              </Box>
            </AccordionDetails>
          </Accordion>
        ))
      ) : (
        <Alert severity="info" className="text-center">
          Chưa có thông tin trong mục này
        </Alert>
      )}
    </div>
  );
};

export default CoursesTab;
