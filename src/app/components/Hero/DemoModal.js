"use client";

import { useEffect } from "react";
import styles from "./DemoModal.module.css";

/**
 * DemoModal
 *
 * Oceanic liquid-glass modal shell for OSPREY's video/interactive demo.
 * Designed to seamlessly receive a real video source later without UI restructuring.
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {function} props.onClose - Callback to close the modal
 * @param {string} [props.videoUrl] - Optional real video stream URL (when available)
 */
export default function DemoModal({ isOpen, onClose, videoUrl = null }) {
  // Handle ESC key to close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Prevent background scrolling while modal is open
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.modalBackdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-modal-title"
    >
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.titleGroup}>
            <span className={styles.beaconDot} aria-hidden="true" />
            <div>
              <h3 id="demo-modal-title" className={styles.modalTitle}>
                OSPREY Intelligence Walkthrough
              </h3>
              <span className={styles.modalSubtitle}>
                Interactive Scenario &amp; Workflow Overview
              </span>
            </div>
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close demo modal"
          >
            ✕
          </button>
        </div>

        {/* Video / Walkthrough Player Shell */}
        <div className={styles.playerShell}>
          {videoUrl ? (
            <video
              className={styles.videoElement}
              src={videoUrl}
              controls
              autoPlay
            />
          ) : (
            <div className={styles.placeholderCanvas}>
              <div className={styles.canvasGrid} aria-hidden="true" />
              <div className={styles.canvasSweep} aria-hidden="true" />
              <div className={styles.placeholderContent}>
                <div className={styles.playIconRing}>
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={styles.playSvg}
                  >
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
                <h4 className={styles.placeholderHeading}>
                  Demo Staging Ready
                </h4>
                <p className={styles.placeholderDesc}>
                  The live incident reconstruction demonstration and video walkthrough
                  container is configured. Real video asset integration will connect
                  directly to this player shell.
                </p>
                <div className={styles.stagingBadge}>
                  <span>AWAITING PRODUCTION VIDEO ASSET</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className={styles.modalFooter}>
          <div className={styles.footerInfo}>
            <span className={styles.footerLabel}>Pipeline Stages Covered:</span>
            <span className={styles.footerVal}>
              SAR Detection → AIS Correlation → Attribution Dossier
            </span>
          </div>
          <button
            type="button"
            className={styles.footerCloseBtn}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
