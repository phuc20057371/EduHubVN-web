import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Avatar,
  TextField,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import { API } from "../../../utils/Fetch";
import { useDispatch } from "react-redux";
import { setLecturerRequests } from "../../../redux/slice/LecturerRquestSlice";

interface AttendedCourseUpdateDialogProps {
  open: boolean;
  data: any;
  onClose: () => void;
}

const highlightStyle = { background: "#fffde7" };

const fields = [
  { label: "Tên khóa học", key: "title" },
  { label: "Chủ đề", key: "topic" },
  { label: "Loại khóa học", key: "courseType" },
  { label: "Quy mô", key: "scale" },
  { label: "Địa điểm", key: "location" },
  { label: "Tổ chức", key: "organizer" },
  { label: "Số giờ học", key: "numberOfHour", render: (v: any) => `${v} giờ` },
  { label: "Ngày bắt đầu", key: "startDate" },
  { label: "Ngày kết thúc", key: "endDate" },
  { label: "Mô tả", key: "description" },
  { label: "URL khóa học", key: "courseUrl", render: (v: any) => <a href={v} target="_blank" rel="noopener noreferrer">{v}</a> },
];

const ApproveAttendedCourseUpdateDialog: React.FC<AttendedCourseUpdateDialogProps> = ({
  open,
  data,
  onClose,
}) => {
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

  const [confirmType, setConfirmType] = useState<null | "approve" | "reject">(
    null,
  );
  const [adminNote, setAdminNote] = useState("");

  const handleConfirm = async () => {
    if (confirmType === "approve") {
      try {
        const res = await API.admin.approveAttendedCourseUpdate({
          id: update?.id,
        });
        if (!res.data.success) {
          toast.error("Duyệt thông tin cập nhật khóa học không thành công");
          return;
        }
        toast.success("Duyệt thông tin cập nhật khóa học thành công");
        const responseData = await API.admin.getLecturerRequests();
        dispatch(setLecturerRequests(responseData.data.data));
      } catch (error) {
        console.error("Error approving course update:", error);
        toast.error("Có lỗi xảy ra khi duyệt thông tin cập nhật khóa học");
        return;
      }
    } else if (confirmType === "reject") {
      if (!adminNote.trim()) {
        toast.error("Vui lòng nhập lý do từ chối");
        return;
      }
      try {
        const res = await API.admin.rejectAttendedCourseUpdate({
          id: update?.id,
          adminNote,
        });
        if (!res.data.success) {
          toast.error("Từ chối thông tin cập nhật khóa học không thành công");
          return;
        }
        toast.success("Từ chối thông tin cập nhật khóa học thành công");
        const responseData = await API.admin.getLecturerRequests();
        dispatch(setLecturerRequests(responseData.data.data));
      } catch (error) {
        console.error("Error rejecting course update:", error);
        toast.error("Có lỗi xảy ra khi từ chối thông tin cập nhật khóa học");
        return;
      }
    }
    setConfirmType(null);
    setAdminNote("");
    if (typeof onClose === "function") onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          So sánh thông tin cập nhật khóa học đã tham gia - ID: {original?.id}
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {/* Thông tin giảng viên */}
          <Box
            bgcolor="#fafbfc"
            borderRadius={2}
            p={2}
            border="1px solid #eee"
            display="flex"
            alignItems="center"
            gap={2}
            mb={3}
          >
            <Avatar
              src={lecturerInfo?.avatarUrl || undefined}
              alt={lecturerInfo?.fullName}
              sx={{ width: 60, height: 60, border: "1px solid #ddd" }}
            >
              {lecturerInfo?.fullName ? lecturerInfo.fullName[0] : ""}
            </Avatar>
            <Box flex={1}>
              <Typography fontWeight={600}>{lecturerInfo?.fullName}</Typography>
              <Typography variant="body2" color="text.secondary">
                {lecturerInfo?.academicRank} • Chuyên ngành:{" "}
                {lecturerInfo?.specialization}
              </Typography>
              <Typography variant="body2">
                Số năm KN: {lecturerInfo?.experienceYears} • SĐT:{" "}
                {lecturerInfo?.phoneNumber}
              </Typography>
            </Box>
          </Box>

          {/* So sánh khóa học */}
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
            📘 So sánh thông tin khóa học đã tham gia
          </Typography>
          <Box
            component="table"
            width="100%"
            sx={{ borderCollapse: "collapse" }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    borderBottom: "2px solid #ddd",
                    fontWeight: 600,
                    width: "25%",
                    padding: "8px",
                  }}
                >
                  Thông tin
                </th>
                <th
                  style={{
                    borderBottom: "2px solid #ddd",
                    fontWeight: 600,
                    width: "37.5%",
                    padding: "8px",
                  }}
                >
                  Hiện tại
                </th>
                <th
                  style={{
                    borderBottom: "2px solid #ddd",
                    fontWeight: 600,
                    width: "37.5%",
                    padding: "8px",
                  }}
                >
                  Cập nhật
                </th>
              </tr>
            </thead>
            <tbody>
              {fields.map((row) => {
                let originalVal = row.render
                  ? row.render(original[row.key])
                  : original[row.key];
                let updateVal = row.render
                  ? row.render(update[row.key])
                  : update[row.key];
                const changed = originalVal !== updateVal;

                return (
                  <tr key={row.key}>
                    <td
                      style={{
                        borderBottom: "1px solid #eee",
                        fontWeight: 500,
                        padding: "8px",
                      }}
                    >
                      {row.label}
                    </td>
                    <td
                      style={{ borderBottom: "1px solid #eee", padding: "8px" }}
                    >
                      {originalVal ?? "-"}
                    </td>
                    <td
                      style={{
                        borderBottom: "1px solid #eee",
                        padding: "8px",
                        ...(changed ? highlightStyle : {}),
                      }}
                    >
                      {updateVal ?? "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmType("approve")}
            color="success"
            variant="contained"
          >
            Duyệt
          </Button>
          <Button
            onClick={() => setConfirmType("reject")}
            color="error"
            variant="contained"
          >
            Từ chối
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dialog xác nhận */}
      <Dialog
        open={!!confirmType}
        onClose={() => {
          setConfirmType(null);
          setAdminNote("");
        }}
        maxWidth="xs"
      >
        <DialogTitle>
          Xác nhận {confirmType === "approve" ? "duyệt" : "từ chối"}
        </DialogTitle>
        <DialogContent>
          {confirmType === "approve" ? (
            <Typography>
              Bạn có chắc chắn muốn duyệt thông tin cập nhật này?
            </Typography>
          ) : (
            <>
              <Typography>
                Bạn có chắc chắn muốn từ chối thông tin cập nhật này?
              </Typography>
              <TextField
                label="Lý do từ chối (admin note)"
                size="small"
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                fullWidth
                sx={{ mt: 2 }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setConfirmType(null);
              setAdminNote("");
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleConfirm}
            color="primary"
            variant="contained"
            disabled={confirmType === "reject" && !adminNote.trim()}
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ApproveAttendedCourseUpdateDialog;

