"use client";

import styles from "./CopilotPromptSuggestions.module.css";

/**
 * CopilotPromptSuggestions
 *
 * Question template suggestion chips for #11 AI Copilot.
 * Strict operational product truth:
 * - Templates only; clicking populates the prompt input
 * - Zero fake AI responses or synthetic conversation generation
 *
 * @param {object} props
 * @param {function} props.onSelectSuggestion - Callback when a suggestion chip is clicked
 */
export default function CopilotPromptSuggestions({ onSelectSuggestion }) {
  const suggestions = [
    "Was a spill detected?",
    "Where is the probable origin?",
    "Which vessels are potential candidates?",
    "Why is this vessel ranked higher?",
    "What evidence supports this attribution?",
    "What environmental areas may be exposed?",
    "What response factors should investigators review?",
  ];

  return (
    <div className={styles.chipsSection} aria-label="Investigation Question Templates">
      <span className={styles.chipsLabel}>Suggested Queries</span>
      <div className={styles.chipsGrid}>
        {suggestions.map((question, idx) => (
          <button
            key={idx}
            type="button"
            className={styles.chipButton}
            onClick={() => onSelectSuggestion?.(question)}
            aria-label={`Insert template question: ${question}`}
          >
            <span>{question}</span>
            <span className={styles.chipArrow} aria-hidden="true">→</span>
          </button>
        ))}
      </div>
    </div>
  );
}
