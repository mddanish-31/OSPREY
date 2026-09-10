import styles from "./previews.module.css";

/**
 * EnvironmentalRiskPreview
 * Stage 09: Coastal exposure & sensitive marine zone projections.
 */
export default function EnvironmentalRiskPreview() {
  const riskLayers = [
    "Predicted Slick Spread",
    "Coastline Proximity",
    "Sensitive Marine Areas",
    "Fishing Grounds",
    "Commercial Ports",
  ];

  return (
    <div className={styles.previewContainer}>
      <div className={styles.previewHeader}>
        <span className={styles.previewLabel}>Exposure Analysis</span>
        <span className={styles.statusPill}>
          <span className={`${styles.statusDot} ${styles.statusDotPending}`} />
          <span>Awaiting Spill Projection</span>
        </span>
      </div>
      <div className={styles.matrixTagList}>
        {riskLayers.map((layer) => (
          <span key={layer} className={styles.matrixTag}>
            {layer}
          </span>
        ))}
      </div>
    </div>
  );
}
