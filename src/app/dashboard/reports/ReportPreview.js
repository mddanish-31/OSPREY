"use client";

import styles from "./ReportPreview.module.css";

/**
 * ReportPreview
 *
 * Report visual document canvas & export shell for Investigation Reports.
 *
 * Strict scientific & operational product truth:
 * - Empty state: "Report Preview Unavailable"
 * - Description: "Load an investigation with verified evidence to preview the structured report."
 * - Export controls disabled with tooltip "Available after report generation is connected."
 * - Zero fake maps, charts, coordinates, or synthetic documents
 */
export default function ReportPreview() {
  const exportOptions = [
    { label: "Export PDF", format: "PDF" },
    { label: "Export JSON", format: "GeoJSON" },
    { label: "Export Evidence Package", format: "ZIP" },
  ];

  const skeletonSections = [
    { id: "executive-summary", name: "Executive Summary" },
    { id: "satellite-observation", name: "Satellite Observation" },
    { id: "spill-detection-geometry", name: "Spill Detection & Geometry" },
    { id: "origin-vessel-evidence", name: "Origin & Vessel Evidence" },
    { id: "environmental-response-assessment", name: "Environmental & Response Assessment" },
    { id: "audit-trail-provenance", name: "Audit Trail & Provenance" },
  ];

  return (
    <section className={styles.previewContainer} aria-label="Investigation Report Preview Area">
      {/* Header with Export Controls */}
      <div className={styles.previewHeader}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.cardBadge}>DOCUMENT PREVIEW</span>
          <h3 className={styles.cardTitle}>Structured Report Preview</h3>
        </div>

        <div className={styles.headerActions}>
          <span className={styles.statusPill}>
            <span className={styles.statusDot} aria-hidden="true" />
            <span>Preview Standby</span>
          </span>

          <div className={styles.exportControlsRow}>
            {exportOptions.map((opt, idx) => (
              <button
                key={idx}
                type="button"
                className={styles.exportBtn}
                disabled
                title="Available after report generation is connected."
                aria-disabled="true"
              >
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Conceptual Document Canvas Frame */}
      <div className={styles.documentCanvas}>
        {/* Subtle Ambient Depth */}
        <div className={styles.canvasAtmosphere} aria-hidden="true">
          <div className={styles.ambientGlow} />
        </div>

        {/* Conceptual Sheet Frame */}
        <div className={styles.documentSheet}>
          <div className={styles.sheetHeader}>
            <div className={styles.sheetEmblem}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <div className={styles.sheetTitleGroup}>
              <span className={styles.sheetWatermark}>OSPREY MARITIME INTELLIGENCE DOSSIER</span>
              <span className={styles.sheetSubWatermark}>AWAITING VERIFIED EVIDENCE INGESTION</span>
            </div>
          </div>

          {/* Central Standby Empty State Notice */}
          <div className={styles.emptyNoticeContainer}>
            <h4 className={styles.emptyTitle}>Report Preview Unavailable</h4>
            <p className={styles.emptyDesc}>
              Load an investigation with verified evidence to preview the structured report.
            </p>
          </div>

          {/* Conceptual Document Section Wireframe Outline */}
          <div className={styles.skeletonSectionList} aria-hidden="true">
            {skeletonSections.map((sec) => (
              <div key={sec.id} className={styles.skeletonBlock}>
                <div className={styles.skeletonHeader}>
                  <span className={styles.skeletonTitle}>{sec.name}</span>
                </div>
                <div className={styles.skeletonBar} />
                <div className={styles.skeletonBarShort} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
