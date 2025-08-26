import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Tab,
  Tabs,
  IconButton,
} from "@mui/material";
import type { Lecturer } from "../../../types/Lecturer";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ScienceIcon from "@mui/icons-material/Science";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { API } from "../../../utils/Fetch";
import { Close } from "@mui/icons-material";
import { setLecturerProfileUpdate } from "../../../redux/slice/LecturerProfileUpdateSlice";
import {
  LecturerProfileBasicInfoTab,
  LecturerProfileDegreesTab,
  LecturerProfileCertificationsTab,
  LecturerProfileCoursesTab,
  LecturerProfileResearchProjectsTab,
} from "./lecturer-profile-update-tab";

interface LecturerProfileUpdateDialogProps {
  open: boolean;
  onClose: () => void;
  lecturer?: Lecturer;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`lecturer-tabpanel-${index}`}
      aria-labelledby={`lecturer-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const LecturerProfileUpdateDialog = ({
  open,
  onClose,
  lecturer,
}: LecturerProfileUpdateDialogProps) => {
  if (!open || !lecturer) return null;
  const dispatch = useDispatch();

  // Tab state
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch full lecturer data when dialog opens
  useEffect(() => {
    if (open && lecturer?.id) {
      fetchLecturerData();
    }
  }, [open, lecturer?.id]);

  const fetchLecturerData = async () => {
    try {
      setLoading(true);
      const response = await API.admin.getLecturerAllProfile({
        id: lecturer.id,
      });
      if (response.data.success) {
        dispatch(setLecturerProfileUpdate(response.data.data));
        
        
      }
    } catch (error) {
      console.error("Error fetching lecturer data:", error);
      toast.error("Không thể tải dữ liệu giảng viên");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Handler functions for tab operations
  const handleRefreshData = async () => {
    await fetchLecturerData();
  };

  // Placeholder handlers for future implementation
  const handleAddDegree = () => {
    console.log("Add degree");
  };

  const handleEditDegree = (degree: any) => {
    console.log("Edit degree:", degree);
  };

  const handleDeleteDegree = (degree: any) => {
    console.log("Delete degree:", degree);
  };

  const handleApproveDegreeUpdate = (degreeData: any) => {
    console.log("Approve degree update:", degreeData);
  };

  const handleRejectDegreeUpdate = (degreeData: any) => {
    console.log("Reject degree update:", degreeData);
  };

  const handleAddCertification = () => {
    console.log("Add certification");
  };

  const handleEditCertification = (certification: any) => {
    console.log("Edit certification:", certification);
  };

  const handleDeleteCertification = (certification: any) => {
    console.log("Delete certification:", certification);
  };

  const handleApproveCertificationUpdate = (certificationData: any) => {
    console.log("Approve certification update:", certificationData);
  };

  const handleRejectCertificationUpdate = (certificationData: any) => {
    console.log("Reject certification update:", certificationData);
  };

  const handleAddOwnedCourse = () => {
    console.log("Add owned course");
  };

  const handleAddAttendedCourse = () => {
    console.log("Add attended course");
  };

  const handleEditOwnedCourse = (course: any) => {
    console.log("Edit owned course:", course);
  };

  const handleEditAttendedCourse = (course: any) => {
    console.log("Edit attended course:", course);
  };

  const handleDeleteOwnedCourse = (course: any) => {
    console.log("Delete owned course:", course);
  };

  const handleDeleteAttendedCourse = (course: any) => {
    console.log("Delete attended course:", course);
  };

  const handleApproveOwnedCourseUpdate = (courseData: any) => {
    console.log("Approve owned course update:", courseData);
  };

  const handleRejectOwnedCourseUpdate = (courseData: any) => {
    console.log("Reject owned course update:", courseData);
  };

  const handleApproveAttendedCourseUpdate = (courseData: any) => {
    console.log("Approve attended course update:", courseData);
  };

  const handleRejectAttendedCourseUpdate = (courseData: any) => {
    console.log("Reject attended course update:", courseData);
  };

  const handleAddResearchProject = () => {
    console.log("Add research project");
  };

  const handleEditResearchProject = (project: any) => {
    console.log("Edit research project:", project);
  };

  const handleDeleteResearchProject = (project: any) => {
    console.log("Delete research project:", project);
  };

  const handleApproveResearchProjectUpdate = (projectData: any) => {
    console.log("Approve research project update:", projectData);
  };

  const handleRejectResearchProjectUpdate = (projectData: any) => {
    console.log("Reject research project update:", projectData);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          height: "90vh",
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Quản lý hồ sơ giảng viên: {lecturer?.fullName}
        </Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ minHeight: 48 }}
        >
          <Tab
            icon={<PersonIcon />}
            label="Thông tin cơ bản"
            id="lecturer-tab-0"
            aria-controls="lecturer-tabpanel-0"
          />
          <Tab
            icon={<SchoolIcon />}
            label="Bằng cấp"
            id="lecturer-tab-1"
            aria-controls="lecturer-tabpanel-1"
          />
          <Tab
            icon={<WorkIcon />}
            label="Chứng chỉ"
            id="lecturer-tab-2"
            aria-controls="lecturer-tabpanel-2"
          />
          <Tab
            icon={<MenuBookIcon />}
            label="Khóa học"
            id="lecturer-tab-3"
            aria-controls="lecturer-tabpanel-3"
          />
          <Tab
            icon={<ScienceIcon />}
            label="Nghiên cứu"
            id="lecturer-tab-4"
            aria-controls="lecturer-tabpanel-4"
          />
        </Tabs>
      </Box>

      <DialogContent sx={{ p: 0, height: "70vh", overflow: "auto" }}>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <Typography>Đang tải dữ liệu...</Typography>
          </Box>
        ) : (
          <>
            <TabPanel value={tabValue} index={0}>
              <LecturerProfileBasicInfoTab
                onRefreshData={handleRefreshData}
              />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <LecturerProfileDegreesTab
                onAddDegree={handleAddDegree}
                onEditDegree={handleEditDegree}
                onDeleteDegree={handleDeleteDegree}
                onApproveDegreeUpdate={handleApproveDegreeUpdate}
                onRejectDegreeUpdate={handleRejectDegreeUpdate}
              />
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              <LecturerProfileCertificationsTab
                onAddCertification={handleAddCertification}
                onEditCertification={handleEditCertification}
                onDeleteCertification={handleDeleteCertification}
                onApproveCertificationUpdate={handleApproveCertificationUpdate}
                onRejectCertificationUpdate={handleRejectCertificationUpdate}
              />
            </TabPanel>
            <TabPanel value={tabValue} index={3}>
              <LecturerProfileCoursesTab
                onAddOwnedCourse={handleAddOwnedCourse}
                onAddAttendedCourse={handleAddAttendedCourse}
                onEditOwnedCourse={handleEditOwnedCourse}
                onEditAttendedCourse={handleEditAttendedCourse}
                onDeleteOwnedCourse={handleDeleteOwnedCourse}
                onDeleteAttendedCourse={handleDeleteAttendedCourse}
                onApproveOwnedCourseUpdate={handleApproveOwnedCourseUpdate}
                onRejectOwnedCourseUpdate={handleRejectOwnedCourseUpdate}
                onApproveAttendedCourseUpdate={handleApproveAttendedCourseUpdate}
                onRejectAttendedCourseUpdate={handleRejectAttendedCourseUpdate}
              />
            </TabPanel>
            <TabPanel value={tabValue} index={4}>
              <LecturerProfileResearchProjectsTab
                onAddResearchProject={handleAddResearchProject}
                onEditResearchProject={handleEditResearchProject}
                onDeleteResearchProject={handleDeleteResearchProject}
                onApproveResearchProjectUpdate={handleApproveResearchProjectUpdate}
                onRejectResearchProjectUpdate={handleRejectResearchProjectUpdate}
              />
            </TabPanel>
          </>
        )}
      </DialogContent>

      {/* <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={onClose}
          color="inherit"
          variant="outlined"
        >
          Đóng
        </Button>
      </DialogActions> */}
    </Dialog>
  );
};

export default LecturerProfileUpdateDialog;
