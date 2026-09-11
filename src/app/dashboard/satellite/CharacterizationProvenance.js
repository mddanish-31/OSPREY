"use client";

import styles from "./CharacterizationProvenance.module.css";

/**
 * CharacterizationProvenance
 *
 * Upstream detection provenance and scene context panel.
 * Conforms strictly to truthfulness:
 * - Clearly establishes the upstream lineage: SAR Scene → AI Spill Detection → Spill Characterization
 * - Shows explicit awaiting/pending states for scene and detection context
 */
export default function CharacterizationProvenance() {
  const provenanceSteps = [
    { id: "sar-scene", name: "SAR Scene", state: "Input source" },
    { id: "spill-detection", name: "AI Spill Detection", state: "Upstream segmentation" },
    { id: "spill-characterization", name: "Spill Characterization", state: "Current analysis" },
  ];

  const sceneContext = [
    { label: "Source Scene", value: "Awaiting SAR scene" },
    { label: "Acquisition Time", value: "Awaiting metadata" },
    { label: "Spatial Reference", value: "Awaiting metadata" },
    { label: "Geometry Source", value: "Awaiting detection" },
    { label: "Processing State", value: "Standby" },
  ];

  return (
    <section className={styles.provenanceCard} aria-label="Detection Provenance & Scene Context">
      {/* Upstream Dependency Chain */}
      <div className={styles.chainSection}>
        <div className={styles.headerGroup}>
          <span className={styles.sectionBadge}>PROVENANCE</span>
          <h4 className={styles.sectionTitle}>Upstream Detection Lineage</h4>
        </div>

        <div className={styles.chainTrack}>
          {provenanceSteps.map((step, idx) => (
            <div key={step.id} className={styles.chainSegment}>
              <div className={styles.stepBox}>
                <span className={styles.stepName}>{step.name}</span>
                <span className={styles.stepState}>{step.state}</span>
              </div>
              {idx < provenanceSteps.length - 1 && (
                <span className={styles.chainArrow} aria-hidden="true">→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Scene Context Parameters */}
      <div className={styles.contextSection}>
        <div className={styles.headerGroup}>
          <span className={styles.sectionBadge}>CONTEXT</span>
          <h4 className={styles.sectionTitle}>Spatial Scene Parameters</h4>
        </div>

        <div className={styles.contextGrid}>
          {sceneContext.map((item) => (
            <div key={item.label} className={styles.contextItem}>
              <span className={styles.contextKey}>{item.label}</span>
              <span className={styles.contextVal}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
