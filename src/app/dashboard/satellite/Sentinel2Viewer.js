"use client";

import styles from "./Sentinel2Viewer.module.css";

/**
 * Sentinel2Viewer
 *
 * Optical observation viewport for conditional Sentinel-2 multispectral cross-checks.
 * Conforms to strict product truth rules:
 * - Sentinel-2 is a conditional optical cross-check, not the primary detector
 * - Zero fake RGB, false-color imagery, cloud percentages, or coordinates
 * - Future-ready action controls disabled with explicit tooltips
 * - Pure data-ready "Awaiting Sentinel-2 Scene" state
 */
export default function Sentinel2Viewer() {
  return (
    <div className={styles.viewerContainer} aria-label="Sentinel-2 Optical Viewport">
      {/* Spatial Graticule & Optical Framing Reticles */}
      <div className={styles.opticalGraticuleOverlay} aria-hidden="true">
        <div className={styles.reticleTopLeft}>┌</div>
        <div className={styles.reticleTopRight}>┐</div>
        <div className={styles.reticleBottomLeft}>└</div>
        <div className={styles.reticleBottomRight}>┘</div>
        <div className={styles.centerObservationReticle}>✛</div>

        {/* Neutral Optical Frame Boundary */}
        <div className={styles.opticalFrameBorder} />
      </div>

      {/* Atmospheric Oceanic Ambient Depth Lighting (No Radar Sweeps) */}
      <div className={styles.ambientAtmosphere} aria-hidden="true">
        <div className={styles.ambientGlow1} />
        <div className={styles.ambientGlow2} />
      </div>

      {/* Top Floating Optical Action Controls Bar */}
      <div className={styles.controlsBar} aria-label="Optical Cross-check Controls">
        <div className={styles.actionsGroup}>
          <button
            type="button"
            className={styles.primaryActionBtn}
            disabled
            aria-disabled="true"
            title="Requires Sentinel-2 scene"
            aria-label="Load Optical Scene (Requires Sentinel-2 scene)"
          >
            <span className={styles.actionIcon} aria-hidden="true">⇪</span>
            <span>Load Optical Scene</span>
          </button>

          <button
            type="button"
            className={styles.secondaryActionBtn}
            disabled
            aria-disabled="true"
            title="Requires candidate spill geometry and Sentinel-2 scene"
            aria-label="Compare with SAR (Requires candidate spill geometry and Sentinel-2 scene)"
          >
            <span aria-hidden="true">⇄</span>
            <span>Compare with SAR</span>
          </button>

          <button
            type="button"
            className={styles.secondaryActionBtn}
            disabled
            aria-disabled="true"
            title="Requires Sentinel-2 scene"
            aria-label="Inspect Optical Evidence (Requires Sentinel-2 scene)"
          >
            <span aria-hidden="true">◫</span>
            <span>Inspect Optical Evidence</span>
          </button>

          <button
            type="button"
            className={styles.secondaryActionBtn}
            disabled
            aria-disabled="true"
            title="Requires Sentinel-2 scene"
            aria-label="Reset Cross-check (Requires Sentinel-2 scene)"
          >
            <span aria-hidden="true">⟲</span>
            <span>Reset Cross-check</span>
          </button>
        </div>

        <div className={styles.opticalStatePill} title="Cross-check Evaluation State">
          <span className={styles.stateDot} aria-hidden="true" />
          <span>Optical Cross-check Standby</span>
        </div>
      </div>

      {/* Center Empty / Data-Ready Investigation State */}
      <div className={styles.emptyStateContainer}>
        <div className={styles.opticalIconRing}>
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.opticalIcon}
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </div>

        <h3 className={styles.emptyHeading}>Awaiting Sentinel-2 Scene</h3>

        <p className={styles.emptyDescription}>
          Load a compatible Sentinel-2 observation to perform an optical cross-check against the candidate spill geometry.
        </p>

        {/* Status Badges */}
        <div className={styles.statusBadgesRow}>
          <span className={styles.statusBadge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            <span>Sentinel-2 MSI: Standby</span>
          </span>
          <span className={styles.statusBadge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            <span>Optical Observation: Awaiting scene</span>
          </span>
          <span className={styles.statusBadge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            <span>Cross-check State: Standby</span>
          </span>
        </div>
      </div>
    </div>
  );
}
