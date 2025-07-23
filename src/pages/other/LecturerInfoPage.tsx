import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API } from "../../utils/Fetch";
import { Box, Typography, Paper, CircularProgress, Alert } from "@mui/material";

const LecturerInfoPage = () => {
  const { id } = useParams<{ id: string }>();
  const [lecturerData, setLecturerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLecturerData = async () => {
      if (!id) {
        setError("ID không hợp lệ");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const lecturerId = parseInt(id);
        console.log("Lecturer ID từ URL:", lecturerId);
        
        const response = await API.other.getLecturerProfile(lecturerId);
        console.log("Kết quả API:", response.data);
        
        setLecturerData(response.data.data);
        setError(null);
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        setError("Không thể tải thông tin giảng viên");
      } finally {
        setLoading(false);
      }
    };

    fetchLecturerData();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Thông tin Giảng viên (ID: {id})
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
        <Typography variant="h6" gutterBottom color="primary">
          Dữ liệu từ API:
        </Typography>
        <Box component="pre" sx={{ 
          backgroundColor: '#f5f5f5', 
          p: 2, 
          borderRadius: 1,
          overflow: 'auto',
          fontSize: '0.875rem'
        }}>
          {JSON.stringify(lecturerData, null, 2)}
        </Box>
      </Paper>
    </Box>
  );
};

export default LecturerInfoPage;
