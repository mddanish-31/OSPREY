"use client";

import styles from "./OpticalBandsPanel.module.css";

/**
 * OpticalBandsPanel
 *
 * Sentinel-2 MSI Multispectral Bands context panel.
 * Conforms strictly to scientific truth:
 * - Displays B02 (Blue), B03 (Green), B04 (Red), B08 (NIR)
 * - Highlights that optical bands provide contextual evidence, not independent confirmation
 * - Zero fabricated reflectance or radiometric values
 */
export default function OpticalBandsPanel() {
  const bands = [
    { code: "B02", name: "Blue", center: "490 nm", res: "10 m", state: "Awaiting scene" },
    { code: "B03", name: "Green", center: "560 nm", res: "10 m", state: "Awaiting scene" },
    { code: "B04", name: "Red", center: "665 nm", res: "10 m", state: "Awaiting scene" },
    { code: "B08", name: "Near Infrared", center: "842 nm", res: "10 m", state: "Awaiting scene" },
  ];

  return (
    <section className={styles.bandsCard} aria-label="Sentinel-2 Optical Bands">
      <div className={styles.cardHeader}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.cardBadge}>MSI BANDS</span>
          <h4 className={styles.cardTitle}>Optical Band Suite</h4>
        </div>
        <span className={styles.statusPill}>4 Bands Configured</span>
      </div>

      <div className={styles.bandsGrid}>
        {bands.map((band) => (
          <div key={band.code} className={styles.bandItem}>
            <div className={styles.bandTop}>
              <span className={styles.bandCode}>{band.code}</span>
              <span className={styles.bandState}>{band.state}</span>
            </div>
            <span className={styles.bandName}>{band.name}</span>
            <div className={styles.bandMeta}>
              <span>{band.center}</span>
              <span>•</span>
              <span>{band.res} GSD</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.explanatoryNote}>
        <span className={styles.noteIcon} aria-hidden="true">ℹ</span>
        <p className={styles.noteText}>
          Optical bands provide contextual surface evidence when scene conditions permit; they do not independently confirm an oil spill.
        </p>
      </div>
    </section>
  );
}
