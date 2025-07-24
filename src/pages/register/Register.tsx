import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Container,
    Paper,
    TextField,
    Typography
} from "@mui/material";
import { API } from "../../utils/Fetch";
import GoogleIcon from '@mui/icons-material/Google';

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(0);
    const [error, setError] = useState("");

    const [passwordError, setPasswordError] = useState("");

    useEffect(() => {
        let interval: number;
        if (secondsLeft > 0) {
            interval = setInterval(() => {
                setSecondsLeft(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [secondsLeft]);

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Mật khẩu không khớp");
            return;
        }

        setError("");
        console.log("Đăng ký thành công:");
        console.log({ email, password });

        // TODO: Gửi dữ liệu đến backend

        API.auth.register({ email, password, otp })
            .then((response) => {
                console.log("Đăng ký thành công:", response.data);
                localStorage.setItem("accessToken", response.data.data.accessToken);
                localStorage.setItem("refreshToken", response.data.data.refreshToken);
                window.location.href = "/"; 
            })
            .catch((error) => {
                console.error("Đăng ký thất bại:", error);
                alert("Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.");
            });
    };
    const handleSendOtp = () => {
        if (!email) {
            setError("Vui lòng nhập email");
            return;
        }

        setOtpSent(true);
        setSecondsLeft(30); // bắt đầu đếm ngược

        API.auth.sendOtp(email)
            .then((response) => {
                console.log("Mã OTP đã được gửi:", response.data.data);
                setError("");
            })
            .catch((error) => {
                console.error("Gửi mã OTP thất bại:", error);
                setError("Gửi mã OTP thất bại. Vui lòng kiểm tra lại email.");
                setOtpSent(false); // nếu lỗi thì cho phép gửi lại ngay
                setSecondsLeft(0);
            });
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

    function openLoginPopup() {
        const width = 500;
        const height = 600;

        const left = (window.screen.width - width) / 2;
        const top = (window.screen.height - height) / 2;

        // const popup = window.open('http://localhost:8080/oauth2/authorization/github?redirect_uri=http://localhost:3000/', 'Login with Google',
        //   `width=${width},height=${height},top=${top},left=${left}`);

        // const popup = window.open('http://localhost:8080/oauth2/authorization/google', 'Login with Google',
        //     `width=${width},height=${height},top=${top},left=${left}`);
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
                    Đăng ký
                </Typography>
                <Box component="form" onSubmit={handleRegister}>
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
                        type="password"
                        margin="normal"
                        value={password}
                        error={!!passwordError}
                        helperText={passwordError}
                        // onChange={(e) => setPassword(e.target.value)}
                        onChange={handlePasswordChange}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Xác nhận mật khẩu"
                        type="password"
                        margin="normal"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        error={!!error}
                        helperText={error}
                    />
                    <TextField
                        fullWidth
                        label="Mã OTP"
                        type="text"
                        margin="normal"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        disabled={!otpSent}
                        required={otpSent}
                    />
                    <Button
                        variant="outlined"
                        color="primary"
                        fullWidth
                        onClick={handleSendOtp}
                        disabled={secondsLeft > 0}
                        sx={{ marginTop: 2 }}
                    >
                        {secondsLeft > 0 ? `Gửi lại (${secondsLeft}s)` : otpSent ? "Gửi lại" : "Gửi mã OTP"}
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ marginTop: 2 }}
                    >
                        Đăng ký
                    </Button>
                    <p style={{ textAlign: "center", marginTop: 16 }}>
                        Bạn đã có tài khoản?{" "}
                        <a href="/login" style={{ textDecoration: "none", color: "#1976d2" }}>
                            Đăng nhập ngay
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

export default Register;
