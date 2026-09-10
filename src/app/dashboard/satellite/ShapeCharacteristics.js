"use client";

import styles from "./ShapeCharacteristics.module.css";

/**
 * ShapeCharacteristics
 *
 * Dedicated analytical section for geometry-derived spatial descriptors.
 * Conforms strictly to truthfulness:
 * - Displays "Pending" for Extent, Orientation, Compactness, Boundary Complexity, Spatial Confidence
 * - Zero synthetic numbers or speculative descriptors
 */
export default function ShapeCharacteristics() {
  const characteristics = [
    { label: "Spatial Extent", value: "Pending", desc: "Bounding box envelope coordinates" },
    { label: "Major Axis Orientation", value: "Pending", desc: "Primary elongation angle relative to north" },
    { label: "Isoperimetric Compactness", value: "Pending", desc: "Perimeter-to-area circularity ratio" },
    { label: "Boundary Complexity", value: "Pending", desc: "Fractal shoreline irregularity index" },
    { label: "Spatial Confidence", value: "Pending", desc: "Morphological coherence probability" },
  ];

  return (
    <section className={styles.characteristicsCard} aria-label="Shape & Spatial Descriptors">
      <div className={styles.cardHeader}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.cardBadge}>DESCRIPTORS</span>
          <h4 className={styles.cardTitle}>Shape &amp; Spatial Descriptors</h4>
        </div>
        <span className={styles.statusPill}>Awaiting Output</span>
      </div>

      <div className={styles.descriptorsGrid}>
        {characteristics.map((item, idx) => (
          <div key={idx} className={styles.descriptorItem}>
            <div className={styles.itemTop}>
              <span className={styles.itemKey}>{item.label}</span>
              <span className={styles.itemVal}>{item.value}</span>
            </div>
            <p className={styles.itemDesc}>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
