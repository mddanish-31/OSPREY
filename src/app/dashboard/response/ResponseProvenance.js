"use client";

import styles from "./ResponseProvenance.module.css";

/**
 * ResponseProvenance
 *
 * Lineage & Parameter Provenance panel for #10 Response Intelligence.
 * Displays the 7-step investigation lineage:
 * #3 AI Spill Detection → #4 Spill Characterization → #6 Drift & Ocean Dynamics → #7 Vessel Intelligence → #8 Evidence & Explainability → #9 Environmental Risk → #10 Response Intelligence
 *
 * Strict operational product truth:
 * - Parameters reflect truthful multi-source lineage and standby states
 * - Zero fabricated sensor observations or deployment metadata
 */
export default function ResponseProvenance() {
  const lineageSteps = [
    { num: "#3", name: "AI Detection", role: "Slick Segmentation" },
    { num: "#4", name: "Characterization", role: "Spatial Polygon" },
    { num: "#6", name: "Drift Dynamics", role: "Projected Trajectory" },
    { num: "#7", name: "Vessel Intelligence", role: "AIS Correlation" },
    { num: "#8", name: "Evidence Synthesis", role: "Explainable Attribution" },
    { num: "#9", name: "Environmental Risk", role: "Exposure Assessment" },
    { num: "#10", name: "Response Intelligence", role: "Priority Planning" },
  ];

  const provenanceItems = [
    { label: "Spill Evidence", value: "Awaiting investigation evidence" },
    { label: "Drift Evidence", value: "Awaiting simulation" },
    { label: "Vessel Evidence", value: "Awaiting correlation" },
    { label: "Environmental Evidence", value: "Awaiting risk assessment" },
    { label: "Priority Basis", value: "Awaiting exposure analysis" },
    { label: "Response State", value: "Standby" },
    { label: "Escalation State", value: "Pending" },
  ];

  return (
    <section className={styles.provenanceCard} aria-label="Response Lineage and Provenance Panel">
      {/* 7-Step Investigation Lineage */}
      <div className={styles.chainSection}>
        <div className={styles.headerGroup}>
          <div className={styles.headerTitleGroup}>
            <span className={styles.sectionBadge}>LINEAGE</span>
            <h4 className={styles.sectionTitle}>Response Intelligence Lineage</h4>
          </div>
        </div>

        <div className={styles.chainTrack}>
          {lineageSteps.map((step, idx) => (
            <div key={idx} className={styles.chainSegment}>
              <div className={styles.stepBox}>
                <span className={styles.stepNum}>{step.num}</span>
                <span className={styles.stepName}>{step.name}</span>
                <span className={styles.stepRole}>{step.role}</span>
              </div>
              {idx < lineageSteps.length - 1 && (
                <span className={styles.chainArrow} aria-hidden="true">→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Observation & Parameter Provenance */}
      <div className={styles.provenanceSection}>
        <div className={styles.headerGroup}>
          <div className={styles.headerTitleGroup}>
            <span className={styles.sectionBadge}>PARAMETERS</span>
            <h4 className={styles.sectionTitle}>Multi-Source Response Provenance</h4>
          </div>
        </div>

        <div className={styles.provenanceGrid}>
          {provenanceItems.map((item, idx) => (
            <div key={idx} className={styles.provenanceItem}>
              <span className={styles.itemKey}>{item.label}</span>
              <span className={styles.itemVal}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
