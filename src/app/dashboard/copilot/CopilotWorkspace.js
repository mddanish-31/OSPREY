"use client";

import CopilotConversation from "./CopilotConversation";
import CopilotContextPanel from "./CopilotContextPanel";
import CopilotEvidenceReferences from "./CopilotEvidenceReferences";
import CopilotToolStatus from "./CopilotToolStatus";
import CopilotPipeline from "./CopilotPipeline";
import CopilotProvenance from "./CopilotProvenance";
import styles from "./CopilotWorkspace.module.css";

/**
 * CopilotWorkspace
 *
 * Primary orchestrator for Capability #11: AI Copilot.
 * Assembles:
 * - CopilotConversation (evidence-grounded conversation frame with template suggestions & standby notice)
 * - CopilotContextPanel (upstream multi-source telemetry bindings)
 * - CopilotEvidenceReferences (structured evidence citations area)
 * - CopilotToolStatus (investigation tool execution status in standby)
 * - CopilotPipeline (7-stage pipeline from user question to grounded references)
 * - CopilotProvenance (model status & multi-source parameter lineage)
 */
export default function CopilotWorkspace() {
  const contextChain = [
    { name: "Investigation" },
    { name: "Detection" },
    { name: "Origin" },
    { name: "Vessel Evidence" },
    { name: "Environmental Risk" },
    { name: "Response Intelligence" },
    { name: "Copilot" },
  ];

  return (
    <div className={styles.workspaceContainer} aria-label="AI Copilot Workspace">
      {/* Top Header Bar */}
      <div className={styles.workspaceHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.workspaceBadge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            <span className={styles.badgeNumber}>11</span>
            <span className={styles.badgeCategory}>AI COPILOT</span>
          </div>

          <div className={styles.titleGroup}>
            <h2 className={styles.workspaceTitle}>Investigation Copilot</h2>
            <span className={styles.capabilityBadge}>#11</span>
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

      {/* Subtitle & Context Chain Banner */}
      <div className={styles.subtitleBanner} aria-label="Copilot Context Grounding Chain">
        <div className={styles.bannerLeft}>
          <span className={styles.bannerBadge}>GROUNDING CHAIN</span>
          <span className={styles.bannerNotice}>
            Grounded natural-language access to OSPREY investigation evidence.
          </span>
        </div>
        <div className={styles.contextTrack}>
          {contextChain.map((step, idx) => (
            <div key={idx} className={styles.contextItem}>
              <div className={styles.stepBox}>
                <span className={styles.stepName}>{step.name}</span>
              </div>
              {idx < contextChain.length - 1 && (
                <span className={styles.stepArrow} aria-hidden="true">→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Conversation Inspection Row: Conversation Frame + Investigation Context Panel */}
      <div className={styles.mainConversationRow}>
        <CopilotConversation variant="workspace" />
        <CopilotContextPanel />
      </div>

      {/* 7-Stage Copilot Evidence Pipeline */}
      <CopilotPipeline />

      {/* Evidence References & Tool Status 2-Column Grid */}
      <div className={styles.analysisGrid}>
        <CopilotEvidenceReferences />
        <CopilotToolStatus />
      </div>

      {/* Bottom Model & Parameter Provenance */}
      <div className={styles.bottomGrid}>
        <CopilotProvenance />
      </div>
    </div>
  );
}
