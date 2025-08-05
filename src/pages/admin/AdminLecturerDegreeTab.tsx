import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import {
  Clear as ClearIcon,
  Search as SearchIcon,
  DateRange,
} from "@mui/icons-material";
import ApproveDegreeDialog from "../../components/ApproveDegreeDialog";
import ApproveDegreeUpdateDialog from "../../components/ApproveDegreeUpdateDialog";
import ApproveCertificationDialog from "../../components/ApproveCertificationDialog";
import ApproveCertificationUpdateDialog from "../../components/ApproveCertificationUpdateDialog";

interface AdminLecturerDegreeTabProps {
  filteredDegreeList: any[];
  degreeSearchTerm: string;
  setDegreeSearchTerm: (value: string) => void;
  degreeTypeFilter: string;
  setDegreeTypeFilter: (value: string) => void;
  degreeDateSort: string;
  setDegreeDateSort: (value: string) => void;
}

const AdminLecturerDegreeTab: React.FC<AdminLecturerDegreeTabProps> = ({
  filteredDegreeList,
  degreeSearchTerm,
  setDegreeSearchTerm,
  degreeTypeFilter,
  setDegreeTypeFilter,
  degreeDateSort,
  setDegreeDateSort,
}) => {
  const [selectedDegreeItem, setSelectedDegreeItem] = useState<any>(null);
  const [openDegreeDialog, setOpenDegreeDialog] = useState(false);
  const [openDegreeUpdateDialog, setOpenDegreeUpdateDialog] = useState(false);
  const [openCertificationDialog, setOpenCertificationDialog] = useState(false);
  const [openCertificationUpdateDialog, setOpenCertificationUpdateDialog] = useState(false);

  const handleDegreeItemClick = (item: any) => {
    console.log("Selected degree item:", item);

    setSelectedDegreeItem(item);

    if (item.type === "BC") {
      if (item.label === "Create") {
        console.log("Open degree dialog for item:", item);
        setOpenDegreeDialog(true);
      } else if (item.label === "Update") {
        console.log("Open degree update dialog for item:", item);
        setOpenDegreeUpdateDialog(true);
      }
    } else if (item.type === "CC") {
      if (item.label === "Create") {
        setOpenCertificationDialog(true);
      } else if (item.label === "Update") {
        setOpenCertificationUpdateDialog(true);
      }
    }
  };

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          borderRadius: 3,
          border: "1px solid rgba(255,255,255,0.8)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: "primary.main",
                background:
                  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                width: 56,
                height: 56,
              }}
            >
              <Typography
                variant="h4"
                sx={{ color: "white", fontWeight: 700 }}
              >
                🎓
              </Typography>
            </Avatar>
            <Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: "#2c3e50", mb: 0.5 }}
              >
                Yêu cầu chứng chỉ và bằng cấp
              </Typography>
              <Typography variant="body2" sx={{ color: "#6c757d" }}>
                {degreeSearchTerm || degreeTypeFilter
                  ? `Đã lọc ${filteredDegreeList?.length || 0} yêu cầu`
                  : `Tổng cộng ${filteredDegreeList?.length || 0} yêu cầu chứng chỉ và bằng cấp`}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Filters */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ minWidth: 150, flex: "0 0 auto" }}>
            <FormControl fullWidth size="small">
              <InputLabel>Loại</InputLabel>
              <Select
                value={degreeTypeFilter}
                label="Loại"
                onChange={(e) => setDegreeTypeFilter(e.target.value)}
                sx={{
                  bgcolor: "white",
                  borderRadius: 2,
                }}
              >
                <MenuItem value="">
                  <em>Tất cả</em>
                </MenuItem>
                <MenuItem value="BC">Bằng cấp</MenuItem>
                <MenuItem value="CC">Chứng chỉ</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ minWidth: 180, flex: "0 0 auto" }}>
            <FormControl fullWidth size="small">
              <InputLabel>Sắp xếp theo ngày</InputLabel>
              <Select
                value={degreeDateSort}
                label="Sắp xếp theo ngày"
                onChange={(e) => setDegreeDateSort(e.target.value)}
                sx={{
                  bgcolor: "white",
                  borderRadius: 2,
                }}
              >
                <MenuItem value="oldest">Cũ nhất trước</MenuItem>
                <MenuItem value="newest">Mới nhất trước</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ flex: "1 1 300px", minWidth: 300 }}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="🔍 Theo ID, tên giảng viên, tên bằng cấp..."
              value={degreeSearchTerm}
              onChange={(e) => setDegreeSearchTerm(e.target.value)}
              sx={{
                bgcolor: "white",
                borderRadius: 2,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "primary.main" }} />
                  </InputAdornment>
                ),
                endAdornment: degreeSearchTerm && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setDegreeSearchTerm("")}
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>

        {/* Active Filters Display */}
        {(degreeSearchTerm ||
          degreeTypeFilter ||
          degreeDateSort !== "oldest") && (
          <Box
            sx={{
              mt: 2,
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" sx={{ color: "#6c757d", mr: 1 }}>
              Bộ lọc đang áp dụng:
            </Typography>

            {degreeSearchTerm && (
              <Chip
                label={`Tìm kiếm: "${degreeSearchTerm}"`}
                size="small"
                onDelete={() => setDegreeSearchTerm("")}
                color="primary"
                variant="outlined"
              />
            )}

            {degreeTypeFilter && (
              <Chip
                label={`Loại: ${degreeTypeFilter === "BC" ? "Bằng cấp" : "Chứng chỉ"}`}
                size="small"
                onDelete={() => setDegreeTypeFilter("")}
                color="secondary"
                variant="outlined"
              />
            )}

            {degreeDateSort !== "oldest" && (
              <Chip
                label={`Sắp xếp: ${degreeDateSort === "newest" ? "Mới nhất trước" : "Cũ nhất trước"}`}
                size="small"
                onDelete={() => setDegreeDateSort("oldest")}
                color="info"
                variant="outlined"
                icon={<DateRange />}
              />
            )}

            <Button
              size="small"
              onClick={() => {
                setDegreeSearchTerm("");
                setDegreeTypeFilter("");
                setDegreeDateSort("oldest");
              }}
              sx={{ ml: 1, textTransform: "none" }}
            >
              Xóa tất cả
            </Button>
          </Box>
        )}
      </Paper>

      {filteredDegreeList && filteredDegreeList.length > 0 ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 3,
            "@media (min-width: 1200px)": {
              gridTemplateColumns: "repeat(4, 1fr)",
            },
            "@media (min-width: 900px) and (max-width: 1199px)": {
              gridTemplateColumns: "repeat(3, 1fr)",
            },
            "@media (min-width: 600px) and (max-width: 899px)": {
              gridTemplateColumns: "repeat(2, 1fr)",
            },
            "@media (max-width: 599px)": {
              gridTemplateColumns: "1fr",
            },
          }}
        >
          {filteredDegreeList.map((item: any, index: number) => {
            const contentData =
              item.label === "Update"
                ? item.content?.original
                : item.content;

            return (
              <Card
                key={index}
                sx={{
                  transition: "all 0.3s ease",
                  border: "2px solid",
                  borderColor:
                    item.label === "Create"
                      ? "success.light"
                      : "warning.light",
                  borderRadius: 3,
                  height: "fit-content",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                    borderColor:
                      item.label === "Create"
                        ? "success.main"
                        : "warning.main",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 2 }}
                    >
                      <Avatar
                        src={item.lecturerInfo?.avatarUrl}
                        sx={{
                          bgcolor:
                            item.label === "Create"
                              ? "success.main"
                              : "warning.main",
                          width: 50,
                          height: 50,
                          fontSize: "1.2rem",
                          fontWeight: 700,
                        }}
                      >
                        {item.lecturerInfo?.fullName?.charAt(0)}
                      </Avatar>

                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            color: "text.primary",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.lecturerInfo?.fullName}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 0.5, mt: 0.5 }}>
                          <Chip
                            label={
                              item.type === "BC" ? "Bằng cấp" : "Chứng chỉ"
                            }
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: "0.7rem", height: 20 }}
                          />
                          <Chip
                            label={item.label}
                            size="small"
                            color={
                              item.label === "Create"
                                ? "success"
                                : "warning"
                            }
                            sx={{ fontSize: "0.7rem", height: 20 }}
                          />
                        </Box>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.5,
                      }}
                    >
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontWeight: 600, mb: 0.5 }}
                        >
                          Tên
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {contentData?.name}
                        </Typography>
                      </Box>

                      {item.type === "BC" ? (
                        <>
                          <Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontWeight: 600, mb: 0.5 }}
                            >
                              Chuyên ngành
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 500,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {contentData?.major}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontWeight: 600, mb: 0.5 }}
                            >
                              Trình độ
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 500 }}
                            >
                              {contentData?.level}
                            </Typography>
                          </Box>
                        </>
                      ) : (
                        <>
                          <Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontWeight: 600, mb: 0.5 }}
                            >
                              Chuyên ngành
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 500,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {contentData?.specialization || "Không có"}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontWeight: 600, mb: 0.5 }}
                            >
                              Trình độ
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 500 }}
                            >
                              {contentData?.level}
                            </Typography>
                          </Box>
                        </>
                      )}

                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontWeight: 600, mb: 0.5 }}
                        >
                          Thời gian cập nhật
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 500, fontSize: "0.75rem" }}
                        >
                          {(() => {
                            const updateTime = new Date(
                              item.date ||
                                contentData?.updatedAt ||
                                contentData?.createdAt ||
                                Date.now(),
                            );
                            const now = new Date();
                            const diffInHours = Math.floor(
                              (now.getTime() - updateTime.getTime()) /
                                (1000 * 60 * 60),
                            );

                            if (diffInHours < 1) {
                              return "Vừa cập nhật";
                            } else if (diffInHours < 48) {
                              return `${diffInHours}h trước`;
                            } else {
                              const diffInDays = Math.floor(
                                diffInHours / 24,
                              );
                              return `${diffInDays}d trước`;
                            }
                          })()}
                        </Typography>
                      </Box>

                      <Button
                        variant="contained"
                        color={
                          item.label === "Create" ? "success" : "warning"
                        }
                        size="small"
                        fullWidth
                        sx={{
                          mt: 1,
                          py: 1,
                          fontWeight: 600,
                          textTransform: "none",
                          borderRadius: 2,
                          fontSize: "0.8rem",
                        }}
                        onClick={() => handleDegreeItemClick(item)}
                      >
                        Xem chi tiết
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      ) : (
        <Paper
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ mb: 2, fontWeight: 600 }}
          >
            Không có yêu cầu nào
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Hiện tại không có yêu cầu chứng chỉ/bằng cấp nào cần xử lý.
          </Typography>
        </Paper>
      )}

      {/* Dialogs */}
      <ApproveDegreeDialog
        open={openDegreeDialog}
        onClose={() => setOpenDegreeDialog(false)}
        data={selectedDegreeItem}
      />
      <ApproveDegreeUpdateDialog
        open={openDegreeUpdateDialog}
        onClose={() => setOpenDegreeUpdateDialog(false)}
        data={selectedDegreeItem}
      />
      <ApproveCertificationDialog
        open={openCertificationDialog}
        onClose={() => setOpenCertificationDialog(false)}
        data={selectedDegreeItem}
      />
      <ApproveCertificationUpdateDialog
        open={openCertificationUpdateDialog}
        onClose={() => setOpenCertificationUpdateDialog(false)}
        data={selectedDegreeItem}
      />
    </>
  );
};

export default AdminLecturerDegreeTab;
