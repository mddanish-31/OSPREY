"use client";

import styles from "./SpatialTemporalEvidence.module.css";

/**
 * SpatialTemporalEvidence
 *
 * Panel presenting spatiotemporal intersection evidence between slick geometries, drift models, and AIS histories.
 * Strict scientific truth:
 * - Shows conceptual spatiotemporal flow
 * - All spatial and temporal fields in truthful "Pending" / "Awaiting" states
 * - Zero fabricated coordinates, distances, timestamps, or trajectory similarity percentages
 */
export default function SpatialTemporalEvidence() {
  const conceptualFlow = [
    { step: "01", name: "Spill Geometry" },
    { step: "02", name: "Origin Zone" },
    { step: "03", name: "Vessel Position History" },
    { step: "04", name: "Temporal Alignment" },
    { step: "05", name: "Spatial Correlation" },
  ];

  const evidenceFields = [
    { label: "Spill Location", value: "Pending geometry" },
    { label: "Probable Origin", value: "Pending reconstruction" },
    { label: "Vessel Proximity", value: "Pending AIS correlation" },
    { label: "Temporal Overlap", value: "Pending investigation window" },
    { label: "Trajectory Alignment", value: "Pending trajectory analysis" },
    { label: "Environmental Alignment", value: "Pending drift analysis" },
  ];

  return (
    <section className={styles.spatialCard} aria-label="Spatial & Temporal Evidence Panel">
      <div className={styles.cardHeader}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.cardBadge}>SPATIOTEMPORAL EVIDENCE</span>
          <h4 className={styles.cardTitle}>Spatial &amp; Temporal Evidence</h4>
        </div>
        <span className={styles.statusPill}>Awaiting Evidence</span>
      </div>

      {/* Conceptual Flow */}
      <div className={styles.flowSection}>
        <span className={styles.flowHeading}>Spatiotemporal Correlation Flow</span>
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
        {evidenceFields.map((field, idx) => (
          <div key={idx} className={styles.fieldItem}>
            <span className={styles.fieldKey}>{field.label}</span>
            <span className={styles.fieldVal}>{field.value}</span>
          </div>
        ))}
      </div>

      {/* Evaluation Status */}
      <div className={styles.evalStrip}>
        <span className={styles.evalKey}>Evidence State:</span>
        <span className={styles.evalVal}>Awaiting spatial-temporal evidence</span>
      </div>

      {/* Explanatory Note */}
      <div className={styles.noteBox}>
        <span className={styles.noteIcon} aria-hidden="true">ℹ</span>
        <p className={styles.noteText}>
          Spatiotemporal evidence establishes whether candidate vessel tracks intersected the probable origin envelope during the estimated release window. Metrics populate upon data ingestion.
        </p>
      </div>
    </section>
  );
}
