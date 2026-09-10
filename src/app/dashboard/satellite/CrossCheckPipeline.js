"use client";

import styles from "./CrossCheckPipeline.module.css";

/**
 * CrossCheckPipeline
 *
 * 5-stage Sentinel-2 optical cross-check processing pipeline:
 * 01 SAR Candidate → 02 Optical Scene Acquisition → 03 Scene Usability Check → 04 SAR / Optical Cross-check → 05 Cross-check Interpretation
 *
 * Current state: All stages in truthful data-ready/standby states.
 */
export default function CrossCheckPipeline() {
  const stages = [
    { num: "01", name: "SAR Candidate", desc: "Candidate slick polygon ingestion", state: "Awaiting candidate geometry" },
    { num: "02", name: "Optical Acquisition", desc: "Sentinel-2 MSI daylight observation query", state: "Awaiting Sentinel-2 scene" },
    { num: "03", name: "Scene Usability", desc: "Cloud cover & atmospheric quality screening", state: "Awaiting optical metadata" },
    { num: "04", name: "SAR / Optical Cross-check", desc: "Multispectral surface reflectance comparison", state: "Awaiting compatible observations" },
    { num: "05", name: "Cross-check Interpretation", desc: "Multi-sensor consistency synthesis", state: "Awaiting cross-check evidence" },
  ];

  return (
    <section className={styles.pipelineCard} aria-label="Optical Cross-Check Pipeline Stages">
      <div className={styles.pipelineHeader}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.pipelineBadge}>PIPELINE</span>
          <h4 className={styles.pipelineTitle}>Cross-Check Stages</h4>
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
