import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
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
import ApproveLecturerCreateDialog from "../../../../components/admin-dialog/admin-lecturer-dialog/ApproveLecturerCreateDialog";
import { getAcademicRank, getRelativeTime } from "../../../../utils/ChangeText";

interface AdminLecturerCreateTabProps {
  lecturerCreateList: any[];
}

const ITEMS_PER_PAGE = 20;

const AdminLecturerCreateTab: React.FC<AdminLecturerCreateTabProps> = ({
  lecturerCreateList,
}) => {
  // Local state for filters
  const [createSearchTerm, setCreateSearchTerm] = useState("");
  const [createDateSort, setCreateDateSort] = useState("oldest");

  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [selectedLecturerCreate, setSelectedLecturerCreate] =
    useState<any>(null);

  // Infinite scroll state
  const [displayedItems, setDisplayedItems] = useState(ITEMS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Filtered data logic
  const filteredCreateList = React.useMemo(() => {
    let filtered = lecturerCreateList;

    if (createSearchTerm) {
      filtered = filtered.filter(
        (item: any) =>
          item.lecturer.id?.toString().includes(createSearchTerm) ||
          item.lecturer.fullName
            ?.toLowerCase()
            .includes(createSearchTerm.toLowerCase()),
      );
    }

    filtered = [...filtered].sort((a: any, b: any) => {
      const dateA = new Date(a.lecturer.updatedAt || a.lecturer.createdAt || 0);
      const dateB = new Date(b.lecturer.updatedAt || b.lecturer.createdAt || 0);

      if (createDateSort === "oldest") {
        return dateA.getTime() - dateB.getTime();
      } else {
        return dateB.getTime() - dateA.getTime();
      }
    });

    return filtered;
  }, [lecturerCreateList, createSearchTerm, createDateSort]);

  // Reset displayed items when filters change
  useEffect(() => {
    setDisplayedItems(ITEMS_PER_PAGE);
  }, [createSearchTerm, createDateSort, lecturerCreateList]);

  // Get visible items
  const visibleItems = filteredCreateList.slice(0, displayedItems);
  const hasMore = displayedItems < filteredCreateList.length;

  // Load more items
  const loadMoreItems = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    // Simulate loading delay for better UX
    setTimeout(() => {
      setDisplayedItems(prev => prev + ITEMS_PER_PAGE);
      setIsLoadingMore(false);
    }, 300);
  }, [isLoadingMore, hasMore]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMoreItems();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoadingMore, loadMoreItems]);

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
              <Typography variant="h4" sx={{ color: "white", fontWeight: 700 }}>
                ✨
              </Typography>
            </Avatar>
            <Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, mb: 0.5 }}
              >
                Yêu cầu đăng ký giảng viên mới
              </Typography>
              <Typography variant="body2" >
                {createSearchTerm
                  ? `Đã lọc ${filteredCreateList?.length || 0} yêu cầu`
                  : `Tổng cộng ${filteredCreateList?.length || 0} yêu cầu đăng ký chờ phê duyệt`}
                {filteredCreateList.length > displayedItems && (
                  <span> • Đang hiển thị {displayedItems} yêu cầu</span>
                )}
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
                value={createDateSort}
                label="Sắp xếp theo ngày"
                onChange={(e) => setCreateDateSort(e.target.value)}
                sx={{     
                  borderRadius: 1,
                  fontSize: "1.25rem",
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
              value={createSearchTerm}
              onChange={(e) => setCreateSearchTerm(e.target.value)}
              sx={{
                borderRadius: 1,
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

        {/* Active Filters Display */}
        {(createSearchTerm || createDateSort !== "oldest") && (
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
                color="info"
                variant="outlined"
                icon={<DateRange />}
              />
            )}

            <Button
              size="small"
              onClick={() => {
                setCreateSearchTerm("");
                setCreateDateSort("oldest");
              }}
              sx={{ ml: 1, textTransform: "none" }}
            >
              Xóa tất cả
            </Button>
          </Box>
        )}
      </Paper>

      {filteredCreateList && filteredCreateList.length > 0 ? (
        <>
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
            {visibleItems.map((item: any) => (
              <Card
                key={item.lecturer.id}
                sx={{
                  transition: "all 0.3s ease",
                  border: "2px solid",
                  borderColor: "success.light",
                  borderRadius: 1,
                  height: "fit-content",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                    borderColor: "success.main",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        src={item.lecturer.avatarUrl}
                        sx={{
                          bgcolor: "success.main",
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
                            label="Mới"
                            size="small"
                            color="success"
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
                            {getRelativeTime(item.lecturer.updatedAt)}
                          </Typography>
                        </Box>
                      </Box>

                      <Button
                        variant="contained"
                        color="success"
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
                          setSelectedLecturerCreate(item);
                          setOpenCreateDialog(true);
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

          {/* Observer target for infinite scroll */}
          {hasMore && (
            <Box
              ref={observerTarget}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                py: 4,
              }}
            >
              {isLoadingMore && (
                <CircularProgress size={40} sx={{ color: "primary.main" }} />
              )}
            </Box>
          )}

          {/* Show total count when all items are loaded */}
          {!hasMore && visibleItems.length > ITEMS_PER_PAGE && (
            <Box
              sx={{
                textAlign: "center",
                py: 3,
                mt: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Đã hiển thị tất cả {filteredCreateList.length} yêu cầu
              </Typography>
            </Box>
          )}
        </>
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
            Hiện tại không có yêu cầu đăng ký giảng viên mới nào cần xử lý.
          </Typography>
        </Paper>
      )}

      <ApproveLecturerCreateDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        lecturer={selectedLecturerCreate?.lecturer || {}}
        degrees={selectedLecturerCreate?.degrees || []}
        certificates={selectedLecturerCreate?.certificates || []}
      />
    </>
  );
};

export default AdminLecturerCreateTab;
