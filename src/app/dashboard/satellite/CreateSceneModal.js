"use client";

import { useState, useEffect } from "react";
import { createSatelliteScene } from "@/lib/api/investigations";
import styles from "./CreateSceneModal.module.css";

function validateFootprintPolygon(input) {
  if (!input || !input.trim()) {
    throw new Error("Sentinel-1 footprint GeoJSON Polygon is required");
  }

  let parsed;
  try {
    parsed = JSON.parse(input);
  } catch (err) {
    throw new Error(`Invalid JSON syntax in footprint: ${err.message}`);
  }

  let coordinates;
  if (Array.isArray(parsed)) {
    coordinates = parsed;
  } else if (parsed && typeof parsed === "object") {
    if (parsed.type && parsed.type !== "Polygon") {
      throw new Error(`Footprint geometry type must be 'Polygon', got '${parsed.type}'`);
    }
    coordinates = parsed.coordinates;
  } else {
    throw new Error("Footprint must be a GeoJSON Polygon object or coordinates array");
  }

  if (!Array.isArray(coordinates) || coordinates.length === 0) {
    throw new Error("Footprint Polygon must contain at least one linear ring of coordinates");
  }

  for (let r = 0; r < coordinates.length; r++) {
    const ring = coordinates[r];
    if (!Array.isArray(ring) || ring.length < 4) {
      throw new Error(`Linear ring ${r + 1} must contain at least 4 coordinate positions [lon, lat]`);
    }

    const first = ring[0];
    const last = ring[ring.length - 1];
    if (!Array.isArray(first) || !Array.isArray(last) || first.length < 2 || last.length < 2) {
      throw new Error(`Coordinates in linear ring ${r + 1} must be [longitude, latitude] pairs`);
    }

    if (first[0] !== last[0] || first[1] !== last[1]) {
      throw new Error(
        `Linear ring ${r + 1} is not closed: first point [${first[0]}, ${first[1]}] != last point [${last[0]}, ${last[1]}]`
      );
    }

    for (let p = 0; p < ring.length; p++) {
      const pt = ring[p];
      if (!Array.isArray(pt) || pt.length < 2 || typeof pt[0] !== "number" || typeof pt[1] !== "number") {
        throw new Error(`Invalid coordinate position at ring ${r + 1}, index ${p + 1}`);
      }
      const [lon, lat] = pt;
      if (lon < -180 || lon > 180) {
        throw new Error(`Longitude must be between -180 and 180 degrees (got ${lon})`);
      }
      if (lat < -90 || lat > 90) {
        throw new Error(`Latitude must be between -90 and 90 degrees (got ${lat})`);
      }
    }
  }

  return {
    type: "Polygon",
    coordinates,
  };
}

/**
 * CreateSceneModal
 *
 * Minimal, accessible dialog to ingest a real Sentinel-1 SAR scene into an investigation.
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Whether modal is visible
 * @param {function} props.onClose - Callback to close modal
 * @param {function} props.onCreated - Callback when scene is successfully created
 * @param {string} props.investigationId - UUID of the parent investigation
 * @param {string} [props.investigationName] - Title of the parent investigation
 */
