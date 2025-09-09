import { useState, useMemo } from "react";
import {
  Box,
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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { Add, Domain } from "@mui/icons-material";
import { getRelativeTime } from "../../../../utils/ChangeText";

interface PartnerCreateTabProps {
  partnerPendingCreate: any[];
  onSelectPartner: (partner: any) => void;
}

const PartnerCreateTab: React.FC<PartnerCreateTabProps> = ({
  partnerPendingCreate,
  onSelectPartner,
}) => {
  // Filter states for Create tab
  const [createSearchTerm, setCreateSearchTerm] = useState("");
  const [createDateSort, setCreateDateSort] = useState("oldest");

  // Filtered and sorted create list with enhanced search
  const filteredCreateList = useMemo(() => {
    let filtered = partnerPendingCreate;

    // Filter by search term (search across multiple fields)
    if (createSearchTerm) {
      const searchLower = createSearchTerm.toLowerCase();
      filtered = filtered.filter((item: any) =>
        item.id?.toLowerCase().includes(searchLower) || // Search by id
        item.organizationName?.toLowerCase().includes(searchLower) ||
        item.representativeName?.toLowerCase().includes(searchLower) ||
        item.businessRegistrationNumber?.toLowerCase().includes(searchLower) ||
        item.address?.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower) ||
        item.phoneNumber?.includes(createSearchTerm) ||
        item.website?.toLowerCase().includes(searchLower) ||
        item.industry?.toLowerCase().includes(searchLower),
      );
    }

    // Sort by date with proper date handling
    filtered = [...filtered].sort((a: any, b: any) => {
      const dateA = new Date(a.updatedAt || a.createdAt || 0);
      const dateB = new Date(b.updatedAt || b.createdAt || 0);

      if (createDateSort === "oldest") {
        return dateA.getTime() - dateB.getTime();
      } else {
        return dateB.getTime() - dateA.getTime();
      }
    });

    return filtered;
  }, [partnerPendingCreate, createSearchTerm, createDateSort]);

  // Clear create tab filters
  const clearCreateFilters = () => {
    setCreateSearchTerm("");
    setCreateDateSort("oldest");
  };

  return (
    <Box>
      {/* Enhanced Header for Create Tab */}
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
              bgcolor: "success.main",
              background: "linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)",
              width: 56,
              height: 56,
            }}
          >
            <Add sx={{ fontSize: 28 }} />
          </Avatar>
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: "#2c3e50", mb: 0.5 }}
            >
              Yêu cầu đăng ký đối tác mới
            </Typography>
            <Typography variant="body2" sx={{ color: "#6c757d" }}>
              {(createSearchTerm || createDateSort !== "oldest")
                ? `Đã lọc ${filteredCreateList.length} yêu cầu`
                : `Tổng cộng ${filteredCreateList.length} yêu cầu chờ phê duyệt`}
            </Typography>
          </Box>
        </Box>

        {/* Enhanced Filter Controls for Create Tab */}
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
              <InputLabel id="create-date-sort-label">
                Sắp xếp theo ngày
              </InputLabel>
              <Select
                labelId="create-date-sort-label"
                value={createDateSort}
                label="Sắp xếp theo ngày"
                onChange={(e) => setCreateDateSort(e.target.value)}
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
              placeholder="🔍 Tìm kiếm theo tên, địa chỉ, đại diện, ĐKKD..."
              value={createSearchTerm}
              onChange={(e) => setCreateSearchTerm(e.target.value)}
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
                endAdornment: createSearchTerm && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setCreateSearchTerm("")}
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>

        {/* Filter summary for create tab */}
        {(createSearchTerm || createDateSort !== "oldest") && (
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
            {createSearchTerm && (
              <Chip
                label={`Tìm kiếm: "${createSearchTerm}"`}
                size="small"
                onDelete={() => setCreateSearchTerm("")}
                color="primary"
                variant="outlined"
              />
            )}
            {createDateSort !== "oldest" && (
              <Chip
                label={`Sắp xếp: ${createDateSort === "newest" ? "Mới nhất trước" : "Cũ nhất trước"}`}
                size="small"
                onDelete={() => setCreateDateSort("oldest")}
                color="secondary"
                variant="outlined"
              />
            )}
          </Box>
        )}
      </Paper>

      {/* Show no results message when filtered data is empty */}
      {filteredCreateList && filteredCreateList.length > 0 ? (
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
          {filteredCreateList.map((item: any, idx: number) => (
            <Card
              key={item.id || idx}
              sx={{
                height: "fit-content",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "all 0.3s ease",
                border: "2px solid",
                borderColor: "success.light",
                borderRadius: 3,
                background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 12px 40px rgba(76, 175, 80, 0.2)",
                  borderColor: "success.main",
                },
              }}
            >
              <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", flex: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar
                    src={item.logoUrl || ""}
                    sx={{
                      bgcolor: "success.main",
                      background: "linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)",
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
                        minHeight: "3.2em", // ~2 lines for default font size
                        lineHeight: 1.6,
                      }}
                      title={item.organizationName || ""}
                    >
                      {item.organizationName 
                        // ? (item.organizationName.length > 25
                        //   ? item.organizationName.slice(0, 25) + "…"
                        //   : item.organizationName)
                        // : "Chưa có tên"
                      }
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Chip
                        label="Đăng ký mới"
                        size="small"
                        sx={{
                          bgcolor: "success.main",
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
                    <strong>Đại diện:</strong> {item.representativeName} ({item.position})
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    <strong>Ngành nghề:</strong> {item.industry}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    <strong>ĐKKD:</strong> {item.businessRegistrationNumber}
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
                    title={item.address}
                  >
                    <strong>Địa chỉ:</strong> {item.address}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    <strong>Cập nhật:</strong>{" "}
                    {getRelativeTime(item.updatedAt)}
                  </Typography>
                </Box>

                <Box sx={{ flexGrow: 1 }} />
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    mt: "auto",
                    borderRadius: 2,
                    textTransform: "none",
                    background:
                      "linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)",
                    fontWeight: 600,
                    py: 1.5,
                  }}
                  onClick={() => onSelectPartner(item)}
                >
                  Xem chi tiết
                </Button>
              </CardContent>
            </Card>
          ))}
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
            {createSearchTerm || createDateSort !== "oldest"
              ? "Không tìm thấy kết quả"
              : "Không có yêu cầu nào"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {createSearchTerm || createDateSort !== "oldest"
              ? "Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm"
              : "Hiện tại không có yêu cầu đăng ký đối tác mới nào cần xử lý."}
          </Typography>
          {(createSearchTerm || createDateSort !== "oldest") && (
            <Button
              onClick={clearCreateFilters}
              sx={{ mt: 2, textTransform: "none" }}
              variant="outlined"
            >
              Xóa bộ lọc
            </Button>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default PartnerCreateTab;
