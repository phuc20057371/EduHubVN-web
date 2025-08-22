import { useState } from "react";
import {
  Add,
  Assignment,
  CalendarToday,
  Delete,
  Edit,
  ExpandMore,
  Grade,
  Link as LinkIcon,
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
import { colors } from "../../../theme/colors";
import { getStatusText } from "../../../utils/ChangeText";
import UploadCertificationModal from "../../../components/UploadCertificationModal";
import { API } from "../../../utils/Fetch";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setLecturerProfile } from "../../../redux/slice/LecturerProfileSlice";

interface CertificatesTabProps {
  certificates: any[];
  getStatusColor: (status: string) => string;
  formatDate: (dateString: string) => string;
}

const CertificatesTab = ({
  certificates,
  formatDate,
}: CertificatesTabProps) => {
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [editCertificate, setEditCertificate] = useState<any>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);

  const handleOpenModal = () => {
    setEditCertificate(null);
    setOpenModal(true);
  };

  const handleEdit = (certificate: any) => {
    setEditCertificate(certificate);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditCertificate(null);
  };

  const handleSubmitModal = async (certificate: any) => {
    try {
      if (editCertificate) {
        // Edit mode
        if (certificate.status === "APPROVED") {
          const response = await API.user.editCertification(certificate);
          if (response.data.success) {
            const response = await API.lecturer.getLecturerProfile();
            dispatch(setLecturerProfile(response.data.data));
            toast.success("Đã gửi thông tin đến admin");
          }
        } else if (
          certificate.status === "REJECTED" ||
          certificate.status === "PENDING"
        ) {
          const response = await API.user.updateCertification(certificate);
          if (response.data.success) {
            const response = await API.lecturer.getLecturerProfile();
            dispatch(setLecturerProfile(response.data.data));
            toast.success("Đã gửi thông tin đến admin");
          }
        }
      } else {
        // Add mode
        const response = await API.user.createCertification([certificate]);
        if (response.data.success) {
          const response = await API.lecturer.getLecturerProfile();
          dispatch(setLecturerProfile(response.data.data));
          toast.success("Đã gửi thông tin đến admin");
        }
      }
    } catch (error) {
      console.error("Error saving certificate:", error);
      toast.error("Lỗi khi lưu chứng chỉ");
    }
    setOpenModal(false);
    setEditCertificate(null);
  };

  const handleDelete = (item: any) => {
    setItemToDelete(item);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      const response = await API.user.deleteCertification(itemToDelete.id);
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
          sx={{ color: colors.text.primary, fontWeight: 600 }}
        >
          Danh sách chứng chỉ ({certificates?.length || 0})
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenModal}
          sx={{
            background: "linear-gradient(135deg, #10B981 0%, #047857 100%)",
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
          Thêm chứng chỉ
        </Button>
      </div>
      {/* UploadCertificationModal */}
      <UploadCertificationModal
        open={openModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmitModal}
        editMode={!!editCertificate}
        editData={editCertificate}
      />
      {certificates && certificates.length > 0 ? (
        certificates.map((item: any) => (
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
                background: "linear-gradient(135deg, #10B981 0%, #047857 100%)",
                color: "white",
                borderRadius: "12px",
                "& .MuiAccordionSummary-expandIconWrapper": {
                  color: "white",
                },
                "&.Mui-expanded": {
                  borderRadius: "12px 12px 0 0",
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
                    <Assignment className="text-white" />
                  </Box>
                  <div>
                    <Typography
                      variant="h6"
                      className="font-bold"
                      sx={{ color: "white" }}
                    >
                      {item.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "rgba(255,255,255,0.9)" }}
                    >
                      {item.issuedBy}
                    </Typography>
                    {item.referenceId && (
                      <Typography
                        variant="caption"
                        sx={{ color: "rgba(255,255,255,0.7)" }}
                      >
                        Reference ID: {item.referenceId}
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
                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div
                    className="flex items-center gap-3 rounded-lg p-3"
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
                        Ngày cấp
                      </Typography>
                      <Typography variant="body2" className="font-medium">
                        {formatDate(item.issueDate)}
                      </Typography>
                    </div>
                  </div>
                  {item.expiryDate && (
                    <div
                      className="flex items-center gap-3 rounded-lg p-3"
                      style={{
                        background: colors.background.tertiary,
                      }}
                    >
                      <CalendarToday
                        className="text-red-600"
                        fontSize="small"
                      />
                      <div>
                        <Typography
                          variant="caption"
                          sx={{
                            color: colors.text.tertiary,
                            fontWeight: 600,
                          }}
                        >
                          Ngày hết hạn
                        </Typography>
                        <Typography variant="body2" className="font-medium">
                          {formatDate(item.expiryDate)}
                        </Typography>
                      </div>
                    </div>
                  )}
                  <div
                    className="flex items-center gap-3 rounded-lg p-3"
                    style={{
                      background: colors.background.tertiary,
                    }}
                  >
                    <Grade className="text-green-600" fontSize="small" />
                    <div>
                      <Typography
                        variant="caption"
                        sx={{
                          color: colors.text.tertiary,
                          fontWeight: 600,
                        }}
                      >
                        Cấp độ
                      </Typography>
                      <Typography variant="body2" className="font-medium">
                        {item.level}
                      </Typography>
                    </div>
                  </div>
                </div>

                {item.description && (
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
                      {item.description}
                    </Typography>
                  </Box>
                )}

                {item.adminNote && (
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
                      {item.adminNote}
                    </Typography>
                  </Box>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  {item.certificateUrl && (
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<LinkIcon />}
                      href={item.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        background:
                          "linear-gradient(135deg, #10B981 0%, #047857 100%)",
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

                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Edit />}
                    onClick={() => handleEdit(item)}
                    sx={{
                      borderColor: "#10B981",
                      color: "#10B981",
                      fontWeight: 600,
                      textTransform: "none",
                      borderRadius: 2,
                      "&:hover": {
                        borderColor: "#047857",
                        backgroundColor: "#ECFDF5",
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
            Bạn có chắc chắn muốn xóa chứng chỉ này không? Hành động này không
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

export default CertificatesTab;
