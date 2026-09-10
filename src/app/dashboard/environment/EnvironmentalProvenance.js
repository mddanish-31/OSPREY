"use client";

import styles from "./EnvironmentalProvenance.module.css";

/**
 * EnvironmentalProvenance
 *
 * Lineage & Parameter Provenance panel for #9 Environmental Risk & Impact.
 * Displays the 5-step investigation lineage:
 * #3 AI Spill Detection → #4 Spill Characterization → #6 Drift & Ocean Dynamics → #8 Evidence & Explainability → #9 Environmental Risk
 *
 * Strict scientific product truth:
 * - Parameters reflect truthful data sources and standby states
 * - Zero fabricated sensor observations or geographic metadata
 */
export default function EnvironmentalProvenance() {
  const lineageSteps = [
    { num: "#3", name: "AI Detection", role: "Slick Segmentation" },
    { num: "#4", name: "Characterization", role: "Spatial Polygon" },
    { num: "#6", name: "Drift Dynamics", role: "Projected Trajectory" },
    { num: "#8", name: "Evidence Synthesis", role: "Supporting Context" },
    { num: "#9", name: "Environmental Risk", role: "Exposure Assessment" },
  ];

  const provenanceItems = [
    { label: "Spill Source", value: "Awaiting candidate geometry" },
    { label: "Drift Source", value: "OpenDrift / OpenOil" },
    { label: "Wind Source", value: "ERA5" },
    { label: "Ocean Source", value: "CMEMS" },
    { label: "Coastal Layers", value: "Awaiting environmental data" },
    { label: "Sensitive Areas", value: "Awaiting environmental data" },
    { label: "Fisheries Data", value: "Awaiting environmental data" },
    { label: "Risk State", value: "Standby" },
  ];

  return (
    <section className={styles.provenanceCard} aria-label="Environmental Lineage and Provenance Panel">
      {/* 5-Step Investigation Lineage */}
      <div className={styles.chainSection}>
        <div className={styles.headerGroup}>
          <div className={styles.headerTitleGroup}>
            <span className={styles.sectionBadge}>LINEAGE</span>
            <h4 className={styles.sectionTitle}>Environmental Analysis Lineage</h4>
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
            <h4 className={styles.sectionTitle}>Model &amp; Environmental Data Provenance</h4>
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

      {/* Action Footer */}
      <div className={styles.cardFooter}>
        <button
          type="button"
          className={styles.actionBtn}
          disabled
          aria-disabled="true"
          title="Requires completed environmental analysis"
          aria-label="Export Impact Summary (Requires completed environmental analysis)"
        >
          <span aria-hidden="true">↗</span>
          <span>Export Impact Summary</span>
        </button>
      </div>
    </section>
  );
}
