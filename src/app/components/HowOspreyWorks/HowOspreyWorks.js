"use client";

import { useState } from "react";
import PipelineTimeline from "./PipelineTimeline";
import PipelineStageCard from "./PipelineStageCard";
import DataSourcesPreview from "./previews/DataSourcesPreview";
import SpillDetectionPreview from "./previews/SpillDetectionPreview";
import SpillCharacterizationPreview from "./previews/SpillCharacterizationPreview";
import DriftReconstructionPreview from "./previews/DriftReconstructionPreview";
import AISCorrelationPreview from "./previews/AISCorrelationPreview";
import BehaviouralPreview from "./previews/BehaviouralPreview";
import DarkVesselPreview from "./previews/DarkVesselPreview";
import AttributionPreview from "./previews/AttributionPreview";
import EnvironmentalRiskPreview from "./previews/EnvironmentalRiskPreview";
import ResponseDossierPreview from "./previews/ResponseDossierPreview";
import styles from "./HowOspreyWorks.module.css";

/**
 * HowOspreyWorks
 *
 * Section 3: "HOW OSPREY WORKS"
 * The 10-Stage Explainable Maritime Intelligence Workflow.
 */
export default function HowOspreyWorks() {
  const [activeStage, setActiveStage] = useState("01");
  const [hoveredStage, setHoveredStage] = useState(null);

  // 10 Investigation Stages with exact approved text and dedicated previews
  const stages = [
    {
      number: "01",
      tag: "01 // DATA INGESTION",
      shortLabel: "Data Ingestion",
      title: "Data Ingestion",
      phase: "Phase 1: Observation & Detection",
      description:
        "Bring satellite imagery, vessel traffic and environmental observations into a common investigation context.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        </svg>
      ),
      preview: <DataSourcesPreview />,
    },
    {
      number: "02",
      tag: "02 // SPILL DETECTION",
      shortLabel: "Spill Detection",
      title: "Spill Detection",
      phase: "Phase 1: Observation & Detection",
      description:
        "Analyze satellite imagery to identify suspicious surface patterns and generate a candidate spill mask.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>
      ),
      preview: <SpillDetectionPreview />,
    },
    {
      number: "03",
      tag: "03 // SPILL CHARACTERIZATION",
      shortLabel: "Characterization",
      title: "Spill Characterization",
      phase: "Phase 1: Observation & Detection",
      description:
        "Convert the detected pattern into a geographic investigation object with geometry, location and observation context.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      ),
      preview: <SpillCharacterizationPreview />,
    },
    {
      number: "04",
      tag: "04 // ORIGIN RECONSTRUCTION",
      shortLabel: "Origin Drift",
      title: "Origin Reconstruction",
      phase: "Phase 2: Trajectory & Vessel Correlation",
      description:
        "Trace the observed slick backward through environmental conditions to estimate a probable origin zone and time window.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12h20" />
          <path d="M6 8l-4 4 4 4" />
          <path d="M18 8a4 4 0 0 0-4-4 4 4 0 0 0-4 4" />
        </svg>
      ),
      preview: <DriftReconstructionPreview />,
    },
    {
      number: "05",
      tag: "05 // AIS CORRELATION",
      shortLabel: "AIS Correlation",
      title: "AIS Correlation",
      phase: "Phase 2: Trajectory & Vessel Correlation",
      description:
        "Reconstruct historical vessel movement around the probable spill origin and investigation window.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
          <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76" />
          <path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6" />
        </svg>
      ),
      preview: <AISCorrelationPreview />,
    },
    {
      number: "06",
      tag: "06 // BEHAVIOURAL FINGERPRINT",
      shortLabel: "Behaviour",
      title: "Behavioural Fingerprint",
      phase: "Phase 2: Trajectory & Vessel Correlation",
      description:
        "Compare vessel movement against historical behaviour to identify unusual patterns around the incident.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
      preview: <BehaviouralPreview />,
    },
    {
      number: "07",
      tag: "07 // DARK VESSEL DETECTION",
      shortLabel: "Dark Vessels",
      title: "Dark Vessel Detection",
      phase: "Phase 2: Trajectory & Vessel Correlation",
      description:
        "Compare vessels observed in SAR imagery with AIS records to identify objects without an expected AIS match.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
      ),
      preview: <DarkVesselPreview />,
    },
    {
      number: "08",
      tag: "08 // EXPLAINABLE ATTRIBUTION",
      shortLabel: "Attribution",
      title: "Explainable Attribution",
      phase: "Phase 3: Synthesis & Operational Response",
      description:
        "Combine spatial, temporal, trajectory and behavioural evidence to rank potential vessel associations.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
      preview: <AttributionPreview />,
    },
    {
      number: "09",
      tag: "09 // ENVIRONMENTAL RISK",
      shortLabel: "Marine Risk",
      title: "Environmental Risk",
      phase: "Phase 3: Synthesis & Operational Response",
      description:
        "Project possible spill movement and evaluate exposure across coastal and environmentally sensitive areas.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      preview: <EnvironmentalRiskPreview />,
    },
    {
      number: "10",
      tag: "10 // RESPONSE INTELLIGENCE",
      shortLabel: "Response",
      title: "Response Intelligence",
      phase: "Phase 3: Synthesis & Operational Response",
      description:
        "Turn investigation findings into an actionable operational picture for environmental response teams.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
      preview: <ResponseDossierPreview />,
    },
  ];

  // Helper to check if a stage is adjacent to the hovered stage
  const isAdjacentToHovered = (num) => {
    if (!hoveredStage) return false;
    const currentIdx = parseInt(num, 10);
    const targetIdx = parseInt(hoveredStage, 10);
    return Math.abs(currentIdx - targetIdx) === 1;
  };

  return (
    <section className={styles.section} id="how-it-works" aria-labelledby="how-osprey-heading">
      {/* Ambient Lighting & Atmosphere */}
      <div className={styles.ambientAtmosphere} aria-hidden="true">
        <div className={styles.ambientGlowTop} />
        <div className={styles.ambientGlowCenter} />
        <div className={styles.ambientGlowBottom} />
        <div className={styles.fineGrid} />
      </div>

      <div className={styles.container}>
        {/* ===================================================
            1. Section Editorial Header
            =================================================== */}
        <header className={styles.header}>
          <div className={styles.eyebrowPill}>
            <span className={styles.beaconDot} aria-hidden="true">
              <span className={styles.beaconPing} />
            </span>
            <span className={styles.eyebrowText}>THE OSPREY WORKFLOW</span>
          </div>

          <h2 id="how-osprey-heading" className={styles.headline}>
            From ocean signals to explainable intelligence.
          </h2>

          <p className={styles.supportingText}>
            OSPREY brings satellite observations, ocean dynamics and vessel behaviour
            into one continuous investigation workflow — from detecting a suspicious
            slick to understanding its probable origin, associated vessel activity
            and environmental impact.
          </p>
        </header>

        {/* ===================================================
            2. Interactive 10-Stage Horizontal Stepper
            =================================================== */}
        <div className={styles.timelineSection}>
          <PipelineTimeline
            stages={stages}
            activeStage={activeStage}
            onSelectStage={(num) => setActiveStage(num)}
          />
        </div>

        {/* ===================================================
            3. 10-Stage Pipeline Grid (Structured Multi-Phase Flow)
            =================================================== */}
        <div className={styles.pipelineGrid}>
          {stages.map((stage) => (
            <PipelineStageCard
              key={stage.number}
              stage={stage}
              isActive={stage.number === activeStage}
              isAdjacent={isAdjacentToHovered(stage.number)}
              onSelect={(num) => setActiveStage(num)}
              onHover={(num) => setHoveredStage(num)}
              onLeave={() => setHoveredStage(null)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
