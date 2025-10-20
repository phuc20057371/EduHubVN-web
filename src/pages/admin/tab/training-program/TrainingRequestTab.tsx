import {
  Box,
  Paper,
  Typography,
  useTheme,
  Button,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { Add } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useMemo, useCallback } from "react";
import { API } from "../../../../utils/Fetch";
import { setTrainingProgramsRequest2 } from "../../../../redux/slice/TrainingProgramRequestSlice2";
import type { TrainingProgramRequest } from "../../../../types/TrainingProgram";
import { formatDateToVietnamTime } from "../../../../utils/ChangeText";
import TrainingProgramCreateDialog from "../../../../components/training-program-dialog/TrainingProgramCreateDialog";
import AssignmentLecturerDialog from "../../../../components/assignment-lecturer-dialog/AssignmentLecturerDialog";
import { toast } from "react-toastify";
import { setTrainingPrograms } from "../../../../redux/slice/TrainingProgramSlice";

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

function getComparator<Key extends keyof TrainingProgramRequest>(
  order: Order,
  orderBy: Key,
): (a: TrainingProgramRequest, b: TrainingProgramRequest) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof TrainingProgramRequest;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "title",
    numeric: false,
    disablePadding: false,
    label: "Tiêu đề yêu cầu",
  },
  {
    id: "partnerOrganization",
    numeric: false,
    disablePadding: false,
    label: "Tổ chức",
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "Trạng thái",
  },
  {
    id: "description",
    numeric: false,
    disablePadding: false,
    label: "Mô tả",
  },
  {
    id: "fileUrl",
    numeric: false,
    disablePadding: false,
    label: "File đính kèm",
  },
  {
    id: "updatedAt",
    numeric: false,
    disablePadding: false,
    label: "Thời gian",
  },
  {
    id: "id",
    numeric: false,
    disablePadding: false,
    label: "Thao tác",
  },
];

