
import { useEffect, useState } from 'react';
import { Box, Tabs, Tab, Typography, Button } from '@mui/material';
import DegreeDetailDialog from '../../components/DegreeDetailDialog';
import DegreeDetailUpdateDialog from '../../components/DegreeDetailUpdateDialog';
import { API } from '../../utils/Fetch';
import { useDispatch, useSelector } from 'react-redux';
import { setDegreePendingCreate } from '../../redux/slice/DegreePendingCreateSlice';
import { setDegreePendingUpdate } from '../../redux/slice/degreePendingUpdateSlice';

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AdminDegree = () => {
  const dispatch = useDispatch();
  const degreePendingCreate = useSelector((state: any) => Array.isArray(state.degreePendingCreate) ? state.degreePendingCreate : []);
  const degreePendingUpdate = useSelector((state: any) => Array.isArray(state.degreePendingUpdate) ? state.degreePendingUpdate : []);

  const [mainTab, setMainTab] = useState(0);
  const [degreeSubTab, setDegreeSubTab] = useState(0);
  const [certSubTab, setCertSubTab] = useState(0);

  const [openDetail, setOpenDetail] = useState(false);
  const [openUpdateDetail, setOpenUpdateDetail] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<any>(null);
  const [selectedUpdateDetail, setSelectedUpdateDetail] = useState<any>(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseCreate = await API.admin.getDegreePendingCreate();
        dispatch(setDegreePendingCreate(responseCreate.data.data));
        const responseUpdate = await API.admin.getDegreePendingUpdate();
        dispatch(setDegreePendingUpdate(responseUpdate.data.data));
      } catch (error) {
        console.error("Error fetching degree data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={mainTab} onChange={(_, v) => setMainTab(v)}>
        <Tab label="Bằng cấp" />
        <Tab label="Chứng chỉ" />
      </Tabs>
      <TabPanel value={mainTab} index={0}>
        <Tabs value={degreeSubTab} onChange={(_, v) => setDegreeSubTab(v)} sx={{ mb: 2 }}>
          <Tab label="Yêu cầu tạo mới" />
          <Tab label="Yêu cầu cập nhật" />
        </Tabs>
        <TabPanel value={degreeSubTab} index={0}>
          {degreePendingCreate.length === 0 ? (
            <Typography>Không có yêu cầu tạo mới bằng cấp</Typography>
          ) : (
            <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }} gap={2}>
              {degreePendingCreate.map((item: any) => (
                <Box key={item.degree?.id} p={2} border={1} borderRadius={2} borderColor="#eee" bgcolor="#fafbfc">
                  <Typography variant="subtitle1" fontWeight={600}>{item.degree?.name} ({item.degree?.level})</Typography>
                  <Typography variant="body2">Reference Id: {item.degree?.referenceId}</Typography>
                  <Typography variant="body2">Ngành: {item.degree?.major}</Typography>
                  <Typography variant="body2">Năm: {item.degree?.startYear} - {item.degree?.graduationYear}</Typography>
                  <Typography variant="body2">
                    Vào lúc: {item.degree?.updatedAt ? new Date(item.degree.updatedAt).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }) : ''}
                  </Typography>
                  <Typography variant="body2">Giảng viên: {item.lecturer?.fullName}</Typography>
                  <Button size="small" variant="outlined" sx={{ mt: 1 }} onClick={() => { setSelectedDetail(item); setOpenDetail(true); }}>Xem chi tiết</Button>
                </Box>
              ))}
            </Box>
          )}
        </TabPanel>
        <TabPanel value={degreeSubTab} index={1}>
          {degreePendingUpdate.length === 0 ? (
            <Typography>Không có yêu cầu cập nhật bằng cấp</Typography>
          ) : (
            <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }} gap={2}>
              {degreePendingUpdate.map((item: any) => (
                <Box key={item.degree?.id} p={2} border={1} borderRadius={2} borderColor="#eee" bgcolor="#fafbfc">
                  <Typography variant="subtitle1" fontWeight={600}>{item.degree?.name || item.degree?.name} ({item.degree?.level || item.degree?.level})</Typography>
                  <Typography variant="body2">Reference Id: {item.degree?.referenceId}</Typography>
                  <Typography variant="body2">Ngành: {item.degree?.major || item.degree?.major} </Typography>
                  <Typography variant="body2">Năm: {item.degree?.startYear || item.degree?.startYear} - {item.degree?.graduationYear || item.degree?.graduationYear}</Typography>
                  <Typography variant="body2">
                    Vào lúc: {item.updatedDegree?.updatedAt ? new Date(item.updatedDegree.updatedAt).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }) : ''}
                  </Typography>
                  <Typography variant="body2">Giảng viên: {item.lecturer?.fullName}</Typography>
                  <Button size="small" variant="outlined" sx={{ mt: 1 }} onClick={() => { setSelectedUpdateDetail(item); setOpenUpdateDetail(true); }}>Xem chi tiết</Button>
                </Box>
              ))}
            </Box>
          )}
        </TabPanel>
      </TabPanel>
      <TabPanel value={mainTab} index={1}>
        <Tabs value={certSubTab} onChange={(_, v) => setCertSubTab(v)} sx={{ mb: 2 }}>
          <Tab label="Yêu cầu tạo mới" />
          <Tab label="Yêu cầu cập nhật" />
        </Tabs>
        <TabPanel value={certSubTab} index={0}>
          <Typography>Danh sách yêu cầu tạo mới chứng chỉ</Typography>
        </TabPanel>
        <TabPanel value={certSubTab} index={1}>
          <Typography>Danh sách yêu cầu cập nhật chứng chỉ</Typography>
        </TabPanel>
      </TabPanel>
      {/* Dialogs */}
      <DegreeDetailDialog open={openDetail} onClose={() => setOpenDetail(false)} data={selectedDetail} />
      <DegreeDetailUpdateDialog open={openUpdateDetail} onClose={() => setOpenUpdateDetail(false)} data={selectedUpdateDetail} />
    </Box>
  );
}

export default AdminDegree;