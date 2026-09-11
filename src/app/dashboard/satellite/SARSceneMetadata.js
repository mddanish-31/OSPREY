"use client";

import { useState } from "react";
import { downloadSatelliteScene } from "@/lib/api/investigations";
import styles from "./SARSceneMetadata.module.css";

/**
 * SARSceneMetadata
 *
 * Compact glass panel displaying Sentinel-1 C-band SAR scene parameters and download controls.
 * Information grouped logically for rapid operational scanning:
 * - SCENE: Scene ID, Mission / Platform, Acquisition
 * - SENSOR: Sensor, Product Type, Polarization
 * - ORBIT: Orbit Direction, Relative Orbit
 * - SOURCE & SPATIAL: Data Source, CDSE ID, Spatial Footprint, Processing State
 * - STORAGE & INTEGRITY: File Size, SHA-256 Fingerprint, Verification Status (when downloaded)
 *
 * @param {object} props
 * @param {object|null} props.selectedScene - Active Sentinel-1 SatelliteScene object
 * @param {boolean} props.isLoading - Loading state flag
 * @param {function} [props.onSceneUpdated] - Callback when scene metadata / download status updates
 */
export default function SARSceneMetadata({
  selectedScene = null,
  isLoading = false,
  onSceneUpdated,
}) {
  const hasScene = Boolean(selectedScene);
  const metadataJson = selectedScene?.metadata_json || {};

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);

  // Format acquisition timestamp safely
  const formattedAcquisition = selectedScene?.acquisition_time
    ? new Date(selectedScene.acquisition_time).toISOString().replace("T", " ").replace("Z", " UTC")
    : null;

  // Processing stage: check metadata_json for lifecycle state
  const processingState = hasScene
    ? metadataJson.processing_state || "METADATA_IMPORTED"
    : "Standby";

  const cdseId = metadataJson.source_product_id || null;
  const isReadyForProcessing =
    processingState === "READY_FOR_PROCESSING" || processingState === "VERIFIED";
  const isDownloadFailed = processingState === "DOWNLOAD_FAILED";

  // File size formatter
  const formatBytes = (bytes) => {
    if (!bytes || isNaN(bytes)) return null;
    const num = Number(bytes);
    if (num >= 1073741824) {
      return `${(num / 1073741824).toFixed(2)} GB`;
    }
    return `${(num / 1048576).toFixed(1)} MB`;
  };

  const formattedSize = formatBytes(metadataJson.content_length);
  const localSha256 = metadataJson.local_sha256 || null;
  const verificationStatus = metadataJson.verification_status || null;
  const verificationMethod = metadataJson.verification_method || null;

  const handleDownload = async () => {
    if (!selectedScene?.id || isDownloading) return;

    setIsDownloading(true);
    setDownloadError(null);

    try {
      const result = await downloadSatelliteScene(selectedScene.id);
      if (onSceneUpdated) {
        onSceneUpdated(result);
      }
    } catch (err) {
      setDownloadError(err.message || "Failed to download Sentinel-1 product binary.");
    } finally {
      setIsDownloading(false);
    }
  };

  const sections = [
    {
      title: "SCENE",
      items: [
        {
          label: "Scene ID",
          value: hasScene ? selectedScene.scene_identifier || selectedScene.id : "Awaiting scene",
          isKnown: hasScene,
          isTruncated: true,
        },
        {
          label: "Mission / Platform",
          value: hasScene ? selectedScene.platform || "Sentinel-1" : "Sentinel-1 (Standby)",
          isKnown: true,
        },
        {
          label: "Acquisition (UTC)",
          value: formattedAcquisition || "Awaiting scene",
          isKnown: Boolean(formattedAcquisition),
        },
      ],
    },
    {
      title: "SENSOR",
      items: [
        {
          label: "Sensor",
          value: hasScene ? selectedScene.sensor || "C-SAR" : "C-band SAR",
          isKnown: true,
        },
        {
          label: "Product Type",
          value: hasScene ? selectedScene.product_type || "N/A" : "Awaiting metadata",
          isKnown: hasScene,
        },
        {
          label: "Polarization",
          value: hasScene ? selectedScene.polarization || "N/A" : "Awaiting metadata",
          isKnown: Boolean(selectedScene?.polarization),
        },
      ],
    },
    {
      title: "ORBIT",
      items: [
        {
          label: "Orbit Direction",
          value: hasScene ? selectedScene.orbit_direction || "N/A" : "Awaiting metadata",
          isKnown: Boolean(selectedScene?.orbit_direction),
        },
        {
          label: "Relative Orbit",
          value:
            hasScene && selectedScene.relative_orbit != null
              ? String(selectedScene.relative_orbit)
              : hasScene
              ? "N/A"
              : "Awaiting metadata",
          isKnown: hasScene && selectedScene.relative_orbit != null,
        },
      ],
    },
    {
      title: "SOURCE & SPATIAL",
      items: [
        {
          label: "Data Source",
          value: hasScene ? selectedScene.provider || "Copernicus Data Space" : "Copernicus Data Space",
          isKnown: true,
        },
        {
          label: "CDSE Product ID",
          value: cdseId ? cdseId : hasScene ? "Direct Ingestion" : "Awaiting scene",
          isKnown: Boolean(cdseId),
          isTruncated: true,
        },
        {
          label: "Spatial Footprint",
          value: hasScene && selectedScene.footprint ? "Polygon (EPSG:4326)" : "Awaiting scene",
          isKnown: Boolean(hasScene && selectedScene.footprint),
        },
        {
          label: "Processing State",
          value: processingState,
          isKnown: hasScene,
        },
      ],
    },
  ];

  // Storage & Integrity section for downloaded scenes
  if (hasScene && (formattedSize || localSha256 || verificationStatus)) {
    sections.push({
      title: "STORAGE & INTEGRITY",
      items: [
        {
          label: "File Size",
          value: formattedSize || "N/A",
          isKnown: Boolean(formattedSize),
        },
        {
          label: "SHA-256 Fingerprint",
          value: localSha256 ? `${localSha256.slice(0, 10)}...` : "N/A",
          isKnown: Boolean(localSha256),
          isTruncated: true,
        },
        {
          label: "Integrity Status",
          value: verificationStatus
            ? `${verificationStatus} (${verificationMethod || "VERIFIED"})`
            : "N/A",
          isKnown: Boolean(verificationStatus),
        },
      ],
    });
  }

  return (
    <aside className={styles.metadataCard} aria-label="SAR Scene Metadata">
      <div className={styles.cardHeader}>
        <div className={styles.headerLeft}>
          <span className={styles.headerBadge}>METADATA</span>
          <h4 className={styles.headerTitle}>Scene Parameters</h4>
        </div>
        <span className={hasScene ? styles.activePill : styles.standbyPill}>
          {isLoading ? "Loading..." : hasScene ? "Active" : "Standby"}
        </span>
      </div>

      <div className={styles.sectionsContainer}>
        {sections.map((section) => (
          <div key={section.title} className={styles.metaSection}>
            <div className={styles.sectionHeading}>{section.title}</div>
            <div className={styles.metaList}>
              {section.items.map((item) => (
                <div key={item.label} className={styles.metaItem}>
                  <span className={styles.metaKey}>{item.label}</span>
                  <span
                    className={`${styles.metaVal} ${
                      item.isKnown ? styles.metaValKnown : styles.metaValAwaiting
                    } ${item.isTruncated ? styles.metaValTruncated : ""}`}
                    title={typeof item.value === "string" ? item.value : ""}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Step 10B: Authenticated Download Action & Status */}
      {hasScene && (
        <div className={styles.downloadActionSection}>
          {isReadyForProcessing ? (
            <div className={styles.verifiedReadyBadge}>
              <span aria-hidden="true">✓</span>
              <span>READY_FOR_PROCESSING</span>
            </div>
          ) : isDownloadFailed ? (
            <>
              {downloadError && (
                <div className={styles.downloadErrorText} role="alert">
                  {downloadError}
                </div>
              )}
              <button
                type="button"
                className={`${styles.downloadBtn} ${styles.downloadRetryBtn}`}
                onClick={handleDownload}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <>
                    <span className={styles.spinner} aria-hidden="true" />
                    <span>Retrying CDSE Download...</span>
                  </>
                ) : (
                  <>
                    <span aria-hidden="true">↻</span>
                    <span>Retry CDSE Download</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              {downloadError && (
                <div className={styles.downloadErrorText} role="alert">
                  {downloadError}
                </div>
              )}
              <button
                type="button"
                className={styles.downloadBtn}
                onClick={handleDownload}
                disabled={isDownloading}
                title="Stream product binary from CDSE into local storage with integrity verification"
              >
                {isDownloading ? (
                  <>
                    <span className={styles.spinner} aria-hidden="true" />
                    <span>Downloading from CDSE...</span>
                  </>
                ) : (
                  <>
                    <span aria-hidden="true">⬇</span>
                    <span>Download Sentinel-1 Product</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      )}
    </aside>
  );
}
