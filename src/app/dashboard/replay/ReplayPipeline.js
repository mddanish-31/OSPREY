"use client";

import styles from "./ReplayPipeline.module.css";

/**
 * ReplayPipeline
 *
 * 7-stage Incident Replay & Scenario Simulation Pipeline for Incident Replay:
 * Investigation Context → Temporal Evidence → Spatial Evidence → Alignment → Baseline Reconstruction → Scenario Simulation → Comparative Assessment
 *
 * Strict operational product truth:
 * - All stages in truthful "Awaiting Investigation" standby state
 * - Zero fake progress percentages or simulated processing
 */
export default function ReplayPipeline() {
  const stages = [
    { id: "investigation-context", name: "Investigation Context", state: "Awaiting Investigation" },
    { id: "temporal-evidence", name: "Temporal Evidence", state: "Awaiting Investigation" },
    { id: "spatial-evidence", name: "Spatial Evidence", state: "Awaiting Investigation" },
    { id: "alignment", name: "Alignment", state: "Awaiting Investigation" },
    { id: "baseline-reconstruction", name: "Baseline Reconstruction", state: "Awaiting Investigation" },
    { id: "scenario-simulation", name: "Scenario Simulation", state: "Awaiting Investigation" },
    { id: "comparative-assessment", name: "Comparative Assessment", state: "Awaiting Investigation" },
  ];

  return (
    <section className={styles.pipelineCard} aria-label="Replay & Scenario Pipeline">
      <div className={styles.pipelineHeader}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.pipelineBadge}>SIMULATION LIFECYCLE</span>
          <h4 className={styles.pipelineTitle}>Replay &amp; Scenario Pipeline</h4>
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
