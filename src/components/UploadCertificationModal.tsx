import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Modal,
  Chip,
  Autocomplete,
} from "@mui/material";
import {
  CloudUpload,
  Assignment,
  AttachFile,
  CalendarToday,
  Business,
  Close,
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
      setForm({
        ...editData,
        issueDate: editData.issueDate
          ? new Date(editData.issueDate)
          : new Date(),
        expiryDate: editData.expiryDate ? new Date(editData.expiryDate) : null,
      });
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
      <Box sx={style}>
        {/* Modern Header with Gradient */}
        <Box
          sx={{
            position: "relative",
            background:
              "linear-gradient(135deg, #06b6d4 0%, #0891b2 50%, #0e7490 100%)",
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
                <Assignment
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
                  {editMode ? "Chỉnh sửa chứng chỉ" : "Thêm chứng chỉ mới"}
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
                    ? "Cập nhật thông tin chứng chỉ của bạn"
                    : "Nhập thông tin chi tiết về chứng chỉ của bạn"}
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
              backgroundColor: "#06b6d4",
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
                    borderBottom: "2px solid #ecfeff",
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
                        "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
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
                      color: "#0e7490",
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
                    label="Mã tham chiếu"
                    value={form.referenceId}
                    onChange={(e) =>
                      handleChange("referenceId", e.target.value)
                    }
                    variant="outlined"
                    size="medium"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: {
                          xs: "8px", // Mobile: smaller radius
                          md: "12px", // Desktop: larger radius
                        },
                        backgroundColor: "#f8fafc",
                        border: "2px solid transparent",
                        transition: "all 0.2s ease-in-out",
                        fontSize: {
                          xs: "0.875rem", // Mobile: smaller font
                          md: "1rem", // Desktop: normal font
                        },
                        "&:hover": {
                          backgroundColor: "#ecfeff",
                          borderColor: "#67e8f9",
                        },
                        "&.Mui-focused": {
                          backgroundColor: "#ffffff",
                          borderColor: "#06b6d4",
                          boxShadow: "0 0 0 3px rgba(6, 182, 212, 0.1)",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "#64748b",
                        fontWeight: 500,
                        fontSize: {
                          xs: "0.875rem", // Mobile: smaller label
                          md: "1rem", // Desktop: normal label
                        },
                        "&.Mui-focused": {
                          color: "#06b6d4",
                        },
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Tên chứng chỉ"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    variant="outlined"
                    size="medium"
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: {
                          xs: "8px",
                          md: "12px",
                        },
                        backgroundColor: "#f8fafc",
                        border: "2px solid transparent",
                        transition: "all 0.2s ease-in-out",
                        fontSize: {
                          xs: "0.875rem",
                          md: "1rem",
                        },
                        "&:hover": {
                          backgroundColor: "#ecfeff",
                          borderColor: "#67e8f9",
                        },
                        "&.Mui-focused": {
                          backgroundColor: "#ffffff",
                          borderColor: "#06b6d4",
                          boxShadow: "0 0 0 3px rgba(6, 182, 212, 0.1)",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "#64748b",
                        fontWeight: 500,
                        fontSize: {
                          xs: "0.875rem",
                          md: "1rem",
                        },
                        "&.Mui-focused": {
                          color: "#06b6d4",
                        },
                      },
                    }}
                  />

                  <Box
                    display="flex"
                    gap={{
                      xs: 1, // Mobile: smaller gap
                      md: 2, // Desktop: larger gap
                    }}
                    flexDirection={{
                      xs: "column", // Mobile: stack vertically
                      sm: "row", // Tablet and up: horizontal
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Cơ quan cấp"
                      value={form.issuedBy}
                      onChange={(e) => handleChange("issuedBy", e.target.value)}
                      variant="outlined"
                      size="medium"
                      InputProps={{
                        startAdornment: (
                          <Business sx={{ mr: 1, color: "#64748b" }} />
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          backgroundColor: "#f8fafc",
                          border: "2px solid transparent",
                          transition: "all 0.2s ease-in-out",
                          "&:hover": {
                            backgroundColor: "#ecfeff",
                            borderColor: "#67e8f9",
                          },
                          "&.Mui-focused": {
                            backgroundColor: "#ffffff",
                            borderColor: "#06b6d4",
                            boxShadow: "0 0 0 3px rgba(6, 182, 212, 0.1)",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "#64748b",
                          fontWeight: 500,
                          "&.Mui-focused": {
                            color: "#06b6d4",
                          },
                        },
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
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "12px",
                              backgroundColor: "#f8fafc",
                              border: "2px solid transparent",
                              transition: "all 0.2s ease-in-out",
                              "&:hover": {
                                backgroundColor: "#ecfeff",
                                borderColor: "#67e8f9",
                              },
                              "&.Mui-focused": {
                                backgroundColor: "#ffffff",
                                borderColor: "#06b6d4",
                                boxShadow: "0 0 0 3px rgba(6, 182, 212, 0.1)",
                              },
                            },
                            "& .MuiInputLabel-root": {
                              color: "#64748b",
                              fontWeight: 500,
                              "&.Mui-focused": {
                                color: "#06b6d4",
                              },
                            },
                          }}
                        />
                      )}
                    />
                  </Box>
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
                    borderBottom: "2px solid #ecfeff",
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "10px",
                      background:
                        "linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)",
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
                      color: "#0e7490",
                      fontWeight: 700,
                      fontSize: "1.25rem",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Thời gian hiệu lực
                  </Typography>
                </Box>
                <Box display="flex" gap={2}>
                  {/* Ngày cấp - không cho xóa */}
                  <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    adapterLocale={vi}
                  >
                    <DatePicker
                      label="Ngày cấp "
                      value={form.issueDate}
                      onChange={(newValue) =>
                        handleChange("issueDate", newValue)
                      }
                      slotProps={{
                        field: { clearable: true }, // Cho phép nút xóa
                        textField: {
                          fullWidth: true,
                          variant: "outlined",
                          size: "medium",
                          sx: {
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "12px",
                              backgroundColor: "#f8fafc",
                              border: "2px solid transparent",
                              transition: "all 0.2s ease-in-out",
                              "&:hover": {
                                backgroundColor: "#ecfeff",
                                borderColor: "#67e8f9",
                              },
                              "&.Mui-focused": {
                                backgroundColor: "#ffffff",
                                borderColor: "#06b6d4",
                                boxShadow: "0 0 0 3px rgba(6, 182, 212, 0.1)",
                              },
                            },
                            "& .MuiInputLabel-root": {
                              color: "#64748b",
                              fontWeight: 500,
                              "&.Mui-focused": {
                                color: "#06b6d4",
                              },
                            },
                          },
                          InputProps: {
                            startAdornment: (
                              <CalendarToday sx={{ mr: 1, color: "#64748b" }} />
                            ),
                          },
                        },
                      }}
                    />
                  </LocalizationProvider>

                  {/* Ngày hết hạn - cho phép null */}
                  <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    adapterLocale={vi}
                  >
                    <DatePicker
                      label="Ngày hết hạn (Không bắt buộc)"
                      value={form.expiryDate}
                      onChange={(newValue) =>
                        handleChange("expiryDate", newValue)
                      }
                      slotProps={{
                        field: { clearable: true }, // Cho phép nút xóa
                        textField: {
                          fullWidth: true,
                          variant: "outlined",
                          size: "medium",
                          sx: {
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "12px",
                              backgroundColor: "#f8fafc",
                              border: "2px solid transparent",
                              transition: "all 0.2s ease-in-out",
                              "&:hover": {
                                backgroundColor: "#ecfeff",
                                borderColor: "#67e8f9",
                              },
                              "&.Mui-focused": {
                                backgroundColor: "#ffffff",
                                borderColor: "#06b6d4",
                                boxShadow: "0 0 0 3px rgba(6, 182, 212, 0.1)",
                              },
                            },
                            "& .MuiInputLabel-root": {
                              color: "#64748b",
                              fontWeight: 500,
                              "&.Mui-focused": {
                                color: "#06b6d4",
                              },
                            },
                          },
                          InputProps: {
                            startAdornment: (
                              <CalendarToday sx={{ mr: 1, color: "#64748b" }} />
                            ),
                          },
                        },
                      }}
                    />
                  </LocalizationProvider>
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
                    borderBottom: "2px solid #ecfeff",
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
                      color: "#0e7490",
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
                      backgroundColor: "#ecfeff",
                      border: "2px solid #67e8f9",
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
                    variant="outlined"
                    component="label"
                    fullWidth
                    startIcon={<AttachFile />}
                    sx={{
                      py: 2,
                      borderRadius: "12px",
                      borderWidth: "2px",
                      borderColor: "#06b6d4",
                      color: "#0e7490",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      textTransform: "none",
                      "&:hover": {
                        borderWidth: "2px",
                        borderColor: "#0891b2",
                        backgroundColor: "#ecfeff",
                      },
                    }}
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
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <CloudUpload />
                      )
                    }
                    sx={{
                      py: 2,
                      borderRadius: "12px",
                      background:
                        "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      textTransform: "none",
                      boxShadow: "0 4px 12px rgba(6, 182, 212, 0.3)",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #0891b2 0%, #0e7490 100%)",
                        boxShadow: "0 6px 16px rgba(6, 182, 212, 0.4)",
                      },
                      "&:disabled": {
                        background: "#cbd5e1",
                        color: "#64748b",
                      },
                    }}
                  >
                    {isUploading ? "Đang tải lên..." : "Tải lên"}
                  </Button>
                </Box>

                {form.certificateUrl && (
                  <Box
                    sx={{
                      mt: 3,
                      p: 2,
                      borderRadius: "12px",
                      backgroundColor: "#ecfdf5",
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
                    borderBottom: "2px solid #ecfeff",
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
                      color: "#0e7490",
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
                  label="Thông tin bổ sung về chứng chỉ"
                  multiline
                  rows={4}
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  variant="outlined"
                  placeholder="Nhập mô tả chi tiết về chứng chỉ, lĩnh vực áp dụng..."
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      backgroundColor: "#f8fafc",
                      border: "2px solid transparent",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        backgroundColor: "#ecfeff",
                        borderColor: "#67e8f9",
                      },
                      "&.Mui-focused": {
                        backgroundColor: "#ffffff",
                        borderColor: "#06b6d4",
                        boxShadow: "0 0 0 3px rgba(6, 182, 212, 0.1)",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#64748b",
                      fontWeight: 500,
                      "&.Mui-focused": {
                        color: "#06b6d4",
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
            borderTop: "2px solid #ecfeff",
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
                "linear-gradient(135deg, #06b6d4 0%, #0891b2 50%, #0e7490 100%)",
              fontWeight: 700,
              fontSize: {
                xs: "0.875rem", // Mobile: smaller font
                md: "1rem", // Desktop: normal font
              },
              textTransform: "none",
              letterSpacing: "-0.01em",
              boxShadow: "0 8px 20px rgba(6, 182, 212, 0.3)",
              "&:hover": {
                background:
                  "linear-gradient(135deg, #0891b2 0%, #0e7490 50%, #155e75 100%)",
                boxShadow: "0 12px 28px rgba(6, 182, 212, 0.4)",
                transform: {
                  xs: "none", // Mobile: no transform to avoid layout issues
                  md: "translateY(-2px)", // Desktop: hover effect
                },
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            {editMode ? "Cập nhật chứng chỉ" : "Lưu chứng chỉ"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default UploadCertificationModal;
