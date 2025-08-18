import {
  Add,
  Business,
  CalendarToday,
  Delete,
  Edit,
  ExpandMore,
  Link as LinkIcon,
  Person,
  Science
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

interface ResearchTabProps {
  researchProjects: any[];
  getStatusColor: (status: string) => string;
  formatDate: (dateString: string) => string;
  onAdd?: () => void;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
}

const ResearchTab = ({ researchProjects, formatDate, onAdd, onEdit, onDelete }: ResearchTabProps) => {
  return (
    <div className="space-y-4">
      {/* Header with Add button */}
      <div className="flex justify-between items-center">
        <Typography variant="h6" sx={{ color: colors.text.primary, fontWeight: 600 }}>
          Dự án nghiên cứu ({researchProjects?.length || 0})
        </Typography>
        {onAdd && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={onAdd}
            sx={{
              background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
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
            Thêm dự án
          </Button>
        )}
      </div>
      {researchProjects && researchProjects.length > 0 ? (
        researchProjects.map((item: any) => (
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
                background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
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
                    <Science className="text-white" />
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
                      {item.researchArea}
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
                    <Business className="text-green-600" fontSize="small" />
                    <div>
                      <Typography
                        variant="caption"
                        sx={{
                          color: colors.text.tertiary,
                          fontWeight: 600,
                        }}
                      >
                        Nguồn tài trợ
                      </Typography>
                      <Typography variant="body2" className="font-medium">
                        {item.foundingSource}
                      </Typography>
                    </div>
                  </div>
                  <div
                    className="flex items-center gap-3 p-3 rounded-lg"
                    style={{
                      background: colors.background.tertiary,
                    }}
                  >
                    <Person className="text-purple-600" fontSize="small" />
                    <div>
                      <Typography
                        variant="caption"
                        sx={{
                          color: colors.text.tertiary,
                          fontWeight: 600,
                        }}
                      >
                        Vai trò
                      </Typography>
                      <Typography variant="body2" className="font-medium">
                        {item.roleInProject}
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
                  {item.publishedUrl && (
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<LinkIcon />}
                      href={item.publishedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
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
                        borderColor: "#DC2626",
                        color: "#DC2626",
                        fontWeight: 600,
                        textTransform: "none",
                        borderRadius: 2,
                        "&:hover": {
                          borderColor: "#B91C1C",
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

export default ResearchTab;
