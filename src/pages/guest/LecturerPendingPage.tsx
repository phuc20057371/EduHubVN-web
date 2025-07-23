
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPendingLecturer } from "../../redux/slice/PendingLectuererSlice";
import { API } from "../../utils/Fetch";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Avatar, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import DegreeUpdateDialog from "../../components/DegreeUpdateDialog";
import CertificationUpdateDialog from "../../components/CertificationUpdateDialog";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import { setUserProfile } from "../../redux/slice/userSlice";
import { useNavigate } from "react-router-dom";
import { navigateToRole } from "../../utils/navigationRole";
import { toast } from "react-toastify";

const LecturerPendingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pendingLecturer = useSelector((state: any) => state.pendingLecturer);
  const [openDegreeDialog, setOpenDegreeDialog] = useState(false);
  const [selectedDegree, setSelectedDegree] = useState<any>(null);
  const [openCertificationDialog, setOpenCertificationDialog] = useState(false);
  const [selectedCertification, setSelectedCertification] = useState<any>(null);

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
    const fetchPendingLecturers = async () => {
      try {
        const response = await API.user.getPendingLecturer();
        dispatch(setPendingLecturer(response.data.data));
        console.log("Pending lecturers:", response.data.data);
      } catch (error) {
        console.error("Error fetching pending lecturers:", error);
      }
    }
    fetchPendingLecturers();
  }, [dispatch]);

  const [citizenId, setCitizenId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState(false);
  const [bio, setBio] = useState('');
  const [address, setAddress] = useState('');
  const [academicRank, setAcademicRank] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [experienceYears, setExperienceYears] = useState(0);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (pendingLecturer && pendingLecturer.lecturer) {

      setCitizenId(pendingLecturer.lecturer.citizenId || '');
      setPhoneNumber(pendingLecturer.lecturer.phoneNumber || '');
      setFullName(pendingLecturer.lecturer.fullName || '');
      setDateOfBirth(pendingLecturer.lecturer.dateOfBirth || '');
      setGender(pendingLecturer.lecturer.gender || false);
      setBio(pendingLecturer.lecturer.bio || '');
      setAddress(pendingLecturer.lecturer.address || '');
      setAcademicRank(pendingLecturer.lecturer.academicRank || '');
      setSpecialization(pendingLecturer.lecturer.specialization || '');
      setExperienceYears(pendingLecturer.lecturer.experienceYears || 0);
      setStatus(pendingLecturer.lecturer.status || '');
    }
  }, [pendingLecturer]);

  useEffect(() => {
    const isChanged = () => {
      if (!pendingLecturer || !pendingLecturer.lecturer) return false;
      const l = pendingLecturer.lecturer;
      return (
        citizenId !== (l.citizenId || '') ||
        phoneNumber !== (l.phoneNumber || '') ||
        fullName !== (l.fullName || '') ||
        dateOfBirth !== (l.dateOfBirth || '') ||
        gender !== (l.gender || false) ||
        bio !== (l.bio || '') ||
        address !== (l.address || '') ||
        academicRank !== (l.academicRank || '') ||
        specialization !== (l.specialization || '') ||
        experienceYears !== (l.experienceYears || 0) ||
        status !== (l.status || '')
      );
    };
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isChanged()) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [citizenId, phoneNumber, fullName, dateOfBirth, gender, bio, address, academicRank, specialization, experienceYears, status, pendingLecturer]);


  if (!pendingLecturer || !pendingLecturer.lecturer) {
    return <div>Không có thông tin giảng viên đang chờ duyệt.</div>;
  }

  const { lecturer, degrees, certifications } = pendingLecturer;
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSaveChanges = () => {
    setOpenConfirmDialog(true);
  };

  const handleConfirmSave = async () => {
    if (!pendingLecturer || !pendingLecturer.lecturer) return;
    setLoading(true);
    try {
      const updatedLecturer = {
        ...pendingLecturer.lecturer,
        citizenId,
        phoneNumber,
        fullName,
        dateOfBirth,
        gender,
        bio,
        address,
        academicRank,
        specialization,
        experienceYears,
        status: "PENDING",
      };
      const updatedPendingLecturer = {
        ...pendingLecturer,
        lecturer: updatedLecturer,
      };
      setOpenConfirmDialog(false);
      console.log('pendingLecturer sau khi cập nhật:', updatedPendingLecturer);
      const response = await API.user.updatePendingLecturer(updatedPendingLecturer);
      if (response.data.success) {
        dispatch(setPendingLecturer(response.data.data));
      }
      toast.success('Đã lưu thay đổi thông tin giảng viên thành công');
    } catch (error) {
      toast.error('Lỗi khi lưu thay đổi: ');
      window.location.reload();
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-col items-center w-3/5 p-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-row w-full gap-8">
        {/* Left: Lecturer Info */}
        <div className="w-full md:w-1/2">
          {/* Personal Info */}
          <div className="flex items-center gap-4 mb-6">
            <Avatar
              src={lecturer.avatarUrl}
              alt={lecturer.fullName}
              sx={{ width: 100, height: 100 }}
            />
            <div className="w-full">

              <TextField
                label="Trạng thái"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                fullWidth
                margin="dense"
              />
              <TextField
                label="Ghi chú của admin"
                value={lecturer.adminNote || 'Không có'}
                InputProps={{ readOnly: true }}
                fullWidth
                margin="dense"
              />
            </div>
          </div>
          <div className="mb-4">
            <div className="mb-1 text-base font-semibold text-gray-700">Thông tin cá nhân</div>
            <TextField
              label="Họ tên"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              fullWidth
              margin="dense"
            />

            <div className="flex flex-row gap-4">
              <TextField
                label="Mã số"
                value={citizenId}
                onChange={(e) => setCitizenId(e.target.value)}
                fullWidth
                margin="dense"
              />
              <TextField
                label="Ngày sinh"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                margin="dense"
              />
              <div className="flex flex-col items-start mt-2 mb-2">
                <span className="mr-4 text-gray-700">Giới tính:</span>
                <div className="flex flex-row gap-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="Nam"
                      checked={gender === true}
                      onChange={() => setGender(true)}
                      className="mr-1"
                    />
                    Nam
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="Nữ"
                      checked={gender === false}
                      onChange={() => setGender(false)}
                      className="mr-1"
                    />
                    Nữ
                  </label>
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-4">
              <TextField
                label="Số điện thoại"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                fullWidth
                margin="dense"
              />
              <TextField
                label="Địa chỉ"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                fullWidth
                margin="dense"
              />
            </div>

          </div>
          <div className="mb-4">
            <div className="mb-1 text-base font-semibold text-gray-700">Thông tin học thuật</div>
            <div className="flex flex-row gap-2">
              <FormControl fullWidth margin="dense">
                <InputLabel shrink={!!academicRank}>Học vị</InputLabel>
                <Select
                  value={academicRank}
                  onChange={(e) => setAcademicRank(e.target.value)}
                  label="Học vị"
                >
                  <MenuItem value="CN">Cử nhân</MenuItem>
                  <MenuItem value="THS">Thạc sĩ</MenuItem>
                  <MenuItem value="TS">Tiến sĩ</MenuItem>
                  <MenuItem value="PGS">Phó Giáo sư</MenuItem>
                  <MenuItem value="GS">Giáo sư</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Số năm kinh nghiệm"
                value={experienceYears}
                type="number"
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                fullWidth
                margin="dense"
              />
            </div>

            <TextField
              label="Chuyên ngành"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              fullWidth
              margin="dense"
            />

            <TextField
              label="Tiểu sử"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              fullWidth
              margin="dense"
              multiline
              rows={2}
            />
          </div>
          <div className="flex flex-row gap-4">


            <TextField
              label="Ngày tạo"
              value={lecturer.createdAt ? new Date(lecturer.createdAt).toLocaleString('vi-VN') : 'Chưa cập nhật'}
              InputProps={{ readOnly: true }}
              fullWidth
              margin="dense"
            />
            <TextField
              label="Cập nhật gần nhất"
              value={lecturer.updatedAt ? new Date(lecturer.updatedAt).toLocaleString('vi-VN') : 'Chưa cập nhật'}
              InputProps={{ readOnly: true }}
              fullWidth
              margin="dense"
            />
          </div>
        </div>
        {/* Right: Degrees and Certifications as Accordions */}
        <div className="flex flex-row w-full gap-6 md:w-1/2 ">
          {/* Degrees */}
          <div>
            <h3 className="mb-2 text-lg font-semibold">Bằng cấp</h3>
            {degrees && degrees.length > 0 ? (
              degrees.map((deg: any) => {

                return (
                  <Accordion key={deg.id} sx={{
                    backgroundColor:
                      deg.status === 'APPROVED'
                        ? '#bbf7d0' // Màu xanh nhạt
                        : deg.status === 'REJECTED'
                          ? '#fecaca' // Màu đỏ nhạt
                          : '#fff',   // Trắng
                  }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`degree-panel${deg.id}-content`}
                      id={`degree-panel${deg.id}-header`}
                    >
                      <Typography component="span">{deg.name} ({deg.level})</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div className="space-y-1">
                        <div><b>Chuyên ngành:</b> {deg.major}</div>
                        <div><b>Trường:</b> {deg.institution}</div>
                        <div><b>Thời gian:</b> {deg.startYear} - {deg.graduationYear}</div>
                        <div><b>Mô tả:</b> {deg.description}</div>
                        <div><b>Ghi chú admin:</b> {deg.adminNote || 'Không có'}</div>
                        <div><b>Trạng thái:</b> {deg.status}</div>
                        <div><b>File:</b> <a href={deg.url} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Xem file</a></div>
                      </div>
                    </AccordionDetails>
                    <Box sx={{ mt: 1 }}>
                      <button
                        style={{ padding: '6px 16px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                        onClick={() => {
                          setSelectedDegree(deg);
                          setOpenDegreeDialog(true);
                        }}
                      >
                        Xem chi tiết
                      </button>
                    </Box>
                  </Accordion>
                );
              })
            ) : (
              <div>Không có bằng cấp.</div>
            )}
          </div>
          {/* Certifications */}
          <div>
            <h3 className="mb-2 text-lg font-semibold">Chứng chỉ</h3>
            {certifications && certifications.length > 0 ? (
              certifications.map((cert: any) => {

                return (
                  <Accordion key={cert.id} sx={{
                    backgroundColor:
                      cert.status === 'APPROVED'
                        ? '#bbf7d0' // Màu xanh nhạt
                        : cert.status === 'REJECTED'
                          ? '#fecaca' // Màu đỏ nhạt
                          : '#fff',   // Trắng
                  }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`cert-panel${cert.id}-content`}
                      id={`cert-panel${cert.id}-header`}
                    >
                      <Typography component="span">{cert.name} ({cert.level})</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div className="space-y-1">
                        <div><b>Cấp bởi:</b> {cert.issuedBy}</div>
                        <div><b>Ngày cấp:</b> {cert.issueDate}</div>
                        <div><b>Ngày hết hạn:</b> {cert.expiryDate}</div>
                        <div><b>Mô tả:</b> {cert.description}</div>
                        <div><b>Ghi chú admin:</b> {cert.adminNote || 'Không có'}</div>
                        <div><b>Trạng thái:</b> {cert.status}</div>
                        <div><b>File:</b> <a href={cert.certificateUrl} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Xem file</a></div>
                      </div>
                    </AccordionDetails>
                    <Box sx={{ mt: 1 }}>
                      <button
                        style={{ padding: '6px 16px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                        onClick={() => {
                          setSelectedCertification(cert);
                          setOpenCertificationDialog(true);
                        }}
                      >
                        Xem chi tiết
                      </button>
                    </Box>
                  </Accordion>
                );
              })
            ) : (
              <div>Không có chứng chỉ.</div>
            )}

            <DegreeUpdateDialog
              open={openDegreeDialog}
              onClose={() => { setOpenDegreeDialog(false); setSelectedDegree(null); }}
              data={selectedDegree}
            />
            <CertificationUpdateDialog
              open={openCertificationDialog}
              onClose={() => { setOpenCertificationDialog(false); setSelectedCertification(null); }}
              data={selectedCertification}
            />
          </div>
        </div>
      </div>
      <button className="px-4 py-2 mt-6 text-white transition-colors duration-200 bg-green-600 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 active:scale-95"
        onClick={handleSaveChanges}
        disabled={loading}
      >
        {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
      </button>
      {loading && (
        <Box sx={{ width: '100%', mt: 2 }}>
          <LinearProgress />
        </Box>
      )}
      {/* Dialog xác nhận lưu */}
      <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)} maxWidth="xs">
        <DialogTitle>Xác nhận Lưu</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn lưu các thay đổi thông tin giảng viên?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)}>Hủy</Button>
          <Button onClick={handleConfirmSave} color="primary" variant="contained">Xác nhận</Button>
        </DialogActions>
      </Dialog>
    </div>

  );
}

export default LecturerPendingPage