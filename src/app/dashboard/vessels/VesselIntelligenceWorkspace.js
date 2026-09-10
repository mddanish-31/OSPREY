"use client";

import AISCorrelationViewer from "./AISCorrelationViewer";
import VesselCandidatePanel from "./VesselCandidatePanel";
import VesselTrajectoryAnalysis from "./VesselTrajectoryAnalysis";
import BehaviouralFingerprint from "./BehaviouralFingerprint";
import DarkVesselDetection from "./DarkVesselDetection";
import VesselAttribution from "./VesselAttribution";
import VesselPipeline from "./VesselPipeline";
import VesselProvenance from "./VesselProvenance";
import styles from "./VesselIntelligenceWorkspace.module.css";

/**
 * VesselIntelligenceWorkspace
 *
 * Primary orchestrator for capability #7: Vessel Intelligence / AIS Correlation.
 * Assembles:
 * - AISCorrelationViewer (central spatial-analysis viewport with oceanic atmosphere & disabled controls)
 * - VesselCandidatePanel (candidate set parameters, search radius, inspection trigger in standby)
 * - VesselTrajectoryAnalysis (spatiotemporal track alignment & proximity correlation)
 * - BehaviouralFingerprint (route deviation, speed profile, loitering & broadcast gap profiling)
 * - DarkVesselDetection (SAR radar point target vs AIS transponder cross-matching)
 * - VesselAttribution (7-factor explainable multi-source evidence synthesis)
 * - VesselPipeline (7-stage vessel correlation pipeline in standby)
 * - VesselProvenance (lineage from #3 AI Detection → #4 Characterization → #6 Drift → #7 Vessels)
 */
export default function VesselIntelligenceWorkspace() {
  const dependencyStages = [
    { num: "#3", name: "Spill Geometry", state: "Awaiting SAR detection" },
    { num: "#6", name: "Probable Origin", state: "Awaiting drift reconstruction" },
    { num: "AIS", name: "Historical Broadcasts", state: "Awaiting dataset" },
    { num: "#7", name: "Vessel Correlation", state: "Awaiting context" },
    { num: "Attr", name: "Attribution", state: "Pending evidence" },
  ];

  return (
    <div className={styles.workspaceContainer} aria-label="Vessel Intelligence Workspace">
      {/* Top Header Bar */}
      <div className={styles.workspaceHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.workspaceBadge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            <span className={styles.badgeNumber}>07</span>
            <span className={styles.badgeCategory}>VESSEL INTELLIGENCE</span>
          </div>

          <div className={styles.titleGroup}>
            <h2 className={styles.workspaceTitle}>Vessel Intelligence</h2>
            <span className={styles.capabilityBadge}>#7</span>
          </div>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.statusPill}>
            <span className={styles.statusDot} aria-hidden="true" />
            <span className={styles.statusText}>DATA STANDBY</span>
          </div>

          <div className={styles.stateChip}>
            <span>Awaiting Investigation Context</span>
          </div>
        </div>
      </div>

      {/* Dependency Flow Context Banner */}
      <div className={styles.dependencyBanner} aria-label="Investigation Dependency Flow">
        <div className={styles.bannerLeft}>
          <span className={styles.bannerBadge}>DEPENDENCY CHAIN</span>
          <span className={styles.bannerNotice}>
            Vessel analysis requires upstream candidate spill geometry (#3/#4) and probable origin zone (#6).
          </span>
        </div>
        <div className={styles.dependencyTrack}>
          {dependencyStages.map((step, idx) => (
            <div key={idx} className={styles.dependencyItem}>
              <div className={styles.stepBox}>
                <span className={styles.stepNum}>{step.num}</span>
                <span className={styles.stepName}>{step.name}</span>
              </div>
              {idx < dependencyStages.length - 1 && (
                <span className={styles.stepArrow} aria-hidden="true">→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Spatial Analysis Inspection Row */}
      <div className={styles.mainInspectionRow}>
        <AISCorrelationViewer />
        <VesselCandidatePanel />
      </div>

      {/* 7-Stage Vessel Pipeline */}
      <VesselPipeline />

      {/* Trajectory & Behavioural Grid */}
      <div className={styles.analysisGrid}>
        <VesselTrajectoryAnalysis />
        <BehaviouralFingerprint />
      </div>

      {/* Dark Vessel Detection Panel */}
      <DarkVesselDetection />

      {/* Bottom Attribution & Provenance Grid */}
      <div className={styles.bottomGrid}>
        <VesselAttribution />
        <VesselProvenance />
      </div>
    </div>
  );
}
