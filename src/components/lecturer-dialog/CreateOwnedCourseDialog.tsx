import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Autocomplete,
  Switch,
  FormControlLabel,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
} from "@mui/material";
import {
  Close,
  School,
  Language,
  LocationOn,
  CalendarToday,
  AttachMoney,
  Public,
  Description,
  Category,
  Link as LinkIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { validateCourseForm } from "../../utils/Validate";
import { specializationAutoComplete } from "../../utils/AutoComplete";
import { API } from "../../utils/Fetch";
import {
  courseTypes,
  languages,
  levels,
  scales,
} from "../../utils/DropdownOption";
import type { OwnedCourse } from "../../types/OwnedCourse";
import { getCourseType, getScale } from "../../utils/ChangeText";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {
    xs: "95vw", // Mobile: 95% of viewport width
    sm: "90vw", // Small tablet: 90% of viewport width
    md: 750, // Medium and up: fixed 750px
    lg: 750,
    xl: 750,
  },
  maxWidth: "750px",
  maxHeight: {
    xs: "90vh", // Mobile: 90% of viewport height
    sm: "95vh", // Tablet and up: 95% of viewport height
  },
  overflow: "hidden",
  bgcolor: "#ffffff",
  borderRadius: {
    xs: "12px", // Mobile: smaller border radius
    sm: "16px", // Tablet and up: larger border radius
  },
  boxShadow:
    "0 20px 60px rgba(139, 92, 246, 0.15), 0 10px 30px rgba(0, 0, 0, 0.08)",
  outline: "none",
  border: "1px solid rgba(139, 92, 246, 0.08)",
  mx: {
    xs: 1, // Mobile: margin on sides
    sm: 2, // Tablet: more margin
    md: 0, // Desktop: no margin needed
  },
};

interface CreateOwnedCourseDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (course: OwnedCourse) => void;
  editMode?: boolean;
  editData?: OwnedCourse;
}

