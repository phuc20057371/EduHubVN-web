import { useEffect, useMemo, useState, type SyntheticEvent } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { API } from "../../utils/Fetch";
import { setInstitutionPendingCreate } from "../../redux/slice/InstitutionPendingCreateSlice";
import { setInstitutionPendingUpdate } from "../../redux/slice/InstitutionPendingUpdateSlice";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import InstitutionDetailDialog from "../../components/InstitutionDetailDialog";
import InstitutionDetailUpdateDialog from "../../components/InstitutionDetailUpdateDialog";
import type { Institution } from "../../types/Institution";
import { visuallyHidden } from "@mui/utils";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
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
  Card,
  CardContent,
} from "@mui/material";
import { setInstitutions } from "../../redux/slice/InstitutionSlice";
import InstitutionEditDialog from "../../components/InstitutionEditDialog";
import { Business, Add, Update } from "@mui/icons-material";
import * as React from "react";

// Memoized selectors
const selectInstitutionPendingCreate = createSelector(
  (state: any) => state.institutionPendingCreate,
  (institutionPendingCreate) =>
    Array.isArray(institutionPendingCreate) ? institutionPendingCreate : [],
);

const selectInstitutionPendingUpdate = createSelector(
  (state: any) => state.institutionPendingUpdate,
  (institutionPendingUpdate) =>
    Array.isArray(institutionPendingUpdate) ? institutionPendingUpdate : [],
);

