
import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Avatar,
  Box,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import type { Partner } from "../types/Parner";
import { API } from "../utils/Fetch";
import { setPartner } from "../redux/slice/PartnerSlice";

interface PartnerEditDialogProps {
  open: boolean;
  onClose: () => void;
  partner?: Partner;
}

const PartnerEditDialog = ({
  open,
  onClose,
  partner,
}: PartnerEditDialogProps) => {
  if (!open || !partner) return null;

  const partners = useSelector((state: any) => state.partner || []);
  const dispatch = useDispatch();

  const [organizationName, setOrganizationName] = useState(partner.organizationName || "");
  const [industry, setIndustry] = useState(partner.industry || "");
  const [phoneNumber, setPhoneNumber] = useState(partner.phoneNumber || "");
  const [website, setWebsite] = useState(partner.website || "");
  const [address, setAddress] = useState(partner.address || "");
  const [representativeName, setRepresentativeName] = useState(partner.representativeName || "");
  const [position, setPosition] = useState(partner.position || "");
  const [description, setDescription] = useState(partner.description || "");
  const [establishedYear, setEstablishedYear] = useState(partner.establishedYear?.toString() || "");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleSave = () => {
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    setConfirmOpen(false);
    try {
      const updatedPartner: Partner = {
        ...partner,
        organizationName,
        industry,
        phoneNumber,
        website,
        address,
        representativeName,
        position,
        description,
        establishedYear: Number(establishedYear) || null,
        logoUrl: partner.logoUrl || "",
        id: partner.id,
        status: partner.status,
        adminNote: partner.adminNote,
        createdAt: partner.createdAt,
        updatedAt: new Date().toISOString(),
      };

      const res = await API.admin.updatePartner(updatedPartner);
      dispatch(
        setPartner(
          partners.map((p: Partner) =>
            p.id === partner.id ? updatedPartner : p,
          ),
        ),
      );
      console.log("Update response:", res.data);
      toast.success("Cập nhật thông tin đối tác thành công");
      onClose();
    } catch (error) {
      console.error("Error updating partner:", error);
      toast.error("Cập nhật thông tin đối tác thất bại");
    }
  };

  const handleCancel = () => {
    setConfirmOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle>Chỉnh sửa thông tin đối tác</DialogTitle>
        <DialogContent dividers>
          <div>
            <Avatar
              src={partner.logoUrl || undefined}
              alt={partner.organizationName}
              sx={{ width: 80, height: 80, mb: 1.5, border: "1px solid #ddd" }}
            />
            <div className="flex flex-row gap-4">
              <div className="w-1/2 flex-1">
                <Box mb={2}>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Thông tin tổ chức
                  </Typography>
                  <TextField
                    label="Tên tổ chức"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    fullWidth
                    margin="dense"
                    InputLabelProps={{ shrink: !!organizationName }}
                  />
                  <TextField
                    label="Ngành nghề"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    fullWidth
                    margin="dense"
                    InputLabelProps={{ shrink: !!industry }}
                  />
                  <div className="flex flex-row gap-2">
                    <TextField
                      label="Năm thành lập"
                      value={establishedYear}
                      onChange={(e) => setEstablishedYear(e.target.value)}
                      fullWidth
                      margin="dense"
                      type="number"
                      InputLabelProps={{ shrink: !!establishedYear }}
                    />
                    <TextField
                      label="Số điện thoại"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      fullWidth
                      margin="dense"
                      InputLabelProps={{ shrink: !!phoneNumber }}
                    />
                  </div>
                  <TextField
                    label="Website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    fullWidth
                    margin="dense"
                    InputLabelProps={{ shrink: !!website }}
                  />
                  <TextField
                    label="Địa chỉ"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    fullWidth
                    margin="dense"
                    InputLabelProps={{ shrink: !!address }}
                  />
                </Box>
                <Box mb={2}>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Người đại diện
                  </Typography>
                  <TextField
                    label="Tên người đại diện"
                    value={representativeName}
                    onChange={(e) => setRepresentativeName(e.target.value)}
                    fullWidth
                    margin="dense"
                    InputLabelProps={{ shrink: !!representativeName }}
                  />
                  <TextField
                    label="Chức vụ"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    fullWidth
                    margin="dense"
                    InputLabelProps={{ shrink: !!position }}
                  />
                </Box>
              </div>
              <div className="w-1/2 flex-1">
                <Box mb={2}>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Mô tả
                  </Typography>
                  <TextField
                    label="Mô tả tổ chức"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    margin="dense"
                    multiline
                    rows={4}
                    InputLabelProps={{ shrink: !!description }}
                  />
                </Box>
                <Box mb={2}>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Thông tin hệ thống
                  </Typography>
                  <Box
                    sx={{
                      backgroundColor: "#f8f9fa",
                      padding: 2,
                      borderRadius: 1,
                      border: "1px solid #e9ecef",
                    }}
                  >
                    <Box mb={1.5}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: "0.75rem", mb: 0.5 }}
                      >
                        ID
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        #{partner.id}
                      </Typography>
                    </Box>

                    <Box mb={1.5}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: "0.75rem", mb: 0.5 }}
                      >
                        Trạng thái
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {partner.status || "Chưa có trạng thái"}
                      </Typography>
                    </Box>

                    {partner.adminNote && (
                      <Box mb={1.5}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: "0.75rem", mb: 0.5 }}
                        >
                          Ghi chú của admin
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {partner.adminNote}
                        </Typography>
                      </Box>
                    )}

                    <Box mb={1.5}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: "0.75rem", mb: 0.5 }}
                      >
                        Được tạo lúc
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {partner.createdAt
                          ? new Date(partner.createdAt).toLocaleString("vi-VN")
                          : "Chưa cập nhật"}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: "0.75rem", mb: 0.5 }}
                      >
                        Được cập nhật lúc
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {partner.updatedAt
                          ? new Date(partner.updatedAt).toLocaleString("vi-VN")
                          : "Chưa cập nhật"}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSave} color="primary" variant="contained">
            Lưu
          </Button>
          <Button onClick={onClose} color="inherit">
            Hủy
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={handleCancel}>
        <DialogTitle>Xác nhận lưu thay đổi</DialogTitle>
        <DialogContent>
          Bạn có chắc chắn muốn lưu các thay đổi cho đối tác này?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirm} color="primary" variant="contained">
            Xác nhận
          </Button>
          <Button onClick={handleCancel} color="inherit">
            Hủy
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PartnerEditDialog;