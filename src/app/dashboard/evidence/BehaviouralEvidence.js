"use client";

import styles from "./BehaviouralEvidence.module.css";

/**
 * BehaviouralEvidence
 *
 * Panel detailing multi-factor behavioural evidence signals.
 * Strict scientific truth:
 * - Covers Route, Movement, and Operational behavioural anomalies
 * - All anomaly parameters in truthful "Pending" / "Awaiting" states
 * - Zero fabricated anomaly percentages or synthetic scores
 * - Clear disclaimer that behavioural indicators represent investigative context, not liability proof
 */
export default function BehaviouralEvidence() {
  const categories = [
    {
      title: "Route Behaviour",
      items: [
        { label: "Historical Route", value: "Pending" },
        { label: "Route Deviation", value: "Pending" },
      ],
    },
    {
      title: "Movement Behaviour",
      items: [
        { label: "Speed Pattern", value: "Pending" },
        { label: "Heading Pattern", value: "Pending" },
        { label: "Acceleration", value: "Pending" },
      ],
    },
    {
      title: "Operational Behaviour",
      items: [
        { label: "Loitering", value: "Pending" },
        { label: "Stopping / Anchoring", value: "Pending" },
        { label: "AIS Reporting Gaps", value: "Pending" },
      ],
    },
  ];

  return (
    <section className={styles.behaviourCard} aria-label="Behavioural Evidence Analysis Panel">
      <div className={styles.cardHeader}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.cardBadge}>BEHAVIOURAL EVIDENCE</span>
          <h4 className={styles.cardTitle}>Behavioural Evidence</h4>
        </div>
        <span className={styles.statusPill}>Investigative Context</span>
      </div>

      {/* 3 Category Cards */}
      <div className={styles.categoriesGrid}>
        {categories.map((cat, cIdx) => (
          <div key={cIdx} className={styles.catCard}>
            <span className={styles.catTitle}>{cat.title}</span>
            <div className={styles.itemsList}>
              {cat.items.map((item, iIdx) => (
                <div key={iIdx} className={styles.itemRow}>
                  <span className={styles.itemKey}>{item.label}</span>
                  <span className={styles.itemVal}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Status Strip */}
      <div className={styles.statusStrip}>
        <span className={styles.statusLabel}>Current Result:</span>
        <span className={styles.statusValue}>Awaiting behavioural analysis</span>
      </div>

      {/* Disclaimer Box */}
      <div className={styles.disclaimerBox}>
        <span className={styles.disclaimerIcon} aria-hidden="true">ℹ</span>
        <p className={styles.disclaimerText}>
          Behavioural signals provide investigative context and should not be interpreted as proof of responsibility.
        </p>
      </div>
    </section>
  );
}
