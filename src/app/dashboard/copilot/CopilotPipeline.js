"use client";

import styles from "./CopilotPipeline.module.css";

/**
 * CopilotPipeline
 *
 * 7-stage Grounded Copilot synthesis pipeline for #11 AI Copilot:
 * 01 User Question → 02 Investigation Context → 03 Evidence Retrieval → 04 Tool Analysis → 05 Evidence Synthesis → 06 Grounded Response → 07 Evidence References
 *
 * Strict operational product truth:
 * - All stages in truthful "Awaiting" / "Standby" states
 * - Zero fake progress percentages or token counts
 */
export default function CopilotPipeline() {
  const stages = [
    { num: "01", name: "User Question", state: "Awaiting input" },
    { num: "02", name: "Investigation Context", state: "Awaiting investigation" },
    { num: "03", name: "Evidence Retrieval", state: "Standby" },
    { num: "04", name: "Tool Analysis", state: "Standby" },
    { num: "05", name: "Evidence Synthesis", state: "Standby" },
    { num: "06", name: "Grounded Response", state: "Standby" },
    { num: "07", name: "Evidence References", state: "Standby" },
  ];

  return (
    <section className={styles.pipelineCard} aria-label="Copilot Pipeline Stages">
      <div className={styles.pipelineHeader}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.pipelineBadge}>GROUNDING PIPELINE</span>
          <h4 className={styles.pipelineTitle}>Copilot Evidence Pipeline</h4>
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
