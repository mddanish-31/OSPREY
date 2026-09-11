"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import "leaflet/dist/leaflet.css";
import styles from "./SARSceneViewer.module.css";

/**
 * SARSceneViewer
 *
 * Interactive Leaflet-powered Sentinel-1 C-band SAR scene analysis viewport.
 * - Renders real PostGIS-backed GeoJSON footprint polygons
 * - Auto-fits the viewport to the selected Sentinel-1 scene footprint or CDSE preview footprint
 * - Standard OpenStreetMap basemap with oceanic dark mode filter (zero API key)
 * - Zero fabricated satellite imagery, spill detections, or fake radar sweeps
 *
 * @param {object} props
 * @param {object|null} props.selectedScene - Active Sentinel-1 scene object with footprint
 * @param {Array<object>} [props.scenes=[]] - All loaded scenes for the active investigation
 * @param {object|null} props.selectedInvestigation - Parent investigation object
 * @param {Array<object>} [props.investigations=[]] - Available investigations
 * @param {object|null} [props.previewFootprint=null] - Candidate CDSE GeoJSON footprint to preview
 * @param {object|null} [props.previewProduct=null] - Candidate CDSE product metadata
 * @param {function} [props.onOpenSearch] - Callback to trigger the Search Sentinel-1 CDSE modal
 * @param {function} [props.onOpenCreate] - Callback to trigger the Add Scene modal
 * @param {function} [props.onSelectScene] - Callback when user clicks a footprint on the map
 */
