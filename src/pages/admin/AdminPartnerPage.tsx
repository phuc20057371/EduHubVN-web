import { useEffect, useState, useMemo, type SyntheticEvent } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { API } from "../../utils/Fetch";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { setPartnerPendingCreate } from "../../redux/slice/PartnerPendingCreateSlice";
import { setPartnerPendingUpdate } from "../../redux/slice/PartnerPendingUpdateSlice";
import PartnerDetailDialog from "../../components/PartnerDetailDialog";
import PartnerDetailUpdateDialog from "../../components/PartnerDetailUpdateDialog";
import PartnerEditDialog from "../../components/PartnerEditDialog";
import type { Partner } from "../../types/Parner";
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
import { setPartner } from "../../redux/slice/PartnerSlice";
import {
  Add,
  Update,
  Domain,
} from "@mui/icons-material";
import * as React from "react";

// Memoized selectors
const selectPartnerPendingCreate = createSelector(
  (state: any) => state.partnerPendingCreate,
  (partnerPendingCreate) =>
    Array.isArray(partnerPendingCreate) ? partnerPendingCreate : [],
);

const selectPartnerPendingUpdate = createSelector(
  (state: any) => state.partnerPendingUpdate,
  (partnerPendingUpdate) =>
    Array.isArray(partnerPendingUpdate) ? partnerPendingUpdate : [],
);

const selectPartners = createSelector(
  (state: any) => state.partner,
  (partner) => (Array.isArray(partner) ? partner : []),
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
  id: keyof Partner;
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
    id: "organizationName",
    numeric: false,
    disablePadding: false,
    label: "Tên tổ chức",
  },
  {
    id: "industry",
    numeric: false,
    disablePadding: false,
    label: "Lĩnh vực",
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

interface EnhancedTableProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Partner,
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: keyof Partner) => (event: React.MouseEvent<unknown>) => {
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
  onIndustryFilter: (value: string) => void;
  industryFilter: string;
  onStatusFilter: (value: string) => void;
  statusFilter: string;
}

function EnhancedTableToolbar({
  numSelected,
  onEdit,
  onSearch,
  searchTerm,
  industryFilter,
  onStatusFilter,
  statusFilter,
}: EnhancedTableToolbarProps) {

  const statusOptions = [
    { value: "", label: "Tất cả" },
    { value: "APPROVED", label: "Đã duyệt" },
    { value: "PENDING", label: "Chờ duyệt" },
    { value: "REJECTED", label: "Đã từ chối" },
  ];

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
            <Domain sx={{ fontSize: 28 }} />
          </Avatar>
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: "#2c3e50", mb: 0.5 }}
            >
              Quản lý Đối tác
            </Typography>
            <Typography variant="body2" sx={{ color: "#6c757d" }}>
              {searchTerm || industryFilter || statusFilter !== "APPROVED"
                ? "Đã lọc"
                : "Tất cả"}{" "
              } đối tác
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