export default function CreateSceneModal({
  isOpen,
  onClose,
  onCreated,
  investigationId,
  investigationName = "Active Investigation",
}) {
  const [sceneIdentifier, setSceneIdentifier] = useState("");
  const [platform, setPlatform] = useState("Sentinel-1A");
  const [sensor, setSensor] = useState("C-SAR");
  const [productType, setProductType] = useState("GRD");
  const [acquisitionTime, setAcquisitionTime] = useState("");
  const [orbitDirection, setOrbitDirection] = useState("ASCENDING");
  const [relativeOrbit, setRelativeOrbit] = useState("");
  const [polarization, setPolarization] = useState("VV+VH");
  const [footprintText, setFootprintText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!investigationId) {
      setErrorMessage("No investigation selected. Select an investigation first.");
      return;
    }

    const trimmedIdentifier = sceneIdentifier.trim();
    if (!trimmedIdentifier) {
      setErrorMessage("Scene identifier is required");
      return;
    }

    const trimmedAcquisition = acquisitionTime.trim();
    if (!trimmedAcquisition) {
      setErrorMessage("Observation acquisition time is required");
      return;
    }

    let parsedFootprint = null;
    try {
      parsedFootprint = validateFootprintPolygon(footprintText);
    } catch (err) {
      setErrorMessage(err.message);
      return;
    }

    setIsSubmitting(true);

    try {
      // Parse acquisition ISO date
      const acquisitionDate = new Date(trimmedAcquisition);
      if (isNaN(acquisitionDate.getTime())) {
        throw new Error("Invalid acquisition datetime format. Use ISO format (e.g. 2026-09-11T03:45:00Z)");
      }

      const payload = {
        scene_identifier: trimmedIdentifier,
        provider: "Copernicus",
        platform,
        sensor: sensor.trim() || "C-SAR",
        product_type: productType,
        acquisition_time: acquisitionDate.toISOString(),
        orbit_direction: orbitDirection || null,
        relative_orbit: relativeOrbit ? parseInt(relativeOrbit, 10) : null,
        polarization: polarization || null,
        footprint: parsedFootprint,
      };

      const created = await createSatelliteScene(investigationId, payload);

      // Clear form
      setSceneIdentifier("");
      setAcquisitionTime("");
      setRelativeOrbit("");
      setFootprintText("");
      onCreated(created);
      onClose();
    } catch (err) {
      setErrorMessage(err.message || "Failed to ingest Sentinel-1 scene");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={styles.modalBackdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-scene-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.modalCard}>
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerTitleGroup}>
            <div className={styles.headerBadge}>
              <span aria-hidden="true">✦</span>
              <span>Investigation: {investigationName}</span>
            </div>
            <h3 id="create-scene-title" className={styles.modalTitle}>
              Add Sentinel-1 SAR Scene
            </h3>
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            {/* Error Alert Banner */}
            {errorMessage && (
              <div className={styles.errorBanner} role="alert">
                <span aria-hidden="true">⚠</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Section 1: Scene Identity */}
            <div className={styles.sectionHeader}>
              <span className={styles.sectionEyebrow}>SCENE IDENTITY</span>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="scene-id-input" className={styles.fieldLabel}>
                Sentinel-1 Scene Identifier *
              </label>
              <input
                id="scene-id-input"
                type="text"
                className={styles.textInput}
                placeholder="e.g. S1A_IW_GRDH_1SDV_20260911T034500_051234_067890_C3D4"
                value={sceneIdentifier}
                onChange={(e) => setSceneIdentifier(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className={styles.gridTwoCols}>
              <div className={styles.formGroup}>
                <label htmlFor="acquisition-time-input" className={styles.fieldLabel}>
                  Acquisition Timestamp (UTC) *
                </label>
                <input
                  id="acquisition-time-input"
                  type="text"
                  className={styles.textInput}
                  placeholder="e.g. 2026-09-11T03:45:00Z"
                  value={acquisitionTime}
                  onChange={(e) => setAcquisitionTime(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="platform-select" className={styles.fieldLabel}>
                  Platform *
                </label>
                <select
                  id="platform-select"
                  className={styles.selectInput}
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                >
                  <option value="Sentinel-1A">Sentinel-1A</option>
                  <option value="Sentinel-1B">Sentinel-1B</option>
                  <option value="Sentinel-1C">Sentinel-1C</option>
                </select>
              </div>
            </div>

            {/* Section 2: Sensor & Product */}
            <div className={styles.sectionHeader}>
              <span className={styles.sectionEyebrow}>SENSOR &amp; PRODUCT</span>
            </div>

            <div className={styles.gridTwoCols}>
              <div className={styles.formGroup}>
                <label htmlFor="product-select" className={styles.fieldLabel}>
                  Product Type *
                </label>
                <select
                  id="product-select"
                  className={styles.selectInput}
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                >
                  <option value="GRD">GRD (Ground Range Detected)</option>
                  <option value="SLC">SLC (Single Look Complex)</option>
                  <option value="OCN">OCN (Ocean Product)</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="polarization-select" className={styles.fieldLabel}>
                  Polarization
                </label>
                <select
                  id="polarization-select"
                  className={styles.selectInput}
                  value={polarization}
                  onChange={(e) => setPolarization(e.target.value)}
                >
                  <option value="VV+VH">VV + VH (Dual Polarization)</option>
                  <option value="VV">VV (Single Polarization)</option>
                  <option value="HH+HV">HH + HV (Dual Polarization)</option>
                  <option value="HH">HH (Single Polarization)</option>
                </select>
              </div>
            </div>

            <div className={styles.gridTwoCols}>
              <div className={styles.formGroup}>
                <label htmlFor="orbit-dir-select" className={styles.fieldLabel}>
                  Orbit Direction
                </label>
                <select
                  id="orbit-dir-select"
                  className={styles.selectInput}
                  value={orbitDirection}
                  onChange={(e) => setOrbitDirection(e.target.value)}
                >
                  <option value="ASCENDING">ASCENDING</option>
                  <option value="DESCENDING">DESCENDING</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <div className={styles.labelRow}>
                  <label htmlFor="relative-orbit-input" className={styles.fieldLabel}>
                    Relative Orbit / Track
                  </label>
                  <span className={styles.fieldOptional}>Optional</span>
                </div>
                <input
                  id="relative-orbit-input"
                  type="number"
                  min="1"
                  max="175"
                  className={styles.textInput}
                  placeholder="e.g. 45"
                  value={relativeOrbit}
                  onChange={(e) => setRelativeOrbit(e.target.value)}
                />
              </div>
            </div>

            {/* Section 3: Spatial Footprint */}
            <div className={styles.sectionHeader}>
              <span className={styles.sectionEyebrow}>SPATIAL FOOTPRINT</span>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="footprint-input" className={styles.fieldLabel}>
                Footprint Polygon (GeoJSON) *
              </label>
              <textarea
                id="footprint-input"
                className={styles.geometryTextarea}
                placeholder='{"type": "Polygon", "coordinates": [[[lon, lat], [lon, lat], ...]]}'
                value={footprintText}
                onChange={(e) => setFootprintText(e.target.value)}
                required
                spellCheck={false}
                rows={3}
              />
              <span className={styles.fieldHelp}>
                Enter the spatial footprint coordinates in standard GeoJSON format [longitude, latitude]. Linear ring must be closed.
              </span>
            </div>
          </div>

          {/* Modal Footer */}
          <div className={styles.modalFooter}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className={styles.spinner} aria-hidden="true" />
                  <span>Persisting Scene...</span>
                </>
              ) : (
                <>
                  <span aria-hidden="true">＋</span>
                  <span>Ingest Sentinel-1 Scene</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
