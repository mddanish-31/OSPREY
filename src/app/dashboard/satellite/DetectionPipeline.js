"use client";

import styles from "./DetectionPipeline.module.css";

/**
 * DetectionPipeline
 *
 * 5-stage SAR segmentation processing pipeline representation:
 * 01 SAR Preprocessing → 02 Candidate Anomaly Detection → 03 Candidate Segmentation → 04 Look-alike Filtering → 05 Spill Interpretation
 *
 * Current state: All stages in "Awaiting SAR Scene" / prerequisite state.
 */
export default function DetectionPipeline() {
  const stages = [
    { num: "01", name: "SAR Preprocessing", desc: "Radiometric calibration & speckle filtering", state: "Awaiting SAR Scene" },
    { num: "02", name: "Candidate Anomaly Detection", desc: "Surface dampening anomaly screening", state: "Awaiting SAR Scene" },
    { num: "03", name: "Candidate Segmentation", desc: "Deep feature spatial mask extraction", state: "Awaiting SAR Scene" },
    { num: "04", name: "Look-alike Filtering", desc: "Low-wind & biogenic feature discrimination", state: "Awaiting SAR Scene" },
    { num: "05", name: "Spill Interpretation", desc: "Candidate confidence & geometry synthesis", state: "Awaiting SAR Scene" },
  ];

  return (
    <section className={styles.pipelineCard} aria-label="AI Spill Detection Pipeline">
      <div className={styles.pipelineHeader}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.pipelineBadge}>PIPELINE</span>
          <h4 className={styles.pipelineTitle}>SAR Segmentation Stages</h4>
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
              <p className={styles.stageDesc}>{stage.desc}</p>
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
