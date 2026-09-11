"use client";

import styles from "./VesselAttribution.module.css";

/**
 * VesselAttribution
 *
 * Primary explainable attribution synthesis panel for vessel-slick association.
 * Strict scientific & legal truth:
 * - Shows the 7-factor explainable multi-source evidence stack
 * - Zero fabricated candidate rankings, % likelihood scores, or synthetic metrics
 * - Clear legal/scientific disclaimer that attribution represents investigative association, not liability proof
 */
export default function VesselAttribution() {
  const evidenceStack = [
    { id: "spatial-proximity", factor: "Spatial Proximity", desc: "Distance to probable release zone" },
    { id: "temporal-correlation", factor: "Temporal Correlation", desc: "Presence during estimated release window" },
    { id: "trajectory-alignment", factor: "Trajectory Alignment", desc: "Heading & course vector intersection" },
    { id: "speed-course-consistency", factor: "Speed / Course Consistency", desc: "Hydrodynamic displacement match" },
    { id: "behavioural-evidence", factor: "Behavioural Evidence", desc: "Loitering, speed changes, route shifts" },
    { id: "ais-continuity-gaps", factor: "AIS Continuity / Gaps", desc: "Transponder transmission gaps" },
    { id: "sar-vessel-evidence", factor: "SAR Vessel Evidence", desc: "Coincident radar point target contact" },
  ];

  const attributionState = [
    { label: "Attribution State", value: "Awaiting evidence" },
    { label: "Candidate Ranking", value: "Pending" },
    { label: "Evidence Coverage", value: "Pending" },
    { label: "Association Result", value: "No attribution result" },
  ];

  return (
    <section className={styles.attributionCard} aria-label="Explainable Vessel Attribution Panel">
      <div className={styles.cardHeader}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.cardBadge}>MULTI-FACTOR SYNTHESIS</span>
          <h4 className={styles.cardTitle}>Explainable Vessel Attribution</h4>
        </div>
        <span className={styles.statusPill}>Investigative Association</span>
      </div>

      {/* 7-Factor Evidence Stack Matrix */}
      <div className={styles.matrixSection}>
        <span className={styles.matrixHeading}>7-Factor Evidence Synthesis Stack</span>
        <div className={styles.factorsGrid}>
          {evidenceStack.map((item) => (
            <div key={item.id} className={styles.factorItem}>
              <div className={styles.factorTop}>
                <span className={styles.factorState}>Pending</span>
              </div>
              <span className={styles.factorName}>{item.factor}</span>
              <span className={styles.factorDesc}>{item.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Attribution Current Status Summary */}
      <div className={styles.summaryGrid}>
        {attributionState.map((state) => (
          <div key={state.label} className={styles.summaryItem}>
            <span className={styles.summaryKey}>{state.label}</span>
            <span className={styles.summaryVal}>{state.value}</span>
          </div>
        ))}
      </div>

      {/* Legal & Scientific Caution */}
      <div className={styles.cautionBox}>
        <span className={styles.cautionIcon} aria-hidden="true">⚠</span>
        <p className={styles.cautionText}>
          Attribution scores represent investigative association based on available multi-source evidence and should not be treated as proof of responsibility.
        </p>
      </div>
    </section>
  );
}
