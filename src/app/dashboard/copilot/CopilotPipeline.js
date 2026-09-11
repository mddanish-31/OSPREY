"use client";

import styles from "./CopilotPipeline.module.css";

/**
 * CopilotPipeline
 *
 * Grounded Copilot synthesis pipeline for AI Copilot:
 * User Question → Investigation Context → Evidence Retrieval → Tool Analysis → Evidence Synthesis → Grounded Response → Evidence References
 *
 * Strict operational product truth:
 * - All stages in truthful "Awaiting" / "Standby" states
 * - Zero fake progress percentages or token counts
 */
export default function CopilotPipeline() {
  const stages = [
    { id: "user-question", name: "User Question", state: "Awaiting input" },
    { id: "investigation-context", name: "Investigation Context", state: "Awaiting investigation" },
    { id: "evidence-retrieval", name: "Evidence Retrieval", state: "Standby" },
    { id: "tool-analysis", name: "Tool Analysis", state: "Standby" },
    { id: "evidence-synthesis", name: "Evidence Synthesis", state: "Standby" },
    { id: "grounded-response", name: "Grounded Response", state: "Standby" },
    { id: "evidence-references", name: "Evidence References", state: "Standby" },
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
