"use client";

import styles from "./CopilotProvenance.module.css";

/**
 * CopilotProvenance
 *
 * Model & Lineage Provenance panel for AI Copilot.
 * Transparently indicates model connectivity and grounding state without fabricating LLM versions or synthetic connections.
 * Strict operational product truth:
 * - Model: "Not connected"
 * - Grounding State: "Awaiting evidence"
 * - Response State: "Standby"
 */
export default function CopilotProvenance() {
  const provenanceItems = [
    { label: "Investigation Context", value: "Not loaded" },
    { label: "Evidence Sources", value: "Awaiting investigation data" },
    { label: "Tool Access", value: "Standby" },
    { label: "Model", value: "Not connected" },
    { label: "Grounding State", value: "Awaiting evidence" },
    { label: "Response State", value: "Standby" },
  ];

  return (
    <section className={styles.provenanceCard} aria-label="Copilot Provenance Panel">
      <div className={styles.headerGroup}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.sectionBadge}>MODEL &amp; LINEAGE</span>
          <h4 className={styles.sectionTitle}>Copilot Provenance</h4>
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
    </section>
  );
}
