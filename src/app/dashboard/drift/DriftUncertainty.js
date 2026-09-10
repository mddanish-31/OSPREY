"use client";

import styles from "./DriftUncertainty.module.css";

/**
 * DriftUncertainty
 *
 * Panel presenting hydrodynamic uncertainty and trajectory ensemble parameters.
 * Strict scientific truth:
 * - Emphasizes that future simulations rely on trajectory ensembles rather than a single deterministic track
 * - All uncertainty metrics in truthful pending/standby states
 * - Zero fabricated confidence percentages, synthetic probabilities, or numerical margins
 */
export default function DriftUncertainty() {
  const uncertaintyItems = [
    { label: "Ensemble Trajectories", value: "Awaiting simulation" },
    { label: "Uncertainty Envelope", value: "Pending" },
    { label: "Origin Uncertainty", value: "Pending" },
    { label: "Projection Uncertainty", value: "Pending" },
  ];

  return (
    <section className={styles.uncertaintyCard} aria-label="Drift Uncertainty & Ensemble Parameters">
      <div className={styles.cardHeader}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.cardBadge}>STOCHASTIC ENSEMBLE</span>
          <h4 className={styles.cardTitle}>Drift Uncertainty</h4>
        </div>
        <span className={styles.statusPill}>Ensemble Standby</span>
      </div>

      <div className={styles.explanationSection}>
        <p className={styles.explanationText}>
          Hydrodynamic and atmospheric forcing exhibit natural spatiotemporal turbulence. Rather than relying on a single deterministic trajectory, drift modeling utilizes Monte Carlo particle ensembles to map spatial dispersion and boundary uncertainty.
        </p>
      </div>

      <div className={styles.metricsGrid}>
        {uncertaintyItems.map((item, idx) => (
          <div key={idx} className={styles.metricItem}>
            <span className={styles.metricKey}>{item.label}</span>
            <span className={styles.metricVal}>{item.value}</span>
          </div>
        ))}
      </div>

      <div className={styles.noteBox}>
        <span className={styles.noteIcon} aria-hidden="true">ℹ</span>
        <p className={styles.noteText}>
          Ensemble spread metrics and spatial dispersion contours will populate upon completion of backward/forward Lagrangian advection runs.
        </p>
      </div>
    </section>
  );
}
