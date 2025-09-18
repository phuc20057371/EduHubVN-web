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
import ApproveLecturerUpdateDialog from "../../../../components/admin-dialog/admin-lecturer-dialog/ApproveLecturerUpdateDialog";
import { getAcademicRank, getRelativeTime } from "../../../../utils/ChangeText";

interface AdminLecturerUpdateTabProps {
  lecturerUpdateList: any[];
}

const AdminLecturerUpdateTab: React.FC<AdminLecturerUpdateTabProps> = ({
  lecturerUpdateList,
}) => {
  // Local state for filters
  const [updateSearchTerm, setUpdateSearchTerm] = useState("");
  const [updateDateSort, setUpdateDateSort] = useState("oldest");

  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [selectedLecturerUpdate, setSelectedLecturerUpdate] =
    useState<any>(null);

  // Filtered data logic
  const filteredUpdateList = React.useMemo(() => {
    let filtered = lecturerUpdateList;

    if (updateSearchTerm) {
      filtered = filtered.filter(
        (item: any) =>
          item.lecturer.id?.toString().includes(updateSearchTerm) ||
          item.lecturer.fullName
            ?.toLowerCase()
            .includes(updateSearchTerm.toLowerCase()),
      );
    }

    filtered = [...filtered].sort((a: any, b: any) => {
      const dateA = new Date(
        a.lecturerUpdate.updatedAt || a.lecturerUpdate.createdAt || 0,
      );
      const dateB = new Date(
        b.lecturerUpdate.updatedAt || b.lecturerUpdate.createdAt || 0,
      );

      if (updateDateSort === "oldest") {
        return dateA.getTime() - dateB.getTime();
      } else {
        return dateB.getTime() - dateA.getTime();
      }
    });

    return filtered;
  }, [lecturerUpdateList, updateSearchTerm, updateDateSort]);

  const handleDataReloaded = (updatedItem: any) => {
    // Update the selected lecturer with the latest data
    setSelectedLecturerUpdate(updatedItem);
  };

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 1,
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
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                width: 56,
                height: 56,
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                🔄
              </Typography>
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                Yêu cầu cập nhật thông tin giảng viên
              </Typography>
              <Typography variant="body2">
                {updateSearchTerm
                  ? `Đã lọc ${filteredUpdateList?.length || 0} yêu cầu`
                  : `Tổng cộng ${filteredUpdateList?.length || 0} yêu cầu cập nhật chờ phê duyệt`}
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
          <Box sx={{ minWidth: 180, flex: "0 0 auto" }}>
            <FormControl fullWidth size="small">
              <InputLabel>Sắp xếp theo ngày</InputLabel>
              <Select
                value={updateDateSort}
                label="Sắp xếp theo ngày"
                onChange={(e) => setUpdateDateSort(e.target.value)}
                sx={{
                  borderRadius: 1,
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
              placeholder="🔍 Tìm kiếm theo ID, tên giảng viên..."
              value={updateSearchTerm}
              onChange={(e) => setUpdateSearchTerm(e.target.value)}
              sx={{
                borderRadius: 1,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "primary.main" }} />
                  </InputAdornment>
                ),
                endAdornment: updateSearchTerm && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setUpdateSearchTerm("")}
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
        {(updateSearchTerm || updateDateSort !== "oldest") && (
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

            {updateSearchTerm && (
              <Chip
                label={`Tìm kiếm: "${updateSearchTerm}"`}
                size="small"
                onDelete={() => setUpdateSearchTerm("")}
                color="primary"
                variant="outlined"
              />
            )}

            {updateDateSort !== "oldest" && (
              <Chip
                label={`Sắp xếp: ${updateDateSort === "newest" ? "Mới nhất trước" : "Cũ nhất trước"}`}
                size="small"
                onDelete={() => setUpdateDateSort("oldest")}
                color="info"
                variant="outlined"
                icon={<DateRange />}
              />
            )}

            <Button
              size="small"
              onClick={() => {
                setUpdateSearchTerm("");
                setUpdateDateSort("oldest");
              }}
              sx={{ ml: 1, textTransform: "none" }}
            >
              Xóa tất cả
            </Button>
          </Box>
        )}
      </Paper>

      {filteredUpdateList && filteredUpdateList.length > 0 ? (
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
          {filteredUpdateList.map((item: any) => (
            <Card
              key={item.lecturer.id}
              sx={{
                transition: "all 0.3s ease",
                border: "2px solid",
                borderColor: "warning.light",
                borderRadius: 1,
                height: "fit-content",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                  borderColor: "warning.main",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar
                      src={item.lecturer.avatarUrl}
                      sx={{
                        bgcolor: "warning.main",
                        width: 50,
                        height: 50,
                        fontSize: "1.2rem",
                        fontWeight: 700,
                      }}
                    >
                      {item.lecturer.fullName?.charAt(0)}
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
                        {item.lecturer.fullName}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 0.5, mt: 0.5 }}>
                        <Chip
                          label={getAcademicRank(item.lecturer.academicRank)}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ fontSize: "0.7rem", height: 20 }}
                        />
                        <Chip
                          label="Cập nhật"
                          size="small"
                          color="warning"
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
                        {item.lecturer.specialization}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontWeight: 600, mb: 0.5 }}
                        >
                          Kinh nghiệm
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {item.lecturer.experienceYears} năm
                        </Typography>
                      </Box>

                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontWeight: 600, mb: 0.5 }}
                        >
                          Thời gian
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 500, fontSize: "0.75rem" }}
                        >
                          {getRelativeTime(item.lecturerUpdate.updatedAt)}
                        </Typography>
                      </Box>
                    </Box>

                    <Button
                      variant="contained"
                      color="warning"
                      size="small"
                      fullWidth
                      sx={{
                        mt: 1,
                        py: 1,
                        fontWeight: 600,
                        textTransform: "none",
                        borderRadius: 1,
                        fontSize: "0.8rem",
                      }}
                      onClick={() => {
                        setSelectedLecturerUpdate(item);
                        setOpenUpdateDialog(true);
                      }}
                    >
                      Xem chi tiết
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <Paper
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 1,
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
            Hiện tại không có yêu cầu cập nhật thông tin giảng viên nào cần xử
            lý.
          </Typography>
        </Paper>
      )}

      <ApproveLecturerUpdateDialog
        open={openUpdateDialog}
        onClose={() => setOpenUpdateDialog(false)}
        lecturer={selectedLecturerUpdate?.lecturer || {}}
        lecturerUpdate={selectedLecturerUpdate?.lecturerUpdate || {}}
        onDataReloaded={handleDataReloaded}
      />
    </>
  );
};

export default AdminLecturerUpdateTab;
