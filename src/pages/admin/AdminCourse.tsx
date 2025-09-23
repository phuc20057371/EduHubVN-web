import { useEffect, useState, useCallback, useMemo, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCourse } from "../../redux/slice/CourseSilce";
import { API } from "../../utils/Fetch";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  Chip,
  Avatar,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Badge,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Menu,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  School,
  Search,
  Clear,
  People,
  LocationOn,
  Language,
  Edit,
  Delete,
  DateRange,
  Add,
  MoreVert,
} from "@mui/icons-material";
import { visuallyHidden } from "@mui/utils";
import CourseMemberDialog from "../../components/admin-dialog/admin-course-dialog/CourseMemberDialog";
import CreateCourseDialog from "../../components/admin-dialog/admin-course-dialog/CreateCourseDialog";
import EditCourseDialog from "../../components/admin-dialog/admin-course-dialog/EditCourseDialog";
import { toast } from "react-toastify";

type Order = "asc" | "desc";

interface HeadCell {
  disablePadding: boolean;
  id: string;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "title",
    numeric: false,
    disablePadding: false,
    label: "Thông tin khóa học",
  },
  {
    id: "courseType",
    numeric: false,
    disablePadding: false,
    label: "Loại & Trình độ",
  },
  { id: "price", numeric: true, disablePadding: false, label: "Giá (VNĐ)" },
  { id: "schedule", numeric: false, disablePadding: false, label: "Thời gian" },
  { id: "status", numeric: false, disablePadding: false, label: "Trạng thái" },
  { id: "members", numeric: false, disablePadding: false, label: "Giảng viên" },
  { id: "actions", numeric: false, disablePadding: false, label: "Thao tác" },
];

