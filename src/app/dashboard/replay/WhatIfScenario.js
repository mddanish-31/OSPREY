"use client";

import styles from "./WhatIfScenario.module.css";

/**
 * WhatIfScenario
 *
 * Controlled scenario simulation configuration panel for #13 Incident Replay.
 *
 * Strict scientific & operational product truth:
 * - Status: "Scenario Simulation Standby"
 * - 8 structured input fields in "Awaiting investigation context" state
 * - Action controls disabled with truthful prerequisite tooltips
 * - Zero fake sliders, arbitrary default scientific values, or pretended execution
 */
export default function WhatIfScenario() {
  const scenarioInputs = [
    { label: "Scenario Name", val: "Awaiting investigation context" },
    { label: "Spill Origin Adjustment", val: "Awaiting investigation context" },
    { label: "Release Time Adjustment", val: "Awaiting investigation context" },
    { label: "Wind Forcing", val: "Awaiting investigation context" },
    { label: "Current Forcing", val: "Awaiting investigation context" },
    { label: "Simulation Duration", val: "Awaiting investigation context" },
    { label: "Drift Model", val: "Awaiting investigation context" },
    { label: "Particle Ensemble", val: "Awaiting investigation context" },
  ];

  return (
    <section className={styles.scenarioCard} aria-label="What-if Simulation Scenario Builder">
      {/* Header */}
      <div className={styles.scenarioHeader}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.cardBadge}>COUNTERFACTUAL MODELING</span>
          <h3 className={styles.cardTitle}>What-if Scenario Builder</h3>
        </div>
        <span className={styles.statusPill}>Simulation Standby</span>
      </div>

      <p className={styles.scenarioDesc}>
        Define controlled parameter adjustments to evaluate alternative spill drift scenarios against baseline reconstruction.
      </p>

      {/* Structured Disabled Input Fields */}
      <div className={styles.inputsGrid}>
        {scenarioInputs.map((item, idx) => (
          <div key={idx} className={styles.inputItem}>
            <span className={styles.inputLabel}>{item.label}</span>
            <div className={styles.disabledFieldBox}>
              <span className={styles.disabledFieldVal}>{item.val}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Action Controls */}
      <div className={styles.actionsSection}>
        <div className={styles.buttonsRow}>
          <button
            type="button"
            className={`${styles.actionBtn} ${styles.primaryBtn}`}
            disabled
            title="Requires active investigation and defined scenario parameters"
            aria-disabled="true"
          >
            <span>Run Scenario Simulation</span>
          </button>

          <button
            type="button"
            className={styles.actionBtn}
            disabled
            title="Requires completed scenario run"
            aria-disabled="true"
          >
            <span>Save Scenario</span>
          </button>

          <button
            type="button"
            className={styles.resetBtn}
            disabled
            title="No scenario parameters active"
            aria-disabled="true"
          >
            <span>Reset Parameters</span>
          </button>
        </div>

        <div className={styles.prereqNotice}>
          <span className={styles.prereqIcon} aria-hidden="true">ℹ</span>
          <p className={styles.prereqText}>
            Scenario execution is disabled until verified baseline drift reconstruction and environmental forcing data are available.
          </p>
        </div>
      </div>
    </section>
  );
}
