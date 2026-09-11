"use client";

import styles from "./VesselProvenance.module.css";

/**
 * VesselProvenance
 *
 * Lineage panel detailing the multi-source investigation workflow:
 * AI Spill Detection → Spill Characterization → Drift & Ocean Dynamics → Vessel Intelligence
 *
 * Conforms strictly to product truth:
 * - Shows data lineage connecting upstream satellite detection & drift modeling to vessel intelligence
 * - Parameter provenance in truthful standby / pending states
 */
export default function VesselProvenance() {
  const lineageSteps = [
    { id: "spill-detection", name: "AI Detection", role: "Slick Segmentation" },
    { id: "spill-characterization", name: "Characterization", role: "Spatial Polygon" },
    { id: "drift-reconstruction", name: "Drift & Ocean", role: "Probable Origin Zone" },
    { id: "vessel-intelligence", name: "Vessel Intelligence", role: "AIS Correlation & Attribution" },
  ];

  const provenanceItems = [
    { label: "Origin Source", value: "Awaiting drift reconstruction" },
    { label: "AIS Source", value: "Awaiting AIS dataset" },
    { label: "Correlation Window", value: "Pending" },
    { label: "Spatial Filter", value: "Pending" },
    { label: "Behavioural Analysis", value: "Pending" },
    { label: "SAR Vessel Cross-check", value: "Pending" },
    { label: "Attribution Engine", value: "Awaiting evidence" },
    { label: "Investigation State", value: "Standby" },
  ];

  return (
    <section className={styles.provenanceCard} aria-label="Vessel Investigation Lineage & Provenance">
      {/* Dependency Chain */}
      <div className={styles.chainSection}>
        <div className={styles.headerGroup}>
          <span className={styles.sectionBadge}>LINEAGE</span>
          <h4 className={styles.sectionTitle}>Investigation Lineage</h4>
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

      {/* Provenance Parameters */}
      <div className={styles.provenanceSection}>
        <div className={styles.headerGroup}>
          <span className={styles.sectionBadge}>PARAMETERS</span>
          <h4 className={styles.sectionTitle}>Observation &amp; Model Lineage</h4>
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
