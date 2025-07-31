import { useEffect, useState, type SyntheticEvent } from "react";

import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Tab from "@mui/material/Tab";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import DateRange from "@mui/icons-material/DateRange";
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
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import TextField from "@mui/material/TextField";
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
  // { id: "id", numeric: true, disablePadding: false, label: "ID" },
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

const AdminLecturerPage = () => {
  // const domain = window.location.hostname;
  // const BASE_URL = `http://${domain}:8080`;

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

  const [createSearchTerm, setCreateSearchTerm] = useState("");
  const [createDateSort, setCreateDateSort] = useState("oldest");

  const [updateSearchTerm, setUpdateSearchTerm] = useState("");
  const [updateDateSort, setUpdateDateSort] = useState("oldest");

  const [degreeSearchTerm, setDegreeSearchTerm] = useState("");
  const [degreeTypeFilter, setDegreeTypeFilter] = useState("");
  const [degreeDateSort, setDegreeDateSort] = useState("oldest");

  const [courseSearchTerm, setCourseSearchTerm] = useState("");
  const [courseTypeFilter, setCourseTypeFilter] = useState("");
  const [courseDateSort, setCourseDateSort] = useState("oldest");

  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Lecturer>("id");
  const [selected, setSelected] = React.useState<string | null>(null);

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
        console.log(res.data.data);
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
          lecturer.id?.toString().includes(searchTerm) ||
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
        item.lecturer.id?.toString().includes(createSearchTerm) ||
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
        item.lecturer.id?.toString().includes(updateSearchTerm) ||
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
        minHeight: "100vh",
        p: 3,
      }}
    >
      <TabContext value={value}>
        <Paper
          sx={{
            mb: 3,
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
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
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                px: { xs: 1, sm: 3 },
                "& .MuiTab-root": {
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: { xs: "0.85rem", sm: "1rem" },
                  minWidth: { xs: "auto", sm: "160px" },
                  padding: { xs: "8px 12px", sm: "12px 16px" },
                  whiteSpace: "nowrap",
                },
                "& .MuiTabs-scrollButtons": {
                  "&.Mui-disabled": {
                    opacity: 0.3,
                  },
                },
                "& .MuiTabScrollButton-root": {
                  width: { xs: 32, sm: 48 },
                  "&:first-of-type": {
                    ml: { xs: 0, sm: 1 },
                  },
                  "&:last-of-type": {
                    mr: { xs: 0, sm: 1 },
                  },
                },
              }}
            >
              <Tab
                label={
                  <Box sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: { xs: 0.5, sm: 1 },
                    flexWrap: "nowrap"
                  }}>
                    <span>Giảng viên</span>
                    <Chip
                      size="small"
                      label={filteredLecturers.length}
                      color="primary"
                      sx={{ 
                        fontWeight: 600,
                        minWidth: "auto",
                        height: { xs: 18, sm: 20 },
                        fontSize: { xs: "0.7rem", sm: "0.75rem" },
                        "& .MuiChip-label": {
                          px: { xs: 0.5, sm: 1 }
                        }
                      }}
                    />
                  </Box>
                }
                value="1"
              />
              <Tab
                label={
                  <Box sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: { xs: 0.5, sm: 1 },
                    flexWrap: "nowrap"
                  }}>
                    <span>Tạo mới</span>
                    <Chip
                      size="small"
                      label={filteredCreateList.length}
                      color="success"
                      sx={{ 
                        fontWeight: 600,
                        minWidth: "auto",
                        height: { xs: 18, sm: 20 },
                        fontSize: { xs: "0.7rem", sm: "0.75rem" },
                        "& .MuiChip-label": {
                          px: { xs: 0.5, sm: 1 }
                        }
                      }}
                    />
                  </Box>
                }
                value="2"
              />
              <Tab
                label={
                  <Box sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: { xs: 0.5, sm: 1 },
                    flexWrap: "nowrap"
                  }}>
                    <span>Cập nhật</span>
                    <Chip
                      size="small"
                      label={filteredUpdateList.length}
                      color="warning"
                      sx={{ 
                        fontWeight: 600,
                        minWidth: "auto",
                        height: { xs: 18, sm: 20 },
                        fontSize: { xs: "0.7rem", sm: "0.75rem" },
                        "& .MuiChip-label": {
                          px: { xs: 0.5, sm: 1 }
                        }
                      }}
                    />
                  </Box>
                }
                value="3"
              />
              <Tab
                label={
                  <Box sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: { xs: 0.5, sm: 1 },
                    flexWrap: "nowrap"
                  }}>
                    <span style={{ whiteSpace: "nowrap" }}>Chứng chỉ/Bằng cấp</span>
                    <Chip
                      size="small"
                      label={filteredDegreeList.length}
                      color="secondary"
                      sx={{ 
                        fontWeight: 600,
                        minWidth: "auto",
                        height: { xs: 18, sm: 20 },
                        fontSize: { xs: "0.7rem", sm: "0.75rem" },
                        "& .MuiChip-label": {
                          px: { xs: 0.5, sm: 1 }
                        }
                      }}
                    />
                  </Box>
                }
                value="4"
              />
              <Tab
                label={
                  <Box sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: { xs: 0.5, sm: 1 },
                    flexWrap: "nowrap"
                  }}>
                    <span style={{ whiteSpace: "nowrap" }}>Khóa đào tạo</span>
                    <Chip
                      size="small"
                      label={filteredCourseList.length}
                      color="info"
                      sx={{ 
                        fontWeight: 600,
                        minWidth: "auto",
                        height: { xs: 18, sm: 20 },
                        fontSize: { xs: "0.7rem", sm: "0.75rem" },
                        "& .MuiChip-label": {
                          px: { xs: 0.5, sm: 1 }
                        }
                      }}
                    />
                  </Box>
                }
                value="5"
              />
            </TabList>
          </Box>
        </Paper>

        <TabPanel value="1" sx={{ p: 0 }}>
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
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    width: 56,
                    height: 56,
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{ color: "white", fontWeight: 700 }}
                  >
                    👨‍🏫
                  </Typography>
                </Avatar>
                <Box>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: "#2c3e50", mb: 0.5 }}
                  >
                    Quản lý Giảng viên
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#6c757d" }}>
                    {searchTerm ||
                    academicRankFilter ||
                    statusFilter !== "APPROVED"
                      ? `Đã lọc ${filteredLecturers?.length || 0} giảng viên`
                      : `Tổng cộng ${filteredLecturers?.length || 0} giảng viên`}
                  </Typography>
                </Box>
              </Box>

              {selected && (
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Tooltip title="Chỉnh sửa">
                    <IconButton
                      sx={{
                        bgcolor: "primary.main",
                        color: "white",
                        width: 48,
                        height: 48,
                        "&:hover": {
                          bgcolor: "primary.dark",
                          transform: "scale(1.05)",
                        },
                      }}
                      onClick={() => {
                        const lecturer = lecturers.find(
                          (l: Lecturer) => l.id === selected,
                        );
                        setSelectedLecturerUpdate({ lecturer });
                        setOpenUpdateDialog(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <IconButton
                      sx={{
                        bgcolor: "error.main",
                        color: "white",
                        width: 48,
                        height: 48,
                        "&:hover": {
                          bgcolor: "error.dark",
                          transform: "scale(1.05)",
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
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
              <Box sx={{ minWidth: 150, flex: "0 0 auto" }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Học hàm</InputLabel>
                  <Select
                    value={academicRankFilter}
                    label="Học hàm"
                    onChange={(e) => setAcademicRankFilter(e.target.value)}
                    sx={{
                      bgcolor: "white",
                      borderRadius: 2,
                    }}
                  >
                    <MenuItem value="">
                      <em>Tất cả</em>
                    </MenuItem>
                    <MenuItem value="CN">Cử nhân</MenuItem>
                    <MenuItem value="THS">Thạc sĩ</MenuItem>
                    <MenuItem value="TS">Tiến sĩ</MenuItem>
                    <MenuItem value="PGS">Phó giáo sư</MenuItem>
                    <MenuItem value="GS">Giáo sư</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ minWidth: 150, flex: "0 0 auto" }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Trạng thái</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Trạng thái"
                    onChange={(e) => setStatusFilter(e.target.value)}
                    sx={{
                      bgcolor: "white",
                      borderRadius: 2,
                    }}
                  >
                    <MenuItem value="">Tất cả</MenuItem>
                    <MenuItem value="APPROVED">Đã duyệt</MenuItem>
                    <MenuItem value="PENDING">Chờ duyệt</MenuItem>
                    <MenuItem value="REJECTED">Đã từ chối</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ flex: "1 1 300px", minWidth: 300 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="🔍 Tìm kiếm theo ID, tên, chuyên ngành, lĩnh vực..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                    endAdornment: searchTerm && (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setSearchTerm("")}
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
            {(searchTerm ||
              academicRankFilter ||
              statusFilter !== "APPROVED") && (
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

                {academicRankFilter && (
                  <Chip
                    label={`Học hàm: ${getAcademicRankLabel(academicRankFilter)}`}
                    size="small"
                    onDelete={() => setAcademicRankFilter("")}
                    color="secondary"
                    variant="outlined"
                  />
                )}

                {statusFilter !== "APPROVED" && statusFilter && (
                  <Chip
                    label={`Trạng thái: ${getStatusLabel(statusFilter)}`}
                    size="small"
                    onDelete={() => setStatusFilter("APPROVED")}
                    color="success"
                    variant="outlined"
                  />
                )}

                <Button
                  size="small"
                  onClick={() => {
                    setSearchTerm("");
                    setAcademicRankFilter("");
                    setStatusFilter("APPROVED");
                  }}
                  sx={{ ml: 1, textTransform: "none" }}
                >
                  Xóa tất cả
                </Button>
              </Box>
            )}
          </Paper>

          <Paper
            sx={{
              width: "100%",
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
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
                  {visibleRows.map((row, _index) => {
                    const isItemSelected = selected === row.id;
                    // const labelId = `enhanced-table-checkbox-${index}`;

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
                          {/* <TableCell
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
                          </TableCell> */}
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

        <TabPanel value="2" sx={{ p: 0 }}>
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
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    width: 56,
                    height: 56,
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{ color: "white", fontWeight: 700 }}
                  >
                    ✨
                  </Typography>
                </Avatar>
                <Box>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: "#2c3e50", mb: 0.5 }}
                  >
                    Yêu cầu đăng ký giảng viên mới
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#6c757d" }}>
                    {createSearchTerm
                      ? `Đã lọc ${filteredCreateList?.length || 0} yêu cầu`
                      : `Tổng cộng ${filteredCreateList?.length || 0} yêu cầu đăng ký chờ phê duyệt`}
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
              <Box sx={{ minWidth: 180, flex: "0 0 auto" }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Sắp xếp theo ngày</InputLabel>
                  <Select
                    value={createDateSort}
                    label="Sắp xếp theo ngày"
                    onChange={(e) => setCreateDateSort(e.target.value)}
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

              <Box sx={{ flex: "1 1 300px", minWidth: 300 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="🔍 Tìm kiếm theo ID, tên giảng viên..."
                  value={createSearchTerm}
                  onChange={(e) => setCreateSearchTerm(e.target.value)}
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
              </Box>
            </Box>

            {/* Active Filters Display */}
            {(createSearchTerm || createDateSort !== "oldest") && (
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

                {createSearchTerm && (
                  <Chip
                    label={`Tìm kiếm: "${createSearchTerm}"`}
                    size="small"
                    onDelete={() => setCreateSearchTerm("")}
                    color="primary"
                    variant="outlined"
                  />
                )}

                {createDateSort !== "oldest" && (
                  <Chip
                    label={`Sắp xếp: ${createDateSort === "newest" ? "Mới nhất trước" : "Cũ nhất trước"}`}
                    size="small"
                    onDelete={() => setCreateDateSort("oldest")}
                    color="info"
                    variant="outlined"
                    icon={<DateRange />}
                  />
                )}

                <Button
                  size="small"
                  onClick={() => {
                    setCreateSearchTerm("");
                    setCreateDateSort("oldest");
                  }}
                  sx={{ ml: 1, textTransform: "none" }}
                >
                  Xóa tất cả
                </Button>
              </Box>
            )}
          </Paper>

          {filteredCreateList && filteredCreateList.length > 0 ? (
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
              {filteredCreateList.map((item: any) => (
                <Card
                  key={item.lecturer.id}
                  sx={{
                    transition: "all 0.3s ease",
                    border: "2px solid",
                    borderColor: "success.light",
                    borderRadius: 3,
                    height: "fit-content",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                      borderColor: "success.main",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Avatar
                          src={item.lecturer.avatarUrl}
                          sx={{
                            bgcolor: "success.main",
                            width: 50,
                            height: 50,
                            fontSize: "1.2rem",
                            fontWeight: 700,
                          }}
                        >
                          {item.lecturer.fullName?.charAt(0)}
                        </Avatar>

                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              color: "text.primary",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item.lecturer.fullName}
                          </Typography>
                          <Box sx={{ display: "flex", gap: 0.5, mt: 0.5 }}>
                            <Chip
                              label={getAcademicRankLabel(
                                item.lecturer.academicRank,
                              )}
                              size="small"
                              color="primary"
                              variant="outlined"
                              sx={{ fontSize: "0.7rem", height: 20 }}
                            />
                            <Chip
                              label="Mới"
                              size="small"
                              color="success"
                              sx={{ fontSize: "0.7rem", height: 20 }}
                            />
                          </Box>
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1.5,
                        }}
                      >
                        <Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontWeight: 600, mb: 0.5 }}
                          >
                            Chuyên ngành
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 500,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item.lecturer.specialization}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontWeight: 600, mb: 0.5 }}
                            >
                              Kinh nghiệm
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 500 }}
                            >
                              {item.lecturer.experienceYears} năm
                            </Typography>
                          </Box>

                          <Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontWeight: 600, mb: 0.5 }}
                            >
                              Thời gian
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 500, fontSize: "0.75rem" }}
                            >
                              {(() => {
                                if (!item.lecturer.updatedAt)
                                  return "Chưa cập nhật";

                                const now = new Date();
                                const updatedTime = new Date(
                                  item.lecturer.updatedAt,
                                );
                                const diffInHours = Math.floor(
                                  (now.getTime() - updatedTime.getTime()) /
                                    (1000 * 60 * 60),
                                );

                                if (diffInHours < 1) {
                                  return "Vừa cập nhật";
                                } else if (diffInHours < 48) {
                                  return `${diffInHours}h trước`;
                                } else {
                                  const diffInDays = Math.floor(
                                    diffInHours / 24,
                                  );
                                  return `${diffInDays}d trước`;
                                }
                              })()}
                            </Typography>
                          </Box>
                        </Box>

                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          fullWidth
                          sx={{
                            mt: 1,
                            py: 1,
                            fontWeight: 600,
                            textTransform: "none",
                            borderRadius: 2,
                            fontSize: "0.8rem",
                          }}
                          onClick={() => {
                            setSelectedLecturerCreate(item);
                            setOpenCreateDialog(true);
                          }}
                        >
                          Xem chi tiết
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
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

        <TabPanel value="3" sx={{ p: 0 }}>
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
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    width: 56,
                    height: 56,
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{ color: "white", fontWeight: 700 }}
                  >
                    🔄
                  </Typography>
                </Avatar>
                <Box>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: "#2c3e50", mb: 0.5 }}
                  >
                    Yêu cầu cập nhật thông tin giảng viên
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#6c757d" }}>
                    {updateSearchTerm
                      ? `Đã lọc ${filteredUpdateList?.length || 0} yêu cầu`
                      : `Tổng cộng ${filteredUpdateList?.length || 0} yêu cầu cập nhật chờ phê duyệt`}
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
              <Box sx={{ minWidth: 180, flex: "0 0 auto" }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Sắp xếp theo ngày</InputLabel>
                  <Select
                    value={updateDateSort}
                    label="Sắp xếp theo ngày"
                    onChange={(e) => setUpdateDateSort(e.target.value)}
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

              <Box sx={{ flex: "1 1 300px", minWidth: 300 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="🔍 Tìm kiếm theo ID, tên giảng viên..."
                  value={updateSearchTerm}
                  onChange={(e) => setUpdateSearchTerm(e.target.value)}
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
              </Box>
            </Box>

            {/* Active Filters Display */}
            {(updateSearchTerm || updateDateSort !== "oldest") && (
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

                {updateSearchTerm && (
                  <Chip
                    label={`Tìm kiếm: "${updateSearchTerm}"`}
                    size="small"
                    onDelete={() => setUpdateSearchTerm("")}
                    color="primary"
                    variant="outlined"
                  />
                )}

                {updateDateSort !== "oldest" && (
                  <Chip
                    label={`Sắp xếp: ${updateDateSort === "newest" ? "Mới nhất trước" : "Cũ nhất trước"}`}
                    size="small"
                    onDelete={() => setUpdateDateSort("oldest")}
                    color="info"
                    variant="outlined"
                    icon={<DateRange />}
                  />
                )}

                <Button
                  size="small"
                  onClick={() => {
                    setUpdateSearchTerm("");
                    setUpdateDateSort("oldest");
                  }}
                  sx={{ ml: 1, textTransform: "none" }}
                >
                  Xóa tất cả
                </Button>
              </Box>
            )}
          </Paper>

          {filteredUpdateList && filteredUpdateList.length > 0 ? (
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
              {filteredUpdateList.map((item: any) => (
                <Card
                  key={item.lecturer.id}
                  sx={{
                    transition: "all 0.3s ease",
                    border: "2px solid",
                    borderColor: "warning.light",
                    borderRadius: 3,
                    height: "fit-content",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                      borderColor: "warning.main",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Avatar
                          src={item.lecturer.avatarUrl}
                          sx={{
                            bgcolor: "warning.main",
                            width: 50,
                            height: 50,
                            fontSize: "1.2rem",
                            fontWeight: 700,
                          }}
                        >
                          {item.lecturer.fullName?.charAt(0)}
                        </Avatar>

                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              color: "text.primary",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item.lecturer.fullName}
                          </Typography>
                          <Box sx={{ display: "flex", gap: 0.5, mt: 0.5 }}>
                            <Chip
                              label={getAcademicRankLabel(
                                item.lecturer.academicRank,
                              )}
                              size="small"
                              color="primary"
                              variant="outlined"
                              sx={{ fontSize: "0.7rem", height: 20 }}
                            />
                            <Chip
                              label="Cập nhật"
                              size="small"
                              color="warning"
                              sx={{ fontSize: "0.7rem", height: 20 }}
                            />
                          </Box>
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1.5,
                        }}
                      >
                        <Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontWeight: 600, mb: 0.5 }}
                          >
                            Chuyên ngành
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 500,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item.lecturer.specialization}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontWeight: 600, mb: 0.5 }}
                            >
                              Kinh nghiệm
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 500 }}
                            >
                              {item.lecturer.experienceYears} năm
                            </Typography>
                          </Box>

                          <Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontWeight: 600, mb: 0.5 }}
                            >
                              Thời gian
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 500, fontSize: "0.75rem" }}
                            >
                              {(() => {
                                if (!item.lecturer.updatedAt)
                                  return "Chưa cập nhật";

                                const now = new Date();
                                const updatedTime = new Date(
                                  item.lecturer.updatedAt,
                                );
                                const diffInHours = Math.floor(
                                  (now.getTime() - updatedTime.getTime()) /
                                    (1000 * 60 * 60),
                                );

                                if (diffInHours < 1) {
                                  return "Vừa cập nhật";
                                } else if (diffInHours < 48) {
                                  return `${diffInHours}h trước`;
                                } else {
                                  const diffInDays = Math.floor(
                                    diffInHours / 24,
                                  );
                                  return `${diffInDays}d trước`;
                                }
                              })()}
                            </Typography>
                          </Box>
                        </Box>

                        <Button
                          variant="contained"
                          color="warning"
                          size="small"
                          fullWidth
                          sx={{
                            mt: 1,
                            py: 1,
                            fontWeight: 600,
                            textTransform: "none",
                            borderRadius: 2,
                            fontSize: "0.8rem",
                          }}
                          onClick={() => {
                            setSelectedLecturerUpdate(item);
                            setOpenUpdateDialog(true);
                          }}
                        >
                          Xem chi tiết
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
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

        <TabPanel value="4" sx={{ p: 0 }}>
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
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    width: 56,
                    height: 56,
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{ color: "white", fontWeight: 700 }}
                  >
                    🎓
                  </Typography>
                </Avatar>
                <Box>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: "#2c3e50", mb: 0.5 }}
                  >
                    Yêu cầu chứng chỉ và bằng cấp
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#6c757d" }}>
                    {degreeSearchTerm || degreeTypeFilter
                      ? `Đã lọc ${filteredDegreeList?.length || 0} yêu cầu`
                      : `Tổng cộng ${filteredDegreeList?.length || 0} yêu cầu chứng chỉ và bằng cấp`}
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
              <Box sx={{ minWidth: 150, flex: "0 0 auto" }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Loại</InputLabel>
                  <Select
                    value={degreeTypeFilter}
                    label="Loại"
                    onChange={(e) => setDegreeTypeFilter(e.target.value)}
                    sx={{
                      bgcolor: "white",
                      borderRadius: 2,
                    }}
                  >
                    <MenuItem value="">
                      <em>Tất cả</em>
                    </MenuItem>
                    <MenuItem value="BC">Bằng cấp</MenuItem>
                    <MenuItem value="CC">Chứng chỉ</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ minWidth: 180, flex: "0 0 auto" }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Sắp xếp theo ngày</InputLabel>
                  <Select
                    value={degreeDateSort}
                    label="Sắp xếp theo ngày"
                    onChange={(e) => setDegreeDateSort(e.target.value)}
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

              <Box sx={{ flex: "1 1 300px", minWidth: 300 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="🔍 Theo ID, tên giảng viên, tên bằng cấp..."
                  value={degreeSearchTerm}
                  onChange={(e) => setDegreeSearchTerm(e.target.value)}
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
              </Box>
            </Box>

            {/* Active Filters Display */}
            {(degreeSearchTerm ||
              degreeTypeFilter ||
              degreeDateSort !== "oldest") && (
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

                {degreeSearchTerm && (
                  <Chip
                    label={`Tìm kiếm: "${degreeSearchTerm}"`}
                    size="small"
                    onDelete={() => setDegreeSearchTerm("")}
                    color="primary"
                    variant="outlined"
                  />
                )}

                {degreeTypeFilter && (
                  <Chip
                    label={`Loại: ${degreeTypeFilter === "BC" ? "Bằng cấp" : "Chứng chỉ"}`}
                    size="small"
                    onDelete={() => setDegreeTypeFilter("")}
                    color="secondary"
                    variant="outlined"
                  />
                )}

                {degreeDateSort !== "oldest" && (
                  <Chip
                    label={`Sắp xếp: ${degreeDateSort === "newest" ? "Mới nhất trước" : "Cũ nhất trước"}`}
                    size="small"
                    onDelete={() => setDegreeDateSort("oldest")}
                    color="info"
                    variant="outlined"
                    icon={<DateRange />}
                  />
                )}

                <Button
                  size="small"
                  onClick={() => {
                    setDegreeSearchTerm("");
                    setDegreeTypeFilter("");
                    setDegreeDateSort("oldest");
                  }}
                  sx={{ ml: 1, textTransform: "none" }}
                >
                  Xóa tất cả
                </Button>
              </Box>
            )}
          </Paper>

          {filteredDegreeList && filteredDegreeList.length > 0 ? (
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
              {filteredDegreeList.map((item: any, index: number) => {
                const contentData =
                  item.label === "Update"
                    ? item.content?.original
                    : item.content;

                return (
                  <Card
                    key={index}
                    sx={{
                      transition: "all 0.3s ease",
                      border: "2px solid",
                      borderColor:
                        item.label === "Create"
                          ? "success.light"
                          : "warning.light",
                      borderRadius: 3,
                      height: "fit-content",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                        borderColor:
                          item.label === "Create"
                            ? "success.main"
                            : "warning.main",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Avatar
                            src={item.lecturerInfo?.avatarUrl}
                            sx={{
                              bgcolor:
                                item.label === "Create"
                                  ? "success.main"
                                  : "warning.main",
                              width: 50,
                              height: 50,
                              fontSize: "1.2rem",
                              fontWeight: 700,
                            }}
                          >
                            {item.lecturerInfo?.fullName?.charAt(0)}
                          </Avatar>

                          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 700,
                                color: "text.primary",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {item.lecturerInfo?.fullName}
                            </Typography>
                            <Box sx={{ display: "flex", gap: 0.5, mt: 0.5 }}>
                              <Chip
                                label={
                                  item.type === "BC" ? "Bằng cấp" : "Chứng chỉ"
                                }
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: "0.7rem", height: 20 }}
                              />
                              <Chip
                                label={item.label}
                                size="small"
                                color={
                                  item.label === "Create"
                                    ? "success"
                                    : "warning"
                                }
                                sx={{ fontSize: "0.7rem", height: 20 }}
                              />
                            </Box>
                          </Box>
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1.5,
                          }}
                        >
                          <Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontWeight: 600, mb: 0.5 }}
                            >
                              Tên
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 500,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {contentData?.name}
                            </Typography>
                          </Box>

                          {item.type === "BC" ? (
                            <>
                              <Box>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ fontWeight: 600, mb: 0.5 }}
                                >
                                  Chuyên ngành
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 500,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {contentData?.major}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ fontWeight: 600, mb: 0.5 }}
                                >
                                  Trình độ
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 500 }}
                                >
                                  {contentData?.level}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ fontWeight: 600, mb: 0.5 }}
                                >
                                  Năm tốt nghiệp
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 500 }}
                                >
                                  {contentData?.graduationYear}
                                </Typography>
                              </Box>
                            </>
                          ) : (
                            <>
                              <Box>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ fontWeight: 600, mb: 0.5 }}
                                >
                                  Tổ chức cấp
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 500,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {contentData?.issuedBy}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ fontWeight: 600, mb: 0.5 }}
                                >
                                  Ngày cấp
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 500 }}
                                >
                                  {contentData?.issueDate
                                    ? new Date(
                                        contentData.issueDate,
                                      ).toLocaleDateString("vi-VN")
                                    : ""}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ fontWeight: 600, mb: 0.5 }}
                                >
                                  Thời hạn
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 500 }}
                                >
                                  {contentData?.expiryDate &&
                                  contentData?.issueDate
                                    ? `${new Date(contentData.expiryDate).getFullYear() - new Date(contentData.issueDate).getFullYear()} năm`
                                    : "Vô thời hạn"}
                                </Typography>
                              </Box>
                            </>
                          )}

                          <Button
                            variant="contained"
                            color={
                              item.label === "Create" ? "success" : "warning"
                            }
                            size="small"
                            fullWidth
                            sx={{
                              mt: 1,
                              py: 1,
                              fontWeight: 600,
                              textTransform: "none",
                              borderRadius: 2,
                              fontSize: "0.8rem",
                            }}
                            onClick={() => {
                              console.log("View details for:", item);
                            }}
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
                Hiện tại không có yêu cầu chứng chỉ/bằng cấp nào cần xử lý.
              </Typography>
            </Paper>
          )}
        </TabPanel>

        <TabPanel value="5" sx={{ p: 0 }}>
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
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    width: 56,
                    height: 56,
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{ color: "white", fontWeight: 700 }}
                  >
                    📚
                  </Typography>
                </Avatar>
                <Box>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: "#2c3e50", mb: 0.5 }}
                  >
                    Yêu cầu khóa đào tạo và hoạt động
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#6c757d" }}>
                    {courseSearchTerm || courseTypeFilter
                      ? `Đã lọc ${filteredCourseList?.length || 0} yêu cầu`
                      : `Tổng cộng ${filteredCourseList?.length || 0} yêu cầu khóa học và hoạt động`}
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
                    <MenuItem value="OC">Khóa đào tạo cung cấp</MenuItem>
                    <MenuItem value="AC">Khóa đào tạo được học</MenuItem>
                    <MenuItem value="RP">Nghiên cứu khoa học</MenuItem>
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
              courseDateSort !== "oldest") && (
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
                        ? "Khóa đào tạo cung cấp"
                        : courseTypeFilter === "AC"
                          ? "Khóa đào tạo được học"
                          : "Nghiên cứu khoa học"
                    }`}
                    size="small"
                    onDelete={() => setCourseTypeFilter("")}
                    color="secondary"
                    variant="outlined"
                  />
                )}

                {courseDateSort !== "oldest" && (
                  <Chip
                    label={`Sắp xếp: ${courseDateSort === "newest" ? "Mới nhất trước" : "Cũ nhất trước"}`}
                    size="small"
                    onDelete={() => setCourseDateSort("oldest")}
                    color="info"
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
                  item.label === "Update"
                    ? item.content?.original
                    : item.content;

                return (
                  <Card
                    key={`course-${item.type}-${item.content?.id}-${item.label}-${index}`}
                    sx={{
                      transition: "all 0.3s ease",
                      border: "2px solid",
                      borderColor:
                        item.label === "Create"
                          ? "success.light"
                          : "warning.light",
                      borderRadius: 3,
                      height: "fit-content",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                        borderColor:
                          item.label === "Create"
                            ? "success.main"
                            : "warning.main",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
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
                              width: 50,
                              height: 50,
                              fontSize: "1.2rem",
                              fontWeight: 700,
                            }}
                          >
                            {item.lecturerInfo?.fullName?.charAt(0)}
                          </Avatar>

                          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 700,
                                color: "text.primary",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {item.lecturerInfo?.fullName}
                            </Typography>
                            <Box sx={{ display: "flex", gap: 0.5, mt: 0.5 }}>
                              <Chip
                                label={
                                  item.type === "OC"
                                    ? "Cung cấp"
                                    : item.type === "AC"
                                      ? "Được học"
                                      : "Nghiên cứu"
                                }
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: "0.7rem", height: 20 }}
                              />
                              <Chip
                                label={item.label}
                                size="small"
                                color={
                                  item.label === "Create"
                                    ? "success"
                                    : "warning"
                                }
                                sx={{ fontSize: "0.7rem", height: 20 }}
                              />
                            </Box>
                          </Box>
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1.5,
                          }}
                        >
                          <Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontWeight: 600, mb: 0.5 }}
                            >
                              Tên
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 500,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {contentData?.title || contentData?.name}
                            </Typography>
                          </Box>

                          {contentData?.topic && (
                            <Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ fontWeight: 600, mb: 0.5 }}
                              >
                                Chuyên đề
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 500,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {contentData.topic}
                              </Typography>
                            </Box>
                          )}

                          {contentData?.researchArea && (
                            <Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ fontWeight: 600, mb: 0.5 }}
                              >
                                Lĩnh vực
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 500,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {contentData.researchArea}
                              </Typography>
                            </Box>
                          )}

                          {contentData?.courseType && (
                            <Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ fontWeight: 600, mb: 0.5 }}
                              >
                                Loại hình
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 500 }}
                              >
                                {contentData.courseType === "FORMAL"
                                  ? "Chính quy"
                                  : contentData.courseType === "SPECIALIZED"
                                    ? "Chuyên đề"
                                    : contentData.courseType === "EXTRACURRICULAR"
                                      ? "Ngoại khóa"
                                      : "Khác"}
                              </Typography>
                            </Box>
                          )}

                          {contentData?.scale && (
                            <Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ fontWeight: 600, mb: 0.5 }}
                              >
                                Quy mô
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 500 }}
                              >
                                {contentData.scale === "INSTITUTIONAL"
                                  ? "Cấp đơn vị"
                                  : contentData.scale === "NATIONAL"
                                    ? "Cấp quốc gia"
                                    : contentData.scale === "INTERNATIONAL"
                                      ? "Cấp quốc tế"
                                      : contentData.scale === "UNIVERSITY"
                                        ? "Cấp trường"
                                        : contentData.scale === "DEPARTMENTAL"
                                          ? "Cấp khoa/tỉnh"
                                          : contentData.scale === "MINISTERIAL"
                                            ? "Cấp bộ"
                                            : "Khác"}
                              </Typography>
                            </Box>
                          )}

                          <Button
                            variant="contained"
                            color={
                              item.label === "Create" ? "success" : "warning"
                            }
                            size="small"
                            fullWidth
                            sx={{
                              mt: 1,
                              py: 1,
                              fontWeight: 600,
                              textTransform: "none",
                              borderRadius: 2,
                              fontSize: "0.8rem",
                            }}
                            onClick={() => {
                              console.log("View details for:", item);
                            }}
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
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default AdminLecturerPage;
