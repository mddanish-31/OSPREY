"use client";

import styles from "./OriginReconstruction.module.css";

/**
 * OriginReconstruction
 *
 * Panel presenting the backward hydrodynamic particle advection reconstruction.
 * Strict scientific truth:
 * - Refers explicitly to "Probable Origin Zone", NEVER "Exact Origin"
 * - Displays the conceptual backward reconstruction pipeline
 * - All metrics and zones in truthful pending/standby states
 * - Zero fabricated coordinates, distances, release times, or synthetic probabilities
 */
export default function OriginReconstruction() {
  const conceptualFlow = [
    { step: "01", name: "Observed Spill Geometry" },
    { step: "02", name: "Historical Environmental Fields" },
    { step: "03", name: "Backward Particle Advection" },
    { step: "04", name: "Trajectory Ensemble" },
    { step: "05", name: "Probable Origin Zone" },
  ];

  const currentFields = [
    { label: "Candidate Geometry", value: "Awaiting geometry" },
    { label: "Historical Forcing", value: "Awaiting environmental data" },
    { label: "Backward Simulation", value: "Standby" },
    { label: "Origin Zone", value: "Pending" },
    { label: "Origin Result", value: "Pending reconstruction" },
  ];

  return (
    <section className={styles.originCard} aria-label="Probable Origin Reconstruction">
      <div className={styles.cardHeader}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.cardBadge}>BACKWARD DRIFT</span>
          <h4 className={styles.cardTitle}>Probable Origin Reconstruction</h4>
        </div>
        <span className={styles.statusPill}>Probable Origin Zone</span>
      </div>

      {/* Conceptual Advection Flow */}
      <div className={styles.flowSection}>
        <span className={styles.flowHeading}>Reconstruction Flow</span>
        <div className={styles.flowTrack}>
          {conceptualFlow.map((item, idx) => (
            <div key={item.step} className={styles.flowSegment}>
              <div className={styles.flowBox}>
                <span className={styles.flowStep}>{item.step}</span>
                <span className={styles.flowName}>{item.name}</span>
              </div>
              {idx < conceptualFlow.length - 1 && (
                <span className={styles.flowArrow} aria-hidden="true">→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Current State Parameters Grid */}
      <div className={styles.fieldsGrid}>
        {currentFields.map((field, idx) => (
          <div key={idx} className={styles.fieldItem}>
            <span className={styles.fieldKey}>{field.label}</span>
            <span className={styles.fieldVal}>{field.value}</span>
          </div>
        ))}
      </div>

      {/* Explanatory Note */}
      <div className={styles.noteBox}>
        <span className={styles.noteIcon} aria-hidden="true">ℹ</span>
        <p className={styles.noteText}>
          Backward simulation estimates a probable spatial zone of release by reversing hydrodynamic and wind forcing. It does not identify an exact coordinate point.
        </p>
      </div>
    </section>
  );
}
