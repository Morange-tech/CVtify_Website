"use client";
import { useState } from "react";

export const useSectionMenu = () => {
  const [sectionMenuAnchor, setSectionMenuAnchor] = useState(null);
  const [sectionMenuTarget, setSectionMenuTarget] = useState(null);

  const [sectionTitleOverrides, setSectionTitleOverrides] = useState({});
  const [sectionColumn, setSectionColumn] = useState({});
  const [sectionPageBreak, setSectionPageBreak] = useState({});

  const [renameOpen, setRenameOpen] = useState(false);
  const [renameValue, setRenameValue] = useState("");

  // ✅ Open menu
  const openSectionMenu = (e, id) => {
    setSectionMenuAnchor(e.currentTarget);
    setSectionMenuTarget(id);
  };

  // ✅ Close menu safely
  const closeSectionMenu = () => {
    setSectionMenuAnchor(null);
  };

  // ✅ Open rename dialog
  const openRenameDialog = (sections, additionalSections) => {
    if (!sectionMenuTarget) return;

    const current =
      sectionTitleOverrides[sectionMenuTarget] ||
      sections.find(s => s.id === sectionMenuTarget)?.title ||
      additionalSections.find(s => s.id === sectionMenuTarget)?.title ||
      "";

    setRenameValue(current);
    setRenameOpen(true);
    closeSectionMenu(); // ✅ important
  };

  // ✅ Close rename dialog properly
  const closeRenameDialog = () => {
    setRenameOpen(false);
    setRenameValue("");
  };

  // ✅ Confirm rename
  const confirmRename = () => {
    if (renameValue.trim()) {
      setSectionTitleOverrides(prev => ({
        ...prev,
        [sectionMenuTarget]: renameValue.trim(),
      }));
    }
    closeRenameDialog();
  };

  // ✅ Clear layout
  const clearSectionLayout = (target) => {
    setSectionTitleOverrides(prev => {
      const copy = { ...prev };
      delete copy[target];
      return copy;
    });

    setSectionColumn(prev => {
      const copy = { ...prev };
      delete copy[target];
      return copy;
    });

    setSectionPageBreak(prev => {
      const copy = { ...prev };
      delete copy[target];
      return copy;
    });
  };

  // ✅ Toggle page break
  const togglePageBreak = () => {
    if (!sectionMenuTarget) return;

    setSectionPageBreak(prev => ({
      ...prev,
      [sectionMenuTarget]: !prev[sectionMenuTarget],
    }));

    closeSectionMenu();
  };

  // ✅ Set column
  const setColumn = (col) => {
    if (!sectionMenuTarget) return;

    setSectionColumn(prev => ({
      ...prev,
      [sectionMenuTarget]: col,
    }));

    closeSectionMenu();
  };

  return {
    sectionMenuAnchor,
    sectionMenuTarget,
    sectionTitleOverrides,
    sectionColumn,
    sectionPageBreak,
    renameOpen,
    renameValue,
    setRenameValue,

    openSectionMenu,
    closeSectionMenu,

    openRenameDialog,
    confirmRename,
    closeRenameDialog, // ✅ NEW

    togglePageBreak,
    setColumn,
    clearSectionLayout,
  };
};