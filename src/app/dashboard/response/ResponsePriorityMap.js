"use client";

import styles from "./ResponsePriorityMap.module.css";

/**
 * ResponsePriorityMap
 *
 * Primary operational spatial viewport for #10 Response Intelligence.
 * Conforms strictly to operational & scientific product truth:
 * - Pure data-ready "Awaiting Response Context" state
 * - Zero fabricated emergency zones, response units, vessel deployments, or fake coordinates
 * - Action controls disabled with descriptive tooltips
 */
export default function ResponsePriorityMap() {
  return (
    <div className={styles.viewerContainer} aria-label="Operational Response Priority Spatial Viewport">
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

      {/* Atmospheric Oceanic Depth Lighting */}
      <div className={styles.ambientAtmosphere} aria-hidden="true">
        <div className={styles.ambientGlow1} />
        <div className={styles.ambientGlow2} />
      </div>

      {/* Top Floating Action Controls Bar */}
      <div className={styles.controlsBar} aria-label="Response Intelligence Controls">
        <div className={styles.actionsGroup}>
          <button
            type="button"
            className={styles.primaryActionBtn}
            disabled
            aria-disabled="true"
            title="Requires environmental assessment data"
            aria-label="Load Response Layers (Requires environmental assessment data)"
          >
            <span className={styles.actionIcon} aria-hidden="true">⇪</span>
            <span>Load Response Layers</span>
          </button>

          <button
            type="button"
            className={styles.secondaryActionBtn}
            disabled
            aria-disabled="true"
            title="Requires affected-area and risk analysis"
            aria-label="Assess Priority Areas (Requires affected-area and risk analysis)"
          >
            <span aria-hidden="true">↗</span>
            <span>Assess Priority Areas</span>
          </button>

          <button
            type="button"
            className={styles.secondaryActionBtn}
            disabled
            aria-disabled="true"
            title="Requires generated response priorities"
            aria-label="Inspect Priority Area (Requires generated response priorities)"
          >
            <span aria-hidden="true">◫</span>
            <span>Inspect Priority Area</span>
          </button>

          <button
            type="button"
            className={styles.secondaryActionBtn}
            disabled
            aria-disabled="true"
            title="Requires response assessment"
            aria-label="Compare Response Zones (Requires response assessment)"
          >
            <span aria-hidden="true">⇄</span>
            <span>Compare Response Zones</span>
          </button>

          <button
            type="button"
            className={styles.secondaryActionBtn}
            disabled
            aria-disabled="true"
            title="Requires active response analysis"
            aria-label="Reset Response View (Requires active response analysis)"
          >
            <span aria-hidden="true">⟲</span>
            <span>Reset Response View</span>
          </button>
        </div>

        <div className={styles.responseStatePill} title="Response Planning State">
          <span className={styles.stateDot} aria-hidden="true" />
          <span>Response Planning Standby</span>
        </div>
      </div>

      {/* Center Empty / Data-Ready State */}
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
            className={styles.responseIcon}
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <polygon points="12 8 8 12 12 16 16 12 12 8" />
          </svg>
        </div>

        <h3 className={styles.emptyHeading}>Awaiting Response Context</h3>

        <p className={styles.emptyDescription}>
          Complete environmental impact assessment before generating response priorities.
        </p>

        {/* Status Badges */}
        <div className={styles.statusBadgesRow}>
          <span className={styles.statusBadge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            <span>Environmental Risk: Awaiting assessment</span>
          </span>
          <span className={styles.statusBadge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            <span>Affected Area: Awaiting analysis</span>
          </span>
          <span className={styles.statusBadge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            <span>Response Planning: Standby</span>
          </span>
        </div>
      </div>
    </div>
  );
}
