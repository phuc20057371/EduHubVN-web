import { useEffect, useState, type SyntheticEvent } from "react";

import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminLecturerMainTab from "./tab/lecturer/AdminLecturerMainTab";
import AdminLecturerCreateTab from "./tab/lecturer/AdminLecturerCreateTab";
import AdminLecturerUpdateTab from "./tab/lecturer/AdminLecturerUpdateTab";
import AdminLecturerDegreeTab from "./tab/lecturer/AdminLecturerDegreeTab";
import AdminLecturerCourseTab from "./tab/lecturer/AdminLecturerCourseTab";
import AdminLecturerResearchTab from "./tab/lecturer/AdminLecturerResearchTab";
import { setLecturerPendingCreate } from "../../redux/slice/LecturerPendingCreateSlice";
import { setLecturerPendingUpdate } from "../../redux/slice/LecturerPendingUpdateSlice";
import { setLecturerRequests } from "../../redux/slice/LecturerRquestSlice";
import { setLecturers } from "../../redux/slice/LecturerSlice";
import { API } from "../../utils/Fetch";

const AdminLecturerPage = () => {
  // TAB STATE & GENERAL FILTERS
  const [value, setValue] = useState("1");

  // REDUX SELECTORS
  const lecturerCreateList = useSelector((state: any) =>
    Array.isArray(state.lecturerPendingCreate)
      ? state.lecturerPendingCreate
      : [],
  );
  const lecturerUpdateList = useSelector((state: any) =>
    Array.isArray(state.lecturerPendingUpdate)
      ? state.lecturerPendingUpdate
      : [],
  );
  const lecturerRequests = useSelector((state: any) =>
    Array.isArray(state.lecturerRequests) ? state.lecturerRequests : [],
  );

  // TAB 4 - DEGREE/CERTIFICATE REQUEST DATA
  const lecturerRequestsDGCC = React.useMemo(
    () =>
      Array.isArray(lecturerRequests)
        ? lecturerRequests.filter(
            (req: any) => req.type === "BC" || req.type === "CC",
          )
        : [],
    [lecturerRequests],
  );

  // TAB 5 - COURSE REQUEST DATA (AC và OC only)
  const lecturerRequestsCourse = React.useMemo(
    () =>
      Array.isArray(lecturerRequests)
        ? lecturerRequests.filter(
            (req: any) => req.type === "AC" || req.type === "OC",
          )
        : [],
    [lecturerRequests],
  );

  // TAB 6 - RESEARCH PROJECT REQUEST DATA (RP only)
  const lecturerRequestsResearch = React.useMemo(
    () =>
      Array.isArray(lecturerRequests)
        ? lecturerRequests.filter((req: any) => req.type === "RP")
        : [],
    [lecturerRequests],
  );

  const lecturers = useSelector((state: any) => state.lecturer || []);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.admin.getAllLecturers();
        dispatch(setLecturers(res.data.data));
        const response = await API.admin.getLecturerPendingCreate();
        dispatch(setLecturerPendingCreate(response.data.data));
        const updateResponse = await API.admin.getLecturerPendingUpdate();
        dispatch(setLecturerPendingUpdate(updateResponse.data.data));
        const responseData = await API.admin.getLecturerRequests();
        dispatch(setLecturerRequests(responseData.data.data));
      } catch (error) {
        console.error("Error initializing AdminLecturerPage:", error);
      }
    };
    fetchData();
  }, []);

  // EVENT HANDLERS
  const handleChange = (_event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  // RENDER COMPONENT
  return (
    <Box
      sx={{
        width: "100%",
        typography: "body1",
        bgcolor: "background.default",
        minHeight: "100vh",
        p: 3,
      }}
    >
      <TabContext value={value}>
        {/* TAB NAVIGATION */}
        <Paper
          sx={{
            mb: 3,
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              bgcolor: "background.paper",
            }}
          >
            <TabList
              onChange={handleChange}
              aria-label="lecturer management tabs"
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                px: { xs: 1, sm: 3 },
                "& .MuiTab-root": {
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: { xs: "0.85rem", sm: "1rem" },
                  minWidth: { xs: "auto", sm: "160px" },
                  padding: { xs: "8px 12px", sm: "12px 16px" },
                  whiteSpace: "nowrap",
                },
                "& .MuiTabs-scrollButtons": {
                  "&.Mui-disabled": {
                    opacity: 0.3,
                  },
                },
                "& .MuiTabScrollButton-root": {
                  width: { xs: 32, sm: 48 },
                  "&:first-of-type": {
                    ml: { xs: 0, sm: 1 },
                  },
                  "&:last-of-type": {
                    mr: { xs: 0, sm: 1 },
                  },
                },
              }}
            >
              <Tab
                label={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: { xs: 0.5, sm: 1 },
                      flexWrap: "nowrap",
                    }}
                  >
                    <span>Giảng viên</span>
                    <Chip
                      size="small"
                      label={lecturers.length}
                      color="primary"
                      sx={{
                        fontWeight: 600,
                        minWidth: "auto",
                        height: { xs: 18, sm: 20 },
                        fontSize: { xs: "0.7rem", sm: "0.75rem" },
                        "& .MuiChip-label": {
                          px: { xs: 0.5, sm: 1 },
                        },
                      }}
                    />
                  </Box>
                }
                value="1"
              />
              <Tab
                label={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: { xs: 0.5, sm: 1 },
                      flexWrap: "nowrap",
                    }}
                  >
                    <span>Tạo mới hồ sơ</span>
                    <Chip
                      size="small"
                      label={lecturerCreateList.length}
                      color="success"
                      sx={{
                        fontWeight: 600,
                        minWidth: "auto",
                        height: { xs: 18, sm: 20 },
                        fontSize: { xs: "0.7rem", sm: "0.75rem" },
                        "& .MuiChip-label": {
                          px: { xs: 0.5, sm: 1 },
                        },
                      }}
                    />
                  </Box>
                }
                value="2"
              />
              <Tab
                label={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: { xs: 0.5, sm: 1 },
                      flexWrap: "nowrap",
                    }}
                  >
                    <span>Cập nhật hồ sơ</span>
                    <Chip
                      size="small"
                      label={lecturerUpdateList.length}
                      color="warning"
                      sx={{
                        fontWeight: 600,
                        minWidth: "auto",
                        height: { xs: 18, sm: 20 },
                        fontSize: { xs: "0.7rem", sm: "0.75rem" },
                        "& .MuiChip-label": {
                          px: { xs: 0.5, sm: 1 },
                        },
                      }}
                    />
                  </Box>
                }
                value="3"
              />
              <Tab
                label={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: { xs: 0.5, sm: 1 },
                      flexWrap: "nowrap",
                    }}
                  >
                    <span style={{ whiteSpace: "nowrap" }}>
                      Chứng chỉ/Bằng cấp
                    </span>
                    <Chip
                      size="small"
                      label={lecturerRequestsDGCC.length}
                      color="secondary"
                      sx={{
                        fontWeight: 600,
                        minWidth: "auto",
                        height: { xs: 18, sm: 20 },
                        fontSize: { xs: "0.7rem", sm: "0.75rem" },
                        "& .MuiChip-label": {
                          px: { xs: 0.5, sm: 1 },
                        },
                      }}
                    />
                  </Box>
                }
                value="4"
              />
              <Tab
                label={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: { xs: 0.5, sm: 1 },
                      flexWrap: "nowrap",
                    }}
                  >
                    <span style={{ whiteSpace: "nowrap" }}>
                      Kinh nghiệm đào tạo
                    </span>
                    <Chip
                      size="small"
                      label={lecturerRequestsCourse.length}
                      color="info"
                      sx={{
                        fontWeight: 600,
                        minWidth: "auto",
                        height: { xs: 18, sm: 20 },
                        fontSize: { xs: "0.7rem", sm: "0.75rem" },
                        "& .MuiChip-label": {
                          px: { xs: 0.5, sm: 1 },
                        },
                      }}
                    />
                  </Box>
                }
                value="5"
              />
              <Tab
                label={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: { xs: 0.5, sm: 1 },
                      flexWrap: "nowrap",
                    }}
                  >
                    <span style={{ whiteSpace: "nowrap" }}>
                      Kinh nghiệm nghiên cứu
                    </span>
                    <Chip
                      size="small"
                      label={lecturerRequestsResearch.length}
                      color="success"
                      sx={{
                        fontWeight: 600,
                        minWidth: "auto",
                        height: { xs: 18, sm: 20 },
                        fontSize: { xs: "0.7rem", sm: "0.75rem" },
                        "& .MuiChip-label": {
                          px: { xs: 0.5, sm: 1 },
                        },
                      }}
                    />
                  </Box>
                }
                value="6"
              />
            </TabList>
          </Box>
        </Paper>

        {/* TAB 1 - MAIN LECTURER MANAGEMENT */}
        <TabPanel value="1" sx={{ p: 0 }}>
          <AdminLecturerMainTab
            lecturers={lecturers}
          />
        </TabPanel>

        {/* TAB 2 - CREATE LECTURER REQUESTS */}
        <TabPanel value="2" sx={{ p: 0 }}>
          <AdminLecturerCreateTab
            lecturerCreateList={lecturerCreateList}
          />
        </TabPanel>

        {/* TAB 3 - UPDATE LECTURER REQUESTS */}
        <TabPanel value="3" sx={{ p: 0 }}>
          <AdminLecturerUpdateTab
            lecturerUpdateList={lecturerUpdateList}
          />
        </TabPanel>

        {/* TAB 4 - DEGREE/CERTIFICATE REQUESTS */}
        <TabPanel value="4" sx={{ p: 0 }}>
          <AdminLecturerDegreeTab
            lecturerRequestsDGCC={lecturerRequestsDGCC}
          />
        </TabPanel>

        {/* TAB 5 - COURSE REQUESTS */}
        <TabPanel value="5" sx={{ p: 0 }}>
          <AdminLecturerCourseTab
            lecturerRequestsCourse={lecturerRequestsCourse}
          />
        </TabPanel>

        {/* TAB 6 - RESEARCH PROJECT REQUESTS */}
        <TabPanel value="6" sx={{ p: 0 }}>
          <AdminLecturerResearchTab
            lecturerRequestsResearch={lecturerRequestsResearch}
          />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default AdminLecturerPage;
