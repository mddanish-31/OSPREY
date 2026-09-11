"use client";

import styles from "./ResponseActionPanel.module.css";

/**
 * ResponseActionPanel
 *
 * Operational response action categories panel for Response Intelligence.
 * Outlines structured response frameworks without presenting active deployment commands.
 * Strict operational product truth:
 * - All response categories remain in "Awaiting" states
 * - "Review Action" controls disabled with clear tooltip
 */
export default function ResponseActionPanel() {
  const categories = [
    { name: "Immediate Monitoring", state: "Awaiting assessment" },
    { name: "Containment Planning", state: "Awaiting assessment" },
    { name: "Coastal Protection", state: "Awaiting exposure analysis" },
    { name: "Sensitive Area Protection", state: "Awaiting exposure analysis" },
    { name: "Fisheries Coordination", state: "Awaiting fisheries assessment" },
    { name: "Continued Surveillance", state: "Awaiting investigation state" },
  ];

  return (
    <section className={styles.card} aria-label="Response Actions Framework Panel">
      <div className={styles.cardHeader}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.cardBadge}>OPERATIONAL CATEGORIES</span>
          <h3 className={styles.cardTitle}>Response Actions</h3>
        </div>
        <span className={styles.statusPill}>Action Standby</span>
      </div>

      <div className={styles.categoriesGrid}>
        {categories.map((cat, idx) => (
          <div key={idx} className={styles.categoryCard}>
            <div className={styles.categoryTop}>
              <h4 className={styles.categoryName}>{cat.name}</h4>
              <span className={styles.categoryState}>{cat.state}</span>
            </div>

            <div className={styles.categoryBottom}>
              <button
                type="button"
                className={styles.actionBtn}
                disabled
                aria-disabled="true"
                title="Requires completed response assessment"
                aria-label={`Review ${cat.name} Action (Requires completed response assessment)`}
              >
                <span aria-hidden="true">◫</span>
                <span>Review Action</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