export default function SARSceneViewer({
  selectedScene = null,
  scenes = [],
  selectedInvestigation = null,
  investigations = [],
  previewFootprint = null,
  previewProduct = null,
  onOpenSearch,
  onOpenCreate,
  onSelectScene,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersGroupRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [leafletLib, setLeafletLib] = useState(null);

  // Initialize Leaflet map instance on client mount
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    let isMounted = true;

    import("leaflet").then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      const defaultCenter = [1.3, 103.8];
      const defaultZoom = 6;

      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: defaultZoom,
        zoomControl: false,
        attributionControl: true,
      });

      // Standard OpenStreetMap tile layer with dark oceanic CSS filter (100% free, zero API key)
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      }).addTo(map);

      const layersGroup = L.featureGroup().addTo(map);

      mapInstanceRef.current = map;
      layersGroupRef.current = layersGroup;
      setLeafletLib(L);
      setMapReady(true);

      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 150);
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        layersGroupRef.current = null;
      }
    };
  }, []);

  // Update rendered GeoJSON footprint whenever selectedScene, scenes, or previewFootprint changes
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || !layersGroupRef.current || !leafletLib) {
      return;
    }

    const L = leafletLib;
    const map = mapInstanceRef.current;
    const layersGroup = layersGroupRef.current;

    layersGroup.clearLayers();

    let activeLayerBounds = null;

    // 1. Render investigation AOI outline if available
    if (selectedInvestigation?.geometry) {
      const aoiLayer = L.geoJSON(selectedInvestigation.geometry, {
        style: {
          color: "#f59e0b",
          weight: 1.75,
          dashArray: "6, 6",
          fillColor: "#f59e0b",
          fillOpacity: 0.04,
        },
      });
      aoiLayer.bindTooltip(
        `<strong>AOI: ${selectedInvestigation.name}</strong><br/><span style="font-size: 0.7em; color: #fbbf24;">Investigation Boundary</span>`,
        { sticky: true }
      );
      layersGroup.addLayer(aoiLayer);
    }

    // 2. Render subtle outlines for other loaded scenes in the same investigation
    scenes.forEach((sc) => {
      if (sc.footprint && sc.id !== selectedScene?.id) {
        const bgLayer = L.geoJSON(sc.footprint, {
          style: {
            color: "#64748b",
            weight: 1.5,
            dashArray: "4, 4",
            fillColor: "#38bdf8",
            fillOpacity: 0.05,
          },
        });

        bgLayer.bindTooltip(
          `<strong>${sc.scene_identifier}</strong><br/><span style="font-size: 0.7em; color: #94a3b8;">${sc.platform} | ${sc.product_type}</span>`,
          { sticky: true }
        );

        if (onSelectScene) {
          bgLayer.on("click", () => {
            onSelectScene(sc.id);
          });
        }

        layersGroup.addLayer(bgLayer);
      }
    });

    // 3. Render prominent active footprint polygon for selected Sentinel-1 scene
    if (selectedScene?.footprint) {
      const activeLayer = L.geoJSON(selectedScene.footprint, {
        style: {
          color: "#38bdf8",
          weight: 2,
          fillColor: "#0ea5e9",
          fillOpacity: 0.16,
        },
      });

      activeLayer.bindPopup(
        `<div>
          <h4 style="margin: 0 0 4px 0; color: #38bdf8; font-size: 0.82rem; word-break: break-all;">${selectedScene.scene_identifier}</h4>
          <p style="margin: 0 0 4px 0; color: #cbd5e1; font-size: 0.74rem;">Platform: ${selectedScene.platform} | Sensor: ${selectedScene.sensor}</p>
          <div style="font-family: monospace; font-size: 0.68rem; color: #7dd3fc;">Product: ${selectedScene.product_type} | Mode: ${selectedScene.polarization || "N/A"}</div>
        </div>`
      );

      layersGroup.addLayer(activeLayer);

      try {
        const bounds = activeLayer.getBounds();
        if (bounds.isValid()) {
          activeLayerBounds = bounds;
        }
      } catch {
        // Safe fallback
      }
    }

    // 4. Render candidate CDSE search footprint preview if active
    if (previewFootprint) {
      const previewLayer = L.geoJSON(previewFootprint, {
        style: {
          color: "#06b6d4",
          weight: 2.5,
          dashArray: "8, 4",
          fillColor: "#06b6d4",
          fillOpacity: 0.22,
        },
      });

      previewLayer.bindTooltip(
        `<strong>[CDSE Preview] ${previewProduct?.name || "Candidate Sentinel-1 Scene"}</strong><br/><span style="font-size: 0.7em; color: #67e8f9;">Authoritative Footprint</span>`,
        { permanent: true, direction: "center" }
      );

      layersGroup.addLayer(previewLayer);

      try {
        const pBounds = previewLayer.getBounds();
        if (pBounds.isValid()) {
          activeLayerBounds = pBounds;
        }
      } catch {
        // Safe fallback
      }
    }

    // 5. Fit map viewport
    if (activeLayerBounds) {
      map.fitBounds(activeLayerBounds, {
        padding: [50, 50],
        maxZoom: 14,
        animate: true,
      });
    } else if (layersGroup.getLayers().length > 0) {
      const allBounds = layersGroup.getBounds();
      if (allBounds.isValid()) {
        map.fitBounds(allBounds, {
          padding: [50, 50],
          maxZoom: 12,
        });
      }
    }
  }, [mapReady, leafletLib, selectedScene, scenes, selectedInvestigation, previewFootprint, previewProduct, onSelectScene]);

  // Map Navigation Actions
  const handleZoomIn = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  }, []);

  const handleResetView = useCallback(() => {
    if (mapInstanceRef.current && layersGroupRef.current) {
      const bounds = layersGroupRef.current.getBounds();
      if (bounds.isValid()) {
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
      } else {
        mapInstanceRef.current.setView([1.3, 103.8], 6);
      }
    }
  }, []);

  return (
    <div className={styles.viewerContainer} aria-label="SAR Scene Viewport">
      {/* Real Interactive Leaflet Basemap */}
      <div className={styles.mapWrapper}>
        <div ref={mapContainerRef} className={styles.mapContainer} />
      </div>

      {/* Subtle Graticule Reticles Overlay */}
      <div className={styles.sarGraticuleOverlay} aria-hidden="true">
        <div className={styles.reticleTopLeft}>┌</div>
        <div className={styles.reticleTopRight}>┐</div>
        <div className={styles.reticleBottomLeft}>└</div>
        <div className={styles.reticleBottomRight}>┘</div>
      </div>

      {/* Top Floating Controls Bar */}
      <div className={styles.controlsBar} aria-label="SAR Scene Controls">
        <div className={styles.controlsGroup}>
          <button
            type="button"
            className={styles.controlBtn}
            onClick={handleZoomIn}
            title="Zoom in"
            aria-label="Zoom In"
          >
            <span aria-hidden="true">+</span>
          </button>
          <button
            type="button"
            className={styles.controlBtn}
            onClick={handleZoomOut}
            title="Zoom out"
            aria-label="Zoom Out"
          >
            <span aria-hidden="true">−</span>
          </button>
          <div className={styles.controlDivider} aria-hidden="true" />
          <button
            type="button"
            className={styles.controlBtn}
            onClick={handleResetView}
            title="Reset footprint view"
            aria-label="Reset View"
          >
            <span aria-hidden="true">⟲</span>
          </button>
        </div>

        <div className={styles.controlsNotice} title="Observation State">
          <span
            className={`${styles.noticeDot} ${
              selectedScene ? styles.noticeDotActive : ""
            }`}
            aria-hidden="true"
          />
          <span className={styles.noticeText}>
            {previewFootprint
              ? `CDSE Preview: ${previewProduct?.product_type || "Sentinel-1"}`
              : selectedScene
              ? `${selectedScene.platform} | ${selectedScene.sensor} | ${selectedScene.product_type}`
              : "Sentinel-1 Standby"}
          </span>
        </div>
      </div>

      {/* Center Compact Empty State Card (Keeps map visible behind) */}
      {!selectedScene && !previewFootprint && (
        <div className={styles.emptyStateCard}>
          <div className={styles.sensorIconRing}>
            <svg
              width="22"
              height="22"
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

          <div className={styles.emptyTextGroup}>
            <h3 className={styles.emptyHeading}>
              {selectedInvestigation
                ? "No Sentinel-1 Scenes Loaded"
                : "No Investigation Selected"}
            </h3>

            <p className={styles.emptyDescription}>
              {selectedInvestigation
                ? "Discover Sentinel-1 observations from Copernicus Data Space (CDSE) to begin SAR analysis."
                : "Select an investigation before searching for Sentinel-1 scenes."}
            </p>
          </div>

          {selectedInvestigation && onOpenSearch && (
            <button
              type="button"
              className={styles.addSceneBtn}
              onClick={onOpenSearch}
            >
              <span aria-hidden="true">⌕</span>
              <span>Search Sentinel-1 (CDSE)</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
