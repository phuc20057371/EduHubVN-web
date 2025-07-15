import React, { useState } from 'react';
import { Modal, Box, Typography, Button, TextField, CircularProgress } from '@mui/material';
import type { DegreeRequest } from '../types/DegreeRequest';
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

interface UploadDegreeModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (degree: DegreeRequest) => void; // callback gửi dữ liệu ra ngoài
}

const UploadDegreeModal: React.FC<UploadDegreeModalProps> = ({ open, onClose, onSubmit }) => {
    // useEffect đẻ clear form khi đóng modal
    React.useEffect(() => {
        if (!open) {
            setForm({
                referenceId: '',
                name: '',
                major: '',
                institution: '',
                startYear: 0,
                graduationYear: 0,
                level: '',
                url: '',
                description: '',
            });
            setSelectedFile(null);
            setIsUploading(false);
        }
    }, [open]);
    const [form, setForm] = useState<DegreeRequest>({
        referenceId: '',
        name: '',
        major: '',
        institution: '',
        startYear: 0,
        graduationYear: 0,
        level: '',
        url: '',
        description: '',
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const handleChange = (field: keyof DegreeRequest, value: string | number) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        onSubmit(form);
        onClose();
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
            .then((response: any) => {
                console.log("✅ File uploaded successfully:", response.data);
                setForm(prev => ({ ...prev, url: response.data.fileUrl }));
            })
            .catch((error: any) => {
                console.error("❌ Error uploading file:", error);
            })
            .finally(() => {
                setIsUploading(false);
            });
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Typography variant="h6" gutterBottom>
                    Nhập thông tin bằng cấp
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
                        label="Tên bằng cấp"
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                    />

                    <TextField
                        fullWidth
                        label="Ngành học"
                        value={form.major}
                        onChange={(e) => handleChange("major", e.target.value)}
                    />

                    <TextField
                        fullWidth
                        label="Trường"
                        value={form.institution}
                        onChange={(e) => handleChange("institution", e.target.value)}
                    />

                    <Box display="flex" gap={2}>
                        <TextField
                            fullWidth
                            type="number"
                            label="Năm bắt đầu"
                            value={form.startYear}
                            onChange={(e) => handleChange("startYear", +e.target.value)}
                        />
                        <TextField
                            fullWidth
                            type="number"
                            label="Năm tốt nghiệp"
                            value={form.graduationYear}
                            onChange={(e) => handleChange("graduationYear", +e.target.value)}
                        />
                    </Box>

                    <TextField
                        fullWidth
                        label="Trình độ"
                        value={form.level}
                        onChange={(e) => handleChange("level", e.target.value)}
                    />

                    {selectedFile && (
                        <Typography variant="body2">
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
                            startIcon={isUploading ? <CircularProgress size={20} /> : null}
                        >
                            {isUploading ? "Đang tải lên..." : "Upload"}
                        </Button>
                    </Box>

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

export default UploadDegreeModal;
