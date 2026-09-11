"use client";

import styles from "./MonitoringPlan.module.css";

/**
 * MonitoringPlan
 *
 * Multi-sensor surveillance monitoring and iterative reassessment panel for Response Intelligence.
 * Outlines the conceptual monitoring feedback loop:
 * Observe → Reassess → Update Drift → Re-evaluate Risk → Continue Monitoring
 *
 * Strict operational product truth:
 * - Monitoring dimensions in truthful "Awaiting" / "Standby" states
 * - Zero fabricated satellite schedules or revisit intervals
 */
export default function MonitoringPlan() {
  const dimensions = [
    { key: "Satellite Revisit", val: "Awaiting observation schedule" },
    { key: "SAR Monitoring", val: "Awaiting monitoring configuration" },
    { key: "Optical Cross-check", val: "Awaiting monitoring configuration" },
    { key: "AIS Monitoring", val: "Awaiting vessel context" },
    { key: "Drift Reassessment", val: "Awaiting environmental update" },
    { key: "Environmental Layer Refresh", val: "Awaiting data source" },
  ];

  const conceptualLoop = [
    "Observe",
    "Reassess",
    "Update Drift",
    "Re-evaluate Risk",
    "Continue Monitoring",
  ];

  return (
    <section className={styles.card} aria-label="Surveillance Monitoring Plan Panel">
      <div className={styles.cardHeader}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.cardBadge}>SURVEILLANCE FEEDBACK LOOP</span>
          <h3 className={styles.cardTitle}>Monitoring Plan</h3>
        </div>
        <span className={styles.statusPill}>Monitoring Standby</span>
      </div>

      {/* Dimensions Grid */}
      <div className={styles.dimensionsGrid}>
        {dimensions.map((d, idx) => (
          <div key={idx} className={styles.dimensionItem}>
            <span className={styles.dimensionKey}>{d.key}</span>
            <span className={styles.dimensionVal}>{d.val}</span>
          </div>
        ))}
      </div>

      {/* Conceptual Feedback Loop */}
      <div className={styles.loopSection}>
        <span className={styles.loopHeading}>Iterative Reassessment Loop</span>
        <div className={styles.loopTrack}>
          {conceptualLoop.map((step, idx) => (
            <div key={idx} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
              <span className={styles.loopStep}>{step}</span>
              {idx < conceptualLoop.length - 1 && (
                <span className={styles.loopArrow} aria-hidden="true">→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className={styles.cardFooter}>
        <button
          type="button"
          className={styles.actionBtn}
          disabled
          aria-disabled="true"
          title="Requires active investigation context"
          aria-label="Configure Monitoring (Requires active investigation context)"
        >
          <span aria-hidden="true">⟲</span>
          <span>Configure Monitoring</span>
        </button>
      </div>
    </section>
  );
}
