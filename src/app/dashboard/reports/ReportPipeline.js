"use client";

import styles from "./ReportPipeline.module.css";

/**
 * ReportPipeline
 *
 * 7-stage Report Generation Pipeline for #12 Investigation Reports:
 * 01 Investigation Context → 02 Evidence Collection → 03 Evidence Validation → 04 Report Structuring → 05 Evidence Referencing → 06 Report Review → 07 Final Report
 *
 * Strict operational product truth:
 * - All stages in truthful "Awaiting Investigation" standby state
 * - Zero fake progress percentages or simulated processing
 */
export default function ReportPipeline() {
  const stages = [
    { num: "01", name: "Investigation Context", state: "Awaiting Investigation" },
    { num: "02", name: "Evidence Collection", state: "Awaiting Investigation" },
    { num: "03", name: "Evidence Validation", state: "Awaiting Investigation" },
    { num: "04", name: "Report Structuring", state: "Awaiting Investigation" },
    { num: "05", name: "Evidence Referencing", state: "Awaiting Investigation" },
    { num: "06", name: "Report Review", state: "Awaiting Investigation" },
    { num: "07", name: "Final Report", state: "Awaiting Investigation" },
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
          <div key={stage.num} className={styles.stageWrapper}>
            <div className={styles.stageItem}>
              <div className={styles.stageTop}>
                <span className={styles.stageNumber}>{stage.num}</span>
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
