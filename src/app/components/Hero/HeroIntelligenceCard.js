import styles from "./HeroIntelligenceCard.module.css";

/**
 * HeroIntelligenceCard
 *
 * Translucent glass telemetry panel displaying a real-time system state (Wind, Currents, Vessel).
 *
 * @param {object} props
 * @param {React.ReactNode} props.icon - SVG or visual icon
 * @param {string} props.category - Category title (e.g. "WIND", "CURRENTS", "VESSEL")
 * @param {string} props.state - Current state description (e.g. "ATMOSPHERIC DRIFT", "HYDRODYNAMIC FLOW", "AIS CORRELATION")
 * @param {string} props.badgeText - Status badge tag (e.g. "NW VECTOR", "SURFACE DRIFT", "POTENTIAL MATCH")
 * @param {'cyan' | 'sky' | 'emerald'} [props.badgeVariant='cyan'] - Badge color theme
 * @param {'a' | 'b' | 'c' | 'none'} [props.floatVariation='a'] - Floating animation rhythm
 */
export default function HeroIntelligenceCard({
  icon,
  category,
  state,
  badgeText,
  badgeVariant = "cyan",
  floatVariation = "a",
}) {
  const floatClass =
    floatVariation === "b"
      ? styles.floatB
      : floatVariation === "c"
      ? styles.floatC
      : floatVariation === "none"
      ? ""
      : styles.floatA;

  const badgeClass =
    badgeVariant === "emerald"
      ? styles.badgeEmerald
      : badgeVariant === "sky"
      ? styles.badgeSky
      : styles.badgeCyan;

  return (
    <div className={`${styles.cardContainer} ${floatClass}`}>
      <div className={styles.leftGroup}>
        <div className={styles.iconWrapper} aria-hidden="true">
          {icon}
        </div>
        <div className={styles.textGroup}>
          <span className={styles.categoryLabel}>{category}</span>
          <span className={styles.stateText}>{state}</span>
        </div>
      </div>
      <span className={`${styles.badge} ${badgeClass}`}>{badgeText}</span>
    </div>
  );
}
