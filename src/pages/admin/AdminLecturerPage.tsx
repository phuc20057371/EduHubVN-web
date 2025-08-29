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
const AdminLecturerMainTab = React.lazy(
  () => import("./tab/lecturer/AdminLecturerMainTab"),
);
const AdminLecturerCreateTab = React.lazy(
  () => import("./tab/lecturer/AdminLecturerCreateTab"),
);
const AdminLecturerUpdateTab = React.lazy(
  () => import("./tab/lecturer/AdminLecturerUpdateTab"),
);
const AdminLecturerDegreeTab = React.lazy(
  () => import("./tab/lecturer/AdminLecturerDegreeTab"),
);
const AdminLecturerCourseTab = React.lazy(
  () => import("./tab/lecturer/AdminLecturerCourseTab"),
);
const AdminLecturerResearchTab = React.lazy(
  () => import("./tab/lecturer/AdminLecturerResearchTab"),
);
import { setLecturerPendingCreate } from "../../redux/slice/LecturerPendingCreateSlice";
import { setLecturerPendingUpdate } from "../../redux/slice/LecturerPendingUpdateSlice";
import { setLecturers } from "../../redux/slice/LecturerSlice";
import { API } from "../../utils/Fetch";
import { setDegreeRequests } from "../../redux/slice/RequestDegreeSlice";
import { setCertificationRequests } from "../../redux/slice/RequestCertificationSlice";
import { setAttendedCourseRequests } from "../../redux/slice/RequestAttendedCourseSlice";
import { setOwnedCourseRequests } from "../../redux/slice/RequestOwnedCourseSlice";
import { setResearchProjectRequests } from "../../redux/slice/RequestResearchProjectSlice";
import { LinearProgress, Typography } from "@mui/material";

