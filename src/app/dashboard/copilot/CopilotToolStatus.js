"use client";

import styles from "./CopilotToolStatus.module.css";

/**
 * CopilotToolStatus
 *
 * Grounded tool execution status panel for #11 AI Copilot.
 * Represents analytical pipeline tools available to the assistant once active investigation data exists.
 * Strict operational product truth:
 * - Tools in truthful "Standby" state
 * - Zero background execution or mock processing
 */
export default function CopilotToolStatus() {
  const tools = [
    { name: "Satellite Evidence", state: "Standby" },
    { name: "Spill Geometry", state: "Standby" },
    { name: "Drift Reconstruction", state: "Standby" },
    { name: "AIS Correlation", state: "Standby" },
    { name: "Behavioural Analysis", state: "Standby" },
    { name: "Environmental Risk", state: "Standby" },
    { name: "Response Intelligence", state: "Standby" },
  ];

  return (
    <section className={styles.card} aria-label="Investigation Tools Panel">
      <div className={styles.cardHeader}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.cardBadge}>AGENTIC TOOLS</span>
          <h3 className={styles.cardTitle}>Investigation Tools</h3>
        </div>
        <span className={styles.statusPill}>Tools Standby</span>
      </div>

      <div className={styles.toolsGrid}>
        {tools.map((tool, idx) => (
          <div key={idx} className={styles.toolItem}>
            <span className={styles.toolName}>{tool.name}</span>
            <span className={styles.toolState}>{tool.state}</span>
          </div>
        ))}
      </div>

      <div className={styles.noteBox}>
        <span className={styles.noteIcon} aria-hidden="true">ℹ</span>
        <p className={styles.noteText}>
          Tools will activate when an investigation context and corresponding data sources are available.
        </p>
      </div>
    </section>
  );
}
