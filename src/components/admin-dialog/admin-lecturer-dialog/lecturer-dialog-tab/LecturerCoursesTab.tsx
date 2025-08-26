import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  formatDate,
  getStatus,
  getStatusColor,
} from "../../../../utils/ChangeText";

interface LecturerCoursesTabProps {
  lecturerData: any;
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

const LecturerCoursesTab: React.FC<LecturerCoursesTabProps> = ({
  lecturerData,
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
            Khóa học sở hữu ({lecturerData?.ownedCourses?.length || 0})
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

          {lecturerData?.ownedCourses?.map((courseData: any, index: number) => (
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
                        {courseData.original?.title}
                      </Typography>
                      <Box display="flex" gap={2}>
                        <Box flex={1}>
                          <Typography variant="body2" color="text.secondary">
                            Chủ đề: {courseData.original?.topic}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Loại khóa học: {courseData.original?.courseType}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Quy mô: {courseData.original?.scale}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Cấp độ: {courseData.original?.level}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Ngôn ngữ: {courseData.original?.language}
                          </Typography>
                        </Box>
                        <Box flex={1}>
                          <Typography variant="body2" color="text.secondary">
                            Bắt đầu: {formatDate(courseData.original?.startDate)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Kết thúc: {formatDate(courseData.original?.endDate)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Giá: {formatCurrency(courseData.original?.price)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Online: {courseData.original?.isOnline ? "Có" : "Không"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Địa chỉ: {courseData.original?.address}
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
                            {courseData.update?.title}
                          </Typography>
                          <Box display="flex" gap={2}>
                            <Box flex={1}>
                              <Typography variant="body2" color="text.secondary">
                                Chủ đề: {courseData.update?.topic}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Loại khóa học: {courseData.update?.courseType}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Quy mô: {courseData.update?.scale}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Cấp độ: {courseData.update?.level}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Ngôn ngữ: {courseData.update?.language}
                              </Typography>
                            </Box>
                            <Box flex={1}>
                              <Typography variant="body2" color="text.secondary">
                                Bắt đầu: {formatDate(courseData.update?.startDate)}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Kết thúc: {formatDate(courseData.update?.endDate)}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Giá: {formatCurrency(courseData.update?.price)}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Online: {courseData.update?.isOnline ? "Có" : "Không"}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Địa chỉ: {courseData.update?.address}
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
        </AccordionDetails>
      </Accordion>

      {/* Attended Courses Section */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">
            Khóa học đã tham gia ({lecturerData?.attendedCourses?.length || 0})
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

          {lecturerData?.attendedCourses?.map((courseData: any, index: number) => (
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
                        {courseData.original?.title}
                      </Typography>
                      <Box display="flex" gap={2}>
                        <Box flex={1}>
                          <Typography variant="body2" color="text.secondary">
                            Chủ đề: {courseData.original?.topic}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Tổ chức: {courseData.original?.organizer}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Địa điểm: {courseData.original?.location}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Loại khóa học: {courseData.original?.courseType}
                          </Typography>
                        </Box>
                        <Box flex={1}>
                          <Typography variant="body2" color="text.secondary">
                            Bắt đầu: {formatDate(courseData.original?.startDate)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Kết thúc: {formatDate(courseData.original?.endDate)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Số giờ: {courseData.original?.numberOfHour}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Quy mô: {courseData.original?.scale}
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
                            {courseData.update?.title}
                          </Typography>
                          <Box display="flex" gap={2}>
                            <Box flex={1}>
                              <Typography variant="body2" color="text.secondary">
                                Chủ đề: {courseData.update?.topic}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Tổ chức: {courseData.update?.organizer}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Địa điểm: {courseData.update?.location}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Loại khóa học: {courseData.update?.courseType}
                              </Typography>
                            </Box>
                            <Box flex={1}>
                              <Typography variant="body2" color="text.secondary">
                                Bắt đầu: {formatDate(courseData.update?.startDate)}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Kết thúc: {formatDate(courseData.update?.endDate)}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Số giờ: {courseData.update?.numberOfHour}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Quy mô: {courseData.update?.scale}
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
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default LecturerCoursesTab;
