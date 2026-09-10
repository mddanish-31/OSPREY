"use client";

import styles from "./SpillDetectionViewport.module.css";

/**
 * SpillDetectionViewport
 *
 * Primary AI Spill Detection segmentation viewport.
 * Conforms to strict product truth rules:
 * - Zero fake segmentation masks, confidence values, or slick geometries
 * - Inactive action controls with explicit "Requires active SAR scene" tooltips
 * - Pure data-ready "Awaiting SAR Scene" state
 */
export default function SpillDetectionViewport() {
  return (
    <div className={styles.viewportContainer} aria-label="Spill Detection Viewport">
      {/* Subtle Static Graticule & Framing Reticles */}
      <div className={styles.segmentationGraticuleOverlay} aria-hidden="true">
        <div className={styles.reticleTopLeft}>┌</div>
        <div className={styles.reticleTopRight}>┐</div>
        <div className={styles.reticleBottomLeft}>└</div>
        <div className={styles.reticleBottomRight}>┘</div>
        <div className={styles.centerCrosshair}>✛</div>

        {/* Segmentation Frame Boundary */}
        <div className={styles.maskFrameBorder} />
      </div>

      {/* Ambient Depth Atmosphere (Zero Radar Sweeps) */}
      <div className={styles.ambientAtmosphere} aria-hidden="true">
        <div className={styles.ambientGlow1} />
        <div className={styles.ambientGlow2} />
      </div>

      {/* Top Floating Action Controls Bar (Disabled in Data-Ready State) */}
      <div className={styles.controlsBar} aria-label="Detection Controls">
        <div className={styles.actionsGroup}>
          <button
            type="button"
            className={styles.primaryActionBtn}
            disabled
            aria-disabled="true"
            title="Requires an active SAR scene to run segmentation"
            aria-label="Run Detection (Requires an active SAR scene)"
          >
            <span className={styles.actionIcon} aria-hidden="true">▶</span>
            <span>Run Detection</span>
          </button>

          <button
            type="button"
            className={styles.secondaryActionBtn}
            disabled
            aria-disabled="true"
            title="Requires an active SAR scene"
            aria-label="Reset Analysis (Requires an active SAR scene)"
          >
            <span aria-hidden="true">⟲</span>
            <span>Reset Analysis</span>
          </button>

          <button
            type="button"
            className={styles.secondaryActionBtn}
            disabled
            aria-disabled="true"
            title="Requires active detection evidence"
            aria-label="View Evidence (Requires active detection evidence)"
          >
            <span aria-hidden="true">◫</span>
            <span>View Evidence</span>
          </button>
        </div>

        <div className={styles.pipelineStatePill} title="Inference Pipeline State">
          <span className={styles.stateDot} aria-hidden="true" />
          <span>Inference Standby</span>
        </div>
      </div>

      {/* Center Empty / Data-Ready State */}
      <div className={styles.emptyStateContainer}>
        <div className={styles.detectionIconRing}>
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.detectionIcon}
            aria-hidden="true"
          >
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
        </div>

        <h3 className={styles.emptyHeading}>Awaiting SAR Scene</h3>

        <p className={styles.emptyDescription}>
          Load a Sentinel-1 SAR scene to begin automated candidate-slick detection.
        </p>

        {/* Status Badges */}
        <div className={styles.statusBadgesRow}>
          <span className={styles.statusBadge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            <span>Segmentation Model: Standby</span>
          </span>
          <span className={styles.statusBadge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            <span>Mask Ingestion: Awaiting scene</span>
          </span>
          <span className={styles.statusBadge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            <span>Candidate Screener: Standby</span>
          </span>
        </div>
      </div>
    </div>
  );
}
