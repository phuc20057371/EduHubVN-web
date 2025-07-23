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

interface CertificationUpdateDialogProps {
  open: boolean;
  onClose: () => void;
  data: any;
}

const CertificationUpdateDialog = ({ open, onClose, data }: CertificationUpdateDialogProps) => {
  if (!data) return null;
  const dispatch = useDispatch();
  const [cert, setCert] = useState(data);
  const current = useSelector((state: any) => state.pendingLecturer);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const [name, setName] = useState(cert?.name || '');
  const [level, setLevel] = useState(cert?.level || '');
  const [issuedBy, setIssuedBy] = useState(cert?.issuedBy || '');
  const [issueDate, setIssueDate] = useState(cert?.issueDate || '');
  const [expiryDate, setExpiryDate] = useState(cert?.expiryDate || '');
  // const [certificateUrl, setCertificateUrl] = useState(cert?.certificateUrl || '');
  const certificateUrl = cert?.certificateUrl || '';
  const [description, setDescription] = useState(cert?.description || '');

  const handleConfirm = async () => {
    setOpenConfirmDialog(true);
  };

  const handleSave = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    try {
      const updatedCert = {
        ...cert,
        name,
        level,
        issuedBy,
        issueDate,
        expiryDate,
        certificateUrl,
        description,
        status: 'PENDING',
      };
      setCert(updatedCert);
      // Replace certification with same id
      const updatedCerts = Array.isArray(current.certifications)
        ? current.certifications.map((c: any) => c.id === updatedCert.id ? { ...updatedCert } : c)
        : [];
      const updatedPendingLecturer = {
        ...current,
        certifications: updatedCerts,
      };
      dispatch(setPendingLecturer(updatedPendingLecturer));
      setOpenConfirmDialog(false);
      onClose();
    } catch (error) {
      console.error('Lỗi khi lưu chứng chỉ:', error);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Chi tiết chứng chỉ
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
            <div className='flex flex-col w-full gap-3'>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>📜 Thông tin chứng chỉ</Typography>
              <TextField label="Tên chứng chỉ" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
              <TextField label="Trình độ" value={level} onChange={(e) => setLevel(e.target.value)} fullWidth />
              <TextField label="Cấp bởi" value={issuedBy} onChange={(e) => setIssuedBy(e.target.value)} fullWidth />
              <div className='flex flex-row gap-3'>
                <TextField label="Ngày cấp" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} fullWidth type="date" InputLabelProps={{ shrink: true }} />
                <TextField label="Ngày hết hạn" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} fullWidth type="date" InputLabelProps={{ shrink: true }} />
              </div>
              <TextField label="Mô tả" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth />
              <Typography>
                File: {cert?.certificateUrl ? (
                  <a href={cert.certificateUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'underline' }}>
                    {cert.certificateUrl}
                  </a>
                ) : 'Không có'}
              </Typography>
              <Typography>Giời cập nhật: {cert?.updatedAt ? new Date(cert.updatedAt).toLocaleString('vi-VN') : ''}</Typography>
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
          <Typography>Bạn có chắc chắn muốn lưu chứng chỉ này?</Typography>
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

export default CertificationUpdateDialog;