"use client";

import styles from "./PriorityAssessment.module.css";

/**
 * PriorityAssessment
 *
 * Operational priority assessment panel for Response Intelligence.
 * Evaluates 6 core conceptual response factors without fabricating synthetic urgency or priority levels.
 * Strict operational product truth:
 * - Factors and summary remain in truthful "Awaiting" / "Standby" states
 * - Zero fabricated scores, percentages, or High/Medium/Low tags
 */
export default function PriorityAssessment() {
  const conceptualFactors = [
    { id: "environmental-exposure", name: "Environmental Exposure", status: "Awaiting risk assessment" },
    { id: "coastal-habitat-sensitivity", name: "Coastal / Habitat Sensitivity", status: "Awaiting exposure analysis" },
    { id: "fisheries-impact", name: "Fisheries Impact", status: "Awaiting fisheries assessment" },
    { id: "spill-persistence", name: "Spill Persistence", status: "Awaiting weathering analysis" },
    { id: "projected-movement", name: "Projected Movement", status: "Awaiting drift projection" },
    { id: "investigation-confidence", name: "Investigation Confidence", status: "Awaiting evidence synthesis" },
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
            <div key={item.id} className={styles.factorItem}>
              <div className={styles.factorTop}>
                <span className={styles.factorStatus}>{item.status}</span>
              </div>
              <span className={styles.factorName}>{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Grid */}
      <div className={styles.summaryGrid}>
        {summaryState.map((item) => (
          <div key={item.key} className={styles.summaryItem}>
            <span className={styles.summaryKey}>{item.key}</span>
            <span className={styles.summaryVal}>{item.val}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
