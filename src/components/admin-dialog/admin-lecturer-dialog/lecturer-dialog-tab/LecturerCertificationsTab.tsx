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

interface LecturerCertificationsTabProps {
  lecturerData: any;
  onAddCertification?: () => void;
  onEditCertification?: (certification: any) => void;
  onDeleteCertification?: (certification: any) => void;
  onApproveCertificationUpdate?: (certificationData: any) => void;
  onRejectCertificationUpdate?: (certificationData: any) => void;
}

const LecturerCertificationsTab: React.FC<LecturerCertificationsTabProps> = ({
  lecturerData,
  onAddCertification,
  onEditCertification,
  onDeleteCertification,
  onApproveCertificationUpdate,
  onRejectCertificationUpdate,
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
          Chứng chỉ ({lecturerData?.certifications?.length || 0})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddCertification}
        >
          Thêm chứng chỉ
        </Button>
      </Box>

      {lecturerData?.certifications?.map((certData: any, index: number) => (
        <Card key={certData.original?.id || index} sx={{ mb: 2 }}>
          <CardContent>
            {/* Original Certification */}
            <Box sx={{ mb: certData.update ? 2 : 0 }}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Thông tin gốc
                </Typography>
                <Chip
                  label={getStatus(certData.original?.status)}
                  color={getStatusColor(certData.original?.status) as any}
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
                    {certData.original?.name}
                  </Typography>
                  <Box display="flex" gap={2}>
                    <Box flex={1}>
                      <Typography variant="body2" color="text.secondary">
                        Cấp bởi: {certData.original?.issuedBy}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Ngày cấp: {formatDate(certData.original?.issueDate)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Cấp độ: {certData.original?.level}
                      </Typography>
                    </Box>
                    <Box flex={1}>
                      <Typography variant="body2" color="text.secondary">
                        Ngày hết hạn:{" "}
                        {certData.original?.expiryDate
                          ? formatDate(certData.original?.expiryDate)
                          : "Không có"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Mã tham chiếu: {certData.original?.referenceId}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {certData.original?.description}
                  </Typography>
                </Box>
                <Box display="flex" flexDirection="column" gap={1}>
                  <IconButton
                    size="small"
                    onClick={() => window.open(certData.original?.certificateUrl, "_blank")}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => onEditCertification?.(certData.original)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => onDeleteCertification?.(certData.original)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </Box>

            {/* Update Certification (if exists) */}
            {certData.update && (
              <>
                <Box sx={{ borderTop: 1, borderColor: "divider", pt: 2 }}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Typography variant="subtitle1" fontWeight="bold" color="warning.main">
                      Yêu cầu cập nhật
                    </Typography>
                    <Chip
                      label={getStatus(certData.update?.status)}
                      color={getStatusColor(certData.update?.status) as any}
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
                        {certData.update?.name}
                      </Typography>
                      <Box display="flex" gap={2}>
                        <Box flex={1}>
                          <Typography variant="body2" color="text.secondary">
                            Cấp bởi: {certData.update?.issuedBy}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Ngày cấp: {formatDate(certData.update?.issueDate)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Cấp độ: {certData.update?.level}
                          </Typography>
                        </Box>
                        <Box flex={1}>
                          <Typography variant="body2" color="text.secondary">
                            Ngày hết hạn:{" "}
                            {certData.update?.expiryDate
                              ? formatDate(certData.update?.expiryDate)
                              : "Không có"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Mã tham chiếu: {certData.update?.referenceId}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {certData.update?.description}
                      </Typography>
                      {certData.update?.adminNote && (
                        <Typography variant="body2" color="warning.main" sx={{ mt: 1, fontStyle: 'italic' }}>
                          Ghi chú: {certData.update?.adminNote}
                        </Typography>
                      )}
                    </Box>
                    <Box display="flex" flexDirection="column" gap={1}>
                      <IconButton
                        size="small"
                        onClick={() => window.open(certData.update?.certificateUrl, "_blank")}
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        onClick={() => onApproveCertificationUpdate?.(certData)}
                      >
                        Duyệt
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        onClick={() => onRejectCertificationUpdate?.(certData)}
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

export default LecturerCertificationsTab;
