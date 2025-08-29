import { School } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import {
  Avatar,
  Backdrop,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
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
import { setResearchProjectRequests } from "../../../redux/slice/RequestResearchProjectSlice";
import {
  formatDate,
  getProjectType,
  getScale,
} from "../../../utils/ChangeText";
import { API } from "../../../utils/Fetch";
import ConfirmDialog from "../../general-dialog/ConfirmDialog";

interface ResearchProjectUpdateDialogProps {
  open: boolean;
  data: any;
  onClose: () => void;
}

const fields = [
  { label: "Tên đề tài", key: "title" },
  { label: "Lĩnh vực nghiên cứu", key: "researchArea" },
  {
    label: "Loại đề tài",
    key: "projectType",
    render: (v: any) => getProjectType(v),
  },
  { label: "Quy mô", key: "scale", render: (v: any) => getScale(v) },
  { label: "Vai trò trong đề tài", key: "roleInProject" },
  { label: "Nguồn tài trợ", key: "foundingSource" },
  {
    label: "Số tiền tài trợ",
    key: "foundingAmount",
    render: (v: any) => `${v?.toLocaleString?.() ?? v} VND`,
  },
  {
    label: "Ngày bắt đầu",
    key: "startDate",
    render: (v: any) => formatDate(v),
  },
  { label: "Ngày kết thúc", key: "endDate", render: (v: any) => formatDate(v) },
  { label: "Mô tả", key: "description" },
  { label: "Trạng thái", key: "courseStatus" },
  {
    label: "URL công bố",
    key: "publishedUrl",
    render: (v: any) => (
      <a href={v} target="_blank" rel="noopener noreferrer">
        {v}
      </a>
    ),
  },
];

const ApproveResearchProjectUpdateDialog: React.FC<
  ResearchProjectUpdateDialogProps
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
        const res = await API.admin.approveResearchProjectUpdate({
          id: update?.id,
        });
        if (!res.data.success) {
          toast.error(
            "Duyệt thông tin cập nhật dự án nghiên cứu không thành công",
          );
          return;
        }
        const responseData = await API.admin.getResearchProjectRequests();
        dispatch(setResearchProjectRequests(responseData.data.data));
        toast.success("Duyệt thông tin cập nhật dự án nghiên cứu thành công");
      } else if (confirmDialog.type === "reject") {
        if (!adminNote.trim()) {
          toast.error("Vui lòng nhập lý do từ chối");
          setLoading(false);
          return;
        }
        const res = await API.admin.rejectResearchProjectUpdate({
          id: update?.id,
          adminNote,
        });
        if (!res.data.success) {
          toast.error(
            "Từ chối thông tin cập nhật dự án nghiên cứu không thành công",
          );
          return;
        }
        const responseData = await API.admin.getResearchProjectRequests();
        dispatch(setResearchProjectRequests(responseData.data.data));
        toast.success("Từ chối thông tin cập nhật dự án nghiên cứu thành công");
      }

      // Refresh lecturer profile data
      const response = await API.admin.getLecturerAllProfile({
        id: lecturerInfo.id,
      });
      if (response.data.success) {
        dispatch(setLecturerProfileUpdate(response.data.data));
      }
    } catch (error) {
      console.error(`Error ${confirmDialog.type}ing project update:`, error);
      toast.error(
        `Có lỗi xảy ra khi ${confirmDialog.type === "approve" ? "duyệt" : "từ chối"} thông tin cập nhật dự án nghiên cứu`,
      );
      return;
    } finally {
      setLoading(false);
    }

    setConfirmDialog({ open: false, type: null });
    setAdminNote("");
    if (typeof onClose === "function") onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        {/* Loading Backdrop */}
        <Backdrop
          sx={{
            position: "absolute",
            color: "#fff",
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
          open={loading}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <CircularProgress color="inherit" size={40} />
            <Typography variant="body1" sx={{ color: "white" }}>
              Đang xử lý yêu cầu...
            </Typography>
          </Box>
        </Backdrop>

        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ bgcolor: "primary.main", width: 48, height: 48 }}>
              <School />
            </Avatar>
            <Box>
              <Typography variant="h6">
                Yêu cầu cập nhật dự án nghiên cứu
              </Typography>
              <Typography variant="body2">ID: {original?.id}</Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small" disabled={loading}>
            <CloseIcon />
          </IconButton>
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
              So sánh thông tin dự án nghiên cứu
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
                  const changed = originalVal !== updateVal;

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
        <DialogActions>
          <Button
            onClick={handleReject}
            color="error"
            variant="contained"
            disabled={loading}
          >
            Từ chối
          </Button>
          <Button
            onClick={handleApprove}
            color="success"
            variant="contained"
            disabled={loading}
          >
            Duyệt
          </Button>
        </DialogActions>
      </Dialog>
      {/* ConfirmDialog */}
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
            ? "Bạn có chắc chắn muốn phê duyệt yêu cầu cập nhật dự án nghiên cứu này không?"
            : "Bạn có chắc chắn muốn từ chối yêu cầu cập nhật dự án nghiên cứu này không?"
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

export default ApproveResearchProjectUpdateDialog;
