import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  IconButton,
  Chip,
  Avatar,
  Card,
  CardContent,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
  Switch,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { vi } from "date-fns/locale";
import {
  Close as CloseIcon,
  School as SchoolIcon,
  ContentCopy as CopyIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import type {
  TrainingProgramReq,
  TrainingProgramRequest,
} from "../../types/TrainingProgram";
import type { Partner } from "../../types/Parner";
import { API } from "../../utils/Fetch";
import { toast } from "react-toastify";
import { validateTrainingProgramForm } from "../../utils/Validate";

interface TrainingProgramCreateDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (programData: TrainingProgramReq) => Promise<void>;
  partner: Partner | null;
  requestedProgram: TrainingProgramRequest | null;
}

const TrainingProgramCreateDialog: React.FC<
  TrainingProgramCreateDialogProps
> = ({ open, onClose, onSave, partner, requestedProgram }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [selectedBannerFile, setSelectedBannerFile] = useState<File | null>(
    null,
  );
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [selectedSyllabusFile, setSelectedSyllabusFile] = useState<File | null>(
    null,
  );
  const [isUploadingSyllabus, setIsUploadingSyllabus] = useState(false);
  const bannerInputRef = React.useRef<HTMLInputElement>(null);
  const syllabusInputRef = React.useRef<HTMLInputElement>(null);

  // Search training programs state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [allPrograms, setAllPrograms] = useState<any[]>([]);

  // Notification state
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  const [formData, setFormData] = useState<TrainingProgramReq>({
    title: "",
    subTitle: "",
    shortDescription: "",
    description: "",
    learningObjectives: "",
    targetAudience: "",
    requirements: "",
    learningOutcomes: "",
    programStatus: "REVIEW",
    programMode: "OFFLINE",
    programType: "SINGLE",
    startDate: new Date(),
    endDate: new Date(),
    durationHours: 0,
    durationSessions: 0,
    scheduleDetail: "",
    programLevel: "BEGINNER",
    maxStudents: 0,
    minStudents: 0,
    openingCondition: "",
    equipmentRequirement: "",
    classroomLink: "",
    scale: "",
    listedPrice: 0,
    internalPrice: 0,
    publicPrice: 0,
    priceVisible: false,
    bannerUrl: "",
    contentUrl: "",
    syllabusFileUrl: "",
    tags: [],
    completionCertificateType: "",
    certificateIssuer: "",
    trialVideoUrl: "",
    rating: null,

    trainingProgramRequest: requestedProgram,
    partnerOrganization: partner,
    user: null,
  });

  const handleFormChange = <K extends keyof TrainingProgramReq>(
    field: K,
    value: TrainingProgramReq[K],
  ) => {
    setFormData(
      (prev) =>
        ({
          ...prev,
          [field]: value,
        }) as TrainingProgramReq,
    );
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleBannerFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      // Validate file type (only images)
      if (!file.type.startsWith("image/")) {
        alert("Vui lòng chỉ chọn file hình ảnh (JPG, PNG, GIF, etc.)");
        return;
      }

      setSelectedBannerFile(file);

      // Auto upload file when selected
      setIsUploadingBanner(true);
      try {
        // TODO: Replace with actual API call
        const response = await API.user.uploadFileToServer(file);
        console.log("✅ File uploaded successfully:", response.data);
        setFormData((prev) => ({ ...prev, bannerUrl: response.data }));
      } catch (error: any) {
        console.error("❌ Error uploading banner:", error);
        alert("Tải lên banner không thành công");
        setSelectedBannerFile(null);
        setFormData((prev) => ({ ...prev, bannerUrl: "" }));
      } finally {
        setIsUploadingBanner(false);
      }
    }
  };

  const handleSyllabusFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      // Validate file type (only Word and PDF)
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!allowedTypes.includes(file.type)) {
        alert("Vui lòng chỉ chọn file Word (.doc, .docx) hoặc PDF (.pdf)");
        return;
      }

      setSelectedSyllabusFile(file);

      // Auto upload file when selected
      setIsUploadingSyllabus(true);
      try {
        // TODO: Replace with actual API call
        const response = await API.user.uploadFileToServer(file);
        console.log("✅ File uploaded successfully:", response.data);
        setFormData((prev) => ({ ...prev, syllabusFileUrl: response.data }));
      } catch (error: any) {
        console.error("❌ Error uploading syllabus:", error);
        alert("Tải lên file giáo trình không thành công");
        setSelectedSyllabusFile(null);
        setFormData((prev) => ({ ...prev, syllabusFileUrl: "" }));
      } finally {
        setIsUploadingSyllabus(false);
      }
    }
  };

  // Load all programs when dialog opens
  React.useEffect(() => {
    if (open) {
      loadAllPrograms();
    }
  }, [open]);

  // Pre-fill form data from requested program
  React.useEffect(() => {
    if (requestedProgram && open) {
      setFormData((prev) => ({
        ...prev,
        title: requestedProgram.title || "",
        description: requestedProgram.description || "",
        trainingProgramRequest: requestedProgram,
        partnerOrganization: partner,
      }));
    }
  }, [requestedProgram, partner, open]);

  const loadAllPrograms = async () => {
    try {
      const response = await API.program.getAllPrograms();
      if (response.data && response.data.data) {
        setAllPrograms(response.data.data);
      }
    } catch (error) {
      console.error("Error loading programs:", error);
    }
  };

  // Search training programs
  const handleSearchPrograms = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);

      // Filter programs from loaded data
      const filteredResults = allPrograms.filter(
        (program) =>
          program.trainingProgramId?.toString().includes(query) ||
          program.title?.toLowerCase().includes(query.toLowerCase()) ||
          program.shortDescription
            ?.toLowerCase()
            .includes(query.toLowerCase()) ||
          program.description?.toLowerCase().includes(query.toLowerCase()) ||
          (program.tags &&
            program.tags.some((tag: string) =>
              tag.toLowerCase().includes(query.toLowerCase()),
            )),
      );
    

      setSearchResults(filteredResults.filter((p) => {
        return p.status !== "ARCHIVED";
      }));
    } catch (error) {
      console.error("Error searching programs:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearchPrograms(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Copy data from selected program
  const handleCopyFromProgram = (program: any) => {
    setFormData((prev) => ({
      ...prev,
      // Basic Information
      title: program.title || "",
      subTitle: program.subTitle || "",
      shortDescription: program.shortDescription || "",
      description: program.description || "",
      learningObjectives: program.learningObjectives || "",
      targetAudience: program.targetAudience || "",
      requirements: program.requirements || "",
      learningOutcomes: program.learningOutcomes || "",

      // Program Settings
      programStatus: program.programStatus || "REVIEW",
      programMode: program.programMode || "OFFLINE",
      programType: program.programType || "SINGLE",

      // Time & Duration
      startDate: program.startDate ? new Date(program.startDate) : new Date(),
      endDate: program.endDate ? new Date(program.endDate) : new Date(),
      durationHours: program.durationHours || 0,
      durationSessions: program.durationSessions || 0,
      scheduleDetail: program.scheduleDetail || "",

      // Capacity & Requirements
      maxStudents: program.maxStudents || 0,
      minStudents: program.minStudents || 0,
      openingCondition: program.openingCondition || "",
      equipmentRequirement: program.equipmentRequirement || "",
      classroomLink: program.classroomLink || "",
      scale: program.scale || "",

      // Pricing
      listedPrice: program.listedPrice || 0,
      internalPrice: program.internalPrice || 0,
      publicPrice: program.publicPrice || 0,
      priceVisible: program.priceVisible || false,

      // Files & Media
      bannerUrl: program.bannerUrl || "",
      contentUrl: program.contentUrl || "",
      syllabusFileUrl: program.syllabusFileUrl || "",

      // Tags & Certificate
      tags: Array.isArray(program.tags) ? [...program.tags] : [],
      completionCertificateType: program.completionCertificateType || "",
      certificateIssuer: program.certificateIssuer || "",
      trialVideoUrl: program.trialVideoUrl || "",

      // Keep current values for these fields
      rating: null, // Don't copy rating
      trainingProgramRequest: null, // Don't copy request
      partnerOrganization: partner, // Keep current partner
      user: null, // Don't copy user
    }));

    // Show confirmation notification
    setNotification({
      open: true,
      message: `Đã sao chép thông tin từ chương trình: ${program.title}`,
      severity: "success",
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // // Validate required fields
      // if (!formData.title || !formData.programMode || !formData.programType) {
      //   throw new Error('Vui lòng điền đầy đủ thông tin bắt buộc');
      // }
      if (validateTrainingProgramForm(formData).success === false) {
        toast.error(
          validateTrainingProgramForm(formData).error ||
            "Vui lòng điền đầy đủ thông tin bắt buộc",
        );
        return;
      }

      const programData: TrainingProgramReq = {
        ...formData,
        partnerOrganization: partner || null,
        trainingProgramRequest: requestedProgram || null,
        user: null,
      };

      await onSave(programData);
      // Dialog will be closed by parent component after successful creation
    } catch (error) {
      console.error("Error creating training program:", error);
      // Handle error (show toast, etc.)
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form
    setFormData({
      title: "",
      subTitle: "",
      shortDescription: "",
      description: "",
      learningObjectives: "",
      targetAudience: "",
      requirements: "",
      learningOutcomes: "",
      programStatus: "REVIEW",
      programMode: "OFFLINE",
      programType: "SINGLE",
      startDate: new Date(),
      endDate: new Date(),
      durationHours: 0,
      durationSessions: 0,
      scheduleDetail: "",
      programLevel: "BEGINNER",
      maxStudents: 0,
      minStudents: 0,
      openingCondition: "",
      equipmentRequirement: "",
      classroomLink: "",
      scale: "",
      listedPrice: 0,
      internalPrice: 0,
      publicPrice: 0,
      priceVisible: false,
      bannerUrl: "",
      contentUrl: "",
      syllabusFileUrl: "",
      tags: [],
      completionCertificateType: "",
      certificateIssuer: "",
      trialVideoUrl: "",
      rating: null,

      trainingProgramRequest: null,
      partnerOrganization: partner,
      user: null,
    });
    // Reset banner upload states
    setSelectedBannerFile(null);
    setIsUploadingBanner(false);
    if (bannerInputRef.current) {
      bannerInputRef.current.value = "";
    }
    // Reset syllabus upload states
    setSelectedSyllabusFile(null);
    setIsUploadingSyllabus(false);
    if (syllabusInputRef.current) {
      syllabusInputRef.current.value = "";
    }
    setTagInput("");

    // Reset search state
    setSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);

    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      fullWidth
      fullScreen
      PaperProps={{
        sx: {
          width: "100vw",
          height: "100vh",
          maxWidth: "none",
          maxHeight: "none",
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
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Tạo mới Chương trình Đào tạo
          </Typography>
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
        <Box sx={{ display: "flex", height: "100%" }}>
          {/* Left Panel - Search Training Programs */}
          <Paper
            elevation={0}
            sx={{
              width: "40%",
              borderRight: `1px solid ${theme.palette.divider}`,
              overflow: "auto",
              p: 3,
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              🔍 Tìm kiếm Chương trình
            </Typography>

            <TextField
              fullWidth
              placeholder="Tìm kiếm chương trình đào tạo..."
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Bạn có thể tìm kiếm các chương trình đào tạo hiện có để tham khảo
              hoặc sao chép.
            </Typography>

            {/* Training program search results */}
            <Box sx={{ maxHeight: 400, overflow: "auto" }}>
              {isSearching ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    p: 3,
                  }}
                >
                  <CircularProgress size={24} />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    Đang tìm kiếm...
                  </Typography>
                </Box>
              ) : searchResults.length > 0 ? (
                searchResults.map((program, index) => (
                  <Card
                    key={index}
                    sx={{
                      mb: 1,
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                    onClick={() => handleCopyFromProgram(program)}
                  >
                    <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600 }}
                          >
                            {program.title || "Tên chương trình"}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                          >
                            {program.shortDescription || "Mô tả ngắn"}
                          </Typography>
                        </Box>
                        <CopyIcon
                          sx={{
                            fontSize: 16,
                            color: "action.disabled",
                            "&:hover": { color: "primary.main" },
                          }}
                        />
                      </Box>
                      <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                        <Chip
                          size="small"
                          label={program.programMode || "Offline"}
                          color="primary"
                          variant="outlined"
                        />
                        <Chip
                          size="small"
                          label={program.programStatus || "Published"}
                          color="success"
                          variant="outlined"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                ))
              ) : searchQuery ? (
                <Box
                  sx={{
                    border: `1px dashed ${theme.palette.divider}`,
                    borderRadius: 1,
                    p: 3,
                    textAlign: "center",
                    backgroundColor: theme.palette.background.default,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Không tìm thấy chương trình nào với từ khóa "{searchQuery}"
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    border: `1px dashed ${theme.palette.divider}`,
                    borderRadius: 1,
                    p: 3,
                    textAlign: "center",
                    backgroundColor: theme.palette.background.default,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Nhập từ khóa để tìm kiếm chương trình đào tạo
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>

          {/* Right Panel - Create Training Program Form */}
          <Box
            sx={{
              width: "60%",
              overflow: "auto",
              p: 4,
              backgroundColor: theme.palette.background.default,
            }}
          >
            {/* Request Information Section */}
            {(requestedProgram || partner) && (
              <Box sx={{ mb: 4 }}>
                <Accordion
                  defaultExpanded
                  sx={{
                    border: `2px solid ${theme.palette.primary.light}`,
                    borderRadius: 2,
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: `0 2px 8px ${theme.palette.action.hover}`,
                    "&:before": {
                      display: "none",
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      borderRadius: "8px 8px 0 0",
                      "& .MuiAccordionSummary-content": {
                        alignItems: "center",
                        gap: 2,
                      },
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      📋 Yêu cầu từ {partner?.organizationName || "Đối tác"}
                      {requestedProgram && (
                        <Chip
                          size="small"
                          label={
                            requestedProgram.status === "PENDING"
                              ? "Chờ duyệt"
                              : requestedProgram.status === "APPROVED"
                                ? "Đã duyệt"
                                : "Từ chối"
                          }
                          color={
                            requestedProgram.status === "PENDING"
                              ? "warning"
                              : requestedProgram.status === "APPROVED"
                                ? "success"
                                : "error"
                          }
                          sx={{
                            backgroundColor: "rgba(255, 255, 255, 0.2)",
                            color: "inherit",
                            "& .MuiChip-label": {
                              color: "inherit",
                            },
                          }}
                        />
                      )}
                    </Typography>
                  </AccordionSummary>

                  <AccordionDetails sx={{ p: 3 }}>
                    {/* Training Program Request */}
                    {requestedProgram && (
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, mb: 1 }}
                        >
                          Chi tiết yêu cầu đào tạo
                        </Typography>
                        <Card
                          variant="outlined"
                          sx={{
                            backgroundColor: theme.palette.action.hover,
                            border: `1px solid ${theme.palette.info.light}`,
                          }}
                        >
                          <CardContent sx={{ p: 2 }}>
                            <Box
                              sx={{
                                display: "flex",
                                justify: "space-between",
                                alignItems: "flex-start",
                                gap: 2,
                              }}
                            >
                              <Box sx={{ flex: 1 }}>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 600, mb: 1 }}
                                >
                                  {requestedProgram.title}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ mb: 1 }}
                                >
                                  {requestedProgram.description}
                                </Typography>

                                {/* Partner Organization inside request */}
                                {partner && (
                                  <Box
                                    sx={{
                                      mt: 2,
                                      pt: 2,
                                      borderTop: `1px solid ${theme.palette.divider}`,
                                    }}
                                  >
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                      sx={{ mb: 1, display: "block" }}
                                    >
                                      Tổ chức đối tác:
                                    </Typography>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1.5,
                                      }}
                                    >
                                      <Avatar
                                        src={partner.logoUrl}
                                        sx={{
                                          width: 32,
                                          height: 32,
                                          bgcolor: theme.palette.primary.main,
                                        }}
                                      >
                                        <SchoolIcon />
                                      </Avatar>
                                      <Box>
                                        <Typography
                                          variant="body2"
                                          sx={{
                                            fontWeight: 600,
                                            lineHeight: 1.2,
                                          }}
                                        >
                                          {partner.organizationName}
                                        </Typography>
                                        <Typography
                                          variant="caption"
                                          color="text.secondary"
                                        >
                                          {partner.representativeName} -{" "}
                                          {partner.position}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  </Box>
                                )}
                              </Box>
                              {requestedProgram.fileUrl && (
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={() =>
                                    window.open(
                                      requestedProgram.fileUrl,
                                      "_blank",
                                    )
                                  }
                                  sx={{ minWidth: "auto" }}
                                >
                                  📎 File yêu cầu
                                </Button>
                              )}
                            </Box>
                          </CardContent>
                        </Card>
                      </Box>
                    )}

                    {/* Partner Organization (only if no request) */}
                    {!requestedProgram && partner && (
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, mb: 1 }}
                        >
                          Thông tin tổ chức đối tác
                        </Typography>
                        <Card
                          variant="outlined"
                          sx={{
                            backgroundColor: theme.palette.action.hover,
                            border: `1px solid ${theme.palette.primary.light}`,
                          }}
                        >
                          <CardContent sx={{ p: 2 }}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                              }}
                            >
                              <Avatar
                                src={partner.logoUrl}
                                sx={{
                                  width: 40,
                                  height: 40,
                                  bgcolor: theme.palette.primary.main,
                                }}
                              >
                                <SchoolIcon />
                              </Avatar>
                              <Box sx={{ flex: 1 }}>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 600, mb: 0.5 }}
                                >
                                  {partner.organizationName}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {partner.representativeName} -{" "}
                                  {partner.position}
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </Box>
                    )}
                  </AccordionDetails>
                </Accordion>
              </Box>
            )}

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                📝 Tạo Chương trình Đào tạo
              </Typography>
              <Button
                size="small"
                onClick={() =>
                  setFormData({
                    title: "",
                    subTitle: "",
                    shortDescription: "",
                    description: "",
                    learningObjectives: "",
                    targetAudience: "",
                    requirements: "",
                    learningOutcomes: "",
                    programStatus: "REVIEW",
                    programMode: "OFFLINE",
                    programType: "SINGLE",
                    startDate: new Date(),
                    endDate: new Date(),
                    durationHours: 0,
                    durationSessions: 0,
                    scheduleDetail: "",
                    programLevel: "BEGINNER",
                    maxStudents: 0,
                    minStudents: 0,
                    openingCondition: "",
                    equipmentRequirement: "",
                    classroomLink: "",
                    scale: "",
                    listedPrice: 0,
                    internalPrice: 0,
                    publicPrice: 0,
                    priceVisible: false,
                    bannerUrl: "",
                    contentUrl: "",
                    syllabusFileUrl: "",
                    tags: [],
                    completionCertificateType: "",
                    certificateIssuer: "",
                    trialVideoUrl: "",
                    rating: null,
                    trainingProgramRequest: null,
                    partnerOrganization: partner,
                    user: null,
                  })
                }
                sx={{ textTransform: "none" }}
              >
                🗑️ Xóa tất cả
              </Button>
            </Box>

            {/* 1. Thông tin cơ bản */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
                1. Thông tin cơ bản
              </Typography>

              <TextField
                fullWidth
                label="Tên chương trình"
                value={formData.title}
                onChange={(e) => handleFormChange("title", e.target.value)}
                margin="dense"
                required
              />

              <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
                <TextField
                  fullWidth
                  label="Tên phụ"
                  value={formData.subTitle}
                  onChange={(e) => handleFormChange("subTitle", e.target.value)}
                  margin="dense"
                />

                <FormControl fullWidth margin="dense" required>
                  <InputLabel>Loại chương trình</InputLabel>
                  <Select
                    value={formData.programType}
                    label="Loại chương trình"
                    onChange={(e) =>
                      handleFormChange("programType", e.target.value)
                    }
                  >
                    <MenuItem value="SINGLE">Đơn lẻ</MenuItem>
                    <MenuItem value="PATHWAY">Lộ trình</MenuItem>
                    <MenuItem value="ENTERPRISE_TOPIC">
                      Chủ đề doanh nghiệp
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <TextField
                fullWidth
                label="Mô tả ngắn"
                value={formData.shortDescription}
                onChange={(e) =>
                  handleFormChange("shortDescription", e.target.value)
                }
                margin="dense"
                multiline
                minRows={2}
                maxRows={6}
              />

              <TextField
                fullWidth
                label="Mô tả chi tiết"
                value={formData.description}
                onChange={(e) =>
                  handleFormChange("description", e.target.value)
                }
                margin="dense"
                multiline
                minRows={3}
                maxRows={8}
              />

              {/* File Upload & Settings */}
              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    Hình ảnh Banner
                  </Typography>
                  <Box
                    sx={{
                      border: formData.bannerUrl
                        ? "2px solid #4caf50"
                        : "2px dashed #e0e0e0",
                      borderRadius: 2,
                      textAlign: "center",
                      backgroundColor: "#fafafa",
                      position: "relative",
                      height: 120,
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        borderColor: "#4caf50",
                        backgroundColor: "#f1f8e9",
                      },
                    }}
                  >
                    <input
                      ref={bannerInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleBannerFileChange}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        opacity: 0,
                        cursor: "pointer",
                        zIndex: 2,
                      }}
                      disabled={isUploadingBanner}
                    />

                    {isUploadingBanner ? (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <CircularProgress size={30} />
                        <Typography variant="caption">
                          Đang tải lên...
                        </Typography>
                      </Box>
                    ) : formData.bannerUrl ? (
                      <>
                        <Box
                          component="img"
                          src={formData.bannerUrl}
                          alt="Banner Preview"
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            position: "absolute",
                            top: 0,
                            left: 0,
                            zIndex: 1,
                          }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            top: 4,
                            right: 4,
                            zIndex: 3,
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedBannerFile(null);
                              setFormData((prev) => ({
                                ...prev,
                                bannerUrl: "",
                              }));
                              if (bannerInputRef.current) {
                                bannerInputRef.current.value = "";
                              }
                            }}
                            sx={{
                              backgroundColor: "rgba(255, 255, 255, 0.8)",
                              "&:hover": {
                                backgroundColor: "rgba(255, 255, 255, 0.9)",
                              },
                            }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Box>
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            backgroundColor: "rgba(0, 0, 0, 0.6)",
                            color: "white",
                            py: 0.5,
                            px: 1,
                            zIndex: 2,
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{ display: "block", textAlign: "center" }}
                          >
                            {selectedBannerFile?.name || "Banner đã tải"}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              display: "block",
                              textAlign: "center",
                              opacity: 0.8,
                            }}
                          >
                            Click để thay đổi ảnh
                          </Typography>
                        </Box>
                      </>
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            backgroundColor: "#e3f2fd",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography variant="h6">📷</Typography>
                        </Box>
                        <Typography variant="caption" sx={{ fontWeight: 500 }}>
                          Tải lên hình banner
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          JPG, PNG, GIF (tối đa 10MB)
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    Đề cương/ Tài liệu đính kèm
                  </Typography>
                  <Box
                    sx={{
                      border: formData.syllabusFileUrl
                        ? "2px solid #2196f3"
                        : "2px dashed #e0e0e0",
                      borderRadius: 2,
                      textAlign: "center",
                      backgroundColor: "#fafafa",
                      position: "relative",
                      height: 120,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        borderColor: "#2196f3",
                        backgroundColor: "#e3f2fd",
                      },
                    }}
                  >
                    <input
                      ref={syllabusInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleSyllabusFileChange}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        opacity: 0,
                        cursor: "pointer",
                        zIndex: 2,
                      }}
                      disabled={isUploadingSyllabus}
                    />

                    {isUploadingSyllabus ? (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <CircularProgress size={30} />
                        <Typography variant="caption">
                          Đang tải lên...
                        </Typography>
                      </Box>
                    ) : formData.syllabusFileUrl ? (
                      <>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 1,
                            p: 2,
                          }}
                        >
                          <Box
                            sx={{
                              width: 50,
                              height: 50,
                              borderRadius: 2,
                              backgroundColor: "#1976d2",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Typography variant="h5" sx={{ color: "white" }}>
                              📄
                            </Typography>
                          </Box>
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: 600, textAlign: "center" }}
                          >
                            {selectedSyllabusFile?.name || "File giáo trình"}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Click để thay đổi file
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            position: "absolute",
                            top: 4,
                            right: 4,
                            zIndex: 3,
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSyllabusFile(null);
                              setFormData((prev) => ({
                                ...prev,
                                syllabusFileUrl: "",
                              }));
                              if (syllabusInputRef.current) {
                                syllabusInputRef.current.value = "";
                              }
                            }}
                            sx={{
                              backgroundColor: "rgba(255, 255, 255, 0.8)",
                              "&:hover": {
                                backgroundColor: "rgba(255, 255, 255, 0.9)",
                              },
                            }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </>
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            backgroundColor: "#e3f2fd",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography variant="h6">📄</Typography>
                        </Box>
                        <Typography variant="caption" sx={{ fontWeight: 500 }}>
                          Tải lên file
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          PDF, DOC, DOCX (tối đa 10MB)
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                <TextField
                  fullWidth
                  label="URL Nội dung"
                  value={formData.contentUrl}
                  onChange={(e) =>
                    handleFormChange("contentUrl", e.target.value)
                  }
                  placeholder="https://..."
                />
              </Box>

              <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                <TextField
                  fullWidth
                  label="Trial Video URL"
                  value={formData.trialVideoUrl}
                  onChange={(e) =>
                    handleFormChange("trialVideoUrl", e.target.value)
                  }
                  placeholder="https://youtube.com/... hoặc https://vimeo.com/..."
                />
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* 3. Thời gian */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
                3. Thời gian
              </Typography>

              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={vi}
              >
                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                  <DatePicker
                    label="Ngày bắt đầu"
                    value={formData.startDate}
                    onChange={(newValue) => {
                      if (newValue) {
                        // Convert to Date - handle both Date and Dayjs objects
                        const dateValue =
                          newValue instanceof Date
                            ? newValue
                            : (newValue as any).toDate
                              ? (newValue as any).toDate()
                              : new Date(newValue as any);
                        handleFormChange("startDate", dateValue);
                      }
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: "outlined",
                      },
                    }}
                    format="dd/MM/yyyy"
                  />

                  <DatePicker
                    label="Ngày kết thúc"
                    value={formData.endDate}
                    onChange={(newValue) => {
                      if (newValue) {
                        // Convert to Date - handle both Date and Dayjs objects
                        const dateValue =
                          newValue instanceof Date
                            ? newValue
                            : (newValue as any).toDate
                              ? (newValue as any).toDate()
                              : new Date(newValue as any);
                        handleFormChange("endDate", dateValue);
                      }
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: "outlined",
                      },
                    }}
                    format="dd/MM/yyyy"
                    minDate={formData.startDate}
                  />
                </Box>
              </LocalizationProvider>

              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Số giờ"
                  value={formData.durationHours}
                  onChange={(e) =>
                    handleFormChange(
                      "durationHours",
                      parseInt(e.target.value) || 0,
                    )
                  }
                />

                <TextField
                  fullWidth
                  type="number"
                  label="Số buổi học"
                  value={formData.durationSessions}
                  onChange={(e) =>
                    handleFormChange(
                      "durationSessions",
                      parseInt(e.target.value) || 0,
                    )
                  }
                />
              </Box>

              <TextField
                fullWidth
                label="Chi tiết lịch học"
                value={formData.scheduleDetail}
                onChange={(e) =>
                  handleFormChange("scheduleDetail", e.target.value)
                }
                margin="dense"
                multiline
                minRows={2}
                maxRows={6}
                placeholder="VD: Thứ 2, 4, 6 từ 19:00 - 21:30"
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* 4. Giá cả */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
                4. Giá cả
              </Typography>

              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Giá niêm yết (VND)"
                  value={formData.listedPrice}
                  onChange={(e) =>
                    handleFormChange(
                      "listedPrice",
                      parseFloat(e.target.value) || 0,
                    )
                  }
                />

                <TextField
                  fullWidth
                  type="number"
                  label="Giá nội bộ (VND)"
                  value={formData.internalPrice}
                  onChange={(e) =>
                    handleFormChange(
                      "internalPrice",
                      parseFloat(e.target.value) || 0,
                    )
                  }
                />
              </Box>

              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Giá công khai (VND)"
                  value={formData.publicPrice}
                  onChange={(e) =>
                    handleFormChange(
                      "publicPrice",
                      parseFloat(e.target.value) || 0,
                    )
                  }
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.priceVisible}
                      onChange={(e) =>
                        handleFormChange("priceVisible", e.target.checked)
                      }
                    />
                  }
                  label={formData.priceVisible ? "Công khai" : "Ẩn"}
                  sx={{ minWidth: 200 }}
                />
              </Box>
            </Box>

            {/* 2. Thông tin chi tiết */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
                2. Thông tin chi tiết
              </Typography>

              <FormControl fullWidth margin="dense">
                <InputLabel>Cấp độ</InputLabel>
                <Select
                  value={formData.programLevel}
                  label="Cấp độ"
                  onChange={(e) =>
                    handleFormChange("programLevel", e.target.value)
                  }
                >
                  <MenuItem value="BEGINNER">Cơ bản</MenuItem>
                  <MenuItem value="INTERMEDIATE">Trung cấp</MenuItem>
                  <MenuItem value="ADVANCED">Nâng cao</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Kiến thức học được"
                value={formData.learningObjectives}
                onChange={(e) =>
                  handleFormChange("learningObjectives", e.target.value)
                }
                margin="dense"
                multiline
                minRows={2}
                maxRows={6}
              />

              <TextField
                fullWidth
                label="Đối tượng tham gia"
                value={formData.targetAudience}
                onChange={(e) =>
                  handleFormChange("targetAudience", e.target.value)
                }
                multiline
                minRows={2}
                maxRows={6}
                margin="dense"
              />

              <TextField
                fullWidth
                label="Yêu cầu đầu vào"
                value={formData.requirements}
                onChange={(e) =>
                  handleFormChange("requirements", e.target.value)
                }
                margin="dense"
                multiline
                minRows={2}
                maxRows={6}
                placeholder="VD: Kiến thức cơ bản về lập trình"
              />

              <TextField
                fullWidth
                label="Kết quả đầu ra"
                value={formData.learningOutcomes}
                onChange={(e) =>
                  handleFormChange("learningOutcomes", e.target.value)
                }
                margin="dense"
                multiline
                minRows={2}
                maxRows={6}
              />
              <Divider sx={{ my: 2 }} />
              <FormControl
                component="fieldset"
                fullWidth
                required
                sx={{ mb: 2 }}
              >
                <Typography variant="h5" sx={{ fontWeight: 500, mb: 1 }}>
                  Hình thức
                </Typography>
                <RadioGroup
                  row
                  value={formData.programMode}
                  onChange={(e) =>
                    handleFormChange(
                      "programMode",
                      e.target.value as "ONLINE" | "OFFLINE" | "HYBRID",
                    )
                  }
                >
                  <FormControlLabel
                    value="ONLINE"
                    control={<Radio />}
                    label="Online"
                  />
                  <FormControlLabel
                    value="OFFLINE"
                    control={<Radio />}
                    label="Offline"
                  />
                  <FormControlLabel
                    value="HYBRID"
                    control={<Radio />}
                    label="Hybrid"
                  />
                </RadioGroup>
              </FormControl>

              <TextField
                fullWidth
                label={
                  formData.programMode === "ONLINE"
                    ? "Liên kết lớp học"
                    : formData.programMode === "OFFLINE"
                      ? "Địa chỉ lớp học"
                      : formData.programMode === "HYBRID"
                        ? "Ghi chú"
                        : "Liên kết lớp học"
                }
                value={formData.classroomLink}
                onChange={(e) =>
                  handleFormChange("classroomLink", e.target.value)
                }
                placeholder={
                  formData.programMode === "ONLINE"
                    ? "https://meet.google.com/..."
                    : formData.programMode === "OFFLINE"
                      ? "Địa chỉ phòng học..."
                      : formData.programMode === "HYBRID"
                        ? "Ghi chú ..."
                        : "https://meet.google.com/..."
                }
                sx={{ mb: 2 }}
              />

              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Số học viên tối đa"
                  value={formData.maxStudents}
                  onChange={(e) =>
                    handleFormChange(
                      "maxStudents",
                      parseInt(e.target.value) || 0,
                    )
                  }
                />

                <TextField
                  fullWidth
                  type="number"
                  label="Số học viên tối thiểu"
                  value={formData.minStudents}
                  onChange={(e) =>
                    handleFormChange(
                      "minStudents",
                      parseInt(e.target.value) || 0,
                    )
                  }
                />
              </Box>

              <TextField
                fullWidth
                label="Điều kiện mở lớp"
                value={formData.openingCondition}
                onChange={(e) =>
                  handleFormChange("openingCondition", e.target.value)
                }
                margin="dense"
                multiline
                minRows={2}
                maxRows={6}
                placeholder="VD: Đủ sinh viên tối thiểu"
              />

              <TextField
                fullWidth
                label="Yêu cầu thiết bị"
                value={formData.equipmentRequirement}
                onChange={(e) =>
                  handleFormChange("equipmentRequirement", e.target.value)
                }
                margin="dense"
                multiline
                minRows={2}
                maxRows={6}
                placeholder="VD: Laptop, camera, micro"
              />

              <TextField
                fullWidth
                label="Quy mô"
                value={formData.scale}
                onChange={(e) => handleFormChange("scale", e.target.value)}
                margin="dense"
                placeholder="VD: Cá nhân, Doanh nghiệp nhỏ, Doanh nghiệp"
              />

              {/* Tags */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
                  Thẻ tag
                </Typography>
                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                  <TextField
                    fullWidth
                    placeholder="Nhập tag mới"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button
                    variant="outlined"
                    onClick={handleAddTag}
                    disabled={!tagInput.trim()}
                    sx={{ minWidth: 100 }}
                  >
                    Thêm tag
                  </Button>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    flexWrap: "wrap",
                    minHeight: 50,
                    p: 2,
                    border: "1px solid #e0e0e0",
                    borderRadius: 1,
                    backgroundColor: "#fafafa",
                  }}
                >
                  {formData.tags.length > 0 ? (
                    formData.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        onDelete={() => handleRemoveTag(tag)}
                        color="primary"
                        variant="outlined"
                      />
                    ))
                  ) : (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontStyle: "italic" }}
                    >
                      Chưa có tag nào được thêm
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* 5. Kiểm định chất lượng */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
                5. Kiểm định chất lượng
              </Typography>

              <TextField
                fullWidth
                label="Loại chứng chỉ hoàn thành"
                value={formData.completionCertificateType}
                onChange={(e) =>
                  handleFormChange("completionCertificateType", e.target.value)
                }
                margin="dense"
              />

              <TextField
                fullWidth
                label="Tổ chức cấp chứng chỉ"
                value={formData.certificateIssuer}
                onChange={(e) =>
                  handleFormChange("certificateIssuer", e.target.value)
                }
                margin="dense"
              />
            </Box>
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
          onClick={handleSubmit}
          disabled={
            loading ||
            !formData.title ||
            !formData.programMode ||
            !formData.programType
          }
          sx={{ minWidth: 120 }}
        >
          {loading ? "Đang tạo..." : "Tạo mới"}
        </Button>
      </DialogActions>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
          severity={notification.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default TrainingProgramCreateDialog;
