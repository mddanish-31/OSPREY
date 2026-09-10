import SatelliteLayers from "./SatelliteLayers";
import styles from "./SARScenePanel.module.css";

/**
 * SARScenePanel
 *
 * Primary Earth Observation viewport visualizing Sentinel-1 C-Band SAR scenes,
 * surface backscatter patterns, candidate slick segmentation masks, and geographic context.
 *
 * Designed to accept real satellite imagery and segmentation masks from the backend.
 *
 * @param {object} props
 * @param {object} [props.sceneData] - Optional real scene metadata
 * @param {object} [props.detection] - Optional real detection output
 * @param {object} props.activeLayers - Active layer map
 * @param {function} props.onToggleLayer - Layer toggle callback
 */
export default function SARScenePanel({
  sceneData,
  detection,
  activeLayers,
  onToggleLayer,
}) {
  const polarizationText = sceneData?.polarization || "Polarization metadata pending";
  const productTypeText = sceneData?.productType || "IW GRD Level-1 (C-Band)";
  const provenanceText = sceneData?.source || "Copernicus Data Space // Sentinel-1";

  return (
    <div className={styles.panelContainer}>
      {/* Top Provenance & Controls Bar */}
      <div className={styles.topBar}>
        <div className={styles.provenanceGroup}>
          <span className={styles.beaconDot} aria-hidden="true" />
          <div className={styles.provenanceTextGroup}>
            <span className={styles.provenanceLabel}>{provenanceText}</span>
            <span className={styles.sensorSubtitle}>C-Band Synthetic Aperture Radar</span>
          </div>
        </div>

        <SatelliteLayers
          activeLayers={activeLayers}
          onToggleLayer={onToggleLayer}
        />
      </div>

      {/* Main SAR Scene Viewport */}
      <div className={styles.viewport} aria-label="Sentinel-1 SAR Scene Viewport">
        {/* Radar Coordinate Grid & Range/Azimuth Axis Markers */}
        {activeLayers.context && (
          <div className={styles.gridOverlay} aria-hidden="true">
            <div className={styles.azimuthAxis}>▲ Flight Direction (Azimuth)</div>
            <div className={styles.rangeAxis}>Range (Near → Far) ▶</div>
            <div className={styles.reticleTopLeft}>+</div>
            <div className={styles.reticleTopRight}>+</div>
            <div className={styles.reticleBottomLeft}>+</div>
            <div className={styles.reticleBottomRight}>+</div>
            <div className={styles.centerReticle} />
          </div>
        )}

        {/* Base SAR Backscatter Canvas */}
        {activeLayers.sar && (
          <div className={styles.sarBackscatterLayer} aria-hidden="true">
            <div className={styles.oceanBackscatterPattern} />
            <div className={styles.radarSweep} />
          </div>
        )}

        {/* Candidate Slick / Surface Anomaly Segmentation Mask */}
        {activeLayers.spillMask && (
          <div className={styles.maskLayer} aria-label="Candidate surface anomaly mask">
            <svg
              className={styles.maskSvg}
              viewBox="0 0 600 380"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              {/* Candidate slick anomaly contour */}
              <path
                d="M 160 210 C 210 170, 270 195, 340 160 C 400 130, 450 145, 490 120 C 510 110, 495 135, 455 165 C 415 195, 360 180, 305 220 C 250 255, 190 240, 160 210 Z"
                className={styles.slickFill}
              />
              <path
                d="M 160 210 C 210 170, 270 195, 340 160 C 400 130, 450 145, 490 120 C 510 110, 495 135, 455 165 C 415 195, 360 180, 305 220 C 250 255, 190 240, 160 210 Z"
                className={styles.slickStroke}
              />
              {/* Morphological damping node markers */}
              <circle cx="340" cy="160" r="3.5" className={styles.nodePoint} />
              <circle cx="455" cy="165" r="3.5" className={styles.nodePoint} />
              <circle cx="250" cy="235" r="3.5" className={styles.nodePoint} />
            </svg>

            <div className={styles.anomalyBadge}>
              <span className={styles.anomalyBeacon} />
              <span>Candidate Surface Anomaly</span>
            </div>
          </div>
        )}

        {/* Optical Cross-Check Layer (Sentinel-2) */}
        {activeLayers.optical && (
          <div className={styles.opticalOverlay} aria-label="Sentinel-2 Optical Cross-Check Overlay">
            <div className={styles.opticalBackdrop} />
            <div className={styles.opticalNotice}>
              <span className={styles.opticalNoticeTag}>Copernicus Data Space // Sentinel-2</span>
              <span className={styles.opticalNoticeText}>
                Optical Cross-Check Layer (Available when a suitable cloud-free observation exists)
              </span>
            </div>
          </div>
        )}

        {/* Floating Scene Telemetry Tag */}
        <div className={styles.telemetryOverlay}>
          <span className={styles.telemetryPill}>
            <span className={styles.telemetryDot} />
            <span>Look-Alike Filtering Active</span>
          </span>
        </div>
      </div>

      {/* Bottom Metadata & Provenance Bar */}
      <div className={styles.bottomBar}>
        <div className={styles.metaItem}>
          <span className={styles.metaKey}>Product</span>
          <span className={styles.metaVal}>{productTypeText}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaKey}>Polarization</span>
          <span className={styles.metaVal}>{polarizationText}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaKey}>Detection Mode</span>
          <span className={styles.metaVal}>
            {detection?.status ? detection.status : "Automated Surface Screening"}
          </span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaKey}>Sensor Geometry</span>
          <span className={styles.metaVal}>Right-Looking SAR</span>
        </div>
      </div>
    </div>
  );
}
