"use client";

import { useState, useCallback, useEffect } from "react";
import DashboardTopNav from "./DashboardTopNav";
import DashboardAccessRail from "./DashboardAccessRail";
import DashboardWorkspace from "./DashboardWorkspace";
import DashboardCopilot from "./DashboardCopilot";
import { WORKSPACES } from "./dashboardConfig";
import styles from "./DashboardShell.module.css";

/**
 * DashboardShell
 *
 * Core application workspace shell orchestrating:
 * - Floating top-center navigation
 * - Slim floating left access rail
 * - Central primary investigation workspace
 * - Contextual capability drawer
 * - AI Copilot assistant drawer
 */
export default function DashboardShell() {
  const [activeWorkspace, setActiveWorkspace] = useState("overview");
  const [activeCapability, setActiveCapability] = useState("investigation-overview");
  const [isContextOpen, setIsContextOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  // Switch workspace
  const handleSelectWorkspace = useCallback((workspaceId) => {
    setActiveWorkspace(workspaceId);

    const ws = WORKSPACES.find((w) => w.id === workspaceId);
    if (ws && ws.capabilities.length > 0) {
      setActiveCapability(ws.capabilities[0].id);
    }

    // Expand contextual drawer for multi-capability workspaces, or toggle
    if (workspaceId !== "overview" && workspaceId !== "copilot") {
      setIsContextOpen(true);
    } else {
      setIsContextOpen(false);
    }
  }, []);

  // Select sub-capability
  const handleSelectCapability = useCallback((capId) => {
    setActiveCapability(capId);
  }, []);

  // Toggle or force AI Copilot
  const handleToggleCopilot = useCallback((forceState) => {
    setIsCopilotOpen((prev) => (typeof forceState === "boolean" ? forceState : !prev));
  }, []);

  // Close contextual drawer
  const handleCloseContext = useCallback(() => {
    setIsContextOpen(false);
  }, []);

  // Global escape key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (isCopilotOpen) {
          setIsCopilotOpen(false);
        } else if (isContextOpen) {
          setIsContextOpen(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCopilotOpen, isContextOpen]);

  return (
    <div className={styles.dashboardContainer}>
      {/* Ambient Ocean Background */}
      <div className={styles.ambientAtmosphere} aria-hidden="true">
        <div className={styles.glowTopCenter} />
        <div className={styles.glowBottomLeft} />
      </div>

      {/* Floating Top-Center Navigation */}
      <DashboardTopNav
        activeWorkspace={activeWorkspace}
        onSelectWorkspace={handleSelectWorkspace}
        onToggleCopilot={handleToggleCopilot}
      />

      {/* Main Body with Floating Access Rail & Primary Workspace */}
      <div className={styles.dashboardBody}>
        <DashboardAccessRail
          activeWorkspace={activeWorkspace}
          activeCapability={activeCapability}
          isContextOpen={isContextOpen}
          onSelectWorkspace={handleSelectWorkspace}
          onSelectCapability={handleSelectCapability}
          onCloseContext={handleCloseContext}
          onToggleCopilot={handleToggleCopilot}
        />

        <DashboardWorkspace
          activeWorkspace={activeWorkspace}
          activeCapability={activeCapability}
          onSelectWorkspace={handleSelectWorkspace}
        />
      </div>

      {/* Floating AI Copilot Drawer */}
      <DashboardCopilot
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
      />
    </div>
  );
}
