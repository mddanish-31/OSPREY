import styles from "./previews.module.css";

/**
 * DriftReconstructionPreview
 * Stage 04: Hydrodynamic drift vector & origin zone estimation.
 */
export default function DriftReconstructionPreview() {
  return (
    <div className={styles.previewContainer}>
      <div className={styles.previewHeader}>
        <span className={styles.previewLabel}>Backward Drift Engine</span>
        <span className={styles.statusPill}>
          <span className={`${styles.statusDot} ${styles.statusDotReady}`} />
          <span>OpenDrift / ERA5 / CMEMS</span>
        </span>
      </div>
      <div className={styles.vectorRow}>
        <div className={styles.vectorNode}>
          <span>Observed Slick</span>
        </div>
        <span className={styles.vectorArrow}>⟵ Wind &amp; Currents ⟵</span>
        <div className={styles.vectorNode}>
          <span>Probable Origin Zone</span>
        </div>
      </div>
    </div>
  );
}
