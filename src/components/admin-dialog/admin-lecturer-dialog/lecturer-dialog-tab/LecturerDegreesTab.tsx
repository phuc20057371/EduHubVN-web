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
  getStatus,
  getStatusColor,
} from "../../../../utils/ChangeText";

interface LecturerDegreesTabProps {
  lecturerData: any;
  onAddDegree?: () => void;
  onEditDegree?: (degree: any) => void;
  onDeleteDegree?: (degree: any) => void;
  onApproveDegreeUpdate?: (degreeData: any) => void;
  onRejectDegreeUpdate?: (degreeData: any) => void;
}

const LecturerDegreesTab: React.FC<LecturerDegreesTabProps> = ({
  lecturerData,
  onAddDegree,
  onEditDegree,
  onDeleteDegree,
  onApproveDegreeUpdate,
  onRejectDegreeUpdate,
}) => {
  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h6">
          Bằng cấp ({lecturerData?.degrees?.length || 0})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddDegree}
        >
          Thêm bằng cấp
        </Button>
      </Box>

      {lecturerData?.degrees?.map((degreeData: any, index: number) => (
        <Card key={degreeData.original?.id || index} sx={{ mb: 2 }}>
          <CardContent>
            {/* Original Degree */}
            <Box sx={{ mb: degreeData.update ? 2 : 0 }}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Thông tin gốc
                </Typography>
                <Chip
                  label={getStatus(degreeData.original?.status)}
                  color={getStatusColor(degreeData.original?.status) as any}
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
                    {degreeData.original?.name}
                  </Typography>
                  <Box display="flex" gap={2}>
                    <Box flex={1}>
                      <Typography variant="body2" color="text.secondary">
                        Chuyên ngành: {degreeData.original?.major}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Trường: {degreeData.original?.institution}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Cấp độ: {degreeData.original?.level}
                      </Typography>
                    </Box>
                    <Box flex={1}>
                      <Typography variant="body2" color="text.secondary">
                        Năm bắt đầu: {degreeData.original?.startYear}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Năm tốt nghiệp: {degreeData.original?.graduationYear}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Mã tham chiếu: {degreeData.original?.referenceId}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {degreeData.original?.description}
                  </Typography>
                </Box>
                <Box display="flex" flexDirection="column" gap={1}>
                  <IconButton
                    size="small"
                    onClick={() => window.open(degreeData.original?.url, "_blank")}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => onEditDegree?.(degreeData.original)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => onDeleteDegree?.(degreeData.original)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </Box>

            {/* Update Degree (if exists) */}
            {degreeData.update && (
              <>
                <Box sx={{ borderTop: 1, borderColor: "divider", pt: 2 }}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Typography variant="subtitle1" fontWeight="bold" color="warning.main">
                      Yêu cầu cập nhật
                    </Typography>
                    <Chip
                      label={getStatus(degreeData.update?.status)}
                      color={getStatusColor(degreeData.update?.status) as any}
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
                        {degreeData.update?.name}
                      </Typography>
                      <Box display="flex" gap={2}>
                        <Box flex={1}>
                          <Typography variant="body2" color="text.secondary">
                            Chuyên ngành: {degreeData.update?.major}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Trường: {degreeData.update?.institution}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Cấp độ: {degreeData.update?.level}
                          </Typography>
                        </Box>
                        <Box flex={1}>
                          <Typography variant="body2" color="text.secondary">
                            Năm bắt đầu: {degreeData.update?.startYear}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Năm tốt nghiệp: {degreeData.update?.graduationYear}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Mã tham chiếu: {degreeData.update?.referenceId}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {degreeData.update?.description}
                      </Typography>
                      {degreeData.update?.adminNote && (
                        <Typography variant="body2" color="warning.main" sx={{ mt: 1, fontStyle: 'italic' }}>
                          Ghi chú: {degreeData.update?.adminNote}
                        </Typography>
                      )}
                    </Box>
                    <Box display="flex" flexDirection="column" gap={1}>
                      <IconButton
                        size="small"
                        onClick={() => window.open(degreeData.update?.url, "_blank")}
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        onClick={() => onApproveDegreeUpdate?.(degreeData)}
                      >
                        Duyệt
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        onClick={() => onRejectDegreeUpdate?.(degreeData)}
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

export default LecturerDegreesTab;
