"use client";

import styles from "./ReportProvenance.module.css";

/**
 * ReportProvenance
 *
 * Lineage & Multi-Source Provenance panel for Investigation Reports.
 * Transparently indicates upstream evidence source lineage and report compiler state.
 *
 * Strict operational product truth:
 * - All parameters in "Not loaded" / "Awaiting" / "Standby" states
 * - Lineage across spill detection, characterization, drift, vessel intelligence, explainability, environmental risk, response intelligence, and investigation report
 */
export default function ReportProvenance() {
  const provenanceItems = [
    { label: "Investigation Context", value: "Not loaded" },
    { label: "Evidence Sources", value: "Awaiting evidence" },
    { label: "Data Lineage", value: "Awaiting investigation" },
    { label: "Report Builder", value: "Standby" },
    { label: "Generation State", value: "Not generated" },
    { label: "Output State", value: "Standby" },
  ];

  const lineageNodes = [
    { id: "spill-detection", name: "AI Spill Detection" },
    { id: "spill-characterization", name: "Spill Characterization" },
    { id: "drift-ocean", name: "Drift & Ocean Dynamics" },
    { id: "vessel-intelligence", name: "Vessel Intelligence" },
    { id: "evidence-explainability", name: "Evidence & Explainability" },
    { id: "environmental-risk", name: "Environmental Risk" },
    { id: "response-intelligence", name: "Response Intelligence" },
    { id: "investigation-report", name: "Investigation Report" },
  ];

  return (
    <section className={styles.card} aria-label="Report Data Lineage & Provenance">
      <div className={styles.cardHeader}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.cardBadge}>UPSTREAM LINEAGE</span>
          <h3 className={styles.cardTitle}>Report Provenance &amp; Lineage</h3>
        </div>
        <span className={styles.statusPill}>Provenance Standby</span>
      </div>

      {/* Upstream Evidence Source Connection Chain */}
      <div className={styles.lineageSection}>
        <span className={styles.lineageLabel}>Conceptual Evidence Ingestion Chain</span>
        <div className={styles.lineageTrack}>
          {lineageNodes.map((node, idx) => (
            <div key={node.id} className={styles.lineageNodeWrapper}>
              <div
                className={`${styles.lineageNode} ${
                  idx === lineageNodes.length - 1 ? styles.targetNode : ""
                }`}
              >
                <span className={styles.nodeName}>{node.name}</span>
              </div>
              {idx < lineageNodes.length - 1 && (
                <span className={styles.lineageArrow} aria-hidden="true">→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Key-Value Parameters Grid */}
      <div className={styles.provenanceGrid}>
        {provenanceItems.map((item) => (
          <div key={item.label} className={styles.provenanceItem}>
            <span className={styles.itemKey}>{item.label}</span>
            <span className={styles.itemVal}>{item.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
