import Link from "next/link";
import styles from "./HeroNavbar.module.css";

/**
 * HeroNavbar
 *
 * Floating liquid-glass navigation header.
 * Encapsulates the OSPREY brand identity, orbital telemetry status,
 * navigation anchors, and primary investigation CTA.
 */
export default function HeroNavbar() {
  return (
    <header className={styles.navHeader}>
      <nav className={styles.navContainer} aria-label="Main Navigation">
        {/* Brand Link */}
        <Link href="/" className={styles.brandLink}>
          <div className={styles.brandEmblemWrapper}>
            <div className={styles.brandPingRing} />
            <svg
              className={styles.brandEmblemIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {/* Soaring Osprey Vector Contour */}
              <path d="M12 2L3 8l9 4 9-4-9-6z" />
              <path d="M3 8v5l9 6 9-6V8" />
              <path d="M12 12l-4 3 4 3 4-3-4-3z" />
            </svg>
          </div>
          <div className={styles.brandTextGroup}>
            <span className={styles.brandTitle}>OSPREY</span>
            <span className={styles.brandSubtitle}>Maritime Intelligence</span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <div className={styles.navLinksList}>
          <a href="#hero" className={`${styles.navLink} ${styles.navLinkActive}`}>
            Overview
          </a>
          <a href="#capabilities" className={styles.navLink}>
            Capabilities
          </a>
          <a href="#sar-intelligence" className={styles.navLink}>
            SAR Intelligence
          </a>
          <a href="#technology" className={styles.navLink}>
            Technology
          </a>
        </div>

        {/* Actions Cluster */}
        <div className={styles.navActions}>
          {/* Orbital Telemetry Status Chip */}
          <div className={styles.statusIndicator} title="Surveillance System State">
            <span className={styles.statusBeaconDot}>
              <span className={styles.statusBeaconPing} />
            </span>
            <span>ORBITAL ACTIVE</span>
          </div>

          {/* Primary Action Button */}
          <Link href="/dashboard" className={styles.navCtaButton}>
            <span>Start Investigation</span>
            <span className={styles.navCtaArrow} aria-hidden="true">→</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
