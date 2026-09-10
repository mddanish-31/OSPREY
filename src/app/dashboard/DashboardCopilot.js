"use client";

import { useEffect, useRef } from "react";
import CopilotConversation from "./copilot/CopilotConversation";
import styles from "./DashboardCopilot.module.css";

/**
 * DashboardCopilot
 *
 * Floating liquid-glass AI Copilot intelligence drawer.
 * Reuses the canonical CopilotConversation component for unified prompt/conversation state.
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Whether Copilot drawer is open
 * @param {function} props.onClose - Callback to close Copilot
 */
export default function DashboardCopilot({ isOpen, onClose }) {
  const panelRef = useRef(null);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <aside
      className={styles.copilotOverlay}
      role="dialog"
      aria-modal="true"
      aria-label="OSPREY AI Copilot Drawer"
    >
      <div className={styles.copilotDrawer} ref={panelRef}>
        {/* Header */}
        <div className={styles.copilotHeader}>
          <div className={styles.headerTitleGroup}>
            <div className={styles.copilotIconPill}>
              <span className={styles.sparkleIcon}>✦</span>
            </div>
            <div>
              <div className={styles.copilotHeading}>AI Copilot</div>
              <div className={styles.copilotSubheading}>Investigation Assistant</div>
            </div>
          </div>

          <div className={styles.headerRightControls}>
            <span className={styles.statusPill}>
              <span className={styles.statusDot} />
              <span>Standby</span>
            </span>
            <button
              type="button"
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Close AI Copilot"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content Body reusing canonical CopilotConversation in drawer variant */}
        <div className={styles.copilotBody}>
          <CopilotConversation variant="drawer" />
        </div>
      </div>
    </aside>
  );
}

