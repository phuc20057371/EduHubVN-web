import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { Lecturer } from "../types/Lecturer";

export interface LecturerDetailDialogProps {
  open: boolean;
  onClose: () => void;
  lecturer: Lecturer;
  lecturerUpdate: Lecturer;
}

const getAcademicRankLabel = (rank: string) => {
  switch (rank) {
    case "CN":
      return "Cử nhân";
    case "THS":
      return "Thạc sĩ";
    case "TS":
      return "Tiến sĩ";
    case "PGS":
      return "Phó giáo sư";
    case "GS":
      return "Giáo sư";
    default:
      return rank;
  }
};

const fieldGroups = [
  {
    title: "⭐ Thông tin quan trọng",
    important: true,
    fields: [
      {
        label: "Học hàm",
        key: "academicRank",
        render: (v: any) => getAcademicRankLabel(v),
        important: true,
      },
      { label: "Chuyên ngành", key: "specialization", important: true },
      {
        label: "Kinh nghiệm",
        key: "experienceYears",
        render: (v: any) => v + " năm",
        important: true,
      },
      { label: "Lĩnh vực công việc", key: "jobField", important: true },
    ],
  },
  {
    title: "👤 Thông tin cá nhân",
    fields: [
      { label: "Họ tên", key: "fullName", important: false },
      { label: "SĐT", key: "phoneNumber", important: false },
      {
        label: "Ngày sinh",
        key: "dateOfBirth",
        render: (v: any) => (v ? new Date(v).toLocaleDateString("vi-VN") : "-"),
        important: false,
      },
      {
        label: "Giới tính",
        key: "gender",
        render: (v: any) => (v ? "Nam" : "Nữ"),
        important: false,
      },
      { label: "Tiểu sử", key: "bio", important: false },
    ],
  },
];

const highlightStyle = {
  background: "#fff3e0",
  fontWeight: 600,
  color: "#e65100",
  border: "2px solid #ff9800",
  borderRadius: "4px",
  padding: "4px 8px",
};

const importantFieldStyle = {
  background: "#f3e5f5",
  fontWeight: 600,
  color: "#7b1fa2",
  padding: "8px",
  borderLeft: "4px solid #9c27b0",
};

const importantGroupStyle = {
  background: "linear-gradient(135deg, #f3e5f5 0%, #e8f5e8 100%)",
  border: "2px solid #9c27b0",
  borderRadius: "12px",
  padding: "16px",
  marginBottom: "16px",
};

import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";
import { API } from "../utils/Fetch";
import { useDispatch, useSelector } from "react-redux";
import { setLecturerPendingUpdate } from "../redux/slice/LecturerPendingUpdateSlice";

