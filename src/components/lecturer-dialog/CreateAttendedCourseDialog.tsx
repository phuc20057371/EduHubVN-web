import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Autocomplete,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
} from "@mui/material";
import {
  Close,
  Group,
  Category,
  LocationOn,
  CalendarToday,
  Business,
  Schedule,
  Link as LinkIcon,
  Description,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { specializationAutoComplete } from "../../utils/AutoComplete";
import { courseTypes, scales } from "../../utils/DropdownOption";
import { validateAttendedCourseForm } from "../../utils/Validate";
import type { AttendedCourse } from "../../types/AttendedCourse";

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
    "0 20px 60px rgba(20, 184, 166, 0.15), 0 10px 30px rgba(0, 0, 0, 0.08)",
  outline: "none",
  border: "1px solid rgba(20, 184, 166, 0.08)",
  mx: {
    xs: 1, // Mobile: margin on sides
    sm: 2, // Tablet: more margin
    md: 0, // Desktop: no margin needed
  },
};

interface CreateAttendedCourseDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (course: AttendedCourse) => void;
  editMode?: boolean;
  editData?: AttendedCourse;
}

const CreateAttendedCourseDialog: React.FC<CreateAttendedCourseDialogProps> = ({
  open,
  onClose,
  onSubmit,
  editMode = false,
  editData,
}) => {
  const [form, setForm] = useState<AttendedCourse>({
    id: "",
    title: "",
    topic: "",
    organizer: "",
    courseType: "FORMAL",
    scale: "UNIVERSITY",
    startDate: "",
    endDate: "",
    numberOfHour: 0,
    location: "",
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
        organizer: "",
        courseType: "FORMAL",
        scale: "UNIVERSITY",
        startDate: "",
        endDate: "",
        numberOfHour: 0,
        location: "",
        description: "",
        courseUrl: "",

        status: "",
        adminNote: "",
        createdAt: "",
        updatedAt: "",
      });
    } else if (editMode && editData) {
      // Pre-fill form with edit data (excluding metadata fields)
      setForm(editData);
    }
  }, [open, editMode, editData]);

  const handleChange = (field: keyof AttendedCourse, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    const validation = validateAttendedCourseForm(form);
    if (!validation.success) {
      toast.error(validation.error);
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
          backgroundColor: "rgba(20, 184, 166, 0.4)",
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
              "linear-gradient(135deg, #14B8A6 0%, #0D9488 50%, #0F766E 100%)",
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
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              color: "white",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                transform: "scale(1.05)",
              },
            }}
          >
            <Close />
          </Button>

          {/* Header Content */}
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
              }}
            >
              <Group
                sx={{
                  color: "white",
                }}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h4"
                sx={{
                  mb: 0.5,
                }}
              >
                {editMode
                  ? "Chỉnh sửa khóa học đã tham gia"
                  : "Thêm khóa học đã tham gia"}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  opacity: 0.9,
                }}
              >
                Thông tin về khóa đào tạo mà bạn đã tham gia
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Form Content */}
        <Box
          sx={{
            p: {
              xs: 2, // Mobile: less padding
              sm: 3, // Tablet: medium padding
              md: 4, // Desktop: full padding
            },
            maxHeight: {
              xs: "calc(70vh - 90px)", // Mobile: account for header
              sm: "calc(70vh - 90px)", // Desktop: account for header
            },
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#f1f1f1",
              borderRadius: "3px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#14B8A6",
              borderRadius: "3px",
            },
          }}
        >
          <Stack spacing={3}>
            {/* Section 1: Basic Information */}
            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    p: 1,
                    borderRadius: "8px",
                    backgroundColor: "#F0FDF4",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Group sx={{ color: "#0D9488" }} />
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#0D9488",
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
                        borderColor: "#a7f3d0",
                      },
                      "&.Mui-focused": {
                        backgroundColor: "#ffffff",
                        borderColor: "#14B8A6",
                        boxShadow: "0 0 0 3px rgba(20, 184, 166, 0.1)",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#64748b",
                      "&.Mui-focused": {
                        color: "#14B8A6",
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
                              borderColor: "#a7f3d0",
                            },
                            "&.Mui-focused": {
                              backgroundColor: "#ffffff",
                              borderColor: "#14B8A6",
                              boxShadow: "0 0 0 3px rgba(20, 184, 166, 0.1)",
                            },
                          },
                          "& .MuiInputLabel-root": {
                            color: "#64748b",
                            "&.Mui-focused": {
                              color: "#14B8A6",
                            },
                          },
                        }}
                      />
                    )}
                  />

                  <TextField
                    fullWidth
                    label="Đơn vị tổ chức"
                    value={form.organizer}
                    onChange={(e) => handleChange("organizer", e.target.value)}
                    variant="outlined"
                    size="medium"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Business sx={{ color: "#64748b" }} />
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
                          borderColor: "#a7f3d0",
                        },
                        "&.Mui-focused": {
                          backgroundColor: "#ffffff",
                          borderColor: "#14B8A6",
                          boxShadow: "0 0 0 3px rgba(20, 184, 166, 0.1)",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "#64748b",
                        "&.Mui-focused": {
                          color: "#14B8A6",
                        },
                      },
                    }}
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
                        "&.Mui-focused": {
                          color: "#14B8A6",
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
                            border: "2px solid #a7f3d0",
                          },
                        },
                        "&.Mui-focused": {
                          backgroundColor: "#ffffff",
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "2px solid #14B8A6",
                            boxShadow: "0 0 0 3px rgba(20, 184, 166, 0.1)",
                          },
                        },
                      }}
                    >
                      {courseTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type === "FORMAL"
                            ? "Chính quy"
                            : type === "SPECIALIZED"
                              ? "Chuyên đề"
                              : type === "EXTRACURRICULAR"
                                ? "Ngoại khóa"
                                : type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel
                      id="scale-label"
                      sx={{
                        color: "#64748b",
                        "&.Mui-focused": {
                          color: "#14B8A6",
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
                            border: "2px solid #a7f3d0",
                          },
                        },
                        "&.Mui-focused": {
                          backgroundColor: "#ffffff",
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "2px solid #14B8A6",
                            boxShadow: "0 0 0 3px rgba(20, 184, 166, 0.1)",
                          },
                        },
                      }}
                    >
                      {scales.map((scale) => (
                        <MenuItem key={scale} value={scale}>
                          {scale === "INSTITUTIONAL"
                            ? "Cấp cơ sở"
                            : scale === "UNIVERSITY"
                              ? "Cấp trường"
                              : scale === "DEPARTMENTAL"
                                ? "Cấp tỉnh/thành"
                                : scale === "MINISTERIAL"
                                  ? "Cấp bộ"
                                  : scale === "NATIONAL"
                                    ? "Cấp quốc gia"
                                    : scale === "INTERNATIONAL"
                                      ? "Quốc tế"
                                      : scale === "OTHERS"
                                        ? "Khác"
                                        : scale}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Stack>
            </Box>

            {/* Section 2: Time and Duration */}
            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    p: 1,
                    borderRadius: "8px",
                    backgroundColor: "#FEF3C7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CalendarToday sx={{ color: "#D97706" }} />
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#D97706",
                  }}
                >
                  Thời gian và thời lượng
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
                    label="Ngày bắt đầu"
                    type="date"
                    value={form.startDate}
                    onChange={(e) => handleChange("startDate", e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    size="medium"
                    required
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
                          borderColor: "#a7f3d0",
                        },
                        "&.Mui-focused": {
                          backgroundColor: "#ffffff",
                          borderColor: "#14B8A6",
                          boxShadow: "0 0 0 3px rgba(20, 184, 166, 0.1)",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "#64748b",
                        "&.Mui-focused": {
                          color: "#14B8A6",
                        },
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Ngày kết thúc"
                    type="date"
                    value={form.endDate}
                    onChange={(e) => handleChange("endDate", e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    size="medium"
                    required
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
                          borderColor: "#a7f3d0",
                        },
                        "&.Mui-focused": {
                          backgroundColor: "#ffffff",
                          borderColor: "#14B8A6",
                          boxShadow: "0 0 0 3px rgba(20, 184, 166, 0.1)",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "#64748b",
                        "&.Mui-focused": {
                          color: "#14B8A6",
                        },
                      },
                    }}
                  />
                </Box>

                <TextField
                  fullWidth
                  label="Số giờ học"
                  type="number"
                  value={form.numberOfHour}
                  onChange={(e) =>
                    handleChange("numberOfHour", parseInt(e.target.value) || 0)
                  }
                  variant="outlined"
                  size="medium"
                  required
                  inputProps={{ min: 1 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Schedule sx={{ color: "#64748b" }} />
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
                        borderColor: "#a7f3d0",
                      },
                      "&.Mui-focused": {
                        backgroundColor: "#ffffff",
                        borderColor: "#14B8A6",
                        boxShadow: "0 0 0 3px rgba(20, 184, 166, 0.1)",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#64748b",
                      "&.Mui-focused": {
                        color: "#14B8A6",
                      },
                    },
                  }}
                />
              </Stack>
            </Box>

            {/* Section 3: Location and Details */}
            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    p: 1,
                    borderRadius: "8px",
                    backgroundColor: "#E0E7FF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <LocationOn sx={{ color: "#4F46E5" }} />
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#4F46E5",
                  }}
                >
                  Địa điểm và chi tiết
                </Typography>
              </Box>

              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Địa điểm"
                  value={form.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  variant="outlined"
                  size="medium"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOn sx={{ color: "#64748b" }} />
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
                        borderColor: "#a7f3d0",
                      },
                      "&.Mui-focused": {
                        backgroundColor: "#ffffff",
                        borderColor: "#14B8A6",
                        boxShadow: "0 0 0 3px rgba(20, 184, 166, 0.1)",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#64748b",
                      "&.Mui-focused": {
                        color: "#14B8A6",
                      },
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Mô tả"
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  variant="outlined"
                  size="medium"
                  multiline
                  rows={3}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        sx={{ alignSelf: "flex-start", mt: 1 }}
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
                        borderColor: "#a7f3d0",
                      },
                      "&.Mui-focused": {
                        backgroundColor: "#ffffff",
                        borderColor: "#14B8A6",
                        boxShadow: "0 0 0 3px rgba(20, 184, 166, 0.1)",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#64748b",
                      "&.Mui-focused": {
                        color: "#14B8A6",
                      },
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="URL khóa học"
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
                        borderColor: "#a7f3d0",
                      },
                      "&.Mui-focused": {
                        backgroundColor: "#ffffff",
                        borderColor: "#14B8A6",
                        boxShadow: "0 0 0 3px rgba(20, 184, 166, 0.1)",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#64748b",
                      "&.Mui-focused": {
                        color: "#14B8A6",
                      },
                    },
                  }}
                />
              </Stack>
            </Box>
          </Stack>
        </Box>

        {/* Footer Buttons */}
        <Box
          sx={{
            p: {
              xs: 2, // Mobile: less padding
              sm: 3, // Tablet: medium padding
              md: 4, // Desktop: full padding
            },
            pt: 2,
            borderTop: "1px solid #e2e8f0",
            backgroundColor: "#f8fafc",
            display: "flex",
            gap: 2,
            justifyContent: "flex-end",
            flexDirection: {
              xs: "column", // Mobile: stack buttons
              sm: "row", // Tablet and up: side by side
            },
          }}
        >
          <Button
            onClick={onClose}
            variant="outlined"
            size="large"
            sx={{
              minWidth: {
                xs: "100%", // Mobile: full width
                sm: 120, // Desktop: fixed width
              },
              py: 1.5,
              borderColor: "#d1d5db",
              color: "#6b7280",
              textTransform: "none",
              borderRadius: 2,
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                borderColor: "#9ca3af",
                backgroundColor: "#f9fafb",
                transform: {
                  xs: "none", // Mobile: no transform
                  md: "translateY(-2px)", // Desktop: hover effect
                },
              },
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            size="large"
            sx={{
              minWidth: {
                xs: "100%", // Mobile: full width
                sm: 120, // Desktop: fixed width
              },
              py: 1.5,
              background:
                "linear-gradient(135deg, #14B8A6 0%, #0D9488 50%, #0F766E 100%)",
              color: "white",
              textTransform: "none",
              borderRadius: 2,
              boxShadow: "0 4px 20px rgba(20, 184, 166, 0.3)",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                background:
                  "linear-gradient(135deg, #0D9488 0%, #0F766E 50%, #134E4A 100%)",
                boxShadow: "0 8px 25px rgba(20, 184, 166, 0.4)",
                transform: {
                  xs: "none", // Mobile: no transform
                  md: "translateY(-2px)", // Desktop: hover effect
                },
              },
            }}
          >
            {editMode ? "Cập nhật khóa học" : "Tạo khóa học"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateAttendedCourseDialog;
