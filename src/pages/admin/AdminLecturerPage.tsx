
import { useEffect, useState, type SyntheticEvent } from "react";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { API } from "../../utils/Fetch";
import { setLecturerPendingCreate } from "../../redux/slice/LecturerPendingCreateSlice";
import { setLecturerPendingUpdate } from "../../redux/slice/LecturerPendingUpdateSlice";
import { useDispatch, useSelector } from "react-redux";
import LecturerDetailDialog from "../../components/LecturerDetailDialog";
import LecturerDetailUpdateDialog from "../../components/LecturerDetailUpdateDialog";

const AdminLecturerPage = () => {
  const [value, setValue] = useState('1');
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [selectedLecturerCreate, setSelectedLecturerCreate] = useState<any>(null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [selectedLecturerUpdate, setSelectedLecturerUpdate] = useState<any>(null);



  const lecturerCreateList = useSelector((state: any) => Array.isArray(state.lecturerPendingCreate) ? state.lecturerPendingCreate : []);
  const lecturerUpdateList = useSelector((state: any) => Array.isArray(state.lecturerPendingUpdate) ? state.lecturerPendingUpdate : []);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.admin.getLecturerPendingCreate();
        console.log("Lecturer pending create requests:", response.data.data);
        dispatch(setLecturerPendingCreate(response.data.data));
        const updateResponse = await API.admin.getLecturerPendingUpdate();
        console.log("Lecturer pending update requests:", updateResponse.data.data);
        dispatch(setLecturerPendingUpdate(updateResponse.data.data));
      } catch (error) {
        console.error("Error initializing AdminLecturerPage:", error);
      }
    };

    fetchData();
  }, []);


  const handleChange = (_event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Danh sách Giảng viên" value="1" />
            <Tab label="Yêu cầu tạo mới" value="2" />
            <Tab label="Yêu cầu cập nhật" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1">Nội dung danh sách giảng viên</TabPanel>
        <TabPanel value="2">
          {lecturerCreateList && lecturerCreateList.length > 0 ? (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr', lg: '1fr 1fr 1fr 1fr' }, gap: 2 }}>
              {lecturerCreateList.map((item: any) => (
                <Box key={item.lecturer.id} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 2, height: '100%' }}>
                  <strong>{item.lecturer.fullName}</strong> - {item.lecturer.academicRank} ({item.lecturer.specialization})<br />
                  <span>Chuyên ngành: {item.lecturer.specialization}</span><br />
                  <span>Kinh nghiệm: {item.lecturer.experienceYears} năm</span><br />
                  <span>Ngày sinh: {item.lecturer.dateOfBirth}</span> <br />
                  <span>Giới tính: {item.lecturer.gender ? "Nam" : "Nữ"}</span><br />
                  <span>SĐT: {item.lecturer.phoneNumber}</span>
                  <Box sx={{ mt: 1 }}>
                    <button
                      style={{ padding: '6px 16px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                      onClick={() => {
                        setSelectedLecturerCreate(item);
                        setOpenCreateDialog(true);
                      }}
                    >
                      Xem chi tiết
                    </button>
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            <span>Không có yêu cầu tạo mới giảng viên.</span>
          )}
          <LecturerDetailDialog
            open={openCreateDialog}
            onClose={() => setOpenCreateDialog(false)}
            lecturer={selectedLecturerCreate?.lecturer || {}}
            degrees={selectedLecturerCreate?.degrees || []}
            certificates={selectedLecturerCreate?.certificates || []}
          />
        </TabPanel>
        <TabPanel value="3">
          {lecturerUpdateList && lecturerUpdateList.length > 0 ? (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr', lg: '1fr 1fr 1fr 1fr' }, gap: 2 }}>
              {lecturerUpdateList.map((item: any) => (
                <Box key={item.lecturer.id} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 2, height: '100%' }}>
                  <strong>{item.lecturer.fullName}</strong> - {item.lecturer.academicRank} ({item.lecturer.specialization})<br />
                  <span>Chuyên ngành: {item.lecturer.specialization}</span><br />
                  <span>Kinh nghiệm: {item.lecturer.experienceYears} năm</span><br />
                  <span>Ngày sinh: {item.lecturer.dateOfBirth}</span> <br />
                  <span>Giới tính: {item.lecturer.gender ? "Nam" : "Nữ"}</span><br />
                  <span>SĐT: {item.lecturer.phoneNumber}</span>
                  <Box sx={{ mt: 1 }}>
                    <button
                      style={{ padding: '6px 16px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                      onClick={() => {
                        setSelectedLecturerUpdate(item);
                        setOpenUpdateDialog(true);
                      }}
                    >
                      Xem chi tiết
                    </button>
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            <span>Không có yêu cầu cập nhật giảng viên.</span>
          )}
          <LecturerDetailUpdateDialog
            open={openUpdateDialog}
            onClose={() => setOpenUpdateDialog(false)}
            lecturer={selectedLecturerUpdate?.lecturer || {}}
            lecturerUpdate={selectedLecturerUpdate?.lecturerUpdate || {}}
          />
        </TabPanel>
      </TabContext>
    </Box>
  )
}

export default AdminLecturerPage