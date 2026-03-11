"use client";

import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useSidebar } from "./SidebarContext";

export default function CustomTrigger() {
  const { toggleSidebar } = useSidebar();

  return (
    <IconButton onClick={toggleSidebar}>
      <MenuIcon />
    </IconButton>
  );
}
