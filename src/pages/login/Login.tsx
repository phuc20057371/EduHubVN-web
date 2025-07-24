import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { API } from "../../utils/Fetch";
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
  
    API.auth.login({ email, password })
      .then((response: any) => {
        localStorage.setItem("accessToken", response.data.data.accessToken);
        localStorage.setItem("refreshToken", response.data.data.refreshToken);
        console.log(response.data);

        navigate("/");
      })
      .catch((error: any) => {
        console.error("Đăng nhập thất bại:", error);
        toast.error("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.");
      });
  };
  function openLoginPopup() {
    const width = 500;
    const height = 600;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    // const popup = window.open('http://localhost:8080/oauth2/authorization/github?redirect_uri=http://localhost:3000/', 'Login with Google',
    //   `width=${width},height=${height},top=${top},left=${left}`);
    const domain = window.location.hostname;
    const popup = window.open(`http://${domain}:8080/oauth2/authorization/google`, 'Login with Google',
      `width=${width},height=${height},top=${top},left=${left}`);
    // Monitor the popup for changes
    if (popup) {
      const interval = setInterval(() => {
        if (popup.closed) {
          clearInterval(interval);
          // Handle popup closed logic, e.g., reload page or check login status
          console.log("Popup closed");
        }
      }, 500);
    }
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8, borderRadius: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Đăng nhập
        </Typography>
        <Box component="form" onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Email"
            //            type="email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Mật khẩu"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            Đăng nhập
          </Button>
          <p style={{ textAlign: "center", marginTop: 16 }}>
            Bạn chưa có tài khoản?{" "}
            <a href="/register" style={{ textDecoration: "none", color: "#1976d2" }}>
              Đăng ký ngay
            </a>

          </p>
          <div className="flex flex-col items-center justify-center">
            <div>
              <p style={{ textAlign: "center", marginTop: 16 }}>
                Hoặc đăng nhập bằng
              </p>
            </div>
            <Button
              variant="contained"
              onClick={openLoginPopup}
              startIcon={<GoogleIcon />}
              sx={{ marginTop: 2 }}
            >
              Google
            </Button>
          </div>

        </Box>
      </Paper>
    </Container>
  );
};
export default Login;
