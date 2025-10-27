import React, { useCallback, useMemo, useState } from "react";
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
import SchoolIcon from "@mui/icons-material/School";
import { Add } from "@mui/icons-material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTrainingPrograms } from "../../../../redux/slice/TrainingProgramSlice";
import { API } from "../../../../utils/Fetch";
import type {
  TrainingProgram,
  TrainingProgramReq,
} from "../../../../types/TrainingProgram";
import TrainingProgramDialog from "../../../../components/training-program-dialog/TrainingProgramDialog";
import TrainingProgramCreateDialog from "../../../../components/training-program-dialog/TrainingProgramCreateDialog";
import TrainingProgramUpdateDialog from "../../../../components/training-program-dialog/TrainingProgramUpdateDialog";
import AssignmentLecturerDialog from "../../../../components/assignment-lecturer-dialog/AssignmentLecturerDialog";
import ConfirmArchiveTrainingProgramDialog from "../../../../components/general-dialog/ConfirmArchiveTrainingProgramDialog";
import { toast } from "react-toastify";

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

function getComparator<Key extends keyof TrainingProgram>(
  order: Order,
  orderBy: Key,
): (a: TrainingProgram, b: TrainingProgram) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof TrainingProgram;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "trainingProgramId",
    numeric: false,
    disablePadding: false,
    label: "Mã CT",
  },
  {
    id: "title",
    numeric: false,
    disablePadding: false,
    label: "Tên chương trình",
  },
  {
    id: "programStatus",
    numeric: false,
    disablePadding: false,
    label: "Trạng thái",
  },
  {
    id: "partnerOrganization",
    numeric: false,
    disablePadding: false,
    label: "Sở hữu",
  },
  {
    id: "startDate",
    numeric: false,
    disablePadding: false,
    label: "Thời gian",
  },
  {
    id: "listedPrice",
    numeric: true,
    disablePadding: false,
    label: "Giá niêm yết",
  },
  {
    id: "syllabusFileUrl",
    numeric: false,
    disablePadding: false,
    label: " Đề cương / TL đính kèm",
  },
  { id: "rating", numeric: true, disablePadding: false, label: "Đánh giá" },
  { id: "units", numeric: false, disablePadding: false, label: "Bài học" },
  { id: "createdAt", numeric: false, disablePadding: false, label: "Thao tác" },
];

