import { useEffect, useState, type SyntheticEvent } from "react";

import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Tab from "@mui/material/Tab";

import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import { alpha } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { visuallyHidden } from "@mui/utils";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import LecturerDetailDialog from "../../components/LecturerDetailDialog";
import LecturerDetailUpdateDialog from "../../components/LecturerDetailUpdateDialog";
import LecturerUpdateDialog from "../../components/LecturerUpdateDialog";
import { setLecturerPendingCreate } from "../../redux/slice/LecturerPendingCreateSlice";
import { setLecturerPendingUpdate } from "../../redux/slice/LecturerPendingUpdateSlice";
import { setLecturerRequests } from "../../redux/slice/LecturerRquestSlice";
import { setLecturers } from "../../redux/slice/LecturerSlice";
import type { Lecturer } from "../../types/Lecturer";
import { API } from "../../utils/Fetch";

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
  id: keyof Lecturer;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  { id: "id", numeric: true, disablePadding: false, label: "ID" },
  { id: "fullName", numeric: false, disablePadding: false, label: "Họ tên" },
  {
    id: "academicRank",
    numeric: false,
    disablePadding: false,
    label: "Học hàm",
  },
  {
    id: "specialization",
    numeric: false,
    disablePadding: false,
    label: "Chuyên ngành",
  },
  {
    id: "experienceYears",
    numeric: true,
    disablePadding: false,
    label: "KN (năm)",
  },
  {
    id: "jobField",
    numeric: false,
    disablePadding: false,
    label: "Lĩnh vực",
  },
  {
    id: "dateOfBirth",
    numeric: false,
    disablePadding: false,
    label: "Ngày sinh",
  },
  { id: "gender", numeric: false, disablePadding: false, label: "Giới tính" },
  { id: "phoneNumber", numeric: false, disablePadding: false, label: "SĐT" },
  { id: "status", numeric: false, disablePadding: false, label: "Trạng thái" },
  { id: "createdAt", numeric: false, disablePadding: false, label: "Thao tác" }, // Action column with different key
];
interface EnhancedTableProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Lecturer,
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}
function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: keyof Lecturer) => (event: React.MouseEvent<unknown>) => {
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
  onAcademicRankFilter: (value: string) => void;
  academicRankFilter: string;
  onStatusFilter: (value: string) => void;
  statusFilter: string;
}

