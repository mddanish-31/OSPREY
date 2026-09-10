import styles from "./ProblemCard.module.css";

/**
 * ProblemCard
 *
 * Translucent oceanic liquid-glass card representing an intelligence bottleneck.
 * Designed to flow smoothly inside the infinite marquee carousel.
 *
 * @param {object} props
 * @param {string} props.tag - Stage tag (e.g. "01 // FRAGMENTED INTELLIGENCE")
 * @param {string} props.title - Challenge title
 * @param {string} props.description - Detailed explanation
 * @param {React.ReactNode} [props.icon] - Vector icon representing the data node
 */
export default function ProblemCard({ tag, title, description, icon }) {
  return (
    <article className={styles.cardContainer}>
      <div className={styles.cardTop}>
        <div className={styles.tagBadge}>
          <span className={styles.tagDot} aria-hidden="true" />
          <span className={styles.tagText}>{tag}</span>
        </div>
        {icon && (
          <div className={styles.iconWrapper} aria-hidden="true">
            {icon}
          </div>
        )}
      </div>

      <div className={styles.cardBody}>
        <h4 className={styles.title}>{title}</h4>
        <p className={styles.description}>{description}</p>
      </div>

      {/* Subtle bottom specular accent */}
      <div className={styles.bottomHighlight} aria-hidden="true" />
    </article>
  );
}
