import { Add, Business } from "@mui/icons-material";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
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
import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import InstitutionProfileUpdateDialog from "../../../../components/admin-dialog/admin-institution-dialog/InstitutionProfileUpdateDialog";
import { setInstitutions } from "../../../../redux/slice/InstitutionSlice";
import type { Institution } from "../../../../types/Institution";
import {
  getInstitutionType,
  getStatus,
  getStatusColor,
} from "../../../../utils/ChangeText";
import { API } from "../../../../utils/Fetch";
function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  const aValue = a[orderBy];
  const bValue = b[orderBy];

  // Handle undefined/null values
  if (bValue == null && aValue == null) return 0;
  if (bValue == null) return -1;
  if (aValue == null) return 1;

  if (bValue < aValue) {
    return -1;
  }
  if (bValue > aValue) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof Institution>(
  order: Order,
  orderBy: Key,
): (a: Institution, b: Institution) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Institution;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "institutionName",
    numeric: false,
    disablePadding: false,
    label: "Tên CSGD",
  },
  {
    id: "institutionType",
    numeric: false,
    disablePadding: false,
    label: "Loại",
  },
  {
    id: "phoneNumber",
    numeric: false,
    disablePadding: false,
    label: "SĐT",
  },
  {
    id: "website",
    numeric: false,
    disablePadding: false,
    label: "Website",
  },
  { id: "address", numeric: false, disablePadding: false, label: "Địa chỉ" },
  {
    id: "representativeName",
    numeric: false,
    disablePadding: false,
    label: "Đại diện",
  },
  { id: "status", numeric: false, disablePadding: false, label: "Trạng thái" },
  { id: "createdAt", numeric: false, disablePadding: false, label: "Thao tác" },
];

const institutionTypes = [
  { value: "", label: "Tất cả" },
  { value: "UNIVERSITY", label: "Trường đại học" },
  { value: "TRAINING_CENTER", label: "Trung tâm đào tạo" },
];

const statusOptions = [
  { value: "", label: "Tất cả" },
  { value: "APPROVED", label: "Đã duyệt" },
  { value: "PENDING", label: "Chờ duyệt" },
  { value: "REJECTED", label: "Đã từ chối" },
];

interface EnhancedTableProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Institution,
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
  headCells: readonly HeadCell[];
}

import { useTheme } from "@mui/material/styles";
import { setInstitutionPendingUpdate } from "../../../../redux/slice/InstitutionPendingUpdateSlice";

