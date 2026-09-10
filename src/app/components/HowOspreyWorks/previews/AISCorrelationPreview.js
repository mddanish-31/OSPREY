import styles from "./previews.module.css";

/**
 * AISCorrelationPreview
 * Stage 05: Spatiotemporal AIS track correlation.
 */
export default function AISCorrelationPreview() {
  const correlationSignals = [
    "Vessel Track History",
    "Proximity Window",
    "Temporal Alignment",
    "Course & Speed Relation",
  ];

  return (
    <div className={styles.previewContainer}>
      <div className={styles.previewHeader}>
        <span className={styles.previewLabel}>Spatiotemporal AIS Match</span>
        <span className={styles.statusPill}>
          <span className={`${styles.statusDot} ${styles.statusDotPending}`} />
          <span>No Investigation Data Loaded</span>
        </span>
      </div>
      <div className={styles.matrixTagList}>
        {correlationSignals.map((signal) => (
          <span key={signal} className={styles.matrixTag}>
            {signal}
          </span>
        ))}
      </div>
    </div>
  );
}
