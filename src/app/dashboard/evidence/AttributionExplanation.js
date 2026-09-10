"use client";

import styles from "./AttributionExplanation.module.css";

/**
 * AttributionExplanation
 *
 * Core explainability panel presenting transparent 7-factor multi-source association synthesis.
 * Strict scientific & legal truth:
 * - Every evidence factor is initialized to "Pending"
 * - Attribution state, candidate ranking, and evidence coverage are in truthful "Pending" / "Awaiting" states
 * - Zero fabricated likelihood percentages, scores, or rankings
 * - Clear legal disclaimer that association is an investigative assessment, not proof of liability
 */
export default function AttributionExplanation() {
  const evidenceFactors = [
    { num: "01", factor: "Spatial Proximity", status: "Pending", desc: "Distance to probable release zone" },
    { num: "02", factor: "Temporal Correlation", status: "Pending", desc: "Presence during release time window" },
    { num: "03", factor: "Trajectory Alignment", status: "Pending", desc: "Track heading & intersection geometry" },
    { num: "04", factor: "Speed / Course Consistency", status: "Pending", desc: "Hydrodynamic displacement match" },
    { num: "05", factor: "Behavioural Evidence", status: "Pending", desc: "Speed anomalies, loitering, course shifts" },
    { num: "06", factor: "AIS Continuity / Gaps", status: "Pending", desc: "Transponder blackout period detection" },
    { num: "07", factor: "SAR Vessel Evidence", status: "Pending", desc: "Coincident metallic radar point contact" },
  ];

  const synthesisState = [
    { label: "Association State", value: "Awaiting evidence synthesis" },
    { label: "Candidate Ranking", value: "Pending" },
    { label: "Evidence Coverage", value: "Pending" },
    { label: "Conclusion", value: "No association result" },
  ];

  return (
    <section className={styles.attributionCard} aria-label="Explainable Association Synthesis Panel">
      <div className={styles.cardHeader}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.cardBadge}>TRANSPARENT ATTRIBUTION</span>
          <h4 className={styles.cardTitle}>Explainable Association</h4>
        </div>
        <span className={styles.statusPill}>Multi-Factor Synthesis</span>
      </div>

      {/* 7-Factor Evidence Grid */}
      <div className={styles.factorsSection}>
        <span className={styles.factorsHeading}>7-Factor Evidence Assessment</span>
        <div className={styles.factorsGrid}>
          {evidenceFactors.map((item) => (
            <div key={item.num} className={styles.factorItem}>
              <div className={styles.factorTop}>
                <span className={styles.factorNum}>{item.num}</span>
                <span className={styles.factorStatus}>{item.status}</span>
              </div>
              <span className={styles.factorName}>{item.factor}</span>
              <span className={styles.factorDesc}>{item.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Synthesis Summary Grid */}
      <div className={styles.summaryGrid}>
        {synthesisState.map((item, idx) => (
          <div key={idx} className={styles.summaryItem}>
            <span className={styles.summaryKey}>{item.label}</span>
            <span className={styles.summaryVal}>{item.value}</span>
          </div>
        ))}
      </div>

      {/* Legal & Investigative Disclaimer */}
      <div className={styles.disclaimerBox}>
        <span className={styles.disclaimerIcon} aria-hidden="true">⚠</span>
        <p className={styles.disclaimerText}>
          Association represents an evidence-based investigative assessment. It is not proof of legal responsibility.
        </p>
      </div>
    </section>
  );
}
