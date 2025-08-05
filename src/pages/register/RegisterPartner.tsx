import {
  Autocomplete,
  Button,
  TextField,
  Typography,
  IconButton,
  Paper,
  Divider,
} from "@mui/material";
import {
  ArrowBack,
  Business,
  Person,
  Description,
  Handshake,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUserProfile } from "../../redux/slice/userSlice";
import { API } from "../../utils/Fetch";
import type { PartnerRequest } from "../../types/PartnerRequest";
import { validatePartnerInfo } from "../../utils/Validate";
import { toast } from "react-toastify";
import { industries } from "../../utils/AutoComplete";

const RegisterPartner = () => {
  const [businessRegistrationNumber, setBusinessRegistrationNumber] =
    useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [industry, setIndustry] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [representativeName, setRepresentativeName] = useState("");
  const [position, setPosition] = useState("");
  const [description, setDescription] = useState("");
  const [establishedYear, setEstablishedYear] = useState<number | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("partnerRegisterForm");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setBusinessRegistrationNumber(
          parsedData.businessRegistrationNumber || "",
        );
        setOrganizationName(parsedData.organizationName || "");
        setIndustry(parsedData.industry || "");
        setPhoneNumber(parsedData.phoneNumber || "");
        setWebsite(parsedData.website || "");
        setAddress(parsedData.address || "");
        setRepresentativeName(parsedData.representativeName || "");
        setPosition(parsedData.position || "");
        setDescription(parsedData.description || "");
        setEstablishedYear(parsedData.establishedYear || null);
      } catch (error) {
        console.warn("Error loading saved form data:", error);
      }
    }
  }, []);

  // Save data to localStorage whenever form data changes
  useEffect(() => {
    const formData = {
      businessRegistrationNumber,
      organizationName,
      industry,
      phoneNumber,
      website,
      address,
      representativeName,
      position,
      description,
      establishedYear,
    };
    localStorage.setItem("partnerRegisterForm", JSON.stringify(formData));
  }, [
    businessRegistrationNumber,
    organizationName,
    industry,
    phoneNumber,
    website,
    address,
    representativeName,
    position,
    description,
    establishedYear,
  ]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const partnerData: PartnerRequest = {
      businessRegistrationNumber,
      organizationName,
      industry,
      phoneNumber,
      website,
      address,
      representativeName,
      position,
      description,
      establishedYear: establishedYear ?? new Date().getFullYear(),
    };
    const validationErrors = validatePartnerInfo(partnerData);
    if (validationErrors && !validationErrors.success) {
      console.error("🚨 Đăng ký tổ chức thất bại:", validationErrors);
      toast.error(
        validationErrors.error ||
          "Thông tin đăng ký không hợp lệ. Vui lòng kiểm tra lại.",
      );
      return;
    }

    try {
      const response = await API.user.registerPartner(partnerData);
      console.log("✅ Đăng ký tổ chức thành công:", response.data.data);

      // Clear localStorage on successful registration
      localStorage.removeItem("partnerRegisterForm");

      const profileResponse = await API.user.getUserProfile();
      const user = profileResponse?.data?.data;
      toast.success("Đăng ký thành công! Vui lòng chờ duyệt.");

      if (user && user.role) {
        dispatch(setUserProfile(user));
        navigate("/pending-partner");
      } else {
        console.warn("User profile không hợp lệ:", user);
      }
    } catch (error: any) {
      if (error.response?.data?.message?.includes("đã tồn tại")) {
        toast.error("Mã DKKD đã được đăng ký trước đó.");
        return;
      } else {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
        return;
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Banner Section with Back Button */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 py-12 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute left-0 top-0 h-full w-full">
          <div className="absolute left-10 top-10 h-20 w-20 rounded-full bg-white opacity-10"></div>
          <div className="absolute bottom-10 right-10 h-32 w-32 rounded-full bg-white opacity-5"></div>
          <div className="absolute left-1/3 top-1/2 h-16 w-16 rounded-full bg-white opacity-10"></div>
        </div>
        <div className="relative mx-auto max-w-4xl px-4">
          {/* Back Button and Title Row */}
          <div className="mb-6 flex items-center justify-between">
            <IconButton
              onClick={handleBack}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              <ArrowBack />
            </IconButton>
            <div className="flex flex-1 flex-col items-center text-center">
              <Handshake sx={{ fontSize: 40, mb: 1, opacity: 0.9 }} />
              <Typography variant="h3" className="font-bold">
                Đăng ký Đối tác
              </Typography>
            </div>
            <div className="w-10"></div> {/* Spacer for balance */}
          </div>
          <Typography variant="h6" className="text-center opacity-90">
            Trở thành đối tác chiến lược, xây dựng hệ sinh thái giáo dục toàn
            diện
          </Typography>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto -mt-8 max-w-4xl px-4 pb-8">
        {/* Enhanced Form */}
        <Paper
          elevation={3}
          className="rounded-xl p-8"
          sx={{
            borderRadius: 3,
            background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Organization Info */}
            <div>
              <div className="mb-6 flex items-center pt-10">
                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
                  <Business className="text-2xl text-purple-600" />
                </div>
                <div>
                  <Typography
                    variant="h5"
                    className="font-bold text-purple-600"
                  >
                    Thông tin tổ chức
                  </Typography>
                  <Typography variant="body2" className="text-gray-500">
                    Thông tin cơ bản về tổ chức đối tác
                  </Typography>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex flex-col gap-6 md:flex-row">
                  <TextField
                    fullWidth
                    label="Mã số kinh doanh"
                    placeholder="Nhập mã số đăng ký kinh doanh"
                    value={businessRegistrationNumber}
                    onChange={(e) =>
                      setBusinessRegistrationNumber(e.target.value)
                    }
                    required
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                        },
                        "&.Mui-focused": {
                          backgroundColor: "white",
                          boxShadow: "0 8px 25px rgba(168, 85, 247, 0.15)",
                        },
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Năm thành lập"
                    placeholder="Năm thành lập tổ chức"
                    type="number"
                    value={establishedYear ?? ""}
                    onChange={(e) => setEstablishedYear(+e.target.value)}
                    variant="outlined"
                    inputProps={{ min: 1900, max: new Date().getFullYear() }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                        },
                      },
                    }}
                  />
                </div>
                <TextField
                  fullWidth
                  label="Tên tổ chức"
                  placeholder="Tên đầy đủ của tổ chức"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  required
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                      },
                      "&.Mui-focused": {
                        backgroundColor: "white",
                        boxShadow: "0 8px 25px rgba(168, 85, 247, 0.15)",
                      },
                    },
                  }}
                />
                <Autocomplete
                  fullWidth
                  options={industries}
                  value={industry}
                  onChange={(_event, newValue) => {
                    setIndustry(newValue || "");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Ngành nghề"
                      placeholder="Chọn hoặc nhập ngành nghề"
                      required
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 3,
                          backgroundColor: "rgba(255, 255, 255, 0.8)",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.95)",
                            boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                          },
                          "&.Mui-focused": {
                            backgroundColor: "white",
                            boxShadow: "0 8px 25px rgba(168, 85, 247, 0.15)",
                          },
                        },
                      }}
                    />
                  )}
                  freeSolo
                />
                <div className="flex flex-col gap-6 md:flex-row">
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    placeholder="Số điện thoại liên hệ"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                        },
                        "&.Mui-focused": {
                          backgroundColor: "white",
                          boxShadow: "0 8px 25px rgba(168, 85, 247, 0.15)",
                        },
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Website"
                    placeholder="https://example.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                        },
                      },
                    }}
                  />
                </div>
                <TextField
                  fullWidth
                  label="Địa chỉ"
                  placeholder="Địa chỉ đầy đủ của tổ chức"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  variant="outlined"
                  multiline
                  rows={3}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                      },
                      "&.Mui-focused": {
                        backgroundColor: "white",
                        boxShadow: "0 8px 25px rgba(168, 85, 247, 0.15)",
                      },
                    },
                  }}
                />
              </div>
            </div>

            <Divider />

            <div>
              <div className="mb-6 flex items-center">
                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                  <Person className="text-2xl text-blue-600" />
                </div>
                <div>
                  <Typography variant="h5" className="font-bold text-blue-600">
                    Người đại diện
                  </Typography>
                  <Typography variant="body2" className="text-gray-500">
                    Thông tin người đại diện tổ chức
                  </Typography>
                </div>
              </div>
              <div className="flex flex-col gap-6 md:flex-row">
                <TextField
                  fullWidth
                  label="Tên người đại diện"
                  placeholder="Họ và tên đầy đủ"
                  value={representativeName}
                  onChange={(e) => setRepresentativeName(e.target.value)}
                  required
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                      },
                      "&.Mui-focused": {
                        backgroundColor: "white",
                        boxShadow: "0 8px 25px rgba(59, 130, 246, 0.15)",
                      },
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Chức vụ"
                  placeholder="Ví dụ: Giám đốc, Trưởng phòng..."
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  required
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                      },
                      "&.Mui-focused": {
                        backgroundColor: "white",
                        boxShadow: "0 8px 25px rgba(59, 130, 246, 0.15)",
                      },
                    },
                  }}
                />
              </div>
            </div>

            <Divider />

            <div>
              <div className="mb-6 flex items-center">
                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                  <Description className="text-2xl text-green-600" />
                </div>
                <div>
                  <Typography variant="h5" className="font-bold text-green-600">
                    Mô tả tổ chức
                  </Typography>
                  <Typography variant="body2" className="text-gray-500">
                    Giới thiệu về tổ chức và hoạt động
                  </Typography>
                </div>
              </div>
              <TextField
                fullWidth
                label="Mô tả chi tiết"
                placeholder="Giới thiệu về tổ chức, lĩnh vực hoạt động, thành tựu nổi bật, mục tiêu hợp tác..."
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "white",
                      boxShadow: "0 8px 25px rgba(34, 197, 94, 0.15)",
                    },
                  },
                }}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  px: 8,
                  py: 2,
                  background:
                    "linear-gradient(45deg, #9C27B0 30%, #3F51B5 90%)",
                  borderRadius: 3,
                  fontWeight: "bold",
                  textTransform: "none",
                  fontSize: "1.1rem",
                  boxShadow: "0 8px 25px rgba(156, 39, 176, 0.4)",
                  "&:hover": {
                    background:
                      "linear-gradient(45deg, #7B1FA2 30%, #303F9F 90%)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 35px rgba(156, 39, 176, 0.6)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Đăng ký
              </Button>
            </div>
          </form>
        </Paper>

        {/* Footer Info */}
        <div className="mt-6 text-center">
          <Typography variant="body2" className="text-gray-500">
            💼 Hồ sơ sẽ được xem xét và phê duyệt trong thời gian sớm nhất.
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default RegisterPartner;
