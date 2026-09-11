"use client";

import { useState, useCallback, useEffect } from "react";
import { listInvestigations, getInvestigation } from "@/lib/api/investigations";
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
 * - Shared Investigation domain context across workspaces
 */
export default function DashboardShell() {
  const [activeWorkspace, setActiveWorkspace] = useState("overview");
  const [activeCapability, setActiveCapability] = useState("investigation-overview");
  const [isContextOpen, setIsContextOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  // Shared investigation state across workspaces
  const [investigations, setInvestigations] = useState([]);
  const [selectedInvestigationId, setSelectedInvestigationId] = useState(null);
  const [selectedInvestigation, setSelectedInvestigation] = useState(null);
  const [isLoadingInvestigations, setIsLoadingInvestigations] = useState(true);
  const [investigationsError, setInvestigationsError] = useState(null);

  // Initial load of investigations on shell mount
  useEffect(() => {
    let isMounted = true;

    listInvestigations({ page: 1, pageSize: 50 })
      .then((response) => {
        if (!isMounted) return;
        const items = response?.items || [];
        setInvestigations(items);
        if (items.length > 0) {
          setSelectedInvestigationId(items[0].id);
          setSelectedInvestigation(items[0]);
        } else {
          setSelectedInvestigationId(null);
          setSelectedInvestigation(null);
        }
        setInvestigationsError(null);
      })
      .catch((err) => {
        if (!isMounted) return;
        setInvestigationsError(err.message || "Failed to load investigations from OSPREY backend");
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingInvestigations(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Refresh investigations list
  const handleRefreshInvestigations = useCallback(async (autoSelectId = null) => {
    setIsLoadingInvestigations(true);
    setInvestigationsError(null);

    try {
      const response = await listInvestigations({ page: 1, pageSize: 50 });
      const items = response?.items || [];
      setInvestigations(items);

      if (items.length > 0) {
        const targetId =
          autoSelectId ||
          (items.some((i) => i.id === selectedInvestigationId)
            ? selectedInvestigationId
            : items[0].id);
        setSelectedInvestigationId(targetId);
        const activeObj = items.find((i) => i.id === targetId) || items[0];
        setSelectedInvestigation(activeObj);
      } else {
        setSelectedInvestigationId(null);
        setSelectedInvestigation(null);
      }
    } catch (err) {
      setInvestigationsError(err.message || "Failed to load investigations from OSPREY backend");
    } finally {
      setIsLoadingInvestigations(false);
    }
  }, [selectedInvestigationId]);

  // Handle selecting an investigation
  const handleSelectInvestigation = useCallback(
    async (id) => {
      if (!id) {
        setSelectedInvestigationId(null);
        setSelectedInvestigation(null);
        return;
      }

      setSelectedInvestigationId(id);
      const existing = investigations.find((i) => i.id === id);
      if (existing) {
        setSelectedInvestigation(existing);
      }

      try {
        const fullDetails = await getInvestigation(id);
        if (fullDetails) {
          setSelectedInvestigation(fullDetails);
        }
      } catch {
        // Fallback to existing list item
      }
    },
    [investigations]
  );

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
          investigations={investigations}
          selectedInvestigation={selectedInvestigation}
          selectedInvestigationId={selectedInvestigationId}
          isLoadingInvestigations={isLoadingInvestigations}
          investigationsError={investigationsError}
          onSelectInvestigation={handleSelectInvestigation}
          onRefreshInvestigations={handleRefreshInvestigations}
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
