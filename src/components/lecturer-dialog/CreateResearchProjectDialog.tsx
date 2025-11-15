import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import {
  Close,
  Science,
  CalendarToday,
  AttachMoney,
} from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { toast } from "react-toastify";
import { validateResearchProjectForm } from "../../utils/Validate";
import { projectTypes, scales } from "../../utils/DropdownOption";
import { getProjectType, getScale } from "../../utils/ChangeText";
import type {
  ResearchProject,
  ResearchProjectCreateReq,
} from "../../types/ResearchProject";
import {
  industriesAutoComplete,
  researchProjectStatusAutoComplete,
} from "../../utils/AutoComplete";

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
    "0 20px 60px rgba(19, 111, 180, 0.15), 0 10px 30px rgba(0, 0, 0, 0.08)",
  outline: "none",
  border: "1px solid rgba(19, 111, 180, 0.08)",
  mx: {
    xs: 1, // Mobile: margin on sides
    sm: 2, // Tablet: more margin
    md: 0, // Desktop: no margin needed
  },
};

interface CreateResearchProjectDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (project: ResearchProject) => void;
  editMode?: boolean;
  editData?: ResearchProject;
}

const CreateResearchProjectDialog: React.FC<
  CreateResearchProjectDialogProps
> = ({ open, onClose, onSubmit, editMode = false, editData }) => {
  const theme = useTheme();
  const isDark = theme?.palette?.mode === "dark";
  const whiteBg = isDark ? "#0E1D2C" : "#ffffff";
  const translucentWhite = isDark ? "rgba(14,29,44,0.15)" : "rgba(255,255,255,0.15)";
  const [form, setForm] = useState<ResearchProject>({
    id: "",
    title: "",
    researchArea: "",
    scale: "OTHERS",
    startDate: "",
    endDate: "",
    foundingAmount: 0,
    foundingSource: "",
    projectType: "",
    roleInProject: "",
    publishedUrl: "",
    courseStatus: "",
    description: "",

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
        researchArea: "",
        scale: "OTHERS",
        startDate: "",
        endDate: "",
        foundingAmount: 0,
        foundingSource: "",
        projectType: "",
        roleInProject: "",
        publishedUrl: "",
        courseStatus: "",
        description: "",
        status: "",
        adminNote: "",
        createdAt: "",
        updatedAt: "",
      });
    } else if (editMode && editData) {
      // Pre-fill form with edit data
      setForm({
        id: editData.id,
        title: editData.title,
        researchArea: editData.researchArea,
        scale: editData.scale,
        startDate: editData.startDate,
        endDate: editData.endDate,
        foundingAmount: editData.foundingAmount,
        foundingSource: editData.foundingSource,
        projectType: editData.projectType,
        roleInProject: editData.roleInProject,
        publishedUrl: editData.publishedUrl,
        courseStatus: editData.courseStatus,
        description: editData.description,
        status: editData.status,
        adminNote: editData.adminNote,
        createdAt: editData.createdAt,
        updatedAt: editData.updatedAt,
      });
    }
  }, [open, editMode, editData]);

  const handleChange = (
    field: keyof ResearchProjectCreateReq,
    value: string | number,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const isValid = validateResearchProjectForm(form);
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
          backgroundColor: "rgba(19, 111, 180, 0.4)",
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
              "linear-gradient(135deg, #0284c7 0%, #0369a1 50%, #075985 100%)",
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
                xs: 8,
                md: 12,
              },
              right: {
                xs: 8,
                md: 12,
              },
              zIndex: 10,
              minWidth: "auto",
              width: {
                xs: 32,
                md: 40,
              },
              height: {
                xs: 32,
                md: 40,
              },
              borderRadius: "50%",
              backgroundColor: isDark ? translucentWhite : "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(10px)",
              color: "white",
              "&:hover": {
                backgroundColor: isDark ? "rgba(14,29,44,0.25)" : "rgba(255, 255, 255, 0.25)",
                transform: "scale(1.05)",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            <Close
              sx={{
                fontSize: {
                  xs: 18,
                  md: 20,
                },
              }}
            />
          </Button>

          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                <Box
                sx={{
                  p: {
                    xs: 1,
                    md: 1.5,
                  },
                  borderRadius: {
                    xs: "8px",
                    md: "12px",
                  },
                  backgroundColor: isDark ? translucentWhite : "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <Science
                  sx={{
                    fontSize: {
                      xs: 24,
                      md: 28,
                    },
                    color: "white",
                  }}
                />
              </Box>
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: {
                      xs: "1.25rem",
                      md: "1.5rem",
                    },
                    fontWeight: 700,
                    mb: 0.5,
                  }}
                >
                  {editMode
                    ? "Chỉnh sửa dự án nghiên cứu"
                    : "Thêm dự án nghiên cứu mới"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.9,
                    fontSize: {
                      xs: "0.875rem",
                      md: "0.95rem",
                    },
                  }}
                >
                  {editMode
                    ? "Cập nhật thông tin dự án nghiên cứu khoa học"
                    : "Thêm thông tin về dự án nghiên cứu khoa học bạn đã tham gia"}
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
              backgroundColor: isDark ? "#0E1D2C" : "#f1f5f9",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#0284c7",
              borderRadius: "3px",
            },
          }}
        >
          <Box
            sx={{
              p: {
                xs: 2,
                sm: 3,
                md: 4,
              },
              pt: {
                xs: 2,
                md: 3,
              },
            }}
          >
            {/* Form Content */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "1fr 1fr",
                },
                gap: 3,
              }}
            >
              {/* Basic Information Section */}
              <Box sx={{ gridColumn: "1 / -1" }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    color: "#0369a1",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Science sx={{ fontSize: 20 }} />
                  Thông tin cơ bản
                </Typography>
              </Box>

              {/* Title */}
              <Box sx={{ gridColumn: "1 / -1" }}>
                <TextField
                  fullWidth
                  label="Tên dự án nghiên cứu"
                  value={form.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  variant="outlined"
                  required
                  placeholder="Nhập tên dự án nghiên cứu"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </Box>

              {/* Research Area and Project Type */}
              <Box>
                <Autocomplete
                  fullWidth
                  options={industriesAutoComplete}
                  value={form.researchArea}
                  onChange={(_, newValue) =>
                    handleChange("researchArea", newValue || "")
                  }
                  freeSolo
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Lĩnh vực nghiên cứu"
                      variant="outlined"
                      required
                      placeholder="Chọn hoặc nhập lĩnh vực nghiên cứu..."
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                        },
                      }}
                    />
                  )}
                />
              </Box>

              <Box>
                <FormControl fullWidth>
                  <InputLabel>Loại dự án</InputLabel>
                  <Select
                    value={form.projectType}
                    onChange={(e) =>
                      handleChange("projectType", e.target.value)
                    }
                    label="Loại dự án"
                    sx={{
                      borderRadius: "12px",
                    }}
                  >
                    {projectTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {getProjectType(type)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Scale and Role */}
              <Box>
                <FormControl fullWidth>
                  <InputLabel>Quy mô dự án</InputLabel>
                  <Select
                    value={form.scale}
                    onChange={(e) => handleChange("scale", e.target.value)}
                    label="Quy mô dự án"
                    sx={{
                      borderRadius: "12px",
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

              <Box>
                <TextField
                  fullWidth
                  label="Vai trò trong dự án"
                  value={form.roleInProject}
                  onChange={(e) =>
                    handleChange("roleInProject", e.target.value)
                  }
                  variant="outlined"
                  placeholder="Ví dụ: Chủ nhiệm, Thành viên, Thư ký..."
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </Box>

              {/* Time and Funding Section */}
              <Box sx={{ gridColumn: "1 / -1" }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    mt: 2,
                    color: "#0369a1",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <CalendarToday sx={{ fontSize: 20 }} />
                  Thời gian và tài trợ
                </Typography>
              </Box>

              {/* Start Date and End Date */}
              <Box>
                <TextField
                  fullWidth
                  label="Ngày bắt đầu"
                  type="date"
                  value={form.startDate}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </Box>

              <Box>
                <TextField
                  fullWidth
                  label="Ngày kết thúc"
                  type="date"
                  value={form.endDate}
                  onChange={(e) => handleChange("endDate", e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </Box>

              {/* Funding Amount and Source */}
              <Box>
                <TextField
                  fullWidth
                  label="Kinh phí tài trợ (VNĐ)"
                  type="number"
                  value={form.foundingAmount}
                  onChange={(e) =>
                    handleChange("foundingAmount", Number(e.target.value))
                  }
                  variant="outlined"
                  placeholder="0"
                  InputProps={{
                    startAdornment: (
                      <AttachMoney sx={{ color: "#0369a1", mr: 1 }} />
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </Box>

              <Box>
                <TextField
                  fullWidth
                  label="Nguồn tài trợ"
                  value={form.foundingSource}
                  onChange={(e) =>
                    handleChange("foundingSource", e.target.value)
                  }
                  variant="outlined"
                  placeholder="Ví dụ: NAFOSTED, Đại học, Công ty..."
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </Box>

              {/* Additional Information */}
              <Box>
                <FormControl fullWidth>
                  <InputLabel>Trạng thái dự án</InputLabel>
                  <Select
                    value={form.courseStatus}
                    onChange={(e) =>
                      handleChange("courseStatus", e.target.value)
                    }
                    label="Trạng thái dự án"
                    sx={{
                      borderRadius: "12px",
                    }}
                  >
                    {researchProjectStatusAutoComplete.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box>
                <TextField
                  fullWidth
                  label="URL công bố"
                  value={form.publishedUrl}
                  onChange={(e) => handleChange("publishedUrl", e.target.value)}
                  variant="outlined"
                  placeholder="https://..."
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </Box>

              {/* Description */}
              <Box sx={{ gridColumn: "1 / -1" }}>
                <TextField
                  fullWidth
                  label="Mô tả dự án"
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  variant="outlined"
                  multiline
                  rows={4}
                  placeholder="Mô tả chi tiết về dự án nghiên cứu, mục tiêu, phương pháp thực hiện..."
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </Box>
            </Box>
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
            backgroundColor: isDark ? whiteBg : "#f8fafc",
            borderTop: isDark ? "2px solid rgba(255,255,255,0.04)" : "2px solid #f3f4f6",
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
                xs: "100%",
                sm: 140,
              },
              py: {
                xs: 1.25,
                md: 1.5,
              },
              borderRadius: {
                xs: "8px",
                md: "12px",
              },
              borderWidth: "2px",
              borderColor: "#cbd5e1",
              color: "#64748b",
              fontWeight: 600,
              fontSize: {
                xs: "0.875rem",
                md: "1rem",
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
                xs: "100%",
                sm: 180,
              },
              py: {
                xs: 1.25,
                md: 1.5,
              },
              borderRadius: {
                xs: "8px",
                md: "12px",
              },
              background:
                "linear-gradient(135deg, #0284c7 0%, #0369a1 50%, #075985 100%)",
              color: "white",
              fontWeight: 700,
              fontSize: {
                xs: "0.875rem",
                md: "1rem",
              },
              textTransform: "none",
              boxShadow: "0 4px 12px rgba(2, 132, 199, 0.3)",
              "&:hover": {
                background:
                  "linear-gradient(135deg, #0369a1 0%, #075985 50%, #0c4a6e 100%)",
                boxShadow: "0 6px 20px rgba(2, 132, 199, 0.4)",
                transform: "translateY(-1px)",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            {editMode ? "Cập nhật dự án" : "Thêm dự án"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateResearchProjectDialog;
