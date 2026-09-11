"use client";

import ReportBuilder from "./ReportBuilder";
import ReportPreview from "./ReportPreview";
import ReportSections from "./ReportSections";
import ReportEvidenceIndex from "./ReportEvidenceIndex";
import ReportSummary from "./ReportSummary";
import ReportProvenance from "./ReportProvenance";
import ReportPipeline from "./ReportPipeline";
import styles from "./ReportsWorkspace.module.css";

/**
 * ReportsWorkspace
 *
 * Primary workspace orchestrator for Investigation Reports.
 * Assembles:
 * - Header: INVESTIGATION REPORTS, DATA STANDBY, Awaiting Investigation Context
 * - Subtitle Banner: Compile verified investigation evidence into a structured operational report.
 * - ReportBuilder: Configuration panel with report types & disabled compilation controls
 * - ReportPreview: Conceptual document preview canvas with disabled export controls
 * - ReportSections: 13-section structured breakdown in awaiting state
 * - ReportEvidenceIndex: 8-category evidence compilation index in standby
 * - ReportPipeline: 7-stage report generation lifecycle pipeline in standby
 * - ReportSummary: Operational synthesis assessment in truthful standby
 * - ReportProvenance: Multi-source evidence lineage across detection, characterization, drift, vessel intelligence, explainability, risk, and response
 */
export default function ReportsWorkspace() {
  const reportWorkflowChain = [
    { id: "scene-ingestion", name: "Scene Ingestion" },
    { id: "detection", name: "Detection" },
    { id: "origin-drift", name: "Origin Drift" },
    { id: "vessel-ais", name: "Vessel AIS" },
    { id: "explainability", name: "Explainability" },
    { id: "environmental-risk", name: "Environmental Risk" },
    { id: "response", name: "Response" },
    { id: "report-compilation", name: "Report Compilation" },
  ];

  return (
    <div className={styles.workspaceContainer} aria-label="Investigation Reports Workspace">
      {/* Top Header Bar */}
      <div className={styles.workspaceHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.workspaceBadge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            <span className={styles.badgeCategory}>INVESTIGATION REPORTS</span>
          </div>

          <div className={styles.titleGroup}>
            <h2 className={styles.workspaceTitle}>Investigation Reports</h2>
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

      {/* Subtitle & Ingestion Workflow Chain Banner */}
      <div className={styles.subtitleBanner} aria-label="Report Evidence Compilation Chain">
        <div className={styles.bannerLeft}>
          <span className={styles.bannerBadge}>EVIDENCE COMPILATION</span>
          <span className={styles.bannerNotice}>
            Compile verified investigation evidence into a structured operational report.
          </span>
        </div>
        <div className={styles.workflowTrack}>
          {reportWorkflowChain.map((step, idx) => (
            <div key={step.id} className={styles.workflowItem}>
              <div className={styles.stepBox}>
                <span className={styles.stepName}>{step.name}</span>
              </div>
              {idx < reportWorkflowChain.length - 1 && (
                <span className={styles.stepArrow} aria-hidden="true">→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Primary Configuration & Document Preview Row */}
      <div className={styles.mainGrid}>
        <ReportBuilder />
        <ReportPreview />
      </div>

      {/* 7-Stage Report Generation Pipeline */}
      <ReportPipeline />

      {/* 13 Structured Report Sections */}
      <ReportSections />

      {/* Evidence Compilation Index */}
      <ReportEvidenceIndex />

      {/* Bottom Row: Synthesis Summary + Multi-Source Lineage Provenance */}
      <div className={styles.bottomGrid}>
        <ReportSummary />
        <ReportProvenance />
      </div>
    </div>
  );
}
