import {
  Business,
  CalendarToday,
  ExpandMore,
  Grade,
  Link as LinkIcon,
  School,
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
import { formatDateToVietnamTime, getStatus } from "../../../../utils/ChangeText";
import { API } from "../../../../utils/Fetch";
import ApproveDegreeCreateDialog from "../ApproveDegreeCreateDialog";
import ApproveDegreeUpdateDialog from "../ApproveDegreeUpdateDialog";

interface LecturerProfileDegreesTabProps {
  onAddDegree?: () => void;
  onEditDegree?: (degree: any) => void;
  onDeleteDegree?: (degree: any) => void;
}

const LecturerProfileDegreesTab: React.FC<LecturerProfileDegreesTabProps> = (
  {
    // onAddDegree,
    // onEditDegree,
    // onDeleteDegree,
  },
) => {
  // Get lecturer data from Redux
  const lecturerProfileUpdate = useSelector(
    (state: any) => state.lecturerProfileUpdate,
  );
  const degrees = lecturerProfileUpdate?.degrees || [];

  const dispatch = useDispatch();

  // State for ApproveDegreeCreateDialog
  const [approveCreateDialog, setApproveCreateDialog] = useState<{
    open: boolean;
    data: any;
  }>({ open: false, data: null });

  // State for ApproveDegreeUpdateDialog
  const [approveUpdateDialog, setApproveUpdateDialog] = useState<{
    open: boolean;
    data: any;
  }>({ open: false, data: null });

  const handleOpenApproveCreateDialog = (degreeData: any) => {
    // Format data for ApproveDegreeCreateDialog
    const formattedData = {
      content: degreeData.original,
      lecturerInfo: lecturerProfileUpdate.lecturer || {},
    };
    setApproveCreateDialog({ open: true, data: formattedData });
  };
  const handleSuccessApproveUpdateDialog = async () => {
    const response = await API.admin.getLecturerAllProfile({
      id: lecturerProfileUpdate.lecturer.id,
    });
    if (response.data.success) {
      dispatch(setLecturerProfileUpdate(response.data.data));
    }
    console.log("after", lecturerProfileUpdate);
  };

  const handleCloseApproveCreateDialog = () => {
    setApproveCreateDialog({ open: false, data: null });
  };

  const handleOpenApproveUpdateDialog = (degreeData: any) => {
    // Format data for ApproveDegreeUpdateDialog
    const formattedData = {
      content: {
        original: degreeData.original,
        update: degreeData.update,
      },
      lecturerInfo: lecturerProfileUpdate.lecturer || {},
    };
    setApproveUpdateDialog({ open: true, data: formattedData });
  };

  const handleCloseApproveUpdateDialog = async () => {
    setApproveUpdateDialog({ open: false, data: null });
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
          Danh sách bằng cấp ({degrees?.length || 0})
        </Typography>

        {/* <Button
          variant="contained"
          startIcon={<Add />}
          onClick={onAddDegree}
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
          Thêm bằng cấp
        </Button> */}
      </div>

      {degrees && degrees.length > 0 ? (
        degrees.map((degreeData: any, index: number) => (
          <Accordion
            key={degreeData.original?.id || index}
            className="transition-all duration-300"
            sx={{
              borderRadius: "12px",
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
                background: getBannerColor(degreeData.original?.status),
                color: "#111827", // text-black
                borderRadius: "12px 12px 0 0",
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
                    <School sx={{ color: "#111827" }} />
                  </Box>
                  <div>
                    <Typography
                      variant="h6"
                      className="font-bold"
                      sx={{ color: "#111827" }}
                    >
                      {degreeData.original?.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#111827" }}>
                      {degreeData.original?.major}
                    </Typography>
                    {degreeData.original?.referenceId && (
                      <Typography variant="caption" sx={{ color: "#374151" }}>
                        Reference ID: {degreeData.original?.referenceId}
                      </Typography>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Chip
                    label={getStatus(degreeData.original?.status)}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      background: "rgba(255,255,255,0.9)",
                      color:
                        degreeData.original?.status === "APPROVED"
                          ? "#047857"
                          : degreeData.original?.status === "PENDING"
                            ? "#D97706"
                            : "#DC2626",
                    }}
                  />
                  {degreeData.original?.status === "PENDING" ? (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleOpenApproveCreateDialog(degreeData)}
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
                  ) : (
                    degreeData.original?.status === "APPROVED" &&
                    degreeData.update &&
                    degreeData.update.status === "PENDING" && (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() =>
                          handleOpenApproveUpdateDialog(degreeData)
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
                {/* Original Degree Information */}
                <div className="mb-6">
                  <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div
                      className="flex items-center gap-3 rounded-lg p-3"
                      style={{
                        background: colors.background.tertiary,
                      }}
                    >
                      <Business className="text-blue-600" fontSize="small" />
                      <div>
                        <Typography
                          variant="caption"
                          sx={{
                            color: colors.text.tertiary,
                            fontWeight: 600,
                          }}
                        >
                          Trường/Tổ chức
                        </Typography>
                        <Typography variant="body2" className="font-medium">
                          {degreeData.original?.institution}
                        </Typography>
                      </div>
                    </div>
                    <div
                      className="flex items-center gap-3 rounded-lg p-3"
                      style={{
                        background: colors.background.tertiary,
                      }}
                    >
                      <CalendarToday
                        className="text-green-600"
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
                          Thời gian
                        </Typography>
                        <Typography variant="body2" className="font-medium">
                          {degreeData.original?.startYear} -{" "}
                          {degreeData.original?.graduationYear}
                        </Typography>
                      </div>
                    </div>
                    <div
                      className="flex items-center gap-3 rounded-lg p-3"
                      style={{
                        background: colors.background.tertiary,
                      }}
                    >
                      <Grade className="text-purple-600" fontSize="small" />
                      <div>
                        <Typography
                          variant="caption"
                          sx={{
                            color: colors.text.tertiary,
                            fontWeight: 600,
                          }}
                        >
                          Trình độ
                        </Typography>
                        <Typography variant="body2" className="font-medium">
                          {degreeData.original?.level}
                        </Typography>
                      </div>
                    </div>
                  </div>

                  {degreeData.original?.description && (
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
                        {degreeData.original?.description}
                      </Typography>
                    </Box>
                  )}

                  {degreeData.original?.adminNote && (
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
                        {degreeData.original?.adminNote}
                      </Typography>
                    </Box>
                  )}

                  {/* Action Buttons for Original */}
                  <div className="flex flex-wrap gap-3">
                    {degreeData.original?.url && (
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<LinkIcon />}
                        href={degreeData.original?.url}
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

                    {/* 
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Edit />}
                      onClick={() => onEditDegree?.(degreeData.original)}
                      sx={{
                        borderColor: colors.primary[500],
                        color: colors.primary[500],
                        fontWeight: 600,
                        textTransform: "none",
                        borderRadius: 2,
                        "&:hover": {
                          borderColor: colors.primary[600],
                          backgroundColor: colors.primary[50],
                          transform: "translateY(-1px)",
                        },
                      }}
                    >
                      Chỉnh sửa
                    </Button>

                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Delete />}
                      onClick={() => onDeleteDegree?.(degreeData.original)}
                      sx={{
                        borderColor: "#EF4444",
                        color: "#EF4444",
                        fontWeight: 600,
                        textTransform: "none",
                        borderRadius: 2,
                        "&:hover": {
                          borderColor: "#DC2626",
                          backgroundColor: "#FEF2F2",
                          transform: "translateY(-1px)",
                        },
                      }}
                    >
                      Xóa
                    </Button>
                    */}
                  </div>
                </div>
                {/* Thông tin thời gian tạo/cập nhật */}
                <div style={{ marginTop: 24, textAlign: "right" }}>
                  <Typography variant="body2" color="text.secondary">
                    Được tạo lúc: {formatDateToVietnamTime(degreeData.original?.createdAt)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cập nhật lần cuối:{" "}
                    {formatDateToVietnamTime(degreeData.original?.updatedAt)}
                  </Typography>
                </div>
              </Box>
            </AccordionDetails>
          </Accordion>
        ))
      ) : (
        <Alert severity="info" className="text-center">
          Chưa có thông tin bằng cấp
        </Alert>
      )}

      {/* ApproveDegreeCreateDialog */}
      {approveCreateDialog.open && (
        <ApproveDegreeCreateDialog
          open={approveCreateDialog.open}
          data={approveCreateDialog.data}
          onClose={handleCloseApproveCreateDialog}
          onSuccess={handleCloseApproveCreateDialog}
        />
      )}

      {/* ApproveDegreeUpdateDialog */}
      {approveUpdateDialog.open && (
        <ApproveDegreeUpdateDialog
          open={approveUpdateDialog.open}
          data={approveUpdateDialog.data}
          onClose={handleCloseApproveUpdateDialog}
          onSuccess={handleSuccessApproveUpdateDialog}
        />
      )}
    </div>
  );
};

export default LecturerProfileDegreesTab;
