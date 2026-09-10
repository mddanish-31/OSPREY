"use client";

import styles from "./EvidenceSourcePanel.module.css";

/**
 * EvidenceSourcePanel
 *
 * Glass panel detailing the multi-source evidence streams feeding the attribution engine.
 * Strict scientific truth:
 * - Shows all 6 major observation/modeling categories
 * - All sources in truthful awaiting/conditional states
 * - Zero fabricated acquisition timestamps, metadata, or synthetic observations
 */
export default function EvidenceSourcePanel() {
  const sources = [
    {
      category: "Satellite Evidence",
      source: "Sentinel-1 SAR",
      state: "Awaiting scene analysis",
      type: "C-band Synthetic Aperture Radar",
    },
    {
      category: "Optical Evidence",
      source: "Sentinel-2 MSI",
      state: "Conditional / Awaiting scene",
      type: "Multispectral optical cross-check",
    },
    {
      category: "Oceanographic Evidence",
      source: "CMEMS",
      state: "Awaiting environmental data",
      type: "Copernicus ocean hydrodynamic currents",
    },
    {
      category: "Atmospheric Evidence",
      source: "ERA5",
      state: "Awaiting environmental data",
      type: "ECMWF surface wind forcing fields",
    },
    {
      category: "Vessel Evidence",
      source: "AIS",
      state: "Awaiting AIS dataset",
      type: "Terrestrial & satellite vessel transponders",
    },
    {
      category: "Drift Evidence",
      source: "OpenDrift / OpenOil",
      state: "Awaiting simulation",
      type: "Lagrangian backward trajectory engine",
    },
  ];

  return (
    <aside className={styles.sourceCard} aria-label="Evidence Sources Ingestion Panel">
      <div className={styles.cardHeader}>
        <div className={styles.headerLeft}>
          <span className={styles.headerBadge}>MULTI-SOURCE INGESTION</span>
          <h4 className={styles.headerTitle}>Evidence Sources</h4>
        </div>
        <span className={styles.standbyPill}>Standby</span>
      </div>

      {/* Sources List */}
      <div className={styles.sourcesList}>
        {sources.map((item, idx) => (
          <div key={idx} className={styles.sourceItem}>
            <div className={styles.sourceTop}>
              <span className={styles.sourceCategory}>{item.category}</span>
              <span className={styles.sourceStateBadge}>{item.state}</span>
            </div>
            <div className={styles.sourceMain}>
              <span className={styles.sourceName}>{item.source}</span>
            </div>
            <span className={styles.sourceType}>{item.type}</span>
          </div>
        ))}
      </div>

      {/* Explanatory Note */}
      <div className={styles.disclaimerBox}>
        <span className={styles.disclaimerIcon} aria-hidden="true">ℹ</span>
        <p className={styles.disclaimerText}>
          Evidence synthesis becomes available only after the underlying observations and model outputs are available.
        </p>
      </div>
    </aside>
  );
}
