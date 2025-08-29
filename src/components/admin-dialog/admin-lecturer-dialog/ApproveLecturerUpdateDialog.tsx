import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import { useState } from "react";
import ConfirmDialog from "../../general-dialog/ConfirmDialog";
import { toast } from "react-toastify";
import { API } from "../../../utils/Fetch";
import { useDispatch, useSelector } from "react-redux";
import { setLecturerPendingUpdate } from "../../../redux/slice/LecturerPendingUpdateSlice";
import type { Lecturer } from "../../../types/Lecturer";
import { setLecturers } from "../../../redux/slice/LecturerSlice";
import {
  formatDateToVietnamTime,
  getAcademicRank,
} from "../../../utils/ChangeText";
import { setLecturerProfileUpdate } from "../../../redux/slice/LecturerProfileUpdateSlice";

const fieldGroups = [
  {
    title: "Thông tin chuyên môn",
    fields: [
      {
        label: "Học hàm",
        key: "academicRank",
        render: (v: any) => getAcademicRank(v),
      },
      { label: "Chuyên ngành", key: "specialization" },
      {
        label: "Kinh nghiệm",
        key: "experienceYears",
        render: (v: any) => v + " năm",
      },
      { label: "Lĩnh vực công việc", key: "jobField" },
    ],
  },
  {
    title: "Thông tin cá nhân",
    fields: [
      { label: "Họ tên", key: "fullName" },
      { label: "SĐT", key: "phoneNumber" },
      {
        label: "Ngày sinh",
        key: "dateOfBirth",
        render: (v: any) => (v ? new Date(v).toLocaleDateString("vi-VN") : "-"),
      },
      {
        label: "Giới tính",
        key: "gender",
        render: (v: any) => (v ? "Nam" : "Nữ"),
      },
      { label: "Giới thiệu", key: "bio" },
    ],
  },
];

type LecturerKey = keyof Lecturer;

