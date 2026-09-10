"use client";

import styles from "./ReplayLayers.module.css";

/**
 * ReplayLayers
 *
 * Spatiotemporal layer visibility control panel for #13 Incident Replay.
 *
 * Strict operational product truth:
 * - All 10 layers in "Standby / Awaiting investigation" state
 * - Toggles visually present but disabled with truthful tooltips
 * - Zero implied active layer rendering
 */
export default function ReplayLayers() {
  const layers = [
    { id: "spill-geom", name: "Spill Geometry", category: "SAR", state: "Awaiting investigation" },
    { id: "origin-zone", name: "Origin Zone", category: "Drift", state: "Awaiting investigation" },
    { id: "ais-tracks", name: "AIS Vessel Tracks", category: "AIS", state: "Awaiting investigation" },
    { id: "vessel-behaviour", name: "Vessel Behaviour", category: "AIS", state: "Awaiting investigation" },
    { id: "sar-observations", name: "SAR Vessel Observations", category: "SAR", state: "Awaiting investigation" },
    { id: "wind-forcing", name: "Wind (ERA5)", category: "Meteo", state: "Awaiting investigation" },
    { id: "ocean-currents", name: "Ocean Currents (CMEMS)", category: "Ocean", state: "Awaiting investigation" },
    { id: "drift-ensemble", name: "Drift Ensemble", category: "Drift", state: "Awaiting investigation" },
    { id: "env-exposure", name: "Environmental Exposure", category: "Risk", state: "Awaiting investigation" },
    { id: "sensitive-areas", name: "Sensitive Areas", category: "Risk", state: "Awaiting investigation" },
  ];

  return (
    <section className={styles.card} aria-label="Replay Layer Controls">
      <div className={styles.cardHeader}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.cardBadge}>LAYER MANAGEMENT</span>
          <h3 className={styles.cardTitle}>Replay Layers</h3>
        </div>
        <span className={styles.statusPill}>Layers Standby</span>
      </div>

      <div className={styles.layersList}>
        {layers.map((layer) => (
          <div key={layer.id} className={styles.layerItem}>
            <div className={styles.layerLeft}>
              <button
                type="button"
                className={styles.toggleBtn}
                disabled
                title="Requires active investigation data."
                aria-disabled="true"
                aria-label={`Toggle ${layer.name} layer (disabled)`}
              >
                <span className={styles.toggleDot} />
              </button>
              <div className={styles.layerInfo}>
                <span className={styles.layerName}>{layer.name}</span>
                <span className={styles.layerCategory}>{layer.category}</span>
              </div>
            </div>
            <span className={styles.layerStateBadge}>{layer.state}</span>
          </div>
        ))}
      </div>

      <div className={styles.noticeBox}>
        <span className={styles.noticeIcon} aria-hidden="true">ℹ</span>
        <p className={styles.noticeText}>
          Layer overlays activate as investigation evidence datasets and hydrodynamic forcing models are loaded.
        </p>
      </div>
    </section>
  );
}
