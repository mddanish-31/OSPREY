import ProblemCarousel from "./ProblemCarousel";
import SolutionStage from "./SolutionStage";
import styles from "./WhyOsprey.module.css";

/**
 * WhyOsprey
 *
 * Section 2: Problem → Solution ("Why OSPREY?")
 *
 * Visual Flow:
 * 1. THE CHALLENGE (Editorial Header)
 * 2. THE PROBLEM (Two-Row Infinite Oceanic Liquid Glass Marquee)
 * 3. SYNTHESIS TRANSITION (Signal Line: Fragmented Signals ↓ Synthesis ↓ Unified Intelligence)
 * 4. THE OSPREY APPROACH (4-Stage Connected Workflow: Detect → Reconstruct → Correlate → Explain)
 */
export default function WhyOsprey() {
  // 4 Problem concepts with exact approved text
  const problemRow1 = [
    {
      number: "01",
      tag: "01 // FRAGMENTED INTELLIGENCE",
      title: "Fragmented Intelligence",
      description:
        "Satellite, AIS and environmental data live in separate information layers.",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      ),
    },
    {
      number: "02",
      tag: "02 // UNCERTAIN ORIGINS",
      title: "Uncertain Origins",
      description:
        "A visible slick does not directly reveal where or when the release began.",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
    },
    {
      number: "03",
      tag: "03 // COMPLEX VESSEL CORRELATION",
      title: "Complex Vessel Correlation",
      description:
        "Historical vessel movement must be reconstructed around the probable spill window.",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      number: "04",
      tag: "04 // LIMITED EXPLAINABILITY",
      title: "Limited Explainability",
      description:
        "Investigators need evidence showing why a vessel is considered relevant.",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="9" y1="9" x2="15" y2="15" />
          <line x1="15" y1="9" x2="9" y2="15" />
        </svg>
      ),
    },
  ];

  // Staggered for Row 2 rightward movement to provide organic visual variety
  const problemRow2 = [
    {
      number: "03",
      tag: "03 // COMPLEX VESSEL CORRELATION",
      title: "Complex Vessel Correlation",
      description:
        "Historical vessel movement must be reconstructed around the probable spill window.",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      number: "04",
      tag: "04 // LIMITED EXPLAINABILITY",
      title: "Limited Explainability",
      description:
        "Investigators need evidence showing why a vessel is considered relevant.",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="9" y1="9" x2="15" y2="15" />
          <line x1="15" y1="9" x2="9" y2="15" />
        </svg>
      ),
    },
    {
      number: "01",
      tag: "01 // FRAGMENTED INTELLIGENCE",
      title: "Fragmented Intelligence",
      description:
        "Satellite, AIS and environmental data live in separate information layers.",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      ),
    },
    {
      number: "02",
      tag: "02 // UNCERTAIN ORIGINS",
      title: "Uncertain Origins",
      description:
        "A visible slick does not directly reveal where or when the release began.",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
    },
  ];

  // 4 Solution Stages with exact approved text
  const solutionStages = [
    {
      stage: "01 // DETECT",
      title: "Detect",
      description:
        "Identify and characterize suspicious patterns in satellite imagery.",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>
      ),
    },
    {
      stage: "02 // RECONSTRUCT",
      title: "Reconstruct",
      description:
        "Trace probable spill movement using wind, currents and drift modelling.",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12h20" />
          <path d="M20 12l-4-4" />
          <path d="M20 12l-4 4" />
          <path d="M6 8a4 4 0 0 1 4-4 4 4 0 0 1 4 4" />
        </svg>
      ),
    },
    {
      stage: "03 // CORRELATE",
      title: "Correlate",
      description:
        "Reconstruct vessel activity and correlate historical AIS with the incident.",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
          <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76" />
          <path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6" />
          <path d="M12 2v3" />
        </svg>
      ),
    },
    {
      stage: "04 // EXPLAIN",
      title: "Explain",
      description:
        "Rank potential associations using transparent evidence rather than a black-box conclusion.",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
    },
  ];

  return (
    <section className={styles.section} id="capabilities" aria-labelledby="why-osprey-heading">
      {/* Decorative Atmosphere Background */}
      <div className={styles.ambientAtmosphere} aria-hidden="true">
        <div className={styles.ambientGlowTop} />
        <div className={styles.ambientGlowCenter} />
        <div className={styles.ambientGlowBottom} />
        <div className={styles.fineGrid} />
      </div>

      <div className={styles.container}>
        {/* ===================================================
            1. Section Editorial Header: The Challenge
            =================================================== */}
        <header className={styles.header}>
          <div className={styles.eyebrowPill}>
            <span className={styles.beaconDot} aria-hidden="true">
              <span className={styles.beaconPing} />
            </span>
            <span className={styles.eyebrowText}>THE CHALLENGE</span>
          </div>

          <h2 id="why-osprey-heading" className={styles.headline}>
            Oil spills move faster than investigations.
          </h2>

          <p className={styles.supportingText}>
            Satellite imagery, vessel traffic, ocean currents and environmental
            conditions often exist as disconnected sources. Determining where a
            spill began, how it moved and which vessels may be associated with it
            requires connecting these signals across time and space.
          </p>
        </header>

        {/* ===================================================
            2. The Problem: Two-Row Infinite Liquid Glass Carousel
            =================================================== */}
        <div className={styles.problemSection}>
          <div className={styles.problemHeader}>
            <div className={styles.problemTag}>
              <span className={styles.problemTagDot} aria-hidden="true" />
              <span>THE PROBLEM</span>
            </div>
            <h3 className={styles.problemTitle}>Fragmented &amp; Disconnected Evidence</h3>
          </div>

          <ProblemCarousel row1Items={problemRow1} row2Items={problemRow2} />
        </div>

        {/* ===================================================
            3. Synthesis Transition Bridge
            =================================================== */}
        <div className={styles.synthesisBridge} aria-hidden="true">
          <div className={styles.synthesisLabelLeft}>FRAGMENTED SIGNALS</div>
          <div className={styles.synthesisLineWrapper}>
            <div className={styles.synthesisTrack}>
              <div className={styles.synthesisPulse} />
            </div>
            <div className={styles.synthesisBadge}>
              <span className={styles.synthesisBeacon} />
              <span>SYNTHESIS</span>
              <span className={styles.synthesisArrow}>↓</span>
            </div>
          </div>
          <div className={styles.synthesisLabelRight}>UNIFIED INTELLIGENCE</div>
        </div>

        {/* ===================================================
            4. The OSPREY Approach: 4-Stage Connected Pipeline
            =================================================== */}
        <div className={styles.solutionSection}>
          <div className={styles.solutionHeader}>
            <div className={styles.solutionTag}>
              <span className={styles.solutionTagDot} aria-hidden="true">
                <span className={styles.solutionTagPing} />
              </span>
              <span>THE OSPREY APPROACH</span>
            </div>
            <h3 className={styles.solutionTitle}>
              One investigation layer.<br />
              <span className={styles.solutionTitleGradient}>Multiple intelligence signals.</span>
            </h3>
            <p className={styles.solutionDescription}>
              OSPREY connects satellite observations, ocean dynamics, vessel movement and
              behavioural evidence into a single explainable investigation workflow.
            </p>
          </div>

          {/* 4-Stage Sequential Connected Grid */}
          <div className={styles.pipelineGrid}>
            {solutionStages.map((stage, idx) => (
              <SolutionStage
                key={stage.stage}
                stage={stage.stage}
                title={stage.title}
                description={stage.description}
                icon={stage.icon}
                isLast={idx === solutionStages.length - 1}
                stepNumber={idx + 1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
