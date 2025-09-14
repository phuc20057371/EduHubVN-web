import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Close as CloseIcon,
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { colors } from '../../theme/colors';

interface CreateSubAdminDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { username: string; password: string }) => Promise<void>;
}

const CreateSubAdminDialog: React.FC<CreateSubAdminDialogProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validateForm = () => {
    const newErrors = {
      username: '',
      password: '',
    };

    if (!formData.username.trim()) {
      newErrors.username = 'Vui lòng nhập tên đăng nhập';
    } else if (formData.username.trim().length < 3) {
      newErrors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
    }

    // Validate password (any non-empty string)
    if (!formData.password.trim()) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    }

    setErrors(newErrors);
    return !newErrors.username && !newErrors.password;
  };

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
    
    // Clear submit error
    if (submitError) {
      setSubmitError('');
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSave({
        username: formData.username.trim(),
        password: formData.password,
      });
      
      // Reset form and close dialog
      setFormData({ username: '', password: '' });
      setErrors({ username: '', password: '' });
      setSubmitError('');
      onClose();
    } catch (error: any) {
      console.error('Error creating sub-admin:', error);
      setSubmitError(
        error.response?.data?.message || 
        'Có lỗi xảy ra khi tạo MOD. Vui lòng thử lại.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({ username: '', password: '' });
      setErrors({ username: '', password: '' });
      setSubmitError('');
      onClose();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
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
          Tạo MOD mới
        </Typography>
        <IconButton onClick={handleClose} size="small" disabled={loading}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        <Typography variant="body2" color={colors.text.secondary} sx={{ mb: 3 }}>
         
        </Typography>

        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {submitError}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="Tên đăng nhập"
            type="text"
            value={formData.username}
            onChange={handleInputChange('username')}
            error={!!errors.username}
            helperText={errors.username || ''}
            disabled={loading}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon sx={{ color: colors.primary[500] }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: colors.primary[400],
                },
                '&.Mui-focused fieldset': {
                  borderColor: colors.primary[500],
                },
              },
            }}
          />

          <TextField
            label="Mật khẩu"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleInputChange('password')}
            error={!!errors.password}
            helperText={errors.password || ''}
            disabled={loading}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: colors.primary[500] }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={togglePasswordVisibility}
                    edge="end"
                    disabled={loading}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: colors.primary[400],
                },
                '&.Mui-focused fieldset': {
                  borderColor: colors.primary[500],
                },
              },
            }}
          />
        </Box>

        <Box sx={{ mt: 3, p: 2, bgcolor: colors.neutral[50], borderRadius: 1 }}>
          <Typography variant="body2" color={colors.text.secondary}>
            <strong>Lưu ý:</strong> MOD được tạo sẽ chưa có quyền hạn nào. 
            Bạn cần thiết lập quyền hạn cụ thể sau khi tạo tài khoản.
          </Typography>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, bgcolor: colors.neutral[50] }}>
        <Button 
          onClick={handleClose} 
          variant="outlined"
          disabled={loading}
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
          onClick={handleSubmit} 
          variant="contained"
          disabled={loading}
          sx={{
            bgcolor: colors.primary[500],
            '&:hover': {
              bgcolor: colors.primary[600],
            },
            minWidth: '120px',
          }}
        >
          {loading ? 'Đang tạo...' : 'Tạo MOD'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateSubAdminDialog;
