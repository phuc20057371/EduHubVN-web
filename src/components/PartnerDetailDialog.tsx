
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface PartnerDetailDialogProps {
  open: boolean;
  onClose: () => void;
  partner: any;
}

const PartnerDetailDialog = ({ open, onClose, partner }: PartnerDetailDialogProps) => {
  if (!open) return null;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Chi tiết đối tác</DialogTitle>
      <DialogContent dividers>
        <Box>
          <Typography variant="h6" gutterBottom>{partner.organizationName}</Typography>
          <Typography><b>Ngành:</b> {partner.industry}</Typography>
          <Typography><b>Đại diện:</b> {partner.representativeName} ({partner.position})</Typography>
          <Typography><b>Năm thành lập:</b> {partner.establishedYear}</Typography>
          <Typography><b>ĐKKD:</b> {partner.businessRegistrationNumber}</Typography>
          <Typography><b>Địa chỉ:</b> {partner.address}</Typography>
          <Typography><b>Điện thoại:</b> {partner.phoneNumber}</Typography>
          <Typography><b>Website:</b> <a href={partner.website} target="_blank" rel="noopener noreferrer">{partner.website}</a></Typography>
          <Typography><b>Mô tả:</b> {partner.description}</Typography>
          <Typography><b>Trạng thái:</b> {partner.status}</Typography>
          <Typography><b>Admin note:</b> {partner.adminNote}</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Đóng</Button>
      </DialogActions>
    </Dialog>
  );
}

export default PartnerDetailDialog