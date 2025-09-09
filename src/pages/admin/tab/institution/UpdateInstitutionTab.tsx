import { useMemo, useState } from "react";
import {
  Paper,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Chip,
  Avatar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Box,
  IconButton,
} from "@mui/material";
import { Business, Update } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import ApproveInstitutionUpdateDialog from "../../../../components/admin-dialog/admin-institution-dialog/ApproveInstitutionUpdateDialog";
import { getInstitutionType, formatDateToVietnamTime, getRelativeTime } from "../../../../utils/ChangeText";



interface UpdateInstitutionTabProps {
  institutionPendingUpdate: any[];
}

const UpdateInstitutionTab: React.FC<UpdateInstitutionTabProps> = ({
  institutionPendingUpdate,
}) => {
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [selectedUpdate, setSelectedUpdate] = useState<{
    oldData: any;
    newData: any;
  } | null>(null);

  // Filter states for Update tab
  const [updateSearchTerm, setUpdateSearchTerm] = useState("");
  const [updateDateSort, setUpdateDateSort] = useState("oldest");

  // Filtered and sorted update list with enhanced search
  const filteredUpdateList = useMemo(() => {
    let filtered = institutionPendingUpdate;

    // Filter by search term (search across multiple fields including ID)
    if (updateSearchTerm) {
      const searchLower = updateSearchTerm.toLowerCase();

      filtered = filtered.filter((item: any) => {
        const edu = item.educationInstitution;
        const eduUpdate = item.educationInstitutionUpdate;

        return (
          // Search by ID (exact match or partial match for UUID)
          item.id?.toLowerCase().includes(searchLower) ||
          edu?.id?.toLowerCase().includes(searchLower) ||
          // Existing search fields
          edu?.institutionName?.toLowerCase().includes(searchLower) ||
          edu?.representativeName?.toLowerCase().includes(searchLower) ||
          edu?.businessRegistrationNumber
            ?.toLowerCase()
            .includes(searchLower) ||
          edu?.address?.toLowerCase().includes(searchLower) ||
          edu?.description?.toLowerCase().includes(searchLower) ||
          edu?.phoneNumber?.includes(updateSearchTerm) ||
          edu?.website?.toLowerCase().includes(searchLower) ||
          eduUpdate?.institutionName?.toLowerCase().includes(searchLower) ||
          eduUpdate?.representativeName?.toLowerCase().includes(searchLower) ||
          eduUpdate?.address?.toLowerCase().includes(searchLower)
        );
      });
    }

    // Sort by date with proper date handling
    filtered = [...filtered].sort((a: any, b: any) => {
      const dateA = new Date(a.educationInstitutionUpdate.updatedAt || a.educationInstitutionUpdate.createdAt || 0);
      const dateB = new Date(b.educationInstitutionUpdate.updatedAt || b.educationInstitutionUpdate.createdAt || 0);

      if (updateDateSort === "oldest") {
        return dateA.getTime() - dateB.getTime();
      } else {
        return dateB.getTime() - dateA.getTime();
      }
    });

    return filtered;
  }, [institutionPendingUpdate, updateSearchTerm, updateDateSort]);

  // Clear update tab filters
  const clearUpdateFilters = () => {
    setUpdateSearchTerm("");
    setUpdateDateSort("oldest");
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Enhanced Header for Update Tab - similar to Create Tab but with warning colors */}
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <Avatar
            sx={{
              bgcolor: "warning.main",
              background: "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)",
              width: 56,
              height: 56,
            }}
          >
            <Update sx={{ fontSize: 28 }} />
          </Avatar>
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: "#2c3e50", mb: 0.5 }}
            >
              Yêu cầu cập nhật thông tin cơ sở giáo dục
            </Typography>
            <Typography variant="body2" sx={{ color: "#6c757d" }}>
              {updateSearchTerm || updateDateSort !== "oldest"
                ? `Đã lọc ${filteredUpdateList.length} yêu cầu`
                : `Tổng cộng ${filteredUpdateList.length} yêu cầu chờ phê duyệt`}
            </Typography>
          </Box>
        </Box>

        {/* Similar enhanced filter controls for Update Tab */}
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
              <InputLabel id="update-date-sort-label">
                Sắp xếp theo ngày
              </InputLabel>
              <Select
                labelId="update-date-sort-label"
                value={updateDateSort}
                label="Sắp xếp theo ngày"
                onChange={(e) => setUpdateDateSort(e.target.value)}
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

          <Box sx={{ flex: "1 1 400px", minWidth: 400 }}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="🔍 Tìm kiếm theo ID, tên, địa chỉ, đại diện, ĐKKD..."
              value={updateSearchTerm}
              onChange={(e) => setUpdateSearchTerm(e.target.value)}
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

          <Button
            size="small"
            onClick={clearUpdateFilters}
            disabled={!updateSearchTerm && updateDateSort === "oldest"}
            sx={{ textTransform: "none" }}
          >
            Xóa bộ lọc
          </Button>
        </Box>

        {/* Filter summary for update tab */}
        {(updateSearchTerm || updateDateSort !== "oldest") && (
          <Box
            sx={{
              mt: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
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
                color="secondary"
                variant="outlined"
              />
            )}
          </Box>
        )}
      </Paper>

      {/* Show no results message when filtered data is empty */}
      {filteredUpdateList && filteredUpdateList.length > 0 ? (
        /* Update cards with enhanced styling similar to create tab but with warning colors */
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "1fr 1fr 1fr",
              lg: "1fr 1fr 1fr 1fr",
            },
            gap: 3,
          }}
        >
          {filteredUpdateList.map((item: any, idx: number) => {
            const edu = item.educationInstitution;
            const eduUpdate = item.educationInstitutionUpdate;
            if (edu && eduUpdate) {
              return (
                <Card
                  key={item.id || idx}
                  sx={{
                    height: "100%",
                    transition: "all 0.3s ease",
                    border: "2px solid",
                    borderColor: "warning.light",
                    borderRadius: 3,
                    background:
                      "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 12px 40px rgba(255, 152, 0, 0.2)",
                      borderColor: "warning.main",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Avatar
                        src={edu.logoUrl || ""}
                        sx={{
                          bgcolor: "warning.main",
                          background:
                            "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)",
                          mr: 2,
                          width: 48,
                          height: 48,
                        }}
                      >
                        <Business />
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            mb: 0.5,
                            color: "#2c3e50",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            minHeight: "3.2em", // ~2 lines for default font size
                            lineHeight: 1.6,
                          }}
                          title={edu.institutionName}
                        >
                          {edu.institutionName}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Chip
                            label={getInstitutionType(edu.institutionType)}
                            size="small"
                            sx={{
                              bgcolor: "#e3f2fd",
                              color: "#1976d2",
                              fontWeight: 600,
                            }}
                          />
                          <Chip
                            label="Cập nhật"
                            size="small"
                            sx={{
                              bgcolor: "warning.main",
                              color: "white",
                              fontWeight: 600,
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        <strong>Đại diện:</strong> {edu.representativeName} (
                        {edu.position})
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        <strong>ĐKKD:</strong> {edu.businessRegistrationNumber}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        <strong>Năm thành lập:</strong> {edu.establishedYear}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 1,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "normal",
                          maxWidth: "100%",
                          lineHeight: 1.4,
                          minHeight: "2.8em", // Fixed height for 2 lines to ensure consistent card height
                        }}
                        title={edu.address}
                      >
                        <strong>Địa chỉ:</strong> {edu.address}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ 
                          mb: 2,
                          fontStyle: "italic",
                          fontSize: "0.75rem",
                          color: "#757575"
                        }}
                        title={`Cập nhật lúc: ${formatDateToVietnamTime(eduUpdate.updatedAt)}`}
                      >
                        <strong>Cập nhật:</strong> {getRelativeTime(eduUpdate.updatedAt)}
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        mt: "auto",
                        borderRadius: 2,
                        textTransform: "none",
                        background:
                          "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)",
                        fontWeight: 600,
                        py: 1.5,
                      }}
                      onClick={() => {
                        setSelectedUpdate({
                          oldData: edu,
                          newData: eduUpdate,
                        });
                        setOpenUpdateDialog(true);
                      }}
                    >
                      Xem chi tiết
                    </Button>
                  </CardContent>
                </Card>
              );
            }
            return null;
          })}
        </Box>
      ) : (
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 3,
            background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          }}
        >
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            {updateSearchTerm || updateDateSort !== "oldest"
              ? "Không tìm thấy kết quả"
              : "Không có yêu cầu nào"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {updateSearchTerm || updateDateSort !== "oldest"
              ? "Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm"
              : "Hiện tại không có yêu cầu cập nhật thông tin cơ sở giáo dục nào cần xử lý."}
          </Typography>
          {(updateSearchTerm || updateDateSort !== "oldest") && (
            <Button
              onClick={clearUpdateFilters}
              sx={{ mt: 2, textTransform: "none" }}
              variant="outlined"
            >
              Xóa bộ lọc
            </Button>
          )}
        </Paper>
      )}

      {/* Dialog */}
      <ApproveInstitutionUpdateDialog
        open={openUpdateDialog}
        onClose={() => setOpenUpdateDialog(false)}
        oldData={selectedUpdate?.oldData}
        newData={selectedUpdate?.newData}
      />
    </Box>
  );
};

export default UpdateInstitutionTab;
