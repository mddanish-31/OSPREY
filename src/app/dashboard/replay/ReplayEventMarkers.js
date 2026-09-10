"use client";

import styles from "./ReplayEventMarkers.module.css";

/**
 * ReplayEventMarkers
 *
 * Event marker taxonomy & legend panel for #13 Incident Replay.
 * Defines the spatiotemporal event classes available during temporal playback.
 *
 * Strict operational product truth:
 * - Current state: "No replay events available"
 * - Zero synthetic markers or fabricated coordinates
 */
export default function ReplayEventMarkers() {
  const markerTypes = [
    { type: "Detection", color: "#38bdf8", desc: "SAR slick dampening detection timestamp" },
    { type: "Geometry", color: "#00f0ff", desc: "Geographic slick polygon bounding" },
    { type: "Origin", color: "#f59e0b", desc: "Backward drift release centroid window" },
    { type: "Vessel", color: "#10b981", desc: "AIS correlation candidate proximity event" },
    { type: "Environmental", color: "#a855f7", desc: "CMEMS / ERA5 wind/current field update" },
    { type: "Drift", color: "#06b6d4", desc: "OpenDrift particle ensemble progression step" },
    { type: "Assessment", color: "#ec4899", desc: "Attribution & operational assessment checkpoint" },
  ];

  return (
    <section className={styles.card} aria-label="Replay Event Markers">
      <div className={styles.cardHeader}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.cardBadge}>EVENT TAXONOMY</span>
          <h3 className={styles.cardTitle}>Event Markers</h3>
        </div>
        <span className={styles.statusPill}>Markers Standby</span>
      </div>

      <div className={styles.emptyStateBox}>
        <span className={styles.emptyStateTitle}>No replay events available</span>
        <p className={styles.emptyStateDesc}>
          Temporal event markers will populate along the timeline once active investigation telemetry is ingested.
        </p>
      </div>

      <div className={styles.markerList}>
        <span className={styles.listLabel}>Supported Event Classes</span>
        <div className={styles.markerGrid}>
          {markerTypes.map((m, idx) => (
            <div key={idx} className={styles.markerItem}>
              <div className={styles.markerTop}>
                <span
                  className={styles.markerDot}
                  style={{ backgroundColor: m.color, boxShadow: `0 0 8px ${m.color}66` }}
                  aria-hidden="true"
                />
                <span className={styles.markerType}>{m.type}</span>
              </div>
              <span className={styles.markerDesc}>{m.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
