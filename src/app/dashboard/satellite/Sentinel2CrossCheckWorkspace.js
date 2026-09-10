"use client";

import Sentinel2Viewer from "./Sentinel2Viewer";
import OpticalSceneMetadata from "./OpticalSceneMetadata";
import OpticalBandsPanel from "./OpticalBandsPanel";
import OpticalCrossCheck from "./OpticalCrossCheck";
import CrossCheckProvenance from "./CrossCheckProvenance";
import CrossCheckPipeline from "./CrossCheckPipeline";
import styles from "./Sentinel2CrossCheckWorkspace.module.css";

/**
 * Sentinel2CrossCheckWorkspace
 *
 * Primary orchestrator for capability #5: Sentinel-2 Cross-check.
 * Assembles:
 * - Sentinel2Viewer (optical observation viewport with disabled future-ready controls)
 * - OpticalSceneMetadata (Sentinel-2 MSI scene parameters and data source context)
 * - OpticalBandsPanel (MSI band suite context and scientific disclaimer)
 * - OpticalCrossCheck (conditional SAR/optical validation summary in pending state)
 * - CrossCheckProvenance (4-step lineage: #2 SAR Scene → #3 AI Detection → #4 Characterization → #5 Optical Check)
 * - CrossCheckPipeline (5-stage optical cross-check processing sequence)
 */
export default function Sentinel2CrossCheckWorkspace() {
  return (
    <div className={styles.workspaceContainer} aria-label="Sentinel-2 Optical Cross-Check Workspace">
      {/* Top Header Bar */}
      <div className={styles.workspaceHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.workspaceBadge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            <span className={styles.badgeNumber}>05</span>
            <span className={styles.badgeCategory}>SATELLITE INTELLIGENCE</span>
          </div>

          <div className={styles.titleGroup}>
            <h2 className={styles.workspaceTitle}>Sentinel-2 Cross-check</h2>
            <span className={styles.capabilityBadge}>#5</span>
          </div>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.statusPill}>
            <span className={styles.statusDot} aria-hidden="true" />
            <span className={styles.statusText}>DATA STANDBY</span>
          </div>

          <div className={styles.stateChip}>
            <span>Awaiting Optical Scene</span>
          </div>
        </div>
      </div>

      {/* Main Optical Observation Inspection Row */}
      <div className={styles.mainInspectionRow}>
        <Sentinel2Viewer />
        <OpticalSceneMetadata />
      </div>

      {/* Optical Bands Panel */}
      <OpticalBandsPanel />

      {/* 5-Stage Cross-Check Pipeline */}
      <CrossCheckPipeline />

      {/* Bottom Cross-Check & Provenance Grid */}
      <div className={styles.bottomGrid}>
        <OpticalCrossCheck />
        <CrossCheckProvenance />
      </div>
    </div>
  );
}
