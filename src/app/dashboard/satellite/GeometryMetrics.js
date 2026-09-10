"use client";

import styles from "./GeometryMetrics.module.css";

/**
 * GeometryMetrics
 *
 * Geometric measurements and topological properties panel.
 * Conforms strictly to truthfulness:
 * - Uses explicit "Pending" and "Awaiting geometry" states
 * - Zero synthetic numerical values (no 0 km², 0 km, 0%, or placeholder coordinates)
 */
export default function GeometryMetrics() {
  const metrics = [
    { label: "Geometry Type", value: "Awaiting geometry" },
    { label: "Geometry Status", value: "Pending" },
    { label: "Surface Area", value: "Pending" },
    { label: "Perimeter Length", value: "Pending" },
    { label: "Centroid Position", value: "Pending" },
    { label: "Boundary Enclosure", value: "Pending" },
    { label: "Geometry Quality", value: "Pending" },
  ];

  return (
    <aside className={styles.metricsPanel} aria-label="Geometric Properties">
      <div className={styles.panelHeader}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.panelBadge}>GEOMETRY</span>
          <h4 className={styles.panelTitle}>Spatial Metrics</h4>
        </div>
        <span className={styles.statusPill}>Pending Data</span>
      </div>

      <div className={styles.metricsList}>
        {metrics.map((item, idx) => (
          <div key={idx} className={styles.metricItem}>
            <span className={styles.metricKey}>{item.label}</span>
            <span className={styles.metricVal}>{item.value}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
