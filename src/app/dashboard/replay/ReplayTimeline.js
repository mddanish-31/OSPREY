"use client";

import styles from "./ReplayTimeline.module.css";

/**
 * ReplayTimeline
 *
 * Temporal investigation playback scrubber & event stream panel for Incident Replay.
 *
 * Strict operational product truth:
 * - Timeline state: "Awaiting temporal evidence"
 * - Playback controls disabled with prerequisite tooltips
 * - All 7 event categories in "Awaiting event data" state
 * - Zero invented dates, timestamps, or synthetic timeline positions
 */
export default function ReplayTimeline() {
  const playbackControls = [
    { id: "prev", label: "⏮", title: "Previous Event (Requires loaded investigation)" },
    { id: "play", label: "▶", title: "Start Replay (Requires loaded investigation)" },
    { id: "pause", label: "❚❚", title: "Pause Replay (Requires active playback)" },
    { id: "next", label: "⏭", title: "Next Event (Requires loaded investigation)" },
    { id: "reset", label: "↺", title: "Reset Timeline (Requires loaded investigation)" },
  ];

  const eventCategories = [
    { id: "satellite-observation", name: "Satellite Observation", state: "Awaiting event data" },
    { id: "spill-detection", name: "Spill Detection", state: "Awaiting event data" },
    { id: "origin-window", name: "Origin Window", state: "Awaiting event data" },
    { id: "vessel-activity", name: "Vessel Activity", state: "Awaiting event data" },
    { id: "environmental-forcing", name: "Environmental Forcing", state: "Awaiting event data" },
    { id: "drift-reconstruction", name: "Drift Reconstruction", state: "Awaiting event data" },
    { id: "investigation-assessment", name: "Investigation Assessment", state: "Awaiting event data" },
  ];

  return (
    <section className={styles.timelineCard} aria-label="Incident Replay Timeline">
      {/* Header with Playback Controls */}
      <div className={styles.timelineHeader}>
        <div className={styles.headerLeft}>
          <span className={styles.cardBadge}>TEMPORAL PLAYBACK</span>
          <h3 className={styles.cardTitle}>Investigation Timeline Scrubber</h3>
        </div>

        <div className={styles.headerRight}>
          <span className={styles.timelineStateBadge}>Awaiting temporal evidence</span>

          <div className={styles.controlsButtonGroup} role="toolbar" aria-label="Playback Controls">
            {playbackControls.map((btn) => (
              <button
                key={btn.id}
                type="button"
                className={styles.ctrlBtn}
                disabled
                title={btn.title}
                aria-label={btn.title}
                aria-disabled="true"
              >
                <span>{btn.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Visual Time Scrubber Bar (Standby) */}
      <div className={styles.scrubberContainer} aria-hidden="true">
        <div className={styles.scrubberTrack}>
          <div className={styles.scrubberProgressStandby} />
          <div className={styles.scrubberHandleStandby} />
        </div>
        <div className={styles.scrubberLabels}>
          <span className={styles.timeLabel}>T₀ (Release Window)</span>
          <span className={styles.timeLabelCenter}>Awaiting Time Series</span>
          <span className={styles.timeLabel}>T_obs (Satellite Scene)</span>
        </div>
      </div>

      {/* Conceptual Event Categories Track */}
      <div className={styles.categoriesSection}>
        <span className={styles.sectionLabel}>Timeline Event Streams</span>
        <div className={styles.categoriesTrack}>
          {eventCategories.map((cat) => (
            <div key={cat.id} className={styles.categoryItem}>
              <div className={styles.catTop}>
                <span className={styles.catState}>{cat.state}</span>
              </div>
              <span className={styles.catName}>{cat.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
