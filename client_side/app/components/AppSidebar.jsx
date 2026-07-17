"use client";

import React from "react";
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
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion } from "motion/react";
import {
  Menu,
  ChevronLeft,
  X,
  Home,
  FileText,
  Mail,
  Palette,
  BarChart3,
  Bot,
  Download,
  Sparkles,
  Gem,
  Settings,
  LogOut,
  ArrowLeft,
  Heart,
} from "lucide-react";
import { useSidebar } from "./SidebarContext";
import { useAuth } from "../hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";

const MotionListItem = motion(ListItem);

export default function AppSidebar() {
  const { open, setOpen } = useSidebar();
  const { user, logoutMutation } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const drawerWidth = 240;
  const railWidth = 70;

  const isPremium = user?.subscription_status === "active";

  // Free user links
  const freeLinks = [
    { title: "Dashboard", icon: Home, path: "/dashboard" },
    { title: "My CVs", icon: FileText, path: "/my-cvs" },
    { title: "My Motivation Letters", icon: Mail, path: "/motivation-letter" },
    { title: "Templates", icon: Palette, path: "/templates" },
    { title: "Wishlist", icon: Heart, path: "/wishlist" },
    { title: "Downloads", icon: Download, path: "/downloads" },
  ];

  // Premium-only links
  const premiumLinks = [
    { title: "Dashboard", icon: Home, path: "/dashboard" },
    { title: "My CVs", icon: FileText, path: "/my-cvs" },
    { title: "My Motivation Letters", icon: Mail, path: "/motivation-letter" },
    { title: "All Templates", icon: Palette, path: "/templates" },
    { title: "Wishlist", icon: Heart, path: "/wishlist" },
    { title: "CV Analytics", icon: BarChart3, path: "/analytics" },
    { title: "AI Assistant", icon: Bot, path: "/ai-assistant" },
    { title: "Downloads", icon: Download, path: "/downloads" },
  ];

  const mainLinks = isPremium ? premiumLinks : freeLinks;

  // Bottom links differ based on plan
  const bottomLinks = isPremium
    ? [{ title: "Subscription", icon: Gem, path: "/subscription" }]
    : [{ title: "Upgrade to Premium", icon: Sparkles, path: "/upgrade" }];

  const settingsLink = { title: "Settings", icon: Settings, path: "/settings" };
  const homeLink = { title: "Retour à l'accueil", icon: ArrowLeft, path: "/" };

  const isExpanded = isMobile ? true : open;

  const handleNavigate = (path) => {
    router.push(path);
    if (isMobile) setOpen(false);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
    if (isMobile) setOpen(false);
  };

  const isActive = (path) =>
    pathname === path || (path !== "/dashboard" && pathname?.startsWith(path + "/"));

  const renderLink = (link, index, variant = "default") => {
    const Icon = link.icon;
    const active = isActive(link.path);

    const isUpgrade = variant === "upgrade";
    const isSubscription = variant === "subscription";
    const isLogout = variant === "logout";

    const isHome = variant === "home";

    let activeColor = "#000000";
    if (isUpgrade) activeColor = "#EAB308";
    if (isSubscription) activeColor = "#1a1a1a";
    if (isLogout) activeColor = "#ef4444";
    if (isHome) activeColor = "#64748b";

    return (
      <MotionListItem
        key={link.title}
        disablePadding
        sx={{ mb: 0.5 }}
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25, delay: index * 0.04, ease: "easeOut" }}
      >
        <Tooltip title={!isExpanded ? link.title : ""} placement="right" arrow>
          <ListItemButton
            onClick={isLogout ? handleLogout : () => handleNavigate(link.path)}
            disabled={isLogout && logoutMutation.isPending}
            sx={{
              borderRadius: 2,
              minHeight: 44,
              justifyContent: isExpanded ? "initial" : "center",
              px: 2,
              position: "relative",
              transition: "background-color 0.2s ease, transform 0.15s ease",
              ...(active && {
                bgcolor: "#00000014",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  top: "20%",
                  height: "60%",
                  width: 3,
                  borderRadius: "0 4px 4px 0",
                  bgcolor: "#000000",
                },
              }),
              ...((isUpgrade || isSubscription) && {
                background: "linear-gradient(135deg, #00000015 0%, #1a1a1a15 100%)",
                border: "1px solid #00000030",
                "&:hover": {
                  background: "linear-gradient(135deg, #00000025 0%, #1a1a1a25 100%)",
                  transform: "translateX(2px)",
                },
              }),
              "&:hover": {
                bgcolor: isLogout
                  ? "#ef444410"
                  : isUpgrade || isSubscription
                  ? undefined
                  : "#00000010",
                transform: "translateX(2px)",
                "& .MuiListItemIcon-root": {
                  color: activeColor,
                },
                "& .MuiListItemText-primary": {
                  color: activeColor,
                },
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: isExpanded ? 2 : "auto",
                justifyContent: "center",
                color: active
                  ? activeColor
                  : isUpgrade
                  ? "#EAB308"
                  : isSubscription
                  ? "#1a1a1a"
                  : isLogout
                  ? "#ef4444"
                  : "#64748b",
              }}
            >
              <Icon size={20} strokeWidth={2} />
            </ListItemIcon>
            {isExpanded && (
              <ListItemText
                primary={link.title}
                primaryTypographyProps={{
                  fontSize: "0.9rem",
                  fontWeight: active || isUpgrade || isSubscription ? 700 : 500,
                  color: active
                    ? activeColor
                    : isUpgrade
                    ? "#EAB308"
                    : isSubscription
                    ? "#1a1a1a"
                    : isLogout
                    ? "#ef4444"
                    : "#1e293b",
                }}
              />
            )}
          </ListItemButton>
        </Tooltip>
      </MotionListItem>
    );
  };

  const sidebarContent = (
    <>
      {/* ===== TOP SECTION ===== */}
      <Box>
        {/* Header */}
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: isExpanded ? "space-between" : "center",
            px: isExpanded ? 2 : 0,
          }}
        >
          {isExpanded && (
            <Typography
              variant="h6"
              fontWeight="800"
              sx={{
                background: "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              CVtify
            </Typography>
          )}
          <IconButton onClick={() => setOpen(!open)} size="small">
            {isMobile ? (
              <X size={20} />
            ) : open ? (
              <ChevronLeft size={20} />
            ) : (
              <Menu size={20} />
            )}
          </IconButton>
        </Toolbar>

        <Divider />

        {/* Main Links */}
        <List sx={{ px: 1, pt: 1 }}>
          {mainLinks.map((link, index) => renderLink(link, index))}
        </List>
      </Box>

      {/* ===== BOTTOM SECTION ===== */}
      <Box>
        <Divider sx={{ mx: 1 }} />

        <List sx={{ px: 1, py: 1 }}>
          {renderLink(homeLink, 0, "home")}
          {bottomLinks.map((link, index) =>
            renderLink(
              link,
              index + 1,
              link.title === "Upgrade to Premium" ? "upgrade" : "subscription"
            )
          )}
          {renderLink(settingsLink, bottomLinks.length + 1)}
          {renderLink(
            { title: "Logout", icon: LogOut, path: "" },
            bottomLinks.length + 2,
            "logout"
          )}
        </List>

        {/* Footer */}
        {isExpanded && (
          <Box sx={{ p: 2, pt: 0 }}>
            <Typography variant="caption" color="#94a3b8">
              © 2026 CVtify
            </Typography>
          </Box>
        )}
      </Box>
    </>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            borderRight: "1px solid #e2e8f0",
          },
        }}
      >
        {sidebarContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidth : railWidth,
        flexShrink: 0,
        display: { xs: "none", md: "block" },
        "& .MuiDrawer-paper": {
          width: open ? drawerWidth : railWidth,
          transition: "width 0.25s ease",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderRight: "1px solid #e2e8f0",
          boxSizing: "border-box",
        },
      }}
    >
      {sidebarContent}
    </Drawer>
  );
}
