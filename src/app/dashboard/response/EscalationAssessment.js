"use client";

import styles from "./EscalationAssessment.module.css";

/**
 * EscalationAssessment
 *
 * Operational escalation criteria evaluation panel for Response Intelligence.
 * Evaluates decision-support dimensions without generating arbitrary severity tiers.
 * Strict operational product truth:
 * - All dimensions in truthful "Pending" and "Awaiting" states
 * - Zero fabricated escalation levels, emergency classifications, or urgency scores
 */
export default function EscalationAssessment() {
  const dimensions = [
    { key: "Environmental Severity", val: "Pending" },
    { key: "Exposure Expansion", val: "Pending" },
    { key: "Coastal Sensitivity", val: "Pending" },
    { key: "Sensitive Habitat Exposure", val: "Pending" },
    { key: "Fisheries Exposure", val: "Pending" },
    { key: "Uncertainty", val: "Pending" },
  ];

  return (
    <section className={styles.card} aria-label="Escalation Assessment Panel">
      <div className={styles.cardHeader}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.cardBadge}>DECISION SUPPORT</span>
          <h3 className={styles.cardTitle}>Escalation Assessment</h3>
        </div>
        <span className={styles.statusPill}>Review Standby</span>
      </div>

      {/* Dimensions Grid */}
      <div className={styles.dimensionsGrid}>
        {dimensions.map((dim, idx) => (
          <div key={idx} className={styles.dimensionItem}>
            <span className={styles.dimensionKey}>{dim.key}</span>
            <span className={styles.dimensionVal}>{dim.val}</span>
          </div>
        ))}
      </div>

      {/* Escalation Summary Row */}
      <div className={styles.summaryRow}>
        <span className={styles.summaryKey}>Escalation State</span>
        <span className={styles.summaryVal}>Awaiting assessment</span>
      </div>

      {/* Advisory Note */}
      <div className={styles.noteBox}>
        <span className={styles.noteIcon} aria-hidden="true">ℹ</span>
        <p className={styles.noteText}>
          Escalation assessment should be driven by validated environmental evidence, projected exposure, uncertainty, and operational context.
        </p>
      </div>
    </section>
  );
}
