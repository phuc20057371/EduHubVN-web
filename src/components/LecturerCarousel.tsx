import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Box, IconButton, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface LecturerCard {
  id: string;
  fullName: string;
  specialization: string;
  avatarUrl: string;
  academicRank: string;
  experienceYears: number;
  jobField: string; 
  rating?: number; // Thêm rating cho giảng viên
}

interface LecturerCarouselProps {
  lecturers: LecturerCard[];
  loading?: boolean;
}

const LecturerCarousel: React.FC<LecturerCarouselProps> = ({
  lecturers,
  loading = false,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Calculate how many cards to show at once (max 5)
  const cardsToShow = Math.min(lecturers.length, 5);
  const maxSlides = Math.max(1, lecturers.length - cardsToShow + 1);

  // Calculate initial offset to center the 3rd card
  const initialOffset = -(2 * (100 / cardsToShow)); // Move 2 cards to the left to center the 3rd card

  // Auto-play functionality
  // useEffect(() => {
  //   if (!isAutoPlaying || lecturers.length <= cardsToShow) return;

  //   const interval = setInterval(() => {
  //     setCurrentSlide((prev) => (prev + 1) % maxSlides);
  //   }, 4000);

  //   return () => clearInterval(interval);
  // }, [isAutoPlaying, lecturers.length, cardsToShow, maxSlides]);

  const nextSlide = () => {
    if (currentSlide < -maxSlides + 1) {
      setCurrentSlide(0);
    } else {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > maxSlides - 1) {
      setCurrentSlide(maxSlides - 1);
    } else {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <Box
          sx={{
            width: 50,
            height: 50,
            border: "3px solid rgba(255,255,255,0.3)",
            borderTop: "3px solid white",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            "@keyframes spin": {
              "0%": { transform: "rotate(0deg)" },
              "100%": { transform: "rotate(360deg)" },
            },
          }}
        />
      </Box>
    );
  }

  // Empty state - when no lecturers available
  if (!loading && lecturers.length === 0) {
    return (
      <Box
        sx={{
          py: 8,
          textAlign: "center",
        }}
      >
        <Box sx={{ maxWidth: "1200px", mx: "auto", px: 3 }}>
          {/* Title */}
          <Typography
            variant="h3"
            sx={{
              textAlign: "center",
              color: "text.primary",
              fontWeight: "bold",
              mb: 4,
            }}
          >
            Giảng Viên tiêu biểu (0)
          </Typography>

          {/* Empty State Content */}
          <Box
            sx={{
              py: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
            }}
          >
            {/* Icon */}
            <Box sx={{ color: "text.secondary", opacity: 0.5 }}>
              <svg width="80" height="80" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </Box>

            {/* Message */}
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h5"
                sx={{
                  color: "text.primary",
                  fontWeight: "medium",
                  mb: 1,
                }}
              >
                Hiện tại chưa có giảng viên tiêu biểu nào
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  maxWidth: "400px",
                }}
              >
                Danh sách giảng viên tiêu biểu sẽ được cập nhật sớm nhất có thể
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        py: 8,
        position: "relative",
      }}
    >
      <Box sx={{ maxWidth: "1200px", mx: "auto", px: 3 }}>
        {/* Title */}
        <Typography
          variant="h3"
          sx={{
            textAlign: "center",
            color: "text.primary",
            fontWeight: "bold",
            mb: 6,
          }}
        >
          Giảng Viên tiêu biểu ({lecturers.length})
        </Typography>

        {/* Carousel Container */}
        <Box sx={{ position: "relative" }}>
          {/* Lecturer Cards */}
          <Box
            ref={carouselRef}
            sx={{
              display: "flex",
              gap: 10, // Increased gap even more for better spacing
              transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)", // Smoother transition
              transform: `translateX(${initialOffset + currentSlide * (150 / cardsToShow)}%)`,
              overflow: "visible",
              width: "100%",
              py: 3, // Increased vertical padding for hover effect
            }}
          >
            {lecturers.map((lecturer, index) => (
              <motion.div
                key={lecturer.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                style={{
                  minWidth: `${150 / cardsToShow}%`,
                  flexShrink: 0,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: "380px", // Increased width
                    height: "400px", // Increased height
                    borderRadius: 2,
                    overflow: "hidden",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                    position: "relative",
                    cursor: "pointer",
                    transition: "transform 0.3s ease",
                    backgroundColor: "white",
                    "&:hover": {
                      transform: "scale(1.2)",
                    },
                  }}
                >
                  {/* Image section - 3/4 of the card */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "75%", // 3/4 không gian cho hình ảnh
                      backgroundImage: `url(${lecturer.avatarUrl || "https://via.placeholder.com/380x300"})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      borderRadius: "12px 12px 0 0",
                    }}
                  >
                    {/* Dark overlay for better contrast */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background:
                          "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)",
                        borderRadius: "12px 12px 0 0",
                      }}
                    />
                  </Box>

                  {/* Lecturer Info - Bottom 1/4 with white background */}
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "25%", // 1/4 không gian
                      backgroundColor: "white",
                      borderRadius: "0 0 12px 12px",
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      zIndex: 2,
                    }}
                  >
                    <Box>
                      {/* Academic Rank và Full Name */}
                      <Typography
                        sx={{
                          color: "black",
                          fontWeight: "bold",
                          fontSize: "14px",
                          lineHeight: 1.2,
                          mb: 0.3,
                        }}
                      >
                        {lecturer.academicRank}. {lecturer.fullName}
                      </Typography>
                      
                      {/* Experience Years */}
                      <Typography
                        sx={{
                          color: "gray",
                          fontSize: "11px",
                          lineHeight: 1.2,
                          mb: 0.3,
                        }}
                      >
                        {lecturer.experienceYears} Năm Kinh Nghiệm
                      </Typography>
                      
                      {/* Job Field */}
                      <Typography
                        sx={{
                          color: "gray",
                          fontSize: "11px",
                          lineHeight: 1.2,
                        }}
                      >
                        {lecturer.jobField}
                      </Typography>
                    </Box>
                    
                    {/* Rating */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        mt: 0.5,
                      }}
                    >
                      {!lecturer.rating || lecturer.rating === 0 ? (
                        // Hiển thị "Chưa có đánh giá" khi không có rating
                        <Typography
                          sx={{
                            color: "gray",
                            fontSize: "12px",
                            fontStyle: "italic",
                          }}
                        >
                          Chưa có đánh giá
                        </Typography>
                      ) : (
                        <>
                          <Typography
                            sx={{
                              color: "orange",
                              fontSize: "12px",
                              fontWeight: "bold",
                              minWidth: "28px",
                            }}
                          >
                            {lecturer.rating.toFixed(2)}
                          </Typography>
                          
                          {/* 5 Stars Rating Display */}
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.1 }}>
                            {[1, 2, 3, 4, 5].map((star) => {
                              const rating = lecturer.rating || 0;
                              let fillPercentage = 0;
                              
                              if (rating >= star) {
                                // Ngôi sao được tô đầy hoàn toàn
                                fillPercentage = 100;
                              } else if (rating > star - 1) {
                                // Ngôi sao được tô một phần dựa trên phần thập phân
                                fillPercentage = (rating - (star - 1)) * 100;
                              }
                              
                              return (
                                <Box
                                  key={star}
                                  sx={{
                                    position: "relative",
                                    fontSize: "12px",
                                    lineHeight: 1,
                                  }}
                                >
                                  {/* Background star (gray) */}
                                  <Typography
                                    sx={{
                                      color: "#e0e0e0",
                                      fontSize: "12px",
                                      lineHeight: 1,
                                    }}
                                  >
                                    ★
                                  </Typography>
                                  
                                  {/* Filled star overlay */}
                                  {fillPercentage > 0 && (
                                    <Typography
                                      sx={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        color: "#ffa726",
                                        fontSize: "12px",
                                        lineHeight: 1,
                                        overflow: "hidden",
                                        width: `${fillPercentage}%`,
                                      }}
                                    >
                                      ★
                                    </Typography>
                                  )}
                                </Box>
                              );
                            })}
                          </Box>
                        </>
                      )}
                    </Box>
                  </Box>
                </Box>
              </motion.div>
            ))}
          </Box>

          {/* Navigation Controls - Only show when there are lecturers and navigation is needed */}
          {lecturers.length > cardsToShow && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mt: 4,
                gap: 2,
              }}
            >
              {/* Previous Button */}
              <IconButton
                onClick={prevSlide}
                sx={{
                  background: "rgba(0,0,0,0.1)",
                  color: "text.primary",
                  "&:hover": {
                    background: "rgba(0,0,0,0.2)",
                    transform: "scale(1.1)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <ChevronLeft />
              </IconButton>

              {/* Dots Indicator */}
              <Box sx={{ display: "flex", gap: 1 }}>
                {Array.from({ length: maxSlides }, (_, index) => (
                  <Box
                    key={index}
                    onClick={() => goToSlide(index)}
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background:
                        index === currentSlide ? "black" : "rgba(0,0,0,0.3)",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        background: "primary.main",
                        transform: "scale(1.2)",
                      },
                    }}
                  />
                ))}
              </Box>

              {/* Next Button */}
              <IconButton
                onClick={nextSlide}
                sx={{
                  background: "rgba(0,0,0,0.1)",
                  color: "text.primary",
                  "&:hover": {
                    background: "rgba(0,0,0,0.2)",
                    transform: "scale(1.1)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <ChevronRight />
              </IconButton>
            </Box>
          )}

          {/* View All Button - Only show when there are lecturers */}
          {lecturers.length > 0 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 4,
              }}
            >
              <Button
                onClick={() => navigate("/guest/lecturers")}
                variant="outlined"
                sx={{
                  borderRadius: "25px",
                  px: 4,
                  py: 1.5,
                  fontWeight: "bold",
                  borderColor: "#1976d2",
                  color: "#1976d2",
                  "&:hover": {
                    backgroundColor: "#1976d2",
                    color: "white",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Xem tất cả giảng viên
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default LecturerCarousel;
