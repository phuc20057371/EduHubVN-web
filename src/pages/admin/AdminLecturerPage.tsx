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
import { setLecturerPendingCreate } from "../../redux/slice/LecturerPendingCreateSlice";
import { setLecturerPendingUpdate } from "../../redux/slice/LecturerPendingUpdateSlice";
import { setLecturerRequests } from "../../redux/slice/LecturerRquestSlice";
import { setLecturers } from "../../redux/slice/LecturerSlice";
import type { Lecturer } from "../../types/Lecturer";
import { API } from "../../utils/Fetch";
import { getAcademicRankLabel } from "../../utils/ValidateRegisterLecturer";
import { getStatusColor, getStatusLabel } from "../../utils/adminUtils";

type Order = "asc" | "desc";

const AdminLecturerPage = () => {
  // TAB STATE & GENERAL FILTERS
  const [value, setValue] = useState("1");
  
  // TAB 1 - MAIN LECTURER LIST FILTERS
  const [searchTerm, setSearchTerm] = useState("");
  const [academicRankFilter, setAcademicRankFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("APPROVED");

  // TAB 2 - CREATE LECTURER FILTERS
  const [createSearchTerm, setCreateSearchTerm] = useState("");
  const [createDateSort, setCreateDateSort] = useState("oldest");

  // TAB 3 - UPDATE LECTURER FILTERS
  const [updateSearchTerm, setUpdateSearchTerm] = useState("");
  const [updateDateSort, setUpdateDateSort] = useState("oldest");

  // TAB 4 - DEGREE/CERTIFICATE FILTERS
  const [degreeSearchTerm, setDegreeSearchTerm] = useState("");
  const [degreeTypeFilter, setDegreeTypeFilter] = useState("");
  const [degreeActionFilter, setDegreeActionFilter] = useState("");
  const [degreeDateSort, setDegreeDateSort] = useState("oldest");

  // TAB 5 - COURSE FILTERS
  const [courseSearchTerm, setCourseSearchTerm] = useState("");
  const [courseTypeFilter, setCourseTypeFilter] = useState("");
  const [courseActionFilter, setCourseActionFilter] = useState("");
  const [courseDateSort, setCourseDateSort] = useState("oldest");

  // TABLE SORTING & SELECTION
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Lecturer>("id");
  const [selected, setSelected] = React.useState<string | null>(null);

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

  // TAB 5 - COURSE REQUEST DATA
  const lecturerRequestsCourse = React.useMemo(
    () =>
      Array.isArray(lecturerRequests)
        ? lecturerRequests.filter(
            (req: any) =>
              req.type === "AC" || req.type === "OC" || req.type === "RP",
          )
        : [],
    [lecturerRequests],
  );

  const lecturers = useSelector((state: any) => state.lecturer || []);
  const dispatch = useDispatch();

  // DATA FETCHING
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.admin.getAllLecturers();
        dispatch(setLecturers(res.data.data));
        console.log(res.data.data);

        const response = await API.admin.getLecturerPendingCreate();
        dispatch(setLecturerPendingCreate(response.data.data));
        const updateResponse = await API.admin.getLecturerPendingUpdate();
        dispatch(setLecturerPendingUpdate(updateResponse.data.data));
        const responseData = await API.admin.getLecturerRequests();
        dispatch(setLecturerRequests(responseData.data.data));
        console.log(res.data.data);
      } catch (error) {
        console.error("Error initializing AdminLecturerPage:", error);
      }
    };

    fetchData();
  }, []);

  // TAB 1 - FILTERED LECTURER DATA
  const filteredLecturers = React.useMemo(() => {
    let filtered = lecturers;

    if (searchTerm) {
      filtered = filtered.filter(
        (lecturer: Lecturer) =>
          lecturer.id?.toString().includes(searchTerm) ||
          lecturer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lecturer.specialization
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          lecturer.jobField?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lecturer.phoneNumber?.includes(searchTerm),
      );
    }

    if (academicRankFilter) {
      filtered = filtered.filter(
        (lecturer: Lecturer) => lecturer.academicRank === academicRankFilter,
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(
        (lecturer: Lecturer) => lecturer.status === statusFilter,
      );
    }

    return filtered;
  }, [lecturers, searchTerm, academicRankFilter, statusFilter]);

  // TAB 2 - FILTERED CREATE REQUEST DATA
  const filteredCreateList = React.useMemo(() => {
    let filtered = lecturerCreateList;

    if (createSearchTerm) {
      filtered = filtered.filter(
        (item: any) =>
          item.lecturer.id?.toString().includes(createSearchTerm) ||
          item.lecturer.fullName
            ?.toLowerCase()
            .includes(createSearchTerm.toLowerCase()),
      );
    }

    filtered = [...filtered].sort((a: any, b: any) => {
      const dateA = new Date(a.lecturer.updatedAt || a.lecturer.createdAt || 0);
      const dateB = new Date(b.lecturer.updatedAt || b.lecturer.createdAt || 0);

      if (createDateSort === "oldest") {
        return dateA.getTime() - dateB.getTime();
      } else {
        return dateB.getTime() - dateA.getTime();
      }
    });

    return filtered;
  }, [lecturerCreateList, createSearchTerm, createDateSort]);

  // TAB 3 - FILTERED UPDATE REQUEST DATA
  const filteredUpdateList = React.useMemo(() => {
    let filtered = lecturerUpdateList;

    if (updateSearchTerm) {
      filtered = filtered.filter(
        (item: any) =>
          item.lecturer.id?.toString().includes(updateSearchTerm) ||
          item.lecturer.fullName
            ?.toLowerCase()
            .includes(updateSearchTerm.toLowerCase()),
      );
    }

    filtered = [...filtered].sort((a: any, b: any) => {
      const dateA = new Date(a.lecturer.updatedAt || a.lecturer.createdAt || 0);
      const dateB = new Date(b.lecturer.updatedAt || b.lecturer.createdAt || 0);

      if (updateDateSort === "oldest") {
        return dateA.getTime() - dateB.getTime();
      } else {
        return dateB.getTime() - dateA.getTime();
      }
    });

    return filtered;
  }, [lecturerUpdateList, updateSearchTerm, updateDateSort]);

  // TAB 4 - FILTERED DEGREE/CERTIFICATE DATA
  const filteredDegreeList = React.useMemo(() => {
    if (!Array.isArray(lecturerRequestsDGCC)) {
      return [];
    }

    let filtered = lecturerRequestsDGCC;

    if (degreeSearchTerm) {
      filtered = filtered.filter(
        (item: any) => {
          const searchTerm = degreeSearchTerm.toLowerCase();
          
          // Search by lecturer info
          const lecturerMatch = item.lecturerInfo?.fullName
            ?.toLowerCase()
            .includes(searchTerm);

          // Search by IDs
          const idMatch = 
            item.content?.id?.toString().includes(degreeSearchTerm) ||
            item.content?.original?.id?.toString().includes(degreeSearchTerm) ||
            item.content?.update?.id?.toString().includes(degreeSearchTerm);

          // Search by content - handle both direct content and nested original/update
          let contentMatch = false;
          
          // Check direct content
          if (item.content && !item.content.original && !item.content.update) {
            contentMatch = 
              item.content.name?.toLowerCase().includes(searchTerm) ||
              item.content.title?.toLowerCase().includes(searchTerm) ||
              item.content.description?.toLowerCase().includes(searchTerm) ||
              item.content.major?.toLowerCase().includes(searchTerm) ||
              item.content.institution?.toLowerCase().includes(searchTerm) ||
              item.content.level?.toLowerCase().includes(searchTerm) ||
              item.content.specialization?.toLowerCase().includes(searchTerm);
          }
          
          // Check original content
          if (item.content?.original) {
            contentMatch = contentMatch ||
              item.content.original.name?.toLowerCase().includes(searchTerm) ||
              item.content.original.title?.toLowerCase().includes(searchTerm) ||
              item.content.original.description?.toLowerCase().includes(searchTerm) ||
              item.content.original.major?.toLowerCase().includes(searchTerm) ||
              item.content.original.institution?.toLowerCase().includes(searchTerm) ||
              item.content.original.level?.toLowerCase().includes(searchTerm) ||
              item.content.original.specialization?.toLowerCase().includes(searchTerm);
          }
          
          // Check update content
          if (item.content?.update) {
            contentMatch = contentMatch ||
              item.content.update.name?.toLowerCase().includes(searchTerm) ||
              item.content.update.title?.toLowerCase().includes(searchTerm) ||
              item.content.update.description?.toLowerCase().includes(searchTerm) ||
              item.content.update.major?.toLowerCase().includes(searchTerm) ||
              item.content.update.institution?.toLowerCase().includes(searchTerm) ||
              item.content.update.level?.toLowerCase().includes(searchTerm) ||
              item.content.update.specialization?.toLowerCase().includes(searchTerm);
          }

          return lecturerMatch || idMatch || contentMatch;
        }
      );
    }

    if (degreeTypeFilter) {
      filtered = filtered.filter((item: any) => item.type === degreeTypeFilter);
    }

    if (degreeActionFilter) {
      filtered = filtered.filter((item: any) => item.label === degreeActionFilter);
    }

    filtered = [...filtered].sort((a: any, b: any) => {
      const dateA = new Date(
        a.date || a.content?.updatedAt || a.content?.createdAt || 0,
      );
      const dateB = new Date(
        b.date || b.content?.updatedAt || b.content?.createdAt || 0,
      );

      if (degreeDateSort === "oldest") {
        return dateA.getTime() - dateB.getTime();
      } else {
        return dateB.getTime() - dateA.getTime();
      }
    });
    return filtered;
  }, [
    lecturerRequestsDGCC,
    degreeSearchTerm,
    degreeTypeFilter,
    degreeActionFilter,
    degreeDateSort,
  ]);

  // TAB 5 - FILTERED COURSE DATA
  const filteredCourseList = React.useMemo(() => {
    if (!Array.isArray(lecturerRequestsCourse)) {
      return [];
    }

    let filtered = lecturerRequestsCourse;

    if (courseSearchTerm) {
      filtered = filtered.filter(
        (item: any) => {
          const searchTerm = courseSearchTerm.toLowerCase();
          
          // Search by lecturer info
          const lecturerMatch = item.lecturerInfo?.fullName
            ?.toLowerCase()
            .includes(searchTerm);

          // Search by IDs
          const idMatch = 
            item.content?.id?.toString().includes(courseSearchTerm) ||
            item.content?.original?.id?.toString().includes(courseSearchTerm);

          // Search by content - handle both direct content and nested original
          let contentMatch = false;
          
          // Check direct content
          if (item.content && !item.content.original) {
            contentMatch = 
              item.content.name?.toLowerCase().includes(searchTerm) ||
              item.content.title?.toLowerCase().includes(searchTerm) ||
              item.content.description?.toLowerCase().includes(searchTerm) ||
              item.content.category?.toLowerCase().includes(searchTerm) ||
              item.content.level?.toLowerCase().includes(searchTerm) ||
              item.content.duration?.toString().includes(courseSearchTerm) ||
              item.content.price?.toString().includes(courseSearchTerm);
          }
          
          // Check original content
          if (item.content?.original) {
            contentMatch = contentMatch ||
              item.content.original.name?.toLowerCase().includes(searchTerm) ||
              item.content.original.title?.toLowerCase().includes(searchTerm) ||
              item.content.original.description?.toLowerCase().includes(searchTerm) ||
              item.content.original.category?.toLowerCase().includes(searchTerm) ||
              item.content.original.level?.toLowerCase().includes(searchTerm) ||
              item.content.original.duration?.toString().includes(courseSearchTerm) ||
              item.content.original.price?.toString().includes(courseSearchTerm);
          }

          return lecturerMatch || idMatch || contentMatch;
        }
      );
    }

    if (courseTypeFilter) {
      filtered = filtered.filter((item: any) => item.type === courseTypeFilter);
    }

    if (courseActionFilter) {
      filtered = filtered.filter((item: any) => item.label === courseActionFilter);
    }

    filtered = [...filtered].sort((a: any, b: any) => {
      const dateA = new Date(
        a.date || a.content?.updatedAt || a.content?.createdAt || 0,
      );
      const dateB = new Date(
        b.date || b.content?.updatedAt || b.content?.createdAt || 0,
      );

      if (courseDateSort === "oldest") {
        return dateA.getTime() - dateB.getTime();
      } else {
        return dateB.getTime() - dateA.getTime();
      }
    });

    return filtered;
  }, [lecturerRequestsCourse, courseSearchTerm, courseTypeFilter, courseActionFilter, courseDateSort]);

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
                      label={filteredLecturers.length}
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
                    <span>Tạo mới</span>
                    <Chip
                      size="small"
                      label={filteredCreateList.length}
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
                    <span>Cập nhật</span>
                    <Chip
                      size="small"
                      label={filteredUpdateList.length}
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
                      label={filteredDegreeList.length}
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
                    <span style={{ whiteSpace: "nowrap" }}>Khóa đào tạo</span>
                    <Chip
                      size="small"
                      label={filteredCourseList.length}
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
            </TabList>
          </Box>
        </Paper>

        {/* TAB 1 - MAIN LECTURER MANAGEMENT */}
        <TabPanel value="1" sx={{ p: 0 }}>
          <AdminLecturerMainTab
            filteredLecturers={filteredLecturers}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            academicRankFilter={academicRankFilter}
            setAcademicRankFilter={setAcademicRankFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            order={order}
            setOrder={setOrder}
            orderBy={orderBy}
            setOrderBy={setOrderBy}
            selected={selected}
            setSelected={setSelected}
            lecturers={lecturers}
            getStatusColor={getStatusColor}
            getStatusLabel={getStatusLabel}
            getAcademicRankLabel={getAcademicRankLabel}
          />
        </TabPanel>

        {/* TAB 2 - CREATE LECTURER REQUESTS */}
        <TabPanel value="2" sx={{ p: 0 }}>
          <AdminLecturerCreateTab
            filteredCreateList={filteredCreateList}
            createSearchTerm={createSearchTerm}
            setCreateSearchTerm={setCreateSearchTerm}
            createDateSort={createDateSort}
            setCreateDateSort={setCreateDateSort}
            getAcademicRankLabel={getAcademicRankLabel}
          />
        </TabPanel>

        {/* TAB 3 - UPDATE LECTURER REQUESTS */}
        <TabPanel value="3" sx={{ p: 0 }}>
          <AdminLecturerUpdateTab
            filteredUpdateList={filteredUpdateList}
            updateSearchTerm={updateSearchTerm}
            setUpdateSearchTerm={setUpdateSearchTerm}
            updateDateSort={updateDateSort}
            setUpdateDateSort={setUpdateDateSort}
            getAcademicRankLabel={getAcademicRankLabel}
          />
        </TabPanel>

        {/* TAB 4 - DEGREE/CERTIFICATE REQUESTS */}
        <TabPanel value="4" sx={{ p: 0 }}>
          <AdminLecturerDegreeTab
            filteredDegreeList={filteredDegreeList}
            degreeSearchTerm={degreeSearchTerm}
            setDegreeSearchTerm={setDegreeSearchTerm}
            degreeTypeFilter={degreeTypeFilter}
            setDegreeTypeFilter={setDegreeTypeFilter}
            degreeActionFilter={degreeActionFilter}
            setDegreeActionFilter={setDegreeActionFilter}
            degreeDateSort={degreeDateSort}
            setDegreeDateSort={setDegreeDateSort}
          />
        </TabPanel>

        {/* TAB 5 - COURSE REQUESTS */}
        <TabPanel value="5" sx={{ p: 0 }}>
          <AdminLecturerCourseTab
            filteredCourseList={filteredCourseList}
            courseSearchTerm={courseSearchTerm}
            setCourseSearchTerm={setCourseSearchTerm}
            courseTypeFilter={courseTypeFilter}
            setCourseTypeFilter={setCourseTypeFilter}
            courseActionFilter={courseActionFilter}
            setCourseActionFilter={setCourseActionFilter}
            courseDateSort={courseDateSort}
            setCourseDateSort={setCourseDateSort}
          />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default AdminLecturerPage;
