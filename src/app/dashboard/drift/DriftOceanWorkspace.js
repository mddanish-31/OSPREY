"use client";

import DriftMapViewer from "./DriftMapViewer";
import EnvironmentalForcing from "./EnvironmentalForcing";
import OriginReconstruction from "./OriginReconstruction";
import ForwardDriftProjection from "./ForwardDriftProjection";
import DriftUncertainty from "./DriftUncertainty";
import DriftPipeline from "./DriftPipeline";
import DriftProvenance from "./DriftProvenance";
import styles from "./DriftOceanWorkspace.module.css";

/**
 * DriftOceanWorkspace
 *
 * Primary orchestrator for capability #6: Drift & Ocean Dynamics.
 * Assembles:
 * - DriftMapViewer (central spatial-analysis viewport with oceanic atmosphere & disabled controls)
 * - EnvironmentalForcing (CMEMS ocean current & ERA5 wind forcing context)
 * - OriginReconstruction (backward Lagrangian advection & probable origin zone panel)
 * - ForwardDriftProjection (forward trajectory forecasting & drift envelope panel)
 * - DriftUncertainty (stochastic trajectory ensemble & dispersion uncertainty panel)
 * - DriftPipeline (6-stage hydrodynamic reconstruction pipeline in standby)
 * - DriftProvenance (lineage from #3 AI Detection → #4 Characterization → #6 Drift)
 */
export default function DriftOceanWorkspace() {
  const modelContext = [
    { label: "Drift Engine", value: "OpenDrift / OpenOil" },
    { label: "Wind Source", value: "ERA5" },
    { label: "Ocean Source", value: "CMEMS" },
    { label: "Modes", value: "Backward / Forward" },
    { label: "Engine State", value: "Awaiting environmental inputs" },
  ];

  return (
    <div className={styles.workspaceContainer} aria-label="Drift & Ocean Dynamics Workspace">
      {/* Top Header Bar */}
      <div className={styles.workspaceHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.workspaceBadge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            <span className={styles.badgeNumber}>06</span>
            <span className={styles.badgeCategory}>DRIFT &amp; OCEAN DYNAMICS</span>
          </div>

          <div className={styles.titleGroup}>
            <h2 className={styles.workspaceTitle}>Drift &amp; Ocean Dynamics</h2>
            <span className={styles.capabilityBadge}>#6</span>
          </div>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.statusPill}>
            <span className={styles.statusDot} aria-hidden="true" />
            <span className={styles.statusText}>DATA STANDBY</span>
          </div>

          <div className={styles.stateChip}>
            <span>Awaiting Candidate Spill Geometry</span>
          </div>
        </div>
      </div>

      {/* Model & Data Lineage Context Banner */}
      <div className={styles.modelContextBanner} aria-label="Drift Model Architecture Context">
        <div className={styles.contextBannerLeft}>
          <span className={styles.contextBannerBadge}>HYDRODYNAMIC FRAMEWORK</span>
          <span className={styles.contextBannerNotice}>Planned processing &amp; ingestion sources</span>
        </div>
        <div className={styles.contextItemsRow}>
          {modelContext.map((item, idx) => (
            <div key={idx} className={styles.contextItem}>
              <span className={styles.contextLabel}>{item.label}:</span>
              <span className={styles.contextValue}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Spatial Analysis Inspection Row */}
      <div className={styles.mainInspectionRow}>
        <DriftMapViewer />
        <EnvironmentalForcing />
      </div>

      {/* 6-Stage Drift Pipeline */}
      <DriftPipeline />

      {/* Dual Reconstruction & Projection Grid */}
      <div className={styles.reconstructionGrid}>
        <OriginReconstruction />
        <ForwardDriftProjection />
      </div>

      {/* Bottom Uncertainty & Provenance Grid */}
      <div className={styles.bottomGrid}>
        <DriftUncertainty />
        <DriftProvenance />
      </div>
    </div>
  );
}
