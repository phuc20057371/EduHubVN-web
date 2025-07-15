import { useEffect, useState, type SyntheticEvent } from "react";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { API } from "../../utils/Fetch";
import { setInstitutionPendingCreate } from "../../redux/slice/InstitutionPendingCreateSlice";
import { setInstitutionPendingUpdate } from "../../redux/slice/InstitutionPendingUpdateSlice";
import { useDispatch, useSelector } from "react-redux";
import InstitutionDetailDialog from "../../components/InstitutionDetailDialog";
import InstitutionDetailUpdateDialog from "../../components/InstitutionDetailUpdateDialog";

const AdminInstitutionPage = () => {
  const [value, setValue] = useState('1');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState<any>(null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [selectedUpdate, setSelectedUpdate] = useState<{oldData: any, newData: any} | null>(null);
  const institutionPendingCreate = useSelector((state: any) => Array.isArray(state.institutionPendingCreate) ? state.institutionPendingCreate : []);
  const institutionPendingUpdate = useSelector((state: any) => Array.isArray(state.institutionPendingUpdate) ? state.institutionPendingUpdate : []);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.admin.getInstitutionPendingCreate();
        dispatch(setInstitutionPendingCreate(response.data.data));
        console.log("Institution pending create requests:", response.data.data);
        const updateResponse = await API.admin.getInstitutionPendingUpdate();
        dispatch(setInstitutionPendingUpdate(updateResponse.data.data));
        console.log("Institution pending update requests:", updateResponse.data.data);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error initializing AdminInstitutionPage:", error);
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
            <Tab label="Danh sách Cơ sở" value="1" />
            <Tab label="Yêu cầu tạo mới" value="2" />
            <Tab label="Yêu cầu cập nhật" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1">Nội dung danh sách cơ sở</TabPanel>
        <TabPanel value="2">
          {institutionPendingCreate && institutionPendingCreate.length > 0 ? (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr', lg: '1fr 1fr 1fr 1fr' }, gap: 2 }}>
              {institutionPendingCreate.map((item: any, idx: number) => (
                <Box key={item.id || idx} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 2, height: '100%' }}>
                  <strong>{item.institutionName}</strong> <span style={{ color: '#888', fontWeight: 400 }}>({item.institutionType})</span><br />
                  <span>Đại diện: {item.representativeName} ({item.position})</span><br />
                  <span>Năm thành lập: {item.establishedYear}</span><br />
                  <span>ĐKKD: {item.businessRegistrationNumber}</span><br />
                  <span>Địa chỉ: {item.address}</span><br />
                  <span>Điện thoại: {item.phoneNumber}</span><br />
                  <span>Website: <a href={item.website} target="_blank" rel="noopener noreferrer">{item.website}</a></span><br />
                
                  <Box sx={{ mt: 1 }}>
                    <button
                      style={{ padding: '6px 16px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                      onClick={() => {
                        setSelectedInstitution(item);
                        setOpenDialog(true);
                      }}
                    >
                      Xem chi tiết
                    </button>
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            <span>Không có yêu cầu tạo mới cơ sở.</span>
          )}
        <InstitutionDetailDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          institution={selectedInstitution || {}}
        />
        </TabPanel>
        <TabPanel value="3">
          {institutionPendingUpdate && institutionPendingUpdate.length > 0 ? (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr', lg: '1fr 1fr 1fr 1fr' }, gap: 2 }}>
              {institutionPendingUpdate.map((item: any, idx: number) => {
                const edu = item.educationInstitution;
                const eduUpdate = item.educationInstitutionUpdate;
                if (edu && eduUpdate) {
                  return (
                    <Box key={item.id || idx} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 2, height: '100%' }}>
                      <strong>{edu.institutionName}</strong> <span style={{ color: '#888', fontWeight: 400 }}>({edu.institutionType})</span><br />
                      <span>Đại diện: {edu.representativeName} ({edu.position})</span><br />
                      <span>Năm thành lập: {edu.establishedYear}</span><br />
                      <span>ĐKKD: {edu.businessRegistrationNumber}</span><br />
                      <span>Địa chỉ: {edu.address}</span><br />
                      <span>Điện thoại: {edu.phoneNumber}</span><br />
                      <span>Website: <a href={edu.website} target="_blank" rel="noopener noreferrer">{edu.website}</a></span><br />
                      <Box sx={{ mt: 1 }}>
                        <button
                          style={{ padding: '6px 16px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                          onClick={() => {
                            setSelectedUpdate({ oldData: edu, newData: eduUpdate });
                            setOpenUpdateDialog(true);
                          }}
                        >
                          Xem chi tiết
                        </button>
                      </Box>
                    </Box>
                  );
                }
                return null;
              })}
              <InstitutionDetailUpdateDialog
                open={openUpdateDialog}
                onClose={() => setOpenUpdateDialog(false)}
                oldData={selectedUpdate?.oldData}
                newData={selectedUpdate?.newData}
              />
            </Box>
          ) : (
            <span>Không có yêu cầu cập nhật cơ sở.</span>
          )}
        </TabPanel>
      </TabContext>
    </Box>
  );
}

export default AdminInstitutionPage