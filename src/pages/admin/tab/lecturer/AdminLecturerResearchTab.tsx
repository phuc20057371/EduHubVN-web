import React, { useState, useMemo } from "react";
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
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import DateRange from "@mui/icons-material/DateRange";
import ApproveResearchProjectCreateDialog from "../../../../components/admin-dialog/admin-lecturer-dialog/ApproveResearchProjectCreateDialog";
import ApproveResearchProjectUpdateDialog from "../../../../components/admin-dialog/admin-lecturer-dialog/ApproveResearchProjectUpdateDialog";
import { getAcademicRank, getProjectType, getScale } from "../../../../utils/ChangeText";

interface AdminLecturerResearchTabProps {
  lecturerRequestsResearch: any[];
}

const AdminLecturerResearchTab: React.FC<AdminLecturerResearchTabProps> = ({
  lecturerRequestsResearch,
}) => {
  // Filter state management
  const [researchSearchTerm, setResearchSearchTerm] = useState("");
  const [researchActionFilter, setResearchActionFilter] = useState("");
  const [researchDateSort, setResearchDateSort] = useState("oldest");

  // Filtered data using useMemo
  const filteredResearchList = useMemo(() => {
    if (!Array.isArray(lecturerRequestsResearch)) {
      return [];
    }
    let filtered = lecturerRequestsResearch;
    if (researchSearchTerm) {
      filtered = filtered.filter((item: any) => {
        const searchTerm = researchSearchTerm.toLowerCase();
        const lecturerMatch = item.lecturerInfo?.fullName
          ?.toLowerCase()
          .includes(searchTerm);
        const idMatch =
          item.content?.id?.toString().includes(researchSearchTerm) ||
          item.content?.original?.id?.toString().includes(researchSearchTerm);
        let contentMatch = false;
        if (item.content && !item.content.original) {
          contentMatch =
            item.content.name?.toLowerCase().includes(searchTerm) ||
            item.content.title?.toLowerCase().includes(searchTerm) ||
            item.content.category?.toLowerCase().includes(searchTerm) ||
            item.content.level?.toLowerCase().includes(searchTerm);
        }
        if (item.content?.original) {
          contentMatch =
            contentMatch ||
            item.content.original.name?.toLowerCase().includes(searchTerm) ||
            item.content.original.title?.toLowerCase().includes(searchTerm) ||
            item.content.original.category
              ?.toLowerCase()
              .includes(searchTerm) ||
            item.content.original.level?.toLowerCase().includes(searchTerm);
        }
        return lecturerMatch || idMatch || contentMatch;
      });
    }
    if (researchActionFilter) {
      filtered = filtered.filter(
        (item: any) => item.label === researchActionFilter,
      );
    }
    filtered = [...filtered].sort((a: any, b: any) => {
      const dateA = new Date(
        a.date || a.content?.updatedAt || a.content?.createdAt || 0,
      );
      const dateB = new Date(
        b.date || b.content?.updatedAt || b.content?.createdAt || 0,
      );

      if (researchDateSort === "oldest") {
        return dateA.getTime() - dateB.getTime();
      } else {
        return dateB.getTime() - dateA.getTime();
      }
    });
    return filtered;
  }, [
    lecturerRequestsResearch,
    researchSearchTerm,
    researchActionFilter,
    researchDateSort,
  ]);
  const [selectedResearch, setSelectedResearch] = useState<any>(null);
  const [openResearchProjectCreateDialog, setOpenResearchProjectCreateDialog] =
    useState(false);
  const [openResearchProjectUpdateDialog, setOpenResearchProjectUpdateDialog] =
    useState(false);

  const handleResearchItemClick = (item: any) => {
    setSelectedResearch(item);
    if (item.label === "Create") {
      setOpenResearchProjectCreateDialog(true);
    } else {
      setOpenResearchProjectUpdateDialog(true);
    }
  };

  const handleDialogClose = (dialogType: string) => {
    switch (dialogType) {
      case "ResearchProjectCreate":
        setOpenResearchProjectCreateDialog(false);
        break;
      case "ResearchProjectUpdate":
        setOpenResearchProjectUpdateDialog(false);
        break;
      default:
        break;
    }
    setSelectedResearch(null);
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
                bgcolor: "primary.main",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                width: 56,
                height: 56,
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                🔬
              </Typography>
            </Avatar>
            <Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, }}
              >
                Yêu cầu nghiên cứu khoa học
              </Typography>
              <Typography variant="body2" >
                {researchSearchTerm || researchActionFilter
                  ? `Đã lọc ${filteredResearchList?.length || 0} yêu cầu`
                  : `Tổng cộng ${filteredResearchList?.length || 0} yêu cầu nghiên cứu khoa học`}
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
                value={researchDateSort}
                label="Sắp xếp theo ngày"
                onChange={(e) => setResearchDateSort(e.target.value)}
                sx={{
                  
                  borderRadius: 1,
                }}
              >
                <MenuItem value="oldest">Cũ nhất trước</MenuItem>
                <MenuItem value="newest">Mới nhất trước</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ minWidth: 180, flex: "0 0 auto" }}>
            <FormControl fullWidth size="small">
              <InputLabel>Hành động</InputLabel>
              <Select
                value={researchActionFilter}
                label="Hành động"
                onChange={(e) => setResearchActionFilter(e.target.value)}
                sx={{
                 
                  borderRadius: 1,
                }}
              >
                <MenuItem value="">
                  <em>Tất cả</em>
                </MenuItem>
                <MenuItem value="Create">Tạo mới</MenuItem>
                <MenuItem value="Update">Cập nhật</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ flex: "1 1 300px", minWidth: 300 }}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="🔍 Theo ID, tên giảng viên, tên nghiên cứu..."
              value={researchSearchTerm}
              onChange={(e) => setResearchSearchTerm(e.target.value)}
              sx={{
                
                borderRadius: 1,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon  />
                  </InputAdornment>
                ),
                endAdornment: researchSearchTerm && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setResearchSearchTerm("")}
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
        {(researchSearchTerm ||
          researchDateSort !== "oldest" ||
          researchActionFilter) && (
          <Box
            sx={{
              mt: 2,
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" sx={{ mr: 1 }}>
              Bộ lọc đang áp dụng:
            </Typography>

            {researchSearchTerm && (
              <Chip
                label={`Tìm kiếm: "${researchSearchTerm}"`}
                size="small"
                onDelete={() => setResearchSearchTerm("")}
                color="primary"
                variant="outlined"
              />
            )}

            {researchActionFilter && (
              <Chip
                label={`Hành động: ${researchActionFilter === "Create" ? "Tạo mới" : "Cập nhật"}`}
                size="small"
                onDelete={() => setResearchActionFilter("")}
                color="info"
                variant="outlined"
              />
            )}

            {researchDateSort !== "oldest" && (
              <Chip
                label={`Sắp xếp: ${researchDateSort === "newest" ? "Mới nhất trước" : "Cũ nhất trước"}`}
                size="small"
                onDelete={() => setResearchDateSort("oldest")}
                color="default"
                variant="outlined"
                icon={<DateRange />}
              />
            )}

            <Button
              size="small"
              onClick={() => {
                setResearchSearchTerm("");
                setResearchDateSort("oldest");
                setResearchActionFilter("");
              }}
              sx={{ ml: 1, textTransform: "none" }}
            >
              Xóa tất cả
            </Button>
          </Box>
        )}
      </Paper>

      {filteredResearchList && filteredResearchList.length > 0 ? (
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
          {filteredResearchList.map((item: any, index: number) => {
            const contentData =
              item.label === "Update" ? item.content?.original : item.content;

            return (
              <Card
                key={`research-${item.content?.id}-${item.label}-${index}`}
                sx={{
                  transition: "all 0.3s ease",
                  border: "2px solid",
                  borderColor:
                    item.label === "Create" ? "success.light" : "warning.light",
                  borderRadius: 1,
                  height: "fit-content",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                    borderColor:
                      item.label === "Create" ? "success.main" : "warning.main",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2.5,
                    }}
                  >
                    {/* RESEARCH INFORMATION - TOP */}
                    <Box sx={{ pb: 1.5, borderBottom: "1px solid #e0e0e0" }}>
                      <Box sx={{ display: "flex", gap: 0.5, mb: 1.5 }}>
                        <Chip
                          label={getProjectType(contentData?.projectType) || "Không xác định"}
                          size="small"
                          variant="filled"
                          color="primary"
                          sx={{ fontSize: "0.7rem", height: 22 }}
                        />
                        <Chip
                          label={item.label === "Create" ? "Tạo mới" : "Cập nhật"}
                          size="small"
                          color={
                            item.label === "Create" ? "success" : "warning"
                          }
                          sx={{ fontSize: "0.7rem", height: 22 }}
                        />
                      </Box>

                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                        
                          mb: 1.5,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          lineHeight: 1.2,
                          minHeight: "2.4em",
                        }}
                      >
                        {contentData?.name || contentData?.title || "Không có tên"}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontWeight: 600, minWidth: "80px" }}
                          >
                            Lĩnh vực:
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 500,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              flex: 1,
                              textAlign: "right",
                            }}
                          >
                            {contentData?.researchArea || "Không có thông tin"}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontWeight: 600, minWidth: "80px" }}
                          >
                            Quy mô:
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 500,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              flex: 1,
                              textAlign: "right",
                            }}
                          >
                            {getScale(contentData?.scale) || "Không có thông tin"}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* LECTURER INFORMATION - MIDDLE */}
                    <Box sx={{ pb: 1.5, borderBottom: "1px solid #e0e0e0" }}>
                     
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Avatar
                          src={item.lecturerInfo?.avatarUrl || ""}
                          sx={{
                            bgcolor:
                              item.label === "Create"
                                ? "success.main"
                                : "warning.main",
                            width: 48,
                            height: 48,
                            fontSize: "1.1rem",
                            fontWeight: 700,
                          }}
                        >
                          {item.lecturerInfo?.fullName?.charAt(0)}
                        </Avatar>

                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 600,
                              color: "text.primary",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item.lecturerInfo?.fullName || "Không có tên"}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {getAcademicRank(item.lecturerInfo?.academicRank) || "Không có"}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* TIME INFORMATION - BOTTOM */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontWeight: 600 }}
                      >
                        Thời gian cập nhật
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          fontSize: "0.8rem",
                          color: "text.secondary",
                          fontStyle: "italic",
                        }}
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
                            return `${diffInHours} giờ trước`;
                          } else {
                            const diffInDays = Math.floor(diffInHours / 24);
                            return `${diffInDays} ngày trước`;
                          }
                        })()}
                      </Typography>

                      <Button
                        variant="contained"
                        color={item.label === "Create" ? "success" : "warning"}
                        size="medium"
                        fullWidth
                        sx={{
                          mt: 1.5,
                          py: 1.2,
                          fontWeight: 600,
                          textTransform: "none",
                          borderRadius: 1,
                          fontSize: "0.85rem",
                        }}
                        onClick={() => handleResearchItemClick(item)}
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
            Hiện tại không có yêu cầu nghiên cứu khoa học nào cần xử lý.
          </Typography>
        </Paper>
      )}

      {openResearchProjectCreateDialog && (
        <ApproveResearchProjectCreateDialog
          open={openResearchProjectCreateDialog}
          data={selectedResearch}
          onClose={() => handleDialogClose("ResearchProjectCreate")}
        />
      )}
      {openResearchProjectUpdateDialog && (
        <ApproveResearchProjectUpdateDialog
          open={openResearchProjectUpdateDialog}
          data={selectedResearch}
          onClose={() => handleDialogClose("ResearchProjectUpdate")}
        />
      )}
    </>
  );
};

export default AdminLecturerResearchTab;
