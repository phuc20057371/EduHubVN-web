import {
  AttachFile,
  CloudUpload,
  Description,
  School,
} from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import React, { useState } from "react";
import { toast } from "react-toastify";
import type { DegreeRequest } from "../types/DegreeRequest";
import { API } from "../utils/Fetch";
import { validateDegreeInfo } from "../utils/Validate";

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

const degreeLevels = [
  ,
  "Kĩ sư",
  "Cử nhân",
  "Thạc sĩ",
  "Tiến sĩ",
  "Phó Giáo sư",
  "Giáo sư",
];
const majors = [
  "Công nghệ thông tin",
  "Kỹ thuật phần mềm",
  "Quản trị kinh doanh",
  "Kế toán",
  "Ngôn ngữ Anh",
  "Sư phạm Toán",
  "Sư phạm Văn",
  "Y đa khoa",
  "Dược học",
  "Luật",
];

interface UploadDegreeModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (degree: DegreeRequest) => void;
  editMode?: boolean;
  editData?: DegreeRequest;
}

const UploadDegreeModal: React.FC<UploadDegreeModalProps> = ({
  open,
  onClose,
  onSubmit,
  editMode = false,
  editData,
}) => {
  // useEffect đẻ clear form khi đóng modal
  React.useEffect(() => {
    if (!open) {
      setForm({
        referenceId: "",
        name: "",
        major: "",
        institution: "",
        startYear: 0,
        graduationYear: 0,
        level: "",
        url: "",
        description: "",
      });
      setSelectedFile(null);
      setIsUploading(false);
    } else if (editMode && editData) {
      // Pre-fill form with edit data
      setForm(editData);
    }
  }, [open, editMode, editData]);
  const [form, setForm] = useState<DegreeRequest>({
    referenceId: "",
    name: "",
    major: "",
    institution: "",
    startYear: 0,
    graduationYear: 0,
    level: "",
    url: "",
    description: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const handleChange = (field: keyof DegreeRequest, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const results = validateDegreeInfo(form);

    if (!results.success) {
      toast.error(results.error);
      return;
    }

    onSubmit(form);
    onClose();
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
      .then((response: any) => {
        console.log("✅ File uploaded successfully:", response.data);
        setForm((prev) => ({ ...prev, url: response.data }));
        toast.success("Tải lên tài liệu thành công");
      })
      .catch((error: any) => {
        console.error("❌ Error uploading file:", error);
        toast.error("Tải lên tài liệu không thành công. (.pdf, .jpg, .png)");
        setSelectedFile(null);
        setForm((prev) => ({ ...prev, url: "" }));
      })
      .finally(() => {
        setIsUploading(false);
      });
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
            <School />
            {editMode ? "Chỉnh sửa bằng cấp" : "Thêm bằng cấp mới"}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
            {editMode
              ? "Cập nhật thông tin bằng cấp của bạn"
              : "Nhập thông tin chi tiết về bằng cấp của bạn"}
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
                    label="Tên bằng cấp"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    variant="outlined"
                    size="medium"
                    required
                  />

                  <Box display="flex" gap={2}>
                    <Autocomplete
                      fullWidth
                      options={majors}
                      freeSolo
                      value={form.major}
                      onChange={(_e, newValue) =>
                        handleChange("major", newValue || "")
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Ngành học"
                          variant="outlined"
                          size="medium"
                        />
                      )}
                    />

                    <Autocomplete
                      fullWidth
                      options={degreeLevels}
                      value={form.level}
                      onChange={(_e, newValue) =>
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

                  <TextField
                    fullWidth
                    label="Trường/Cơ sở đào tạo"
                    value={form.institution}
                    onChange={(e) =>
                      handleChange("institution", e.target.value)
                    }
                    variant="outlined"
                    size="medium"
                  />
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
                  📅 Thời gian
                </Typography>
                <Box display="flex" gap={2}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Năm bắt đầu"
                    value={form.startYear || ""}
                    onChange={(e) => handleChange("startYear", +e.target.value)}
                    variant="outlined"
                    size="medium"
                  />
                  <TextField
                    fullWidth
                    type="number"
                    label="Năm tốt nghiệp"
                    value={form.graduationYear || ""}
                    onChange={(e) =>
                      handleChange("graduationYear", +e.target.value)
                    }
                    variant="outlined"
                    size="medium"
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
                    Chọn file bằng cấp
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

                {form.url && (
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
                  label="Thông tin bổ sung về bằng cấp"
                  multiline
                  rows={4}
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  variant="outlined"
                  placeholder="Nhập mô tả chi tiết về bằng cấp, thành tích đạt được..."
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
              {editMode ? "Cập nhật bằng cấp" : "Lưu bằng cấp"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default UploadDegreeModal;
