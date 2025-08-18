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
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { DateRange } from "@mui/icons-material";
import ResearchProjectCreateDialog from "../../../../components/ResearchProjectCreateDialog";
import ResearchProjectUpdateDialog from "../../../../components/ResearchProjectUpdateDialog";

interface AdminLecturerResearchTabProps {
  filteredResearchList: any[];
  researchSearchTerm: string;
  setResearchSearchTerm: (value: string) => void;
  researchActionFilter: string;
  setResearchActionFilter: (value: string) => void;
  researchDateSort: string;
  setResearchDateSort: (value: string) => void;
}

const AdminLecturerResearchTab: React.FC<AdminLecturerResearchTabProps> = ({
  filteredResearchList,
  researchSearchTerm,
  setResearchSearchTerm,
  researchActionFilter,
  setResearchActionFilter,
  researchDateSort,
  setResearchDateSort,
}) => {
  const [selectedResearch, setSelectedResearch] = useState<any>(null);
  const [openResearchProjectCreateDialog, setOpenResearchProjectCreateDialog] =
    useState(false);
  const [openResearchProjectUpdateDialog, setOpenResearchProjectUpdateDialog] =
    useState(false);

  const handleResearchItemClick = (item: any) => {
    setSelectedResearch(item);
    console.log("Research project item clicked:", item);

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
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                width: 56,
                height: 56,
              }}
            >
              <Typography variant="h4" sx={{ color: "white", fontWeight: 700 }}>
                🔬
              </Typography>
            </Avatar>
            <Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: "#2c3e50", mb: 0.5 }}
              >
                Yêu cầu nghiên cứu khoa học
              </Typography>
              <Typography variant="body2" sx={{ color: "#6c757d" }}>
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
                  bgcolor: "white",
                  borderRadius: 2,
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
                  bgcolor: "white",
                  borderRadius: 2,
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
                bgcolor: "white",
                borderRadius: 2,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "primary.main" }} />
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
            <Typography variant="body2" sx={{ color: "#6c757d", mr: 1 }}>
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
                  borderRadius: 3,
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
                      gap: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        src={item.lecturerInfo?.avatarUrl || ""}
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
                            label="Nghiên cứu"
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: "0.7rem", height: 20 }}
                          />
                          <Chip
                            label={item.label}
                            size="small"
                            color={
                              item.label === "Create" ? "success" : "warning"
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
                          Tên nghiên cứu
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
                          {contentData?.name || contentData?.title || "Không có tên"}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontWeight: 600, mb: 0.5 }}
                        >
                          Mô tả
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {contentData?.description || "Không có mô tả"}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontWeight: 600, mb: 0.5 }}
                        >
                          Ngày tạo
                        </Typography>
                        <Typography variant="body2">
                          {contentData?.createdAt
                            ? new Date(contentData.createdAt).toLocaleDateString("vi-VN")
                            : "Không có"}
                        </Typography>
                      </Box>

                      <Button
                        variant="contained"
                        color={item.label === "Create" ? "success" : "warning"}
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
            Hiện tại không có yêu cầu nghiên cứu khoa học nào cần xử lý.
          </Typography>
        </Paper>
      )}

      {openResearchProjectCreateDialog && (
        <ResearchProjectCreateDialog
          open={openResearchProjectCreateDialog}
          data={selectedResearch}
          onClose={() => handleDialogClose("ResearchProjectCreate")}
        />
      )}
      {openResearchProjectUpdateDialog && (
        <ResearchProjectUpdateDialog
          open={openResearchProjectUpdateDialog}
          data={selectedResearch}
          onClose={() => handleDialogClose("ResearchProjectUpdate")}
        />
      )}
    </>
  );
};

export default AdminLecturerResearchTab;
