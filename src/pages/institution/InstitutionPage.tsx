import { useEffect, useState } from "react";
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
  Card,
  CardContent,
  Collapse,
  Stack,
} from "@mui/material";
import {
  Search,
  Clear,
  Person,
  Assignment,
  TrendingUp,
  Notifications,
  ExpandMore,
  ExpandLess,
  Add,
  HandshakeOutlined,
  FindInPage,
} from "@mui/icons-material";
import { API } from "../../utils/Fetch";
import { setLecturers } from "../../redux/slice/LecturerSlice";
import { useDispatch, useSelector } from "react-redux";
import * as React from "react";

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

const InstitutionPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAcademicRank, setSelectedAcademicRank] = useState("");
  const [showLecturerSearch, setShowLecturerSearch] = useState(false);

  const dispatch = useDispatch();
  const lecturers = useSelector(
    (state: any) => (state.lecturer as Lecturer[]) || [],
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.institution.getLecturers();
        dispatch(setLecturers(response.data.data));
        console.log(response.data.data);
      } catch (error) {
        console.error("Error fetching lecturers:", error);
      }
    };

    fetchData();
  }, [dispatch]);

  const academicRanks = [
    { value: "", label: "Tất cả học vị" },
    { value: "CN", label: "Cử nhân" },
    { value: "ThS", label: "Thạc sĩ" },
    { value: "TS", label: "Tiến sĩ" },
    { value: "PGS", label: "Phó Giáo sư" },
    { value: "GS", label: "Giáo sư" },
  ];

  // Calculate statistics
  const approvedLecturers = lecturers.filter(
    (lecturer: Lecturer) => lecturer.status === "APPROVED",
  );

  // Filtered search results
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim() && !selectedAcademicRank) {
      return [];
    }

    let filtered = approvedLecturers;

    if (searchQuery.trim()) {
      const searchTerm = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (lecturer: Lecturer) =>
          lecturer.id?.toString().includes(searchQuery) ||
          lecturer.fullName?.toLowerCase().includes(searchTerm) ||
          lecturer.specialization?.toLowerCase().includes(searchTerm) ||
          lecturer.jobField?.toLowerCase().includes(searchTerm) ||
          lecturer.phoneNumber?.includes(searchQuery) ||
          lecturer.email?.toLowerCase().includes(searchTerm),
      );
    }

    if (selectedAcademicRank) {
      filtered = filtered.filter(
        (lecturer: Lecturer) => lecturer.academicRank === selectedAcademicRank,
      );
    }

    return filtered;
  }, [approvedLecturers, searchQuery, selectedAcademicRank]);

  const handleClearSearch = () => {
    setSearchQuery("");
    setSelectedAcademicRank("");
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
        return rank || "***";
    }
  };

  // Mock data for projects and contracts
  const stats = [
    {
      title: "Đề tài đang thực hiện",
      value: 12,
      icon: <Assignment />,
      color: "primary",
    },
    {
      title: "Hợp đồng hoạt động",
      value: 8,
      icon: <HandshakeOutlined />,
      color: "success",
    },
    {
      title: "Giảng viên hợp tác",
      value: approvedLecturers.length,
      icon: <Person />,
      color: "info",
    },
    {
      title: "Dự án hoàn thành",
      value: 24,
      icon: <TrendingUp />,
      color: "warning",
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Quản lý Đề tài & Hợp đồng
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Quản lý đề tài, hợp đồng và tìm kiếm giảng viên phù hợp
          </Typography>
        </Box>

        {/* Statistics Cards */}
        <Box sx={{ display: "flex", gap: 3, mb: 4, flexWrap: "wrap" }}>
          {stats.map((stat, index) => (
            <Card key={index} sx={{ minWidth: 250, flex: 1 }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography
                      variant="h4"
                      component="div"
                      color={`${stat.color}.main`}
                    >
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Box>
                  <Box sx={{ color: `${stat.color}.main` }}>{stat.icon}</Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Main Actions */}
        <Box sx={{ display: "flex", gap: 3, mb: 4, flexWrap: "wrap" }}>
          {/* Project Management */}
          <Card sx={{ flex: 1, minWidth: 300 }}>
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
              >
                <Assignment color="primary" />
                <Typography variant="h6">Quản lý Đề tài</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Tạo mới, theo dõi tiến độ và quản lý các đề tài nghiên cứu
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button variant="contained" size="small" startIcon={<Add />}>
                  Tạo đề tài mới
                </Button>
                <Button variant="outlined" size="small">
                  Xem tất cả
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {/* Contract Management */}
          <Card sx={{ flex: 1, minWidth: 300 }}>
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
              >
                <HandshakeOutlined color="success" />
                <Typography variant="h6">Quản lý Hợp đồng</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Quản lý hợp đồng với giảng viên và theo dõi trạng thái
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  size="small"
                  color="success"
                  startIcon={<Add />}
                >
                  Tạo hợp đồng
                </Button>
                <Button variant="outlined" size="small">
                  Xem danh sách
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Box>

        {/* Recent Projects */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Đề tài gần đây
          </Typography>
          <List>
            <ListItem sx={{ px: 0 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Box>
                  <Typography variant="subtitle1">
                    Nghiên cứu ứng dụng AI trong giáo dục
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Trạng thái: Đang thực hiện • Tiến độ: 65% • Giảng viên: TS.
                    Nguyễn Văn A
                  </Typography>
                </Box>
                <Chip label="Đang thực hiện" color="primary" size="small" />
              </Box>
            </ListItem>
            <Divider />
            <ListItem sx={{ px: 0 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Box>
                  <Typography variant="subtitle1">
                    Phát triển hệ thống quản lý học tập
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Trạng thái: Chuẩn bị • Tiến độ: 20% • Giảng viên: ThS. Trần
                    Thị B
                  </Typography>
                </Box>
                <Chip label="Chuẩn bị" color="warning" size="small" />
              </Box>
            </ListItem>
            <Divider />
            <ListItem sx={{ px: 0 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Box>
                  <Typography variant="subtitle1">
                    Nghiên cứu blockchain trong tài chính
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Trạng thái: Hoàn thành • Tiến độ: 100% • Giảng viên: PGS. Lê
                    Văn C
                  </Typography>
                </Box>
                <Chip label="Hoàn thành" color="success" size="small" />
              </Box>
            </ListItem>
          </List>
        </Paper>

        {/* Notifications */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Notifications color="primary" />
            <Typography variant="h6">Thông báo quan trọng</Typography>
          </Box>
          <List>
            <ListItem>
              <Typography variant="body2">
                • Hợp đồng với TS. Nguyễn Văn A sẽ hết hạn vào ngày 30/03/2024
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body2">
                • Đề tài "Nghiên cứu AI trong giáo dục" cần báo cáo tiến độ
                tháng 3
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body2">
                • Có 3 giảng viên mới đăng ký hợp tác trong tuần này
              </Typography>
            </ListItem>
          </List>
        </Paper>

        {/* Lecturer Search Section */}
        <Paper sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <FindInPage color="primary" />
              <Typography variant="h6">Tìm kiếm Giảng viên</Typography>
            </Box>
            <Button
              variant="outlined"
              onClick={() => setShowLecturerSearch(!showLecturerSearch)}
              endIcon={showLecturerSearch ? <ExpandLess /> : <ExpandMore />}
            >
              {showLecturerSearch ? "Ẩn tìm kiếm" : "Tìm kiếm giảng viên"}
            </Button>
          </Box>

          <Collapse in={showLecturerSearch}>
            <Box sx={{ mb: 3 }}>
              {/* Search Bar */}
              <Box
                sx={{ display: "flex", gap: 2, alignItems: "center", mb: 3 }}
              >
                <TextField
                  fullWidth
                  placeholder="Tìm kiếm giảng viên theo tên, chuyên môn, email, số điện thoại..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                    endAdornment: (searchQuery || selectedAcademicRank) && (
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
              </Box>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Kết quả tìm kiếm ({searchResults.length} giảng viên)
                  </Typography>
                  <Box sx={{ maxHeight: 300, overflowY: "auto" }}>
                    <List>
                      {searchResults.map((lecturer, index) => (
                        <Box key={lecturer.id}>
                          <ListItem sx={{ px: 0, alignItems: "flex-start" }}>
                            <Box
                              sx={{ display: "flex", width: "100%", gap: 2 }}
                            >
                              <Avatar
                                src={lecturer.avatarUrl || ""}
                                sx={{ width: 64, height: 64, mt: 1 }}
                              >
                                <Person />
                              </Avatar>
                              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    mb: 1,
                                  }}
                                >
                                  <Typography variant="body1" component="div">
                                    {lecturer.fullName || "***"}
                                  </Typography>
                                  <Chip
                                    label={getAcademicRankDisplay(
                                      lecturer.academicRank || "",
                                    )}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                  />
                                  {/* <Chip
                                    label={lecturer.status === "APPROVED" ? "Đã duyệt" : lecturer.status}
                                    size="small"
                                    color={lecturer.status === "APPROVED" ? "success" : "default"}
                                    variant="outlined"
                                  /> */}
                                </Box>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  <b>Chuyên ngành:</b>{" "}
                                  {lecturer.specialization || "***"}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  <b>Email:</b> {lecturer.email || "***"}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  <b>SĐT:</b> {lecturer.phoneNumber || "***"}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  <b>Kinh nghiệm:</b>{" "}
                                  {lecturer.experienceYears || "***"} năm trong
                                  lĩnh vực {lecturer.jobField || "***"}
                                </Typography>
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 1,
                                }}
                              >
                                <Button
                                  variant="contained"
                                  size="small"
                                  startIcon={<HandshakeOutlined />}
                                >
                                  Tạo hợp đồng
                                </Button>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() =>
                                    window.open(
                                      `/lecturer-info/${lecturer.id}`,
                                      "_blank",
                                    )
                                  }
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
                  </Box>
                </Box>
              )}

              {/* No Results */}
              {(searchQuery || selectedAcademicRank) &&
                searchResults.length === 0 && (
                  <Box sx={{ textAlign: "center", py: 3 }}>
                    <Person
                      sx={{ fontSize: 48, color: "text.secondary", mb: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Không tìm thấy giảng viên phù hợp
                    </Typography>
                  </Box>
                )}

              {/* Empty State */}
              {!searchQuery && !selectedAcademicRank && (
                <Box sx={{ textAlign: "center", py: 3 }}>
                  <Search
                    sx={{ fontSize: 48, color: "text.secondary", mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Nhập từ khóa hoặc chọn học vị để tìm kiếm giảng viên phù hợp
                    cho đề tài
                  </Typography>
                </Box>
              )}
            </Box>
          </Collapse>

          {/* Quick Stats for Lecturers */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Box
              sx={{
                textAlign: "center",
                p: 2,
                bgcolor: "primary.50",
                borderRadius: 1,
                minWidth: 150,
              }}
            >
              <Typography variant="h5" color="primary.main">
                {approvedLecturers.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Giảng viên khả dụng
              </Typography>
            </Box>
            <Box
              sx={{
                textAlign: "center",
                p: 2,
                bgcolor: "success.50",
                borderRadius: 1,
                minWidth: 150,
              }}
            >
              <Typography variant="h5" color="success.main">
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
                textAlign: "center",
                p: 2,
                bgcolor: "info.50",
                borderRadius: 1,
                minWidth: 150,
              }}
            >
              <Typography variant="h5" color="info.main">
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
        </Paper>
      </Box>
    </Container>
  );
};

export default InstitutionPage;
