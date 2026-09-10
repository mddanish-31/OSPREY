"use client";

import styles from "./OpticalSceneMetadata.module.css";

/**
 * OpticalSceneMetadata
 *
 * Compact glass panel displaying Sentinel-2 MSI optical scene parameters.
 * Strict data truth:
 * - Known contextual information: Sentinel-2, MSI, Copernicus Data Space
 * - Scene-specific fields: Explicit awaiting/standby states
 * - Zero fabricated cloud percentages, scene IDs, or timestamps
 */
export default function OpticalSceneMetadata() {
  const metadataItems = [
    { label: "Mission", value: "Sentinel-2", isKnown: true },
    { label: "Instrument", value: "MSI", isKnown: true },
    { label: "Scene Record", value: "Awaiting metadata", isKnown: false },
    { label: "Acquisition Time", value: "Awaiting metadata", isKnown: false },
    { label: "Cloud / Usability", value: "Awaiting metadata", isKnown: false },
    { label: "Spatial Reference", value: "Awaiting metadata", isKnown: false },
    { label: "Processing State", value: "Standby", isKnown: false },
    { label: "Data Source", value: "Copernicus Data Space", isKnown: true },
  ];

  return (
    <aside className={styles.metadataCard} aria-label="Optical Scene Metadata">
      <div className={styles.cardHeader}>
        <div className={styles.headerLeft}>
          <span className={styles.headerBadge}>OPTICAL METADATA</span>
          <h4 className={styles.headerTitle}>Scene Context</h4>
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