interface EnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
  showActionsColumn: boolean;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort, showActionsColumn } = props;
  const createSortHandler =
    (property: string) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  // Filter out actions column if no permissions
  const visibleHeadCells = showActionsColumn 
    ? headCells 
    : headCells.filter(cell => cell.id !== 'actions');

  return (
    <TableHead>
      <TableRow
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 2,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        {visibleHeadCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{
              background: "transparent",
              color: "#fff",
              position: "sticky",
              top: 0,
              zIndex: 2,
              fontWeight: 600,
              fontSize: "0.875rem",
              letterSpacing: "0.5px",
              borderBottom: "2px solid rgba(255,255,255,0.2)",
            }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
              sx={{
                color: "#fff !important",
                "& .MuiTableSortLabel-icon": {
                  color: "#fff !important",
                },
              }}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

// Memoize TableRow component to prevent unnecessary re-renders
const CourseTableRow = memo(
  ({
    row,
    isItemSelected,
    onRowClick,
    onViewMembers,
    onEditCourse,
    onDeleteCourse,
    courseTypeConfig,
    levelConfig,
    formatPrice,
    formatDate,
    canUpdate,
    canDelete,
  }: any) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
      setAnchorEl(null);
    };

    const handleEditClick = () => {
      handleMenuClose();
      onEditCourse(row.course);
    };

    const handleDeleteClick = () => {
      handleMenuClose();
      onDeleteCourse(row.course);
    };

    return (
    <TableRow
      hover
      onClick={(event) => onRowClick(event, row.course.id)}
      role="checkbox"
      aria-checked={isItemSelected}
      tabIndex={-1}
      key={row.course.id}
      selected={isItemSelected}
      sx={{
        cursor: "pointer",
        "&:nth-of-type(odd)": {
          bgcolor: isItemSelected
            ? "rgba(25, 118, 210, 0.15)"
            : "rgba(0, 0, 0, 0.02)",
        },
        "&:nth-of-type(even)": {
          bgcolor: isItemSelected ? "rgba(25, 118, 210, 0.15)" : "white",
        },
        "&:hover": {
          bgcolor: isItemSelected
            ? "rgba(25, 118, 210, 0.2)"
            : "rgba(25, 118, 210, 0.04)",
          transform: "translateY(-1px)",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        },
        "&.Mui-selected": {
          bgcolor: "rgba(25, 118, 210, 0.15)",
          borderLeft: "4px solid #1976d2",
          "&:hover": {
            bgcolor: "rgba(25, 118, 210, 0.2)",
          },
        },
        transition: "all 0.2s ease-in-out",
      }}
    >
      {/* Course Info */}
      <TableCell sx={{ minWidth: 300, py: 2 }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Avatar
            src={row.course.thumbnailUrl}
            sx={{ width: 60, height: 60, borderRadius: 1 }}
          >
            <School />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
              {row.course.title}
            </Typography>
            <Typography variant="body2" sx={{ color: "#6c757d", mb: 1 }}>
              {row.course.topic}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Chip
                label={row.course.language}
                size="small"
                icon={<Language sx={{ fontSize: 14 }} />}
                sx={{ fontSize: "0.75rem", height: 24 }}
              />
              <Chip
                label={row.course.isOnline ? "Trực tuyến" : "Tại lớp"}
                size="small"
                color={row.course.isOnline ? "success" : "info"}
                icon={
                  row.course.isOnline ? undefined : (
                    <LocationOn sx={{ fontSize: 14 }} />
                  )
                }
                sx={{ fontSize: "0.75rem", height: 24 }}
              />
            </Box>
          </Box>
        </Box>
      </TableCell>

      {/* Type & Level */}
      <TableCell sx={{ py: 2, minWidth: 180 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Chip
            label={`${courseTypeConfig.icon} ${courseTypeConfig.label}`}
            size="small"
            sx={{
              bgcolor: courseTypeConfig.bgColor,
              color: courseTypeConfig.color,
              fontWeight: 600,
            }}
          />
          <Chip
            label={`${levelConfig.icon} ${levelConfig.label}`}
            size="small"
            sx={{
              bgcolor: levelConfig.bgColor,
              color: levelConfig.color,
              fontWeight: 600,
            }}
          />
        </Box>
      </TableCell>

      {/* Price */}
      <TableCell align="right" sx={{ py: 2 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: row.course.price ? "#2e7d32" : "#ed6c02",
          }}
        >
          {row.course.price ? formatPrice(row.course.price) : "Miễn phí"}
        </Typography>
      </TableCell>

      {/* Schedule */}
      <TableCell sx={{ py: 2 }}>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
            Từ: {formatDate(row.course.startDate)}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Đến: {formatDate(row.course.endDate)}
          </Typography>
        </Box>
      </TableCell>

      {/* Status */}
      <TableCell sx={{ py: 2 }}>
        <Chip
          label={row.course.isPublished ? "Đã xuất bản" : "Chưa xuất bản"}
          size="small"
          color={row.course.isPublished ? "success" : "warning"}
          variant="filled"
        />
      </TableCell>

      {/* Members */}
      <TableCell sx={{ py: 2 }}>
        <Badge badgeContent={row.members?.length || 0} color="primary">
          <Button
            variant="outlined"
            size="small"
            startIcon={<People />}
            sx={{ borderRadius: 1, textTransform: "none" }}
            onClick={(e) => {
              e.stopPropagation();
              onViewMembers(row.members || [], row.course);
            }}
          >
            Giảng viên
          </Button>
        </Badge>
      </TableCell>

      {/* Actions */}
      {(canUpdate || canDelete) && (
        <TableCell align="center" sx={{ py: 2 }}>
          <>
            <IconButton
              onClick={handleMenuClick}
              sx={{
                color: "primary.main",
                "&:hover": {
                  bgcolor: "primary.light",
                  color: "white",
                },
              }}
            >
              <MoreVert />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              onClick={(e) => e.stopPropagation()}
              PaperProps={{
                sx: {
                  mt: 1,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                  borderRadius: 1,
                },
              }}
            >
              {canUpdate && (
                <MenuItem onClick={handleEditClick}>
                  <ListItemIcon>
                    <Edit fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Chỉnh sửa</ListItemText>
                </MenuItem>
              )}
              {canDelete && (
                <MenuItem onClick={handleDeleteClick}>
                  <ListItemIcon>
                    <Delete fontSize="small" color="error" />
                  </ListItemIcon>
                  <ListItemText sx={{ color: "error.main" }}>Xóa</ListItemText>
                </MenuItem>
              )}
            </Menu>
          </>
        </TableCell>
      )}
    </TableRow>
  );
});

const AdminCourse = () => {
  const dispatch = useDispatch();
  const courses = useSelector((state: any) => state.courses || []);
  const userProfile = useSelector((state: any) => state.userProfile);

  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<string>("title");
  const [selected, setSelected] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [courseTypeFilter, setCourseTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [membersDialogOpen, setMembersDialogOpen] = useState(false);
  const [selectedCourseMembers, setSelectedCourseMembers] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [createCourseDialogOpen, setCreateCourseDialogOpen] = useState(false); // Add this state
  const [editCourseDialogOpen, setEditCourseDialogOpen] = useState(false);
  const [selectedCourseForEdit, setSelectedCourseForEdit] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<any>(null);

  // Check permissions
  const isAdmin = userProfile?.role === "ADMIN";
  const isSubAdmin = userProfile?.role === "SUB_ADMIN";
  const permissions = userProfile?.permissions || [];

  const canRead = isAdmin || (isSubAdmin && permissions.includes("COURSE_READ"));
  const canCreate = isAdmin || (isSubAdmin && permissions.includes("COURSE_CREATE"));
  const canUpdate = isAdmin || (isSubAdmin && permissions.includes("COURSE_UPDATE"));
  const canDelete = isAdmin || (isSubAdmin && permissions.includes("COURSE_DELETE"));

  useEffect(() => {
    const fetchCourses = async () => {
      if (!canRead) return;
      
      try {
        const response = await API.admin.getAllCourses();
        dispatch(setCourse(response.data.data));
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, [dispatch, canRead]);

  // Memoize heavy functions
  const getCourseTypeConfig = useCallback((type: string) => {
    switch (type) {
      case "FORMAL":
        return {
          label: "Chính quy",
          color: "#1976d2",
          bgColor: "#e3f2fd",
          icon: "",
        };
      case "SPECIALIZED":
        return {
          label: "Chuyên đề",
          color: "#388e3c",
          bgColor: "#e8f5e9",
          icon: "",
        };
      case "EXTRACURRICULAR":
        return {
          label: "Ngoại khóa",
          color: "#f57c00",
          bgColor: "#fff3e0",
          icon: "",
        };
      default:
        return {
          label: type,
          color: "#757575",
          bgColor: "#f5f5f5",
          icon: "",
        };
    }
  }, []);

  const getLevelConfig = useCallback((level: string) => {
    switch (level?.toLowerCase()) {
      case "beginner":
        return {
          label: "Cơ bản",
          color: "#4caf50",
          bgColor: "#e8f5e9",
          icon: "",
        };
      case "intermediate":
        return {
          label: "Trung cấp",
          color: "#ff9800",
          bgColor: "#fff3e0",
          icon: "",
        };
      case "advanced":
        return {
          label: "Nâng cao",
          color: "#f44336",
          bgColor: "#ffebee",
          icon: "",
        };
      default:
        return {
          label: level || "Chưa xác định",
          color: "#2196f3",
          bgColor: "#e3f2fd",
          icon: "",
        };
    }
  }, []);

  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  }, []);

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  }, []);

  // Debounce search term to reduce filtering operations
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Memoize filtered and sorted courses with debounced search
  const { filteredCourses, sortedCourses } = useMemo(() => {
    // Filter courses
    const filtered = courses.filter((item: any) => {
      const matchesSearch =
        !debouncedSearchTerm ||
        item.course?.id?.toString().includes(debouncedSearchTerm) ||
        item.course?.title
          ?.toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase()) ||
        item.course?.topic
          ?.toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase()) ||
        item.course?.description
          ?.toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase());

      const matchesType =
        !courseTypeFilter || item.course?.courseType === courseTypeFilter;

      const matchesStatus =
        !statusFilter ||
        (statusFilter === "published" && item.course?.isPublished) ||
        (statusFilter === "unpublished" && !item.course?.isPublished);

      // Date range filtering
      const courseStartDate = item.course?.startDate
        ? new Date(item.course.startDate)
        : null;
      const courseEndDate = item.course?.endDate
        ? new Date(item.course.endDate)
        : null;

      const matchesStartDate =
        !startDateFilter ||
        (courseStartDate && courseStartDate >= new Date(startDateFilter));

      const matchesEndDate =
        !endDateFilter ||
        (courseEndDate && courseEndDate <= new Date(endDateFilter));

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus &&
        matchesStartDate &&
        matchesEndDate
      );
    });

    // Sort courses
    const sorted = [...filtered].sort((a, b) => {
      const aValue = a.course?.[orderBy];
      const bValue = b.course?.[orderBy];

      if (order === "desc") {
        if (bValue < aValue) return -1;
        if (bValue > aValue) return 1;
        return 0;
      } else {
        if (aValue < bValue) return -1;
        if (aValue > bValue) return 1;
        return 0;
      }
    });

    return { filteredCourses: filtered, sortedCourses: sorted };
  }, [
    courses,
    debouncedSearchTerm,
    courseTypeFilter,
    statusFilter,
    startDateFilter,
    endDateFilter,
    order,
    orderBy,
  ]);

  // Memoize static options
  const courseTypes = useMemo(
    () => [
      { value: "", label: "Tất cả" },
      { value: "FORMAL", label: "Chính quy" },
      { value: "SPECIALIZED", label: "Chuyên đề" },
      { value: "EXTRACURRICULAR", label: "Ngoại khóa" },
    ],
    [],
  );

  const statusOptions = useMemo(
    () => [
      { value: "", label: "Tất cả trạng thái" },
      { value: "published", label: "Đã xuất bản" },
      { value: "unpublished", label: "Chưa xuất bản" },
    ],
    [],
  );

  // Memoize event handlers
  const handleClick = useCallback(
    (_event: React.MouseEvent<unknown>, courseId: string) => {
      setSelected(selected === courseId ? null : courseId);
    },
    [selected],
  );

  const handleViewMembers = useCallback((members: any[], course: any) => {
    setSelectedCourseMembers([...members]);
    setSelectedCourse(course);
    setMembersDialogOpen(true);
  }, []);

  const handleRequestSort = useCallback(
    (_event: React.MouseEvent<unknown>, property: string) => {
      const isAsc = orderBy === property && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(property);
    },
    [order, orderBy],
  );

  const handleCreateCourse = useCallback(
    async (courseData: any) => {
      try {
        const response = await API.admin.createCourse(courseData);

        const coursesResponse = await API.admin.getAllCourses();
        dispatch(setCourse(coursesResponse.data.data));

        const newCourseData = response.data.data;

        setSelectedCourse(newCourseData.course);
        setSelectedCourseMembers(newCourseData.members || []);

        handleViewMembers(newCourseData.members || [], newCourseData.course);

        // setMembersDialogOpen(true);

        toast.success("Khóa học đã được tạo thành công!");
      } catch (error) {
        console.error("Error creating course:", error);
        toast.error("Có lỗi xảy ra khi tạo khóa học!");
      }
    },
    [dispatch],
  );

  const handleEditCourse = useCallback((course: any) => {
    setSelectedCourseForEdit(course);
    setEditCourseDialogOpen(true);
  }, []);

  const handleUpdateCourse = useCallback(
    async (courseData: any) => {
      try {
        await API.admin.updateCourse(courseData);
        // Refresh courses list
        const coursesResponse = await API.admin.getAllCourses();
        dispatch(setCourse(coursesResponse.data.data));
        toast.success("Khóa học đã được cập nhật thành công!");
      } catch (error) {
        console.error("Error updating course:", error);
        toast.error("Có lỗi xảy ra khi cập nhật khóa học!");
      }
    },
    [dispatch],
  );

  const handleDeleteClick = useCallback((course: any) => {
    setCourseToDelete(course);
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!courseToDelete) return;
    
    try {
      // TODO: Gọi API xóa khóa học ở đây
      await API.admin.deleteCourse({ id: courseToDelete.id });
      
      // Refresh courses list sau khi xóa thành công
      const coursesResponse = await API.admin.getAllCourses();
      dispatch(setCourse(coursesResponse.data.data));
      
      toast.success("Khóa học đã được xóa thành công!");
      setDeleteDialogOpen(false);
      setCourseToDelete(null);
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Có lỗi xảy ra khi xóa khóa học!");
    }
  }, [courseToDelete, dispatch]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteDialogOpen(false);
    setCourseToDelete(null);
  }, []);

  // const clearAllFilters = useCallback(() => {
  //   setSearchTerm("");
  //   setCourseTypeFilter("");
  //   setStatusFilter("");
  //   setStartDateFilter("");
  //   setEndDateFilter("");
  // }, []);

  const clearDateFilters = () => {
    setStartDateFilter("");
    setEndDateFilter("");
  };

  const hasDateFilters = startDateFilter || endDateFilter;

  // If user doesn't have read permission, show access denied
  if (!canRead) {
    return (
      <Box
        sx={{
          width: "100%",
          minHeight: "400px",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          p: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card sx={{ p: 4, textAlign: "center", maxWidth: 500 }}>
          <School sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Không có quyền truy cập
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Bạn không có quyền COURSE_READ để xem danh sách khóa học.
            Vui lòng liên hệ quản trị viên để được cấp quyền.
          </Typography>
        </Card>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "fix-content",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        p: 3,
      }}
    >
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          borderRadius: 1,
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
              <School sx={{ fontSize: 28 }} />
            </Avatar>
            <Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: "#2c3e50", mb: 0.5 }}
              >
                Quản lý Khóa học
              </Typography>
              <Typography variant="body2" sx={{ color: "#6c757d" }}>
                {searchTerm ||
                courseTypeFilter ||
                statusFilter ||
                hasDateFilters
                  ? `Đã lọc ${filteredCourses?.length || 0} khóa học`
                  : `Tổng cộng ${filteredCourses?.length || 0} khóa học`}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Create Course Button */}
            {canCreate && (
              <Button
                variant="contained"
                size="large"
                startIcon={<Add />}
                onClick={() => setCreateCourseDialogOpen(true)}
                sx={{
                  borderRadius: 1,
                  textTransform: "none",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  px: 3,
                  py: 1.5,
                  fontWeight: 600,
                  fontSize: "1rem",
                  boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 20px rgba(102, 126, 234, 0.6)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Thêm khóa học
              </Button>
            )}
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
          <Box sx={{ minWidth: 200, flex: "0 0 auto" }}>
            <FormControl fullWidth size="small">
              <InputLabel>Loại khóa học</InputLabel>
              <Select
                value={courseTypeFilter}
                label="Loại khóa học"
                onChange={(e) => setCourseTypeFilter(e.target.value)}
                sx={{
                  bgcolor: "white",
                  borderRadius: 1,
                }}
              >
                {courseTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ minWidth: 180, flex: "0 0 auto" }}>
            <FormControl fullWidth size="small">
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={statusFilter}
                label="Trạng thái"
                onChange={(e) => setStatusFilter(e.target.value)}
                sx={{
                  bgcolor: "white",
                  borderRadius: 1,
                }}
              >
                {statusOptions.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Date Range Filters */}
          <Box sx={{ minWidth: 160, flex: "0 0 auto" }}>
            <TextField
              label="Từ ngày"
              type="date"
              size="small"
              value={startDateFilter}
              onChange={(e) => setStartDateFilter(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                bgcolor: "white",
                borderRadius: 1,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                },
              }}
            />
          </Box>

          <Box sx={{ minWidth: 160, flex: "0 0 auto" }}>
            <TextField
              label="Đến ngày"
              type="date"
              size="small"
              value={endDateFilter}
              onChange={(e) => setEndDateFilter(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                bgcolor: "white",
                borderRadius: 1,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                },
              }}
            />
          </Box>

          {hasDateFilters && (
            <Tooltip title="Xóa bộ lọc ngày">
              <IconButton
                size="small"
                onClick={clearDateFilters}
                sx={{
                  bgcolor: "error.light",
                  color: "error.main",
                  "&:hover": {
                    bgcolor: "error.main",
                    color: "white",
                  },
                }}
              >
                <Clear />
              </IconButton>
            </Tooltip>
          )}

          <Box sx={{ flex: "1 1 300px", minWidth: 300 }}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="🔍 Tìm kiếm theo ID, tên, chủ đề, mô tả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                bgcolor: "white",
                borderRadius: 1,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: "primary.main" }} />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchTerm("")}>
                      <Clear />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>

        {/* Active Filters Display */}
        {(searchTerm || courseTypeFilter || statusFilter || hasDateFilters) && (
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

            {searchTerm && (
              <Chip
                label={`Tìm kiếm: "${searchTerm}"`}
                size="small"
                onDelete={() => setSearchTerm("")}
                color="primary"
                variant="outlined"
              />
            )}

            {courseTypeFilter && (
              <Chip
                label={`Loại: ${courseTypes.find((t) => t.value === courseTypeFilter)?.label}`}
                size="small"
                onDelete={() => setCourseTypeFilter("")}
                color="secondary"
                variant="outlined"
              />
            )}

            {statusFilter && (
              <Chip
                label={`Trạng thái: ${statusOptions.find((s) => s.value === statusFilter)?.label}`}
                size="small"
                onDelete={() => setStatusFilter("")}
                color="success"
                variant="outlined"
              />
            )}

            {startDateFilter && (
              <Chip
                label={`Từ: ${new Date(startDateFilter).toLocaleDateString("vi-VN")}`}
                size="small"
                onDelete={() => setStartDateFilter("")}
                color="info"
                variant="outlined"
                icon={<DateRange />}
              />
            )}

            {endDateFilter && (
              <Chip
                label={`Đến: ${new Date(endDateFilter).toLocaleDateString("vi-VN")}`}
                size="small"
                onDelete={() => setEndDateFilter("")}
                color="info"
                variant="outlined"
                icon={<DateRange />}
              />
            )}

            <Button
              size="small"
              onClick={() => {
                setSearchTerm("");
                setCourseTypeFilter("");
                setStatusFilter("");
                setStartDateFilter("");
                setEndDateFilter("");
              }}
              sx={{ ml: 1, textTransform: "none" }}
            >
              Xóa tất cả
            </Button>
          </Box>
        )}
      </Paper>

      {/* Table */}
      <Paper
        sx={{
          borderRadius: 1,
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        }}
      >
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table sx={{ minWidth: 1400 }}>
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={filteredCourses?.length || 0}
              showActionsColumn={canUpdate || canDelete}
            />
            <TableBody>
              {sortedCourses.map((row, _index) => {
                if (!row || !row.course) return null;

                const isItemSelected = selected === row.course.id;
                const courseTypeConfig = getCourseTypeConfig(
                  row.course.courseType || "",
                );
                const levelConfig = getLevelConfig(row.course.level || "");

                return (
                  <CourseTableRow
                    key={row.course.id}
                    row={row}
                    isItemSelected={isItemSelected}
                    onRowClick={handleClick}
                    onViewMembers={handleViewMembers}
                    onEditCourse={handleEditCourse}
                    onDeleteCourse={handleDeleteClick}
                    courseTypeConfig={courseTypeConfig}
                    levelConfig={levelConfig}
                    formatPrice={formatPrice}
                    formatDate={formatDate}
                    canUpdate={canUpdate}
                    canDelete={canDelete}
                  />
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <CourseMemberDialog
        open={membersDialogOpen}
        onClose={() => {
          setMembersDialogOpen(false);
          setSelectedCourse(null);
        }}
        members={selectedCourseMembers}
        course={selectedCourse || undefined}
        canEdit={canUpdate}
      />

      {canCreate && (
        <CreateCourseDialog
          open={createCourseDialogOpen}
          onClose={() => setCreateCourseDialogOpen(false)}
          onSubmit={handleCreateCourse}
        />
      )}

      {canUpdate && (
        <EditCourseDialog
          open={editCourseDialogOpen}
          onClose={() => {
            setEditCourseDialogOpen(false);
            setSelectedCourseForEdit(null);
          }}
          onSubmit={handleUpdateCourse}
          courseData={selectedCourseForEdit}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: "error.main", fontWeight: 600 }}>
          Xác nhận xóa khóa học
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa khóa học "{courseToDelete?.title}"?
            <br />
            <strong style={{ color: "red" }}>
              Hành động này không thể hoàn tác!
            </strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={handleDeleteCancel}
            variant="outlined"
            sx={{ textTransform: "none" }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            sx={{ textTransform: "none" }}
          >
            Xóa khóa học
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminCourse;
