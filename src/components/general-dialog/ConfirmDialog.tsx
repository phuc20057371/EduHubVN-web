import React from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Typography,
	Stack,
	Alert,
	TextField,
} from "@mui/material";
import { CheckCircle as CheckCircleIcon, Cancel as CancelIcon } from "@mui/icons-material";

interface ConfirmDialogProps {
	open: boolean;
	type: "approve" | "reject";
	title: string;
	message: string;
	loading?: boolean;
	rejectNote?: string;
	onRejectNoteChange?: (value: string) => void;
	rejectNoteRequired?: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
	open,
	type,
	title,
	message,
	loading = false,
	rejectNote = "",
	onRejectNoteChange,
	rejectNoteRequired = false,
	onClose,
	onConfirm,
}) => {
	const handleKeyPress = (event: React.KeyboardEvent) => {
		if (event.key === 'Enter' && !loading) {
			// Nếu là reject và cần ghi chú nhưng chưa có thì không submit
			if (type === 'reject' && rejectNoteRequired && !rejectNote.trim()) {
				return;
			}
			onConfirm();
		}
	};

	return (
		<Dialog 
			open={open} 
			onClose={onClose} 
			maxWidth="sm" 
			fullWidth
			onKeyDown={handleKeyPress}
		>
			<DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
				{type === "approve" ? (
					<>
						<CheckCircleIcon color="success" />
						<Typography variant="h6">{title}</Typography>
					</>
				) : (
					<>
						<CancelIcon color="error" />
						<Typography variant="h6">{title}</Typography>
					</>
				)}
			</DialogTitle>
			<DialogContent>
				{type === "approve" ? (
					<Alert severity="info">{message}</Alert>
				) : (
					<Stack spacing={2}>
						<Alert severity="warning">{message}</Alert>
						{rejectNoteRequired && (
							<TextField
								label="Lý do từ chối *"
								value={rejectNote}
								onChange={(e) => onRejectNoteChange?.(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === 'Enter' && e.ctrlKey && !loading && rejectNote.trim()) {
										// Ctrl + Enter để submit khi đang trong TextField
										onConfirm();
									}
								}}
								fullWidth
								multiline
								rows={3}
								variant="outlined"
								placeholder="Nhập lý do từ chối... (Ctrl + Enter để xác nhận)"
								required
							/>
						)}
					</Stack>
				)}
			</DialogContent>
			<DialogActions sx={{ p: 3, gap: 1 }}>
				<Button onClick={onClose} variant="outlined" disabled={loading}>
					Hủy
				</Button>
				<Button
					onClick={onConfirm}
					variant="contained"
					color={type === "approve" ? "success" : "error"}
					disabled={loading || (type === "reject" && rejectNoteRequired && !rejectNote.trim())}
					autoFocus={type === "approve" || !rejectNoteRequired}
					sx={{ minWidth: 100 }}
				>
					{loading
						? "Đang xử lý..."
						: type === "approve"
						? "Duyệt"
						: "Từ chối"}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ConfirmDialog;
