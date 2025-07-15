
import { useEffect, useState, type SyntheticEvent } from "react";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { API } from "../../utils/Fetch";
import { useDispatch, useSelector } from "react-redux";
import { setPartnerPendingCreate } from "../../redux/slice/PartnerPendingCreateSlice";
import { setPartnerPendingUpdate } from "../../redux/slice/partnerPendingUpdateSlice";
import PartnerDetailDialog from "../../components/PartnerDetailDialog";
import PartnerDetailUpdateDialog from "../../components/PartnerDetailUpdateDialog";



const AdminPartnerPage = () => {
  const [value, setValue] = useState('1');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [selectedUpdate, setSelectedUpdate] = useState<{oldData: any, newData: any} | null>(null);
  const partnerPendingCreate = useSelector((state: any) => Array.isArray(state.partnerPendingCreate) ? state.partnerPendingCreate : []);
  const partnerPendingUpdate = useSelector((state: any) => Array.isArray(state.partnerPendingUpdate) ? state.partnerPendingUpdate : []);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.admin.getPartnerPendingCreate();
        dispatch(setPartnerPendingCreate(response.data.data));
        console.log("Partner pending create requests:", response.data.data);
        const updateResponse = await API.admin.getPartnerPendingUpdate();
        dispatch(setPartnerPendingUpdate(updateResponse.data.data));
        console.log("Partner pending update requests:", updateResponse.data.data);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error initializing AdminPartnerPage:", error);
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
            <Tab label="Danh sách Đối tác" value="1" />
            <Tab label="Yêu cầu tạo mới" value="2" />
            <Tab label="Yêu cầu cập nhật" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1">Nội dung danh sách đối tác</TabPanel>
        <TabPanel value="2">
          {partnerPendingCreate && partnerPendingCreate.length > 0 ? (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr', lg: '1fr 1fr 1fr 1fr' }, gap: 2 }}>
              {partnerPendingCreate.map((item: any, idx: number) => (
                <Box key={item.id || idx} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 2, height: '100%' }}>
                  <strong>{item.organizationName}</strong> <br />
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
                        setSelectedPartner(item);
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
            <span>Không có yêu cầu tạo mới đối tác.</span>
          )}
          <PartnerDetailDialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            partner={selectedPartner || {}}
          />
        </TabPanel>
        <TabPanel value="3">
          {partnerPendingUpdate && partnerPendingUpdate.length > 0 ? (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr', lg: '1fr 1fr 1fr 1fr' }, gap: 2 }}>
              {partnerPendingUpdate.map((item: any, idx: number) => {
                const partner = item.partnerOrganization;
                const partnerUpdate = item.partnerOrganizationUpdate;
                if (partner && partnerUpdate) {
                  return (
                    <Box key={item.id || idx} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 2, height: '100%' }}>
                      <strong>{partner.organizationName}</strong> <br />
                      <span>Đại diện: {partner.representativeName} ({partner.position})</span><br />
                      <span>Năm thành lập: {partner.establishedYear}</span><br />
                      <span>ĐKKD: {partner.businessRegistrationNumber}</span><br />
                      <span>Địa chỉ: {partner.address}</span><br />
                      <span>Điện thoại: {partner.phoneNumber}</span><br />
                      <span>Website: <a href={partner.website} target="_blank" rel="noopener noreferrer">{partner.website}</a></span><br />
                      <Box sx={{ mt: 1 }}>
                        <button
                          style={{ padding: '6px 16px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                          onClick={() => {
                            setSelectedUpdate({ oldData: partner, newData: partnerUpdate });
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
              <PartnerDetailUpdateDialog
                open={openUpdateDialog}
                onClose={() => setOpenUpdateDialog(false)}
                oldData={selectedUpdate?.oldData}
                newData={selectedUpdate?.newData}
              />
            </Box>
          ) : (
            <span>Không có yêu cầu cập nhật đối tác.</span>
          )}
        </TabPanel>
      </TabContext>
    </Box>
  );
}

export default AdminPartnerPage