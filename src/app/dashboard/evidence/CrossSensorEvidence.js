"use client";

import styles from "./CrossSensorEvidence.module.css";

/**
 * CrossSensorEvidence
 *
 * Panel presenting cross-sensor radar (SAR) vs transponder (AIS) matching evidence.
 * Strict scientific truth:
 * - Uses neutral terminology: "Potential Dark Vessel Evidence", NEVER "Confirmed Dark Vessel"
 * - Does not assert non-broadcasting contacts exist without ingested sensor feeds
 * - Zero fabricated vessel targets, radar blips, or unmatched counts
 */
export default function CrossSensorEvidence() {
  const conceptualFlow = [
    { step: "01", name: "Sentinel-1 SAR" },
    { step: "02", name: "Vessel Detection" },
    { step: "03", name: "AIS Vessel Set" },
    { step: "04", name: "Spatial / Temporal Matching" },
    { step: "05", name: "Evidence Assessment" },
  ];

  const evidenceFields = [
    { label: "SAR Observation", value: "Awaiting SAR vessel analysis" },
    { label: "AIS Observation", value: "Awaiting AIS history" },
    { label: "Cross-Sensor Match", value: "Pending" },
    { label: "Unmatched SAR Objects", value: "Pending" },
    { label: "Dark Vessel Assessment", value: "Pending" },
  ];

  return (
    <section className={styles.crossSensorCard} aria-label="Cross-Sensor Evidence Analysis Panel">
      <div className={styles.cardHeader}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.cardBadge}>RADAR / AIS FUSION</span>
          <h4 className={styles.cardTitle}>Cross-Sensor Evidence</h4>
        </div>
        <span className={styles.statusPill}>Potential Dark Vessel Evidence</span>
      </div>

      {/* Conceptual Flow */}
      <div className={styles.flowSection}>
        <span className={styles.flowHeading}>Cross-Sensor Matching Sequence</span>
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
        <span className={styles.evalVal}>Standby</span>
      </div>

      {/* Explanatory Note */}
      <div className={styles.noteBox}>
        <span className={styles.noteIcon} aria-hidden="true">ℹ</span>
        <p className={styles.noteText}>
          Cross-sensor fusion compares radar metallic backscatter returns against AIS broadcasts to identify potential non-cooperative vessels. Findings populate upon dual-sensor ingestion.
        </p>
      </div>
    </section>
  );
}
