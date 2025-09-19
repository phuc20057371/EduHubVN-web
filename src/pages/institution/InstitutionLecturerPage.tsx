
import {
  Clear,
  Close,
  ExpandLess,
  ExpandMore,
  FilterList,
  FindInPage,
  HandshakeOutlined,
  Person,
  Search,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Collapse,
  Container,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import * as React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLecturers } from "../../redux/slice/LecturerSlice";
import { getAcademicRank } from "../../utils/ChangeText";
import { API } from "../../utils/Fetch";

// Define the Lecturer type
interface Lecturer {
  id: number;
  fullName: string | null;
  email: string | null;
  phoneNumber: string | null;
  academicRank: string | null;
  specialization: string | null;
  experienceYears: number | null;
  avatarUrl: string | null;
  jobField: string | null;
  status: string;
}

const InstitutionLecturerPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAcademicRank, setSelectedAcademicRank] = useState("");
  const [minExperienceYears, setMinExperienceYears] = useState("");
  const [showSearchForm, setShowSearchForm] = useState(true);

  const dispatch = useDispatch();
  const lecturers = useSelector(
    (state: any) => (state.lecturer as Lecturer[]) || [],
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.institution.getLecturers();
        dispatch(setLecturers(response.data.data));
      } catch (error) {
        console.error("Error fetching lecturers:", error);
      }
    };

    fetchData();
  }, [dispatch]);

  const academicRanks = [
    { value: "", label: "Tất cả học vị" },
    { value: "CN", label: "Cử nhân" },
    { value: "KS", label: "Kỹ sư" },
    { value: "THS", label: "Thạc sĩ" },
    { value: "TS", label: "Tiến sĩ" },
    { value: "PGS", label: "Phó Giáo sư" },
    { value: "GS", label: "Giáo sư" },
  ];

  const experienceYearsOptions = [
    { value: "", label: "Tất cả kinh nghiệm" },
    { value: "1", label: "≥ 1 năm" },
    { value: "3", label: "≥ 3 năm" },
    { value: "5", label: "≥ 5 năm" },
    { value: "10", label: "≥ 10 năm" },
    { value: "15", label: "≥ 15 năm" },
    { value: "20", label: "≥ 20 năm" },
  ];

  // Calculate statistics
  const approvedLecturers = lecturers.filter(
    (lecturer: Lecturer) => lecturer.status === "APPROVED",
  );

  // Filtered search results
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim() && !selectedAcademicRank && !minExperienceYears) {
      return approvedLecturers; // Show all approved lecturers by default
    }

    let filtered = approvedLecturers;

    if (searchQuery.trim()) {
      const searchTerm = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (lecturer: Lecturer) =>
          lecturer.fullName?.toLowerCase().includes(searchTerm) ||
          lecturer.specialization?.toLowerCase().includes(searchTerm) ||
          lecturer.jobField?.toLowerCase().includes(searchTerm),
      );
    }

    if (selectedAcademicRank) {
      filtered = filtered.filter(
        (lecturer: Lecturer) => lecturer.academicRank === selectedAcademicRank,
      );
    }

    if (minExperienceYears) {
      const minYears = parseInt(minExperienceYears);
      filtered = filtered.filter(
        (lecturer: Lecturer) => (lecturer.experienceYears || 0) >= minYears,
      );
    }

    return filtered;
  }, [approvedLecturers, searchQuery, selectedAcademicRank, minExperienceYears]);

  const handleClearSearch = () => {
    setSearchQuery("");
    setSelectedAcademicRank("");
    setMinExperienceYears("");
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        {/* Header with Stats */}
        <Box sx={{ 
          mb: 5, 
          p: 4,
          bgcolor: "#f8fafc",
          borderRadius: 1,
          border: "1px solid #e2e8f0"
        }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, color: "#1e293b" }}>
            Quản lý Giảng viên
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: "1.1rem", mb: 4 }}>
            Tìm kiếm và quản lý giảng viên hợp tác cho các đề tài nghiên cứu
          </Typography>

          {/* Quick Stats trong banner */}
          <Box sx={{ 
            display: "flex", 
            gap: 3, 
            flexWrap: "wrap"
          }}>
            <Box
              sx={{
                p: 2.5,
                textAlign: "center",
                minWidth: 160,
                borderRadius: 2,
                bgcolor: "white",
                border: "1px solid #e2e8f0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 700, color: "#3b82f6", mb: 0.5 }}>
                {approvedLecturers.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Giảng viên khả dụng
              </Typography>
            </Box>
            
            <Box
              sx={{
                p: 2.5,
                textAlign: "center",
                minWidth: 160,
                borderRadius: 2,
                bgcolor: "white",
                border: "1px solid #e2e8f0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 700, color: "#10b981", mb: 0.5 }}>
                {
                  approvedLecturers.filter(
                    (l) =>
                      l.academicRank === "TS" ||
                      l.academicRank === "PGS" ||
                      l.academicRank === "GS",
                  ).length
                }
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tiến sĩ trở lên
              </Typography>
            </Box>
            
            <Box
              sx={{
                p: 2.5,
                textAlign: "center",
                minWidth: 160,
                borderRadius: 2,
                bgcolor: "white",
                border: "1px solid #e2e8f0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 700, color: "#f59e0b", mb: 0.5 }}>
                {Math.round(
                  approvedLecturers.reduce(
                    (sum, l) => sum + (l.experienceYears || 0),
                    0,
                  ) / approvedLecturers.length,
                ) || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Kinh nghiệm TB (năm)
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Search Section */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            borderRadius: 1,
            background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
            border: "1px solid #e9ecef"
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Box sx={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "space-between", 
              mb: 2 
            }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 1,
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                  }}
                >
                  <FindInPage />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Tìm kiếm Giảng viên
                </Typography>
              </Box>
              
              <Button
                variant="outlined"
                onClick={() => setShowSearchForm(!showSearchForm)}
                endIcon={showSearchForm ? <ExpandLess /> : <ExpandMore />}
                sx={{ borderRadius: 2 }}
              >
                {showSearchForm ? "Thu gọn" : "Mở rộng"}
              </Button>
            </Box>
            
            <Collapse in={showSearchForm}>
              {/* Search Controls */}
              <Box sx={{ 
                display: "flex", 
                gap: 3, 
                alignItems: "flex-end", 
                mb: 4,
                flexWrap: "wrap"
              }}>
              <Box sx={{ flex: 1, minWidth: 300 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Tìm kiếm theo tên, chuyên ngành, lĩnh vực..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1,
                      backgroundColor: "white",
                      "& fieldset": {
                        borderColor: "#e0e0e0",
                      },
                      "&:hover fieldset": {
                        borderColor: "#1976d2",
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (searchQuery || selectedAcademicRank || minExperienceYears) && (
                      <InputAdornment position="end">
                        <IconButton 
                          onClick={handleClearSearch} 
                          size="small"
                          sx={{ 
                            backgroundColor: "#f5f5f5",
                            "&:hover": { backgroundColor: "#e0e0e0" }
                          }}
                        >
                          <Clear fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Học vị</InputLabel>
                <Select
                  value={selectedAcademicRank}
                  onChange={(e) => setSelectedAcademicRank(e.target.value)}
                  label="Học vị"
                  sx={{
                    borderRadius: 1,
                    backgroundColor: "white",
                  }}
                >
                  {academicRanks.map((rank) => (
                    <MenuItem key={rank.value} value={rank.value}>
                      {rank.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Kinh nghiệm</InputLabel>
                <Select
                  value={minExperienceYears}
                  onChange={(e) => setMinExperienceYears(e.target.value)}
                  label="Kinh nghiệm"
                  sx={{
                    borderRadius: 1,
                    backgroundColor: "white",
                  }}
                >
                  {experienceYearsOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            {/* Active Filters Display */}
            {(searchQuery || selectedAcademicRank || minExperienceYears) && (
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <FilterList color="action" />
                  <Typography variant="subtitle2" color="text.secondary">
                    Bộ lọc đang áp dụng:
                  </Typography>
                  <Button
                    variant="text"
                    size="small"
                    onClick={handleClearSearch}
                    sx={{ 
                      color: "#ef4444",
                      "&:hover": { backgroundColor: "#fef2f2" },
                      textTransform: "none",
                      fontWeight: 500
                    }}
                  >
                    Xóa tất cả
                  </Button>
                </Box>
                
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {searchQuery && (
                    <Chip
                      label={`Tìm kiếm: "${searchQuery}"`}
                      onDelete={() => setSearchQuery("")}
                      deleteIcon={<Close />}
                      sx={{
                        backgroundColor: "#ede9fe",
                        color: "#6b46c1",
                        "& .MuiChip-deleteIcon": {
                          color: "#6b46c1",
                          "&:hover": { color: "#553c9a" }
                        }
                      }}
                    />
                  )}
                  
                  {selectedAcademicRank && (
                    <Chip
                      label={`Học vị: ${academicRanks.find(rank => rank.value === selectedAcademicRank)?.label}`}
                      onDelete={() => setSelectedAcademicRank("")}
                      deleteIcon={<Close />}
                      sx={{
                        backgroundColor: "#dbeafe",
                        color: "#1d4ed8",
                        "& .MuiChip-deleteIcon": {
                          color: "#1d4ed8",
                          "&:hover": { color: "#1e3a8a" }
                        }
                      }}
                    />
                  )}
                  
                  {minExperienceYears && (
                    <Chip
                      label={`Kinh nghiệm: ${experienceYearsOptions.find(option => option.value === minExperienceYears)?.label}`}
                      onDelete={() => setMinExperienceYears("")}
                      deleteIcon={<Close />}
                      sx={{
                        backgroundColor: "#d1fae5",
                        color: "#059669",
                        "& .MuiChip-deleteIcon": {
                          color: "#059669",
                          "&:hover": { color: "#047857" }
                        }
                      }}
                    />
                  )}
                </Box>
              </Box>
            )}
            
            {/* Results Section */}
            {searchResults.length > 0 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  {searchQuery || selectedAcademicRank || minExperienceYears
                    ? `Kết quả tìm kiếm (${searchResults.length} giảng viên)`
                    : `Danh sách giảng viên (${searchResults.length} giảng viên)`
                  }
                </Typography>
              
              <Box sx={{ maxHeight: 700, overflowY: "auto" }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {searchResults.map((lecturer) => (
                    <Paper
                      key={lecturer.id}
                      elevation={2}
                      sx={{
                        p: 3,
                        borderRadius: 1,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: 4,
                        },
                      }}
                    >
                      <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
                        <Avatar
                          src={lecturer.avatarUrl || ""}
                          sx={{ 
                            width: 80, 
                            height: 80,
                            border: "3px solid #f0f0f0"
                          }}
                        >
                          <Person sx={{ fontSize: 40 }} />
                        </Avatar>
                        
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {lecturer.fullName || "***"}
                            </Typography>
                            <Chip
                              label={getAcademicRank(lecturer.academicRank || "")}
                              size="medium"
                              sx={{
                                fontWeight: 600,
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                color: "white",
                                borderRadius: 1,
                              }}
                            />
                          </Box>
                          
                          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            <Typography variant="body1" color="text.secondary">
                              <Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>
                                Chuyên ngành:
                              </Box>{" "}
                              {lecturer.specialization || "***"}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                              <Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>
                                Kinh nghiệm:
                              </Box>{" "}
                              {lecturer.experienceYears || "***"} năm trong lĩnh vực {lecturer.jobField || "***"}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                              <Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>
                                Email:
                              </Box>{" "}
                              {lecturer.email || "***"}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                              <Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>
                                SĐT:
                              </Box>{" "}
                              {lecturer.phoneNumber || "***"}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          <Button
                            variant="contained"
                            startIcon={<HandshakeOutlined />}
                            sx={{
                              borderRadius: 1,
                              px: 3,
                              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                              "&:hover": {
                                background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
                              },
                            }}
                          >
                            Tạo hợp đồng
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={() =>
                              window.open(`/lecturer-info/${lecturer.id}`, "_blank")
                            }
                            sx={{
                              borderRadius: 1,
                              px: 3,
                              borderColor: "#667eea",
                              color: "#667eea",
                              "&:hover": {
                                borderColor: "#5a67d8",
                                backgroundColor: "#f8f9ff",
                              },
                            }}
                          >
                            Xem hồ sơ
                          </Button>
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              </Box>
            </Box>
          )}

          {/* No Results */}
          {(searchQuery || selectedAcademicRank || minExperienceYears) && searchResults.length === 0 && (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 1,
                  backgroundColor: "#f8f9fa",
                  display: "inline-block",
                  mb: 2,
                }}
              >
                <Person sx={{ fontSize: 64, color: "text.secondary" }} />
              </Box>
              <Typography variant="h6" color="text.secondary">
                Không tìm thấy giảng viên phù hợp
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Thử điều chỉnh từ khóa tìm kiếm, bộ lọc học vị hoặc năm kinh nghiệm
              </Typography>
            </Box>
          )}

          {/* Empty State */}
          {!searchQuery && !selectedAcademicRank && !minExperienceYears && searchResults.length === 0 && (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 1,
                  backgroundColor: "#f8f9fa",
                  display: "inline-block",
                  mb: 2,
                }}
              >
                <Search sx={{ fontSize: 64, color: "text.secondary" }} />
              </Box>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                Chưa có dữ liệu giảng viên
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Nhập từ khóa để tìm kiếm giảng viên theo tên, chuyên ngành hoặc lĩnh vực
              </Typography>
            </Box>
          )}
          </Collapse>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default InstitutionLecturerPage;