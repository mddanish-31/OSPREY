"use client";

import SpillDetectionViewport from "./SpillDetectionViewport";
import DetectionModelPanel from "./DetectionModelPanel";
import DetectionPipeline from "./DetectionPipeline";
import DetectionResult from "./DetectionResult";
import LookAlikeFilter from "./LookAlikeFilter";
import styles from "./SpillDetectionWorkspace.module.css";

/**
 * SpillDetectionWorkspace
 *
 * Primary orchestrator for capability #3: AI Spill Detection.
 * Assembles:
 * - SpillDetectionViewport (central segmentation viewport with disabled action controls)
 * - DetectionModelPanel (factual model architecture and data requirements)
 * - DetectionPipeline (5-stage sequential segmentation pipeline in Awaiting SAR Scene state)
 * - DetectionResult (structured inference summary in pending state)
 * - LookAlikeFilter (scientific context and look-alike discrimination architecture)
 */
export default function SpillDetectionWorkspace() {
  return (
    <div className={styles.workspaceContainer} aria-label="AI Spill Detection Workspace">
      {/* Top Header Bar */}
      <div className={styles.workspaceHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.workspaceBadge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            <span className={styles.badgeNumber}>03</span>
            <span className={styles.badgeCategory}>SATELLITE INTELLIGENCE</span>
          </div>

          <div className={styles.titleGroup}>
            <h2 className={styles.workspaceTitle}>AI Spill Detection</h2>
            <span className={styles.capabilityBadge}>#3</span>
          </div>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.statusPill}>
            <span className={styles.statusDot} aria-hidden="true" />
            <span className={styles.statusText}>DATA STANDBY</span>
          </div>

          <div className={styles.stateChip}>
            <span>Awaiting SAR Scene</span>
          </div>
        </div>
      </div>

      {/* Main Analysis Inspection Row */}
      <div className={styles.mainInspectionRow}>
        <SpillDetectionViewport />
        <DetectionModelPanel />
      </div>

      {/* 5-Stage Segmentation Pipeline */}
      <DetectionPipeline />

      {/* Bottom Result & Look-Alike Filter Grid */}
      <div className={styles.bottomGrid}>
        <DetectionResult />
        <LookAlikeFilter />
      </div>
    </div>
  );
}
