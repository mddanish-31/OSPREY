import Image from "next/image";
import styles from "./HeroBackground.module.css";

/**
 * HeroBackground
 *
 * Full-viewport Earth-from-space background image.
 * Renders the provided hero image edge-to-edge behind
 * all future OSPREY hero UI layers.
 *
 * Uses Next.js <Image> for:
 *  - automatic srcset / responsive sizing
 *  - priority loading (above-the-fold hero)
 *  - built-in optimization
 *
 * A subtle dark-navy gradient overlay is applied for
 * future text readability without obscuring the Earth.
 */
export default function HeroBackground() {
  return (
    <div className={styles.heroBackground} aria-hidden="true">
      {/* Earth from space â€” India/Asia, blue atmospheric glow, starfield */}
      <Image
        className={styles.heroImage}
        src="/assets/hero-earth.png"
        alt=""
        fill
        priority
        sizes="100vw"
        quality={90}
      />

      {/* Subtle overlay gradient for future text readability */}
      <div className={styles.heroOverlay} />
    </div>
  );
}