const CreateOwnedCourseDialog: React.FC<CreateOwnedCourseDialogProps> = ({
  open,
  onClose,
  onSubmit,
  editMode = false,
  editData,
}) => {
  const [form, setForm] = useState<OwnedCourse>({
    id: "",
    title: "",
    topic: "",
    courseType: "FORMAL",
    scale: "OTHERS",
    thumbnailUrl: "",
    contentUrl: "",
    level: "",
    requirements: "",
    language: "Vietnamese",
    isOnline: true,
    address: "",
    price: 0,
    startDate: "",
    endDate: "",
    description: "",
    courseUrl: "",

    status: "",
    adminNote: "",
    createdAt: "",
    updatedAt: "",
  });

  // useEffect để clear form khi đóng modal
  useEffect(() => {
    if (!open) {
      setForm({
        id: "",
        title: "",
        topic: "",
        courseType: "FORMAL",
        scale: "OTHERS",
        thumbnailUrl: "",
        contentUrl: "",
        level: "",
        requirements: "",
        language: "Vietnamese",
        isOnline: true,
        address: "",
        price: 0,
        startDate: "",
        endDate: "",
        description: "",
        courseUrl: "",
        status: "",
        adminNote: "",
        createdAt: "",
        updatedAt: "",
      });
      setSelectedFile(null);
    } else if (editMode && editData) {
      // Pre-fill form with edit data
      setForm(editData);
    }
  }, [open, editMode, editData]);

  // State for file upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    field: keyof OwnedCourse,
    value: string | number | boolean,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // File upload functions
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      const response = await API.user.uploadFileToServer(file);
      const uploadedUrl = response.data;
      setForm((prev) => ({ ...prev, thumbnailUrl: uploadedUrl }));
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

  // useEffect to handle file upload when selectedFile changes
  useEffect(() => {
    if (selectedFile) {
      handleFileUpload(selectedFile);
    }
  }, [selectedFile]);

  const handleSubmit = () => {
    const isValid = validateCourseForm(form);
    if (!isValid.success) {
      toast.error(isValid.error);
      return;
    }

    onSubmit(form);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiBackdrop-root": {
          backgroundColor: "rgba(139, 92, 246, 0.4)",
          backdropFilter: "blur(8px)",
        },
      }}
    >
      <Box sx={style}>
        {/* Modern Header with Gradient */}
        <Box
          sx={{
            position: "relative",
            background:
              "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)",
            p: {
              xs: 2, // Mobile: less padding
              sm: 3, // Tablet: medium padding
              md: 4, // Desktop: full padding
            },
            borderRadius: {
              xs: "12px 12px 0 0", // Mobile: smaller radius
              sm: "16px 16px 0 0", // Tablet and up: larger radius
            },
            color: "white",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              right: 0,
              width: {
                xs: "60px", // Mobile: smaller decorative elements
                md: "100px", // Desktop: larger decorative elements
              },
              height: {
                xs: "60px",
                md: "100px",
              },
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "50%",
              transform: {
                xs: "translate(20px, -20px)", // Mobile: smaller offset
                md: "translate(30px, -30px)", // Desktop: larger offset
              },
            },
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: 0,
              left: 0,
              width: {
                xs: "40px", // Mobile: smaller decorative elements
                md: "60px", // Desktop: larger decorative elements
              },
              height: {
                xs: "40px",
                md: "60px",
              },
              background: "rgba(255, 255, 255, 0.08)",
              borderRadius: "50%",
              transform: {
                xs: "translate(-15px, 15px)", // Mobile: smaller offset
                md: "translate(-20px, 20px)", // Desktop: larger offset
              },
            },
          }}
        >
          {/* Close Button */}
          <Button
            onClick={onClose}
            sx={{
              position: "absolute",
              top: {
                xs: 8, // Mobile: closer to top
                md: 12, // Desktop: more space from top
              },
              right: {
                xs: 8, // Mobile: closer to right
                md: 12, // Desktop: more space from right
              },
              zIndex: 10,
              minWidth: "auto",
              width: {
                xs: 32, // Mobile: smaller button
                md: 40, // Desktop: larger button
              },
              height: {
                xs: 32,
                md: 40,
              },
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(10px)",
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.25)",
                transform: "scale(1.05)",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            <Close
              sx={{
                fontSize: {
                  xs: 18, // Mobile: smaller icon
                  md: 20, // Desktop: larger icon
                },
              }}
            />
          </Button>

          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: {
                  xs: 1.5, // Mobile: smaller gap
                  md: 2, // Desktop: larger gap
                },
                mb: 1,
                flexDirection: {
                  xs: "column", // Mobile: stack vertically
                  sm: "row", // Tablet and up: horizontal
                },
                textAlign: {
                  xs: "center", // Mobile: center text
                  sm: "left", // Tablet and up: left align
                },
              }}
            >
              <Box
                sx={{
                  p: {
                    xs: 1, // Mobile: smaller padding
                    md: 1.5, // Desktop: larger padding
                  },
                  borderRadius: {
                    xs: "10px", // Mobile: smaller radius
                    md: "12px", // Desktop: larger radius
                  },
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(10px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <School
                  sx={{
                    fontSize: {
                      xs: 24, // Mobile: smaller icon
                      md: 28, // Desktop: larger icon
                    },
                    color: "white",
                  }}
                />
              </Box>
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    fontSize: {
                      xs: "1.25rem", // Mobile: smaller text
                      sm: "1.5rem", // Tablet: medium text
                      md: "1.75rem", // Desktop: larger text
                    },
                    letterSpacing: "-0.02em",
                    mb: 0.5,
                  }}
                >
                  {editMode
                    ? "Chỉnh sửa khóa học"
                    : "Thêm khóa học đang sở hữu"}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    opacity: 0.9,
                    fontSize: {
                      xs: "0.875rem", // Mobile: smaller text
                      md: "1rem", // Desktop: larger text
                    },
                    fontWeight: 400,
                  }}
                >
                  {editMode
                    ? "Cập nhật thông tin khóa học của bạn"
                    : "Nhập thông tin chi tiết về khóa học đang sở hữu"}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Scrollable Content */}
        <Box
          sx={{
            maxHeight: {
              xs: "calc(75vh - 90px)", // Mobile: adjust for smaller header
              sm: "calc(80vh - 120px)", // Tablet: adjust for medium header
              md: "calc(80vh - 150px)", // Desktop: original calculation
            },
            overflow: "auto",
            "&::-webkit-scrollbar": {
              width: {
                xs: "4px", // Mobile: thinner scrollbar
                md: "6px", // Desktop: original width
              },
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#f1f5f9",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#8B5CF6",
              borderRadius: "3px",
            },
          }}
        >
          <Box
            sx={{
              p: {
                xs: 2, // Mobile: less padding
                sm: 3, // Tablet: medium padding
                md: 4, // Desktop: full padding
              },
              pt: {
                xs: 2, // Mobile: consistent top padding
                md: 3, // Desktop: slightly more top padding
              },
            }}
          >
            <Stack
              spacing={{
                xs: 2, // Mobile: less spacing
                md: 3, // Desktop: more spacing
              }}
            >
              {/* Basic Information Section */}
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: {
                      xs: 1, // Mobile: smaller gap
                      md: 1.5, // Desktop: larger gap
                    },
                    mb: {
                      xs: 2, // Mobile: less margin
                      md: 3, // Desktop: more margin
                    },
                    pb: 1,
                    borderBottom: "2px solid #f3f4f6",
                    flexDirection: {
                      xs: "column", // Mobile: stack vertically
                      sm: "row", // Tablet and up: horizontal
                    },
                    textAlign: {
                      xs: "center", // Mobile: center align
                      sm: "left", // Tablet and up: left align
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: {
                        xs: 32,
                        md: 40,
                      },
                      height: {
                        xs: 32,
                        md: 40,
                      },
                      borderRadius: {
                        xs: "8px",
                        md: "10px",
                      },
                      background:
                        "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <School
                      sx={{ color: "white", fontSize: { xs: 16, md: 20 } }}
                    />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#6D28D9",
                      fontWeight: 700,
                      fontSize: {
                        xs: "1rem",
                        md: "1.25rem",
                      },
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Thông tin cơ bản
                  </Typography>
                </Box>

                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    label="Tiêu đề khóa học"
                    value={form.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    variant="outlined"
                    size="medium"
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        backgroundColor: "#f8fafc",
                        border: "2px solid transparent",
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          backgroundColor: "#f3f4f6",
                          borderColor: "#d8b4fe",
                        },
                        "&.Mui-focused": {
                          backgroundColor: "#ffffff",
                          borderColor: "#8B5CF6",
                          boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.1)",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "#64748b",
                        fontWeight: 500,
                        "&.Mui-focused": {
                          color: "#8B5CF6",
                        },
                      },
                    }}
                  />

                  <Box
                    display="flex"
                    gap={2}
                    flexDirection={{ xs: "column", sm: "row" }}
                  >
                    <Autocomplete
                      fullWidth
                      options={specializationAutoComplete}
                      value={form.topic}
                      onChange={(_, newValue) =>
                        handleChange("topic", newValue || "")
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Chủ đề"
                          variant="outlined"
                          size="medium"
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <InputAdornment position="start">
                                <Category sx={{ color: "#64748b" }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "12px",
                              backgroundColor: "#f8fafc",
                              border: "2px solid transparent",
                              transition: "all 0.2s ease-in-out",
                              "&:hover": {
                                backgroundColor: "#f3f4f6",
                                borderColor: "#d8b4fe",
                              },
                              "&.Mui-focused": {
                                backgroundColor: "#ffffff",
                                borderColor: "#8B5CF6",
                                boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.1)",
                              },
                            },
                            "& .MuiInputLabel-root": {
                              color: "#64748b",
                              fontWeight: 500,
                              "&.Mui-focused": {
                                color: "#8B5CF6",
                              },
                            },
                          }}
                        />
                      )}
                    />

                    <Autocomplete
                      fullWidth
                      options={levels}
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
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "12px",
                              backgroundColor: "#f8fafc",
                              border: "2px solid transparent",
                              transition: "all 0.2s ease-in-out",
                              "&:hover": {
                                backgroundColor: "#f3f4f6",
                                borderColor: "#d8b4fe",
                              },
                              "&.Mui-focused": {
                                backgroundColor: "#ffffff",
                                borderColor: "#8B5CF6",
                                boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.1)",
                              },
                            },
                            "& .MuiInputLabel-root": {
                              color: "#64748b",
                              fontWeight: 500,
                              "&.Mui-focused": {
                                color: "#8B5CF6",
                              },
                            },
                          }}
                        />
                      )}
                    />
                  </Box>

                  <Box
                    display="flex"
                    gap={2}
                    flexDirection={{ xs: "column", sm: "row" }}
                  >
                    <FormControl fullWidth>
                      <InputLabel
                        id="course-type-label"
                        sx={{
                          color: "#64748b",
                          fontWeight: 500,
                          "&.Mui-focused": {
                            color: "#8B5CF6",
                          },
                        }}
                      >
                        Loại khóa học
                      </InputLabel>
                      <Select
                        labelId="course-type-label"
                        value={form.courseType}
                        label="Loại khóa học"
                        onChange={(e) =>
                          handleChange("courseType", e.target.value)
                        }
                        size="medium"
                        sx={{
                          borderRadius: "12px",
                          backgroundColor: "#f8fafc",
                          border: "2px solid transparent",
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                          "&:hover": {
                            backgroundColor: "#f3f4f6",
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#d8b4fe",
                              borderWidth: "2px",
                            },
                          },
                          "&.Mui-focused": {
                            backgroundColor: "#ffffff",
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#8B5CF6",
                              borderWidth: "2px",
                            },
                            boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.1)",
                          },
                        }}
                      >
                        {courseTypes.map((type) => (
                          <MenuItem key={type} value={type}>
                            {getCourseType(type)}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl fullWidth>
                      <InputLabel
                        id="scale-label"
                        sx={{
                          color: "#64748b",
                          fontWeight: 500,
                          "&.Mui-focused": {
                            color: "#8B5CF6",
                          },
                        }}
                      >
                        Quy mô
                      </InputLabel>
                      <Select
                        labelId="scale-label"
                        value={form.scale}
                        label="Quy mô"
                        onChange={(e) => handleChange("scale", e.target.value)}
                        size="medium"
                        sx={{
                          borderRadius: "12px",
                          backgroundColor: "#f8fafc",
                          border: "2px solid transparent",
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                          "&:hover": {
                            backgroundColor: "#f3f4f6",
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#d8b4fe",
                              borderWidth: "2px",
                            },
                          },
                          "&.Mui-focused": {
                            backgroundColor: "#ffffff",
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#8B5CF6",
                              borderWidth: "2px",
                            },
                            boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.1)",
                          },
                        }}
                      >
                        {scales.map((scale) => (
                          <MenuItem key={scale} value={scale}>
                            {getScale(scale)}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  <Box
                    display="flex"
                    gap={2}
                    flexDirection={{ xs: "column", sm: "row" }}
                  >
                    <Autocomplete
                      fullWidth
                      options={languages}
                      value={form.language}
                      onChange={(_, newValue) =>
                        handleChange("language", newValue || "Vietnamese")
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Ngôn ngữ"
                          variant="outlined"
                          size="medium"
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <InputAdornment position="start">
                                <Language sx={{ color: "#64748b" }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "12px",
                              backgroundColor: "#f8fafc",
                              border: "2px solid transparent",
                              transition: "all 0.2s ease-in-out",
                              "&:hover": {
                                backgroundColor: "#f3f4f6",
                                borderColor: "#d8b4fe",
                              },
                              "&.Mui-focused": {
                                backgroundColor: "#ffffff",
                                borderColor: "#8B5CF6",
                                boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.1)",
                              },
                            },
                            "& .MuiInputLabel-root": {
                              color: "#64748b",
                              fontWeight: 500,
                              "&.Mui-focused": {
                                color: "#8B5CF6",
                              },
                            },
                          }}
                        />
                      )}
                    />

                    <TextField
                      fullWidth
                      label="Yêu cầu"
                      value={form.requirements}
                      onChange={(e) =>
                        handleChange("requirements", e.target.value)
                      }
                      variant="outlined"
                      size="medium"
                      placeholder="Ví dụ: Không yêu cầu, Cần kiến thức cơ bản..."
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          backgroundColor: "#f8fafc",
                          border: "2px solid transparent",
                          transition: "all 0.2s ease-in-out",
                          "&:hover": {
                            backgroundColor: "#f3f4f6",
                            borderColor: "#d8b4fe",
                          },
                          "&.Mui-focused": {
                            backgroundColor: "#ffffff",
                            borderColor: "#8B5CF6",
                            boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.1)",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "#64748b",
                          fontWeight: 500,
                          "&.Mui-focused": {
                            color: "#8B5CF6",
                          },
                        },
                      }}
                    />
                  </Box>
                </Stack>
              </Box>

              {/* Time and Price Information Section */}
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 3,
                    pb: 1,
                    borderBottom: "2px solid #f3f4f6",
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "10px",
                      background:
                        "linear-gradient(135deg, #A855F7 0%, #8B5CF6 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CalendarToday sx={{ color: "white", fontSize: 20 }} />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#6D28D9",
                      fontWeight: 700,
                      fontSize: "1.25rem",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Thời gian và chi phí
                  </Typography>
                </Box>

                <Stack spacing={2}>
                  <Box
                    display="flex"
                    gap={2}
                    flexDirection={{ xs: "column", sm: "row" }}
                  >
                    <TextField
                      fullWidth
                      type="date"
                      label="Ngày bắt đầu"
                      value={form.startDate}
                      onChange={(e) =>
                        handleChange("startDate", e.target.value)
                      }
                      variant="outlined"
                      size="medium"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarToday sx={{ color: "#64748b" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          backgroundColor: "#f8fafc",
                          border: "2px solid transparent",
                          transition: "all 0.2s ease-in-out",
                          "&:hover": {
                            backgroundColor: "#f3f4f6",
                            borderColor: "#d8b4fe",
                          },
                          "&.Mui-focused": {
                            backgroundColor: "#ffffff",
                            borderColor: "#8B5CF6",
                            boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.1)",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "#64748b",
                          fontWeight: 500,
                          "&.Mui-focused": {
                            color: "#8B5CF6",
                          },
                        },
                      }}
                    />

                    <TextField
                      fullWidth
                      type="date"
                      label="Ngày kết thúc"
                      value={form.endDate}
                      onChange={(e) => handleChange("endDate", e.target.value)}
                      variant="outlined"
                      size="medium"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarToday sx={{ color: "#64748b" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          backgroundColor: "#f8fafc",
                          border: "2px solid transparent",
                          transition: "all 0.2s ease-in-out",
                          "&:hover": {
                            backgroundColor: "#f3f4f6",
                            borderColor: "#d8b4fe",
                          },
                          "&.Mui-focused": {
                            backgroundColor: "#ffffff",
                            borderColor: "#8B5CF6",
                            boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.1)",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "#64748b",
                          fontWeight: 500,
                          "&.Mui-focused": {
                            color: "#8B5CF6",
                          },
                        },
                      }}
                    />
                  </Box>

                  <TextField
                    fullWidth
                    type="number"
                    label="Giá khóa học (VNĐ)"
                    value={form.price}
                    onChange={(e) =>
                      handleChange("price", Number(e.target.value))
                    }
                    variant="outlined"
                    size="medium"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoney sx={{ color: "#64748b" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        backgroundColor: "#f8fafc",
                        border: "2px solid transparent",
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          backgroundColor: "#f3f4f6",
                          borderColor: "#d8b4fe",
                        },
                        "&.Mui-focused": {
                          backgroundColor: "#ffffff",
                          borderColor: "#8B5CF6",
                          boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.1)",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "#64748b",
                        fontWeight: 500,
                        "&.Mui-focused": {
                          color: "#8B5CF6",
                        },
                      },
                    }}
                  />
                </Stack>
              </Box>

              {/* Location and Online Section */}
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 3,
                    pb: 1,
                    borderBottom: "2px solid #f3f4f6",
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "10px",
                      background:
                        "linear-gradient(135deg, #C084FC 0%, #A855F7 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <LocationOn sx={{ color: "white", fontSize: 20 }} />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#6D28D9",
                      fontWeight: 700,
                      fontSize: "1.25rem",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Hình thức và địa điểm
                  </Typography>
                </Box>

                <Stack spacing={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={form.isOnline}
                        onChange={(e) =>
                          handleChange("isOnline", e.target.checked)
                        }
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color: "#8B5CF6",
                            "&:hover": {
                              backgroundColor: "rgba(139, 92, 246, 0.04)",
                            },
                          },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                            {
                              backgroundColor: "#8B5CF6",
                            },
                        }}
                      />
                    }
                    label={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Public sx={{ color: "#64748b" }} />
                        <Typography sx={{ color: "#64748b", fontWeight: 500 }}>
                          Khóa học trực tuyến
                        </Typography>
                      </Box>
                    }
                  />

                  <TextField
                    fullWidth
                    label={
                      form.isOnline
                        ? "Đường dẫn/Link tham gia"
                        : "Địa chỉ tổ chức"
                    }
                    value={form.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    variant="outlined"
                    size="medium"
                    placeholder={
                      form.isOnline
                        ? "Ví dụ: https://zoom.us/j/123456789"
                        : "Ví dụ: Đại học Cần Thơ, Quận Ninh Kiều, Cần Thơ"
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {form.isOnline ? (
                            <LinkIcon sx={{ color: "#64748b" }} />
                          ) : (
                            <LocationOn sx={{ color: "#64748b" }} />
                          )}
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        backgroundColor: "#f8fafc",
                        border: "2px solid transparent",
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          backgroundColor: "#f3f4f6",
                          borderColor: "#d8b4fe",
                        },
                        "&.Mui-focused": {
                          backgroundColor: "#ffffff",
                          borderColor: "#8B5CF6",
                          boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.1)",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "#64748b",
                        fontWeight: 500,
                        "&.Mui-focused": {
                          color: "#8B5CF6",
                        },
                      },
                    }}
                  />
                </Stack>
              </Box>

              {/* URLs Section */}
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 3,
                    pb: 1,
                    borderBottom: "2px solid #f3f4f6",
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "10px",
                      background:
                        "linear-gradient(135deg, #DDD6FE 0%, #C084FC 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <LinkIcon sx={{ color: "white", fontSize: 20 }} />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#6D28D9",
                      fontWeight: 700,
                      fontSize: "1.25rem",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Tài liệu và liên kết
                  </Typography>
                </Box>

                <Stack spacing={2}>
                  {/* Image Upload Section */}
                  <div className="flex flex-col gap-4 md:flex-row">
                    <button
                      type="button"
                      className="flex h-40 w-40 items-center justify-center rounded-lg border border-gray-300 md:w-1/2"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Avatar
                        src={form.thumbnailUrl}
                        key={form.thumbnailUrl}
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
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#64748b",
                          mb: 1,
                          fontWeight: 500,
                        }}
                      >
                        Ảnh thumbnail khóa học
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#9ca3af",
                          display: "block",
                          mb: 2,
                        }}
                      >
                        Nhấp vào khung để tải lên ảnh (.jpg, .jpeg, .png)
                      </Typography>
                      {form.thumbnailUrl && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#10b981",
                            fontWeight: 500,
                          }}
                        >
                          ✓ Ảnh đã được tải lên thành công
                        </Typography>
                      )}
                    </Box>
                  </div>

                  <TextField
                    fullWidth
                    label="URL nội dung khóa học"
                    value={form.contentUrl}
                    onChange={(e) => handleChange("contentUrl", e.target.value)}
                    variant="outlined"
                    size="medium"
                    placeholder="https://example.com/course-content"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LinkIcon sx={{ color: "#64748b" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        backgroundColor: "#f8fafc",
                        border: "2px solid transparent",
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          backgroundColor: "#f3f4f6",
                          borderColor: "#d8b4fe",
                        },
                        "&.Mui-focused": {
                          backgroundColor: "#ffffff",
                          borderColor: "#8B5CF6",
                          boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.1)",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "#64748b",
                        fontWeight: 500,
                        "&.Mui-focused": {
                          color: "#8B5CF6",
                        },
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="URL trang khóa học"
                    value={form.courseUrl}
                    onChange={(e) => handleChange("courseUrl", e.target.value)}
                    variant="outlined"
                    size="medium"
                    placeholder="https://example.com/course-page"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LinkIcon sx={{ color: "#64748b" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        backgroundColor: "#f8fafc",
                        border: "2px solid transparent",
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          backgroundColor: "#f3f4f6",
                          borderColor: "#d8b4fe",
                        },
                        "&.Mui-focused": {
                          backgroundColor: "#ffffff",
                          borderColor: "#8B5CF6",
                          boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.1)",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "#64748b",
                        fontWeight: 500,
                        "&.Mui-focused": {
                          color: "#8B5CF6",
                        },
                      },
                    }}
                  />
                </Stack>
              </Box>

              {/* Description Section */}
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 3,
                    pb: 1,
                    borderBottom: "2px solid #f3f4f6",
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "10px",
                      background:
                        "linear-gradient(135deg, #F3E8FF 0%, #DDD6FE 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Description sx={{ color: "#6D28D9", fontSize: 20 }} />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#6D28D9",
                      fontWeight: 700,
                      fontSize: "1.25rem",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Mô tả chi tiết
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  label="Mô tả khóa học"
                  multiline
                  rows={4}
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  variant="outlined"
                  placeholder="Nhập mô tả chi tiết về khóa học, nội dung, mục tiêu học tập..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        sx={{ alignSelf: "flex-start", pt: 1 }}
                      >
                        <Description sx={{ color: "#64748b" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      backgroundColor: "#f8fafc",
                      border: "2px solid transparent",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        backgroundColor: "#f3f4f6",
                        borderColor: "#d8b4fe",
                      },
                      "&.Mui-focused": {
                        backgroundColor: "#ffffff",
                        borderColor: "#8B5CF6",
                        boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.1)",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#64748b",
                      fontWeight: 500,
                      "&.Mui-focused": {
                        color: "#8B5CF6",
                      },
                    },
                  }}
                />
              </Box>
            </Stack>
          </Box>
        </Box>

        {/* Modern Footer with Action Buttons */}
        <Box
          sx={{
            p: {
              xs: 2, // Mobile: less padding
              md: 4, // Desktop: more padding
            },
            pt: {
              xs: 2, // Mobile: consistent top padding
              md: 3, // Desktop: more top padding
            },
            backgroundColor: "#f8fafc",
            borderTop: "2px solid #f3f4f6",
            borderRadius: {
              xs: "0 0 12px 12px", // Mobile: smaller radius
              sm: "0 0 16px 16px", // Tablet and up: larger radius
            },
            display: "flex",
            justifyContent: "space-between",
            gap: {
              xs: 2, // Mobile: smaller gap
              md: 3, // Desktop: larger gap
            },
            flexDirection: {
              xs: "column-reverse", // Mobile: stack buttons, primary at top
              sm: "row", // Tablet and up: horizontal
            },
          }}
        >
          <Button
            variant="outlined"
            onClick={onClose}
            size="large"
            sx={{
              minWidth: {
                xs: "100%", // Mobile: full width
                sm: 140, // Tablet and up: fixed width
              },
              py: {
                xs: 1.25, // Mobile: less padding
                md: 1.5, // Desktop: more padding
              },
              borderRadius: {
                xs: "8px", // Mobile: smaller radius
                md: "12px", // Desktop: larger radius
              },
              borderWidth: "2px",
              borderColor: "#cbd5e1",
              color: "#64748b",
              fontWeight: 600,
              fontSize: {
                xs: "0.875rem", // Mobile: smaller font
                md: "1rem", // Desktop: normal font
              },
              textTransform: "none",
              "&:hover": {
                borderWidth: "2px",
                borderColor: "#94a3b8",
                backgroundColor: "#f1f5f9",
              },
            }}
          >
            Hủy bỏ
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            size="large"
            sx={{
              minWidth: {
                xs: "100%", // Mobile: full width
                sm: 140, // Tablet and up: fixed width
              },
              py: {
                xs: 1.25, // Mobile: less padding
                md: 1.5, // Desktop: more padding
              },
              borderRadius: {
                xs: "8px", // Mobile: smaller radius
                md: "12px", // Desktop: larger radius
              },
              background:
                "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)",
              fontWeight: 700,
              fontSize: {
                xs: "0.875rem", // Mobile: smaller font
                md: "1rem", // Desktop: normal font
              },
              textTransform: "none",
              letterSpacing: "-0.01em",
              boxShadow: "0 8px 20px rgba(139, 92, 246, 0.3)",
              "&:hover": {
                background:
                  "linear-gradient(135deg, #7C3AED 0%, #6D28D9 50%, #5B21B6 100%)",
                boxShadow: "0 12px 28px rgba(139, 92, 246, 0.4)",
                transform: {
                  xs: "none", // Mobile: no transform to avoid layout issues
                  md: "translateY(-2px)", // Desktop: hover effect
                },
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            {editMode ? "Cập nhật khóa học" : "Tạo khóa học"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateOwnedCourseDialog;
