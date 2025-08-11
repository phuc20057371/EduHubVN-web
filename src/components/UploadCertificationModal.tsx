import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Modal,
  Card,
  CardContent,
  Chip,
  Autocomplete,
} from "@mui/material";
import {
  CloudUpload,
  Assignment,
  Description,
  AttachFile,
  CalendarToday,
  Business,
} from "@mui/icons-material";
import type { CertificationRequest } from "../types/CertificationRequest";
import { API } from "../utils/Fetch";
import { Stack } from "@mui/system";
import { toast } from "react-toastify";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { vi } from "date-fns/locale/vi";
import { certificationLevelsAutoComplete } from "../utils/ValidateRegisterLecturer";
import { validateCertificateInfo } from "../utils/Validate";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  maxHeight: "90vh",
  overflow: "auto",
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
  outline: "none",
};

interface UploadCertificationModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (cert: CertificationRequest) => void;
  editMode?: boolean;
  editData?: CertificationRequest;
}

const UploadCertificationModal: React.FC<UploadCertificationModalProps> = ({
  open,
  onClose,
  onSubmit,
  editMode = false,
  editData,
}) => {
  const [form, setForm] = useState<CertificationRequest>({
    referenceId: "",
    name: "",
    issuedBy: "",
    issueDate: new Date(),
    expiryDate: null as Date | null,
    certificateUrl: "",
    level: "",
    description: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!open) {
      setForm({
        referenceId: "",
        name: "",
        issuedBy: "",
        issueDate: new Date(),
        expiryDate: new Date(),
        certificateUrl: "",
        level: "",
        description: "",
      });
      setSelectedFile(null);
      setIsUploading(false);
    } else if (editMode && editData) {
      // Pre-fill form with edit data
      setForm(editData);
    }
  }, [open, editMode, editData]);

  const handleChange = (field: keyof CertificationRequest, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);

    await API.user
      .uploadFileToServer(selectedFile)
      .then((res: any) => {
        console.log("✅ File uploaded successfully:", res.data);
        setForm((prev) => ({ ...prev, certificateUrl: res.data }));
        toast.success("Tải lên tài liệu thành công");
      })
      .catch((err) => {
        console.error("❌ Error uploading file:", err);
        toast.error("Tải lên tài liệu không thành công. (.pdf, .jpg, .png)");
      })
      .finally(() => {
        setIsUploading(false);
      });
  };

  const handleSubmit = () => {
    const result = validateCertificateInfo(form);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    onSubmit(form);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        {/* Header */}
        <Box
          sx={{
            p: 3,
            pb: 2,
            background: "paper.main",
            borderRadius: "12px 12px 0 0",
            mb: 3,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Assignment />
            {editMode ? "Chỉnh sửa chứng chỉ" : "Thêm chứng chỉ mới"}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
            {editMode
              ? "Cập nhật thông tin chứng chỉ của bạn"
              : "Nhập thông tin chi tiết về chứng chỉ của bạn"}
          </Typography>
        </Box>

        <Box sx={{ px: 3, pb: 3 }}>
          <Stack spacing={3}>
            {/* Basic Information Section */}
            <Card variant="outlined" sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ mb: 2, color: "primary.main", fontWeight: 600 }}
                >
                  📋 Thông tin cơ bản
                </Typography>
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    label="Mã tham chiếu"
                    value={form.referenceId}
                    onChange={(e) =>
                      handleChange("referenceId", e.target.value)
                    }
                    variant="outlined"
                    size="medium"
                  />

                  <TextField
                    fullWidth
                    label="Tên chứng chỉ"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    variant="outlined"
                    size="medium"
                    required
                  />

                  <Box display="flex" gap={2}>
                    <TextField
                      fullWidth
                      label="Cơ quan cấp"
                      value={form.issuedBy}
                      onChange={(e) => handleChange("issuedBy", e.target.value)}
                      variant="outlined"
                      size="medium"
                      InputProps={{
                        startAdornment: (
                          <Business sx={{ mr: 1, color: "text.secondary" }} />
                        ),
                      }}
                    />
                    <Autocomplete
                      fullWidth
                      options={certificationLevelsAutoComplete}
                      value={form.level}
                      onChange={(_, newValue) =>
                        handleChange("level", newValue || "")
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Trình độ"
                          variant="outlined"
                          size="medium"
                        />
                      )}
                    />
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Time Information Section */}
            <Card variant="outlined" sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ mb: 2, color: "primary.main", fontWeight: 600 }}
                >
                  📅 Thời gian hiệu lực
                </Typography>
                <Box display="flex" gap={2}>
                  {/* Ngày cấp - không cho xóa */}
                  <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    adapterLocale={vi}
                  >
                    <DatePicker
                      label="Ngày cấp"
                      value={form.issueDate}
                      onChange={(newValue) =>
                        handleChange("issueDate", newValue)
                      }
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          variant: "outlined",
                          size: "medium",
                          InputProps: {
                            startAdornment: (
                              <CalendarToday
                                sx={{ mr: 1, color: "text.secondary" }}
                              />
                            ),
                          },
                        },
                      }}
                    />
                  </LocalizationProvider>

                  {/* Ngày hết hạn - cho phép null */}
                  <TextField
                    fullWidth
                    type="date"
                    label="Ngày hết hạn (không bắt buộc)"
                    InputLabelProps={{ shrink: true }}
                    value={
                      form.expiryDate
                        ? form.expiryDate.toISOString().substring(0, 10)
                        : ""
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      handleChange("expiryDate", val ? new Date(val) : null);
                    }}
                    variant="outlined"
                    size="medium"
                    InputProps={{
                      startAdornment: (
                        <CalendarToday
                          sx={{ mr: 1, color: "text.secondary" }}
                        />
                      ),
                    }}
                  />
                </Box>
              </CardContent>
            </Card>

            {/* File Upload Section */}
            <Card variant="outlined" sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ mb: 2, color: "primary.main", fontWeight: 600 }}
                >
                  📎 Tài liệu đính kèm
                </Typography>

                {selectedFile && (
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      icon={<AttachFile />}
                      label={selectedFile.name}
                      color="primary"
                      variant="outlined"
                      sx={{ maxWidth: "100%" }}
                    />
                  </Box>
                )}

                <Box display="flex" gap={2}>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    startIcon={<AttachFile />}
                    sx={{ py: 1.5 }}
                  >
                    Chọn file chứng chỉ
                    <input type="file" hidden onChange={handleFileChange} />
                  </Button>

                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleFileUpload}
                    disabled={isUploading || !selectedFile}
                    startIcon={
                      isUploading ? (
                        <CircularProgress size={20} />
                      ) : (
                        <CloudUpload />
                      )
                    }
                    sx={{ py: 1.5 }}
                  >
                    {isUploading ? "Đang tải lên..." : "Tải lên"}
                  </Button>
                </Box>

                {form.certificateUrl && (
                  <Box sx={{ mt: 2 }}>
                    <Chip
                      icon={<CloudUpload />}
                      label="File đã được tải lên thành công"
                      color="success"
                      variant="filled"
                    />
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Description Section */}
            <Card variant="outlined" sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ mb: 2, color: "primary.main", fontWeight: 600 }}
                >
                  <Description sx={{ mr: 1 }} />
                  Mô tả bổ sung
                </Typography>
                <TextField
                  fullWidth
                  label="Thông tin bổ sung về chứng chỉ"
                  multiline
                  rows={4}
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  variant="outlined"
                  placeholder="Nhập mô tả chi tiết về chứng chỉ, lĩnh vực áp dụng..."
                />
              </CardContent>
            </Card>
          </Stack>

          {/* Action Buttons */}
          <Box
            sx={{
              mt: 4,
              pt: 3,
              borderTop: "1px solid",
              borderColor: "divider",
              display: "flex",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              onClick={onClose}
              size="large"
              sx={{ minWidth: 120 }}
            >
              Hủy bỏ
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              size="large"
              sx={{
                minWidth: 120,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
                },
              }}
            >
              {editMode ? "Cập nhật chứng chỉ" : "Lưu chứng chỉ"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default UploadCertificationModal;
