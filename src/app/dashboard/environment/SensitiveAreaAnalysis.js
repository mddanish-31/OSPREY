"use client";

import styles from "./SensitiveAreaAnalysis.module.css";

/**
 * SensitiveAreaAnalysis
 *
 * Sensitive Marine Areas analysis panel for Environmental Risk & Impact.
 * Evaluates Marine Protected Areas (MPAs), critical habitats, and ecological reserves against projected spill envelope.
 * Strict scientific product truth:
 * - Current fields initialized to truthful "Awaiting" and "Pending" states
 * - Zero fabricated reserves, vulnerability ratings, or synthetic ecological layers
 */
export default function SensitiveAreaAnalysis() {
  const futureLayers = [
    { name: "Marine Protected Areas", state: "Awaiting environmental layer" },
    { name: "Ecologically Sensitive Areas", state: "Awaiting environmental layer" },
    { name: "Critical Habitat", state: "Awaiting environmental layer" },
    { name: "Protected Coastline", state: "Awaiting environmental layer" },
  ];

  const analysisState = [
    { key: "Spatial Intersection", val: "Pending" },
    { key: "Exposure State", val: "Standby" },
  ];

  return (
    <section className={styles.card} aria-label="Sensitive Marine Areas Analysis Panel">
      <div className={styles.cardHeader}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.cardBadge}>PROTECTED HABITATS</span>
          <h3 className={styles.cardTitle}>Sensitive Marine Areas</h3>
        </div>
        <span className={styles.statusPill}>Layer Standby</span>
      </div>

      {/* Potential Future Layers */}
      <div className={styles.layersSection}>
        <span className={styles.sectionLabel}>Authoritative Environmental Layers</span>
        <div className={styles.layersGrid}>
          {futureLayers.map((layer, idx) => (
            <div key={idx} className={styles.layerItem}>
              <span className={styles.layerName}>{layer.name}</span>
              <span className={styles.layerState}>{layer.state}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Current Analysis State */}
      <div className={styles.analysisRow}>
        {analysisState.map((item, idx) => (
          <div key={idx} className={styles.analysisItem}>
            <span className={styles.analysisKey}>{item.key}</span>
            <span className={styles.analysisVal}>{item.val}</span>
          </div>
        ))}
      </div>

      {/* Advisory Note */}
      <div className={styles.noteBox}>
        <span className={styles.noteIcon} aria-hidden="true">ℹ</span>
        <p className={styles.noteText}>
          Exposure assessment requires authoritative geospatial layers and a completed spill projection.
        </p>
      </div>

      {/* Card Action Footer */}
      <div className={styles.cardFooter}>
        <button
          type="button"
          className={styles.actionBtn}
          disabled
          aria-disabled="true"
          title="Requires environmental layers"
          aria-label="Inspect Sensitive Areas (Requires environmental layers)"
        >
          <span aria-hidden="true">◫</span>
          <span>Inspect Sensitive Areas</span>
        </button>
      </div>
    </section>
  );
}
