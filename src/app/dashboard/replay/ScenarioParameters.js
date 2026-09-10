"use client";

import styles from "./ScenarioParameters.module.css";

/**
 * ScenarioParameters
 *
 * Parameter configuration matrix for #13 What-if Simulation.
 *
 * Strict scientific & operational product truth:
 * - 4 parameter groups: Spatial, Temporal, Environmental, Simulation
 * - All parameters in "Awaiting data" state
 * - Disabled inputs without fake numeric sliders or synthetic defaults
 */
export default function ScenarioParameters() {
  const paramGroups = [
    {
      title: "Spatial Parameters",
      category: "SPATIAL",
      params: [
        { label: "Origin Position", state: "Awaiting data" },
        { label: "Initial Spill Geometry", state: "Awaiting data" },
      ],
    },
    {
      title: "Temporal Parameters",
      category: "TEMPORAL",
      params: [
        { label: "Release Time (T₀)", state: "Awaiting data" },
        { label: "Investigation Window", state: "Awaiting data" },
      ],
    },
    {
      title: "Environmental Forcing",
      category: "METOCEAN",
      params: [
        { label: "Wind Forcing (ERA5)", state: "Awaiting data" },
        { label: "Ocean Current (CMEMS)", state: "Awaiting data" },
        { label: "Wave / Stokes Drift", state: "Awaiting data" },
      ],
    },
    {
      title: "Simulation Dynamics",
      category: "MODEL",
      params: [
        { label: "Simulation Duration", state: "Awaiting data" },
        { label: "Particle Ensemble Count", state: "Awaiting data" },
        { label: "Hydrodynamic Drift Model", state: "Awaiting data" },
      ],
    },
  ];

  return (
    <section className={styles.card} aria-label="Simulation Scenario Parameters">
      <div className={styles.cardHeader}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.cardBadge}>PARAMETER MATRIX</span>
          <h3 className={styles.cardTitle}>Scenario Parameters</h3>
        </div>
        <span className={styles.statusPill}>Parameters Standby</span>
      </div>

      <div className={styles.groupsGrid}>
        {paramGroups.map((grp, idx) => (
          <div key={idx} className={styles.groupCard}>
            <div className={styles.groupHeader}>
              <span className={styles.groupCategory}>{grp.category}</span>
              <h4 className={styles.groupTitle}>{grp.title}</h4>
            </div>

            <div className={styles.paramsList}>
              {grp.params.map((p, pIdx) => (
                <div key={pIdx} className={styles.paramItem}>
                  <span className={styles.paramLabel}>{p.label}</span>
                  <span className={styles.paramState}>{p.state}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.noteBox}>
        <span className={styles.noteIcon} aria-hidden="true">ℹ</span>
        <p className={styles.noteText}>
          Scenario parameter inputs allow counterfactual adjustment of hydrodynamic release vectors and forcing fields once baseline reconstruction is established.
        </p>
      </div>
    </section>
  );
}
