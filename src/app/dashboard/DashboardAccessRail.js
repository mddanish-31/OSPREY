"use client";

import { useEffect, useRef } from "react";
import { WORKSPACES } from "./dashboardConfig";
import styles from "./DashboardAccessRail.module.css";

/**
 * DashboardAccessRail
 *
 * Slim vertical floating liquid-glass access rail on the left viewport margin.
 * Contains primary workspace icon triggers and an expandable contextual glass panel.
 *
 * @param {object} props
 * @param {string} props.activeWorkspace - Active workspace ID
 * @param {string} props.activeCapability - Active sub-capability ID
 * @param {boolean} props.isContextOpen - Whether the contextual panel is expanded
 * @param {function} props.onSelectWorkspace - Callback to switch workspace
 * @param {function} props.onSelectCapability - Callback to select sub-capability
 * @param {function} props.onCloseContext - Callback to close contextual panel
 * @param {function} props.onToggleCopilot - Callback to open AI Copilot
 */
export default function DashboardAccessRail({
  activeWorkspace,
  activeCapability,
  isContextOpen,
  onSelectWorkspace,
  onSelectCapability,
  onCloseContext,
  onToggleCopilot,
}) {
  const railRef = useRef(null);

  // SVG Icons for the 8 major workspaces
  const getWorkspaceIcon = (id) => {
    switch (id) {
      case "overview":
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
          </svg>
        );
      case "satellite":
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
            <path d="M2 12h20" />
          </svg>
        );
      case "drift":
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12h20" />
            <path d="M6 8l-4 4 4 4" />
            <path d="M18 8a4 4 0 0 0-4-4 4 4 0 0 0-4 4" />
          </svg>
        );
      case "vessels":
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
            <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76" />
            <path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6" />
          </svg>
        );
      case "environment":
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        );
      case "evidence":
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        );
      case "response":
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polygon points="12 8 8 12 12 16 16 12 12 8" />
          </svg>
        );
      case "reports":
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        );
      case "copilot":
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v4" />
            <path d="M12 18v4" />
            <path d="M4.93 4.93l2.83 2.83" />
            <path d="M16.24 16.24l2.83 2.83" />
            <path d="M2 12h4" />
            <path d="M18 12h4" />
            <path d="M4.93 19.07l2.83-2.83" />
            <path d="M16.24 7.76l2.83-2.83" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Click outside to close contextual drawer
  useEffect(() => {
    if (!isContextOpen) return;

    const handleClickOutside = (e) => {
      if (railRef.current && !railRef.current.contains(e.target)) {
        onCloseContext();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isContextOpen, onCloseContext]);

  // Current active workspace object
  const currentWorkspaceObj = WORKSPACES.find((w) => w.id === activeWorkspace);

  return (
    <aside className={styles.railWrapper} ref={railRef} aria-label="Dashboard Access Rail">
      {/* Slim Vertical Rail */}
      <nav className={styles.accessRail} aria-label="Workspaces">
        {WORKSPACES.map((workspace) => {
          const isActive = activeWorkspace === workspace.id;

          return (
            <div key={workspace.id} className={styles.railItemWrapper}>
              <button
                type="button"
                className={`${styles.railButton} ${isActive ? styles.railButtonActive : ""}`}
                onClick={() => onSelectWorkspace(workspace.id)}
                title={`${workspace.number} // ${workspace.label}`}
                aria-label={`Open ${workspace.label} workspace`}
                aria-current={isActive ? "page" : undefined}
              >
                <span className={styles.railIcon}>{getWorkspaceIcon(workspace.id)}</span>
                {isActive && <span className={styles.activeBeaconDot} aria-hidden="true" />}
              </button>

              {/* Hover Tooltip */}
              <div className={styles.tooltip}>
                <span className={styles.tooltipNumber}>{workspace.number}</span>
                <span className={styles.tooltipLabel}>{workspace.label}</span>
              </div>
            </div>
          );
        })}
      </nav>

      {/* Expandable Contextual Glass Panel */}
      {isContextOpen && currentWorkspaceObj && (
        <div
          className={styles.contextPanel}
          role="region"
          aria-label={`${currentWorkspaceObj.label} contextual capabilities`}
        >
          {/* Header */}
          <div className={styles.contextHeader}>
            <div className={styles.contextTitleGroup}>
              <span className={styles.contextNumber}>{currentWorkspaceObj.number}</span>
              <div>
                <h3 className={styles.contextTitle}>{currentWorkspaceObj.label}</h3>
                <span className={styles.contextSubtitle}>{currentWorkspaceObj.category}</span>
              </div>
            </div>

            <button
              type="button"
              className={styles.contextCloseBtn}
              onClick={onCloseContext}
              aria-label="Close panel"
            >
              ✕
            </button>
          </div>

          <p className={styles.contextDesc}>{currentWorkspaceObj.description}</p>

          {/* Sub-Capabilities List */}
          <div className={styles.capabilityList}>
            {currentWorkspaceObj.capabilities.map((cap) => {
              const isCapActive = activeCapability === cap.id;

              return (
                <button
                  key={cap.id}
                  type="button"
                  className={`${styles.capabilityItem} ${
                    isCapActive ? styles.capabilityItemActive : ""
                  }`}
                  onClick={() => onSelectCapability(cap.id)}
                >
                  <div className={styles.capTop}>
                    <span className={styles.capNum}>#{cap.num}</span>
                    <span className={styles.capName}>{cap.name}</span>
                  </div>
                  <span className={styles.capDesc}>{cap.desc}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
}
