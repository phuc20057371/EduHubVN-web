import { AttachFile, CloudUpload, School, Close } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import type { Theme } from "@mui/material";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { API } from "../../utils/Fetch";
import { validateDegreeInfo } from "../../utils/Validate";
import {
  degreeLevelsAutoComplete,
  majorsAutoComplete,
} from "../../utils/AutoComplete";
import type { DegreeCreateReq } from "../../types/Degree";

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
    "0 20px 60px rgba(15, 118, 110, 0.15), 0 10px 30px rgba(0, 0, 0, 0.08)",
  outline: "none",
  border: "1px solid rgba(20, 184, 166, 0.08)",
  mx: {
    xs: 1, // Mobile: margin on sides
    sm: 2, // Tablet: more margin
    md: 0, // Desktop: no margin needed
  },
};

interface UploadDegreeModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (degree: DegreeCreateReq) => void;
  editMode?: boolean;
  editData?: DegreeCreateReq;
}

const CreateDegreeModal: React.FC<UploadDegreeModalProps> = ({
  open,
  onClose,
  onSubmit,
  editMode = false,
  editData,
}) => {
  const theme = useTheme() as Theme;
  const isDark = theme?.palette?.mode === "dark";
  const whiteBg = isDark ? "#0E1D2C" : "#ffffff";
  const translucentWhite = isDark
    ? "rgba(255,255,255,0.06)"
    : "rgba(255,255,255,0.15)";
  const inputBg = isDark ? "#07202d" : "#f8fafc";
  const scrollbarTrack = isDark ? "#071722" : "#f1f5f9";
  const chipBg = isDark ? "#072b24" : "#f0fdfa";
  const footerBorder = isDark ? "rgba(255,255,255,0.03)" : "#f0fdfa";

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
  const [form, setForm] = useState<DegreeCreateReq>({
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
  const handleChange = (field: keyof DegreeCreateReq, value: string | number) => {
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
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);
      
      // Tự động tải lên file ngay khi chọn
      setIsUploading(true);
      await API.user
        .uploadFileToServer(file)
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
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiBackdrop-root": {
          backgroundColor: "rgba(15, 118, 110, 0.4)",
          backdropFilter: "blur(8px)",
        },
      }}
    >
      <Box sx={{ ...style, bgcolor: whiteBg }}>
        {/* Modern Header with Gradient */}
        <Box
          sx={{
            position: "relative",
            background:
              "linear-gradient(135deg, #14b8a6 0%, #0d9488 50%, #0f766e 100%)",
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
              backgroundColor: translucentWhite,
              backdropFilter: "blur(10px)",
              color: "white",
              "&:hover": {
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.12)"
                  : "rgba(255, 255, 255, 0.25)",
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
                  backgroundColor: translucentWhite,
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
                  {editMode ? "Chỉnh sửa bằng cấp" : "Thêm bằng cấp mới"}
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
                    ? "Cập nhật thông tin bằng cấp của bạn"
                    : "Nhập thông tin chi tiết về bằng cấp của bạn"}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>{" "}
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
              backgroundColor: scrollbarTrack,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#14b8a6",
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
                    borderBottom: "2px solid #f0fdfa",
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
                        xs: 32, // Mobile: smaller icon container
                        md: 40, // Desktop: larger icon container
                      },
                      height: {
                        xs: 32,
                        md: 40,
                      },
                      borderRadius: {
                        xs: "8px", // Mobile: smaller radius
                        md: "10px", // Desktop: larger radius
                      },
                      background:
                        "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: {
                        xs: "14px", // Mobile: smaller emoji
                        md: "18px", // Desktop: larger emoji
                      },
                    }}
                  >
                    📋
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#0f766e",
                      fontWeight: 700,
                      fontSize: {
                        xs: "1rem", // Mobile: smaller text
                        md: "1.25rem", // Desktop: larger text
                      },
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Thông tin cơ bản
                  </Typography>
                </Box>
                <Stack
                  spacing={{
                    xs: 2, // Mobile: less spacing
                    md: 3, // Desktop: more spacing
                  }}
                >
                  <TextField
                    fullWidth
                    label="Reference Id"
                    value={form.referenceId}
                    onChange={(e) =>
                      handleChange("referenceId", e.target.value)
                    }
                    variant="outlined"
                    size="medium"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        backgroundColor: inputBg,
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          backgroundColor: chipBg,
                          borderColor: "#99f6e4",
                        },
                        "&.Mui-focused": {
                          backgroundColor: whiteBg,
                          boxShadow: "0 0 0 3px rgba(20, 184, 166, 0.1)",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "#64748b",
                        fontWeight: 500,
                        "&.Mui-focused": {
                          color: "#14b8a6",
                        },
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Tên bằng cấp"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    variant="outlined"
                    size="medium"
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        backgroundColor: inputBg,

                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          backgroundColor: chipBg,
                          borderColor: "#99f6e4",
                        },
                        "&.Mui-focused": {
                          backgroundColor: whiteBg,

                          boxShadow: "0 0 0 3px rgba(20, 184, 166, 0.1)",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "#64748b",
                        fontWeight: 500,
                        "&.Mui-focused": {
                          color: "#14b8a6",
                        },
                      },
                    }}
                  />

                  <Box display="flex" gap={2}>
                    <Autocomplete
                      fullWidth
                      options={majorsAutoComplete}
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
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "12px",
                              backgroundColor: inputBg,

                              transition: "all 0.2s ease-in-out",
                              "&:hover": {
                                backgroundColor: chipBg,
                                borderColor: "#99f6e4",
                              },
                              "&.Mui-focused": {
                                backgroundColor: whiteBg,

                                boxShadow: "0 0 0 3px rgba(20, 184, 166, 0.1)",
                              },
                            },
                            "& .MuiInputLabel-root": {
                              color: "#64748b",
                              fontWeight: 500,
                              "&.Mui-focused": {
                                color: "#14b8a6",
                              },
                            },
                          }}
                        />
                      )}
                    />

                    <Autocomplete
                      fullWidth
                      options={degreeLevelsAutoComplete}
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
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "12px",
                              backgroundColor: inputBg,

                              transition: "all 0.2s ease-in-out",
                              "&:hover": {
                                backgroundColor: chipBg,
                                borderColor: "#99f6e4",
                              },
                              "&.Mui-focused": {
                                backgroundColor: whiteBg,

                                boxShadow: "0 0 0 3px rgba(20, 184, 166, 0.1)",
                              },
                            },
                            "& .MuiInputLabel-root": {
                              color: "#64748b",
                              fontWeight: 500,
                              "&.Mui-focused": {
                                color: "#14b8a6",
                              },
                            },
                          }}
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
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        backgroundColor: inputBg,

                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          backgroundColor: chipBg,
                          borderColor: "#99f6e4",
                        },
                        "&.Mui-focused": {
                          backgroundColor: whiteBg,

                          boxShadow: "0 0 0 3px rgba(20, 184, 166, 0.1)",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "#64748b",
                        fontWeight: 500,
                        "&.Mui-focused": {
                          color: "#14b8a6",
                        },
                      },
                    }}
                  />
                </Stack>
              </Box>

              {/* Time Information Section */}
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 3,
                    pb: 1,
                    borderBottom: "2px solid #f0fdfa",
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "10px",
                      background:
                        "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "18px",
                    }}
                  >
                    📅
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#0f766e",
                      fontWeight: 700,
                      fontSize: "1.25rem",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Thời gian
                  </Typography>
                </Box>
                <Box display="flex" gap={2}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Năm bắt đầu"
                    value={form.startYear || ""}
                    onChange={(e) => handleChange("startYear", +e.target.value)}
                    variant="outlined"
                    size="medium"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        backgroundColor: inputBg,

                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          backgroundColor: chipBg,
                          borderColor: "#99f6e4",
                        },
                        "&.Mui-focused": {
                          backgroundColor: whiteBg,

                          boxShadow: "0 0 0 3px rgba(20, 184, 166, 0.1)",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "#64748b",
                        fontWeight: 500,
                        "&.Mui-focused": {
                          color: "#14b8a6",
                        },
                      },
                    }}
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
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        backgroundColor: inputBg,
                        border: "2px solid transparent",
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          backgroundColor: chipBg,
                          borderColor: "#99f6e4",
                        },
                        "&.Mui-focused": {
                          backgroundColor: whiteBg,
      
                          boxShadow: "0 0 0 3px rgba(20, 184, 166, 0.1)",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "#64748b",
                        fontWeight: 500,
                        "&.Mui-focused": {
                          color: "#14b8a6",
                        },
                      },
                    }}
                  />
                </Box>
              </Box>

              {/* File Upload Section */}
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 3,
                    pb: 1,
                    borderBottom: "2px solid #f0fdfa",
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "10px",
                      background:
                        "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "18px",
                    }}
                  >
                    📎
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#0f766e",
                      fontWeight: 700,
                      fontSize: "1.25rem",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Tài liệu đính kèm
                  </Typography>
                </Box>

                {selectedFile && (
                  <Box
                    sx={{
                      mb: 3,
                      p: 2,
                      borderRadius: "12px",
                      backgroundColor: chipBg,
                      border: "2px solid #99f6e4",
                    }}
                  >
                    <Chip
                      icon={<AttachFile />}
                      label={selectedFile.name}
                      color="primary"
                      variant="filled"
                      sx={{
                        maxWidth: "100%",
                        height: "auto",
                        "& .MuiChip-label": {
                          display: "block",
                          whiteSpace: "normal",
                          wordBreak: "break-word",
                        },
                      }}
                    />
                  </Box>
                )}

                <Box display="flex" gap={2}>
                  <Button
                    variant="contained"
                    component="label"
                    fullWidth
                    disabled={isUploading}
                    startIcon={
                      isUploading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <CloudUpload />
                      )
                    }
                    sx={{
                      py: 2,
                      borderRadius: "12px",
                      background:
                        "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      textTransform: "none",
                      boxShadow: "0 4px 12px rgba(20, 184, 166, 0.3)",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
                        boxShadow: "0 6px 16px rgba(20, 184, 166, 0.4)",
                      },
                      "&:disabled": {
                        background: "#cbd5e1",
                        color: "#64748b",
                      },
                    }}
                  >
                    {isUploading ? "Đang tải lên..." : "Chọn và tải lên file bằng cấp"}
                    <input type="file" hidden onChange={handleFileChange} />
                  </Button>
                </Box>

                {form.url && (
                  <Box
                    sx={{
                      mt: 3,
                      p: 2,
                      borderRadius: "12px",
                      backgroundColor: chipBg,
                      border: "2px solid #86efac",
                    }}
                  >
                    <Chip
                      icon={<CloudUpload />}
                      label="File đã được tải lên thành công"
                      color="success"
                      variant="filled"
                      sx={{
                        fontSize: "0.95rem",
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                )}
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
                    borderBottom: "2px solid #f0fdfa",
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "10px",
                      background:
                        "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "18px",
                    }}
                  >
                    📝
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#0f766e",
                      fontWeight: 700,
                      fontSize: "1.25rem",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Mô tả bổ sung
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  label="Thông tin bổ sung về bằng cấp"
                  multiline
                  rows={4}
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  variant="outlined"
                  placeholder="Nhập mô tả chi tiết về bằng cấp, thành tích đạt được..."
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      backgroundColor: inputBg,

                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        backgroundColor: chipBg,
                        borderColor: "#99f6e4",
                      },
                      "&.Mui-focused": {
                        backgroundColor: whiteBg,

                        boxShadow: "0 0 0 3px rgba(20, 184, 166, 0.1)",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#64748b",
                      fontWeight: 500,
                      "&.Mui-focused": {
                        color: "#14b8a6",
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
            backgroundColor: whiteBg,
            borderTop: `2px solid ${footerBorder}`,
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
                "linear-gradient(135deg, #14b8a6 0%, #0d9488 50%, #0f766e 100%)",
              fontWeight: 700,
              fontSize: {
                xs: "0.875rem", // Mobile: smaller font
                md: "1rem", // Desktop: normal font
              },
              textTransform: "none",
              letterSpacing: "-0.01em",
              boxShadow: "0 8px 20px rgba(20, 184, 166, 0.3)",
              "&:hover": {
                background:
                  "linear-gradient(135deg, #0d9488 0%, #0f766e 50%, #115e59 100%)",
                boxShadow: "0 12px 28px rgba(20, 184, 166, 0.4)",
                transform: {
                  xs: "none", // Mobile: no transform to avoid layout issues
                  md: "translateY(-2px)", // Desktop: hover effect
                },
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            {editMode ? "Cập nhật bằng cấp" : "Lưu bằng cấp"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateDegreeModal;
