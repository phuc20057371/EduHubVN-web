import React from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Menu,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PersonIcon from "@mui/icons-material/Person";
import { Add } from "@mui/icons-material";
import { toast } from "react-toastify";
import LecturerProfileUpdateDialog from "../../../../components/admin-dialog/admin-lecturer-dialog/LecturerProfileUpdateDialog";
import LecturerBasicInfoEditDialog from "../../../../components/admin-dialog/admin-lecturer-dialog/LecturerBasicInfoEditDialog";
import ConfirmDeleteDialog from "../../../../components/general-dialog/ConfirmDeleteDialog";
import type { Lecturer } from "../../../../types/Lecturer";
import {
  getAcademicRank,
  getStatus,
  getStatusColor,
} from "../../../../utils/ChangeText";
import { API } from "../../../../utils/Fetch";

type Order = "asc" | "desc";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<Key extends keyof Lecturer>(
  order: Order,
  orderBy: Key,
): (a: Lecturer, b: Lecturer) => number {
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
  { id: "lecturerId", numeric: false, disablePadding: false, label: "Mã GV" },
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
  { id: "createdAt", numeric: false, disablePadding: false, label: "Thao tác" },
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
  const theme = useTheme();

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
          backgroundColor:
            theme.palette.mode === "dark"
              ? theme.palette.primary.dark
              : theme.palette.primary.main,
        }}
      >
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.primary.dark
                  : theme.palette.primary.main,
              color:
                theme.palette.mode === "dark"
                  ? theme.palette.primary.contrastText
                  : "#fff",
              position: "sticky",
              top: 0,
              zIndex: 2,
              fontWeight: 600,
            }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
              sx={{
                color:
                  theme.palette.mode === "dark"
                    ? theme.palette.primary.contrastText
                    : "#fff !important",
                fontSize: "0.875rem", // 14px - smaller header text
                "&.Mui-active": {
                  color:
                    theme.palette.mode === "dark"
                      ? theme.palette.primary.contrastText
                      : "#fff !important",
                },
                "& .MuiTableSortLabel-icon": {
                  color:
                    theme.palette.mode === "dark"
                      ? theme.palette.primary.contrastText
                      : "#fff !important",
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

interface AdminLecturerMainTabProps {
  lecturers: Lecturer[];
  canEdit?: boolean;
  canDelete?: boolean;
  canCreate?: boolean;
  onCreateClick?: () => void;
  onRefresh?: () => void;
  onLecturerDeleted?: (lecturerId: string) => void;
}

const AdminLecturerMainTab: React.FC<AdminLecturerMainTabProps> = ({
  lecturers,
  canEdit = true,
  canDelete = true,
  canCreate = false,
  onCreateClick,
  onRefresh,
  onLecturerDeleted,
}) => {
  const theme = useTheme();

  // Local state for filters and table
  const [searchTerm, setSearchTerm] = React.useState("");
  const [academicRankFilter, setAcademicRankFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("APPROVED");
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Lecturer>("id");
  const [selected, setSelected] = React.useState<string | null>(null);

  // Local lecturers state to handle immediate updates
  const [localLecturers, setLocalLecturers] =
    React.useState<Lecturer[]>(lecturers);

  // Sync local lecturers with props when lecturers change
  React.useEffect(() => {
    setLocalLecturers(lecturers);
  }, [lecturers]);

  const [openUpdateDialog, setOpenUpdateDialog] = React.useState(false);
  const [openBasicInfoEditDialog, setOpenBasicInfoEditDialog] =
    React.useState(false);
  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] =
    React.useState(false);
  const [selectedLecturerUpdate, setSelectedLecturerUpdate] =
    React.useState<any>(null);
  const [selectedLecturerEdit, setSelectedLecturerEdit] =
    React.useState<any>(null);
  const [selectedLecturerDelete, setSelectedLecturerDelete] =
    React.useState<Lecturer | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Menu dropdown state
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedMenuLecturer, setSelectedMenuLecturer] =
    React.useState<Lecturer | null>(null);
  const openMenu = Boolean(anchorEl);

  // Filtered data logic
  const filteredLecturers = React.useMemo(() => {
    let filtered = localLecturers;

    if (searchTerm) {
      filtered = filtered.filter(
        (lecturer: Lecturer) =>
          lecturer.id?.toString().includes(searchTerm) ||
          lecturer.lecturerId?.toString().includes(searchTerm) ||
          lecturer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lecturer.specialization
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          lecturer.jobField?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lecturer.phoneNumber?.includes(searchTerm),
      );
    }

    if (academicRankFilter) {
      filtered = filtered.filter(
        (lecturer: Lecturer) => lecturer.academicRank === academicRankFilter,
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(
        (lecturer: Lecturer) => lecturer.status === statusFilter,
      );
    }

    return filtered;
  }, [localLecturers, searchTerm, academicRankFilter, statusFilter]);

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
      // For single selection, we don't implement select all
      // This is just to maintain interface compatibility
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
  };

  const visibleRows = React.useMemo(
    () => [...filteredLecturers].sort(getComparator(order, orderBy)).slice(),
    [filteredLecturers, order, orderBy],
  );

  const emptyRows = 10 - visibleRows.length > 0 ? 10 - visibleRows.length : 0;

  // Delete lecturer handler
  const handleDeleteClick = (lecturer: Lecturer) => {
    setSelectedLecturerDelete(lecturer);
    setOpenConfirmDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedLecturerDelete) return;

    setIsDeleting(true);
    try {
      const response = await API.admin.deleteLecturer({
        id: selectedLecturerDelete.id,
      });

      if (response.data.success) {
        toast.success("Xóa giảng viên thành công!");

        // Remove lecturer from local state immediately
        setLocalLecturers((prev) =>
          prev.filter((lecturer) => lecturer.id !== selectedLecturerDelete.id),
        );

        // Clear selection if the deleted lecturer was selected
        if (selected === selectedLecturerDelete.id) {
          setSelected(null);
        }

        setOpenConfirmDeleteDialog(false);
        setSelectedLecturerDelete(null);

        // Notify parent component
        if (onLecturerDeleted) {
          onLecturerDeleted(selectedLecturerDelete.id);
        }

        // Refresh data from server (async)
        if (onRefresh) {
          onRefresh();
        }
      } else {
        toast.error(
          response.data.message || "Có lỗi xảy ra khi xóa giảng viên",
        );
      }
    } catch (error: any) {
      console.error("Error deleting lecturer:", error);
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi xóa giảng viên",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseDeleteDialog = () => {
    if (!isDeleting) {
      setOpenConfirmDeleteDialog(false);
      setSelectedLecturerDelete(null);
    }
  };

  // Menu handlers
  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    lecturer: Lecturer,
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedMenuLecturer(lecturer);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedMenuLecturer(null);
  };

  const handleViewCV = () => {
    if (selectedMenuLecturer) {
      window.open(`/lecturer-info/${selectedMenuLecturer.id}`, "_blank");
    }
    handleMenuClose();
  };

  const handleViewProfile = () => {
    if (selectedMenuLecturer) {
      setSelectedLecturerUpdate({ lecturer: selectedMenuLecturer });
      setOpenUpdateDialog(true);
    }
    handleMenuClose();
  };

  const handleEditLecturer = () => {
    if (selectedMenuLecturer) {
      setSelectedLecturerEdit({ lecturer: selectedMenuLecturer });
      setOpenBasicInfoEditDialog(true);
    }
    handleMenuClose();
  };

  const handleDeleteLecturer = () => {
    if (selectedMenuLecturer) {
      handleDeleteClick(selectedMenuLecturer);
    }
    handleMenuClose();
  };

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)"
              : "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          borderRadius: 1,
          border:
            theme.palette.mode === "dark"
              ? "1px solid rgba(255,255,255,0.1)"
              : "1px solid rgba(255,255,255,0.8)",
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
                  theme.palette.mode === "dark"
                    ? "linear-gradient(135deg, #00B2FF 0%, #0099e6 100%)"
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                width: 56,
                height: 56,
              }}
            >
              <Typography variant="h4" sx={{ color: "white", fontWeight: 700 }}>
                👨‍🏫
              </Typography>
            </Avatar>
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color:
                    theme.palette.mode === "dark"
                      ? theme.palette.text.primary
                      : "#2c3e50",
                  mb: 0.5,
                }}
              >
                Quản lý hồ sơ Giảng viên
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color:
                    theme.palette.mode === "dark"
                      ? theme.palette.text.secondary
                      : "#6c757d",
                }}
              >
                {searchTerm || academicRankFilter || statusFilter !== "APPROVED"
                  ? `Đã lọc ${filteredLecturers?.length || 0} giảng viên`
                  : `Tổng cộng ${filteredLecturers?.length || 0} giảng viên`}
              </Typography>
            </Box>
          </Box>

          {/* Comment out toolbar action buttons - moved to table column */}
          {/* {selected && (
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
          )} */}
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
                  // bgcolor:
                  //   theme.palette.mode === "dark"
                  //     ? theme.palette.background.paper
                  //     : "white",
                  borderRadius: 1,
                  fontSize: "1.25rem",
                }}
              >
                <MenuItem value="">
                  <em>Tất cả</em>
                </MenuItem>

                <MenuItem value="CN">Cử nhân</MenuItem>
                <MenuItem value="KS">Kỹ sư</MenuItem>
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
                  // bgcolor: theme.palette.mode === 'dark'
                  //   ? theme.palette.background.paper
                  //   : "white",
                  borderRadius: 1,
                  fontSize: "1.25rem",
                }}
              >
                <MenuItem value="">
                  <em>Tất cả</em>
                </MenuItem>

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
                bgcolor:
                  theme.palette.mode === "dark"
                    ? theme.palette.background.paper
                    : "white",
                borderRadius: 1,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "primary.main" }} />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchTerm("")}>
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Create Button */}
          {canCreate && onCreateClick && (
            <Box sx={{ flexShrink: 0 }}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={onCreateClick}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: 1,

                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  "&:hover": {
                    transform: "translateY(-1px)",
                    boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              >
                Tạo mới
              </Button>
            </Box>
          )}
        </Box>

        {/* Active Filters Display */}
        {(searchTerm || academicRankFilter || statusFilter !== "APPROVED") && (
          <Box
            sx={{
              mt: 2,
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color:
                  theme.palette.mode === "dark"
                    ? theme.palette.text.secondary
                    : "#6c757d",
                mr: 1,
              }}
            >
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
                label={`Học hàm: ${getAcademicRank(academicRankFilter)}`}
                size="small"
                onDelete={() => setAcademicRankFilter("")}
                color="secondary"
                variant="outlined"
              />
            )}

            {statusFilter !== "APPROVED" && statusFilter && (
              <Chip
                label={`Trạng thái: ${getStatus(statusFilter)}`}
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
          borderRadius: 1,
          overflow: "hidden",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 4px 20px rgba(0,0,0,0.3)"
              : "0 4px 20px rgba(0,0,0,0.08)",
          backgroundColor:
            theme.palette.mode === "dark"
              ? theme.palette.background.paper
              : theme.palette.background.default,
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

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? "rgba(144, 202, 249, 0.16) !important"
                            : "rgba(187, 222, 251, 0.8) !important",
                      },
                      "&.Mui-selected": {
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? "rgba(100, 181, 246, 0.24) !important"
                            : "rgba(100, 181, 246, 0.8) !important",
                        "&:hover": {
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? "rgba(66, 165, 245, 0.32) !important"
                              : "rgba(66, 165, 245, 0.9) !important",
                        },
                      },
                    }}
                  >
                    <TableCell sx={{ fontSize: "0.875rem" }}>
                      {row.lecturerId}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.875rem" }}>
                      {row.fullName}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.875rem" }}>
                      <Chip
                        label={getAcademicRank(row.academicRank)}
                        size="small"
                        variant="outlined"
                        color="primary"
                        sx={{ fontSize: "0.75rem" }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.875rem" }}>
                      {row.specialization}
                    </TableCell>
                    <TableCell align="right" sx={{ fontSize: "0.875rem" }}>
                      {row.experienceYears}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.875rem" }}>
                      {row.jobField}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.875rem" }}>
                      {row.dateOfBirth
                        ? new Date(row.dateOfBirth).toLocaleDateString("vi-VN")
                        : ""}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.875rem" }}>
                      <Chip
                        label={row.gender ? "Nam" : "Nữ"}
                        size="small"
                        color={row.gender ? "info" : "secondary"}
                        sx={{ fontSize: "0.75rem" }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.875rem" }}>
                      {row.phoneNumber}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.875rem" }}>
                      <Chip
                        label={getStatus(row.status)}
                        size="small"
                        color={
                          row.status === "APPROVED"
                            ? "success"
                            : (getStatusColor(row.status) as any)
                        }
                        variant="filled"
                        sx={{ fontSize: "0.75rem" }}
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ fontSize: "0.875rem" }}>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, row)}
                        sx={{
                          bgcolor:
                            theme.palette.mode === "dark"
                              ? "rgba(255, 255, 255, 0.1)"
                              : "rgba(0, 0, 0, 0.04)",
                          "&:hover": {
                            bgcolor:
                              theme.palette.mode === "dark"
                                ? "rgba(255, 255, 255, 0.2)"
                                : "rgba(0, 0, 0, 0.08)",
                          },
                        }}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
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

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              minWidth: 160,
              boxShadow:
                theme.palette.mode === "dark"
                  ? "0 8px 32px rgba(0,0,0,0.5)"
                  : "0 8px 32px rgba(0,0,0,0.12)",
              border:
                theme.palette.mode === "dark"
                  ? "1px solid rgba(255,255,255,0.1)"
                  : "1px solid rgba(0,0,0,0.08)",
              borderRadius: 1,
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem
            onClick={handleViewCV}
            sx={{ fontSize: "0.875rem", py: 1.5 }}
          >
            <VisibilityIcon sx={{ mr: 2, fontSize: "1.1rem" }} />
            Xem CV
          </MenuItem>
          <MenuItem
            onClick={handleViewProfile}
            sx={{ fontSize: "0.875rem", py: 1.5 }}
          >
            <PersonIcon sx={{ mr: 2, fontSize: "1.1rem" }} />
            Xem hồ sơ
          </MenuItem>
          {canEdit && (
            <MenuItem
              onClick={handleEditLecturer}
              sx={{ fontSize: "0.875rem", py: 1.5 }}
            >
              <EditIcon sx={{ mr: 2, fontSize: "1.1rem" }} />
              Chỉnh sửa
            </MenuItem>
          )}
          {canDelete && (
            <MenuItem
              onClick={handleDeleteLecturer}
              sx={{
                fontSize: "0.875rem",
                py: 1.5,
                color: "error.main",
                "&:hover": {
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "rgba(244, 67, 54, 0.1)"
                      : "rgba(244, 67, 54, 0.04)",
                },
              }}
            >
              <DeleteIcon sx={{ mr: 2, fontSize: "1.1rem" }} />
              Xóa
            </MenuItem>
          )}
        </Menu>

        <LecturerProfileUpdateDialog
          open={openUpdateDialog}
          onClose={() => setOpenUpdateDialog(false)}
          lecturer={selectedLecturerUpdate?.lecturer}
        />
        <LecturerBasicInfoEditDialog
          open={openBasicInfoEditDialog}
          onClose={() => setOpenBasicInfoEditDialog(false)}
          lecturer={selectedLecturerEdit?.lecturer}
        />
        <ConfirmDeleteDialog
          open={openConfirmDeleteDialog}
          lecturer={selectedLecturerDelete}
          loading={isDeleting}
          onClose={handleCloseDeleteDialog}
          onConfirm={handleConfirmDelete}
        />
      </Paper>
    </>
  );
};

export default AdminLecturerMainTab;
