"use client";

import styles from "./AffectedAreaAnalysis.module.css";

/**
 * AffectedAreaAnalysis
 *
 * Affected Area & Spatial Extent panel for Environmental Risk & Impact.
 * Connects upstream detected spill geometry and drift simulation to downstream exposure evaluation.
 * Strict scientific product truth:
 * - Extent and area metrics initialized to truthful "Awaiting" / "Pending" states
 * - Zero fabricated km², hectares, coordinates, or spatial numbers
 */
export default function AffectedAreaAnalysis() {
  const fields = [
    { key: "Initial Spill Geometry", val: "Awaiting geometry" },
    { key: "Projected Spill Envelope", val: "Awaiting simulation" },
    { key: "Spatial Extent", val: "Pending" },
    { key: "Potentially Affected Area", val: "Pending" },
    { key: "Projection Horizon", val: "Pending" },
    { key: "Area Analysis", val: "Awaiting drift output" },
  ];

  const conceptualFlow = [
    "Detected Geometry",
    "Drift Simulation",
    "Projected Envelope",
    "Spatial Intersection",
    "Affected Area",
  ];

  return (
    <section className={styles.card} aria-label="Affected Area Analysis Panel">
      <div className={styles.cardHeader}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.cardBadge}>SPATIAL EXTENT</span>
          <h3 className={styles.cardTitle}>Affected Area Analysis</h3>
        </div>
        <span className={styles.statusPill}>Simulation Standby</span>
      </div>

      {/* Fields Grid */}
      <div className={styles.fieldsGrid}>
        {fields.map((f, idx) => (
          <div key={idx} className={styles.fieldItem}>
            <span className={styles.fieldKey}>{f.key}</span>
            <span className={styles.fieldVal}>{f.val}</span>
          </div>
        ))}
      </div>

      {/* Conceptual Flow */}
      <div className={styles.flowSection}>
        <span className={styles.flowHeading}>Analysis Flow</span>
        <div className={styles.flowTrack}>
          {conceptualFlow.map((step, idx) => (
            <div key={idx} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
              <span className={styles.flowStep}>{step}</span>
              {idx < conceptualFlow.length - 1 && (
                <span className={styles.flowArrow} aria-hidden="true">→</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
