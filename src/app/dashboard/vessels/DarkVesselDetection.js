"use client";

import styles from "./DarkVesselDetection.module.css";

/**
 * DarkVesselDetection
 *
 * Panel presenting radar-to-transponder cross-matching for non-broadcasting contacts.
 * Strict scientific truth:
 * - Uses neutral wording: "Potential Dark Vessel Candidate", NEVER "Confirmed Dark Vessel"
 * - Does not claim dark vessels exist in the absence of real SAR + AIS inputs
 * - Zero fabricated vessel silhouettes, radar blips, coordinates, or unmatched counts
 */
export default function DarkVesselDetection() {
  const conceptualFlow = [
    { step: "01", name: "SAR Vessel Observation" },
    { step: "02", name: "AIS Vessel Set" },
    { step: "03", name: "Spatial / Temporal Matching" },
    { step: "04", name: "Unmatched SAR Object" },
    { step: "05", name: "Dark Vessel Candidate" },
  ];

  const detectionFields = [
    { label: "SAR Vessel Detection", value: "Awaiting SAR vessel analysis" },
    { label: "AIS Vessel Set", value: "Awaiting AIS history" },
    { label: "Cross-Sensor Match", value: "Pending" },
    { label: "Unmatched Objects", value: "Pending" },
    { label: "Dark Vessel Candidate", value: "Pending" },
    { label: "Detection State", value: "Standby" },
  ];

  return (
    <section className={styles.darkVesselCard} aria-label="Dark Vessel Detection Panel">
      <div className={styles.cardHeader}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.cardBadge}>NON-COOPERATIVE SURVEILLANCE</span>
          <h4 className={styles.cardTitle}>Dark Vessel Detection</h4>
        </div>
        <span className={styles.statusPill}>Potential Candidate Analysis</span>
      </div>

      {/* Conceptual Cross-Matching Flow */}
      <div className={styles.flowSection}>
        <span className={styles.flowHeading}>Cross-Matching Flow</span>
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
        {detectionFields.map((field, idx) => (
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
          Non-broadcasting radar contacts are identified by correlating high-intensity SAR metallic point targets against contemporaneous AIS broadcasts. Unmatched objects are flagged as potential dark vessel candidates.
        </p>
      </div>
    </section>
  );
}
