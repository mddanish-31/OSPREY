"use client";

import { useState } from "react";
import SARScenePanel from "./SARScenePanel";
import DetectionState from "./DetectionState";
import CrossCheckPanel from "./CrossCheckPanel";
import SatelliteEvidence from "./SatelliteEvidence";
import styles from "./SatelliteIntelligence.module.css";

/**
 * SatelliteIntelligence
 *
 * Section 4: "SATELLITE INTELLIGENCE"
 * Earth observation intelligence pipeline combining Sentinel-1 C-Band SAR
 * with conditional Sentinel-2 multispectral cross-checks.
 *
 * Designed to accept real backend payloads without structural changes.
 *
 * @param {object} props
 * @param {object} [props.sceneData] - Optional real satellite scene metadata
 * @param {object} [props.detection] - Optional real AI detection payload
 * @param {object} [props.crossCheck] - Optional real Sentinel-2 cross-check payload
 * @param {object} [props.evidenceData] - Optional real evidence metadata
 */
export default function SatelliteIntelligence({
  sceneData,
  detection,
  crossCheck,
  evidenceData,
}) {
  // Layer toggles state
  const [activeLayers, setActiveLayers] = useState({
    sar: true,
    spillMask: true,
    optical: false,
    context: true,
  });

  const handleToggleLayer = (layerId) => {
    setActiveLayers((prev) => ({
      ...prev,
      [layerId]: !prev[layerId],
    }));
  };

  return (
    <section
      className={styles.section}
      id="satellite-intelligence"
      aria-labelledby="satellite-intelligence-heading"
    >
      {/* Ambient Lighting & Atmosphere */}
      <div className={styles.ambientAtmosphere} aria-hidden="true">
        <div className={styles.ambientGlowTop} />
        <div className={styles.ambientGlowCenter} />
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
            <span className={styles.eyebrowText}>SATELLITE INTELLIGENCE</span>
          </div>

          <h2 id="satellite-intelligence-heading" className={styles.headline}>
            See the signal beneath the surface.
          </h2>

          <p className={styles.supportingText}>
            OSPREY starts with Earth observation data, using Sentinel-1 SAR to
            identify suspicious surface patterns and complementary optical observations
            to strengthen interpretation when suitable imagery is available.
          </p>
        </header>

        {/* ===================================================
            2. Asymmetric Workbench: SAR Viewport + Intelligence Panels
            =================================================== */}
        <div className={styles.workbenchGrid}>
          {/* Left Column: Primary SAR Scene Viewport */}
          <div className={styles.primaryColumn}>
            <SARScenePanel
              sceneData={sceneData}
              detection={detection}
              activeLayers={activeLayers}
              onToggleLayer={handleToggleLayer}
            />
          </div>

          {/* Right Column: AI Detection State & Optical Cross-Check */}
          <div className={styles.sideColumn}>
            <DetectionState detection={detection} />
            <CrossCheckPanel crossCheck={crossCheck} />
          </div>
        </div>

        {/* ===================================================
            3. Lower Observation Evidence Matrix
            =================================================== */}
        <div className={styles.evidenceSection}>
          <SatelliteEvidence evidenceData={evidenceData} />
        </div>
      </div>
    </section>
  );
}
