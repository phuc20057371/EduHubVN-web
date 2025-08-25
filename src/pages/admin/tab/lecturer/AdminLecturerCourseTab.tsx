import React, { useState, useMemo } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import DateRange from "@mui/icons-material/DateRange";
import ApproveOwnedCourseCreateDialog from "../../../../components/admin-dialog/admin-lecturer-dialog/ApproveOwnedCourseCreateDialog";
import ApproveOwnedCourseUpdateDialog from "../../../../components/admin-dialog/admin-lecturer-dialog/ApproveOwnedCourseUpdateDialog";
import ApproveAttendedCourseCreateDialog from "../../../../components/admin-dialog/admin-lecturer-dialog/ApproveAttendedCourseCreateDialog";
import ApproveAttendedCourseUpdateDialog from "../../../../components/admin-dialog/admin-lecturer-dialog/ApproveAttendedCourseUpdateDialog";
import { getAcademicRank } from "../../../../utils/ChangeText";

interface AdminLecturerCourseTabProps {
  lecturerRequestsCourse: any[];
}

const AdminLecturerCourseTab: React.FC<AdminLecturerCourseTabProps> = ({
  lecturerRequestsCourse,
}) => {
  // Filter state management
  const [courseSearchTerm, setCourseSearchTerm] = useState("");
  const [courseTypeFilter, setCourseTypeFilter] = useState("");
  const [courseActionFilter, setCourseActionFilter] = useState("");
  const [courseDateSort, setCourseDateSort] = useState("oldest");

  // Filtered data using useMemo
  const filteredCourseList = useMemo(() => {
    if (!Array.isArray(lecturerRequestsCourse)) {
      return [];
    }

    let filtered = lecturerRequestsCourse;

    if (courseSearchTerm) {
      filtered = filtered.filter((item: any) => {
        const searchTerm = courseSearchTerm.toLowerCase();
        const lecturerMatch = item.lecturerInfo?.fullName
          ?.toLowerCase()
          .includes(searchTerm);
        const idMatch =
          item.content?.id?.toString().includes(courseSearchTerm) ||
          item.content?.original?.id?.toString().includes(courseSearchTerm);
        let contentMatch = false;
        if (item.content && !item.content.original) {
          contentMatch =
            item.content.name?.toLowerCase().includes(searchTerm) ||
            item.content.title?.toLowerCase().includes(searchTerm) ||
            item.content.description?.toLowerCase().includes(searchTerm) ||
            item.content.category?.toLowerCase().includes(searchTerm) ||
            item.content.level?.toLowerCase().includes(searchTerm) ||
            item.content.duration?.toString().includes(courseSearchTerm) ||
            item.content.price?.toString().includes(courseSearchTerm);
        }
        if (item.content?.original) {
          contentMatch =
            contentMatch ||
            item.content.original.name?.toLowerCase().includes(searchTerm) ||
            item.content.original.title?.toLowerCase().includes(searchTerm) ||
            item.content.original.description
              ?.toLowerCase()
              .includes(searchTerm) ||
            item.content.original.category
              ?.toLowerCase()
              .includes(searchTerm) ||
            item.content.original.level?.toLowerCase().includes(searchTerm) ||
            item.content.original.duration
              ?.toString()
              .includes(courseSearchTerm) ||
            item.content.original.price?.toString().includes(courseSearchTerm);
        }
        return lecturerMatch || idMatch || contentMatch;
      });
    }
    if (courseTypeFilter) {
      filtered = filtered.filter((item: any) => item.type === courseTypeFilter);
    }

    if (courseActionFilter) {
      filtered = filtered.filter(
        (item: any) => item.label === courseActionFilter,
      );
    }
    filtered = [...filtered].sort((a: any, b: any) => {
      const dateA = new Date(
        a.date || a.content?.updatedAt || a.content?.createdAt || 0,
      );
      const dateB = new Date(
        b.date || b.content?.updatedAt || b.content?.createdAt || 0,
      );

      if (courseDateSort === "oldest") {
        return dateA.getTime() - dateB.getTime();
      } else {
        return dateB.getTime() - dateA.getTime();
      }
    });
    return filtered;
  }, [
    lecturerRequestsCourse,
    courseSearchTerm,
    courseTypeFilter,
    courseActionFilter,
    courseDateSort,
  ]);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [openOwnedCourseCreateDialog, setOpenOwnedCourseCreateDialog] =
    useState(false);
  const [openOwnedCourseUpdateDialog, setOpenOwnedCourseUpdateDialog] =
    useState(false);
  const [openAttendedCourseCreateDialog, setOpenAttendedCourseCreateDialog] =
    useState(false);
  const [openAttendedCourseUpdateDialog, setOpenAttendedCourseUpdateDialog] =
    useState(false);

  const handleCourseItemClick = (item: any) => {
    setSelectedCourse(item);
    switch (item.type) {
      case "OC":
        item.label === "Create"
          ? setOpenOwnedCourseCreateDialog(true)
          : setOpenOwnedCourseUpdateDialog(true);
        break;
      case "AC":
        item.label === "Create"
          ? setOpenAttendedCourseCreateDialog(true)
          : setOpenAttendedCourseUpdateDialog(true);
        break;
      default:
        break;
    }
  };

  const handleDialogClose = (dialogType: string) => {
    switch (dialogType) {
      case "OwnedCourseCreate":
        setOpenOwnedCourseCreateDialog(false);
        break;
      case "OwnedCourseUpdate":
        setOpenOwnedCourseUpdateDialog(false);
        break;
      case "AttendedCourseCreate":
        setOpenAttendedCourseCreateDialog(false);
        break;
      case "AttendedCourseUpdate":
        setOpenAttendedCourseUpdateDialog(false);
        break;
      default:
        break;
    }
    setSelectedCourse(null);
  };

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          borderRadius: 3,
          border: "1px solid rgba(255,255,255,0.8)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: "primary.main",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                width: 56,
                height: 56,
              }}
            >
              <Typography variant="h4" sx={{ color: "white", fontWeight: 700 }}>
                📚
              </Typography>
            </Avatar>
            <Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: "#2c3e50", mb: 0.5 }}
              >
                Yêu cầu tạo mới và cập nhật khóa đào tạo
              </Typography>
              <Typography variant="body2" sx={{ color: "#6c757d" }}>
                {courseSearchTerm || courseTypeFilter
                  ? `Đã lọc ${filteredCourseList?.length || 0} yêu cầu`
                  : `Tổng cộng ${filteredCourseList?.length || 0} yêu cầu`}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Filters */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ minWidth: 250, flex: "0 0 auto" }}>
            <FormControl fullWidth size="small">
              <InputLabel>Loại</InputLabel>
              <Select
                value={courseTypeFilter}
                label="Loại"
                onChange={(e) => setCourseTypeFilter(e.target.value)}
                sx={{
                  bgcolor: "white",
                  borderRadius: 2,
                }}
              >
                <MenuItem value="">
                  <em>Tất cả</em>
                </MenuItem>
                <MenuItem value="OC">Khóa học đang sở hữu</MenuItem>
                <MenuItem value="AC">Khóa học đã tham gia</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ minWidth: 180, flex: "0 0 auto" }}>
            <FormControl fullWidth size="small">
              <InputLabel>Sắp xếp theo ngày</InputLabel>
              <Select
                value={courseDateSort}
                label="Sắp xếp theo ngày"
                onChange={(e) => setCourseDateSort(e.target.value)}
                sx={{
                  bgcolor: "white",
                  borderRadius: 2,
                }}
              >
                <MenuItem value="oldest">Cũ nhất trước</MenuItem>
                <MenuItem value="newest">Mới nhất trước</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ minWidth: 180, flex: "0 0 auto" }}>
            <FormControl fullWidth size="small">
              <InputLabel>Hành động</InputLabel>
              <Select
                value={courseActionFilter}
                label="Hành động"
                onChange={(e) => setCourseActionFilter(e.target.value)}
                sx={{
                  bgcolor: "white",
                  borderRadius: 2,
                }}
              >
                <MenuItem value="">
                  <em>Tất cả</em>
                </MenuItem>
                <MenuItem value="Create">Tạo mới</MenuItem>
                <MenuItem value="Update">Cập nhật</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ flex: "1 1 300px", minWidth: 300 }}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="🔍 Theo ID, tên giảng viên, tên khóa học..."
              value={courseSearchTerm}
              onChange={(e) => setCourseSearchTerm(e.target.value)}
              sx={{
                bgcolor: "white",
                borderRadius: 2,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "primary.main" }} />
                  </InputAdornment>
                ),
                endAdornment: courseSearchTerm && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setCourseSearchTerm("")}
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>

        {/* Active Filters Display */}
        {(courseSearchTerm ||
          courseTypeFilter ||
          courseDateSort !== "oldest" ||
          courseActionFilter) && (
          <Box
            sx={{
              mt: 2,
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" sx={{ color: "#6c757d", mr: 1 }}>
              Bộ lọc đang áp dụng:
            </Typography>

            {courseSearchTerm && (
              <Chip
                label={`Tìm kiếm: "${courseSearchTerm}"`}
                size="small"
                onDelete={() => setCourseSearchTerm("")}
                color="primary"
                variant="outlined"
              />
            )}

            {courseTypeFilter && (
              <Chip
                label={`Loại: ${
                  courseTypeFilter === "OC"
                    ? "Khóa học đang sở hữu"
                    : "Khóa học đã tham gia"
                }`}
                size="small"
                onDelete={() => setCourseTypeFilter("")}
                color="secondary"
                variant="outlined"
              />
            )}

            {courseActionFilter && (
              <Chip
                label={`Hành động: ${courseActionFilter === "Create" ? "Tạo mới" : "Cập nhật"}`}
                size="small"
                onDelete={() => setCourseActionFilter("")}
                color="info"
                variant="outlined"
              />
            )}

            {courseDateSort !== "oldest" && (
              <Chip
                label={`Sắp xếp: ${courseDateSort === "newest" ? "Mới nhất trước" : "Cũ nhất trước"}`}
                size="small"
                onDelete={() => setCourseDateSort("oldest")}
                color="default"
                variant="outlined"
                icon={<DateRange />}
              />
            )}

            <Button
              size="small"
              onClick={() => {
                setCourseSearchTerm("");
                setCourseTypeFilter("");
                setCourseDateSort("oldest");
                setCourseActionFilter("");
              }}
              sx={{ ml: 1, textTransform: "none" }}
            >
              Xóa tất cả
            </Button>
          </Box>
        )}
      </Paper>

      {filteredCourseList && filteredCourseList.length > 0 ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 3,
            "@media (min-width: 1200px)": {
              gridTemplateColumns: "repeat(4, 1fr)",
            },
            "@media (min-width: 900px) and (max-width: 1199px)": {
              gridTemplateColumns: "repeat(3, 1fr)",
            },
            "@media (min-width: 600px) and (max-width: 899px)": {
              gridTemplateColumns: "repeat(2, 1fr)",
            },
            "@media (max-width: 599px)": {
              gridTemplateColumns: "1fr",
            },
          }}
        >
          {filteredCourseList.map((item: any, index: number) => {
            const contentData =
              item.label === "Update" ? item.content?.original : item.content;

            return (
              <Card
                key={`course-${item.type}-${item.content?.id}-${item.label}-${index}`}
                sx={{
                  transition: "all 0.3s ease",
                  border: "2px solid",
                  borderColor:
                    item.label === "Create" ? "success.light" : "warning.light",
                  borderRadius: 3,
                  height: "fit-content",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                    borderColor:
                      item.label === "Create" ? "success.main" : "warning.main",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2.5,
                    }}
                  >
                    {/* COURSE INFORMATION - TOP */}
                    <Box sx={{ pb: 1.5, borderBottom: "1px solid #e0e0e0" }}>
                      <Box sx={{ display: "flex", gap: 0.5, mb: 1.5 }}>
                        <Chip
                          label={
                            item.type === "OC"
                              ? "Khóa sở hữu"
                              : "Khóa tham gia"
                          }
                          size="small"
                          variant="filled"
                          color={item.type === "OC" ? "primary" : "secondary"}
                          sx={{ fontSize: "0.7rem", height: 22 }}
                        />
                        <Chip
                          label={item.label === "Create" ? "Tạo mới" : "Cập nhật"}
                          size="small"
                          color={
                            item.label === "Create" ? "success" : "warning"
                          }
                          sx={{ fontSize: "0.7rem", height: 22 }}
                        />
                      </Box>

                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: "text.primary",
                          mb: 1.5,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          lineHeight: 1.2,
                          minHeight: "2.4em",
                        }}
                      >
                        {contentData?.title || contentData?.name || "Không có tên"}
                      </Typography>

                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontWeight: 600, minWidth: "80px" }}
                        >
                          Chuyên đề:
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            flex: 1,
                            textAlign: "right",
                          }}
                        >
                          {contentData?.topic ||
                            contentData?.researchArea ||
                            contentData?.description ||
                            "Không có thông tin"}
                        </Typography>
                      </Box>
                    </Box>

                    {/* LECTURER INFORMATION - MIDDLE */}
                    <Box sx={{ pb: 1.5, borderBottom: "1px solid #e0e0e0" }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontWeight: 600, mb: 1 }}
                      >
                        Thông tin giảng viên
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Avatar
                          src={item.lecturerInfo?.avatarUrl || ""}
                          sx={{
                            bgcolor:
                              item.label === "Create"
                                ? "success.main"
                                : "warning.main",
                            width: 48,
                            height: 48,
                            fontSize: "1.1rem",
                            fontWeight: 700,
                          }}
                        >
                          {item.lecturerInfo?.fullName?.charAt(0)}
                        </Avatar>

                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 600,
                              color: "text.primary",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item.lecturerInfo?.fullName || "Không có tên"}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {getAcademicRank(item.lecturerInfo?.academicRank) || "Không có"}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* TIME INFORMATION - BOTTOM */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontWeight: 600 }}
                      >
                        Thời gian cập nhật
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          fontSize: "0.8rem",
                          color: "text.secondary",
                          fontStyle: "italic",
                        }}
                      >
                        {(() => {
                          const updateTime = new Date(
                            item.date ||
                              contentData?.updatedAt ||
                              contentData?.createdAt ||
                              Date.now(),
                          );
                          const now = new Date();
                          const diffInHours = Math.floor(
                            (now.getTime() - updateTime.getTime()) /
                              (1000 * 60 * 60),
                          );

                          if (diffInHours < 1) {
                            return "Vừa cập nhật";
                          } else if (diffInHours < 48) {
                            return `${diffInHours} giờ trước`;
                          } else {
                            const diffInDays = Math.floor(diffInHours / 24);
                            return `${diffInDays} ngày trước`;
                          }
                        })()}
                      </Typography>

                      <Button
                        variant="contained"
                        color={item.label === "Create" ? "success" : "warning"}
                        size="medium"
                        fullWidth
                        sx={{
                          mt: 1.5,
                          py: 1.2,
                          fontWeight: 600,
                          textTransform: "none",
                          borderRadius: 2,
                          fontSize: "0.85rem",
                        }}
                        onClick={() => handleCourseItemClick(item)}
                      >
                        Xem chi tiết
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      ) : (
        <Paper
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ mb: 2, fontWeight: 600 }}
          >
            Không có yêu cầu nào
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Hiện tại không có yêu cầu khóa đào tạo/hoạt động nào cần xử lý.
          </Typography>
        </Paper>
      )}

      {openOwnedCourseCreateDialog && (
        <ApproveOwnedCourseCreateDialog
          open={openOwnedCourseCreateDialog}
          data={selectedCourse}
          onClose={() => handleDialogClose("OwnedCourseCreate")}
          
        />
      )}
      {openOwnedCourseUpdateDialog && (
        <ApproveOwnedCourseUpdateDialog
          open={openOwnedCourseUpdateDialog}
          data={selectedCourse}
          onClose={() => handleDialogClose("OwnedCourseUpdate")}
        />
      )}
      {openAttendedCourseCreateDialog && (
        <ApproveAttendedCourseCreateDialog
          open={openAttendedCourseCreateDialog}
          data={selectedCourse}
          onClose={() => handleDialogClose("AttendedCourseCreate")}
        />
      )}
      {openAttendedCourseUpdateDialog && (
        <ApproveAttendedCourseUpdateDialog
          open={openAttendedCourseUpdateDialog}
          data={selectedCourse}
          onClose={() => handleDialogClose("AttendedCourseUpdate")}
        />
      )}
    </>
  );
};

export default AdminLecturerCourseTab;
