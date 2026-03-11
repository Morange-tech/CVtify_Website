"use client";

import React, { useState } from "react";
import {
  Drawer,
  Box,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Divider,
  Tooltip,
  Skeleton,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import HomeIcon from "@mui/icons-material/Home";
import DescriptionIcon from "@mui/icons-material/Description";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import BarChartIcon from "@mui/icons-material/BarChart";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import DownloadIcon from "@mui/icons-material/Download";
import StarIcon from "@mui/icons-material/Star";
import DiamondIcon from "@mui/icons-material/Diamond";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { useSidebar } from "./SidebarContext";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/navigation";

export default function AppSidebar() {
  const [isLoading, setIsLoading] = useState(false);
  const { open, setOpen } = useSidebar();
  const { user, logoutMutation } = useAuth();
  const router = useRouter();

  const drawerWidth = 240;
  const railWidth = 70;

  const isPremium = user?.subscription_status === "active";

  // Free user links
  const freeLinks = [
    { title: "Dashboard", icon: <HomeIcon />, path: "/dashboard" },
    { title: "My CVs", icon: <DescriptionIcon />, path: "/my-cvs" },
    { title: "My Motivation Letters", icon: <MailOutlineIcon />, path: "/motivation-letter" },
    { title: "Templates", icon: <ColorLensIcon />, path: "/templates" },
    { title: "Downloads", icon: <DownloadIcon />, path: "/downloads" },
  ];

  // Premium-only links
  const premiumLinks = [
    { title: "Dashboard", icon: <HomeIcon />, path: "/dashboard" },
    { title: "My CVs", icon: <DescriptionIcon />, path: "/my-cvs" },
    { title: "My Motivation Letters", icon: <MailOutlineIcon />, path: "/motivation-letters" },
    { title: "All Templates", icon: <ColorLensIcon />, path: "/templates" },
    { title: "CV Analytics", icon: <BarChartIcon />, path: "/analytics" },
    { title: "AI Assistant", icon: <SmartToyIcon />, path: "/ai-assistant" },
    { title: "Downloads", icon: <DownloadIcon />, path: "/downloads" },
  ];

  const mainLinks = isPremium ? premiumLinks : freeLinks;

  // Bottom links differ based on plan
  const bottomLinks = isPremium
    ? [
        { title: "Subscription", icon: <DiamondIcon />, path: "/subscription" },
        { title: "Settings", icon: <SettingsIcon />, path: "/settings" },
      ]
    : [
        { title: "Upgrade to Premium", icon: <StarIcon />, path: "/upgrade" },
        { title: "Settings", icon: <SettingsIcon />, path: "/settings" },
      ];

  const handleNavigate = (path) => {
    router.push(path);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidth : railWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open ? drawerWidth : railWidth,
          transition: "width 0.3s",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderRight: "1px solid #e2e8f0",
        },
      }}
    >
      {/* ===== TOP SECTION ===== */}
      <Box>
        {/* Header */}
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: open ? "space-between" : "center",
            px: open ? 2 : 0,
          }}
        >
          {open && (
            <Typography
              variant="h6"
              fontWeight="800"
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              CVtify
            </Typography>
          )}
          <IconButton onClick={() => setOpen(!open)}>
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
        </Toolbar>

        <Divider />

        {/* Main Links */}
        {isLoading ? (
          <List>
            {Array.from({ length: 5 }).map((_, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <Skeleton variant="circular" width={24} height={24} />
                  </ListItemIcon>
                  {open && <Skeleton variant="text" width="80%" height={24} />}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        ) : (
          <List sx={{ px: 1 }}>
            {mainLinks.map((link, index) => (
              <ListItem key={index} disablePadding sx={{ mb: 0.5 }}>
                <Tooltip title={!open ? link.title : ""} placement="right" arrow>
                  <ListItemButton
                    onClick={() => handleNavigate(link.path)}
                    sx={{
                      borderRadius: 2,
                      minHeight: 44,
                      justifyContent: open ? "initial" : "center",
                      px: 2,
                      "&:hover": {
                        bgcolor: "#667eea10",
                        "& .MuiListItemIcon-root": {
                          color: "#667eea",
                        },
                        "& .MuiListItemText-primary": {
                          color: "#667eea",
                        },
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 2 : "auto",
                        justifyContent: "center",
                        color: "#64748b",
                      }}
                    >
                      {link.icon}
                    </ListItemIcon>
                    {open && (
                      <ListItemText
                        primary={link.title}
                        primaryTypographyProps={{
                          fontSize: "0.9rem",
                          fontWeight: 500,
                          color: "#1e293b",
                        }}
                      />
                    )}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      {/* ===== BOTTOM SECTION ===== */}
      <Box>
        <Divider sx={{ mx: 1 }} />

        <List sx={{ px: 1, py: 1 }}>
          {/* Upgrade / Subscription */}
          {bottomLinks.map((link, index) => (
            <ListItem key={index} disablePadding sx={{ mb: 0.5 }}>
              <Tooltip title={!open ? link.title : ""} placement="right" arrow>
                <ListItemButton
                  onClick={() => handleNavigate(link.path)}
                  sx={{
                    borderRadius: 2,
                    minHeight: 44,
                    justifyContent: open ? "initial" : "center",
                    px: 2,
                    // Special style for Upgrade button
                    ...(link.title === "Upgrade to Premium" && {
                      background: "linear-gradient(135deg, #667eea15 0%, #764ba215 100%)",
                      border: "1px solid #667eea30",
                      "&:hover": {
                        background: "linear-gradient(135deg, #667eea25 0%, #764ba225 100%)",
                      },
                    }),
                    // Special style for Subscription
                    ...(link.title === "Subscription" && {
                      background: "linear-gradient(135deg, #667eea15 0%, #764ba215 100%)",
                      border: "1px solid #667eea30",
                      "&:hover": {
                        background: "linear-gradient(135deg, #667eea25 0%, #764ba225 100%)",
                      },
                    }),
                    "&:hover": {
                      bgcolor: "#667eea10",
                      "& .MuiListItemIcon-root": {
                        color: "#667eea",
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 2 : "auto",
                      justifyContent: "center",
                      color:
                        link.title === "Upgrade to Premium"
                          ? "#EAB308"
                          : link.title === "Subscription"
                          ? "#764ba2"
                          : "#64748b",
                    }}
                  >
                    {link.icon}
                  </ListItemIcon>
                  {open && (
                    <ListItemText
                      primary={link.title}
                      primaryTypographyProps={{
                        fontSize: "0.9rem",
                        fontWeight:
                          link.title === "Upgrade to Premium" ||
                          link.title === "Subscription"
                            ? 700
                            : 500,
                        color:
                          link.title === "Upgrade to Premium"
                            ? "#EAB308"
                            : link.title === "Subscription"
                            ? "#764ba2"
                            : "#1e293b",
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}

          {/* Logout */}
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <Tooltip title={!open ? "Logout" : ""} placement="right" arrow>
              <ListItemButton
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                sx={{
                  borderRadius: 2,
                  minHeight: 44,
                  justifyContent: open ? "initial" : "center",
                  px: 2,
                  "&:hover": {
                    bgcolor: "#ef444410",
                    "& .MuiListItemIcon-root": {
                      color: "#ef4444",
                    },
                    "& .MuiListItemText-primary": {
                      color: "#ef4444",
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 2 : "auto",
                    justifyContent: "center",
                    color: "#ef4444",
                  }}
                >
                  <LogoutIcon />
                </ListItemIcon>
                {open && (
                  <ListItemText
                    primary="Logout"
                    primaryTypographyProps={{
                      fontSize: "0.9rem",
                      fontWeight: 500,
                      color: "#ef4444",
                    }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          </ListItem>
        </List>

        {/* Footer */}
        {open && (
          <Box sx={{ p: 2, pt: 0 }}>
            <Typography variant="caption" color="#94a3b8">
              © 2026 CVtify
            </Typography>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}