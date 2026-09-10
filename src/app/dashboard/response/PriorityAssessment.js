"use client";

import styles from "./PriorityAssessment.module.css";

/**
 * PriorityAssessment
 *
 * Operational priority assessment panel for #10 Response Intelligence.
 * Evaluates 6 core conceptual response factors without fabricating synthetic urgency or priority levels.
 * Strict operational product truth:
 * - Factors and summary remain in truthful "Awaiting" / "Standby" states
 * - Zero fabricated scores, percentages, or High/Medium/Low tags
 */
export default function PriorityAssessment() {
  const conceptualFactors = [
    { num: "01", name: "Environmental Exposure", status: "Awaiting risk assessment" },
    { num: "02", name: "Coastal / Habitat Sensitivity", status: "Awaiting exposure analysis" },
    { num: "03", name: "Fisheries Impact", status: "Awaiting fisheries assessment" },
    { num: "04", name: "Spill Persistence", status: "Awaiting weathering analysis" },
    { num: "05", name: "Projected Movement", status: "Awaiting drift projection" },
    { num: "06", name: "Investigation Confidence", status: "Awaiting evidence synthesis" },
  ];

  const summaryState = [
    { key: "Overall Priority", val: "Awaiting assessment" },
    { key: "Priority State", val: "Standby" },
  ];

  return (
    <section className={styles.card} aria-label="Response Priority Assessment Panel">
      <div className={styles.cardHeader}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.cardBadge}>PRIORITIZATION FACTORS</span>
          <h3 className={styles.cardTitle}>Response Priority Assessment</h3>
        </div>
        <span className={styles.statusPill}>Priority Standby</span>
      </div>

      {/* 6 Conceptual Factors Grid */}
      <div className={styles.factorsSection}>
        <span className={styles.factorsHeading}>Conceptual Priority Factors</span>
        <div className={styles.factorsGrid}>
          {conceptualFactors.map((item) => (
            <div key={item.num} className={styles.factorItem}>
              <div className={styles.factorTop}>
                <span className={styles.factorNum}>{item.num}</span>
                <span className={styles.factorStatus}>{item.status}</span>
              </div>
              <span className={styles.factorName}>{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Grid */}
      <div className={styles.summaryGrid}>
        {summaryState.map((item, idx) => (
          <div key={idx} className={styles.summaryItem}>
            <span className={styles.summaryKey}>{item.key}</span>
            <span className={styles.summaryVal}>{item.val}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
