import { useEffect, useState, type SyntheticEvent, useMemo } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import * as React from "react";
import { API } from "../../utils/Fetch";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { setPartnerPendingCreate } from "../../redux/slice/PartnerPendingCreateSlice";
import { setPartnerPendingUpdate } from "../../redux/slice/PartnerPendingUpdateSlice";
import ApprovePartnerCreateDialog from "../../components/admin-dialog/admin-partner-dialog/ApprovePartnerCreateDialog";
import ApprovePartnerUpdateDialog from "../../components/admin-dialog/admin-partner-dialog/ApprovePartnerUpdateDialog";
import PartnerProfileUpdateDialog from "../../components/admin-dialog/admin-partner-dialog/PartnerProfileUpdateDialog";
import CreatePartnerDialog from "../../components/admin-dialog/admin-partner-dialog/CreatePartnerDialog";
import {
  PartnerListTab,
  PartnerCreateTab,
  PartnerUpdateTab,
} from "./tab/partner";
import { Paper } from "@mui/material";
import { setPartner } from "../../redux/slice/PartnerSlice";

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
  // PERMISSION CHECKS FIRST
  const userProfile = useSelector((state: any) => state.userProfile);

  const canViewPartnerTab = useMemo(() => {
    if (userProfile.role === "ADMIN") return true;
    if (userProfile.role === "SUB_ADMIN") {
      return userProfile.permissions?.includes("ORGANIZATION_READ");
    }
    return false;
  }, [userProfile]);

  const canViewApprovalTabs = useMemo(() => {
    if (userProfile.role === "ADMIN") return true;
    if (userProfile.role === "SUB_ADMIN") {
      return userProfile.permissions?.includes("ORGANIZATION_APPROVE");
    }
    return false;
  }, [userProfile]);

  // New permission checks for edit and delete actions
  const canEditPartner = useMemo(() => {
    if (userProfile.role === "ADMIN") return true;
    if (userProfile.role === "SUB_ADMIN") {
      return userProfile.permissions?.includes("ORGANIZATION_UPDATE");
    }
    return false;
  }, [userProfile]);

  const canDeletePartner = useMemo(() => {
    if (userProfile.role === "ADMIN") return true;
    if (userProfile.role === "SUB_ADMIN") {
      return userProfile.permissions?.includes("ORGANIZATION_DELETE");
    }
    return false;
  }, [userProfile]);

  const canCreatePartner = useMemo(() => {
    if (userProfile.role === "ADMIN") return true;
    if (userProfile.role === "SUB_ADMIN") {
      return userProfile.permissions?.includes("ORGANIZATION_CREATE");
    }
    return false;
  }, [userProfile]);

  // Get tabs available based on permissions
  const availableTabs = useMemo(() => {
    const tabs = [];
    
    if (canViewPartnerTab) {
      tabs.push({
        value: "1",
        label: "Đối tác"
      });
    }
    
    if (canViewApprovalTabs) {
      tabs.push({
        value: "2", 
        label: "Tạo mới"
      });
      tabs.push({
        value: "3",
        label: "Cập nhật"
      });
    }
    
    return tabs;
  }, [canViewPartnerTab, canViewApprovalTabs]);

  // Get the first available tab value based on permissions
  const getFirstAvailableTab = () => {
    if (canViewPartnerTab) return "1";
    if (canViewApprovalTabs) return "2";
    return "1"; // fallback
  };

  const dispatch = useDispatch();

  const [value, setValue] = useState(() => getFirstAvailableTab());
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Update tab when permissions change
  useEffect(() => {
    const currentTab = getFirstAvailableTab();
    if (value !== currentTab) {
      setValue(currentTab);
    }
  }, [canViewPartnerTab, canViewApprovalTabs]);
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
        if (userProfile.role === "ADMIN") {
          const res = await API.admin.getAllPartners();
          dispatch(setPartner(res.data.data));
          const response = await API.admin.getPartnerPendingCreate();
          dispatch(setPartnerPendingCreate(response.data.data));
          const updateResponse = await API.admin.getPartnerPendingUpdate();
          dispatch(setPartnerPendingUpdate(updateResponse.data.data));
        } else if (userProfile.role === "SUB_ADMIN") {
          if (userProfile.permissions.includes("ORGANIZATION_READ")) {
            const res = await API.admin.getAllPartners();
            dispatch(setPartner(res.data.data));
          }
          if (userProfile.permissions.includes("ORGANIZATION_APPROVE")) {
            const response = await API.admin.getPartnerPendingCreate();
            dispatch(setPartnerPendingCreate(response.data.data));
            const updateResponse = await API.admin.getPartnerPendingUpdate();
            dispatch(setPartnerPendingUpdate(updateResponse.data.data));
          }
        }
      } catch (error) {
        console.error("Error initializing AdminPartnerPage:", error);
      }
    };
    
    // Chỉ chạy fetchData khi userProfile đã có và có role
    if (userProfile && userProfile.role) {
      fetchData();
    }
  }, [userProfile, dispatch]);

  const handleChange = (_event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleCreatePartnerSuccess = async () => {
    // Refresh partners list after creating new partner
    try {
      if (userProfile.role === "ADMIN" || 
          (userProfile.role === "SUB_ADMIN" && userProfile.permissions?.includes("ORGANIZATION_READ"))) {
        const res = await API.admin.getAllPartners();
        dispatch(setPartner(res.data.data));
      }
    } catch (error) {
      console.error("Error refreshing partners:", error);
    }
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
              position: "relative",
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
              {availableTabs.map((tab: { value: string; label: React.ReactNode }) => (
                <Tab
                  key={tab.value}
                  label={tab.label}
                  value={tab.value}
                />
              ))}
            </TabList>
          </Box>
        </Paper>

        {availableTabs.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 400,
              bgcolor: "rgba(255,255,255,0.9)",
              borderRadius: 3,
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <h3>Không có quyền truy cập</h3>
              <p>Bạn không có quyền truy cập vào bất kỳ tab nào trong trang này.</p>
            </Box>
          </Box>
        ) : (
          <>
            {canViewPartnerTab && (
              <TabPanel value="1" sx={{ p: 0 }}>
                <PartnerListTab
                  partners={partners}
                  onEdit={(partner) => {
                    setSelectedPartner({ partner });
                    setOpenEditDialog(true);
                  }}
                  canEdit={canEditPartner}
                  canDelete={canDeletePartner}
                  canCreate={canCreatePartner}
                  onCreateClick={() => setCreateDialogOpen(true)}
                />
              </TabPanel>
            )}

            {canViewApprovalTabs && (
              <>
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
              </>
            )}
          </>
        )}
      </TabContext>

      {/* Dialogs */}
      <ApprovePartnerCreateDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        partner={selectedPartner || {}}
      />
      <ApprovePartnerUpdateDialog
        open={openUpdateDialog}
        onClose={() => setOpenUpdateDialog(false)}
        oldData={selectedUpdate?.oldData}
        newData={selectedUpdate?.newData}
      />
      <PartnerProfileUpdateDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        partner={selectedPartner?.partner}
      />
      
      {/* Create Partner Dialog */}
      <CreatePartnerDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSuccess={handleCreatePartnerSuccess}
      />
    </Box>
  );
};

export default AdminPartnerPage;
