"use client";

import styles from "./LookAlikeFilter.module.css";

/**
 * LookAlikeFilter
 *
 * Prominent analytical section explaining SAR look-alike discrimination.
 * Conforms strictly to scientific truth:
 * - Highlights that dark SAR signatures can originate from non-oil natural phenomena
 * - Zero fabricated look-alike classifications or false confidence scores
 */
export default function LookAlikeFilter() {
  const steps = [
    "SAR Dark Anomaly",
    "Candidate Screening",
    "Look-alike Assessment",
    "Spill Interpretation",
  ];

  return (
    <section className={styles.filterCard} aria-label="Look-Alike Filter Architecture">
      <div className={styles.cardHeader}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.cardBadge}>SCIENTIFIC CONTEXT</span>
          <h4 className={styles.cardTitle}>Look-Alike Filter</h4>
        </div>
        <span className={styles.filterStatusPill}>Awaiting SAR scene</span>
      </div>

      {/* Sequential Flow */}
      <div className={styles.flowTrack}>
        {steps.map((step, idx) => (
          <div key={idx} className={styles.flowSegment}>
            <span className={styles.flowStep}>{step}</span>
            {idx < steps.length - 1 && (
              <span className={styles.flowArrow} aria-hidden="true">→</span>
            )}
          </div>
        ))}
      </div>

      {/* Concise Scientific Notice */}
      <div className={styles.scientificNotice}>
        <span className={styles.noticeIcon} aria-hidden="true">ℹ</span>
        <p className={styles.noticeText}>
          Dark SAR signatures can have non-oil causes (e.g. low-wind zones, biogenic slicks, internal waves); candidate interpretation requires contextual screening.
        </p>
      </div>
    </section>
  );
}
