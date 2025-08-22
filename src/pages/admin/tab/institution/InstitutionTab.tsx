import { useMemo, useState } from "react";
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Chip,
  Avatar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { Business } from "@mui/icons-material";
import type { Institution } from "../../../../types/Institution";
import InstitutionEditDialog from "../../../../components/InstitutionEditDialog";

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
    id: "businessRegistrationNumber",
    numeric: false,
    disablePadding: false,
    label: "Số ĐKKD",
  },
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
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: keyof Institution) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{
              fontWeight: 700,
              backgroundColor: "#f8f9fa",
              color: "#2c3e50",
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
                "&.MuiTableSortLabel-root": {
                  color: "#2c3e50",
                },
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
  numSelected: number;
  onEdit?: () => void;
  onSearch: (value: string) => void;
  searchTerm: string;
  onTypeFilter: (value: string) => void;
  typeFilter: string;
  onStatusFilter: (value: string) => void;
  statusFilter: string;
}

function EnhancedTableToolbar({
  numSelected,
  onEdit,
  onSearch,
  searchTerm,
  onTypeFilter,
  typeFilter,
  onStatusFilter,
  statusFilter,
}: EnhancedTableToolbarProps) {
  return (
    <Box
      sx={{
        p: 3,
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        borderRadius: 3,
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
              bgcolor: "primary.main",
              background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
              width: 56,
              height: 56,
            }}
          >
            <Business sx={{ fontSize: 28 }} />
          </Avatar>
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: "#2c3e50", mb: 0.5 }}
            >
              Quản lý Cơ sở Giáo dục
            </Typography>
            <Typography variant="body2" sx={{ color: "#6c757d" }}>
              Quản lý thông tin các cơ sở giáo dục trong hệ thống
            </Typography>
          </Box>
        </Box>

        {numSelected > 0 && (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="Chỉnh sửa">
              <IconButton
                color="primary"
                onClick={onEdit}
                sx={{
                  bgcolor: "rgba(25, 118, 210, 0.1)",
                  "&:hover": {
                    bgcolor: "rgba(25, 118, 210, 0.2)",
                  },
                }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Xóa">
              <IconButton
                color="error"
                sx={{
                  bgcolor: "rgba(211, 47, 47, 0.1)",
                  "&:hover": {
                    bgcolor: "rgba(211, 47, 47, 0.2)",
                  },
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}
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
                bgcolor: "white",
                borderRadius: 2,
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
                bgcolor: "white",
                borderRadius: 2,
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
                  <IconButton size="small" onClick={() => onSearch("")}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

// Helper function để hiển thị tên loại cơ sở giáo dục
const getInstitutionTypeDisplay = (type: string) => {
  switch (type) {
    case "UNIVERSITY":
      return "ĐH";
    case "TRAINING_CENTER":
      return "TTDT";
    default:
      return type;
  }
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

interface InstitutionTabProps {
  institutions: Institution[];
}

const InstitutionTab: React.FC<InstitutionTabProps> = ({ institutions }) => {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState<any>(null);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Institution>("id");
  const [selected, setSelected] = useState<string | null>(null);

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

  return (
    <Box sx={{ width: "100%" }}>
      <EnhancedTableToolbar
        numSelected={selected ? 1 : 0}
        onEdit={() => {
          const institution = institutions.find(
            (l: Institution) => l.id === selected,
          );
          setSelectedInstitution({ institution });
          setOpenEditDialog(true);
        }}
        onSearch={handleSearch}
        searchTerm={searchTerm}
        onTypeFilter={handleTypeFilter}
        typeFilter={typeFilter}
        onStatusFilter={handleStatusFilter}
        statusFilter={statusFilter}
      />

      {/* Active Filters Display */}
      {(searchTerm || typeFilter || statusFilter !== "APPROVED") && (
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 2,
            bgcolor: "rgba(255,255,255,0.9)",
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
          borderRadius: 3,
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
              sx={{ minWidth: 1400, width: "100%" }}
              aria-labelledby="tableTitle"
            >
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={filteredInstitutions.length}
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
                      <TableCell sx={{ py: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {row.businessRegistrationNumber}
                        </Typography>
                      </TableCell>
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
                              bgcolor: "primary.main",
                              background:
                                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            }}
                          >
                            <Business />
                          </Avatar>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 700, color: "#2c3e50" }}
                          >
                            {row.institutionName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Chip
                          label={getInstitutionTypeDisplay(row.institutionType)}
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
                          label={getStatusLabel(row.status)}
                          size="small"
                          color={getStatusColor(row.status) as any}
                          variant="filled"
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ py: 2 }}>
                        <Button
                          variant="contained"
                          size="small"
                          // onClick={(e) => {
                          // e.stopPropagation();
                          // window.open(
                          //   `/institution-info/${row.id}`,
                          //   "_blank",
                          // );
                          // }}
                          sx={{
                            minWidth: 100,
                            borderRadius: 2,
                            textTransform: "none",
                            background:
                              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            fontWeight: 600,
                          }}
                        >
                          Chỉnh sửa
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
          )}
        </TableContainer>
      </Paper>

      {/* Edit Dialog */}
      <InstitutionEditDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        institution={selectedInstitution?.institution}
      />
    </Box>
  );
};

export default InstitutionTab;
