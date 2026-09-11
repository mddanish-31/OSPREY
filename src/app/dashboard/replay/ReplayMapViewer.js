"use client";

import styles from "./ReplayMapViewer.module.css";

/**
 * ReplayMapViewer
 *
 * Primary geographic investigation replay canvas for Incident Replay.
 *
 * Strict scientific & operational product truth:
 * - Clean neutral geographic frame with reticles and oceanic atmospheric depth
 * - Empty state: "Awaiting Investigation Context"
 * - Zero fabricated coordinates, vessel tracks, spill polygons, or fake vectors
 */
export default function ReplayMapViewer() {
  const feedStatuses = [
    { label: "SAR Slick Mask", state: "Standby" },
    { label: "AIS Vessel Tracks", state: "Standby" },
    { label: "ERA5 / CMEMS Forcing", state: "Standby" },
  ];

  return (
    <div className={styles.viewportContainer} aria-label="Incident Replay Map Viewport">
      {/* Reticles & Frame Markings */}
      <div className={styles.geoGridOverlay} aria-hidden="true">
        <div className={styles.reticleTopLeft}>┌</div>
        <div className={styles.reticleTopRight}>┐</div>
        <div className={styles.reticleBottomLeft}>└</div>
        <div className={styles.reticleBottomRight}>┘</div>
        <div className={styles.centerCompassReticle}>✛</div>
      </div>

      {/* Ambient Atmospheric Depth Lighting */}
      <div className={styles.oceanAtmosphere} aria-hidden="true">
        <div className={styles.ambientGlow} />
        <div className={styles.ambientGlowSecondary} />
      </div>

      {/* Center Standby Prompt */}
      <div className={styles.promptContainer}>
        <div className={styles.promptRing}>
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <polygon points="10 8 16 12 10 16 10 8" />
          </svg>
        </div>

        <h3 className={styles.promptHeading}>Awaiting Investigation Context</h3>
        <p className={styles.promptText}>
          Load an investigation with verified spill geometry, vessel history, and environmental forcing to begin temporal replay and what-if simulation.
        </p>

        {/* Data Readiness Telemetry Badges */}
        <div className={styles.feedStatusList}>
          {feedStatuses.map((feed, idx) => (
            <span key={idx} className={styles.feedPill}>
              <span className={styles.feedDot} aria-hidden="true" />
              <span>{feed.label}: {feed.state}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Floating Canvas Context Pill */}
      <div className={styles.bottomStatusOverlay}>
        <div className={styles.overlayPill}>
          <span className={styles.overlayTag}>REPLAY CANVAS</span>
          <span className={styles.overlaySep}>|</span>
          <span className={styles.overlayVal}>Awaiting Ingested Scene &amp; AIS Trajectory</span>
        </div>
      </div>
    </div>
  );
}
