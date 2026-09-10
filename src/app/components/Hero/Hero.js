import HeroBackground from "./HeroBackground";
import HeroNavbar from "./HeroNavbar";
import HeroContent from "./HeroContent";
import HeroVisual from "./HeroVisual";
import styles from "./Hero.module.css";

/**
 * Hero
 *
 * Full-viewport hero section for OSPREY Maritime Intelligence.
 * Layers floating glass UI components over the existing Earth background.
 */
export default function Hero() {
  return (
    <section className={styles.heroSection} id="hero">
      {/* 1. Earth Background Layer */}
      <HeroBackground />

      {/* 2. Atmospheric Ambient Lighting & Tactical Grid */}
      <div className={styles.ambientGlowContainer} aria-hidden="true">
        <div className={styles.ambientGlowTop} />
        <div className={styles.ambientGlowRight} />
        <div className={styles.ambientGlowLeft} />
        <div className={styles.fineGrid} />
      </div>

      {/* 3. Floating Navbar */}
      <HeroNavbar />

      {/* 4. Main Hero Grid Content */}
      <div className={styles.heroMain}>
        <div className={styles.heroGrid}>
          {/* Left: Editorial Narrative & CTAs */}
          <HeroContent />

          {/* Right: Tactical HUD & Intelligence Cards */}
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
