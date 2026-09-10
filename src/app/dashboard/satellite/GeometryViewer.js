"use client";

import styles from "./GeometryViewer.module.css";

/**
 * GeometryViewer
 *
 * Map-first spatial-analysis viewport for candidate spill geometry characterization.
 * Conforms to strict product truth rules:
 * - Zero fake candidate spill polygons, centroid coordinates, or measurements
 * - Future-ready spatial action controls disabled with "Requires candidate spill geometry" tooltip
 * - Pure data-ready "Awaiting Candidate Spill Geometry" state
 */
export default function GeometryViewer() {
  return (
    <div className={styles.viewerContainer} aria-label="Spill Geometry Viewport">
      {/* Geographic Graticule & Corner Spatial Framing Reticles */}
      <div className={styles.spatialGraticuleOverlay} aria-hidden="true">
        <div className={styles.reticleTopLeft}>┌</div>
        <div className={styles.reticleTopRight}>┐</div>
        <div className={styles.reticleBottomLeft}>└</div>
        <div className={styles.reticleBottomRight}>┘</div>
        <div className={styles.centerCompassReticle}>✛</div>

        {/* Neutral Empty Geometry Boundary Framing */}
        <div className={styles.emptyGeometryFrame} />
      </div>

      {/* Ambient Oceanic Depth Lighting (No Animated Radar Sweeps) */}
      <div className={styles.ambientAtmosphere} aria-hidden="true">
        <div className={styles.ambientGlow1} />
        <div className={styles.ambientGlow2} />
      </div>

      {/* Top Floating Spatial Action Controls Bar */}
      <div className={styles.controlsBar} aria-label="Geometry Action Controls">
        <div className={styles.actionsGroup}>
          <button
            type="button"
            className={styles.primaryActionBtn}
            disabled
            aria-disabled="true"
            title="Requires candidate spill geometry"
            aria-label="Inspect Geometry (Requires candidate spill geometry)"
          >
            <span className={styles.actionIcon} aria-hidden="true">🔍</span>
            <span>Inspect Geometry</span>
          </button>

          <button
            type="button"
            className={styles.secondaryActionBtn}
            disabled
            aria-disabled="true"
            title="Requires candidate spill geometry"
            aria-label="Validate Geometry (Requires candidate spill geometry)"
          >
            <span aria-hidden="true">✓</span>
            <span>Validate Geometry</span>
          </button>

          <button
            type="button"
            className={styles.secondaryActionBtn}
            disabled
            aria-disabled="true"
            title="Requires candidate spill geometry"
            aria-label="Compare Scene (Requires candidate spill geometry)"
          >
            <span aria-hidden="true">◫</span>
            <span>Compare Scene</span>
          </button>

          <button
            type="button"
            className={styles.handoffActionBtn}
            disabled
            aria-disabled="true"
            title="Requires candidate spill geometry"
            aria-label="Send to Drift Reconstruction (Requires candidate spill geometry)"
          >
            <span>Send to Drift Reconstruction</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>

        <div className={styles.spatialStatePill} title="Spatial Analysis State">
          <span className={styles.stateDot} aria-hidden="true" />
          <span>Spatial Analysis Standby</span>
        </div>
      </div>

      {/* Center Empty / Data-Ready Investigation State */}
      <div className={styles.emptyStateContainer}>
        <div className={styles.spatialIconRing}>
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.spatialIcon}
            aria-hidden="true"
          >
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
        </div>

        <h3 className={styles.emptyHeading}>Awaiting Candidate Spill Geometry</h3>

        <p className={styles.emptyDescription}>
          Run SAR spill detection to generate candidate geometry for characterization.
        </p>

        {/* Status Badges */}
        <div className={styles.statusBadgesRow}>
          <span className={styles.statusBadge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            <span>Polygon Boundary: Pending</span>
          </span>
          <span className={styles.statusBadge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            <span>Spatial Resolution: Awaiting scene</span>
          </span>
          <span className={styles.statusBadge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            <span>Vector Topology: Standby</span>
          </span>
        </div>
      </div>
    </div>
  );
}
