"use client";

import GeometryViewer from "./GeometryViewer";
import GeometryMetrics from "./GeometryMetrics";
import ShapeCharacteristics from "./ShapeCharacteristics";
import CharacterizationProvenance from "./CharacterizationProvenance";
import CharacterizationPipeline from "./CharacterizationPipeline";
import styles from "./SpillCharacterizationWorkspace.module.css";

/**
 * SpillCharacterizationWorkspace
 *
 * Primary orchestrator for capability #4: Spill Characterization.
 * Assembles:
 * - GeometryViewer (spatial-analysis viewport with disabled future-ready controls)
 * - GeometryMetrics (spatial metrics, perimeter, area, centroid in pending state)
 * - ShapeCharacteristics (orientation, compactness, boundary complexity, spatial confidence)
 * - CharacterizationProvenance (upstream lineage from #2 SAR Scene and #3 AI Spill Detection)
 * - CharacterizationPipeline (5-stage spatial characterization sequence)
 */
export default function SpillCharacterizationWorkspace() {
  return (
    <div className={styles.workspaceContainer} aria-label="Spill Characterization Workspace">
      {/* Top Header Bar */}
      <div className={styles.workspaceHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.workspaceBadge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            <span className={styles.badgeNumber}>04</span>
            <span className={styles.badgeCategory}>SATELLITE INTELLIGENCE</span>
          </div>

          <div className={styles.titleGroup}>
            <h2 className={styles.workspaceTitle}>Spill Characterization</h2>
            <span className={styles.capabilityBadge}>#4</span>
          </div>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.statusPill}>
            <span className={styles.statusDot} aria-hidden="true" />
            <span className={styles.statusText}>DATA STANDBY</span>
          </div>

          <div className={styles.stateChip}>
            <span>Awaiting Detection</span>
          </div>
        </div>
      </div>

      {/* Main Spatial Analysis Inspection Row */}
      <div className={styles.mainInspectionRow}>
        <GeometryViewer />
        <GeometryMetrics />
      </div>

      {/* 5-Stage Characterization Pipeline */}
      <CharacterizationPipeline />

      {/* Bottom Descriptors & Provenance Grid */}
      <div className={styles.bottomGrid}>
        <ShapeCharacteristics />
        <CharacterizationProvenance />
      </div>
    </div>
  );
}