const AdminPartnerPage = () => {
  const dispatch = useDispatch();
  
  // Define industries and statusOptions at component level for reuse

  const statusOptions = [
    { value: "", label: "Tất cả" },
    { value: "APPROVED", label: "Đã duyệt" },
    { value: "PENDING", label: "Chờ duyệt" },
    { value: "REJECTED", label: "Đã từ chối" },
  ];

  const [value, setValue] = useState("1");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedUpdate, setSelectedUpdate] = useState<{
    oldData: any;
    newData: any;
  } | null>(null);

  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Partner>("id");
  const [selected, setSelected] = useState<string | null>(null);

  // Filter states for main list
  const [searchTerm, setSearchTerm] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("APPROVED");

  // Filter states for Create tab
  const [createSearchTerm, setCreateSearchTerm] = useState("");
  const [createDateSort, setCreateDateSort] = useState("oldest");

  // Filter states for Update tab
  const [updateSearchTerm, setUpdateSearchTerm] = useState("");
  const [updateDateSort, setUpdateDateSort] = useState("oldest");

  const partnerPendingCreate = useSelector(selectPartnerPendingCreate);
  const partnerPendingUpdate = useSelector(selectPartnerPendingUpdate);
  const partners = useSelector(selectPartners);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.admin.getAllPartners();
        dispatch(setPartner(res.data.data));
        console.log("All partners:", res.data.data);
        const response = await API.admin.getPartnerPendingCreate();
        dispatch(setPartnerPendingCreate(response.data.data));
        console.log("Partner pending create requests:", response.data.data);
        const updateResponse = await API.admin.getPartnerPendingUpdate();
        dispatch(setPartnerPendingUpdate(updateResponse.data.data));
        console.log(
          "Partner pending update requests:",
          updateResponse.data.data,
        );
      } catch (error) {
        console.error("Error initializing AdminPartnerPage:", error);
      }
    };
    fetchData();
  }, [dispatch]);

  const handleRequestSort = (
    _event: React.MouseEvent<unknown>,
    property: keyof Partner,
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = partners.map((n: { id: any }) => n.id);
      setSelected(newSelected.length > 0 ? newSelected[0] : null);
      return;
    }
    setSelected(null);
  };

  const handleClick = (_event: React.MouseEvent<unknown>, row: Partner) => {
    const selectedIndex = selected === row.id ? -1 : row.id;
    if (selectedIndex === -1) {
      setSelected(null);
      return;
    }
    setSelected(selectedIndex);
    console.log(row);
  };

  // Filtered partners for main list with comprehensive search
  const filteredPartners = useMemo(() => {
    let filtered = partners;

    // Filter by search term (comprehensive search across multiple fields)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item: Partner) =>
          item.organizationName?.toLowerCase().includes(searchLower) ||
          item.address?.toLowerCase().includes(searchLower) ||
          item.representativeName?.toLowerCase().includes(searchLower) ||
          item.businessRegistrationNumber?.toLowerCase().includes(searchLower) ||
          item.phoneNumber?.includes(searchTerm) ||
          item.description?.toLowerCase().includes(searchLower) ||
          item.website?.toLowerCase().includes(searchLower) ||
          item.position?.toLowerCase().includes(searchLower) ||
          item.industry?.toLowerCase().includes(searchLower),
      );
    }

    // Filter by industry
    if (industryFilter) {
      filtered = filtered.filter(
        (item: Partner) => item.industry === industryFilter,
      );
    }

    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter(
        (item: Partner) => item.status === statusFilter,
      );
    }

    return filtered;
  }, [partners, searchTerm, industryFilter, statusFilter]);

  // Filtered and sorted create list with enhanced search
  const filteredCreateList = useMemo(() => {
    let filtered = partnerPendingCreate;

    // Filter by search term (search across multiple fields)
    if (createSearchTerm) {
      const searchLower = createSearchTerm.toLowerCase();
      filtered = filtered.filter((item: any) =>
        item.organizationName?.toLowerCase().includes(searchLower) ||
        item.representativeName?.toLowerCase().includes(searchLower) ||
        item.businessRegistrationNumber?.toLowerCase().includes(searchLower) ||
        item.address?.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower) ||
        item.phoneNumber?.includes(createSearchTerm) ||
        item.website?.toLowerCase().includes(searchLower) ||
        item.industry?.toLowerCase().includes(searchLower),
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
  }, [partnerPendingCreate, createSearchTerm, createDateSort]);

  // Filtered and sorted update list with enhanced search
  const filteredUpdateList = useMemo(() => {
    let filtered = partnerPendingUpdate;

    // Filter by search term (search across multiple fields)
    if (updateSearchTerm) {
      const searchLower = updateSearchTerm.toLowerCase();
      filtered = filtered.filter((item: any) => {
        const partner = item.partnerOrganization;
        const partnerUpdate = item.partnerOrganizationUpdate;
        
        return (
          partner?.organizationName?.toLowerCase().includes(searchLower) ||
          partner?.representativeName?.toLowerCase().includes(searchLower) ||
          partner?.businessRegistrationNumber?.toLowerCase().includes(searchLower) ||
          partner?.address?.toLowerCase().includes(searchLower) ||
          partner?.description?.toLowerCase().includes(searchLower) ||
          partner?.phoneNumber?.includes(updateSearchTerm) ||
          partner?.website?.toLowerCase().includes(searchLower) ||
          partnerUpdate?.organizationName?.toLowerCase().includes(searchLower) ||
          partnerUpdate?.representativeName?.toLowerCase().includes(searchLower) ||
          partnerUpdate?.address?.toLowerCase().includes(searchLower)
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
  }, [partnerPendingUpdate, updateSearchTerm, updateDateSort]);

  // Enhanced search handlers
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleIndustryFilter = (value: string) => {
    setIndustryFilter(value);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
  };

  // Clear all filters function
  const clearAllFilters = () => {
    setSearchTerm("");
    setIndustryFilter("");
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


  const visibleRows = useMemo(
    () => [...filteredPartners].sort(getComparator(order, orderBy)).slice(),
    [filteredPartners, order, orderBy],
  );

  const emptyRows = 10 - visibleRows.length > 0 ? 10 - visibleRows.length : 0;

  const handleChange = (_event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
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
              aria-label="partner management tabs"
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
                    <Domain />
                    <span>Đối tác</span>
                    <Chip
                      size="small"
                      label={filteredPartners.length}
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
              const partner = partners.find(
                (p: Partner) => p.id === selected,
              );
              setSelectedPartner({ partner });
              setOpenEditDialog(true);
            }}
            onSearch={handleSearch}
            searchTerm={searchTerm}
            onIndustryFilter={handleIndustryFilter}
            industryFilter={industryFilter}
            onStatusFilter={handleStatusFilter}
            statusFilter={statusFilter}
          />

          {/* Active Filters Display */}
          {(searchTerm || statusFilter !== "APPROVED") && (
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
                {statusFilter !== "APPROVED" && (
                  <Chip
                    label={`Trạng thái: ${statusOptions.find(s => s.value === statusFilter)?.label}`}
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
              {filteredPartners.length === 0 ? (
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
                    rowCount={filteredPartners.length}
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
                                <Domain />
                              </Avatar>
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  fontWeight: 700,
                                  color: "#2c3e50",
                                  maxWidth: 200,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {row.organizationName}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ py: 2 }}>
                            <Chip
                              label={row.industry}
                              size="small"
                              sx={{
                                bgcolor: "#e3f2fd",
                                color: "#1976d2",
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
                                window.open(`/partner-info/${row.id}`, "_blank");
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
                  Yêu cầu đăng ký đối tác mới
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
                  placeholder="🔍 Tìm kiếm theo tên, địa chỉ, đại diện, ĐKKD..."
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
                        <Domain />
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 700, mb: 0.5, color: "#2c3e50" }}
                        >
                          {item.organizationName}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Chip
                            label={item.industry}
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
                        <strong>Đại diện:</strong> {item.representativeName} ({item.position})
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
                          if (!item.updatedAt && !item.createdAt) return "Chưa cập nhật";

                          const now = new Date();
                          const updatedTime = new Date(item.updatedAt || item.createdAt);
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
                        setSelectedPartner(item);
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
                  : "Hiện tại không có yêu cầu đăng ký đối tác mới nào cần xử lý."}
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
          {/* Enhanced Header for Update Tab */}
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
                  Yêu cầu cập nhật thông tin đối tác
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
                  placeholder="🔍 Tìm kiếm theo tên, địa chỉ, đại diện, ĐKKD..."
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
                const partner = item.partnerOrganization;
                const partnerUpdate = item.partnerOrganizationUpdate;
                if (partner && partnerUpdate) {
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
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                          <Avatar
                            src={partner.logoUrl}
                            sx={{
                              bgcolor: "warning.main",
                              background: "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)",
                              mr: 2,
                              width: 48,
                              height: 48,
                            }}
                          >
                            <Domain />
                          </Avatar>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: 700, mb: 0.5, color: "#2c3e50" }}
                            >
                              {partner.organizationName}
                            </Typography>
                            <Box sx={{ display: "flex", gap: 1 }}>
                              <Chip
                                label={partner.industry}
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
                            <strong>Đại diện:</strong> {partner.representativeName} ({partner.position})
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                          >
                            <strong>ĐKKD:</strong> {partner.businessRegistrationNumber}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                          >
                            <strong>Năm thành lập:</strong> {partner.establishedYear}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                          >
                            <strong>Địa chỉ:</strong> {partner.address}
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
                              oldData: partner,
                              newData: partnerUpdate,
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
                {updateSearchTerm || updateDateSort !== "oldest"
                  ? "Không tìm thấy kết quả"
                  : "Không có yêu cầu nào"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {updateSearchTerm || updateDateSort !== "oldest"
                  ? "Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm"
                  : "Hiện tại không có yêu cầu cập nhật đối tác nào cần xử lý."}
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
      <PartnerDetailDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        partner={selectedPartner || {}}
      />
      <PartnerDetailUpdateDialog
        open={openUpdateDialog}
        onClose={() => setOpenUpdateDialog(false)}
        oldData={selectedUpdate?.oldData}
        newData={selectedUpdate?.newData}
      />
      <PartnerEditDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        partner={selectedPartner?.partner}
      />
    </Box>
  );
};

export default AdminPartnerPage;
