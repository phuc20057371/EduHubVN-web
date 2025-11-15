import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  Stepper, 
  Step, 
  StepLabel,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import { 
  Email as EmailIcon, 
  Visibility, 
  VisibilityOff,
  Security as SecurityIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { API } from '../../utils/Fetch';
import type { EmailReq } from '../../types/Email';
import type { ResetPasswordUserReq } from '../../types/Authen';

const steps = ['Nhập email', 'Đặt lại mật khẩu'];

const ForgotPassword = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    setError('');
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleSendOTP = async () => {
    if (!formData.email) {
      setError('Vui lòng nhập email');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Email không hợp lệ');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const requestData: EmailReq = {
        email: formData.email
      };

      const response = await API.auth.forgotPassword(requestData);
      
      if (response.data.success) {
        toast.success('OTP đã được gửi đến email của bạn');
        setActiveStep(1);
      } else {
        setError(response.data.message || 'Có lỗi xảy ra khi gửi OTP');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi gửi OTP';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!formData.otp) {
      setError('Vui lòng nhập mã OTP');
      return;
    }

    if (!formData.newPassword) {
      setError('Vui lòng nhập mật khẩu mới');
      return;
    }

    if (!validatePassword(formData.newPassword)) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const requestData: ResetPasswordUserReq = {
        email: formData.email,
        otp: formData.otp,
        newPassword: formData.newPassword
      };

      const response = await API.auth.resetPassword(requestData);
      
      if (response.data.success) {
        toast.success('Đặt lại mật khẩu thành công!');
        // Redirect to login page
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        setError(response.data.message || 'Có lỗi xảy ra khi đặt lại mật khẩu');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi đặt lại mật khẩu';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
      setError('');
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Nhập email đã đăng ký để nhận mã OTP đặt lại mật khẩu
            </Typography>
            
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                onClick={() => window.location.href = '/login'}
                disabled={loading}
              >
                Quay lại đăng nhập
              </Button>
              
              <Button
                variant="contained"
                onClick={handleSendOTP}
                disabled={loading || !formData.email}
                startIcon={loading ? <CircularProgress size={20} /> : <SecurityIcon />}
              >
                {loading ? 'Đang gửi...' : 'Gửi OTP'}
              </Button>
            </Box>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Nhập mã OTP đã nhận và mật khẩu mới
            </Typography>

            <TextField
              fullWidth
              label="Mã OTP"
              value={formData.otp}
              onChange={handleInputChange('otp')}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SecurityIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label="Mật khẩu mới"
              type={showPassword ? 'text' : 'password'}
              value={formData.newPassword}
              onChange={handleInputChange('newPassword')}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label="Xác nhận mật khẩu mới"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                onClick={handleBack}
                disabled={loading}
              >
                Quay lại
              </Button>
              
              <Button
                variant="contained"
                onClick={handleResetPassword}
                disabled={loading || !formData.otp || !formData.newPassword || !formData.confirmPassword}
                startIcon={loading ? <CircularProgress size={20} /> : <LockIcon />}
              >
                {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
              </Button>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'grey.50',
        py: 3
      }}
    >
      <Card sx={{ maxWidth: 500, width: '100%', mx: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            textAlign="center"
            sx={{ mb: 1, fontWeight: 'bold' }}
          >
            Quên mật khẩu
          </Typography>
          
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            sx={{ mb: 4 }}
          >
            Khôi phục mật khẩu của bạn
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {renderStepContent(activeStep)}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ForgotPassword;
