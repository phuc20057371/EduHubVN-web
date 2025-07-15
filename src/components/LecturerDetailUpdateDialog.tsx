import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { Lecturer } from "../types/Lecturer";

export interface LecturerDetailDialogProps {
    open: boolean;
    onClose: () => void;
    lecturer: Lecturer;
    lecturerUpdate: Lecturer;
}


const fieldGroups = [
    {
        title: '👤 Thông tin cá nhân',
        fields: [
            { label: "Họ tên", key: "fullName" },
            { label: "Ngày sinh", key: "dateOfBirth" },
            { label: "Giới tính", key: "gender", render: (v: any) => v ? "Nam" : "Nữ" },
        ]
    },
    {
        title: '🎓 Thông tin chuyên môn',
        fields: [
            { label: "Chuyên ngành", key: "specialization" },
            { label: "Học hàm", key: "academicRank" },
            { label: "Kinh nghiệm", key: "experienceYears", render: (v: any) => v + " năm" },
        ]
    },
    {
        title: '📞 Liên hệ',
        fields: [
            { label: "Địa chỉ", key: "address" },
            { label: "SĐT", key: "phoneNumber" },
        ]
    }
];

const highlightStyle = { background: '#fffde7', fontWeight: 600 };


import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";
import { API } from "../utils/Fetch";
import { useDispatch, useSelector } from "react-redux";
import { setLecturerPendingUpdate } from "../redux/slice/LecturerPendingUpdateSlice";

const LecturerDetailUpdateDialog: React.FC<LecturerDetailDialogProps> = ({ open, onClose, lecturer, lecturerUpdate }) => {
    const [confirmType, setConfirmType] = useState<null | 'approve' | 'reject'>(null);
    const [adminNote, setAdminNote] = useState("");

    const lecturerUpdateList = useSelector((state: any) => Array.isArray(state.lecturerPendingUpdate) ? state.lecturerPendingUpdate : []);
    const dispatch = useDispatch();

    const handleApprove = () => {
        setConfirmType('approve');
    };
    const handleReject = () => {
        setConfirmType('reject');
    };
    const handleConfirm = async () => {
        if (confirmType === 'approve') {
            console.log('APPROVE', (lecturerUpdate as any)?.id);
            try {
                await API.admin.approveLecturerUpdate({ id: (lecturerUpdate as any)?.id });
                // Dispatch action to update state if needed
                dispatch(setLecturerPendingUpdate(
                    (Array.isArray(lecturerUpdateList)
                        ? lecturerUpdateList
                        : []).filter((l: any) => l.lecturerUpdate?.id !== (lecturerUpdate as any)?.id)
                ));
                toast.success('Duyệt thông tin cập nhật thành công!');
            } catch (error) {
                toast.error('Error approving lecturer update:');
            }
        } else if (confirmType === 'reject') {
            console.log('REJECT', (lecturerUpdate as any)?.id, adminNote);
            try {
                await API.admin.rejectLecturerUpdate({ id: (lecturerUpdate as any)?.id, adminNote });
                 dispatch(setLecturerPendingUpdate(
                    (Array.isArray(lecturerUpdateList)
                        ? lecturerUpdateList
                        : []).filter((l: any) => l.lecturerUpdate?.id !== (lecturerUpdate as any)?.id)
                ));
                toast.success('Từ chối thông tin cập nhật thành công!');
            } catch (error) {
                toast.error('Error rejecting lecturer update:');
            }
        }
        setConfirmType(null);
        setAdminNote("");
        if (typeof onClose === 'function') onClose();
    };
    const handleCancel = () => {
        setConfirmType(null);
        setAdminNote("");
    };

    if (!open) return null;
    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle sx={{ m: 0, p: 2, pr: 5 }}>
                    So sánh thông tin cập nhật giảng viên
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
                            <Typography variant="h6" gutterBottom>👤 Thông tin hiện tại</Typography>
                            {fieldGroups.map(group => (
                                <Box key={group.title} mb={2}>
                                    <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>{group.title}</Typography>
                                    <Box component="table" width="100%" sx={{ borderCollapse: 'collapse' }}>
                                        <tbody>
                                            {group.fields.map(row => {
                                                const val = row.render ? row.render((lecturer as any)?.[row.key]) : (lecturer as any)?.[row.key];
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
                                                const val = row.render ? row.render((lecturerUpdate as any)?.[row.key]) : (lecturerUpdate as any)?.[row.key];
                                                // Highlight nếu khác với bản gốc
                                                const oldVal = row.render ? row.render((lecturer as any)?.[row.key]) : (lecturer as any)?.[row.key];
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
                    <Button onClick={handleApprove} color="success" variant="contained">Duyệt</Button>
                    <Button onClick={handleReject} color="error" variant="contained">Từ chối</Button>
                </DialogActions>
            </Dialog>
            {/* Confirm Dialog */}
            <Dialog open={!!confirmType} onClose={handleCancel} maxWidth="xs">
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
                    <Button onClick={handleCancel}>Hủy</Button>
                    <Button onClick={handleConfirm} color="primary" variant="contained" disabled={confirmType === 'reject' && !adminNote.trim()}>
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default LecturerDetailUpdateDialog