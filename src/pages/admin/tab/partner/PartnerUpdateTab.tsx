import { useState, useMemo } from "react";
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
  IconButton,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { Update, Domain } from "@mui/icons-material";
import { getRelativeTime } from "../../../../utils/ChangeText";

interface PartnerUpdateTabProps {
  partnerPendingUpdate: any[];
  onSelectUpdate: (update: { oldData: any; newData: any }) => void;
}

const PartnerUpdateTab: React.FC<PartnerUpdateTabProps> = ({
  partnerPendingUpdate,
  onSelectUpdate,
}) => {
  // Filter states for Update tab
  const [updateSearchTerm, setUpdateSearchTerm] = useState("");
  const [updateDateSort, setUpdateDateSort] = useState("oldest");

  // Filtered and sorted update list with enhanced search
  const filteredUpdateList = useMemo(() => {
    let filtered = partnerPendingUpdate;

    // Filter by search term (search across multiple fields)
    if (updateSearchTerm) {
      const searchLower = updateSearchTerm.toLowerCase();
      filtered = filtered.filter((item: any) => {
        const partner = item.partnerOrganization;
        const partnerUpdate = item.partnerOrganizationUpdate;

        return (
          partner?.id?.toString().includes(updateSearchTerm) ||
          partner?.organizationName?.toLowerCase().includes(searchLower) ||
          partner?.representativeName?.toLowerCase().includes(searchLower) ||
          partner?.businessRegistrationNumber
            ?.toLowerCase()
            .includes(searchLower) ||
          partner?.address?.toLowerCase().includes(searchLower) ||
          partner?.description?.toLowerCase().includes(searchLower) ||
          partner?.phoneNumber?.includes(updateSearchTerm) ||
          partner?.website?.toLowerCase().includes(searchLower) ||
          partnerUpdate?.organizationName
            ?.toLowerCase()
            .includes(searchLower) ||
          partnerUpdate?.representativeName
            ?.toLowerCase()
            .includes(searchLower) ||
          partnerUpdate?.address?.toLowerCase().includes(searchLower)
        );
      });
    }

    // Sort by date with proper date handling
    filtered = [...filtered].sort((a: any, b: any) => {
      const dateA = new Date(a.partnerOrganizationUpdate.updatedAt || a.partnerOrganizationUpdate.createdAt || 0);
      const dateB = new Date(b.partnerOrganizationUpdate.updatedAt || b.partnerOrganizationUpdate.createdAt || 0);

      if (updateDateSort === "oldest") {
        return dateA.getTime() - dateB.getTime();
      } else {
        return dateB.getTime() - dateA.getTime();
      }
    });

    return filtered;
  }, [partnerPendingUpdate, updateSearchTerm, updateDateSort]);

  // Clear update tab filters
  const clearUpdateFilters = () => {
    setUpdateSearchTerm("");
    setUpdateDateSort("oldest");
  };

  return (
    <>
      {/* Enhanced Header for Update Tab */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          borderRadius: 1,
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
              Yêu cầu cập nhật thông tin đối tác
            </Typography>
            <Typography variant="body2" sx={{ color: "#6c757d" }}>
              {updateSearchTerm || updateDateSort !== "oldest"
                ? `Đã lọc ${filteredUpdateList.length} yêu cầu`
                : `Tổng cộng ${filteredUpdateList.length} yêu cầu chờ phê duyệt`}
            </Typography>
          </Box>
        </Box>

        {/* Enhanced filter controls for Update Tab */}
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
                  borderRadius: 1,
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

      {/* Update cards with enhanced styling */}
      {filteredUpdateList && filteredUpdateList.length > 0 ? (
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
            const partner = item.partnerOrganization;
            const partnerUpdate = item.partnerOrganizationUpdate;
            if (partner && partnerUpdate) {
              return (
                <Card
                  key={item.id || idx}
                  sx={{
                    height: "fit-content",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "all 0.3s ease",
                    border: "2px solid",
                    borderColor: "warning.light",
                    borderRadius: 1,
                    background:
                      "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 12px 40px rgba(255, 152, 0, 0.2)",
                      borderColor: "warning.main",
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      p: 3,
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Avatar
                        src={partner.logoUrl || ""}
                        sx={{
                          bgcolor: "warning.main",
                          background:
                            "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)",
                          mr: 2,
                          width: 48,
                          height: 48,
                        }}
                      >
                        <Domain />
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
                            minHeight: "3.2em",
                            lineHeight: 1.6,
                          }}
                          title={partner.organizationName || ""}
                        >
                          {partner.organizationName}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1 }}>
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
                        <strong>Đại diện:</strong> {partner.representativeName}{" "}
                        ({partner.position})
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        <strong>Ngành nghề:</strong> {partner.industry}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        <strong>ĐKKD:</strong>{" "}
                        {partner.businessRegistrationNumber}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 1,
                          display: "-webkit-box",
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "normal",
                          maxWidth: "100%",
                        }}
                        title={partner.address}
                      >
                        <strong>Địa chỉ:</strong> {partner.address}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        <strong>Cập nhật:</strong>{" "}
                        {getRelativeTime(partnerUpdate.updatedAt)}
                      </Typography>
                    </Box>
                    <Box sx={{ flexGrow: 1 }} />
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        mt: "auto",
                        borderRadius: 1,
                        textTransform: "none",
                        background:
                          "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)",
                        fontWeight: 600,
                        py: 1.5,
                      }}
                      onClick={() => {
                        onSelectUpdate({
                          oldData: partner,
                          newData: partnerUpdate,
                        });
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
            borderRadius: 1,
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
              : "Hiện tại không có yêu cầu cập nhật đối tác nào cần xử lý."}
          </Typography>
          {(updateSearchTerm || updateDateSort !== "oldest") && (
            <Button onClick={clearUpdateFilters} sx={{ mt: 2 }}>
              Xóa bộ lọc
            </Button>
          )}
        </Paper>
      )}
    </>
  );
};

export default PartnerUpdateTab;
