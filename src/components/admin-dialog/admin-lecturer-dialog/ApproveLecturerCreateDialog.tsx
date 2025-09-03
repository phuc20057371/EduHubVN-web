import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PersonIcon from "@mui/icons-material/Person";
import RefreshIcon from "@mui/icons-material/Refresh";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import CloseIcon from "@mui/icons-material/Close";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setLecturerPendingCreate } from "../../../redux/slice/LecturerPendingCreateSlice";
import { setLecturers } from "../../../redux/slice/LecturerSlice";
import type { Certificate } from "../../../types/Certificate";
import type { Degree } from "../../../types/Degree";
import type { Lecturer } from "../../../types/Lecturer";
import {
  formatDate,
  formatDateToVietnamTime,
  getStatus,
  getStatusColor,
} from "../../../utils/ChangeText";
import { API } from "../../../utils/Fetch";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  content: React.ReactNode;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  content,
  onClose,
  onConfirm,
}) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      {typeof content === "string" ? (
        <DialogContentText>{content}</DialogContentText>
      ) : (
        content
      )}
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Hủy</Button>
      <Button onClick={onConfirm} color="primary" variant="contained">
        Xác nhận
      </Button>
    </DialogActions>
  </Dialog>
);

export interface ApproveLecturerCreateDialogProps {
  open: boolean;
  onClose: () => void;
  lecturer: Lecturer;
  degrees: Degree[];
  certificates: Certificate[];
}

const ApproveLecturerCreateDialog: React.FC<
  ApproveLecturerCreateDialogProps
