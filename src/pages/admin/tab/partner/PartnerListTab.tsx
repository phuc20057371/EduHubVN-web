import { Add, Domain, MoreVert } from "@mui/icons-material";
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
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  ListItemIcon,
  ListItemText,
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
  Tooltip,
  Typography,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { removePartner } from "../../../../redux/slice/PartnerSlice";
import type { Partner } from "../../../../types/Parner";
import { API } from "../../../../utils/Fetch";

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

function getComparator<T>(
  order: Order,
  orderBy: keyof T,
): (a: T, b: T) => number {
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
  headCells: readonly HeadCell[];
}

import { useTheme } from "@mui/material/styles";
import { setPartnerPendingUpdate } from "../../../../redux/slice/PartnerPendingUpdateSlice";
import { getStatus, getStatusColor } from "../../../../utils/ChangeText";
import { setTrainingProgramsRequest2 } from "../../../../redux/slice/TrainingProgramRequestSlice2";

function EnhancedTableHead(props: EnhancedTableProps) {
  const theme = useTheme();
  const { order, orderBy, onRequestSort, headCells: propHeadCells } = props;
  const createSortHandler =
    (property: keyof Partner) => (event: React.MouseEvent<unknown>) => {
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
      <TableRow
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 2,
          // background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        {propHeadCells.map((headCell) => (
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
  // numSelected: number;
  // onEdit?: () => void;
  onSearch: (value: string) => void;
  searchTerm: string;
  onIndustryFilter: (value: string) => void;
  industryFilter: string;
  onStatusFilter: (value: string) => void;
  statusFilter: string;
  canCreate?: boolean;
  onCreateClick?: () => void;
}

function EnhancedTableToolbar({
  // numSelected,
  // onEdit,
  onSearch,
  searchTerm,
  industryFilter,
  onStatusFilter,
  statusFilter,
  canCreate = false,
  onCreateClick,
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
        // background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
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
              bgcolor: "primary.main",
              // s
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
              Quản lý Đơn vị đối tác
            </Typography>
            <Typography variant="body2" sx={{ color: "#6c757d" }}>
              {searchTerm || industryFilter || statusFilter !== "APPROVED"
                ? "Đã lọc"
                : "Tất cả"}{" "}
              đối tác
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
            placeholder="🔍 Tìm kiếm theo ID, tên, địa chỉ, đại diện..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            sx={{
              bgcolor: "white",
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
                // background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                "&:hover": {
                  // background:
                  //   "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
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

interface PartnerListTabProps {
  partners: Partner[];
  onEdit: (partner: Partner) => void;
  canEdit?: boolean;
  canDelete?: boolean;
  canCreate?: boolean;
  onCreateClick?: () => void;
}

const PartnerListTab: React.FC<PartnerListTabProps> = ({
  partners,
  onEdit,
  canEdit = true,
  canDelete = true,
  canCreate = false,
  onCreateClick,
}) => {
  const dispatch = useDispatch();
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Partner>("id");
  const [selected, setSelected] = useState<string | null>(null);

  // Check if actions column should be shown
  const showActionsColumn = canEdit || canDelete;

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("APPROVED");

  // Delete confirmation states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [partnerToDelete, setPartnerToDelete] = useState<Partner | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Menu states
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuRow, setMenuRow] = useState<Partner | null>(null);

  const statusOptions = [
    { value: "", label: "Tất cả" },
    { value: "APPROVED", label: "Đã duyệt" },
    { value: "PENDING", label: "Chờ duyệt" },
    { value: "REJECTED", label: "Đã từ chối" },
  ];

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
  };

  // Filtered partners with comprehensive search
  const filteredPartners = useMemo(() => {
    let filtered = partners;

    // Filter by search term (comprehensive search across multiple fields, including id)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item: Partner) =>
          item.id?.toString().toLowerCase().includes(searchLower) || // <-- thêm tìm theo id
          item.organizationName?.toLowerCase().includes(searchLower) ||
          item.address?.toLowerCase().includes(searchLower) ||
          item.representativeName?.toLowerCase().includes(searchLower) ||
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

  // Menu handlers
  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    partner: Partner,
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setMenuRow(partner);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuRow(null);
  };

  const handleEditClick = () => {
    if (menuRow) {
      onEdit(menuRow);
    }
    handleMenuClose();
  };

  const handleDeleteMenuClick = () => {
    if (menuRow) {
      setPartnerToDelete(menuRow);
      setDeleteDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    if (!partnerToDelete) return;

    setIsDeleting(true);
    try {
      const res = await API.admin.deletePartner({ id: partnerToDelete.id });
      dispatch(removePartner(partnerToDelete.id));
      setDeleteDialogOpen(false);
      setPartnerToDelete(null);
      if (res.data.success) {
        const res1 = await API.admin.getPartnerPendingUpdate();
        dispatch(setPartnerPendingUpdate(res1.data.data));   
        const res2 = await API.program.getAllProgramRequests();
        dispatch(setTrainingProgramsRequest2(res2.data.data));
      }
    } catch (error) {
      console.error("Error deleting partner:", error);
      // You might want to show an error message here
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setPartnerToDelete(null);
  };

  const visibleRows = useMemo(
    () =>
      [...filteredPartners]
        .sort(getComparator<Partner>(order, orderBy))
        .slice(),
    [filteredPartners, order, orderBy],
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

  return (
    <Box sx={{ p: 0 }}>
      <EnhancedTableToolbar
        // numSelected={selected ? 1 : 0}
        // onEdit={() => {
        //   const partner = partners.find((p: Partner) => p.id === selected);
        //   if (partner) {
        //     onEdit(partner);
        //   }
        // }}
        onSearch={handleSearch}
        searchTerm={searchTerm}
        onIndustryFilter={handleIndustryFilter}
        industryFilter={industryFilter}
        onStatusFilter={handleStatusFilter}
        statusFilter={statusFilter}
        canCreate={canCreate}
        onCreateClick={onCreateClick}
      />

      {/* Active Filters Display */}
      {(searchTerm || statusFilter !== "APPROVED") && (
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 1,
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
                rowCount={filteredPartners.length}
                headCells={displayHeadCells}
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
                          <Tooltip title={row.website} arrow>
                            <a
                              href={
                                row.website.startsWith("http")
                                  ? row.website
                                  : `https://${row.website}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: "#1976d2",
                                textDecoration: "none",
                                fontWeight: 500,
                              }}
                            >
                              Link
                            </a>
                          </Tooltip>
                        )}
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
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuClick(e, row)}
                            sx={{
                              color: "text.secondary",
                              "&:hover": {
                                bgcolor: "rgba(0, 0, 0, 0.04)",
                              },
                            }}
                          >
                            <MoreVert />
                          </IconButton>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: 53 * emptyRows,
                    }}
                  >
                    <TableCell colSpan={showActionsColumn ? 7 : 6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Paper>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {canEdit && (
          <MenuItem onClick={handleEditClick}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Chỉnh sửa</ListItemText>
          </MenuItem>
        )}
        {canDelete && (
          <MenuItem
            onClick={handleDeleteMenuClick}
            sx={{ color: "error.main" }}
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Xóa</ListItemText>
          </MenuItem>
        )}
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" component="div">
            Xác nhận xóa đối tác
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Cảnh báo:</strong> Hành động này không thể hoàn tác!
            </Typography>
          </Alert>
          {partnerToDelete && (
            <Typography variant="body1">
              Bạn có chắc chắn muốn xóa đối tác{" "}
              <strong>{partnerToDelete.organizationName}</strong> không?
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDeleteCancel}
            color="inherit"
            disabled={isDeleting}
          >
            Hủy
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={isDeleting}
          >
            {isDeleting ? "Đang xóa..." : "Xóa"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PartnerListTab;
