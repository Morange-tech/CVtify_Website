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

  const openSectionMenu = (e, id) => {
    setSectionMenuAnchor(e.currentTarget);
    setSectionMenuTarget(id);
  };

  const closeSectionMenu = () => {
    setSectionMenuAnchor(null);
  };

  const openRenameDialog = (sections, additionalSections) => {
    if (!sectionMenuTarget) return;

    const current =
      sectionTitleOverrides[sectionMenuTarget] ||
      sections.find(s => s.id === sectionMenuTarget)?.title ||
      additionalSections.find(s => s.id === sectionMenuTarget)?.title ||
      "";

    setRenameValue(current);
    setRenameOpen(true);
    closeSectionMenu();
  };

  const confirmRename = () => {
    if (renameValue.trim()) {
      setSectionTitleOverrides(prev => ({
        ...prev,
        [sectionMenuTarget]: renameValue.trim(),
      }));
    }
    setRenameOpen(false);
  };

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

  const togglePageBreak = () => {
    setSectionPageBreak(prev => ({
      ...prev,
      [sectionMenuTarget]: !prev[sectionMenuTarget],
    }));
    closeSectionMenu();
  };

  const setColumn = (col) => {
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
    openRenameDialog,   // ✅ MUST BE HERE
    confirmRename,      // ✅ MUST BE HERE
    togglePageBreak,
    setColumn,
    clearSectionLayout,
  };
};