const selectInstitutions = createSelector(
  (state: any) => state.institution,
  (institution) => (Array.isArray(institution) ? institution : []),
);

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
  id: keyof Institution;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  // { id: "id", numeric: true, disablePadding: false, label: "ID" },
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
      <TableRow
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 2,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        {headCells.map((headCell) => (
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
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
              {searchTerm || typeFilter || statusFilter !== "APPROVED"
                ? "Đã lọc"
                : "Tất cả"}{" "}
              cơ sở giáo dục
            </Typography>
          </Box>
        </Box>

        {numSelected > 0 && (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="Chỉnh sửa">
              <IconButton
                onClick={onEdit}
                sx={{
                  bgcolor: "primary.main",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  width: 48,
                  height: 48,
                  "&:hover": {
                    bgcolor: "primary.dark",
                    transform: "scale(1.05)",
                  },
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

      {/* Filter Controls */}
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
            <InputLabel id="type-select-label">Loại cơ sở</InputLabel>
            <Select
              labelId="type-select-label"
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
            <InputLabel id="status-select-label">Trạng thái</InputLabel>
            <Select
              labelId="status-select-label"
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
            placeholder="🔍 Tìm kiếm theo ID, tên, địa chỉ, đại diện..."
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

const AdminInstitutionPage = () => {
  const dispatch = useDispatch();
  const [value, setValue] = useState("1");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState<any>(null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Institution>("id");
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedUpdate, setSelectedUpdate] = useState<{
    oldData: any;
    newData: any;
  } | null>(null);

  // Filter states for main list
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("APPROVED");

  // Filter states for Create tab
  const [createSearchTerm, setCreateSearchTerm] = useState("");
  const [createDateSort, setCreateDateSort] = useState("oldest");

  // Filter states for Update tab
  const [updateSearchTerm, setUpdateSearchTerm] = useState("");
  const [updateDateSort, setUpdateDateSort] = useState("oldest");

  const institutionPendingCreate = useSelector(selectInstitutionPendingCreate);
  const institutionPendingUpdate = useSelector(selectInstitutionPendingUpdate);
  const institutions = useSelector(selectInstitutions);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.admin.getAllInstitutions();
        dispatch(setInstitutions(res.data.data));
        console.log("Institutions:", res.data.data);
        const response = await API.admin.getInstitutionPendingCreate();
        dispatch(setInstitutionPendingCreate(response.data.data));
        console.log("Institution pending create requests:", response.data.data);
        const updateResponse = await API.admin.getInstitutionPendingUpdate();
        dispatch(setInstitutionPendingUpdate(updateResponse.data.data));
        console.log(
          "Institution pending update requests:",
          updateResponse.data.data,
        );
      } catch (error) {
        console.error("Error initializing AdminInstitutionPage:", error);
      }
    };
    fetchData();
  }, [dispatch]);

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
    console.log(row);
  };

  const handleChange = (_event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
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

  // Filtered and sorted create list with enhanced search
  const filteredCreateList = useMemo(() => {
    let filtered = institutionPendingCreate;

    // Filter by search term (search across multiple fields including ID)
    if (createSearchTerm) {
      const searchLower = createSearchTerm.toLowerCase();

      filtered = filtered.filter(
        (item: any) =>
          // Search by ID (exact match or partial match for UUID)
          item.id?.toLowerCase().includes(searchLower) ||
          // Existing search fields
          item.institutionName?.toLowerCase().includes(searchLower) ||
          item.representativeName?.toLowerCase().includes(searchLower) ||
          item.businessRegistrationNumber
            ?.toLowerCase()
            .includes(searchLower) ||
          item.address?.toLowerCase().includes(searchLower) ||
          item.description?.toLowerCase().includes(searchLower) ||
          item.phoneNumber?.includes(createSearchTerm) ||
          item.website?.toLowerCase().includes(searchLower),
      );
    }

    // Sort by date with proper date handling
    filtered = [...filtered].sort((a: any, b: any) => {
      const dateA = new Date(a.updatedAt || a.createdAt || 0);
      const dateB = new Date(b.updatedAt || b.createdAt || 0);

      if (createDateSort === "oldest") {
        return dateA.getTime() - dateB.getTime();
      } else {
        return dateB.getTime() - dateA.getTime();
      }
    });

    return filtered;
  }, [institutionPendingCreate, createSearchTerm, createDateSort]);

  // Filtered and sorted update list with enhanced search
  const filteredUpdateList = useMemo(() => {
    let filtered = institutionPendingUpdate;

    // Filter by search term (search across multiple fields including ID)
    if (updateSearchTerm) {
      const searchLower = updateSearchTerm.toLowerCase();

      filtered = filtered.filter((item: any) => {
        const edu = item.educationInstitution;
        const eduUpdate = item.educationInstitutionUpdate;

        return (
          // Search by ID (exact match or partial match for UUID)
          item.id?.toLowerCase().includes(searchLower) ||
          edu?.id?.toLowerCase().includes(searchLower) ||
          // Existing search fields
          edu?.institutionName?.toLowerCase().includes(searchLower) ||
          edu?.representativeName?.toLowerCase().includes(searchLower) ||
          edu?.businessRegistrationNumber
            ?.toLowerCase()
            .includes(searchLower) ||
          edu?.address?.toLowerCase().includes(searchLower) ||
          edu?.description?.toLowerCase().includes(searchLower) ||
          edu?.phoneNumber?.includes(updateSearchTerm) ||
          edu?.website?.toLowerCase().includes(searchLower) ||
          eduUpdate?.institutionName?.toLowerCase().includes(searchLower) ||
          eduUpdate?.representativeName?.toLowerCase().includes(searchLower) ||
          eduUpdate?.address?.toLowerCase().includes(searchLower)
        );
      });
    }

    // Sort by date with proper date handling
    filtered = [...filtered].sort((a: any, b: any) => {
      const dateA = new Date(a.updatedAt || a.createdAt || 0);
      const dateB = new Date(b.updatedAt || b.createdAt || 0);

      if (updateDateSort === "oldest") {
        return dateA.getTime() - dateB.getTime();
      } else {
        return dateB.getTime() - dateA.getTime();
      }
    });

    return filtered;
  }, [institutionPendingUpdate, updateSearchTerm, updateDateSort]);

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

  // Clear create tab filters
  const clearCreateFilters = () => {
    setCreateSearchTerm("");
    setCreateDateSort("oldest");
  };

  // Clear update tab filters
  const clearUpdateFilters = () => {
    setUpdateSearchTerm("");
    setUpdateDateSort("oldest");
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

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "fix-content",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        p: 3,
      }}
    >
      <TabContext value={value}>
        <Paper
          elevation={0}
          sx={{
            mb: 3,
            borderRadius: 3,
            overflow: "hidden",
            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            border: "1px solid rgba(255,255,255,0.8)",
          }}
        >
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              bgcolor: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(10px)",
            }}
          >
            <TabList
              onChange={handleChange}
              aria-label="institution management tabs"
              sx={{
                px: 3,
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "1rem",
                  minHeight: 60,
                },
              }}
            >
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Business />
                    <span>Cơ sở Giáo dục</span>
                    <Chip
                      size="small"
                      label={filteredInstitutions.length}
                      sx={{
                        bgcolor: "primary.main",
                        color: "white",
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                }
                value="1"
              />
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Add />
                    <span>Tạo mới</span>
                    <Chip
                      size="small"
                      label={filteredCreateList.length}
                      sx={{
                        bgcolor: "success.main",
                        color: "white",
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                }
                value="2"
              />
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Update />
                    <span>Cập nhật</span>
                    <Chip
                      size="small"
                      label={filteredUpdateList.length}
                      sx={{
                        bgcolor: "warning.main",
                        color: "white",
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                }
                value="3"
              />
            </TabList>
          </Box>
        </Paper>

        <TabPanel value="1" sx={{ p: 0 }}>
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
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
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
                          sx={{
                            cursor: "pointer",
                            "&:nth-of-type(odd)": {
                              bgcolor: isItemSelected
                                ? "rgba(25, 118, 210, 0.15)"
                                : "rgba(0, 0, 0, 0.02)",
                            },
                            "&:nth-of-type(even)": {
                              bgcolor: isItemSelected
                                ? "rgba(25, 118, 210, 0.15)"
                                : "white",
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
                          {/* <TableCell
                            component="th"
                            align="right"
                            id={labelId}
                            scope="row"
                            padding="normal"
                            sx={{
                              fontWeight: 700,
                              color: "primary.main",
                              width: 120,
                              fontSize: "0.9rem",
                            }}
                          >
                            {row.id?.substring(0, 8)}...
                          </TableCell> */}
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
                              label={getInstitutionTypeDisplay(
                                row.institutionType,
                              )}
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
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {row.address}
                            </Typography>
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
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(
                                  `/institution-info/${row.id}`,
                                  "_blank",
                                );
                              }}
                              sx={{
                                minWidth: 100,
                                borderRadius: 2,
                                textTransform: "none",
                                background:
                                  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                fontWeight: 600,
                              }}
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
                        <TableCell colSpan={11} />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </TableContainer>
          </Paper>
        </TabPanel>

        <TabPanel value="2">
          {/* Enhanced Header for Create Tab */}
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Avatar
                sx={{
                  bgcolor: "success.main",
                  background: "linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)",
                  width: 56,
                  height: 56,
                }}
              >
                <Add sx={{ fontSize: 28 }} />
              </Avatar>
              <Box>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, color: "#2c3e50", mb: 0.5 }}
                >
                  Yêu cầu đăng ký cơ sở giáo dục mới
                </Typography>
                <Typography variant="body2" sx={{ color: "#6c757d" }}>
                  {(createSearchTerm || createDateSort !== "oldest")
                    ? `Đã lọc ${filteredCreateList.length} yêu cầu`
                    : `Tổng cộng ${filteredCreateList.length} yêu cầu chờ phê duyệt`}
                </Typography>
              </Box>
            </Box>

            {/* Enhanced Filter Controls for Create Tab */}
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
                  <InputLabel id="create-date-sort-label">
                    Sắp xếp theo ngày
                  </InputLabel>
                  <Select
                    labelId="create-date-sort-label"
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

              <Box sx={{ flex: "1 1 400px", minWidth: 400 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="🔍 Tìm kiếm theo ID, tên, địa chỉ, đại diện, ĐKKD..."
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

            {/* Filter summary for create tab */}
            {(createSearchTerm || createDateSort !== "oldest") && (
              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flexWrap: "wrap",
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
                    color="secondary"
                    variant="outlined"
                  />
                )}
              </Box>
            )}
          </Paper>

          {/* Show no results message when filtered data is empty */}
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
              {filteredCreateList.map((item: any, idx: number) => (
                <Card
                  key={item.id || idx}
                  sx={{
                    height: "100%",
                    transition: "all 0.3s ease",
                    border: "2px solid",
                    borderColor: "success.light",
                    borderRadius: 3,
                    background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 12px 40px rgba(76, 175, 80, 0.2)",
                      borderColor: "success.main",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Avatar
                        src={item.logoUrl || ""}
                        sx={{
                          bgcolor: "success.main",
                          background: "linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)",
                          mr: 2,
                          width: 48,
                          height: 48,
                        }}
                      >
                        <Business />
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 700, mb: 0.5, color: "#2c3e50" }}
                        >
                          {item.institutionName}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Chip
                            label={getInstitutionTypeDisplay(
                              item.institutionType,
                            )}
                            size="small"
                            sx={{
                              bgcolor: "#e3f2fd",
                              color: "#1976d2",
                              fontWeight: 600,
                            }}
                          />
                          <Chip
                            label="Đăng ký mới"
                            size="small"
                            sx={{
                              bgcolor: "success.main",
                              color: "white",
                              fontWeight: 600,
                            }}
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
                        <strong>Đại diện:</strong> {item.representativeName} (
                        {item.position})
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        <strong>ĐKKD:</strong> {item.businessRegistrationNumber}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        <strong>Năm thành lập:</strong> {item.establishedYear}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        <strong>Địa chỉ:</strong> {item.address}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        <strong>Thời gian:</strong>{" "}
                        {(() => {
                          if (!item.updatedAt && !item.createdAt)
                            return "Chưa cập nhật";

                          const now = new Date();
                          const updatedTime = new Date(
                            item.updatedAt || item.createdAt,
                          );
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
                      fullWidth
                      sx={{
                        mt: "auto",
                        borderRadius: 2,
                        textTransform: "none",
                        background:
                          "linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)",
                        fontWeight: 600,
                        py: 1.5,
                      }}
                      onClick={() => {
                        setSelectedInstitution(item);
                        setOpenDialog(true);
                      }}
                    >
                      Xem chi tiết
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : (
            <Paper
              sx={{
                p: 4,
                textAlign: "center",
                borderRadius: 3,
                background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              }}
            >
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                {createSearchTerm || createDateSort !== "oldest"
                  ? "Không tìm thấy kết quả"
                  : "Không có yêu cầu nào"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {createSearchTerm || createDateSort !== "oldest"
                  ? "Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm"
                  : "Hiện tại không có yêu cầu đăng ký cơ sở giáo dục mới nào cần xử lý."}
              </Typography>
              {(createSearchTerm || createDateSort !== "oldest") && (
                <Button
                  onClick={clearCreateFilters}
                  sx={{ mt: 2, textTransform: "none" }}
                  variant="outlined"
                >
                  Xóa bộ lọc
                </Button>
              )}
            </Paper>
          )}
        </TabPanel>

        <TabPanel value="3">
          {/* Enhanced Header for Update Tab - similar to Create Tab but with warning colors */}
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Avatar
                sx={{
                  bgcolor: "warning.main",
                  background: "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)",
                  width: 56,
                  height: 56,
                }}
              >
                <Update sx={{ fontSize: 28 }} />
              </Avatar>
              <Box>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, color: "#2c3e50", mb: 0.5 }}
                >
                  Yêu cầu cập nhật thông tin cơ sở giáo dục
                </Typography>
                <Typography variant="body2" sx={{ color: "#6c757d" }}>
                  {(updateSearchTerm || updateDateSort !== "oldest")
                    ? `Đã lọc ${filteredUpdateList.length} yêu cầu`
                    : `Tổng cộng ${filteredUpdateList.length} yêu cầu chờ phê duyệt`}
                </Typography>
              </Box>
            </Box>

            {/* Similar enhanced filter controls for Update Tab */}
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
                  <InputLabel id="update-date-sort-label">
                    Sắp xếp theo ngày
                  </InputLabel>
                  <Select
                    labelId="update-date-sort-label"
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

              <Box sx={{ flex: "1 1 400px", minWidth: 400 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="🔍 Tìm kiếm theo ID, tên, địa chỉ, đại diện, ĐKKD..."
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

              <Button
                size="small"
                onClick={clearUpdateFilters}
                disabled={!updateSearchTerm && updateDateSort === "oldest"}
                sx={{ textTransform: "none" }}
              >
                Xóa bộ lọc
              </Button>
            </Box>

            {/* Filter summary for update tab */}
            {(updateSearchTerm || updateDateSort !== "oldest") && (
              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flexWrap: "wrap",
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
                    color="secondary"
                    variant="outlined"
                  />
                )}
              </Box>
            )}
          </Paper>

          {/* Update cards with enhanced styling similar to create tab but with warning colors */}
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
            {filteredUpdateList.map((item: any, idx: number) => {
              const edu = item.educationInstitution;
              const eduUpdate = item.educationInstitutionUpdate;
              if (edu && eduUpdate) {
                return (
                  <Card
                    key={item.id || idx}
                    sx={{
                      height: "100%",
                      transition: "all 0.3s ease",
                      border: "2px solid",
                      borderColor: "warning.light",
                      borderRadius: 3,
                      background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 12px 40px rgba(255, 152, 0, 0.2)",
                        borderColor: "warning.main",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <Avatar
                          src={edu.logoUrl || ""}
                          sx={{
                            bgcolor: "warning.main",
                            background: "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)",
                            mr: 2,
                            width: 48,
                            height: 48,
                          }}
                        >
                          <Business />
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 700, mb: 0.5, color: "#2c3e50" }}
                          >
                            {edu.institutionName}
                          </Typography>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Chip
                              label={getInstitutionTypeDisplay(
                                edu.institutionType,
                              )}
                              size="small"
                              sx={{
                                bgcolor: "#e3f2fd",
                                color: "#1976d2",
                                fontWeight: 600,
                              }}
                            />
                            <Chip
                              label="Cập nhật"
                              size="small"
                              sx={{
                                bgcolor: "warning.main",
                                color: "white",
                                fontWeight: 600,
                              }}
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
                          <strong>Đại diện:</strong> {edu.representativeName}{" "}
                          ({edu.position})
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          <strong>ĐKKD:</strong> {edu.businessRegistrationNumber}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          <strong>Năm thành lập:</strong> {edu.establishedYear}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          <strong>Địa chỉ:</strong> {edu.address}
                        </Typography>
                      </Box>

                      <Button
                        variant="contained"
                        fullWidth
                        sx={{
                          mt: "auto",
                          borderRadius: 2,
                          textTransform: "none",
                          background:
                            "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)",
                          fontWeight: 600,
                          py: 1.5,
                        }}
                        onClick={() => {
                          setSelectedUpdate({
                            oldData: edu,
                            newData: eduUpdate,
                          });
                          setOpenUpdateDialog(true);
                        }}
                      >
                        Xem chi tiết
                      </Button>
                    </CardContent>
                  </Card>
                );
              }
              return null;
            })}
          </Box>
        </TabPanel>
      </TabContext>

      {/* Dialogs */}
      <InstitutionDetailDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        institution={selectedInstitution || {}}
      />
      <InstitutionDetailUpdateDialog
        open={openUpdateDialog}
        onClose={() => setOpenUpdateDialog(false)}
        oldData={selectedUpdate?.oldData}
        newData={selectedUpdate?.newData}
      />
      <InstitutionEditDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        institution={selectedInstitution?.institution}
      />
    </Box>
  );
};

export default AdminInstitutionPage;
