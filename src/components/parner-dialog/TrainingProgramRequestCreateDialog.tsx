import {
  Close as CloseIcon,
  CloudUpload as UploadIcon,
  InsertDriveFile as FileIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useState } from "react";
import type {
  TrainingProgramRequest,
  TrainingProgramRequestReq,
} from "../../types/TrainingProgram";
import { API } from "../../utils/Fetch";
import { toast } from "react-toastify";
import type { Partner } from "../../types/Parner";

interface TrainingProgramRequestCreateDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<TrainingProgramRequest>) => void;
  partner: Partner;
}

const TrainingProgramRequestCreateDialog = ({
  open,
  onClose,
  onSubmit,
}: TrainingProgramRequestCreateDialogProps) => {
  const [formData, setFormData] = useState<Partial<TrainingProgramRequestReq>>({
    title: "",
    description: "",
    fileUrl: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");

  const handleInputChange = (
    field: keyof TrainingProgramRequest,
    value: any,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        setUploadError("Kích thước file không được vượt quá 10MB");
        toast.error("Kích thước file không được vượt quá 10MB");
        return;
      }

      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
        "image/jpeg",
        "image/png",
      ];

      if (!allowedTypes.includes(file.type)) {
        setUploadError(
          "Định dạng file không hỗ trợ. Chỉ chấp nhận PDF, DOC, DOCX, TXT, JPG, PNG",
        );
        toast.error(
          "Định dạng file không hỗ trợ. Chỉ chấp nhận PDF, DOC, DOCX, TXT, JPG, PNG",
        );
        return;
      }

      setSelectedFile(file);
      setUploadError("");

      // Auto upload file
      setIsUploading(true);
      try {
        const response = await API.user.uploadFileToServer(file);
        console.log("✅ File uploaded successfully:", response.data);

        setFormData((prev) => ({
          ...prev,
          fileUrl: response.data,
        }));

        toast.success("Tải lên file thành công");
      } catch (error: any) {
        console.error("❌ Error uploading file:", error);
        setUploadError("Tải lên file không thành công");
        toast.error("Tải lên file không thành công");
        setSelectedFile(null);
        setFormData((prev) => ({ ...prev, fileUrl: "" }));
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Validate required fields
      if (!formData.title?.trim()) {
        toast.error("Vui lòng nhập tiêu đề yêu cầu");
        return;
      }

      if (!formData.description?.trim()) {
        toast.error("Vui lòng nhập mô tả chi tiết");
        return;
      }

      // Submit the form
      await onSubmit(formData);

      // Reset form
      setFormData({
        title: "",
        description: "",
        fileUrl: "",
      });
      setSelectedFile(null);
      setUploadError("");
      setIsUploading(false);

      onClose();
    } catch (error) {
      console.error("Error creating training program request:", error);
      alert("Có lỗi xảy ra khi tạo yêu cầu đào tạo");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setFormData({
      title: "",
      description: "",
      fileUrl: "",
    });
    setSelectedFile(null);
    setUploadError("");
    setIsUploading(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 1,
          minHeight: "70vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid",
          borderColor: "divider",
          pb: 2,
        }}
      >
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          Tạo Yêu cầu Chương trình Đào tạo
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Tiêu đề */}
          <TextField
            label="Tiêu đề yêu cầu"
            fullWidth
            required
            value={formData.title || ""}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="Nhập tiêu đề cho yêu cầu đào tạo..."
          />

          {/* Mô tả */}
          <TextField
            label="Mô tả chi tiết"
            fullWidth
            required
            multiline
            rows={4}
            value={formData.description || ""}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Mô tả chi tiết về chương trình đào tạo bạn muốn yêu cầu..."
          />

          {/* File Upload */}
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                mb: 2,
                pb: 1,
                borderBottom: "2px solid #f0fdfa",
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "8px",
                  background:
                    "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                }}
              >
                📎
              </Box>
              <Typography
                variant="subtitle2"
                sx={{
                  color: "#0f766e",
                  fontWeight: 700,
                  fontSize: "1rem",
                  letterSpacing: "-0.01em",
                }}
              >
                File đính kèm (tùy chọn)
              </Typography>
            </Box>

            {/* Upload Error Alert */}
            {uploadError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {uploadError}
              </Alert>
            )}

            {/* File Display when selected */}
            {selectedFile && (
              <Box
                sx={{
                  mb: 2,
                  p: 2,
                  border: "2px solid #14b8a6",
                  borderRadius: "12px",
                  backgroundColor: "#f0fdfa",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <FileIcon sx={{ color: "#14b8a6", fontSize: 24 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: "#0f766e" }}
                  >
                    {selectedFile.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#64748b" }}>
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </Typography>
                </Box>
                {isUploading && (
                  <CircularProgress size={20} sx={{ color: "#14b8a6" }} />
                )}
                <IconButton
                  size="small"
                  onClick={() => {
                    setSelectedFile(null);
                    setFormData((prev) => ({ ...prev, fileUrl: "" }));
                    setUploadError("");
                  }}
                  sx={{ color: "#ef4444" }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            )}

            {/* Upload Area */}
            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                startIcon={<UploadIcon />}
                disabled={isUploading}
                sx={{
                  py: 1.5,
                  borderRadius: "12px",
                  borderWidth: "2px",
                  borderStyle: "dashed",
                  borderColor: "#cbd5e1",
                  backgroundColor: "#f8fafc",
                  color: "#64748b",
                  fontWeight: 600,
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "#14b8a6",
                    backgroundColor: "#f0fdfa",
                    color: "#0f766e",
                  },
                  "&.Mui-disabled": {
                    backgroundColor: "#f1f5f9",
                    color: "#94a3b8",
                  },
                }}
              >
                {isUploading ? "Đang tải lên..." : "Chọn file"}
                <input
                  type="file"
                  hidden
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                />
              </Button>
            </Box>

            <Typography
              variant="caption"
              sx={{
                display: "block",
                mt: 1,
                color: "#64748b",
                textAlign: "center",
              }}
            >
              Hỗ trợ: PDF, DOC, DOCX, TXT, JPG, PNG (Tối đa 10MB)
            </Typography>

            {/* URL Display when uploaded */}
            {formData.fileUrl && !isUploading && (
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  backgroundColor: "#f0fdfa",
                  borderRadius: "8px",
                  border: "1px solid #99f6e4",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: "#0f766e", fontWeight: 600 }}
                >
                  ✅ File đã được tải lên thành công
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          borderTop: "1px solid",
          borderColor: "divider",
          px: 3,
          py: 2,
          gap: 1,
        }}
      >
        <Button onClick={handleClose} variant="outlined" color="inherit">
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={
            loading || !formData.title?.trim() || !formData.description?.trim()
          }
          sx={{ minWidth: 120 }}
        >
          {loading ? "Đang tạo..." : "Tạo yêu cầu"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TrainingProgramRequestCreateDialog;
