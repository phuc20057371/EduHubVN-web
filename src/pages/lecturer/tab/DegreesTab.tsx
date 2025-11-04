import {
  Add,
  Business,
  CalendarToday,
  Delete,
  Edit,
  ExpandMore,
  Grade,
  Link as LinkIcon,
  School,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useColors } from "../../../hooks/useColors";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import UploadDegreeModal from "../../../components/lecturer-dialog/CreateDegreeModal";
import { setLecturerProfile } from "../../../redux/slice/LecturerProfileSlice";
import { colors } from "../../../theme/colors";
import type { Degree } from "../../../types/Degree";
import { getStatus } from "../../../utils/ChangeText";
import { API } from "../../../utils/Fetch";

interface DegreesTabProps {
  degrees: Degree[];
}

const DegreesTab = ({ degrees }: DegreesTabProps) => {
  const dispatch = useDispatch();
  const themeColors = useColors();
  const [openModal, setOpenModal] = useState(false);
  const [editDegree, setEditDegree] = useState<any>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);

  const handleOpenModal = () => {
    setEditDegree(null);
    setOpenModal(true);
  };

  const handleEdit = (degree: any) => {
    setEditDegree(degree);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditDegree(null);
  };

  const handleSubmitModal = async (degree: any) => {
    try {
      if (editDegree) {
        // Edit mode
        if (degree.status === "APPROVED") {
          const response = await API.user.editDegree(degree);
          if (response.data.success) {
            const response = await API.lecturer.getLecturerProfile();
            dispatch(setLecturerProfile(response.data.data));
            toast.success("Đã gửi thông tin đến admin");
          }
        } else if (
          degree.status === "REJECTED" ||
          degree.status === "PENDING"
        ) {
          const response = await API.user.updateDegree(degree);
          if (response.data.success) {
            const response = await API.lecturer.getLecturerProfile();
            dispatch(setLecturerProfile(response.data.data));
            toast.success("Đã gửi thông tin đến admin");
          }
        }
      } else {
        // Add mode
        const response = await API.user.createDegree([degree]);
        if (response.data.success) {
          const response = await API.lecturer.getLecturerProfile();
          dispatch(setLecturerProfile(response.data.data));
          toast.success("Đã gửi thông tin đến admin");
        }
      }
    } catch (error) {
      console.error("Error saving degree:", error);
      toast.error("Lỗi khi lưu bằng cấp");
    }
    setOpenModal(false);
    setEditDegree(null);
  };

  const handleDelete = (item: any) => {
    setItemToDelete(item.original);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      const response = await API.user.deleteDegree(itemToDelete.id);
      if (response.data.success) {
        const response = await API.lecturer.getLecturerProfile();
        dispatch(setLecturerProfile(response.data.data));
        toast.success("Xóa thành công");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Có lỗi xảy ra khi xóa");
    } finally {
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
    setItemToDelete(null);
  };

  return (
    <div className="space-y-4">
      {/* Header with Add button */}
      <div className="flex items-center justify-between">
        <Typography
          variant="h6"
          sx={{ color: themeColors.isDark ? themeColors.text.primary : colors.text.primary, fontWeight: 600 }}
        >
          Danh sách bằng cấp ({degrees?.length || 0})
        </Typography>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenModal}
          sx={{
            background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.secondary[500]} 100%)`,
            color: "white",
            fontWeight: 600,
            textTransform: "none",
            borderRadius: 1,
            "&:hover": {
              transform: "translateY(-1px)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            },
          }}
        >
          Thêm bằng cấp
        </Button>
      </div>
      {/* UploadDegreeModal */}
      <UploadDegreeModal
        open={openModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmitModal}
        editMode={!!editDegree}
        editData={editDegree}
      />
      {degrees && degrees.length > 0 ? (
        degrees.map((item: any) => (
          <Accordion
            key={item.original.id}
            className="transition-all duration-300"
            sx={{
              borderRadius: 1,
              border: 'none',
              boxShadow: 'none',
              transition: "transform 200ms ease, box-shadow 200ms ease",
              cursor: "pointer",
              "&:before": {
                display: "none",
              },
              // keep a subtle hover elevation but no framed border
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
              },
              "&.Mui-expanded": {
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                transform: "translateY(-2px)",
              },
              "&:active": {
                transform: "translateY(-6px)",
                boxShadow: "0 14px 30px rgba(0,0,0,0.12)",
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              sx={{
                background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.secondary[500]} 100%)`,
                color: "white",
                borderRadius: "12px",
                transition: "transform 180ms ease, box-shadow 180ms ease",
                cursor: "pointer",
                "& .MuiAccordionSummary-expandIconWrapper": {
                  color: "white",
                },
                "&.Mui-expanded": {
                  borderRadius: "12px 12px 0 0",
                },
                "&:hover": {
                  transform: "translateY(-2px)",
                },
                "&:active": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 18px 40px rgba(0,0,0,0.32)",
                },
              }}
            >
              <div className="mr-4 flex w-full items-center justify-between">
                <div className="flex items-center gap-3">
                  <Box
                    className="rounded-lg p-2"
                    sx={{
                      background: "rgba(255,255,255,0.2)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <School sx={{ color: themeColors.isDark ? themeColors.text.primary : 'white' }} />
                  </Box>
                  <div>
                    <Typography
                      variant="h6"
                      className="font-bold"
                      sx={{ color: themeColors.isDark ? themeColors.text.primary : 'white' }}
                    >
                      {item.original.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: themeColors.isDark ? themeColors.text.secondary : 'rgba(255,255,255,0.9)' }}
                    >
                      {item.original.major}
                    </Typography>
                    {item.original.referenceId && (
                      <Typography
                        variant="caption"
                        sx={{ color: "rgba(255,255,255,0.7)" }}
                      >
                        Reference ID: {item.original.referenceId}
                      </Typography>
                    )}
                  </div>
                </div>
                <Chip
                  label={getStatus(item.original.status)}
                  size="small"
                  sx={{
                    fontWeight: 600,
                    background: themeColors.isDark ? 'rgba(255,255,255,0.08)' : "rgba(255,255,255,0.9)",
                    color:
                      item.original.status === "APPROVED"
                        ? "#047857"
                        : item.original.status === "PENDING"
                          ? "#D97706"
                          : "#DC2626",
                  }}
                />
              </div>
            </AccordionSummary>

            <AccordionDetails
              sx={{
                p: 0,
                background: themeColors.isDark ? '#0E1D2C' : "white",
                borderRadius: "0 0 12px 12px",
              }}
            >
              <Box className="p-6">
                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div
                    className="flex items-center gap-3 rounded-lg p-3"
                    style={{
                      background: themeColors.isDark ? '#0E1D2C' : colors.background.tertiary,
                    }}
                  >
                    <Business fontSize="small" sx={{ color: themeColors.isDark ? themeColors.text.primary : colors.primary[600] }} />
                    <div>
                      <Typography
                        variant="caption"
                        sx={{
                          color: colors.text.tertiary,
                          fontWeight: 600,
                        }}
                      >
                        Trường/Tổ chức
                      </Typography>
                      <Typography variant="body2" className="font-medium">
                        {item.original.institution}
                      </Typography>
                    </div>
                  </div>
                  <div
                    className="flex items-center gap-3 rounded-lg p-3"
                    style={{
                      background: themeColors.isDark ? '#0E1D2C' : colors.background.tertiary,
                    }}
                  >
                    <CalendarToday fontSize="small" sx={{ color: themeColors.isDark ? themeColors.text.primary : '#16A34A' }} />
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
                        {item.original.startYear} -{" "}
                        {item.original.graduationYear}
                      </Typography>
                    </div>
                  </div>
                  <div
                    className="flex items-center gap-3 rounded-lg p-3"
                    style={{
                      background: themeColors.isDark ? '#0E1D2C' : colors.background.tertiary,
                    }}
                  >
                    <Grade fontSize="small" sx={{ color: themeColors.isDark ? themeColors.text.primary : '#7C3AED' }} />
                    <div>
                      <Typography
                        variant="caption"
                        sx={{
                          color: colors.text.tertiary,
                          fontWeight: 600,
                        }}
                      >
                        Trình độ
                      </Typography>
                      <Typography variant="body2" className="font-medium">
                        {item.original.level}
                      </Typography>
                    </div>
                  </div>
                </div>

                {item.original.description && (
                  <Box
                    className="mb-4 rounded-lg p-4"
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
                      {item.original.description}
                    </Typography>
                  </Box>
                )}

                {item.original.adminNote && (
                  <Box
                    className="mb-4 rounded-lg p-3"
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
                      {item.original.adminNote}
                    </Typography>
                  </Box>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  {item.original.url && (
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<LinkIcon />}
                      href={item.original.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.secondary[500]} 100%)`,
                        color: "white",
                        fontWeight: 600,
                        textTransform: "none",
                        borderRadius: 1,
                        "&:hover": {
                          transform: "translateY(-1px)",
                        },
                      }}
                    >
                      Xem tài liệu
                    </Button>
                  )}

                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Edit />}
                    onClick={() => handleEdit(item.original)}
                    sx={{
                      borderColor: colors.primary[500],
                      color: colors.primary[500],
                      fontWeight: 600,
                      textTransform: "none",
                      borderRadius: 1,
                      "&:hover": {
                        borderColor: colors.primary[600],
                        backgroundColor: colors.primary[50],
                        transform: "translateY(-1px)",
                      },
                    }}
                  >
                    Chỉnh sửa
                  </Button>

                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Delete />}
                    onClick={() => handleDelete(item)}
                    sx={{
                      borderColor: "#EF4444",
                      color: "#EF4444",
                      fontWeight: 600,
                      textTransform: "none",
                      borderRadius: 1,
                      "&:hover": {
                        borderColor: "#DC2626",
                        backgroundColor: "#FEF2F2",
                        transform: "translateY(-1px)",
                      },
                    }}
                  >
                    Xóa
                  </Button>
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleCancelDelete}
        PaperProps={{
          sx: {
            borderRadius: 1,
            minWidth: 400,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, color: colors.primary[700] }}>
          Xác nhận xóa
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: colors.text.secondary, mb: 2 }}>
            Bạn có chắc chắn muốn xóa bằng cấp này không? Hành động này không
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
              borderRadius: 1,
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
              borderRadius: 1,
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

export default DegreesTab;
