"use client";

import styles from "./DetectionResult.module.css";

/**
 * DetectionResult
 *
 * Segmentation inference result panel.
 * Conforms strictly to truthfulness:
 * - Uses "No result", "Pending", and "Awaiting inference"
 * - Zero synthetic numeric placeholders (no 0%, 0 km², 0 detections)
 */
export default function DetectionResult() {
  const resultItems = [
    { label: "Detection State", value: "Awaiting inference" },
    { label: "Candidate Slick", value: "No result" },
    { label: "Geometry", value: "Pending" },
    { label: "Estimated Area", value: "Pending" },
    { label: "Confidence", value: "Pending" },
    { label: "Interpretation", value: "Pending model output" },
  ];

  return (
    <section className={styles.resultCard} aria-label="Detection Inference Results">
      <div className={styles.cardHeader}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.cardBadge}>RESULTS</span>
          <h4 className={styles.cardTitle}>Inference Summary</h4>
        </div>
        <span className={styles.resultStatusPill}>Awaiting Output</span>
      </div>

      <div className={styles.resultGrid}>
        {resultItems.map((item, idx) => (
          <div key={idx} className={styles.resultItem}>
            <span className={styles.resultKey}>{item.label}</span>
            <span className={styles.resultVal}>{item.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
