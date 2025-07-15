import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, CircularProgress, Modal } from '@mui/material';
import type { CertificationRequest } from '../types/CertificationRequest';
import { API } from '../utils/Fetch';
import { Stack } from '@mui/system';

const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};

interface UploadCertificationModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (cert: CertificationRequest) => void;
}

const UploadCertificationModal: React.FC<UploadCertificationModalProps> = ({ open, onClose, onSubmit }) => {
    const [form, setForm] = useState<CertificationRequest>({
        referenceId: '',
        name: '',
        issuedBy: '',
        issueDate: new Date(),
        expiryDate: new Date(),
        certificateUrl: '',
        level: '',
        description: '',
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (!open) {
            setForm({
                referenceId: '',
                name: '',
                issuedBy: '',
                issueDate: new Date(),
                expiryDate: new Date(),
                certificateUrl: '',
                level: '',
                description: '',
            });
            setSelectedFile(null);
            setIsUploading(false);
        }
    }, [open]);

    const handleChange = (field: keyof CertificationRequest, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleFileUpload = () => {
        if (!selectedFile) return;
        setIsUploading(true);

        API.user.uploadFile(selectedFile)
            .then((res: any) => {
                setForm(prev => ({ ...prev, certificateUrl: res.data.fileUrl }));
            })
            .catch(err => {
                console.error("Upload failed", err);
            })
            .finally(() => {
                setIsUploading(false);
            });
    };

    const handleSubmit = () => {
        onSubmit(form);
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Typography variant="h6" gutterBottom>
                    Nhập thông tin chứng chỉ
                </Typography>

                <Stack spacing={2}>
                    <TextField
                        fullWidth
                        label="Reference ID"
                        value={form.referenceId}
                        onChange={(e) => handleChange("referenceId", e.target.value)}
                    />
                    <TextField
                        fullWidth
                        label="Tên chứng chỉ"
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                    />

                    <TextField
                        fullWidth
                        label="Cấp bởi"
                        value={form.issuedBy}
                        onChange={(e) => handleChange("issuedBy", e.target.value)}
                    />

                    <Box display="flex" gap={2}>
                        <TextField
                            fullWidth
                            type="date"
                            label="Ngày cấp"
                            InputLabelProps={{ shrink: true }}
                            value={form.issueDate.toISOString().substring(0, 10)}
                            onChange={(e) => handleChange("issueDate", new Date(e.target.value))}
                        />
                        <TextField
                            fullWidth
                            type="date"
                            label="Ngày hết hạn"
                            InputLabelProps={{ shrink: true }}
                            value={form.expiryDate.toISOString().substring(0, 10)}
                            onChange={(e) => handleChange("expiryDate", new Date(e.target.value))}
                        />
                    </Box>

                    <Box>
                        {selectedFile && (
                            <Typography variant="body2" sx={{ mb: 1 }}>
                                📄 Đã chọn: <strong>{selectedFile.name}</strong>
                            </Typography>
                        )}
                        <Box display="flex" gap={2}>
                            <Button variant="outlined" component="label" fullWidth>
                                📁 Chọn file
                                <input type="file" hidden onChange={handleFileChange} />
                            </Button>
                            <Button
                                variant="contained"
                                fullWidth
                                onClick={handleFileUpload}
                                disabled={isUploading || !selectedFile}
                                startIcon={
                                    isUploading ? <CircularProgress size={20} color="inherit" /> : null
                                }
                            >
                                {isUploading ? "Đang tải..." : "Upload"}
                            </Button>
                        </Box>
                    </Box>

                    <TextField
                        fullWidth
                        label="Trình độ"
                        value={form.level}
                        onChange={(e) => handleChange("level", e.target.value)}
                    />

                    <TextField
                        fullWidth
                        label="Mô tả"
                        multiline
                        rows={3}
                        value={form.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                    />
                </Stack>

                <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
                    <Button variant="outlined" onClick={onClose}>
                        Hủy
                    </Button>
                    <Button variant="contained" onClick={handleSubmit}>
                        Lưu
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default UploadCertificationModal;
