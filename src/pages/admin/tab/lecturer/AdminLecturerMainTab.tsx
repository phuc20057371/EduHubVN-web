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
  Tooltip,
  Typography,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LecturerUpdateDialog from "../../../../components/LecturerUpdateDialog";
import type { Lecturer } from "../../../../types/Lecturer";

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

interface AdminLecturerMainTabProps {
  filteredLecturers: Lecturer[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  academicRankFilter: string;
  setAcademicRankFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  order: Order;
  setOrder: (order: Order) => void;
  orderBy: keyof Lecturer;
  setOrderBy: (orderBy: keyof Lecturer) => void;
  selected: string | null;
  setSelected: (selected: string | null) => void;
  lecturers: Lecturer[];
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
  getAcademicRankLabel: (rank: string) => string;
}

const AdminLecturerMainTab: React.FC<AdminLecturerMainTabProps> = ({
  filteredLecturers,
  searchTerm,
  setSearchTerm,
  academicRankFilter,
  setAcademicRankFilter,
  statusFilter,
  setStatusFilter,
  order,
  setOrder,
  orderBy,
  setOrderBy,
  selected,
  setSelected,
  lecturers,
  getStatusColor,
  getStatusLabel,
  getAcademicRankLabel,
}) => {
  const [openUpdateDialog, setOpenUpdateDialog] = React.useState(false);
  const [selectedLecturerUpdate, setSelectedLecturerUpdate] =
    React.useState<any>(null);

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
    console.log(row);
  };

  const visibleRows = React.useMemo(
    () => [...filteredLecturers].sort(getComparator(order, orderBy)).slice(),
    [filteredLecturers, order, orderBy],
  );

  const emptyRows = 10 - visibleRows.length > 0 ? 10 - visibleRows.length : 0;

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
                    <TableCell align="right">{row.experienceYears}</TableCell>
                    <TableCell>{row.jobField}</TableCell>
                    <TableCell>
                      {row.dateOfBirth
                        ? new Date(row.dateOfBirth).toLocaleDateString("vi-VN")
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
    </>
  );
};

export default AdminLecturerMainTab;
