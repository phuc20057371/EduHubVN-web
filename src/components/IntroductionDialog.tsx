import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useColors } from '../hooks/useColors';
import i1 from '../assets/i1.png';
import i2 from '../assets/i2.png';
import i3 from '../assets/i3.png';
import i4 from '../assets/i4.png';
import i5 from '../assets/i5.png';
import i6 from '../assets/i6.png';
import i7 from '../assets/i7.png';
import i8 from '../assets/i8.png';
import i9 from '../assets/i9.png';

interface IntroductionDialogProps {
  open: boolean;
  onClose: () => void;
}

const IntroductionDialog: React.FC<IntroductionDialogProps> = ({ open, onClose }) => {
  const colors = useColors();
  const [currentPage, setCurrentPage] = useState(0);
  const [imageError, setImageError] = useState<{ [key: number]: boolean }>({});
  const [showFullscreenImage, setShowFullscreenImage] = useState(false);

  // Array of imported images
  const images = [i1, i2, i3, i4, i5, i6, i7, i8, i9];

  // 9 sections như các trang sách (ẩn trang 10 tạm thời)
  const sections = [
    { title: '', subtitle: 'Giới thiệu tổng quan' },
    { title: '', subtitle: 'Sứ mệnh của chúng tôi' },
    { title: '', subtitle: 'Tầm nhìn tương lai' },
    { title: '', subtitle: 'Đội ngũ chuyên gia' },
    { title: '', subtitle: 'Khóa học đa dạng' },
    { title: '', subtitle: 'Công nghệ tiên tiến' },
    { title: '', subtitle: 'Cộng đồng học tập' },
    { title: '', subtitle: 'Thành tựu nổi bật' },
    { title: '', subtitle: 'Đối tác uy tín' },
  ];

  const handleNext = () => {
    if (currentPage < sections.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleBack = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleImageError = (pageIndex: number) => {
    setImageError(prev => ({ ...prev, [pageIndex]: true }));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      fullScreen
      sx={{
        '& .MuiDialog-paper': {
          margin: 0,
          maxHeight: '100vh',
          borderRadius: 0,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2, // Reduced padding
          borderBottom: `1px solid ${colors.border.light}`,
          backgroundColor: colors.background.secondary,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, color: colors.text.primary }}>
          EduHub - Kết nối Giáo dục - Kiến tạo Tương lai
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            color: colors.text.secondary,
            '&:hover': {
              backgroundColor: colors.background.primary,
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0, backgroundColor: colors.background.primary, height: '100vh', position: 'relative' }}>
        {/* Page Content - Full Screen */}
        <Box 
          sx={{ 
            height: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            position: 'relative',
            p: 4 // Added padding for content
          }}
        >
          {/* Tất cả các trang từ 1-9 hiển thị hình ảnh */}
          <Box sx={{ maxWidth: '1200px', width: '100%', textAlign: 'center' }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 800, 
                color: colors.text.primary, 
                textAlign: 'center',
                mb: 1,
                fontFamily: 'serif',
                fontSize: '2.2rem'
              }}
            >
              {sections[currentPage].title}
            </Typography>
            
            {/* Container cho hình ảnh */}
            <Box
              sx={{
                width: '100%',
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                cursor: 'pointer',
              }}
              onClick={() => setShowFullscreenImage(true)}
            >
              {/* Hiển thị hình ảnh hoặc placeholder */}
              {!imageError[currentPage] ? (
                <Box
                  component="img"
                  src={images[currentPage]}
                  alt={`Hình ảnh ${currentPage + 1}`}
                  onError={() => handleImageError(currentPage)}
                  sx={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    display: 'block',
                    borderRadius: 2,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.02)',
                    },
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: `linear-gradient(135deg, ${colors.primary.main}10, ${colors.secondary.main}10)`,
                    borderRadius: 3,
                    border: `2px solid ${colors.primary.main}`,
                  }}
                >
                  <Typography 
                    variant="h1" 
                    sx={{ 
                      color: colors.primary.main, 
                      fontWeight: 800,
                      mb: 4,
                      fontSize: '6rem'
                    }}
                  >
                    i{currentPage + 1}
                  </Typography>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      color: colors.text.primary,
                      fontWeight: 600,
                      fontSize: '2.5rem',
                      mb: 2
                    }}
                  >
                    {sections[currentPage].subtitle}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: colors.text.secondary,
                      fontSize: '1.5rem',
                      maxWidth: '800px',
                      textAlign: 'center',
                      lineHeight: 1.6
                    }}
                  >
                    Nội dung trang {currentPage + 1} - Sẵn sàng để thêm hình ảnh và nội dung chi tiết
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Overlay hình ảnh toàn màn hình */}
            {showFullscreenImage && (
              <Box
                sx={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100vw',
                  height: '100vh',
                  zIndex: 2000,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0, 0, 0, 0.95)',
                  backdropFilter: 'blur(10px)',
                }}
                onClick={() => setShowFullscreenImage(false)}
              >
                {/* Hình ảnh toàn màn hình */}
                {!imageError[currentPage] ? (
                  <Box
                    component="img"
                    src={images[currentPage]}
                    alt={`Hình ảnh ${currentPage + 1}`}
                    onClick={(e) => e.stopPropagation()}
                    sx={{
                      maxWidth: '95vw',
                      maxHeight: '95vh',
                      objectFit: 'contain',
                      display: 'block',
                      borderRadius: 2,
                      boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                    }}
                  />
                ) : (
                  <Box
                    onClick={(e) => e.stopPropagation()}
                    sx={{
                      width: '90vw',
                      height: '90vh',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: `linear-gradient(135deg, ${colors.primary.main}20, ${colors.secondary.main}20)`,
                      borderRadius: 3,
                      border: `2px solid ${colors.primary.main}`,
                    }}
                  >
                    <Typography 
                      variant="h1" 
                      sx={{ 
                        color: colors.primary.main, 
                        fontWeight: 800,
                        mb: 4,
                        fontSize: '8rem'
                      }}
                    >
                      i{currentPage + 1}
                    </Typography>
                    <Typography 
                      variant="h2" 
                      sx={{ 
                        color: colors.text.primary,
                        fontWeight: 600,
                        fontSize: '3rem',
                        mb: 2
                      }}
                    >
                      {sections[currentPage].subtitle}
                    </Typography>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        color: colors.text.secondary,
                        fontSize: '1.8rem',
                        maxWidth: '800px',
                        textAlign: 'center',
                        lineHeight: 1.6
                      }}
                    >
                      Nội dung trang {currentPage + 1} - Sẵn sàng để thêm hình ảnh và nội dung chi tiết
                    </Typography>
                  </Box>
                )}
                
                {/* Nút đóng hình ảnh */}
                <IconButton
                  onClick={() => setShowFullscreenImage(false)}
                  sx={{
                    position: 'absolute',
                    top: 20,
                    right: 20,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    width: 60,
                    height: 60,
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.9)',
                      transform: 'scale(1.1)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <CloseIcon sx={{ fontSize: 30 }} />
                </IconButton>
              </Box>
            )}
          </Box>
        </Box>

        {/* Navigation Buttons - Left and Right */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: 4,
            transform: 'translateY(-50%)',
            pointerEvents: 'none', // Allow clicks to pass through
          }}
        >
          {/* Previous Button - Left */}
          <IconButton
            onClick={handleBack}
            disabled={currentPage === 0}
            sx={{
              backgroundColor: currentPage === 0 ? 'rgba(0,0,0,0.1)' : colors.primary.main,
              color: currentPage === 0 ? colors.text.secondary : 'white',
              width: 60,
              height: 60,
              pointerEvents: 'auto', // Re-enable clicks for this element
              '&:hover': {
                backgroundColor: currentPage === 0 ? 'rgba(0,0,0,0.1)' : colors.primary.dark,
              },
              '&:disabled': {
                backgroundColor: 'rgba(0,0,0,0.1)',
                color: colors.text.secondary,
              },
              transition: 'all 0.3s ease',
            }}
          >
            <ArrowBackIosIcon sx={{ fontSize: 24 }} />
          </IconButton>

          {/* Next Button - Right */}
          <IconButton
            onClick={handleNext}
            disabled={currentPage === sections.length - 1}
            sx={{
              backgroundColor: currentPage === sections.length - 1 ? 'rgba(0,0,0,0.1)' : colors.primary.main,
              color: currentPage === sections.length - 1 ? colors.text.secondary : 'white',
              width: 60,
              height: 60,
              pointerEvents: 'auto', // Re-enable clicks for this element
              '&:hover': {
                backgroundColor: currentPage === sections.length - 1 ? 'rgba(0,0,0,0.1)' : colors.primary.dark,
              },
              '&:disabled': {
                backgroundColor: 'rgba(0,0,0,0.1)',
                color: colors.text.secondary,
              },
              transition: 'all 0.3s ease',
            }}
          >
            <ArrowForwardIosIcon sx={{ fontSize: 24 }} />
          </IconButton>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default IntroductionDialog;