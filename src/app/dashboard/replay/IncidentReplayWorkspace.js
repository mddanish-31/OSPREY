"use client";

import ReplayMapViewer from "./ReplayMapViewer";
import ReplayTimeline from "./ReplayTimeline";
import ReplayLayers from "./ReplayLayers";
import ReplayEventMarkers from "./ReplayEventMarkers";
import WhatIfScenario from "./WhatIfScenario";
import ScenarioParameters from "./ScenarioParameters";
import ScenarioComparison from "./ScenarioComparison";
import ReplayPipeline from "./ReplayPipeline";
import ReplayProvenance from "./ReplayProvenance";
import styles from "./IncidentReplayWorkspace.module.css";

/**
 * IncidentReplayWorkspace
 *
 * Primary workspace orchestrator for Incident Replay / What-if Simulation.
 * Assembles:
 * - Header: INCIDENT REPLAY, DATA STANDBY, Awaiting Investigation Context
 * - Dependency Chain: Investigation → Spill Geometry → Origin Reconstruction → AIS Timeline → Environmental Forcing → Incident Replay → What-if Simulation
 * - Future Action Bar: Load Investigation, Start Replay, Run Baseline, Create Scenario, Run Scenario, Compare Results, Reset
 * - ReplayMapViewer: Central geographic replay viewport with reticles
 * - ReplayLayers & ReplayEventMarkers: Layer visibility and event legend
 * - ReplayTimeline: Temporal investigation playback scrubber and 7 event streams
 * - WhatIfScenario & ScenarioParameters: Counterfactual scenario builder and parameter matrix
 * - ScenarioComparison: Baseline vs Scenario comparative matrix
 * - ReplayPipeline: 7-stage simulation lifecycle in standby
 * - ReplayProvenance: Multi-source lineage across detection, characterization, drift, vessel intelligence, explainability, risk, response, and replay with scientific integrity notice
 */
export default function IncidentReplayWorkspace() {
  const dependencyChain = [
    { id: "scene-ingestion", name: "Investigation" },
    { id: "spill-geometry", name: "Spill Geometry" },
    { id: "origin-reconstruction", name: "Origin Reconstruction" },
    { id: "ais-timeline", name: "AIS Timeline" },
    { id: "environmental-forcing", name: "Environmental Forcing" },
    { id: "incident-replay", name: "Incident Replay" },
    { id: "what-if-simulation", name: "What-if Simulation" },
  ];

  const futureActions = [
    { label: "Load Investigation", title: "Requires available investigation dataset" },
    { label: "Start Replay", title: "Requires loaded investigation telemetry" },
    { label: "Run Baseline", title: "Requires validated drift trajectory" },
    { label: "Create Scenario", title: "Requires baseline reconstruction" },
    { label: "Run Scenario", title: "Requires configured scenario parameters" },
    { label: "Compare Results", title: "Requires baseline and scenario runs" },
    { label: "Reset", title: "No active simulation state" },
  ];

  return (
    <div className={styles.workspaceContainer} aria-label="Incident Replay Workspace">
      {/* Top Header Bar */}
      <div className={styles.workspaceHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.workspaceBadge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            <span className={styles.badgeCategory}>INCIDENT REPLAY</span>
          </div>

          <div className={styles.titleGroup}>
            <h2 className={styles.workspaceTitle}>Incident Replay</h2>
          </div>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.statusPill}>
            <span className={styles.statusDot} aria-hidden="true" />
            <span className={styles.statusText}>DATA STANDBY</span>
          </div>

          <div className={styles.stateChip}>
            <span>Awaiting Investigation Context</span>
          </div>
        </div>
      </div>

      {/* Subtitle & Dependency Chain Banner */}
      <div className={styles.subtitleBanner} aria-label="Incident Replay Dependency Chain">
        <div className={styles.bannerLeft}>
          <span className={styles.bannerBadge}>DEPENDENCY CHAIN</span>
          <span className={styles.bannerNotice}>
            Replay investigation evidence through time and evaluate controlled what-if scenarios.
          </span>
        </div>
        <div className={styles.dependencyTrack}>
          {dependencyChain.map((step, idx) => (
            <div key={step.id} className={styles.depItem}>
              <div className={styles.stepBox}>
                <span className={styles.stepName}>{step.name}</span>
              </div>
              {idx < dependencyChain.length - 1 && (
                <span className={styles.stepArrow} aria-hidden="true">→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Future Action Controls Toolbar */}
      <div className={styles.actionBar} role="toolbar" aria-label="Investigation Replay Controls">
        <div className={styles.actionButtonsRow}>
          {futureActions.map((action, idx) => (
            <button
              key={action.label}
              type="button"
              className={`${styles.actionBtn} ${idx === 0 ? styles.primaryActionBtn : ""}`}
              disabled
              title={action.title}
              aria-disabled="true"
            >
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Central Replay Canvas & Layer / Legend Sidebars */}
      <div className={styles.canvasGrid}>
        <div className={styles.mapColumn}>
          <ReplayMapViewer />
        </div>
        <div className={styles.sideControlsColumn}>
          <ReplayLayers />
          <ReplayEventMarkers />
        </div>
      </div>

      {/* Temporal Timeline Scrubber */}
      <ReplayTimeline />

      {/* 7-Stage Replay Pipeline */}
      <ReplayPipeline />

      {/* What-If Scenario Builder & Parameter Matrix */}
      <div className={styles.scenarioGrid}>
        <WhatIfScenario />
        <ScenarioParameters />
      </div>

      {/* Baseline vs Scenario Comparison */}
      <ScenarioComparison />

      {/* Provenance & Scientific Integrity */}
      <ReplayProvenance />
    </div>
  );
}
