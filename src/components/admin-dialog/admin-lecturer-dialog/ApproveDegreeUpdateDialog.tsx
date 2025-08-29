import { Close, SchoolOutlined } from "@mui/icons-material";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setDegreeRequests } from "../../../redux/slice/RequestDegreeSlice";
import {
  formatDateToVietnamTime,
  getAcademicRank,
} from "../../../utils/ChangeText";
import { API } from "../../../utils/Fetch";
import ConfirmDialog from "../../general-dialog/ConfirmDialog";

interface ApproveDegreeUpdateDialogProps {
  open: boolean;
  onClose: () => void;
  data: any;
  onSuccess?: () => void;
}

const ApproveDegreeUpdateDialog: React.FC<ApproveDegreeUpdateDialogProps> = ({
  open,
  onClose,
  data,
  onSuccess,
}) => {
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: "approve" | "reject" | null;
  }>({ open: false, type: null });
  const [adminNote, setAdminNote] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const isValueChanged = (originalValue: any, updateValue: any) => {
    return originalValue !== updateValue;
  };

  // Always define these constants
  const comparisonRows = [
    {
      label: "Reference ID",
      originalKey: "referenceId",
      updateKey: "referenceId",
    },
    { label: "Tên bằng cấp", originalKey: "name", updateKey: "name" },
    { label: "Chuyên ngành", originalKey: "major", updateKey: "major" },
    {
      label: "Cơ sở đào tạo",
      originalKey: "institution",
      updateKey: "institution",
    },
    { label: "Năm bắt đầu", originalKey: "startYear", updateKey: "startYear" },
    {
      label: "Năm tốt nghiệp",
      originalKey: "graduationYear",
      updateKey: "graduationYear",
    },
    { label: "Trình độ", originalKey: "level", updateKey: "level" },
    { label: "URL tài liệu", originalKey: "url", updateKey: "url" },
    { label: "Mô tả", originalKey: "description", updateKey: "description" },
  ];

  // Handle invalid data case in JSX instead of early return
  if (!data || !data.content || !data.lecturerInfo) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Lỗi dữ liệu</DialogTitle>
        <DialogContent>
          <Typography>Không có dữ liệu để hiển thị.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Đóng</Button>
        </DialogActions>
      </Dialog>
    );
  }

  const { content, lecturerInfo } = data;
  const { original, update } = content;

  const handleApprove = () => {
    setConfirmDialog({ open: true, type: "approve" });
  };

  const handleReject = () => {
    setConfirmDialog({ open: true, type: "reject" });
    setAdminNote("");
  };

  const handleConfirmAction = async () => {
    if (!data?.content?.update?.id) return;

    setLoading(true);
    try {
      if (confirmDialog.type === "approve") {
        await API.admin.approveDegreeUpdate({ id: data.content.update.id });
        toast.success("Phê duyệt cập nhật bằng cấp thành công!");
      } else if (confirmDialog.type === "reject") {
        if (!adminNote.trim()) {
          toast.error("Vui lòng nhập lý do từ chối!");
          return;
        }
        await API.admin.rejectDegreeUpdate({
          id: data.content.update.id,
          adminNote: adminNote.trim(),
        });
        toast.success("Từ chối cập nhật bằng cấp thành công!");
      }

      // Update Redux store after successful action
      const responseData = await API.admin.getDegreeRequests();
      dispatch(setDegreeRequests(responseData.data.data));
      setConfirmDialog({ open: false, type: null });
      onSuccess?.();

      onClose();
    } catch (error: any) {
      console.error("Error processing request:", error);
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi xử lý yêu cầu!",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                src={""}
                sx={{ bgcolor: "primary.main", width: 48, height: 48 }}
              >
                <SchoolOutlined />
              </Avatar>
              <Box>
                <Typography variant="h6">Yêu cầu cập nhật Bằng cấp</Typography>
                <Typography variant="body2">
                  ID: {data?.content?.original?.id}
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={onClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          {/* Lecturer Info Banner */}

          <Card
            variant="outlined"
            sx={{ borderRadius: 2, bgcolor: "primary.50" }}
          >
            <CardContent sx={{ py: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  src={lecturerInfo?.avatarUrl || ""}
                  sx={{ width: 60, height: 60 }}
                >
                  {lecturerInfo?.fullName?.charAt(0) || ""}
                </Avatar>

                <Box sx={{ flexGrow: 1 }}>
                  {/* Hàng 1: Tên và Học hàm */}
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: 1,
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {lecturerInfo?.fullName}
                    </Typography>
                    <Chip
                      size="small"
                      label={getAcademicRank(lecturerInfo?.academicRank)}
                      color="primary"
                      variant="outlined"
                    />
                  </Box>

                  {/* Email */}
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", mb: 0.5 }}
                  >
                    {lecturerInfo?.email}
                  </Typography>

                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary", mt: 0.5 }}
                    >
                      {lecturerInfo?.experienceYears} năm kinh nghiệm trong lĩnh
                      vực {lecturerInfo?.specialization}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Divider sx={{ my: 2 }} />
          <Box
            sx={{
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: 2,
              justifyContent: "space-between",
            }}
          >
            {" "}
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              So sánh thông tin bằng cấp
            </Typography>
          </Box>

          <TableContainer
            component={Paper}
            elevation={3}
            sx={{ borderRadius: 2, overflow: "hidden" }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                  <TableCell sx={{ fontWeight: "bold", width: "30%" }}>
                    Trường thông tin
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", width: "32.5%" }}>
                    Thông tin gốc
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", width: "32.5%" }}>
                    Thông tin cập nhật
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: "bold", width: "5%" }}
                    align="center"
                  >
                    {/* Icon status */}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {comparisonRows.map((row) => {
                  const originalValue = original?.[row.originalKey];
                  const updateValue = update?.[row.updateKey];
                  const isChanged = isValueChanged(originalValue, updateValue);

                  const renderValue = (value: any, key: string) => {
                    if (!value) return "—";

                    if (key === "url") {
                      return (
                        <Typography
                          component="a"
                          href={value}
                          target="_blank"
                          rel="noopener noreferrer"
                          variant="body2"
                          sx={{
                            color: "primary.main",
                            textDecoration: "underline",
                            "&:hover": {
                              textDecoration: "none",
                            },
                          }}
                        >
                          Xem tài liệu
                        </Typography>
                      );
                    }

                    return value;
                  };

                  return (
                    <TableRow
                      key={row.label}
                      sx={{
                        backgroundColor: isChanged ? "#fffde7" : "#ffffff",
                        "&:hover": {
                          backgroundColor: isChanged ? "#fff9c4" : "#f9f9f9",
                        },
                      }}
                    >
                      <TableCell sx={{ fontWeight: 500 }}>
                        {row.label}
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            color: isChanged
                              ? "text.secondary"
                              : "text.primary",
                            textDecoration: isChanged ? "line-through" : "none",
                          }}
                        >
                          {renderValue(originalValue, row.originalKey)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            color: isChanged ? "primary.main" : "text.primary",
                            fontWeight: isChanged ? "bold" : "normal",
                          }}
                        >
                          {renderValue(updateValue, row.updateKey)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        {isChanged && (
                          <Tooltip title="Đã thay đổi" arrow>
                            <ChangeCircleIcon color="warning" />
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Status Info */}
          <Box
            sx={{
              mt: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ textAlign: "right", width: "100%" }}>
              <Typography variant="body2" color="text.secondary">
                Được tạo lúc: {formatDateToVietnamTime(update?.createdAt)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Cập nhật lần cuối: {formatDateToVietnamTime(update?.updatedAt)}
              </Typography>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            variant="contained"
            color="error"
            onClick={handleReject}
            disabled={loading}
          >
            Từ chối
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleApprove}
            disabled={loading}
          >
            Duyệt
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        type={confirmDialog.type === "approve" ? "approve" : "reject"}
        title={
          confirmDialog.type === "approve"
            ? "Xác nhận phê duyệt"
            : "Xác nhận từ chối"
        }
        message={
          confirmDialog.type === "approve"
            ? "Bạn có chắc chắn muốn phê duyệt yêu cầu cập nhật bằng cấp này không?"
            : "Bạn có chắc chắn muốn từ chối yêu cầu cập nhật bằng cấp này không?"
        }
        loading={loading}
        rejectNote={adminNote}
        onRejectNoteChange={setAdminNote}
        rejectNoteRequired={confirmDialog.type === "reject"}
        onClose={() => setConfirmDialog({ open: false, type: null })}
        onConfirm={handleConfirmAction}
      />
    </>
  );
};

export default ApproveDegreeUpdateDialog;
