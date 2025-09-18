import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import {
  Facebook,
  YouTube,
  Instagram,
  Email,
  Phone,
  LocationOn,
} from "@mui/icons-material";
import ZaloIcon from "./icons/ZaloIcon";
import Logo from "../assets/Eduhub_logo_new.png";
import { Container } from "@mui/system";
import { useColors } from "../hooks/useColors";

const Footer = () => {
  const colors = useColors();

  return (
    <Box
      sx={{
        background: colors.isDark ? colors.gradients.primary : "#ffffff",
        color: colors.isDark ? "white" : colors.text.primary,
        borderTop: colors.isDark
          ? "none"
          : `1px solid ${colors.border.light}`,
        pt: 6,
        pb: 3,
        transition: "all 0.3s ease",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            gap: 4,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          {/* Left section - 35% - Logo and Social Icons */}
          <Box
            sx={{
              flex: { xs: "1 1 100%", md: "0 0 35%" },
              display: "flex",
              flexDirection: "column",
              alignItems: { xs: "center", md: "flex-start" },
            }}
          >
            {/* Logo */}
            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 3 }}>
              <img src={Logo} alt="EduHubVN Logo" style={{ height: 80,  filter: colors.isDark
                        ? "brightness(0) invert(1)"
                        : "none", }} />
            </Box>

            {/* Social Icons */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: { xs: "center", md: "flex-start" },
              }}
            >
              {[
                { icon: Facebook, label: "Facebook" },
                { icon: YouTube, label: "YouTube" },
                { icon: ZaloIcon, label: "Zalo" },
                { icon: Instagram, label: "Instagram" },
              ].map((social, index) => (
                <IconButton
                  key={index}
                  sx={{
                    color: colors.isDark ? "white" : colors.primary.main,
                    bgcolor: colors.isDark
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0, 178, 255, 0.1)",
                    width: 48,
                    height: 48,
                    "&:hover": {
                      bgcolor: colors.primary.main,
                      color: "white",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                  aria-label={social.label}
                >
                  <social.icon />
                </IconButton>
              ))}
            </Box>
          </Box>

          {/* Right section - 65% - Contact Info */}
          <Box
            sx={{
              flex: { xs: "1 1 100%", md: "0 0 65%" },
              display: "flex",
              flexDirection: "column",
              alignItems: { xs: "center", md: "flex-start" },
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mb: 3,
                color: colors.isDark ? "white" : colors.primary.main,
                fontFamily: "'Inter', sans-serif",
                textAlign: { xs: "center", md: "left" },
                fontSize: { xs: "1.25rem", md: "1.5rem" }, // Responsive font size
              }}
            >
              Liên hệ
            </Typography>

            {/* Contact Items */}
            <Box sx={{ width: "100%", maxWidth: "400px" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 3,
                  color: colors.isDark ? "#f3f3f3" : colors.text.secondary,
                  justifyContent: { xs: "center", md: "flex-start" },
                }}
              >
                <Phone
                  sx={{
                    mr: 2,
                    color: colors.isDark ? "white" : colors.primary.main,
                    fontSize: { xs: "1.25rem", md: "1.5rem" }, // Responsive icon size
                  }}
                />
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: "0.95rem", md: "1.1rem" }, // Responsive font size
                    lineHeight: 1.4,
                  }}
                >
                  (+84) 123 456 789
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 3,
                  color: colors.isDark ? "#f3f3f3" : colors.text.secondary,
                  justifyContent: { xs: "center", md: "flex-start" },
                }}
              >
                <Email
                  sx={{
                    mr: 2,
                    color: colors.isDark ? "white" : colors.primary.main,
                    fontSize: { xs: "1.25rem", md: "1.5rem" }, // Responsive icon size
                  }}
                />
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: "0.95rem", md: "1.1rem" }, // Responsive font size
                    lineHeight: 1.4,
                  }}
                >
                  support@eduhubvn.com
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  mb: 3,
                  color: colors.isDark ? "#f3f3f3" : colors.text.secondary,
                  justifyContent: { xs: "center", md: "flex-start" },
                }}
              >
                <LocationOn
                  sx={{
                    mr: 2,
                    color: colors.isDark ? "white" : colors.primary.main,
                    fontSize: { xs: "1.25rem", md: "1.5rem" }, // Responsive icon size
                    mt: 0.2,
                  }}
                />
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: "0.95rem", md: "1.1rem" }, // Responsive font size
                    lineHeight: 1.4, // Consistent line height
                  }}
                >
                  123 Đường ABC, Phường XYZ,
                  <br />
                  Quận 1, TP. Hồ Chí Minh
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Copyright */}
        <Box
          sx={{
            borderTop: colors.isDark
              ? "1px solid rgba(255,255,255,0.1)"
              : `1px solid ${colors.border.light}`,
            mt: 4,
            pt: 3,
            textAlign: "center",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: colors.isDark ? "#f3f3f3" : colors.text.secondary,
              fontSize: "1rem",
            }}
          >
            © 2024 EduHubVN. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;