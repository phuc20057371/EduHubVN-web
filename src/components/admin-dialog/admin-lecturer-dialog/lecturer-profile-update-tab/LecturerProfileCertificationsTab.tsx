import {
  Add,
  Assignment,
  CalendarToday,
  ExpandMore,
  Grade,
  Link as LinkIcon,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Chip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLecturerProfileUpdate } from "../../../../redux/slice/LecturerProfileUpdateSlice";
import { colors } from "../../../../theme/colors";
import {
  formatDate,
  formatDateToVietnamTime,
  getStatus,
} from "../../../../utils/ChangeText";
import { API } from "../../../../utils/Fetch";
import AddCertificationDialog from "../AddCertificationDialog";
import ApproveCertificationCreateDialog from "../ApproveCertificationCreateDialog";
import ApproveCertificationUpdateDialog from "../ApproveCertificationUpdateDialog";

interface LecturerProfileCertificationsTabProps {
  onAddCertification?: () => void;
  onEditCertification?: (certification: any) => void;
  onDeleteCertification?: (certification: any) => void;
  canCreateLecturer?: boolean;
  canApproveLecturer?: boolean;
}

const LecturerProfileCertificationsTab: React.FC<
  LecturerProfileCertificationsTabProps
> = (
  {
    // onAddCertification,
    // onEditCertification, onDeleteCertification
    canCreateLecturer = true,
    canApproveLecturer = true,
  },
) => {
  // Get lecturer data from Redux
  const lecturerProfileUpdate = useSelector(
    (state: any) => state.lecturerProfileUpdate,
  );
  const certifications = lecturerProfileUpdate?.certifications || [];

  const dispatch = useDispatch();

  // State for dialog handlers (similar to degrees tab)
  const [
    approveCertificationCreateDialog,
    setApproveCertificationCreateDialog,
  ] = useState<{
    open: boolean;
    data: any;
  }>({ open: false, data: null });

  const [
    approveCertificationUpdateDialog,
    setApproveCertificationUpdateDialog,
  ] = useState<{
    open: boolean;
    data: any;
  }>({ open: false, data: null });

  // State for AddCertificationDialog
  const [addCertificationDialog, setAddCertificationDialog] = useState(false);

  // Dialog handlers
  const handleOpenApproveCertificationCreateDialog = (
    certificationData: any,
  ) => {
    const formattedData = {
      content: certificationData.original,
      lecturerInfo: lecturerProfileUpdate.lecturer || {},
    };
    setApproveCertificationCreateDialog({ open: true, data: formattedData });
  };

  const handleCloseApproveCertificationCreateDialog = () => {
    setApproveCertificationCreateDialog({ open: false, data: null });
  };

  const handleOpenApproveCertificationUpdateDialog = (
    certificationData: any,
  ) => {
    const formattedData = {
      content: {
        original: certificationData.original,
        update: certificationData.update,
      },
      lecturerInfo: lecturerProfileUpdate.lecturer || {},
    };
    setApproveCertificationUpdateDialog({ open: true, data: formattedData });
  };

  const handleCloseApproveCertificationUpdateDialog = async () => {
    setApproveCertificationUpdateDialog({ open: false, data: null });
  };

  const handleSuccessApproveCertificationUpdateDialog = async () => {
    const response = await API.admin.getLecturerAllProfile({
      id: lecturerProfileUpdate.lecturer.id,
    });
    if (response.data.success) {
      dispatch(setLecturerProfileUpdate(response.data.data));
    }
  };

  const handleSuccessAddCertification = async () => {
    setAddCertificationDialog(false);
    // Refresh lecturer data after adding certification
    const response = await API.admin.getLecturerAllProfile({
      id: lecturerProfileUpdate.lecturer.id,
    });
    if (response.data.success) {
      dispatch(setLecturerProfileUpdate(response.data.data));
    }
  };

  // Function to get banner color based on status
  const getBannerColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)"; // Pastel Green
      case "PENDING":
        return "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)"; // Pastel Orange
      case "REJECTED":
        return "linear-gradient(135deg, #FEE2E2 0%, #FCA5A5 100%)"; // Pastel Red
      default:
        return `linear-gradient(135deg, ${colors.primary[100]} 0%, ${colors.secondary[100]} 100%)`; // Default pastel
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with Add button */}
      <div className="flex items-center justify-between">
        <Typography
          variant="h6"
          sx={{ color: colors.text.primary, fontWeight: 600 }}
        >
          Danh sách chứng chỉ ({certifications?.length || 0})
        </Typography>
        {canCreateLecturer && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setAddCertificationDialog(true)}
            sx={{
              background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.secondary[500]} 100%)`,
              color: "white",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: 2,
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              },
            }}
          >
            Thêm Chứng chỉ
          </Button>
        )}
      </div>
      {certifications && certifications.length > 0 ? (
        certifications.map((item: any) => (
          <Accordion
            key={item.original?.id || item.id}
            className="transition-all duration-300"
            sx={{
              borderRadius: 3,
              border: `1px solid ${colors.primary[100]}`,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              "&:before": {
                display: "none",
              },
              "&.Mui-expanded": {
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                transform: "translateY(-2px)",
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              sx={{
                background: getBannerColor(
                  item.original?.status || item.status,
                ),
                color: "#111827", // text-black
                borderRadius: "12px",
                "& .MuiAccordionSummary-expandIconWrapper": {
                  color: "#111827",
                },
                "&.Mui-expanded": {
                  borderRadius: "12px 12px 0 0",
                },
              }}
            >
              <div className="mr-4 flex w-full items-center justify-between">
                <div className="flex items-center gap-3">
                  <Box
                    className="rounded-lg p-2"
                    sx={{
                      background: "rgba(255,255,255,0.2)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <Assignment sx={{ color: "#111827" }} />
                  </Box>
                  <div>
                    <Typography
                      variant="h6"
                      className="font-bold"
                      sx={{ color: "#111827" }}
                    >
                      {item.original?.name || item.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#111827" }}>
                      {item.original?.issuedBy || item.issuedBy}
                    </Typography>
                    {(item.original?.referenceId || item.referenceId) && (
                      <Typography variant="caption" sx={{ color: "#374151" }}>
                        Reference ID:{" "}
                        {item.original?.referenceId || item.referenceId}
                      </Typography>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Chip
                    label={getStatus(item.original?.status || item.status)}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      background: "rgba(255,255,255,0.9)",
                      color:
                        (item.original?.status || item.status) === "APPROVED"
                          ? "#047857"
                          : (item.original?.status || item.status) === "PENDING"
                            ? "#D97706"
                            : "#DC2626",
                    }}
                  />
                  {(item.original?.status || item.status) === "PENDING" ? (
                    canApproveLecturer && (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() =>
                          handleOpenApproveCertificationCreateDialog(item)
                        }
                        sx={{
                          fontWeight: 600,
                          background: "rgba(255,255,255,0.9)",
                          color: "#1976d2",
                          textTransform: "none",
                          borderRadius: 2,
                          fontSize: "0.75rem",
                          px: 2,
                          py: 0.5,
                          "&:hover": {
                            background: "rgba(255,255,255,1)",
                            transform: "translateY(-1px)",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                          },
                        }}
                      >
                        Xem chi tiết
                      </Button>
                    )
                  ) : (
                    (item.original?.status || item.status) === "APPROVED" &&
                    item.update &&
                    item.update.status === "PENDING" &&
                    canApproveLecturer && (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() =>
                          handleOpenApproveCertificationUpdateDialog(item)
                        }
                        sx={{
                          fontWeight: 600,
                          background: "rgba(255,255,255,0.9)",
                          color: "#1976d2",
                          textTransform: "none",
                          borderRadius: 2,
                          fontSize: "0.75rem",
                          px: 2,
                          py: 0.5,
                          "&:hover": {
                            background: "rgba(255,255,255,1)",
                            transform: "translateY(-1px)",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                          },
                        }}
                      >
                        Xem yêu cầu cập nhật
                      </Button>
                    )
                  )}
                </div>
              </div>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                p: 0,
                background: "white",
                borderRadius: "0 0 12px 12px",
              }}
            >
              <Box className="p-6">
                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div
                    className="flex items-center gap-3 rounded-lg p-3"
                    style={{
                      background: colors.background.tertiary,
                    }}
                  >
                    <CalendarToday className="text-blue-600" fontSize="small" />
                    <div>
                      <Typography
                        variant="caption"
                        sx={{
                          color: colors.text.tertiary,
                          fontWeight: 600,
                        }}
                      >
                        Ngày cấp
                      </Typography>
                      <Typography variant="body2" className="font-medium">
                        {formatDate(item.original?.issueDate || item.issueDate)}
                      </Typography>
                    </div>
                  </div>
                  {(item.original?.expiryDate || item.expiryDate) && (
                    <div
                      className="flex items-center gap-3 rounded-lg p-3"
                      style={{
                        background: colors.background.tertiary,
                      }}
                    >
                      <CalendarToday
                        className="text-red-600"
                        fontSize="small"
                      />
                      <div>
                        <Typography
                          variant="caption"
                          sx={{
                            color: colors.text.tertiary,
                            fontWeight: 600,
                          }}
                        >
                          Ngày hết hạn
                        </Typography>
                        <Typography variant="body2" className="font-medium">
                          {formatDate(
                            item.original?.expiryDate || item.expiryDate,
                          )}
                        </Typography>
                      </div>
                    </div>
                  )}
                  <div
                    className="flex items-center gap-3 rounded-lg p-3"
                    style={{
                      background: colors.background.tertiary,
                    }}
                  >
                    <Grade className="text-green-600" fontSize="small" />
                    <div>
                      <Typography
                        variant="caption"
                        sx={{
                          color: colors.text.tertiary,
                          fontWeight: 600,
                        }}
                      >
                        Cấp độ
                      </Typography>
                      <Typography variant="body2" className="font-medium">
                        {item.original?.level || item.level}
                      </Typography>
                    </div>
                  </div>
                </div>

                {(item.original?.description || item.description) && (
                  <Box
                    className="mb-4 rounded-lg p-4"
                    sx={{ background: `${colors.primary[25]}` }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: colors.text.tertiary,
                        fontWeight: 600,
                      }}
                    >
                      Mô tả
                    </Typography>
                    <Typography
                      variant="body2"
                      className="mt-1"
                      sx={{
                        color: colors.text.secondary,
                        lineHeight: 1.6,
                      }}
                    >
                      {item.original?.description || item.description}
                    </Typography>
                  </Box>
                )}

                {(item.original?.adminNote || item.adminNote) && (
                  <Box
                    className="mb-4 rounded-lg p-3"
                    sx={{
                      background: "#FEF3C7",
                      border: "1px solid #F59E0B",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#92400E",
                        fontWeight: 600,
                      }}
                    >
                      Ghi chú của quản trị viên
                    </Typography>
                    <Typography
                      variant="body2"
                      className="mt-1"
                      sx={{ color: "#92400E" }}
                    >
                      {item.original?.adminNote || item.adminNote}
                    </Typography>
                  </Box>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 w-full">
                  {(item.original?.certificateUrl || item.certificateUrl) && (
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<LinkIcon />}
                      href={
                        item.original?.certificateUrl || item.certificateUrl
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.secondary[500]} 100%)`,
                        color: "white",
                        fontWeight: 600,
                        textTransform: "none",
                        borderRadius: 2,
                        "&:hover": {
                          transform: "translateY(-1px)",
                        },
                      }}
                    >
                      Xem tài liệu
                    </Button>
                  )}
                </div>
                {/* Thông tin thời gian tạo/cập nhật */}
                <div style={{ marginTop: 24, textAlign: "right" }}>
                  <Typography variant="body2" color="text.secondary">
                    Được tạo lúc:{" "}
                    {formatDateToVietnamTime(item.original?.createdAt)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cập nhật lần cuối:{" "}
                    {formatDateToVietnamTime(item.original?.updatedAt)}
                  </Typography>
                </div>
              </Box>
            </AccordionDetails>
          </Accordion>
        ))
      ) : (
        <Alert severity="info" className="text-center">
          Chưa có chứng chỉ nào được thêm
        </Alert>
      )}

      {/* ApproveCertificationCreateDialog */}
      {approveCertificationCreateDialog.open && (
        <ApproveCertificationCreateDialog
          open={approveCertificationCreateDialog.open}
          data={approveCertificationCreateDialog.data}
          onClose={handleCloseApproveCertificationCreateDialog}
        />
      )}

      {/* ApproveCertificationUpdateDialog */}
      {approveCertificationUpdateDialog.open && (
        <ApproveCertificationUpdateDialog
          open={approveCertificationUpdateDialog.open}
          data={approveCertificationUpdateDialog.data}
          onClose={handleCloseApproveCertificationUpdateDialog}
          onSuccess={handleSuccessApproveCertificationUpdateDialog}
        />
      )}

      {/* AddCertificationDialog */}
      {addCertificationDialog && (
        <AddCertificationDialog
          open={addCertificationDialog}
          onClose={() => setAddCertificationDialog(false)}
          lecturer={lecturerProfileUpdate.lecturer}
          onSuccess={handleSuccessAddCertification}
        />
      )}
    </div>
  );
};

export default LecturerProfileCertificationsTab;
