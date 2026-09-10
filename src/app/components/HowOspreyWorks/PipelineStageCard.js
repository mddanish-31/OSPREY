import styles from "./PipelineStageCard.module.css";

/**
 * PipelineStageCard
 *
 * Liquid-glass card representing an individual stage in OSPREY's 10-phase intelligence workflow.
 * Encapsulates the stage number, title, narrative, vector icon, and dynamic preview widget.
 *
 * @param {object} props
 * @param {object} props.stage - Stage data object
 * @param {boolean} [props.isActive=false] - Whether this stage is currently selected
 * @param {boolean} [props.isAdjacent=false] - Whether this stage is adjacent to the hovered stage
 * @param {function} [props.onSelect] - Selection handler
 * @param {function} [props.onHover] - Hover enter handler
 * @param {function} [props.onLeave] - Hover leave handler
 */
export default function PipelineStageCard({
  stage,
  isActive = false,
  isAdjacent = false,
  onSelect,
  onHover,
  onLeave,
}) {
  const { number, tag, title, description, icon, preview } = stage;

  return (
    <article
      className={`${styles.cardContainer} ${isActive ? styles.activeCard : ""} ${
        isAdjacent ? styles.adjacentCard : ""
      }`}
      onClick={() => onSelect && onSelect(number)}
      onMouseEnter={() => onHover && onHover(number)}
      onMouseLeave={() => onLeave && onLeave()}
      tabIndex={0}
      role="button"
      aria-pressed={isActive}
      aria-label={`Stage ${number}: ${title}`}
    >
      {/* Stage Header */}
      <div className={styles.cardHeader}>
        <div className={styles.badgeGroup}>
          <span className={styles.stageBadge}>
            <span className={styles.beaconDot} aria-hidden="true" />
            <span className={styles.badgeText}>{tag}</span>
          </span>
        </div>
        {icon && (
          <div className={styles.iconWrapper} aria-hidden="true">
            {icon}
          </div>
        )}
      </div>

      {/* Stage Body */}
      <div className={styles.cardBody}>
        <h4 className={styles.title}>{title}</h4>
        <p className={styles.description}>{description}</p>
      </div>

      {/* Data-Ready Visual Preview */}
      {preview && <div className={styles.previewWrapper}>{preview}</div>}

      {/* Bottom specular accent */}
      <div className={styles.bottomHighlight} aria-hidden="true" />
    </article>
  );
}
