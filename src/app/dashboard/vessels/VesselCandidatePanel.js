"use client";

import styles from "./VesselCandidatePanel.module.css";

/**
 * VesselCandidatePanel
 *
 * Glass panel presenting candidate vessels correlated against the probable release origin zone.
 * Strict scientific truth:
 * - Uses neutral investigative terminology: "Potential Vessel", "Candidate Vessel", "Investigation Candidate"
 * - NEVER uses "Guilty Vessel", "Responsible Vessel", or "Confirmed Source"
 * - Zero fabricated vessel names, MMSI/IMO numbers, positions, or speeds
 * - Clear empty state indicating dependency on upstream drift origin and AIS dataset
 */
export default function VesselCandidatePanel() {
  const candidateFields = [
    { label: "Candidate Set", value: "Awaiting AIS correlation" },
    { label: "Candidate Count", value: "Pending" },
    { label: "Search Radius", value: "Pending" },
    { label: "Investigation Window", value: "Pending" },
    { label: "Selected Vessel", value: "None selected" },
    { label: "Evidence State", value: "Awaiting correlation" },
  ];

  return (
    <aside className={styles.candidateCard} aria-label="Potential Vessel Candidates Panel">
      <div className={styles.cardHeader}>
        <div className={styles.headerLeft}>
          <span className={styles.headerBadge}>AIS CORRELATION</span>
          <h4 className={styles.headerTitle}>Potential Vessel Candidates</h4>
        </div>
        <span className={styles.standbyPill}>Standby</span>
      </div>

      {/* Empty Investigation State Box */}
      <div className={styles.emptyCandidateBox}>
        <div className={styles.emptyIconRing}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.emptyIcon}
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h5 className={styles.emptyHeading}>No vessel candidates</h5>
        <p className={styles.emptyText}>
          Historical AIS positions will populate candidate vessels after an origin zone and investigation time window are available.
        </p>
      </div>

      {/* Candidate Parameters Grid */}
      <div className={styles.fieldsList}>
        {candidateFields.map((field, idx) => (
          <div key={idx} className={styles.fieldItem}>
            <span className={styles.fieldKey}>{field.label}</span>
            <span className={styles.fieldVal}>{field.value}</span>
          </div>
        ))}
      </div>

      {/* Inspect Candidate Action (Disabled) */}
      <div className={styles.actionRow}>
        <button
          type="button"
          className={styles.inspectBtn}
          disabled
          aria-disabled="true"
          title="Requires a selected candidate vessel"
          aria-label="Inspect Candidate (Requires a selected candidate vessel)"
        >
          <span>Inspect Candidate</span>
          <span aria-hidden="true">→</span>
        </button>
      </div>

      {/* Investigative Notice */}
      <div className={styles.noticeBox}>
        <span className={styles.noticeIcon} aria-hidden="true">ℹ</span>
        <p className={styles.noticeText}>
          Candidates represent spatiotemporally proximate vessels within the probable origin window. Correlation does not establish liability.
        </p>
      </div>
    </aside>
  );
}