const ApproveLecturerUpdateDialog = ({
  open,
  onClose,
  lecturer,
  lecturerUpdate,
  onDataReloaded,
}: {
  open: boolean;
  onClose: () => void;
  lecturer: Lecturer;
  lecturerUpdate: Lecturer;
  onDataReloaded?: (updatedItem: any) => void;
}) => {
  const [confirmType, setConfirmType] = useState<null | "approve" | "reject">(
    null,
  );
  const lecturerUpdateList = useSelector((state: any) =>
    Array.isArray(state.lecturerPendingUpdate)
      ? state.lecturerPendingUpdate
      : [],
  );

  const [adminNote, setAdminNote] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const dispatch = useDispatch();

  if (!open) return null;

  const reloadData = async () => {
    try {
      const updateResponse = await API.admin.getLecturerPendingUpdate();
      dispatch(setLecturerPendingUpdate(updateResponse.data.data));

      // Find the updated item and pass it back to parent
      const updatedItem = updateResponse.data.data.find(
        (item: any) => item.lecturerUpdate.id === lecturerUpdate.id,
      );

      if (updatedItem && onDataReloaded) {
        onDataReloaded(updatedItem);
      }
    } catch (error) {
      console.error("Error reloading data:", error);
      toast.error("Có lỗi khi tải lại dữ liệu");
    }
  };

  const handleConfirm = async (type: "approve" | "reject") => {
    if (type === "reject" && !adminNote.trim()) {
      toast.error("Vui lòng nhập lý do từ chối");
      return;
    }
    const currentItem = lecturerUpdateList.find(
      (item: any) => item.lecturerUpdate.id === lecturerUpdate.id,
    );
    if (!currentItem) {
      toast.error("⚠️ Không tìm thấy thông tin cập nhật");
      return;
    }
    if (
      currentItem &&
      lecturerUpdate.updatedAt !== currentItem.lecturerUpdate.updatedAt
    ) {
      toast.warning("Dữ liệu đã thay đổi, đang tải lại dữ liệu mới...");
      await reloadData();
      setConfirmType(null);
      setAdminNote("");
      return;
    }

    try {
      if (type === "approve") {
        await API.admin.approveLecturerUpdate({
          id: lecturerUpdate.id,
        });
        const res = await API.admin.getAllLecturers();
        dispatch(setLecturers(res.data.data));
        const updateResponse = await API.admin.getLecturerPendingUpdate();
        dispatch(setLecturerPendingUpdate(updateResponse.data.data));
        toast.success("Duyệt thông tin cập nhật thành công!");
      } else if (type === "reject") {
        await API.admin.rejectLecturerUpdate({
          id: (lecturerUpdate as any)?.id,
          adminNote,
        });
        const res = await API.admin.getAllLecturers();
        dispatch(setLecturers(res.data.data));
        const updateResponse = await API.admin.getLecturerPendingUpdate();
        dispatch(setLecturerPendingUpdate(updateResponse.data.data));
        toast.success("Từ chối thông tin cập nhật thành công!");
      }
      const response = await API.admin.getLecturerAllProfile({
        id: lecturer.id,
      });
      if (response.data.success) {
        dispatch(setLecturerProfileUpdate(response.data.data));
      }
      setConfirmType(null);
      setAdminNote("");
      if (typeof onClose === "function") onClose();
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    }
    setIsProcessing(false);
  };

  const handleCancelConfirm = () => {
    setConfirmType(null);
    setAdminNote("");
  };

  const renderFieldValue = (field: any, value: any) => {
    if (field.render) return field.render(value);
    return value ?? "-";
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              src={lecturerUpdate?.avatarUrl || lecturer?.avatarUrl || ""}
              sx={{ bgcolor: "primary.main", width: 48, height: 48 }}
            >
              <PersonIcon />
            </Avatar>
            <Box flex={1}>
              <Typography variant="h5" component="div">
                Yêu cầu cập nhật thông tin giảng viên
              </Typography>

              <Typography variant="body2" color="text.secondary">
                ID: {lecturer?.id || lecturerUpdate?.id}
              </Typography>
            </Box>
          </Box>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "primary.main",
              background: "rgba(240,240,240,0.8)",
              "&:hover": {
                bgcolor: "primary.light",
                color: "white",
              },
              transition: "all 0.2s",
            }}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {/* Status Card */}
          <Card
            elevation={0}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              borderRadius: 2,
              mb: 3,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={2}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar
                    sx={{
                      bgcolor: "rgba(255,255,255,0.2)",
                      width: 48,
                      height: 48,
                    }}
                  >
                    <CompareArrowsIcon sx={{ color: "white", fontSize: 24 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight={600} color="white">
                      Xét duyệt cập nhật thông tin giảng viên
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "rgba(255,255,255,0.8)" }}
                    >
                      So sánh và quyết định phê duyệt
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label="Chờ duyệt"
                  sx={{
                    bgcolor: "rgba(255, 193, 7, 0.9)",
                    color: "white",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    px: 2,
                    py: 1,
                  }}
                />
              </Box>
            </CardContent>
          </Card>

          {/* Comparison Content */}
          {fieldGroups.map((group) => (
            <Card key={group.title} elevation={1} sx={{ mb: 3 }}>
              <CardHeader
                avatar={
                  <Avatar
                    sx={{ bgcolor: "primary.main", width: 32, height: 32 }}
                  >
                    <SchoolIcon />
                  </Avatar>
                }
                title={group.title}
                sx={{ pb: 1 }}
              />
              <CardContent sx={{ pt: 0, p: 0 }}>
                {/* Header row */}
                <Box display="flex" sx={{ borderBottom: "2px solid #e0e0e0" }}>
                  <Box flex={1} sx={{ borderRight: "1px solid #e0e0e0" }}>
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={1}
                      py={2}
                      px={3}
                      sx={{ bgcolor: "#f5f5f5" }}
                    >
                      <Avatar
                        sx={{ bgcolor: "info.main", width: 24, height: 24 }}
                      >
                        📋
                      </Avatar>
                      <Typography variant="subtitle1" fontWeight={600}>
                        Thông tin hiện tại
                      </Typography>
                    </Box>
                  </Box>
                  <Box flex={1}>
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={1}
                      py={2}
                      px={3}
                      sx={{ bgcolor: "#f5f5f5" }}
                    >
                      <Avatar
                        sx={{ bgcolor: "warning.main", width: 24, height: 24 }}
                      >
                        ✏️
                      </Avatar>
                      <Typography variant="subtitle1" fontWeight={600}>
                        Thông tin cập nhật
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Field rows */}
                {group.fields.map((field, index) => {
                  const oldVal = lecturer?.[field.key as LecturerKey];
                  const newVal = lecturerUpdate?.[field.key as LecturerKey];
                  const hasChanged = oldVal !== newVal;

                  return (
                    <Box key={field.key}>
                      <Box display="flex" minHeight={60}>
                        {/* Current Data */}
                        <Box flex={1} sx={{ borderRight: "1px solid #e0e0e0" }}>
                          <Box
                            display="flex"
                            flexDirection="column"
                            py={2}
                            px={3}
                            height="100%"
                          >
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontWeight: 500, mb: 1 }}
                            >
                              {field.label}:
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                wordBreak: "break-word",
                                fontWeight: 500,
                                flex: 1,
                              }}
                            >
                              {renderFieldValue(field, oldVal)}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Updated Data */}
                        <Box flex={1}>
                          <Box
                            display="flex"
                            flexDirection="column"
                            py={2}
                            px={3}
                            height="100%"
                          >
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontWeight: 500, mb: 1 }}
                            >
                              {field.label}:
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                wordBreak: "break-word",
                                fontWeight: 500,
                                flex: 1,
                                ...(hasChanged
                                  ? {
                                      backgroundColor: "#fff9c4",
                                      px: 1,
                                      py: 0.5,
                                      borderRadius: 1,
                                    }
                                  : {}),
                              }}
                            >
                              {renderFieldValue(field, newVal)}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      {index < group.fields.length - 1 && <Divider />}
                    </Box>
                  );
                })}
              </CardContent>
              <Box>
                <Divider />
                <Box
                  display="flex"
                  justifyContent="flex-end"
                  p={2}
                  sx={{ bgcolor: "#f5f5f5" }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Cập nhật lúc:{" "}
                    {formatDateToVietnamTime(lecturerUpdate?.updatedAt)}
                  </Typography>
                </Box>
              </Box>
            </Card>
          ))}
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            variant="contained"
            color="error"
            onClick={() => setConfirmType("reject")}
            startIcon={<CancelIcon />}
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              borderRadius: 2,
              px: 3,
            }}
          >
            Từ chối
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => setConfirmType("approve")}
            startIcon={<CheckCircleIcon />}
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              borderRadius: 2,
              px: 3,
            }}
          >
            Duyệt
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={!!confirmType}
        type={confirmType || "approve"}
        title={`Xác nhận ${confirmType === "approve" ? "duyệt" : "từ chối"} cập nhật`}
        message={
          confirmType === "approve"
            ? "Bạn có chắc chắn muốn duyệt thông tin cập nhật này?"
            : "Bạn có chắc chắn muốn từ chối thông tin cập nhật này?"
        }
        loading={isProcessing}
        rejectNote={adminNote}
        onRejectNoteChange={setAdminNote}
        rejectNoteRequired={confirmType === "reject"}
        onClose={handleCancelConfirm}
        onConfirm={() => handleConfirm(confirmType!)}
      />
    </>
  );
};

export default ApproveLecturerUpdateDialog;
