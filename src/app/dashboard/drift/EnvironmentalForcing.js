"use client";

import styles from "./EnvironmentalForcing.module.css";

/**
 * EnvironmentalForcing
 *
 * Glass panel displaying hydrodynamic and atmospheric forcing inputs for drift modeling.
 * Strict product truth:
 * - CMEMS: Ocean current forcing (Status: Awaiting environmental data)
 * - ERA5: Atmospheric wind forcing (Status: Awaiting environmental data)
 * - Future inputs (Surface current, wind forcing, waves/Stokes drift, SST): Pending
 * - Zero fabricated velocity vectors, speeds, or fake observations
 */
export default function EnvironmentalForcing() {
  const primarySources = [
    {
      category: "Ocean Dynamics",
      source: "CMEMS Ocean Currents",
      provider: "Copernicus Marine",
      status: "Awaiting environmental data",
      type: "Hydrodynamic current fields",
    },
    {
      category: "Atmospheric Forcing",
      source: "ERA5 Wind",
      provider: "ECMWF",
      status: "Awaiting environmental data",
      type: "10m surface atmospheric wind",
    },
  ];

  const futureInputs = [
    { label: "Surface Current", state: "Pending" },
    { label: "Wind Forcing", state: "Pending" },
    { label: "Wave / Stokes Drift", state: "Pending" },
    { label: "Sea Temperature", state: "Pending" },
  ];

  return (
    <aside className={styles.forcingCard} aria-label="Environmental Forcing Parameters">
      <div className={styles.cardHeader}>
        <div className={styles.headerLeft}>
          <span className={styles.headerBadge}>FORCING FIELDS</span>
          <h4 className={styles.headerTitle}>Environmental Forcing</h4>
        </div>
        <span className={styles.standbyPill}>Standby</span>
      </div>

      {/* Primary Forcing Datasets */}
      <div className={styles.sourcesList}>
        {primarySources.map((item, idx) => (
          <div key={idx} className={styles.sourceItem}>
            <div className={styles.sourceTop}>
              <span className={styles.sourceCategory}>{item.category}</span>
              <span className={styles.sourceStatusBadge}>{item.status}</span>
            </div>
            <div className={styles.sourceMain}>
              <span className={styles.sourceName}>{item.source}</span>
              <span className={styles.providerTag}>{item.provider}</span>
            </div>
            <span className={styles.sourceDesc}>{item.type}</span>
          </div>
        ))}
      </div>

      {/* Future Environmental Ingestion Suite */}
      <div className={styles.futureInputsSection}>
        <span className={styles.futureSectionTitle}>Parameters</span>
        <div className={styles.futureGrid}>
          {futureInputs.map((input, idx) => (
            <div key={idx} className={styles.futureItem}>
              <span className={styles.inputLabel}>{input.label}</span>
              <span className={styles.inputState}>{input.state}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scientific Explanatory Disclaimer */}
      <div className={styles.disclaimerBox}>
        <span className={styles.disclaimerIcon} aria-hidden="true">ℹ</span>
        <p className={styles.disclaimerText}>
          Environmental forcing will be supplied to the drift engine once compatible observations are available. Drift reconstruction requires real hydrodynamic and atmospheric fields; no simulation is available until those inputs are ingested.
        </p>
      </div>
    </aside>
  );
}
