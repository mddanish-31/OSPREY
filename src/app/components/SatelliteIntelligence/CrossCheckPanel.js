import styles from "./CrossCheckPanel.module.css";

/**
 * CrossCheckPanel
 *
 * Visualizes Copernicus Sentinel-2 as a complementary optical cross-check layer.
 * Communicates the conditional nature of optical imagery (cloud-free daylight dependency)
 * compared to Sentinel-1 all-weather C-Band radar.
 *
 * @param {object} props
 * @param {object} [props.crossCheck] - Optional real optical cross-check metadata
 */
export default function CrossCheckPanel({ crossCheck }) {
  const isAvailable = crossCheck?.available || false;
  const provenance = crossCheck?.source || "Copernicus Data Space // Sentinel-2";

  const opticalBands = [
    { band: "B02", name: "Blue (490 nm)", role: "Water Penetration" },
    { band: "B03", name: "Green (560 nm)", role: "Surface Reflectance" },
    { band: "B04", name: "Red (665 nm)", role: "True Color Synthesis" },
    { band: "B08", name: "NIR (842 nm)", role: "Vegetation & Sheen Contrast" },
  ];

  return (
    <article className={styles.crossCheckCard}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.opticalIcon} aria-hidden="true">◎</span>
          <div>
            <h4 className={styles.title}>Sentinel-2 Optical Cross-Check</h4>
            <span className={styles.provenanceTag}>{provenance}</span>
          </div>
        </div>
        <div className={styles.conditionBadge}>
          <span className={isAvailable ? styles.dotActive : styles.dotPending} />
          <span>{isAvailable ? "Optical Correlated" : "Conditional Cross-Check"}</span>
        </div>
      </div>

      {/* Sensor Comparison Notice */}
      <div className={styles.noticeBlock}>
        <div className={styles.noticeIcon} aria-hidden="true">ℹ</div>
        <p className={styles.noticeText}>
          <strong>Sensor Complementarity:</strong> Sentinel-1 SAR provides primary all-weather
          day/night detection through cloud cover. Sentinel-2 multispectral observations provide
          supporting cross-validation when a suitable cloud-free daylight acquisition exists.
        </p>
      </div>

      {/* Multispectral Bands Overview */}
      <div className={styles.bandsSection}>
        <span className={styles.bandsTitle}>Multispectral Evaluation Bands</span>
        <div className={styles.bandsGrid}>
          {opticalBands.map((item) => (
            <div key={item.band} className={styles.bandItem}>
              <div className={styles.bandHeader}>
                <span className={styles.bandCode}>{item.band}</span>
                <span className={styles.bandName}>{item.name}</span>
              </div>
              <span className={styles.bandRole}>{item.role}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Availability Status */}
      <div className={styles.footer}>
        <span className={styles.footerLabel}>Observation Window:</span>
        <span className={styles.footerStatus}>
          {crossCheck?.cloudStatus
            ? crossCheck.cloudStatus
            : "Available when a suitable observation exists"}
        </span>
      </div>
    </article>
  );
}
