"use client";

import styles from "./SatellitePipeline.module.css";

/**
 * SatellitePipeline
 *
 * Compact analytical provenance and processing strip.
 * Conveys pipeline architecture and observation state without fabricated results.
 */
export default function SatellitePipeline() {
  const pipelineSegments = [
    { label: "OBSERVATION", value: "Sentinel-1 SAR" },
    { label: "DATA ACCESS", value: "Copernicus Data Space" },
    { label: "ANALYSIS", value: "OSPREY SAR analysis pipeline" },
    { label: "SCENE STATUS", value: "Awaiting scene", isStatus: true },
  ];

  return (
    <footer className={styles.pipelineStrip} aria-label="SAR Pipeline Provenance">
      <div className={styles.stripGrid}>
        {pipelineSegments.map((seg, idx) => (
          <div key={idx} className={styles.segment}>
            <span className={styles.segmentLabel}>{seg.label}</span>
            <div className={styles.segmentValueRow}>
              {seg.isStatus && <span className={styles.statusDot} aria-hidden="true" />}
              <span
                className={`${styles.segmentValue} ${
                  seg.isStatus ? styles.segmentStatusVal : ""
                }`}
              >
                {seg.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </footer>
  );
}
