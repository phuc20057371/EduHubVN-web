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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import type { Institution } from "../types/Institution";
import type {
  EducationInstitutionType,
} from "../types/InstitutionRequest";
import { API } from "../utils/Fetch";
import { setInstitutions } from "../redux/slice/InstitutionSlice";

interface InstitutionEditDialogProps {
  open: boolean;
  onClose: () => void;
  institution?: Institution;
}

const InstitutionEditDialog = ({
  open,
  onClose,
  institution,
}: InstitutionEditDialogProps) => {
  if (!open || !institution) return null;

  const institutions = useSelector((state: any) => state.institution || []);
  const dispatch = useDispatch();

  const [businessRegistrationNumber, setBusinessRegistrationNumber] = useState(
    institution.businessRegistrationNumber || "",
  );
  const [institutionName, setInstitutionName] = useState(
    institution.institutionName || "",
  );
  const [institutionType, setInstitutionType] =
    useState<EducationInstitutionType>(
      institution.institutionType === "UNIVERSITY" ||
        institution.institutionType === "TRAINING_CENTER"
        ? (institution.institutionType as EducationInstitutionType)
        : "UNIVERSITY",
    );
  const [phoneNumber, setPhoneNumber] = useState(institution.phoneNumber || "");
  const [website, setWebsite] = useState(institution.website || "");
  const [address, setAddress] = useState(institution.address || "");
  const [representativeName, setRepresentativeName] = useState(
    institution.representativeName || "",
  );
  const [position, setPosition] = useState(institution.position || "");
  const [description, setDescription] = useState(institution.description || "");
  const [establishedYear, setEstablishedYear] = useState(
    institution.establishedYear?.toString() || "",
  );
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleSave = () => {
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    setConfirmOpen(false);
    try {
      // Tạo institution đã được cập nhật với đầy đủ thông tin
      const updatedInstitution: Institution = {
        ...institution,
        businessRegistrationNumber,
        institutionName,
        institutionType,
        phoneNumber,
        website,
        address,
        representativeName,
        position,
        description,
        establishedYear: Number(establishedYear) || 0,
        logoUrl: institution.logoUrl || "",
        // Giữ nguyên các thông tin hệ thống
        id: institution.id,
        status: institution.status,
        adminNote: institution.adminNote,
        createdAt: institution.createdAt,
        updatedAt: new Date().toISOString(), // Cập nhật thời gian
      };
      const res = await API.admin.updateInstitution(updatedInstitution);
      // Cập nhật vào Redux store
      dispatch(
        setInstitutions(
          institutions.map((inst: Institution) =>
            inst.id === institution.id ? updatedInstitution : inst,
          ),
        ),
      );
      console.log("Update response:", res.data);
      toast.success("Cập nhật thông tin cơ sở giáo dục thành công");
      onClose();
    } catch (error) {
      console.error("Error updating institution:", error);
      toast.error("Cập nhật thông tin cơ sở giáo dục thất bại");
    }
  };

  const handleCancel = () => {
    setConfirmOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle>Chỉnh sửa thông tin cơ sở giáo dục</DialogTitle>
        <DialogContent dividers>
          <div>
            <Avatar
              src={institution.logoUrl || undefined}
              alt={institution.institutionName}
              sx={{ width: 80, height: 80, mb: 1.5, border: "1px solid #ddd" }}
            />
            <div className="flex flex-row gap-4">
              <div className="w-1/2 flex-1">
                <Box mb={2}>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Thông tin cơ sở
                  </Typography>
                  <TextField
                    label="Số đăng ký kinh doanh"
                    value={businessRegistrationNumber}
                    onChange={(e) =>
                      setBusinessRegistrationNumber(e.target.value)
                    }
                    fullWidth
                    margin="dense"
                    InputLabelProps={{ shrink: !!businessRegistrationNumber }}
                  />
                  <TextField
                    label="Tên cơ sở giáo dục"
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    fullWidth
                    margin="dense"
                    InputLabelProps={{ shrink: !!institutionName }}
                  />
                  <FormControl fullWidth margin="dense">
                    <InputLabel shrink={!!institutionType}>
                      Loại cơ sở giáo dục
                    </InputLabel>
                    <Select
                      value={institutionType}
                      onChange={(e) =>
                        setInstitutionType(
                          e.target.value as EducationInstitutionType,
                        )
                      }
                      label="Loại cơ sở giáo dục"
                    >
                      <MenuItem value="UNIVERSITY">Trường</MenuItem>
                      <MenuItem value="TRAINING_CENTER">
                        Trung tâm đào tạo
                      </MenuItem>
                    </Select>
                  </FormControl>
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
                    label="Mô tả cơ sở"
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
                        #{institution.id}
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
                        {institution.status || "Chưa có trạng thái"}
                      </Typography>
                    </Box>

                    {institution.adminNote && (
                      <Box mb={1.5}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: "0.75rem", mb: 0.5 }}
                        >
                          Ghi chú của admin
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {institution.adminNote}
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
                        {institution.createdAt
                          ? new Date(institution.createdAt).toLocaleString(
                              "vi-VN",
                            )
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
                        {institution.updatedAt
                          ? new Date(institution.updatedAt).toLocaleString(
                              "vi-VN",
                            )
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
          Bạn có chắc chắn muốn lưu các thay đổi cho cơ sở giáo dục này?
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

export default InstitutionEditDialog;
