"use client";

import EvidenceChain from "./EvidenceChain";
import EvidenceSourcePanel from "./EvidenceSourcePanel";
import SpatialTemporalEvidence from "./SpatialTemporalEvidence";
import BehaviouralEvidence from "./BehaviouralEvidence";
import CrossSensorEvidence from "./CrossSensorEvidence";
import AttributionExplanation from "./AttributionExplanation";
import EvidencePipeline from "./EvidencePipeline";
import EvidenceProvenance from "./EvidenceProvenance";
import styles from "./EvidenceExplainabilityWorkspace.module.css";

/**
 * EvidenceExplainabilityWorkspace
 *
 * Primary orchestrator for Evidence & Explainability.
 * Assembles:
 * - EvidenceChain (dominant centerpiece evidence progression spine)
 * - EvidenceSourcePanel (satellite, optical, hydrodynamic, wind, AIS, drift sources context)
 * - SpatialTemporalEvidence (slick geometry, origin envelope, and AIS spatiotemporal intersection)
 * - BehaviouralEvidence (route deviation, speed profiling, loitering & transponder gap signals)
 * - CrossSensorEvidence (SAR radar vs transponder cross-matching for potential non-broadcasting vessels)
 * - AttributionExplanation (7-factor explainable multi-source association synthesis)
 * - EvidencePipeline (8-stage evidence synthesis pipeline in standby)
 * - EvidenceProvenance (5-step end-to-end lineage from Detection to Attribution)
 */
export default function EvidenceExplainabilityWorkspace() {
  const dependencyStages = [
    { id: "spill-detection", name: "Spill Detection" },
    { id: "spill-geometry", name: "Spill Geometry" },
    { id: "origin-reconstruction", name: "Origin Reconstruction" },
    { id: "ais-correlation", name: "AIS Correlation" },
    { id: "behavioural-analysis", name: "Behavioural Analysis" },
    { id: "cross-sensor-evidence", name: "Cross-Sensor Evidence" },
    { id: "explainable-association", name: "Explainable Association" },
  ];

  return (
    <div className={styles.workspaceContainer} aria-label="Evidence &amp; Explainability Workspace">
      {/* Top Header Bar */}
      <div className={styles.workspaceHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.workspaceBadge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            <span className={styles.badgeCategory}>EVIDENCE &amp; EXPLAINABILITY</span>
          </div>

          <div className={styles.titleGroup}>
            <h2 className={styles.workspaceTitle}>Evidence &amp; Explainability</h2>
          </div>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.statusPill}>
            <span className={styles.statusDot} aria-hidden="true" />
            <span className={styles.statusText}>DATA STANDBY</span>
          </div>

          <div className={styles.stateChip}>
            <span>Awaiting Investigation Evidence</span>
          </div>
        </div>
      </div>

      {/* Dependency Flow Context Banner */}
      <div className={styles.dependencyBanner} aria-label="Evidence Dependency Chain">
        <div className={styles.bannerLeft}>
          <span className={styles.bannerBadge}>EVIDENCE SYNTHESIS SPINE</span>
          <span className={styles.bannerNotice}>
            Multi-source evidence synthesis correlates satellite SAR, hydrodynamic drift, and AIS telemetry.
          </span>
        </div>
        <div className={styles.dependencyTrack}>
          {dependencyStages.map((step, idx) => (
            <div key={step.id} className={styles.dependencyItem}>
              <div className={styles.stepBox}>
                <span className={styles.stepName}>{step.name}</span>
              </div>
              {idx < dependencyStages.length - 1 && (
                <span className={styles.stepArrow} aria-hidden="true">→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Inspection Row: Centerpiece Evidence Chain + Evidence Sources */}
      <div className={styles.mainInspectionRow}>
        <div className={styles.centerpieceCol}>
          <EvidenceChain />
        </div>
        <EvidenceSourcePanel />
      </div>

      {/* 8-Stage Evidence Synthesis Pipeline */}
      <EvidencePipeline />

      {/* Spatial/Temporal & Behavioural Evidence Grid */}
      <div className={styles.analysisGrid}>
        <SpatialTemporalEvidence />
        <BehaviouralEvidence />
      </div>

      {/* Cross-Sensor Radar/AIS Fusion Panel */}
      <CrossSensorEvidence />

      {/* Bottom Attribution & Provenance Grid */}
      <div className={styles.bottomGrid}>
        <AttributionExplanation />
        <EvidenceProvenance />
      </div>
    </div>
  );
}
