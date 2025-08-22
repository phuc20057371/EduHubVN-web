
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { API } from '../utils/Fetch';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setDegreePendingUpdate } from '../redux/slice/degreePendingUpdateSlice';

interface DegreeDetailUpdateDialogProps {
    open: boolean;
    onClose: () => void;
    data: any;
}

const highlightStyle = { background: '#fffde7', fontWeight: 600 };

const fields = [
    { label: 'Tên bằng cấp', key: 'name' },
    { label: 'Reference Id', key: 'referenceId' },
    { label: 'Ngành', key: 'major' },
    { label: 'Năm', key: 'startYear', render: (_v: any, d: any) => `${d?.startYear ?? ''} - ${d?.graduationYear ?? ''}` },
    { label: 'Trình độ', key: 'level' },
    { label: 'Mô tả', key: 'description' },
];

const DegreeDetailUpdateDialog = ({ open, onClose, data }: DegreeDetailUpdateDialogProps) => {
    if (!data) return null;

    const degreePendingUpdate = useSelector((state: any) => Array.isArray(state.degreePendingUpdate) ? state.degreePendingUpdate : []);
    const dispatch = useDispatch();
    const { degree, updatedDegree, lecturer } = data;
    const [confirmType, setConfirmType] = useState<null | 'approve' | 'reject'>(null);
    const [adminNote, setAdminNote] = useState('');

    const handleConfirm = async () => {
        if (confirmType === 'approve') {
            await API.admin.approveDegreeUpdate({ id: updatedDegree?.id });
            const filtered = degreePendingUpdate.filter((item: any) => item.updatedDegree?.id !== updatedDegree?.id);
            dispatch(setDegreePendingUpdate(filtered));
            toast.success('Đã duyệt thông tin cập nhật bằng cấp thành công');
        } else if (confirmType === 'reject') {
            await API.admin.rejectDegreeUpdate({ id: updatedDegree?.id, adminNote });
            const filtered = degreePendingUpdate.filter((item: any) => item.updatedDegree?.id !== updatedDegree?.id);
            dispatch(setDegreePendingUpdate(filtered));
            toast.success('Đã từ chối thông tin cập nhật bằng cấp thành công');
        }
        setConfirmType(null);
        setAdminNote('');
        if (typeof onClose === 'function') onClose();
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle sx={{ m: 0, p: 2 }}>So sánh thông tin cập nhật bằng cấp</DialogTitle>
                <DialogContent dividers>
                    <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
                        {/* So sánh bằng cấp */}
                        <Box flex={2}>
                            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>🎓 So sánh thông tin bằng cấp</Typography>
                            <Box display="flex" gap={2}>
                                {/* Hiện tại */}
                                <Box flex={1}>
                                    <Typography variant="h6" gutterBottom>Hiện tại</Typography>
                                    <Box component="table" width="100%" sx={{ borderCollapse: 'collapse' }}>
                                        <tbody>
                                            {fields.map(row => {
                                                let val = row.render ? row.render(degree, degree) : degree?.[row.key];
                                                if (row.key === 'startYear') val = `${degree?.startYear ?? ''} - ${degree?.graduationYear ?? ''}`;
                                                return (
                                                    <tr key={row.key}>
                                                        <td style={{ borderBottom: '1px solid #eee', fontWeight: 500, width: '40%' }}>{row.label}</td>
                                                        <td style={{ borderBottom: '1px solid #eee' }}>{val ?? '-'}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </Box>
                                </Box>
                                {/* Cập nhật */}
                                <Box flex={1}>
                                    <Typography variant="h6" gutterBottom>Cập nhật</Typography>
                                    <Box component="table" width="100%" sx={{ borderCollapse: 'collapse' }}>
                                        <tbody>
                                            {fields.map(row => {
                                                let val = row.render ? row.render(updatedDegree, updatedDegree) : updatedDegree?.[row.key];
                                                let oldVal = row.render ? row.render(degree, degree) : degree?.[row.key];
                                                if (row.key === 'startYear') {
                                                    val = `${updatedDegree?.startYear ?? ''} - ${updatedDegree?.graduationYear ?? ''}`;
                                                    oldVal = `${degree?.startYear ?? ''} - ${degree?.graduationYear ?? ''}`;
                                                }
                                                const changed = val !== oldVal;
                                                return (
                                                    <tr key={row.key}>
                                                        <td style={{ borderBottom: '1px solid #eee', fontWeight: 500, width: '40%' }}>{row.label}</td>
                                                        <td style={{ borderBottom: '1px solid #eee', ...(changed ? highlightStyle : {}) }}>{val ?? '-'}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                        {/* Thông tin giảng viên */}
                        <Box flex={1} minWidth={220} maxWidth={300} bgcolor="#fafbfc" borderRadius={2} p={2} border="1px solid #eee" display="flex" flexDirection="column" alignItems="center" height="fit-content">
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
                        </Box>
                    </Box>
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
                        <Typography>Bạn có chắc chắn muốn duyệt thông tin cập nhật này?</Typography>
                    ) : (
                        <>
                            <Typography>Bạn có chắc chắn muốn từ chối thông tin cập nhật này?</Typography>
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

export default DegreeDetailUpdateDialog;