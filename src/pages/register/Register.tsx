import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Chip,
  Alert,
} from "@mui/material";
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  ArrowForward,
  Security,
  CheckCircle,
} from "@mui/icons-material";
import { API } from "../../utils/Fetch";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Logoweb from "../../assets/eduhub-02.png";
import { colors, hexToRgba } from "../../theme/colors";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let interval: number;
    if (secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [secondsLeft]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Mật khẩu không khớp");
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError("Mật khẩu phải có ít nhất 8 ký tự và 1 ký tự đặc biệt.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await API.auth.register({ email, password, otp });
      localStorage.setItem("accessToken", response.data.data.accessToken);
      localStorage.setItem("refreshToken", response.data.data.refreshToken);
      toast.success("Đăng ký thành công!");
      navigate("/");
    } catch (error) {
      console.error("Đăng ký thất bại:", error);
      toast.error("Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!email) {
      setError("Vui lòng nhập email");
      return;
    }

    setLoadingOtp(true);
    setOtpSent(true);
    setSecondsLeft(30);

    try {
      await API.auth.sendOtp(email);
      setError("");
      toast.success("Mã OTP đã được gửi đến email của bạn!");
    } catch (error) {
      console.error("Gửi mã OTP thất bại:", error);
      setError("Gửi mã OTP thất bại. Vui lòng kiểm tra lại email.");
      setOtpSent(false);
      setSecondsLeft(0);
      toast.error("Gửi mã OTP thất bại. Vui lòng kiểm tra lại email.");
    } finally {
      setLoadingOtp(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    if (!validatePassword(value)) {
      setPasswordError("Mật khẩu phải có ít nhất 8 ký tự và 1 ký tự đặc biệt.");
    } else {
      setPasswordError("");
    }
  };

  const validatePassword = (password: string): boolean => {
    const minLength = 8;
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    return password.length >= minLength && specialCharRegex.test(password);
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { label: "", color: "", width: 0 };
    if (password.length < 6) return { label: "Yếu", color: colors.error[500], width: 25 };
    if (password.length < 8) return { label: "Trung bình", color: colors.warning[500], width: 50 };
    if (validatePassword(password)) return { label: "Mạnh", color: colors.success[500], width: 100 };
    return { label: "Trung bình", color: colors.warning[500], width: 75 };
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: colors.background.gradient.primary,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: { xs: 2, md: 4 },
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(circle at 70% 30%, rgba(255,255,255,0.08) 0%, transparent 50%)",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"grain\" width=\"100\" height=\"100\" patternUnits=\"userSpaceOnUse\"><circle cx=\"25\" cy=\"25\" r=\"1\" fill=\"%23ffffff\" opacity=\"0.05\"/><circle cx=\"75\" cy=\"75\" r=\"1\" fill=\"%23ffffff\" opacity=\"0.05\"/><circle cx=\"50\" cy=\"10\" r=\"0.5\" fill=\"%23ffffff\" opacity=\"0.03\"/></pattern></defs><rect width=\"100\" height=\"100\" fill=\"url(%23grain)\"/></svg>')",
          opacity: 0.3,
        }
      }}
    >
      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 2 }}>
        <Card
          elevation={0}
          sx={{
            borderRadius: 5,
            overflow: "hidden",
            boxShadow: "0 25px 80px rgba(0,0,0,0.15)",
            border: `1px solid ${colors.border.light}`,
            backdropFilter: "blur(20px)",
            background: "rgba(255,255,255,0.98)"
          }}
        >
          {/* Header Section */}
          <Box
            sx={{
              background: colors.background.gradient.dark,
              color: "white",
              py: 5,
              px: 4,
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.05) 50%, transparent 70%)",
                transform: "translateX(-100%)",
                animation: "shimmer 3s infinite"
              },
              "@keyframes shimmer": {
                "0%": { transform: "translateX(-100%)" },
                "100%": { transform: "translateX(100%)" }
              }
            }}
          >
            <Box sx={{ position: "relative", zIndex: 1 }}>
              {/* Logo Section */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 3
                }}
              >
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${colors.accent.blue}, ${colors.accent.indigo})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                    boxShadow: "0 8px 25px rgba(6, 182, 212, 0.3)",
                    position: "relative",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      inset: -2,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${colors.accent.blue}, ${colors.accent.indigo})`,
                      opacity: 0.3,
                      filter: "blur(6px)"
                    }
                  }}
                >
                  <img
                    src={Logoweb}
                    alt="EduHubVN Logo"
                    style={{
                      height: 30,
                      filter: "brightness(0) invert(1)",
                      position: "relative",
                      zIndex: 1
                    }}
                  />
                </Box>
              </Box>

              {/* Brand Info */}
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                    mb: 0.5,
                    background: `linear-gradient(135deg, #ffffff, ${colors.accent.blue})`,
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                  }}
                >
                  EduHubVN
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    opacity: 0.9,
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    letterSpacing: "1px",
                    fontFamily: "'Inter', sans-serif",
                    color: colors.accent.blue
                  }}
                >
                  EDUCATION PLATFORM
                </Typography>
              </Box>

              {/* Welcome Text */}
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    mb: 1,
                    fontSize: { xs: "1.3rem", md: "1.5rem" }
                  }}
                >
                  Tạo tài khoản mới
                </Typography>
                {/* <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.85,
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400
                  }}
                >
                  Bắt đầu hành trình học tập cùng chúng tôi
                </Typography> */}
              </Box>
            </Box>
          </Box>

          {/* Form Section */}
          <CardContent sx={{ p: { xs: 4, md: 6 } }}>
            <Box component="form" onSubmit={handleRegister}>
              {/* Email Field */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    color: colors.text.secondary,
                    mb: 1.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 1
                  }}
                >
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${colors.accent.indigo}, ${colors.accent.blue})`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Email sx={{ fontSize: 12, color: "white" }} />
                  </Box>
                  Địa chỉ email
                </Typography>
                <TextField
                  fullWidth
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@eduhubvn.com"
                  required
                  variant="outlined"
                  error={!!error && error.includes("email")}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 4,
                      fontFamily: "'Inter', sans-serif",
                      backgroundColor: colors.background.secondary,
                      fontSize: "1rem",
                      transition: "all 0.3s ease",
                      "& fieldset": {
                        borderColor: colors.border.light,
                        borderWidth: 2
                      },
                      "&:hover fieldset": {
                        borderColor: colors.border.medium
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: colors.primary[600],
                        boxShadow: `0 0 0 3px ${colors.primary[50]}`
                      }
                    },
                    "& .MuiInputBase-input": {
                      py: 2
                    }
                  }}
                />
              </Box>

              {/* Password Field */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    color: colors.text.secondary,
                    mb: 1.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 1
                  }}
                >
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${colors.accent.indigo}, ${colors.accent.blue})`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Lock sx={{ fontSize: 12, color: "white" }} />
                  </Box>
                  Mật khẩu
                </Typography>
                <TextField
                  fullWidth
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Tối thiểu 8 ký tự, có ký tự đặc biệt"
                  required
                  variant="outlined"
                  error={!!passwordError}
                  helperText={passwordError}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ 
                            color: colors.primary[600],
                            "&:hover": {
                              backgroundColor: colors.primary[50]
                            }
                          }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 4,
                      fontFamily: "'Inter', sans-serif",
                      backgroundColor: colors.background.secondary,
                      fontSize: "1rem",
                      transition: "all 0.3s ease",
                      "& fieldset": {
                        borderColor: colors.border.light,
                        borderWidth: 2
                      },
                      "&:hover fieldset": {
                        borderColor: colors.border.medium
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: colors.primary[600],
                        boxShadow: `0 0 0 3px ${colors.primary[50]}`
                      }
                    },
                    "& .MuiInputBase-input": {
                      py: 2
                    }
                  }}
                />
                
                {/* Password Strength Indicator */}
                {password && (
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                      <Typography variant="caption" sx={{ color: colors.text.tertiary }}>
                        Độ mạnh mật khẩu:
                      </Typography>
                      <Chip
                        label={passwordStrength.label}
                        size="small"
                        sx={{
                          bgcolor: passwordStrength.color,
                          color: "white",
                          fontSize: "0.7rem"
                        }}
                      />
                    </Box>
                    <Box
                      sx={{
                        width: "100%",
                        height: 4,
                        bgcolor: colors.neutral[200],
                        borderRadius: 2,
                        overflow: "hidden"
                      }}
                    >
                      <Box
                        sx={{
                          width: `${passwordStrength.width}%`,
                          height: "100%",
                          bgcolor: passwordStrength.color,
                          transition: "all 0.3s ease"
                        }}
                      />
                    </Box>
                  </Box>
                )}
              </Box>

              {/* Confirm Password Field */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    color: colors.text.secondary,
                    mb: 1.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 1
                  }}
                >
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${colors.accent.indigo}, ${colors.accent.blue})`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <CheckCircle sx={{ fontSize: 12, color: "white" }} />
                  </Box>
                  Xác nhận mật khẩu
                </Typography>
                <TextField
                  fullWidth
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  required
                  variant="outlined"
                  error={!!error && error.includes("khớp")}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          sx={{ 
                            color: colors.primary[600],
                            "&:hover": {
                              backgroundColor: colors.primary[50]
                            }
                          }}
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 4,
                      fontFamily: "'Inter', sans-serif",
                      backgroundColor: colors.background.secondary,
                      fontSize: "1rem",
                      transition: "all 0.3s ease",
                      "& fieldset": {
                        borderColor: colors.border.light,
                        borderWidth: 2
                      },
                      "&:hover fieldset": {
                        borderColor: colors.border.medium
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: colors.primary[600],
                        boxShadow: `0 0 0 3px ${colors.primary[50]}`
                      }
                    },
                    "& .MuiInputBase-input": {
                      py: 2
                    }
                  }}
                />
              </Box>

              {/* OTP Section */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    color: colors.text.secondary,
                    mb: 1.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 1
                  }}
                >
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${colors.accent.indigo}, ${colors.accent.blue})`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Security sx={{ fontSize: 12, color: "white" }} />
                  </Box>
                  Mã xác thực OTP
                </Typography>
                
                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                  <TextField
                    fullWidth
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder={otpSent ? "Nhập mã OTP từ email" : "Nhấn gửi OTP trước"}
                    disabled={!otpSent}
                    required={otpSent}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 4,
                        fontFamily: "'Inter', sans-serif",
                        backgroundColor: colors.background.secondary,
                        fontSize: "1rem",
                        "& fieldset": {
                          borderColor: colors.border.light,
                          borderWidth: 2
                        },
                        "&:hover fieldset": {
                          borderColor: colors.border.medium
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: colors.primary[600],
                          boxShadow: `0 0 0 3px ${colors.primary[50]}`
                        }
                      },
                      "& .MuiInputBase-input": {
                        py: 2
                      }
                    }}
                  />
                  <Button
                    variant="outlined"
                    onClick={handleSendOtp}
                    disabled={secondsLeft > 0 || loadingOtp || !email}
                    sx={{
                      fontFamily: "'Inter', sans-serif",
                      borderColor: colors.primary[500],
                      color: colors.primary[600],
                      borderWidth: 2,
                      px: 3,
                      borderRadius: 4,
                      textTransform: "none",
                      fontWeight: 600,
                      minWidth: 120,
                      "&:hover": {
                        borderColor: colors.primary[600],
                        backgroundColor: colors.primary[50]
                      },
                      "&:disabled": {
                        borderColor: colors.neutral[300],
                        color: colors.neutral[400]
                      }
                    }}
                  >
                    {loadingOtp ? "Đang gửi..." : secondsLeft > 0 ? `${secondsLeft}s` : otpSent ? "Gửi lại" : "Gửi OTP"}
                  </Button>
                </Box>

                {otpSent && (
                  <Alert 
                    severity="info" 
                    sx={{ 
                      borderRadius: 3,
                      "& .MuiAlert-message": {
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.9rem"
                      }
                    }}
                  >
                    Mã OTP đã được gửi đến email {email}. Vui lòng kiểm tra hộp thư.
                  </Alert>
                )}
              </Box>

              {/* Error Message */}
              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3,
                    borderRadius: 3,
                    "& .MuiAlert-message": {
                      fontFamily: "'Inter', sans-serif"
                    }
                  }}
                >
                  {error}
                </Alert>
              )}

              {/* Register Button */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading || !otpSent}
                endIcon={!loading && <ArrowForward />}
                sx={{
                  fontFamily: "'Inter', sans-serif",
                  background: colors.background.gradient.secondary,
                  py: 2.5,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  borderRadius: 4,
                  textTransform: "none",
                  boxShadow: `0 8px 25px ${hexToRgba(colors.primary[500], 0.3)}`,
                  "&:hover": {
                    background: `linear-gradient(135deg, ${colors.primary[600]} 0%, ${colors.secondary[700]} 100%)`,
                    transform: "translateY(-2px)",
                    boxShadow: `0 12px 35px ${hexToRgba(colors.primary[500], 0.4)}`
                  },
                  "&:disabled": {
                    background: colors.neutral[300],
                    color: colors.neutral[500],
                    transform: "none",
                    boxShadow: "none"
                  }
                }}
              >
                {loading ? "Đang đăng ký..." : "Tạo tài khoản"}
              </Button>
            </Box>
          </CardContent>

          {/* Footer Section */}
          <Box
            sx={{
              borderTop: `1px solid ${colors.border.light}`,
              p: 4,
              textAlign: "center",
              background: colors.background.tertiary
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: colors.text.tertiary,
                fontFamily: "'Inter', sans-serif",
                mb: 3
              }}
            >
              Bạn đã có tài khoản?
            </Typography>
            <Button
              variant="outlined"
              onClick={() => navigate("/login")}
              sx={{
                fontFamily: "'Inter', sans-serif",
                borderColor: colors.primary[500],
                color: colors.primary[600],
                borderWidth: 2,
                px: 6,
                py: 2,
                borderRadius: 4,
                textTransform: "none",
                fontWeight: 600,
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: colors.primary[600],
                  color: colors.primary[700],
                  backgroundColor: colors.primary[50],
                  transform: "translateY(-1px)",
                  boxShadow: `0 4px 12px ${hexToRgba(colors.primary[500], 0.2)}`
                }
              }}
            >
              Đăng nhập ngay
            </Button>
          </Box>
        </Card>

        {/* Additional Info */}
        <Box sx={{ mt: 6, textAlign: "center" }}>
          <Typography
            variant="caption"
            sx={{
              color: "rgba(255,255,255,0.8)",
              fontFamily: "'Inter', sans-serif",
              lineHeight: 1.6
            }}
          >
            Bằng việc đăng ký, bạn đồng ý với{" "}
            <Box
              component="span"
              sx={{ 
                color: colors.accent.blue,
                textDecoration: "underline", 
                cursor: "pointer",
                "&:hover": {
                  color: "white"
                }
              }}
            >
              Điều khoản sử dụng
            </Box>{" "}
            và{" "}
            <Box
              component="span"
              sx={{ 
                color: colors.accent.blue,
                textDecoration: "underline", 
                cursor: "pointer",
                "&:hover": {
                  color: "white"
                }
              }}
            >
              Chính sách bảo mật
            </Box>{" "}
            của chúng tôi
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Register;
