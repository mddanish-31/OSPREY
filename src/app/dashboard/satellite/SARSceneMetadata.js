"use client";

import styles from "./SARSceneMetadata.module.css";

/**
 * SARSceneMetadata
 *
 * Compact glass panel displaying Sentinel-1 C-band SAR scene parameters.
 * Strict data truth:
 * - Known contextual information: Sentinel-1, C-band SAR, Copernicus Data Space
 * - Scene-specific fields: Explicit awaiting/standby states
 * - Zero fabricated coordinates, timestamps, orbit numbers, or polarization values
 */
export default function SARSceneMetadata() {
  const metadataItems = [
    { label: "Mission", value: "Sentinel-1", isKnown: true },
    { label: "Sensor", value: "C-band SAR", isKnown: true },
    { label: "Acquisition", value: "Awaiting scene", isKnown: false },
    { label: "Product", value: "Awaiting metadata", isKnown: false },
    { label: "Polarization", value: "Awaiting metadata", isKnown: false },
    { label: "Orbit", value: "Awaiting metadata", isKnown: false },
    { label: "Processing", value: "Standby", isKnown: false },
    { label: "Data Source", value: "Copernicus Data Space", isKnown: true },
  ];

  return (
    <aside className={styles.metadataCard} aria-label="SAR Scene Metadata">
      <div className={styles.cardHeader}>
        <div className={styles.headerLeft}>
          <span className={styles.headerBadge}>METADATA</span>
          <h4 className={styles.headerTitle}>Scene Parameters</h4>
        </div>
        <span className={styles.standbyPill}>Standby</span>
      </div>

      <div className={styles.metaList}>
        {metadataItems.map((item, idx) => (
          <div key={idx} className={styles.metaItem}>
            <span className={styles.metaKey}>{item.label}</span>
            <span
              className={`${styles.metaVal} ${
                item.isKnown ? styles.metaValKnown : styles.metaValAwaiting
              }`}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
}
