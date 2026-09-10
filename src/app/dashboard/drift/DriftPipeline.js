"use client";

import styles from "./DriftPipeline.module.css";

/**
 * DriftPipeline
 *
 * 6-stage Drift & Ocean Dynamics processing pipeline:
 * 01 Candidate Geometry → 02 Environmental Forcing → 03 Backward Reconstruction → 04 Origin Ensemble → 05 Forward Projection → 06 Drift Interpretation
 *
 * Conforms strictly to scientific product truth:
 * - All stages in truthful standby/awaiting states
 * - Zero fake processing times or progress percentages
 */
export default function DriftPipeline() {
  const stages = [
    {
      num: "01",
      name: "Candidate Geometry",
      desc: "Candidate slick polygon ingestion from #4 Spill Characterization",
      state: "Awaiting spill geometry",
    },
    {
      num: "02",
      name: "Environmental Forcing",
      desc: "Copernicus CMEMS ocean currents & ECMWF ERA5 wind forcing",
      state: "Awaiting ERA5 / CMEMS",
    },
    {
      num: "03",
      name: "Backward Reconstruction",
      desc: "OpenDrift / OpenOil backward Lagrangian particle advection",
      state: "Awaiting environmental inputs",
    },
    {
      num: "04",
      name: "Origin Ensemble",
      desc: "Probable release zone spatial synthesis",
      state: "Awaiting simulation",
    },
    {
      num: "05",
      name: "Forward Projection",
      desc: "Downstream slick trajectory envelope forecasting",
      state: "Awaiting simulation",
    },
    {
      num: "06",
      name: "Drift Interpretation",
      desc: "Multi-factor trajectory assessment & AIS handover",
      state: "Awaiting simulation output",
    },
  ];

  return (
    <section className={styles.pipelineCard} aria-label="Drift Processing Pipeline Stages">
      <div className={styles.pipelineHeader}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.pipelineBadge}>PIPELINE</span>
          <h4 className={styles.pipelineTitle}>Drift Reconstruction Pipeline</h4>
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
