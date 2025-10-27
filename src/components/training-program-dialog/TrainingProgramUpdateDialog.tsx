import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  IconButton,
  Chip,
  Avatar,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
  Switch,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Close as CloseIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { vi } from 'date-fns/locale';
import type { TrainingProgram, TrainingProgramReq } from '../../types/TrainingProgram';
import { API } from '../../utils/Fetch';
import { toast } from 'react-toastify';
import { validateTrainingProgramForm } from '../../utils/Validate';

interface TrainingProgramUpdateDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (programData: TrainingProgramReq) => Promise<void>;
  program: TrainingProgram | null;
}

const TrainingProgramUpdateDialog: React.FC<TrainingProgramUpdateDialogProps> = ({
  open,
  onClose,
  onSave,
  program,
}) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [selectedBannerFile, setSelectedBannerFile] = useState<File | null>(null);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [selectedSyllabusFile, setSelectedSyllabusFile] = useState<File | null>(null);
  const [isUploadingSyllabus, setIsUploadingSyllabus] = useState(false);
  const bannerInputRef = React.useRef<HTMLInputElement>(null);
  const syllabusInputRef = React.useRef<HTMLInputElement>(null);



  // Notification state
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  const [formData, setFormData] = useState<TrainingProgramReq>({
    title: '',
    subTitle: '',
    shortDescription: '',
    description: '',
    learningObjectives: '',
    targetAudience: '',
    requirements: '',
    learningOutcomes: '',
    programStatus: 'REVIEW',
    programMode: 'OFFLINE',
    programType: 'SINGLE',
    startDate: new Date(),
    endDate: new Date(),
    durationHours: 0,
    durationSessions: 0,
    scheduleDetail: '',
    programLevel: 'BEGINNER',
    maxStudents: 0,
    minStudents: 0,
    openingCondition: '',
    equipmentRequirement: '',
    classroomLink: '',
    scale: '',
    listedPrice: 0,
    internalPrice: 0,
    publicPrice: 0,
    priceVisible: false,
    bannerUrl: '',
    contentUrl: '',
    syllabusFileUrl: '',
    tags: [],
    completionCertificateType: '',
    certificateIssuer: '',
    rating: null,
    trainingProgramRequest: null,
    partnerOrganization: null,
    user: null,
  });

  // Load program data when dialog opens
  useEffect(() => {
    if (open && program) {
      const currentStatus = (program.programStatus || 'REVIEW') as 'REVIEW' | 'PUBLISHED' | 'UNLISTED' | 'ARCHIVED';
      setFormData({
        id: program.id,
        title: program.title || '',
        subTitle: program.subTitle || '',
        shortDescription: program.shortDescription || '',
        description: program.description || '',
        learningObjectives: program.learningObjectives || '',
        targetAudience: program.targetAudience || '',
        requirements: program.requirements || '',
        learningOutcomes: program.learningOutcomes || '',
        programStatus: currentStatus,
        programMode: program.programMode || 'OFFLINE',
        programType: program.programType || 'SINGLE',
        startDate: program.startDate ? new Date(program.startDate) : new Date(),
        endDate: program.endDate ? new Date(program.endDate) : new Date(),
        durationHours: program.durationHours || 0,
        durationSessions: program.durationSessions || 0,
        scheduleDetail: program.scheduleDetail || '',
        programLevel: 'BEGINNER', // Default since it might not exist in TrainingProgram
        maxStudents: program.maxStudents || 0,
        minStudents: program.minStudents || 0,
        openingCondition: program.openingCondition || '',
        equipmentRequirement: program.equipmentRequirement || '',
        classroomLink: program.classroomLink || '',
        scale: program.scale || '',
        listedPrice: program.listedPrice || 0,
        internalPrice: program.internalPrice || 0,
        publicPrice: program.publicPrice || 0,
        priceVisible: program.priceVisible || false,
        bannerUrl: program.bannerUrl || '',
        contentUrl: program.contentUrl || '',
        syllabusFileUrl: program.syllabusFileUrl || '',
        tags: Array.isArray(program.tags) ? [...program.tags] : [],
        completionCertificateType: program.completionCertificateType || '',
        certificateIssuer: program.certificateIssuer || '',
        rating: program.rating || null,
        trainingProgramRequest: program.trainingProgramRequest || null,
        partnerOrganization: program.partnerOrganization || null,
        user: program.user || null,
      });
    }
  }, [open, program]);

  const handleFormChange = <K extends keyof TrainingProgramReq>(field: K, value: TrainingProgramReq[K]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    } as TrainingProgramReq));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleBannerFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      
      // Validate file type (only images)
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chỉ chọn file hình ảnh (JPG, PNG, GIF, etc.)');
        return;
      }
      
      setSelectedBannerFile(file);

      // Auto upload file when selected
      setIsUploadingBanner(true);
      try {
        const response = await API.user.uploadFileToServer(file);
        console.log("✅ File uploaded successfully:", response.data);
        setFormData(prev => ({ ...prev, bannerUrl: response.data }));
        
      } catch (error: any) {
        console.error("❌ Error uploading banner:", error);
        alert("Tải lên banner không thành công");
        setSelectedBannerFile(null);
        setFormData(prev => ({ ...prev, bannerUrl: "" }));
      } finally {
        setIsUploadingBanner(false);
      }
    }
  };

  const handleSyllabusFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      
      // Validate file type (only Word and PDF)
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        toast.error('Vui lòng chỉ chọn file Word (.doc, .docx) hoặc PDF (.pdf)');
        return;
      }
      
      setSelectedSyllabusFile(file);

      // Auto upload file when selected
      setIsUploadingSyllabus(true);
      try {
        const response = await API.user.uploadFileToServer(file);
        console.log("✅ File uploaded successfully:", response.data);
        setFormData(prev => ({ ...prev, syllabusFileUrl: response.data }));
        
      } catch (error: any) {
        console.error("❌ Error uploading syllabus:", error);
        alert("Tải lên file giáo trình không thành công");
        setSelectedSyllabusFile(null);
        setFormData(prev => ({ ...prev, syllabusFileUrl: "" }));
      } finally {
        setIsUploadingSyllabus(false);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      console.log("Submitting form data:", formData);
      
      
      setLoading(true);
      
      if (validateTrainingProgramForm(formData).success === false) {
        toast.error(
          validateTrainingProgramForm(formData).error ||
            'Vui lòng điền đầy đủ thông tin bắt buộc',
        );
        return;
      }

      const programData: TrainingProgramReq = {
        ...formData,
      };

      await onSave(programData);
    } catch (error) {
      console.error('Error updating training program:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form
    setFormData({
      title: '',
      subTitle: '',
      shortDescription: '',
      description: '',
      learningObjectives: '',
      targetAudience: '',
      requirements: '',
      learningOutcomes: '',
      programStatus: 'REVIEW',
      programMode: 'OFFLINE',
      programType: 'SINGLE',
      startDate: new Date(),
      endDate: new Date(),
      durationHours: 0,
      durationSessions: 0,
      scheduleDetail: '',
      programLevel: 'BEGINNER',
      maxStudents: 0,
      minStudents: 0,
      openingCondition: '',
      equipmentRequirement: '',
      classroomLink: '',
      scale: '',
      listedPrice: 0,
      internalPrice: 0,
      publicPrice: 0,
      priceVisible: false,
      bannerUrl: '',
      contentUrl: '',
      syllabusFileUrl: '',
      tags: [],
      completionCertificateType: '',
      certificateIssuer: '',
      rating: null,
      trainingProgramRequest: null,
      partnerOrganization: null,
      user: null,
    });
    
    // Reset file upload states
    setSelectedBannerFile(null);
    setIsUploadingBanner(false);
    if (bannerInputRef.current) {
      bannerInputRef.current.value = '';
    }
    setSelectedSyllabusFile(null);
    setIsUploadingSyllabus(false);
    if (syllabusInputRef.current) {
      syllabusInputRef.current.value = '';
    }
    setTagInput('');
    
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          py: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              bgcolor: theme.palette.primary.contrastText,
              color: theme.palette.primary.main,
            }}
          >
            <SchoolIcon />
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Chỉnh sửa Chương trình Đào tạo
          </Typography>
        </Box>
        <IconButton
          onClick={handleClose}
          sx={{
            color: theme.palette.primary.contrastText,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 4, overflow: 'auto' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          📝 Chỉnh sửa Chương trình Đào tạo
        </Typography>

        {/* Status and Rating */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
            Trạng thái và Đánh giá
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Trạng thái chương trình</InputLabel>
                <Select
                  value={formData.programStatus}
                  label="Trạng thái chương trình"
                  onChange={(e) => handleFormChange('programStatus', e.target.value as 'REVIEW' | 'PUBLISHED' | 'UNLISTED' | 'ARCHIVED')}
                >
                  <MenuItem value="REVIEW">Xem xét</MenuItem>
                  <MenuItem value="PUBLISHED">Xuất bản</MenuItem>
                  <MenuItem value="UNLISTED">Không công khai</MenuItem>
                  <MenuItem value="ARCHIVED">Đã lưu trữ</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                type="number"
                label="Đánh giá (1.0 - 5.0)"
                value={formData.rating || ''}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (isNaN(value) || e.target.value === '') {
                    handleFormChange('rating', null);
                  } else {
                    const clampedValue = Math.min(Math.max(value, 0), 5);
                    handleFormChange('rating', clampedValue);
                  }
                }}
                margin="dense"
                inputProps={{
                  min: 0,
                  max: 5,
                  step: 0.1
                }}
                placeholder="1.0 - 5.0"
                helperText="Nhập số từ 1.0 đến 5.0"
              />
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* 1. Thông tin cơ bản */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
            1. Thông tin cơ bản
          </Typography>
          
          <TextField
            fullWidth
            label="Tên chương trình"
            value={formData.title}
            onChange={(e) => handleFormChange('title', e.target.value)}
            margin="dense"
            required
          />
          
          <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
            <TextField
              fullWidth
              label="Tên phụ"
              value={formData.subTitle}
              onChange={(e) => handleFormChange('subTitle', e.target.value)}
              margin="dense"
            />
            
            <FormControl fullWidth margin="dense" required>
              <InputLabel>Loại chương trình</InputLabel>
              <Select
                value={formData.programType}
                label="Loại chương trình"
                onChange={(e) => handleFormChange('programType', e.target.value)}
              >
                <MenuItem value="SINGLE">Đơn lẻ</MenuItem>
                <MenuItem value="PATHWAY">Lộ trình</MenuItem>
                <MenuItem value="ENTERPRISE_TOPIC">Chủ đề doanh nghiệp</MenuItem>
              </Select>
            </FormControl>
          </Box>


          
          <TextField
            fullWidth
            label="Mô tả ngắn"
            value={formData.shortDescription}
            onChange={(e) => handleFormChange('shortDescription', e.target.value)}
            margin="dense"
            multiline
            minRows={2}
            maxRows={6}
          />
          
          <TextField
            fullWidth
            label="Mô tả chi tiết"
            value={formData.description}
            onChange={(e) => handleFormChange('description', e.target.value)}
            margin="dense"
            multiline
            minRows={3}
            maxRows={8}
          />

          {/* File Upload & Settings */}
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                Hình ảnh Banner
              </Typography>
              <Box
                sx={{
                  border: formData.bannerUrl ? "2px solid #4caf50" : "2px dashed #e0e0e0",
                  borderRadius: 2,
                  textAlign: "center",
                  backgroundColor: "#fafafa",
                  position: "relative",
                  height: 120,
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "#4caf50",
                    backgroundColor: "#f1f8e9",
                  },
                }}
              >
                <input
                  ref={bannerInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleBannerFileChange}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0,
                    cursor: "pointer",
                    zIndex: 2,
                  }}
                  disabled={isUploadingBanner}
                />

                {isUploadingBanner ? (
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={30} />
                    <Typography variant="caption">Đang tải lên...</Typography>
                  </Box>
                ) : formData.bannerUrl ? (
                  <>
                    <Box
                      component="img"
                      src={formData.bannerUrl}
                      alt="Banner Preview"
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        zIndex: 1,
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        zIndex: 3,
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBannerFile(null);
                          setFormData(prev => ({ ...prev, bannerUrl: "" }));
                          if (bannerInputRef.current) {
                            bannerInputRef.current.value = '';
                          }
                        }}
                        sx={{
                          backgroundColor: "rgba(255, 255, 255, 0.8)",
                          "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                          },
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        color: "white",
                        py: 0.5,
                        px: 1,
                        zIndex: 2,
                      }}
                    >
                      <Typography variant="caption" sx={{ display: 'block', textAlign: 'center' }}>
                        {selectedBannerFile?.name || 'Banner đã tải'}
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', opacity: 0.8 }}>
                        Click để thay đổi ảnh
                      </Typography>
                    </Box>
                  </>
                ) : (
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        backgroundColor: "#e3f2fd",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="h6">📷</Typography>
                    </Box>
                    <Typography variant="caption" sx={{ fontWeight: 500 }}>
                      Tải lên hình banner
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      JPG, PNG, GIF (tối đa 10MB)
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                Đề cương/ Tài liệu đính kèm
              </Typography>
              <Box
                sx={{
                  border: formData.syllabusFileUrl ? "2px solid #2196f3" : "2px dashed #e0e0e0",
                  borderRadius: 2,
                  textAlign: "center",
                  backgroundColor: "#fafafa",
                  position: "relative",
                  height: 120,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "#2196f3",
                    backgroundColor: "#e3f2fd",
                  },
                }}
              >
                <input
                  ref={syllabusInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleSyllabusFileChange}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0,
                    cursor: "pointer",
                    zIndex: 2,
                  }}
                  disabled={isUploadingSyllabus}
                />

                {isUploadingSyllabus ? (
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={30} />
                    <Typography variant="caption">Đang tải lên...</Typography>
                  </Box>
                ) : formData.syllabusFileUrl ? (
                  <>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, p: 2 }}>
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          borderRadius: 2,
                          backgroundColor: "#1976d2",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography variant="h5" sx={{ color: "white" }}>📄</Typography>
                      </Box>
                      <Typography variant="caption" sx={{ fontWeight: 600, textAlign: 'center' }}>
                        {selectedSyllabusFile?.name || 'File giáo trình'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Click để thay đổi file
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        zIndex: 3,
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSyllabusFile(null);
                          setFormData(prev => ({ ...prev, syllabusFileUrl: "" }));
                          if (syllabusInputRef.current) {
                            syllabusInputRef.current.value = '';
                          }
                        }}
                        sx={{
                          backgroundColor: "rgba(255, 255, 255, 0.8)",
                          "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                          },
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </>
                ) : (
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        backgroundColor: "#e3f2fd",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="h6">📄</Typography>
                    </Box>
                    <Typography variant="caption" sx={{ fontWeight: 500 }}>
                      Tải lên file
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      PDF, DOC, DOCX (tối đa 10MB)
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="URL Nội dung"
              value={formData.contentUrl}
              onChange={(e) => handleFormChange('contentUrl', e.target.value)}
              placeholder="https://..."
            />
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* 3. Thời gian */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
            3. Thời gian
          </Typography>
          
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <DatePicker
                label="Ngày bắt đầu"
                value={formData.startDate}
                onChange={(newValue) => {
                  if (newValue) {
                    const dateValue = newValue instanceof Date 
                      ? newValue 
                      : (newValue as any).toDate ? (newValue as any).toDate() : new Date(newValue as any);
                    handleFormChange('startDate', dateValue);
                  }
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined'
                  }
                }}
                format="dd/MM/yyyy"
              />
              
              <DatePicker
                label="Ngày kết thúc"
                value={formData.endDate}
                onChange={(newValue) => {
                  if (newValue) {
                    const dateValue = newValue instanceof Date 
                      ? newValue 
                      : (newValue as any).toDate ? (newValue as any).toDate() : new Date(newValue as any);
                    handleFormChange('endDate', dateValue);
                  }
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined'
                  }
                }}
                format="dd/MM/yyyy"
                minDate={formData.startDate}
              />
            </Box>
          </LocalizationProvider>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              type="number"
              label="Số giờ"
              value={formData.durationHours}
              onChange={(e) => handleFormChange('durationHours', parseInt(e.target.value) || 0)}
            />
            
            <TextField
              fullWidth
              type="number"
              label="Số buổi học"
              value={formData.durationSessions}
              onChange={(e) => handleFormChange('durationSessions', parseInt(e.target.value) || 0)}
            />
          </Box>
          
          <TextField
            fullWidth
            label="Chi tiết lịch học"
            value={formData.scheduleDetail}
            onChange={(e) => handleFormChange('scheduleDetail', e.target.value)}
            margin="dense"
            multiline
            minRows={2}
            maxRows={6}
            placeholder="VD: Thứ 2, 4, 6 từ 19:00 - 21:30"
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* 4. Giá cả */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
            4. Giá cả
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              type="number"
              label="Giá niêm yết"
              value={formData.listedPrice}
              onChange={(e) => handleFormChange('listedPrice', parseFloat(e.target.value) || 0)}
            />
            
            <TextField
              fullWidth
              type="number"
              label="Giá nội bộ"
              value={formData.internalPrice}
              onChange={(e) => handleFormChange('internalPrice', parseFloat(e.target.value) || 0)}
            />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              fullWidth
              type="number"
              label="Giá công khai"
              value={formData.publicPrice}
              onChange={(e) => handleFormChange('publicPrice', parseFloat(e.target.value) || 0)}
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={formData.priceVisible}
                  onChange={(e) => handleFormChange('priceVisible', e.target.checked)}
                />
              }
              label="Hiển thị"
              sx={{ minWidth: 200 }}
            />
          </Box>
        </Box>

        {/* 2. Thông tin chi tiết */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
            2. Thông tin chi tiết
          </Typography>
          
          <FormControl fullWidth margin="dense">
            <InputLabel>Cấp độ chương trình</InputLabel>
            <Select
              value={formData.programLevel}
              label="Cấp độ chương trình"
              onChange={(e) => handleFormChange('programLevel', e.target.value)}
            >
              <MenuItem value="BEGINNER">Người mới bắt đầu</MenuItem>
              <MenuItem value="INTERMEDIATE">Trung cấp</MenuItem>
              <MenuItem value="ADVANCED">Nâng cao</MenuItem>
              <MenuItem value="EXPERT">Chuyên gia</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Kiến thức học được"
            value={formData.learningObjectives}
            onChange={(e) => handleFormChange('learningObjectives', e.target.value)}
            margin="dense"
            multiline
            minRows={2}
            maxRows={6}
          />
          
          <TextField
            fullWidth
            label="Đối tượng tham gia"
            value={formData.targetAudience}
            onChange={(e) => handleFormChange('targetAudience', e.target.value)}
            multiline
            minRows={2}
            maxRows={6}
            margin="dense"
          />

          <TextField
            fullWidth
            label="Yêu cầu đầu vào"
            value={formData.requirements}
            onChange={(e) => handleFormChange('requirements', e.target.value)}
            margin="dense"
            multiline
            minRows={2}
            maxRows={6}
            placeholder="VD: Kiến thức cơ bản về lập trình"
          />
          
          <TextField
            fullWidth
            label="Kết quả đầu ra"
            value={formData.learningOutcomes}
            onChange={(e) => handleFormChange('learningOutcomes', e.target.value)}
            margin="dense"
            multiline
            minRows={2}
            maxRows={6}
          />
          
          <Divider sx={{ my: 2 }} />
          
          <FormControl component="fieldset" fullWidth required sx={{ mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 500, mb: 1 }}>
              Hình thức
            </Typography>
            <RadioGroup
              row
              value={formData.programMode}
              onChange={(e) => handleFormChange('programMode', e.target.value as 'ONLINE' | 'OFFLINE' | 'HYBRID')}
            >
              <FormControlLabel 
                value="ONLINE" 
                control={<Radio />} 
                label="Online" 
              />
              <FormControlLabel 
                value="OFFLINE" 
                control={<Radio />} 
                label="Offline" 
              />
              <FormControlLabel 
                value="HYBRID" 
                control={<Radio />} 
                label="Hybrid" 
              />
            </RadioGroup>
          </FormControl>

          <TextField
            fullWidth
            label={
              formData.programMode === 'ONLINE' 
                ? "Liên kết lớp học"
                : formData.programMode === 'OFFLINE'
                ? "Địa chỉ lớp học"
                : formData.programMode === 'HYBRID'
                ? "Ghi chú"
                : "Liên kết lớp học"
            }
            value={formData.classroomLink}
            onChange={(e) => handleFormChange('classroomLink', e.target.value)}
            placeholder={
              formData.programMode === 'ONLINE' 
                ? "https://meet.google.com/..."
                : formData.programMode === 'OFFLINE'
                ? "Địa chỉ phòng học..."
                : formData.programMode === 'HYBRID'
                ? "Ghi chú về hình thức kết hợp..."
                : "https://meet.google.com/..."
            }
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              type="number"
              label="Số học viên tối đa"
              value={formData.maxStudents}
              onChange={(e) => handleFormChange('maxStudents', parseInt(e.target.value) || 0)}
            />
            
            <TextField
              fullWidth
              type="number"
              label="Số học viên tối thiểu"
              value={formData.minStudents}
              onChange={(e) => handleFormChange('minStudents', parseInt(e.target.value) || 0)}
            />
          </Box>

          <TextField
            fullWidth
            label="Điều kiện mở lớp"
            value={formData.openingCondition}
            onChange={(e) => handleFormChange('openingCondition', e.target.value)}
            margin="dense"
            multiline
            minRows={2}
            maxRows={6}
            placeholder="VD: Đủ sinh viên tối thiểu"
          />
          
          <TextField
            fullWidth
            label="Yêu cầu thiết bị"
            value={formData.equipmentRequirement}
            onChange={(e) => handleFormChange('equipmentRequirement', e.target.value)}
            margin="dense"
            multiline
            minRows={2}
            maxRows={6}
            placeholder="VD: Laptop, camera, micro"
          />

          <TextField
            fullWidth
            label="Quy mô"
            value={formData.scale}
            onChange={(e) => handleFormChange('scale', e.target.value)}
            margin="dense"
            placeholder="VD: Cá nhân, Doanh nghiệp nhỏ, Doanh nghiệp"
          />

          {/* Tags */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
              Thẻ tag
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                placeholder="Nhập tag mới"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button
                variant="outlined"
                onClick={handleAddTag}
                disabled={!tagInput.trim()}
                sx={{ minWidth: 100 }}
              >
                Thêm tag
              </Button>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', minHeight: 50, p: 2, border: '1px solid #e0e0e0', borderRadius: 1, backgroundColor: '#fafafa' }}>
              {formData.tags.length > 0 ? (
                formData.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    color="primary"
                    variant="outlined"
                  />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  Chưa có tag nào được thêm
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* 5. Kiểm định chất lượng */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
            5. Kiểm định chất lượng
          </Typography>
          
          <TextField
            fullWidth
            label="Loại chứng chỉ hoàn thành"
            value={formData.completionCertificateType}
            onChange={(e) => handleFormChange('completionCertificateType', e.target.value)}
            margin="dense"
          />
          
          <TextField
            fullWidth
            label="Tổ chức cấp chứng chỉ"
            value={formData.certificateIssuer}
            onChange={(e) => handleFormChange('certificateIssuer', e.target.value)}
            margin="dense"
          />
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          backgroundColor: theme.palette.background.paper,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Button onClick={handleClose} disabled={loading}>
          Hủy
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !formData.title || !formData.programMode || !formData.programType}
          sx={{ minWidth: 120 }}
        >
          {loading ? 'Đang cập nhật...' : 'Cập nhật'}
        </Button>
      </DialogActions>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setNotification(prev => ({ ...prev, open: false }))}
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default TrainingProgramUpdateDialog;
