"use client";

import styles from "./InvestigationToolbar.module.css";

/**
 * InvestigationToolbar
 *
 * Compact toolbar for switching active investigations, refreshing data,
 * and triggering the creation of a new real investigation.
 *
 * @param {object} props
 * @param {Array<object>} props.investigations - Loaded investigations list
 * @param {string|null} props.selectedId - UUID of the currently selected investigation
 * @param {function} props.onSelectInvestigation - Callback when user chooses an investigation
 * @param {function} props.onOpenCreate - Callback to launch creation modal
 * @param {function} props.onRefresh - Callback to refresh investigation list
 * @param {boolean} props.isLoading - Whether network operation is in flight
 */
export default function InvestigationToolbar({
  investigations = [],
  selectedId = null,
  onSelectInvestigation,
  onOpenCreate,
  onRefresh,
  isLoading = false,
}) {
  const selected = investigations.find((inv) => inv.id === selectedId) || null;
  const hasInvestigations = investigations.length > 0;

  return (
    <div className={styles.toolbarContainer} aria-label="Investigation Selection Controls">
      <div className={styles.toolbarLeft}>
        <div className={styles.selectorWrapper}>
          <label htmlFor="investigation-select" className={styles.selectorLabel}>
            Investigation:
          </label>
          <select
            id="investigation-select"
            className={styles.selectInput}
            value={selectedId || ""}
            onChange={(e) => onSelectInvestigation(e.target.value || null)}
            disabled={isLoading && !hasInvestigations}
          >
            {!hasInvestigations ? (
              <option value="">
                {isLoading ? "Loading investigations..." : "No investigations loaded"}
              </option>
            ) : (
              investigations.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.name} ({inv.status})
                </option>
              ))
            )}
          </select>
        </div>

        {selected && (
          <div className={styles.activeMetaPill} title={`Investigation ID: ${selected.id}`}>
            <span
              className={`${styles.metaDot} ${selected.geometry ? styles.metaDotGeometry : ""}`}
              aria-hidden="true"
            />
            <span>
              {selected.geometry ? "Polygon AOI" : "No Geometry"}
            </span>
          </div>
        )}
      </div>

      <div className={styles.toolbarRight}>
        <button
          type="button"
          className={styles.refreshBtn}
          onClick={onRefresh}
          disabled={isLoading}
          title="Refresh investigations from API"
          aria-label="Refresh investigations from API"
        >
          <span className={isLoading ? styles.spinning : ""} aria-hidden="true">
            ↻
          </span>
        </button>

        <button
          type="button"
          className={styles.createBtn}
          onClick={onOpenCreate}
          aria-label="Create New Investigation"
        >
          <span aria-hidden="true">＋</span>
          <span>New Investigation</span>
        </button>
      </div>
    </div>
  );
}
