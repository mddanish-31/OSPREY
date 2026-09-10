import styles from "./SolutionStage.module.css";

/**
 * SolutionStage
 *
 * Luminous oceanic liquid-glass card representing a phase in OSPREY's unified investigation workflow.
 *
 * @param {object} props
 * @param {string} props.stage - Stage identifier (e.g. "01 // DETECT")
 * @param {string} props.title - Stage title (e.g. "DETECT")
 * @param {string} props.description - Stage explanation
 * @param {React.ReactNode} [props.icon] - Vector icon
 * @param {boolean} [props.isLast=false] - Whether this is the last stage in the sequence
 * @param {number} [props.stepNumber=1] - Numeric step index (1-4)
 */
export default function SolutionStage({
  stage,
  title,
  description,
  icon,
  isLast = false,
  stepNumber = 1,
}) {
  return (
    <div className={styles.stageCardWrapper}>
      <article className={styles.stageContainer}>
        {/* Top telemetry & icon */}
        <div className={styles.stageHeader}>
          <div className={styles.stageBadge}>
            <span className={styles.beaconDot} aria-hidden="true" />
            <span className={styles.stageNumber}>{stage}</span>
          </div>
          {icon && (
            <div className={styles.iconWrapper} aria-hidden="true">
              {icon}
            </div>
          )}
        </div>

        {/* Content */}
        <div className={styles.stageBody}>
          <h4 className={styles.title}>{title}</h4>
          <p className={styles.description}>{description}</p>
        </div>

        {/* Bottom specular glow highlight */}
        <div className={styles.bottomHighlight} aria-hidden="true" />
      </article>

      {/* Inter-stage flow connector */}
      {!isLast && (
        <div className={styles.flowConnector} aria-hidden="true">
          <div className={styles.connectorTrack}>
            <div
              className={styles.connectorPulse}
              style={{ animationDelay: `${stepNumber * 0.6}s` }}
            />
          </div>
          <div className={styles.connectorArrow}>
            <span className={styles.arrowDesktop}>→</span>
            <span className={styles.arrowMobile}>↓</span>
          </div>
        </div>
      )}
    </div>
  );
}
