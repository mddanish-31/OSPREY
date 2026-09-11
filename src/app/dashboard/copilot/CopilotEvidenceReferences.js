"use client";

import styles from "./CopilotEvidenceReferences.module.css";

/**
 * CopilotEvidenceReferences
 *
 * Grounded evidence citation area for AI Copilot.
 * Prepares the schema to cite upstream investigation outputs without displaying fabricated citations.
 * Strict scientific product truth:
 * - State: "No evidence references available"
 * - Zero fabricated coordinates, scene IDs, or transponder codes
 */
export default function CopilotEvidenceReferences() {
  const referenceCategories = [
    "Satellite Scene",
    "Spill Geometry",
    "Drift Reconstruction",
    "AIS Evidence",
    "Behavioural Evidence",
    "Environmental Evidence",
    "Response Assessment",
  ];

  return (
    <section className={styles.card} aria-label="Evidence References Panel">
      <div className={styles.cardHeader}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.cardBadge}>EVIDENCE CITATIONS</span>
          <h3 className={styles.cardTitle}>Evidence References</h3>
        </div>
        <span className={styles.statusPill}>References Standby</span>
      </div>

      {/* Empty State Citation Box */}
      <div className={styles.emptyCitationBox}>
        <span className={styles.citationHeading}>No evidence references available</span>
        <p className={styles.citationNotice}>
          Evidence references will appear here when Copilot responses are grounded in OSPREY investigation outputs.
        </p>
      </div>

      {/* Future Reference Categories */}
      <div className={styles.categoriesSection}>
        <span className={styles.sectionLabel}>Supported Evidence Categories</span>
        <div className={styles.categoriesTrack}>
          {referenceCategories.map((cat, idx) => (
            <span key={idx} className={styles.categoryTag}>
              {cat}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
