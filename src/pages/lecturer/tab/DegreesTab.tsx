import { useState } from "react";
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
  Typography,
} from "@mui/material";
import { colors } from "../../../theme/colors";
import { getStatusText } from "../../../utils/ChangeText";
import UploadDegreeModal from "../../../components/UploadDegreeModal";
import { API } from "../../../utils/Fetch";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setLecturerProfile } from "../../../redux/slice/LecturerProfileSlice";

interface DegreesTabProps {
  degrees: any[];
  getStatusColor: (status: string) => string;
  formatDate: (dateString: string) => string;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
}

const DegreesTab = ({ degrees, onEdit, onDelete }: DegreesTabProps) => {
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [editDegree, setEditDegree] = useState<any>(null);

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
        const response = await API.lecturer.updateDegree(degree);
        if (response.data.success) {
          const response = await API.lecturer.getLecturerProfile();
          dispatch(setLecturerProfile(response.data.data));
          toast.success("Đã gửi thông tin đến admin");
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

  return (
    <div className="space-y-4">
      {/* Header with Add button */}
      <div className="flex items-center justify-between">
        <Typography
          variant="h6"
          sx={{ color: colors.text.primary, fontWeight: 600 }}
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
            borderRadius: 2,
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
                background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.secondary[500]} 100%)`,
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
              <div className="mr-4 flex w-full items-center justify-between">
                <div className="flex items-center gap-3">
                  <Box
                    className="rounded-lg p-2"
                    sx={{
                      background: "rgba(255,255,255,0.2)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <School className="text-white" />
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
                      {item.major}
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
                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div
                    className="flex items-center gap-3 rounded-lg p-3"
                    style={{
                      background: colors.background.tertiary,
                    }}
                  >
                    <Business className="text-blue-600" fontSize="small" />
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
                        {item.institution}
                      </Typography>
                    </div>
                  </div>
                  <div
                    className="flex items-center gap-3 rounded-lg p-3"
                    style={{
                      background: colors.background.tertiary,
                    }}
                  >
                    <CalendarToday
                      className="text-green-600"
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
                        Thời gian
                      </Typography>
                      <Typography variant="body2" className="font-medium">
                        {item.startYear} - {item.graduationYear}
                      </Typography>
                    </div>
                  </div>
                  <div
                    className="flex items-center gap-3 rounded-lg p-3"
                    style={{
                      background: colors.background.tertiary,
                    }}
                  >
                    <Grade className="text-purple-600" fontSize="small" />
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
                  {item.url && (
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<LinkIcon />}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.secondary[500]} 100%)`,
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
                      onClick={() => handleEdit(item)}
                      sx={{
                        borderColor: colors.primary[500],
                        color: colors.primary[500],
                        fontWeight: 600,
                        textTransform: "none",
                        borderRadius: 2,
                        "&:hover": {
                          borderColor: colors.primary[600],
                          backgroundColor: colors.primary[50],
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

export default DegreesTab;
