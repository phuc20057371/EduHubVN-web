import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Divider,
  Avatar,
  Switch,
  FormControlLabel,
  Chip,
  Checkbox,
  Paper,
  MenuItem,
} from "@mui/material";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// SortableItem component for individual unit cards
interface SortableItemProps {
  id: string;
  children: React.ReactNode;
}

const SortableItem: React.FC<SortableItemProps> = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Box sx={{ position: "relative" }}>
        {/* Drag Handle */}
        <Box
          {...listeners}
          sx={{
            position: "absolute",
            top: 8,
            left: 8,
            width: 24,
            height: 24,
            cursor: "grab",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 1,
            backgroundColor: "rgba(0, 0, 0, 0.04)",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.08)",
            },
            "&:active": {
              cursor: "grabbing",
            },
            zIndex: 10,
          }}
        >
          <DragIndicatorIcon
            fontSize="small"
            sx={{ color: "text.secondary" }}
          />
        </Box>
        {children}
      </Box>
    </div>
  );
};
import {
  Close as CloseIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  DragIndicator as DragIndicatorIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import type {
  TrainingProgram,
  TrainingProgramUnit,
} from "../../types/TrainingProgram";
import type { Lecturer } from "../../types/Lecturer";
import { API } from "../../utils/Fetch";
import { getAcademicRank } from "../../utils/ChangeText";
import { toast } from "react-toastify";

interface AssignmentLecturerDialogProps {
  open: boolean;
  onClose: () => void;
  trainingProgram: TrainingProgram | null;
  onSave?: (units: TrainingProgramUnit[]) => Promise<void>;
}

interface UnitFormData {
  id?: string;
  lecturerId: string;
  title: string;
  description: string;
  durationSection: number;
  orderSection: number;
  lead: boolean;
  trialVideoUrl?: string;
}

const AssignmentLecturerDialog: React.FC<AssignmentLecturerDialogProps> = ({
  open,
  onClose,
  trainingProgram,
  onSave,
}) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [units, setUnits] = useState<TrainingProgramUnit[]>([]);
  const [isAddingUnit, setIsAddingUnit] = useState(false);
  const [editingUnitId, setEditingUnitId] = useState<string | null>(null);
  const [searchLecturer, setSearchLecturer] = useState("");
  const [selectedAcademicRank, setSelectedAcademicRank] = useState("");

  const [unitForm, setUnitForm] = useState<UnitFormData>({
    lecturerId: "",
    title: "",
    description: "",
    durationSection: 1,
    orderSection: 1,
    lead: false,
    trialVideoUrl: "",
  });

  // Load lecturers when dialog opens
  useEffect(() => {
    if (open) {
      fetchLecturers();
      if (trainingProgram?.units) {
        setUnits([...trainingProgram.units]);
      } else {
        setUnits([]);
      }
    }
  }, [open, trainingProgram]);

  const fetchLecturers = async () => {
    try {
      const response = await API.admin.getAllLecturers();
      if (response.data.success) {
        setLecturers(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching lecturers:", error);
    }
  };

  const resetForm = () => {
    setUnitForm({
      lecturerId: "",
      title: "",
      description: "",
      durationSection: 1,
      orderSection: units.length + 1,
      lead: false,
      trialVideoUrl: "",
    });
    setIsAddingUnit(false);
    setEditingUnitId(null);
  };

  const handleAddUnit = () => {
    setUnitForm({
      lecturerId: "",
      title: "",
      description: "",
      durationSection: 1,
      orderSection: units.length + 1,
      lead: false,
      trialVideoUrl: "",
    });
    setIsAddingUnit(true);
    setEditingUnitId(null);
  };

  const handleEditUnit = (unit: TrainingProgramUnit) => {
    setUnitForm({
      id: unit.id,
      lecturerId: unit.lecturer.id,
      title: unit.title,
      description: unit.description,
      durationSection: unit.durationSection,
      orderSection: unit.orderSection,
      lead: unit.lead || false,
      trialVideoUrl: unit.trialVideoUrl || "",
    });
    setEditingUnitId(unit.id);
    setIsAddingUnit(true);
  };

  const handleSaveUnit = async () => {
    if (!unitForm.lecturerId || !unitForm.title.trim()) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    const selectedLecturer = lecturers.find(
      (l) => l.id === unitForm.lecturerId,
    );
    if (!selectedLecturer) {
      alert("Không tìm thấy giảng viên được chọn");
      return;
    }

    const newUnit: TrainingProgramUnit = {
      id: unitForm.id || `unit_${Date.now()}`,
      lecturer: selectedLecturer,
      title: unitForm.title,
      description: unitForm.description,
      durationSection: unitForm.durationSection,
      orderSection: unitForm.orderSection,
      lead: unitForm.lead,
      trialVideoUrl: unitForm.trialVideoUrl || undefined,
    };

    if (editingUnitId) {
      // Update existing unit
      setUnits((prev) =>
        prev.map((unit) => (unit.id === editingUnitId ? newUnit : unit)),
      );
    } else {
      // Add new unit
      setUnits((prev) => [...prev, newUnit]);
    }

    resetForm();
  };

  const handleDeleteUnit = (unitId: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài học này?")) {
      setUnits((prev) => {
        const filteredUnits = prev.filter((unit) => unit.id !== unitId);

        // Reorder remaining units
        return filteredUnits.map((unit, index) => ({
          ...unit,
          orderSection: index + 1,
        }));
      });
    }
  };

  const handleSave = async () => {
    if (onSave) {
      try {
        setLoading(true);

        // Process units: set ID to null for newly created units (those with ID starting with "unit_")
        const processedUnits = units.map((unit) => ({
          ...unit,
          id: unit.id.startsWith("unit_") ? null : unit.id,
        })) as TrainingProgramUnit[];

        await onSave(processedUnits);
        onClose();
      } catch (error) {
        console.error("Error saving units:", error);
        toast.error("Đã có lỗi xảy ra khi lưu bài học.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle lead checkbox change - Allow multiple main lecturers
  const handleLeadChange = (unitId: string, lead: boolean) => {
    const currentUnit = units.find((u) => u.id === unitId);
    if (!currentUnit) return;

    setUnits((prev) =>
      prev.map((unit) => {
        if (unit.id === unitId) {
          return { ...unit, lead: lead };
        }
        return unit;
      }),
    );
  };

  // Handle drag and drop reorder
  // Handle drag and drop reordering
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setUnits((prev) => {
        const sortedUnits = [...prev].sort(
          (a, b) => a.orderSection - b.orderSection,
        );
        const oldIndex = sortedUnits.findIndex((unit) => unit.id === active.id);
        const newIndex = sortedUnits.findIndex((unit) => unit.id === over.id);

        const reorderedUnits = arrayMove(sortedUnits, oldIndex, newIndex);

        // Update orderSection based on new positions
        return reorderedUnits.map((unit, index) => ({
          ...unit,
          orderSection: index + 1,
        }));
      });
    }
  };

  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Filter lecturers based on search input, academic rank and APPROVED status
  const filteredLecturers = lecturers.filter((lecturer) => {
    const searchTerm = searchLecturer.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      lecturer.lecturerId?.toLowerCase().includes(searchTerm) ||
      lecturer.fullName.toLowerCase().includes(searchTerm) ||
      lecturer.jobField?.toLowerCase().includes(searchTerm) ||
      lecturer.specialization?.toLowerCase().includes(searchTerm);

    const matchesAcademicRank =
      !selectedAcademicRank || lecturer.academicRank === selectedAcademicRank;

    // Only show lecturers with APPROVED status
    const isApproved = lecturer.status === "APPROVED";

    return matchesSearch && matchesAcademicRank && isApproved;
  });

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 1,
          minHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          py: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            sx={{
              bgcolor: theme.palette.primary.contrastText,
              color: theme.palette.primary.main,
            }}
          >
            <SchoolIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Quản lý Bài học và phân công Giảng viên
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {trainingProgram?.trainingProgramId || "Chương trình đào tạo"} :{" "}
              {trainingProgram?.title || "Chương trình đào tạo"}
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={handleClose}
          sx={{
            color: theme.palette.primary.contrastText,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, overflow: "hidden" }}>
        <Box sx={{ display: "flex", height: "70vh" }}>
          {/* Left Panel - Unit List */}
          <Paper
            elevation={0}
            sx={{
              width: "30%",
              borderRight: `1px solid ${theme.palette.divider}`,
              overflow: "auto",
              p: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Danh sách Bài học ({units.length})
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddUnit}
                sx={{ borderRadius: 1 }}
              >
                Thêm bài học
              </Button>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {units.length === 0 ? (
              <Box
                sx={{
                  textAlign: "center",
                  py: 4,
                  color: "text.secondary",
                }}
              >
                <SchoolIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                <Typography variant="body1">Chưa có bài học nào</Typography>
                <Typography variant="body2">
                  Nhấn "Thêm bài học" để bắt đầu
                </Typography>
              </Box>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={units
                    .sort((a, b) => a.orderSection - b.orderSection)
                    .map((unit) => unit.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    {units
                      .sort((a, b) => a.orderSection - b.orderSection)
                      .map((unit, index) => (
                        <SortableItem key={unit.id} id={unit.id}>
                          <Paper
                            elevation={1}
                            onClick={() => handleEditUnit(unit)}
                            sx={{
                              p: 2,
                              pl: 5, // Add left padding for drag handle
                              border: `1px solid ${theme.palette.divider}`,
                              borderRadius: 1,
                              backgroundColor: theme.palette.background.paper,
                              cursor: "pointer",
                              "&:hover": {
                                backgroundColor: theme.palette.action.hover,
                                elevation: 2,
                              },
                              transition: "all 0.2s ease-in-out",
                            }}
                          >
                            {/* Header với số thứ tự và actions */}
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                mb: 2,
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Chip
                                  label={`Bài ${index + 1}`}
                                  size="small"
                                  color="primary"
                                  variant="filled"
                                />
                                {unit.lead && (
                                  <Chip
                                    label="Lead"
                                    size="small"
                                    color="secondary"
                                    variant="outlined"
                                  />
                                )}
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteUnit(unit.id);
                                  }}
                                  color="error"
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </Box>

                            {/* Thông tin bài học */}
                            <Box sx={{ mb: 2 }}>
                              <Typography
                                variant="h6"
                                sx={{
                                  fontWeight: 600,
                                  mb: 1,
                                  color: theme.palette.text.primary,
                                }}
                              >
                                {unit.title}
                              </Typography>

                              <Typography
                                variant="body2"
                                sx={{
                                  color: theme.palette.text.secondary,
                                  mb: 1,
                                  lineHeight: 1.5,
                                }}
                              >
                                {unit.description}
                              </Typography>

                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Chip
                                  label={`${unit.durationSection} giờ`}
                                  size="small"
                                  variant="outlined"
                                  color="info"
                                />
                              </Box>
                            </Box>

                            {/* Banner thông tin giảng viên */}
                            <Paper
                              elevation={0}
                              sx={{
                                p: 1.5,
                                backgroundColor:
                                  theme.palette.mode === "dark"
                                    ? "rgba(255, 255, 255, 0.05)"
                                    : "rgba(0, 0, 0, 0.02)",
                                border: `1px solid ${theme.palette.divider}`,
                                borderRadius: 1,
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                }}
                              >
                                <Avatar
                                  src={unit.lecturer.avatarUrl}
                                  sx={{
                                    width: 40,
                                    height: 40,
                                    border: `2px solid ${unit.lead ? theme.palette.warning.main : theme.palette.primary.light}`,
                                  }}
                                >
                                  <PersonIcon />
                                </Avatar>
                                <Box sx={{ flex: 1 }}>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                    }}
                                  >
                                    <Typography
                                      variant="subtitle2"
                                      sx={{
                                        fontWeight: 600,
                                        color: theme.palette.text.primary,
                                      }}
                                    >
                                      {unit.lecturer.fullName}
                                    </Typography>
                                    {unit.lead && (
                                      <Chip
                                        label="Chính"
                                        size="small"
                                        color="warning"
                                        variant="filled"
                                        sx={{ fontSize: "0.65rem", height: 20 }}
                                      />
                                    )}
                                  </Box>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: theme.palette.text.secondary,
                                      display: "block",
                                    }}
                                  >
                                    Mã: {unit.lecturer.lecturerId || "Chưa có"}
                                  </Typography>
                                </Box>
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 0.5,
                                  }}
                                >
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={unit.lead || false}
                                        onChange={(e) => {
                                          e.stopPropagation();
                                          handleLeadChange(
                                            unit.id,
                                            e.target.checked,
                                          );
                                        }}
                                        size="small"
                                      />
                                    }
                                    label="Giảng viên chính"
                                    labelPlacement="top"
                                    onClick={(e) => e.stopPropagation()}
                                    sx={{
                                      margin: 0,
                                      "& .MuiFormControlLabel-label": {
                                        fontSize: "0.7rem",
                                        color: theme.palette.text.secondary,
                                      },
                                    }}
                                  />
                                </Box>
                              </Box>
                            </Paper>
                          </Paper>
                        </SortableItem>
                      ))}
                  </Box>
                </SortableContext>
              </DndContext>
            )}
          </Paper>

          {/* Right Panel - Contains both Unit Form and Lecturer Selection */}
          <Box
            sx={{
              width: "70%",
              overflow: "auto",
              display: "flex",
              flexDirection: "row",
            }}
          >
            {/* Unit Form Section */}
            <Box
              sx={{
                width: isAddingUnit ? "60%" : "100%",
                borderRight: isAddingUnit
                  ? `1px solid ${theme.palette.divider}`
                  : "none",
                p: 3,
                backgroundColor: theme.palette.background.default,
                overflow: "auto",
              }}
            >
              {isAddingUnit ? (
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 3,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {editingUnitId ? "Chỉnh sửa Bài học" : "Thêm Bài học mới"}
                    </Typography>
                    <Button variant="outlined" onClick={resetForm}>
                      Hủy
                    </Button>
                  </Box>

                  <Divider sx={{ mb: 3 }} />

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <Box
                      sx={{ display: "flex", gap: 2, alignItems: "flex-end" }}
                    >
                      <TextField
                        fullWidth
                        label="Tiêu đề bài học *"
                        value={unitForm.title}
                        onChange={(e) =>
                          setUnitForm((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        sx={{ flex: 1 }}
                      />
                      <TextField
                        label="Thời lượng (giờ)"
                        type="number"
                        value={unitForm.durationSection}
                        onChange={(e) => {
                          const value = e.target.value;

                          // Chặn khi vượt quá 7 chữ số
                          if (value.length > 7) return;

                          setUnitForm((prev) => ({
                            ...prev,
                            durationSection: parseInt(value) || 1,
                          }));
                        }}
                        inputProps={{ min: 1 }}
                        sx={{ width: 150 }}
                      />
                    </Box>

                    <TextField
                      fullWidth
                      label="Mô tả bài học"
                      multiline
                      rows={3}
                      value={unitForm.description}
                      onChange={(e) =>
                        setUnitForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                    />

                    <TextField
                      fullWidth
                      label="URL Video dùng thử"
                      value={unitForm.trialVideoUrl || ""}
                      onChange={(e) =>
                        setUnitForm((prev) => ({
                          ...prev,
                          trialVideoUrl: e.target.value,
                        }))
                      }
                      placeholder="https://youtube.com/... hoặc https://vimeo.com/..."
                    />

                    {/* Selected Lecturer Display */}
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{ mb: 1, fontWeight: 600 }}
                      >
                        Giảng viên được chọn
                      </Typography>
                      {unitForm.lecturerId ? (
                        <>
                          {(() => {
                            const selectedLecturer = lecturers.find(
                              (l) => l.id === unitForm.lecturerId,
                            );
                            return selectedLecturer ? (
                              <Paper
                                elevation={0}
                                sx={{
                                  p: 2,
                                  border: `1px solid ${theme.palette.primary.main}`,
                                  borderRadius: 2,
                                  backgroundColor:
                                    theme.palette.primary.light + "10",
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                  }}
                                >
                                  <Avatar
                                    src={selectedLecturer.avatarUrl}
                                    sx={{
                                      width: 40,
                                      height: 40,
                                      border: `2px solid ${theme.palette.primary.main}`,
                                    }}
                                  >
                                    <PersonIcon />
                                  </Avatar>
                                  <Box sx={{ flex: 1 }}>
                                    <Typography
                                      variant="subtitle2"
                                      sx={{ fontWeight: 600 }}
                                    >
                                      {selectedLecturer.fullName}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      {selectedLecturer.experienceYears || 0}{" "}
                                      năm KN •{" "}
                                      {selectedLecturer.jobField || "Chưa có"}
                                    </Typography>

                                    <Box
                                      sx={{
                                        display: "flex",
                                        gap: 1,
                                        alignItems: "center",
                                      }}
                                    >
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                      >
                                        {selectedLecturer.lecturerId ||
                                          "Chưa có mã GV"}
                                      </Typography>
                                      {selectedLecturer.academicRank && (
                                        <Chip
                                          label={selectedLecturer.academicRank}
                                          size="small"
                                          variant="outlined"
                                          color="secondary"
                                          sx={{
                                            fontSize: "0.65rem",
                                            height: 18,
                                          }}
                                        />
                                      )}
                                    </Box>
                                  </Box>
                                  <FormControlLabel
                                    control={
                                      <Switch
                                        checked={unitForm.lead}
                                        onChange={(e) =>
                                          setUnitForm((prev) => ({
                                            ...prev,
                                            lead: e.target.checked,
                                          }))
                                        }
                                        size="small"
                                      />
                                    }
                                    label="Giảng viên chính"
                                    labelPlacement="top"
                                    sx={{
                                      margin: 0,
                                      "& .MuiFormControlLabel-label": {
                                        fontSize: "0.75rem",
                                        fontWeight: 500,
                                        textAlign: "center",
                                      },
                                    }}
                                  />
                                </Box>
                              </Paper>
                            ) : (
                              <Typography variant="body2" color="error">
                                Giảng viên không tồn tại
                              </Typography>
                            );
                          })()}
                        </>
                      ) : (
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            border: `1px dashed ${theme.palette.divider}`,
                            borderRadius: 2,
                            textAlign: "center",
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Chưa chọn giảng viên
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Vui lòng chọn giảng viên từ danh sách bên phải
                          </Typography>
                        </Paper>
                      )}
                    </Box>

                    <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                      <Button
                        variant="contained"
                        onClick={handleSaveUnit}
                        disabled={
                          !unitForm.lecturerId || !unitForm.title.trim()
                        }
                        sx={{ flex: 1 }}
                      >
                        {editingUnitId ? "Cập nhật" : "Thêm bài học"}
                      </Button>
                    </Box>
                  </Box>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    textAlign: "center",
                    color: "text.secondary",
                  }}
                >
                  <AddIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Thêm bài học mới
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 3 }}>
                    Nhấn "Thêm bài học" để tạo bài học mới cho chương trình đào
                    tạo
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddUnit}
                  >
                    Thêm bài học
                  </Button>
                </Box>
              )}
            </Box>

            {/* Lecturer Selection Section - Only show when adding/editing unit */}
            {isAddingUnit && (
              <Box
                sx={{
                  width: "40%",
                  backgroundColor: theme.palette.background.paper,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Sticky Header and Search */}
                <Box
                  sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    backgroundColor: theme.palette.background.paper,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    p: 3,
                    pb: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Chọn Giảng viên
                  </Typography>

                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Tìm kiếm giảng viên"
                      placeholder="Nhập mã GV, tên hoặc chuyên môn..."
                      value={searchLecturer}
                      onChange={(e) => setSearchLecturer(e.target.value)}
                      sx={{ flex: 1 }}
                    />
                    <TextField
                      select
                      size="small"
                      label="Học hàm"
                      value={selectedAcademicRank}
                      onChange={(e) => setSelectedAcademicRank(e.target.value)}
                      sx={{ width: 150 }}
                    >
                      <MenuItem value="">Tất cả</MenuItem>
                      <MenuItem value="GS">Giáo sư</MenuItem>
                      <MenuItem value="PGS">Phó GS</MenuItem>
                      <MenuItem value="TS">Tiến sĩ</MenuItem>
                      <MenuItem value="THS">Thạc sĩ</MenuItem>
                      <MenuItem value="KS">Kỹ sư</MenuItem>
                      <MenuItem value="CN">Cử nhân</MenuItem>
                    </TextField>
                  </Box>

                  {/* Filter summary and count */}
                  <Box
                    sx={{
                      mb: 2,
                      p: 1,
                      backgroundColor: theme.palette.grey[50],
                      borderRadius: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                        }}
                      >
                        Bộ lọc đang áp dụng:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.primary.main,
                        }}
                      >
                        {filteredLecturers.length} /{" "}
                        {
                          lecturers.filter(
                            (lecturer) => lecturer.status === "APPROVED",
                          ).length
                        }{" "}
                        giảng viên
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      {searchLecturer && (
                        <Chip
                          label={`Tìm kiếm: "${searchLecturer}"`}
                          size="small"
                          variant="outlined"
                          onDelete={() => setSearchLecturer("")}
                          sx={{ fontSize: "0.75rem" }}
                        />
                      )}
                      {selectedAcademicRank && (
                        <Chip
                          label={`Học hàm: ${selectedAcademicRank}`}
                          size="small"
                          variant="outlined"
                          onDelete={() => setSelectedAcademicRank("")}
                          sx={{ fontSize: "0.75rem" }}
                        />
                      )}
                      {!searchLecturer && !selectedAcademicRank && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: theme.palette.text.secondary,
                            fontStyle: "italic",
                          }}
                        >
                          Không có bộ lọc nào được áp dụng
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>

                {/* Scrollable Content Area */}
                <Box
                  sx={{
                    flex: 1,
                    overflow: "auto",
                    p: 3,
                    pt: 0,
                  }}
                >
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    {filteredLecturers.length === 0 ? (
                      <Box
                        sx={{
                          textAlign: "center",
                          py: 4,
                          color: "text.secondary",
                        }}
                      >
                        <PersonIcon
                          sx={{ fontSize: 48, mb: 2, opacity: 0.5 }}
                        />
                        <Typography variant="body1">
                          {searchLecturer
                            ? "Không tìm thấy giảng viên phù hợp"
                            : "Chưa có giảng viên nào"}
                        </Typography>
                        <Typography variant="body2">
                          {searchLecturer
                            ? "Thử tìm kiếm với từ khóa khác"
                            : "Vui lòng thêm giảng viên vào hệ thống"}
                        </Typography>
                      </Box>
                    ) : (
                      filteredLecturers.map((lecturer) => (
                        <Paper
                          key={lecturer.id}
                          elevation={1}
                          sx={{
                            p: 2,
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: 2,
                            cursor: "pointer",
                            transition: "all 0.2s ease-in-out",
                            "&:hover": {
                              backgroundColor: theme.palette.action.hover,
                              elevation: 2,
                            },
                            ...(unitForm.lecturerId === lecturer.id && {
                              borderColor: theme.palette.primary.main,
                              backgroundColor:
                                theme.palette.primary.light + "10",
                            }),
                          }}
                          onClick={() =>
                            setUnitForm((prev) => ({
                              ...prev,
                              lecturerId: lecturer.id,
                            }))
                          }
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Avatar
                              src={lecturer.avatarUrl}
                              sx={{
                                width: 48,
                                height: 48,
                                ...(unitForm.lecturerId === lecturer.id && {
                                  border: `2px solid ${theme.palette.primary.main}`,
                                }),
                              }}
                            >
                              <PersonIcon />
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Typography
                                variant="subtitle1"
                                sx={{
                                  fontWeight: 600,
                                  color: theme.palette.text.primary,
                                  mb: 0.5,
                                }}
                              >
                                {lecturer.fullName}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: theme.palette.text.secondary,
                                  mb: 0.5,
                                }}
                              >
                                {lecturer.experienceYears || 0} năm KN •{" "}
                                {lecturer.jobField || "Chưa có"}
                              </Typography>

                              <Box
                                sx={{
                                  display: "flex",
                                  gap: 1,
                                  alignItems: "center",
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: theme.palette.text.secondary,
                                  }}
                                >
                                  {lecturer.lecturerId || "Chưa có mã GV"}
                                </Typography>
                                {lecturer.academicRank && (
                                  <Chip
                                    label={getAcademicRank(
                                      lecturer.academicRank,
                                    )}
                                    size="small"
                                    variant="outlined"
                                    color="secondary"
                                    sx={{
                                      fontSize: "0.65rem",
                                      height: 20,
                                    }}
                                  />
                                )}
                              </Box>
                            </Box>
                            {unitForm.lecturerId === lecturer.id && (
                              <Chip
                                label="Đã chọn"
                                size="small"
                                color="primary"
                                variant="filled"
                              />
                            )}
                          </Box>
                        </Paper>
                      ))
                    )}
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          backgroundColor: theme.palette.background.paper,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Button onClick={handleClose} disabled={loading}>
          Hủy
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading}
          sx={{ minWidth: 120 }}
        >
          {loading ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignmentLecturerDialog;
