import ProblemCard from "./ProblemCard";
import styles from "./ProblemCarousel.module.css";

/**
 * ProblemCarousel
 *
 * Two-Row Infinite Marquee Carousel:
 * - Row 1: Continuous smooth Leftward movement (0% -> -50%)
 * - Row 2: Continuous smooth Rightward movement (-50% -> 0%)
 * - Left/Right gradient fade masks
 * - Pause on row hover
 * - Elevated card hover
 * - Seamless CSS keyframe loop
 * - Reduced motion fallback
 *
 * @param {object} props
 * @param {Array} props.row1Items - Array of problem card objects for Row 1
 * @param {Array} props.row2Items - Array of problem card objects for Row 2
 */
export default function ProblemCarousel({ row1Items, row2Items }) {
  // Duplicate sets to ensure a mathematically seamless 0% -> -50% marquee loop
  const row1Repeated = [...row1Items, ...row1Items];
  const row2Repeated = [...row2Items, ...row2Items];

  return (
    <div className={styles.carouselWrapper} aria-label="Fragmented intelligence problem signals">
      {/* Row 1: Leftward Flow */}
      <div className={styles.marqueeRow} tabIndex={0} aria-label="Problems stream 1">
        <div className={styles.marqueeTrackLeft}>
          {row1Repeated.map((item, index) => (
            <ProblemCard
              key={`row1-${item.number}-${index}`}
              tag={item.tag}
              title={item.title}
              description={item.description}
              icon={item.icon}
            />
          ))}
        </div>
      </div>

      {/* Row 2: Rightward Flow */}
      <div className={styles.marqueeRow} tabIndex={0} aria-label="Problems stream 2">
        <div className={styles.marqueeTrackRight}>
          {row2Repeated.map((item, index) => (
            <ProblemCard
              key={`row2-${item.number}-${index}`}
              tag={item.tag}
              title={item.title}
              description={item.description}
              icon={item.icon}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
