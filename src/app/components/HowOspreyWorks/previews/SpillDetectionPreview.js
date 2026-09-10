import styles from "./previews.module.css";

/**
 * SpillDetectionPreview
 * Stage 02: SAR anomaly segmentation & candidate mask canvas.
 */
export default function SpillDetectionPreview() {
  return (
    <div className={styles.previewContainer}>
      <div className={styles.previewHeader}>
        <span className={styles.previewLabel}>SAR Anomaly Mask</span>
        <span className={styles.statusPill}>
          <span className={styles.statusDot} />
          <span>Awaiting Satellite Analysis</span>
        </span>
      </div>
      <div className={styles.canvasVisual}>
        <div className={styles.radarRing} />
        <div className={styles.detectionMaskSlick}>
          <span>◈ Candidate Spill Mask</span>
        </div>
      </div>
    </div>
  );
}