const AdminLecturerPage = () => {
  // TAB STATE & GENERAL FILTERS
  const [value, setValue] = useState("1");

  // REDUX SELECTORS
  const lecturerPendingCreate = useSelector(
    (state: any) => state.lecturerPendingCreate,
  );
  const lecturerCreateList = React.useMemo(
    () => (Array.isArray(lecturerPendingCreate) ? lecturerPendingCreate : []),
    [lecturerPendingCreate],
  );

  const lecturerPendingUpdate = useSelector(
    (state: any) => state.lecturerPendingUpdate,
  );
  const lecturerUpdateList = React.useMemo(
    () => (Array.isArray(lecturerPendingUpdate) ? lecturerPendingUpdate : []),
    [lecturerPendingUpdate],
  );

  // const lecturerRequests = useSelector((state: any) =>
  //   Array.isArray(state.lecturerRequests) ? state.lecturerRequests : [],
  // );

  const stateRequestDegree = useSelector((state: any) => state.requestDegree);
  const requestDegree = React.useMemo(
    () => (Array.isArray(stateRequestDegree) ? stateRequestDegree : []),
    [stateRequestDegree],
  );

  const stateRequestCertification = useSelector(
    (state: any) => state.requestCertification,
  );
  const requestCertification = React.useMemo(
    () =>
      Array.isArray(stateRequestCertification) ? stateRequestCertification : [],
    [stateRequestCertification],
  );

  const stateRequestAttendedCourse = useSelector(
    (state: any) => state.requestAttendedCourse,
  );
  const requestAttendedCourse = React.useMemo(
    () =>
      Array.isArray(stateRequestAttendedCourse)
        ? stateRequestAttendedCourse
        : [],
    [stateRequestAttendedCourse],
  );

  const stateRequestOwnedCourse = useSelector(
    (state: any) => state.requestOwnedCourse,
  );
  const requestOwnedCourse = React.useMemo(
    () =>
      Array.isArray(stateRequestOwnedCourse) ? stateRequestOwnedCourse : [],
    [stateRequestOwnedCourse],
  );

  const stateRequestResearchProject = useSelector(
    (state: any) => state.requestResearchProject,
  );
  const requestResearchProject = React.useMemo(
    () =>
      Array.isArray(stateRequestResearchProject)
        ? stateRequestResearchProject
        : [],
    [stateRequestResearchProject],
  );

  // TAB 4 - DEGREE/CERTIFICATE REQUEST DATA (requestDegree + requestCertification, sort by date)
  const lecturerRequestsDGCC = React.useMemo(() => {
    const all = [
      ...(Array.isArray(requestDegree) ? requestDegree : []),
      ...(Array.isArray(requestCertification) ? requestCertification : []),
    ];
    return all.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [requestDegree, requestCertification]);

  // TAB 5 - COURSE REQUEST DATA (requestAttendedCourse + requestOwnedCourse)
  const lecturerRequestsCourse = React.useMemo(() => {
    return [
      ...(Array.isArray(requestAttendedCourse) ? requestAttendedCourse : []),
      ...(Array.isArray(requestOwnedCourse) ? requestOwnedCourse : []),
    ];
  }, [requestAttendedCourse, requestOwnedCourse]);

  // TAB 6 - RESEARCH PROJECT REQUEST DATA (requestResearchProject)
  const lecturerRequestsResearch = React.useMemo(() => {
    return Array.isArray(requestResearchProject) ? requestResearchProject : [];
  }, [requestResearchProject]);

  const lecturers = useSelector((state: any) => state.lecturer || []);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.admin.getAllLecturers();
        dispatch(setLecturers(res.data.data));

        const resCreate = await API.admin.getLecturerPendingCreate();
        dispatch(setLecturerPendingCreate(resCreate.data.data));

        const resUpdate = await API.admin.getLecturerPendingUpdate();
        dispatch(setLecturerPendingUpdate(resUpdate.data.data));

        const resDegree = await API.admin.getDegreeRequests();
        dispatch(setDegreeRequests(resDegree.data.data));

        const resCertification = await API.admin.getCertificationRequests();
        dispatch(setCertificationRequests(resCertification.data.data));

        const resAttendedCourse = await API.admin.getAttendedCourseRequests();
        dispatch(setAttendedCourseRequests(resAttendedCourse.data.data));

        const resOwnedCourse = await API.admin.getOwnedCourseRequests();
        dispatch(setOwnedCourseRequests(resOwnedCourse.data.data));

        const resResearchProject = await API.admin.getResearchProjectRequests();
        dispatch(setResearchProjectRequests(resResearchProject.data.data));
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
          <React.Suspense
            fallback={
              <Box sx={{ width: "100%" }}>
                <LinearProgress />
                <Box sx={{ p: 4, textAlign: "center" }}>
                  <Typography variant="h6">Đang tải dữ liệu...</Typography>
                </Box>
              </Box>
            }
          >
            <AdminLecturerMainTab lecturers={lecturers} />
          </React.Suspense>
        </TabPanel>

        {/* TAB 2 - CREATE LECTURER REQUESTS */}
        <TabPanel value="2" sx={{ p: 0 }}>
          <React.Suspense
            fallback={
              <Box sx={{ width: "100%" }}>
                <LinearProgress />
                <Box sx={{ p: 4, textAlign: "center" }}>
                  <Typography variant="h6">Đang tải dữ liệu...</Typography>
                </Box>
              </Box>
            }
          >
            <AdminLecturerCreateTab lecturerCreateList={lecturerCreateList} />
          </React.Suspense>
        </TabPanel>

        {/* TAB 3 - UPDATE LECTURER REQUESTS */}
        <TabPanel value="3" sx={{ p: 0 }}>
          <React.Suspense
            fallback={
              <Box sx={{ width: "100%" }}>
                <LinearProgress />
                <Box sx={{ p: 4, textAlign: "center" }}>
                  <Typography variant="h6">Đang tải dữ liệu...</Typography>
                </Box>
              </Box>
            }
          >
            <AdminLecturerUpdateTab lecturerUpdateList={lecturerUpdateList} />
          </React.Suspense>
        </TabPanel>

        {/* TAB 4 - DEGREE/CERTIFICATE REQUESTS */}
        <TabPanel value="4" sx={{ p: 0 }}>
          <React.Suspense
            fallback={
              <Box sx={{ width: "100%" }}>
                <LinearProgress />
                <Box sx={{ p: 4, textAlign: "center" }}>
                  <Typography variant="h6">Đang tải dữ liệu...</Typography>
                </Box>
              </Box>
            }
          >
            <AdminLecturerDegreeTab
              lecturerRequestsDGCC={lecturerRequestsDGCC}
            />
          </React.Suspense>
        </TabPanel>

        {/* TAB 5 - COURSE REQUESTS */}
        <TabPanel value="5" sx={{ p: 0 }}>
          <React.Suspense
            fallback={
              <Box sx={{ width: "100%" }}>
                <LinearProgress />
                <Box sx={{ p: 4, textAlign: "center" }}>
                  <Typography variant="h6">Đang tải dữ liệu...</Typography>
                </Box>
              </Box>
            }
          >
            <AdminLecturerCourseTab
              lecturerRequestsCourse={lecturerRequestsCourse}
            />
          </React.Suspense>
        </TabPanel>

        {/* TAB 6 - RESEARCH PROJECT REQUESTS */}
        <TabPanel value="6" sx={{ p: 0 }}>
          <React.Suspense
            fallback={
              <Box sx={{ width: "100%" }}>
                <LinearProgress />
                <Box sx={{ p: 4, textAlign: "center" }}>
                  <Typography variant="h6">Đang tải dữ liệu...</Typography>
                </Box>
              </Box>
            }
          >
            <AdminLecturerResearchTab
              lecturerRequestsResearch={lecturerRequestsResearch}
            />
          </React.Suspense>
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default AdminLecturerPage;
