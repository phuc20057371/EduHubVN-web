import {
  Add as AddIcon,
  Clear as ClearIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
  Search as SearchIcon,
  Work as WorkIcon,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { updateCourseMembers } from "../../../redux/slice/CourseSilce";
import { API } from "../../../utils/Fetch";

interface CourseMemberDialogProps {
  open: boolean;
  onClose: () => void;
  course?: any;
  members?: any[]; // Add members prop
  showSearch?: boolean;
  onMemberRoleChange?: (updatedMembers: any[]) => void;
  canEdit?: boolean; // Add permission prop
}

const CourseMemberDialog: React.FC<CourseMemberDialogProps> = ({
  open,
  onClose,
  course,
  members, // Extract members from props
  onMemberRoleChange,
  canEdit = true, // Default to true for backward compatibility
}) => {
  const [localMembers, setLocalMembers] = useState(members || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [defaultNewRole, setDefaultNewRole] = useState("ASSIGNED");
  const [selectedAcademicRank, setSelectedAcademicRank] = useState(""); // Add academic rank filter state

  const lecturers = useSelector((state: any) => state.lecturer || []);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();

  useEffect(() => {
    setLocalMembers(members || []);
  }, [members]);

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "AUTHOR":
        return "Tác giả";
      case "ASSIGNED":
        return "Được phân công";
      case "ASSISTANT":
        return "Trợ giảng";
      default:
        return role;
    }
  };

  const getRoleOptions = () => [
    { value: "ASSIGNED", label: "Được phân công" },
    { value: "ASSISTANT", label: "Trợ giảng" },
  ];

  const getAcademicRankLabel = (rank: string) => {
    switch (rank) {
      case "CN":
        return "Cử nhân";
      case "THS":
        return "Thạc sĩ";
      case "TS":
        return "Tiến sĩ";
      case "PGS":
        return "Phó giáo sư";
      case "GS":
        return "Giáo sư";
      default:
        return rank;
    }
  };

  const getAcademicRankOptions = () => [
    { value: "", label: "Tất cả học hàm" },
    { value: "CN", label: "Cử nhân" },
    { value: "THS", label: "Thạc sĩ" },
    { value: "TS", label: "Tiến sĩ" },
    { value: "PGS", label: "Phó giáo sư" },
    { value: "GS", label: "Giáo sư" },
  ];

  // Get member IDs for filtering
  const memberIds = useMemo(() => {
    return new Set(localMembers?.map((member) => member?.lecturer?.id) || []);
  }, [localMembers]);

  // Filter lecturers based on search term and exclude existing members
  const filteredLecturers = useMemo(() => {
    let filtered = lecturers.filter(
      (lecturer: any) =>
        lecturer.status === "APPROVED" && !memberIds.has(lecturer.id),
    );

    // Filter by academic rank if selected
    if (selectedAcademicRank) {
      filtered = filtered.filter(
        (lecturer: any) => lecturer.academicRank === selectedAcademicRank,
      );
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (lecturer: any) =>
          lecturer.fullName?.toLowerCase().includes(searchLower) ||
          lecturer.specialization?.toLowerCase().includes(searchLower) ||
          lecturer.jobField?.toLowerCase().includes(searchLower) ||
          lecturer.email?.toLowerCase().includes(searchLower) ||
          lecturer.phoneNumber?.includes(searchTerm),
      );
    }

    return filtered.slice(0, 20); // Increase to 20 results to better test scrolling
  }, [lecturers, searchTerm, memberIds, selectedAcademicRank]);

  const handleRoleChange = (memberId: number, newRole: string) => {
    // Find and update the member in the localMembers array
    const updatedMembers = localMembers.map((member) => {
      if (member.lecturer.id === memberId) {
        return {
          ...member,
          courseRole: newRole,
        };
      }
      return member;
    });

    // Update local state
    setLocalMembers(updatedMembers);

    // Call the parent callback to update the state
    if (onMemberRoleChange) {
      onMemberRoleChange(updatedMembers);
    }
  };

  const handleDeleteMember = (memberId: string) => {
    const updatedMembers = localMembers.filter(
      (member) => member.lecturer.id !== memberId,
    );

    // Update local state
    setLocalMembers(updatedMembers);

    // Call the parent callback to update the state
    if (onMemberRoleChange) {
      onMemberRoleChange(updatedMembers);
    }
  };

  const handleSaveMembers = async () => {
    const courseRequest = {
      course: course,
      members: localMembers,
    };
    try {
      const response = await API.admin.updateCourseMember(courseRequest);
      if (response.data) {
        dispatch(
          updateCourseMembers({
            courseId: course.id,
            members: response.data.data.members,
          }),
        );
      }
      toast.success("Lưu giảng viên thành công.");
    } catch (error) {
      console.error("Error saving course members:", error);
      toast.error("Lỗi khi lưu giảng viên. Vui lòng thử lại sau.");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={isSmallMobile ? "xs" : isMobile ? "md" : canEdit ? "lg" : "md"}
      fullWidth
      fullScreen={isSmallMobile}
      PaperProps={{
        sx: {
          height: isSmallMobile ? "100vh" : isMobile ? "95vh" : "90vh",
          maxHeight: isSmallMobile ? "100vh" : isMobile ? "95vh" : "90vh",
          borderRadius: isSmallMobile ? 0 : 1,
          boxShadow: isSmallMobile
            ? "none"
            : "0 24px 38px 3px rgba(0,0,0,0.14)",
          margin: isSmallMobile ? 0 : isMobile ? 1 : 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
          p: { xs: 2, sm: 3 },
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
          },
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          spacing={{ xs: 2, sm: 2 }}
          sx={{ position: "relative", zIndex: 1 }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={{ xs: 1, sm: 2 }}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            <Avatar
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                width: { xs: 40, sm: 48 },
                height: { xs: 40, sm: 48 },
              }}
            >
              <SchoolIcon
                sx={{ color: "white", fontSize: { xs: 20, sm: 24 } }}
              />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant={isSmallMobile ? "h6" : isMobile ? "h6" : "h5"}
                sx={{
                  fontWeight: 700,
                  mb: { xs: 0.5, sm: 0.5 },
                  fontSize: { xs: "1.1rem", sm: "1.25rem", md: "1.5rem" },
                }}
              >
                Quản lý thành viên
              </Typography>
              {course && (
                <>
                  <Typography
                    variant="body2"
                    sx={{
                      opacity: 0.9,
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      wordBreak: "break-word",
                    }}
                  >
                    {course.title || `Khóa học ID: ${course.id}`}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      opacity: 0.9,
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      wordBreak: "break-word",
                    }}
                  >
                    ID: {course.id || `Khóa học ID: ${course.id}`}
                    <Tooltip title="Sao chép ID">
                      <IconButton
                        size="small"
                        onClick={() => {
                          navigator.clipboard.writeText(course.id);
                        }}
                      >
                        <ContentCopyIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  </Typography>
                </>
              )}
            </Box>
          </Stack>

         
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              right: { xs: 4, sm: 8 },
              top: { xs: 4, sm: 8 },
              color: "rgba(255,255,255,0.8)",
              bgcolor: "rgba(255,255,255,0.1)",
              width: { xs: 36, sm: 40 },
              height: { xs: 36, sm: 40 },
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.2)",
                color: "white",
              },
            }}
          >
            <CloseIcon fontSize={isSmallMobile ? "small" : "medium"} />
          </IconButton>

          {isSmallMobile && (
            <IconButton
              onClick={onClose}
              sx={{
                position: "absolute",
                right: { xs: 4, sm: 8 },
                top: { xs: 4, sm: 8 },
                color: "rgba(255,255,255,0.8)",
                bgcolor: "rgba(255,255,255,0.1)",
                width: { xs: 36, sm: 40 },
                height: { xs: 36, sm: 40 },
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.2)",
                },
              }}
            >
              <CloseIcon fontSize={isSmallMobile ? "small" : "medium"} />
            </IconButton>
          )}
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ p: 0, height: "100%", bgcolor: "grey.50" }}>
        <Stack
          direction={{ xs: "column", lg: "row" }}
          sx={{
            height: "100%",
            minHeight: { xs: "auto", lg: "500px" },
          }}
        >
          {/* Left side - Current Members */}
          <Box
            sx={{
              flex: 1,
              p: { xs: 2, sm: 3 },
              height: { xs: isSmallMobile ? "50vh" : "45vh", lg: "100%" },
              borderRight: { lg: 1 },
              borderBottom: { xs: 1, lg: 0 },
              borderColor: "divider",
              bgcolor: "white",
            }}
          >
            <Stack spacing={{ xs: 2, sm: 3 }}>
              <Box>
                <Typography
                  variant={isMobile ? "subtitle1" : "h6"}
                  sx={{
                    fontWeight: 700,
                    color: "text.primary",
                    mb: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
                  }}
                >
                  <PersonIcon
                    color="primary"
                    sx={{ fontSize: { xs: 18, sm: 20, md: 24 } }}
                  />
                  Danh sách Giảng viên
                  <Chip
                    label={localMembers?.length || 0}
                    size="small"
                    color="primary"
                    sx={{
                      ml: 1,
                      fontSize: { xs: "0.7rem", sm: "0.75rem" },
                      height: { xs: 20, sm: 24 },
                    }}
                  />
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                >
                  Quản lý vai trò và thông tin giảng viên trong khóa học
                </Typography>
              </Box>

              {localMembers &&
              Array.isArray(localMembers) &&
              localMembers.length > 0 ? (
                <Box
                  sx={{
                    height: {
                      xs: "calc(100% - 80px)",
                      sm: "calc(100% - 100px)",
                    },
                    overflow: "auto",
                    "&::-webkit-scrollbar": {
                      width: { xs: "6px", sm: "8px" },
                    },
                    "&::-webkit-scrollbar-track": {
                      bgcolor: "grey.100",
                      borderRadius: 1,
                    },
                    "&::-webkit-scrollbar-thumb": {
                      bgcolor: "grey.400",
                      borderRadius: 1,
                      "&:hover": {
                        bgcolor: "grey.600",
                      },
                    },
                  }}
                >
                  <Stack spacing={{ xs: 1.5, sm: 2 }}>
                    {localMembers.map((member, index) => (
                      <Fade
                        in={true}
                        timeout={300 + index * 100}
                        key={member?.lecturer?.id || index}
                      >
                        <Card
                          variant="outlined"
                          sx={{
                            transition: "all 0.3s ease",
                            "&:hover": {
                              boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                              transform: "translateY(-2px)",
                            },
                            border: "1px solid",
                            borderColor: "divider",
                          }}
                        >
                          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                            <Stack
                              direction={{ xs: "column", sm: "row" }}
                              spacing={{ xs: 2, sm: 3 }}
                            >
                              <Avatar
                                src={member?.lecturer?.avatarUrl}
                                alt={member?.lecturer?.fullName || "Giảng viên"}
                                sx={{
                                  width: { xs: 48, sm: 64 },
                                  height: { xs: 48, sm: 64 },
                                  border: "3px solid",
                                  borderColor: "primary.light",
                                  boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                                  alignSelf: { xs: "center", sm: "flex-start" },
                                }}
                              >
                                {member?.lecturer?.fullName?.charAt(0) || "?"}
                              </Avatar>

                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Stack
                                  direction={{ xs: "column", sm: "row" }}
                                  justifyContent="space-between"
                                  alignItems={{
                                    xs: "flex-start",
                                    sm: "flex-start",
                                  }}
                                  spacing={2}
                                  sx={{ mb: { xs: 1.5, sm: 2 } }}
                                >
                                  <Stack
                                    direction={{ xs: "column", sm: "row" }}
                                    alignItems={{
                                      xs: "flex-start",
                                      sm: "center",
                                    }}
                                    spacing={1}
                                    flexWrap="wrap"
                                  >
                                    <Typography
                                      variant={isMobile ? "subtitle1" : "h6"}
                                      sx={{
                                        fontWeight: 600,
                                        color: "text.primary",
                                        fontSize: {
                                          xs: "0.9rem",
                                          sm: "1rem",
                                          md: "1.25rem",
                                        },
                                        wordBreak: "break-word",
                                      }}
                                    >
                                      {member?.lecturer?.fullName ||
                                        "Không có tên"}
                                    </Typography>
                                    <Chip
                                      label={getAcademicRankLabel(
                                        member?.lecturer?.academicRank || "",
                                      )}
                                      size="small"
                                      variant="filled"
                                      color="secondary"
                                      sx={{
                                        fontWeight: 500,
                                        fontSize: {
                                          xs: "0.65rem",
                                          sm: "0.75rem",
                                        },
                                        height: { xs: 18, sm: 24 },
                                      }}
                                    />
                                  </Stack>

                                  {/* Role Management */}
                                  {member?.courseRole === "AUTHOR" ? (
                                    <Tooltip title="Tác giả không thể thay đổi vai trò">
                                      <Chip
                                        label={getRoleLabel("AUTHOR")}
                                        color="primary"
                                        icon={
                                          <LockIcon
                                            sx={{
                                              fontSize: { xs: 14, sm: 16 },
                                            }}
                                          />
                                        }
                                        size={
                                          isSmallMobile ? "small" : "medium"
                                        }
                                        sx={{
                                          fontWeight: 600,
                                          fontSize: {
                                            xs: "0.7rem",
                                            sm: "0.875rem",
                                          },
                                          "& .MuiChip-icon": {
                                            fontSize: {
                                              xs: "14px",
                                              sm: "16px",
                                            },
                                          },
                                        }}
                                      />
                                    </Tooltip>
                                  ) : (
                                    <Stack
                                      direction={{ xs: "column", sm: "row" }}
                                      alignItems={{
                                        xs: "stretch",
                                        sm: "center",
                                      }}
                                      spacing={1}
                                      sx={{ width: { xs: "100%", sm: "auto" } }}
                                    >
                                      <FormControl
                                        size="small"
                                        sx={{
                                          minWidth: { xs: "100%", sm: 140 },
                                          maxWidth: { xs: "100%", sm: 180 },
                                        }}
                                      >
                                        <Select
                                          value={
                                            member?.courseRole || "ASSIGNED"
                                          }
                                          onChange={(e) => {
                                            if (canEdit) {
                                              handleRoleChange(
                                                member?.lecturer?.id,
                                                e.target.value,
                                              );
                                            }
                                          }}
                                          disabled={!canEdit}
                                          sx={{
                                            borderRadius: 1,
                                            fontSize: {
                                              xs: "0.8rem",
                                              sm: "0.875rem",
                                            },
                                            "& .MuiOutlinedInput-notchedOutline":
                                              {
                                                borderColor: "primary.light",
                                              },
                                            ...(canEdit ? {} : {
                                              bgcolor: "grey.100",
                                              "& .MuiSelect-select": {
                                                color: "text.disabled",
                                              },
                                            }),
                                          }}
                                        >
                                          {getRoleOptions().map((option) => (
                                            <MenuItem
                                              key={option.value}
                                              value={option.value}
                                            >
                                              {option.label}
                                            </MenuItem>
                                          ))}
                                        </Select>
                                      </FormControl>
                                      {canEdit && (
                                        <Tooltip title="Xóa giảng viên">
                                          <IconButton
                                            size={
                                              isSmallMobile ? "small" : "medium"
                                            }
                                            color="error"
                                            onClick={() =>
                                              handleDeleteMember(
                                                member?.lecturer?.id,
                                              )
                                            }
                                            sx={{
                                              bgcolor: "error.light",
                                              color: "white",
                                              alignSelf: {
                                                xs: "center",
                                                sm: "auto",
                                              },
                                              "&:hover": {
                                                bgcolor: "error.main",
                                                transform: "scale(1.1)",
                                              },
                                              transition: "all 0.2s ease",
                                            }}
                                          >
                                            <DeleteIcon
                                              fontSize={
                                                isSmallMobile ? "small" : "medium"
                                              }
                                            />
                                          </IconButton>
                                        </Tooltip>
                                      )}
                                    </Stack>
                                  )}
                                </Stack>

                                {/* Member Details */}
                                <Stack spacing={{ xs: 1, sm: 1.5 }}>
                                  <Stack
                                    direction="row"
                                    alignItems="flex-start"
                                    spacing={1}
                                  >
                                    <WorkIcon
                                      sx={{
                                        fontSize: { xs: 14, sm: 16 },
                                        color: "text.secondary",
                                        mt: 0.2,
                                      }}
                                    />
                                    <Box
                                      sx={{
                                        fontSize: {
                                          xs: "0.75rem",
                                          sm: "0.875rem",
                                        },
                                        color: "text.secondary",
                                        display: "flex",
                                        alignItems: "flex-start",
                                        flexDirection: {
                                          xs: "column",
                                          sm: "row",
                                        },
                                        flexWrap: "wrap",
                                        gap: { xs: 0.5, sm: 1 },
                                      }}
                                    >
                                      <Box component="span">
                                        <strong>Chuyên môn:</strong>{" "}
                                        {member?.lecturer?.specialization ||
                                          "Chưa cập nhật"}
                                      </Box>
                                      {member?.lecturer?.experienceYears && (
                                        <Chip
                                          label={`${member.lecturer.experienceYears} năm KN`}
                                          size="small"
                                          variant="outlined"
                                          sx={{
                                            height: { xs: 16, sm: 20 },
                                            fontSize: {
                                              xs: "0.65rem",
                                              sm: "0.75rem",
                                            },
                                          }}
                                        />
                                      )}
                                    </Box>
                                  </Stack>
                                  <Stack
                                    direction={{ xs: "column", sm: "row" }}
                                    spacing={{ xs: 0.5, sm: 1 }}
                                  >
                                    <Stack
                                      direction="row"
                                      alignItems="center"
                                      spacing={0.5}
                                    >
                                      <EmailIcon
                                        sx={{
                                          fontSize: { xs: 12, sm: 14 },
                                          color: "text.secondary",
                                        }}
                                      />
                                      <Box
                                        component="span"
                                        sx={{
                                          fontSize: {
                                            xs: "0.7rem",
                                            sm: "0.75rem",
                                          },
                                          color: "text.secondary",
                                          wordBreak: "break-all",
                                        }}
                                      >
                                        {member?.lecturer?.email ||
                                          "Chưa cập nhật"}
                                      </Box>
                                    </Stack>
                                    <Stack
                                      direction="row"
                                      alignItems="center"
                                      spacing={0.5}
                                    >
                                      <PhoneIcon
                                        sx={{
                                          fontSize: { xs: 12, sm: 14 },
                                          color: "text.secondary",
                                        }}
                                      />
                                      <Box
                                        component="span"
                                        sx={{
                                          fontSize: {
                                            xs: "0.7rem",
                                            sm: "0.75rem",
                                          },
                                          color: "text.secondary",
                                        }}
                                      >
                                        {member?.lecturer?.phoneNumber ||
                                          "Chưa cập nhật"}
                                      </Box>
                                    </Stack>
                                  </Stack>
                                </Stack>
                              </Box>
                            </Stack>
                          </CardContent>
                        </Card>
                      </Fade>
                    ))}
                  </Stack>
                </Box>
              ) : (
                <Paper
                  sx={{
                    p: 4,
                    textAlign: "center",
                    bgcolor: "grey.50",
                    border: "2px dashed",
                    borderColor: "grey.300",
                    borderRadius: 1,
                  }}
                >
                  <PersonIcon sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Chưa có giảng viên
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {canEdit ? "Thêm giảng viên từ danh sách bên phải" : "Danh sách giảng viên trống"}
                  </Typography>
                </Paper>
              )}
            </Stack>
          </Box>

          {/* Right side - Add Lecturers */}
          {canEdit && (
            <Box
              sx={{
                flex: 1,
                p: { xs: 2, sm: 3 },
                height: { xs: isSmallMobile ? "50vh" : "45vh", lg: "100%" },
                bgcolor: "grey.50",
              }}
            >
            <Stack spacing={{ xs: 2, sm: 3 }} sx={{ height: "100%" }}>
              <Box>
                <Typography
                  variant={isMobile ? "subtitle1" : "h6"}
                  sx={{
                    fontWeight: 700,
                    color: "text.primary",
                    mb: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
                  }}
                >
                  <AddIcon
                    color="primary"
                    sx={{ fontSize: { xs: 18, sm: 20, md: 24 } }}
                  />
                  Thêm Giảng viên
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                >
                  Tìm kiếm và thêm giảng viên vào khóa học
                </Typography>
              </Box>

              {/* Role Selection */}
              <FormControl size="small" fullWidth>
                <InputLabel sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
                  Vai trò mặc định
                </InputLabel>
                <Select
                  value={defaultNewRole}
                  label="Vai trò mặc định"
                  onChange={(e) => setDefaultNewRole(e.target.value)}
                  sx={{
                    borderRadius: 1,
                    bgcolor: "white",
                    fontSize: { xs: "0.8rem", sm: "0.875rem" },
                    maxWidth: { xs: "100%", sm: 200 },
                  }}
                >
                  {getRoleOptions().map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Search and Filter Section */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 1.5, sm: 2 }}
              >
                {/* Search Bar */}
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder={
                    isMobile
                      ? "Tìm giảng viên..."
                      : "Tìm theo tên, chuyên môn, email..."
                  }
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1,
                      bgcolor: "white",
                      fontSize: { xs: "0.8rem", sm: "0.875rem" },
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      },
                      "&.Mui-focused": {
                        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon
                          color="primary"
                          sx={{ fontSize: { xs: 18, sm: 20 } }}
                        />
                      </InputAdornment>
                    ),
                    endAdornment: searchTerm && (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setSearchTerm("")}
                        >
                          <ClearIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Academic Rank Filter */}
                <FormControl
                  size="small"
                  sx={{
                    minWidth: { xs: "100%", sm: 180 },
                    maxWidth: { xs: "100%", sm: 200 },
                  }}
                >
                  <InputLabel
                    sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
                  >
                    Học hàm
                  </InputLabel>
                  <Select
                    value={selectedAcademicRank}
                    label="Học hàm"
                    onChange={(e) => setSelectedAcademicRank(e.target.value)}
                    sx={{
                      borderRadius: 1,
                      bgcolor: "white",
                      fontSize: { xs: "0.8rem", sm: "0.875rem" },
                    }}
                  >
                    {getAcademicRankOptions().map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>

              {/* Search Results */}
              <Box
                sx={{
                  flex: 1,
                  minHeight: 0,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    height: "100%",
                    overflow: "auto",
                    pr: 1, // Add padding for scrollbar
                    "&::-webkit-scrollbar": {
                      width: "8px",
                    },
                    "&::-webkit-scrollbar-track": {
                      bgcolor: "grey.100",
                      borderRadius: 1,
                    },
                    "&::-webkit-scrollbar-thumb": {
                      bgcolor: "grey.400",
                      borderRadius: 1,
                      "&:hover": {
                        bgcolor: "grey.600",
                      },
                    },
                  }}
                >
                  {(searchTerm || selectedAcademicRank) &&
                  filteredLecturers.length > 0 ? (
                    <Box sx={{ pb: 1, maxHeight: "400px" }}>
                      <Stack spacing={2}>
                        {filteredLecturers.map(
                          (lecturer: any, index: number) => (
                            <Fade
                              in={true}
                              timeout={200 + index * 50}
                              key={lecturer.id}
                            >
                              <Card
                                variant="outlined"
                                sx={{
                                  bgcolor: "white",
                                  transition: "all 0.3s ease",
                                  cursor: "pointer",
                                  "&:hover": {
                                    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                                    transform: "translateY(-1px)",
                                    borderColor: "primary.main",
                                  },
                                }}
                              >
                                <CardContent sx={{ p: 2 }}>
                                  <Stack
                                    direction="row"
                                    alignItems="center"
                                    spacing={2}
                                  >
                                    <Avatar
                                      src={lecturer.avatarUrl}
                                      alt={lecturer.fullName}
                                      sx={{
                                        width: 48,
                                        height: 48,
                                        border: "2px solid",
                                        borderColor: "primary.light",
                                      }}
                                    >
                                      {lecturer.fullName?.charAt(0)}
                                    </Avatar>

                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                      <Typography
                                        variant="subtitle1"
                                        sx={{ fontWeight: 600, mb: 0.5 }}
                                        noWrap
                                      >
                                        {lecturer.fullName}
                                      </Typography>
                                      <Stack
                                        direction="row"
                                        alignItems="center"
                                        spacing={1}
                                        sx={{ mb: 0.5 }}
                                      >
                                        <Box
                                          component="span"
                                          sx={{
                                            fontSize: "0.75rem",
                                            color: "text.secondary",
                                          }}
                                        >
                                          {lecturer.specialization}
                                        </Box>
                                        <Chip
                                          label={getAcademicRankLabel(
                                            lecturer.academicRank,
                                          )}
                                          size="small"
                                          variant="outlined"
                                          sx={{
                                            height: 16,
                                            fontSize: "0.65rem",
                                          }}
                                        />
                                      </Stack>
                                      <Box
                                        component="span"
                                        sx={{
                                          fontSize: "0.75rem",
                                          color: "text.secondary",
                                          display: "block",
                                        }}
                                      >
                                        {lecturer.experienceYears} năm KN •{" "}
                                        {lecturer.jobField}
                                      </Box>
                                    </Box>

                                    <Tooltip title="Thêm vào khóa học">
                                      <IconButton
                                        color="primary"
                                        onClick={() => {
                                          const newMember = {
                                            lecturer,
                                            courseRole: defaultNewRole,
                                          };
                                          setLocalMembers((prev) => [
                                            ...prev,
                                            newMember,
                                          ]);
                                          if (onMemberRoleChange) {
                                            onMemberRoleChange([
                                              ...localMembers,
                                              newMember,
                                            ]);
                                          }
                                          setSearchTerm("");
                                        }}
                                        sx={{
                                          bgcolor: "primary.light",
                                          color: "white",
                                          "&:hover": {
                                            bgcolor: "primary.main",
                                            transform: "scale(1.1)",
                                          },
                                          transition: "all 0.2s ease",
                                        }}
                                      >
                                        <AddIcon />
                                      </IconButton>
                                    </Tooltip>
                                  </Stack>
                                </CardContent>
                              </Card>
                            </Fade>
                          ),
                        )}

                        {/* Stats at bottom of list */}
                        {filteredLecturers.length > 0 && (
                          <Paper
                            sx={{
                              p: 2,
                              bgcolor: "info.light",
                              color: "info.contrastText",
                              mt: 2,
                              borderRadius: 1,
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{ fontWeight: 500 }}
                            >
                              Tìm thấy {filteredLecturers.length} giảng viên
                              {selectedAcademicRank &&
                                ` với học hàm ${getAcademicRankLabel(selectedAcademicRank)}`}
                              {filteredLecturers.length === 20 &&
                                " (hiển thị 20 đầu tiên)"}
                            </Typography>
                          </Paper>
                        )}
                      </Stack>
                    </Box>
                  ) : (searchTerm || selectedAcademicRank) &&
                    filteredLecturers.length === 0 ? (
                    <Paper sx={{ p: 3, textAlign: "center", bgcolor: "white" }}>
                      <SearchIcon
                        sx={{ fontSize: 48, color: "grey.400", mb: 1 }}
                      />
                      <Typography variant="body1" color="text.secondary">
                        Không tìm thấy giảng viên phù hợp
                        {selectedAcademicRank &&
                          ` với học hàm ${getAcademicRankLabel(selectedAcademicRank)}`}
                      </Typography>
                    </Paper>
                  ) : (
                    <Paper
                      sx={{
                        p: 4,
                        textAlign: "center",
                        bgcolor: "white",
                        border: "2px dashed",
                        borderColor: "grey.300",
                      }}
                    >
                      <SearchIcon
                        sx={{ fontSize: 64, color: "grey.400", mb: 2 }}
                      />
                      <Typography
                        variant="h6"
                        color="text.secondary"
                        gutterBottom
                      >
                        Tìm kiếm giảng viên
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Nhập từ khóa hoặc chọn học hàm để tìm kiếm giảng viên
                      </Typography>
                    </Paper>
                  )}
                </Box>
              </Box>
            </Stack>
          </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          p: { xs: 2, sm: 3 },
          bgcolor: "white",
          borderTop: "1px solid",
          borderColor: "divider",
          boxShadow: "0 -4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1.5, sm: 2 }}
          sx={{
            width: "100%",
            justifyContent: "flex-end",
          }}
        >
          <Button
            onClick={onClose}
            variant="outlined"
            size={isMobile ? "medium" : "large"}
            sx={{
              minWidth: { xs: "100%", sm: 120 },
              borderRadius: 1,
              textTransform: "none",
              fontWeight: 600,
              fontSize: { xs: "0.8rem", sm: "0.875rem" },
            }}
          >
            {canEdit ? "Hủy bỏ" : "Đóng"}
          </Button>
          {canEdit && (
            <Button
              onClick={() => {
                handleSaveMembers();
                onClose();
              }}
              variant="contained"
              size={isMobile ? "medium" : "large"}
              sx={{
                minWidth: { xs: "100%", sm: 120 },
                borderRadius: 1,
                textTransform: "none",
                fontWeight: 600,
                fontSize: { xs: "0.8rem", sm: "0.875rem" },
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                "&:hover": {
                  boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
                },
              }}
            >
              Lưu thay đổi
            </Button>
          )}
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default CourseMemberDialog;
