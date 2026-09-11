"use client";

import styles from "./ReportEvidenceIndex.module.css";

/**
 * ReportEvidenceIndex
 *
 * Evidence index compilation panel for Investigation Reports.
 * Prepares the multi-source evidence index structure for the compiled report.
 *
 * Strict scientific & operational product truth:
 * - Status: "Awaiting evidence"
 * - References: "None available"
 * - Zero fabricated coordinates, scene IDs, MMSI, or synthetic citations
 */
export default function ReportEvidenceIndex() {
  const evidenceCategories = [
    { name: "Satellite / SAR", status: "Awaiting evidence", references: "None available" },
    { name: "Spill Geometry", status: "Awaiting evidence", references: "None available" },
    { name: "Drift Reconstruction", status: "Awaiting evidence", references: "None available" },
    { name: "AIS Correlation", status: "Awaiting evidence", references: "None available" },
    { name: "Behavioural Analysis", status: "Awaiting evidence", references: "None available" },
    { name: "Cross-Sensor Evidence", status: "Awaiting evidence", references: "None available" },
    { name: "Environmental Assessment", status: "Awaiting evidence", references: "None available" },
    { name: "Response Assessment", status: "Awaiting evidence", references: "None available" },
  ];

  return (
    <section className={styles.card} aria-label="Report Evidence Index">
      <div className={styles.cardHeader}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.cardBadge}>EVIDENCE COMPILATION</span>
          <h3 className={styles.cardTitle}>Report Evidence Index</h3>
        </div>
        <span className={styles.statusPill}>Index Standby</span>
      </div>

      <div className={styles.indexGrid}>
        {evidenceCategories.map((item, idx) => (
          <div key={idx} className={styles.indexItem}>
            <div className={styles.itemTop}>
              <span className={styles.categoryName}>{item.name}</span>
              <span className={styles.statusBadge}>{item.status}</span>
            </div>
            <div className={styles.itemBottom}>
              <span className={styles.refLabel}>References:</span>
              <span className={styles.refValue}>{item.references}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.noteBox}>
        <span className={styles.noteIcon} aria-hidden="true">ℹ</span>
        <p className={styles.noteText}>
          Verified evidence records will populate the index upon investigation loading and evidence compilation.
        </p>
      </div>
    </section>
  );
}
