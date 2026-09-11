"use client";

import styles from "./CharacterizationPipeline.module.css";

/**
 * CharacterizationPipeline
 *
 * 5-stage spatial characterization processing pipeline:
 * Candidate Detection → Geometry Extraction → Geometry Validation → Spatial Characterization → Investigation Ready
 *
 * Current state: All stages in "Awaiting candidate geometry".
 */
export default function CharacterizationPipeline() {
  const stages = [
    { id: "candidate-detection", name: "Candidate Detection", desc: "Upstream SAR slick mask ingestion", state: "Awaiting candidate geometry" },
    { id: "geometry-extraction", name: "Geometry Extraction", desc: "Vector polygon boundary generation", state: "Awaiting candidate geometry" },
    { id: "geometry-validation", name: "Geometry Validation", desc: "Topological coherence & ring closure", state: "Awaiting candidate geometry" },
    { id: "spatial-characterization", name: "Spatial Characterization", desc: "Perimeter, area, and centroid calculation", state: "Awaiting candidate geometry" },
    { id: "investigation-ready", name: "Investigation Ready", desc: "Drift modeling handoff readiness", state: "Awaiting candidate geometry" },
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
