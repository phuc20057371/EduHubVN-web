
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { API } from '../utils/Fetch';
import { useDispatch, useSelector } from 'react-redux';
import { setInstitutionPendingUpdate } from '../redux/slice/InstitutionPendingUpdateSlice';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface InstitutionDetailUpdateDialogProps {
    open: boolean;
    onClose: () => void;
    oldData: any;
    newData: any;
}


const fieldGroups = [
    {
        title: '🏢 Thông tin chung',
        fields: [
            { label: "Tên cơ sở", key: "institutionName" },
            { label: "Loại", key: "institutionType" },
            { label: "Năm thành lập", key: "establishedYear" },
        ]
    },
    {
        title: '👤 Đại diện',
        fields: [
            { label: "Họ tên", key: "representativeName" },
            { label: "Chức vụ", key: "position" },
        ]
    },
    {
        title: '📞 Liên hệ',
        fields: [
            { label: "Địa chỉ", key: "address" },
            { label: "Điện thoại", key: "phoneNumber" },
            { label: "Website", key: "website", render: (v: any) => v ? <a href={v} target="_blank" rel="noopener noreferrer">{v}</a> : "-" },
        ]
    },
    {
        title: '📝 Khác',
        fields: [
            { label: "Mô tả", key: "description" },
        ]
    }
];

const highlightStyle = { background: '#fffde7', fontWeight: 600 };

const InstitutionDetailUpdateDialog = ({ open, onClose, oldData, newData }: InstitutionDetailUpdateDialogProps) => {
    const institutionPendingUpdate = useSelector((state: any) => Array.isArray(state.institutionPendingUpdate) ? state.institutionPendingUpdate : []);

    const [confirmType, setConfirmType] = useState<null | 'approve' | 'reject'>(null);
    const [adminNote, setAdminNote] = useState("");
    const dispatch = useDispatch();
    if (!open) return null;

    const handleConfirm = async (type: 'approve' | 'reject') => {
        if (type === 'approve') {
            try {
                await API.admin.approveInstitutionUpdate({ id: newData?.id });
                dispatch(setInstitutionPendingUpdate(
                    (Array.isArray(institutionPendingUpdate) ? institutionPendingUpdate : [])
                        .filter((item: any) => item.educationInstitutionUpdate?.id !== newData?.id)
                ));
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error('Error approving institution update:', error);
            }
        } else if (type === 'reject') {
            try {
                await API.admin.rejectInstitutionUpdate({ id: newData?.id, adminNote });
                dispatch(setInstitutionPendingUpdate(
                    (Array.isArray(institutionPendingUpdate) ? institutionPendingUpdate : [])
                        .filter((item: any) => item.educationInstitutionUpdate?.id !== newData?.id)
                ));
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error('Error rejecting institution update:', error);
            }
        }
        setConfirmType(null);
        setAdminNote("");
        if (typeof onClose === 'function') onClose();
    }

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle sx={{ m: 0, p: 2, pr: 5 }}>
                    So sánh thông tin cập nhật cơ sở
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
                        {/* Thông tin hiện tại */}
                        <Box flex={1} minWidth={0}>
                            <Typography variant="h6" gutterBottom>🏢 Thông tin hiện tại</Typography>
                            {fieldGroups.map(group => (
                                <Box key={group.title} mb={2}>
                                    <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>{group.title}</Typography>
                                    <Box component="table" width="100%" sx={{ borderCollapse: 'collapse' }}>
                                        <tbody>
                                            {group.fields.map(row => {
                                                const val = row.render ? row.render(oldData?.[row.key]) : oldData?.[row.key];
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
                            ))}
                        </Box>
                        {/* Thông tin cập nhật */}
                        <Box flex={1} minWidth={0}>
                            <Typography variant="h6" gutterBottom>📝 Thông tin cập nhật</Typography>
                            {fieldGroups.map(group => (
                                <Box key={group.title} mb={2}>
                                    <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>{group.title}</Typography>
                                    <Box component="table" width="100%" sx={{ borderCollapse: 'collapse' }}>
                                        <tbody>
                                            {group.fields.map(row => {
                                                const val = row.render ? row.render(newData?.[row.key]) : newData?.[row.key];
                                                const oldVal = row.render ? row.render(oldData?.[row.key]) : oldData?.[row.key];
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
                            ))}
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmType('approve')} color="success" variant="contained">Duyệt</Button>
                    <Button onClick={() => setConfirmType('reject')} color="error" variant="contained">Từ chối</Button>
                </DialogActions>
            </Dialog>
            {/* Confirm Dialog */}
            <Dialog open={!!confirmType} onClose={() => { setConfirmType(null); setAdminNote(""); }} maxWidth="xs">
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
                    <Button onClick={() => { setConfirmType(null); setAdminNote(""); }}>Hủy</Button>
                    <Button
                        onClick={() => handleConfirm(confirmType!)}
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
};

export default InstitutionDetailUpdateDialog;
