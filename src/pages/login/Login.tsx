import {
  ArrowForward,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Logoweb from "../../assets/eduhub-02.png";
import { API } from "../../utils/Fetch";
import { colors, hexToRgba } from "../../theme/colors";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
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
      console.log(response.data);
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
        background: colors.background.gradient.dark,
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
      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 2 }}>
        <Card
          elevation={0}
          sx={{
            borderRadius: 5,
            overflow: "hidden",
            boxShadow: "0 25px 80px rgba(0,0,0,0.15)",
            border: `1px solid ${colors.border.light}`,
            backdropFilter: "blur(20px)",
            background: "rgba(255,255,255,0.98)",
          }}
        >
          {/* Enhanced Header Section */}
          <Box
            sx={{
              background: colors.background.gradient.primary,
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
                      filter: "blur(6px)",
                    },
                  }}
                >
                  <img
                    src={Logoweb}
                    alt="EduHubVN Logo"
                    style={{
                      height: 30,
                      filter: "brightness(0) invert(1)",
                      position: "relative",
                      zIndex: 1,
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
                    background: "white",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
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
                    color: colors.accent.blue,
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
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 4,
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
                        borderColor: colors.primary[600],
                        boxShadow: `0 0 0 3px ${colors.primary[50]}`,
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
                            color: colors.primary[600],
                            "&:hover": {
                              backgroundColor: colors.primary[50],
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
                      borderRadius: 4,
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
                        borderColor: colors.primary[600],
                        boxShadow: `0 0 0 3px ${colors.primary[50]}`,
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
                  background: colors.background.gradient.secondary,
                  py: 2.5,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  borderRadius: 4,
                  textTransform: "none",
                  boxShadow: `0 8px 25px ${hexToRgba(colors.primary[500], 0.3)}`,
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
                    background: `linear-gradient(135deg, ${colors.primary[600]} 0%, ${colors.secondary[700]} 100%)`,
                    transform: "translateY(-2px)",
                    boxShadow: `0 12px 35px ${hexToRgba(colors.primary[500], 0.4)}`,
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
                    color: colors.text.tertiary,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  Quên mật khẩu?{" "}
                  <Box
                    component="span"
                    sx={{
                      color: colors.primary[600],
                      fontWeight: 600,
                      cursor: "pointer",
                      textDecoration: "none",
                      borderBottom: `1px solid transparent`,
                      transition: "border-color 0.3s ease",
                      "&:hover": {
                        borderBottomColor: colors.primary[600],
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
              background: colors.background.tertiary,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: colors.text.tertiary,
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
                  boxShadow: `0 4px 12px ${hexToRgba(colors.primary[500], 0.2)}`,
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
              color: "rgba(255,255,255,0.8)",
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
