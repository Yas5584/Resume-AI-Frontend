"use client";

import * as React from "react";

interface KeyboardShortcutConfig {
  onTogglePreview?: () => void;
  onExitPreview?: () => void;
  onManualSave?: () => void;
  onToggleEdit?: () => void;
  onToggleSplit?: () => void;
  /** Whether the preview overlay is currently active */
  isPreviewActive?: boolean;
}

/**
 * Keyboard shortcut hook for the resume editor workspace.
 *
 * Shortcuts:
 * - Ctrl/Cmd + P → Toggle Preview mode (prevents browser print dialog)
 * - Escape → Exit Preview mode (only when preview is active)
 * - Ctrl/Cmd + S → Manual save (prevents browser save dialog)
 * - Ctrl/Cmd + E → Toggle Edit mode
 * - Ctrl/Cmd + \ → Toggle Split mode
 */
export function useKeyboardShortcuts({
  onTogglePreview,
  onExitPreview,
  onManualSave,
  onToggleEdit,
  onToggleSplit,
  isPreviewActive = false,
}: KeyboardShortcutConfig) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isModifier = e.ctrlKey || e.metaKey;

      // Don't intercept shortcuts when user is typing in an input/textarea
      // (except for Ctrl+S which should always save, and Escape which should always close preview)
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      // Escape → exit preview (always active, even in inputs)
      if (e.key === "Escape" && isPreviewActive) {
        e.preventDefault();
        onExitPreview?.();
        return;
      }

      // Ctrl/Cmd + S → manual save (always active, even in inputs)
      if (isModifier && e.key === "s") {
        e.preventDefault();
        onManualSave?.();
        return;
      }

      // Don't intercept other shortcuts while typing in inputs
      if (isInput) return;

      // Ctrl/Cmd + P → toggle preview
      if (isModifier && e.key === "p") {
        e.preventDefault();
        onTogglePreview?.();
        return;
      }

      // Ctrl/Cmd + E → toggle edit mode
      if (isModifier && e.key === "e") {
        e.preventDefault();
        onToggleEdit?.();
        return;
      }

      // Ctrl/Cmd + \ → toggle split mode
      if (isModifier && e.key === "\\") {
        e.preventDefault();
        onToggleSplit?.();
        return;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    onTogglePreview,
    onExitPreview,
    onManualSave,
    onToggleEdit,
    onToggleSplit,
    isPreviewActive,
  ]);
}
