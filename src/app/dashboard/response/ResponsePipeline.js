"use client";

import styles from "./ResponsePipeline.module.css";

/**
 * ResponsePipeline
 *
 * Operational Response synthesis pipeline for Response Intelligence:
 * Investigation Context → Environmental Assessment → Impact Assessment → Priority Assessment → Response Planning → Monitoring → Escalation Review → Response Intelligence
 *
 * Strict operational product truth:
 * - All stages in truthful "Awaiting" standby states
 * - Zero fake progress percentages or completed states
 */
export default function ResponsePipeline() {
  const stages = [
    { id: "investigation-context", name: "Investigation Context", state: "Awaiting active investigation" },
    { id: "environmental-assessment", name: "Environmental Assessment", state: "Awaiting risk analysis" },
    { id: "impact-assessment", name: "Impact Assessment", state: "Awaiting affected area" },
    { id: "priority-assessment", name: "Priority Assessment", state: "Awaiting exposure evidence" },
    { id: "response-planning", name: "Response Planning", state: "Awaiting priority assessment" },
    { id: "monitoring", name: "Monitoring", state: "Awaiting monitoring configuration" },
    { id: "escalation-review", name: "Escalation Review", state: "Awaiting assessment" },
    { id: "response-intelligence", name: "Response Intelligence", state: "Awaiting operational context" },
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
