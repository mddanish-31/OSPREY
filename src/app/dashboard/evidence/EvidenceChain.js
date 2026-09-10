"use client";

import styles from "./EvidenceChain.module.css";

/**
 * EvidenceChain
 *
 * Visual centerpiece panel for #8 Evidence & Explainability.
 * Displays the 7-stage multi-source investigation progression:
 * 01 Detection → 02 Geometry → 03 Origin → 04 AIS → 05 Behaviour → 06 Cross-Sensor → 07 Association
 *
 * Strict product truth:
 * - All nodes in truthful awaiting/pending standby states
 * - Zero fake green checkmarks, completed styling, or fabricated evidence items
 * - Action controls disabled with clear tooltip descriptions
 */
export default function EvidenceChain() {
  const chainNodes = [
    {
      num: "01",
      name: "Detection",
      source: "Sentinel-1 SAR",
      state: "Awaiting model output",
    },
    {
      num: "02",
      name: "Geometry",
      source: "Spatial Polygon",
      state: "Awaiting candidate geometry",
    },
    {
      num: "03",
      name: "Origin",
      source: "Lagrangian Drift",
      state: "Awaiting drift reconstruction",
    },
    {
      num: "04",
      name: "AIS",
      source: "Vessel Transponder",
      state: "Awaiting vessel correlation",
    },
    {
      num: "05",
      name: "Behaviour",
      source: "Historical Baseline",
      state: "Awaiting behavioural analysis",
    },
    {
      num: "06",
      name: "Cross-Sensor",
      source: "Radar / AIS Match",
      state: "Awaiting SAR/AIS comparison",
    },
    {
      num: "07",
      name: "Association",
      source: "7-Factor Synthesis",
      state: "Awaiting evidence synthesis",
    },
  ];

  return (
    <section className={styles.chainCard} aria-label="Investigation Evidence Chain Centerpiece">
      {/* Top Header & Actions Toolbar */}
      <div className={styles.controlsBar} aria-label="Evidence Chain Controls">
        <div className={styles.headerTitleGroup}>
          <div className={styles.titleBadgeRow}>
            <span className={styles.cardBadge}>CORE EVIDENCE SPINE</span>
            <span className={styles.stateBadge}>Chain Standby</span>
          </div>
          <h3 className={styles.cardTitle}>Investigation Evidence Chain</h3>
        </div>

        <div className={styles.actionsGroup}>
          <button
            type="button"
            className={styles.primaryActionBtn}
            disabled
            aria-disabled="true"
            title="Requires available investigation evidence"
            aria-label="Inspect Evidence (Requires available investigation evidence)"
          >
            <span className={styles.actionIcon} aria-hidden="true">⇪</span>
            <span>Inspect Evidence</span>
          </button>

          <button
            type="button"
            className={styles.secondaryActionBtn}
            disabled
            aria-disabled="true"
            title="Requires multiple available evidence sources"
            aria-label="Compare Sources (Requires multiple available evidence sources)"
          >
            <span aria-hidden="true">⇄</span>
            <span>Compare Sources</span>
          </button>

          <button
            type="button"
            className={styles.secondaryActionBtn}
            disabled
            aria-disabled="true"
            title="Requires an active evidence chain"
            aria-label="Trace Evidence (Requires an active evidence chain)"
          >
            <span aria-hidden="true">☍</span>
            <span>Trace Evidence</span>
          </button>

          <button
            type="button"
            className={styles.secondaryActionBtn}
            disabled
            aria-disabled="true"
            title="Requires completed evidence synthesis"
            aria-label="Export Evidence (Requires completed evidence synthesis)"
          >
            <span aria-hidden="true">↗</span>
            <span>Export Evidence</span>
          </button>
        </div>
      </div>

      {/* Atmospheric Oceanic Ambient Depth Lighting */}
      <div className={styles.ambientAtmosphere} aria-hidden="true">
        <div className={styles.ambientGlow1} />
        <div className={styles.ambientGlow2} />
      </div>

      {/* Visual Evidence Progression Spine */}
      <div className={styles.chainTrackContainer}>
        <div className={styles.chainTrack}>
          {chainNodes.map((node, idx) => (
            <div key={node.num} className={styles.nodeWrapper}>
              <div className={styles.nodeCard}>
                <div className={styles.nodeTop}>
                  <span className={styles.nodeNum}>{node.num}</span>
                  <span className={styles.nodeStateBadge}>{node.state}</span>
                </div>
                <h4 className={styles.nodeName}>{node.name}</h4>
                <span className={styles.nodeSource}>{node.source}</span>
              </div>
              {idx < chainNodes.length - 1 && (
                <div className={styles.nodeConnector} aria-hidden="true">
                  <span className={styles.connectorLine} />
                  <span className={styles.connectorArrow}>→</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Explanatory Chain Footer */}
      <div className={styles.chainFooter}>
        <div className={styles.footerNote}>
          <span className={styles.noteIcon} aria-hidden="true">ℹ</span>
          <p className={styles.noteText}>
            The evidence spine connects detection, geometry, drift, AIS, and behavioural intelligence into an explainable multi-factor attribution chain. Nodes activate as upstream observations are verified.
          </p>
        </div>
        <div className={styles.statusPill}>
          <span className={styles.statusDot} aria-hidden="true" />
          <span>Evidence Progression: Standby</span>
        </div>
      </div>
    </section>
  );
}
