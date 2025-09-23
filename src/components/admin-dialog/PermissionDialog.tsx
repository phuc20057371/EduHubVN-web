import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
  Divider,
  Paper,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import { colors } from '../../theme/colors';

interface SubAdmin {
  id: string;
  email: string;
  createdAt: string;
  lastLogin: string | null;
  permissions: string[]; // Array of permission strings
}

interface PermissionDialogProps {
  open: boolean;
  onClose: () => void;
  subAdmin: SubAdmin | null;
  onSave: (subAdminId: string, permissions: string[]) => void;
}

const PermissionDialog: React.FC<PermissionDialogProps> = ({
  open,
  onClose,
  subAdmin,
  onSave,
}) => {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  // Định nghĩa các quyền theo module
  const permissionGroups = {
    'Giảng viên': [
      { key: 'LECTURER_READ', label: 'Xem danh sách' },
      { key: 'LECTURER_CREATE', label: 'Tạo mới' },
      { key: 'LECTURER_UPDATE', label: 'Cập nhật' },
      { key: 'LECTURER_DELETE', label: 'Xóa' },
      { key: 'LECTURER_APPROVE', label: 'Phê duyệt' },
    ],
    'Trường/Trung tâm đào tạo': [
      { key: 'SCHOOL_READ', label: 'Xem danh sách' },
      { key: 'SCHOOL_CREATE', label: 'Tạo mới' },
      { key: 'SCHOOL_UPDATE', label: 'Cập nhật' },
      { key: 'SCHOOL_DELETE', label: 'Xóa' },
      { key: 'SCHOOL_APPROVE', label: 'Phê duyệt' },
    ],
    'Đơn vị đối tác': [
      { key: 'ORGANIZATION_READ', label: 'Xem danh sách' },
      { key: 'ORGANIZATION_CREATE', label: 'Tạo mới' },
      { key: 'ORGANIZATION_UPDATE', label: 'Cập nhật' },
      { key: 'ORGANIZATION_DELETE', label: 'Xóa' },
      { key: 'ORGANIZATION_APPROVE', label: 'Phê duyệt' },
    ],
    'Khóa học': [
      { key: 'COURSE_READ', label: 'Xem danh sách' },
      { key: 'COURSE_CREATE', label: 'Tạo mới' },
      { key: 'COURSE_UPDATE', label: 'Cập nhật' },
      { key: 'COURSE_DELETE', label: 'Xóa' },
      // { key: 'COURSE_APPROVE', label: 'Phê duyệt' },
    ],
  };

  useEffect(() => {
    if (subAdmin && subAdmin.permissions) {
      // permissions is already an array of strings
      setSelectedPermissions(subAdmin.permissions);
    } else {
      setSelectedPermissions([]);
    }
  }, [subAdmin]);

  const handlePermissionChange = (permissionKey: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions(prev => [...prev, permissionKey]);
    } else {
      setSelectedPermissions(prev => prev.filter(p => p !== permissionKey));
    }
  };

  const handleSelectAll = (permissions: any[]) => {
    const groupPermissions = permissions.map(p => p.key);
    const allSelected = groupPermissions.every(p => selectedPermissions.includes(p));
    
    if (allSelected) {
      // Bỏ chọn tất cả
      setSelectedPermissions(prev => prev.filter(p => !groupPermissions.includes(p)));
    } else {
      // Chọn tất cả
      setSelectedPermissions(prev => {
        const newPermissions = [...prev];
        groupPermissions.forEach(p => {
          if (!newPermissions.includes(p)) {
            newPermissions.push(p);
          }
        });
        return newPermissions;
      });
    }
  };

  const handleSave = () => {
    if (subAdmin) {
      onSave(subAdmin.id, selectedPermissions);
      
    }
    onClose();
  };

  const isGroupAllSelected = (permissions: any[]) => {
    return permissions.every(p => selectedPermissions.includes(p.key));
  };

  const isGroupPartiallySelected = (permissions: any[]) => {
    return permissions.some(p => selectedPermissions.includes(p.key)) && 
           !permissions.every(p => selectedPermissions.includes(p.key));
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          bgcolor: colors.primary[50], 
          color: colors.primary[700],
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 2
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Quản lý quyền hạn: {subAdmin?.email}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
          {Object.entries(permissionGroups).map(([groupName, permissions]) => (
            <Paper 
              key={groupName}
              elevation={1} 
              sx={{ 
                p: 2, 
                border: `1px solid ${colors.neutral[200]}`,
                borderRadius: 2,
                height: 'fit-content'
              }}
            >
                <Box sx={{ mb: 2 }}>
                  <Typography 
                    variant="h6" 
                    fontWeight="bold" 
                    color={colors.primary[600]}
                    sx={{ mb: 1 }}
                  >
                    {groupName}
                  </Typography>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isGroupAllSelected(permissions)}
                        indeterminate={isGroupPartiallySelected(permissions)}
                        onChange={() => handleSelectAll(permissions)}
                        sx={{ color: colors.primary[500] }}
                      />
                    }
                    label={
                      <Typography variant="body2" fontWeight="medium">
                        Chọn tất cả
                      </Typography>
                    }
                  />
                  <Divider sx={{ my: 1 }} />
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {permissions.map((permission) => (
                    <FormControlLabel
                      key={permission.key}
                      control={
                        <Checkbox
                          checked={selectedPermissions.includes(permission.key)}
                          onChange={(e) => handlePermissionChange(permission.key, e.target.checked)}
                          sx={{ 
                            color: colors.primary[500],
                            '&.Mui-checked': {
                              color: colors.primary[600],
                            }
                          }}
                        />
                      }
                      label={
                        <Typography variant="body2">
                          {permission.label}
                        </Typography>
                      }
                      sx={{ 
                        ml: 1,
                        '&:hover': {
                          bgcolor: colors.neutral[50],
                          borderRadius: 1,
                        }
                      }}
                    />
                  ))}
                </Box>
              </Paper>
          ))}
        </Box>
        
        <Box sx={{ mt: 3, p: 2, bgcolor: colors.neutral[50], borderRadius: 1 }}>
          <Typography variant="body2" color={colors.text.secondary}>
            <strong>Tổng số quyền đã chọn:</strong> {selectedPermissions.length}
          </Typography>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, bgcolor: colors.neutral[50] }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
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
          onClick={handleSave} 
          variant="contained"
          sx={{
            bgcolor: colors.primary[500],
            '&:hover': {
              bgcolor: colors.primary[600],
            }
          }}
        >
          Lưu thay đổi
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PermissionDialog;
