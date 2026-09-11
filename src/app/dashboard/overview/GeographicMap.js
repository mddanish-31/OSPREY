"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import styles from "./GeographicMap.module.css";

/**
 * GeographicMap
 *
 * Real Leaflet-powered Geographic Investigation Map Canvas.
 * - Standard OpenStreetMap tile layer with dark oceanic CSS filter (zero API key)
 * - Renders real PostGIS-backed GeoJSON Polygons for investigations
 * - Automatically fits viewport to the active investigation AOI
 * - Zero fabricated data (no fake sweeps, vessels, or drift vectors)
 *
 * @param {object} props
 * @param {object|null} props.selectedInvestigation - Active investigation object with geometry
 * @param {Array<object>} [props.investigations=[]] - List of all loaded investigations
 * @param {function} [props.onSelectInvestigation] - Callback when user clicks an AOI polygon
 */
export default function GeographicMap({
  selectedInvestigation = null,
  investigations = [],
  onSelectInvestigation,
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

      // Fix default Leaflet icon paths if markers are used
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      // Default maritime center: Global shipping hub / Malacca Strait coordinates
      const defaultCenter = [1.3, 103.8];
      const defaultZoom = 6;

      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: defaultZoom,
        zoomControl: false,
        attributionControl: true,
      });

      // Standard OpenStreetMap tile layer (100% free, zero API key required)
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Custom Zoom Control top-right
      L.control.zoom({ position: "topright" }).addTo(map);

      // Feature group to hold active geometry layers
      const layersGroup = L.featureGroup().addTo(map);

      mapInstanceRef.current = map;
      layersGroupRef.current = layersGroup;
      setLeafletLib(L);
      setMapReady(true);

      // Trigger resize invalidation to ensure full tile rendering
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

  // Update rendered GeoJSON polygons whenever selectedInvestigation or investigations change
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || !layersGroupRef.current || !leafletLib) {
      return;
    }

    const L = leafletLib;
    const map = mapInstanceRef.current;
    const layersGroup = layersGroupRef.current;

    // Clear previous vector layers
    layersGroup.clearLayers();

    let activeLayerBounds = null;

    // 1. Render subtle outlines for all other loaded investigations with geometry
    investigations.forEach((inv) => {
      if (inv.geometry && inv.id !== selectedInvestigation?.id) {
        const backgroundLayer = L.geoJSON(inv.geometry, {
          style: {
            color: "#64748b",
            weight: 1.5,
            dashArray: "4, 4",
            fillColor: "#38bdf8",
            fillOpacity: 0.05,
          },
        });

        backgroundLayer.bindTooltip(
          `<strong>${inv.name}</strong><br/><span style="font-size: 0.7em; color: #94a3b8;">Status: ${inv.status}</span>`,
          { sticky: true }
        );

        if (onSelectInvestigation) {
          backgroundLayer.on("click", () => {
            onSelectInvestigation(inv.id);
          });
        }

        layersGroup.addLayer(backgroundLayer);
      }
    });

    // 2. Render prominent active polygon for selected investigation
    if (selectedInvestigation?.geometry) {
      const activeLayer = L.geoJSON(selectedInvestigation.geometry, {
        style: {
          color: "#38bdf8",
          weight: 2,
          fillColor: "#0ea5e9",
          fillOpacity: 0.18,
        },
      });

      activeLayer.bindPopup(
        `<div>
          <h4 style="margin: 0 0 4px 0; color: #38bdf8; font-size: 0.85rem; font-weight: 700;">${selectedInvestigation.name}</h4>
          <p style="margin: 0 0 4px 0; color: #cbd5e1; font-size: 0.75rem;">${selectedInvestigation.description || "No description provided."}</p>
          <div style="font-family: monospace; font-size: 0.7rem; color: #7dd3fc;">Status: ${selectedInvestigation.status}</div>
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

    // 3. Fit map viewport to the active investigation's bounds
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
  }, [mapReady, leafletLib, selectedInvestigation, investigations, onSelectInvestigation]);

  // Determine concise status string
  const statusLabel = selectedInvestigation
    ? selectedInvestigation.geometry
      ? `AOI Active: ${selectedInvestigation.name}`
      : `Investigation: ${selectedInvestigation.name}`
    : "Standby";

  return (
    <div className={styles.mapWrapper} aria-label="Interactive Geographic Investigation Map">
      <div ref={mapContainerRef} className={styles.mapContainer} />

      {/* Subtle Floating Map Status Indicator */}
      <div className={styles.mapInfoBadge} aria-live="polite">
        <span
          className={`${styles.infoDot} ${
            selectedInvestigation?.geometry ? styles.infoDotActive : ""
          }`}
          aria-hidden="true"
        />
        <span className={styles.infoText}>{statusLabel}</span>
      </div>
    </div>
  );
}
