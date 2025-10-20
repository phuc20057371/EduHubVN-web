import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import { useColors } from "../hooks/useColors";

interface LecturerCard {
  id: string;
  fullName: string;
  specialization: string;
  avatarUrl: string;
  academicRank: string;
  experienceYears: number;
  jobField: string; 
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

  const colors = useColors();
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
          Top Giảng Viên
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
                    backgroundImage: `url(${lecturer.avatarUrl || "https://via.placeholder.com/380x450"})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    "&:hover": {
                      transform: "scale(1.2)",
                    },
                  }}
                >
                  {/* Dark overlay for better text readability */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background:
                        "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)",
                      borderRadius: 2,
                    }}
                  />

                  {/* Experience Banner - Left side at 3/4 position */}
                  <Box
                    sx={{
                      position: "absolute",
                      left: -18,
                      top: "75%",
                      transform: "translateY(-50%)",
                      background: colors.primary.main,
                      color: "white",
                      px: 2.5,
                      py: 1.2,
                      borderRadius: "25px",
                      fontSize: "13px",
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
                      zIndex: 2,
                    }}
                  >
                    {lecturer.experienceYears}+ Năm Kinh Nghiệm
                  </Box>

                  {/* Lecturer Info - Bottom */}
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,

                      borderRadius: "0 0 12px 12px",
                      p: 1,
                      textAlign: "flex-start",

                      zIndex: 2,
                    }}
                  >
                    <Typography
                      //   variant=""
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                        mb: 1,
                        fontSize: "16px",
                      }}
                    >
                      {lecturer.academicRank}. {lecturer.fullName}
                    </Typography>
                    <Typography
                      //   variant=""
                      sx={{
                        color: "white",
                        // fontWeight: "bold",
                        mb: 1,
                        fontSize: "16px",
                      }}
                    >
                      {lecturer.specialization}
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            ))}
          </Box>

          {/* Navigation Controls */}
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
        </Box>
      </Box>
    </Box>
  );
};

export default LecturerCarousel;
