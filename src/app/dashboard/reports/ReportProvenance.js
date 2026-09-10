"use client";

import styles from "./ReportProvenance.module.css";

/**
 * ReportProvenance
 *
 * Lineage & Multi-Source Provenance panel for #12 Investigation Reports.
 * Transparently indicates upstream evidence source lineage and report compiler state.
 *
 * Strict operational product truth:
 * - All parameters in "Not loaded" / "Awaiting" / "Standby" states
 * - Lineage connecting #3 → #4 → #6 → #7 → #8 → #9 → #10 → #12
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
    { num: "#3", name: "AI Spill Detection" },
    { num: "#4", name: "Spill Characterization" },
    { num: "#6", name: "Drift & Ocean Dynamics" },
    { num: "#7", name: "Vessel Intelligence" },
    { num: "#8", name: "Evidence & Explainability" },
    { num: "#9", name: "Environmental Risk" },
    { num: "#10", name: "Response Intelligence" },
    { num: "#12", name: "Investigation Report" },
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
            <div key={idx} className={styles.lineageNodeWrapper}>
              <div
                className={`${styles.lineageNode} ${
                  idx === lineageNodes.length - 1 ? styles.targetNode : ""
                }`}
              >
                <span className={styles.nodeNum}>{node.num}</span>
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
        {provenanceItems.map((item, idx) => (
          <div key={idx} className={styles.provenanceItem}>
            <span className={styles.itemKey}>{item.label}</span>
            <span className={styles.itemVal}>{item.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
