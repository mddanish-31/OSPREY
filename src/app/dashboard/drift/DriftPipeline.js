"use client";

import styles from "./DriftPipeline.module.css";

/**
 * DriftPipeline
 *
 * Hydrodynamic reconstruction processing pipeline:
 * Candidate Geometry → Environmental Forcing → Backward Reconstruction → Origin Ensemble → Forward Projection → Drift Interpretation
 *
 * Conforms strictly to scientific product truth:
 * - All stages in truthful standby/awaiting states
 * - Zero fake processing times or progress percentages
 */
export default function DriftPipeline() {
  const stages = [
    {
      id: "candidate-geometry",
      name: "Candidate Geometry",
      desc: "Candidate slick polygon ingestion from Spill Characterization",
      state: "Awaiting spill geometry",
    },
    {
      id: "environmental-forcing",
      name: "Environmental Forcing",
      desc: "Copernicus CMEMS ocean currents & ECMWF ERA5 wind forcing",
      state: "Awaiting ERA5 / CMEMS",
    },
    {
      id: "backward-reconstruction",
      name: "Backward Reconstruction",
      desc: "OpenDrift / OpenOil backward Lagrangian particle advection",
      state: "Awaiting environmental inputs",
    },
    {
      id: "origin-ensemble",
      name: "Origin Ensemble",
      desc: "Probable release zone spatial synthesis",
      state: "Awaiting simulation",
    },
    {
      id: "forward-projection",
      name: "Forward Projection",
      desc: "Downstream slick trajectory envelope forecasting",
      state: "Awaiting simulation",
    },
    {
      id: "drift-interpretation",
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
