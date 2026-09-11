"use client";

import styles from "./DriftProvenance.module.css";

/**
 * DriftProvenance
 *
 * Lineage panel detailing the upstream and analytical workflow:
 * AI Spill Detection → Spill Characterization → Drift & Ocean Dynamics
 *
 * Conforms strictly to product truth:
 * - Shows data lineage connecting candidate spill geometry to hydrodynamic modeling
 * - Parameter provenance in truthful standby / pending states
 */
export default function DriftProvenance() {
  const lineageSteps = [
    { id: "spill-detection", name: "AI Detection", role: "Candidate Slick Segmentation" },
    { id: "spill-characterization", name: "Characterization", role: "Spatial Polygon Geometry" },
    { id: "drift-reconstruction", name: "Drift & Ocean", role: "Hydrodynamic Reconstruction" },
  ];

  const provenanceItems = [
    { label: "Spill Geometry", value: "Awaiting geometry" },
    { label: "Wind Source", value: "ERA5" },
    { label: "Ocean Source", value: "CMEMS" },
    { label: "Drift Engine", value: "OpenDrift / OpenOil" },
    { label: "Simulation Mode", value: "Awaiting configuration" },
    { label: "Simulation State", value: "Standby" },
    { label: "Origin Result", value: "Pending" },
    { label: "Projection Result", value: "Pending" },
  ];

  return (
    <section className={styles.provenanceCard} aria-label="Investigation Lineage & Provenance">
      {/* Dependency Chain */}
      <div className={styles.chainSection}>
        <div className={styles.headerGroup}>
          <span className={styles.sectionBadge}>LINEAGE</span>
          <h4 className={styles.sectionTitle}>Investigation Lineage</h4>
        </div>

        <div className={styles.chainTrack}>
          {lineageSteps.map((step, idx) => (
            <div key={step.id} className={styles.chainSegment}>
              <div className={styles.stepBox}>
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
          <span className={styles.sectionBadge}>PARAMETERS</span>
          <h4 className={styles.sectionTitle}>Observation &amp; Model Lineage</h4>
        </div>

        <div className={styles.provenanceGrid}>
          {provenanceItems.map((item) => (
            <div key={item.label} className={styles.provenanceItem}>
              <span className={styles.itemKey}>{item.label}</span>
              <span className={styles.itemVal}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
