"use client";

import { useState } from "react";
import styles from "./ReportSections.module.css";

/**
 * ReportSections
 *
 * 13-section structured report breakdown for #12 Investigation Reports.
 *
 * Strict scientific & operational product truth:
 * - All sections display truthful "Awaiting investigation evidence" state
 * - Zero synthetic content or fake paragraphs
 */
export default function ReportSections() {
  const [selectedSection, setSelectedSection] = useState("01");

  const sections = [
    { num: "01", title: "Executive Summary", desc: "High-level investigation overview and key verified findings" },
    { num: "02", title: "Satellite Observation", desc: "Sentinel-1 SAR scene acquisition parameters and backscatter context" },
    { num: "03", title: "Spill Detection", desc: "Surface dampening anomaly segmentation and confidence breakdown" },
    { num: "04", title: "Spill Characterization", desc: "Calculated slick geometry, geographic polygon, and centroid coordinates" },
    { num: "05", title: "Origin Reconstruction", desc: "OpenDrift / ERA5 / CMEMS backward trajectory simulation" },
    { num: "06", title: "Vessel Correlation", desc: "Spatiotemporal AIS correlation candidates and trajectory match metrics" },
    { num: "07", title: "Behavioural Evidence", desc: "Vessel course deviations, speed anomalies, and loitering events" },
    { num: "08", title: "Dark Vessel Assessment", desc: "SAR non-broadcasting contact correlation and radar cross-section" },
    { num: "09", title: "Environmental Risk", desc: "Coastal exposure, sensitive marine reserves, and fishery vulnerability" },
    { num: "10", title: "Response Intelligence", desc: "Operational priority assessment and surveillance monitoring plan" },
    { num: "11", title: "Evidence & Explainability", desc: "Multi-factor attribution matrix and evidence factor breakdowns" },
    { num: "12", title: "Investigation Conclusions", desc: "Verified factual summary without unsubstantiated inference" },
    { num: "13", title: "Sources & Provenance", desc: "Complete data lineage, sensor metadata, and processing audit trail" },
  ];

  const currentSection = sections.find((s) => s.num === selectedSection) || sections[0];

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
            const isSelected = selectedSection === sec.num;
            return (
              <button
                key={sec.num}
                type="button"
                role="tab"
                aria-selected={isSelected}
                className={`${styles.sectionItemBtn} ${isSelected ? styles.sectionItemBtnActive : ""}`}
                onClick={() => setSelectedSection(sec.num)}
              >
                <div className={styles.secItemLeft}>
                  <span className={styles.secNum}>{sec.num}</span>
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
              <span className={styles.detailNumBadge}>SECTION {currentSection.num}</span>
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
