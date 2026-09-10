"use client";

import styles from "./SARSceneViewer.module.css";

/**
 * SARSceneViewer
 *
 * Map-first Sentinel-1 C-band SAR scene analysis viewport.
 * Conforms to strict product truth rules:
 * - Zero fake satellite imagery or synthetic slick polygons
 * - Zero fake coordinates, timestamps, or footprint geometry
 * - Subtle dark SAR texture and static graticule framing
 * - Inactive future-ready zoom/layer controls with clear disabled indicators
 * - Standby status pills (Sentinel-1 C-Band, GRD Backscatter, Acquisition Mode)
 */
export default function SARSceneViewer() {
  return (
    <div className={styles.viewerContainer} aria-label="SAR Scene Viewport">
      {/* Subtle Static Graticule & Corner Frame Reticles (Zero Fake Coordinates) */}
      <div className={styles.sarGraticuleOverlay} aria-hidden="true">
        <div className={styles.reticleTopLeft}>┌</div>
        <div className={styles.reticleTopRight}>┐</div>
        <div className={styles.reticleBottomLeft}>└</div>
        <div className={styles.reticleBottomRight}>┘</div>
        <div className={styles.centerCrosshair}>✛</div>

        {/* Framing Guides */}
        <div className={styles.frameLineTop} />
        <div className={styles.frameLineBottom} />
        <div className={styles.frameLineLeft} />
        <div className={styles.frameLineRight} />
      </div>

      {/* Atmospheric Oceanic Ambient Depth Lighting (No Animated Radar Sweeps) */}
      <div className={styles.ambientSarBackdrop} aria-hidden="true">
        <div className={styles.sarGlow1} />
        <div className={styles.sarGlow2} />
      </div>

      {/* Top Floating Scene Controls Bar (Inactive Until Scene Ingested) */}
      <div className={styles.controlsBar} aria-label="SAR Scene Controls">
        <div className={styles.controlsGroup}>
          <button
            type="button"
            className={styles.controlBtn}
            disabled
            aria-disabled="true"
            title="Requires active SAR scene to zoom in"
            aria-label="Zoom In (Requires active SAR scene)"
          >
            <span aria-hidden="true">+</span>
          </button>
          <button
            type="button"
            className={styles.controlBtn}
            disabled
            aria-disabled="true"
            title="Requires active SAR scene to zoom out"
            aria-label="Zoom Out (Requires active SAR scene)"
          >
            <span aria-hidden="true">−</span>
          </button>
          <div className={styles.controlDivider} aria-hidden="true" />
          <button
            type="button"
            className={styles.controlBtn}
            disabled
            aria-disabled="true"
            title="Requires active SAR scene to reset view"
            aria-label="Reset View (Requires active SAR scene)"
          >
            <span aria-hidden="true">⟲</span>
          </button>
          <button
            type="button"
            className={styles.controlBtn}
            disabled
            aria-disabled="true"
            title="Requires active SAR scene to toggle layers"
            aria-label="Layers (Requires active SAR scene)"
          >
            <span aria-hidden="true">◫</span>
            <span className={styles.controlLabel}>Layers</span>
          </button>
        </div>

        <div className={styles.controlsNotice} title="Control State">
          <span className={styles.noticeDot} aria-hidden="true" />
          <span>Controls Standby</span>
        </div>
      </div>

      {/* Center Empty / Data-Ready Investigation State */}
      <div className={styles.emptyStateCard}>
        <div className={styles.sensorIconRing}>
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.sensorIcon}
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
            <path d="M2 12h20" />
          </svg>
        </div>

        <h3 className={styles.emptyHeading}>No Sentinel-1 SAR scene selected</h3>

        <p className={styles.emptyDescription}>
          Select or ingest a Sentinel-1 observation to begin SAR analysis.
        </p>

        {/* Status Badges */}
        <div className={styles.statusBadgesRow}>
          <span className={styles.statusBadge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            <span>Sentinel-1 C-Band: Standby</span>
          </span>
          <span className={styles.statusBadge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            <span>GRD Backscatter: Standby</span>
          </span>
          <span className={styles.statusBadge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            <span>Acquisition Mode: Awaiting metadata</span>
          </span>
        </div>
      </div>
    </div>
  );
}
