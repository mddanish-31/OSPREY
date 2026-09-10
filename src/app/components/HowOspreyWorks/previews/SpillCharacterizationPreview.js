import styles from "./previews.module.css";

/**
 * SpillCharacterizationPreview
 * Stage 03: Geographic investigation schema definition.
 */
export default function SpillCharacterizationPreview() {
  const schemaFields = [
    { key: "Spill Geometry", val: "Polygon (GeoJSON)" },
    { key: "Centroid", val: "Lat / Lon Coordinates" },
    { key: "Area & Perimeter", val: "Spatial Footprint" },
    { key: "Observation Time", val: "UTC Timestamp" },
  ];

  return (
    <div className={styles.previewContainer}>
      <div className={styles.previewHeader}>
        <span className={styles.previewLabel}>Geo-Object Schema</span>
        <span className={styles.statusPill}>
          <span className={`${styles.statusDot} ${styles.statusDotReady}`} />
          <span>Dynamic Schema</span>
        </span>
      </div>
      <div className={styles.schemaGrid}>
        {schemaFields.map((field) => (
          <div key={field.key} className={styles.schemaItem}>
            <span className={styles.schemaKey}>{field.key}</span>
            <span className={styles.schemaVal}>{field.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
