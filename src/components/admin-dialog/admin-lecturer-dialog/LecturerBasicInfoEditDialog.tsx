import { Close } from "@mui/icons-material";
import PersonIcon from "@mui/icons-material/Person";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setLecturerProfileUpdate } from "../../../redux/slice/LecturerProfileUpdateSlice";
import type { Lecturer } from "../../../types/Lecturer";
import { API } from "../../../utils/Fetch";
import { LecturerProfileBasicInfoTab } from "./lecturer-profile-update-tab";

interface LecturerBasicInfoEditDialogProps {
  open: boolean;
  onClose: () => void;
  lecturer?: Lecturer;
}

const LecturerBasicInfoEditDialog = ({
  open,
  onClose,
  lecturer,
}: LecturerBasicInfoEditDialogProps) => {
  if (!open || !lecturer) return null;

  const dispatch = useDispatch();
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

  const handleRefreshData = async () => {
    await fetchLecturerData();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid",
          borderColor: "divider",
          pb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <PersonIcon color="primary" />
          <Box>
            <Typography variant="h6" component="div">
              Chỉnh sửa thông tin cơ bản
            </Typography>
            <Typography variant="body1" component="div">
              ID: {lecturer?.id}
            </Typography>
          </Box>
        </Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, height: "60vh", overflow: "auto" }}>
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
          <Box sx={{ p: 3 }}>
            <LecturerProfileBasicInfoTab onRefreshData={handleRefreshData} />
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LecturerBasicInfoEditDialog;
