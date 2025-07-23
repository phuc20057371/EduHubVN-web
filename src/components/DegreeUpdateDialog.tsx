
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { setPendingLecturer } from '../redux/slice/PendingLectuererSlice';


interface DegreeUpdateDialogProps {
    open: boolean;
    onClose: () => void;
    data: any;
}

const DegreeUpdateDialog = ({ open, onClose, data }: DegreeUpdateDialogProps) => {
    if (!data) return null;
    const dispatch = useDispatch();
    const [degree, setDegree] = useState(data);
    const current = useSelector((state: any) => state.pendingLecturer);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const [referenceId, setReferenceId] = useState(degree?.referenceId || '');
    const [name, setName] = useState(degree?.name || '');
    const [major, setMajor] = useState(degree?.major || '');
    const [institution, setInstitution] = useState(degree?.institution || '');
    const [startYear, setStartYear] = useState(degree?.startYear || '');
    const [graduationYear, setGraduationYear] = useState(degree?.graduationYear || '');
    const [level, setLevel] = useState(degree?.level || '');
    // const [url, setUrl] = useState(degree?.url || '');
    const url = degree?.url || '';
    const [description, setDescription] = useState(degree?.description || '');

    const handleConfirm = async () => {
        setOpenConfirmDialog(true);
    };
    console.log('Degree data:', degree);
    const handleSave = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        try {
            // Update status before saving

            const updatedDegree = {
                ...degree,
                name,
                referenceId,
                major,
                institution,
                startYear,
                graduationYear,
                level,
                url,
                description,
                status: 'PENDING'
            };
            setDegree(updatedDegree);
            // Replace degree with same id
            const updatedDegrees = Array.isArray(current.degrees)
                ? current.degrees.map((d: any) => d.id === updatedDegree.id ? { ...updatedDegree } : d)
                : [];
            const updatedPendingLecturer = {
                ...current,
                degrees: updatedDegrees,
            };
            dispatch(setPendingLecturer(updatedPendingLecturer));
            setOpenConfirmDialog(false);
            onClose();
        } catch (error) {
            // Xử lý lỗi nếu cần
            console.error('Lỗi khi lưu bằng cấp:', error);
        }
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    Chi tiết bằng cấp
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        edge="end"
                        sx={{ color: (theme) => theme.palette.grey[500] }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <div style={{ display: 'flex', gap: 32 }}>
                        {/* Thông tin bằng cấp bên trái */}
                        <div className='flex flex-col w-full gap-3'>
                            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>🎓 Thông tin bằng cấp</Typography>
                            <TextField label="Tên bằng cấp" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
                            <TextField label="Reference Id" value={referenceId} onChange={(e) => setReferenceId(e.target.value)} fullWidth />
                            <div className='flex flex-row gap-3'>
                                <TextField label="Ngành" value={major} onChange={(e) => setMajor(e.target.value)} fullWidth />
                                <TextField label="Trình độ" value={level} onChange={(e) => setLevel(e.target.value)} fullWidth />
                            </div>
                            <TextField label="Cơ sở đào tạo" value={institution} onChange={(e) => setInstitution(e.target.value)} fullWidth />
                            <div className='flex flex-row gap-3'>
                                <TextField label="Năm bắt đầu" value={startYear} onChange={(e) => { setStartYear(e.target.value); }} fullWidth type="number" />
                                <TextField label="Năm tốt nghiệp" value={graduationYear} onChange={(e) => { setGraduationYear(e.target.value); }} fullWidth type="number" />
                            </div>

                            <TextField label="Mô tả" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth />
                            <Typography>
                                URL: {degree?.url ? (
                                    <a href={degree.url} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'underline' }}>
                                        {degree.url}
                                    </a>
                                ) : 'Không có'}
                            </Typography>
                            <Typography>Giời cập nhật: {degree?.updatedAt ? new Date(degree.updatedAt).toLocaleString('vi-VN') : ''}</Typography>
                        </div>

                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleConfirm()} color="success" variant="contained">Lưu</Button>
                    <Button onClick={onClose} color="inherit" variant="outlined">Đóng</Button>
                </DialogActions>
            </Dialog>
            {/* Dialog xác nhận */}
            <Dialog open={openConfirmDialog} onClose={() => { setOpenConfirmDialog(false); }} maxWidth="xs">
                <DialogTitle>Xác nhận Lưu</DialogTitle>
                <DialogContent>
                    <Typography>Bạn có chắc chắn muốn lưu bằng cấp này?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setOpenConfirmDialog(false); }}>Hủy</Button>
                    <Button
                        onClick={handleSave}
                        color="primary"
                        variant="contained"
                    >
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default DegreeUpdateDialog;