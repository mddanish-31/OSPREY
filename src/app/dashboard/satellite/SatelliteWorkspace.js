"use client";

import { useState, useEffect, useCallback } from "react";
import { listSatelliteScenes, getSatelliteScene } from "@/lib/api/investigations";
import SARSceneViewer from "./SARSceneViewer";
import SARSceneMetadata from "./SARSceneMetadata";
import SatellitePipeline from "./SatellitePipeline";
import SpillDetectionWorkspace from "./SpillDetectionWorkspace";
import SpillCharacterizationWorkspace from "./SpillCharacterizationWorkspace";
import Sentinel2CrossCheckWorkspace from "./Sentinel2CrossCheckWorkspace";
import SearchSentinel1Modal from "./SearchSentinel1Modal";
import CreateSceneModal from "./CreateSceneModal";
import { WORKSPACES } from "../dashboardConfig";
import styles from "./SatelliteWorkspace.module.css";

/**
 * SatelliteWorkspace
 *
 * Satellite Intelligence workspace orchestrating:
 * - SAR Scene (Sentinel-1 C-band SAR scene analysis viewport, metadata, CDSE discovery & import)
 * - AI Spill Detection (Candidate anomaly segmentation, 5-stage pipeline, model/result panels)
 * - Spill Characterization (Spatial geometry viewer, metrics, shape descriptors)
 * - Sentinel-2 Cross-check (Optical observation viewport, MSI band context)
 *
 * @param {object} props
 * @param {string} [props.activeCapability="sar-scene"] - Currently active sub-capability ID
 * @param {object|null} [props.selectedInvestigation=null] - Selected Investigation object
 * @param {string|null} [props.selectedInvestigationId=null] - Selected Investigation ID
 * @param {Array<object>} [props.investigations=[]] - Available investigations
 * @param {function} [props.onSelectInvestigation] - Callback to change selected investigation
 */
