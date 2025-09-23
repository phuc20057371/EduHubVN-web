import {
  ArrowBack,
  ArrowForward,
  CheckCircle,
  Email,
  Lock,
  Security,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Logoweb from "../../assets/Eduhub_logo_new.png";
import { useColors } from "../../hooks/useColors";
import { API } from "../../utils/Fetch";

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
  const colors = useColors();
  const navigate = useNavigate();

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
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
    } catch (error: any) {
      if (error.response?.data?.message?.includes("Email already exists")) {
        toast.error("Email đã được sử dụng.");
      } else {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
      }
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
    } catch (error: any) {
      if (error.response?.data?.message?.includes("Email already exists")) {
        toast.error("Email đã được sử dụng.");
      } else {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
      }
      console.error("Gửi mã OTP thất bại:", error);
      setError("Gửi mã OTP thất bại. Vui lòng kiểm tra lại email.");
      setOtpSent(false);
      setSecondsLeft(0);
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
    if (password.length < 6)
      return { label: "Yếu", color: colors.error[500], width: 25 };
    if (password.length < 8)
      return { label: "Trung bình", color: colors.warning[500], width: 50 };
    if (validatePassword(password))
      return { label: "Mạnh", color: colors.success[500], width: 100 };
    return { label: "Trung bình", color: colors.warning[500], width: 75 };
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: colors.isDark ? colors.gradients.primary : "white",
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
          background:
            "radial-gradient(circle at 70% 30%, rgba(255,255,255,0.08) 0%, transparent 50%)",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="%23ffffff" opacity="0.05"/><circle cx="75" cy="75" r="1" fill="%23ffffff" opacity="0.05"/><circle cx="50" cy="10" r="0.5" fill="%23ffffff" opacity="0.03"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>\')',
          opacity: 0.3,
        },
      }}
    >
      {/* Back Button */}
      <Box
        sx={{
          position: "fixed",
          top: 24,
          left: 24,
          zIndex: 1000,
        }}
      >
        <Tooltip title="Quay lại trang chủ" placement="right">
          <IconButton
            onClick={() => navigate("/guest")}
            sx={{
              backgroundColor: colors.isDark
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.05)",
              color: colors.isDark ? "white" : colors.text.primary,
              backdropFilter: "blur(10px)",
              border: colors.isDark
                ? "1px solid rgba(255,255,255,0.1)"
                : "1px solid rgba(0,0,0,0.1)",
              "&:hover": {
                backgroundColor: colors.isDark
                  ? "rgba(255,255,255,0.2)"
                  : "rgba(0,0,0,0.1)",
                transform: "translateX(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <ArrowBack />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Theme Toggle */}
      {/* <Box
        sx={{
          position: "fixed",
          top: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        <ThemeToggle />
      </Box> */}

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 2 }}>
        <Card
          elevation={0}
          sx={{
            borderRadius: 1,
            overflow: "hidden",
            boxShadow: colors.isDark
              ? "0 25px 80px rgba(0,0,0,0.4)"
              : "0 25px 80px rgba(0,0,0,0.15)",
            border: colors.isDark
              ? `1px solid ${alpha(colors.text.primary, 0.1)}`
              : `1px solid ${colors.border.light}`,
            backdropFilter: "blur(20px)",
            background: colors.isDark
              ? "rgba(30,30,30,0.95)"
              : "rgba(255,255,255,0.98)",
          }}
        >
          <Box
            sx={{
              background: colors.gradients.primary,
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
                background:
                  "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.05) 50%, transparent 70%)",
                transform: "translateX(-100%)",
                animation: "shimmer 3s infinite",
              },
              "@keyframes shimmer": {
                "0%": { transform: "translateX(-100%)" },
                "100%": { transform: "translateX(100%)" },
              },
            }}
          >
            <Box sx={{ position: "relative", zIndex: 1 }}>
              {/* Logo Section */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 3,
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={Logoweb}
                    alt="EduHubVN Logo"
                    style={{
                      height: 60,
                      filter: colors.isDark
                        ? "brightness(0) invert(1)"
                        : "none",
                      position: "relative",
                      zIndex: 1,
                    }}
                  />
                </Box>
              </Box>

              {/* Welcome Text */}
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: { xs: "1.3rem", md: "1.5rem" },
                    color: colors.text.primary,
                  }}
                >
                  Chào mừng đến với EduhubVN!
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Form Section */}
          <CardContent
            sx={{
              p: { xs: 4, md: 6 },
            }}
          >
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
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: 1,
                      background: `linear-gradient(135deg, ${colors.accent.blue}, ${colors.accent.blue})`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
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
                      borderRadius: 1,
                      fontFamily: "'Inter', sans-serif",
                      backgroundColor: colors.isDark
                        ? alpha(colors.background.primary, 0.5)
                        : colors.background.secondary,
                      fontSize: "1rem",
                      transition: "all 0.3s ease",
                      "& fieldset": {
                        borderColor: colors.isDark
                          ? alpha(colors.text.primary, 0.2)
                          : colors.border.light,
                        borderWidth: 2,
                      },
                      "&:hover fieldset": {
                        borderColor: colors.isDark
                          ? alpha(colors.text.primary, 0.3)
                          : colors.border.medium,
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: colors.primary.main,
                        boxShadow: `0 0 0 3px ${colors.primary.light}`,
                      },
                    },
                    "& .MuiInputBase-input": {
                      py: 2,
                    },
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
                    gap: 1,
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
                      justifyContent: "center",
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
                            color: colors.primary.main,
                            "&:hover": {
                              backgroundColor: colors.primary.light,
                            },
                          }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1,
                      fontFamily: "'Inter', sans-serif",
                      backgroundColor: colors.isDark
                        ? alpha(colors.background.primary, 0.5)
                        : colors.background.secondary,
                      fontSize: "1rem",
                      transition: "all 0.3s ease",
                      "& fieldset": {
                        borderColor: colors.isDark
                          ? alpha(colors.text.primary, 0.2)
                          : colors.border.light,
                        borderWidth: 2,
                      },
                      "&:hover fieldset": {
                        borderColor: colors.isDark
                          ? alpha(colors.text.primary, 0.3)
                          : colors.border.medium,
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: colors.primary.main,
                        boxShadow: `0 0 0 3px ${colors.primary.light}`,
                      },
                    },
                    "& .MuiInputBase-input": {
                      py: 2,
                    },
                  }}
                />

                {/* Password Strength Indicator */}
                {password && (
                  <Box sx={{ mt: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{ color: colors.text.secondary }}
                      >
                        Độ mạnh mật khẩu:
                      </Typography>
                      <Chip
                        label={passwordStrength.label}
                        size="small"
                        sx={{
                          bgcolor: passwordStrength.color,
                          color: "white",
                          fontSize: "0.7rem",
                        }}
                      />
                    </Box>
                    <Box
                      sx={{
                        width: "100%",
                        height: 4,
                        bgcolor: colors.neutral[200],
                        borderRadius: 2,
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          width: `${passwordStrength.width}%`,
                          height: "100%",
                          bgcolor: passwordStrength.color,
                          transition: "all 0.3s ease",
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
                    gap: 1,
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
                      justifyContent: "center",
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
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          edge="end"
                          sx={{
                            color: colors.primary.main,
                            "&:hover": {
                              backgroundColor: colors.primary.light,
                            },
                          }}
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1,
                      fontFamily: "'Inter', sans-serif",
                      backgroundColor: colors.isDark
                        ? alpha(colors.background.primary, 0.5)
                        : colors.background.secondary,
                      fontSize: "1rem",
                      transition: "all 0.3s ease",
                      "& fieldset": {
                        borderColor: colors.isDark
                          ? alpha(colors.text.primary, 0.2)
                          : colors.border.light,
                        borderWidth: 2,
                      },
                      "&:hover fieldset": {
                        borderColor: colors.isDark
                          ? alpha(colors.text.primary, 0.3)
                          : colors.border.medium,
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: colors.primary.main,
                        boxShadow: `0 0 0 3px ${colors.primary.light}`,
                      },
                    },
                    "& .MuiInputBase-input": {
                      py: 2,
                    },
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
                    gap: 1,
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
                      justifyContent: "center",
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
                    placeholder={
                      otpSent ? "Nhập mã OTP từ email" : "Nhấn gửi OTP trước"
                    }
                    disabled={!otpSent}
                    required={otpSent}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1,
                        fontFamily: "'Inter', sans-serif",
                        backgroundColor: colors.isDark
                          ? alpha(colors.background.primary, 0.5)
                          : colors.background.secondary,
                        fontSize: "1rem",
                        "& fieldset": {
                          borderColor: colors.isDark
                            ? alpha(colors.text.primary, 0.2)
                            : colors.border.light,
                          borderWidth: 2,
                        },
                        "&:hover fieldset": {
                          borderColor: colors.isDark
                            ? alpha(colors.text.primary, 0.3)
                            : colors.border.medium,
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: colors.primary.main,
                          boxShadow: `0 0 0 3px ${colors.primary.light}`,
                        },
                      },
                      "& .MuiInputBase-input": {
                        py: 2,
                      },
                    }}
                  />
                  <Button
                    variant="outlined"
                    onClick={handleSendOtp}
                    disabled={secondsLeft > 0 || loadingOtp || !email}
                    sx={{
                      fontFamily: "'Inter', sans-serif",
                      borderColor: colors.primary.main,
                      color: colors.primary.main,
                      borderWidth: 2,
                      px: 3,
                      borderRadius: 1,
                      textTransform: "none",
                      fontWeight: 600,
                      minWidth: 120,
                      "&:hover": {
                        borderColor: colors.primary.main,
                        backgroundColor: colors.primary.light,
                      },
                      "&:disabled": {
                        borderColor: colors.neutral[300],
                        color: colors.neutral[400],
                      },
                    }}
                  >
                    {loadingOtp
                      ? "Đang gửi..."
                      : secondsLeft > 0
                        ? `${secondsLeft}s`
                        : otpSent
                          ? "Gửi lại"
                          : "Gửi OTP"}
                  </Button>
                </Box>

                {otpSent && (
                  <Alert
                    severity="info"
                    sx={{
                      borderRadius: 3,
                      "& .MuiAlert-message": {
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.9rem",
                      },
                    }}
                  >
                    Mã OTP đã được gửi đến email {email}. Vui lòng kiểm tra hộp
                    thư.
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
                      fontFamily: "'Inter', sans-serif",
                    },
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
                  background: colors.isDark
                    ? colors.gradients.primary
                    : colors.gradients.secondary,
                  py: 2.5,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  borderRadius: 1,
                  textTransform: "none",
                  color: "white",
                  boxShadow: `0 8px 25px ${alpha(colors.primary.main, 0.3)}`,
                  "&:hover": {
                    background: colors.isDark
                      ? colors.gradients.secondary
                      : `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.secondary.dark} 100%)`,
                    transform: "translateY(-2px)",
                    boxShadow: `0 12px 35px ${alpha(colors.primary.main, 0.4)}`,
                  },
                  "&:disabled": {
                    background: colors.isDark
                      ? alpha(colors.text.primary, 0.1)
                      : colors.neutral[300],
                    color: colors.isDark
                      ? alpha(colors.text.primary, 0.3)
                      : colors.neutral[500],
                    transform: "none",
                    boxShadow: "none",
                  },
                }}
              >
                {loading ? "Đang đăng ký..." : "Tạo tài khoản"}
              </Button>
            </Box>
          </CardContent>

          {/* Footer Section */}
          <Box
            sx={{
              borderTop: colors.isDark
                ? `1px solid ${alpha(colors.text.primary, 0.1)}`
                : `1px solid ${colors.border.light}`,
              p: 4,
              textAlign: "center",
              background: colors.isDark
                ? colors.background.secondary
                : colors.background.primary,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: colors.text.secondary,
                fontFamily: "'Inter', sans-serif",
                mb: 3,
              }}
            >
              Bạn đã có tài khoản?
            </Typography>
            <Button
              variant="outlined"
              onClick={() => navigate("/login")}
              sx={{
                fontFamily: "'Inter', sans-serif",
                borderColor: colors.primary.main,
                color: colors.isDark ? "white" : colors.primary.main,
                borderWidth: 2,
                px: 6,
                py: 2,
                borderRadius: 1,
                textTransform: "none",
                fontWeight: 600,
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: colors.primary.main,
                  color: colors.isDark ? "white" : colors.primary.dark,
                  backgroundColor: colors.isDark
                    ? alpha(colors.primary.main, 0.2)
                    : colors.primary.light,
                  transform: "translateY(-1px)",
                  boxShadow: `0 4px 12px ${alpha(colors.primary.main, 0.2)}`,
                },
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
              color: colors.isDark
                ? "rgba(255,255,255,0.8)"
                : "rgba(0,0,0,0.6)",
              fontFamily: "'Inter', sans-serif",
              lineHeight: 1.6,
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
                  color: "white",
                },
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
                  color: "white",
                },
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
