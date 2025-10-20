import { useEffect, useState } from "react";
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Paper,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Security as SecurityIcon,
  LockReset as LockResetIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { API } from "../../utils/Fetch";
import { useDispatch, useSelector } from "react-redux";
import { setSubAdmins } from "../../redux/slice/SubAdminSlice";
import PermissionDialog from "../../components/admin-dialog/PermissionDialog";
import CreateSubAdminDialog from "../../components/admin-dialog/CreateSubAdminDialog";
import { useColors } from "../../hooks/useColors"; // Thay thế import colors

interface SubAdmin {
  id: string;
  email: string;
  createdAt: string;
  lastLogin: string | null;
  permissions: string[]; // Array of permission strings
}

const SubAdminPage = () => {
  // Note: We display Sub-Admins as "MOD" in the UI
  const subAdmins = useSelector((state: any) => state.subAdmin);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [permissionDialogOpen, setPermissionDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedSubAdmin, setSelectedSubAdmin] = useState<SubAdmin | null>(
    null,
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [subAdminToDelete, setSubAdminToDelete] = useState<SubAdmin | null>(
    null,
  );
  const [deleting, setDeleting] = useState(false);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [subAdminToReset, setSubAdminToReset] = useState<SubAdmin | null>(null);
  const [resetting, setResetting] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const colors = useColors(); // Sử dụng hook màu mới

  useEffect(() => {
    const fetchSubAdmins = async () => {
      try {
        setLoading(true);

        const response = await API.subadmin.getAllSubAdmins();
        if (response.data && response.data.data) {
          dispatch(setSubAdmins(response.data.data));
        }
        setError(null);
      } catch (error) {
        console.error("Error fetching sub-admins:", error);
        setError("Không thể tải danh sách MOD");
      } finally {
        setLoading(false);
      }
    };

    fetchSubAdmins();
  }, []);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "Chưa đăng nhập";
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const handleResetPassword = (subAdmin: SubAdmin) => {
    setSubAdminToReset(subAdmin);
    setResetPasswordDialogOpen(true);
  };

  const handleConfirmResetPassword = async () => {
    if (!subAdminToReset || !newPassword.trim()) return;

    setResetting(true);
    try {
      await API.subadmin.resetPassword({ 
        subAdminId: subAdminToReset.id,
        newPassword: newPassword.trim()
      });
      
      // Close dialog and reset state
      setResetPasswordDialogOpen(false);
      setSubAdminToReset(null);
      setNewPassword("");
    } catch (error) {
      console.error("Error resetting password:", error);
    } finally {
      setResetting(false);
    }
  };

  const handleCancelResetPassword = () => {
    setResetPasswordDialogOpen(false);
    setSubAdminToReset(null);
    setNewPassword("");
  };

  const handleDelete = (subAdmin: SubAdmin) => {
    setSubAdminToDelete(subAdmin);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!subAdminToDelete) return;

    setDeleting(true);
    try {
      await API.subadmin.deleteSubAdmin({ id: subAdminToDelete.id });
      // Refresh the sub-admin list
      const response = await API.subadmin.getAllSubAdmins();
      dispatch(setSubAdmins(response.data.data || []));
      
      // Close dialog and reset state
      setDeleteDialogOpen(false);
      setSubAdminToDelete(null);
    } catch (error) {
      console.error("Error deleting sub-admin:", error);
      // TODO: Show error message to user
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setSubAdminToDelete(null);
  };

  const handlePermissions = (subAdmin: SubAdmin) => {
    setSelectedSubAdmin(subAdmin);
    setPermissionDialogOpen(true);
  };

  const handlePermissionSave = async (
    subAdminId: string,
    permissions: string[],
  ) => {
    try {
      // TODO: Implement API call to update permissions
      console.log("Update permissions for:", subAdminId, permissions);
      await API.subadmin.assignPermissions({ subAdminId, permissions });

      // Refresh the sub-admin list
      const response = await API.subadmin.getAllSubAdmins();
      dispatch(setSubAdmins(response.data.data || []));
    } catch (error) {
      console.error("Error updating permissions:", error);
    }
  };

  const handleCreateSubAdmin = async (data: { username: string; password: string }) => {
    try {
      await API.subadmin.createSubAdmin({
        email: data.username,
        password: data.password,
      });

      // Refresh the sub-admin list
      const response = await API.subadmin.getAllSubAdmins();
      dispatch(setSubAdmins(response.data.data || []));
    } catch (error) {
      console.error("Error creating MOD:", error);
      throw error; // Re-throw to let dialog handle the error
    }
  };

  const handleAddNew = () => {
    setCreateDialogOpen(true);
  };

  // Lọc danh sách sub-admins theo từ khóa tìm kiếm
  const filteredSubAdmins = subAdmins.filter((subAdmin: SubAdmin) =>
    subAdmin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight="bold" color={colors.primary.main}>
          Quản lý MOD
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddNew}
          sx={{
            bgcolor: colors.primary.main,
            "&:hover": { bgcolor: colors.primary.dark },
          }}
        >
          Thêm MOD
        </Button>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Tìm kiếm MOD theo tên đăng nhập..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: colors.text.secondary }} />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={clearSearch}
                  sx={{ color: colors.text.secondary }}
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: colors.primary.main,
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: colors.primary.main,
              },
            },
          }}
        />
      </Box>

      <Card>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: colors.background.secondary }}>
                <TableCell>
                  <Typography fontWeight="bold">Tên đăng nhập</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="bold">Ngày tạo</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="bold">Lần đăng nhập cuối</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="bold">Quyền hạn</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography fontWeight="bold">Thao tác</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSubAdmins
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((subAdmin: SubAdmin) => (
                  <TableRow
                    key={subAdmin.id}
                    hover
                    sx={{ "&:hover": { bgcolor: colors.background.secondary } }}
                  >
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {subAdmin.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDateTime(subAdmin.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        color={
                          subAdmin.lastLogin
                            ? colors.text.primary
                            : colors.text.secondary
                        }
                      >
                        {formatDateTime(subAdmin.lastLogin)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" flexWrap="wrap" gap={0.5}>
                        {subAdmin.permissions?.length > 0 ? (
                          subAdmin.permissions.map((permission, index) => (
                            <Chip
                              key={index}
                              label={permission}
                              size="small"
                              variant="outlined"
                              sx={{
                                borderColor: colors.primary.light,
                                color: colors.primary.main,
                              }}
                            />
                          ))
                        ) : (
                          <Typography
                            variant="body2"
                            color={colors.text.secondary}
                          >
                            Chưa có quyền
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" justifyContent="center" gap={1}>
                        <Tooltip title="Quản lý quyền hạn">
                          <IconButton
                            size="small"
                            onClick={() => handlePermissions(subAdmin)}
                            sx={{ color: colors.secondary.main }}
                          >
                            <SecurityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reset mật khẩu">
                          <IconButton
                            size="small"
                            onClick={() => handleResetPassword(subAdmin)}
                            sx={{ color: colors.warning[500] }}
                          >
                            <LockResetIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(subAdmin)}
                            sx={{ color: colors.primary.dark }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              {filteredSubAdmins.length === 0 && searchTerm && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography color={colors.text.secondary}>
                      Không tìm thấy MOD nào với từ khóa "{searchTerm}"
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
              {filteredSubAdmins.length === 0 && !searchTerm && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography color={colors.text.secondary}>
                      Không có MOD nào
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredSubAdmins.length > 0 && (
          <TablePagination
            component="div"
            count={filteredSubAdmins.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Số dòng mỗi trang:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} trong ${count !== -1 ? count : `hơn ${to}`}`
            }
          />
        )}
      </Card>

      <PermissionDialog
        open={permissionDialogOpen}
        onClose={() => {
          setPermissionDialogOpen(false);
          setSelectedSubAdmin(null);
        }}
        subAdmin={selectedSubAdmin}
        onSave={handlePermissionSave}
      />

      <CreateSubAdminDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSave={handleCreateSubAdmin}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            bgcolor: colors.error[50], 
            color: colors.error[700],
            fontWeight: "bold"
          }}
        >
          Xác nhận xóa MOD
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <DialogContentText sx={{ color: colors.text.primary }}>
            Bạn có chắc chắn muốn xóa MOD{" "}
            <strong>{subAdminToDelete?.email}</strong> không?
          </DialogContentText>
          <DialogContentText sx={{ mt: 2, color: colors.text.secondary }}>
            Hành động này không thể hoàn tác. Tất cả quyền hạn và dữ liệu liên quan
            sẽ bị xóa vĩnh viễn.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, bgcolor: colors.neutral[50] }}>
          <Button 
            onClick={handleCancelDelete}
            variant="outlined"
            disabled={deleting}
            sx={{ 
              color: colors.neutral[600],
              borderColor: colors.neutral[300],
              '&:hover': {
                borderColor: colors.neutral[400],
                bgcolor: colors.neutral[50],
              }
            }}
          >
            Hủy
          </Button>
          <Button 
            onClick={handleConfirmDelete}
            variant="contained"
            disabled={deleting}
            sx={{
              bgcolor: colors.error[500],
              '&:hover': {
                bgcolor: colors.error[600],
              },
              minWidth: '120px',
            }}
          >
            {deleting ? 'Đang xóa...' : 'Xóa MOD'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reset Password Confirmation Dialog */}
      <Dialog
        open={resetPasswordDialogOpen}
        onClose={handleCancelResetPassword}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            bgcolor: colors.warning[50], 
            color: colors.warning[700],
            fontWeight: "bold"
          }}
        >
          Reset mật khẩu MOD
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <DialogContentText sx={{ color: colors.text.primary, mb: 3 }}>
            Bạn đang reset mật khẩu cho MOD{" "}
            <strong>{subAdminToReset?.email}</strong>
          </DialogContentText>
          
          <TextField
            label="Mật khẩu mới"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            required
            disabled={resetting}
            placeholder="Nhập mật khẩu mới"
            sx={{ mb: 2 }}
          />
          
          <DialogContentText sx={{ color: colors.text.secondary, fontSize: '0.875rem' }}>
            Mật khẩu mới sẽ được cập nhật ngay lập tức. MOD sẽ cần sử dụng 
            mật khẩu mới để đăng nhập.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, bgcolor: colors.neutral[50] }}>
          <Button 
            onClick={handleCancelResetPassword}
            variant="outlined"
            disabled={resetting}
            sx={{ 
              color: colors.neutral[600],
              borderColor: colors.neutral[300],
              '&:hover': {
                borderColor: colors.neutral[400],
                bgcolor: colors.neutral[50],
              }
            }}
          >
            Hủy
          </Button>
          <Button 
            onClick={handleConfirmResetPassword}
            variant="contained"
            disabled={resetting || !newPassword.trim()}
            sx={{
              bgcolor: colors.warning[500],
              '&:hover': {
                bgcolor: colors.warning[600],
              },
              '&:disabled': {
                bgcolor: colors.neutral[300],
              },
              minWidth: '140px',
            }}
          >
            {resetting ? 'Đang reset...' : 'Reset mật khẩu'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SubAdminPage;
