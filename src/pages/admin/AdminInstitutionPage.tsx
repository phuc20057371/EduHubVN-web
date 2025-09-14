import { useEffect, useState, type SyntheticEvent, useMemo } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import TabList from "@mui/lab/TabList";
import * as React from "react";
import { API } from "../../utils/Fetch";
import { setInstitutionPendingCreate } from "../../redux/slice/InstitutionPendingCreateSlice";
import { setInstitutionPendingUpdate } from "../../redux/slice/InstitutionPendingUpdateSlice";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import {
  Chip,
  Paper,
  Typography,
} from "@mui/material";
import { setInstitutions } from "../../redux/slice/InstitutionSlice";
import { Business, Add, Update } from "@mui/icons-material";
import InstitutionTab from "./tab/institution/InstitutionTab";
import CreateInstitutionTab from "./tab/institution/CreateInstitutionTab";
import UpdateInstitutionTab from "./tab/institution/UpdateInstitutionTab";
import CreateInstitutionDialog from "../../components/admin-dialog/admin-institution-dialog/CreateInstitutionDialog";

const selectInstitutionPendingCreate = createSelector(
  (state: any) => state.institutionPendingCreate,
  (institutionPendingCreate) =>
    Array.isArray(institutionPendingCreate) ? institutionPendingCreate : [],
);

const selectInstitutionPendingUpdate = createSelector(
  (state: any) => state.institutionPendingUpdate,
  (institutionPendingUpdate) =>
    Array.isArray(institutionPendingUpdate) ? institutionPendingUpdate : [],
);

const selectInstitutions = createSelector(
  (state: any) => state.institution,
  (institution) => (Array.isArray(institution) ? institution : []),
);


