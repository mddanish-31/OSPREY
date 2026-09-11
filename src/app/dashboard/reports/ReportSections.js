"use client";

import { useState } from "react";
import styles from "./ReportSections.module.css";

/**
 * ReportSections
 *
 * 13-section structured report breakdown for Investigation Reports.
 *
 * Strict scientific & operational product truth:
 * - All sections display truthful "Awaiting investigation evidence" state
 * - Zero synthetic content or fake paragraphs
 */
export default function ReportSections() {
  const [selectedSection, setSelectedSection] = useState("executive-summary");

  const sections = [
    { id: "executive-summary", title: "Executive Summary", desc: "High-level investigation overview and key verified findings" },
    { id: "satellite-observation", title: "Satellite Observation", desc: "Sentinel-1 SAR scene acquisition parameters and backscatter context" },
    { id: "spill-detection", title: "Spill Detection", desc: "Surface dampening anomaly segmentation and confidence breakdown" },
    { id: "spill-characterization", title: "Spill Characterization", desc: "Calculated slick geometry, geographic polygon, and centroid coordinates" },
    { id: "origin-reconstruction", title: "Origin Reconstruction", desc: "OpenDrift / ERA5 / CMEMS backward trajectory simulation" },
    { id: "vessel-correlation", title: "Vessel Correlation", desc: "Spatiotemporal AIS correlation candidates and trajectory match metrics" },
    { id: "behavioural-evidence", title: "Behavioural Evidence", desc: "Vessel course deviations, speed anomalies, and loitering events" },
    { id: "dark-vessel-assessment", title: "Dark Vessel Assessment", desc: "SAR non-broadcasting contact correlation and radar cross-section" },
    { id: "environmental-risk", title: "Environmental Risk", desc: "Coastal exposure, sensitive marine reserves, and fishery vulnerability" },
    { id: "response-intelligence", title: "Response Intelligence", desc: "Operational priority assessment and surveillance monitoring plan" },
    { id: "evidence-explainability", title: "Evidence & Explainability", desc: "Multi-factor attribution matrix and evidence factor breakdowns" },
    { id: "investigation-conclusions", title: "Investigation Conclusions", desc: "Verified factual summary without unsubstantiated inference" },
    { id: "sources-provenance", title: "Sources & Provenance", desc: "Complete data lineage, sensor metadata, and processing audit trail" },
  ];

  const currentSection = sections.find((s) => s.id === selectedSection) || sections[0];

  return (
    <section className={styles.card} aria-label="Report Structure Sections">
      <div className={styles.cardHeader}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.cardBadge}>REPORT STRUCTURE</span>
          <h3 className={styles.cardTitle}>Report Sections (13 Core Sections)</h3>
        </div>
        <span className={styles.statusPill}>Sections Standby</span>
      </div>

      <div className={styles.sectionsContainer}>
        {/* Left: Section Navigation List */}
        <div className={styles.sectionsList} role="tablist" aria-label="Report Sections List">
          {sections.map((sec) => {
            const isSelected = selectedSection === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                className={`${styles.sectionItemBtn} ${isSelected ? styles.sectionItemBtnActive : ""}`}
                onClick={() => setSelectedSection(sec.id)}
              >
                <div className={styles.secItemLeft}>
                  <span className={styles.secTitle}>{sec.title}</span>
                </div>
                <span className={styles.secStatePill}>Awaiting</span>
              </button>
            );
          })}
        </div>

        {/* Right: Section Detail Inspection Card */}
        <div className={styles.sectionDetailCard} role="tabpanel" aria-label={`Section detail for ${currentSection.title}`}>
          <div className={styles.detailHeader}>
            <div className={styles.detailTitleGroup}>
              <span className={styles.detailNumBadge}>REPORT SECTION</span>
              <h4 className={styles.detailHeading}>{currentSection.title}</h4>
            </div>
            <span className={styles.detailStatePill}>Awaiting Investigation Evidence</span>
          </div>

          <p className={styles.detailDesc}>{currentSection.desc}</p>

          <div className={styles.emptySectionContent}>
            <div className={styles.emptyIcon} aria-hidden="true">📄</div>
            <span className={styles.emptyHeading}>Awaiting investigation evidence</span>
            <p className={styles.emptyNotice}>
              This section will be automatically compiled and formatted from verified pipeline outputs once an active investigation dataset is ingested.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
