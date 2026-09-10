import Link from "next/link";
import styles from "./SpillDetectionCallout.module.css";

/**
 * SpillDetectionCallout
 *
 * Tactical liquid-glass callout highlighting real-time SAR Anomaly detection state.
 *
 * @param {object} props
 * @param {string} [props.title="SAR ANOMALY DETECTED"] - Callout header
 * @param {string} [props.tag="SAR SPECTRUM // ACTIVE SWATH"] - Telemetry tag
 * @param {string} [props.href="/dashboard"] - Destination route for analysis
 */
export default function SpillDetectionCallout({
  title = "SAR ANOMALY DETECTED",
  tag = "SAR SPECTRUM // ACTIVE SWATH",
  href = "/dashboard",
}) {
  return (
    <div className={styles.calloutContainer}>
      <div className={styles.headerRow}>
        <div className={styles.beaconIndicator}>
          <span className={styles.beaconPing} />
          <span className={styles.beaconDot} />
        </div>
        <span className={styles.title}>{title}</span>
      </div>
      <span className={styles.telemetryTag}>{tag}</span>
      <Link href={href} className={styles.analysisLink}>
        <span>View Analysis</span>
        <span className={styles.arrowIcon} aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
