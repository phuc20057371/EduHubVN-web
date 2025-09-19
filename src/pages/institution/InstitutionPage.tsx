import {
  Assignment,
  HandshakeOutlined,
  Notifications,
  Person,
  TrendingUp,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  List,
  ListItem,
  Paper,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLecturers } from "../../redux/slice/LecturerSlice";
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

const InstitutionPage = () => {
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

  // Calculate statistics
  const approvedLecturers = lecturers.filter(
    (lecturer: Lecturer) => lecturer.status === "APPROVED",
  );

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
        {/* Main Management Sections */}
        <Box sx={{ display: "flex", gap: 3, mb: 4, flexWrap: "wrap" }}>
          {/* Lecturer Management */}
          <Card sx={{ flex: 1, minWidth: 300 }}>
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
              >
                <Person color="info" />
                <Typography variant="h6">Quản lý Giảng viên</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Tìm kiếm, quản lý và tạo hợp đồng với giảng viên hợp tác
              </Typography>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => window.location.href = '/institution/lecturers'}
              >
                Xem tất cả
              </Button>
            </CardContent>
          </Card>

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
                Theo dõi tiến độ và quản lý các đề tài nghiên cứu
              </Typography>
              <Button variant="outlined" size="small">
                Xem tất cả
              </Button>
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
              <Button variant="outlined" size="small">
                Xem tất cả
              </Button>
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
      </Box>
    </Container>
  );
};

export default InstitutionPage;
