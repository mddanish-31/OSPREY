"use client";

import styles from "./ImpactMapViewer.module.css";

/**
 * ImpactMapViewer
 *
 * Central spatial-analysis viewport for Environmental Risk & Impact.
 * Strict scientific product truth:
 * - Pure data-ready "Awaiting Spill Projection" state
 * - Zero fabricated risk heatmaps, ecological layers, fake coastlines, or synthetic contours
 * - Action controls disabled with clear tooltip descriptions
 */
export default function ImpactMapViewer() {
  return (
    <div className={styles.viewerContainer} aria-label="Environmental Impact Spatial Viewport">
      {/* Spatial Graticule & Analysis Reticles */}
      <div className={styles.spatialGraticuleOverlay} aria-hidden="true">
        <div className={styles.reticleTopLeft}>┌</div>
        <div className={styles.reticleTopRight}>┐</div>
        <div className={styles.reticleBottomLeft}>└</div>
        <div className={styles.reticleBottomRight}>┘</div>
        <div className={styles.centerObservationReticle}>✛</div>

        {/* Neutral Spatial Frame Boundary */}
        <div className={styles.spatialFrameBorder} />
      </div>

      {/* Atmospheric Oceanic Ambient Depth Lighting */}
      <div className={styles.ambientAtmosphere} aria-hidden="true">
        <div className={styles.ambientGlow1} />
        <div className={styles.ambientGlow2} />
      </div>

      {/* Top Floating Spatial Action Controls Bar */}
      <div className={styles.controlsBar} aria-label="Environmental Exposure Controls">
        <div className={styles.actionsGroup}>
          <button
            type="button"
            className={styles.primaryActionBtn}
            disabled
            aria-disabled="true"
            title="Requires spill geometry and environmental datasets"
            aria-label="Load Impact Layers (Requires spill geometry and environmental datasets)"
          >
            <span className={styles.actionIcon} aria-hidden="true">⇪</span>
            <span>Load Impact Layers</span>
          </button>

          <button
            type="button"
            className={styles.secondaryActionBtn}
            disabled
            aria-disabled="true"
            title="Requires a completed spill projection"
            aria-label="Analyze Exposure (Requires a completed spill projection)"
          >
            <span aria-hidden="true">↗</span>
            <span>Analyze Exposure</span>
          </button>

          <button
            type="button"
            className={styles.secondaryActionBtn}
            disabled
            aria-disabled="true"
            title="Requires projected spill extent"
            aria-label="Inspect Affected Area (Requires projected spill extent)"
          >
            <span aria-hidden="true">◫</span>
            <span>Inspect Affected Area</span>
          </button>

          <button
            type="button"
            className={styles.secondaryActionBtn}
            disabled
            aria-disabled="true"
            title="Requires available environmental layers"
            aria-label="Compare Risk Layers (Requires available environmental layers)"
          >
            <span aria-hidden="true">⇄</span>
            <span>Compare Risk Layers</span>
          </button>

          <button
            type="button"
            className={styles.secondaryActionBtn}
            disabled
            aria-disabled="true"
            title="Requires active risk analysis"
            aria-label="Reset Analysis (Requires active risk analysis)"
          >
            <span aria-hidden="true">⟲</span>
            <span>Reset Analysis</span>
          </button>
        </div>

        <div className={styles.riskStatePill} title="Risk Analysis State">
          <span className={styles.stateDot} aria-hidden="true" />
          <span>Risk Analysis Standby</span>
        </div>
      </div>

      {/* Center Empty / Data-Ready Investigation State */}
      <div className={styles.emptyStateContainer}>
        <div className={styles.iconRing}>
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.impactIcon}
            aria-hidden="true"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>

        <h3 className={styles.emptyHeading}>Awaiting Spill Projection</h3>

        <p className={styles.emptyDescription}>
          Complete spill geometry and drift projection before assessing environmental exposure.
        </p>

        {/* Status Badges */}
        <div className={styles.statusBadgesRow}>
          <span className={styles.statusBadge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            <span>Spill Geometry: Awaiting geometry</span>
          </span>
          <span className={styles.statusBadge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            <span>Drift Projection: Awaiting simulation</span>
          </span>
          <span className={styles.statusBadge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            <span>Risk Analysis: Standby</span>
          </span>
        </div>
      </div>
    </div>
  );
}