export default function SatelliteWorkspace({
  activeCapability = "sar-scene",
  selectedInvestigation = null,
  selectedInvestigationId = null,
  investigations = [],
  onSelectInvestigation,
}) {
  const satelliteWorkspace = WORKSPACES.find((w) => w.id === "satellite");
  const currentCapability =
    satelliteWorkspace?.capabilities.find((c) => c.id === activeCapability) ||
    satelliteWorkspace?.capabilities[0];

  // SAR Scene State
  const [scenes, setScenes] = useState([]);
  const [selectedSceneId, setSelectedSceneId] = useState(null);
  const [selectedScene, setSelectedScene] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modals state
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Candidate CDSE preview footprint
  const [previewFootprint, setPreviewFootprint] = useState(null);
  const [previewProduct, setPreviewProduct] = useState(null);

  // Fetch scenes when selectedInvestigationId changes
  useEffect(() => {
    if (!selectedInvestigationId) {
      return;
    }

    let isMounted = true;
    const fetchScenes = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await listSatelliteScenes(selectedInvestigationId, { page: 1, pageSize: 50 });
        if (!isMounted) return;

        const items = response?.items || [];
        setScenes(items);

        if (items.length > 0) {
          setSelectedSceneId((prevId) => {
            const nextId = prevId && items.some((s) => s.id === prevId) ? prevId : items[0].id;
            const target = items.find((s) => s.id === nextId) || items[0];
            setSelectedScene(target);
            return nextId;
          });
        } else {
          setSelectedSceneId(null);
          setSelectedScene(null);
        }
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || "Satellite scene service unavailable.");
        setScenes([]);
        setSelectedSceneId(null);
        setSelectedScene(null);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchScenes();

    return () => {
      isMounted = false;
    };
  }, [selectedInvestigationId]);

  // Refresh scene list with optional auto-select
  const refreshScenes = useCallback(
    async (targetSceneId = null) => {
      if (!selectedInvestigationId) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await listSatelliteScenes(selectedInvestigationId, { page: 1, pageSize: 50 });
        const items = response?.items || [];
        setScenes(items);

        if (items.length > 0) {
          const selectId =
            targetSceneId ||
            (items.some((s) => s.id === selectedSceneId) ? selectedSceneId : items[0].id);
          setSelectedSceneId(selectId);
          const activeObj = items.find((s) => s.id === selectId) || items[0];
          setSelectedScene(activeObj);
        } else {
          setSelectedSceneId(null);
          setSelectedScene(null);
        }
      } catch (err) {
        setError(err.message || "Satellite scene service unavailable.");
      } finally {
        setIsLoading(false);
      }
    },
    [selectedInvestigationId, selectedSceneId]
  );

  // Handle scene selection change
  const handleSelectScene = useCallback(
    async (sceneId) => {
      if (!sceneId) {
        setSelectedSceneId(null);
        setSelectedScene(null);
        return;
      }

      // Clear any preview footprint when selecting a persisted scene
      setPreviewFootprint(null);
      setPreviewProduct(null);

      setSelectedSceneId(sceneId);
      const existing = scenes.find((s) => s.id === sceneId);
      if (existing) {
        setSelectedScene(existing);
      }

      try {
        const full = await getSatelliteScene(sceneId);
        if (full) {
          setSelectedScene(full);
        }
      } catch {
        // Fallback to existing list item
      }
    },
    [scenes]
  );

  // Handle successful creation or import of a new scene
  const handleCreatedScene = useCallback(
    (created) => {
      if (created?.id) {
        setPreviewFootprint(null);
        setPreviewProduct(null);
        refreshScenes(created.id);
      }
    },
    [refreshScenes]
  );

  // Render AI Spill Detection workspace
  if (activeCapability === "spill-detection") {
    return <SpillDetectionWorkspace />;
  }

  // Render Spill Characterization workspace
  if (activeCapability === "spill-characterization") {
    return <SpillCharacterizationWorkspace />;
  }

  // Render Sentinel-2 Cross-check workspace
  if (
    activeCapability === "sentinel2-crosscheck" ||
    activeCapability === "sentinel-2-cross-check"
  ) {
    return <Sentinel2CrossCheckWorkspace />;
  }

  // Render SAR Scene workspace (default)
  const isSarScene = !activeCapability || activeCapability === "sar-scene";
  const hasInvestigation = Boolean(selectedInvestigationId);

  return (
    <div className={styles.satelliteContainer} aria-label="Satellite Intelligence Workspace">
      {/* Top Workspace Context Header */}
      <div className={styles.workspaceHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.workspaceBadge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            <span className={styles.badgeCategory}>SATELLITE INTELLIGENCE</span>
          </div>

          <div className={styles.titleGroup}>
            <h2 className={styles.workspaceTitle}>
              {currentCapability?.name || "SAR Scene"}
            </h2>
            {selectedInvestigation && (
              <span className={styles.investigationContextChip}>
                {selectedInvestigation.name}
              </span>
            )}
          </div>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.statusPill}>
            <span
              className={`${styles.statusDot} ${
                selectedScene ? styles.statusDotActive : ""
              }`}
              aria-hidden="true"
            />
            <span className={styles.statusText}>
              {isLoading
                ? "LOADING..."
                : error
                ? "SERVICE UNAVAILABLE"
                : selectedScene
                ? "SCENE ACTIVE"
                : "DATA STANDBY"}
            </span>
          </div>

          <div className={styles.stateChip}>
            <span>
              {selectedScene
                ? `METADATA_IMPORTED (${selectedScene.product_type})`
                : "State: Standby"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Workspace Body */}
      {isSarScene ? (
        <div className={styles.sarSceneLayout}>
          {/* Backend / Network Error Banner */}
          {error && hasInvestigation && (
            <div className={styles.errorAlertBar} role="alert">
              <div className={styles.errorTextGroup}>
                <span className={styles.errorIcon} aria-hidden="true">⚠</span>
                <div>
                  <strong className={styles.errorTitle}>Satellite scene service unavailable</strong>
                  <p className={styles.errorSubtitle}>{error}</p>
                </div>
              </div>
              <button
                type="button"
                className={styles.errorRetryBtn}
                onClick={() => refreshScenes(selectedSceneId)}
              >
                Retry
              </button>
            </div>
          )}

          {/* SAR Scene Toolbar */}
          <div className={styles.sarToolbar} aria-label="SAR Scene Toolbar">
            <div className={styles.toolbarLeft}>
              {/* Investigation Context Selector */}
              {investigations.length > 0 && onSelectInvestigation && (
                <div className={styles.selectorGroup}>
                  <label htmlFor="sar-investigation-select" className={styles.selectorLabel}>
                    Investigation:
                  </label>
                  <select
                    id="sar-investigation-select"
                    className={styles.selectInput}
                    value={selectedInvestigationId || ""}
                    onChange={(e) => onSelectInvestigation(e.target.value)}
                  >
                    {investigations.map((inv) => (
                      <option key={inv.id} value={inv.id}>
                        {inv.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Scene Selector */}
              <div className={styles.selectorGroup}>
                <label htmlFor="sar-scene-select" className={styles.selectorLabel}>
                  SAR Scene:
                </label>
                <select
                  id="sar-scene-select"
                  className={styles.selectInput}
                  value={selectedSceneId || ""}
                  onChange={(e) => handleSelectScene(e.target.value)}
                  disabled={!hasInvestigation || isLoading || scenes.length === 0}
                >
                  {!hasInvestigation ? (
                    <option value="">No investigation selected</option>
                  ) : isLoading ? (
                    <option value="">Loading Sentinel-1 scenes...</option>
                  ) : scenes.length === 0 ? (
                    <option value="">No Sentinel-1 scenes loaded</option>
                  ) : (
                    scenes.map((sc) => (
                      <option key={sc.id} value={sc.id}>
                        {sc.scene_identifier || sc.id} ({sc.product_type})
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Scene Count Badge */}
              {hasInvestigation && !isLoading && scenes.length > 0 && (
                <span className={styles.sceneCountPill}>
                  {scenes.length} {scenes.length === 1 ? "Scene" : "Scenes"}
                </span>
              )}
            </div>

            <div className={styles.toolbarRight}>
              {/* Refresh Button */}
              {hasInvestigation && (
                <button
                  type="button"
                  className={styles.refreshBtn}
                  onClick={() => refreshScenes(selectedSceneId)}
                  disabled={isLoading}
                  title="Refresh Sentinel-1 scenes"
                  aria-label="Refresh Scenes"
                >
                  <span className={isLoading ? styles.spinning : ""} aria-hidden="true">
                    ↻
                  </span>
                </button>
              )}

              {/* Search Sentinel-1 Catalog Button (Official CDSE) */}
              <button
                type="button"
                className={styles.addSceneBtn}
                onClick={() => setIsSearchModalOpen(true)}
                disabled={!hasInvestigation}
                title={
                  !hasInvestigation
                    ? "Select an investigation before querying Copernicus Data Space."
                    : "Search Copernicus Data Space (CDSE) Sentinel-1 Catalog"
                }
              >
                <span aria-hidden="true">⌕</span>
                <span>Search Sentinel-1 (CDSE)</span>
              </button>
            </div>
          </div>

          {/* Main Inspection Area: Map Viewport + Metadata */}
          <div className={styles.mainInspectionRow}>
            <SARSceneViewer
              selectedScene={selectedScene}
              scenes={scenes}
              selectedInvestigation={selectedInvestigation}
              investigations={investigations}
              previewFootprint={previewFootprint}
              previewProduct={previewProduct}
              onOpenSearch={() => setIsSearchModalOpen(true)}
              onOpenCreate={() => setIsCreateModalOpen(true)}
              onSelectScene={handleSelectScene}
            />
            <SARSceneMetadata
              selectedScene={selectedScene}
              isLoading={isLoading}
              onSceneUpdated={() => refreshScenes(selectedScene?.id)}
            />
          </div>

          {/* Bottom Analytical Provenance Strip */}
          <SatellitePipeline />

          {/* Search Sentinel-1 CDSE Modal */}
          {hasInvestigation && (
            <SearchSentinel1Modal
              isOpen={isSearchModalOpen}
              onClose={() => {
                setIsSearchModalOpen(false);
              }}
              investigationId={selectedInvestigationId}
              investigationName={selectedInvestigation?.name}
              onPreviewFootprint={(fp, prod) => {
                setPreviewFootprint(fp);
                setPreviewProduct(prod);
              }}
              onImported={handleCreatedScene}
            />
          )}

          {/* Create/Manual Ingestion Sentinel-1 Scene Modal */}
          {hasInvestigation && (
            <CreateSceneModal
              isOpen={isCreateModalOpen}
              onClose={() => setIsCreateModalOpen(false)}
              investigationId={selectedInvestigationId}
              investigationName={selectedInvestigation?.name}
              onCreated={handleCreatedScene}
            />
          )}
        </div>
      ) : (
        /* Data-Ready Shell for Future Capabilities */
        <div className={styles.futureCapabilityShell}>
          <div className={styles.futureCard}>
            <h3 className={styles.futureHeading}>{currentCapability?.name}</h3>
            <p className={styles.futureDescription}>
              {currentCapability?.desc}
            </p>
            <div className={styles.futureNotice}>
              <span className={styles.noticeIcon} aria-hidden="true">ℹ</span>
              <p>
                This pipeline stage requires an active Sentinel-1 SAR observation. Ingest a SAR scene in the <strong>SAR Scene</strong> workspace to enable downstream intelligence processing.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
