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
import ApproveDegreeCreateDialog from "../../../../components/admin-dialog/admin-lecturer-dialog/ApproveDegreeCreateDialog";
import ApproveDegreeUpdateDialog from "../../../../components/admin-dialog/admin-lecturer-dialog/ApproveDegreeUpdateDialog";
import ApproveCertificationUpdateDialog from "../../../../components/admin-dialog/admin-lecturer-dialog/ApproveCertificationUpdateDialog";
import ApproveCertificationCreateDialog from "../../../../components/admin-dialog/admin-lecturer-dialog/ApproveCertificationCreateDialog";
import { getAcademicRank } from "../../../../utils/ChangeText";
import type { LecturerRequest } from "../../../../types/LecturerRequest";

interface AdminLecturerDegreeTabProps {
  lecturerRequestsDGCC: LecturerRequest[];
}

const AdminLecturerDegreeTab: React.FC<AdminLecturerDegreeTabProps> =
  React.memo(({ lecturerRequestsDGCC }) => {
    // Local state for filters
    const [degreeSearchTerm, setDegreeSearchTerm] = useState("");
    const [degreeTypeFilter, setDegreeTypeFilter] = useState("");
    const [degreeActionFilter, setDegreeActionFilter] = useState("");
    const [degreeDateSort, setDegreeDateSort] = useState("oldest");

    const [selectedDegreeItem, setSelectedDegreeItem] = useState<any>(null);
    const [openDegreeDialog, setOpenDegreeDialog] = useState(false);
    const [openDegreeUpdateDialog, setOpenDegreeUpdateDialog] = useState(false);
    const [openCertificationDialog, setOpenCertificationDialog] =
      useState(false);
    const [openCertificationUpdateDialog, setOpenCertificationUpdateDialog] =
      useState(false);

    // Filtered data logic
    const filteredDegreeList = React.useMemo(() => {
      if (!Array.isArray(lecturerRequestsDGCC)) {
        return [];
      }

      let filtered = lecturerRequestsDGCC;

      if (degreeSearchTerm) {
        filtered = filtered.filter((item: any) => {
          const searchTerm = degreeSearchTerm.toLowerCase();
          const lecturerMatch =
            item.lecturerInfo?.fullName?.toLowerCase().includes(searchTerm) ||
            item.lecturerInfo?.id?.toString().includes(degreeSearchTerm);
          const idMatch =
            item.id?.toString().includes(degreeSearchTerm) ||
            item.content?.referenceId?.toString().includes(degreeSearchTerm) ||
            item.content?.original?.referenceId
              ?.toString()
              .includes(degreeSearchTerm) ||
            item.content?.update?.referenceId
              ?.toString()
              .includes(degreeSearchTerm) ||
            item.lecturerInfo?.id?.toString().includes(degreeSearchTerm) ||
            item.content?.id?.toString().includes(degreeSearchTerm) ||
            item.content?.original?.id?.toString().includes(degreeSearchTerm) ||
            item.content?.update?.id?.toString().includes(degreeSearchTerm);
          let contentMatch = false;
          if (item.content && !item.content.original && !item.content.update) {
            contentMatch =
              item.content.name?.toLowerCase().includes(searchTerm) ||
              item.content.title?.toLowerCase().includes(searchTerm) ||
              item.content.description?.toLowerCase().includes(searchTerm) ||
              item.content.major?.toLowerCase().includes(searchTerm) ||
              item.content.institution?.toLowerCase().includes(searchTerm) ||
              item.content.level?.toLowerCase().includes(searchTerm) ||
              item.content.specialization?.toLowerCase().includes(searchTerm);
          }
          if (item.content?.original) {
            contentMatch =
              contentMatch ||
              item.content.original.name?.toLowerCase().includes(searchTerm) ||
              item.content.original.title?.toLowerCase().includes(searchTerm) ||
              item.content.original.description
                ?.toLowerCase()
                .includes(searchTerm) ||
              item.content.original.major?.toLowerCase().includes(searchTerm) ||
              item.content.original.institution
                ?.toLowerCase()
                .includes(searchTerm) ||
              item.content.original.level?.toLowerCase().includes(searchTerm) ||
              item.content.original.specialization
                ?.toLowerCase()
                .includes(searchTerm);
          }
          if (item.content?.update) {
            contentMatch =
              contentMatch ||
              item.content.update.name?.toLowerCase().includes(searchTerm) ||
              item.content.update.title?.toLowerCase().includes(searchTerm) ||
              item.content.update.description
                ?.toLowerCase()
                .includes(searchTerm) ||
              item.content.update.major?.toLowerCase().includes(searchTerm) ||
              item.content.update.institution
                ?.toLowerCase()
                .includes(searchTerm) ||
              item.content.update.level?.toLowerCase().includes(searchTerm) ||
              item.content.update.specialization
                ?.toLowerCase()
                .includes(searchTerm);
          }
          return lecturerMatch || idMatch || contentMatch;
        });
      }
      if (degreeTypeFilter) {
        filtered = filtered.filter(
          (item: any) => item.type === degreeTypeFilter,
        );
      }
      if (degreeActionFilter) {
        filtered = filtered.filter(
          (item: any) => item.label === degreeActionFilter,
        );
      }
      filtered = [...filtered].sort((a: any, b: any) => {
        const dateA = new Date(a.date || 0);
        const dateB = new Date(b.date || 0);

        if (degreeDateSort === "oldest") {
          return dateA.getTime() - dateB.getTime();
        } else {
          return dateB.getTime() - dateA.getTime();
        }
      });
      return filtered;
    }, [
      lecturerRequestsDGCC,
      degreeSearchTerm,
      degreeTypeFilter,
      degreeActionFilter,
      degreeDateSort,
    ]);

    // Ensure filteredDegreeList is always an array to prevent conditional rendering issues
    const safeFilteredDegreeList = React.useMemo(() => {
      return Array.isArray(filteredDegreeList) ? filteredDegreeList : [];
    }, [filteredDegreeList]);

    const handleDegreeItemClick = React.useCallback((item: any) => {
      setSelectedDegreeItem(item);

      if (item.type === "BC") {
        if (item.label === "Create") {
          setOpenDegreeDialog(true);
        } else if (item.label === "Update") {
          setOpenDegreeUpdateDialog(true);
        }
      } else if (item.type === "CC") {
        if (item.label === "Create") {
          setOpenCertificationDialog(true);
          setOpenCertificationDialog(true);
        } else if (item.label === "Update") {
          setOpenCertificationUpdateDialog(true);
        }
      }
    }, []);

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
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  width: 56,
                  height: 56,
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  🎓
                </Typography>
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                  Yêu cầu chứng chỉ và bằng cấp
                </Typography>
                <Typography variant="body2">
                  {degreeSearchTerm || degreeTypeFilter
                    ? `Đã lọc ${safeFilteredDegreeList?.length || 0} yêu cầu`
                    : `Tổng cộng ${safeFilteredDegreeList?.length || 0} yêu cầu chứng chỉ và bằng cấp`}
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
                  
                    borderRadius: 1,
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

            <Box sx={{ minWidth: 150, flex: "0 0 auto" }}>
              <FormControl fullWidth size="small">
                <InputLabel>Hành động</InputLabel>
                <Select
                  value={degreeActionFilter}
                  label="Hành động"
                  onChange={(e) => setDegreeActionFilter(e.target.value)}
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

            <Box sx={{ minWidth: 180, flex: "0 0 auto" }}>
              <FormControl fullWidth size="small">
                <InputLabel>Sắp xếp theo ngày</InputLabel>
                <Select
                  value={degreeDateSort}
                  label="Sắp xếp theo ngày"
                  onChange={(e) => setDegreeDateSort(e.target.value)}
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
                placeholder="🔍 Theo ID, tên giảng viên, tên bằng cấp/chứng chỉ, chuyên ngành..."
                value={degreeSearchTerm}
                onChange={(e) => setDegreeSearchTerm(e.target.value)}
                sx={{
                
                  borderRadius: 1,
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
            degreeActionFilter ||
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

              {degreeActionFilter && (
                <Chip
                  label={`Hành động: ${degreeActionFilter === "Create" ? "Tạo mới" : "Cập nhật"}`}
                  size="small"
                  onDelete={() => setDegreeActionFilter("")}
                  color="info"
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
                  setDegreeActionFilter("");
                  setDegreeDateSort("oldest");
                }}
                sx={{ ml: 1, textTransform: "none" }}
              >
                Xóa tất cả
              </Button>
            </Box>
          )}
        </Paper>

        {safeFilteredDegreeList && safeFilteredDegreeList.length > 0 ? (
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
            {safeFilteredDegreeList.map((item: any, index: number) => {
              const contentData =
                item.label === "Update" ? item.content?.original : item.content;

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
                    borderRadius: 1,
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
                        gap: 2.5,
                      }}
                    >
                      {/* DEGREE/CERTIFICATE INFORMATION - TOP */}
                      <Box sx={{ pb: 1.5, borderBottom: "1px solid #e0e0e0" }}>
                        <Box sx={{ display: "flex", gap: 0.5, mb: 1.5 }}>
                          <Chip
                            label={
                              item.type === "BC" ? "Bằng cấp" : "Chứng chỉ"
                            }
                            size="small"
                            variant="filled"
                            color={item.type === "BC" ? "primary" : "secondary"}
                            sx={{ fontSize: "0.7rem", height: 22 }}
                          />
                          <Chip
                            label={
                              item.label === "Create" ? "Tạo mới" : "Cập nhật"
                            }
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
                            color: "text.primary",
                            mb: 1.5,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            lineHeight: 1.2,
                            minHeight: "2.4em", // Ensure consistent height for 2 lines
                          }}
                        >
                          {contentData?.name || "Không có tên"}
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                          }}
                        >
                          {item.type === "BC" ? (
                            <>
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
                                  Chuyên ngành:
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
                                  {contentData?.major || "Không có"}
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
                                  Trình độ:
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 500, textAlign: "right" }}
                                >
                                  {contentData?.level || "Không có"}
                                </Typography>
                              </Box>
                            </>
                          ) : (
                            <>
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
                                  Trình độ
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
                                  {contentData?.level || "Không có"}
                                </Typography>
                              </Box>
                            </>
                          )}
                        </Box>
                      </Box>

                      {/* LECTURER INFORMATION - MIDDLE */}
                      <Box sx={{ pb: 1.5, borderBottom: "1px solid #e0e0e0" }}>
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
                              {getAcademicRank(
                                item.lecturerInfo?.academicRank,
                              ) || "Không có"}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      {/* TIME INFORMATION - BOTTOM */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                        }}
                      >
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
                          color={
                            item.label === "Create" ? "success" : "warning"
                          }
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
              Hiện tại không có yêu cầu chứng chỉ/bằng cấp nào cần xử lý.
            </Typography>
          </Paper>
        )}

        {/* Dialogs */}
        <ApproveDegreeCreateDialog
          open={openDegreeDialog}
          onClose={() => setOpenDegreeDialog(false)}
          data={selectedDegreeItem}
        />
        <ApproveDegreeUpdateDialog
          open={openDegreeUpdateDialog}
          onClose={() => setOpenDegreeUpdateDialog(false)}
          data={selectedDegreeItem}
        />
        <ApproveCertificationCreateDialog
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
  });

export default AdminLecturerDegreeTab;
