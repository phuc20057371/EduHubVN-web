import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLecturerProfile } from "../../redux/slice/LecturerProfileSlice";
import { API } from "../../utils/Fetch";
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Chip,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Tab,
  Tabs,
  Alert
} from "@mui/material";
import {
  Person,
  School,
  WorkHistory,
  Science,
  Assignment,
  Edit,
  Phone,
  LocationOn,
  Cake,
  CalendarToday,
  Grade,
  Business,
  Link as LinkIcon
} from "@mui/icons-material";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const LecturerProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const lecturerProfile = useSelector((state: any) => state.lecturerProfile);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchLecturerProfile = async () => {
      try {
        const response = await API.lecturer.getLecturerProfile();
        dispatch(setLecturerProfile(response.data.data));
      } catch (error) {
        console.error("Error fetching lecturer profile:", error);
      }
    };

    fetchLecturerProfile();
  }, [dispatch]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'success';
      case 'PENDING': return 'warning';
      case 'REJECTED': return 'error';
      default: return 'default';
    }
  };

  const getAcademicRankDisplay = (rank: string) => {
    const ranks: { [key: string]: string } = {
      'TS': 'Tiến sĩ',
      'ThS': 'Thạc sĩ',
      'CN': 'Cử nhân',
      'KS': 'Kỹ sư',
      'PGS': 'Phó Giáo sư',
      'GS': 'Giáo sư'
    };
    return ranks[rank] || rank;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (!lecturerProfile?.lecturer) {
    return (
      <Container>
        <Typography>Đang tải thông tin...</Typography>
      </Container>
    );
  }

  const { lecturer, lecturerUpdate, degrees, certificates, ownedTrainingCourses, attendedTrainingCourses, researchProjects } = lecturerProfile;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Profile */}
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Box display="flex" gap={3} alignItems="center" flexWrap="wrap">
          <Avatar
            src={lecturer.avatarUrl}
            sx={{ width: 120, height: 120 }}
          >
            {lecturer.fullName?.charAt(0)}
          </Avatar>
          
          <Box flexGrow={1}>
            <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
              <Typography variant="h4" gutterBottom>
                {lecturer.fullName}
              </Typography>
              {lecturerUpdate && lecturerUpdate.status === 'PENDING' && (
                <Chip 
                  label="Đang chờ duyệt cập nhật" 
                  color="warning" 
                  size="small"
                />
              )}
            </Box>
            
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {getAcademicRankDisplay(lecturer.academicRank)} - {lecturer.specialization}
            </Typography>
            
            <Box display="flex" gap={3} mb={2} flexWrap="wrap">
              <Box display="flex" alignItems="center" gap={1}>
                <Phone fontSize="small" />
                <Typography variant="body2">{lecturer.phoneNumber}</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <LocationOn fontSize="small" />
                <Typography variant="body2">{lecturer.address}</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Cake fontSize="small" />
                <Typography variant="body2">
                  Sinh ngày: {formatDate(lecturer.dateOfBirth)}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <WorkHistory fontSize="small" />
                <Typography variant="body2">
                  {lecturer.experienceYears} năm kinh nghiệm
                </Typography>
              </Box>
            </Box>
            
            <Button
              variant="outlined"
              startIcon={<Edit />}
              onClick={() => navigate('/lecturer/edit-profile')}
            >
              Chỉnh sửa hồ sơ
            </Button>
          </Box>
        </Box>
        
        {lecturer.bio && (
          <Box mt={3}>
            <Typography variant="h6" gutterBottom>Giới thiệu</Typography>
            <Typography variant="body1" color="text.secondary">
              {lecturer.bio}
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Tabs */}
      <Paper elevation={3}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="profile tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label={`Bằng cấp (${degrees?.length || 0})`} />
            <Tab label={`Chứng chỉ (${certificates?.length || 0})`} />
            <Tab label={`Khóa học tham gia (${attendedTrainingCourses?.length || 0})`} />
            <Tab label={`Khóa học tổ chức (${ownedTrainingCourses?.length || 0})`} />
            <Tab label={`Dự án nghiên cứu (${researchProjects?.length || 0})`} />
          </Tabs>
        </Box>

        {/* Degrees Tab */}
        <CustomTabPanel value={tabValue} index={0}>
          <Box display="flex" flexDirection="column" gap={3}>
            {degrees && degrees.length > 0 ? degrees.map((degree: any) => (
              <Card key={degree.id}>
                <CardHeader
                  avatar={<School color="primary" />}
                  title={degree.name}
                  subheader={degree.major}
                  action={
                    <Chip 
                      label={degree.status} 
                      color={getStatusColor(degree.status) as any}
                      size="small"
                    />
                  }
                />
                <CardContent>
                  <List dense>
                    <ListItem>
                      <ListItemIcon><Business fontSize="small" /></ListItemIcon>
                      <ListItemText primary="Trường" secondary={degree.institution} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CalendarToday fontSize="small" /></ListItemIcon>
                      <ListItemText 
                        primary="Thời gian" 
                        secondary={`${degree.startYear} - ${degree.graduationYear}`} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Grade fontSize="small" /></ListItemIcon>
                      <ListItemText primary="Bậc học" secondary={degree.level} />
                    </ListItem>
                    {degree.url && (
                      <ListItem>
                        <ListItemIcon><LinkIcon fontSize="small" /></ListItemIcon>
                        <ListItemText 
                          primary={<a href={degree.url} target="_blank" rel="noopener noreferrer">Xem bằng cấp</a>} 
                        />
                      </ListItem>
                    )}
                  </List>
                  {degree.description && (
                    <>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {degree.description}
                      </Typography>
                    </>
                  )}
                </CardContent>
              </Card>
            )) : (
              <Alert severity="info">Chưa có thông tin bằng cấp</Alert>
            )}
          </Box>
        </CustomTabPanel>

        {/* Certificates Tab */}
        <CustomTabPanel value={tabValue} index={1}>
          <Box display="flex" flexDirection="column" gap={3}>
            {certificates && certificates.length > 0 ? certificates.map((cert: any) => (
              <Card key={cert.id}>
                <CardHeader
                  avatar={<Assignment color="secondary" />}
                  title={cert.name}
                  subheader={cert.issuedBy}
                  action={
                    <Chip 
                      label={cert.status} 
                      color={getStatusColor(cert.status) as any}
                      size="small"
                    />
                  }
                />
                <CardContent>
                  <List dense>
                    <ListItem>
                      <ListItemIcon><CalendarToday fontSize="small" /></ListItemIcon>
                      <ListItemText 
                        primary="Ngày cấp" 
                        secondary={formatDate(cert.issueDate)} 
                      />
                    </ListItem>
                    {cert.expiryDate && (
                      <ListItem>
                        <ListItemIcon><CalendarToday fontSize="small" /></ListItemIcon>
                        <ListItemText 
                          primary="Ngày hết hạn" 
                          secondary={formatDate(cert.expiryDate)} 
                        />
                      </ListItem>
                    )}
                    <ListItem>
                      <ListItemIcon><Grade fontSize="small" /></ListItemIcon>
                      <ListItemText primary="Cấp độ" secondary={cert.level} />
                    </ListItem>
                    {cert.certificateUrl && (
                      <ListItem>
                        <ListItemIcon><LinkIcon fontSize="small" /></ListItemIcon>
                        <ListItemText 
                          primary={<a href={cert.certificateUrl} target="_blank" rel="noopener noreferrer">Xem chứng chỉ</a>} 
                        />
                      </ListItem>
                    )}
                  </List>
                  {cert.description && (
                    <>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {cert.description}
                      </Typography>
                    </>
                  )}
                </CardContent>
              </Card>
            )) : (
              <Alert severity="info">Chưa có thông tin chứng chỉ</Alert>
            )}
          </Box>
        </CustomTabPanel>

        {/* Attended Courses Tab */}
        <CustomTabPanel value={tabValue} index={2}>
          <Box display="flex" flexDirection="column" gap={3}>
            {attendedTrainingCourses && attendedTrainingCourses.length > 0 ? attendedTrainingCourses.map((course: any) => (
              <Card key={course.id}>
                <CardHeader
                  avatar={<School color="info" />}
                  title={course.title}
                  subheader={course.organizer}
                  action={
                    <Chip 
                      label={course.status} 
                      color={getStatusColor(course.status) as any}
                      size="small"
                    />
                  }
                />
                <CardContent>
                  <List dense>
                    <ListItem>
                      <ListItemText primary="Chủ đề" secondary={course.topic} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Loại khóa học" secondary={course.courseType} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Quy mô" secondary={course.scale} />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Thời gian" 
                        secondary={`${formatDate(course.startDate)} - ${formatDate(course.endDate)}`} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Số giờ học" secondary={`${course.numberOfHour} giờ`} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Địa điểm" secondary={course.location} />
                    </ListItem>
                  </List>
                  {course.description && (
                    <>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {course.description}
                      </Typography>
                    </>
                  )}
                </CardContent>
              </Card>
            )) : (
              <Alert severity="info">Chưa có thông tin khóa học đã tham gia</Alert>
            )}
          </Box>
        </CustomTabPanel>

        {/* Owned Courses Tab */}
        <CustomTabPanel value={tabValue} index={3}>
          <Box display="flex" flexDirection="column" gap={3}>
            {ownedTrainingCourses && ownedTrainingCourses.length > 0 ? ownedTrainingCourses.map((course: any) => (
              <Card key={course.id}>
                <CardHeader
                  avatar={<Person color="success" />}
                  title={course.title}
                  subheader={course.topic}
                  action={
                    <Chip 
                      label={course.status} 
                      color={getStatusColor(course.status) as any}
                      size="small"
                    />
                  }
                />
                <CardContent>
                  <List dense>
                    <ListItem>
                      <ListItemText primary="Loại khóa học" secondary={course.courseType} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Quy mô" secondary={course.scale} />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Thời gian" 
                        secondary={`${formatDate(course.startDate)} - ${formatDate(course.endDate)}`} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Số giờ" secondary={`${course.numberOfHour} giờ`} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Địa điểm" secondary={course.location} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Trạng thái khóa học" secondary={course.courseStatus} />
                    </ListItem>
                  </List>
                  {course.description && (
                    <>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {course.description}
                      </Typography>
                    </>
                  )}
                </CardContent>
              </Card>
            )) : (
              <Alert severity="info">Chưa có thông tin khóa học đã tổ chức</Alert>
            )}
          </Box>
        </CustomTabPanel>

        {/* Research Projects Tab */}
        <CustomTabPanel value={tabValue} index={4}>
          <Box display="flex" flexDirection="column" gap={3}>
            {researchProjects && researchProjects.length > 0 ? researchProjects.map((project: any) => (
              <Card key={project.id}>
                <CardHeader
                  avatar={<Science color="error" />}
                  title={project.title}
                  subheader={project.researchArea}
                  action={
                    <Chip 
                      label={project.status} 
                      color={getStatusColor(project.status) as any}
                      size="small"
                    />
                  }
                />
                <CardContent>
                  <List dense>
                    <ListItem>
                      <ListItemText primary="Quy mô" secondary={project.scale} />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Thời gian" 
                        secondary={`${formatDate(project.startDate)} - ${formatDate(project.endDate)}`} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Kinh phí" 
                        secondary={`${project.foundingAmount?.toLocaleString()} VND`} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Nguồn tài trợ" secondary={project.foundingSource} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Loại dự án" secondary={project.projectType} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Vai trò" secondary={project.roleInProject} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Trạng thái" secondary={project.courseStatus} />
                    </ListItem>
                    {project.publishedUrl && (
                      <ListItem>
                        <ListItemIcon><LinkIcon fontSize="small" /></ListItemIcon>
                        <ListItemText 
                          primary={<a href={project.publishedUrl} target="_blank" rel="noopener noreferrer">Xem xuất bản</a>} 
                        />
                      </ListItem>
                    )}
                  </List>
                  {project.description && (
                    <>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {project.description}
                      </Typography>
                    </>
                  )}
                </CardContent>
              </Card>
            )) : (
              <Alert severity="info">Chưa có thông tin dự án nghiên cứu</Alert>
            )}
          </Box>
        </CustomTabPanel>
      </Paper>
    </Container>
  );
};

export default LecturerProfilePage;
