import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Visibility,
  VisibilityOff,
  Security,
  Email,
  VpnKey,
  AlternateEmail,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API } from '../utils/Fetch';
import { useColors } from '../hooks/useColors';
import { setUserProfile } from '../redux/slice/userSlice';
import WebSocketService from '../services/WebSocketService';
import type { SendChangePasswordOtpRequest } from '../types/SendChangePasswordOtpRequest';
import type { ChangePasswordRequest } from '../types/ChangePasswordRequest';
import type { SendSubEmailOtpRequest, AddSubEmailRequest } from '../types/AddSubEmailRequest';

interface SubEmail {
  id: string;
  email: string;
  isVerified: boolean;
  isPrimary: boolean;
}

interface AccountSettingsComponentProps {
  title?: string;
  subtitle?: string;
  showTitle?: boolean;
  containerProps?: any;
  onPasswordChangeSuccess?: () => void;
}

const AccountSettingsComponent: React.FC<AccountSettingsComponentProps> = ({
  title = "Cài đặt tài khoản",
  subtitle = "Quản lý thông tin tài khoản và bảo mật của bạn",
  showTitle = true,
  containerProps = {},
  onPasswordChangeSuccess
}) => {
  const colors = useColors();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userProfile = useSelector((state: any) => state.userProfile);
  
  // SubEmail management state
  const [subEmails, setSubEmails] = useState<SubEmail[]>([]);
  const [newSubEmail, setNewSubEmail] = useState('');
  const [isAddingEmail, setIsAddingEmail] = useState(false);
  const [editingEmailId, setEditingEmailId] = useState<string | null>(null);
  const [editEmailValue, setEditEmailValue] = useState('');
  const [isLoadingEmailAction, setIsLoadingEmailAction] = useState(false);
  
  // SubEmail OTP verification state
  const [subEmailOtpStep, setSubEmailOtpStep] = useState(0); // 0: input email, 1: verify OTP
  const [subEmailOtp, setSubEmailOtp] = useState('');
  const [isLoadingSubEmailOtp, setIsLoadingSubEmailOtp] = useState(false);
  const [pendingSubEmail, setPendingSubEmail] = useState('');
  
  // Password change state
  const [activeStep, setActiveStep] = useState(0);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [selectedEmailForOtp, setSelectedEmailForOtp] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [emailToDelete, setEmailToDelete] = useState<string | null>(null);
  
  // Loading states
  const [isLoadingOtp, setIsLoadingOtp] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  // Error states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Accordion states
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>('email-management');

  useEffect(() => {
    if (userProfile?.email) {
      // Initialize with primary email
      const primaryEmail: SubEmail = {
        id: 'primary',
        email: userProfile.email,
        isVerified: true,
        isPrimary: true,
      };
      
      // Add sub emails from userProfile.subEmails if they exist
      const subEmailsList: SubEmail[] = [primaryEmail];
      
      if (userProfile.subEmails && Array.isArray(userProfile.subEmails)) {
        const formattedSubEmails: SubEmail[] = userProfile.subEmails.map((emailString: string, index: number) => ({
          id: `sub-${index}`,
          email: emailString,
          isVerified: false, // Default to false since we don't have verification info
          isPrimary: false,
        }));
        
        subEmailsList.push(...formattedSubEmails);
      }
      
      setSubEmails(subEmailsList);
      // Default to primary email, but user can select any email including subEmails
      if (!selectedEmailForOtp) {
        setSelectedEmailForOtp(userProfile.email);
      }
    }
  }, [userProfile]);

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation
  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  // SubEmail management functions - Step 1: Send OTP
  const handleSendSubEmailOtp = async () => {
    if (!validateEmail(newSubEmail)) {
      setEmailError('Vui lòng nhập email hợp lệ');
      return;
    }

    if (subEmails.some(email => email.email === newSubEmail)) {
      setEmailError('Email này đã tồn tại trong danh sách');
      return;
    }

    if (newSubEmail === userProfile.email) {
      setEmailError('Email phụ không thể trùng với email chính');
      return;
    }

    setIsLoadingSubEmailOtp(true);
    setEmailError('');
    
    try {
      const otpRequest: SendSubEmailOtpRequest = {
        email: newSubEmail
      };
      
      await API.user.sendSubEmailOtp(otpRequest);
      setPendingSubEmail(newSubEmail);
      setSubEmailOtpStep(1);
      console.log('Pending email set to:', newSubEmail); // Debug log
      toast.success(`Mã OTP đã được gửi đến ${newSubEmail}!`);
    } catch (error: any) {
      setEmailError(error.response?.data?.message || 'Có lỗi xảy ra khi gửi OTP');
      toast.error('Không thể gửi mã OTP');
    } finally {
      setIsLoadingSubEmailOtp(false);
    }
  };

  // SubEmail management functions - Step 2: Add SubEmail with OTP
  const handleAddSubEmailWithOtp = async () => {
    if (!subEmailOtp) {
      setEmailError('Vui lòng nhập mã OTP');
      return;
    }

    setIsLoadingEmailAction(true);
    setEmailError('');
    
    try {
      const addRequest: AddSubEmailRequest = {
        email: pendingSubEmail,
        otp: subEmailOtp
      };
      
      await API.user.addSubEmail(addRequest);
      
      // Update userProfile in Redux store - add email string to array
      const updatedSubEmails = [...(userProfile.subEmails || []), pendingSubEmail];
      dispatch(setUserProfile({
        ...userProfile,
        subEmails: updatedSubEmails
      }));
      
      // Reset form
      setNewSubEmail('');
      setPendingSubEmail('');
      setSubEmailOtp('');
      setSubEmailOtpStep(0);
      setIsAddingEmail(false);
      toast.success('Thêm email phụ thành công!');
    } catch (error: any) {
      setEmailError(error.response?.data?.message || 'Có lỗi xảy ra khi thêm email');
      toast.error('Mã OTP không đúng hoặc đã hết hạn');
    } finally {
      setIsLoadingEmailAction(false);
    }
  };

  const handleCancelAddSubEmail = () => {
    setNewSubEmail('');
    setPendingSubEmail('');
    setSubEmailOtp('');
    setSubEmailOtpStep(0);
    setIsAddingEmail(false);
    setEmailError('');
  };


  const handleSaveEditEmail = async (emailId: string) => {
    if (!validateEmail(editEmailValue)) {
      setEmailError('Vui lòng nhập email hợp lệ');
      return;
    }

    if (subEmails.some(email => email.email === editEmailValue && email.id !== emailId)) {
      setEmailError('Email này đã tồn tại trong danh sách');
      return;
    }

    setIsLoadingEmailAction(true);
    try {
      // TODO: API call to update sub email
      // await API.user.updateSubEmail({ id: emailId, email: editEmailValue });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update userProfile in Redux store - find and replace email string
      const emailIndex = parseInt(emailId.replace('sub-', ''));
      const updatedSubEmails = [...(userProfile.subEmails || [])];
      if (emailIndex >= 0 && emailIndex < updatedSubEmails.length) {
        updatedSubEmails[emailIndex] = editEmailValue;
      }
      dispatch(setUserProfile({
        ...userProfile,
        subEmails: updatedSubEmails
      }));
      
      setEditingEmailId(null);
      setEditEmailValue('');
      setEmailError('');
      toast.success('Cập nhật email thành công!');
    } catch (error: any) {
      setEmailError(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật email');
      toast.error('Không thể cập nhật email');
    } finally {
      setIsLoadingEmailAction(false);
    }
  };

  const handleCancelEditEmail = () => {
    setEditingEmailId(null);
    setEditEmailValue('');
    setEmailError('');
  };

  const handleDeleteSubEmail = (emailId: string) => {
    setEmailToDelete(emailId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteSubEmail = async () => {
    if (!emailToDelete) return;

    setIsLoadingEmailAction(true);
    try {
      // Get the email to delete
      const emailToDeleteObj = subEmails.find(email => email.id === emailToDelete);
      if (!emailToDeleteObj) {
        throw new Error('Email not found');
      }

      // Call API to remove sub email
      await API.user.removeSubEmail({ email: emailToDeleteObj.email });
      
      // Update userProfile in Redux store - remove email string by index
      const emailIndex = parseInt(emailToDelete.replace('sub-', ''));
      const updatedSubEmails = [...(userProfile.subEmails || [])];
      if (emailIndex >= 0 && emailIndex < updatedSubEmails.length) {
        updatedSubEmails.splice(emailIndex, 1);
      }
      dispatch(setUserProfile({
        ...userProfile,
        subEmails: updatedSubEmails
      }));
      
      setDeleteDialogOpen(false);
      setEmailToDelete(null);
      toast.success('Xóa email phụ thành công!');
    } catch (error: any) {
      console.error('Error deleting sub email:', error);
      toast.error(error.response?.data?.message || 'Không thể xóa email phụ');
    } finally {
      setIsLoadingEmailAction(false);
    }
  };

  // Handle password change - Step 1: Send OTP
  const handleSendOtp = async () => {
    if (!currentPassword) {
      setPasswordError('Vui lòng nhập mật khẩu hiện tại');
      return;
    }
    
    if (!validatePassword(newPassword)) {
      setPasswordError('Mật khẩu mới phải có ít nhất 8 ký tự');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (!selectedEmailForOtp) {
      setPasswordError('Vui lòng chọn email để nhận OTP');
      return;
    }

    setIsLoadingOtp(true);
    setPasswordError('');
    
    try {
      const otpRequest: SendChangePasswordOtpRequest = {
        email: selectedEmailForOtp
      };
      
      console.log('Sending change password OTP request:', otpRequest); // Debug log
      console.log('Selected email for OTP:', selectedEmailForOtp); // Debug log
      const response = await API.user.sendOTPChangePassword(otpRequest);
      console.log('OTP Response:', response); // Debug log
      setActiveStep(1);
      toast.success(`Mã OTP đã được gửi đến ${selectedEmailForOtp}!`);
    } catch (error: any) {
      console.error('Send change password OTP error:', error); // Debug log
      console.error('Error response:', error.response); // Debug log
      console.error('Error response data:', error.response?.data); // Debug log
      console.error('Error status:', error.response?.status); // Debug log
      
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi gửi OTP';
      setPasswordError(errorMessage);
      toast.error(`Lỗi: ${errorMessage}`);
    } finally {
      setIsLoadingOtp(false);
    }
  };

  // Handle password change - Step 2: Change password with OTP
  const handleChangePassword = async () => {
    if (!otp) {
      setPasswordError('Vui lòng nhập mã OTP');
      return;
    }

    setIsChangingPassword(true);
    setPasswordError('');
    
    try {
      const changePasswordRequest: ChangePasswordRequest = {
        email: selectedEmailForOtp,
        otp,
        oldPassword: currentPassword,
        newPassword,
        confirmPassword
      };
      console.log('Change password request:', changePasswordRequest);
      
      await API.user.changePassword(changePasswordRequest);
      
      // Reset form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setOtp('');
      setActiveStep(0);
      
      toast.success('Đổi mật khẩu thành công! Đang đăng xuất...');
      
      // Call custom callback if provided
      if (onPasswordChangeSuccess) {
        onPasswordChangeSuccess();
      } else {
        // Default logout behavior
        setTimeout(() => {
          // Disconnect WebSocket
          WebSocketService.disconnect();
          
          // Clear tokens
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          
          // Navigate to login
          navigate("/login");
        }); // Delay để user có thể thấy thông báo thành công
      }
      
    } catch (error: any) {
      setPasswordError(error.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu');
      toast.error('Không thể đổi mật khẩu');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleResetPasswordForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setOtp('');
    setActiveStep(0);
    setPasswordError('');
  };

  const steps = [
    {
      label: 'Nhập thông tin mật khẩu',
      description: 'Nhập mật khẩu hiện tại và mật khẩu mới'
    },
    {
      label: 'Xác thực OTP',
      description: 'Nhập mã OTP được gửi đến email của bạn'
    }
  ];

  // Get available emails for OTP selection - primary email + all subEmails
  const availableEmailsForOtp = subEmails; // All emails (primary + subEmails) are available for OTP

  // Handle accordion change
  const handleAccordionChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedAccordion(isExpanded ? panel : false);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 900, mx: 'auto', ...containerProps }}>
      {showTitle && (
        <>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: colors.text.primary }}>
            {title}
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: colors.text.secondary }}>
            {subtitle}
          </Typography>
        </>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Email Management Section */}
        <Accordion 
          expanded={expandedAccordion === 'email-management'} 
          onChange={handleAccordionChange('email-management')}
          sx={{ borderRadius: 2, boxShadow: 2, '&:before': { display: 'none' } }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ 
              backgroundColor: colors.background.secondary,
              borderRadius: '8px 8px 0 0',
              '&.Mui-expanded': {
                borderRadius: '8px 8px 0 0',
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AlternateEmail sx={{ mr: 2, color: colors.primary.main }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Quản lý danh sách Email
                </Typography>
                <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                  Quản lý email chính và các email phụ
                </Typography>
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 3 }}>

            {emailError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {emailError}
              </Alert>
            )}

            {/* Email List */}
            <List sx={{ mb: 2 }}>
              {subEmails.map((email) => (
                <ListItem key={email.id} sx={{ px: 0, py: 1 }}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {editingEmailId === email.id ? (
                          <TextField
                            size="small"
                            value={editEmailValue}
                            onChange={(e) => setEditEmailValue(e.target.value)}
                            sx={{ flexGrow: 1 }}
                          />
                        ) : (
                          <Typography variant="body1">{email.email}</Typography>
                        )}
                        
                        {email.isPrimary && (
                          <Chip 
                            label="Email chính" 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                        )}
                        
                        {email.isPrimary ? (
                          <Chip 
                            label="Đã xác thực" 
                            size="small" 
                            color="success"
                            variant="outlined"
                          />
                        ) : (
                          <Chip 
                            label="Email phụ" 
                            size="small" 
                            color="default"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {editingEmailId === email.id ? (
                        <>
                          <IconButton
                            size="small"
                            onClick={() => handleSaveEditEmail(email.id)}
                            disabled={isLoadingEmailAction}
                            sx={{ color: colors.success[500] }}
                          >
                            {isLoadingEmailAction ? <CircularProgress size={16} /> : <SaveIcon />}
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={handleCancelEditEmail}
                            sx={{ color: colors.error[500] }}
                          >
                            <CancelIcon />
                          </IconButton>
                        </>
                        ) 
                        : (
                          <>
                            {!email.isPrimary && (
                              <>
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeleteSubEmail(email.id)}
                                  sx={{ color: colors.error[500] }}
                                  title="Xóa email phụ"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </>
                            )}
                          </>
                        )}
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>

            {/* Add New Email - 2 Step Process */}
            {isAddingEmail ? (
              <Box sx={{ border: `1px solid ${colors.border.light}`, borderRadius: 1, p: 2, mt: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  Thêm email phụ
                </Typography>
                
                {subEmailOtpStep === 0 ? (
                  // Step 1: Enter email and send OTP
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Email phụ mới"
                      value={newSubEmail}
                      onChange={(e) => setNewSubEmail(e.target.value)}
                      placeholder="example@domain.com"
                      helperText="Mã OTP sẽ được gửi đến email này để xác thực"
                      error={!!emailError}
                    />
                    
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        variant="contained"
                        onClick={handleSendSubEmailOtp}
                        disabled={isLoadingSubEmailOtp}
                        startIcon={isLoadingSubEmailOtp ? <CircularProgress size={20} /> : <VpnKey />}
                      >
                        {isLoadingSubEmailOtp ? 'Đang gửi...' : 'Gửi mã OTP'}
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={handleCancelAddSubEmail}
                      >
                        Hủy
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  // Step 2: Enter OTP and confirm
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Alert severity="info">
                      Mã OTP đã được gửi đến email: <strong>{pendingSubEmail}</strong>
                    </Alert>
                    
                    <Box sx={{ p: 2, bgcolor: colors.background.secondary, borderRadius: 1, mb: 1 }}>
                      <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                        Email phụ: <strong>{pendingSubEmail || 'Không có email'}</strong>
                      </Typography>
                      <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block' }}>
                        Debug - Step: {subEmailOtpStep}, Pending: {pendingSubEmail}
                      </Typography>
                    </Box>
                    
                    <TextField
                      fullWidth
                      size="small"
                      label="Mã OTP"
                      value={subEmailOtp}
                      onChange={(e) => setSubEmailOtp(e.target.value)}
                      placeholder="Nhập mã OTP 6 số"
                      inputProps={{ maxLength: 6 }}
                      error={!!emailError}
                      helperText={emailError}
                    />
                    
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        variant="contained"
                        onClick={handleAddSubEmailWithOtp}
                        disabled={isLoadingEmailAction}
                        startIcon={isLoadingEmailAction ? <CircularProgress size={20} /> : <SaveIcon />}
                      >
                        {isLoadingEmailAction ? 'Đang thêm...' : 'Xác nhận thêm email'}
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => setSubEmailOtpStep(0)}
                      >
                        Quay lại
                      </Button>
                      <Button
                        variant="text"
                        onClick={handleSendSubEmailOtp}
                        disabled={isLoadingSubEmailOtp}
                      >
                        Gửi lại OTP
                      </Button>
                    </Box>
                  </Box>
                )}
              </Box>
            ) : (
              <Button
                startIcon={<AddIcon />}
                variant="outlined"
                onClick={() => setIsAddingEmail(true)}
                sx={{ mt: 1 }}
              >
                Thêm email phụ
              </Button>
            )}
          </AccordionDetails>
        </Accordion>

        {/* Password Change Section */}
        <Accordion 
          expanded={expandedAccordion === 'password-change'} 
          onChange={handleAccordionChange('password-change')}
          sx={{ borderRadius: 2, boxShadow: 2, '&:before': { display: 'none' } }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ 
              backgroundColor: colors.background.secondary,
              borderRadius: '8px 8px 0 0',
              '&.Mui-expanded': {
                borderRadius: '8px 8px 0 0',
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Security sx={{ mr: 2, color: colors.primary.main }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Đổi mật khẩu
                </Typography>
                <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                  Xác thực qua email trước khi đổi mật khẩu
                </Typography>
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 3 }}>

            {passwordError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {passwordError}
              </Alert>
            )}

            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {step.label}
                    </Typography>
                  </StepLabel>
                  <StepContent>
                    <Typography variant="body2" sx={{ mb: 2, color: colors.text.secondary }}>
                      {step.description}
                    </Typography>
                    
                    {index === 0 && (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                          fullWidth
                          label="Mật khẩu hiện tại"
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                  edge="end"
                                >
                                  {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                        
                        <TextField
                          fullWidth
                          label="Mật khẩu mới"
                          type={showNewPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          helperText="Mật khẩu phải có ít nhất 8 ký tự"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowNewPassword(!showNewPassword)}
                                  edge="end"
                                >
                                  {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                        
                        <TextField
                          fullWidth
                          label="Xác nhận mật khẩu mới"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          InputProps={{
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
                        />

                        {/* Email Selection for OTP */}
                        <FormControl fullWidth>
                          <InputLabel>Chọn email để nhận OTP</InputLabel>
                          <Select
                            value={selectedEmailForOtp}
                            onChange={(e) => setSelectedEmailForOtp(e.target.value)}
                            label="Chọn email để nhận OTP"
                          >
                            {availableEmailsForOtp.map((email) => (
                              <MenuItem key={email.id} value={email.email}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Email fontSize="small" />
                                  {email.email}
                                  {email.isPrimary ? (
                                    <Chip label="Email chính" size="small" color="primary" variant="outlined" />
                                  ) : (
                                    <Chip label="Email phụ" size="small" color="default" variant="outlined" />
                                  )}
                                </Box>
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        
                        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                          <Button
                            variant="contained"
                            onClick={handleSendOtp}
                            disabled={isLoadingOtp || availableEmailsForOtp.length === 0}
                            startIcon={isLoadingOtp ? <CircularProgress size={20} /> : <VpnKey />}
                          >
                            {isLoadingOtp ? 'Đang gửi...' : 'Gửi mã OTP'}
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={handleResetPasswordForm}
                          >
                            Hủy
                          </Button>
                        </Box>

                        {availableEmailsForOtp.length === 0 && (
                          <Alert severity="warning" sx={{ mt: 2 }}>
                            Không có email nào để nhận OTP
                          </Alert>
                        )}
                      </Box>
                    )}
                    
                    {index === 1 && (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Alert severity="info">
                          Mã OTP đã được gửi đến email: {selectedEmailForOtp}
                        </Alert>
                        
                        <TextField
                          fullWidth
                          label="Mã OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="Nhập mã OTP 6 số"
                          inputProps={{ maxLength: 6 }}
                        />
                        
                        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                          <Button
                            variant="contained"
                            onClick={handleChangePassword}
                            disabled={isChangingPassword}
                            startIcon={isChangingPassword ? <CircularProgress size={20} /> : <Security />}
                          >
                            {isChangingPassword ? 'Đang đổi...' : 'Đổi mật khẩu'}
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={() => setActiveStep(0)}
                          >
                            Quay lại
                          </Button>
                          <Button
                            variant="text"
                            onClick={handleSendOtp}
                            disabled={isLoadingOtp}
                          >
                            Gửi lại OTP
                          </Button>
                        </Box>
                      </Box>
                    )}
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DeleteIcon color="error" />
          Xác nhận xóa email phụ
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Bạn có chắc chắn muốn xóa email phụ này khỏi danh sách không?
          </Typography>
          {emailToDelete && (
            <Box sx={{ p: 2, bgcolor: colors.background.secondary, borderRadius: 1 }}>
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                Email sẽ bị xóa:
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: colors.error[500] }}>
                {subEmails.find(email => email.id === emailToDelete)?.email}
              </Typography>
            </Box>
          )}
          <Typography variant="body2" sx={{ mt: 2, color: colors.text.secondary }}>
            Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            disabled={isLoadingEmailAction}
          >
            Hủy
          </Button>
          <Button 
            onClick={confirmDeleteSubEmail} 
            color="error" 
            variant="contained"
            disabled={isLoadingEmailAction}
            startIcon={isLoadingEmailAction ? <CircularProgress size={16} /> : <DeleteIcon />}
          >
            {isLoadingEmailAction ? 'Đang xóa...' : 'Xóa email'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AccountSettingsComponent;
