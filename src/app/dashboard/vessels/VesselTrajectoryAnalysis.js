"use client";

import styles from "./VesselTrajectoryAnalysis.module.css";

/**
 * VesselTrajectoryAnalysis
 *
 * Panel presenting spatiotemporal trajectory correlation against the probable release origin zone.
 * Strict scientific truth:
 * - Shows the conceptual spatiotemporal trajectory matching sequence
 * - All correlation metrics in truthful pending/awaiting states
 * - Zero fabricated coordinates, distances, speeds, headings, or timestamps
 */
export default function VesselTrajectoryAnalysis() {
  const conceptualFlow = [
    { step: "01", name: "Probable Origin Zone" },
    { step: "02", name: "Historical AIS Positions" },
    { step: "03", name: "Temporal Filtering" },
    { step: "04", name: "Spatial Proximity" },
    { step: "05", name: "Track Alignment" },
    { step: "06", name: "Candidate Correlation" },
  ];

  const currentFields = [
    { label: "AIS Track", value: "Awaiting AIS history" },
    { label: "Temporal Match", value: "Pending" },
    { label: "Spatial Proximity", value: "Pending" },
    { label: "Track Alignment", value: "Pending" },
    { label: "Course / Heading Consistency", value: "Pending" },
    { label: "Speed Consistency", value: "Pending" },
    { label: "Trajectory Result", value: "Pending correlation" },
  ];

  return (
    <section className={styles.trajectoryCard} aria-label="Trajectory Correlation Analysis">
      <div className={styles.cardHeader}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.cardBadge}>SPATIOTEMPORAL ALIGNMENT</span>
          <h4 className={styles.cardTitle}>Trajectory Correlation</h4>
        </div>
        <span className={styles.statusPill}>Track Correlation</span>
      </div>

      {/* Conceptual Trajectory Flow */}
      <div className={styles.flowSection}>
        <span className={styles.flowHeading}>Correlation Flow</span>
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
          Trajectory correlation evaluates whether a vessel track intersected the probable origin envelope during the estimated release window. Metrics calculate upon AIS trajectory ingestion.
        </p>
      </div>
    </section>
  );
}
