import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";

import Dialog from "@mui/material/Dialog";
// removed MuiDialog import, use Dialog for both main and confirm dialog
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import type { Degree } from "../types/Degree";
import type { Lecturer } from "../types/Lecturer";
import type { Certificate } from "../types/Certificate";
import { toast } from "react-toastify";
import { API } from "../utils/Fetch";
import { useDispatch, useSelector } from "react-redux";
import { setLecturerPendingCreate } from "../redux/slice/LecturerPendingCreateSlice";
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

export interface LecturerDetailDialogProps {
  open: boolean;
  onClose: () => void;
  lecturer: Lecturer;
  degrees: Degree[];
  certificates: Certificate[];
}

const LecturerDetailDialog: React.FC<LecturerDetailDialogProps> = ({
  open,
  onClose,
  lecturer,
  degrees,
  certificates,
}) => {
  // State for admin notes and status
  const dispatch = useDispatch();
  const lecturerPendingCreate = useSelector(
    (state: any) => state.lecturerPendingCreate,
  );
  const [lecturerStatus, setLecturerStatus] = useState<
    "PENDING" | "APPROVED" | "REJECTED"
  >("PENDING");
  const [lecturerNote, setLecturerNote] = useState<string>("");
  const [degreeStates, setDegreeStates] = useState<{
    [id: number]: { status: "PENDING" | "APPROVED" | "REJECTED"; note: string };
  }>({});
  const [certStates, setCertStates] = useState<{
    [id: number]: { status: "PENDING" | "APPROVED" | "REJECTED"; note: string };
  }>({});
  // Confirm dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmType, setConfirmType] = useState<"approve" | "reject" | null>(
    null,
  );
  const [confirmTarget, setConfirmTarget] = useState<{
    id: number;
    type: "Degree" | "Certification" | "Lecturer";
    note?: string;
  } | null>(null);
  // Load from localStorage on open
  const domain = window.location.hostname;
  const BASE_URL = `http://${domain}:8080`;
  useEffect(() => {
    if (!open) return;
    // Lecturer
    console.log(lecturer);
    console.log(degrees);
    console.log(certificates);

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
          [id: number]: {
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
        [id: number]: {
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
          [id: number]: {
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
        [id: number]: {
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
  const handleApprove = (id: number, type: "Degree" | "Certification") => {
    setConfirmType("approve");
    setConfirmTarget({ id, type });
    setConfirmOpen(true);
  };
  const handleReject = (id: number, type: "Degree" | "Certification") => {
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
              [id: number]: {
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
                  id: Number(id),
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
              [id: number]: {
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
                  id: Number(id),
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
              [id: number]: {
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
                  id: Number(id),
                  ...v,
                })),
              ),
            );
            return newState;
          });
        } else if (confirmTarget.type === "Certification") {
          setCertStates((prev) => {
            const newState: {
              [id: number]: {
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
                  id: Number(id),
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
    id: number,
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
          [id: number]: {
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
              id: Number(id),
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
          [id: number]: {
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
              id: Number(id),
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
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            src={lecturer.avatarUrl || ""}
            sx={{ bgcolor: "primary.main" }}
          >
            <PersonIcon />
          </Avatar>
          <Box>
            <Typography variant="h5" component="div">
              {lecturer.fullName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Chi tiết hồ sơ giảng viên
            </Typography>
          </Box>
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
                      {lecturer.dateOfBirth}
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
                      ID:
                    </Typography>
                    <Chip
                      label={lecturer.id}
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  </Box>
                  <Divider />
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Thời gian tạo:
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {lecturer.createdAt
                        ? new Date(lecturer.createdAt).toLocaleDateString(
                            "vi-VN",
                          )
                        : "Chưa có"}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Cập nhật lần cuối:
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {lecturer.updatedAt
                        ? new Date(lecturer.updatedAt).toLocaleDateString(
                            "vi-VN",
                          )
                        : "Chưa có"}
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
                              {deg.name} - {deg.institution} (
                              {deg.graduationYear})
                            </Typography>
                            <Chip
                              label={status}
                              size="small"
                              color={
                                status === "APPROVED"
                                  ? "success"
                                  : status === "REJECTED"
                                    ? "error"
                                    : "warning"
                              }
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
                                    Mã tham chiếu:
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
                                      deg.url && window.open(BASE_URL+"/uploads/" + deg.url)
                                    }
                                  >
                                    {deg.url || "Không có"}
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
                                    {deg.createdAt
                                      ? new Date(
                                          deg.createdAt,
                                        ).toLocaleDateString("vi-VN")
                                      : "Chưa có"}
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
                                    {deg.updatedAt
                                      ? new Date(
                                          deg.updatedAt,
                                        ).toLocaleDateString("vi-VN")
                                      : "Chưa có"}
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
                                    color="success"
                                    size="small"
                                    onClick={() =>
                                      handleApprove(deg.id, "Degree")
                                    }
                                  >
                                    Duyệt
                                  </Button>
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
                    const status = certStates[cert.id]?.status || "PENDING";
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
                              {cert.name} - {cert.issuedBy} ({cert.issueDate})
                            </Typography>
                            <Chip
                              label={status}
                              size="small"
                              color={
                                status === "APPROVED"
                                  ? "success"
                                  : status === "REJECTED"
                                    ? "error"
                                    : "warning"
                              }
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
                                    Mã tham chiếu:
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
                                    {cert.issueDate
                                      ? new Date(
                                          cert.issueDate,
                                        ).toLocaleDateString("vi-VN")
                                      : "Chưa có"}
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
                                    {cert.expiryDate
                                      ? new Date(
                                          cert.expiryDate,
                                        ).toLocaleDateString("vi-VN")
                                      : "Chưa có"}
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
                                    URL chứng chỉ:
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
                                      window.open(`${BASE_URL}/uploads/${cert.certificateUrl}`, "_blank")
                                    }
                                  >
                                    {cert.certificateUrl || "Không có"}
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
                                    {cert.createdAt
                                      ? new Date(
                                          cert.createdAt,
                                        ).toLocaleDateString("vi-VN")
                                      : "Chưa có"}
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
                                    {cert.updatedAt
                                      ? new Date(
                                          cert.updatedAt,
                                        ).toLocaleDateString("vi-VN")
                                      : "Chưa có"}
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
                                    color={
                                      certStates[cert.id]?.status === "APPROVED"
                                        ? "success.main"
                                        : "error.main"
                                    }
                                    fontWeight={600}
                                    variant="body2"
                                  >
                                    {certStates[cert.id]?.status === "APPROVED"
                                      ? "Đã duyệt"
                                      : "Đã từ chối"}
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
        <Button onClick={handleDialogClose} color="primary">
          Đóng
        </Button>
        <Button
          color="success"
          variant="contained"
          onClick={async () => {
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
              return;
            }

            try {
              // Save lecturer status
              if (lecturerStatus === "REJECTED") {
                try {
                  const response = await API.admin.rejectLecturer({
                    id: lecturer.id,
                    adminNote: lecturerNote,
                  });
                  if (response?.data?.success) {
                    localStorage.removeItem(`Lecturer${lecturer.id}`);
                    // Remove lecturer from redux state (must pass new array, not a function)
                    dispatch(
                      setLecturerPendingCreate(
                        (Array.isArray(lecturerPendingCreate)
                          ? lecturerPendingCreate
                          : []
                        ).filter((l: any) => l.id !== lecturer.id),
                      ),
                    );
                  } else {
                    toast.error("Từ chối giảng viên thất bại!");
                  }
                } catch (err) {
                  toast.error("Lỗi khi gọi API từ chối giảng viên!");
                  return;
                }
              } else if (lecturerStatus === "APPROVED") {
                try {
                  const response = await API.admin.approveLecturer({
                    id: lecturer.id,
                  });
                  if (response?.data?.success) {
                    localStorage.removeItem(`Lecturer${lecturer.id}`);
                    // Remove lecturer from redux state (must pass new array, not a function)
                    dispatch(
                      setLecturerPendingCreate(
                        (Array.isArray(lecturerPendingCreate)
                          ? lecturerPendingCreate
                          : []
                        ).filter((l: any) => l.id !== lecturer.id),
                      ),
                    );
                  } else {
                    toast.error("Duyệt giảng viên thất bại!");
                  }
                } catch (err) {
                  toast.error("Lỗi khi gọi API duyệt giảng viên!");
                  return;
                }
              }

              // Save Degrees
              for (const [id, v] of Object.entries(degreeStates)) {
                if (v.status === "APPROVED") {
                  await API.admin.approveDegree({ id: Number(id) });
                } else if (v.status === "REJECTED") {
                  await API.admin.rejectDegree({
                    id: Number(id),
                    adminNote: v.note,
                  });
                }
              }

              // Save Certifications
              for (const [id, v] of Object.entries(certStates)) {
                if (v.status === "APPROVED") {
                  await API.admin.approveCertification({ id: Number(id) });
                } else if (v.status === "REJECTED") {
                  await API.admin.rejectCertification({
                    id: Number(id),
                    adminNote: v.note,
                  });
                }
              }
              toast.success("Lưu trạng thái thành công!");

              localStorage.removeItem(`Lecturer${lecturer.id}`);
              localStorage.removeItem(`Degrees${lecturer.id}`);
              localStorage.removeItem(`Certification${lecturer.id}`);
              handleDialogClose();
            } catch (error) {
              console.error("Error saving lecturer details:", error);
              toast.error("Lỗi khi lưu trạng thái. Vui lòng thử lại sau.");
            }
          }}
        >
          Lưu
        </Button>
      </DialogActions>

      <ConfirmDialog
        open={confirmOpen}
        title={
          confirmType === "approve" ? "Xác nhận duyệt" : "Xác nhận từ chối"
        }
        content={
          confirmType === "approve" ? (
            `Bạn có chắc chắn muốn duyệt ${confirmTarget?.type} với id = ${confirmTarget?.id}?`
          ) : (
            <Box>
              <div>
                Bạn có chắc chắn muốn từ chối {confirmTarget?.type} với id ={" "}
                {confirmTarget?.id}?
              </div>
              <TextField
                label="Lý do từ chối (admin note)"
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

export default LecturerDetailDialog;