const LecturerDetailUpdateDialog: React.FC<LecturerDetailDialogProps> = ({
  open,
  onClose,
  lecturer,
  lecturerUpdate,
}) => {
  const [confirmType, setConfirmType] = useState<null | "approve" | "reject">(
    null,
  );
  const [adminNote, setAdminNote] = useState("");

  const lecturerUpdateList = useSelector((state: any) =>
    Array.isArray(state.lecturerPendingUpdate)
      ? state.lecturerPendingUpdate
      : [],
  );
  const dispatch = useDispatch();

  const handleApprove = () => {
    setConfirmType("approve");
  };
  const handleReject = () => {
    setConfirmType("reject");
  };
  const handleConfirm = async () => {
    if (confirmType === "approve") {
      console.log("APPROVE", (lecturerUpdate as any)?.id);
      try {
        await API.admin.approveLecturerUpdate({
          id: (lecturerUpdate as any)?.id,
        });
        // Dispatch action to update state if needed
        dispatch(
          setLecturerPendingUpdate(
            (Array.isArray(lecturerUpdateList)
              ? lecturerUpdateList
              : []
            ).filter(
              (l: any) => l.lecturerUpdate?.id !== (lecturerUpdate as any)?.id,
            ),
          ),
        );
        toast.success("Duyệt thông tin cập nhật thành công!");
      } catch (error) {
        toast.error("Error approving lecturer update:");
      }
    } else if (confirmType === "reject") {
      console.log("REJECT", (lecturerUpdate as any)?.id, adminNote);
      try {
        await API.admin.rejectLecturerUpdate({
          id: (lecturerUpdate as any)?.id,
          adminNote,
        });
        dispatch(
          setLecturerPendingUpdate(
            (Array.isArray(lecturerUpdateList)
              ? lecturerUpdateList
              : []
            ).filter(
              (l: any) => l.lecturerUpdate?.id !== (lecturerUpdate as any)?.id,
            ),
          ),
        );
        toast.success("Từ chối thông tin cập nhật thành công!");
      } catch (error) {
        toast.error("Error rejecting lecturer update:");
      }
    }
    setConfirmType(null);
    setAdminNote("");
    if (typeof onClose === "function") onClose();
  };
  const handleCancel = () => {
    setConfirmType(null);
    setAdminNote("");
  };

  if (!open) return null;
  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            m: 0,
            p: 3,
            pr: 5,
            background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
            color: "white",
            fontWeight: "bold",
            fontSize: "1.25rem",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            📊 So sánh thông tin cập nhật giảng viên
            <Typography
              component="span"
              sx={{ fontSize: "0.9rem", opacity: 0.9 }}
            >
              ({(lecturer as any)?.fullName || "N/A"})
            </Typography>
          </Box>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ maxHeight: "70vh", overflowY: "auto" }}>
          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            gap={3}
          >
            {/* Thông tin hiện tại */}
            <Box flex={1} minWidth={0}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: "primary.main",
                  fontWeight: "bold",
                }}
              >
                👤 Thông tin hiện tại
              </Typography>
              {fieldGroups.map((group) => (
                <Box
                  key={group.title}
                  mb={2}
                  sx={group.important ? importantGroupStyle : {}}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    sx={{
                      mb: 1,
                      color: group.important ? "#7b1fa2" : "text.primary",
                      fontSize: group.important ? "1.1rem" : "1rem",
                    }}
                  >
                    {group.title}
                    {group.important && (
                      <Typography
                        component="span"
                        sx={{
                          fontSize: "0.8rem",
                          ml: 1,
                          color: "text.secondary",
                        }}
                      >
                        (Thông tin quan trọng)
                      </Typography>
                    )}
                  </Typography>
                  <Box
                    component="table"
                    width="100%"
                    sx={{ borderCollapse: "collapse" }}
                  >
                    <tbody>
                      {group.fields.map((row) => {
                        const val = row.render
                          ? row.render((lecturer as any)?.[row.key])
                          : (lecturer as any)?.[row.key];
                        return (
                          <tr key={row.key}>
                            <td
                              style={{
                                borderBottom: "1px solid #eee",
                                fontWeight: row.important ? 700 : 500,
                                width: "40%",
                                padding: "8px 4px",
                                color: row.important ? "#7b1fa2" : "inherit",
                              }}
                            >
                              {row.label}
                              {row.important && (
                                <span style={{ color: "#f57c00" }}>*</span>
                              )}
                            </td>
                            <td
                              style={{
                                borderBottom: "1px solid #eee",
                                padding: "8px 4px",
                                ...(row.important ? importantFieldStyle : {}),
                              }}
                            >
                              {val ?? "-"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Box>
                </Box>
              ))}
            </Box>
            {/* Thông tin cập nhật */}
            <Box flex={1} minWidth={0}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: "warning.main",
                  fontWeight: "bold",
                }}
              >
                📝 Thông tin cập nhật
              </Typography>
              {fieldGroups.map((group) => (
                <Box
                  key={group.title}
                  mb={2}
                  sx={group.important ? importantGroupStyle : {}}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    sx={{
                      mb: 1,
                      color: group.important ? "#7b1fa2" : "text.primary",
                      fontSize: group.important ? "1.1rem" : "1rem",
                    }}
                  >
                    {group.title}
                    {group.important && (
                      <Typography
                        component="span"
                        sx={{
                          fontSize: "0.8rem",
                          ml: 1,
                          color: "text.secondary",
                        }}
                      >
                        (Thông tin quan trọng)
                      </Typography>
                    )}
                  </Typography>
                  <Box
                    component="table"
                    width="100%"
                    sx={{ borderCollapse: "collapse" }}
                  >
                    <tbody>
                      {group.fields.map((row) => {
                        const val = row.render
                          ? row.render((lecturerUpdate as any)?.[row.key])
                          : (lecturerUpdate as any)?.[row.key];
                        // Highlight nếu khác với bản gốc
                        const oldVal = row.render
                          ? row.render((lecturer as any)?.[row.key])
                          : (lecturer as any)?.[row.key];
                        const changed = val !== oldVal;
                        return (
                          <tr key={row.key}>
                            <td
                              style={{
                                borderBottom: "1px solid #eee",
                                fontWeight: row.important ? 700 : 500,
                                width: "40%",
                                padding: "8px 4px",
                                color: row.important ? "#7b1fa2" : "inherit",
                              }}
                            >
                              {row.label}
                              {row.important && (
                                <span style={{ color: "#f57c00" }}>*</span>
                              )}
                            </td>
                            <td
                              style={{
                                borderBottom: "1px solid #eee",
                                ...(changed
                                  ? highlightStyle
                                  : row.important
                                    ? importantFieldStyle
                                    : {}),
                              }}
                            >
                              {val ?? "-"}
                              {changed && (
                                <Typography
                                  component="span"
                                  sx={{
                                    fontSize: "0.75rem",
                                    ml: 1,
                                    color: "success.main",
                                    fontWeight: "bold",
                                  }}
                                >
                                  (Đã thay đổi)
                                </Typography>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2, bgcolor: "grey.50" }}>
          <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
            💡 Xem xét kỹ các thông tin quan trọng được đánh dấu * trước khi
            quyết định
          </Typography>
          <Button
            onClick={handleReject}
            color="error"
            variant="outlined"
            startIcon={<span>❌</span>}
            sx={{ minWidth: 120 }}
          >
            Từ chối
          </Button>
          <Button
            onClick={handleApprove}
            color="success"
            variant="contained"
            startIcon={<span>✅</span>}
            sx={{ minWidth: 120 }}
          >
            Duyệt
          </Button>
        </DialogActions>
      </Dialog>
      {/* Simple Confirm Dialog */}
      <Dialog
        open={!!confirmType}
        onClose={handleCancel}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
          {confirmType === "approve" ? "Xác nhận duyệt" : "Xác nhận từ chối"}
        </DialogTitle>
        <DialogContent sx={{ pt: 2, pb: 1 }}>
          {confirmType === "approve" ? (
            <Typography sx={{ textAlign: "center", mb: 2 }}>
              Bạn có chắc chắn muốn duyệt thông tin cập nhật này?
            </Typography>
          ) : (
            <>
              <Typography sx={{ textAlign: "center", mb: 2 }}>
                Bạn có chắc chắn muốn từ chối thông tin cập nhật này?
              </Typography>
              <TextField
                label="Lý do từ chối"
                size="small"
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                fullWidth
                multiline
                rows={2}
                placeholder="Nhập lý do từ chối..."
                required
              />
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3, gap: 2 }}>
          <Button onClick={handleCancel} variant="outlined" sx={{ minWidth: 80 }}>
            Hủy
          </Button>
          <Button
            onClick={handleConfirm}
            color={confirmType === "approve" ? "success" : "error"}
            variant="contained"
            disabled={confirmType === "reject" && !adminNote.trim()}
            sx={{ minWidth: 80 }}
          >
            {confirmType === "approve" ? "Duyệt" : "Từ chối"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LecturerDetailUpdateDialog;