function EnhancedTableToolbar({
  numSelected,
  onEdit,
  onSearch,
  searchTerm,
  onAcademicRankFilter,
  academicRankFilter,
  onStatusFilter,
  statusFilter,
}: EnhancedTableToolbarProps) {
  const academicRanks = [
    { value: "", label: "Tất cả" },
    { value: "CN", label: "Cử nhân" },
    { value: "THS", label: "Thạc sĩ" },
    { value: "TS", label: "Tiến sĩ" },
    { value: "PGS", label: "Phó giáo sư" },
    { value: "GS", label: "Giáo sư" },
  ];

  const statusOptions = [
    { value: "", label: "Tất cả" },
    { value: "APPROVED", label: "Đã duyệt" },
    { value: "PENDING", label: "Chờ duyệt" },
    { value: "REJECTED", label: "Đã từ chối" },
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
        Danh sách Giảng viên (
        {searchTerm || academicRankFilter || statusFilter ? "Đã lọc" : "Tất cả"}
        )
      </Typography>

      {/* Filter Controls */}
      <Box
        sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}
      >
        {/* Academic Rank Filter */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="academic-rank-select-label">Học hàm</InputLabel>
          <Select
            labelId="academic-rank-select-label"
            value={academicRankFilter}
            label="Học hàm"
            onChange={(e) => onAcademicRankFilter(e.target.value)}
          >
            <MenuItem value="">
              <em>Tất cả</em>
            </MenuItem>
            {academicRanks.slice(1).map((rank) => (
              <MenuItem key={rank.value} value={rank.value}>
                {rank.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Status Filter */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
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
        </FormControl>

        {/* Search Bar */}
        <TextField
          variant="outlined"
          size="small"
          placeholder="Tìm kiếm theo tên, chuyên ngành, lĩnh vực..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          sx={{ minWidth: 400 }}
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

const AdminLecturerPage = () => {
  const domain = window.location.hostname;
  const BASE_URL = `http://${domain}:8080`;

  const [value, setValue] = useState("1");
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [selectedLecturerCreate, setSelectedLecturerCreate] =
    useState<any>(null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [selectedLecturerUpdate, setSelectedLecturerUpdate] =
    useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [academicRankFilter, setAcademicRankFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("APPROVED");

  // Filters for Create tab
  const [createSearchTerm, setCreateSearchTerm] = useState("");
  const [createDateSort, setCreateDateSort] = useState("oldest");

  // Filters for Update tab
  const [updateSearchTerm, setUpdateSearchTerm] = useState("");
  const [updateDateSort, setUpdateDateSort] = useState("oldest");

  // New states for Degrees/Certificates tab
  const [degreeSearchTerm, setDegreeSearchTerm] = useState("");
  const [degreeTypeFilter, setDegreeTypeFilter] = useState("");
  const [degreeDateSort, setDegreeDateSort] = useState("oldest");

  // New states for Training Courses tab
  const [courseSearchTerm, setCourseSearchTerm] = useState("");
  const [courseTypeFilter, setCourseTypeFilter] = useState("");
  const [courseDateSort, setCourseDateSort] = useState("oldest");

  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Lecturer>("id");
  const [selected, setSelected] = React.useState<number | null>(null);

  const lecturerCreateList = useSelector((state: any) =>
    Array.isArray(state.lecturerPendingCreate)
      ? state.lecturerPendingCreate
      : [],
  );
  const lecturerUpdateList = useSelector((state: any) =>
    Array.isArray(state.lecturerPendingUpdate)
      ? state.lecturerPendingUpdate
      : [],
  );
  const lecturerRequests = useSelector((state: any) =>
    Array.isArray(state.lecturerRequests) ? state.lecturerRequests : [],
  );
  const lecturerRequestsDGCC = React.useMemo(
    () =>
      lecturerRequests.filter(
        (req: any) => req.type === "BC" || req.type === "CC",
      ),
    [lecturerRequests],
  );

  const lecturerRequestsCourse = React.useMemo(
    () =>
      lecturerRequests.filter(
        (req: any) =>
          req.type === "AC" || req.type === "OC" || req.type === "RP",
      ),
    [lecturerRequests],
  );

  const lecturers = useSelector((state: any) => state.lecturer || []);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.admin.getAllLecturers();
        dispatch(setLecturers(res.data.data));
        const response = await API.admin.getLecturerPendingCreate();
        dispatch(setLecturerPendingCreate(response.data.data));
        const updateResponse = await API.admin.getLecturerPendingUpdate();
        dispatch(setLecturerPendingUpdate(updateResponse.data.data));
        const responseData = await API.admin.getLecturerRequests();
        dispatch(setLecturerRequests(responseData.data.data));
        console.log(
          "Lecturer requests:",
          responseData.data.data.filter(
            (req: any) => req.type === "BC" || req.type === "CC",
          ),
        );
      } catch (error) {
        console.error("Error initializing AdminLecturerPage:", error);
      }
    };

    fetchData();
  }, []);

  const handleRequestSort = (
    _event: React.MouseEvent<unknown>,
    property: keyof Lecturer,
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = lecturers.map((n: { id: any }) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected(null);
  };

  const handleClick = (_event: React.MouseEvent<unknown>, row: Lecturer) => {
    const selectedIndex = selected === row.id ? -1 : row.id;
    if (selectedIndex === -1) {
      setSelected(null);
      return;
    }
    setSelected(selectedIndex);
    console.log(row);
  };
  // Chỉ hiển thị tối đa 10 dòng, không còn phân trang
  const filteredLecturers = React.useMemo(() => {
    let filtered = lecturers;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (lecturer: Lecturer) =>
          lecturer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lecturer.specialization
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          lecturer.jobField?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lecturer.phoneNumber?.includes(searchTerm),
      );
    }

    // Filter by academic rank
    if (academicRankFilter) {
      filtered = filtered.filter(
        (lecturer: Lecturer) => lecturer.academicRank === academicRankFilter,
      );
    }

    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter(
        (lecturer: Lecturer) => lecturer.status === statusFilter,
      );
    }

    return filtered;
  }, [lecturers, searchTerm, academicRankFilter, statusFilter]);

  const visibleRows = React.useMemo(
    () => [...filteredLecturers].sort(getComparator(order, orderBy)).slice(),
    [filteredLecturers, order, orderBy],
  );

  // Filtered and sorted create list
  const filteredCreateList = React.useMemo(() => {
    let filtered = lecturerCreateList;

    // Filter by search term
    if (createSearchTerm) {
      filtered = filtered.filter((item: any) =>
        item.lecturer.fullName
          ?.toLowerCase()
          .includes(createSearchTerm.toLowerCase()),
      );
    }

    // Sort by updatedAt
    filtered = [...filtered].sort((a: any, b: any) => {
      const dateA = new Date(a.lecturer.updatedAt || a.lecturer.createdAt || 0);
      const dateB = new Date(b.lecturer.updatedAt || b.lecturer.createdAt || 0);

      if (createDateSort === "oldest") {
        return dateA.getTime() - dateB.getTime();
      } else {
        return dateB.getTime() - dateA.getTime();
      }
    });

    return filtered;
  }, [lecturerCreateList, createSearchTerm, createDateSort]);

  // Filtered and sorted update list
  const filteredUpdateList = React.useMemo(() => {
    let filtered = lecturerUpdateList;

    // Filter by search term
    if (updateSearchTerm) {
      filtered = filtered.filter((item: any) =>
        item.lecturer.fullName
          ?.toLowerCase()
          .includes(updateSearchTerm.toLowerCase()),
      );
    }

    // Sort by updatedAt
    filtered = [...filtered].sort((a: any, b: any) => {
      const dateA = new Date(a.lecturer.updatedAt || a.lecturer.createdAt || 0);
      const dateB = new Date(b.lecturer.updatedAt || b.lecturer.createdAt || 0);

      if (updateDateSort === "oldest") {
        return dateA.getTime() - dateB.getTime();
      } else {
        return dateB.getTime() - dateA.getTime();
      }
    });

    return filtered;
  }, [lecturerUpdateList, updateSearchTerm, updateDateSort]);

  // Filtered and sorted degree/certificate list
  const filteredDegreeList = React.useMemo(() => {
    let filtered = lecturerRequestsDGCC;
    // Filter by search term
    if (degreeSearchTerm) {
      filtered = filtered.filter(
        (item: any) =>
          item.lecturerInfo?.fullName
            ?.toLowerCase()
            .includes(degreeSearchTerm.toLowerCase()) ||
          item.content?.name
            ?.toLowerCase()
            .includes(degreeSearchTerm.toLowerCase()) ||
          item.content?.title
            ?.toLowerCase()
            .includes(degreeSearchTerm.toLowerCase()) ||
          item.content?.description
            ?.toLowerCase()
            .includes(degreeSearchTerm.toLowerCase()),
      );
    }
    // Filter by type
    if (degreeTypeFilter) {
      filtered = filtered.filter((item: any) => item.type === degreeTypeFilter);
    }
    // Sort by date
    filtered = [...filtered].sort((a: any, b: any) => {
      const dateA = new Date(
        a.date || a.content?.updatedAt || a.content?.createdAt || 0,
      );
      const dateB = new Date(
        b.date || b.content?.updatedAt || b.content?.createdAt || 0,
      );

      if (degreeDateSort === "oldest") {
        return dateA.getTime() - dateB.getTime();
      } else {
        return dateB.getTime() - dateA.getTime();
      }
    });
    return filtered;
  }, [
    lecturerRequestsDGCC,
    degreeSearchTerm,
    degreeTypeFilter,
    degreeDateSort,
  ]);

  // Filtered and sorted course list
  const filteredCourseList = React.useMemo(() => {
    let filtered = lecturerRequestsCourse;

    // Filter by search term
    if (courseSearchTerm) {
      filtered = filtered.filter(
        (item: any) =>
          item.lecturerInfo?.fullName
            ?.toLowerCase()
            .includes(courseSearchTerm.toLowerCase()) ||
          item.content?.name
            ?.toLowerCase()
            .includes(courseSearchTerm.toLowerCase()) ||
          item.content?.title
            ?.toLowerCase()
            .includes(courseSearchTerm.toLowerCase()) ||
          item.content?.description
            ?.toLowerCase()
            .includes(courseSearchTerm.toLowerCase()),
      );
    }

    // Filter by type
    if (courseTypeFilter) {
      filtered = filtered.filter((item: any) => item.type === courseTypeFilter);
    }

    // Sort by date
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
  }, [lecturerRequests, courseSearchTerm, courseTypeFilter, courseDateSort]);

  const emptyRows = 10 - visibleRows.length > 0 ? 10 - visibleRows.length : 0;

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleAcademicRankFilter = (value: string) => {
    setAcademicRankFilter(value);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return "warning";
      case "APPROVED":
        return "info";
      case "REJECTED":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return "Chờ duyệt";
      case "APPROVED":
        return "Đã duyệt";
      case "REJECTED":
        return "Đã từ chối";
      default:
        return status || "Không xác định";
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

  const handleChange = (_event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
    <Box
      sx={{
        width: "100%",
        typography: "body1",
        bgcolor: "background.default",
        minHeight: "fix",
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
              aria-label="lecturer management tabs"
              sx={{ px: 2 }}
            >
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <span>Giảng viên</span>
                    <Chip
                      size="small"
                      label={filteredLecturers.length}
                      color="primary"
                    />
                  </Box>
                }
                value="1"
              />
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <span>Tạo mới</span>
                    <Chip
                      size="small"
                      label={filteredCreateList.length}
                      color="success"
                    />
                  </Box>
                }
                value="2"
              />
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <span>Cập nhật</span>
                    <Chip
                      size="small"
                      label={filteredUpdateList.length}
                      color="warning"
                    />
                  </Box>
                }
                value="3"
              />
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <span>Chứng chỉ/Bằng cấp</span>
                    <Chip
                      size="small"
                      label={filteredDegreeList.length}
                      color="secondary"
                    />
                  </Box>
                }
                value="4"
              />
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <span>Khóa đào tạo</span>
                    <Chip
                      size="small"
                      label={filteredCourseList.length}
                      color="info"
                    />
                  </Box>
                }
                value="5"
              />
            </TabList>
          </Box>
        </Paper>

        <TabPanel value="1" sx={{ p: 0 }}>
          <Paper sx={{ width: "100%", borderRadius: 2, overflow: "hidden" }}>
            <EnhancedTableToolbar
              numSelected={selected ? 1 : 0}
              onEdit={() => {
                const lecturer = lecturers.find(
                  (l: Lecturer) => l.id === selected,
                );
                setSelectedLecturerUpdate({ lecturer });
                setOpenUpdateDialog(true);
              }}
              onSearch={handleSearch}
              searchTerm={searchTerm}
              onAcademicRankFilter={handleAcademicRankFilter}
              academicRankFilter={academicRankFilter}
              onStatusFilter={handleStatusFilter}
              statusFilter={statusFilter}
            />
            <TableContainer
              sx={{
                maxHeight: 10 * 53 + 56,
                width: "100%",
                overflowY: "auto",
                overflowX: "auto",
              }}
            >
              <Table
                sx={{ minWidth: 900, width: "100%" }}
                aria-labelledby="tableTitle"
              >
                <EnhancedTableHead
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={filteredLecturers.length}
                />
                <TableBody>
                  {visibleRows.map((row, index) => {
                    const isItemSelected = selected === row.id;
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
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
                          {row.id}
                        </TableCell>
                        <TableCell>{row.fullName}</TableCell>
                        <TableCell>
                          <Chip
                            label={getAcademicRankLabel(row.academicRank)}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        </TableCell>
                        <TableCell>{row.specialization}</TableCell>
                        <TableCell align="right">
                          {row.experienceYears}
                        </TableCell>
                        <TableCell>{row.jobField}</TableCell>
                        <TableCell>
                          {row.dateOfBirth
                            ? new Date(row.dateOfBirth).toLocaleDateString(
                                "vi-VN",
                              )
                            : ""}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.gender ? "Nam" : "Nữ"}
                            size="small"
                            color={row.gender ? "info" : "secondary"}
                          />
                        </TableCell>
                        <TableCell>{row.phoneNumber}</TableCell>
                        <TableCell>
                          <Chip
                            label={getStatusLabel(row.status)}
                            size="small"
                            color={getStatusColor(row.status) as any}
                            variant="filled"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            variant="outlined"
                            size="small"
                            color="primary"
                            onClick={() =>
                              window.open(`/lecturer-info/${row.id}`, "_blank")
                            }
                            sx={{ minWidth: 100 }}
                          >
                            Xem chi tiết
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
                      <TableCell colSpan={11} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <LecturerUpdateDialog
              open={openUpdateDialog}
              onClose={() => setOpenUpdateDialog(false)}
              lecturer={selectedLecturerUpdate?.lecturer}
            />
          </Paper>
        </TabPanel>
        <TabPanel value="2">
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "primary.main", mb: 1 }}
            >
              Yêu cầu đăng ký giảng viên mới
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Danh sách các yêu cầu đăng ký từ giảng viên chờ phê duyệt
            </Typography>
          </Box>

          {/* Filter Controls for Create Tab */}
          <Paper sx={{ mb: 3, p: 2, borderRadius: 2 }}>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {/* Date Sort Filter */}
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel id="create-date-sort-label">
                  Sắp xếp theo ngày
                </InputLabel>
                <Select
                  labelId="create-date-sort-label"
                  value={createDateSort}
                  label="Sắp xếp theo ngày"
                  onChange={(e) => setCreateDateSort(e.target.value)}
                >
                  <MenuItem value="oldest">Cũ nhất trước</MenuItem>
                  <MenuItem value="newest">Mới nhất trước</MenuItem>
                </Select>
              </FormControl>

              {/* Name Search */}
              <TextField
                variant="outlined"
                size="small"
                placeholder="Tìm kiếm theo tên giảng viên..."
                value={createSearchTerm}
                onChange={(e) => setCreateSearchTerm(e.target.value)}
                sx={{ minWidth: 300 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: createSearchTerm && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setCreateSearchTerm("")}
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Typography variant="body2" color="text.secondary">
                Tổng cộng: {filteredCreateList.length} yêu cầu
              </Typography>
            </Box>
          </Paper>

          {filteredCreateList && filteredCreateList.length > 0 ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                  md: "1fr 1fr 1fr",
                  lg: "1fr 1fr 1fr 1fr",
                },
                gap: 3,
              }}
            >
              {filteredCreateList.map((item: any) => (
                <Card
                  key={item.lecturer.id}
                  sx={{
                    height: "100%",
                    transition: "all 0.3s ease",
                    border: "2px solid",
                    borderColor: "success.light",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 4,
                      borderColor: "success.main",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Avatar
                        src={`${BASE_URL}/${item.lecturer.avatarUrl}` || ""}
                        sx={{ bgcolor: "success.main", mr: 2 }}
                      >
                        {item.lecturer.fullName?.charAt(0)}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: "bold", mb: 0.5 }}
                        >
                          {item.lecturer.fullName}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Chip
                            label={getAcademicRankLabel(
                              item.lecturer.academicRank,
                            )}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                          <Chip
                            label="Đăng ký mới"
                            size="small"
                            color="success"
                          />
                        </Box>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        <strong>Chuyên ngành:</strong>{" "}
                        {item.lecturer.specialization}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        <strong>Kinh nghiệm:</strong>{" "}
                        {item.lecturer.experienceYears} năm
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        <strong>Lĩnh vực:</strong> {item.lecturer.jobField}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        <strong>Thời gian:</strong>{" "}
                        {(() => {
                          if (!item.lecturer.updatedAt) return "Chưa cập nhật";

                          const now = new Date();
                          const updatedTime = new Date(item.lecturer.updatedAt);
                          const diffInHours = Math.floor(
                            (now.getTime() - updatedTime.getTime()) /
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
                    </Box>

                    <Button
                      variant="contained"
                      color="success"
                      fullWidth
                      sx={{ mt: "auto" }}
                      onClick={() => {
                        setSelectedLecturerCreate(item);
                        setOpenCreateDialog(true);
                      }}
                    >
                      Xem chi tiết
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : (
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                Không có yêu cầu nào
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hiện tại không có yêu cầu đăng ký giảng viên mới nào cần xử lý.
              </Typography>
            </Paper>
          )}
          <LecturerDetailDialog
            open={openCreateDialog}
            onClose={() => setOpenCreateDialog(false)}
            lecturer={selectedLecturerCreate?.lecturer || {}}
            degrees={selectedLecturerCreate?.degrees || []}
            certificates={selectedLecturerCreate?.certificates || []}
          />
        </TabPanel>
        <TabPanel value="3">
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "primary.main", mb: 1 }}
            >
              Yêu cầu cập nhật thông tin giảng viên
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Danh sách các yêu cầu cập nhật thông tin từ giảng viên chờ phê
              duyệt
            </Typography>
          </Box>

          {/* Filter Controls for Update Tab */}
          <Paper sx={{ mb: 3, p: 2, borderRadius: 2 }}>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {/* Date Sort Filter */}
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel id="update-date-sort-label">
                  Sắp xếp theo ngày
                </InputLabel>
                <Select
                  labelId="update-date-sort-label"
                  value={updateDateSort}
                  label="Sắp xếp theo ngày"
                  onChange={(e) => setUpdateDateSort(e.target.value)}
                >
                  <MenuItem value="oldest">Cũ nhất trước</MenuItem>
                  <MenuItem value="newest">Mới nhất trước</MenuItem>
                </Select>
              </FormControl>

              {/* Name Search */}
              <TextField
                variant="outlined"
                size="small"
                placeholder="Tìm kiếm theo tên giảng viên..."
                value={updateSearchTerm}
                onChange={(e) => setUpdateSearchTerm(e.target.value)}
                sx={{ minWidth: 300 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: updateSearchTerm && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setUpdateSearchTerm("")}
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Typography variant="body2" color="text.secondary">
                Tổng cộng: {filteredUpdateList.length} yêu cầu
              </Typography>
            </Box>
          </Paper>

          {filteredUpdateList && filteredUpdateList.length > 0 ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                  md: "1fr 1fr 1fr",
                  lg: "1fr 1fr 1fr 1fr",
                },
                gap: 3,
              }}
            >
              {filteredUpdateList.map((item: any) => (
                <Card
                  key={item.lecturer.id}
                  sx={{
                    height: "100%",
                    transition: "all 0.3s ease",
                    border: "2px solid",
                    borderColor: "warning.light",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 4,
                      borderColor: "warning.main",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Avatar
                       src={`${BASE_URL}/${item.lecturer.avatarUrl}` || ""}
                        sx={{ bgcolor: "warning.main", mr: 2 }}
                      >
                        {item.lecturer.fullName?.charAt(0)}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: "bold", mb: 0.5 }}
                        >
                          {item.lecturer.fullName}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Chip
                            label={getAcademicRankLabel(
                              item.lecturer.academicRank,
                            )}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                          <Chip label="Cập nhật" size="small" color="warning" />
                        </Box>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        <strong>Chuyên ngành:</strong>{" "}
                        {item.lecturer.specialization}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        <strong>Kinh nghiệm:</strong>{" "}
                        {item.lecturer.experienceYears} năm
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        <strong>Lĩnh vực:</strong> {item.lecturer.jobField}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        <strong>Thời gian:</strong>{" "}
                        {(() => {
                          if (!item.lecturer.updatedAt) return "Chưa cập nhật";

                          const now = new Date();
                          const updatedTime = new Date(item.lecturer.updatedAt);
                          const diffInHours = Math.floor(
                            (now.getTime() - updatedTime.getTime()) /
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
                    </Box>

                    <Button
                      variant="contained"
                      color="warning"
                      fullWidth
                      sx={{ mt: "auto" }}
                      onClick={() => {
                        setSelectedLecturerUpdate(item);
                        setOpenUpdateDialog(true);
                      }}
                    >
                      Xem chi tiết
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : (
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                Không có yêu cầu nào
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hiện tại không có yêu cầu cập nhật thông tin giảng viên nào cần
                xử lý.
              </Typography>
            </Paper>
          )}
          <LecturerDetailUpdateDialog
            open={openUpdateDialog}
            onClose={() => setOpenUpdateDialog(false)}
            lecturer={selectedLecturerUpdate?.lecturer || {}}
            lecturerUpdate={selectedLecturerUpdate?.lecturerUpdate || {}}
          />
        </TabPanel>

        <TabPanel value="4">
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "primary.main", mb: 1 }}
            >
              Yêu cầu chứng chỉ và bằng cấp
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Danh sách các yêu cầu tạo mới và cập nhật chứng chỉ, bằng cấp từ
              giảng viên
            </Typography>
          </Box>

          {/* Filter Controls for Degree Tab */}
          <Paper sx={{ mb: 3, p: 2, borderRadius: 2 }}>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {/* Type Filter */}
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel id="degree-type-select-label">Loại</InputLabel>
                <Select
                  labelId="degree-type-select-label"
                  value={degreeTypeFilter}
                  label="Loại"
                  onChange={(e) => setDegreeTypeFilter(e.target.value)}
                >
                  <MenuItem value="">
                    <em>Tất cả</em>
                  </MenuItem>
                  <MenuItem value="BC">Bằng cấp</MenuItem>
                  <MenuItem value="CC">Chứng chỉ</MenuItem>
                </Select>
              </FormControl>

              {/* Date Sort Filter */}
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel id="degree-date-sort-label">
                  Sắp xếp theo ngày
                </InputLabel>
                <Select
                  labelId="degree-date-sort-label"
                  value={degreeDateSort}
                  label="Sắp xếp theo ngày"
                  onChange={(e) => setDegreeDateSort(e.target.value)}
                >
                  <MenuItem value="oldest">Cũ nhất trước</MenuItem>
                  <MenuItem value="newest">Mới nhất trước</MenuItem>
                </Select>
              </FormControl>

              {/* Search Bar */}
              <TextField
                variant="outlined"
                size="small"
                placeholder="Theo tên giảng viên, tên bằng cấp..."
                value={degreeSearchTerm}
                onChange={(e) => setDegreeSearchTerm(e.target.value)}
                sx={{ minWidth: 350 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: degreeSearchTerm && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setDegreeSearchTerm("")}
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Typography variant="body2" color="text.secondary">
                Tổng cộng: {filteredDegreeList.length} yêu cầu
              </Typography>
            </Box>
          </Paper>

          {filteredDegreeList && filteredDegreeList.length > 0 ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                  md: "1fr 1fr 1fr",
                  lg: "1fr 1fr 1fr 1fr",
                },
                gap: 3,
              }}
            >
              {filteredDegreeList.map((item: any, index: number) => {
                // Get data source based on label
                const contentData =
                  item.label === "Update"
                    ? item.content?.original
                    : item.content;

                return (
                  <Card
                    key={index}
                    sx={{
                      height: "100%",
                      transition: "all 0.3s ease",
                      border: "2px solid",
                      borderColor:
                        item.label === "Create"
                          ? "success.light"
                          : "warning.light",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 4,
                        borderColor:
                          item.label === "Create"
                            ? "success.main"
                            : "warning.main",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <Avatar
                          src={`${BASE_URL}/${item.lecturerInfo?.avatarUrl}` || ""}
                          sx={{
                            bgcolor:
                              item.label === "Create"
                                ? "success.main"
                                : "warning.main",
                            mr: 2,
                          }}
                        >
                          {item.lecturerInfo?.fullName?.charAt(0)}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: "bold", mb: 0.5 }}
                          >
                            {item.lecturerInfo?.fullName}
                          </Typography>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Chip
                              label={
                                item.type === "BC" ? "Bằng cấp" : "Chứng chỉ"
                              }
                              size="small"
                              variant="outlined"
                            />
                            <Chip label={item.label} size="small" />
                          </Box>
                        </Box>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          <strong>Tên:</strong> {contentData?.name}
                        </Typography>

                        {item.type === "BC" ? (
                          <>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 1 }}
                            >
                              <strong>Chuyên ngành:</strong>{" "}
                              {contentData?.major}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 1 }}
                            >
                              <strong>Trình độ:</strong> {contentData?.level}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 1 }}
                            >
                              <strong>Năm tốt nghiệp:</strong>{" "}
                              {contentData?.graduationYear}
                            </Typography>
                          </>
                        ) : (
                          <>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 1 }}
                            >
                              <strong>Tổ chức cấp:</strong>{" "}
                              {contentData?.issuedBy}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 1 }}
                            >
                              <strong>Ngày cấp:</strong>{" "}
                              {contentData?.issueDate
                                ? new Date(
                                    contentData.issueDate,
                                  ).toLocaleDateString("vi-VN")
                                : ""}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 1 }}
                            >
                              <strong>Thời hạn:</strong>{" "}
                              {contentData?.expiryDate && contentData?.issueDate
                                ? `${new Date(contentData.expiryDate).getFullYear() - new Date(contentData.issueDate).getFullYear()} năm`
                                : "Vô thời hạn"}
                            </Typography>
                          </>
                        )}

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          <strong>Thời gian:</strong>{" "}
                          {(() => {
                            const dateStr =
                              item.date ||
                              contentData?.updatedAt ||
                              contentData?.createdAt;
                            if (!dateStr) return "Chưa cập nhật";

                            const now = new Date();
                            const requestTime = new Date(dateStr);
                            const diffInHours = Math.floor(
                              (now.getTime() - requestTime.getTime()) /
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
                      </Box>

                      <Button
                        variant="contained"
                        color={item.label === "Create" ? "success" : "warning"}
                        fullWidth
                        sx={{ mt: "auto" }}
                        onClick={() => {
                          console.log("View details for:", item);
                        }}
                      >
                        Xem chi tiết
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          ) : (
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                Không có yêu cầu nào
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hiện tại không có yêu cầu chứng chỉ/bằng cấp nào cần xử lý.
              </Typography>
            </Paper>
          )}
        </TabPanel>

        <TabPanel value="5">
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "primary.main", mb: 1 }}
            >
              Yêu cầu khóa đào tạo và hoạt động
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Danh sách các yêu cầu tạo mới và cập nhật khóa học, hoạt động, báo
              cáo từ giảng viên
            </Typography>
          </Box>

          {/* Filter Controls for Course Tab */}
          <Paper sx={{ mb: 3, p: 2, borderRadius: 2 }}>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {/* Type Filter */}
              <FormControl size="small" sx={{ minWidth: 250 }}>
                <InputLabel id="course-type-select-label">Loại</InputLabel>
                <Select
                  labelId="course-type-select-label"
                  value={courseTypeFilter}
                  label="Loại"
                  onChange={(e) => setCourseTypeFilter(e.target.value)}
                >
                  <MenuItem value="">
                    <em>Tất cả</em>
                  </MenuItem>
                  <MenuItem value="OC">Khóa đào tạo cung cấp</MenuItem>
                  <MenuItem value="AC">Khóa đào tạo được học</MenuItem>
                  <MenuItem value="RP">Nghiên cứu khoa học</MenuItem>
                </Select>
              </FormControl>

              {/* Date Sort Filter */}
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel id="course-date-sort-label">
                  Sắp xếp theo ngày
                </InputLabel>
                <Select
                  labelId="course-date-sort-label"
                  value={courseDateSort}
                  label="Sắp xếp theo ngày"
                  onChange={(e) => setCourseDateSort(e.target.value)}
                >
                  <MenuItem value="oldest">Cũ nhất trước</MenuItem>
                  <MenuItem value="newest">Mới nhất trước</MenuItem>
                </Select>
              </FormControl>

              {/* Search Bar */}
              <TextField
                variant="outlined"
                size="small"
                placeholder="Theo tên giảng viên, tên khóa học..."
                value={courseSearchTerm}
                onChange={(e) => setCourseSearchTerm(e.target.value)}
                sx={{ minWidth: 350 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
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

              <Typography variant="body2" color="text.secondary">
                Tổng cộng: {filteredCourseList.length} yêu cầu
              </Typography>
            </Box>
          </Paper>

          {filteredCourseList && filteredCourseList.length > 0 ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                  md: "1fr 1fr 1fr",
                  lg: "1fr 1fr 1fr 1fr",
                },
                gap: 3,
              }}
            >
              {filteredCourseList.map((item: any, index: number) => {
                // Get data source based on label
                const contentData =
                  item.label === "Update"
                    ? item.content?.original
                    : item.content;

                return (
                  <Card
                    key={`course-${item.type}-${item.content?.id}-${item.label}-${index}`}
                    sx={{
                      height: "100%",
                      transition: "all 0.3s ease",
                      border: "2px solid",
                      borderColor:
                        item.label === "Create"
                          ? "success.light"
                          : "warning.light",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 4,
                        borderColor:
                          item.label === "Create"
                            ? "success.main"
                            : "warning.main",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <Avatar
                          src={item.lecturerInfo?.avatarUrl || ""}
                          sx={{
                            bgcolor:
                              item.label === "Create"
                                ? "success.main"
                                : "warning.main",
                            mr: 2,
                          }}
                        >
                          {item.lecturerInfo?.fullName?.charAt(0)}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: "bold", mb: 0.5 }}
                          >
                            {item.lecturerInfo?.fullName}
                          </Typography>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Chip
                              label={item.type}
                              size="small"
                              variant="outlined"
                            />
                            <Chip label={item.label} size="small" />
                          </Box>
                        </Box>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          <strong>Tên:</strong>{" "}
                          {contentData?.title || contentData?.name}
                        </Typography>

                        {contentData?.topic && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              mb: 1,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            <strong>Chuyên đề:</strong> {contentData.topic}
                          </Typography>
                        )}

                        {contentData?.courseType && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                          >
                            <strong>Loại hình:</strong>{" "}
                            {contentData.courseType === "FORMAL"
                              ? "Chính quy"
                              : contentData.courseType === "SPECIALIZED"
                                ? "Chuyên đề"
                                : contentData.courseType === "EXTRACURRICULAR"
                                  ? "Ngoại khóa"
                                  : "Khác"}
                          </Typography>
                        )}
                        {contentData?.researchArea && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                          >
                            <strong>Loại hình:</strong>{" "}
                            {contentData.researchArea}
                          </Typography>
                        )}
                        {/* RESEARCH,     // Nghiên cứu khoa học
    TOPIC,        // Đề tài
    PROJECT       // Dự án */}
                        {contentData?.projectType && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                          >
                            <strong>Loại:</strong>{" "}
                            {contentData.projectType === "RESEARCH"
                              ? "Nghiên cứu khoa học"
                              : contentData.projectType === "TOPIC"
                                ? "Đề tài"
                                : contentData.projectType === "PROJECT"
                                  ? "Dự án"
                                  : "Khác"}
                          </Typography>
                        )}
                        {contentData?.scale && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                          >
                            <strong>Quy mô:</strong>{" "}
                            {contentData.scale === "INSTITUTIONAL"
                              ? "Cấp đơn vị"
                              : contentData.scale === "NATIONAL"
                                ? "Cấp quốc gia"
                                : contentData.scale === "INTERNATIONAL"
                                  ? "Cấp quốc tế"
                                  : contentData.scale === "UNIVERSITY"
                                    ? "Cấp trường"
                                    : contentData.scale === "DEPARTMENTAL"
                                      ? "Cấp khoa/ tỉnh"
                                      : contentData.scale === "MINISTERIAL"
                                        ? "Cấp bộ"
                                        : "Khác"}
                          </Typography>
                        )}

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          <strong>Thời gian:</strong>{" "}
                          {(() => {
                            const dateStr =
                              item.date ||
                              contentData?.updatedAt ||
                              contentData?.createdAt;
                            if (!dateStr) return "Chưa cập nhật";

                            const now = new Date();
                            const requestTime = new Date(dateStr);
                            const diffInHours = Math.floor(
                              (now.getTime() - requestTime.getTime()) /
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
                      </Box>

                      <Button
                        variant="contained"
                        color={item.label === "Create" ? "success" : "warning"}
                        fullWidth
                        sx={{ mt: "auto" }}
                        onClick={() => {
                          console.log("View details for:", item);
                        }}
                      >
                        Xem chi tiết
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          ) : (
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                Không có yêu cầu nào
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hiện tại không có yêu cầu khóa đào tạo/hoạt động nào cần xử lý.
              </Typography>
            </Paper>
          )}
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default AdminLecturerPage;
