"use client";

import { useState, useEffect } from "react";
import { searchSentinel1Scenes, importSentinel1Scene } from "@/lib/api/investigations";
import styles from "./SearchSentinel1Modal.module.css";

/**
 * SearchSentinel1Modal
 *
 * Official Copernicus Data Space Ecosystem (CDSE) Sentinel-1 Catalog Discovery & Ingestion.
 * Queries real products intersecting the active Investigation's PostGIS spatial boundary (AOI).
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Whether modal is visible
 * @param {function} props.onClose - Callback to close modal
 * @param {string} props.investigationId - UUID of active parent investigation
 * @param {string} [props.investigationName] - Name/title of active investigation
 * @param {function} [props.onPreviewFootprint] - Callback to display candidate GeoJSON footprint on SAR viewer
 * @param {function} [props.onImported] - Callback when a Sentinel-1 product is successfully imported
 */
export default function SearchSentinel1Modal({
  isOpen,
  onClose,
  investigationId,
  investigationName = "Active Investigation",
  onPreviewFootprint,
  onImported,
}) {
  const [startDatetime, setStartDatetime] = useState(() => {
    const start = new Date();
    start.setDate(start.getDate() - 14);
    return start.toISOString().slice(0, 16);
  });
  const [endDatetime, setEndDatetime] = useState(() => {
    const end = new Date();
    return end.toISOString().slice(0, 16);
  });
  const [productType, setProductType] = useState("IW_GRDH_1S");
  const [operationalMode, setOperationalMode] = useState("");
  const [polarization, setPolarization] = useState("");
  const [orbitDirection, setOrbitDirection] = useState("");
  const [limit, setLimit] = useState(20);

  // Discovery state
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Ingestion state
  const [importingId, setImportingId] = useState(null);
  const [importedMap, setImportedMap] = useState({});

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!investigationId) {
      setErrorMessage("No investigation selected. Please select an investigation first.");
      return;
    }

    if (!startDatetime || !endDatetime) {
      setErrorMessage("Both start and end datetimes are required.");
      return;
    }

    const startDate = new Date(startDatetime);
    const endDate = new Date(endDatetime);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      setErrorMessage("Invalid datetime format entered.");
      return;
    }

    if (startDate >= endDate) {
      setErrorMessage("Start observation time must be strictly earlier than End time.");
      return;
    }

    setIsSearching(true);
    setResults(null);

    try {
      const payload = {
        start_datetime: startDate.toISOString(),
        end_datetime: endDate.toISOString(),
        product_type: productType,
        limit: Number(limit) || 20,
        operational_mode: operationalMode || null,
        polarization: polarization || null,
        orbit_direction: orbitDirection || null,
      };

      const response = await searchSentinel1Scenes(investigationId, payload);
      setResults(response.results || []);
      setHasMore(Boolean(response.has_more));
    } catch (err) {
      setErrorMessage(err.message || "Failed to query Copernicus Data Space catalog.");
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleImport = async (product) => {
    if (!product?.source_product_id || importingId) return;

    setImportingId(product.source_product_id);
    setErrorMessage(null);

    try {
      const created = await importSentinel1Scene(investigationId, {
        source_product_id: product.source_product_id,
      });

      setImportedMap((prev) => ({
        ...prev,
        [product.source_product_id]: true,
      }));

      if (onImported) {
        onImported(created);
      }
    } catch (err) {
      setErrorMessage(err.message || `Failed to import scene ${product.name}`);
    } finally {
      setImportingId(null);
    }
  };

  const handlePreview = (product) => {
    if (onPreviewFootprint && product?.footprint) {
      onPreviewFootprint(product.footprint, product);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={styles.modalBackdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cdse-search-title"
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
              <span>Copernicus Data Space Ecosystem (CDSE)</span>
            </div>
            <h3 id="cdse-search-title" className={styles.modalTitle}>
              Search Sentinel-1 Catalog
            </h3>
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close search modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div className={styles.modalBody}>
          {/* AOI Context Banner */}
          <div className={styles.aoiNotice}>
            <span className={styles.aoiIcon} aria-hidden="true">⛶</span>
            <div className={styles.aoiText}>
              Using active investigation AOI: <span className={styles.aoiHighlight}>{investigationName}</span>.
              Spatial intersection query is executed directly against the PostGIS investigation boundary.
            </div>
          </div>

          {/* Search Form */}
          <form className={styles.searchForm} onSubmit={handleSearch}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="search-start-datetime" className={styles.fieldLabel}>
                  Acquisition Start (UTC) *
                </label>
                <input
                  id="search-start-datetime"
                  type="datetime-local"
                  className={styles.textInput}
                  value={startDatetime}
                  onChange={(e) => setStartDatetime(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="search-end-datetime" className={styles.fieldLabel}>
                  Acquisition End (UTC) *
                </label>
                <input
                  id="search-end-datetime"
                  type="datetime-local"
                  className={styles.textInput}
                  value={endDatetime}
                  onChange={(e) => setEndDatetime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.formGridThree}>
              <div className={styles.formGroup}>
                <label htmlFor="search-product-type" className={styles.fieldLabel}>
                  Product Type *
                </label>
                <select
                  id="search-product-type"
                  className={styles.selectInput}
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                >
                  <option value="IW_GRDH_1S">IW_GRDH_1S (Interferometric Wide GRD)</option>
                  <option value="IW_SLC__1S">IW_SLC__1S (Interferometric Wide SLC)</option>
                  <option value="EW_GRDH_1S">EW_GRDH_1S (Extra Wide Swath GRD)</option>
                  <option value="SM_GRDH_1S">SM_GRDH_1S (Stripmap GRD)</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="search-polarization" className={styles.fieldLabel}>
                  Polarization (Optional)
                </label>
                <select
                  id="search-polarization"
                  className={styles.selectInput}
                  value={polarization}
                  onChange={(e) => setPolarization(e.target.value)}
                >
                  <option value="">All Polarizations</option>
                  <option value="VV+VH">VV + VH</option>
                  <option value="HH+HV">HH + HV</option>
                  <option value="VV">VV Single</option>
                  <option value="HH">HH Single</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="search-orbit-direction" className={styles.fieldLabel}>
                  Orbit Direction (Optional)
                </label>
                <select
                  id="search-orbit-direction"
                  className={styles.selectInput}
                  value={orbitDirection}
                  onChange={(e) => setOrbitDirection(e.target.value)}
                >
                  <option value="">Any Orbit Direction</option>
                  <option value="ASCENDING">ASCENDING</option>
                  <option value="DESCENDING">DESCENDING</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className={styles.searchSubmitBtn}
              disabled={isSearching}
            >
              {isSearching ? (
                <>
                  <span className={styles.spinner} aria-hidden="true" />
                  <span>Querying Copernicus OData...</span>
                </>
              ) : (
                <>
                  <span aria-hidden="true">⌕</span>
                  <span>Search Sentinel-1 Catalog</span>
                </>
              )}
            </button>
          </form>

          {/* Error Banner */}
          {errorMessage && (
            <div className={styles.errorBanner} role="alert">
              <span aria-hidden="true">⚠</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Results Area */}
          <div className={styles.resultsSection}>
            {isSearching && (
              <div className={styles.loadingState}>
                <span className={styles.spinner} aria-hidden="true" />
                <p>Querying official Copernicus Data Space Ecosystem catalog...</p>
              </div>
            )}

            {!isSearching && results === null && (
              <div className={styles.emptyState}>
                <p>Enter an observation acquisition window to search for real Sentinel-1 products over this investigation.</p>
              </div>
            )}

            {!isSearching && results && results.length === 0 && (
              <div className={styles.emptyState}>
                <p>No Sentinel-1 products found intersecting this investigation area within the specified time range.</p>
              </div>
            )}

            {!isSearching && results && results.length > 0 && (
              <>
                <div className={styles.resultsHeader}>
                  <span className={styles.resultsCount}>
                    Found {results.length} Sentinel-1 Product{results.length === 1 ? "" : "s"} {hasMore ? "(More available)" : ""}
                  </span>
                </div>

                <div className={styles.resultsList}>
                  {results.map((product) => {
                    const isImported = Boolean(importedMap[product.source_product_id]);
                    const isImporting = importingId === product.source_product_id;

                    const acqStartStr = product.acquisition_start
                      ? new Date(product.acquisition_start).toISOString().replace("T", " ").replace(".000Z", " UTC")
                      : "N/A";

                    return (
                      <div key={product.source_product_id} className={styles.resultCard}>
                        <div className={styles.cardHeader}>
                          <span className={styles.productName}>{product.name}</span>
                          <span
                            className={`${styles.onlineBadge} ${
                              product.online ? styles.onlineBadgeTrue : styles.onlineBadgeFalse
                            }`}
                          >
                            {product.online ? "Online" : "Archive"}
                          </span>
                        </div>

                        <div className={styles.cardMetaGrid}>
                          <div className={styles.metaItem}>
                            <span className={styles.metaKey}>Platform</span>
                            <span className={styles.metaValue}>{product.platform || "Sentinel-1"}</span>
                          </div>
                          <div className={styles.metaItem}>
                            <span className={styles.metaKey}>Product Type</span>
                            <span className={styles.metaValue}>{product.product_type}</span>
                          </div>
                          <div className={styles.metaItem}>
                            <span className={styles.metaKey}>Acquisition</span>
                            <span className={styles.metaValue}>{acqStartStr}</span>
                          </div>
                          <div className={styles.metaItem}>
                            <span className={styles.metaKey}>Polarization</span>
                            <span className={styles.metaValue}>{product.polarization || "N/A"}</span>
                          </div>
                          <div className={styles.metaItem}>
                            <span className={styles.metaKey}>Orbit</span>
                            <span className={styles.metaValue}>
                              {product.orbit_direction || "N/A"} {product.relative_orbit ? `(Trk ${product.relative_orbit})` : ""}
                            </span>
                          </div>
                          <div className={styles.metaItem}>
                            <span className={styles.metaKey}>CDSE Product ID</span>
                            <span className={styles.metaValue} title={product.source_product_id}>
                              {product.source_product_id.slice(0, 8)}...
                            </span>
                          </div>
                        </div>

                        <div className={styles.cardActions}>
                          <button
                            type="button"
                            className={styles.previewBtn}
                            onClick={() => handlePreview(product)}
                            title="Preview spatial footprint on SAR map"
                          >
                            Preview Footprint
                          </button>

                          {isImported ? (
                            <span className={styles.importedBadge}>
                              <span aria-hidden="true">✓</span>
                              <span>Imported (METADATA_IMPORTED)</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              className={styles.importBtn}
                              onClick={() => handleImport(product)}
                              disabled={isImporting}
                              title="Import real Sentinel-1 metadata into investigation"
                            >
                              {isImporting ? (
                                <>
                                  <span className={styles.spinner} aria-hidden="true" />
                                  <span>Importing...</span>
                                </>
                              ) : (
                                <>
                                  <span aria-hidden="true">＋</span>
                                  <span>Import Scene</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