interface EnhancedTableProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof TrainingProgram,
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
    (property: keyof TrainingProgram) => (event: React.MouseEvent<unknown>) => {
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

const TrainingProgramTab = () => {
  const dispatch = useDispatch();
  const userProfile = useSelector((state: any) => state.userProfile);
  const trainingProgramState = useSelector(
    (state: any) => state.trainingProgram,
  );
  const theme = useTheme();

  // Get all training programs from all loaded pages
  const trainingPrograms = React.useMemo(() => {
    const allPrograms: TrainingProgram[] = [];
    for (let i = 0; i <= trainingProgramState.currentPage; i++) {
      if (trainingProgramState.programsByPage[i]) {
        allPrograms.push(...trainingProgramState.programsByPage[i]);
      }
    }
    return allPrograms;
  }, [trainingProgramState.programsByPage, trainingProgramState.currentPage]);

  // Local state for filters and table
  const [searchTerm, setSearchTerm] = useState("");
  const [programModeFilter, setProgramModeFilter] = useState("");
  const [programStatusFilter, setProgramStatusFilter] = useState("PUBLISHED");
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof TrainingProgram>("title");
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Menu dropdown state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMenuProgram, setSelectedMenuProgram] =
    useState<TrainingProgram | null>(null);
  const openMenu = Boolean(anchorEl);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogProgram, setDialogProgram] = useState<TrainingProgram | null>(
    null,
  );

  // Create dialog state
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Update dialog state
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [selectedProgramForUpdate, setSelectedProgramForUpdate] =
    useState<TrainingProgram | null>(null);

  // Assignment lecturer dialog state
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
  const [selectedProgramForAssignment, setSelectedProgramForAssignment] =
    useState<TrainingProgram | null>(null);

  // Archive dialog state
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [selectedProgramForArchive, setSelectedProgramForArchive] =
    useState<TrainingProgram | null>(null);
  const [archiveLoading, setArchiveLoading] = useState(false);

  // Initial data fetch - Get all programs at once
  useEffect(() => {
    const fetchData = async () => {
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
        console.error("Error fetching training programs:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userProfile?.role) {
      fetchData();
    }
  }, [dispatch, userProfile]);

  // Refresh data function
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

  // Filtered data logic
  const filteredPrograms = useMemo(() => {
    let filtered = trainingPrograms;

    if (searchTerm) {
      filtered = filtered.filter(
        (program: TrainingProgram) =>
          program.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          program.shortDescription
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          program.targetAudience
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          program.certificateIssuer
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
    }

    if (programModeFilter) {
      filtered = filtered.filter(
        (program: TrainingProgram) => program.programMode === programModeFilter,
      );
    }

    if (programStatusFilter) {
      filtered = filtered.filter(
        (program: TrainingProgram) =>
          program.programStatus === programStatusFilter,
      );
    }

    return filtered;
  }, [trainingPrograms, searchTerm, programModeFilter, programStatusFilter]);

  const handleRequestSort = (
    _event: React.MouseEvent<unknown>,
    property: keyof TrainingProgram,
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
    row: TrainingProgram,
  ) => {
    const selectedIndex = selected === row.id ? -1 : row.id;
    if (selectedIndex === -1) {
      setSelected(null);
      return;
    }
    setSelected(selectedIndex);
  };

  const visibleRows = React.useMemo(
    () => [...filteredPrograms].sort(getComparator(order, orderBy)),
    [filteredPrograms, order, orderBy],
  );

  // Menu handlers
  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    program: TrainingProgram,
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedMenuProgram(program);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedMenuProgram(null);
  };

  const handleViewProgram = () => {
    if (selectedMenuProgram) {
      setDialogProgram(selectedMenuProgram);
      setDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleEditProgram = () => {
    if (selectedMenuProgram) {
      // Kiểm tra nếu chương trình đã được lưu trữ
      if (selectedMenuProgram.programStatus === "ARCHIVED") {
        toast.warning("Không thể chỉnh sửa chương trình đã lưu trữ!");
        handleMenuClose();
        return;
      }
      
      setSelectedProgramForUpdate(selectedMenuProgram);
      setUpdateDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleDeleteProgram = () => {
    if (selectedMenuProgram) {
      // Kiểm tra nếu chương trình đã được lưu trữ
      if (selectedMenuProgram.programStatus === "ARCHIVED") {
        toast.info("Chương trình này đã được lưu trữ!");
        handleMenuClose();
        return;
      }
      
      setSelectedProgramForArchive(selectedMenuProgram);
      setArchiveDialogOpen(true);
    }
    handleMenuClose();
  };  const handleDialogClose = () => {
    setDialogOpen(false);
    setDialogProgram(null);
  };

  // Create dialog handlers
  const handleCreateProgram = async (programData: TrainingProgramReq) => {
    try {
      const createResponse = await API.program.createProgram(programData);

      // Close create dialog first
      setCreateDialogOpen(false);

      // Refresh all data after creation
      await refreshData();

      // Find the newly created program from the response
      if (createResponse.data && createResponse.data.data) {
        const newProgram = createResponse.data.data;
        toast.success("Tạo chương trình đào tạo thành công!");
        // Open AssignmentLecturerDialog with the newly created program
        setSelectedProgramForAssignment(newProgram);
        setAssignmentDialogOpen(true);
      }
    } catch (error) {
      console.error("Error creating training program:", error);
      throw error;
    }
  };

  const handleCreateDialogClose = () => {
    setCreateDialogOpen(false);
  };

  // Update dialog handlers
  const handleUpdateProgram = async (programData: TrainingProgramReq) => {
    try {
      const response = await API.program.updateProgram(programData);
      if (response.data.success) {
        toast.success("Cập nhật chương trình đào tạo thành công!");
        setUpdateDialogOpen(false);
        setSelectedProgramForUpdate(null);
        await refreshData();
      } else {
        toast.error("Cập nhật chương trình đào tạo không thành công!");
      }
    } catch (error) {
      console.error("Error updating training program:", error);
      throw error;
    }
  };

  const handleUpdateDialogClose = () => {
    setUpdateDialogOpen(false);
    setSelectedProgramForUpdate(null);
  };

  // Assignment lecturer dialog handlers
  const handleUnitManagement = (program: TrainingProgram) => {
    // Kiểm tra nếu chương trình đã được lưu trữ
    if (program.programStatus === "ARCHIVED") {
      toast.warning("Không thể quản lý bài học của chương trình đã lưu trữ!");
      return;
    }
    
    setSelectedProgramForAssignment(program);
    setAssignmentDialogOpen(true);
  };

  const handleAssignmentDialogClose = () => {
    setAssignmentDialogOpen(false);
    setSelectedProgramForAssignment(null);
  };

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

  // Archive dialog handlers
  const handleConfirmArchive = async () => {
    if (!selectedProgramForArchive) return;

    try {
      setArchiveLoading(true);
      const response = await API.program.archiveTrainingProgram(selectedProgramForArchive.id);
      
      if (response.data && response.data.success) {
        toast.success("Lưu trữ chương trình đào tạo thành công!");
        setArchiveDialogOpen(false);
        setSelectedProgramForArchive(null);
        await refreshData();
      } else {
        toast.error("Lưu trữ chương trình đào tạo không thành công!");
      }
    } catch (error: any) {
      console.error("Error archiving training program:", error);
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi lưu trữ chương trình đào tạo"
      );
    } finally {
      setArchiveLoading(false);
    }
  };

  const handleArchiveDialogClose = () => {
    if (!archiveLoading) {
      setArchiveDialogOpen(false);
      setSelectedProgramForArchive(null);
    }
  };

  // Helper functions for display
  const getProgramStatusLabel = (status: string) => {
    switch (status) {
      case "REVIEW":
        return "Đang xét duyệt";
      case "PUBLISHED":
        return "Đã xuất bản";
      case "UNLISTED":
        return "Chưa niêm yết";
      case "ARCHIVED":
        return "Đã lưu trữ";
      default:
        return status;
    }
  };

  const getProgramStatusColor = (status: string) => {
    switch (status) {
      case "REVIEW":
        return "warning";
      case "PUBLISHED":
        return "success";
      case "UNLISTED":
        return "info";
      case "ARCHIVED":
        return "error";
      default:
        return "default";
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
                    ? "linear-gradient(135deg, #00B2FF 0%, #0099e6 100%)"
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                width: 56,
                height: 56,
              }}
            >
              <SchoolIcon sx={{ fontSize: 28, color: "white" }} />
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
                Quản lý Chương trình Đào tạo
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
                {searchTerm ||
                programModeFilter ||
                programStatusFilter !== "PUBLISHED"
                  ? `Đã lọc ${filteredPrograms?.length || 0} chương trình`
                  : `Tổng cộng ${filteredPrograms?.length || 0} chương trình`}
              </Typography>
            </Box>
          </Box>
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
              <InputLabel>Hình thức</InputLabel>
              <Select
                value={programModeFilter}
                label="Hình thức"
                onChange={(e) => setProgramModeFilter(e.target.value)}
                sx={{
                  borderRadius: 1,
                  fontSize: "1.25rem",
                }}
              >
                <MenuItem value="">
                  <em>Tất cả</em>
                </MenuItem>
                <MenuItem value="ONLINE">Trực tuyến</MenuItem>
                <MenuItem value="OFFLINE">Trực tiếp</MenuItem>
                <MenuItem value="HYBRID">Kết hợp</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ minWidth: 150, flex: "0 0 auto" }}>
            <FormControl fullWidth size="small">
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={programStatusFilter}
                label="Trạng thái"
                onChange={(e) => setProgramStatusFilter(e.target.value)}
                sx={{
                  borderRadius: 1,
                  fontSize: "1.25rem",
                }}
              >
                <MenuItem value="">
                  <em>Tất cả</em>
                </MenuItem>
                <MenuItem value="REVIEW">Đang xét duyệt</MenuItem>
                <MenuItem value="PUBLISHED">Đã xuất bản</MenuItem>
                <MenuItem value="UNLISTED">Chưa niêm yết</MenuItem>
                <MenuItem value="ARCHIVED">Đã lưu trữ</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ flex: "1 1 300px", minWidth: 300 }}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="🔍 Tìm kiếm theo tên chương trình, mô tả, đối tượng..."
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
          {(userProfile?.role === "ADMIN" || userProfile?.permissions?.includes("PROGRAM_CREATE")) && (
            <Box sx={{ flexShrink: 0 }}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setCreateDialogOpen(true)}
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
        {(searchTerm ||
          programModeFilter ||
          programStatusFilter !== "PUBLISHED") && (
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

            {programModeFilter && (
              <Chip
                label={`Hình thức: ${
                  programModeFilter === "ONLINE"
                    ? "Trực tuyến"
                    : programModeFilter === "OFFLINE"
                      ? "Trực tiếp"
                      : programModeFilter === "HYBRID"
                        ? "Kết hợp"
                        : programModeFilter
                }`}
                size="small"
                onDelete={() => setProgramModeFilter("")}
                color="secondary"
                variant="outlined"
              />
            )}

            {programStatusFilter !== "PUBLISHED" && programStatusFilter && (
              <Chip
                label={`Trạng thái: ${getProgramStatusLabel(programStatusFilter)}`}
                size="small"
                onDelete={() => setProgramStatusFilter("PUBLISHED")}
                color="success"
                variant="outlined"
              />
            )}

            <Button
              size="small"
              onClick={() => {
                setSearchTerm("");
                setProgramModeFilter("");
                setProgramStatusFilter("PUBLISHED");
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
            sx={{ minWidth: 1200, width: "100%" }}
            aria-labelledby="tableTitle"
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={filteredPrograms.length}
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
                            ? "rgba(255, 255, 255, 0.08) !important"
                            : "rgba(0, 0, 0, 0.04) !important",
                        "&:hover": {
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? "rgba(255, 255, 255, 0.12) !important"
                              : "rgba(0, 0, 0, 0.08) !important",
                        },
                      },
                    }}
                  >
                    {/* Mã chương trình */}
                    <TableCell sx={{ fontSize: "0.875rem" }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: "primary.main" }}
                      >
                        {row.trainingProgramId || row.id.slice(0, 8)}
                      </Typography>
                    </TableCell>

                    {/* Tên chương trình */}
                    <TableCell
                      sx={{
                        fontSize: "0.875rem",
                        minWidth: 300,
                        maxWidth: 400,
                      }}
                    >
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                            mb: 0.5,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {row.title}
                        </Typography>
                        {row.subTitle && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: theme.palette.text.secondary,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {row.subTitle}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>

                    {/* Trạng thái */}
                    <TableCell sx={{ fontSize: "0.875rem" }}>
                      <Chip
                        label={getProgramStatusLabel(row.programStatus)}
                        size="small"
                        color={getProgramStatusColor(row.programStatus) as any}
                        variant="filled"
                        sx={{ fontSize: "0.75rem" }}
                      />
                    </TableCell>

                    {/* Sở hữu */}
                    <TableCell sx={{ fontSize: "0.875rem" }}>
                      <Chip
                        label={row.partnerOrganization ? "Đối tác" : "SGL"}
                        size="small"
                        color={
                          row.partnerOrganization ? "secondary" : "primary"
                        }
                        variant="outlined"
                        sx={{ fontSize: "0.75rem" }}
                      />
                    </TableCell>

                    {/* Thời gian */}
                    <TableCell sx={{ fontSize: "0.875rem", minWidth: 180 }}>
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                            mb: 0.5,
                          }}
                        >
                          {new Date(row.startDate).toLocaleDateString("vi-VN")}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: theme.palette.text.secondary,
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <span>→</span>
                          {new Date(row.endDate).toLocaleDateString("vi-VN")}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Giá niêm yết */}
                    <TableCell align="right" sx={{ fontSize: "0.875rem" }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          gap: 0.5,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: "success.main" }}
                        >
                          {row.listedPrice.toLocaleString("vi-VN")}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary" }}
                        >
                          VND
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Giáo trình */}
                    <TableCell sx={{ fontSize: "0.875rem" }}>
                      {row.syllabusFileUrl ? (
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(row.syllabusFileUrl, "_blank");
                          }}
                          sx={{ color: "primary.main" }}
                        >
                          📄
                        </IconButton>
                      ) : (
                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary" }}
                        >
                          Không có
                        </Typography>
                      )}
                    </TableCell>

                    {/* Đánh giá */}
                    <TableCell align="right" sx={{ fontSize: "0.875rem" }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          gap: 0.5,
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {row.rating?.toFixed(1) || "0"}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary" }}
                        >
                          ⭐
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Bài học */}
                    <TableCell align="center" sx={{ fontSize: "0.875rem" }}>
                      {(userProfile?.role === "ADMIN" || userProfile?.permissions?.includes("PROGRAM_UPDATE")) ? (
                        <Button
                          variant="outlined"
                          size="small"
                          disabled={row.programStatus === "ARCHIVED"}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUnitManagement(row);
                          }}
                          sx={{
                            minWidth: 60,
                            borderRadius: 2,
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            px: 1.5,
                            ...(row.programStatus === "ARCHIVED" && {
                              opacity: 0.5,
                              cursor: "not-allowed",
                              "&:hover": {
                                backgroundColor: "transparent",
                              },
                            }),
                          }}
                        >
                          {row.units?.length || 0}
                        </Button>
                      ) : (
                        <Typography variant="body2" sx={{ fontWeight: 600, color: "text.secondary" }}>
                          {row.units?.length || 0}
                        </Typography>
                      )}
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

              {/* No data row */}
              {visibleRows.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        📝 Không tìm thấy chương trình đào tạo
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm
                      </Typography>
                    </Box>
                  </TableCell>
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
            onClick={handleViewProgram}
            sx={{ fontSize: "0.875rem", py: 1.5 }}
          >
            <VisibilityIcon sx={{ mr: 2, fontSize: "1.1rem" }} />
            Xem chi tiết
          </MenuItem>
          {(userProfile?.role === "ADMIN" || userProfile?.permissions?.includes("PROGRAM_UPDATE")) && (
            <MenuItem
              onClick={handleEditProgram}
              disabled={selectedMenuProgram?.programStatus === "ARCHIVED"}
              sx={{ 
                fontSize: "0.875rem", 
                py: 1.5,
                ...(selectedMenuProgram?.programStatus === "ARCHIVED" && {
                  opacity: 0.5,
                  cursor: "not-allowed",
                }),
              }}
            >
              <EditIcon sx={{ mr: 2, fontSize: "1.1rem" }} />
              Chỉnh sửa
            </MenuItem>
          )}
          {(userProfile?.role === "ADMIN" || userProfile?.permissions?.includes("PROGRAM_ARCHIVE")) && (
            <MenuItem
              onClick={handleDeleteProgram}
              disabled={selectedMenuProgram?.programStatus === "ARCHIVED"}
              sx={{
                fontSize: "0.875rem",
                py: 1.5,
                color: selectedMenuProgram?.programStatus === "ARCHIVED" ? "text.disabled" : "error.main",
                "&:hover": {
                  bgcolor: selectedMenuProgram?.programStatus === "ARCHIVED" ? "transparent" :
                    theme.palette.mode === "dark"
                      ? "rgba(244, 67, 54, 0.1)"
                      : "rgba(244, 67, 54, 0.04)",
                },
                ...(selectedMenuProgram?.programStatus === "ARCHIVED" && {
                  opacity: 0.5,
                  cursor: "not-allowed",
                }),
              }}
            >
              <DeleteIcon sx={{ mr: 2, fontSize: "1.1rem" }} />
              {selectedMenuProgram?.programStatus === "ARCHIVED" ? "Đã lưu trữ" : "Lưu trữ"}
            </MenuItem>
          )}
        </Menu>
      </Paper>

      {/* Global Dialogs */}
      <TrainingProgramDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        program={dialogProgram}
        onProgramUpdated={refreshData}
      />

      <TrainingProgramCreateDialog
        open={createDialogOpen}
        onClose={handleCreateDialogClose}
        onSave={handleCreateProgram}
        partner={null} // TODO: Load partner from API
        requestedProgram={null} // TODO: Load requested program from API
      />

      <TrainingProgramUpdateDialog
        open={updateDialogOpen}
        onClose={handleUpdateDialogClose}
        onSave={handleUpdateProgram}
        program={selectedProgramForUpdate}
      />

      <AssignmentLecturerDialog
        open={assignmentDialogOpen}
        onClose={handleAssignmentDialogClose}
        trainingProgram={selectedProgramForAssignment}
        onSave={handleSaveUnits}
      />

      <ConfirmArchiveTrainingProgramDialog
        open={archiveDialogOpen}
        onClose={handleArchiveDialogClose}
        program={selectedProgramForArchive}
        loading={archiveLoading}
        onConfirm={handleConfirmArchive}
      />
    </>
  );
};

export default TrainingProgramTab;
