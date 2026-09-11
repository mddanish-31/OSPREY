"use client";

import styles from "./ScenarioComparison.module.css";

/**
 * ScenarioComparison
 *
 * Comparative assessment matrix (Baseline vs What-if Scenario) for Incident Replay.
 *
 * Strict scientific & operational product truth:
 * - State: "Comparison unavailable"
 * - Description: "Run a valid scenario against an active investigation to compare reconstructed outcomes."
 * - All comparison dimensions in truthful standby states
 * - Zero fabricated difference values, percentages, or synthetic impact metrics
 */
export default function ScenarioComparison() {
  const dimensions = [
    { name: "Origin Zone", baseline: "Awaiting baseline", scenario: "Awaiting scenario", delta: "Unavailable" },
    { name: "Trajectory", baseline: "Awaiting baseline", scenario: "Awaiting scenario", delta: "Unavailable" },
    { name: "Spill Extent", baseline: "Awaiting baseline", scenario: "Awaiting scenario", delta: "Unavailable" },
    { name: "Affected Area", baseline: "Awaiting baseline", scenario: "Awaiting scenario", delta: "Unavailable" },
    { name: "Environmental Exposure", baseline: "Awaiting baseline", scenario: "Awaiting scenario", delta: "Unavailable" },
    { name: "Temporal Evolution", baseline: "Awaiting baseline", scenario: "Awaiting scenario", delta: "Unavailable" },
  ];

  return (
    <section className={styles.card} aria-label="Scenario Comparative Assessment">
      <div className={styles.cardHeader}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.cardBadge}>COMPARATIVE ASSESSMENT</span>
          <h3 className={styles.cardTitle}>Baseline vs Scenario Comparison</h3>
        </div>
        <span className={styles.statusPill}>Comparison Unavailable</span>
      </div>

      <div className={styles.emptyNoticeBox}>
        <span className={styles.emptyNoticeTitle}>Comparison unavailable</span>
        <p className={styles.emptyNoticeDesc}>
          Run a valid scenario against an active investigation to compare reconstructed outcomes.
        </p>
      </div>

      {/* Comparison Matrix Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.comparisonTable}>
          <thead>
            <tr>
              <th scope="col">Dimension</th>
              <th scope="col">Baseline Reconstruction</th>
              <th scope="col">Scenario Reconstruction</th>
              <th scope="col">Variance / Delta</th>
            </tr>
          </thead>
          <tbody>
            {dimensions.map((dim, idx) => (
              <tr key={idx}>
                <td className={styles.dimName}>{dim.name}</td>
                <td className={styles.dimVal}>{dim.baseline}</td>
                <td className={styles.dimVal}>{dim.scenario}</td>
                <td className={styles.dimDelta}>{dim.delta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
