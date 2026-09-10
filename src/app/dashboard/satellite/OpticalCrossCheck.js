"use client";

import styles from "./OpticalCrossCheck.module.css";

/**
 * OpticalCrossCheck
 *
 * Conditional multispectral daylight validation assessment panel.
 * Conforms strictly to product truth:
 * - Represents conditional cross-check evaluation, NOT oil confirmation
 * - Explicit pending states: SAR candidate awaiting geometry, Sentinel-2 awaiting scene
 */
export default function OpticalCrossCheck() {
  const checkItems = [
    { label: "SAR Primary Candidate", value: "Awaiting geometry" },
    { label: "Sentinel-2 Observation", value: "Awaiting scene" },
    { label: "Optical Comparison", value: "Pending" },
    { label: "Cross-check Interpretation", value: "Pending optical evidence" },
  ];

  return (
    <section className={styles.crossCheckCard} aria-label="Conditional Optical Cross-Check">
      <div className={styles.cardHeader}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.cardBadge}>CROSS-CHECK</span>
          <h4 className={styles.cardTitle}>Conditional Validation</h4>
        </div>
        <span className={styles.statusPill}>Conditional Cross-check</span>
      </div>

      <div className={styles.checkGrid}>
        {checkItems.map((item, idx) => (
          <div key={idx} className={styles.checkItem}>
            <span className={styles.checkKey}>{item.label}</span>
            <span className={styles.checkVal}>{item.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