function EnhancedTableHead(props: EnhancedTableProps) {
  const theme = useTheme();
  const { order, orderBy, onRequestSort, headCells: propHeadCells } = props;
  const createSortHandler =
    (property: keyof Institution) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead
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
      <TableRow>
        {propHeadCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{
              fontWeight: 700,
              borderBottom: "2px solid #dee2e6",
              py: 2,
            }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
              sx={{
                fontWeight: 700,

                "&.MuiTableSortLabel-root:hover": {
                  color: "#1976d2",
                },
                "&.Mui-active": {
                  color: "#1976d2",
                },
                "& .MuiTableSortLabel-icon": {
                  color: "#1976d2 !important",
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

interface EnhancedTableToolbarProps {
  // numSelected: number;
  // onEdit?: () => void;
  // onDelete?: () => void;
  onSearch: (value: string) => void;
  searchTerm: string;
  onTypeFilter: (value: string) => void;
  typeFilter: string;
  onStatusFilter: (value: string) => void;
  statusFilter: string;
  // canEdit?: boolean;
  // canDelete?: boolean;
  canCreate?: boolean;
  onCreateClick?: () => void;
}

function EnhancedTableToolbar({
  // numSelected,
  // onEdit,
  // onDelete,
  onSearch,
  searchTerm,
  onTypeFilter,
  typeFilter,
  onStatusFilter,
  statusFilter,
  // canEdit = true,
  // canDelete = true,
  canCreate = false,
  onCreateClick,
}: EnhancedTableToolbarProps) {
  return (
    <Box
      sx={{
        p: 3,

        borderRadius: 1,
        border: "1px solid rgba(255,255,255,0.8)",
        mb: 3,
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
              background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
              width: 56,
              height: 56,
            }}
          >
            <Business sx={{ fontSize: 28 }} />
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              Quản lý Cơ sở Giáo dục
            </Typography>
            <Typography variant="body2">
              Quản lý thông tin các cơ sở giáo dục trong hệ thống
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Filter Controls */}
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
            <InputLabel id="type-filter-label">Loại cơ sở</InputLabel>
            <Select
              labelId="type-filter-label"
              value={typeFilter}
              label="Loại cơ sở"
              onChange={(e) => onTypeFilter(e.target.value)}
              sx={{
                borderRadius: 1,
              }}
            >
              {institutionTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ minWidth: 150, flex: "0 0 auto" }}>
          <FormControl fullWidth size="small">
            <InputLabel id="status-filter-label">Trạng thái</InputLabel>
            <Select
              labelId="status-filter-label"
              value={statusFilter}
              label="Trạng thái"
              onChange={(e) => onStatusFilter(e.target.value)}
              sx={{
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

        <Box sx={{ flex: "1 1 400px", minWidth: 400 }}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="🔍 Tìm kiếm theo ID, tên, địa chỉ, đại diện, ĐKKD..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            sx={{
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
                  <IconButton size="small" onClick={() => onSearch("")}>
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
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
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
    </Box>
  );
}
interface InstitutionTabProps {
  institutions: Institution[];
  canEdit?: boolean;
  canDelete?: boolean;
  canCreate?: boolean;
  onCreateClick?: () => void;
}

const InstitutionTab: React.FC<InstitutionTabProps> = ({
  institutions,
  canEdit = true,
  canDelete = true,
  canCreate = false,
  onCreateClick,
}) => {
  const dispatch = useDispatch();
  const [openEditDialog, setOpenEditDialog] = useState(false);

  // Check if actions column should be shown
  const showActionsColumn = canEdit || canDelete;
  const [selectedInstitution, setSelectedInstitution] = useState<any>(null);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Institution>("id");
  const [selected, setSelected] = useState<string | null>(null);

  // Delete functionality states
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [institutionToDelete, setInstitutionToDelete] =
    useState<Institution | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  // Filter states for main list
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("APPROVED");

  const handleRequestSort = (
    _event: React.MouseEvent<unknown>,
    property: keyof Institution,
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = institutions.map((n: { id: any }) => n.id);
      setSelected(newSelected.length > 0 ? newSelected[0] : null);
      return;
    }
    setSelected(null);
  };

  const handleClick = (_event: React.MouseEvent<unknown>, row: Institution) => {
    const selectedIndex = selected === row.id ? -1 : row.id;
    if (selectedIndex === -1) {
      setSelected(null);
      return;
    }
    setSelected(selectedIndex);
  };

  // Filtered institutions for main list with comprehensive search
  const filteredInstitutions = useMemo(() => {
    let filtered = institutions;

    // Filter by search term (comprehensive search across multiple fields including ID)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();

      filtered = filtered.filter(
        (item: Institution) =>
          // Search by ID (exact match or partial match for UUID)
          item.id?.toLowerCase().includes(searchLower) ||
          // Existing search fields
          item.institutionName?.toLowerCase().includes(searchLower) ||
          item.address?.toLowerCase().includes(searchLower) ||
          item.representativeName?.toLowerCase().includes(searchLower) ||
          item.businessRegistrationNumber
            ?.toLowerCase()
            .includes(searchLower) ||
          item.phoneNumber?.includes(searchTerm) ||
          item.description?.toLowerCase().includes(searchLower) ||
          item.website?.toLowerCase().includes(searchLower) ||
          item.position?.toLowerCase().includes(searchLower),
      );
    }

    // Filter by institution type
    if (typeFilter) {
      filtered = filtered.filter(
        (item: Institution) => item.institutionType === typeFilter,
      );
    }

    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter(
        (item: Institution) => item.status === statusFilter,
      );
    }

    return filtered;
  }, [institutions, searchTerm, typeFilter, statusFilter]);

  const visibleRows = useMemo(
    () => [...filteredInstitutions].sort(getComparator(order, orderBy)).slice(),
    [filteredInstitutions, order, orderBy],
  );

  const emptyRows = 10 - visibleRows.length > 0 ? 10 - visibleRows.length : 0;

  // Dynamic headCells based on permissions
  const displayHeadCells = useMemo(() => {
    if (showActionsColumn) {
      return headCells;
    }
    // Filter out the actions column (last column)
    return headCells.filter((cell) => cell.id !== "createdAt");
  }, [showActionsColumn]);

  // Enhanced search handlers
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleTypeFilter = (value: string) => {
    setTypeFilter(value);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
  };

  // Clear all filters function
  const clearAllFilters = () => {
    setSearchTerm("");
    setTypeFilter("");
    setStatusFilter("APPROVED");
  };

  // Delete functionality handlers - handleDeleteClick removed since we use direct onClick in table
  const handleDeleteConfirm = async () => {
    if (!institutionToDelete) return;

    setDeleteLoading(true);
    try {
      await API.admin.deleteInstitution({ id: institutionToDelete.id });
      setSelected(null); // Clear selection
      toast.success(
        `Đã xóa cơ sở giáo dục "${institutionToDelete.institutionName}" thành công!`,
      );

      // Update Redux state by removing the deleted institution
      const updatedInstitutions = institutions.filter(
        (inst) => inst.id !== institutionToDelete.id,
      );
      dispatch(setInstitutions(updatedInstitutions));

      // const cons1 = await API.admin.getInstitutionPendingCreate();
      // dispatch(setInstitutionPendingCreate(cons1.data.data));
      const cons2 = await API.admin.getInstitutionPendingUpdate();
      dispatch(setInstitutionPendingUpdate(cons2.data.data));


    } catch (error) {
      console.error("Error deleting institution:", error);
      setSnackbar({
        open: true,
        message: "Có lỗi xảy ra khi xóa cơ sở giáo dục!",
        severity: "error",
      });
    } finally {
      setDeleteLoading(false);
      setOpenDeleteDialog(false);
      setInstitutionToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
    setInstitutionToDelete(null);
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ width: "100%" }}>
      <EnhancedTableToolbar
        // numSelected={selected ? 1 : 0}
        // onEdit={() => {
        //   const institution = institutions.find(
        //     (l: Institution) => l.id === selected,
        //   );
        //   setSelectedInstitution({ institution });
        //   setOpenEditDialog(true);
        // }}
        // onDelete={handleDeleteClick}
        onSearch={handleSearch}
        searchTerm={searchTerm}
        onTypeFilter={handleTypeFilter}
        typeFilter={typeFilter}
        onStatusFilter={handleStatusFilter}
        statusFilter={statusFilter}
        // canEdit={canEdit}
        // canDelete={canDelete}
        canCreate={canCreate}
        onCreateClick={onCreateClick}
      />

      {/* Active Filters Display */}
      {(searchTerm || typeFilter || statusFilter !== "APPROVED") && (
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 1,

            backdropFilter: "blur(10px)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Typography variant="body2" sx={{ mr: 1 }}>
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
            {typeFilter && (
              <Chip
                label={`Loại: ${institutionTypes.find((t) => t.value === typeFilter)?.label}`}
                size="small"
                onDelete={() => setTypeFilter("")}
                color="secondary"
                variant="outlined"
              />
            )}
            {statusFilter !== "APPROVED" && (
              <Chip
                label={`Trạng thái: ${statusOptions.find((s) => s.value === statusFilter)?.label}`}
                size="small"
                onDelete={() => setStatusFilter("APPROVED")}
                color="success"
                variant="outlined"
              />
            )}
            <Button
              size="small"
              onClick={clearAllFilters}
              sx={{ ml: 1, textTransform: "none" }}
            >
              Xóa tất cả
            </Button>
          </Box>
        </Paper>
      )}

      <Paper
        sx={{
          borderRadius: 1,
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        }}
      >
        <TableContainer
          sx={{
            maxHeight: 600,
            width: "100%",
            overflowY: "auto",
            overflowX: "auto",
          }}
        >
          {/* Show no results message when filtered data is empty */}
          {filteredInstitutions.length === 0 ? (
            <Box
              sx={{
                p: 4,
                textAlign: "center",
                minHeight: 400,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                Không tìm thấy kết quả
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm
              </Typography>
              <Button
                onClick={clearAllFilters}
                sx={{ mt: 2, textTransform: "none" }}
                variant="outlined"
              >
                Xóa bộ lọc
              </Button>
            </Box>
          ) : (
            <Table
              sx={{ minWidth: 1200, width: "100%" }}
              aria-labelledby="tableTitle"
            >
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={filteredInstitutions.length}
                headCells={displayHeadCells}
              />
              <TableBody>
                {visibleRows.map((row, _blankindex) => {
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
                        transition: "all 0.3s ease",
                        "&:hover": {
                          bgcolor: "rgba(25, 118, 210, 0.08)",
                          transform: "scale(1.01)",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        },
                        "&.Mui-selected": {
                          bgcolor: "rgba(25, 118, 210, 0.15)",
                          borderLeft: "4px solid #1976d2",
                          "&:hover": {
                            bgcolor: "rgba(25, 118, 210, 0.2)",
                          },
                        },
                      }}
                    >
                      <TableCell sx={{ py: 2, minWidth: 200 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                          }}
                        >
                          <Avatar
                            src={row.logoUrl}
                            sx={{
                              width: 40,
                              height: 40,

                              background:
                                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            }}
                          >
                            <Business />
                          </Avatar>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 700 }}
                          >
                            {row.institutionName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Chip
                          label={getInstitutionType(row.institutionType)}
                          size="small"
                          sx={{
                            bgcolor:
                              row.institutionType === "UNIVERSITY"
                                ? "#e3f2fd"
                                : "#fff3e0",
                            color:
                              row.institutionType === "UNIVERSITY"
                                ? "#1976d2"
                                : "#f57c00",
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {row.phoneNumber}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 2, maxWidth: 200 }}>
                        {row.website && (
                          <Tooltip title={row.website} arrow>
                            <a
                              href={row.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: "#1976d2",
                                textDecoration: "none",
                                fontWeight: 500,
                              }}
                            >
                              {row.website.length > 25
                                ? `${row.website.substring(0, 25)}...`
                                : row.website}
                            </a>
                          </Tooltip>
                        )}
                      </TableCell>
                      <TableCell
                        sx={{
                          py: 2,
                          maxWidth: 180,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <Tooltip title={row.address} arrow>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {row.address}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {row.representativeName}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Chip
                          label={getStatus(row.status)}
                          size="small"
                          color={getStatusColor(row.status) as any}
                          variant="filled"
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      {showActionsColumn && (
                        <TableCell align="center" sx={{ py: 2 }}>
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              justifyContent: "center",
                            }}
                          >
                            {canEdit && (
                              <Tooltip title="Chỉnh sửa">
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedInstitution({
                                      institution: row,
                                    });
                                    setOpenEditDialog(true);
                                  }}
                                  sx={{
                                    bgcolor: "rgba(25, 118, 210, 0.1)",
                                    "&:hover": {
                                      bgcolor: "rgba(25, 118, 210, 0.2)",
                                    },
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            {canDelete && (
                              <Tooltip title="Xóa">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setInstitutionToDelete(row);
                                    setOpenDeleteDialog(true);
                                  }}
                                  sx={{
                                    bgcolor: "rgba(211, 47, 47, 0.1)",
                                    "&:hover": {
                                      bgcolor: "rgba(211, 47, 47, 0.2)",
                                    },
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>
                      )}
                      {/* <TableCell align="center" sx={{ py: 2 }}>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedInstitution({ institution: row });
                            setOpenEditDialog(true);
                          }}
                          sx={{
                            minWidth: 100,
                            borderRadius: 1,
                            textTransform: "none",
                            background:
                              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            fontWeight: 600,
                          }}
                        >
                          Chỉnh sửa
                        </Button>
                      </TableCell> */}
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: 53 * emptyRows,
                    }}
                  >
                    <TableCell colSpan={showActionsColumn ? 8 : 7} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Paper>

      {/* Edit Dialog */}
      <InstitutionProfileUpdateDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        institution={selectedInstitution?.institution}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title" sx={{ color: "error.main" }}>
          Xác nhận xóa cơ sở giáo dục
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Bạn có chắc chắn muốn xóa cơ sở giáo dục{" "}
            <strong>"{institutionToDelete?.institutionName}"</strong>?
            <br />
            <br />
            Hành động này không thể hoàn tác và sẽ xóa vĩnh viễn tất cả dữ liệu
            liên quan.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={deleteLoading}>
            Hủy
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleteLoading}
            sx={{
              background: "linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)",
            }}
          >
            {deleteLoading ? "Đang xóa..." : "Xóa"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InstitutionTab;
