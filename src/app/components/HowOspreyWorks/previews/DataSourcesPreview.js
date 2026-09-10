import styles from "./previews.module.css";

/**
 * DataSourcesPreview
 * Stage 01: Multi-sensor data source cluster.
 */
export default function DataSourcesPreview() {
  const sources = [
    { label: "Sentinel-1 SAR", type: "Radar" },
    { label: "AIS Streams", type: "Vessels" },
    { label: "Wind Vectors", type: "ERA5" },
    { label: "Ocean Currents", type: "CMEMS" },
  ];

  return (
    <div className={styles.previewContainer}>
      <div className={styles.previewHeader}>
        <span className={styles.previewLabel}>Active Feeds</span>
        <span className={styles.statusPill}>
          <span className={`${styles.statusDot} ${styles.statusDotReady}`} />
          <span>Ingesting</span>
        </span>
      </div>
      <div className={styles.sourceCluster}>
        {sources.map((src) => (
          <div key={src.label} className={styles.sourceChip}>
            <span className={styles.sourceChipIcon}>✦</span>
            <span>{src.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
