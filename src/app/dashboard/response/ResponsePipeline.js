"use client";

import styles from "./ResponsePipeline.module.css";

/**
 * ResponsePipeline
 *
 * 8-stage Operational Response synthesis pipeline for #10 Response Intelligence:
 * 01 Investigation Context → 02 Environmental Assessment → 03 Impact Assessment → 04 Priority Assessment → 05 Response Planning → 06 Monitoring → 07 Escalation Review → 08 Response Intelligence
 *
 * Strict operational product truth:
 * - All stages in truthful "Awaiting" standby states
 * - Zero fake progress percentages or completed states
 */
export default function ResponsePipeline() {
  const stages = [
    { num: "01", name: "Investigation Context", state: "Awaiting active investigation" },
    { num: "02", name: "Environmental Assessment", state: "Awaiting risk analysis" },
    { num: "03", name: "Impact Assessment", state: "Awaiting affected area" },
    { num: "04", name: "Priority Assessment", state: "Awaiting exposure evidence" },
    { num: "05", name: "Response Planning", state: "Awaiting priority assessment" },
    { num: "06", name: "Monitoring", state: "Awaiting monitoring configuration" },
    { num: "07", name: "Escalation Review", state: "Awaiting assessment" },
    { num: "08", name: "Response Intelligence", state: "Awaiting operational context" },
  ];

  return (
    <section className={styles.pipelineCard} aria-label="Operational Response Pipeline Stages">
      <div className={styles.pipelineHeader}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.pipelineBadge}>RESPONSE PIPELINE</span>
          <h4 className={styles.pipelineTitle}>Response Intelligence Pipeline</h4>
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
