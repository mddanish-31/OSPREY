import styles from "./DetectionState.module.css";

/**
 * DetectionState
 *
 * Visualizes the current state of the AI SAR detection and segmentation pipeline,
 * including model metadata, status badges, and the 5-step screening workflow with look-alike filtering.
 *
 * @param {object} props
 * @param {object} [props.detection] - Optional real detection output
 * @param {string} [props.state="ready"] - Detection state ("awaiting" | "processing" | "ready" | "error")
 */
export default function DetectionState({ detection, state = "ready" }) {
  const currentState = detection?.status || state;

  const stateConfigs = {
    awaiting: {
      label: "Awaiting satellite analysis",
      dotClass: styles.dotPending,
      description: "Sensor data queue connected. Awaiting next SAR scene acquisition.",
    },
    processing: {
      label: "AI segmentation in progress",
      dotClass: styles.dotProcessing,
      description: "Applying spatial filter kernels and neural segmentation to C-Band backscatter.",
    },
    ready: {
      label: "Candidate surface anomaly identified",
      dotClass: styles.dotReady,
      description: "Surface dampening signature extracted and passed through look-alike screening.",
    },
    error: {
      label: "Analysis unavailable",
      dotClass: styles.dotError,
      description: "Scene quality or sensor metadata insufficient for automated candidate segmentation.",
    },
  };

  const config = stateConfigs[currentState] || stateConfigs.ready;
  const modelName = detection?.modelName || "OSPREY SAR segmentation model";
  const modelMetadata = detection?.modelVersion || "Model metadata pending";

  const workflowSteps = [
    { label: "SAR Preprocessing", tag: "Radiometric Calibration" },
    { label: "Anomaly Detection", tag: "Backscatter Damping" },
    { label: "Candidate Segmentation", tag: "Mask Extraction" },
    { label: "Look-Alike Filtering", tag: "Contextual Screening", highlight: true },
    { label: "Spill Interpretation", tag: "Evidence Synthesis" },
  ];

  return (
    <article className={styles.stateCard}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.statusBadge}>
          <span className={`${styles.statusDot} ${config.dotClass}`} aria-hidden="true" />
          <span className={styles.statusText}>{config.label}</span>
        </div>
        <span className={styles.modelTag}>{modelName}</span>
      </div>

      <p className={styles.stateDescription}>{config.description}</p>

      {/* 5-Step Pipeline with Look-Alike Screening */}
      <div className={styles.workflowContainer}>
        <span className={styles.workflowTitle}>Pipeline Execution Flow</span>
        <div className={styles.stepsList}>
          {workflowSteps.map((step, idx) => (
            <div
              key={step.label}
              className={`${styles.stepItem} ${step.highlight ? styles.stepHighlight : ""}`}
            >
              <div className={styles.stepNumberBadge}>0{idx + 1}</div>
              <div className={styles.stepContent}>
                <span className={styles.stepLabel}>{step.label}</span>
                <span className={styles.stepTag}>{step.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Model Provenance Footer */}
      <div className={styles.footer}>
        <span className={styles.footerKey}>Model Status:</span>
        <span className={styles.footerVal}>{modelMetadata}</span>
      </div>
    </article>
  );
}
