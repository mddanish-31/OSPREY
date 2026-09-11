"use client";

import ResponsePriorityMap from "./ResponsePriorityMap";
import PriorityAssessment from "./PriorityAssessment";
import ResponseActionPanel from "./ResponseActionPanel";
import MonitoringPlan from "./MonitoringPlan";
import EscalationAssessment from "./EscalationAssessment";
import ResponsePipeline from "./ResponsePipeline";
import ResponseProvenance from "./ResponseProvenance";
import styles from "./ResponseIntelligenceWorkspace.module.css";

/**
 * ResponseIntelligenceWorkspace
 *
 * Primary orchestrator for Response Intelligence.
 * Assembles:
 * - ResponsePriorityMap (operational spatial-analysis viewport for response prioritization)
 * - PriorityAssessment (6-factor multi-source operational priority evaluation)
 * - ResponseActionPanel (structured operational action categories in standby)
 * - MonitoringPlan (multi-sensor surveillance & iterative reassessment loop)
 * - EscalationAssessment (decision-support escalation criteria evaluation)
 * - ResponsePipeline (8-stage pipeline from investigation context to response intelligence)
 * - ResponseProvenance (7-step end-to-end lineage from Detection to Response)
 */
export default function ResponseIntelligenceWorkspace() {
  const dependencyStages = [
    { id: "environmental-risk", name: "Environmental Risk" },
    { id: "impact-assessment", name: "Impact Assessment" },
    { id: "priority-assessment", name: "Priority Assessment" },
    { id: "response-planning", name: "Response Planning" },
    { id: "monitoring", name: "Monitoring" },
    { id: "escalation", name: "Escalation" },
  ];

  return (
    <div className={styles.workspaceContainer} aria-label="Response Intelligence Workspace">
      {/* Top Header Bar */}
      <div className={styles.workspaceHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.workspaceBadge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            <span className={styles.badgeCategory}>RESPONSE INTELLIGENCE</span>
          </div>

          <div className={styles.titleGroup}>
            <h2 className={styles.workspaceTitle}>Response Intelligence</h2>
          </div>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.statusPill}>
            <span className={styles.statusDot} aria-hidden="true" />
            <span className={styles.statusText}>DATA STANDBY</span>
          </div>

          <div className={styles.stateChip}>
            <span>Awaiting Environmental Assessment</span>
          </div>
        </div>
      </div>

      {/* Dependency Chain Banner */}
      <div className={styles.dependencyBanner} aria-label="Response Dependency Chain">
        <div className={styles.bannerLeft}>
          <span className={styles.bannerBadge}>RESPONSE DEPENDENCY CHAIN</span>
          <span className={styles.bannerNotice}>
            Operational recommendations only become available after environmental impact and investigation evidence exist.
          </span>
        </div>
        <div className={styles.dependencyTrack}>
          {dependencyStages.map((step, idx) => (
            <div key={step.id} className={styles.dependencyItem}>
              <div className={styles.stepBox}>
                <span className={styles.stepName}>{step.name}</span>
              </div>
              {idx < dependencyStages.length - 1 && (
                <span className={styles.stepArrow} aria-hidden="true">→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Spatial Analysis Inspection Row: Dominant Response Canvas + Priority Assessment */}
      <div className={styles.mainInspectionRow}>
        <ResponsePriorityMap />
        <PriorityAssessment />
      </div>

      {/* 8-Stage Response Pipeline */}
      <ResponsePipeline />

      {/* Response Actions & Monitoring Plan 2-Column Grid */}
      <div className={styles.analysisGrid}>
        <ResponseActionPanel />
        <MonitoringPlan />
      </div>

      {/* Escalation Assessment & Response Lineage 2-Column Grid */}
      <div className={styles.analysisGrid}>
        <EscalationAssessment />
        <ResponseProvenance />
      </div>
    </div>
  );
}
