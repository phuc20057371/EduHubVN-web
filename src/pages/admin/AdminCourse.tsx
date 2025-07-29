import { useEffect, useState, type SyntheticEvent } from "react";
import { API } from "../../utils/Fetch";
import { useDispatch, useSelector } from "react-redux";
import { setCourse } from "../../redux/slice/CourseSilce";
import * as React from "react";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { visuallyHidden } from "@mui/utils";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { School, Schedule, CalendarMonth } from "@mui/icons-material";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
  disablePadding: boolean;
  id: string;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  { id: "id", numeric: true, disablePadding: false, label: "ID" },
  { id: "title", numeric: false, disablePadding: false, label: "Tên khóa học" },
  { id: "topic", numeric: false, disablePadding: false, label: "Chủ đề" },
  { id: "courseType", numeric: false, disablePadding: false, label: "Loại KH" },
  { id: "scale", numeric: false, disablePadding: false, label: "Quy mô" },
  { id: "level", numeric: false, disablePadding: false, label: "Trình độ" },
  { id: "price", numeric: true, disablePadding: false, label: "Giá (VNĐ)" },
  { id: "startDate", numeric: false, disablePadding: false, label: "Ngày bắt đầu" },
  { id: "endDate", numeric: false, disablePadding: false, label: "Ngày kết thúc" },
  // { id: "isPublished", numeric: false, disablePadding: false, label: "Trạng thái" },
  { id: "members", numeric: false, disablePadding: false, label: "Giảng viên" },
  { id: "actions", numeric: false, disablePadding: false, label: "Thao tác" },
];

interface EnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property: string) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 2,
          backgroundColor: "#1976d2",
        }}
      >
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{
              backgroundColor: "#1976d2",
              color: "#fff",
              position: "sticky",
              top: 0,
              zIndex: 2,
            }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
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

interface EnhancedTableToolbarProps {
  numSelected: number;
  onEdit?: () => void;
  onSearch: (value: string) => void;
  searchTerm: string;
  onCourseTypeFilter: (value: string) => void;
  courseTypeFilter: string;
  onScaleFilter: (value: string) => void;
  scaleFilter: string;
  onStatusFilter: (value: string) => void;
  statusFilter: string;
}

