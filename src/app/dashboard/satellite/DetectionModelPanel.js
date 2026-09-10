"use client";

import styles from "./DetectionModelPanel.module.css";

/**
 * DetectionModelPanel
 *
 * Model Information & Data Requirements panel.
 * Conforms strictly to factual implementation context:
 * - No invented Dice score, IoU, accuracy, or inference times
 * - Factual model task and data requirements
 */
export default function DetectionModelPanel() {
  const modelSpecs = [
    { label: "Model", value: "OSPREY SAR segmentation model", isKnown: true },
    { label: "Task", value: "SAR candidate slick segmentation", isKnown: true },
    { label: "Input", value: "Sentinel-1 SAR", isKnown: true },
    { label: "Output", value: "Candidate spill geometry", isKnown: true },
    { label: "Inference State", value: "No inference performed", isKnown: false },
    { label: "Model Metadata", value: "Model metadata pending", isKnown: false },
  ];

  const requirements = [
    { label: "Required Input", value: "Sentinel-1 SAR scene", isMet: false },
    { label: "Required Metadata", value: "Awaiting metadata", isMet: false },
    { label: "Processing State", value: "Standby", isMet: false },
    { label: "Environmental Context", value: "Not required for initial segmentation", isMet: true },
  ];

  return (
    <aside className={styles.modelPanel} aria-label="Model & Data Requirements">
      {/* Model Information Section */}
      <div className={styles.sectionBlock}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionBadge}>MODEL</span>
          <h4 className={styles.sectionTitle}>Architecture Context</h4>
        </div>

        <div className={styles.specList}>
          {modelSpecs.map((spec, idx) => (
            <div key={idx} className={styles.specItem}>
              <span className={styles.specKey}>{spec.label}</span>
              <span
                className={`${styles.specVal} ${
                  spec.isKnown ? styles.specValKnown : styles.specValPending
                }`}
              >
                {spec.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Data Requirements Section */}
      <div className={styles.sectionBlock}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionBadge}>REQUIREMENTS</span>
          <h4 className={styles.sectionTitle}>Input Prerequisites</h4>
        </div>

        <div className={styles.reqList}>
          {requirements.map((req, idx) => (
            <div key={idx} className={styles.reqItem}>
              <span className={styles.reqKey}>{req.label}</span>
              <span
                className={`${styles.reqVal} ${
                  req.isMet ? styles.reqValInfo : styles.reqValAwaiting
                }`}
              >
                {req.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
