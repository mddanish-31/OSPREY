import styles from "./PipelineTimeline.module.css";

/**
 * PipelineTimeline
 *
 * Horizontal interactive 10-stage pipeline stepper.
 * Visualizes the signal flow across all 10 phases from Data Ingestion to Response Intelligence.
 *
 * @param {object} props
 * @param {Array} props.stages - Array of 10 stage objects
 * @param {string} props.activeStage - Currently active stage number (e.g. "01")
 * @param {function} props.onSelectStage - Handler when a stage node is clicked
 */
export default function PipelineTimeline({ stages, activeStage, onSelectStage }) {
  return (
    <nav className={styles.timelineWrapper} aria-label="10-stage investigation workflow stepper">
      {/* Background connecting track */}
      <div className={styles.trackLine} aria-hidden="true">
        <div className={styles.signalPulse} />
      </div>

      {/* 10 Step Nodes */}
      <div className={styles.nodesContainer}>
        {stages.map((stage) => {
          const isActive = stage.number === activeStage;
          return (
            <button
              key={stage.number}
              type="button"
              className={`${styles.nodeButton} ${isActive ? styles.nodeActive : ""}`}
              onClick={() => onSelectStage(stage.number)}
              aria-label={`Step ${stage.number}: ${stage.title}`}
              aria-current={isActive ? "step" : undefined}
            >
              <div className={styles.nodeCircle}>
                <span className={styles.nodeNumber}>{stage.number}</span>
              </div>
              <span className={styles.nodeLabel}>{stage.shortLabel || stage.title}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
