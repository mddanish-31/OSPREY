"use client";

import styles from "./ReportSummary.module.css";

/**
 * ReportSummary
 *
 * Operational report summary panel for Investigation Reports.
 * Displays truthful investigation assessment synthesis state.
 *
 * Strict scientific & operational product truth:
 * - All dimensions in "Not loaded" / "Awaiting" / "Awaiting verified evidence" state
 * - Zero fabricated scores, percentages, rankings, or synthetic conclusions
 */
export default function ReportSummary() {
  const summaryDimensions = [
    { label: "Investigation", value: "Not loaded" },
    { label: "Detection", value: "Awaiting" },
    { label: "Spill Geometry", value: "Awaiting" },
    { label: "Probable Origin", value: "Awaiting" },
    { label: "Vessel Association", value: "Awaiting" },
    { label: "Environmental Exposure", value: "Awaiting" },
    { label: "Response Assessment", value: "Awaiting" },
    { label: "Overall Conclusion", value: "Awaiting verified evidence" },
  ];

  return (
    <section className={styles.card} aria-label="Investigation Report Summary">
      <div className={styles.cardHeader}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.cardBadge}>SYNTHESIS SUMMARY</span>
          <h3 className={styles.cardTitle}>Report Summary</h3>
        </div>
        <span className={styles.statusPill}>Summary Standby</span>
      </div>

      <div className={styles.summaryGrid}>
        {summaryDimensions.map((item, idx) => (
          <div key={idx} className={styles.summaryItem}>
            <span className={styles.itemLabel}>{item.label}</span>
            <span className={styles.itemValue}>{item.value}</span>
          </div>
        ))}
      </div>

      <div className={styles.advisoryBox}>
        <span className={styles.advisoryIcon} aria-hidden="true">ℹ</span>
        <p className={styles.advisoryText}>
          The report summary synthesizes verified findings across satellite SAR, drift modeling, AIS correlation, environmental risk, and response intelligence once an active investigation is loaded.
        </p>
      </div>
    </section>
  );
}
