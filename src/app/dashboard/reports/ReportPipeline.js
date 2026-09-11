"use client";

import styles from "./ReportPipeline.module.css";

/**
 * ReportPipeline
 *
 * 7-stage Report Generation Pipeline for Investigation Reports:
 * Investigation Context → Evidence Collection → Evidence Validation → Report Structuring → Evidence Referencing → Report Review → Final Report
 *
 * Strict operational product truth:
 * - All stages in truthful "Awaiting Investigation" standby state
 * - Zero fake progress percentages or simulated processing
 */
export default function ReportPipeline() {
  const stages = [
    { id: "investigation-context", name: "Investigation Context", state: "Awaiting Investigation" },
    { id: "evidence-collection", name: "Evidence Collection", state: "Awaiting Investigation" },
    { id: "evidence-validation", name: "Evidence Validation", state: "Awaiting Investigation" },
    { id: "report-structuring", name: "Report Structuring", state: "Awaiting Investigation" },
    { id: "evidence-referencing", name: "Evidence Referencing", state: "Awaiting Investigation" },
    { id: "report-review", name: "Report Review", state: "Awaiting Investigation" },
    { id: "final-report", name: "Final Report", state: "Awaiting Investigation" },
  ];

  return (
    <section className={styles.pipelineCard} aria-label="Report Generation Pipeline">
      <div className={styles.pipelineHeader}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.pipelineBadge}>REPORT LIFECYCLE</span>
          <h4 className={styles.pipelineTitle}>Report Compilation Pipeline</h4>
        </div>
        <span className={styles.pipelineStatusPill}>
          <span className={styles.statusBeacon} aria-hidden="true" />
          <span>Pipeline Standby</span>
        </span>
      </div>

      <div className={styles.stagesTrack}>
        {stages.map((stage, idx) => (
          <div key={stage.id} className={styles.stageWrapper}>
            <div className={styles.stageItem}>
              <div className={styles.stageTop}>
                <span className={styles.stageStateBadge}>{stage.state}</span>
              </div>
              <h5 className={styles.stageName}>{stage.name}</h5>
            </div>
            {idx < stages.length - 1 && (
              <div className={styles.stageConnector} aria-hidden="true">
                <span className={styles.connectorArrow}>→</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
