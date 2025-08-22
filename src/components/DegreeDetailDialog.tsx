
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { API } from '../utils/Fetch';
import { useDispatch, useSelector } from 'react-redux';
import { setDegreePendingCreate } from '../redux/slice/DegreePendingCreateSlice';
import { toast } from 'react-toastify';

interface DegreeDetailDialogProps {
    open: boolean;
    onClose: () => void;
    data: any;
}

const DegreeDetailDialog = ({ open, onClose, data }: DegreeDetailDialogProps) => {
    if (!data) return null;
    const dispatch = useDispatch();
    const degreePendingCreate = useSelector((state: any) => Array.isArray(state.degreePendingCreate) ? state.degreePendingCreate : []);
    const { degree, lecturer } = data;
    const [confirmType, setConfirmType] = useState<null | 'approve' | 'reject'>(null);
    const [adminNote, setAdminNote] = useState('');

    const handleConfirm = async () => {
        if (confirmType === 'approve') {
            await API.admin.approveDegree({ id: degree?.id });
            const filtered = degreePendingCreate.filter((item: any) => item.degree?.id !== degree?.id);
            dispatch(setDegreePendingCreate(filtered));
            toast.success('Đã duyệt bằng cấp thành công');
        } else if (confirmType === 'reject') {
            await API.admin.rejectDegree({ id: degree?.id, adminNote });
            const filtered = degreePendingCreate.filter((item: any) => item.degree?.id !== degree?.id);
            dispatch(setDegreePendingCreate(filtered));
            toast.success('Đã từ chối bằng cấp thành công');
        }
        setConfirmType(null);
        setAdminNote('');
        if (typeof onClose === 'function') onClose();
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
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
                        <div style={{ flex: 2 }}>
                            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>🎓 Thông tin bằng cấp</Typography>
                            <Typography>Tên bằng cấp: {degree?.name}</Typography>
                            <Typography>Reference Id: {degree?.referenceId}</Typography>
                            <Typography>Ngành: {degree?.major}</Typography>
                            <Typography>Năm: {degree?.startYear} - {degree?.graduationYear}</Typography>
                            <Typography>Trình độ: {degree?.level}</Typography>
                            <Typography>Mô tả: {degree?.description}</Typography>
                            <Typography>Vào lúc: {degree?.updatedAt ? new Date(degree.updatedAt).toLocaleString('vi-VN') : ''}</Typography>
                        </div>
                        {/* Thông tin giảng viên bên phải */}
                        <div style={{ flex: 1, minWidth: 220, maxWidth: 300, background: '#fafbfc', borderRadius: 12, padding: 16, border: '1px solid #eee', display: 'flex', flexDirection: 'column', alignItems: 'center', height: 'fit-content' }}>
                            <Avatar
                                src={lecturer?.avatarUrl || undefined}
                                alt={lecturer?.fullName}
                                sx={{ width: 80, height: 80, mb: 1.5, border: '1px solid #ddd' }}
                            >
                                {lecturer?.fullName ? lecturer.fullName[0] : ''}
                            </Avatar>
                            <Typography fontWeight={600} align="center">{lecturer?.fullName}</Typography>
                            <Typography variant="body2" color="text.secondary" align="center">{lecturer?.academicRank}</Typography>
                            <Typography variant="body2" align="center">Chuyên ngành: {lecturer?.specialization}</Typography>
                            <Typography variant="body2" align="center">Số năm KN: {lecturer?.experienceYears}</Typography>
                            <Typography variant="body2" align="center">SĐT: {lecturer?.phoneNumber}</Typography>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmType('approve')} color="success" variant="contained">Duyệt</Button>
                    <Button onClick={() => setConfirmType('reject')} color="error" variant="contained">Từ chối</Button>
                </DialogActions>
            </Dialog>
            {/* Dialog xác nhận */}
            <Dialog open={!!confirmType} onClose={() => { setConfirmType(null); setAdminNote(''); }} maxWidth="xs">
                <DialogTitle>Xác nhận {confirmType === 'approve' ? 'duyệt' : 'từ chối'}</DialogTitle>
                <DialogContent>
                    {confirmType === 'approve' ? (
                        <Typography>Bạn có chắc chắn muốn duyệt bằng cấp này?</Typography>
                    ) : (
                        <>
                            <Typography>Bạn có chắc chắn muốn từ chối bằng cấp này?</Typography>
                            <TextField
                                label="Lý do từ chối (admin note)"
                                size="small"
                                value={adminNote}
                                onChange={e => setAdminNote(e.target.value)}
                                fullWidth
                                sx={{ mt: 2 }}
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setConfirmType(null); setAdminNote(''); }}>Hủy</Button>
                    <Button
                        onClick={handleConfirm}
                        color="primary"
                        variant="contained"
                        disabled={confirmType === 'reject' && !adminNote.trim()}
                    >
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default DegreeDetailDialog;