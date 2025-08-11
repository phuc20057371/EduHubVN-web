import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { API } from "../../utils/Fetch";
import { setUserProfile } from "../../redux/slice/userSlice";
import { navigateToRole } from "../../utils/navigationRole";
import { setPendingPartner } from "../../redux/slice/PendingPartnerSlice";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Alert,
  Paper,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Business, Person, ContactMail } from "@mui/icons-material";
import { toast } from "react-toastify";

const PartnerPendingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pendingPartner = useSelector((state: any) => state.pendingPartner);

  const [businessRegistrationNumber, setBusinessRegistrationNumber] =
    useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [industry, setIndustry] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [representativeName, setRepresentativeName] = useState("");
  const [position, setPosition] = useState("");
  const [description, setDescription] = useState("");
  const [establishedYear, setEstablishedYear] = useState<number | null>(null);
  const [logoUrl, setLogoUrl] = useState("");
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
    const fetchPendingPartner = async () => {
      try {
        const response = await API.user.getPendingPartner();
        dispatch(setPendingPartner(response.data.data));
      } catch (error) {
        console.error("Error fetching pending partner data:", error);
      }
    };
    fetchPendingPartner();
  }, [dispatch]);

  useEffect(() => {
    if (pendingPartner) {
      setBusinessRegistrationNumber(pendingPartner.businessRegistrationNumber);
      setOrganizationName(pendingPartner.organizationName);
      setIndustry(pendingPartner.industry);
      setPhoneNumber(pendingPartner.phoneNumber);
      setWebsite(pendingPartner.website);
      setAddress(pendingPartner.address);
      setRepresentativeName(pendingPartner.representativeName);
      setPosition(pendingPartner.position);
      setDescription(pendingPartner.description);
      setEstablishedYear(pendingPartner.establishedYear || null);
      setLogoUrl(pendingPartner.logoUrl || "");
    }
    setIsLoading(false);
  }, [pendingPartner]);

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

  const handleSavePartner = async () => {
    const partnerData = {
      businessRegistrationNumber,
      organizationName,
      industry,
      phoneNumber,
      website,
      address,
      representativeName,
      position,
      description,
      establishedYear,
      logoUrl,
    };

    try {
      const response = await API.user.updatePartner(partnerData);
      dispatch(setPendingPartner(response.data.data));
      toast.success("Thông tin đã được lưu thành công!");
    } catch (error: any) {
      if (error.response?.data?.message?.includes("đã tồn tại")) {
        toast.error("Số ĐKKD đã được đăng ký trước đó.");
      } else {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
        window.location.reload();
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: "bold" }}>
        Thông tin đăng ký Đối tác doanh nghiệp
      </Typography>
      {pendingPartner && pendingPartner.status === "PENDING" && (
        <Alert severity="warning" sx={{ mb: 4 }}>
          Thông tin đăng ký của bạn đang được xem xét và chờ phê duyệt.
        </Alert>
      )}
      {pendingPartner && pendingPartner.status === "REJECTED" && (
        <Alert severity="error" sx={{ mb: 4 }}>
          Thông tin đăng ký của bạn đã bị từ chối với lí do:{" "}
          {pendingPartner.adminNote}.
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
                  InputLabelProps={{ shrink: !!phoneNumber }}
                />
                <TextField
                  sx={{ flex: 1, minWidth: "300px" }}
                  label="Website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  variant="outlined"
                  InputLabelProps={{ shrink: !!website }}
                />
              </Box>
              <TextField
                fullWidth
                label="Địa chỉ"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                variant="outlined"
                InputLabelProps={{ shrink: !!address }}
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
                InputLabelProps={{ shrink: !!representativeName }}
              />
              <TextField
                sx={{ flex: 1, minWidth: "300px" }}
                label="Chức vụ"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                variant="outlined"
                InputLabelProps={{ shrink: !!position }}
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
                  InputLabelProps={{ shrink: !!businessRegistrationNumber }}
                />
                <TextField
                  sx={{ flex: 1, minWidth: "300px" }}
                  label="Tên tổ chức"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  variant="outlined"
                  InputLabelProps={{ shrink: !!organizationName }}
                />
              </Box>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <TextField
                  sx={{ flex: 1, minWidth: "300px" }}
                  label="Lĩnh vực hoạt động"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  variant="outlined"
                  InputLabelProps={{ shrink: !!industry }}
                />
                <TextField
                  sx={{ flex: 1, minWidth: "300px" }}
                  label="Năm thành lập"
                  value={establishedYear || ""}
                  onChange={(e) =>
                    setEstablishedYear(Number(e.target.value) || null)
                  }
                  variant="outlined"
                  type="number"
                  InputLabelProps={{ shrink: !!establishedYear }}
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
                InputLabelProps={{ shrink: !!description }}
              />
            </Stack>
          </CardContent>
        </Card>

        {/* Logo URL (tùy chọn) */}
        {/* {logoUrl && (
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={3}>
                <Business color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  Logo tổ chức
                </Typography>
              </Box>
              <TextField
                fullWidth
                label="URL Logo"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                variant="outlined"
              />
            </CardContent>
          </Card>
        )} */}

        {/* Nút lưu */}
        <Paper elevation={1} sx={{ p: 3, bgcolor: "grey.50" }}>
          <Box display="flex" alignItems="center" justifyContent="center">
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
          Bạn có chắc chắn muốn lưu các thay đổi cho thông tin đối tác này?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="inherit">
            Hủy
          </Button>
          <Button
            onClick={() => {
              setConfirmOpen(false);
              handleSavePartner();
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

export default PartnerPendingPage;
