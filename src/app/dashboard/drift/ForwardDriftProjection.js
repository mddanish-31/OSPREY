"use client";

import styles from "./ForwardDriftProjection.module.css";

/**
 * ForwardDriftProjection
 *
 * Panel presenting forward slick trajectory forecasting and drift envelope estimation.
 * Strict scientific truth:
 * - Represents forward drift envelope forecasting conceptually
 * - All projection windows, extents, and directions remain in truthful pending/awaiting states
 * - Zero fabricated forecast polygons, hours, coordinates, or shoreline impacts
 */
export default function ForwardDriftProjection() {
  const conceptualFlow = [
    { step: "01", name: "Candidate Spill Geometry" },
    { step: "02", name: "Environmental Conditions" },
    { step: "03", name: "Forward Simulation" },
    { step: "04", name: "Projected Drift Envelope" },
  ];

  const currentFields = [
    { label: "Forward Projection", value: "Awaiting simulation" },
    { label: "Projection Window", value: "Pending" },
    { label: "Projected Extent", value: "Pending" },
    { label: "Movement Direction", value: "Pending" },
  ];

  return (
    <section className={styles.projectionCard} aria-label="Forward Drift Projection">
      <div className={styles.cardHeader}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.cardBadge}>FORWARD FORECAST</span>
          <h4 className={styles.cardTitle}>Forward Drift Projection</h4>
        </div>
        <span className={styles.statusPill}>Drift Envelope</span>
      </div>

      {/* Conceptual Forecasting Flow */}
      <div className={styles.flowSection}>
        <span className={styles.flowHeading}>Projection Flow</span>
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
          Forward projection estimates slick advection over forecast horizon windows using CMEMS surface currents and ERA5 wind drag. Simulation initiates once candidate geometry is confirmed.
        </p>
      </div>
    </section>
  );
}
