"use client";

import styles from "./ReplayProvenance.module.css";

/**
 * ReplayProvenance
 *
 * Lineage, Provenance & Scientific Integrity panel for Incident Replay.
 *
 * Strict operational product truth:
 * - Lineage across spill detection, characterization, drift, vessel intelligence, explainability, environmental risk, response intelligence, and incident replay
 * - All provenance parameters in truthful standby / awaiting states
 * - Clear scientific integrity notice (simulations vs observations)
 */
export default function ReplayProvenance() {
  const provenanceItems = [
    { label: "Investigation Context", value: "Not loaded" },
    { label: "Temporal Evidence", value: "Awaiting" },
    { label: "Spatial Evidence", value: "Awaiting" },
    { label: "AIS Evidence", value: "Awaiting" },
    { label: "Environmental Forcing", value: "Awaiting" },
    { label: "Baseline Reconstruction", value: "Awaiting" },
    { label: "Scenario State", value: "Not executed" },
    { label: "Comparison State", value: "Unavailable" },
  ];

  const lineageNodes = [
    { id: "spill-detection", name: "AI Spill Detection" },
    { id: "spill-characterization", name: "Spill Characterization" },
    { id: "drift-ocean", name: "Drift & Ocean Dynamics" },
    { id: "vessel-intelligence", name: "Vessel Intelligence" },
    { id: "evidence-explainability", name: "Evidence & Explainability" },
    { id: "environmental-risk", name: "Environmental Risk" },
    { id: "response-intelligence", name: "Response Intelligence" },
    { id: "incident-replay", name: "Incident Replay" },
  ];

  return (
    <section className={styles.card} aria-label="Replay Provenance & Scientific Integrity">
      <div className={styles.cardHeader}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.cardBadge}>UPSTREAM LINEAGE &amp; PROVENANCE</span>
          <h3 className={styles.cardTitle}>Replay Provenance &amp; Scientific Integrity</h3>
        </div>
        <span className={styles.statusPill}>Provenance Standby</span>
      </div>

      {/* Upstream Evidence Connection Chain */}
      <div className={styles.lineageSection}>
        <span className={styles.lineageLabel}>Investigation Evidence Source Lineage</span>
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

      {/* Provenance Key-Value Grid */}
      <div className={styles.provenanceGrid}>
        {provenanceItems.map((item) => (
          <div key={item.label} className={styles.provenanceItem}>
            <span className={styles.itemKey}>{item.label}</span>
            <span className={styles.itemVal}>{item.value}</span>
          </div>
        ))}
      </div>

      {/* Simulation Safety & Scientific Integrity Notice */}
      <div className={styles.safetyNoticeBox}>
        <div className={styles.safetyHeader}>
          <span className={styles.safetyIcon} aria-hidden="true">⚖</span>
          <span className={styles.safetyBadge}>SCIENTIFIC INTEGRITY PRINCIPLE</span>
        </div>
        <p className={styles.safetyText}>
          Scenario outputs are analytical simulations, not direct observations. Any future comparison must remain traceable to the underlying evidence and model assumptions. Replay reconstructs hypotheses based on available telemetry; scenario simulations explore counterfactuals and are not legal proof of historical reality.
        </p>
      </div>
    </section>
  );
}
