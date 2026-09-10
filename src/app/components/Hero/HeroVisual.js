import HeroIntelligenceCard from "./HeroIntelligenceCard";
import SpillDetectionCallout from "./SpillDetectionCallout";
import styles from "./HeroVisual.module.css";

/**
 * HeroVisual
 *
 * Tactical visual interface layer rendered over the Earth imagery.
 * Integrates Sentinel-1 SAR orbital telemetry, tactical anomaly callouts,
 * and floating intelligence state cards.
 */
export default function HeroVisual() {
  return (
    <div className={styles.visualContainer}>
      {/* 1. Sentinel-1 Radar Badge */}
      <div className={styles.radarBadge} title="Orbital Radar Configuration">
        <div className={styles.radarReticle} aria-hidden="true">
          <div className={styles.radarSweepLine} />
          <div className={styles.radarCenterDot} />
        </div>
        <div className={styles.radarTextGroup}>
          <span className={styles.radarLabel}>SENTINEL-1 C-SAR</span>
          <span className={styles.radarSub}>ORBITAL SWATH // ACTIVE</span>
        </div>
      </div>

      {/* 2. Floating Intelligence Instrument Stack (Strict Non-Overlapping Hierarchy) */}
      <div className={styles.instrumentStack}>
        {/* Primary Intelligence Card: SAR Anomaly */}
        <SpillDetectionCallout
          title="SAR ANOMALY DETECTED"
          tag="SAR SPECTRUM // ACTIVE SWATH"
          href="/dashboard"
        />

        {/* Telemetry Instrument 1: Wind */}
        <HeroIntelligenceCard
          icon={
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
              <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
              <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
            </svg>
          }
          category="WIND DYNAMICS"
          state="ATMOSPHERIC DRIFT"
          badgeText="NW VECTOR"
          badgeVariant="cyan"
          floatVariation="a"
        />

        {/* Telemetry Instrument 2: Currents */}
        <HeroIntelligenceCard
          icon={
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
              <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
              <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
            </svg>
          }
          category="OCEAN CURRENTS"
          state="HYDRODYNAMIC FLOW"
          badgeText="SURFACE DRIFT"
          badgeVariant="sky"
          floatVariation="b"
        />

        {/* Telemetry Instrument 3: Vessel */}
        <HeroIntelligenceCard
          icon={
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
              <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76" />
              <path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6" />
              <path d="M12 2v3" />
            </svg>
          }
          category="VESSEL ATTRIBUTION"
          state="AIS CORRELATION ACTIVE"
          badgeText="POTENTIAL MATCH"
          badgeVariant="emerald"
          floatVariation="c"
        />
      </div>

      {/* 3. Editorial Mission Accents */}
      <div className={styles.editorialTag}>
        <span>&ldquo;Turning Data into a Cleaner Tomorrow&rdquo;</span>
      </div>
    </div>
  );
}
