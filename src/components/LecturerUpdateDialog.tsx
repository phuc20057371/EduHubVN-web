
// Removed duplicate Dialog, DialogTitle, DialogContent, DialogActions imports
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import type { Lecturer } from '../types/Lecturer';
import { Avatar, Box, Typography, Radio, RadioGroup, FormControlLabel, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
// Removed duplicate useState import
import { useState } from 'react';
import { API } from '../utils/Fetch';
import { useDispatch, useSelector } from 'react-redux';
import { setLecturers } from '../redux/slice/LecturerSlice';
import { toast } from 'react-toastify';

interface LecturerUpdateDialogProps {
    open: boolean;
    onClose: () => void;
    lecturer?: Lecturer;
}

const LecturerUpdateDialog = ({ open, onClose, lecturer }: LecturerUpdateDialogProps) => {
    if (!open || !lecturer) return null;
    const lecturers = useSelector((state: any) => state.lecturer || []);
    const dispatch = useDispatch();
    const [fullName, setFullName] = useState(lecturer.fullName || '');
    const [academicRank, setAcademicRank] = useState(lecturer.academicRank || '');
    const [specialization, setSpecialization] = useState(lecturer.specialization || '');
    const [experienceYears, setExperienceYears] = useState(lecturer.experienceYears || '');
    const [phoneNumber, setPhoneNumber] = useState(lecturer.phoneNumber || '');
    const [dateOfBirth, setDateOfBirth] = useState(lecturer.dateOfBirth || '');
    const [gender, setGender] = useState(
        lecturer.gender === true || lecturer.gender
            ? 'true'
            : lecturer.gender === false || lecturer.gender === 'false'
                ? 'false'
                : ''
    );
    const [address, setAddress] = useState(lecturer.address || '');
    const [bio, setBio] = useState(lecturer.bio || '');
    const [status, setStatus] = useState(lecturer.status || '');
    const [adminNote, setAdminNote] = useState(lecturer.adminNote || '');
    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleSave = () => {
        setConfirmOpen(true);
    };

    const handleConfirm = async () => {
        setConfirmOpen(false);
        try {
            const updatedLecturer = {
                ...lecturer,
                fullName,
                academicRank,
                specialization,
                experienceYears: Number(experienceYears) || 0,
                phoneNumber,
                dateOfBirth,
                gender: gender === 'true',
                address,
                bio,
                status,
                adminNote,
            };
            const res = await API.admin.updateLecturer(updatedLecturer);
            dispatch(setLecturers(lecturers.map((l: Lecturer) => l.id === lecturer.id ? updatedLecturer : l)));
            console.log('Update response:', res.data);
            // Print the updated lecturer object
            console.log('Lecturer to update:', updatedLecturer);
            toast.success('Cập nhật thông tin giảng viên thành công');
            onClose();
        } catch (error) {
            console.error('Error updating lecturer:', error);
            toast.error('Cập nhật thông tin giảng viên thất bại');
            return;

        }

    };

    const handleCancel = () => {
        setConfirmOpen(false);
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
                <DialogTitle>Chỉnh sửa thông tin giảng viên</DialogTitle>
                <DialogContent dividers>
                    {lecturer ? (
                        <div>
                            <Avatar
                                src={lecturer.avatarUrl || undefined}
                                alt={lecturer.fullName}
                                sx={{ width: 80, height: 80, mb: 1.5, border: '1px solid #ddd' }}>
                            </Avatar>
                            <div className='flex flex-row gap-4'>
                                <div className='flex-1 w-1/2'>
                                    <Box mb={2}>
                                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>Thông tin cá nhân</Typography>
                                        <TextField label="Họ tên" value={fullName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)} fullWidth margin="dense" />
                                        <div className='flex flex-row gap-2'>
                                            <TextField label="Ngày sinh" value={dateOfBirth} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDateOfBirth(e.target.value)} fullWidth margin="dense" type="date" InputLabelProps={{ shrink: true }} />

                                            <Box mt={1} mb={1}>
                                                <Typography variant="body2" sx={{ mb: 0.5 }}>Giới tính</Typography>
                                                <RadioGroup
                                                    row
                                                    value={gender}
                                                    onChange={e => setGender(e.target.value)}
                                                >
                                                    <div className='flex flex-row gap-2'>
                                                        <FormControlLabel value="true" control={<Radio />} label="Nam" />
                                                        <FormControlLabel value="false" control={<Radio />} label="Nữ" />
                                                    </div>

                                                </RadioGroup>
                                            </Box>
                                        </div>

                                        <TextField label="Địa chỉ" value={address} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)} fullWidth margin="dense" />
                                    </Box>
                                    <Box mb={2}>
                                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>Học thuật</Typography>
                                        <TextField label="Học vị" value={academicRank} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAcademicRank(e.target.value)} fullWidth margin="dense" />
                                        <div className='flex flex-row gap-2'>
                                            <TextField label="Chuyên ngành" value={specialization} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSpecialization(e.target.value)} fullWidth margin="dense" />
                                            <TextField label="Số năm kinh nghiệm" value={experienceYears} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setExperienceYears(e.target.value)} fullWidth margin="dense" type="number" />
                                        </div>
                                        <TextField label="Tiểu sử" value={bio} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBio(e.target.value)} fullWidth margin="dense" multiline rows={2} />
                                    </Box>
                                </div>
                                <div className='flex-1 w-1/2'>
                                    <Box mb={2}>
                                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>Liên hệ</Typography>
                                        <TextField label="Số điện thoại" value={phoneNumber} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)} fullWidth margin="dense" />
                                    </Box>

                                    <Box mb={2}>
                                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>Quản trị</Typography>
                                        <TextField label="Trạng thái" value={status} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStatus(e.target.value)} fullWidth margin="dense" />
                                        <TextField label="Ghi chú của admin" value={adminNote} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAdminNote(e.target.value)} fullWidth margin="dense" InputProps={{ readOnly: true }} />
                                        <TextField label="Vào lúc" value={lecturer.updatedAt ? new Date(lecturer.updatedAt).toLocaleString('vi-VN') : 'Chưa cập nhật'} fullWidth margin="dense" InputProps={{ readOnly: true }} />
                                        <TextField label="Được tạo lúc" value={lecturer.createdAt ? new Date(lecturer.createdAt).toLocaleString('vi-VN') : 'Chưa cập nhật'} fullWidth margin="dense" InputProps={{ readOnly: true }} />
                                    </Box>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div>Không có dữ liệu giảng viên.</div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSave} color="primary" variant="contained">Lưu</Button>
                    <Button onClick={onClose} color="inherit">Hủy</Button>
                </DialogActions>
            </Dialog>
            {/* Confirmation Dialog */}
            <Dialog open={confirmOpen} onClose={handleCancel}>
                <DialogTitle>Xác nhận lưu thay đổi</DialogTitle>
                <DialogContent>Bạn có chắc chắn muốn lưu các thay đổi cho giảng viên này?</DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirm} color="primary" variant="contained">Xác nhận</Button>
                    <Button onClick={handleCancel} color="inherit">Hủy</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default LecturerUpdateDialog