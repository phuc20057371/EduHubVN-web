

import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { API } from '../utils/Fetch';
import { useDispatch, useSelector } from 'react-redux';
import { setInstitutionPendingCreate } from '../redux/slice/InstitutionPendingCreateSlice';

interface InstitutionDetailDialogProps {
    open: boolean;
    onClose: () => void;
    institution: any;
}

const InstitutionDetailDialog = ({ open, onClose, institution }: InstitutionDetailDialogProps) => {
    const institutionPendingCreate = useSelector((state: any) => Array.isArray(state.institutionPendingCreate) ? state.institutionPendingCreate : []);
    const dispatch = useDispatch();
    const [confirmApproveOpen, setConfirmApproveOpen] = useState(false);
    const [confirmRejectOpen, setConfirmRejectOpen] = useState(false);
    const [adminNote, setAdminNote] = useState('');

    const handleApproveInstitution = async (institutionId: number) => {
        try {
            await API.admin.approveInstitution({id: institutionId });
            dispatch(setInstitutionPendingCreate(institutionPendingCreate.filter((item: { id: number; }) => item.id !== institutionId)));
        } catch (error) {
            console.error('Error approving institution:', error);
        }
    };

    if (!open) return null;
    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Chi tiết cơ sở</span>
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
                    <Box>
                        <Typography variant="h6" gutterBottom>{institution.institutionName}</Typography>
                        <Typography><b>Loại:</b> {institution.institutionType}</Typography>
                        <Typography><b>Đại diện:</b> {institution.representativeName} ({institution.position})</Typography>
                        <Typography><b>Năm thành lập:</b> {institution.establishedYear}</Typography>
                        <Typography><b>ĐKKD:</b> {institution.businessRegistrationNumber}</Typography>
                        <Typography><b>Địa chỉ:</b> {institution.address}</Typography>
                        <Typography><b>Điện thoại:</b> {institution.phoneNumber}</Typography>
                        <Typography><b>Website:</b> <a href={institution.website} target="_blank" rel="noopener noreferrer">{institution.website}</a></Typography>
                        <Typography><b>Mô tả:</b> {institution.description}</Typography>
                        <Typography><b>Trạng thái:</b> {institution.status}</Typography>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button color="success" variant="contained" onClick={() => setConfirmApproveOpen(true)}>
                        Duyệt
                    </Button>
                    <Button color="error" variant="outlined" onClick={() => setConfirmRejectOpen(true)}>
                        Từ chối
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Hộp thoại xác nhận duyệt */}
            <Dialog open={confirmApproveOpen} onClose={() => setConfirmApproveOpen(false)}>
                <DialogTitle>Xác nhận duyệt</DialogTitle>
                <DialogContent>Bạn có chắc chắn muốn duyệt cơ sở này?</DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmApproveOpen(false)}>Huỷ</Button>
                    <Button color="success" variant="contained" onClick={() => {
                        // In ra id institution
                        // eslint-disable-next-line no-console
                        console.log('Duyệt:', institution.id);
                        handleApproveInstitution(institution.id);
                        setConfirmApproveOpen(false);
                        onClose();
                    }}>Xác nhận</Button>
                </DialogActions>
            </Dialog>

            {/* Hộp thoại xác nhận từ chối */}
            <Dialog open={confirmRejectOpen} onClose={() => setConfirmRejectOpen(false)}>
                <DialogTitle>Xác nhận từ chối</DialogTitle>
                <DialogContent>
                    <Box mb={2}>Bạn có chắc chắn muốn từ chối cơ sở này?</Box>
                    <TextField
                        label="Lý do từ chối (admin note)"
                        value={adminNote}
                        onChange={e => setAdminNote(e.target.value)}
                        fullWidth
                        multiline
                        minRows={2}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmRejectOpen(false)}>Huỷ</Button>
                    <Button color="error" variant="contained" onClick={() => {
                        // eslint-disable-next-line no-console
                        console.log('Từ chối:', { id: institution.id, adminNote });
                        setConfirmRejectOpen(false);
                        setAdminNote('');
                        onClose();
                    }}>Xác nhận</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default InstitutionDetailDialog