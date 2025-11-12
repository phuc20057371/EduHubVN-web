import { Notifications } from "@mui/icons-material";
import {
  Badge,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  alpha,
} from "@mui/material";
import React, { useState } from "react";
import { useColors } from "../hooks/useColors";

interface Notification {
  id: string | number;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface NotificationMenuProps {
  notifications?: Notification[];
  onNotificationClick?: (notification: Notification) => void;
}

const NotificationMenu: React.FC<NotificationMenuProps> = ({
  notifications = [],
  onNotificationClick,
}) => {
  const colors = useColors();
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleNotificationItemClick = (notification: Notification) => {
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
  };

  return (
    <>
      {/* Notification Button */}
      <IconButton
        color="inherit"
        onClick={handleNotificationOpen}
        sx={{
          bgcolor: alpha("#fff", 0.1),
          "&:hover": {
            bgcolor: alpha("#fff", 0.2),
          },
        }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <Notifications />
        </Badge>
      </IconButton>

      {/* Notification Menu */}
      <Menu
        sx={{
          mt: "45px",
          "& .MuiPaper-root": {
            borderRadius: 1,
            minWidth: 350,
            maxWidth: 400,
            maxHeight: 500,
            boxShadow: `0 8px 24px ${alpha("#000", 0.12)}`,
            border: `1px solid ${colors.border.light}`,
          },
        }}
        id="notification-menu"
        anchorEl={notificationAnchor}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationClose}
      >
        {/* Header */}
        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderBottom: `1px solid ${colors.border.light}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Thông báo
          </Typography>
          <Chip
            label={`${unreadCount} mới`}
            size="small"
            color="primary"
            sx={{ height: 20 }}
          />
        </Box>

        {/* Notification List */}
        {notifications && notifications.length > 0 ? (
          <Box sx={{ maxHeight: 400, overflow: "auto" }}>
            {notifications.map((notification) => (
              <MenuItem
                key={notification.id}
                onClick={() => handleNotificationItemClick(notification)}
                sx={{
                  py: 2,
                  px: 2,
                  borderBottom: `1px solid ${colors.border.light}`,
                  bgcolor: notification.read
                    ? "transparent"
                    : alpha(colors.primary.main, 0.05),
                  "&:hover": {
                    bgcolor: colors.background.secondary,
                  },
                  display: "block",
                  whiteSpace: "normal",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                  {!notification.read && (
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: colors.primary.main,
                        mt: 0.5,
                        flexShrink: 0,
                      }}
                    />
                  )}
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: notification.read ? 400 : 600,
                        color: colors.text.primary,
                        mb: 0.5,
                      }}
                    >
                      {notification.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: colors.text.secondary,
                        fontSize: "0.85rem",
                        mb: 0.5,
                      }}
                    >
                      {notification.message}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: colors.text.secondary,
                        fontSize: "0.75rem",
                      }}
                    >
                      {new Date(notification.createdAt).toLocaleString("vi-VN")}
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              py: 4,
              px: 2,
              textAlign: "center",
            }}
          >
            <Notifications
              sx={{
                fontSize: 48,
                color: colors.text.secondary,
                opacity: 0.5,
                mb: 1,
              }}
            />
            <Typography variant="body2" sx={{ color: colors.text.secondary }}>
              Không có thông báo nào
            </Typography>
          </Box>
        )}
      </Menu>
    </>
  );
};

export default NotificationMenu;
