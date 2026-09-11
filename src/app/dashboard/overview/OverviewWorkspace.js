"use client";

import { useState, useEffect, useCallback } from "react";
import { listInvestigations, getInvestigation } from "@/lib/api/investigations";
import GeographicMap from "./GeographicMap";
import InvestigationToolbar from "./InvestigationToolbar";
import CreateInvestigationModal from "./CreateInvestigationModal";
import styles from "./OverviewWorkspace.module.css";

/**
 * OverviewWorkspace
 *
 * Primary Geographic Investigation Picture and Vertical Slice Canvas.
 * Connects the frontend user experience end-to-end to the FastAPI PostGIS Investigation service:
 * - Fetches real investigation list from GET /api/v1/investigations
 * - Creates real PostGIS-backed investigations via POST /api/v1/investigations
 * - Selects and renders real GeoJSON Polygons on an interactive Leaflet map
 * - Maintains 100% truthful context states with zero fabricated scientific data
 */
export default function OverviewWorkspace({
  investigations: externalInvestigations,
  selectedInvestigation: externalSelectedInvestigation,
  selectedId: externalSelectedId,
  isLoading: externalIsLoading,
  error: externalError,
  onSelectInvestigation: externalOnSelectInvestigation,
  onRefreshInvestigations: externalOnRefreshInvestigations,
}) {
  const isControlled = externalInvestigations !== undefined;

  const [internalInvestigations, setInternalInvestigations] = useState([]);
  const [internalSelectedId, setInternalSelectedId] = useState(null);
  const [internalSelectedInvestigation, setInternalSelectedInvestigation] = useState(null);
  const [internalIsLoading, setInternalIsLoading] = useState(true);
  const [internalError, setInternalError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Initial load on mount if uncontrolled
  useEffect(() => {
    if (isControlled) return;

    let isMounted = true;

    listInvestigations({ page: 1, pageSize: 50 })
      .then((response) => {
        if (!isMounted) return;
        const items = response?.items || [];
        setInternalInvestigations(items);
        if (items.length > 0) {
          setInternalSelectedId(items[0].id);
          setInternalSelectedInvestigation(items[0]);
        } else {
          setInternalSelectedId(null);
          setInternalSelectedInvestigation(null);
        }
        setInternalError(null);
      })
      .catch((err) => {
        if (!isMounted) return;
        setInternalError(err.message || "OSPREY backend unavailable. Start the FastAPI service to load investigation data.");
      })
      .finally(() => {
        if (isMounted) {
          setInternalIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isControlled]);

  // Refresh investigations list on user action or after creation
  const refreshInvestigations = useCallback(async (autoSelectId = null) => {
    if (isControlled && externalOnRefreshInvestigations) {
      return externalOnRefreshInvestigations(autoSelectId);
    }

    setInternalIsLoading(true);
    setInternalError(null);

    try {
      const response = await listInvestigations({ page: 1, pageSize: 50 });
      const items = response?.items || [];
      setInternalInvestigations(items);

      if (items.length > 0) {
        const targetId = autoSelectId || (items.some((i) => i.id === internalSelectedId) ? internalSelectedId : items[0].id);
        setInternalSelectedId(targetId);

        const activeObj = items.find((i) => i.id === targetId) || items[0];
        setInternalSelectedInvestigation(activeObj);
      } else {
        setInternalSelectedId(null);
        setInternalSelectedInvestigation(null);
      }
    } catch (err) {
      setInternalError(err.message || "OSPREY backend unavailable. Start the FastAPI service to load investigation data.");
    } finally {
      setInternalIsLoading(false);
    }
  }, [isControlled, externalOnRefreshInvestigations, internalSelectedId]);

  // Handle selecting an investigation from toolbar or map click
  const handleSelectInvestigation = useCallback(async (id) => {
    if (isControlled && externalOnSelectInvestigation) {
      return externalOnSelectInvestigation(id);
    }

    if (!id) {
      setInternalSelectedId(null);
      setInternalSelectedInvestigation(null);
      return;
    }

    setInternalSelectedId(id);
    const existing = internalInvestigations.find((i) => i.id === id);
    if (existing) {
      setInternalSelectedInvestigation(existing);
    }

    try {
      const fullDetails = await getInvestigation(id);
      if (fullDetails) {
        setInternalSelectedInvestigation(fullDetails);
      }
    } catch {
      // Fallback to existing list item
    }
  }, [isControlled, externalOnSelectInvestigation, internalInvestigations]);

  // Handle successful creation of a new investigation
  const handleCreatedInvestigation = useCallback((created) => {
    refreshInvestigations(created.id);
  }, [refreshInvestigations]);

  const investigations = isControlled ? externalInvestigations : internalInvestigations;
  const selectedId = isControlled ? externalSelectedId : internalSelectedId;
  const selectedInvestigation = isControlled ? externalSelectedInvestigation : internalSelectedInvestigation;
  const isLoading = isControlled ? externalIsLoading : internalIsLoading;
  const error = isControlled ? externalError : internalError;

  return (
    <div className={styles.overviewContainer}>
      {/* Top Workspace Context Header Bar */}
      <div className={styles.workspaceHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.workspaceBadge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            <span className={styles.badgeCategory}>INVESTIGATION OVERVIEW</span>
          </div>

          <h2 className={styles.workspaceTitle}>
            {selectedInvestigation
              ? selectedInvestigation.name
              : "Geographic Investigation Picture"}
          </h2>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.sessionStatusPill}>
            <span
              className={`${styles.sessionBeaconDot} ${
                error
                  ? styles.sessionBeaconError
                  : selectedInvestigation
                  ? styles.sessionBeaconActive
                  : ""
              }`}
              aria-hidden="true"
            />
            <span className={styles.sessionStatusText}>
              {isLoading
                ? "Connecting to API..."
                : error
                ? "API Disconnected"
                : selectedInvestigation
                ? `Active (${selectedInvestigation.status})`
                : "Standby"}
            </span>
          </div>

          <div className={styles.ingestionReadyChip}>
            <span>
              {selectedInvestigation?.geometry
                ? "State: AOI Active"
                : selectedInvestigation
                ? "State: Loaded"
                : "State: Standby"}
            </span>
          </div>
        </div>
      </div>

      {/* Investigation Toolbar & Selector */}
      <InvestigationToolbar
        investigations={investigations}
        selectedId={selectedId}
        onSelectInvestigation={handleSelectInvestigation}
        onOpenCreate={() => setIsCreateModalOpen(true)}
        onRefresh={() => refreshInvestigations(selectedId)}
        isLoading={isLoading}
      />

      {/* Backend / Network Error Banner (Compact, calm, truthful) */}
      {error && (
        <div className={styles.errorAlertBar} role="alert">
          <div className={styles.errorTextGroup}>
            <span className={styles.errorIcon} aria-hidden="true">⚠</span>
            <div>
              <strong className={styles.errorTitle}>OSPREY backend unavailable</strong>
              <p className={styles.errorSubtitle}>Start the FastAPI service to load investigation data.</p>
            </div>
          </div>
          <button
            type="button"
            className={styles.errorRetryBtn}
            onClick={() => refreshInvestigations(selectedId)}
          >
            Retry
          </button>
        </div>
      )}

      {/* ===================================================
          Central Primary Investigation Map / Canvas Viewport
          =================================================== */}
      <div className={styles.mapViewport} aria-label="Geographic Investigation Map Canvas">
        {/* Subtle Geographic Reticles */}
        <div className={styles.geoGridOverlay} aria-hidden="true">
          <div className={styles.reticleTopLeft}>┌</div>
          <div className={styles.reticleTopRight}>┐</div>
          <div className={styles.reticleBottomLeft}>└</div>
          <div className={styles.reticleBottomRight}>┘</div>
        </div>

        {/* Interactive Real Leaflet Map */}
        <GeographicMap
          selectedInvestigation={selectedInvestigation}
          investigations={investigations}
          onSelectInvestigation={handleSelectInvestigation}
        />

        {/* Compact Centered Empty State Glass Panel (Keeps map visible behind) */}
        {!isLoading && investigations.length === 0 && !error && (
          <div className={styles.mapPromptContainer}>
            <div className={styles.mapPromptRing}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={styles.mapPromptIcon}
                aria-hidden="true"
              >
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                <line x1="9" y1="3" x2="9" y2="18" />
                <line x1="15" y1="6" x2="15" y2="21" />
              </svg>
            </div>

            <div className={styles.mapPromptTextGroup}>
              <h3 className={styles.mapPromptHeading}>No Investigation Selected</h3>
              <p className={styles.mapPromptText}>
                Create or select an investigation to populate the geographic canvas.
              </p>
            </div>

            <button
              type="button"
              className={styles.createPromptBtn}
              onClick={() => setIsCreateModalOpen(true)}
            >
              <span aria-hidden="true">＋</span>
              <span>Create Investigation</span>
            </button>
          </div>
        )}

        {/* ===================================================
            Floating Contextual Glass Cards (Bottom Area)
            =================================================== */}
        <div className={styles.floatingCardsRow} aria-label="Investigation Context Layers">
          {/* Card 1: Spill Object */}
          <div className={styles.contextCard}>
            <div className={styles.cardTop}>
              <span className={styles.cardBadge}>SATELLITE</span>
              <span className={styles.cardStatusAwaiting}>
                {selectedInvestigation ? "Awaiting SAR Scene" : "Awaiting Investigation"}
              </span>
            </div>
            <h4 className={styles.cardTitle}>Spill Surface Object</h4>
            <div className={styles.cardMetaGrid}>
              <div className={styles.cardMetaItem}>
                <span className={styles.metaKey}>Geometry</span>
                <span className={styles.metaVal}>SAR scene required</span>
              </div>
              <div className={styles.cardMetaItem}>
                <span className={styles.metaKey}>Mask Status</span>
                <span className={styles.metaVal}>Awaiting scene ingestion</span>
              </div>
            </div>
          </div>

          {/* Card 2: Probable Origin */}
          <div className={styles.contextCard}>
            <div className={styles.cardTop}>
              <span className={styles.cardBadge}>DRIFT &amp; OCEAN</span>
              <span className={styles.cardStatusAwaiting}>
                {selectedInvestigation ? "Awaiting spill geometry" : "Awaiting Investigation"}
              </span>
            </div>
            <h4 className={styles.cardTitle}>Probable Origin Zone</h4>
            <div className={styles.cardMetaGrid}>
              <div className={styles.cardMetaItem}>
                <span className={styles.metaKey}>Trajectory</span>
                <span className={styles.metaVal}>Standby</span>
              </div>
              <div className={styles.cardMetaItem}>
                <span className={styles.metaKey}>Forcing</span>
                <span className={styles.metaVal}>CMEMS / ERA5 Standby</span>
              </div>
            </div>
          </div>

          {/* Card 3: Correlated Vessels */}
          <div className={styles.contextCard}>
            <div className={styles.cardTop}>
              <span className={styles.cardBadge}>VESSELS</span>
              <span className={styles.cardStatusAwaiting}>
                {selectedInvestigation ? "Awaiting AIS candidates" : "No investigation loaded"}
              </span>
            </div>
            <h4 className={styles.cardTitle}>Correlated Vessels</h4>
            <div className={styles.cardMetaGrid}>
              <div className={styles.cardMetaItem}>
                <span className={styles.metaKey}>AIS Candidates</span>
                <span className={styles.metaVal}>Standby</span>
              </div>
              <div className={styles.cardMetaItem}>
                <span className={styles.metaKey}>Dark Vessels</span>
                <span className={styles.metaVal}>Cross-check standby</span>
              </div>
            </div>
          </div>

          {/* Card 4: Environmental Risk */}
          <div className={styles.contextCard}>
            <div className={styles.cardTop}>
              <span className={styles.cardBadge}>ENVIRONMENT</span>
              <span className={styles.cardStatusAwaiting}>
                {selectedInvestigation ? "Awaiting spill projection" : "Awaiting Investigation"}
              </span>
            </div>
            <h4 className={styles.cardTitle}>Environmental Exposure</h4>
            <div className={styles.cardMetaGrid}>
              <div className={styles.cardMetaItem}>
                <span className={styles.metaKey}>Coastline</span>
                <span className={styles.metaVal}>Exposure standby</span>
              </div>
              <div className={styles.cardMetaItem}>
                <span className={styles.metaKey}>Sensitive Habitats</span>
                <span className={styles.metaVal}>Reserve exposure standby</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Dialog for Investigation Creation */}
      <CreateInvestigationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={handleCreatedInvestigation}
      />
    </div>
  );
}
