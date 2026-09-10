"use client";

import styles from "./EvidencePipeline.module.css";

/**
 * EvidencePipeline
 *
 * 8-stage Evidence Synthesis processing pipeline:
 * 01 Detection Evidence → 02 Geometry Evidence → 03 Origin Evidence → 04 AIS Evidence → 05 Behavioural Evidence → 06 Cross-Sensor Evidence → 07 Evidence Synthesis → 08 Explainable Association
 *
 * Conforms strictly to product truth:
 * - All stages in truthful awaiting/pending standby states
 * - Zero fake progress percentages or simulated completion times
 */
export default function EvidencePipeline() {
  const stages = [
    {
      num: "01",
      name: "Detection Evidence",
      desc: "SAR slick segmentation confidence & dark patch mask",
      state: "Awaiting model output",
    },
    {
      num: "02",
      name: "Geometry Evidence",
      desc: "Polygon spatial centroid & boundary characterization",
      state: "Awaiting candidate geometry",
    },
    {
      num: "03",
      name: "Origin Evidence",
      desc: "Lagrangian backward trajectory probable release zone",
      state: "Awaiting reconstruction",
    },
    {
      num: "04",
      name: "AIS Evidence",
      desc: "Spatiotemporal track proximity & candidate vessel set",
      state: "Awaiting AIS correlation",
    },
    {
      num: "05",
      name: "Behavioural Evidence",
      desc: "Operational anomalies, loitering & broadcast gap profiling",
      state: "Awaiting analysis",
    },
    {
      num: "06",
      name: "Cross-Sensor Evidence",
      desc: "Non-broadcasting radar contact cross-matching",
      state: "Awaiting SAR/AIS comparison",
    },
    {
      num: "07",
      name: "Evidence Synthesis",
      desc: "7-factor transparent multi-source weighting",
      state: "Awaiting source evidence",
    },
    {
      num: "08",
      name: "Explainable Association",
      desc: "Auditable investigation dossier & association summary",
      state: "Awaiting synthesis",
    },
  ];

  return (
    <section className={styles.pipelineCard} aria-label="Evidence Synthesis Pipeline Stages">
      <div className={styles.pipelineHeader}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.pipelineBadge}>EVIDENCE PIPELINE</span>
          <h4 className={styles.pipelineTitle}>Evidence Synthesis Pipeline</h4>
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
