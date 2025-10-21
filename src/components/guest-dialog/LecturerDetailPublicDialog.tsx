import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Avatar,
  Chip,
  Divider,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import type { LecturerBasicPublic } from "../../types/Lecturer";

interface LecturerDetailPublicDialogProps {
  open: boolean;
  onClose: () => void;
  lecturer: LecturerBasicPublic | null;
}

const LecturerDetailPublicDialog: React.FC<LecturerDetailPublicDialogProps> = ({
  open,
  onClose,
  lecturer,
}) => {
  if (!lecturer) return null;

  // Star Rating Component
  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <Typography
          sx={{
            color: "orange",
            fontSize: "14px",
            fontWeight: "bold",
            minWidth: "35px",
          }}
        >
          {rating.toFixed(2)}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.1 }}>
          {[1, 2, 3, 4, 5].map((star) => {
            let fillPercentage = 0;

            if (rating >= star) {
              fillPercentage = 100;
            } else if (rating > star - 1) {
              fillPercentage = (rating - (star - 1)) * 100;
            }

            return (
              <Box
                key={star}
                sx={{
                  position: "relative",
                  fontSize: "16px",
                  lineHeight: 1,
                }}
              >
                <Typography
                  sx={{
                    color: "#e0e0e0",
                    fontSize: "16px",
                    lineHeight: 1,
                  }}
                >
                  ★
                </Typography>

                {fillPercentage > 0 && (
                  <Typography
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      color: "#ffa726",
                      fontSize: "16px",
                      lineHeight: 1,
                      overflow: "hidden",
                      width: `${fillPercentage}%`,
                    }}
                  >
                    ★
                  </Typography>
                )}
              </Box>
            );
          })}
        </Box>
      </Box>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 1,
          maxHeight: "90vh",
        },
      }}
    >
      {/* Header with close button */}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 2,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Thông tin Giảng viên
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        {/* Profile Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
            mb: 3,
          }}
        >
          {/* Avatar and Basic Info */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minWidth: "200px",
            }}
          >
            <Avatar
              src={lecturer.avatarUrl?.toString() || undefined}
              sx={{
                width: 150,
                height: 150,
                mb: 2,
                border: "4px solid #f0f0f0",
              }}
            />

            {/* Rating */}
            <Box sx={{ mb: 2 }}>
              {!lecturer.rating || lecturer.rating === 0 ? (
                <Typography
                  sx={{
                    color: "gray",
                    fontSize: "14px",
                    fontStyle: "italic",
                    textAlign: "center",
                  }}
                >
                  Chưa có đánh giá
                </Typography>
              ) : (
                <StarRating rating={lecturer.rating as number} />
              )}
            </Box>

            {/* Status */}
            <Chip
              label={
                lecturer.status === "APPROVED" ? "Đã xác thực" : lecturer.status
              }
              color={lecturer.status === "APPROVED" ? "success" : "default"}
              size="small"
            />
          </Box>

          {/* Details */}
          <Box sx={{ flex: 1 }}>
            {/* Name and Title */}
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {lecturer.academicRank}. {lecturer.fullName}
            </Typography>

            <Typography variant="h6" color="primary" gutterBottom>
              {lecturer.specialization}
            </Typography>

            {/* Basic Info Grid */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
                mt: 3,
              }}
            >
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Kinh nghiệm
                </Typography>
                <Typography variant="body1">
                  {lecturer.experienceYears.toString()} năm
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Lĩnh vực
                </Typography>
                <Typography variant="body1">{lecturer.jobField}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Giới tính
                </Typography>
                <Typography variant="body1">
                  {lecturer.gender ? "Nam" : "Nữ"}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Bio Section */}
        {lecturer.bio && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Giới thiệu
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
              {lecturer.bio}
            </Typography>
          </Box>
        )}

        {/* Degrees Section */}
        {lecturer.degrees && lecturer.degrees.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Bằng cấp
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {lecturer.degrees.map((degree, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 2,
                    border: "1px solid #e0e0e0",
                    borderRadius: 1,
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    {degree.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {degree.institution} • {degree.major}
                  </Typography>
                  {/* <Typography variant="body2" color="text.secondary">
                    {degree.graduationYear}
                  </Typography> */}
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Certifications Section */}
        {lecturer.certifications && lecturer.certifications.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Chứng chỉ
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {lecturer.certifications.map((cert, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 2,
                    border: "1px solid #e0e0e0",
                    borderRadius: 1,
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    {cert.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {cert.issuedBy}
                  </Typography>
                  {/* <Typography variant="body2" color="text.secondary">
                    Cấp: {new Date(cert.issueDate).toLocaleDateString("vi-VN")}
                    {cert.expiryDate && (
                      ` • Hết hạn: ${new Date(cert.expiryDate).toLocaleDateString("vi-VN")}`
                    )}
                  </Typography> */}
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="outlined" size="large">
          Đóng
        </Button>
        {/* <Button variant="contained" size="large">
          Liên hệ
        </Button> */}
      </DialogActions>
    </Dialog>
  );
};

export default LecturerDetailPublicDialog;