function EnhancedTableToolbar({
  numSelected,
  onEdit,
  onSearch,
  searchTerm,
  onCourseTypeFilter,
  courseTypeFilter,
  onScaleFilter,
  scaleFilter,
  onStatusFilter,
  statusFilter,
}: EnhancedTableToolbarProps) {
  const courseTypes = [
    { value: "", label: "Tất cả" },
    { value: "FORMAL", label: "Chính quy" },
    { value: "SPECIALIZED", label: "Chuyên đề" },
    { value: "EXTRACURRICULAR", label: "Ngoại khóa" },
  ];

  const scales = [
    { value: "", label: "Tất cả" },
    { value: "INSTITUTIONAL", label: "Cấp đơn vị" },
    { value: "UNIVERSITY", label: "Cấp trường" },
    { value: "DEPARTMENTAL", label: "Cấp khoa/tỉnh" },
    { value: "MINISTERIAL", label: "Cấp bộ" },
    { value: "NATIONAL", label: "Cấp quốc gia" },
    { value: "INTERNATIONAL", label: "Cấp quốc tế" },
  ];

  const statusOptions = [
    { value: "", label: "Tất cả" },
    { value: "true", label: "Đã xuất bản" },
    { value: "false", label: "Chưa xuất bản" },
  ];

  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          display: "flex",
          alignItems: "center",
          gap: 2,
          bgcolor: "background.paper",
          borderRadius: 1,
          mb: 2,
          flexWrap: "wrap",
        },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity,
            ),
        },
      ]}
    >
      <Typography
        sx={{ flex: { xs: "1 1 100%", md: "1 1 auto" } }}
        variant="h6"
        id="tableTitle"
        component="div"
        color="primary.main"
        fontWeight="bold"
      >
        Danh sách Khóa học (
        {searchTerm || courseTypeFilter || scaleFilter || statusFilter ? "Đã lọc" : "Tất cả"}
        )
      </Typography>

      {/* Filter Controls */}
      <Box
        sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}
      >
        {/* Course Type Filter */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="course-type-select-label">Loại khóa học</InputLabel>
          <Select
            labelId="course-type-select-label"
            value={courseTypeFilter}
            label="Loại khóa học"
            onChange={(e) => onCourseTypeFilter(e.target.value)}
          >
            {courseTypes.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Scale Filter */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="scale-select-label">Quy mô</InputLabel>
          <Select
            labelId="scale-select-label"
            value={scaleFilter}
            label="Quy mô"
            onChange={(e) => onScaleFilter(e.target.value)}
          >
            {scales.map((scale) => (
              <MenuItem key={scale.value} value={scale.value}>
                {scale.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Status Filter */}
        {/* <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="status-select-label">Trạng thái</InputLabel>
          <Select
            labelId="status-select-label"
            value={statusFilter}
            label="Trạng thái"
            onChange={(e) => onStatusFilter(e.target.value)}
          >
            {statusOptions.map((status) => (
              <MenuItem key={status.value} value={status.value}>
                {status.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl> */}

        {/* Search Bar */}
        <TextField
          variant="outlined"
          size="small"
          placeholder="Tìm kiếm theo tên, chủ đề, mô tả..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          sx={{ minWidth: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => onSearch("")}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {numSelected > 0 ? (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Chỉnh sửa">
            <IconButton onClick={onEdit} color="primary">
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xóa">
            <IconButton color="error">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ) : (
        <Tooltip title="Bộ lọc">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

const AdminCourse = () => {
  const dispatch = useDispatch();
  const courses = useSelector((state: any) => state.courses || []);
  
  const [value, setValue] = useState("1");
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<string>("id");
  const [selected, setSelected] = React.useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [courseTypeFilter, setCourseTypeFilter] = useState("");
  const [scaleFilter, setScaleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [membersDialogOpen, setMembersDialogOpen] = useState(false);
  const [selectedCourseMembers, setSelectedCourseMembers] = useState<any[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await API.admin.getAllCourses();
        console.log("Courses fetched successfully:", response.data.data);
        dispatch(setCourse(response.data.data));
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, [dispatch]);

  const handleRequestSort = (
    _event: React.MouseEvent<unknown>,
    property: string,
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleClick = (_event: React.MouseEvent<unknown>, courseId: number) => {
    const selectedIndex = selected === courseId ? -1 : courseId;
    if (selectedIndex === -1) {
      setSelected(null);
      return;
    }
    setSelected(selectedIndex);
  };

  // Filtering and sorting logic
  const filteredCourses = React.useMemo(() => {
    let filtered = courses;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (item: any) =>
          item.course?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.course?.topic?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.course?.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filter by course type
    if (courseTypeFilter) {
      filtered = filtered.filter(
        (item: any) => item.course?.courseType === courseTypeFilter,
      );
    }

    // Filter by scale
    if (scaleFilter) {
      filtered = filtered.filter(
        (item: any) => item.course?.scale === scaleFilter,
      );
    }

    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter(
        (item: any) => item.course?.isPublished?.toString() === statusFilter,
      );
    }

    return filtered || [];
  }, [courses, searchTerm, courseTypeFilter, scaleFilter, statusFilter]);

  const visibleRows = React.useMemo(
    () => {
      if (!filteredCourses || !Array.isArray(filteredCourses)) {
        return [];
      }
      
      return [...filteredCourses].sort((a, b) => {
        const aValue = a.course?.[orderBy as keyof typeof a.course];
        const bValue = b.course?.[orderBy as keyof typeof b.course];
        
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
    },
    [filteredCourses, order, orderBy],
  );

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleCourseTypeFilter = (value: string) => {
    setCourseTypeFilter(value);
  };

  const handleScaleFilter = (value: string) => {
    setScaleFilter(value);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
  };

  const getCourseTypeLabel = (type: string) => {
    switch (type) {
      case "FORMAL":
        return "Chính quy";
      case "SPECIALIZED":
        return "Chuyên đề";
      case "EXTRACURRICULAR":
        return "Ngoại khóa";
      default:
        return type;
    }
  };

  const getScaleLabel = (scale: string) => {
    switch (scale) {
      case "INSTITUTIONAL":
        return "Cấp đơn vị";
      case "UNIVERSITY":
        return "Cấp trường";
      case "DEPARTMENTAL":
        return "Cấp khoa/tỉnh";
      case "MINISTERIAL":
        return "Cấp bộ";
      case "NATIONAL":
        return "Cấp quốc gia";
      case "INTERNATIONAL":
        return "Cấp quốc tế";
      default:
        return scale;
    }
  };

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const handleViewMembers = (members: any[]) => {
    setSelectedCourseMembers(members);
    setMembersDialogOpen(true);
  };

  const emptyRows = visibleRows && visibleRows.length > 0 ? 
    (10 - visibleRows.length > 0 ? 10 - visibleRows.length : 0) : 10;

  const handleChange = (_event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const renderCourseListTab = () => (
    <Box sx={{ width: "100%", typography: "body1", bgcolor: "background.default" }}>
      <Paper sx={{ width: "100%", borderRadius: 2, overflow: "hidden" }}>
        <EnhancedTableToolbar
          numSelected={selected ? 1 : 0}
          onEdit={() => {
            // Handle edit functionality
            console.log("Edit course:", selected);
          }}
          onSearch={handleSearch}
          searchTerm={searchTerm}
          onCourseTypeFilter={handleCourseTypeFilter}
          courseTypeFilter={courseTypeFilter}
          onScaleFilter={handleScaleFilter}
          scaleFilter={scaleFilter}
          onStatusFilter={handleStatusFilter}
          statusFilter={statusFilter}
        />
        <TableContainer
          sx={{
            maxHeight: 10 * 53 + 56,
            width: "100%",
            overflowY: "auto",
            overflowX: "auto",
            // Remove any fixed width constraints and let it adjust to content
            minWidth: "fit-content",
          }}
        >
          <Table
            sx={{ 
              minWidth: "max-content", // Changed from fixed 1200px to content-based
              width: "auto", // Changed from 100% to auto
              tableLayout: "auto" // Let table adjust column widths automatically
            }}
            aria-labelledby="tableTitle"
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={filteredCourses?.length || 0}
            />
            <TableBody>
              {visibleRows && Array.isArray(visibleRows) && visibleRows.map((row, index) => {
                if (!row || !row.course) {
                  return null;
                }
                
                const isItemSelected = selected === row.course.id;
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.course.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.course.id}
                    selected={isItemSelected}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell
                      component="th"
                      align="right"
                      id={labelId}
                      scope="row"
                      padding="normal"
                      sx={{
                        fontWeight: "bold",
                        color: "primary.main",
                        width: 80,
                      }}
                    >
                      {row.course.id}
                    </TableCell>
                    <TableCell sx={{ maxWidth: 200 }}>
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        {row.course.title || "Không có tiêu đề"}
                      </Typography>
                    </TableCell>
                    <TableCell>{row.course.topic || "Không có chủ đề"}</TableCell>
                    <TableCell>
                      <Chip
                        label={getCourseTypeLabel(row.course.courseType || "")}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getScaleLabel(row.course.scale || "")}
                        size="small"
                        variant="outlined"
                        color="secondary"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.course.level || "Không có"}
                        size="small"
                        color="info"
                      />
                    </TableCell>
                    <TableCell align="right">
                      {row.course.price ? formatPrice(row.course.price) : "Miễn phí"}
                    </TableCell>
                    <TableCell>{row.course.startDate ? formatDate(row.course.startDate) : "Chưa có"}</TableCell>
                    <TableCell>{row.course.endDate ? formatDate(row.course.endDate) : "Chưa có"}</TableCell>
                    {/* <TableCell>
                      <Chip
                        label={row.course.isPublished ? "Đã xuất bản" : "Chưa xuất bản"}
                        size="small"
                        color={row.course.isPublished ? "success" : "warning"}
                        variant="filled"
                      />
                    </TableCell> */}
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewMembers(row.members || []);
                        }}
                      >
                        {row.members && Array.isArray(row.members) ? row.members.length : 0} GV
                      </Button>
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        size="small"
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle view details
                          console.log("View course details:", row.course.id);
                        }}
                        sx={{ minWidth: 100 }}
                      >
                        Chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={12} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );

  const renderTeachingScheduleTab = () => (
    <Box sx={{ width: "100%", typography: "body1", bgcolor: "background.default" }}>
      <Paper sx={{ width: "100%", borderRadius: 2, overflow: "hidden", p: 4 }}>
        <Box sx={{ textAlign: "center", py: 8 }}>
          <CalendarMonth sx={{ fontSize: 80, color: "primary.main", mb: 2 }} />
          <Typography variant="h4" gutterBottom color="primary.main" fontWeight="bold">
            Lịch Giảng dạy
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Tính năng lịch giảng dạy đang được phát triển
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sẽ sớm có mặt trong phiên bản tiếp theo
          </Typography>
        </Box>
      </Paper>
    </Box>
  );

  return (
    <Box
      sx={{
        width: "100%",
        typography: "body1",
        bgcolor: "background.default",
        minHeight: "fit",
      }}
    >
      <TabContext value={value}>
        <Paper sx={{ mb: 3, borderRadius: 2, overflow: "hidden" }}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              bgcolor: "background.paper",
            }}
          >
            <TabList
              onChange={handleChange}
              aria-label="course management tabs"
              sx={{ px: 2 }}
            >
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <School />
                    <span>Danh sách khóa học</span>
                    <Chip
                      size="small"
                      label={filteredCourses?.length || 0}
                      color="primary"
                    />
                  </Box>
                }
                value="1"
              />
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Schedule />
                    <span>Lịch giảng dạy</span>
                  </Box>
                }
                value="2"
              />
            </TabList>
          </Box>
        </Paper>

        <TabPanel value="1" sx={{ p: 0 }}>
          {renderCourseListTab()}
        </TabPanel>

        <TabPanel value="2" sx={{ p: 0 }}>
          {renderTeachingScheduleTab()}
        </TabPanel>
      </TabContext>

      {/* Members Dialog */}
      <Dialog
        open={membersDialogOpen}
        onClose={() => setMembersDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Danh sách Giảng viên</DialogTitle>
        <DialogContent>
          {selectedCourseMembers && Array.isArray(selectedCourseMembers) && selectedCourseMembers.length > 0 ? (
            <List>
              {selectedCourseMembers.map((member, index) => (
                <React.Fragment key={member?.lecturer?.id || index}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar src={member?.lecturer?.avatarUrl} alt={member?.lecturer?.fullName || "Giảng viên"}>
                        {member?.lecturer?.fullName?.charAt(0) || "?"}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {member?.lecturer?.fullName || "Không có tên"}
                          </Typography>
                          <Chip
                            label={getRoleLabel(member?.courseRole || "")}
                            size="small"
                            color={member?.courseRole === 'AUTHOR' ? 'primary' : 'secondary'}
                          />
                          <Chip
                            label={getAcademicRankLabel(member?.lecturer?.academicRank || "")}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {member?.lecturer?.specialization || "Chưa cập nhật"} - {member?.lecturer?.experienceYears || 0} năm kinh nghiệm
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Email: {member?.lecturer?.email || "Chưa cập nhật"} | SĐT: {member?.lecturer?.phoneNumber || "Chưa cập nhật"}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {selectedCourseMembers && index < selectedCourseMembers.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                Không có giảng viên nào trong khóa học này
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMembersDialogOpen(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminCourse;