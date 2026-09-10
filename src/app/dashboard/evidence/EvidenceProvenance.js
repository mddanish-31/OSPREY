"use client";

import styles from "./EvidenceProvenance.module.css";

/**
 * EvidenceProvenance
 *
 * Lineage panel detailing the 5-step multi-sensor investigation workflow:
 * #3 AI Spill Detection → #4 Spill Characterization → #6 Drift & Ocean Dynamics → #7 Vessel Intelligence → #8 Evidence & Explainability
 *
 * Conforms strictly to product truth:
 * - Shows end-to-end evidence lineage across all upstream intelligence modules
 * - Parameter provenance in truthful standby / pending states
 */
export default function EvidenceProvenance() {
  const lineageSteps = [
    { num: "#3", name: "AI Detection", role: "Slick Segmentation" },
    { num: "#4", name: "Characterization", role: "Spatial Polygon" },
    { num: "#6", name: "Drift & Ocean", role: "Probable Origin Zone" },
    { num: "#7", name: "Vessel Intelligence", role: "AIS Correlation" },
    { num: "#8", name: "Evidence & Explainability", role: "Attribution Synthesis" },
  ];

  const provenanceItems = [
    { label: "Satellite Source", value: "Sentinel-1 / Sentinel-2" },
    { label: "Environmental Sources", value: "ERA5 / CMEMS" },
    { label: "Drift Engine", value: "OpenDrift / OpenOil" },
    { label: "Vessel Source", value: "AIS" },
    { label: "Cross-Sensor Source", value: "Pending" },
    { label: "Evidence State", value: "Standby" },
    { label: "Association State", value: "Pending" },
  ];

  return (
    <section className={styles.provenanceCard} aria-label="Evidence Provenance & Lineage Panel">
      {/* 5-Stage Dependency Chain */}
      <div className={styles.chainSection}>
        <div className={styles.headerGroup}>
          <span className={styles.sectionBadge}>LINEAGE</span>
          <h4 className={styles.sectionTitle}>Investigation Lineage</h4>
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

      {/* Provenance Parameters */}
      <div className={styles.provenanceSection}>
        <div className={styles.headerGroup}>
          <span className={styles.sectionBadge}>PARAMETERS</span>
          <h4 className={styles.sectionTitle}>Observation &amp; Evidence Lineage</h4>
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
