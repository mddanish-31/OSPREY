"use client";

import styles from "./ReplayPipeline.module.css";

/**
 * ReplayPipeline
 *
 * 7-stage Incident Replay & Scenario Simulation Pipeline for #13 Incident Replay:
 * 01 Investigation Context → 02 Temporal Evidence → 03 Spatial Evidence → 04 Vessel & Environmental Alignment → 05 Baseline Reconstruction → 06 Scenario Simulation → 07 Comparative Assessment
 *
 * Strict operational product truth:
 * - All stages in truthful "Awaiting Investigation" standby state
 * - Zero fake progress percentages or simulated processing
 */
export default function ReplayPipeline() {
  const stages = [
    { num: "01", name: "Investigation Context", state: "Awaiting Investigation" },
    { num: "02", name: "Temporal Evidence", state: "Awaiting Investigation" },
    { num: "03", name: "Spatial Evidence", state: "Awaiting Investigation" },
    { num: "04", name: "Alignment", state: "Awaiting Investigation" },
    { num: "05", name: "Baseline Reconstruction", state: "Awaiting Investigation" },
    { num: "06", name: "Scenario Simulation", state: "Awaiting Investigation" },
    { num: "07", name: "Comparative Assessment", state: "Awaiting Investigation" },
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
