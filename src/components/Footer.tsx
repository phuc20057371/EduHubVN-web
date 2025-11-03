import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import {
  Email,
  Phone,
  LocationOn,
} from "@mui/icons-material";
import Logo from "../assets/Eduhub_logo_new.png";
import ZaloIconImg from "./icons/zalo_icon.png";
import FacebookIconImg from "./icons/facebook_icon.png";
import YouTubeIconImg from "./icons/youtube_icon.png";
import InstagramIconImg from "./icons/intagram_icon.png";
import { Container } from "@mui/system";
import { useColors } from "../hooks/useColors";

const Footer = () => {
  const colors = useColors();

  return (
    <Box
      sx={{
        // Use flat dark background requested by product: #0E1D2C
        background: colors.isDark ? '#0E1D2C' : "#ffffff",
        color: colors.isDark ? "#FFFFFF" : colors.text.primary,
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
            gap: 6,
            ml: { xs: 0, md: 0 },
            flexDirection: { xs: "column", md: "row" },
            
          }}
        >
            {/* Left section - 35% - Logo and Social Icons */}
          <Box
            sx={{
              flex: { xs: "1 1 100%", md: "0 0 35%" },
              display: "flex",
              flexDirection: "column",
              alignItems: { xs: "flex-start", md: "flex-start" },
            }}
          >
            {/* Logo */}
            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2, mt: 2, ml: -4 }}>
              <img
                src={Logo}
                alt="EduHubVN Logo"
                style={{
                  height: 80,
                  filter: colors.isDark ? "brightness(0) invert(1)" : "none",
                }}
              />
            </Box>

            {/* Social Icons */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: { xs: "flex-start", md: "flex-start" },
              }}
            >
              {[
                { icon: FacebookIconImg, label: "Facebook" },
                { icon: YouTubeIconImg, label: "YouTube" },
                { icon: ZaloIconImg, label: "Zalo" },
                { icon: InstagramIconImg, label: "Instagram" },
              ].map((social, index) => (
                <IconButton
                  key={index}
                  sx={{
                    bgcolor: colors.primary.main,
                    width: 48,
                    height: 48,
                    "&:hover": {
                      bgcolor: colors.primary.dark || "#0056b3",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                  aria-label={social.label}
                >
                  <img
                    src={social.icon}
                    alt={social.label}
                    style={{
                      width: 24,
                      height: 24,
                      // only invert images in dark mode so they appear white
                      filter: colors.isDark ? "brightness(0) invert(1)" : "none",
                    }}
                  />
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
              alignItems: { xs: "flex-start", md: "flex-start" },
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mb: 3,
                color: colors.isDark ? "white" : colors.primary.main,
                fontFamily: "'Inter', sans-serif",
                textAlign: { xs: "left", md: "left" },
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
                  color: colors.isDark ? "#FFFFFF" : colors.text.secondary,
                  justifyContent: { xs: "flex-start", md: "flex-start" },
                }}
              >
                <Phone
                  sx={{
                    mr: 2,
                    color: colors.isDark ? "#FFFFFF" : colors.primary.main,
                    fontSize: { xs: "1.25rem", md: "1.5rem" }, // Responsive icon size
                  }}
                />
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: "0.95rem", md: "1.1rem" }, // Responsive font size
                    lineHeight: 1.4,
                    color: colors.isDark ? '#FFFFFF' : undefined,
                    textAlign: { xs: 'left', md: 'left' },
                  }}
                >
                  028.3863.8239 - 08.5957.9939
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 3,
                  color: colors.isDark ? "#FFFFFF" : colors.text.secondary,
                  justifyContent: { xs: "flex-start", md: "flex-start" },
                }}
              >
                <Email
                  sx={{
                    mr: 2,
                    color: colors.isDark ? "#FFFFFF" : colors.primary.main,
                    fontSize: { xs: "1.25rem", md: "1.5rem" }, // Responsive icon size
                  }}
                />
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: "0.95rem", md: "1.1rem" }, // Responsive font size
                    lineHeight: 1.4,
                    color: colors.isDark ? '#FFFFFF' : undefined,
                    textAlign: { xs: 'left', md: 'left' },
                  }}
                >
                  support@saigonlab.edu.vn
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  mb: 3,
                  color: colors.isDark ? "#FFFFFF" : colors.text.secondary,
                  justifyContent: { xs: "flex-start", md: "flex-start" },
                }}
              >
                <LocationOn
                  sx={{
                    mr: 2,
                    color: colors.isDark ? "#FFFFFF" : colors.primary.main,
                    fontSize: { xs: "1.25rem", md: "1.5rem" }, // Responsive icon size
                    mt: 0.2,
                  }}
                />
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: "0.95rem", md: "1.1rem" }, // Responsive font size
                    lineHeight: 1.4, // Consistent line height
                    color: colors.isDark ? '#FFFFFF' : undefined,
                    textAlign: { xs: 'left', md: 'left' },
                  }}
                >
                  28/61 Cư Xá Lữ Gia, phường Phú Thọ, Tp.Hồ Chí Minh
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
            textAlign: { xs: 'left', md: 'center' },
            pl: { xs: 0, md: 0 },
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: colors.isDark ? "#FFFFFF" : colors.text.secondary,
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