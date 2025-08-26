import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  formatDate,
  getStatus,
  getStatusColor,
} from "../../../../utils/ChangeText";

interface LecturerResearchProjectsTabProps {
  lecturerData: any;
  onAddResearchProject?: () => void;
  onEditResearchProject?: (project: any) => void;
  onDeleteResearchProject?: (project: any) => void;
  onApproveResearchProjectUpdate?: (projectData: any) => void;
  onRejectResearchProjectUpdate?: (projectData: any) => void;
}

const LecturerResearchProjectsTab: React.FC<LecturerResearchProjectsTabProps> = ({
  lecturerData,
  onAddResearchProject,
  onEditResearchProject,
  onDeleteResearchProject,
  onApproveResearchProjectUpdate,
  onRejectResearchProjectUpdate,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h6">
          Dự án nghiên cứu ({lecturerData?.researchProjects?.length || 0})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddResearchProject}
        >
          Thêm dự án nghiên cứu
        </Button>
      </Box>

      {lecturerData?.researchProjects?.map((projectData: any, index: number) => (
        <Card key={projectData.original?.id || index} sx={{ mb: 2 }}>
          <CardContent>
            {/* Original Project */}
            <Box sx={{ mb: projectData.update ? 2 : 0 }}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Thông tin gốc
                </Typography>
                <Chip
                  label={getStatus(projectData.original?.status)}
                  color={getStatusColor(projectData.original?.status) as any}
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
                    {projectData.original?.title}
                  </Typography>
                  <Box display="flex" gap={2}>
                    <Box flex={1}>
                      <Typography variant="body2" color="text.secondary">
                        Lĩnh vực: {projectData.original?.researchArea}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Quy mô: {projectData.original?.scale}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Vai trò: {projectData.original?.roleInProject}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Loại dự án: {projectData.original?.projectType}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Nguồn tài trợ: {projectData.original?.foundingSource}
                      </Typography>
                    </Box>
                    <Box flex={1}>
                      <Typography variant="body2" color="text.secondary">
                        Bắt đầu: {formatDate(projectData.original?.startDate)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Kết thúc: {formatDate(projectData.original?.endDate)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Kinh phí: {formatCurrency(projectData.original?.foundingAmount)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Trạng thái dự án: {projectData.original?.courseStatus}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {projectData.original?.description}
                  </Typography>
                </Box>
                <Box display="flex" flexDirection="column" gap={1}>
                  <IconButton
                    size="small"
                    onClick={() => window.open(projectData.original?.publishedUrl, "_blank")}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => onEditResearchProject?.(projectData.original)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => onDeleteResearchProject?.(projectData.original)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </Box>

            {/* Update Project (if exists) */}
            {projectData.update && (
              <>
                <Box sx={{ borderTop: 1, borderColor: "divider", pt: 2 }}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Typography variant="subtitle1" fontWeight="bold" color="warning.main">
                      Yêu cầu cập nhật
                    </Typography>
                    <Chip
                      label={getStatus(projectData.update?.status)}
                      color={getStatusColor(projectData.update?.status) as any}
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
                        {projectData.update?.title}
                      </Typography>
                      <Box display="flex" gap={2}>
                        <Box flex={1}>
                          <Typography variant="body2" color="text.secondary">
                            Lĩnh vực: {projectData.update?.researchArea}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Quy mô: {projectData.update?.scale}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Vai trò: {projectData.update?.roleInProject}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Loại dự án: {projectData.update?.projectType}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Nguồn tài trợ: {projectData.update?.foundingSource}
                          </Typography>
                        </Box>
                        <Box flex={1}>
                          <Typography variant="body2" color="text.secondary">
                            Bắt đầu: {formatDate(projectData.update?.startDate)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Kết thúc: {formatDate(projectData.update?.endDate)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Kinh phí: {formatCurrency(projectData.update?.foundingAmount)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Trạng thái dự án: {projectData.update?.courseStatus}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {projectData.update?.description}
                      </Typography>
                      {projectData.update?.adminNote && (
                        <Typography variant="body2" color="warning.main" sx={{ mt: 1, fontStyle: 'italic' }}>
                          Ghi chú: {projectData.update?.adminNote}
                        </Typography>
                      )}
                    </Box>
                    <Box display="flex" flexDirection="column" gap={1}>
                      <IconButton
                        size="small"
                        onClick={() => window.open(projectData.update?.publishedUrl, "_blank")}
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        onClick={() => onApproveResearchProjectUpdate?.(projectData)}
                      >
                        Duyệt
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        onClick={() => onRejectResearchProjectUpdate?.(projectData)}
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
    </Box>
  );
};

export default LecturerResearchProjectsTab;
