
import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Paper,
  Avatar,
  Chip,
  Button,
  InputAdornment,
  IconButton,
  List,
  ListItem,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Search,
  Clear,
  Person,
  School,
  Work,
  Email,
  Phone,
  Star,
} from "@mui/icons-material";

const InstitutionPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAcademicRank, setSelectedAcademicRank] = useState("");

  const academicRanks = [
    { value: "", label: "Tất cả học vị" },
    { value: "CN", label: "Cử nhân" },
    { value: "ThS", label: "Thạc sĩ" },
    { value: "TS", label: "Tiến sĩ" },
    { value: "PGS", label: "Phó Giáo sư" },
    { value: "GS", label: "Giáo sư" },
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim() && !selectedAcademicRank) return;
    
    setIsLoading(true);
    try {
      // TODO: Gọi API tìm kiếm giảng viên ở đây
      // const response = await API.institution.searchLecturers({ 
      //   query: searchQuery,
      //   academicRank: selectedAcademicRank 
      // });
      // setSearchResults(response.data.data);
      
      // Mock data cho demo (sẽ xóa khi có API thật)
      setTimeout(() => {
        setSearchResults([
          {
            id: 1,
            fullName: "Nguyễn Văn A",
            email: "nguyenvana@email.com",
            phoneNumber: "0123456789",
            academicRank: "TS",
            specialization: "Khoa học máy tính",
            experienceYears: 5,
            avatarUrl: null,
            status: "APPROVED"
          },
          {
            id: 2,
            fullName: "Trần Thị B",
            email: "tranthib@email.com",
            phoneNumber: "0987654321",
            academicRank: "ThS",
            specialization: "Toán học",
            experienceYears: 8,
            avatarUrl: null,
            status: "APPROVED"
          },
          {
            id: 3,
            fullName: "Lê Văn C",
            email: "levanc@email.com",
            phoneNumber: "0555666777",
            academicRank: "PGS",
            specialization: "Vật lý",
            experienceYears: 12,
            avatarUrl: null,
            status: "APPROVED"
          },
          {
            id: 4,
            fullName: "Phạm Thị D",
            email: "phamthid@email.com",
            phoneNumber: "0333444555",
            academicRank: "GS",
            specialization: "Hóa học",
            experienceYears: 20,
            avatarUrl: null,
            status: "APPROVED"
          }
        ]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error searching lecturers:", error);
      setIsLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSelectedAcademicRank("");
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const getAcademicRankDisplay = (rank: string) => {
    switch (rank) {
      case "TS":
        return "Tiến sĩ";
      case "ThS":
        return "Thạc sĩ";
      case "CN":
        return "Cử nhân";
      case "PGS":
        return "Phó Giáo sư";
      case "GS":
        return "Giáo sư";
      default:
        return rank;
    }
  };

  const handleInviteLecturer = (lecturerId: number) => {
    // TODO: Gọi API gửi lời mời giảng viên ở đây
    console.log("Inviting lecturer with ID:", lecturerId);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 3 }}>
        {/* Header */}
        <Typography variant="h4" component="h1" gutterBottom>
          Tìm kiếm Giảng viên
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Tìm kiếm và mời các giảng viên phù hợp
        </Typography>

        {/* Search Bar */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <TextField
              fullWidth
              placeholder="Tìm kiếm giảng viên theo tên, chuyên môn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClearSearch} size="small">
                      <Clear />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel>Học vị</InputLabel>
              <Select
                value={selectedAcademicRank}
                onChange={(e) => setSelectedAcademicRank(e.target.value)}
                label="Học vị"
              >
                {academicRanks.map((rank) => (
                  <MenuItem key={rank.value} value={rank.value}>
                    {rank.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={(!searchQuery.trim() && !selectedAcademicRank) || isLoading}
              sx={{ minWidth: 120 }}
            >
              {isLoading ? "Đang tìm..." : "Tìm kiếm"}
            </Button>
          </Box>
        </Paper>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Kết quả tìm kiếm ({searchResults.length} giảng viên)
            </Typography>
            <List>
              {searchResults.map((lecturer, index) => (
                <Box key={lecturer.id}>
                  <ListItem sx={{ px: 0, alignItems: "flex-start" }}>
                    <Box sx={{ display: "flex", width: "100%", gap: 2 }}>
                      {/* Avatar */}
                      <Avatar
                        src={lecturer.avatarUrl}
                        sx={{ width: 56, height: 56, mt: 1 }}
                      >
                        <Person />
                      </Avatar>
                      
                      {/* Main Content */}
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        {/* Name and Academic Rank */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                          <Typography variant="h6" component="div">
                            {lecturer.fullName}
                          </Typography>
                          <Chip
                            label={getAcademicRankDisplay(lecturer.academicRank)}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </Box>
                        
                        {/* Details */}
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <School fontSize="small" color="action" />
                            Chuyên môn: {lecturer.specialization}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Work fontSize="small" color="action" />
                            Kinh nghiệm: {lecturer.experienceYears} năm
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Email fontSize="small" color="action" />
                            {lecturer.email}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Phone fontSize="small" color="action" />
                            {lecturer.phoneNumber}
                          </Typography>
                        </Box>
                      </Box>
                      
                      {/* Action Buttons */}
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, ml: 2 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleInviteLecturer(lecturer.id)}
                          startIcon={<Star />}
                        >
                          Gửi lời mời
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => console.log("View profile:", lecturer.id)}
                        >
                          Xem hồ sơ
                        </Button>
                      </Box>
                    </Box>
                  </ListItem>
                  {index < searchResults.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </Paper>
        )}

        {/* No Results */}
        {(searchQuery || selectedAcademicRank) && searchResults.length === 0 && !isLoading && (
          <Paper sx={{ p: 6, textAlign: "center" }}>
            <Person sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Không tìm thấy giảng viên
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Vui lòng thử lại với từ khóa hoặc học vị khác
            </Typography>
          </Paper>
        )}

        {/* Empty State */}
        {!searchQuery && !selectedAcademicRank && searchResults.length === 0 && (
          <Paper sx={{ p: 6, textAlign: "center" }}>
            <Search sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Tìm kiếm giảng viên
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Nhập từ khóa hoặc chọn học vị để tìm kiếm giảng viên phù hợp
            </Typography>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default InstitutionPage;