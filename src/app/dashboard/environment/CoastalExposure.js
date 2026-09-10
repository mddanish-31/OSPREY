"use client";

import styles from "./CoastalExposure.module.css";

/**
 * CoastalExposure
 *
 * Coastal Vulnerability & Intersection Analysis panel for #9 Environmental Risk & Impact.
 * Evaluates potential shoreline contact based on projected spill movement and authoritative coastal boundaries.
 * Strict scientific product truth:
 * - Current fields initialized to truthful "Awaiting" and "Pending" states
 * - Zero fabricated coastline distances or affected shoreline lengths
 */
export default function CoastalExposure() {
  const fields = [
    { key: "Coastal Geometry", val: "Awaiting environmental layer" },
    { key: "Projected Spill Extent", val: "Awaiting drift projection" },
    { key: "Coastal Intersection", val: "Pending" },
    { key: "Exposure Distance", val: "Pending" },
    { key: "Affected Coastline", val: "Pending" },
    { key: "Exposure State", val: "Awaiting analysis" },
  ];

  const conceptualFlow = [
    "Projected Spill Envelope",
    "Coastal Boundary",
    "Spatial Intersection",
    "Coastal Exposure",
  ];

  return (
    <section className={styles.card} aria-label="Coastal Exposure Analysis Panel">
      <div className={styles.cardHeader}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.cardBadge}>COASTAL INTERSECTION</span>
          <h3 className={styles.cardTitle}>Coastal Exposure</h3>
        </div>
        <span className={styles.statusPill}>Analysis Standby</span>
      </div>

      <p className={styles.purposeDesc}>
        Assess whether projected spill movement may intersect coastal areas once real geometry and drift results exist.
      </p>

      {/* Current Fields Grid */}
      <div className={styles.fieldsGrid}>
        {fields.map((f, idx) => (
          <div key={idx} className={styles.fieldItem}>
            <span className={styles.fieldKey}>{f.key}</span>
            <span className={styles.fieldVal}>{f.val}</span>
          </div>
        ))}
      </div>

      {/* Conceptual Analysis Flow */}
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

      {/* Card Action Footer */}
      <div className={styles.cardFooter}>
        <button
          type="button"
          className={styles.actionBtn}
          disabled
          aria-disabled="true"
          title="Requires coastal layer and projected spill extent"
          aria-label="Inspect Coastal Impact (Requires coastal layer and projected spill extent)"
        >
          <span aria-hidden="true">◫</span>
          <span>Inspect Coastal Impact</span>
        </button>
      </div>
    </section>
  );
}
