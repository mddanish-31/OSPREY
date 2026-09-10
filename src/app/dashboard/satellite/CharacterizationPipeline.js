"use client";

import styles from "./CharacterizationPipeline.module.css";

/**
 * CharacterizationPipeline
 *
 * 5-stage spatial characterization processing pipeline:
 * 01 Candidate Detection → 02 Geometry Extraction → 03 Geometry Validation → 04 Spatial Characterization → 05 Investigation Ready
 *
 * Current state: All stages in "Awaiting candidate geometry".
 */
export default function CharacterizationPipeline() {
  const stages = [
    { num: "01", name: "Candidate Detection", desc: "Upstream SAR slick mask ingestion", state: "Awaiting candidate geometry" },
    { num: "02", name: "Geometry Extraction", desc: "Vector polygon boundary generation", state: "Awaiting candidate geometry" },
    { num: "03", name: "Geometry Validation", desc: "Topological coherence & ring closure", state: "Awaiting candidate geometry" },
    { num: "04", name: "Spatial Characterization", desc: "Perimeter, area, and centroid calculation", state: "Awaiting candidate geometry" },
    { num: "05", name: "Investigation Ready", desc: "Drift modeling handoff readiness", state: "Awaiting candidate geometry" },
  ];

  return (
    <section className={styles.pipelineCard} aria-label="Characterization Pipeline Stages">
      <div className={styles.pipelineHeader}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.pipelineBadge}>PIPELINE</span>
          <h4 className={styles.pipelineTitle}>Characterization Stages</h4>
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
