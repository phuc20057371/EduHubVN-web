import { School } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
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
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setLecturerProfileUpdate } from "../../../redux/slice/LecturerProfileUpdateSlice";
import { setOwnedCourseRequests } from "../../../redux/slice/RequestOwnedCourseSlice";
import { API } from "../../../utils/Fetch";
import ConfirmDialog from "../../general-dialog/ConfirmDialog";
import { formatDate, getCourseType, getScale } from "../../../utils/ChangeText";

const fields = [
  { label: "Tên khóa học", key: "title" },
  { label: "Chủ đề", key: "topic" },
  {
    label: "Loại khóa học",
    key: "courseType",
    render: (v: any) => getCourseType(v),
  },
  { label: "Quy mô", key: "scale", render: (v: any) => getScale(v) },
  { label: "Trình độ", key: "level" },
  { label: "Yêu cầu", key: "requirements" },
  { label: "Ngôn ngữ", key: "language" },
  {
    label: "Hình thức",
    key: "isOnline",
    render: (v: any) => (v ? "Online" : "Offline"),
  },
  { label: "Địa chỉ", key: "address" },
  {
    label: "Giá",
    key: "price",
    render: (v: any) => `${v?.toLocaleString?.() ?? v} VND`,
  },
  {
    label: "Ngày bắt đầu",
    key: "startDate",
    render: (v: any) => formatDate(v),
  },
  { label: "Ngày kết thúc", key: "endDate", render: (v: any) => formatDate(v) },
  { label: "Mô tả", key: "description" },
];

interface OwnedCourseUpdateDialogProps {
  open: boolean;
  data: any;
  onClose: () => void;
}

const ApproveOwnedCourseUpdateDialog: React.FC<
  OwnedCourseUpdateDialogProps
> = ({ open, data, onClose }) => {
  if (!data) return null;
  const dispatch = useDispatch();
  const { content, lecturerInfo } = data;
  const { original, update } = content;

  if (!original || !update) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Typography color="error">
            Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: "approve" | "reject" | null;
  }>({ open: false, type: null });
  const [adminNote, setAdminNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApprove = () => {
    setConfirmDialog({ open: true, type: "approve" });
  };

  const handleReject = () => {
    setConfirmDialog({ open: true, type: "reject" });
    setAdminNote("");
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      if (confirmDialog.type === "approve") {
        const res = await API.admin.approveOwnedCourseUpdate({
          id: update?.id,
        });
        if (!res.data.success) {
          toast.error("Duyệt thông tin cập nhật khóa học không thành công");
          return;
        }
        toast.success("Duyệt thông tin cập nhật khóa học thành công");
        const responseData = await API.admin.getOwnedCourseRequests();
        dispatch(setOwnedCourseRequests(responseData.data.data));
      } else if (confirmDialog.type === "reject") {
        if (!adminNote.trim()) {
          toast.error("Vui lòng nhập lý do từ chối");
          return;
        }
        const res = await API.admin.rejectOwnedCourseUpdate({
          id: update?.id,
          adminNote,
        });
        if (!res.data.success) {
          toast.error("Từ chối thông tin cập nhật khóa học không thành công");
          return;
        }
        toast.success("Từ chối thông tin cập nhật khóa học thành công");
        const responseData = await API.admin.getOwnedCourseRequests();
        dispatch(setOwnedCourseRequests(responseData.data.data));
      }

      // Refresh lecturer profile data
      const response = await API.admin.getLecturerAllProfile({
        id: lecturerInfo.id,
      });
      if (response.data.success) {
        dispatch(setLecturerProfileUpdate(response.data.data));
      }

      setConfirmDialog({ open: false, type: null });
      setAdminNote("");
      if (typeof onClose === "function") onClose();
    } catch (error) {
      console.error("Error in handleConfirm:", error);
      toast.error("Có lỗi xảy ra trong quá trình xử lý");
    } finally {
      setLoading(false);
    }
  };

  const isValueChanged = (originalValue: any, updateValue: any) => {
    return originalValue !== updateValue;
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
              <Avatar sx={{ bgcolor: "primary.main", width: 48, height: 48 }}>
                <School />
              </Avatar>
              <Box>
                <Typography variant="h6">
                  Yêu cầu cập nhật khóa học sở hữu
                </Typography>
                <Typography variant="body2">
                  ID: {content.original.id}
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {/* Lecturer Info Banner */}
          <Card
            variant="outlined"
            sx={{ borderRadius: 2, bgcolor: "primary.50", mb: 2 }}
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
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {lecturerInfo?.fullName}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", mb: 0.5 }}
                  >
                    {lecturerInfo?.academicRank} • Chuyên ngành:{" "}
                    {lecturerInfo?.specialization}
                  </Typography>
                  <Typography variant="body2">
                    Số năm KN: {lecturerInfo?.experienceYears} • SĐT:{" "}
                    {lecturerInfo?.phoneNumber}
                  </Typography>
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
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              So sánh thông tin khóa học
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
                </TableRow>
              </TableHead>
              <TableBody>
                {fields.map((row) => {
                  let originalVal = row.render
                    ? row.render(original[row.key])
                    : original[row.key];
                  let updateVal = row.render
                    ? row.render(update[row.key])
                    : update[row.key];
                  const changed = isValueChanged(originalVal, updateVal);

                  return (
                    <TableRow
                      key={row.key}
                      sx={{
                        backgroundColor: changed ? "#fffde7" : "#ffffff",
                        "&:hover": {
                          backgroundColor: changed ? "#fff9c4" : "#f9f9f9",
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
                            color: changed ? "text.secondary" : "text.primary",
                            textDecoration: changed ? "line-through" : "none",
                          }}
                        >
                          {originalVal ?? "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            color: changed ? "primary.main" : "text.primary",
                            fontWeight: changed ? "bold" : "normal",
                          }}
                        >
                          {updateVal ?? "-"}
                        </Typography>
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
                Được tạo lúc:{" "}
                {update?.createdAt
                  ? new Date(update.createdAt).toLocaleString("vi-VN")
                  : "Chưa cập nhật"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Cập nhật lần cuối:{" "}
                {update?.updatedAt
                  ? new Date(update.updatedAt).toLocaleString("vi-VN")
                  : "Chưa cập nhật"}
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
            ? "Bạn có chắc chắn muốn phê duyệt yêu cầu cập nhật khóa học này không?"
            : "Bạn có chắc chắn muốn từ chối yêu cầu cập nhật khóa học này không?"
        }
        loading={loading}
        rejectNote={adminNote}
        onRejectNoteChange={setAdminNote}
        rejectNoteRequired={confirmDialog.type === "reject"}
        onClose={() => setConfirmDialog({ open: false, type: null })}
        onConfirm={handleConfirm}
      />
    </>
  );
};

export default ApproveOwnedCourseUpdateDialog;
