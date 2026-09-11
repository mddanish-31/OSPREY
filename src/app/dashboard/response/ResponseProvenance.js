"use client";

import styles from "./ResponseProvenance.module.css";

/**
 * ResponseProvenance
 *
 * Lineage & Parameter Provenance panel for Response Intelligence.
 * Displays the 7-step investigation lineage:
 * AI Spill Detection → Spill Characterization → Drift & Ocean Dynamics → Vessel Intelligence → Evidence & Explainability → Environmental Risk → Response Intelligence
 *
 * Strict operational product truth:
 * - Parameters reflect truthful multi-source lineage and standby states
 * - Zero fabricated sensor observations or deployment metadata
 */
export default function ResponseProvenance() {
  const lineageSteps = [
    { id: "spill-detection", name: "AI Detection", role: "Slick Segmentation" },
    { id: "spill-characterization", name: "Characterization", role: "Spatial Polygon" },
    { id: "drift-dynamics", name: "Drift Dynamics", role: "Projected Trajectory" },
    { id: "vessel-intelligence", name: "Vessel Intelligence", role: "AIS Correlation" },
    { id: "evidence-synthesis", name: "Evidence Synthesis", role: "Explainable Attribution" },
    { id: "environmental-risk", name: "Environmental Risk", role: "Exposure Assessment" },
    { id: "response-intelligence", name: "Response Intelligence", role: "Priority Planning" },
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
      {/* Investigation Lineage */}
      <div className={styles.chainSection}>
        <div className={styles.headerGroup}>
          <div className={styles.headerTitleGroup}>
            <span className={styles.sectionBadge}>LINEAGE</span>
            <h4 className={styles.sectionTitle}>Response Intelligence Lineage</h4>
          </div>
        </div>

        <div className={styles.chainTrack}>
          {lineageSteps.map((step, idx) => (
            <div key={step.id} className={styles.chainSegment}>
              <div className={styles.stepBox}>
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
          {provenanceItems.map((item) => (
            <div key={item.label} className={styles.provenanceItem}>
              <span className={styles.itemKey}>{item.label}</span>
              <span className={styles.itemVal}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