> = ({ open, onClose, lecturer, degrees, certificates }) => {
  // State for admin notes and status
  const dispatch = useDispatch();
  const [lecturerStatus, setLecturerStatus] = useState<
    "PENDING" | "APPROVED" | "REJECTED"
  >("PENDING");
  const [lecturerNote, setLecturerNote] = useState<string>("");
  const [degreeStates, setDegreeStates] = useState<{
    [id: string]: { status: "PENDING" | "APPROVED" | "REJECTED"; note: string };
  }>({});
  const [certStates, setCertStates] = useState<{
    [id: string]: { status: "PENDING" | "APPROVED" | "REJECTED"; note: string };
  }>({});
  // Confirm dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmType, setConfirmType] = useState<"approve" | "reject" | null>(
    null,
  );
  const [confirmTarget, setConfirmTarget] = useState<{
    id: string;
    type: "Degree" | "Certification" | "Lecturer";
    note?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  // Load from localStorage on open
  // const domain = window.location.hostname;
  // const BASE_URL = `http://${domain}:8080`;
  useEffect(() => {
    if (!open) return;
    // Lecturer

    const lecKey = `Lecturer${lecturer.id}`;
    const lecStr = localStorage.getItem(lecKey);
    if (lecStr) {
      try {
        const lecObj = JSON.parse(lecStr);
        setLecturerStatus(lecObj.status || "PENDING");
        setLecturerNote(lecObj.note || "");
      } catch {}
    } else {
      setLecturerStatus("PENDING");
      setLecturerNote("");
    }
    // Degrees
    const degKey = `Degrees${lecturer.id}`;
    const degStr = localStorage.getItem(degKey);
    if (degStr) {
      try {
        const degArr = JSON.parse(degStr);
        const degMap: {
          [id: string]: {
            status: "PENDING" | "APPROVED" | "REJECTED";
            note: string;
          };
        } = {};
        degrees.forEach((d) => {
          // Tìm trạng thái lưu trong localStorage cho degree này
          const local = Array.isArray(degArr)
            ? degArr.find((item: any) => item.id === d.id)
            : undefined;
          let status: "PENDING" | "APPROVED" | "REJECTED" =
            local && ["PENDING", "APPROVED", "REJECTED"].includes(local.status)
              ? (local.status as "PENDING" | "APPROVED" | "REJECTED")
              : ["PENDING", "APPROVED", "REJECTED"].includes(d.status)
                ? (d.status as "PENDING" | "APPROVED" | "REJECTED")
                : "PENDING";
          let note =
            local && typeof local.note === "string"
              ? local.note
              : d.adminNote || "";
          degMap[d.id] = { status, note };
        });
        setDegreeStates(degMap);
      } catch {}
    } else {
      const degMap: {
        [id: string]: {
          status: "PENDING" | "APPROVED" | "REJECTED";
          note: string;
        };
      } = {};
      degrees.forEach((d) => {
        let status: "PENDING" | "APPROVED" | "REJECTED" = [
          "PENDING",
          "APPROVED",
          "REJECTED",
        ].includes(d.status)
          ? (d.status as "PENDING" | "APPROVED" | "REJECTED")
          : "PENDING";
        degMap[d.id] = { status, note: d.adminNote || "" };
      });
      setDegreeStates(degMap);
    }

    // Certificates
    const certKey = `Certification${lecturer.id}`;
    const certStr = localStorage.getItem(certKey);
    if (certStr) {
      try {
        const certArr = JSON.parse(certStr);
        const certMap: {
          [id: string]: {
            status: "PENDING" | "APPROVED" | "REJECTED";
            note: string;
          };
        } = {};
        certificates.forEach((c) => {
          // Tìm trạng thái lưu trong localStorage cho cert này
          const local = Array.isArray(certArr)
            ? certArr.find((item: any) => item.id === c.id)
            : undefined;
          let status: "PENDING" | "APPROVED" | "REJECTED" =
            local && ["PENDING", "APPROVED", "REJECTED"].includes(local.status)
              ? (local.status as "PENDING" | "APPROVED" | "REJECTED")
              : ["PENDING", "APPROVED", "REJECTED"].includes(c.status)
                ? (c.status as "PENDING" | "APPROVED" | "REJECTED")
                : "PENDING";
          let note =
            local && typeof local.note === "string"
              ? local.note
              : c.adminNote || "";
          certMap[c.id] = { status, note };
        });
        setCertStates(certMap);
      } catch {}
    } else {
      const certMap: {
        [id: string]: {
          status: "PENDING" | "APPROVED" | "REJECTED";
          note: string;
        };
      } = {};
      certificates.forEach((c) => {
        let status: "PENDING" | "APPROVED" | "REJECTED" = [
          "PENDING",
          "APPROVED",
          "REJECTED",
        ].includes(c.status)
          ? (c.status as "PENDING" | "APPROVED" | "REJECTED")
          : "PENDING";
        certMap[c.id] = { status, note: c.adminNote || "" };
      });
      setCertStates(certMap);
    }
  }, [open, lecturer.id, degrees, certificates]);

  // Handle approve/reject
  // Approve/Reject for Degree/Certification
  const handleApprove = (id: string, type: "Degree" | "Certification") => {
    setConfirmType("approve");
    setConfirmTarget({ id, type });
    setConfirmOpen(true);
  };
  const handleReject = (id: string, type: "Degree" | "Certification") => {
    setConfirmType("reject");
    setConfirmTarget({
      id,
      type,
      note:
        type === "Degree"
          ? (degreeStates[id]?.note ?? "")
          : (certStates[id]?.note ?? ""),
    });
    setConfirmOpen(true);
  };
  // Approve/Reject for all types
  const handleConfirm = () => {
    if (confirmTarget) {
      if (confirmType === "approve") {
        if (confirmTarget.type === "Lecturer") {
          setLecturerStatus("APPROVED");
          localStorage.setItem(
            `Lecturer${lecturer.id}`,
            JSON.stringify({
              id: lecturer.id,
              note: lecturerNote,
              status: "APPROVED",
            }),
          );
        } else if (confirmTarget.type === "Degree") {
          setDegreeStates((prev) => {
            const prevState = prev[confirmTarget.id] || {
              status: "PENDING",
              note: "",
            };
            const newState: {
              [id: string]: {
                status: "PENDING" | "APPROVED" | "REJECTED";
                note: string;
              };
            } = {
              ...prev,
              [confirmTarget.id]: { ...prevState, status: "APPROVED" },
            };
            localStorage.setItem(
              `Degrees${lecturer.id}`,
              JSON.stringify(
                Object.entries(newState).map(([id, v]) => ({
                  id: id, // Keep as string
                  ...v,
                })),
              ),
            );
            return newState;
          });
        } else if (confirmTarget.type === "Certification") {
          setCertStates((prev) => {
            const prevState = prev[confirmTarget.id] || {
              status: "PENDING",
              note: "",
            };
            const newState: {
              [id: string]: {
                status: "PENDING" | "APPROVED" | "REJECTED";
                note: string;
              };
            } = {
              ...prev,
              [confirmTarget.id]: { ...prevState, status: "APPROVED" },
            };
            localStorage.setItem(
              `Certification${lecturer.id}`,
              JSON.stringify(
                Object.entries(newState).map(([id, v]) => ({
                  id: id, // Keep as string
                  ...v,
                })),
              ),
            );
            return newState;
          });
        }
      } else if (confirmType === "reject") {
        if (confirmTarget.type === "Lecturer") {
          setLecturerStatus("REJECTED");
          setLecturerNote(confirmTarget.note || "");
          localStorage.setItem(
            `Lecturer${lecturer.id}`,
            JSON.stringify({
              id: lecturer.id,
              note: confirmTarget.note || "",
              status: "REJECTED",
            }),
          );
        } else if (confirmTarget.type === "Degree") {
          setDegreeStates((prev) => {
            const newState: {
              [id: string]: {
                status: "PENDING" | "APPROVED" | "REJECTED";
                note: string;
              };
            } = {
              ...prev,
              [confirmTarget.id]: {
                status: "REJECTED",
                note: confirmTarget.note || "",
              },
            };
            localStorage.setItem(
              `Degrees${lecturer.id}`,
              JSON.stringify(
                Object.entries(newState).map(([id, v]) => ({
                  id: id, // Keep as string
                  ...v,
                })),
              ),
            );
            return newState;
          });
        } else if (confirmTarget.type === "Certification") {
          setCertStates((prev) => {
            const newState: {
              [id: string]: {
                status: "PENDING" | "APPROVED" | "REJECTED";
                note: string;
              };
            } = {
              ...prev,
              [confirmTarget.id]: {
                status: "REJECTED",
                note: confirmTarget.note || "",
              },
            };
            localStorage.setItem(
              `Certification${lecturer.id}`,
              JSON.stringify(
                Object.entries(newState).map(([id, v]) => ({
                  id: id, // Keep as string
                  ...v,
                })),
              ),
            );
            return newState;
          });
        }
      }
    }
    setConfirmOpen(false);
    setConfirmType(null);
    setConfirmTarget(null);
  };
  const handleCloseConfirm = () => {
    setConfirmOpen(false);
    setConfirmType(null);
    setConfirmTarget(null);
  };
  // Refresh status to PENDING
  const handleRefresh = (
    id: string,
    type: "Degree" | "Certification" | "Lecturer",
  ) => {
    if (type === "Lecturer") {
      setLecturerStatus("PENDING");
      localStorage.setItem(
        `Lecturer${lecturer.id}`,
        JSON.stringify({
          id: lecturer.id,
          note: lecturerNote,
          status: "PENDING",
        }),
      );
    } else if (type === "Degree") {
      setDegreeStates((prev) => {
        const prevState = prev[id] || { status: "PENDING", note: "" };
        const newState: {
          [id: string]: {
            status: "PENDING" | "APPROVED" | "REJECTED";
            note: string;
          };
        } = {
          ...prev,
          [id]: { ...prevState, status: "PENDING" },
        };
        localStorage.setItem(
          `Degrees${lecturer.id}`,
          JSON.stringify(
            Object.entries(newState).map(([id, v]) => ({
              id: id, // Keep as string
              ...v,
            })),
          ),
        );
        return newState;
      });
    } else if (type === "Certification") {
      setCertStates((prev) => {
        const prevState = prev[id] || { status: "PENDING", note: "" };
        const newState: {
          [id: string]: {
            status: "PENDING" | "APPROVED" | "REJECTED";
            note: string;
          };
        } = {
          ...prev,
          [id]: { ...prevState, status: "PENDING" },
        };
        localStorage.setItem(
          `Certification${lecturer.id}`,
          JSON.stringify(
            Object.entries(newState).map(([id, v]) => ({
              id: id, // Keep as string
              ...v,
            })),
          ),
        );
        return newState;
      });
    }
  };
  // Hàm gọi lại API khi đóng dialog
  const handleDialogClose = async () => {
    if (typeof onClose === "function") onClose();
    try {
      const response = await API.admin.getLecturerPendingCreate();
      dispatch(setLecturerPendingCreate(response.data.data));
    } catch (error) {
      // Có thể log hoặc toast nếu cần
    }
  };

  return (
    <Dialog open={open} onClose={handleDialogClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              src={lecturer.avatarUrl || ""}
              sx={{ bgcolor: "primary.main" }}
            >
              <PersonIcon />
            </Avatar>
            <Box>
              <Typography variant="h5" component="div">
                Yêu cầu tạo mới hồ sơ giảng viên
              </Typography>

              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  ID: {lecturer.id}
                </Typography>
              </Box>
            </Box>
          </Box>
          <IconButton
            onClick={handleDialogClose}
            sx={{
              color: "grey.500",
              "&:hover": {
                bgcolor: "grey.100",
                color: "grey.700",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={3}>
          {/* Lecturer Status Card */}
          <Card
            elevation={0}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={2}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar
                    src={""}
                    sx={{
                      bgcolor: "rgba(255,255,255,0.2)",
                      width: 48,
                      height: 48,
                    }}
                  >
                    <PersonIcon sx={{ color: "white", fontSize: 24 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight={600} color="white">
                      Trạng thái duyệt hồ sơ
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "rgba(255,255,255,0.8)" }}
                    >
                      Quản lý phê duyệt giảng viên
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={
                    lecturerStatus === "APPROVED"
                      ? "Đã duyệt"
                      : lecturerStatus === "REJECTED"
                        ? "Đã từ chối"
                        : "Chờ duyệt"
                  }
                  sx={{
                    bgcolor:
                      lecturerStatus === "APPROVED"
                        ? "rgba(76, 175, 80, 0.9)"
                        : lecturerStatus === "REJECTED"
                          ? "rgba(244, 67, 54, 0.9)"
                          : "rgba(255, 193, 7, 0.9)",
                    color: "white",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    px: 2,
                    py: 1,
                  }}
                />
              </Box>

              <Box display="flex" alignItems="center" gap={2}>
                {lecturerStatus === "PENDING" ? (
                  <>
                    <Button
                      variant="contained"
                      sx={{
                        bgcolor: "rgba(76, 175, 80, 0.9)",
                        color: "white",
                        fontWeight: 600,
                        px: 3,
                        py: 1,
                        borderRadius: 2,
                        "&:hover": {
                          bgcolor: "rgba(76, 175, 80, 1)",
                          transform: "translateY(-2px)",
                          boxShadow: "0 8px 20px rgba(76, 175, 80, 0.3)",
                        },
                        transition: "all 0.3s ease",
                      }}
                      onClick={() => {
                        setConfirmType("approve");
                        setConfirmTarget({ id: lecturer.id, type: "Lecturer" });
                        setConfirmOpen(true);
                      }}
                    >
                      ✓ Duyệt
                    </Button>
                    <Button
                      variant="contained"
                      sx={{
                        bgcolor: "rgba(244, 67, 54, 0.9)",
                        color: "white",
                        fontWeight: 600,
                        px: 3,
                        py: 1,
                        borderRadius: 2,
                        "&:hover": {
                          bgcolor: "rgba(244, 67, 54, 1)",
                          transform: "translateY(-2px)",
                          boxShadow: "0 8px 20px rgba(244, 67, 54, 0.3)",
                        },
                        transition: "all 0.3s ease",
                      }}
                      onClick={() => {
                        setConfirmType("reject");
                        setConfirmTarget({
                          id: lecturer.id,
                          type: "Lecturer",
                          note: "",
                        });
                        setConfirmOpen(true);
                      }}
                    >
                      ✕ Từ chối
                    </Button>
                  </>
                ) : (
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography
                      variant="body1"
                      fontWeight={600}
                      color="white"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        bgcolor: "rgba(255,255,255,0.1)",
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                      }}
                    >
                      {lecturerStatus === "APPROVED" ? "✓" : "✕"}
                      {lecturerStatus === "APPROVED"
                        ? "Đã duyệt"
                        : "Đã từ chối"}
                    </Typography>
                    <IconButton
                      onClick={() => handleRefresh(lecturer.id, "Lecturer")}
                      sx={{
                        bgcolor: "rgba(255,255,255,0.1)",
                        color: "white",
                        "&:hover": {
                          bgcolor: "rgba(255,255,255,0.2)",
                          transform: "rotate(180deg)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      <RefreshIcon />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Personal Information Cards Row */}
          <Box
            display="flex"
            flexDirection={{ xs: "column", lg: "row" }}
            gap={3}
          >
            {/* Personal Info Card */}
            <Card elevation={1} sx={{ flex: 1 }}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: "info.main" }}>
                    <PersonIcon />
                  </Avatar>
                }
                title="Thông tin cá nhân"
              />
              <CardContent>
                <Box display="flex" flexDirection="column" gap={1.5}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Họ tên:
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {lecturer.fullName}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Ngày sinh:
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {formatDate(lecturer.dateOfBirth)}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Giới tính:
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {lecturer.gender ? "Nam" : "Nữ"}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      CCCD:
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {lecturer.citizenId}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Địa chỉ:
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      sx={{ textAlign: "right", maxWidth: "60%" }}
                    >
                      {lecturer.address}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      SĐT:
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {lecturer.phoneNumber}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Professional Info Card */}
            <Card elevation={1} sx={{ flex: 1 }}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: "success.main" }}>
                    <WorkIcon />
                  </Avatar>
                }
                title="Thông tin chuyên môn"
              />
              <CardContent>
                <Box display="flex" flexDirection="column" gap={1.5}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Học hàm:
                    </Typography>
                    <Chip
                      label={
                        lecturer.academicRank === "CN"
                          ? "Cử nhân"
                          : lecturer.academicRank === "THS"
                            ? "Thạc Sĩ"
                            : lecturer.academicRank === "TS"
                              ? "Tiến Sĩ"
                              : lecturer.academicRank === "PGS"
                                ? "Phó Giáo Sư"
                                : lecturer.academicRank === "GS"
                                  ? "Giáo Sư"
                                  : lecturer.academicRank || "Chưa có"
                      }
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                  <Divider />
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Chuyên ngành:
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {lecturer.specialization || "Chưa có"}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Lĩnh vực:
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {lecturer.jobField || "Chưa có"}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Kinh nghiệm:
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {lecturer.experienceYears || 0} năm
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* System Info Card */}
            <Card elevation={1} sx={{ flex: 1 }}>
              <CardHeader
                avatar={<Avatar sx={{ bgcolor: "warning.main" }}>🔧</Avatar>}
                title="Thông tin hệ thống"
              />
              <CardContent>
                <Box display="flex" flexDirection="column" gap={1.5}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Tạo lúc:
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {formatDateToVietnamTime(lecturer.createdAt)}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Cập nhật lúc:
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {formatDateToVietnamTime(lecturer.updatedAt)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Alert for Degrees and Certificates */}
          <Box
            sx={{
              bgcolor: "lightyellow",
              border: "1px solid",
              borderColor: "warning.main",
              borderRadius: 1,
              p: 2,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "warning.main",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              ⚠️ Lưu ý: Bạn phải duyệt hoặc từ chối tất cả bằng cấp và chứng chỉ
              trước khi có thể lưu hồ sơ này.
            </Typography>
          </Box>

          {/* Degrees and Certificates Section */}
          <Box
            display="flex"
            flexDirection={{ xs: "column", lg: "row" }}
            gap={3}
          >
            {/* Degrees Card */}
            <Card elevation={1} sx={{ flex: 1 }}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: "secondary.main" }}>
                    <SchoolIcon />
                  </Avatar>
                }
                title={`Bằng cấp (${degrees.length})`}
              />
              <CardContent sx={{ maxHeight: 400, overflow: "auto" }}>
                {degrees.length > 0 ? (
                  degrees.map((deg) => {
                    const status = degreeStates[deg.id]?.status || "PENDING";
                    return (
                      <Accordion
                        key={deg.id}
                        sx={{
                          mb: 1,
                          backgroundColor:
                            status === "APPROVED"
                              ? "#e6f4ea"
                              : status === "REJECTED"
                                ? "#fdeaea"
                                : "#fff",
                        }}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls={`degree-panel-content-${deg.id}`}
                          id={`degree-panel-header-${deg.id}`}
                        >
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            width="100%"
                          >
                            <Typography variant="body2" fontWeight={500}>
                              {deg.name} - {deg.institution}
                            </Typography>
                            <Chip
                              label={getStatus(status)}
                              size="small"
                              color={getStatusColor(status)}
                              sx={{ ml: 1 }}
                            />
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Box display="flex" flexDirection="column" gap={2}>
                            <Box>
                              <Typography variant="subtitle2" gutterBottom>
                                Thông tin chi tiết
                              </Typography>
                              <Box
                                display="flex"
                                flexDirection="column"
                                gap={1}
                              >
                                <Divider />
                                <Box
                                  display="flex"
                                  justifyContent="space-between"
                                >
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Reference ID:
                                  </Typography>
                                  <Typography variant="body2" fontWeight={500}>
                                    {deg.referenceId}
                                  </Typography>
                                </Box>
                                <Divider />
                                <Box
                                  display="flex"
                                  justifyContent="space-between"
                                >
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Tên bằng:
                                  </Typography>
                                  <Typography variant="body2" fontWeight={500}>
                                    {deg.name}
                                  </Typography>
                                </Box>
                                <Divider />
                                <Box
                                  display="flex"
                                  justifyContent="space-between"
                                >
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Chuyên ngành:
                                  </Typography>
                                  <Typography variant="body2" fontWeight={500}>
                                    {deg.major}
                                  </Typography>
                                </Box>
                                <Divider />
                                <Box
                                  display="flex"
                                  justifyContent="space-between"
                                >
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Trường/Đại học:
                                  </Typography>
                                  <Typography variant="body2" fontWeight={500}>
                                    {deg.institution}
                                  </Typography>
                                </Box>
                                <Divider />
                                <Box
                                  display="flex"
                                  justifyContent="space-between"
                                >
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Năm bắt đầu:
                                  </Typography>
                                  <Typography variant="body2" fontWeight={500}>
                                    {deg.startYear}
                                  </Typography>
                                </Box>
                                <Divider />
                                <Box
                                  display="flex"
                                  justifyContent="space-between"
                                >
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Năm tốt nghiệp:
                                  </Typography>
                                  <Typography variant="body2" fontWeight={500}>
                                    {deg.graduationYear}
                                  </Typography>
                                </Box>
                                <Divider />
                                <Box
                                  display="flex"
                                  justifyContent="space-between"
                                >
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Trình độ:
                                  </Typography>
                                  {deg.level}
                                </Box>
                                <Divider />
                                <Box
                                  display="flex"
                                  justifyContent="space-between"
                                >
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    URL:
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    fontWeight={500}
                                    sx={{
                                      color: deg.url
                                        ? "primary.main"
                                        : "text.secondary",
                                      textDecoration: deg.url
                                        ? "underline"
                                        : "none",
                                      cursor: deg.url ? "pointer" : "default",
                                      maxWidth: "60%",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                    }}
                                    onClick={() =>
                                      deg.url && window.open(deg.url)
                                    }
                                  >
                                    Bấm vào đây
                                  </Typography>
                                </Box>
                                <Divider />
                                <Box
                                  display="flex"
                                  justifyContent="space-between"
                                  alignItems="flex-start"
                                >
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Mô tả:
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    fontWeight={500}
                                    sx={{
                                      textAlign: "right",
                                      maxWidth: "60%",
                                      wordBreak: "break-word",
                                    }}
                                  >
                                    {deg.description || "Không có"}
                                  </Typography>
                                </Box>

                                <Divider />
                                <Box
                                  display="flex"
                                  justifyContent="space-between"
                                >
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Thời gian tạo:
                                  </Typography>
                                  <Typography variant="body2" fontWeight={500}>
                                    {formatDateToVietnamTime(deg.createdAt)}
                                  </Typography>
                                </Box>
                                <Divider />
                                <Box
                                  display="flex"
                                  justifyContent="space-between"
                                >
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Cập nhật lần cuối:
                                  </Typography>
                                  <Typography variant="body2" fontWeight={500}>
                                    {formatDateToVietnamTime(deg.updatedAt)}
                                  </Typography>
                                </Box>
                                <Divider />
                              </Box>
                            </Box>

                            <Box display="flex" alignItems="center" gap={1}>
                              {degreeStates[deg.id]?.status === "PENDING" ? (
                                <>
                                  <Button
                                    variant="contained"
                                    color="error"
                                    size="small"
                                    onClick={() =>
                                      handleReject(deg.id, "Degree")
                                    }
                                  >
                                    Từ chối
                                  </Button>
                                  <Button
                                    variant="contained"
                                    color="success"
                                    size="small"
                                    onClick={() =>
                                      handleApprove(deg.id, "Degree")
                                    }
                                  >
                                    Duyệt
                                  </Button>
                                </>
                              ) : (
                                <Box display="flex" alignItems="center" gap={1}>
                                  <Typography
                                    color={
                                      degreeStates[deg.id]?.status ===
                                      "APPROVED"
                                        ? "success.main"
                                        : "error.main"
                                    }
                                    fontWeight={600}
                                    variant="body2"
                                  >
                                    {degreeStates[deg.id]?.status === "APPROVED"
                                      ? "Đã duyệt"
                                      : "Đã từ chối"}
                                  </Typography>
                                  <IconButton
                                    onClick={() =>
                                      handleRefresh(deg.id, "Degree")
                                    }
                                    size="small"
                                    color="info"
                                  >
                                    <RefreshIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              )}
                            </Box>
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    );
                  })
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                    py={3}
                  >
                    Không có bằng cấp
                  </Typography>
                )}
              </CardContent>
            </Card>

            {/* Certificates Card */}
            <Card elevation={1} sx={{ flex: 1 }}>
              <CardHeader
                avatar={<Avatar sx={{ bgcolor: "primary.main" }}>📜</Avatar>}
                title={`Chứng chỉ (${certificates.length})`}
              />
              <CardContent sx={{ maxHeight: 400, overflow: "auto" }}>
                {certificates.length > 0 ? (
                  certificates.map((cert) => {
                    const status = certStates[cert.id]?.status;
                    return (
                      <Accordion
                        key={cert.id}
                        sx={{
                          mb: 1,
                          backgroundColor:
                            status === "APPROVED"
                              ? "#e6f4ea"
                              : status === "REJECTED"
                                ? "#fdeaea"
                                : "#fff",
                        }}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls={`cert-panel-content-${cert.id}`}
                          id={`cert-panel-header-${cert.id}`}
                        >
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            width="100%"
                          >
                            <Typography variant="body2" fontWeight={500}>
                              {cert.name} - {cert.issuedBy}
                            </Typography>
                            <Chip
                              label={getStatus(status)}
                              size="small"
                              color={getStatusColor(status)}
                              sx={{ ml: 1 }}
                            />
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Box display="flex" flexDirection="column" gap={2}>
                            <Box>
                              <Typography variant="subtitle2" gutterBottom>
                                Thông tin chi tiết
                              </Typography>
                              <Box
                                display="flex"
                                flexDirection="column"
                                gap={1}
                              >
                                <Divider />
                                <Box
                                  display="flex"
                                  justifyContent="space-between"
                                >
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Reference ID:
                                  </Typography>
                                  <Typography variant="body2" fontWeight={500}>
                                    {cert.referenceId}
                                  </Typography>
                                </Box>
                                <Divider />
                                <Box
                                  display="flex"
                                  justifyContent="space-between"
                                >
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Tên chứng chỉ:
                                  </Typography>
                                  <Typography variant="body2" fontWeight={500}>
                                    {cert.name}
                                  </Typography>
                                </Box>
                                <Divider />
                                <Box
                                  display="flex"
                                  justifyContent="space-between"
                                >
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Đơn vị cấp:
                                  </Typography>
                                  <Typography variant="body2" fontWeight={500}>
                                    {cert.issuedBy}
                                  </Typography>
                                </Box>
                                <Divider />
                                <Box
                                  display="flex"
                                  justifyContent="space-between"
                                >
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Ngày cấp:
                                  </Typography>
                                  <Typography variant="body2" fontWeight={500}>
                                    {formatDate(cert.issueDate)}
                                  </Typography>
                                </Box>
                                <Divider />
                                <Box
                                  display="flex"
                                  justifyContent="space-between"
                                >
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Ngày hết hạn:
                                  </Typography>
                                  <Typography variant="body2" fontWeight={500}>
                                    {formatDate(cert.expiryDate)}
                                  </Typography>
                                </Box>
                                <Divider />
                                <Box
                                  display="flex"
                                  justifyContent="space-between"
                                >
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    URL:
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    fontWeight={500}
                                    sx={{
                                      color: cert.certificateUrl
                                        ? "primary.main"
                                        : "text.secondary",
                                      textDecoration: cert.certificateUrl
                                        ? "underline"
                                        : "none",
                                      cursor: cert.certificateUrl
                                        ? "pointer"
                                        : "default",
                                      maxWidth: "60%",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                    }}
                                    onClick={() =>
                                      cert.certificateUrl &&
                                      window.open(cert.certificateUrl)
                                    }
                                  >
                                    {cert.certificateUrl
                                      ? "Bấm vào đây"
                                      : "Không có"}
                                  </Typography>
                                </Box>
                                <Divider />

                                <Box
                                  display="flex"
                                  justifyContent="space-between"
                                  alignItems="flex-start"
                                >
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Mô tả:
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    fontWeight={500}
                                    sx={{
                                      textAlign: "right",
                                      maxWidth: "60%",
                                      wordBreak: "break-word",
                                    }}
                                  >
                                    {cert.description || "Không có"}
                                  </Typography>
                                </Box>

                                <Divider />
                                <Box
                                  display="flex"
                                  justifyContent="space-between"
                                >
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Thời gian tạo:
                                  </Typography>
                                  <Typography variant="body2" fontWeight={500}>
                                    {formatDateToVietnamTime(cert.createdAt)}
                                  </Typography>
                                </Box>
                                <Divider />
                                <Box
                                  display="flex"
                                  justifyContent="space-between"
                                >
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Cập nhật lần cuối:
                                  </Typography>
                                  <Typography variant="body2" fontWeight={500}>
                                    {formatDateToVietnamTime(cert.updatedAt)}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>

                            <Divider />

                            <Box display="flex" alignItems="center" gap={1}>
                              {certStates[cert.id]?.status === "PENDING" ? (
                                <>
                                  <Button
                                    variant="contained"
                                    color="success"
                                    size="small"
                                    onClick={() =>
                                      handleApprove(cert.id, "Certification")
                                    }
                                  >
                                    Duyệt
                                  </Button>
                                  <Button
                                    variant="contained"
                                    color="error"
                                    size="small"
                                    onClick={() =>
                                      handleReject(cert.id, "Certification")
                                    }
                                  >
                                    Từ chối
                                  </Button>
                                </>
                              ) : (
                                <Box display="flex" alignItems="center" gap={1}>
                                  <Typography
                                    color={getStatusColor(
                                      certStates[cert.id]?.status,
                                    )}
                                    fontWeight={600}
                                    variant="body2"
                                  >
                                    {getStatus(certStates[cert.id]?.status)}
                                  </Typography>
                                  <IconButton
                                    onClick={() =>
                                      handleRefresh(cert.id, "Certification")
                                    }
                                    size="small"
                                    color="info"
                                  >
                                    <RefreshIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              )}
                            </Box>
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    );
                  })
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                    py={3}
                  >
                    Không có chứng chỉ
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleDialogClose} color="primary" disabled={loading}>
          Đóng
        </Button>
        <Box sx={{ position: "relative", display: "inline-block" }}>
          <Button
            color="success"
            variant="contained"
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              // Check for any pending status
              const pendingDegrees = Object.entries(degreeStates).filter(
                ([_, v]) => v.status === "PENDING",
              );
              const pendingCerts = Object.entries(certStates).filter(
                ([_, v]) => v.status === "PENDING",
              );
              if (
                lecturerStatus === "PENDING" ||
                pendingDegrees.length > 0 ||
                pendingCerts.length > 0
              ) {
                toast.error(
                  "Vui lòng duyệt hoặc từ chối tất cả các mục trước khi lưu!",
                );
                setLoading(false);
                return;
              }

              try {
                // Save lecturer status
                let sendMailType: "APPROVED" | "REJECTED" | null = null;
                let sendMailData: {
                  to: string;
                  subject: string;
                  body: string;
                } | null = null;

                if (lecturerStatus === "REJECTED") {
                  try {
                    const response = await API.admin.rejectLecturer({
                      id: lecturer.id,
                      adminNote: lecturerNote,
                    });
                    if (response?.data?.success) {
                      localStorage.removeItem(`Lecturer${lecturer.id}`);
                      const response =
                        await API.admin.getLecturerPendingCreate();
                      dispatch(setLecturerPendingCreate(response.data.data));
                      // Chuẩn bị gửi mail sau
                      if (lecturer.email) {
                        sendMailType = "REJECTED";
                        sendMailData = {
                          to: lecturer.email,
                          subject: "Hồ sơ Giảng viên bị từ chối",
                          body: `
                            <div style="font-family: Arial, sans-serif; background: #f6f8fa; padding: 32px;">
                              <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 32px;">
                                <h2 style="color: #e53935; margin-bottom: 16px;">Hồ sơ của bạn đã bị từ chối</h2>
                                <p style="font-size: 16px; color: #333;">
                                  Xin chào <strong>${lecturer.fullName || ""}</strong>,<br/><br/>
                                  Rất tiếc! Hồ sơ đăng ký Giảng viên của bạn trên hệ thống <strong>EduHubVN</strong> đã bị từ chối.<br/>
                                  <b>Lý do từ chối:</b><br/>
                                  <span style="color: #e53935;">${lecturerNote || "Không có lý do cụ thể."}</span><br/><br/>
                                  Hãy cập nhật lại thông tin <br/>
                                  Nếu bạn cần hỗ trợ, vui lòng liên hệ qua email: <a href="mailto:support@eduhubvn.com">support@eduhubvn.com</a>.<br/><br/>
                                  Trân trọng,<br/>
                                  <span style="color: #2563eb; font-weight: bold;">EduHubVN Team</span>
                                </p>
                                <hr style="margin: 32px 0; border: none; border-top: 1px solid #eee;" />
                                <div style="font-size: 13px; color: #888;">
                                  Đây là email tự động, vui lòng không trả lời trực tiếp email này.
                                </div>
                              </div>
                            </div>
                          `,
                        };
                      }
                    } else {
                      toast.error("Từ chối giảng viên thất bại!");
                    }
                  } catch (err) {
                    toast.error("Lỗi khi gọi API từ chối giảng viên!");
                    setLoading(false);
                    return;
                  }
                } else if (lecturerStatus === "APPROVED") {
                  try {
                    const response = await API.admin.approveLecturer({
                      id: lecturer.id,
                    });
                    if (response?.data?.success) {
                      localStorage.removeItem(`Lecturer${lecturer.id}`);
                      const response =
                        await API.admin.getLecturerPendingCreate();
                      dispatch(setLecturerPendingCreate(response.data.data));
                      if (lecturer.email) {
                        sendMailType = "APPROVED";
                        sendMailData = {
                          to: lecturer.email,
                          subject: "Hồ sơ Giảng viên đã được duyệt",
                          body: `
                            <div style="font-family: Arial, sans-serif; background: #f6f8fa; padding: 32px;">
                              <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 32px;">
                                <h2 style="color: #2563eb; margin-bottom: 16px;">Hồ sơ của bạn đã được duyệt!</h2>
                                <p style="font-size: 16px; color: #333;">
                                  Xin chào <strong>${lecturer.fullName || ""}</strong>,<br/><br/>
                                  Chúc mừng! Hồ sơ đăng ký Giảng viên của bạn trên hệ thống <strong>EduHubVN</strong> đã được duyệt.<br/>
                                  Bạn có thể truy cập hệ thống và sử dụng các chức năng dành cho Giảng viên.<br/><br/>
                                  <b>Thông tin tài khoản:</b><br/>
                                  - Họ tên: ${lecturer.fullName || ""}<br/>
                                  - Email: ${lecturer.email}<br/>
                                  <br/>
                                  Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ qua email: <a href="mailto:support@eduhubvn.com">support@eduhubvn.com</a>.<br/><br/>
                                  Trân trọng,<br/>
                                  <span style="color: #2563eb; font-weight: bold;">EduHubVN Team</span>
                                </p>
                                <hr style="margin: 32px 0; border: none; border-top: 1px solid #eee;" />
                                <div style="font-size: 13px; color: #888;">
                                  Đây là email tự động, vui lòng không trả lời trực tiếp email này.
                                </div>
                              </div>
                            </div>
                          `,
                        };
                      }
                    } else {
                      toast.error("Duyệt giảng viên thất bại!");
                    }
                  } catch (err) {
                    toast.error("Lỗi khi gọi API duyệt giảng viên!");
                    setLoading(false);
                    return;
                  }
                }

                // Save Degrees
                for (const [id, v] of Object.entries(degreeStates)) {
                  if (v.status === "APPROVED") {
                    await API.admin.approveDegree({ id: id }); // Use string ID
                  } else if (v.status === "REJECTED") {
                    await API.admin.rejectDegree({
                      id: id, // Use string ID
                      adminNote: v.note,
                    });
                  }
                }

                // Save Certifications
                for (const [id, v] of Object.entries(certStates)) {
                  if (v.status === "APPROVED") {
                    await API.admin.approveCertification({ id: id }); // Use string ID
                  } else if (v.status === "REJECTED") {
                    await API.admin.rejectCertification({
                      id: id, // Use string ID
                      adminNote: v.note,
                    });
                  }
                }
                toast.success("Lưu trạng thái thành công!");

                localStorage.removeItem(`Lecturer${lecturer.id}`);
                localStorage.removeItem(`Degrees${lecturer.id}`);
                localStorage.removeItem(`Certification${lecturer.id}`);

                const res = await API.admin.getAllLecturers();
                dispatch(setLecturers(res.data.data));

                handleDialogClose();

                // Gửi email sau khi xử lý xong, không chặn giao diện
                if (sendMailType && sendMailData) {
                  setTimeout(() => {
                    API.other.sendEmail(sendMailData);
                  }, 0);
                }
              } catch (error) {
                console.error("Error saving lecturer details:", error);
                toast.error("Lỗi khi lưu trạng thái. Vui lòng thử lại sau.");
              }
              setLoading(false);
            }}
          >
            Lưu
          </Button>
          {loading && (
            <CircularProgress
              size={32}
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                marginTop: "-16px",
                marginLeft: "-16px",
                zIndex: 1,
              }}
            />
          )}
        </Box>
      </DialogActions>

      <ConfirmDialog
        open={confirmOpen}
        title={
          confirmType === "approve" ? "Xác nhận duyệt" : "Xác nhận từ chối"
        }
        content={
          confirmType === "approve" ? (
            <Box sx={{ width: 400 }}>
              Bạn có chắc chắn muốn duyệt hồ sơ này?
            </Box>
          ) : (
            <Box sx={{ width: 400 }}>
              <div>Bạn có chắc chắn muốn từ chối hồ sơ này?</div>
              <TextField
                label="Lý do từ chối"
                size="small"
                value={confirmTarget?.note ?? ""}
                onChange={(e) => {
                  setConfirmTarget((t) =>
                    t ? { ...t, note: e.target.value } : t,
                  );
                  if (confirmTarget?.type === "Degree") {
                    setDegreeStates((prev) => ({
                      ...prev,
                      [confirmTarget.id]: {
                        ...prev[confirmTarget.id],
                        note: e.target.value,
                      },
                    }));
                  } else if (confirmTarget?.type === "Certification") {
                    setCertStates((prev) => ({
                      ...prev,
                      [confirmTarget.id]: {
                        ...prev[confirmTarget.id],
                        note: e.target.value,
                      },
                    }));
                  }
                }}
                fullWidth
                sx={{ mt: 2 }}
              />
            </Box>
          )
        }
        onClose={handleCloseConfirm}
        onConfirm={() => {
          if (
            confirmType === "reject" &&
            (!confirmTarget?.note || confirmTarget.note.trim() === "")
          ) {
            toast.error("Vui lòng nhập lý do từ chối.");
            return;
          }
          handleConfirm();
        }}
      />
    </Dialog>
  );
};

export default ApproveLecturerCreateDialog;