interface EnhancedTableProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof TrainingProgramRequest,
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
    (property: keyof TrainingProgramRequest) =>
    (event: React.MouseEvent<unknown>) => {
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
                fontSize: "0.875rem",
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

const TrainingRequestTab = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  // State cho table
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof TrainingProgramRequest>("title");
  const [selected, setSelected] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMenuRequest, setSelectedMenuRequest] =
    useState<TrainingProgramRequest | null>(null);

  // State cho dialog
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedRequestForCreate, setSelectedRequestForCreate] =
    useState<TrainingProgramRequest | null>(null);
  const [loading, setLoading] = useState(false);

  // State cho AssignmentLecturerDialog
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
  const [selectedProgramForAssignment, setSelectedProgramForAssignment] =
    useState<any>(null);

  // Lấy dữ liệu từ Redux
  const trainingRequests = useSelector(
    (state: any) => state.trainingProgramRequest2 || [],
  );

  useEffect(() => {
    const fetchTrainingRequests = async () => {
      try {
        setLoading(true);
        const response = await API.program.getAllProgramRequests();
        if (response.data.success && response.data.data) {
          dispatch(setTrainingProgramsRequest2(response.data.data));
        }
      } catch (error) {
        console.error("Error fetching training requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainingRequests();
  }, [dispatch]);

  // Filtered data logic
  const filteredRequests = useMemo(() => {
    let filtered = Array.isArray(trainingRequests) ? trainingRequests : [];

    if (searchTerm) {
      filtered = filtered.filter(
        (request: TrainingProgramRequest) =>
          request.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          request.partnerOrganization?.organizationName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(
        (request: TrainingProgramRequest) => request.status === statusFilter,
      );
    }

    return filtered;
  }, [trainingRequests, searchTerm, statusFilter]);

  const handleRequestSort = (
    _event: React.MouseEvent<unknown>,
    property: keyof TrainingProgramRequest,
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      return;
    }
    setSelected(null);
  };

  const handleClick = (
    _event: React.MouseEvent<unknown>,
    row: TrainingProgramRequest,
  ) => {
    const selectedIndex = selected === row.id ? "" : row.id;
    if (selectedIndex === "") {
      setSelected(null);
      return;
    }
    setSelected(selectedIndex);
  };

  const visibleRows = useMemo(
    () => [...filteredRequests].sort(getComparator(order, orderBy)),
    [filteredRequests, order, orderBy],
  );

  // Menu handlers
  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    request: TrainingProgramRequest,
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedMenuRequest(request);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedMenuRequest(null);
  };

  const handleCreateProgram = () => {
    if (selectedMenuRequest) {
      setSelectedRequestForCreate(selectedMenuRequest);
      setCreateDialogOpen(true);
    }
    handleMenuClose();
  };
  const handleRejectRequest = () => {
    if (selectedMenuRequest) {
      // TODO: Implement reject request API call
      console.log("Reject request:", selectedMenuRequest);
      // Ví dụ API call:
      // API.program.rejectProgramRequest(selectedMenuRequest.id)
    }
    handleMenuClose();
  };

  const handleCreateDialogClose = () => {
    setCreateDialogOpen(false);
    setSelectedRequestForCreate(null);
  };

  const handleAssignmentDialogClose = () => {
    setAssignmentDialogOpen(false);
    setSelectedProgramForAssignment(null);
  };
  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await API.program.getAllPrograms();
      if (response.data && response.data.success) {
        const programs = response.data.data || [];
        dispatch(
          setTrainingPrograms({
            page: 0,
            content: programs,
            totalElements: programs.length,
            totalPages: 1,
          }),
        );
      }
    } catch (error: any) {
      console.error("Error refreshing training programs:", error);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const handleSaveUnits = async (units: any[]) => {
    try {
      if (!selectedProgramForAssignment) return;

      const res = await API.program.updateProgramUnits(
        selectedProgramForAssignment?.id,
        units,
      );
      if (res.data.success) {
        toast.success("Cập nhật bài học thành công");
      }

      // Refresh all data after updating units
      await refreshData();
    } catch (error) {
      console.error("Error saving units:", error);
      throw error;
    }
  };

  const handleProgramCreated = async (programData: any) => {
    try {
      // Tạo chương trình đào tạo
      // console.log("data", programData);

      const response = await API.program.createProgram(programData);

      if (response.data.success) {
        console.log("Program created successfully:", response.data.data);
        toast.success("Tạo chương trình đào tạo thành công!");
        // Refresh data sau khi tạo chương trình thành công
        const refreshResponse = await API.program.getAllProgramRequests();
        if (refreshResponse.data.success) {
          dispatch(setTrainingProgramsRequest2(refreshResponse.data.data));
          const newProgram = response.data.data;
          setSelectedProgramForAssignment(newProgram);
          setAssignmentDialogOpen(true);
        }

        handleCreateDialogClose();
      } else {
        console.error("Failed to create program:", response.data);
      }
    } catch (error) {
      console.error("Error creating program:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "warning";
      case "APPROVED":
        return "success";
      case "REJECTED":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Chờ duyệt";
      case "APPROVED":
        return "Đã duyệt";
      case "REJECTED":
        return "Từ chối";
      default:
        return status;
    }
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
                    ? "linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)"
                    : "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                width: 56,
                height: 56,
              }}
            >
              <AssignmentIcon sx={{ fontSize: 28, color: "white" }} />
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
                Quản lý Yêu cầu Đào tạo
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
                Tổng cộng {trainingRequests.length} yêu cầu đào tạo
              </Typography>
            </Box>
          </Box>

          {/* Create Button */}
          {/* <Box sx={{ flexShrink: 0 }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                console.log("Create training request");
              }}
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
              Tạo yêu cầu đào tạo mới
            </Button>
          </Box> */}
        </Box>

        {/* Search and Filters */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 3,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <TextField
            placeholder="Tìm kiếm yêu cầu đào tạo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setSearchTerm("")}
                    edge="end"
                    size="small"
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 300, flexGrow: 1 }}
          />

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={statusFilter}
              label="Trạng thái"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="PENDING">Chờ duyệt</MenuItem>
              <MenuItem value="APPROVED">Đã duyệt</MenuItem>
              <MenuItem value="REJECTED">Từ chối</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Table */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 1,
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)"
              : "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
          border:
            theme.palette.mode === "dark"
              ? "1px solid rgba(255,255,255,0.1)"
              : "1px solid rgba(0,0,0,0.08)",
        }}
      >
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={filteredRequests.length}
            />
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={headCells.length}
                    sx={{
                      textAlign: "center",
                      py: 8,
                    }}
                  >
                    <Box sx={{ textAlign: "center" }}>
                      <Typography variant="h6" color="text.secondary">
                        Đang tải dữ liệu...
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : visibleRows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={headCells.length}
                    sx={{
                      textAlign: "center",
                      py: 8,
                    }}
                  >
                    <Box sx={{ textAlign: "center" }}>
                      <Typography variant="h6" color="text.secondary">
                        Không có yêu cầu đào tạo nào
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {searchTerm || statusFilter
                          ? "Không tìm thấy yêu cầu phù hợp với bộ lọc"
                          : "Chưa có yêu cầu đào tạo nào được tạo"}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                visibleRows.map((request) => {
                  const isItemSelected = selected === request.id;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, request)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={request.id}
                      selected={isItemSelected}
                      sx={{
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? "rgba(255,255,255,0.05)"
                              : "rgba(0,0,0,0.04)",
                        },
                      }}
                    >
                      {/* Tiêu đề */}
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {request.title}
                        </Typography>
                      </TableCell>

                      {/* Tổ chức */}
                      <TableCell>
                        <Typography variant="body2">
                          {request.partnerOrganization?.organizationName ||
                            "N/A"}
                        </Typography>
                      </TableCell>

                      {/* Trạng thái */}
                      <TableCell>
                        <Chip
                          label={getStatusText(request.status)}
                          color={getStatusColor(request.status) as any}
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>

                      {/* Mô tả */}
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: 200,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {request.description || "Không có mô tả"}
                        </Typography>
                      </TableCell>

                      {/* File đính kèm */}
                      <TableCell>
                        {request.fileUrl ? (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(request.fileUrl, "_blank");
                            }}
                          >
                            Xem file
                          </Button>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Không có
                          </Typography>
                        )}
                      </TableCell>

                      {/* Thời gian */}
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {request.updatedAt
                            ? formatDateToVietnamTime(request.updatedAt)
                            : "N/A"}
                        </Typography>
                      </TableCell>

                      {/* Thao tác */}
                      <TableCell>
                        <IconButton
                          onClick={(event) => handleMenuClick(event, request)}
                          size="small"
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Context Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          {selectedMenuRequest?.status !== "APPROVED" && (
            <MenuItem onClick={handleCreateProgram}>
              <Add sx={{ mr: 1 }} />
              Tạo CT
            </MenuItem>
          )}
          <MenuItem onClick={handleRejectRequest} sx={{ color: "error.main" }}>
            <DeleteIcon sx={{ mr: 1 }} />
            Từ chối
          </MenuItem>
        </Menu>
      </Paper>

      {/* Training Program Create Dialog */}
      {selectedRequestForCreate && (
        <TrainingProgramCreateDialog
          open={createDialogOpen}
          onClose={handleCreateDialogClose}
          onSave={handleProgramCreated}
          partner={selectedRequestForCreate.partnerOrganization}
          requestedProgram={selectedRequestForCreate}
        />
      )}

      {/* Assignment Lecturer Dialog */}
      {selectedProgramForAssignment && (
        <AssignmentLecturerDialog
          open={assignmentDialogOpen}
          onClose={handleAssignmentDialogClose}
          trainingProgram={selectedProgramForAssignment}
          onSave={handleSaveUnits}
        />
      )}
    </>
  );
};

export default TrainingRequestTab;
