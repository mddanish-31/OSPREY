"use client";

import styles from "./CrossCheckProvenance.module.css";

/**
 * CrossCheckProvenance
 *
 * Lineage panel detailing the full 4-stage Satellite Intelligence workflow:
 * #2 SAR Scene → #3 AI Spill Detection → #4 Spill Characterization → #5 Sentinel-2 Cross-check
 */
export default function CrossCheckProvenance() {
  const lineageSteps = [
    { num: "#2", name: "SAR Scene", role: "Primary Sensor" },
    { num: "#3", name: "AI Detection", role: "Segmentation" },
    { num: "#4", name: "Characterization", role: "Spatial Polygon" },
    { num: "#5", name: "Optical Check", role: "Conditional Validation" },
  ];

  const provenanceItems = [
    { label: "Primary Detection Source", value: "Sentinel-1 SAR" },
    { label: "Candidate Geometry", value: "Awaiting characterization output" },
    { label: "Optical Observation Source", value: "Awaiting Sentinel-2 scene" },
    { label: "Data Access Network", value: "Copernicus Data Space" },
    { label: "Processing State", value: "Standby" },
    { label: "Overall Interpretation", value: "Pending optical evidence" },
  ];

  return (
    <section className={styles.provenanceCard} aria-label="Cross-Check Provenance & Lineage">
      {/* 4-Stage Dependency Chain */}
      <div className={styles.chainSection}>
        <div className={styles.headerGroup}>
          <span className={styles.sectionBadge}>LINEAGE</span>
          <h4 className={styles.sectionTitle}>Satellite Evidence Chain</h4>
        </div>

        <div className={styles.chainTrack}>
          {lineageSteps.map((step, idx) => (
            <div key={idx} className={styles.chainSegment}>
              <div className={styles.stepBox}>
                <span className={styles.stepNum}>{step.num}</span>
                <span className={styles.stepName}>{step.name}</span>
                <span className={styles.stepRole}>{step.role}</span>
              </div>
              {idx < lineageSteps.length - 1 && (
                <span className={styles.chainArrow} aria-hidden="true">→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Provenance Parameters */}
      <div className={styles.provenanceSection}>
        <div className={styles.headerGroup}>
          <span className={styles.sectionBadge}>PROVENANCE</span>
          <h4 className={styles.sectionTitle}>Observation Parameters</h4>
        </div>

        <div className={styles.provenanceGrid}>
          {provenanceItems.map((item, idx) => (
            <div key={idx} className={styles.provenanceItem}>
              <span className={styles.itemKey}>{item.label}</span>
              <span className={styles.itemVal}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
