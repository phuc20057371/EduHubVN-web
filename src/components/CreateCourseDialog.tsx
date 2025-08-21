import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
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
  List,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  InputAdornment,
  Divider,
  Alert,
  ListItemButton,
  IconButton,
  Checkbox,
  Tooltip,
} from "@mui/material";
import {
  Search,
  School,
  Close,
  Add,
  Language,
  LocationOn,
  Schedule,
  Clear,
} from "@mui/icons-material";
import { API } from "../utils/Fetch";

import { getCourseType } from "../utils/CourseChangeText";
import { toast } from "react-toastify";
import { validateCourseForm } from "../utils/Validate";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import type { OwnedCourseInfo } from "../types/OwnedCourse";

interface CreateCourseDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (courseData: any) => void;
}

const CreateCourseDialog: React.FC<CreateCourseDialogProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [ownedCourses, setOwnedCourses] = useState<OwnedCourseInfo[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<OwnedCourseInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOwnedCourse, setSelectedOwnedCourse] =
    useState<OwnedCourseInfo | null>(null);
  const [loading, setLoading] = useState(false);

  // Add new state for course creation mode
  const [isCreateFromOwned, setIsCreateFromOwned] = useState(true);

  // Filter states
  const [levelFilter, setLevelFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");

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

  // Fetch owned courses when dialog opens
  useEffect(() => {
    if (open) {
      fetchOwnedCourses();
    }
  }, [open]);

  // Filter courses based on search term and filters
  useEffect(() => {
    let filtered = ownedCourses;

    // Search term filter
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.ownedCourse.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          item.ownedCourse.topic
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          item.lecturer.fullName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          item.ownedCourse.id
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
    }

    // Level filter
    if (levelFilter) {
      filtered = filtered.filter(
        (item) => item.ownedCourse.level === levelFilter,
      );
    }

    // Language filter
    if (languageFilter) {
      filtered = filtered.filter(
        (item) => item.ownedCourse.language === languageFilter,
      );
    }

    // Start date filter
    if (startDateFilter) {
      filtered = filtered.filter((item) => {
        const courseStartDate = new Date(item.ownedCourse.startDate);
        const filterDate = new Date(startDateFilter);
        return courseStartDate >= filterDate;
      });
    }

    // End date filter
    if (endDateFilter) {
      filtered = filtered.filter((item) => {
        const courseEndDate = new Date(item.ownedCourse.endDate);
        const filterDate = new Date(endDateFilter);
        return courseEndDate <= filterDate;
      });
    }

    setFilteredCourses(filtered);
  }, [
    searchTerm,
    ownedCourses,
    levelFilter,
    languageFilter,
    startDateFilter,
    endDateFilter,
  ]);

  const fetchOwnedCourses = async () => {
    try {
      setLoading(true);
      const response = await API.admin.getOwnedCourses();
      setOwnedCourses(response.data.data || []);
      console.log("✅ Owned courses fetched successfully:", response.data.data);

      setFilteredCourses(response.data.data || []);
    } catch (error) {
      console.error("Error fetching owned courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOwnedCourseSelect = useCallback((ownedCourse: OwnedCourseInfo) => {
    setSelectedOwnedCourse(ownedCourse);

    // Auto-fill form with owned course data
    setFormData({
      title: ownedCourse.ownedCourse.title,
      topic: ownedCourse.ownedCourse.topic,
      courseType: ownedCourse.ownedCourse.courseType,
      description: ownedCourse.ownedCourse.description,
      thumbnailUrl: ownedCourse.ownedCourse.thumbnailUrl,
      contentUrl: ownedCourse.ownedCourse.contentUrl,
      level: ownedCourse.ownedCourse.level,
      requirements: ownedCourse.ownedCourse.requirements,
      language: ownedCourse.ownedCourse.language,
      isOnline: ownedCourse.ownedCourse.isOnline,
      address: ownedCourse.ownedCourse.address,
      startDate: ownedCourse.ownedCourse.startDate,
      endDate: ownedCourse.ownedCourse.endDate,
      price: ownedCourse.ownedCourse.price,
      isPublished: false, // Default to unpublished for new courses
    });
  }, []);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    if (validateCourseForm(formData).success === false) {
      toast.error(validateCourseForm(formData).error);
      return;
    }

    const courseData = {
      ...formData,
      ownedCourseId: selectedOwnedCourse?.ownedCourse.id,
      authorId: selectedOwnedCourse?.lecturer.id,
    };
    console.log("Submitting course data:", courseData);

    onSubmit(courseData);
    fetchOwnedCourses();
    handleClose();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  // const handleFileUpload = async (
  //   event: React.ChangeEvent<HTMLInputElement>,
  // ) => {
  //   const file = event.target.files?.[0];
  //   if (!file) return;

  //   try {
  //     const response = await API.user.uploadFileToServer(file);
  //     console.log("✅ File uploaded successfully:", response.data);
  //     setFormData((prev) => ({ ...prev, thumbnailUrl: response.data }));
  //     toast.success("Tải lên tài liệu thành công");
  //   } catch (error) {
  //     console.error("❌ Error uploading file:", error);
  //     toast.error("Tải lên tài liệu không thành công. (.pdf, .jpg, .png)");
  //   } finally {
  //     setSelectedFile(null);
  //   }
  // };
  const handleFileUpload = async (file: File) => {
    try {
      const response = await API.user.uploadFileToServer(file);
      const uploadedUrl = response.data; // hoặc thêm tiền tố nếu cần
      setFormData((prev) => ({ ...prev, thumbnailUrl: uploadedUrl }));
      toast.success("Tải lên tài liệu thành công");
    } catch (error) {
      console.error("❌ Error uploading file:", error);
      toast.error("Tải lên tài liệu không thành công. (.pdf, .jpg, .png)");
    } finally {
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
    setSelectedOwnedCourse(null);
    setSearchTerm("");
    setLevelFilter("");
    setLanguageFilter("");
    setStartDateFilter("");
    setEndDateFilter("");
    setIsCreateFromOwned(true); // Reset to default mode
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
    { value: "Chuyên gia", label: "Chuyên gia" },
  ];

  // Get unique levels and languages from owned courses
  const uniqueLevels = useMemo(() => {
    const levels = [
      ...new Set(ownedCourses.map((item) => item.ownedCourse.level)),
    ];
    return levels.filter(Boolean);
  }, [ownedCourses]);

  const hasActiveFilters =
    searchTerm ||
    levelFilter ||
    languageFilter ||
    startDateFilter ||
    endDateFilter;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={isCreateFromOwned ? "lg" : "md"}
      fullWidth
      PaperProps={{
        className: "rounded-lg",
        sx: {
          minHeight: isCreateFromOwned ? "80vh" : "70vh",
        },
      }}
    >
      <DialogTitle
        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          py: 2,
        }}
      >
        <Box className="flex items-center gap-2">
          <School />
          <Typography variant="h6" fontWeight={600}>
            Tạo khóa học mới
          </Typography>
        </Box>
        <Button
          onClick={handleClose}
          sx={{ color: "white", minWidth: "auto", p: 1 }}
        >
          <Close />
        </Button>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <div className={`flex ${isCreateFromOwned ? "h-[70vh]" : "h-[60vh]"}`}>
          {/* Left Panel - Owned Courses Search - Conditional Display */}
          {isCreateFromOwned && (
            <div className="flex w-full flex-col border-r border-gray-200 bg-gray-50 md:w-1/2">
              <div className="border-b border-gray-200 bg-white p-6">
                {/* <Box className="mb-4 flex items-center gap-2">
                  <Avatar className="bg-blue-100">
                    <School className="text-blue-600" />
                  </Avatar>
                  <Box>
                <Typography variant="h6" className="font-bold text-gray-800">
                  Khóa học từ các Giảng viên
                </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Chọn khóa học để tạo mới
                    </Typography>
                  </Box>
                </Box> */}

                {/* Search Input and Level Filter - Enhanced Layout */}
                <Box className="mb-4">
                  <div className="mb-3 flex gap-3">
                    <FormControl size="small" className="w-32">
                      <InputLabel className="text-gray-600">
                        Trình độ
                      </InputLabel>
                      <Select
                        value={levelFilter}
                        label="Trình độ"
                        onChange={(e) => setLevelFilter(e.target.value)}
                        sx={{
                          backgroundColor: "white",
                          borderRadius: "8px",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(0, 0, 0, 0.23)",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "primary.main",
                          },
                        }}
                      >
                        <MenuItem value="">
                          <Box className="flex items-center gap-2">
                            <School
                              fontSize="small"
                              className="text-gray-400"
                            />
                            <span>Tất cả</span>
                          </Box>
                        </MenuItem>
                        {uniqueLevels.map((level) => (
                          <MenuItem key={level} value={level}>
                            <Box className="flex items-center gap-2">
                              <School
                                fontSize="small"
                                className="text-blue-500"
                              />
                              <span>{level}</span>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Tìm kiếm theo tên khóa học, chủ đề, giảng viên..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search className="text-gray-400" />
                          </InputAdornment>
                        ),
                        endAdornment: searchTerm && (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              onClick={() => setSearchTerm("")}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <Clear fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "white",
                          borderRadius: "12px",
                          "&:hover": {
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "primary.main",
                            },
                          },
                          "&.Mui-focused": {
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "primary.main",
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </Box>

                {/* Enhanced Filter Section */}
                <Box className="space-y-3">
                  {/* Date Range Filters */}
                  <div className="flex gap-3">
                    <TextField
                      size="small"
                      label="Từ ngày"
                      type="date"
                      value={startDateFilter}
                      onChange={(e) => setStartDateFilter(e.target.value)}
                      InputLabelProps={{
                        shrink: true,
                        className: "text-gray-600",
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Schedule
                              fontSize="small"
                              className="text-gray-400"
                            />
                          </InputAdornment>
                        ),
                      }}
                      className="flex-1"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "white",
                          borderRadius: "8px",
                        },
                      }}
                    />
                    <TextField
                      size="small"
                      label="Đến ngày"
                      type="date"
                      value={endDateFilter}
                      onChange={(e) => setEndDateFilter(e.target.value)}
                      InputLabelProps={{
                        shrink: true,
                        className: "text-gray-600",
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Schedule
                              fontSize="small"
                              className="text-gray-400"
                            />
                          </InputAdornment>
                        ),
                      }}
                      className="flex-1"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "white",
                          borderRadius: "8px",
                        },
                      }}
                    />
                  </div>
                </Box>

                {/* Active Filters Display - Enhanced */}
                {hasActiveFilters && (
                  <Box className="mt-3">
                    <Typography
                      variant="caption"
                      className="mb-2 block font-medium text-gray-600"
                    >
                      Bộ lọc đang áp dụng:
                    </Typography>
                    <Box className="flex flex-wrap gap-2">
                      {searchTerm && (
                        <Chip
                          label={`"${searchTerm}"`}
                          size="small"
                          onDelete={() => setSearchTerm("")}
                          color="primary"
                          variant="filled"
                          icon={<Search fontSize="small" />}
                          sx={{ borderRadius: "6px" }}
                        />
                      )}
                      {levelFilter && (
                        <Chip
                          label={levelFilter}
                          size="small"
                          onDelete={() => setLevelFilter("")}
                          color="secondary"
                          variant="filled"
                          icon={<School fontSize="small" />}
                          sx={{ borderRadius: "6px" }}
                        />
                      )}
                      {languageFilter && (
                        <Chip
                          label={languageFilter}
                          size="small"
                          onDelete={() => setLanguageFilter("")}
                          color="info"
                          variant="filled"
                          icon={<Language fontSize="small" />}
                          sx={{ borderRadius: "6px" }}
                        />
                      )}
                      {startDateFilter && (
                        <Chip
                          label={`Từ: ${new Date(startDateFilter).toLocaleDateString("vi-VN")}`}
                          size="small"
                          onDelete={() => setStartDateFilter("")}
                          color="success"
                          variant="filled"
                          icon={<Schedule fontSize="small" />}
                          sx={{ borderRadius: "6px" }}
                        />
                      )}
                      {endDateFilter && (
                        <Chip
                          label={`Đến: ${new Date(endDateFilter).toLocaleDateString("vi-VN")}`}
                          size="small"
                          onDelete={() => setEndDateFilter("")}
                          color="warning"
                          variant="filled"
                          icon={<Schedule fontSize="small" />}
                          sx={{ borderRadius: "6px" }}
                        />
                      )}
                    </Box>
                  </Box>
                )}
              </div>

              {/* Course List - Enhanced */}
              <div className="flex-1 overflow-auto">
                {loading ? (
                  <Box className="p-8 text-center">
                    <Box className="animate-pulse">
                      <Avatar className="mx-auto mb-4 h-16 w-16 bg-gray-200">
                        <School className="text-gray-400" />
                      </Avatar>
                      <Typography className="text-gray-500">
                        Đang tải khóa học...
                      </Typography>
                    </Box>
                  </Box>
                ) : filteredCourses.length === 0 ? (
                  <Box className="p-8 text-center">
                    <Avatar className="mx-auto mb-4 h-16 w-16 bg-gray-100">
                      <School className="text-gray-400" />
                    </Avatar>
                    <Typography variant="h6" className="mb-2 text-gray-500">
                      {hasActiveFilters
                        ? "Không tìm thấy khóa học"
                        : "Chưa có khóa học"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {hasActiveFilters
                        ? "Thử điều chỉnh bộ lọc để tìm thấy khóa học phù hợp"
                        : "Hiện tại chưa có khóa học nào từ giảng viên"}
                    </Typography>
                  </Box>
                ) : (
                  <List sx={{ p: 1 }}>
                    {filteredCourses.map((item) => (
                      <ListItemButton
                        key={item.ownedCourse.id}
                        selected={
                          selectedOwnedCourse?.ownedCourse.id ===
                          item.ownedCourse.id
                        }
                        onClick={() => handleOwnedCourseSelect(item)}
                        sx={{
                          borderRadius: "12px",
                          margin: "4px",
                          padding: "12px",
                          border: "1px solid transparent",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            backgroundColor: "rgba(25, 118, 210, 0.04)",
                            border: "1px solid rgba(25, 118, 210, 0.2)",
                            transform: "translateY(-1px)",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          },
                          "&.Mui-selected": {
                            backgroundColor: "rgba(25, 118, 210, 0.08)",
                            border: "1px solid rgba(25, 118, 210, 0.5)",
                            "&:hover": {
                              backgroundColor: "rgba(25, 118, 210, 0.12)",
                            },
                          },
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            src={item.ownedCourse.thumbnailUrl}
                            className="h-16 w-16 shadow-md"
                            sx={{ borderRadius: "12px" }}
                          >
                            <School />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography
                              variant="subtitle2"
                              fontWeight={700}
                              className="mb-1 text-gray-800"
                            >
                              {item.ownedCourse.title}
                            </Typography>
                          }
                          secondary={
                            <Box component="span" sx={{ display: "block" }}>
                              <Typography
                                variant="body2"
                                component="span"
                                className="mb-1 text-gray-600"
                                sx={{ display: "block" }}
                              >
                                {item.ownedCourse.topic}
                              </Typography>
                              <Typography
                                variant="caption"
                                component="span"
                                className="mb-2 text-gray-500"
                                sx={{ display: "block" }}
                              >
                                <Box
                                  component="strong"
                                  className="text-blue-600"
                                >
                                  {item.lecturer.academicRank}
                                </Box>
                                : {item.lecturer.fullName}
                              </Typography>
                              <Box
                                component="span"
                                className="mb-2"
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 0.5,
                                }}
                              >
                                <Chip
                                  label={getCourseType(
                                    item.ownedCourse.courseType,
                                  )}
                                  size="small"
                                  variant="outlined"
                                  sx={{
                                    borderRadius: "6px",
                                    fontSize: "0.7rem",
                                    height: "20px",
                                    borderColor: "primary.main",
                                    color: "primary.main",
                                  }}
                                />
                                <Chip
                                  label={item.ownedCourse.level}
                                  size="small"
                                  sx={{
                                    borderRadius: "6px",
                                    fontSize: "0.7rem",
                                    height: "20px",
                                    backgroundColor: "warning.light",
                                    color: "",
                                  }}
                                />
                                <Chip
                                  label={item.ownedCourse.language}
                                  size="small"
                                  icon={<Language sx={{ fontSize: 10 }} />}
                                  sx={{
                                    borderRadius: "6px",
                                    fontSize: "0.7rem",
                                    height: "20px",
                                    backgroundColor: "success.light",
                                    color: "success.dark",
                                  }}
                                />
                              </Box>
                              <Box
                                component="span"
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                }}
                              >
                                <Schedule
                                  fontSize="small"
                                  className="text-gray-400"
                                />
                                <Typography
                                  variant="caption"
                                  component="span"
                                  className="text-gray-500"
                                >
                                  {new Date(
                                    item.ownedCourse.startDate,
                                  ).toLocaleDateString("vi-VN")}{" "}
                                  -{" "}
                                  {new Date(
                                    item.ownedCourse.endDate,
                                  ).toLocaleDateString("vi-VN")}
                                </Typography>
                              </Box>
                            </Box>
                          }
                        />
                      </ListItemButton>
                    ))}
                  </List>
                )}
              </div>
            </div>
          )}

          {/* Right Panel - Course Form */}
          <div
            className={`w-full overflow-auto bg-white p-6 ${isCreateFromOwned ? "md:w-1/2" : ""}`}
          >
            {/* Course Creation Mode Switch */}
            <Box
              className="border-b border-gray-200 bg-gray-50 p-4"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
              }}
            >
              <Typography
                variant="body2"
                className={`font-medium transition-colors ${!isCreateFromOwned ? "text-blue-600" : "text-gray-500"}`}
              >
                Tạo mới khóa học
              </Typography>
              <Switch
                checked={isCreateFromOwned}
                onChange={(e) => {
                  setIsCreateFromOwned(e.target.checked);
                  // Clear selected course when switching modes
                  if (!e.target.checked) {
                    setSelectedOwnedCourse(null);
                  }
                }}
                size="medium"
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: "#3b82f6",
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: "#3b82f6",
                  },
                }}
              />
              <Typography
                variant="body2"
                className={`font-medium transition-colors ${isCreateFromOwned ? "text-blue-600" : "text-gray-500"}`}
              >
                Tạo từ khóa học Giảng viên
              </Typography>
            </Box>
            {/* Mode-specific Alert */}
            {isCreateFromOwned ? (
              selectedOwnedCourse && (
                <Alert
                  severity="info"
                  className="mb-6"
                  sx={{
                    borderRadius: "12px",
                    "& .MuiAlert-icon": {
                      fontSize: "1.5rem",
                    },
                  }}
                  icon={<School />}
                >
                  <Typography variant="body2" className="font-medium">
                    Đã chọn khóa học:{" "}
                    <strong className="text-blue-700">
                      {selectedOwnedCourse.ownedCourse.title}
                    </strong>
                  </Typography>
                  <Typography variant="body2" className="font-medium">
                    ID:{" "}
                    <strong className="text-blue-700">
                      {selectedOwnedCourse.ownedCourse.id}
                    </strong>
                    <Tooltip title="Sao chép ID">
                      <IconButton
                        size="small"
                        onClick={() => {
                          navigator.clipboard.writeText(selectedOwnedCourse.ownedCourse.id);
                        }}
                      >
                        <ContentCopyIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  </Typography>
                  <Typography
                    variant="caption"
                    className="mt-1 block text-blue-600"
                  >
                    Thông tin sẽ được điền tự động vào form bên dưới
                  </Typography>
                </Alert>
              )
            ) : (
              <Alert
                severity="success"
                className="mb-4"
                sx={{
                  borderRadius: "12px",
                  "& .MuiAlert-icon": {
                    fontSize: "1.2rem",
                  },
                }}
              >
                <Typography variant="body2" className="font-medium">
                  Tạo khóa học mới hoàn toàn
                </Typography>
                <Typography
                  variant="caption"
                  className="mt-1 block text-green-600"
                >
                  Điền thông tin để tạo khóa học từ đầu
                </Typography>
              </Alert>
            )}

            <div className={`${isCreateFromOwned ? "space-y-6" : "space-y-4"}`}>
              {/* Title */}
              <TextField
                fullWidth
                label="Tiêu đề khóa học"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
              />

              {/* Topic and Course Type */}
              <div className="flex flex-col gap-4 md:flex-row">
                <TextField
                  fullWidth
                  label="Chủ đề"
                  value={formData.topic}
                  onChange={(e) => handleInputChange("topic", e.target.value)}
                  required
                />
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
              </div>

              {/* Description */}
              <div className="flex flex-col gap-4 md:flex-row">
                <button
                  type="button"
                  className="flex h-40 w-40 items-center justify-center rounded-lg border border-gray-300 md:w-1/2"
                  onClick={() => fileInputRef.current?.click()} // ✅ Mở chọn file khi click button
                >
                  <Avatar
                    src={formData.thumbnailUrl}
                    key={formData.thumbnailUrl}
                    sx={{
                      width: "100%",
                      height: "100%",
                      border: "1px solid #D1D5DB",
                      borderRadius: "8px",
                      objectFit: "cover",
                    }}
                  />
                  <input
                    type="file"
                    hidden
                    ref={fileInputRef}
                    accept=".png, .jpg, .jpeg"
                    onChange={(e) => handleFileChange(e)}
                  />
                </button>
                <TextField
                  fullWidth
                  label="Mô tả"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  multiline
                  rows={3}
                />
              </div>

              {/* URLs */}
              <div className="flex flex-col gap-4 md:flex-row">
                {/* <TextField
                  fullWidth
                  label="URL thumbnail"
                  value={formData.thumbnailUrl}
                  onChange={(e) =>
                    handleInputChange("thumbnailUrl", e.target.value)
                  }
                /> */}
                <TextField
                  fullWidth
                  label="URL nội dung"
                  value={formData.contentUrl}
                  onChange={(e) =>
                    handleInputChange("contentUrl", e.target.value)
                  }
                />
              </div>

              {/* Level and Language */}
              <div className="flex flex-col gap-4 md:flex-row">
                <FormControl fullWidth>
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
                <TextField
                  fullWidth
                  label="Ngôn ngữ"
                  value={formData.language}
                  onChange={(e) =>
                    handleInputChange("language", e.target.value)
                  }
                />
              </div>

              {/* Requirements */}
              <TextField
                fullWidth
                label="Yêu cầu"
                value={formData.requirements}
                onChange={(e) =>
                  handleInputChange("requirements", e.target.value)
                }
              />

              {/* Online Toggle and Address */}
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.isOnline}
                      onChange={(e) =>
                        handleInputChange("isOnline", e.target.checked)
                      }
                    />
                  }
                  label={formData.isOnline ? "Online" : "Offline"}
                  className="md:w-1/2"
                />
                <TextField
                  fullWidth
                  label="Địa chỉ/ Link phòng học"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOn />
                      </InputAdornment>
                    ),
                  }}
                  className="md:w-1/2"
                />
              </div>

              {/* Dates and Price */}
              <div className="flex flex-col gap-4 md:flex-row">
                <TextField
                  fullWidth
                  label="Ngày bắt đầu"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    handleInputChange("startDate", e.target.value)
                  }
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
                  fullWidth
                  label="Ngày kết thúc"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
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
                  fullWidth
                  label="Giá (VNĐ)"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    handleInputChange("price", parseFloat(e.target.value) || 0)
                  }
                />
              </div>

              {/* Publish Toggle */}
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isPublished}
                    onChange={(e) =>
                      handleInputChange("isPublished", e.target.checked)
                    }
                  />
                }
                label="Xuất bản khóa học"
              />
            </div>
          </div>
        </div>
      </DialogContent>

      <Divider />

      <DialogActions className="justify-between p-6">
        <Button onClick={handleClose} variant="outlined" size="large">
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          size="large"
          startIcon={<Add />}
          disabled={
            !formData.title ||
            !formData.topic ||
            !formData.courseType ||
            !formData.description ||
            !formData.address
          }
          className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8"
        >
          Tạo khóa học
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateCourseDialog;
