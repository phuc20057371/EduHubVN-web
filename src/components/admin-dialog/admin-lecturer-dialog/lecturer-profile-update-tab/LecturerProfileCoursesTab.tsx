import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useSelector } from "react-redux";
import { getStatus, getStatusColor, formatDate } from "../../../../utils/ChangeText";

interface LecturerProfileCoursesTabProps {
  onAddOwnedCourse?: () => void;
  onAddAttendedCourse?: () => void;
  onEditOwnedCourse?: (course: any) => void;
  onEditAttendedCourse?: (course: any) => void;
  onDeleteOwnedCourse?: (course: any) => void;
  onDeleteAttendedCourse?: (course: any) => void;
  onApproveOwnedCourseUpdate?: (courseData: any) => void;
  onRejectOwnedCourseUpdate?: (courseData: any) => void;
  onApproveAttendedCourseUpdate?: (courseData: any) => void;
  onRejectAttendedCourseUpdate?: (courseData: any) => void;
}

const LecturerProfileCoursesTab: React.FC<LecturerProfileCoursesTabProps> = ({
  onAddOwnedCourse,
  onAddAttendedCourse,
  onEditOwnedCourse,
  onEditAttendedCourse,
  onDeleteOwnedCourse,
  onDeleteAttendedCourse,
  onApproveOwnedCourseUpdate,
  onRejectOwnedCourseUpdate,
  onApproveAttendedCourseUpdate,
  onRejectAttendedCourseUpdate,
}) => {
  // Get lecturer data from Redux
  const lecturerProfileUpdate = useSelector((state: any) => state.lecturerProfileUpdate);
  const ownedCourses = lecturerProfileUpdate?.ownedCourses || [];
  const attendedCourses = lecturerProfileUpdate?.attendedCourses || [];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <Box>
      {/* Owned Courses Section */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">
            Khóa học sở hữu ({ownedCourses.length})
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box display="flex" justifyContent="flex-end" mb={2}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onAddOwnedCourse}
            >
              Thêm khóa học sở hữu
            </Button>
          </Box>

          {ownedCourses.map((courseData: any, index: number) => (
            <Card key={courseData.original?.id || index} sx={{ mb: 2 }}>
              <CardContent>
                {/* Original Course */}
                <Box sx={{ mb: courseData.update ? 2 : 0 }}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Thông tin gốc
                    </Typography>
                    <Chip
                      label={getStatus(courseData.original?.status)}
                      color={getStatusColor(courseData.original?.status) as any}
                      size="small"
                    />
                  </Box>
                  
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="start"
                  >
                    <Box flex={1}>
                      <Typography variant="h6" gutterBottom>
                        {courseData.original?.name}
                      </Typography>
                      <Box display="flex" gap={2}>
                        <Box flex={1}>
                          <Typography variant="body2" color="text.secondary">
                            Danh mục: {courseData.original?.category}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Thời lượng: {courseData.original?.duration} giờ
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Học phí: {formatCurrency(courseData.original?.tuitionFee || 0)}
                          </Typography>
                        </Box>
                        <Box flex={1}>
                          <Typography variant="body2" color="text.secondary">
                            Ngôn ngữ: {courseData.original?.language}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Ngày tạo: {formatDate(courseData.original?.createDate)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Trạng thái: {getStatus(courseData.original?.courseStatus)}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {courseData.original?.description}
                      </Typography>
                    </Box>
                    <Box display="flex" flexDirection="column" gap={1}>
                      <IconButton
                        size="small"
                        onClick={() => window.open(courseData.original?.courseUrl, "_blank")}
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => onEditOwnedCourse?.(courseData.original)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onDeleteOwnedCourse?.(courseData.original)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>

                {/* Update Course (if exists) */}
                {courseData.update && (
                  <>
                    <Box sx={{ borderTop: 1, borderColor: "divider", pt: 2 }}>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <Typography variant="subtitle1" fontWeight="bold" color="warning.main">
                          Yêu cầu cập nhật
                        </Typography>
                        <Chip
                          label={getStatus(courseData.update?.status)}
                          color={getStatusColor(courseData.update?.status) as any}
                          size="small"
                        />
                      </Box>
                      
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="start"
                      >
                        <Box flex={1}>
                          <Typography variant="h6" gutterBottom>
                            {courseData.update?.name}
                          </Typography>
                          <Box display="flex" gap={2}>
                            <Box flex={1}>
                              <Typography variant="body2" color="text.secondary">
                                Danh mục: {courseData.update?.category}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Thời lượng: {courseData.update?.duration} giờ
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Học phí: {formatCurrency(courseData.update?.tuitionFee || 0)}
                              </Typography>
                            </Box>
                            <Box flex={1}>
                              <Typography variant="body2" color="text.secondary">
                                Ngôn ngữ: {courseData.update?.language}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Trạng thái: {getStatus(courseData.update?.courseStatus)}
                              </Typography>
                            </Box>
                          </Box>
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {courseData.update?.description}
                          </Typography>
                          {courseData.update?.adminNote && (
                            <Typography variant="body2" color="warning.main" sx={{ mt: 1, fontStyle: 'italic' }}>
                              Ghi chú: {courseData.update?.adminNote}
                            </Typography>
                          )}
                        </Box>
                        <Box display="flex" flexDirection="column" gap={1}>
                          <IconButton
                            size="small"
                            onClick={() => window.open(courseData.update?.courseUrl, "_blank")}
                          >
                            <VisibilityIcon />
                          </IconButton>
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            onClick={() => onApproveOwnedCourseUpdate?.(courseData)}
                          >
                            Duyệt
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            color="error"
                            onClick={() => onRejectOwnedCourseUpdate?.(courseData)}
                          >
                            Từ chối
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>
          ))}

          {ownedCourses.length === 0 && (
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  Chưa có khóa học sở hữu nào
                </Typography>
              </CardContent>
            </Card>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Attended Courses Section */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">
            Khóa học đã tham gia ({attendedCourses.length})
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box display="flex" justifyContent="flex-end" mb={2}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onAddAttendedCourse}
            >
              Thêm khóa học đã tham gia
            </Button>
          </Box>

          {attendedCourses.map((courseData: any, index: number) => (
            <Card key={courseData.original?.id || index} sx={{ mb: 2 }}>
              <CardContent>
                {/* Original Course */}
                <Box sx={{ mb: courseData.update ? 2 : 0 }}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Thông tin gốc
                    </Typography>
                    <Chip
                      label={getStatus(courseData.original?.status)}
                      color={getStatusColor(courseData.original?.status) as any}
                      size="small"
                    />
                  </Box>
                  
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="start"
                  >
                    <Box flex={1}>
                      <Typography variant="h6" gutterBottom>
                        {courseData.original?.name}
                      </Typography>
                      <Box display="flex" gap={2}>
                        <Box flex={1}>
                          <Typography variant="body2" color="text.secondary">
                            Nền tảng: {courseData.original?.platform}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Thời lượng: {courseData.original?.duration} giờ
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Hoàn thành: {courseData.original?.completionPercentage}%
                          </Typography>
                        </Box>
                        <Box flex={1}>
                          <Typography variant="body2" color="text.secondary">
                            Ngày tham gia: {formatDate(courseData.original?.enrollmentDate)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Ngày hoàn thành: {formatDate(courseData.original?.completionDate)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Trạng thái: {getStatus(courseData.original?.courseStatus)}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {courseData.original?.description}
                      </Typography>
                    </Box>
                    <Box display="flex" flexDirection="column" gap={1}>
                      <IconButton
                        size="small"
                        onClick={() => window.open(courseData.original?.courseUrl, "_blank")}
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => onEditAttendedCourse?.(courseData.original)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onDeleteAttendedCourse?.(courseData.original)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>

                {/* Update Course (if exists) */}
                {courseData.update && (
                  <>
                    <Box sx={{ borderTop: 1, borderColor: "divider", pt: 2 }}>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <Typography variant="subtitle1" fontWeight="bold" color="warning.main">
                          Yêu cầu cập nhật
                        </Typography>
                        <Chip
                          label={getStatus(courseData.update?.status)}
                          color={getStatusColor(courseData.update?.status) as any}
                          size="small"
                        />
                      </Box>
                      
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="start"
                      >
                        <Box flex={1}>
                          <Typography variant="h6" gutterBottom>
                            {courseData.update?.name}
                          </Typography>
                          <Box display="flex" gap={2}>
                            <Box flex={1}>
                              <Typography variant="body2" color="text.secondary">
                                Nền tảng: {courseData.update?.platform}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Thời lượng: {courseData.update?.duration} giờ
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Hoàn thành: {courseData.update?.completionPercentage}%
                              </Typography>
                            </Box>
                            <Box flex={1}>
                              <Typography variant="body2" color="text.secondary">
                                Ngày tham gia: {formatDate(courseData.update?.enrollmentDate)}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Ngày hoàn thành: {formatDate(courseData.update?.completionDate)}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Trạng thái: {getStatus(courseData.update?.courseStatus)}
                              </Typography>
                            </Box>
                          </Box>
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {courseData.update?.description}
                          </Typography>
                          {courseData.update?.adminNote && (
                            <Typography variant="body2" color="warning.main" sx={{ mt: 1, fontStyle: 'italic' }}>
                              Ghi chú: {courseData.update?.adminNote}
                            </Typography>
                          )}
                        </Box>
                        <Box display="flex" flexDirection="column" gap={1}>
                          <IconButton
                            size="small"
                            onClick={() => window.open(courseData.update?.courseUrl, "_blank")}
                          >
                            <VisibilityIcon />
                          </IconButton>
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            onClick={() => onApproveAttendedCourseUpdate?.(courseData)}
                          >
                            Duyệt
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            color="error"
                            onClick={() => onRejectAttendedCourseUpdate?.(courseData)}
                          >
                            Từ chối
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>
          ))}

          {attendedCourses.length === 0 && (
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  Chưa có khóa học đã tham gia nào
                </Typography>
              </CardContent>
            </Card>
          )}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default LecturerProfileCoursesTab;
