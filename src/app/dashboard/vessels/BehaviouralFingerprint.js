"use client";

import styles from "./BehaviouralFingerprint.module.css";

/**
 * BehaviouralFingerprint
 *
 * Panel presenting vessel historical behavioural baselines vs observed anomalies.
 * Strict scientific truth:
 * - Shows conceptual feature groups: Route, Movement, Operational behaviours
 * - Behaviour Result & Anomaly Score remain in truthful "Pending" / "Awaiting" states
 * - Zero fabricated anomaly percentages or synthetic behavioural scores
 * - Clear disclaimer that behavioural signals represent investigative context, not liability proof
 */
export default function BehaviouralFingerprint() {
  const featureGroups = [
    {
      title: "Route Behaviour",
      features: [
        { label: "Usual Route", value: "Pending" },
        { label: "Route Deviation", value: "Pending" },
      ],
    },
    {
      title: "Movement Behaviour",
      features: [
        { label: "Speed Profile", value: "Pending" },
        { label: "Acceleration Pattern", value: "Pending" },
        { label: "Heading Changes", value: "Pending" },
      ],
    },
    {
      title: "Operational Behaviour",
      features: [
        { label: "Stopping / Loitering", value: "Pending" },
        { label: "Anchoring Pattern", value: "Pending" },
        { label: "AIS Reporting Gaps", value: "Pending" },
      ],
    },
  ];

  return (
    <section className={styles.behaviourCard} aria-label="Vessel Behavioural Fingerprint Panel">
      <div className={styles.cardHeader}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.cardBadge}>ANOMALY PROFILING</span>
          <h4 className={styles.cardTitle}>Behavioural Fingerprint</h4>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.scorePill}>Anomaly Score: Pending</span>
          <span className={styles.statusPill}>Standby</span>
        </div>
      </div>

      {/* Feature Groups Grid */}
      <div className={styles.groupsGrid}>
        {featureGroups.map((group, gIdx) => (
          <div key={gIdx} className={styles.groupCard}>
            <span className={styles.groupTitle}>{group.title}</span>
            <div className={styles.groupItemsList}>
              {group.features.map((feat, fIdx) => (
                <div key={fIdx} className={styles.featureItem}>
                  <span className={styles.featureKey}>{feat.label}</span>
                  <span className={styles.featureVal}>{feat.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Evaluation Status Strip */}
      <div className={styles.evalStrip}>
        <span className={styles.evalKey}>Behaviour Result:</span>
        <span className={styles.evalVal}>Awaiting behavioural analysis</span>
      </div>

      {/* Explanatory Disclaimer */}
      <div className={styles.disclaimerBox}>
        <span className={styles.disclaimerIcon} aria-hidden="true">ℹ</span>
        <p className={styles.disclaimerText}>
          Behavioural analysis compares observed vessel movement against historical patterns. It is an investigative signal, not proof of responsibility.
        </p>
      </div>
    </section>
  );
}
