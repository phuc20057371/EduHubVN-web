import {
  Add,
  CalendarToday,
  Delete,
  Edit,
  ExpandMore,
  Link as LinkIcon,
  Science,
  AttachMoney,
  Category,
  TrendingUp,
  CheckCircle,
  Business,
  Person,
  Assignment,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
import { getProjectType, getStatus, getScale } from "../../../utils/ChangeText";
import { API } from "../../../utils/Fetch";
import { setLecturerProfile } from "../../../redux/slice/LecturerProfileSlice";

interface ResearchTabProps {
  researchProjects: any[];
  getStatusColor: (status: string) => string;
  formatDate: (dateString: string) => string;
  onAdd?: () => void;
  onEdit?: (item: any) => void;
}

const ResearchTab = ({ 
  researchProjects, 
  formatDate, 
  onAdd, 
  onEdit 
}: ResearchTabProps) => {
  const dispatch = useDispatch();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);

  const handleDelete = (item: any) => {
    setItemToDelete(item.original);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      // Note: Replace with actual delete API when available
      await API.lecturer.deleteResearchProject(itemToDelete.id);
      // For now, we'll just refresh the profile
      const response = await API.lecturer.getLecturerProfile();
      dispatch(setLecturerProfile(response.data.data));
      toast.success("Xóa dự án nghiên cứu thành công");
    } catch (error) {
      console.error("Error deleting research project:", error);
      toast.error("Có lỗi xảy ra khi xóa dự án nghiên cứu");
    } finally {
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
    setItemToDelete(null);
  };

  const renderProjectCard = (item: any) => (
    <Accordion
      key={item.original.id}
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
          background: colors.background.gradient.primary,
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
              <Science sx={{ color: "white", fontSize: 24 }} />
            </Box>
            <div className="flex-1">
              <Typography
                variant="h6"
                sx={{ 
                  color: "white",
                  mb: 0.5,
                }}
              >
                {item.original.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{ 
                  color: "rgba(255,255,255,0.9)",
                }}
              >
                Lĩnh vực: {item.original.researchArea || 'Không xác định'}
              </Typography>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Chip
              label={getStatus(item.original.status)}
              size="small"
              sx={{
                background: "rgba(255,255,255,0.9)",
                height: "28px",
                color:
                  item.original.status === "APPROVED"
                    ? "#047857"
                    : item.original.status === "PENDING"
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
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Category sx={{ fontSize: 18, color: colors.primary[500] }} />
              Thông tin dự án
            </Typography>
            
            {/* Edit and Delete buttons in top-right corner */}
            <Box sx={{ display: "flex", gap: 1 }}>
              {onEdit && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => onEdit(item.original)}
                  sx={{
                    minWidth: "auto",
                    width: 32,
                    height: 32,
                    borderRadius: "8px",
                    borderColor: colors.primary[500],
                    color: colors.primary[500],
                    "&:hover": {
                      borderColor: colors.primary[600],
                      backgroundColor: colors.primary[50],
                    },
                  }}
                >
                  <Edit sx={{ fontSize: 16 }} />
                </Button>
              )}

              <Button
                variant="outlined"
                size="small"
                onClick={() => handleDelete(item)}
                sx={{
                  minWidth: "auto",
                  width: 32,
                  height: 32,
                  borderRadius: "8px",
                  borderColor: colors.error[500],
                  color: colors.error[500],
                  "&:hover": {
                    borderColor: colors.error[600],
                    backgroundColor: colors.error[50],
                  },
                }}
              >
                <Delete sx={{ fontSize: 16 }} />
              </Button>
            </Box>
          </Box>

          {/* Chips Section - Compact */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
            {/* Funding Amount as Chip */}
            {item.original.foundingAmount && (
              <Chip
                icon={<AttachMoney sx={{ fontSize: 16, color: "white !important" }} />}
                label={`${item.original.foundingAmount.toLocaleString('vi-VN')} VNĐ`}
                size="small"
                sx={{
                  background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                  color: "white",
                  "& .MuiChip-icon": {
                    color: "white",
                  },
                }}
              />
            )}

            {/* Project Type as Chip */}
            {item.original.projectType && (
              <Chip
                icon={<Assignment sx={{ fontSize: 16, color: "white !important" }} />}
                label={getProjectType(item.original.projectType)}
                size="small"
                sx={{
                  background: "linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)",
                  color: "white",
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
              {/* Published URL */}
              {item.original.publishedUrl && (
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<LinkIcon />}
                  href={item.original.publishedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    background: colors.background.gradient.primary,
                    color: "white",
                    textTransform: "none",
                    borderRadius: 2,
                    px: 2,
                    py: 0.5,
                    "&:hover": {
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  Xem công bố
                </Button>
              )}
            </div>
          </Box>

          {/* Basic Information Grid - Compact */}
          <Box sx={{ mb: 2 }}>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {/* Quy mô */}
              {item.original.scale && (
                <div
                  className="flex items-center gap-3 rounded-lg p-3"
                  style={{
                    background: colors.background.tertiary,
                    border: "1px solid #E5E7EB",
                  }}
                >
                  <TrendingUp sx={{ color: colors.warning[600] }} fontSize="small" />
                  <div className="flex-1">
                    <Typography
                      variant="caption"
                      sx={{
                        color: colors.text.tertiary,
                        display: "block",
                      }}
                    >
                      Quy mô
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                      {getScale(item.original.scale)}
                    </Typography>
                  </div>
                </div>
              )}

              {/* Trạng thái khóa học */}
              {item.original.courseStatus && (
                <div
                  className="flex items-center gap-3 rounded-lg p-3"
                  style={{
                    background: colors.background.tertiary,
                    border: "1px solid #E5E7EB",
                  }}
                >
                  <CheckCircle sx={{ color: colors.success[600] }} fontSize="small" />
                  <div className="flex-1">
                    <Typography
                      variant="caption"
                      sx={{
                        color: colors.text.tertiary,
                        display: "block",
                      }}
                    >
                      Trạng thái
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                      {item.original.courseStatus}
                    </Typography>
                  </div>
                </div>
              )}

              {/* Vai trò trong dự án */}
              {item.original.roleInProject && (
                <div
                  className="flex items-center gap-3 rounded-lg p-3"
                  style={{
                    background: colors.background.tertiary,
                    border: "1px solid #E5E7EB",
                  }}
                >
                  <Person sx={{ color: colors.info[600] }} fontSize="small" />
                  <div className="flex-1">
                    <Typography
                      variant="caption"
                      sx={{
                        color: colors.text.tertiary,
                        display: "block",
                      }}
                    >
                      Vai trò
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                      {item.original.roleInProject}
                    </Typography>
                  </div>
                </div>
              )}
            </div>
          </Box>

          {/* Nhóm Thời gian & Nguồn tài trợ - Compact */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              sx={{
                color: colors.text.primary,
                mb: 1.5,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <CalendarToday sx={{ fontSize: 18, color: colors.info[600] }} />
              Thông tin thời gian & tài trợ
            </Typography>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {/* Thời gian */}
              <div
                className="flex items-center gap-3 rounded-lg p-3"
                style={{
                  background: colors.background.tertiary,
                  border: "1px solid #E5E7EB",
                }}
              >
                <CalendarToday sx={{ color: colors.primary[600] }} fontSize="small" />
                <div className="flex-1">
                  <Typography
                    variant="caption"
                    sx={{
                      color: colors.text.tertiary,
                      display: "block",
                    }}
                  >
                    Thời gian thực hiện
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                    {formatDate(item.original.startDate)} - {formatDate(item.original.endDate)}
                  </Typography>
                </div>
              </div>

              {/* Nguồn tài trợ */}
              <div
                className="flex items-center gap-3 rounded-lg p-3"
                style={{
                  background: colors.background.tertiary,
                  border: "1px solid #E5E7EB",
                }}
              >
                <Business sx={{ color: colors.success[600] }} fontSize="small" />
                <div className="flex-1">
                  <Typography
                    variant="caption"
                    sx={{
                      color: colors.text.tertiary,
                      display: "block",
                    }}
                  >
                    Nguồn tài trợ
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                    {item.original.foundingSource || 'Không xác định'}
                  </Typography>
                </div>
              </div>
            </div>
          </Box>

          {/* Mô tả - Compact */}
          {item.original.description && (
            <Box
              sx={{ 
                mb: 2,
                p: 3,
                borderRadius: "8px",
                background: colors.primary[50],
                border: `1px solid ${colors.primary[200]}`,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: colors.text.tertiary,
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
                {item.original.description}
              </Typography>
            </Box>
          )}

          {/* Admin Note - Compact */}
          {item.original.adminNote && (
            <Box
              sx={{
                p: 3,
                borderRadius: "8px",
                background: colors.warning[100],
                border: `1px solid ${colors.warning[500]}`,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: colors.warning[700],
                  display: "block",
                  mb: 1,
                }}
              >
                Ghi chú của quản trị viên
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: colors.warning[700] }}
              >
                {item.original.adminNote}
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
        <div className="flex items-center gap-3">
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "12px",
              background: colors.background.gradient.primary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 4px 12px ${colors.primary[300]}`,
            }}
          >
            <Science sx={{ color: "white", fontSize: 24 }} />
          </Box>
          <div>
            <Typography
              variant="h6"
              sx={{
                color: colors.primary[700],
                fontSize: "1.2rem",
              }}
            >
              Dự án nghiên cứu ({researchProjects?.length || 0})
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: colors.text.tertiary,
              }}
            >
              Các dự án nghiên cứu khoa học bạn đã tham gia
            </Typography>
          </div>
        </div>
        {onAdd && (
          <Button
            variant="contained"
            startIcon={<Add sx={{ fontSize: 18 }} />}
            onClick={onAdd}
            size="small"
            sx={{
              background: colors.background.gradient.primary,
              color: "white",
              textTransform: "none",
              borderRadius: 2,
              px: 2,
              py: 0.5,
              minWidth: "auto",
              height: "32px",
              boxShadow: `0 2px 8px ${colors.primary[300]}`,
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: `0 4px 12px ${colors.primary[400]}`,
              },
            }}
          >
            Thêm
          </Button>
        )}
      </div>
      
      {researchProjects && researchProjects.length > 0 ? (
        <div className="space-y-4">
          {researchProjects.map((item: any) => renderProjectCard(item))}
        </div>
      ) : (
        <Box
          sx={{
            p: 6,
            borderRadius: 4,
            background: colors.primary[50],
            border: `2px dashed ${colors.primary[300]}`,
            textAlign: "center",
          }}
        >
          <Science sx={{ fontSize: 56, color: colors.primary[500], mb: 2 }} />
          <Typography
            variant="h6"
            sx={{ color: colors.primary[700], mb: 1 }}
          >
            Chưa có dự án nghiên cứu nào
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: colors.text.tertiary }}
          >
            Thêm thông tin về các dự án nghiên cứu khoa học bạn đã tham gia
          </Typography>
        </Box>
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
        <DialogTitle sx={{ color: colors.primary[700] }}>
          Xác nhận xóa
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: colors.text.secondary, mb: 2 }}>
            Bạn có chắc chắn muốn xóa dự án nghiên cứu này không? Hành động này không
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

export default ResearchTab;
