"use client";

import { useState } from "react";
import styles from "./ReportBuilder.module.css";

/**
 * ReportBuilder
 *
 * Report configuration & compilation controls for Investigation Reports.
 *
 * Strict operational product truth:
 * - All configuration fields in truthful standby / ungenerated states
 * - All compilation actions disabled with truthful prerequisite tooltips
 * - Zero simulated generation or fake progress
 */
export default function ReportBuilder() {
  const [selectedType, setSelectedType] = useState("investigation");

  const reportTypes = [
    { id: "investigation", label: "Investigation Report", isPrimary: true },
    { id: "evidence", label: "Evidence Summary", isPrimary: false },
    { id: "attribution", label: "Vessel Attribution Brief", isPrimary: false },
    { id: "environmental", label: "Environmental Impact Brief", isPrimary: false },
    { id: "response", label: "Response Assessment", isPrimary: false },
  ];

  const configFields = [
    { label: "Report Type", value: "Investigation Report" },
    { label: "Report Status", value: "Not Generated" },
    { label: "Investigation", value: "No investigation loaded" },
    { label: "Evidence State", value: "Awaiting evidence" },
    { label: "Report Scope", value: "Awaiting investigation context" },
    { label: "Output", value: "Report generation unavailable" },
  ];

  return (
    <section className={styles.builderCard} aria-label="Report Configuration Builder">
      {/* Header */}
      <div className={styles.builderHeader}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.cardBadge}>REPORT CONFIGURATION</span>
          <h3 className={styles.cardTitle}>Report Builder</h3>
        </div>
        <span className={styles.statusPill}>Builder Standby</span>
      </div>

      {/* Report Template Type Selector */}
      <div className={styles.typeSelectorSection}>
        <span className={styles.sectionLabel}>Report Template Type</span>
        <div className={styles.typeButtonsRow}>
          {reportTypes.map((type) => {
            const isSelected = selectedType === type.id;
            return (
              <button
                key={type.id}
                type="button"
                className={`${styles.typeButton} ${isSelected ? styles.typeButtonActive : ""}`}
                onClick={() => setSelectedType(type.id)}
                title={type.isPrimary ? "Active Primary Structure" : "Future Template Option"}
              >
                <span>{type.label}</span>
                {!type.isPrimary && (
                  <span className={styles.futureBadge}>Future Template</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Configuration State Grid */}
      <div className={styles.configGrid}>
        {configFields.map((field, idx) => (
          <div key={idx} className={styles.configItem}>
            <span className={styles.fieldLabel}>{field.label}</span>
            <span className={styles.fieldValue}>{field.value}</span>
          </div>
        ))}
      </div>

      {/* Disabled Compilation & Action Controls with Tooltips */}
      <div className={styles.actionControlsSection}>
        <div className={styles.controlsRow}>
          <button
            type="button"
            className={`${styles.actionBtn} ${styles.primaryActionBtn}`}
            disabled
            title="Requires active investigation with verified evidence"
            aria-disabled="true"
          >
            <span>Compile Report</span>
          </button>

          <button
            type="button"
            className={styles.actionBtn}
            disabled
            title="Requires compiled report data"
            aria-disabled="true"
          >
            <span>Preview Report</span>
          </button>

          <button
            type="button"
            className={styles.clearBtn}
            disabled
            title="No configuration active"
            aria-disabled="true"
          >
            <span>Clear Configuration</span>
          </button>
        </div>

        {/* Truthful Operational Prerequisite Notice */}
        <div className={styles.prereqNotice}>
          <span className={styles.prereqIcon} aria-hidden="true">ℹ</span>
          <p className={styles.prereqText}>
            Report compilation is disabled until verified investigation evidence is loaded.
          </p>
        </div>
      </div>
    </section>
  );
}
