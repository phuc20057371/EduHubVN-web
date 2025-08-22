import { useEffect, useState, type SyntheticEvent } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";

import TabPanel from "@mui/lab/TabPanel";
import { API } from "../../utils/Fetch";
import { setInstitutionPendingCreate } from "../../redux/slice/InstitutionPendingCreateSlice";
import { setInstitutionPendingUpdate } from "../../redux/slice/InstitutionPendingUpdateSlice";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import {
  Chip,
  Paper,
} from "@mui/material";
import { setInstitutions } from "../../redux/slice/InstitutionSlice";
import { Business, Add, Update } from "@mui/icons-material";
import InstitutionTab from "./tab/institution/InstitutionTab";
import CreateInstitutionTab from "./tab/institution/CreateInstitutionTab";
import UpdateInstitutionTab from "./tab/institution/UpdateInstitutionTab";
import TabList from "@mui/lab/TabList";

// Memoized selectors
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
  const dispatch = useDispatch();
  const [value, setValue] = useState("1");

  const institutionPendingCreate = useSelector(selectInstitutionPendingCreate);
  const institutionPendingUpdate = useSelector(selectInstitutionPendingUpdate);
  const institutions = useSelector(selectInstitutions);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.admin.getAllInstitutions();
        dispatch(setInstitutions(res.data.data));
        const response = await API.admin.getInstitutionPendingCreate();
        dispatch(setInstitutionPendingCreate(response.data.data));
        const updateResponse = await API.admin.getInstitutionPendingUpdate();
        dispatch(setInstitutionPendingUpdate(updateResponse.data.data));
      } catch (error) {
        console.error("Error initializing AdminInstitutionPage:", error);
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
              <Tab
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
              <Tab
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
              />
              <Tab
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
            </TabList>
          </Box>
        </Paper>

        <TabPanel value="1" sx={{ p: 0 }}>
          <InstitutionTab institutions={institutions} />
        </TabPanel>

        <TabPanel value="2" sx={{ p: 0 }}>
          <CreateInstitutionTab institutionPendingCreate={institutionPendingCreate} />
        </TabPanel>

        <TabPanel value="3" sx={{ p: 0 }}>
          <UpdateInstitutionTab institutionPendingUpdate={institutionPendingUpdate} />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default AdminInstitutionPage;
