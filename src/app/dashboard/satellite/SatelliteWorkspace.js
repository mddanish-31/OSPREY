"use client";

import SARSceneViewer from "./SARSceneViewer";
import SARSceneMetadata from "./SARSceneMetadata";
import SatellitePipeline from "./SatellitePipeline";
import SpillDetectionWorkspace from "./SpillDetectionWorkspace";
import SpillCharacterizationWorkspace from "./SpillCharacterizationWorkspace";
import Sentinel2CrossCheckWorkspace from "./Sentinel2CrossCheckWorkspace";
import { WORKSPACES } from "../dashboardConfig";
import styles from "./SatelliteWorkspace.module.css";

/**
 * SatelliteWorkspace
 *
 * Satellite Intelligence workspace orchestrating:
 * - #2 SAR Scene (Sentinel-1 C-band SAR scene analysis viewport, metadata, provenance)
 * - #3 AI Spill Detection (Candidate anomaly segmentation, 5-stage pipeline, model/result panels, look-alike filter)
 * - #4 Spill Characterization (Spatial geometry viewer, metrics, shape descriptors, provenance, characterization pipeline)
 * - #5 Sentinel-2 Cross-check (Optical observation viewport, MSI band context, conditional cross-check, provenance)
 *
 * @param {object} props
 * @param {string} props.activeCapability - Currently active sub-capability ID
 */
export default function SatelliteWorkspace({
  activeCapability = "sar-scene",
}) {
  const satelliteWorkspace = WORKSPACES.find((w) => w.id === "satellite");
  const currentCapability = satelliteWorkspace?.capabilities.find(
    (c) => c.id === activeCapability
  ) || satelliteWorkspace?.capabilities[0];

  // Render #3 AI Spill Detection workspace
  if (activeCapability === "spill-detection") {
    return <SpillDetectionWorkspace />;
  }

  // Render #4 Spill Characterization workspace
  if (activeCapability === "spill-characterization") {
    return <SpillCharacterizationWorkspace />;
  }

  // Render #5 Sentinel-2 Cross-check workspace
  if (
    activeCapability === "sentinel2-crosscheck" ||
    activeCapability === "sentinel-2-cross-check"
  ) {
    return <Sentinel2CrossCheckWorkspace />;
  }

  // Render #2 SAR Scene workspace (default)
  const isSarScene = !activeCapability || activeCapability === "sar-scene";

  return (
    <div className={styles.satelliteContainer} aria-label="Satellite Intelligence Workspace">
      {/* Top Workspace Context Header */}
      <div className={styles.workspaceHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.workspaceBadge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            <span className={styles.badgeNumber}>02</span>
            <span className={styles.badgeCategory}>SATELLITE INTELLIGENCE</span>
          </div>

          <div className={styles.titleGroup}>
            <h2 className={styles.workspaceTitle}>
              {currentCapability?.name || "SAR Scene"}
            </h2>
            <span className={styles.capabilityNumberBadge}>
              #{currentCapability?.num || 2}
            </span>
          </div>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.statusPill}>
            <span className={styles.statusDot} aria-hidden="true" />
            <span className={styles.statusText}>DATA STANDBY</span>
          </div>

          <div className={styles.stateChip}>
            <span>State: Standby</span>
          </div>
        </div>
      </div>

      {/* Main Workspace Body */}
      {isSarScene ? (
        <div className={styles.sarSceneLayout}>
          {/* Main Inspection Area: Viewer + Metadata */}
          <div className={styles.mainInspectionRow}>
            <SARSceneViewer />
            <SARSceneMetadata />
          </div>

          {/* Bottom Analytical Provenance Strip */}
          <SatellitePipeline />
        </div>
      ) : (
        /* Data-Ready Shell for Future Capabilities (#4, #5) */
        <div className={styles.futureCapabilityShell}>
          <div className={styles.futureCard}>
            <div className={styles.futureIconPill}>
              <span className={styles.futureNum}>#{currentCapability?.num}</span>
            </div>
            <h3 className={styles.futureHeading}>{currentCapability?.name}</h3>
            <p className={styles.futureDescription}>
              {currentCapability?.desc}
            </p>
            <div className={styles.futureNotice}>
              <span className={styles.noticeIcon} aria-hidden="true">ℹ</span>
              <p>
                This pipeline stage requires an active Sentinel-1 SAR observation. Ingest a SAR scene in capability <strong>#2 SAR Scene</strong> to enable downstream intelligence processing.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
