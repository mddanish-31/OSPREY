"use client";

import styles from "./VesselPipeline.module.css";

/**
 * VesselPipeline
 *
 * Vessel Intelligence & AIS Correlation processing sequence:
 * Investigation Context → AIS History → Temporal Filtering → Spatial Correlation → Behavioural Analysis → Dark Vessel Cross-check → Explainable Attribution
 *
 * Conforms strictly to product truth:
 * - All stages in truthful standby/awaiting states
 * - Zero fake processing times or progress percentages
 */
export default function VesselPipeline() {
  const stages = [
    {
      id: "investigation-context",
      name: "Investigation Context",
      desc: "Spatiotemporal bounds from Drift reconstruction",
      state: "Awaiting origin zone",
    },
    {
      id: "ais-history",
      name: "AIS History",
      desc: "Terrestrial & satellite AIS broadcast ingestion",
      state: "Awaiting AIS dataset",
    },
    {
      id: "temporal-filtering",
      name: "Temporal Filtering",
      desc: "Time-window slicing around estimated release epoch",
      state: "Awaiting AIS history",
    },
    {
      id: "spatial-correlation",
      name: "Spatial Correlation",
      desc: "Origin zone proximity & trajectory intersection",
      state: "Awaiting candidate positions",
    },
    {
      id: "behavioural-analysis",
      name: "Behavioural Analysis",
      desc: "Speed anomalies, loitering & broadcast gap profiling",
      state: "Awaiting vessel history",
    },
    {
      id: "dark-vessel-cross-check",
      name: "Dark Vessel Cross-check",
      desc: "SAR non-cooperative radar contact matching",
      state: "Awaiting SAR vessel analysis",
    },
    {
      id: "explainable-attribution",
      name: "Explainable Attribution",
      desc: "Multi-factor evidence synthesis & candidate ranking",
      state: "Awaiting correlation evidence",
    },
  ];

  return (
    <section className={styles.pipelineCard} aria-label="Vessel Correlation Pipeline Stages">
      <div className={styles.pipelineHeader}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.pipelineBadge}>PIPELINE</span>
          <h4 className={styles.pipelineTitle}>Vessel Intelligence Pipeline</h4>
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
