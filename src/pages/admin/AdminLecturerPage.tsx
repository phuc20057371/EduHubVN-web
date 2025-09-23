import { useEffect, useState, type SyntheticEvent } from "react";

import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
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
import CreateLecturerDialog from "../../components/admin-dialog/admin-lecturer-dialog/CreateLecturerDialog";

const AdminLecturerPage = () => {
  // PERMISSION CHECKS FIRST (before useState)
  const userProfile = useSelector((state: any) => state.userProfile);

  const canViewLecturerTab = React.useMemo(() => {
    console.log("Checking lecturer tab permission for user:", userProfile?.role, userProfile?.permissions);
    if (userProfile.role === "ADMIN") return true;
    if (userProfile.role === "SUB_ADMIN") {
      return userProfile.permissions?.includes("LECTURER_READ");
    }
    return false;
  }, [userProfile]);

  const canViewApprovalTabs = React.useMemo(() => {
    console.log("Checking approval tabs permission for user:", userProfile?.role, userProfile?.permissions);
    if (userProfile.role === "ADMIN") return true;
    if (userProfile.role === "SUB_ADMIN") {
      return userProfile.permissions?.includes("LECTURER_APPROVE");
    }
    return false;
  }, [userProfile]);

  const canEditLecturer = React.useMemo(() => {
    if (userProfile.role === "ADMIN") return true;
    if (userProfile.role === "SUB_ADMIN") {
      return userProfile.permissions?.includes("LECTURER_UPDATE");
    }
    return false;
  }, [userProfile]);

  const canDeleteLecturer = React.useMemo(() => {
    if (userProfile.role === "ADMIN") return true;
    if (userProfile.role === "SUB_ADMIN") {
      return userProfile.permissions?.includes("LECTURER_DELETE");
    }
    return false;
  }, [userProfile]);

  const canCreateLecturer = React.useMemo(() => {
    if (userProfile.role === "ADMIN") return true;
    if (userProfile.role === "SUB_ADMIN") {
      return userProfile.permissions?.includes("LECTURER_CREATE");
    }
    return false;
  }, [userProfile]);

  // Get the first available tab value based on permissions
  const getFirstAvailableTab = () => {
    if (canViewLecturerTab) return "1";
    if (canViewApprovalTabs) return "2";
    return "1"; // fallback
  };

  // TAB STATE & GENERAL FILTERS
  const [value, setValue] = useState(() => getFirstAvailableTab());
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  // Update tab when permissions change
  useEffect(() => {
    const currentTab = getFirstAvailableTab();
    console.log("useEffect - Current tab:", value, "First available:", currentTab);
    if (value !== currentTab) {
      console.log("Updating tab from", value, "to", currentTab);
      setValue(currentTab);
    }
  }, [canViewLecturerTab, canViewApprovalTabs]); // Remove 'value' from dependencies to avoid loop

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

  // Refresh data function
  const refreshData = async () => {
    try {
      if (userProfile.role === "ADMIN") {
        const res = await API.admin.getAllLecturers();
        dispatch(setLecturers(res.data.data));
        console.log("Refreshed all lecturers for ADMIN", res.data.data.length);
        

        const resCreate = await API.admin.getLecturerPendingCreate();
        dispatch(setLecturerPendingCreate(resCreate.data.data));
        console.log("Refreshed lecturer pending create requests for ADMIN", resCreate.data.data.length);

        const resUpdate = await API.admin.getLecturerPendingUpdate();
        dispatch(setLecturerPendingUpdate(resUpdate.data.data));
        console.log("Refreshed lecturer pending update requests for ADMIN", resUpdate.data.data.length);

        const resDegree = await API.admin.getDegreeRequests();
        dispatch(setDegreeRequests(resDegree.data.data));
        console.log("Refreshed degree requests for ADMIN", resDegree.data.data.length);

        const resCert = await API.admin.getCertificationRequests();
        dispatch(setCertificationRequests(resCert.data.data));
        console.log("Refreshed certification requests for ADMIN", resCert.data.data.length);

        const resAttended = await API.admin.getAttendedCourseRequests();
        dispatch(setAttendedCourseRequests(resAttended.data.data));
        console.log("Refreshed attended course requests for ADMIN", resAttended.data.data.length);

        const resOwned = await API.admin.getOwnedCourseRequests();
        dispatch(setOwnedCourseRequests(resOwned.data.data));
        console.log("Refreshed owned course requests for ADMIN", resOwned.data.data.length);

        const resResearchProject = await API.admin.getResearchProjectRequests();
        dispatch(setResearchProjectRequests(resResearchProject.data.data));
        console.log("Refreshed research project requests for ADMIN", resResearchProject.data.data.length);
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userProfile.role === "ADMIN") {
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

          const resResearchProject =
            await API.admin.getResearchProjectRequests();
          dispatch(setResearchProjectRequests(resResearchProject.data.data));
        } else if (userProfile.role === "SUB_ADMIN") {
          if (userProfile.permissions.includes("LECTURER_READ")) {
            const res = await API.admin.getAllLecturers();
            dispatch(setLecturers(res.data.data));
          }
          if (userProfile.permissions.includes("LECTURER_APPROVE")) {
            const resCreate = await API.admin.getLecturerPendingCreate();
            dispatch(setLecturerPendingCreate(resCreate.data.data));
            const resUpdate = await API.admin.getLecturerPendingUpdate();
            dispatch(setLecturerPendingUpdate(resUpdate.data.data));
            const resDegree = await API.admin.getDegreeRequests();
            dispatch(setDegreeRequests(resDegree.data.data));
            const resCertification = await API.admin.getCertificationRequests();
            dispatch(setCertificationRequests(resCertification.data.data));
            const resAttendedCourse =
              await API.admin.getAttendedCourseRequests();
            dispatch(setAttendedCourseRequests(resAttendedCourse.data.data));
            const resOwnedCourse = await API.admin.getOwnedCourseRequests();
            dispatch(setOwnedCourseRequests(resOwnedCourse.data.data));
            const resResearchProject =
              await API.admin.getResearchProjectRequests();
            dispatch(setResearchProjectRequests(resResearchProject.data.data));
          }
        }
      } catch (error) {
        console.error("Error initializing AdminLecturerPage:", error);
      }
    };
    
    // Chỉ chạy fetchData khi userProfile đã có và có role
    if (userProfile && userProfile.role) {
      fetchData();
    }
  }, [userProfile]);

  // EVENT HANDLERS
  const handleChange = (_event: SyntheticEvent, newValue: string) => {
    console.log("=== TAB CHANGE EVENT ===");
    console.log("Tab change requested:", newValue, "Current:", value);
    console.log("Permissions:", { canViewLecturerTab, canViewApprovalTabs });
    
    // Only allow switching to tabs user has permission for
    const tabNumber = parseInt(newValue);
    if (tabNumber === 1 && canViewLecturerTab) {
      console.log("✅ Switching to lecturer tab");
      setValue(newValue);
    } else if (tabNumber >= 2 && tabNumber <= 6 && canViewApprovalTabs) {
      console.log("✅ Switching to approval tab");
      setValue(newValue);
    } else {
      console.log("❌ Tab change blocked due to permissions");
    }
    console.log("=== END TAB CHANGE ===");
  };

  const handleCreateSuccess = async () => {
    // Refresh lecturer data after successful creation
    try {
      const res = await API.admin.getAllLecturers();
      dispatch(setLecturers(res.data.data));
    } catch (error) {
      console.error("Error refreshing lecturer data:", error);
    }
  };

  // Create tabs array based on permissions
  const availableTabs = React.useMemo(() => {
    console.log("Creating available tabs with permissions:", { canViewLecturerTab, canViewApprovalTabs });
    const tabs = [];

    // Tab 1 - Lecturer List
    if (canViewLecturerTab) {
      console.log("Adding lecturer tab");
      tabs.push(
        <Tab
          key="tab-1"
          label="Giảng viên"
          value="1"
        />
      );
    }

    // Tabs 2-6 - Approval Tabs
    if (canViewApprovalTabs) {
      console.log("Adding approval tabs");
      tabs.push(
        <Tab
          key="tab-2"
          label="Tạo mới hồ sơ"
          value="2"
        />,
        <Tab
          key="tab-3"
          label="Cập nhật hồ sơ"
          value="3"
        />,
        <Tab
          key="tab-4"
          label="Chứng chỉ/Bằng cấp"
          value="4"
        />,
        <Tab
          key="tab-5"
          label="Kinh nghiệm đào tạo"
          value="5"
        />,
        <Tab
          key="tab-6"
          label="Kinh nghiệm nghiên cứu"
          value="6"
        />
      );
    }

    console.log("Total tabs created:", tabs.length);
    return tabs;
  }, [canViewLecturerTab, canViewApprovalTabs]); // Simplify dependencies to only permissions

  // RENDER COMPONENT
  // If user has no permissions, show access denied message
  if (userProfile && userProfile.role === "SUB_ADMIN" && !canViewLecturerTab && !canViewApprovalTabs) {
    return (
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
          p: 3,
        }}
      >
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 1,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <Typography variant="h5" color="error" gutterBottom>
            Không có quyền truy cập
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Bạn không có quyền truy cập vào trang quản lý giảng viên.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        typography: "body1",
        // bgcolor: "background.default",
        minHeight: "100vh",
        p: 3,
      }}
    >
      <TabContext value={value}>
        {/* TAB NAVIGATION */}
        <Paper
          sx={{
            mb: 3,
            borderRadius: 1,
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              bgcolor: "background.paper",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              pr: 2,
            }}
          >
            <TabList
              onChange={handleChange}
              aria-label="lecturer management tabs"
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                flex: 1,
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
              {availableTabs}
            </TabList>
          </Box>
        </Paper>

        {/* TAB PANELS */}
        {/* TAB 1 - MAIN LECTURER MANAGEMENT */}
        {canViewLecturerTab && (
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
              <AdminLecturerMainTab 
                lecturers={lecturers}
                canEdit={canEditLecturer}
                canDelete={canDeleteLecturer}
                canCreate={canCreateLecturer}
                onCreateClick={() => setOpenCreateDialog(true)}
                onRefresh={refreshData}
              />
            </React.Suspense>
          </TabPanel>
        )}

        {/* TAB 2 - CREATE LECTURER REQUESTS */}
        {canViewApprovalTabs && (
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
        )}

        {/* TAB 3 - UPDATE LECTURER REQUESTS */}
        {canViewApprovalTabs && (
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
        )}

        {/* TAB 4 - DEGREE/CERTIFICATE REQUESTS */}
        {canViewApprovalTabs && (
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
        )}

        {/* TAB 5 - COURSE REQUESTS */}
        {canViewApprovalTabs && (
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
        )}

        {/* TAB 6 - RESEARCH PROJECT REQUESTS */}
        {canViewApprovalTabs && (
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
        )}
      </TabContext>

      {/* Create Lecturer Dialog */}
      <CreateLecturerDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        onSuccess={handleCreateSuccess}
      />
    </Box>
  );
};

export default AdminLecturerPage;
