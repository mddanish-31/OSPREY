import styles from "./previews.module.css";

/**
 * DarkVesselPreview
 * Stage 07: SAR vessel observation vs AIS broadcast record cross-matching.
 */
export default function DarkVesselPreview() {
  return (
    <div className={styles.previewContainer}>
      <div className={styles.previewHeader}>
        <span className={styles.previewLabel}>SAR ↔ AIS Cross-Check</span>
        <span className={styles.mismatchBadge}>Potential AIS Mismatch</span>
      </div>
      <div className={styles.crossMatchBlock}>
        <div className={styles.crossMatchUnit}>
          <span className={styles.unitLabel}>Radar Contact</span>
          <span className={styles.unitVal}>SAR Vessel Detected</span>
        </div>
        <span className={styles.vectorArrow}>⟷</span>
        <div className={styles.crossMatchUnit}>
          <span className={styles.unitLabel}>Broadcast Feed</span>
          <span className={styles.unitVal}>No AIS Broadcast Match</span>
        </div>
      </div>
    </div>
  );
}
