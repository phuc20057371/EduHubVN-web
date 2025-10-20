import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Box, Typography, TextField, InputAdornment, CircularProgress } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { API } from "../../utils/Fetch";
import { getAcademicRank } from "../../utils/ChangeText";
import type { LecturerBasicPublic } from "../../types/Lecturer";
import LecturerDetailPublicDialog from "../../components/guest-dialog/LecturerDetailPublicDialog";

const GuestLecturerPage = () => {
  const [lecturers, setLecturers] = useState<LecturerBasicPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLecturer, setSelectedLecturer] = useState<LecturerBasicPublic | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
    
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await API.public.getAllPublicLecturers();
        
        if (response.data.success) {
          console.log("✅ Fetched all public lecturers:", response.data.data);
          setLecturers(response.data.data || []);
        } else {
          console.error("❌ Failed to fetch public lecturers");
          setError("Không thể tải danh sách giảng viên");
        }
      } catch (err: any) {
        console.error("❌ Error fetching lecturers:", err);
        setError("Đã xảy ra lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filter lecturers based on search query
  const filteredLecturers = useMemo(() => {
    if (!searchQuery.trim()) return lecturers;
    
    const query = searchQuery.toLowerCase();
    return lecturers.filter((lecturer) => 
      lecturer.fullName.toString().toLowerCase().includes(query) ||
      lecturer.specialization?.toString().toLowerCase().includes(query) ||
      lecturer.jobField?.toString().toLowerCase().includes(query) ||
      lecturer.academicRank?.toString().toLowerCase().includes(query)
    );
  }, [lecturers, searchQuery]);

  const handleLecturerClick = (lecturer: LecturerBasicPublic) => {
    setSelectedLecturer(lecturer);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedLecturer(null);
  };

  const LecturerCard = ({ lecturer }: { lecturer: LecturerBasicPublic }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <Box
          sx={{
            width: "100%",
            height: "400px",
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
            position: "relative",
            cursor: "pointer",
            transition: "transform 0.3s ease",
            backgroundColor: "white",
            "&:hover": {
              transform: "scale(1.05)",
            },
          }}
          onClick={() => handleLecturerClick(lecturer)}
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
                {getAcademicRank(lecturer.academicRank.toString())}. {lecturer.fullName}
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
                {lecturer.experienceYears.toString()} Năm Kinh Nghiệm
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
                      const rating = Number(lecturer.rating) || 0;
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
    );
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress size={50} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Vui lòng thử lại sau
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Box sx={{ maxWidth: "1400px", mx: "auto", px: 3 }}>
        {/* Compact Header with Search */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "stretch", md: "center" },
            justifyContent: "space-between",
            gap: 3,
            mb: 4,
          }}
        >
          {/* Title and Count */}
          <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
            <Typography
              variant="h4"
              sx={{
                color: "text.primary",
                fontWeight: "bold",
                mb: 1,
              }}
            >
              Tất cả Giảng Viên
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
              }}
            >
              {searchQuery 
                ? `Tìm thấy ${filteredLecturers.length} giảng viên` 
                : `Hiển thị ${lecturers.length} giảng viên`}
            </Typography>
          </Box>

          {/* Search */}
          <Box sx={{ maxWidth: { xs: "100%", md: "800px" }, minWidth: "300px" }}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Tìm kiếm giảng viên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: "20px",
                  "& fieldset": {
                    borderRadius: "20px",
                  },
                },
              }}
            />
          </Box>
        </Box>

        {/* Lecturers Grid */}
        {filteredLecturers.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {searchQuery ? "Không tìm thấy giảng viên phù hợp" : "Chưa có giảng viên nào"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchQuery ? "Thử tìm kiếm với từ khóa khác" : "Vui lòng quay lại sau"}
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: 4,
            }}
          >
            {filteredLecturers.map((lecturer) => (
              <LecturerCard key={lecturer.id.toString()} lecturer={lecturer} />
            ))}
          </Box>
        )}
      </Box>

      {/* Lecturer Detail Dialog */}
      <LecturerDetailPublicDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        lecturer={selectedLecturer}
      />
    </Box>
  );
};

export default GuestLecturerPage;
