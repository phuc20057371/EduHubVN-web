import { Business, ContactMail, Person } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setPendingInstitution } from "../../redux/slice/PendingInstitutionSlice";
import { setUserProfile } from "../../redux/slice/userSlice";
import type { InstitutionType } from "../../types/Institution";
import { API } from "../../utils/Fetch";
import { navigateToRole } from "../../utils/navigationRole";
import { validateInstitutionInfo } from "../../utils/Validate";

const InstitutionPendingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pendingInstitution = useSelector(
    (state: any) => state.pendingInstitution,
  );

  const [businessRegistrationNumber, setBusinessRegistrationNumber] =
    useState<string>("");
  const [institutionName, setInstitutionName] = useState<string>("");
  const [institutionType, setInstitutionType] =
    useState<InstitutionType>("UNIVERSITY");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [website, setWebsite] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [representativeName, setRepresentativeName] = useState<string>("");
  const [position, setPosition] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [establishedYear, setEstablishedYear] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await API.user.getUserProfile();
        dispatch(setUserProfile(response.data.data));
        if (response.data.data) {
          navigateToRole(response.data.data, navigate);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchPendingInstitution = async () => {
      try {
        const response = await API.user.getPendingInstitution();
        dispatch(setPendingInstitution(response.data.data));
      } catch (error) {}
    };
    fetchPendingInstitution();
  }, [dispatch]);

  useEffect(() => {
    if (pendingInstitution) {
      setBusinessRegistrationNumber(
        pendingInstitution.businessRegistrationNumber || "",
      );
      setInstitutionName(pendingInstitution.institutionName || "");
      setInstitutionType(pendingInstitution.institutionType || "UNIVERSITY");
      setPhoneNumber(pendingInstitution.phoneNumber || "");
      setWebsite(pendingInstitution.website || "");
      setAddress(pendingInstitution.address || "");
      setRepresentativeName(pendingInstitution.representativeName || "");
      setPosition(pendingInstitution.position || "");
      setDescription(pendingInstitution.description || "");
      setLogoUrl(pendingInstitution.logoUrl || "");
      setEstablishedYear(pendingInstitution.establishedYear || null);
    }
    setIsLoading(false);
  }, [pendingInstitution]);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <Typography variant="h6">Đang tải thông tin...</Typography>
      </Box>
    );
  }
  const handleSaveInstitution = async () => {
    const institutionData = {
      id: pendingInstitution ? pendingInstitution.id : "",
      businessRegistrationNumber,
      institutionName,
      institutionType,
      phoneNumber,
      website,
      address,
      representativeName,
      position,
      description,
      establishedYear,
      logoUrl,
    };
    const result = validateInstitutionInfo(institutionData);
    if (!result.success) {
      toast.error(result.error);
      return;
    }

    try {
      const response = await API.user.updateInstitution(institutionData);
      dispatch(setPendingInstitution(response.data.data));
      toast.success("Thông tin đã được lưu thành công!");
    } catch (error: any) {
      if (error.response?.data?.message?.includes("đã tồn tại")) {
        toast.error("Số ĐKKD đã được đăng ký trước đó.");
        window.location.reload();
        return;
      } else {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
        window.location.reload();
        return;
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: "bold" }}>
        Thông tin đăng ký Trường/Trung tâm đào tạo
      </Typography>
      {pendingInstitution && pendingInstitution.status === "PENDING" && (
        <Alert severity="warning" sx={{ mb: 4 }}>
          Thông tin đăng ký của bạn đang được xem xét và chờ phê duyệt.
        </Alert>
      )}
      {pendingInstitution && pendingInstitution.status === "REJECTED" && (
        <Alert severity="error" sx={{ mb: 4 }}>
          Thông tin đăng ký của bạn đã bị từ chối với lí do:{" "}
          {pendingInstitution.adminNote}.
        </Alert>
      )}

      <Stack spacing={3}>
        {/* Thông tin liên hệ */}
        <Card elevation={2}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={3}>
              <ContactMail color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight="bold">
                Thông tin liên hệ
              </Typography>
            </Box>
            <Stack spacing={3}>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <TextField
                  sx={{ flex: 1, minWidth: "300px" }}
                  label="Số điện thoại"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  variant="outlined"
                />
                <TextField
                  sx={{ flex: 1, minWidth: "300px" }}
                  label="Website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  variant="outlined"
                />
              </Box>
              <TextField
                fullWidth
                label="Địa chỉ"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                variant="outlined"
              />
            </Stack>
          </CardContent>
        </Card>

        {/* Thông tin người đại diện */}
        <Card elevation={2}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={3}>
              <Person color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight="bold">
                Thông tin người đại diện
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <TextField
                sx={{ flex: 1, minWidth: "300px" }}
                label="Tên người đại diện"
                value={representativeName}
                onChange={(e) => setRepresentativeName(e.target.value)}
                variant="outlined"
              />
              <TextField
                sx={{ flex: 1, minWidth: "300px" }}
                label="Chức vụ"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>
        {/* Thông tin tổ chức */}
        <Card elevation={2}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={3}>
              <Business color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight="bold">
                Thông tin tổ chức
              </Typography>
            </Box>
            <Stack spacing={3}>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <TextField
                  sx={{ flex: 1, minWidth: "300px" }}
                  label="Mã số đăng ký kinh doanh"
                  value={businessRegistrationNumber}
                  onChange={(e) =>
                    setBusinessRegistrationNumber(e.target.value)
                  }
                  variant="outlined"
                />
                <TextField
                  sx={{ flex: 1, minWidth: "300px" }}
                  label="Tên tổ chức giáo dục"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  variant="outlined"
                />
              </Box>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <FormControl sx={{ flex: 1, minWidth: "300px" }}>
                  <InputLabel id="institution-type-label">
                    Loại tổ chức
                  </InputLabel>
                  <Select
                    labelId="institution-type-label"
                    value={institutionType}
                    label="Loại tổ chức"
                    onChange={(e) => setInstitutionType(e.target.value)}
                  >
                    <MenuItem value="UNIVERSITY">Trường đại học</MenuItem>
                    <MenuItem value="TRAINING_CENTER">
                      Trung tâm đào tạo
                    </MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  sx={{ flex: 1, minWidth: "300px" }}
                  label="Năm thành lập"
                  value={establishedYear || 0}
                  onChange={(e) => setEstablishedYear(Number(e.target.value))}
                  variant="outlined"
                  type="number"
                />
              </Box>
              <TextField
                fullWidth
                label="Mô tả tổ chức"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                variant="outlined"
                multiline
                rows={4}
              />
            </Stack>
          </CardContent>
        </Card>

        {/* Trạng thái */}
        <Paper elevation={1} sx={{ p: 3, bgcolor: "grey.50" }}>
          <Box display="flex" alignItems="center" justifyContent="center">
            {/* <Chip
              label="Đang chờ phê duyệt"
              color="warning"
              variant="filled"
              size="medium"
              sx={{ fontSize: "1rem", py: 2, px: 3 }}
            /> */}
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => setConfirmOpen(true)}
            >
              Lưu
            </Button>
          </Box>
        </Paper>
      </Stack>

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Xác nhận lưu thông tin</DialogTitle>
        <DialogContent>
          Bạn có chắc chắn muốn lưu các thay đổi cho thông tin cơ sở giáo dục
          này?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="inherit">
            Hủy
          </Button>
          <Button
            onClick={() => {
              setConfirmOpen(false);
              handleSaveInstitution();
            }}
            color="primary"
            variant="contained"
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InstitutionPendingPage;
