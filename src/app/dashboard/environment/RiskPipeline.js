"use client";

import styles from "./RiskPipeline.module.css";

/**
 * RiskPipeline
 *
 * 8-stage Environmental Risk synthesis pipeline for #9 Environmental Risk & Impact:
 * 01 Spill Geometry → 02 Drift Projection → 03 Affected Area → 04 Coastal Exposure → 05 Sensitive Areas → 06 Fisheries Exposure → 07 Risk Assessment → 08 Impact Interpretation
 *
 * Strict scientific product truth:
 * - All stages in truthful "Awaiting" standby states
 * - Zero fake progress percentages or completed states
 */
export default function RiskPipeline() {
  const stages = [
    { num: "01", name: "Spill Geometry", state: "Awaiting candidate geometry" },
    { num: "02", name: "Drift Projection", state: "Awaiting simulation" },
    { num: "03", name: "Affected Area", state: "Awaiting projected extent" },
    { num: "04", name: "Coastal Exposure", state: "Awaiting coastal layer" },
    { num: "05", name: "Sensitive Areas", state: "Awaiting environmental layers" },
    { num: "06", name: "Fisheries Exposure", state: "Awaiting fisheries data" },
    { num: "07", name: "Risk Assessment", state: "Awaiting exposure evidence" },
    { num: "08", name: "Impact Interpretation", state: "Awaiting risk analysis" },
  ];

  return (
    <section className={styles.pipelineCard} aria-label="Environmental Risk Pipeline Stages">
      <div className={styles.pipelineHeader}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.pipelineBadge}>RISK PIPELINE</span>
          <h4 className={styles.pipelineTitle}>Environmental Risk Pipeline</h4>
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
