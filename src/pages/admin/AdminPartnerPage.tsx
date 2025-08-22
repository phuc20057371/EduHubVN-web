import { useEffect, useState, type SyntheticEvent } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { API } from "../../utils/Fetch";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { setPartnerPendingCreate } from "../../redux/slice/PartnerPendingCreateSlice";
import { setPartnerPendingUpdate } from "../../redux/slice/PartnerPendingUpdateSlice";
import PartnerDetailDialog from "../../components/PartnerDetailDialog";
import PartnerDetailUpdateDialog from "../../components/PartnerDetailUpdateDialog";
import PartnerEditDialog from "../../components/PartnerEditDialog";
import {
  PartnerListTab,
  PartnerCreateTab,
  PartnerUpdateTab,
} from "./tab/partner";
import { Paper, Chip } from "@mui/material";
import { setPartner } from "../../redux/slice/PartnerSlice";
import { Add, Update, Domain } from "@mui/icons-material";

// Memoized selectors
const selectPartnerPendingCreate = createSelector(
  (state: any) => state.partnerPendingCreate,
  (partnerPendingCreate) =>
    Array.isArray(partnerPendingCreate) ? partnerPendingCreate : [],
);

const selectPartnerPendingUpdate = createSelector(
  (state: any) => state.partnerPendingUpdate,
  (partnerPendingUpdate) =>
    Array.isArray(partnerPendingUpdate) ? partnerPendingUpdate : [],
);

const selectPartners = createSelector(
  (state: any) => state.partner,
  (partner) => (Array.isArray(partner) ? partner : []),
);

const AdminPartnerPage = () => {
  const dispatch = useDispatch();

  const [value, setValue] = useState("1");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedUpdate, setSelectedUpdate] = useState<{
    oldData: any;
    newData: any;
  } | null>(null);

  const partnerPendingCreate = useSelector(selectPartnerPendingCreate);
  const partnerPendingUpdate = useSelector(selectPartnerPendingUpdate);
  const partners = useSelector(selectPartners);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.admin.getAllPartners();
        dispatch(setPartner(res.data.data));
        const response = await API.admin.getPartnerPendingCreate();
        dispatch(setPartnerPendingCreate(response.data.data));
        const updateResponse = await API.admin.getPartnerPendingUpdate();
        dispatch(setPartnerPendingUpdate(updateResponse.data.data));
      } catch (error) {
        console.error("Error initializing AdminPartnerPage:", error);
      }
    };
    fetchData();
  }, [dispatch]);

  const handleChange = (_event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "fix-content",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        p: 3,
      }}
    >
      <TabContext value={value}>
        <Paper
          elevation={0}
          sx={{
            mb: 3,
            borderRadius: 3,
            overflow: "hidden",
            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            border: "1px solid rgba(255,255,255,0.8)",
          }}
        >
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              bgcolor: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(10px)",
            }}
          >
            <TabList
              onChange={handleChange}
              aria-label="partner management tabs"
              sx={{
                px: 3,
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "1rem",
                  minHeight: 60,
                },
              }}
            >
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Domain />
                    <span>Đối tác</span>
                    <Chip
                      size="small"
                      label={partners.length}
                      sx={{
                        bgcolor: "primary.main",
                        color: "white",
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                }
                value="1"
              />
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Add />
                    <span>Tạo mới</span>
                    <Chip
                      size="small"
                      label={partnerPendingCreate.length}
                      sx={{
                        bgcolor: "success.main",
                        color: "white",
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                }
                value="2"
              />
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Update />
                    <span>Cập nhật</span>
                    <Chip
                      size="small"
                      label={partnerPendingUpdate.length}
                      sx={{
                        bgcolor: "warning.main",
                        color: "white",
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                }
                value="3"
              />
            </TabList>
          </Box>
        </Paper>

        <TabPanel value="1" sx={{ p: 0 }}>
          <PartnerListTab
            partners={partners}
            onEdit={(partner) => {
              setSelectedPartner({ partner });
              setOpenEditDialog(true);
            }}
          />
        </TabPanel>

        <TabPanel value="2">
          <PartnerCreateTab
            partnerPendingCreate={partnerPendingCreate}
            onSelectPartner={(partner) => {
              setSelectedPartner(partner);
              setOpenDialog(true);
            }}
          />
        </TabPanel>

        <TabPanel value="3">
          <PartnerUpdateTab
            partnerPendingUpdate={partnerPendingUpdate}
            onSelectUpdate={(update) => {
              setSelectedUpdate(update);
              setOpenUpdateDialog(true);
            }}
          />
        </TabPanel>
      </TabContext>

      {/* Dialogs */}
      <PartnerDetailDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        partner={selectedPartner || {}}
      />
      <PartnerDetailUpdateDialog
        open={openUpdateDialog}
        onClose={() => setOpenUpdateDialog(false)}
        oldData={selectedUpdate?.oldData}
        newData={selectedUpdate?.newData}
      />
      <PartnerEditDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        partner={selectedPartner?.partner}
      />
    </Box>
  );
};

export default AdminPartnerPage;
