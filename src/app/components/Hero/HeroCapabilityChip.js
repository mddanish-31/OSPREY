import styles from "./HeroCapabilityChip.module.css";

/**
 * HeroCapabilityChip
 *
 * Reusable translucent glass badge showcasing a core system capability.
 *
 * @param {object} props
 * @param {React.ReactNode} props.icon - Decorative icon symbol
 * @param {string} props.label - Capability text
 * @param {'cyan' | 'sky' | 'emerald'} [props.variant='cyan'] - Color theme accent
 */
export default function HeroCapabilityChip({ icon, label, variant = "cyan" }) {
  const variantClass =
    variant === "sky"
      ? styles.variantSky
      : variant === "emerald"
      ? styles.variantEmerald
      : styles.variantCyan;

  return (
    <div className={`${styles.capabilityChip} ${variantClass}`}>
      <span className={styles.chipIconWrapper} aria-hidden="true">
        {icon}
      </span>
      <span className={styles.chipText}>{label}</span>
    </div>
  );
}
