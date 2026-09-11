"use client";

import styles from "./AISCorrelationViewer.module.css";

/**
 * AISCorrelationViewer
 *
 * Primary spatial-analysis viewport for Vessel Intelligence / AIS Correlation.
 * Strict scientific product truth:
 * - Pure data-ready "Awaiting Probable Origin Zone" state
 * - Zero fabricated vessel tracks, markers, coordinates, ports, or coastlines
 * - Action controls disabled with clear tooltip descriptions
 */
export default function AISCorrelationViewer() {
  return (
    <div className={styles.viewerContainer} aria-label="AIS Spatial Correlation Viewport">
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
      <div className={styles.controlsBar} aria-label="AIS Correlation Controls">
        <div className={styles.actionsGroup}>
          <button
            type="button"
            className={styles.primaryActionBtn}
            disabled
            aria-disabled="true"
            title="Requires an active investigation and AIS dataset"
            aria-label="Load AIS History (Requires an active investigation and AIS dataset)"
          >
            <span className={styles.actionIcon} aria-hidden="true">⇪</span>
            <span>Load AIS History</span>
          </button>

          <button
            type="button"
            className={styles.secondaryActionBtn}
            disabled
            aria-disabled="true"
            title="Requires probable origin zone and AIS history"
            aria-label="Run Vessel Correlation (Requires probable origin zone and AIS history)"
          >
            <span aria-hidden="true">☍</span>
            <span>Run Vessel Correlation</span>
          </button>

          <button
            type="button"
            className={styles.secondaryActionBtn}
            disabled
            aria-disabled="true"
            title="Requires correlated vessel tracks"
            aria-label="Compare Trajectories (Requires correlated vessel tracks)"
          >
            <span aria-hidden="true">⇄</span>
            <span>Compare Trajectories</span>
          </button>

          <button
            type="button"
            className={styles.secondaryActionBtn}
            disabled
            aria-disabled="true"
            title="Requires a selected candidate vessel"
            aria-label="Inspect Vessel (Requires a selected candidate vessel)"
          >
            <span aria-hidden="true">◫</span>
            <span>Inspect Vessel</span>
          </button>

          <button
            type="button"
            className={styles.secondaryActionBtn}
            disabled
            aria-disabled="true"
            title="Requires active correlation analysis"
            aria-label="Reset Correlation (Requires active correlation analysis)"
          >
            <span aria-hidden="true">⟲</span>
            <span>Reset Correlation</span>
          </button>
        </div>

        <div className={styles.correlationStatePill} title="AIS Correlation Evaluation State">
          <span className={styles.stateDot} aria-hidden="true" />
          <span>AIS Correlation Standby</span>
        </div>
      </div>

      {/* Center Empty / Data-Ready Investigation State */}
      <div className={styles.emptyStateContainer}>
        <div className={styles.vesselIconRing}>
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.vesselIcon}
            aria-hidden="true"
          >
            <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
            <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76" />
            <path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6" />
          </svg>
        </div>

        <h3 className={styles.emptyHeading}>Awaiting Probable Origin Zone</h3>

        <p className={styles.emptyDescription}>
          Reconstruct a probable origin zone before correlating historical AIS positions.
        </p>

        {/* Status Badges */}
        <div className={styles.statusBadgesRow}>
          <span className={styles.statusBadge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            <span>Origin Zone: Awaiting reconstruction</span>
          </span>
          <span className={styles.statusBadge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            <span>AIS Dataset: Standby</span>
          </span>
          <span className={styles.statusBadge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            <span>Vessel Correlation: Standby</span>
          </span>
        </div>
      </div>
    </div>
  );
}
