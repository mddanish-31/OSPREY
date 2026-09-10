"use client";

import styles from "./DriftMapViewer.module.css";

/**
 * DriftMapViewer
 *
 * Central spatial-analysis viewport for #6 Drift & Ocean Dynamics.
 * Conforms strictly to scientific product truth:
 * - Pure data-ready "Awaiting Candidate Spill Geometry" state
 * - Zero fabricated trajectories, origin markers, vectors, coordinates, or fake coastlines
 * - Action controls disabled with clear tooltip descriptions
 */
export default function DriftMapViewer() {
  return (
    <div className={styles.viewerContainer} aria-label="Drift & Ocean Dynamics Spatial Viewport">
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

      {/* Atmospheric Oceanic Ambient Depth Lighting (No Animated Sweeps) */}
      <div className={styles.ambientAtmosphere} aria-hidden="true">
        <div className={styles.ambientGlow1} />
        <div className={styles.ambientGlow2} />
      </div>

      {/* Top Floating Spatial Action Controls Bar */}
      <div className={styles.controlsBar} aria-label="Drift Reconstruction Controls">
        <div className={styles.actionsGroup}>
          <button
            type="button"
            className={styles.primaryActionBtn}
            disabled
            aria-disabled="true"
            title="Requires candidate spill geometry and environmental data"
            aria-label="Run Backward Reconstruction (Requires candidate spill geometry and environmental data)"
          >
            <span className={styles.actionIcon} aria-hidden="true">⇪</span>
            <span>Run Backward Reconstruction</span>
          </button>

          <button
            type="button"
            className={styles.secondaryActionBtn}
            disabled
            aria-disabled="true"
            title="Requires candidate spill geometry and environmental data"
            aria-label="Run Forward Projection (Requires candidate spill geometry and environmental data)"
          >
            <span aria-hidden="true">↗</span>
            <span>Run Forward Projection</span>
          </button>

          <button
            type="button"
            className={styles.secondaryActionBtn}
            disabled
            aria-disabled="true"
            title="Requires completed drift simulations"
            aria-label="Compare Ensembles (Requires completed drift simulations)"
          >
            <span aria-hidden="true">⇄</span>
            <span>Compare Ensembles</span>
          </button>

          <button
            type="button"
            className={styles.secondaryActionBtn}
            disabled
            aria-disabled="true"
            title="Requires reconstructed origin zone"
            aria-label="Inspect Origin Zone (Requires reconstructed origin zone)"
          >
            <span aria-hidden="true">◫</span>
            <span>Inspect Origin Zone</span>
          </button>

          <button
            type="button"
            className={styles.secondaryActionBtn}
            disabled
            aria-disabled="true"
            title="Requires active simulation"
            aria-label="Reset Simulation (Requires active simulation)"
          >
            <span aria-hidden="true">⟲</span>
            <span>Reset Simulation</span>
          </button>
        </div>

        <div className={styles.simulationStatePill} title="Drift Reconstruction State">
          <span className={styles.stateDot} aria-hidden="true" />
          <span>Drift Simulation Standby</span>
        </div>
      </div>

      {/* Center Empty / Data-Ready Investigation State */}
      <div className={styles.emptyStateContainer}>
        <div className={styles.driftIconRing}>
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.driftIcon}
            aria-hidden="true"
          >
            <path d="M2 12h20" />
            <path d="M6 8l-4 4 4 4" />
            <path d="M18 8a4 4 0 0 0-4-4 4 4 0 0 0-4 4" />
          </svg>
        </div>

        <h3 className={styles.emptyHeading}>Awaiting Candidate Spill Geometry</h3>

        <p className={styles.emptyDescription}>
          Generate candidate spill geometry before running drift reconstruction.
        </p>

        {/* Status Badges */}
        <div className={styles.statusBadgesRow}>
          <span className={styles.statusBadge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            <span>Spill Geometry: Awaiting geometry</span>
          </span>
          <span className={styles.statusBadge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            <span>Environmental Forcing: Standby</span>
          </span>
          <span className={styles.statusBadge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            <span>Drift Simulation: Standby</span>
          </span>
        </div>
      </div>
    </div>
  );
}
