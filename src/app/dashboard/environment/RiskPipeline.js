"use client";

import styles from "./RiskPipeline.module.css";

/**
 * RiskPipeline
 *
 * Environmental Risk synthesis pipeline for Environmental Risk & Impact:
 * Spill Geometry → Drift Projection → Affected Area → Coastal Exposure → Sensitive Areas → Fisheries Exposure → Risk Assessment → Impact Interpretation
 *
 * Strict scientific product truth:
 * - All stages in truthful "Awaiting" standby states
 * - Zero fake progress percentages or completed states
 */
export default function RiskPipeline() {
  const stages = [
    { id: "spill-geometry", name: "Spill Geometry", state: "Awaiting candidate geometry" },
    { id: "drift-projection", name: "Drift Projection", state: "Awaiting simulation" },
    { id: "affected-area", name: "Affected Area", state: "Awaiting projected extent" },
    { id: "coastal-exposure", name: "Coastal Exposure", state: "Awaiting coastal layer" },
    { id: "sensitive-areas", name: "Sensitive Areas", state: "Awaiting environmental layers" },
    { id: "fisheries-exposure", name: "Fisheries Exposure", state: "Awaiting fisheries data" },
    { id: "risk-assessment", name: "Risk Assessment", state: "Awaiting exposure evidence" },
    { id: "impact-interpretation", name: "Impact Interpretation", state: "Awaiting risk analysis" },
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
