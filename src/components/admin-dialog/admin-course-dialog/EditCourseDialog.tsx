import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  InputAdornment,
  Alert,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  School,
  Close,
  Language,
  LocationOn,
  Schedule,
  Clear,
  Upload,
} from "@mui/icons-material";
import { API } from "../../../utils/Fetch";
import { toast } from "react-toastify";
import { validateCourseForm } from "../../../utils/Validate";

interface EditCourseDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (courseData: any) => void;
  courseData: any;
}

const EditCourseDialog: React.FC<EditCourseDialogProps> = ({
  open,
  onClose,
  onSubmit,
  courseData,
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    topic: "",
    courseType: "",
    description: "",
    thumbnailUrl: "",
    contentUrl: "",
    level: "",
    requirements: "",
    language: "",
    isOnline: false,
    address: "",
    startDate: "",
    endDate: "",
    price: 0,
    isPublished: false,
  });

  // Initialize form data when courseData changes
  useEffect(() => {
    if (courseData && open) {
      setFormData({
        title: courseData.title || "",
        topic: courseData.topic || "",
        courseType: courseData.courseType || "",
        description: courseData.description || "",
        thumbnailUrl: courseData.thumbnailUrl || "",
        contentUrl: courseData.contentUrl || "",
        level: courseData.level || "",
        requirements: courseData.requirements || "",
        language: courseData.language || "",
        isOnline: courseData.isOnline || false,
        address: courseData.address || "",
        startDate: courseData.startDate
          ? courseData.startDate.split("T")[0]
          : "",
        endDate: courseData.endDate ? courseData.endDate.split("T")[0] : "",
        price: courseData.price || 0,
        isPublished: courseData.isPublished || false,
      });
    }
  }, [courseData, open]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (validateCourseForm(formData).success === false) {
      toast.error(validateCourseForm(formData).error);
      return;
    }

    try {
      setLoading(true);

      const updateData = {
        ...formData,
        id: courseData.id,
      };
      onSubmit(updateData);
      handleClose();
    } catch (error) {
      console.error("Error updating course:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      setLoading(true);
      const response = await API.user.uploadFileToServer(file);
      const uploadedUrl = response.data;
      setFormData((prev) => ({ ...prev, thumbnailUrl: uploadedUrl }));
      toast.success("Tải lên hình ảnh thành công");
    } catch (error) {
      console.error("❌ Error uploading file:", error);
      toast.error("Tải lên hình ảnh không thành công. (.pdf, .jpg, .png)");
    } finally {
      setLoading(false);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  useEffect(() => {
    if (selectedFile) {
      handleFileUpload(selectedFile);
    }
  }, [selectedFile]);

  const handleClose = () => {
    setFormData({
      title: "",
      topic: "",
      courseType: "",
      description: "",
      thumbnailUrl: "",
      contentUrl: "",
      level: "",
      requirements: "",
      language: "",
      isOnline: false,
      address: "",
      startDate: "",
      endDate: "",
      price: 0,
      isPublished: false,
    });
    setSelectedFile(null);
    onClose();
  };

  const courseTypes = [
    { value: "FORMAL", label: "Chính quy" },
    { value: "SPECIALIZED", label: "Chuyên đề" },
    { value: "EXTRACURRICULAR", label: "Ngoại khóa" },
  ];

  const levels = [
    { value: "Cơ bản", label: "Cơ bản" },
    { value: "Trung cấp", label: "Trung cấp" },
    { value: "Nâng cao", label: "Nâng cao" },
  ];

  const languages = [
    { value: "Vietnamese", label: "Tiếng Việt" },
    { value: "English", label: "Tiếng Anh" },
    { value: "French", label: "Tiếng Pháp" },
    { value: "Chinese", label: "Tiếng Trung" },
    { value: "Japanese", label: "Tiếng Nhật" },
  ];

  const isFormInvalid = (): boolean => {
    return Boolean(
      loading ||
        !formData.title.trim() ||
        !formData.topic.trim() ||
        !formData.courseType ||
        !formData.level ||
        (formData.startDate &&
          formData.endDate &&
          new Date(formData.startDate) >= new Date(formData.endDate)),
    );
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          position: "relative",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <School />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Chỉnh sửa khóa học
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 200 }}>
              ID: {courseData?.id || "N/A"}
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "white",
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
          {/* Basic Information */}
          <Box>
            <Typography
              variant="h6"
              sx={{ mb: 2, color: "#1976d2", fontWeight: 600 }}
            >
              Thông tin cơ bản
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Tên khóa học"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                fullWidth
                required
                variant="outlined"
              />

              <TextField
                label="Chủ đề"
                value={formData.topic}
                onChange={(e) => handleInputChange("topic", e.target.value)}
                fullWidth
                required
                variant="outlined"
              />

              <Box sx={{ display: "flex", gap: 2 }}>
                <FormControl fullWidth required>
                  <InputLabel>Loại khóa học</InputLabel>
                  <Select
                    value={formData.courseType}
                    label="Loại khóa học"
                    onChange={(e) =>
                      handleInputChange("courseType", e.target.value)
                    }
                  >
                    {courseTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth required>
                  <InputLabel>Trình độ</InputLabel>
                  <Select
                    value={formData.level}
                    label="Trình độ"
                    onChange={(e) => handleInputChange("level", e.target.value)}
                  >
                    {levels.map((level) => (
                      <MenuItem key={level.value} value={level.value}>
                        {level.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <TextField
                label="Mô tả"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                fullWidth
                multiline
                rows={3}
                variant="outlined"
              />
            </Box>
          </Box>

          {/* Media & Links */}
          <Box>
            <Typography
              variant="h6"
              sx={{ mb: 2, color: "#1976d2", fontWeight: 600 }}
            >
              Hình ảnh và liên kết
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {/* Thumbnail Upload */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Hình đại diện
                </Typography>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<Upload />}
                    disabled={loading}
                    sx={{ minWidth: 160 }}
                  >
                    Tải lên hình ảnh
                    <input
                      ref={fileInputRef}
                      type="file"
                      hidden
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                    />
                  </Button>
                  {formData.thumbnailUrl && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <img
                        src={formData.thumbnailUrl}
                        alt="Thumbnail preview"
                        style={{
                          width: 60,
                          height: 60,
                          objectFit: "cover",
                          borderRadius: 8,
                          border: "1px solid #ddd",
                        }}
                      />
                      <Tooltip title="Xóa hình ảnh">
                        <IconButton
                          size="small"
                          onClick={() => handleInputChange("thumbnailUrl", "")}
                        >
                          <Clear />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                </Box>
                {!formData.thumbnailUrl && (
                  <TextField
                    label="Hoặc nhập URL hình ảnh"
                    value={formData.thumbnailUrl}
                    onChange={(e) =>
                      handleInputChange("thumbnailUrl", e.target.value)
                    }
                    fullWidth
                    variant="outlined"
                    sx={{ mt: 1 }}
                  />
                )}
              </Box>

              <TextField
                label="Liên kết nội dung"
                value={formData.contentUrl}
                onChange={(e) =>
                  handleInputChange("contentUrl", e.target.value)
                }
                fullWidth
                variant="outlined"
                placeholder="https://..."
              />
            </Box>
          </Box>

          {/* Course Details */}
          <Box>
            <Typography
              variant="h6"
              sx={{ mb: 2, color: "#1976d2", fontWeight: 600 }}
            >
              Chi tiết khóa học
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Ngôn ngữ</InputLabel>
                  <Select
                    value={formData.language}
                    label="Ngôn ngữ"
                    onChange={(e) =>
                      handleInputChange("language", e.target.value)
                    }
                    startAdornment={
                      <InputAdornment position="start">
                        <Language />
                      </InputAdornment>
                    }
                  >
                    {languages.map((lang) => (
                      <MenuItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label="Giá (VNĐ)"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    handleInputChange("price", Number(e.target.value))
                  }
                  fullWidth
                  variant="outlined"
                  inputProps={{ min: 0 }}
                />
              </Box>

              <TextField
                label="Yêu cầu"
                value={formData.requirements}
                onChange={(e) =>
                  handleInputChange("requirements", e.target.value)
                }
                fullWidth
                multiline
                rows={2}
                variant="outlined"
                placeholder="Mô tả các yêu cầu cần thiết..."
              />

              {/* Format & Location */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isOnline}
                      onChange={(e) =>
                        handleInputChange("isOnline", e.target.checked)
                      }
                    />
                  }
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {formData.isOnline ? <Language /> : <LocationOn />}
                      {formData.isOnline ? "Trực tuyến" : "Tại lớp"}
                    </Box>
                  }
                />

                {!formData.isOnline && (
                  <TextField
                    label="Địa chỉ"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOn />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}

                {formData.isOnline && (
                  <TextField
                    label="Liên kết phòng học trực tuyến"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    fullWidth
                    variant="outlined"
                    placeholder="Zoom, Google Meet, Teams..."
                  />
                )}
              </Box>

              {/* Schedule */}
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label="Ngày bắt đầu"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    handleInputChange("startDate", e.target.value)
                  }
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Schedule />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Ngày kết thúc"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Schedule />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {/* Publication Status */}
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isPublished}
                    onChange={(e) =>
                      handleInputChange("isPublished", e.target.checked)
                    }
                  />
                }
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography>
                      {formData.isPublished ? "Xuất bản" : "Chưa xuất bản"}
                    </Typography>
                  </Box>
                }
              />
            </Box>
          </Box>

          {/* Validation Alert */}
          {formData.startDate &&
            formData.endDate &&
            new Date(formData.startDate) >= new Date(formData.endDate) && (
              <Alert severity="warning">
                Ngày bắt đầu phải trước ngày kết thúc
              </Alert>
            )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          disabled={loading}
          sx={{ minWidth: 100 }}
        >
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isFormInvalid()}
          sx={{
            minWidth: 120,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          {loading ? "Đang cập nhật..." : "Cập nhật"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCourseDialog;
