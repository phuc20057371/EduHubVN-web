import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Card,
  CardContent,
  Chip,
  Stack,
  Divider,
  TextField,
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
    title: "Thông tin chuyên môn",
    fields: [
      {
        label: "Học hàm",
        key: "academicRank",
        render: (v: any) => getAcademicRankLabel(v),
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

import React, { useState } from "react";
import { toast } from "react-toastify";
import { API } from "../utils/Fetch";
import { useDispatch, useSelector } from "react-redux";
import { setLecturerPendingUpdate } from "../redux/slice/LecturerPendingUpdateSlice";

const FieldCard: React.FC<{
  field: any;
  currentValue: any;
  updateValue: any;
  isUpdate?: boolean;
}> = ({ field, currentValue, updateValue, isUpdate = false }) => {
  const displayValue = field.render
    ? field.render(isUpdate ? updateValue : currentValue)
    : isUpdate
    ? updateValue
    : currentValue;
  const hasChanged = isUpdate && currentValue !== updateValue;

  return (
    <Box sx={{ mb: 2 }}>
      <TextField
        label={field.label}
        value={displayValue ?? "-"}
        fullWidth
        variant="outlined"
        size="small"
        multiline={field.key === "bio"}
        rows={field.key === "bio" ? 4 : 1}
        InputProps={{
          readOnly: true,
          endAdornment: hasChanged ? (
            <Chip
              label="Đã sửa"
              size="small"
              color="warning"
              variant="outlined"
              sx={{ 
                fontSize: "0.7rem", 
                height: "20px",
                borderColor: "#ff9800",
                backgroundColor: "rgba(255, 152, 0, 0.1)"
              }}
            />
          ) : null,
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            backgroundColor: hasChanged ? "rgba(255, 152, 0, 0.08)" : "rgba(255, 255, 255, 0.9)",
            borderRadius: 3,
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: hasChanged ? "rgba(255, 152, 0, 0.12)" : "rgba(255, 255, 255, 0.95)",
              boxShadow: hasChanged 
                ? "0 4px 15px rgba(255, 152, 0, 0.2)" 
                : "0 4px 15px rgba(0,0,0,0.1)",
            },
            "&.Mui-focused": {
              backgroundColor: hasChanged ? "rgba(255, 152, 0, 0.15)" : "white",
              boxShadow: hasChanged 
                ? "0 6px 20px rgba(255, 152, 0, 0.25)" 
                : "0 6px 20px rgba(37, 99, 235, 0.15)",
            },
            "& fieldset": {
              borderColor: hasChanged ? "rgba(255, 152, 0, 0.5)" : "rgba(0, 0, 0, 0.23)",
              borderWidth: hasChanged ? "2px" : "1px",
            },
            "&:hover fieldset": {
              borderColor: hasChanged ? "rgba(255, 152, 0, 0.7)" : "rgba(0, 0, 0, 0.23)",
            },
            "&.Mui-focused fieldset": {
              borderColor: hasChanged ? "#ff9800" : "primary.main",
              borderWidth: "2px",
            },
          },
          "& .MuiInputLabel-root": {
            fontWeight: hasChanged ? 600 : 400,
            "&.Mui-focused": {
              color: hasChanged ? "#ff9800" : "primary.main",
            },
          },
          "& .MuiInputBase-input": {
            fontWeight: hasChanged ? 600 : 400,
          },
        }}
      />
    </Box>
  );
};

const SectionCard: React.FC<{
  group: any;
  lecturer: any;
  lecturerUpdate?: any;
  isUpdate?: boolean;
}> = ({ group, lecturer, lecturerUpdate, isUpdate = false }) => {
  return (
    <Card 
      variant="outlined" 
      sx={{ 
        mb: 3,
        borderRadius: 3,
        border: "1px solid #e5e7eb",
        overflow: "hidden",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
          transform: "translateY(-2px)",
        }
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <Box
          sx={{
            p: 3,
            background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700, 
              fontSize: "1.1rem", 
              color: "#334155",
              letterSpacing: "0.5px"
            }}
          >
            {group.title}
          </Typography>
        </Box>
        <Box sx={{ p: 3 }}>
          {group.fields.map((field: any) => {
            const currentValue = (lecturer as any)?.[field.key];
            const updateValue = (lecturerUpdate as any)?.[field.key];

            return (
              <FieldCard
                key={field.key}
                field={field}
                currentValue={currentValue}
                updateValue={updateValue}
                isUpdate={isUpdate}
              />
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};

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
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle
          sx={{
            m: 0,
            p: 3,
            bgcolor: "primary.main",
            color: "white",
            fontWeight: "bold",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            So sánh thông tin cập nhật
            <Typography
              component="span"
              sx={{ fontSize: "0.9rem", opacity: 0.9 }}
            >
              - {(lecturer as any)?.fullName || "N/A"} (ID: {(lecturer as any)?.id || "N/A"})
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
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Stack direction={{ xs: "column", lg: "row" }} spacing={4}>
            <Box flex={1}>
              <Typography
                variant="h6"
                sx={{ mb: 3, color: "primary.main", fontWeight: 600 }}
              >
                Thông tin hiện tại
              </Typography>
              {fieldGroups.map((group) => (
                <SectionCard
                  key={`current-${group.title}`}
                  group={group}
                  lecturer={lecturer}
                  lecturerUpdate={lecturerUpdate}
                  isUpdate={false}
                />
              ))}
            </Box>

            <Divider
              orientation="vertical"
              flexItem
              sx={{ display: { xs: "none", lg: "block" } }}
            />
            <Divider sx={{ display: { xs: "block", lg: "none" } }} />

            <Box flex={1}>
              <Typography
                variant="h6"
                sx={{ mb: 3, color: "warning.main", fontWeight: 600 }}
              >
                Thông tin cập nhật
              </Typography>
              {fieldGroups.map((group) => (
                <SectionCard
                  key={`update-${group.title}`}
                  group={group}
                  lecturer={lecturer}
                  lecturerUpdate={lecturerUpdate}
                  isUpdate={true}
                />
              ))}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2, bgcolor: "grey.50" }}>
          <Box flex={1}>
            <Typography variant="body2" color="text.secondary">
              Các trường đã thay đổi được tô màu cam
            </Typography>
          </Box>
          <Button
            onClick={handleReject}
            color="error"
            variant="outlined"
            sx={{ 
              minWidth: 100,
              borderRadius: 3,
              fontWeight: 600,
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
              }
            }}
          >
            Từ chối
          </Button>
          <Button
            onClick={handleApprove}
            color="success"
            variant="contained"
            sx={{ 
              minWidth: 100,
              borderRadius: 3,
              fontWeight: 600,
              background: "linear-gradient(45deg, #16a34a 30%, #22c55e 90%)",
              "&:hover": {
                background: "linear-gradient(45deg, #15803d 30%, #16a34a 90%)",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(34, 197, 94, 0.4)",
              }
            }}
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

