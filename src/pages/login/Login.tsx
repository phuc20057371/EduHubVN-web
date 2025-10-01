import {
  ArrowBack,
  ArrowForward,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Logoweb from "../../assets/Eduhub_logo_new.png";
import { useColors } from "../../hooks/useColors";
import { API } from "../../utils/Fetch";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const colors = useColors();
  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await API.auth.login({ email, password });
      localStorage.setItem("accessToken", response.data.data.accessToken);
      localStorage.setItem("refreshToken", response.data.data.refreshToken);
      toast.success("Đăng nhập thành công!");
      navigate("/");
    } catch (error: any) {
      console.error("Đăng nhập thất bại:", error);
      toast.error(
        "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: colors.background.primary,
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
            "radial-gradient(circle at 30% 70%, rgba(255,255,255,0.08) 0%, transparent 50%)",
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
        <ThemeToggle showLabels={true} />
      </Box> */}

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 2 }}>
        <Card
          elevation={0}
          sx={{
            borderRadius: 1,
            overflow: "hidden",
            boxShadow: "0 25px 80px rgba(0,0,0,0.15)",
            border: `1px solid ${colors.border.light}`,
            backdropFilter: "blur(20px)",
           
          }}
        >
          {/* Enhanced Header Section */}
          <Box
            sx={{
              background: colors.isDark
                ? colors.gradients.primary
                : colors.primary.main,
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
                  }}
                >
                  Chào mừng trở lại!
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Enhanced Form Section */}
          <CardContent sx={{ p: { xs: 4, md: 6 } }}>
            <Box component="form" onSubmit={handleLogin}>
              {/* Email Field */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    color: colors.text.primary,
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

                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Email sx={{ fontSize: 12, color: colors.text.primary }} />
                  </Box>
                  Địa chỉ email
                </Typography>
                <TextField
                  fullWidth
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@eduhubvn.com"
                  required
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1,
                      fontFamily: "'Inter', sans-serif",
                      backgroundColor: colors.background.secondary,
                      fontSize: "1rem",
                      transition: "all 0.3s ease",
                      "& fieldset": {
                        borderColor: colors.border.light,
                        borderWidth: 2,
                      },
                      "&:hover fieldset": {
                        borderColor: colors.border.medium,
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: colors.primary.dark,
                        boxShadow: `0 0 0 3px ${alpha(colors.primary.light, 0.3)}`,
                      },
                    },
                    "& .MuiInputBase-input": {
                      py: 2,
                    },
                  }}
                />
              </Box>

              {/* Password Field */}
              <Box sx={{ mb: 5 }}>
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

                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Lock sx={{ fontSize: 12, color: colors.text.primary }} />
                  </Box>
                  Mật khẩu
                </Typography>
                <TextField
                  fullWidth
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu của bạn"
                  required
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          sx={{
                            color: colors.primary.dark,
                            "&:hover": {
                              backgroundColor: alpha(colors.primary.light, 0.3),
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
                      backgroundColor: colors.background.secondary,
                      fontSize: "1rem",
                      transition: "all 0.3s ease",
                      "& fieldset": {
                        borderColor: colors.border.light,
                        borderWidth: 2,
                      },
                      "&:hover fieldset": {
                        borderColor: colors.border.medium,
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: colors.primary.dark,
                        boxShadow: `0 0 0 3px ${alpha(colors.primary.light, 0.3)}`,
                      },
                    },
                    "& .MuiInputBase-input": {
                      py: 2,
                    },
                  }}
                />
              </Box>

              {/* Login Button */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                endIcon={!loading && <ArrowForward />}
                sx={{
                  fontFamily: "'Inter', sans-serif",
                  background: colors.isDark ? colors.gradients.primary : "none",
                  color: colors.isDark ? "white" : "black",
                  py: 2.5,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  borderRadius: 1,
                  textTransform: "none",
                  boxShadow: `0 8px 25px ${alpha(colors.primary.main, 0.3)}`,
                  border: "none",
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
                      "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)",
                    transform: "translateX(-100%)",
                    transition: "transform 0.6s ease",
                  },
                  "&:hover": {
                    background: `linear-gradient(135deg, ${colors.primary.dark} 0%, ${colors.secondary.dark} 100%)`,
                    transform: "translateY(-2px)",
                    boxShadow: `0 12px 35px ${alpha(colors.primary.main, 0.4)}`,
                    "&::before": {
                      transform: "translateX(100%)",
                    },
                  },
                  "&:disabled": {
                    background: colors.neutral[300],
                    color: colors.neutral[500],
                    transform: "none",
                    boxShadow: "none",
                  },
                }}
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>

              {/* Forgot Password */}
              <Box sx={{ mt: 4, textAlign: "center" }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: colors.text.secondary,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  Quên mật khẩu?{" "}
                  <Box
                    component="span"
                    onClick={() => navigate("/forgot-password")}
                    sx={{
                      color: colors.primary.dark,
                      fontWeight: 600,
                      cursor: "pointer",
                      textDecoration: "none",
                      borderBottom: `1px solid transparent`,
                      transition: "border-color 0.3s ease",
                      "&:hover": {
                        borderBottomColor: colors.primary.dark,
                      },
                    }}
                  >
                    Khôi phục ngay
                  </Box>
                </Typography>
              </Box>
            </Box>
          </CardContent>

          {/* Enhanced Footer Section */}
          <Box
            sx={{
              borderTop: `1px solid ${colors.border.light}`,
              p: 4,
              textAlign: "center",
              background: colors.isDark
                ? colors.gradients.secondary
                : colors.background.secondary,
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
              Bạn chưa có tài khoản?
            </Typography>
            <Button
              variant="outlined"
              onClick={() => navigate("/register")}
              sx={{
                fontFamily: "'Inter', sans-serif",
                borderColor: colors.primary.main,
                color: colors.primary.dark,
                borderWidth: 2,
                px: 6,
                py: 2,
                borderRadius: 1,
                textTransform: "none",
                fontWeight: 600,
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: colors.primary.dark,
                  color: colors.primary.dark,
                  backgroundColor: alpha(colors.primary.light, 0.3),
                  transform: "translateY(-1px)",
                  boxShadow: `0 4px 12px ${alpha(colors.primary.main, 0.2)}`,
                },
              }}
            >
              Đăng ký tài khoản mới
            </Button>
          </Box>
        </Card>

        {/* Enhanced Additional Info */}
        <Box sx={{ mt: 6, textAlign: "center" }}>
          <Typography
            variant="caption"
            sx={{
              color: colors.isDark ? "#ccc" : "#666",
              fontFamily: "'Inter', sans-serif",
              lineHeight: 1.6,
            }}
          >
            Bằng việc đăng nhập, bạn đồng ý với{" "}
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

export default Login;
