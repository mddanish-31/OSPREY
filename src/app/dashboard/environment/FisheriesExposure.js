"use client";

import styles from "./FisheriesExposure.module.css";

/**
 * FisheriesExposure
 *
 * Commercial & artisanal fisheries vulnerability analysis panel for #9 Environmental Risk & Impact.
 * Strict scientific product truth:
 * - Layers & overlap fields in truthful "Awaiting" / "Pending" states
 * - Zero fabricated fishing zones, vessel densities, catch values, or overlap percentages
 */
export default function FisheriesExposure() {
  const fields = [
    { key: "Fishing Zones", val: "Awaiting environmental layer" },
    { key: "Fishing Activity", val: "Awaiting data" },
    { key: "Projected Spill Envelope", val: "Awaiting drift projection" },
    { key: "Spatial Overlap", val: "Pending" },
    { key: "Exposure Assessment", val: "Pending" },
    { key: "Current State", val: "Awaiting fisheries data" },
  ];

  const conceptualFlow = [
    "Projected Spill Area",
    "Fisheries Layer",
    "Spatial Overlap",
    "Exposure Assessment",
  ];

  return (
    <section className={styles.card} aria-label="Fisheries Exposure Analysis Panel">
      <div className={styles.cardHeader}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.cardBadge}>FISHERIES &amp; HARVESTING</span>
          <h3 className={styles.cardTitle}>Fisheries Exposure</h3>
        </div>
        <span className={styles.statusPill}>Data Standby</span>
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

      {/* Action Footer */}
      <div className={styles.cardFooter}>
        <button
          type="button"
          className={styles.actionBtn}
          disabled
          aria-disabled="true"
          title="Requires fisheries data and spill projection"
          aria-label="Assess Fisheries Exposure (Requires fisheries data and spill projection)"
        >
          <span aria-hidden="true">◫</span>
          <span>Assess Fisheries Exposure</span>
        </button>
      </div>
    </section>
  );
}
