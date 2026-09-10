import styles from "./SatelliteLayers.module.css";

/**
 * SatelliteLayers
 *
 * Interactive layer toggle controls for the SAR intelligence viewport.
 *
 * @param {object} props
 * @param {object} props.activeLayers - Map of active layer boolean states
 * @param {function} props.onToggleLayer - Callback to toggle layer
 */
export default function SatelliteLayers({ activeLayers, onToggleLayer }) {
  const layers = [
    { id: "sar", label: "SAR Base", indicator: "Radar" },
    { id: "spillMask", label: "Candidate Mask", indicator: "Anomaly" },
    { id: "optical", label: "Optical Cross-Check", indicator: "S-2" },
    { id: "context", label: "Geographic Context", indicator: "Grid" },
  ];

  return (
    <div className={styles.layersContainer} aria-label="Satellite scene layer toggles">
      <span className={styles.layerHeader}>Scene Layers</span>
      <div className={styles.buttonGroup}>
        {layers.map((layer) => {
          const isActive = activeLayers[layer.id];
          return (
            <button
              key={layer.id}
              type="button"
              className={`${styles.layerButton} ${isActive ? styles.layerActive : ""}`}
              onClick={() => onToggleLayer(layer.id)}
              aria-pressed={isActive}
              aria-label={`Toggle ${layer.label}`}
            >
              <span className={styles.indicatorDot} aria-hidden="true" />
              <span className={styles.layerLabel}>{layer.label}</span>
              <span className={styles.layerTag}>{layer.indicator}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
