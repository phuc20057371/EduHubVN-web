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
  { id: "id", numeric: true, disablePadding: false, label: "ID" },
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
        Danh sách Đối tác (
        {searchTerm || industryFilter || statusFilter ? "Đã lọc" : "Tất cả"}
        )
      </Typography>

      {/* Filter Controls */}
      <Box
        sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}
      >
        

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
  const [selected, setSelected] = useState<number | null>(null);

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
        typography: "body1",
        bgcolor: "background.default",
        minHeight: "100vh",
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
              aria-label="partner management tabs"
              sx={{ px: 2 }}
            >
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Domain />
                    <span>Đối tác</span>
                    <Chip
                      size="small"
                      label={filteredPartners.length}
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

            {/* Add filter summary and clear button */}
            {(searchTerm || statusFilter !== "APPROVED") && (
              <Box sx={{ px: 2, pb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
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
                 
                  {statusFilter !== "APPROVED" && (
                    <Chip
                      label={`Trạng thái: ${statusOptions.find(s => s.value === statusFilter)?.label}`}
                      size="small"
                      onDelete={() => setStatusFilter("APPROVED")}
                      variant="outlined"
                    />
                  )}
                  <Button
                    size="small"
                    onClick={clearAllFilters}
                    sx={{ ml: 1 }}
                  >
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
              {filteredPartners.length === 0 ? (
                <Box sx={{ p: 4, textAlign: "center" }}>
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
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
                    rowCount={filteredPartners.length}
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
                          <TableCell>{row.businessRegistrationNumber}</TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: "bold", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis" }}>
                              {row.organizationName}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {row.industry}
                          </TableCell>
                          <TableCell>{row.phoneNumber}</TableCell>
                          <TableCell>
                            {row.website && (
                              <a
                                href={row.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: "#1976d2", textDecoration: "none" }}
                              >
                                {row.website.length > 30
                                  ? `${row.website.substring(0, 30)}...`
                                  : row.website}
                              </a>
                            )}
                          </TableCell>
                          <TableCell sx={{ maxWidth: 200 }}>
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
                                window.open(`/partner-info/${row.id}`, "_blank");
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
              Yêu cầu đăng ký đối tác mới
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Danh sách các yêu cầu đăng ký đối tác chờ phê duyệt
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
              <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
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
                        <Domain />
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: "bold", mb: 0.5 }}
                        >
                          {item.organizationName}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Chip
                            label={item.industry}
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
                      color="success"
                      fullWidth
                      sx={{ mt: "auto" }}
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
            <Paper sx={{ p: 4, textAlign: "center" }}>
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
              Yêu cầu cập nhật thông tin đối tác
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Danh sách các yêu cầu cập nhật thông tin đối tác chờ phê duyệt
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
              <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
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
                            src={partner.logoUrl || ""}
                            sx={{ bgcolor: "warning.main", mr: 2 }}
                          >
                            <Domain />
                          </Avatar>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: "bold", mb: 0.5 }}
                            >
                              {partner.organizationName}
                            </Typography>
                            <Box sx={{ display: "flex", gap: 1 }}>
                              <Chip
                                label={partner.industry}
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
                          color="warning"
                          fullWidth
                          sx={{ mt: "auto" }}
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
            <Paper sx={{ p: 4, textAlign: "center" }}>
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
