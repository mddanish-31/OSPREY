"use client";

import { useState, useEffect } from "react";
import { createInvestigation } from "@/lib/api/investigations";
import styles from "./CreateInvestigationModal.module.css";

/**
 * Validates and normalizes GeoJSON polygon input on the client.
 */
function parseAndValidatePolygon(input) {
  if (!input || !input.trim()) {
    return null;
  }

  let parsed;
  try {
    parsed = JSON.parse(input);
  } catch (err) {
    throw new Error(`Invalid JSON syntax in geometry: ${err.message}`);
  }

  let coordinates;
  if (Array.isArray(parsed)) {
    // User pasted coordinate rings array
    coordinates = parsed;
  } else if (parsed && typeof parsed === "object") {
    if (parsed.type && parsed.type !== "Polygon") {
      throw new Error(`Geometry type must be 'Polygon', got '${parsed.type}'`);
    }
    coordinates = parsed.coordinates;
  } else {
    throw new Error("Geometry must be a GeoJSON Polygon object or coordinates array");
  }

  if (!Array.isArray(coordinates) || coordinates.length === 0) {
    throw new Error("Polygon must contain at least one linear ring of coordinates");
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
 * CreateInvestigationModal
 *
 * Minimal, accessible dialog to create a real PostGIS-backed investigation.
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Whether modal is visible
 * @param {function} props.onClose - Callback to close modal
 * @param {function} props.onCreated - Callback when investigation is successfully created
 */
export default function CreateInvestigationModal({ isOpen, onClose, onCreated }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [geometryText, setGeometryText] = useState("");
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

    const trimmedName = name.trim();
    if (!trimmedName) {
      setErrorMessage("Investigation name is required");
      return;
    }

    let parsedGeometry = null;
    try {
      parsedGeometry = parseAndValidatePolygon(geometryText);
    } catch (err) {
      setErrorMessage(err.message);
      return;
    }

    setIsSubmitting(true);

    try {
      const created = await createInvestigation({
        name: trimmedName,
        description: description.trim() || null,
        status: "active",
        geometry: parsedGeometry,
      });

      // Clear form
      setName("");
      setDescription("");
      setGeometryText("");
      onCreated(created);
      onClose();
    } catch (err) {
      setErrorMessage(err.message || "Failed to create investigation");
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
      aria-labelledby="create-investigation-title"
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
              <span>Investigation Service</span>
            </div>
            <h3 id="create-investigation-title" className={styles.modalTitle}>
              Create Investigation
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
            {/* Error Banner */}
            {errorMessage && (
              <div className={styles.errorBanner} role="alert">
                <span aria-hidden="true">⚠</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Section 1: Identity */}
            <div className={styles.sectionHeader}>
              <span className={styles.sectionEyebrow}>IDENTITY</span>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="inv-name" className={styles.fieldLabel}>
                Investigation Name *
              </label>
              <input
                id="inv-name"
                type="text"
                className={styles.textInput}
                placeholder="e.g. Malacca Strait Ingress Investigation"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className={styles.formGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="inv-desc" className={styles.fieldLabel}>
                  Description
                </label>
                <span className={styles.fieldOptional}>Optional</span>
              </div>
              <textarea
                id="inv-desc"
                className={styles.textArea}
                placeholder="Operational background, mission context, or notes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />
            </div>

            {/* Section 2: Area of Interest */}
            <div className={styles.sectionHeader}>
              <span className={styles.sectionEyebrow}>AREA OF INTEREST</span>
            </div>

            <div className={styles.formGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="inv-geometry" className={styles.fieldLabel}>
                  GeoJSON Polygon Boundary (SRID 4326)
                </label>
                <span className={styles.fieldOptional}>Optional</span>
              </div>
              <textarea
                id="inv-geometry"
                className={styles.geometryTextarea}
                placeholder='{"type": "Polygon", "coordinates": [[[lon, lat], [lon, lat], ...]]}'
                value={geometryText}
                onChange={(e) => setGeometryText(e.target.value)}
                spellCheck={false}
                rows={4}
              />
              <span className={styles.fieldHelp}>
                Standard GeoJSON Polygon with WGS84 coordinates [longitude, latitude]. The linear ring must be closed.
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
                  <span>Persisting to PostGIS...</span>
                </>
              ) : (
                <>
                  <span aria-hidden="true">＋</span>
                  <span>Create Investigation</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
