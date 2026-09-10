"use client";

import ImpactMapViewer from "./ImpactMapViewer";
import CoastalExposure from "./CoastalExposure";
import SensitiveAreaAnalysis from "./SensitiveAreaAnalysis";
import FisheriesExposure from "./FisheriesExposure";
import AffectedAreaAnalysis from "./AffectedAreaAnalysis";
import EnvironmentalRiskAssessment from "./EnvironmentalRiskAssessment";
import RiskPipeline from "./RiskPipeline";
import EnvironmentalProvenance from "./EnvironmentalProvenance";
import styles from "./EnvironmentalRiskWorkspace.module.css";

/**
 * EnvironmentalRiskWorkspace
 *
 * Primary orchestrator for Capability #9: Environmental Risk & Impact.
 * Assembles:
 * - ImpactMapViewer (primary spatial-analysis viewport for environmental exposure)
 * - CoastalExposure (coastal boundary intersection & shoreline vulnerability)
 * - SensitiveAreaAnalysis (marine protected areas, critical habitats, ecological zones)
 * - FisheriesExposure (commercial & artisanal fishing zone vulnerability)
 * - AffectedAreaAnalysis (spill geometry & drift envelope extent synthesis)
 * - EnvironmentalRiskAssessment (6-factor multi-source risk assessment panel)
 * - RiskPipeline (8-stage pipeline from geometry to interpretation)
 * - EnvironmentalProvenance (5-step end-to-end lineage from #3 Detection to #9 Risk)
 */
export default function EnvironmentalRiskWorkspace() {
  const dependencyStages = [
    { name: "Spill Geometry" },
    { name: "Drift Projection" },
    { name: "Affected Area" },
    { name: "Coastal Exposure" },
    { name: "Sensitive Areas" },
    { name: "Fisheries Exposure" },
    { name: "Environmental Risk" },
  ];

  return (
    <div className={styles.workspaceContainer} aria-label="Environmental Risk &amp; Impact Workspace">
      {/* Top Header Bar */}
      <div className={styles.workspaceHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.workspaceBadge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            <span className={styles.badgeNumber}>09</span>
            <span className={styles.badgeCategory}>ENVIRONMENTAL RISK</span>
          </div>

          <div className={styles.titleGroup}>
            <h2 className={styles.workspaceTitle}>Environmental Risk &amp; Impact</h2>
            <span className={styles.capabilityBadge}>#9</span>
          </div>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.statusPill}>
            <span className={styles.statusDot} aria-hidden="true" />
            <span className={styles.statusText}>DATA STANDBY</span>
          </div>

          <div className={styles.stateChip}>
            <span>Awaiting Spill Projection</span>
          </div>
        </div>
      </div>

      {/* Dependency Chain Banner */}
      <div className={styles.dependencyBanner} aria-label="Environmental Dependency Chain">
        <div className={styles.bannerLeft}>
          <span className={styles.bannerBadge}>EXPOSURE DEPENDENCY CHAIN</span>
          <span className={styles.bannerNotice}>
            Environmental risk assessment evaluates coastal, habitat, and fisheries exposure from projected drift envelopes.
          </span>
        </div>
        <div className={styles.dependencyTrack}>
          {dependencyStages.map((step, idx) => (
            <div key={idx} className={styles.dependencyItem}>
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

      {/* Main Spatial Analysis Inspection Row: Dominant Map Canvas + Coastal Exposure */}
      <div className={styles.mainInspectionRow}>
        <ImpactMapViewer />
        <CoastalExposure />
      </div>

      {/* 8-Stage Risk Pipeline */}
      <RiskPipeline />

      {/* Sensitive Marine Areas & Fisheries Exposure 2-Column Grid */}
      <div className={styles.analysisGrid}>
        <SensitiveAreaAnalysis />
        <FisheriesExposure />
      </div>

      {/* Affected Area Analysis & Environmental Risk Assessment 2-Column Grid */}
      <div className={styles.analysisGrid}>
        <AffectedAreaAnalysis />
        <EnvironmentalRiskAssessment />
      </div>

      {/* Bottom Provenance & Lineage */}
      <div className={styles.bottomGrid}>
        <EnvironmentalProvenance />
      </div>
    </div>
  );
}
