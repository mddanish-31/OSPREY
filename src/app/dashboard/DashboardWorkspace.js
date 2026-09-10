"use client";

import { WORKSPACES } from "./dashboardConfig";
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
 * - Satellite: Dedicated Sentinel-1 SAR & Sentinel-2 workspaces (#2, #3, #4, #5)
 * - Drift: Dedicated Drift & Ocean Dynamics workspace (#6)
 * - Vessels: Dedicated Vessel Intelligence & AIS Correlation workspace (#7)
 * - Evidence: Dedicated Evidence & Explainability workspace (#8)
 * - Environment: Dedicated Environmental Risk & Impact workspace (#9)
 * - Response: Dedicated Response Intelligence workspace (#10)
 *
 * @param {object} props
 * @param {string} props.activeWorkspace - Active workspace ID
 * @param {string} props.activeCapability - Active sub-capability ID
 * @param {function} props.onSelectWorkspace - Callback to switch workspace
 */
export default function DashboardWorkspace({
  activeWorkspace = "overview",
  activeCapability,
  onSelectWorkspace,
}) {
  if (activeWorkspace === "satellite") {
    return (
      <main className={styles.workspaceMain} aria-label="Satellite Workspace">
        <SatelliteWorkspace activeCapability={activeCapability} />
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

  const currentWorkspaceObj = WORKSPACES.find((w) => w.id === activeWorkspace);

  return (
    <main className={styles.workspaceMain} aria-label="Investigation Workspace">
      {/* Top Workspace Context Header Bar */}
      <div className={styles.workspaceHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.workspaceBadge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            <span className={styles.badgeNumber}>{currentWorkspaceObj?.number || "01"}</span>
            <span className={styles.badgeCategory}>
              {currentWorkspaceObj?.category || "INVESTIGATION OVERVIEW"}
            </span>
          </div>

          <h2 className={styles.workspaceTitle}>
            {activeWorkspace === "overview"
              ? "Geographic Investigation Picture"
              : currentWorkspaceObj?.label}
          </h2>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.sessionStatusPill}>
            <span className={styles.sessionBeaconDot} />
            <span className={styles.sessionStatusText}>Awaiting Investigation Data</span>
          </div>

          <div className={styles.ingestionReadyChip}>
            <span>State: Standby</span>
          </div>
        </div>
      </div>

      {/* ===================================================
          Central Primary Investigation Map / Workspace Viewport
          =================================================== */}
      <div className={styles.mapViewport} aria-label="Geographic Investigation Map Canvas">
        {/* Subtle Geographic Grid & Reticles (Clean Geographic Frame, Zero Fake Coordinates) */}
        <div className={styles.geoGridOverlay} aria-hidden="true">
          <div className={styles.reticleTopLeft}>┌</div>
          <div className={styles.reticleTopRight}>┐</div>
          <div className={styles.reticleBottomLeft}>└</div>
          <div className={styles.reticleBottomRight}>┘</div>
          <div className={styles.centerCompassReticle}>✛</div>
        </div>

        {/* Ocean Ambient Atmospheric Illumination */}
        <div className={styles.oceanMapAtmosphere} aria-hidden="true">
          <div className={styles.oceanAmbientGlow} />
          <div className={styles.oceanAmbientGlow2} />
        </div>

        {/* Center Investigation State Empty / Staging Prompt */}
        <div className={styles.mapPromptContainer}>
          <div className={styles.mapPromptRing}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={styles.mapPromptIcon}
              aria-hidden="true"
            >
              <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
              <line x1="9" y1="3" x2="9" y2="18" />
              <line x1="15" y1="6" x2="15" y2="21" />
            </svg>
          </div>

          <h3 className={styles.mapPromptHeading}>
            {activeWorkspace === "overview"
              ? "Geographic Canvas Ready"
              : `${currentWorkspaceObj?.label} Workspace Active`}
          </h3>

          <p className={styles.mapPromptText}>
            {activeWorkspace === "overview"
              ? "No investigation data is currently loaded. Ingest a Sentinel-1 SAR scene or AIS dataset to populate the operational picture."
              : `Operational workspace for ${currentWorkspaceObj?.description}. Ready to receive dynamic pipeline telemetry.`}
          </p>

          <div className={styles.feedStatusList}>
            <span className={styles.feedPill}>
              <span className={styles.feedDot} />
              <span>Sentinel-1 SAR: Standby</span>
            </span>
            <span className={styles.feedPill}>
              <span className={styles.feedDot} />
              <span>AIS Vessel Stream: Standby</span>
            </span>
            <span className={styles.feedPill}>
              <span className={styles.feedDot} />
              <span>Ocean &amp; Wind: Standby</span>
            </span>
          </div>
        </div>

        {/* ===================================================
            Floating Contextual Glass Cards (Bottom Area)
            =================================================== */}
        <div className={styles.floatingCardsRow} aria-label="Investigation Context Layers">
          {/* Card 1: Spill Object */}
          <div className={styles.contextCard}>
            <div className={styles.cardTop}>
              <span className={styles.cardBadge}>01 // SATELLITE</span>
              <span className={styles.cardStatusAwaiting}>Awaiting Investigation</span>
            </div>
            <h4 className={styles.cardTitle}>Spill Surface Object</h4>
            <div className={styles.cardMetaGrid}>
              <div className={styles.cardMetaItem}>
                <span className={styles.metaKey}>Geometry</span>
                <span className={styles.metaVal}>SAR scene required</span>
              </div>
              <div className={styles.cardMetaItem}>
                <span className={styles.metaKey}>Mask Status</span>
                <span className={styles.metaVal}>Awaiting scene ingestion</span>
              </div>
            </div>
          </div>

          {/* Card 2: Probable Origin */}
          <div className={styles.contextCard}>
            <div className={styles.cardTop}>
              <span className={styles.cardBadge}>02 // DRIFT</span>
              <span className={styles.cardStatusAwaiting}>Awaiting spill geometry</span>
            </div>
            <h4 className={styles.cardTitle}>Probable Origin Zone</h4>
            <div className={styles.cardMetaGrid}>
              <div className={styles.cardMetaItem}>
                <span className={styles.metaKey}>Trajectory</span>
                <span className={styles.metaVal}>Origin reconstruction unavailable until detection geometry exists</span>
              </div>
              <div className={styles.cardMetaItem}>
                <span className={styles.metaKey}>Forcing</span>
                <span className={styles.metaVal}>CMEMS / ERA5 Standby</span>
              </div>
            </div>
          </div>

          {/* Card 3: Correlated Vessels */}
          <div className={styles.contextCard}>
            <div className={styles.cardTop}>
              <span className={styles.cardBadge}>03 // AIS</span>
              <span className={styles.cardStatusAwaiting}>No investigation loaded</span>
            </div>
            <h4 className={styles.cardTitle}>Correlated Vessels</h4>
            <div className={styles.cardMetaGrid}>
              <div className={styles.cardMetaItem}>
                <span className={styles.metaKey}>AIS Candidates</span>
                <span className={styles.metaVal}>AIS correlation unavailable until investigation context exists</span>
              </div>
              <div className={styles.cardMetaItem}>
                <span className={styles.metaKey}>Dark Vessels</span>
                <span className={styles.metaVal}>Cross-check standby</span>
              </div>
            </div>
          </div>

          {/* Card 4: Environmental Risk */}
          <div className={styles.contextCard}>
            <div className={styles.cardTop}>
              <span className={styles.cardBadge}>04 // RISK</span>
              <span className={styles.cardStatusAwaiting}>Awaiting spill projection</span>
            </div>
            <h4 className={styles.cardTitle}>Environmental Exposure</h4>
            <div className={styles.cardMetaGrid}>
              <div className={styles.cardMetaItem}>
                <span className={styles.metaKey}>Coastline</span>
                <span className={styles.metaVal}>Risk analysis becomes available after spill geometry + environmental data</span>
              </div>
              <div className={styles.cardMetaItem}>
                <span className={styles.metaKey}>Sensitive Habitats</span>
                <span className={styles.metaVal}>Marine reserve exposure standby</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
