import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { API } from "../../utils/Fetch";
// import GoogleIcon from "@mui/icons-material/Google";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Logoweb from "../../assets/eduhub-02.png"

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    API.auth
      .login({ email, password })
      .then((response: any) => {
        localStorage.setItem("accessToken", response.data.data.accessToken);
        localStorage.setItem("refreshToken", response.data.data.refreshToken);
        console.log(response.data);

        navigate("/");
      })
      .catch((error: any) => {
        console.error("Đăng nhập thất bại:", error);
        toast.error(
          "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.",
        );
      });
  };
  // function openLoginPopup() {
  //   const width = 500;
  //   const height = 600;
  //   const left = (window.screen.width - width) / 2;
  //   const top = (window.screen.height - height) / 2;
  //   // const popup = window.open('http://localhost:8080/oauth2/authorization/github?redirect_uri=http://localhost:3000/', 'Login with Google',
  //   //   `width=${width},height=${height},top=${top},left=${left}`);
  //   const popup = window.open(
  //     `http://${window.location.hostname}:8080/oauth2/authorization/google`,
  //     "Login with Google",
  //     `width=${width},height=${height},top=${top},left=${left}`,
  //   );

  //   // Monitor the popup for changes

  //   // const redirectUri = `${window.location.origin}/oauth2/redirect`;
  //   // const popup = window.open(
  //   //   `http://demoportal.ccvi.com.vn:8080/oauth2/authorization/google?redirect_uri=${redirectUri}`,
  //   //   "Login with Google",
  //   //   `width=${width},height=${height},top=${top},left=${left}`,
  //   // );

  //   if (popup) {
  //     const interval = setInterval(() => {
  //       if (popup.closed) {
  //         clearInterval(interval);
  //         console.log("Popup closed");
  //         navigate("/");
  //       }
  //     }, 500);
  //   }
  // }

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={4}
        sx={{
          padding: 5,
          marginTop: 10,
          borderRadius: 3,
          backgroundColor: "#f9fbfd",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <Box textAlign="center" mb={3}>
          <img
            src={Logoweb}
            alt="EduhubVN Logo"
            style={{ height: 60 }}
          />
        </Box>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ color: "#1a237e", fontWeight: "bold" }}
        >
          Đăng nhập EduhubVN
        </Typography>

        <Box component="form" onSubmit={handleLogin} mt={3}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Mật khẩu"
            type={showPassword ? "text" : "password"}
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              marginTop: 3,
              paddingY: 1.5,
              backgroundColor: "#1a73e8",
              ":hover": { backgroundColor: "#1669c1" },
              fontWeight: "bold",
            }}
          >
            Đăng nhập
          </Button>
        </Box>

        <Typography
          variant="body2"
          align="center"
          mt={3}
          sx={{ color: "gray" }}
        >
          Bạn chưa có tài khoản?{" "}
          <a
            href="/register"
            style={{ color: "#1976d2", textDecoration: "none" }}
          >
            Đăng ký ngay
          </a>
        </Typography>

        {/* <Divider sx={{ marginY: 3 }}>Hoặc</Divider> */}

        {/* <Box textAlign="center">
          <Button
            variant="outlined"
            onClick={openLoginPopup}
            startIcon={<GoogleIcon />}
            sx={{
              textTransform: "none",
              borderColor: "#4285f4",
              color: "#4285f4",
              ":hover": {
                backgroundColor: "#e8f0fe",
                borderColor: "#4285f4",
              },
              fontWeight: "bold",
            }}
          >
            Đăng nhập bằng Google
          </Button>
        </Box> */}
      </Paper>
    </Container>
  );
};
export default Login;
