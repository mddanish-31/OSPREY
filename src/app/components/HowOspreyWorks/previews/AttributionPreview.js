import styles from "./previews.module.css";

/**
 * AttributionPreview
 * Stage 08: Multi-factor transparent evidence matrix.
 */
export default function AttributionPreview() {
  const categories = [
    "Distance",
    "Time",
    "Trajectory",
    "Course",
    "Behaviour",
    "AIS Availability",
    "SAR Evidence",
  ];

  return (
    <div className={styles.previewContainer}>
      <div className={styles.previewHeader}>
        <span className={styles.previewLabel}>Evidence Matrix</span>
        <span className={styles.statusPill}>
          <span className={styles.statusDot} />
          <span>Potential Association — Not Proof</span>
        </span>
      </div>
      <div className={styles.matrixTagList}>
        {categories.map((cat) => (
          <span key={cat} className={styles.matrixTag}>
            {cat}
          </span>
        ))}
      </div>
    </div>
  );
}
