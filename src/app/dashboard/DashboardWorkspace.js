"use client";

import { WORKSPACES } from "./dashboardConfig";
import OverviewWorkspace from "./overview/OverviewWorkspace";
import SatelliteWorkspace from "./satellite/SatelliteWorkspace";
import DriftOceanWorkspace from "./drift/DriftOceanWorkspace";
import VesselIntelligenceWorkspace from "./vessels/VesselIntelligenceWorkspace";
import EvidenceExplainabilityWorkspace from "./evidence/EvidenceExplainabilityWorkspace";
import EnvironmentalRiskWorkspace from "./environment/EnvironmentalRiskWorkspace";
import ResponseIntelligenceWorkspace from "./response/ResponseIntelligenceWorkspace";
import CopilotWorkspace from "./copilot/CopilotWorkspace";
import ReportsWorkspace from "./reports/ReportsWorkspace";
import IncidentReplayWorkspace from "./replay/IncidentReplayWorkspace";
import styles from "./DashboardWorkspace.module.css";

/**
 * DashboardWorkspace
 *
 * Primary investigation workspace shell.
 * Renders the active workspace:
 * - Overview: Map-first geographic picture with data-ready context cards
 * - Satellite: Dedicated Sentinel-1 SAR & Sentinel-2 workspaces
 * - Drift: Dedicated Drift & Ocean Dynamics workspace
 * - Vessels: Dedicated Vessel Intelligence & AIS Correlation workspace
 * - Evidence: Dedicated Evidence & Explainability workspace
 * - Environment: Dedicated Environmental Risk & Impact workspace
 * - Response: Dedicated Response Intelligence workspace
 *
 * @param {object} props
 * @param {string} [props.activeWorkspace="overview"] - Active workspace ID
 * @param {string} [props.activeCapability] - Active sub-capability ID
 * @param {function} [props.onSelectWorkspace] - Callback to switch workspace
 * @param {Array<object>} [props.investigations=[]] - Available investigations
 * @param {object|null} [props.selectedInvestigation=null] - Currently selected investigation
 * @param {string|null} [props.selectedInvestigationId=null] - Currently selected investigation ID
 * @param {boolean} [props.isLoadingInvestigations=false] - Investigation loading status
 * @param {string|null} [props.investigationsError=null] - Investigation error message
 * @param {function} [props.onSelectInvestigation] - Handler to select an investigation
 * @param {function} [props.onRefreshInvestigations] - Handler to refresh investigations list
 */
export default function DashboardWorkspace({
  activeWorkspace = "overview",
  activeCapability,
  onSelectWorkspace,
  investigations = [],
  selectedInvestigation = null,
  selectedInvestigationId = null,
  isLoadingInvestigations = false,
  investigationsError = null,
  onSelectInvestigation,
  onRefreshInvestigations,
}) {
  if (activeWorkspace === "satellite") {
    return (
      <main className={styles.workspaceMain} aria-label="Satellite Workspace">
        <SatelliteWorkspace
          activeCapability={activeCapability}
          selectedInvestigation={selectedInvestigation}
          selectedInvestigationId={selectedInvestigationId}
          investigations={investigations}
          onSelectInvestigation={onSelectInvestigation}
        />
      </main>
    );
  }

  if (
    activeCapability === "drift-reconstruction" ||
    activeCapability === "drift-ocean" ||
    (activeWorkspace === "drift" &&
      activeCapability !== "ocean-dynamics" &&
      activeCapability !== "whatif-simulation")
  ) {
    return (
      <main className={styles.workspaceMain} aria-label="Drift & Ocean Workspace">
        <DriftOceanWorkspace />
      </main>
    );
  }

  if (
    activeWorkspace === "vessels" ||
    activeCapability === "ais-correlation" ||
    activeCapability === "vessel-intelligence"
  ) {
    return (
      <main className={styles.workspaceMain} aria-label="Vessel Intelligence Workspace">
        <VesselIntelligenceWorkspace />
      </main>
    );
  }

  if (
    activeCapability === "explainability" ||
    activeCapability === "evidence-explainability" ||
    (activeWorkspace === "evidence" &&
      activeCapability !== "incident-replay" &&
      activeCapability !== "whatif-simulation")
  ) {
    return (
      <main className={styles.workspaceMain} aria-label="Evidence & Explainability Workspace">
        <EvidenceExplainabilityWorkspace />
      </main>
    );
  }

  if (
    activeCapability === "incident-replay" ||
    activeCapability === "whatif-simulation" ||
    activeCapability === "replay" ||
    activeWorkspace === "replay"
  ) {
    return (
      <main className={styles.workspaceMain} aria-label="Incident Replay Workspace">
        <IncidentReplayWorkspace />
      </main>
    );
  }

  if (
    activeWorkspace === "environment" ||
    activeCapability === "environmental-risk" ||
    activeCapability === "affected-areas"
  ) {
    return (
      <main className={styles.workspaceMain} aria-label="Environmental Risk & Impact Workspace">
        <EnvironmentalRiskWorkspace />
      </main>
    );
  }

  if (
    activeWorkspace === "response" ||
    activeCapability === "response-intelligence" ||
    activeCapability === "response-actions" ||
    activeCapability === "priority-assessment"
  ) {
    return (
      <main className={styles.workspaceMain} aria-label="Response Intelligence Workspace">
        <ResponseIntelligenceWorkspace />
      </main>
    );
  }

  if (
    activeWorkspace === "copilot" ||
    activeCapability === "ai-copilot" ||
    activeCapability === "copilot"
  ) {
    return (
      <main className={styles.workspaceMain} aria-label="AI Copilot Workspace">
        <CopilotWorkspace />
      </main>
    );
  }

  if (
    activeWorkspace === "reports" ||
    activeCapability === "investigation-report" ||
    activeCapability === "reports"
  ) {
    return (
      <main className={styles.workspaceMain} aria-label="Investigation Reports Workspace">
        <ReportsWorkspace />
      </main>
    );
  }

  return (
    <main className={styles.workspaceMain} aria-label="Investigation Workspace">
      <OverviewWorkspace
        investigations={investigations}
        selectedInvestigation={selectedInvestigation}
        selectedId={selectedInvestigationId}
        isLoading={isLoadingInvestigations}
        error={investigationsError}
        onSelectInvestigation={onSelectInvestigation}
        onRefreshInvestigations={onRefreshInvestigations}
      />
    </main>
  );
}
