"use client";

import { useState } from "react";
import Link from "next/link";
import HeroCapabilityChip from "./HeroCapabilityChip";
import DemoModal from "./DemoModal";
import styles from "./HeroContent.module.css";

/**
 * HeroContent
 *
 * Left-aligned editorial narrative block for OSPREY.
 * Features the monumental headline, mission description, primary/secondary CTAs,
 * and 3 capability highlights.
 */
export default function HeroContent() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  return (
    <>
      <div className={styles.contentWrapper}>
        {/* System Mission Status Pill */}
        <div className={styles.missionPill}>
          <div className={styles.missionBeaconWrapper} aria-hidden="true">
            <span className={styles.missionBeaconPing} />
            <span className={styles.missionBeaconDot} />
          </div>
          <span className={styles.missionPillText}>
            Maritime Surveillance &amp; Early Warning
          </span>
        </div>

        {/* Monumental Editorial Headline — 2-Line Desktop Lock */}
        <div className={styles.headlineGroup}>
          <h1 className={styles.headline}>
            <span className={styles.headlineLine1}>Cleaner Oceans</span>
            <span className={styles.headlineLine2}>Safer&nbsp;Tomorrows</span>
          </h1>
        </div>

        {/* Supporting Text */}
        <p className={styles.supportingText}>
          AI-powered maritime intelligence for oil spill detection, vessel
          investigation and environmental protection.
        </p>

        {/* Primary & Secondary CTAs */}
        <div className={styles.ctaGroup}>
          <Link href="/admin/login" className={styles.primaryCta}>
            <span>Start Investigation</span>
            <span className={styles.primaryCtaArrow} aria-hidden="true">→</span>
          </Link>

          <button
            type="button"
            className={styles.secondaryCta}
            onClick={() => setIsDemoModalOpen(true)}
            aria-label="Open OSPREY walkthrough demo modal"
          >
            <span className={styles.playIconCircle} aria-hidden="true">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </span>
            <span>Watch Demo</span>
          </button>
        </div>

        {/* 3 Capability Highlights */}
        <div className={styles.capabilityStrip} aria-label="Key Capabilities">
          <HeroCapabilityChip
            icon="✦"
            label="AI-Powered SAR Intelligence"
            variant="cyan"
          />
          <HeroCapabilityChip
            icon="⚡"
            label="Real-Time Maritime Monitoring"
            variant="sky"
          />
          <HeroCapabilityChip
            icon="🛡"
            label="Explainable Vessel Attribution"
            variant="emerald"
          />
        </div>
      </div>

      {/* Demo Modal Shell */}
      <DemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />
    </>
  );
}
