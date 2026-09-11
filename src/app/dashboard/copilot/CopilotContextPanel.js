"use client";

import styles from "./CopilotContextPanel.module.css";

/**
 * CopilotContextPanel
 *
 * Active investigation context panel for AI Copilot.
 * Represents the multi-source evidence state available to ground Copilot responses.
 * Strict scientific & operational product truth:
 * - Context fields in truthful "No investigation loaded" / "Awaiting" states
 * - Zero fabricated data bindings
 */
export default function CopilotContextPanel() {
  const contextFields = [
    { key: "Investigation", val: "No investigation loaded" },
    { key: "Satellite", val: "Awaiting Sentinel-1 scene" },
    { key: "Spill Detection", val: "Awaiting model output" },
    { key: "Spill Geometry", val: "Awaiting candidate geometry" },
    { key: "Origin Reconstruction", val: "Awaiting drift simulation" },
    { key: "AIS Correlation", val: "Awaiting AIS history" },
    { key: "Evidence", val: "Awaiting evidence synthesis" },
    { key: "Environmental Risk", val: "Awaiting assessment" },
    { key: "Response Intelligence", val: "Awaiting operational context" },
  ];

  return (
    <section className={styles.card} aria-label="Investigation Context Panel">
      <div className={styles.cardHeader}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.cardBadge}>UPSTREAM GROUNDING</span>
          <h3 className={styles.cardTitle}>Investigation Context</h3>
        </div>
        <span className={styles.statusPill}>Context Standby</span>
      </div>

      <div className={styles.contextGrid}>
        {contextFields.map((field, idx) => (
          <div key={idx} className={styles.contextItem}>
            <span className={styles.itemKey}>{field.key}</span>
            <span className={styles.itemVal}>{field.val}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
