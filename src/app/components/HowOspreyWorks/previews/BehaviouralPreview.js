import styles from "./previews.module.css";

/**
 * BehaviouralPreview
 * Stage 06: Vessel behavioral anomalies.
 */
export default function BehaviouralPreview() {
  const anomalies = [
    { label: "Route Deviation", flag: "Monitored" },
    { label: "Speed Anomaly", flag: "Monitored" },
    { label: "Loitering / Stopping", flag: "Monitored" },
    { label: "Heading Shifts", flag: "Monitored" },
    { label: "AIS Broadcast Gaps", flag: "Monitored" },
  ];

  return (
    <div className={styles.previewContainer}>
      <div className={styles.previewHeader}>
        <span className={styles.previewLabel}>Behavioral Indicators</span>
        <span className={styles.statusPill}>
          <span className={`${styles.statusDot} ${styles.statusDotReady}`} />
          <span>Multi-Pattern Analysis</span>
        </span>
      </div>
      <div className={styles.matrixTagList}>
        {anomalies.map((item) => (
          <span key={item.label} className={`${styles.matrixTag} ${styles.matrixTagHighlight}`}>
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
