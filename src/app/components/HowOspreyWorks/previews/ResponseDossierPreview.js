import styles from "./previews.module.css";

/**
 * ResponseDossierPreview
 * Stage 10: Actionable operational dossier & response priorities.
 */
export default function ResponseDossierPreview() {
  const dossierModules = [
    "Investigation Summary",
    "Affected Marine Zones",
    "Evidentiary Synthesis",
    "Response Priorities",
    "Dossier PDF Export",
  ];

  return (
    <div className={styles.previewContainer}>
      <div className={styles.previewHeader}>
        <span className={styles.previewLabel}>Operational Briefing</span>
        <span className={styles.statusPill}>
          <span className={`${styles.statusDot} ${styles.statusDotReady}`} />
          <span>Export Ready</span>
        </span>
      </div>
      <div className={styles.matrixTagList}>
        {dossierModules.map((item) => (
          <span key={item} className={`${styles.matrixTag} ${styles.matrixTagHighlight}`}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