const AdminInstitutionPage = () => {
  // PERMISSION CHECKS FIRST
  const userProfile = useSelector((state: any) => state.userProfile);

  const canViewInstitutionTab = useMemo(() => {
    if (userProfile.role === "ADMIN") return true;
    if (userProfile.role === "SUB_ADMIN") {
      return userProfile.permissions?.includes("SCHOOL_READ");
    }
    return false;
  }, [userProfile]);

  const canViewApprovalTabs = useMemo(() => {
    if (userProfile.role === "ADMIN") return true;
    if (userProfile.role === "SUB_ADMIN") {
      return userProfile.permissions?.includes("SCHOOL_APPROVE");
    }
    return false;
  }, [userProfile]);

  // New permission checks for edit and delete actions
  const canEditInstitution = useMemo(() => {
    if (userProfile.role === "ADMIN") return true;
    if (userProfile.role === "SUB_ADMIN") {
      return userProfile.permissions?.includes("SCHOOL_UPDATE");
    }
    return false;
  }, [userProfile]);

  const canDeleteInstitution = useMemo(() => {
    if (userProfile.role === "ADMIN") return true;
    if (userProfile.role === "SUB_ADMIN") {
      return userProfile.permissions?.includes("SCHOOL_DELETE");
    }
    return false;
  }, [userProfile]);

  const canCreateInstitution = useMemo(() => {
    if (userProfile.role === "ADMIN") return true;
    if (userProfile.role === "SUB_ADMIN") {
      return userProfile.permissions?.includes("SCHOOL_CREATE");
    }
    return false;
  }, [userProfile]);

  // Get the first available tab value based on permissions
  const getFirstAvailableTab = () => {
    if (canViewInstitutionTab) return "1";
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
  }, [canViewInstitutionTab, canViewApprovalTabs, canEditInstitution, canDeleteInstitution, canCreateInstitution]);

  const institutionPendingCreate = useSelector(selectInstitutionPendingCreate);
  const institutionPendingUpdate = useSelector(selectInstitutionPendingUpdate);
  const institutions = useSelector(selectInstitutions);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userProfile.role === "ADMIN") {
          const res = await API.admin.getAllInstitutions();
          dispatch(setInstitutions(res.data.data));
          const response = await API.admin.getInstitutionPendingCreate();
          dispatch(setInstitutionPendingCreate(response.data.data));
          const updateResponse = await API.admin.getInstitutionPendingUpdate();
          dispatch(setInstitutionPendingUpdate(updateResponse.data.data));
        } else if (userProfile.role === "SUB_ADMIN") {
          if (userProfile.permissions.includes("SCHOOL_READ")) {
            const res = await API.admin.getAllInstitutions();
            dispatch(setInstitutions(res.data.data));
          }
          if (userProfile.permissions.includes("SCHOOL_APPROVE")) {
            const response = await API.admin.getInstitutionPendingCreate();
            dispatch(setInstitutionPendingCreate(response.data.data));
            const updateResponse = await API.admin.getInstitutionPendingUpdate();
            dispatch(setInstitutionPendingUpdate(updateResponse.data.data));
          }
        }
      } catch (error) {
        console.error("Error initializing AdminInstitutionPage:", error);
      }
    };
    
    // Chỉ chạy fetchData khi userProfile đã có và có role
    if (userProfile && userProfile.role) {
      fetchData();
    }
  }, [userProfile, dispatch]);

  const handleChange = (_event: SyntheticEvent, newValue: string) => {
    // Only allow switching to tabs user has permission for
    const tabNumber = parseInt(newValue);
    if (tabNumber === 1 && canViewInstitutionTab) {
      setValue(newValue);
    } else if (tabNumber >= 2 && tabNumber <= 3 && canViewApprovalTabs) {
      setValue(newValue);
    }
  };

  const handleCreateInstitutionSuccess = async () => {
    // Refresh institutions list after creating new institution
    try {
      if (userProfile.role === "ADMIN" || 
          (userProfile.role === "SUB_ADMIN" && userProfile.permissions?.includes("SCHOOL_READ"))) {
        const res = await API.admin.getAllInstitutions();
        dispatch(setInstitutions(res.data.data));
      }
    } catch (error) {
      console.error("Error refreshing institutions:", error);
    }
  };

  // Create tabs array based on permissions
  const availableTabs = React.useMemo(() => {
    const tabs = [];

    // Tab 1 - Institution List
    if (canViewInstitutionTab) {
      tabs.push(
        <Tab
          key="tab-1"
          label={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Business />
              <span>Cơ sở Giáo dục</span>
              <Chip
                size="small"
                label={institutions.length}
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
      );
    }

    // Tabs 2-3 - Approval Tabs
    if (canViewApprovalTabs) {
      tabs.push(
        <Tab
          key="tab-2"
          label={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Add />
              <span>Tạo mới</span>
              <Chip
                size="small"
                label={institutionPendingCreate.length}
                sx={{
                  bgcolor: "success.main",
                  color: "white",
                  fontWeight: 600,
                }}
              />
            </Box>
          }
          value="2"
        />,
        <Tab
          key="tab-3"
          label={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Update />
              <span>Cập nhật</span>
              <Chip
                size="small"
                label={institutionPendingUpdate.length}
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
      );
    }

    return tabs;
  }, [canViewInstitutionTab, canViewApprovalTabs, institutions.length, institutionPendingCreate.length, institutionPendingUpdate.length]);

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "fix-content",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        p: 3,
      }}
    >
      {/* If user has no permissions, show access denied message */}
      {userProfile && userProfile.role === "SUB_ADMIN" && !canViewInstitutionTab && !canViewApprovalTabs ? (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
          }}
        >
          <Paper
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <Typography variant="h5" color="error" gutterBottom>
              Không có quyền truy cập
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Bạn không có quyền truy cập vào trang quản lý cơ sở giáo dục.
            </Typography>
          </Paper>
        </Box>
      ) : (
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
                aria-label="institution management tabs"
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
                {availableTabs}
              </TabList>
            </Box>
          </Paper>

          {/* TAB PANELS */}
          {canViewInstitutionTab && (
            <TabPanel value="1" sx={{ p: 0 }}>
              <InstitutionTab 
                institutions={institutions} 
                canEdit={canEditInstitution}
                canDelete={canDeleteInstitution}
                canCreate={canCreateInstitution}
                onCreateClick={() => setCreateDialogOpen(true)}
              />
            </TabPanel>
          )}

          {canViewApprovalTabs && (
            <TabPanel value="2" sx={{ p: 0 }}>
              <CreateInstitutionTab institutionPendingCreate={institutionPendingCreate} />
            </TabPanel>
          )}

          {canViewApprovalTabs && (
            <TabPanel value="3" sx={{ p: 0 }}>
              <UpdateInstitutionTab institutionPendingUpdate={institutionPendingUpdate} />
            </TabPanel>
          )}
        </TabContext>
      )}
      
      {/* Create Institution Dialog */}
      <CreateInstitutionDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSuccess={handleCreateInstitutionSuccess}
      />
    </Box>
  );
};

export default AdminInstitutionPage;
