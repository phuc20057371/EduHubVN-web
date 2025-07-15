

import React, { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';

import Dialog from "@mui/material/Dialog";
// removed MuiDialog import, use Dialog for both main and confirm dialog
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { Degree } from "../types/Degree";
import type { Lecturer } from "../types/Lecturer";
import type { Certificate } from "../types/Certificate";
import { toast } from "react-toastify";
import { API } from "../utils/Fetch";
import { useDispatch, useSelector } from "react-redux";
import { setLecturerPendingCreate } from "../redux/slice/LecturerPendingCreateSlice";
interface ConfirmDialogProps {
    open: boolean;
    title: string;
    content: React.ReactNode;
    onClose: () => void;
    onConfirm: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ open, title, content, onClose, onConfirm }) => (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
            {typeof content === 'string' ? <DialogContentText>{content}</DialogContentText> : content}
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Hủy</Button>
            <Button onClick={onConfirm} color="primary" variant="contained">Xác nhận</Button>
        </DialogActions>
    </Dialog>
);


export interface LecturerDetailDialogProps {
    open: boolean;
    onClose: () => void;
    lecturer: Lecturer;
    degrees: Degree[];
    certificates: Certificate[];
}

const LecturerDetailDialog: React.FC<LecturerDetailDialogProps> = ({ open, onClose, lecturer, degrees, certificates }) => {
    // State for admin notes and status
    const dispatch = useDispatch();
    const lecturerPendingCreate = useSelector((state: any) => state.lecturerPendingCreate);
    const [lecturerStatus, setLecturerStatus] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
    const [lecturerNote, setLecturerNote] = useState<string>('');
    const [degreeStates, setDegreeStates] = useState<{ [id: number]: { status: 'PENDING' | 'APPROVED' | 'REJECTED', note: string } }>({});
    const [certStates, setCertStates] = useState<{ [id: number]: { status: 'PENDING' | 'APPROVED' | 'REJECTED', note: string } }>({});
    // Confirm dialog state
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmType, setConfirmType] = useState<'approve' | 'reject' | null>(null);
    const [confirmTarget, setConfirmTarget] = useState<{ id: number, type: 'Degree' | 'Certification' | 'Lecturer', note?: string } | null>(null);
    // Load from localStorage on open
    useEffect(() => {
        if (!open) return;
        // Lecturer
        const lecKey = `Lecturer${lecturer.id}`;
        const lecStr = localStorage.getItem(lecKey);
        if (lecStr) {
            try {
                const lecObj = JSON.parse(lecStr);
                setLecturerStatus(lecObj.status || 'PENDING');
                setLecturerNote(lecObj.note || '');
            } catch { }
        } else {
            setLecturerStatus('PENDING');
            setLecturerNote('');
        }
        // Degrees
        const degKey = `Degrees${lecturer.id}`;
        const degStr = localStorage.getItem(degKey);
        if (degStr) {
            try {
                const degArr = JSON.parse(degStr);
                const degMap: { [id: number]: { status: 'PENDING' | 'APPROVED' | 'REJECTED', note: string } } = {};
                degArr.forEach((d: any) => {
                    let status: 'PENDING' | 'APPROVED' | 'REJECTED' = ['PENDING', 'APPROVED', 'REJECTED'].includes(d.status) ? d.status : 'PENDING';
                    degMap[d.id] = { status, note: d.note || '' };
                });
                setDegreeStates(degMap);
            } catch { }
        } else {
            const degMap: { [id: number]: { status: 'PENDING' | 'APPROVED' | 'REJECTED', note: string } } = {};
            degrees.forEach(d => { degMap[d.id] = { status: 'PENDING', note: '' }; });
            setDegreeStates(degMap);
        }

        // Certificates
        const certKey = `Certification${lecturer.id}`;
        const certStr = localStorage.getItem(certKey);
        if (certStr) {
            try {
                const certArr = JSON.parse(certStr);
                const certMap: { [id: number]: { status: 'PENDING' | 'APPROVED' | 'REJECTED', note: string } } = {};
                certArr.forEach((c: any) => {
                    let status: 'PENDING' | 'APPROVED' | 'REJECTED' = ['PENDING', 'APPROVED', 'REJECTED'].includes(c.status) ? c.status : 'PENDING';
                    certMap[c.id] = { status, note: c.note || '' };
                });
                setCertStates(certMap);
            } catch { }
        } else {
            const certMap: { [id: number]: { status: 'PENDING' | 'APPROVED' | 'REJECTED', note: string } } = {};
            certificates.forEach(c => { certMap[c.id] = { status: 'PENDING', note: '' }; });
            setCertStates(certMap);
        }
    }, [open, lecturer.id, degrees, certificates]);
    
     

    // Handle approve/reject
    // Approve/Reject for Degree/Certification
    const handleApprove = (id: number, type: 'Degree' | 'Certification') => {
        setConfirmType('approve');
        setConfirmTarget({ id, type });
        setConfirmOpen(true);
    };
    const handleReject = (id: number, type: 'Degree' | 'Certification') => {
        setConfirmType('reject');
        setConfirmTarget({ id, type, note: type === 'Degree' ? degreeStates[id]?.note ?? '' : certStates[id]?.note ?? '' });
        setConfirmOpen(true);
    };
    // Approve/Reject for all types
    const handleConfirm = () => {
        if (confirmTarget) {
            if (confirmType === 'approve') {
                if (confirmTarget.type === 'Lecturer') {
                    setLecturerStatus('APPROVED');
                    localStorage.setItem(`Lecturer${lecturer.id}`, JSON.stringify({ id: lecturer.id, note: lecturerNote, status: 'APPROVED' }));
                } else if (confirmTarget.type === 'Degree') {
                    setDegreeStates(prev => {
                        const prevState = prev[confirmTarget.id] || { status: 'PENDING', note: '' };
                        const newState: { [id: number]: { status: 'PENDING' | 'APPROVED' | 'REJECTED', note: string } } = {
                            ...prev,
                            [confirmTarget.id]: { ...prevState, status: 'APPROVED' }
                        };
                        localStorage.setItem(`Degrees${lecturer.id}`, JSON.stringify(Object.entries(newState).map(([id, v]) => ({ id: Number(id), ...v }))));
                        return newState;
                    });
                } else if (confirmTarget.type === 'Certification') {
                    setCertStates(prev => {
                        const prevState = prev[confirmTarget.id] || { status: 'PENDING', note: '' };
                        const newState: { [id: number]: { status: 'PENDING' | 'APPROVED' | 'REJECTED', note: string } } = {
                            ...prev,
                            [confirmTarget.id]: { ...prevState, status: 'APPROVED' }
                        };
                        localStorage.setItem(`Certification${lecturer.id}`, JSON.stringify(Object.entries(newState).map(([id, v]) => ({ id: Number(id), ...v }))));
                        return newState;
                    });
                }
            } else if (confirmType === 'reject') {
                if (confirmTarget.type === 'Lecturer') {
                    setLecturerStatus('REJECTED');
                    setLecturerNote(confirmTarget.note || '');
                    localStorage.setItem(`Lecturer${lecturer.id}`, JSON.stringify({ id: lecturer.id, note: confirmTarget.note || '', status: 'REJECTED' }));
                } else if (confirmTarget.type === 'Degree') {
                    setDegreeStates(prev => {
                        const newState: { [id: number]: { status: 'PENDING' | 'APPROVED' | 'REJECTED', note: string } } = {
                            ...prev,
                            [confirmTarget.id]: { status: 'REJECTED', note: confirmTarget.note || '' }
                        };
                        localStorage.setItem(`Degrees${lecturer.id}`, JSON.stringify(Object.entries(newState).map(([id, v]) => ({ id: Number(id), ...v }))));
                        return newState;
                    });
                } else if (confirmTarget.type === 'Certification') {
                    setCertStates(prev => {
                        const newState: { [id: number]: { status: 'PENDING' | 'APPROVED' | 'REJECTED', note: string } } = {
                            ...prev,
                            [confirmTarget.id]: { status: 'REJECTED', note: confirmTarget.note || '' }
                        };
                        localStorage.setItem(`Certification${lecturer.id}`, JSON.stringify(Object.entries(newState).map(([id, v]) => ({ id: Number(id), ...v }))));
                        return newState;
                    });
                }
            }
        }
        setConfirmOpen(false);
        setConfirmType(null);
        setConfirmTarget(null);
    };
    const handleCloseConfirm = () => {
        setConfirmOpen(false);
        setConfirmType(null);
        setConfirmTarget(null);
    };
    // Refresh status to PENDING
    const handleRefresh = (id: number, type: 'Degree' | 'Certification' | 'Lecturer') => {
        if (type === 'Lecturer') {
            setLecturerStatus('PENDING');
            localStorage.setItem(`Lecturer${lecturer.id}`, JSON.stringify({ id: lecturer.id, note: lecturerNote, status: 'PENDING' }));
        } else if (type === 'Degree') {
            setDegreeStates(prev => {
                const prevState = prev[id] || { status: 'PENDING', note: '' };
                const newState: { [id: number]: { status: 'PENDING' | 'APPROVED' | 'REJECTED', note: string } } = {
                    ...prev,
                    [id]: { ...prevState, status: 'PENDING' }
                };
                localStorage.setItem(`Degrees${lecturer.id}`, JSON.stringify(Object.entries(newState).map(([id, v]) => ({ id: Number(id), ...v }))));
                return newState;
            });
        } else if (type === 'Certification') {
            setCertStates(prev => {
                const prevState = prev[id] || { status: 'PENDING', note: '' };
                const newState: { [id: number]: { status: 'PENDING' | 'APPROVED' | 'REJECTED', note: string } } = {
                    ...prev,
                    [id]: { ...prevState, status: 'PENDING' }
                };
                localStorage.setItem(`Certification${lecturer.id}`, JSON.stringify(Object.entries(newState).map(([id, v]) => ({ id: Number(id), ...v }))));
                return newState;
            });
        }
    };
    // Hàm gọi lại API khi đóng dialog
    const handleDialogClose = async () => {
        if (typeof onClose === 'function') onClose();
        try {
            const response = await API.admin.getLecturerPendingCreate();
            dispatch(setLecturerPendingCreate(response.data.data));
        } catch (error) {
            // Có thể log hoặc toast nếu cần
        }
    };

    return (
        <Dialog open={open} onClose={handleDialogClose} maxWidth="xl" fullWidth>
            <DialogTitle>Thông tin chi tiết giảng viên</DialogTitle>
            <DialogContent dividers>
                <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
                    {/* Left: Lecturer Info */}
                    <Box flex={1} minWidth={0}>
                        <h3 className="mb-1 text-base font-semibold text-gray-700">👤 Thông tin cá nhân</h3>
                        <p><strong>Họ tên:</strong> {lecturer.fullName}</p>
                        <p><strong>Ngày sinh:</strong> {lecturer.dateOfBirth}</p>
                        <p><strong>Giới tính:</strong> {lecturer.gender ? "Nam" : "Nữ"}</p>
                        <p><strong>CCCD:</strong> {lecturer.citizenId}</p>
                        <h3 className="mt-3 mb-1 text-base font-semibold text-gray-700">🎓 Thông tin chuyên môn</h3>
                        <p><strong>Chuyên ngành:</strong> {lecturer.specialization}</p>
                        <p><strong>Học hàm:</strong> {lecturer.academicRank}</p>
                        <p><strong>Kinh nghiệm:</strong> {lecturer.experienceYears} năm</p>
                        <h3 className="mt-3 mb-1 text-base font-semibold text-gray-700">📞 Liên hệ</h3>
                        <p><strong>Địa chỉ:</strong> {lecturer.address}</p>
                        <p><strong>SĐT:</strong> {lecturer.phoneNumber}</p>
                        <Box mt={2} display="flex" alignItems="center" gap={1}>
                            {lecturerStatus === 'PENDING' ? (
                                <>
                                    <Button variant="contained" color="success" onClick={() => {
                                        setConfirmType('approve');
                                        setConfirmTarget({ id: lecturer.id, type: 'Lecturer' });
                                        setConfirmOpen(true);
                                    }}>Duyệt</Button>
                                    <Button variant="contained" color="error" onClick={() => {
                                        setConfirmType('reject');
                                        setConfirmTarget({ id: lecturer.id, type: 'Lecturer', note: '' });
                                        setConfirmOpen(true);
                                    }}>Từ chối</Button>
                                </>
                            ) : (
                                <>
                                    <Typography color={lecturerStatus === 'APPROVED' ? 'success.main' : 'error.main'} fontWeight={600}>
                                        {lecturerStatus}
                                    </Typography>
                                    <Button onClick={() => handleRefresh(lecturer.id, 'Lecturer')} size="small" color="info" sx={{ minWidth: 0 }}>
                                        <span role="img" aria-label="refresh">🔄</span>
                                    </Button>
                                </>
                            )}
                        </Box>
                    </Box>
                    {/* Right: Degree & Certificate Accordions side by side */}
                    <Box flex={2} minWidth={0} display="flex" gap={2}>
                        {/* Degrees List */}
                        <Box flex={1} minWidth={0}>
                            {degrees.length > 0 ? (
                                degrees.map((deg) => {
                                    const status = degreeStates[deg.id]?.status || 'PENDING';
                                    let bgColor = '#fff';
                                    if (status === 'APPROVED') bgColor = '#e6f4ea'; // light green
                                    else if (status === 'REJECTED') bgColor = '#fdeaea'; // light red
                                    return (
                                        <Accordion key={deg.id} sx={{ backgroundColor: bgColor }}>
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls={`degree-panel-content-${deg.id}`}
                                                id={`degree-panel-header-${deg.id}`}
                                            >
                                                <Typography component="span">🎓 {deg.name} - {deg.institution} ({deg.graduationYear})</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <div>
                                                    <div style={{ fontWeight: 600, marginBottom: 4 }}>🔗 Thông tin chung</div>
                                                    <div><strong>Mã tham chiếu:</strong> {deg.referenceId}</div>
                                                    
                                                    <div><strong>Ghi chú admin:</strong> {degreeStates[deg.id]?.note}</div>
                                                    <div style={{ fontWeight: 600, margin: '8px 0 4px' }}>🎓 Thông tin học vấn</div>
                                                    <div><strong>Chuyên ngành:</strong> {deg.major}</div>
                                                    <div><strong>Trình độ:</strong> {deg.level}</div>
                                                    <div><strong>Trường:</strong> {deg.institution}</div>
                                                    <div><strong>Năm bắt đầu:</strong> {deg.startYear}</div>
                                                    <div><strong>Năm tốt nghiệp:</strong> {deg.graduationYear}</div>
                                                    <div style={{ fontWeight: 600, margin: '8px 0 4px' }}>🗂️ Khác</div>
                                                    <div><strong>File:</strong> <a href={deg.url} target="_blank" rel="noopener noreferrer">{deg.url}</a></div>
                                                    <div><strong>Mô tả:</strong> {deg.description}</div>
                                                    
                                                    <Box mt={2} display="flex" alignItems="center" gap={1}>
                                                        {degreeStates[deg.id]?.status === 'PENDING' ? (
                                                            <>
                                                                <Button variant="contained" color="success" onClick={() => handleApprove(deg.id, 'Degree')}>Duyệt</Button>
                                                                <Button variant="contained" color="error" onClick={() => handleReject(deg.id, 'Degree')}>Từ chối</Button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Typography color={degreeStates[deg.id]?.status === 'APPROVED' ? 'success.main' : 'error.main'} fontWeight={600}>
                                                                    {degreeStates[deg.id]?.status}
                                                                </Typography>
                                                                <Button onClick={() => handleRefresh(deg.id, 'Degree')} size="small" color="info" sx={{ minWidth: 0 }}>
                                                                    <span role="img" aria-label="refresh">🔄</span>
                                                                </Button>
                                                            </>
                                                        )}
                                                    </Box>
                                                </div>
                                            </AccordionDetails>
                                        </Accordion>
                                    );
                                })
                            ) : (
                                <Typography component="span">Không có bằng cấp</Typography>
                            )}

                        </Box>
                        {/* Certificates List */}
                        <Box flex={1} minWidth={0}>
                            {certificates.length > 0 ? (
                                certificates.map((cert) => {
                                    const status = certStates[cert.id]?.status || 'PENDING';
                                    let bgColor = '#fff';
                                    if (status === 'APPROVED') bgColor = '#e6f4ea'; // light green
                                    else if (status === 'REJECTED') bgColor = '#fdeaea'; // light red
                                    return (
                                        <Accordion key={cert.id} sx={{ backgroundColor: bgColor }}>
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls={`cert-panel-content-${cert.id}`}
                                                id={`cert-panel-header-${cert.id}`}
                                            >
                                                <Typography component="span">📜 {cert.name} - {cert.issuedBy} ({cert.issueDate})</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <div>
                                                    <div style={{ fontWeight: 600, marginBottom: 4 }}>🔗 Thông tin chung</div>
                                                    <div><strong>Mã tham chiếu:</strong> {cert.referenceId}</div>
                                                    <div><strong>Ghi chú admin:</strong> {certStates[cert.id]?.note}</div>
                                                    <div style={{ fontWeight: 600, margin: '8px 0 4px' }}>🏢 Đơn vị cấp & thời hạn</div>
                                                    <div><strong>Đơn vị cấp:</strong> {cert.issuedBy}</div>
                                                    <div><strong>Ngày cấp:</strong> {cert.issueDate}</div>
                                                    <div><strong>Ngày hết hạn:</strong> {cert.expiryDate}</div>
                                                    <div style={{ fontWeight: 600, margin: '8px 0 4px' }}>🗂️ Khác</div>
                                                    <div><strong>File:</strong> <a href={cert.certificateUrl} target="_blank" rel="noopener noreferrer">{cert.certificateUrl}</a></div>
                                                    <div><strong>Trình độ:</strong> {cert.level}</div>
                                                    <div><strong>Mô tả:</strong> {cert.description}</div>
                                                   
                                                    <Box mt={2} display="flex" alignItems="center" gap={1}>
                                                        {certStates[cert.id]?.status === 'PENDING' ? (
                                                            <>
                                                                <Button variant="contained" color="success" onClick={() => handleApprove(cert.id, 'Certification')}>Duyệt</Button>
                                                                <Button variant="contained" color="error" onClick={() => handleReject(cert.id, 'Certification')}>Từ chối</Button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Typography color={certStates[cert.id]?.status === 'APPROVED' ? 'success.main' : 'error.main'} fontWeight={600}>
                                                                    {certStates[cert.id]?.status}
                                                                </Typography>
                                                                <Button onClick={() => handleRefresh(cert.id, 'Certification')} size="small" color="info" sx={{ minWidth: 0 }}>
                                                                    <span role="img" aria-label="refresh">🔄</span>
                                                                </Button>
                                                            </>
                                                        )}
                                                    </Box>
                                                </div>
                                            </AccordionDetails>
                                        </Accordion>
                                    );
                                })
                            ) : (
                                <Typography component="span">Không có chứng chỉ</Typography>
                            )}

                        </Box>
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleDialogClose} color="primary">Đóng</Button>
                <Button
                    color="success"
                    variant="contained"
                    onClick={async () => {
                        // Check for any pending status
                        const pendingDegrees = Object.entries(degreeStates).filter(([_, v]) => v.status === 'PENDING');
                        const pendingCerts = Object.entries(certStates).filter(([_, v]) => v.status === 'PENDING');
                        if (lecturerStatus === 'PENDING' || pendingDegrees.length > 0 || pendingCerts.length > 0) {
                            toast.error('Vui lòng duyệt hoặc từ chối tất cả các mục trước khi lưu!');
                            return;
                        }

                        try {
                            // Save lecturer status
                            if (lecturerStatus === 'REJECTED') {
                                try {
                                    const response = await API.admin.rejectLecturer({
                                        id: lecturer.id,
                                        adminNote: lecturerNote
                                    });
                                    if (response?.data?.success) {
                                        localStorage.removeItem(`Lecturer${lecturer.id}`);
                                        // Remove lecturer from redux state (must pass new array, not a function)
                                        dispatch(setLecturerPendingCreate(
                                            (Array.isArray(lecturerPendingCreate)
                                                ? lecturerPendingCreate
                                                : []).filter((l: any) => l.id !== lecturer.id)
                                        ));
                                    } else {
                                        toast.error('Từ chối giảng viên thất bại!');
                                    }
                                } catch (err) {
                                    toast.error('Lỗi khi gọi API từ chối giảng viên!');
                                    return;
                                }
                            } else if (lecturerStatus === 'APPROVED') {
                                try {
                                    const response = await API.admin.approveLecturer({
                                        id: lecturer.id,
                                    });
                                    if (response?.data?.success) {
                                        localStorage.removeItem(`Lecturer${lecturer.id}`);
                                        // Remove lecturer from redux state (must pass new array, not a function)
                                        dispatch(setLecturerPendingCreate(
                                            (Array.isArray(lecturerPendingCreate)
                                                ? lecturerPendingCreate
                                                : []).filter((l: any) => l.id !== lecturer.id)
                                        ));
                                    } else {
                                        toast.error('Duyệt giảng viên thất bại!');
                                    }
                                } catch (err) {
                                    toast.error('Lỗi khi gọi API duyệt giảng viên!');
                                    return;
                                }
                            }

                            // Save Degrees
                            for (const [id, v] of Object.entries(degreeStates)) {
                                if (v.status === 'APPROVED') {
                                    await API.admin.approveDegree({ id: Number(id) });
                                } else if (v.status === 'REJECTED') {
                                    await API.admin.rejectDegree({ id: Number(id), adminNote: v.note });
                                }
                            }

                            // Save Certifications
                            for (const [id, v] of Object.entries(certStates)) {
                                if (v.status === 'APPROVED') {
                                    await API.admin.approveCertification({ id: Number(id) });
                                } else if (v.status === 'REJECTED') {
                                    await API.admin.rejectCertification({ id: Number(id), adminNote: v.note });
                                }
                            }
                            toast.success('Lưu trạng thái thành công!');
                            
                            localStorage.removeItem(`Lecturer${lecturer.id}`);
                            localStorage.removeItem(`Degrees${lecturer.id}`);
                            localStorage.removeItem(`Certification${lecturer.id}`);
                            handleDialogClose();
                        } catch (error) {
                            console.error('Error saving lecturer details:', error);
                            toast.error('Lỗi khi lưu trạng thái. Vui lòng thử lại sau.');
                        }

                    }}
                >Lưu</Button>
            </DialogActions>

            <ConfirmDialog
                open={confirmOpen}
                title={confirmType === 'approve' ? 'Xác nhận duyệt' : 'Xác nhận từ chối'}
                content={
                    confirmType === 'approve'
                        ? `Bạn có chắc chắn muốn duyệt ${confirmTarget?.type} với id = ${confirmTarget?.id}?`
                        : (
                            <Box>
                                <div>Bạn có chắc chắn muốn từ chối {confirmTarget?.type} với id = {confirmTarget?.id}?</div>
                                <TextField
                                    label="Lý do từ chối (admin note)"
                                    size="small"
                                    value={confirmTarget?.note ?? ''}
                                    onChange={e => {
                                        setConfirmTarget(t => t ? { ...t, note: e.target.value } : t);
                                        if (confirmTarget?.type === 'Degree') {
                                            setDegreeStates(prev => ({
                                                ...prev,
                                                [confirmTarget.id]: {
                                                    ...prev[confirmTarget.id],
                                                    note: e.target.value
                                                }
                                            }));
                                        } else if (confirmTarget?.type === 'Certification') {
                                            setCertStates(prev => ({
                                                ...prev,
                                                [confirmTarget.id]: {
                                                    ...prev[confirmTarget.id],
                                                    note: e.target.value
                                                }
                                            }));
                                        }
                                    }}
                                    fullWidth
                                    sx={{ mt: 2 }}
                                />
                            </Box>
                        )
                }
                onClose={handleCloseConfirm}
                onConfirm={() => {
                    if (confirmType === 'reject' && (!confirmTarget?.note || confirmTarget.note.trim() === '')) {
                        toast.error('Vui lòng nhập lý do từ chối.');
                        return;
                    }
                    handleConfirm();
                }}
            />
        </Dialog>
    );


};

export default LecturerDetailDialog;
