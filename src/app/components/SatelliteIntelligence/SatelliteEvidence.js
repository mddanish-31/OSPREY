import styles from "./SatelliteEvidence.module.css";

/**
 * SatelliteEvidence
 *
 * Structured 6-category Earth observation evidence matrix.
 * Designed to accept real sensor telemetry and ML segmentation data.
 *
 * @param {object} props
 * @param {object} [props.evidenceData] - Optional real evidence fields from backend
 */
export default function SatelliteEvidence({ evidenceData }) {
  const categories = [
    {
      id: "backscatter",
      title: "Radar Backscatter Pattern",
      description: "Surface backscatter / roughness characteristics",
      value: evidenceData?.backscatter || "Pending real data",
      status: "Ready",
    },
    {
      id: "mask",
      title: "Candidate Segmentation Mask",
      description: "Model-generated candidate boundary when available",
      value: evidenceData?.mask || "Pending real data",
      status: "Awaiting Model",
    },
    {
      id: "geometry",
      title: "Scene Geometry",
      description: "Acquisition and viewing geometry",
      value: evidenceData?.geometry || "Pending real data",
      status: "Configured",
    },
    {
      id: "acquisition",
      title: "Acquisition Metadata",
      description: "Sensor, product, polarization and orbital metadata",
      value: evidenceData?.acquisition || "Pending real data",
      status: "Available",
    },
    {
      id: "optical",
      title: "Optical Cross-Check",
      description: "Conditional multispectral observation",
      value: evidenceData?.optical || "Pending real data",
      status: "Conditional",
    },
    {
      id: "provenance",
      title: "Data Provenance",
      description: "Copernicus Data Space / source metadata",
      value: evidenceData?.provenance || "Copernicus Data Space Ecosystem",
      status: "Verified",
    },
  ];

  return (
    <article className={styles.evidenceContainer}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.beaconDot} aria-hidden="true" />
          <h4 className={styles.sectionTitle}>Observation Evidence Matrix</h4>
        </div>
        <span className={styles.provenancePill}>Copernicus Data Space</span>
      </div>

      <div className={styles.grid}>
        {categories.map((cat) => (
          <div key={cat.id} className={styles.evidenceCard}>
            <div className={styles.cardTop}>
              <span className={styles.cardTitle}>{cat.title}</span>
              <span className={styles.cardStatus}>{cat.status}</span>
            </div>
            <p className={styles.cardDesc}>{cat.description}</p>
            <div className={styles.valueRow}>
              <span className={styles.valLabel}>State:</span>
              <span className={styles.valData}>{cat.value}</span>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
