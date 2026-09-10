"use client";

import styles from "./EnvironmentalRiskAssessment.module.css";

/**
 * EnvironmentalRiskAssessment
 *
 * Primary decision-support risk synthesis panel for #9 Environmental Risk & Impact.
 * Evaluates 6 core environmental evidence factors without fabricating synthetic scores or levels.
 * Strict scientific product truth:
 * - Factors and summary values remain in truthful "Pending", "Standby", and "Awaiting" states
 * - Zero fabricated scores (e.g. no 87/100, 72%, High/Medium/Low Risk)
 */
export default function EnvironmentalRiskAssessment() {
  const evidenceFactors = [
    { num: "01", name: "Spill Extent", status: "Pending" },
    { num: "02", name: "Drift Exposure", status: "Pending" },
    { num: "03", name: "Coastal Proximity", status: "Pending" },
    { num: "04", name: "Sensitive Area Overlap", status: "Pending" },
    { num: "05", name: "Fisheries Exposure", status: "Pending" },
    { num: "06", name: "Persistence / Weathering Context", status: "Pending" },
  ];

  const summaryState = [
    { key: "Overall Risk", val: "Awaiting environmental evidence" },
    { key: "Risk State", val: "Standby" },
  ];

  return (
    <section className={styles.card} aria-label="Environmental Risk Assessment Panel">
      <div className={styles.cardHeader}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.cardBadge}>DECISION SUPPORT</span>
          <h3 className={styles.cardTitle}>Environmental Risk Assessment</h3>
        </div>
        <span className={styles.statusPill}>Evidence Standby</span>
      </div>

      {/* 6-Factor Evidence Grid */}
      <div className={styles.factorsSection}>
        <span className={styles.factorsHeading}>Contributing Evidence Factors</span>
        <div className={styles.factorsGrid}>
          {evidenceFactors.map((item) => (
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

      {/* Scientific Explanatory Statement */}
      <div className={styles.statementBox}>
        <span className={styles.statementIcon} aria-hidden="true">ℹ</span>
        <p className={styles.statementText}>
          Environmental risk is derived from observed spill geometry, projected movement, authoritative environmental layers, and available exposure evidence.
        </p>
      </div>

      {/* Action Footer */}
      <div className={styles.cardFooter}>
        <button
          type="button"
          className={styles.actionBtn}
          disabled
          aria-disabled="true"
          title="Requires environmental exposure evidence"
          aria-label="Generate Risk Assessment (Requires environmental exposure evidence)"
        >
          <span aria-hidden="true">✦</span>
          <span>Generate Risk Assessment</span>
        </button>
      </div>
    </section>
  );
}
