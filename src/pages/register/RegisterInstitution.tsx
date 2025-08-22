import { useState, useEffect } from "react";
import type { EducationInstitutionType } from "../../types/InstitutionRequest";
import {
  Button,
  TextField,
  IconButton,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import type { InstitutionRequest } from "../../types/InstitutionRequest";
import { API } from "../../utils/Fetch";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUserProfile } from "../../redux/slice/userSlice";
import {
  School,
  Business,
  ContactMail,
  Person,
  Description,
} from "@mui/icons-material";
import { validateInstitutionInfo } from "../../utils/Validate";
import { toast } from "react-toastify";

const RegisterInstitution = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userProfile = useSelector((state: any) => state.userProfile);

  const [businessRegistrationNumber, setBusinessRegistrationNumber] =
    useState<string>("");
  const [institutionName, setInstitutionName] = useState<string>("");
  const [institutionType, setInstitutionType] =
    useState<EducationInstitutionType | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [website, setWebsite] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [representativeName, setRepresentativeName] = useState<string>("");
  const [position, setPosition] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [establishedYear, setEstablishedYear] = useState<number | null>(null);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("institutionRegisterForm");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setBusinessRegistrationNumber(
          parsedData.businessRegistrationNumber || "",
        );
        setInstitutionName(parsedData.institutionName || "");
        setInstitutionType(parsedData.institutionType || null);
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
      institutionName,
      institutionType,
      phoneNumber,
      website,
      address,
      representativeName,
      position,
      description,
      establishedYear,
    };
    localStorage.setItem("institutionRegisterForm", JSON.stringify(formData));
  }, [
    businessRegistrationNumber,
    institutionName,
    institutionType,
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

    const institutionData: InstitutionRequest = {
      businessRegistrationNumber,
      institutionName,
      institutionType: institutionType ?? "UNIVERSITY", // fallback nếu null
      phoneNumber,
      website,
      address,
      representativeName,
      position,
      description,
      establishedYear,
    };

    if (validateInstitutionInfo(institutionData).success === false) {
      toast.error(validateInstitutionInfo(institutionData).error);
      return;
    }

    try {
      await API.user.registerInstitution(institutionData);

      // Clear localStorage on successful registration
      localStorage.removeItem("institutionRegisterForm");

      const profileResponse = await API.user.getUserProfile();
      const user = profileResponse?.data?.data;
      toast.success("Đăng ký thành công! Vui lòng chờ duyệt.");
      if (user && user.role) {
        dispatch(setUserProfile(user));
        navigate("/pending-institution", { replace: true });
        await API.other.sendEmail({
          to: userProfile.email,
          subject: "Xác nhận đăng ký Cơ sở Giáo dục thành công",
          body: `
    <div style="font-family: Arial, sans-serif; background: #f6f8fa; padding: 32px;">
      <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 32px;">
        <h2 style="color: #2563eb; margin-bottom: 16px;">Chúc mừng Cơ sở của bạn đã đăng ký thành công!</h2>
        <p style="font-size: 16px; color: #333;">
          Xin chào <strong>${representativeName || ""}</strong>,<br/><br/>
          Cơ sở của bạn đã đăng ký tài khoản <strong>${institutionType === "UNIVERSITY" ? "Trường" : "Trung tâm đào tạo"}</strong> trên hệ thống <strong>EduHubVN</strong> thành công.<br/>
          Hồ sơ của Cơ sở của bạn đang được <span style="color: #f59e42; font-weight: bold;">chờ phê duyệt</span> bởi quản trị viên.<br/><br/>
          <b>Thông tin đăng ký:</b><br/>
          - Tên cơ sở: ${institutionName || ""}<br/>
          - Mã số kinh doanh: ${businessRegistrationNumber || ""}<br/>
          - Năm thành lập: ${establishedYear || ""}<br/>
          - Loại cơ sở: ${institutionType === "UNIVERSITY" ? "Trường" : "Trung tâm đào tạo"}<br/>
          - Người đại diện: ${representativeName || ""} (${position || ""})<br/>
          - Số điện thoại: ${phoneNumber || ""}<br/>
          - Email liên hệ: ${userProfile.email}<br/>
          - Website: ${website || ""}<br/>
          - Địa chỉ: ${address || ""}<br/>
          <br/>
          Chúng tôi sẽ kiểm tra thông tin và cập nhật trạng thái hồ sơ của Cơ sở của bạn trong thời gian sớm nhất.<br/>
          Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ qua email: <a href="mailto:support@eduhubvn.com">support@eduhubvn.com</a>.<br/><br/>
          Trân trọng,<br/>
          <span style="color: #2563eb; font-weight: bold;">EduHubVN Team</span>
        </p>
        <hr style="margin: 32px 0; border: none; border-top: 1px solid #eee;" />
        <div style="font-size: 13px; color: #888;">
          Đây là email tự động, vui lòng không trả lời trực tiếp email này.
        </div>
      </div>
    </div>
  `,
        });
      } else {
        console.warn("User profile không hợp lệ:", user);
      }
    } catch (error: any) {
      if (error.response?.data?.message?.includes("đã tồn tại")) {
        toast.error("Số đăng ký kinh doanh đã tồn tại trong hệ thống.");
      } else {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Banner Section with Back Button */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 py-12 text-white">
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
              <School sx={{ fontSize: 40, mb: 1, opacity: 0.9 }} />
              <Typography variant="h3" className="font-bold">
                Đăng ký Cơ sở Giáo dục
              </Typography>
            </div>
            <div className="w-10"></div> {/* Spacer for balance */}
          </div>
          <Typography variant="h6" className="text-center opacity-90">
            Tìm kiếm và kết nối với các giảng viên hàng đầu
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
            {/* Basic Info */}
            <div>
              <div className="mb-6 flex items-center pt-10">
                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                  <Business className="text-2xl text-blue-600" />
                </div>
                <div>
                  <Typography variant="h5" className="font-bold text-blue-600">
                    Thông tin cơ bản
                  </Typography>
                  <Typography variant="body2" className="text-gray-500">
                    Thông tin định danh của cơ sở giáo dục
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
                          boxShadow: "0 8px 25px rgba(37, 99, 235, 0.15)",
                        },
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Năm thành lập"
                    placeholder="Năm thành lập cơ sở"
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
                <div className="flex flex-col gap-6 md:flex-row">
                  <TextField
                    fullWidth
                    label="Tên cơ sở"
                    placeholder="Tên đầy đủ của cơ sở giáo dục"
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
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
                          boxShadow: "0 8px 25px rgba(37, 99, 235, 0.15)",
                        },
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    select
                    label="Loại cơ sở"
                    value={institutionType ?? ""}
                    onChange={(e) =>
                      setInstitutionType(
                        e.target.value as EducationInstitutionType,
                      )
                    }
                    SelectProps={{ native: true }}
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
                      },
                    }}
                  >
                    <option value="UNIVERSITY">Trường</option>
                    <option value="TRAINING_CENTER">Trung tâm đào tạo</option>
                  </TextField>
                </div>
              </div>
            </div>

            <Divider />

            {/* Contact Info */}
            <div>
              <div className="mb-6 flex items-center">
                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                  <ContactMail className="text-2xl text-green-600" />
                </div>
                <div>
                  <Typography variant="h5" className="font-bold text-green-600">
                    Thông tin liên hệ
                  </Typography>
                  <Typography variant="body2" className="text-gray-500">
                    Thông tin để liên hệ và kết nối
                  </Typography>
                </div>
              </div>
              <div className="space-y-6">
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
                          boxShadow: "0 8px 25px rgba(34, 197, 94, 0.15)",
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
                  placeholder="Địa chỉ đầy đủ của cơ sở (số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố)"
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
                        boxShadow: "0 8px 25px rgba(34, 197, 94, 0.15)",
                      },
                    },
                  }}
                />
              </div>
            </div>

            <Divider />

            {/* Representative */}
            <div>
              <div className="mb-6 flex items-center">
                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
                  <Person className="text-2xl text-purple-600" />
                </div>
                <div>
                  <Typography
                    variant="h5"
                    className="font-bold text-purple-600"
                  >
                    Người đại diện
                  </Typography>
                  <Typography variant="body2" className="text-gray-500">
                    Thông tin người đại diện pháp lý
                  </Typography>
                </div>
              </div>
              <div className="flex flex-col gap-6 md:flex-row">
                <TextField
                  fullWidth
                  label="Họ và tên người đại diện"
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
                        boxShadow: "0 8px 25px rgba(168, 85, 247, 0.15)",
                      },
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Chức vụ"
                  placeholder="Ví dụ: Hiệu trưởng, Giám đốc..."
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
                        boxShadow: "0 8px 25px rgba(168, 85, 247, 0.15)",
                      },
                    },
                  }}
                />
              </div>
            </div>

            <Divider />

            {/* Description */}
            <div>
              <div className="mb-6 flex items-center">
                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100">
                  <Description className="text-2xl text-orange-600" />
                </div>
                <div>
                  <Typography
                    variant="h5"
                    className="font-bold text-orange-600"
                  >
                    Mô tả cơ sở
                  </Typography>
                  <Typography variant="body2" className="text-gray-500">
                    Giới thiệu về cơ sở giáo dục
                  </Typography>
                </div>
              </div>
              <TextField
                fullWidth
                label="Mô tả chi tiết về cơ sở"
                placeholder="Mô tả về lịch sử, tầm nhìn, sứ mệnh, chương trình đào tạo, cơ sở vật chất, thành tựu nổi bật..."
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
                      boxShadow: "0 8px 25px rgba(251, 146, 60, 0.15)",
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
                    "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                  borderRadius: 3,
                  fontWeight: "bold",
                  textTransform: "none",
                  fontSize: "1.1rem",
                  boxShadow: "0 8px 25px rgba(33, 150, 243, 0.4)",
                  "&:hover": {
                    background:
                      "linear-gradient(45deg, #1976D2 30%, #1BA3D6 90%)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 35px rgba(33, 150, 243, 0.6)",
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
            💡 Thông tin sẽ được duyệt trong thời gian sớm nhất.
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default RegisterInstitution;
