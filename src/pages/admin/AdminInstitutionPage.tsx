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
import { alpha } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FilterListIcon from "@mui/icons-material/FilterList";
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
  Toolbar,
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
  { id: "id", numeric: true, disablePadding: false, label: "ID" },
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
  // Use the same arrays as in the component

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
        Danh sách Cơ sở Giáo dục (
        {searchTerm || typeFilter || statusFilter ? "Đã lọc" : "Tất cả"})
      </Typography>

      {/* Filter Controls */}
      <Box
        sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}
      >
        {/* Institution Type Filter */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="type-select-label">Loại cơ sở</InputLabel>
          <Select
            labelId="type-select-label"
            value={typeFilter}
            label="Loại cơ sở"
            onChange={(e) => onTypeFilter(e.target.value)}
          >
            {institutionTypes.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
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
          placeholder="Tìm kiếm theo tên, địa chỉ, đại diện..."
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
  const [selected, setSelected] = useState<number | null>(null);
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

    // Filter by search term (comprehensive search across multiple fields)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item: Institution) =>
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

    // Filter by search term (search across multiple fields)
    if (createSearchTerm) {
      const searchLower = createSearchTerm.toLowerCase();
      filtered = filtered.filter(
        (item: any) =>
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

    // Filter by search term (search across multiple fields)
    if (updateSearchTerm) {
      const searchLower = updateSearchTerm.toLowerCase();
      filtered = filtered.filter((item: any) => {
        const edu = item.educationInstitution;
        const eduUpdate = item.educationInstitutionUpdate;

        return (
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
        typography: "body1",
        bgcolor: "background.default",
        minHeight: "fix-content",
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
              aria-label="institution management tabs"
              sx={{ px: 2 }}
            >
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Business />
                    <span>Cơ sở Giáo dục</span>
                    <Chip
                      size="small"
                      label={filteredInstitutions.length}
                      color="primary"
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
                      color="success"
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
                      color="warning"
                    />
                  </Box>
                }
                value="3"
              />
            </TabList>
          </Box>
        </Paper>

        <TabPanel value="1" sx={{ p: 0 }}>
          <Paper sx={{ width: "100%", borderRadius: 2, overflow: "hidden" }}>
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

            {/* Add filter summary and clear button */}
            {(searchTerm || typeFilter || statusFilter !== "APPROVED") && (
              <Box sx={{ px: 2, pb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flexWrap: "wrap",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Đang lọc:
                  </Typography>
                  {searchTerm && (
                    <Chip
                      label={`Tìm kiếm: "${searchTerm}"`}
                      size="small"
                      onDelete={() => setSearchTerm("")}
                      variant="outlined"
                    />
                  )}
                  {typeFilter && (
                    <Chip
                      label={`Loại: ${institutionTypes.find((t) => t.value === typeFilter)?.label}`}
                      size="small"
                      onDelete={() => setTypeFilter("")}
                      variant="outlined"
                    />
                  )}
                  {statusFilter !== "APPROVED" && (
                    <Chip
                      label={`Trạng thái: ${statusOptions.find((s) => s.value === statusFilter)?.label}`}
                      size="small"
                      onDelete={() => setStatusFilter("APPROVED")}
                      variant="outlined"
                    />
                  )}
                  <Button size="small" onClick={clearAllFilters} sx={{ ml: 1 }}>
                    Xóa tất cả bộ lọc
                  </Button>
                </Box>
              </Box>
            )}

            <TableContainer
              sx={{
                maxHeight: 10 * 53 + 56,
                width: "100%",
                overflowY: "auto",
                overflowX: "auto",
              }}
            >
              {/* Show no results message when filtered data is empty */}
              {filteredInstitutions.length === 0 ? (
                <Box sx={{ p: 4, textAlign: "center" }}>
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
                  <Button onClick={clearAllFilters} sx={{ mt: 2 }}>
                    Xóa bộ lọc
                  </Button>
                </Box>
              ) : (
                <Table
                  sx={{ minWidth: 900, width: "100%" }}
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
                          <TableCell>
                            {row.businessRegistrationNumber}
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: "bold" }}
                            >
                              {row.institutionName}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={getInstitutionTypeDisplay(
                                row.institutionType,
                              )}
                              size="small"
                              variant="outlined"
                              color="primary"
                            />
                          </TableCell>
                          <TableCell>{row.phoneNumber}</TableCell>
                          <TableCell>
                            {row.website && (
                              <a
                                href={row.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  color: "#1976d2",
                                  textDecoration: "none",
                                }}
                              >
                                {row.website.length > 30
                                  ? `${row.website.substring(0, 30)}...`
                                  : row.website}
                              </a>
                            )}
                          </TableCell>
                          <TableCell sx={{ maxWidth: 150,  textOverflow: "ellipsis" }}>
                            {row.address}
                          </TableCell>
                          <TableCell>{row.representativeName}</TableCell>
                          
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
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(
                                  `/institution-info/${row.id}`,
                                  "_blank",
                                );
                              }}
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
              )}
            </TableContainer>
          </Paper>
        </TabPanel>

        <TabPanel value="2">
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "primary.main", mb: 1 }}
            >
              Yêu cầu đăng ký cơ sở giáo dục mới
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Danh sách các yêu cầu đăng ký cơ sở giáo dục chờ phê duyệt
            </Typography>
          </Box>

          {/* Enhanced Filter Controls for Create Tab */}
          <Paper sx={{ mb: 3, p: 2, borderRadius: 2 }}>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
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

              <TextField
                variant="outlined"
                size="small"
                placeholder="Tìm kiếm theo tên, địa chỉ, đại diện, ĐKKD..."
                value={createSearchTerm}
                onChange={(e) => setCreateSearchTerm(e.target.value)}
                sx={{ minWidth: 400 }}
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

              <Button
                size="small"
                onClick={clearCreateFilters}
                disabled={!createSearchTerm && createDateSort === "oldest"}
              >
                Xóa bộ lọc
              </Button>

              <Typography variant="body2" color="text.secondary">
                Tổng cộng: {filteredCreateList.length} yêu cầu
              </Typography>
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
                <Typography variant="body2" color="text.secondary">
                  Đang lọc:
                </Typography>
                {createSearchTerm && (
                  <Chip
                    label={`Tìm kiếm: "${createSearchTerm}"`}
                    size="small"
                    onDelete={() => setCreateSearchTerm("")}
                    variant="outlined"
                  />
                )}
                {createDateSort !== "oldest" && (
                  <Chip
                    label={`Sắp xếp: ${createDateSort === "newest" ? "Mới nhất trước" : "Cũ nhất trước"}`}
                    size="small"
                    onDelete={() => setCreateDateSort("oldest")}
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
                        src={item.logoUrl || ""}
                        sx={{ bgcolor: "success.main", mr: 2 }}
                      >
                        <Business />
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: "bold", mb: 0.5 }}
                        >
                          {item.institutionName}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Chip
                            label={getInstitutionTypeDisplay(
                              item.institutionType,
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
                      color="success"
                      fullWidth
                      sx={{ mt: "auto" }}
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
            <Paper sx={{ p: 4, textAlign: "center" }}>
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
                <Button onClick={clearCreateFilters} sx={{ mt: 2 }}>
                  Xóa bộ lọc
                </Button>
              )}
            </Paper>
          )}
        </TabPanel>

        <TabPanel value="3">
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "primary.main", mb: 1 }}
            >
              Yêu cầu cập nhật thông tin cơ sở giáo dục
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Danh sách các yêu cầu cập nhật thông tin cơ sở giáo dục chờ phê
              duyệt
            </Typography>
          </Box>

          {/* Enhanced Filter Controls for Update Tab */}
          <Paper sx={{ mb: 3, p: 2, borderRadius: 2 }}>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
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

              <TextField
                variant="outlined"
                size="small"
                placeholder="Tìm kiếm theo tên, địa chỉ, đại diện, ĐKKD..."
                value={updateSearchTerm}
                onChange={(e) => setUpdateSearchTerm(e.target.value)}
                sx={{ minWidth: 400 }}
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

              <Button
                size="small"
                onClick={clearUpdateFilters}
                disabled={!updateSearchTerm && updateDateSort === "oldest"}
              >
                Xóa bộ lọc
              </Button>

              <Typography variant="body2" color="text.secondary">
                Tổng cộng: {filteredUpdateList.length} yêu cầu
              </Typography>
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
                <Typography variant="body2" color="text.secondary">
                  Đang lọc:
                </Typography>
                {updateSearchTerm && (
                  <Chip
                    label={`Tìm kiếm: "${updateSearchTerm}"`}
                    size="small"
                    onDelete={() => setUpdateSearchTerm("")}
                    variant="outlined"
                  />
                )}
                {updateDateSort !== "oldest" && (
                  <Chip
                    label={`Sắp xếp: ${updateDateSort === "newest" ? "Mới nhất trước" : "Cũ nhất trước"}`}
                    size="small"
                    onDelete={() => setUpdateDateSort("oldest")}
                    variant="outlined"
                  />
                )}
              </Box>
            )}
          </Paper>

          {/* Show no results message when filtered data is empty */}
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
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: 4,
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
                            sx={{ bgcolor: "warning.main", mr: 2 }}
                          >
                            <Business />
                          </Avatar>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: "bold", mb: 0.5 }}
                            >
                              {edu.institutionName}
                            </Typography>
                            <Box sx={{ display: "flex", gap: 1 }}>
                              <Chip
                                label={getInstitutionTypeDisplay(
                                  edu.institutionType,
                                )}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                              <Chip
                                label="Cập nhật"
                                size="small"
                                color="warning"
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
                            <strong>ĐKKD:</strong>{" "}
                            {edu.businessRegistrationNumber}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                          >
                            <strong>Năm thành lập:</strong>{" "}
                            {edu.establishedYear}
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
                          color="warning"
                          fullWidth
                          sx={{ mt: "auto" }}
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
          ) : (
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                {updateSearchTerm || updateDateSort !== "oldest"
                  ? "Không tìm thấy kết quả"
                  : "Không có yêu cầu nào"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {updateSearchTerm || updateDateSort !== "oldest"
                  ? "Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm"
                  : "Hiện tại không có yêu cầu cập nhật cơ sở giáo dục nào cần xử lý."}
              </Typography>
              {(updateSearchTerm || updateDateSort !== "oldest") && (
                <Button onClick={clearUpdateFilters} sx={{ mt: 2 }}>
                  Xóa bộ lọc
                </Button>
              )}
            </Paper>
          )}
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
