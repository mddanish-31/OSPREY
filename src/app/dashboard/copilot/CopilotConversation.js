"use client";

import { useState, useRef } from "react";
import CopilotPromptSuggestions from "./CopilotPromptSuggestions";
import styles from "./CopilotConversation.module.css";

/**
 * CopilotConversation
 *
 * Primary conversation and grounded response shell for AI Copilot.
 * Operates across both dedicated workspace and floating drawer contexts.
 * Strict scientific & operational product truth:
 * - Pure data-ready standby state awaiting active investigation
 * - Zero fake LLM calls, fabricated answers, or synthetic streaming
 *
 * @param {object} props
 * @param {"workspace"|"drawer"} props.variant - Display mode variant
 */
export default function CopilotConversation({ variant = "workspace" }) {
  const [inputValue, setInputValue] = useState("");
  const [feedbackNotice, setFeedbackNotice] = useState(null);
  const inputRef = useRef(null);

  const handleSelectSuggestion = (questionText) => {
    setInputValue(questionText);
    setFeedbackNotice(null);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Truthful operational prerequisite feedback
    setFeedbackNotice(
      "An active investigation is required before Copilot can answer from OSPREY evidence."
    );
  };

  const handleClear = () => {
    setInputValue("");
    setFeedbackNotice(null);
  };

  const groundedResponseSchema = [
    { label: "Answer", value: "Awaiting investigation context" },
    { label: "Evidence", value: "Pending" },
    { label: "Sources", value: "Pending" },
    { label: "Uncertainty", value: "Pending" },
    { label: "Next Step", value: "Pending" },
  ];

  const isDrawer = variant === "drawer";

  return (
    <div
      className={`${styles.conversationContainer} ${isDrawer ? styles.drawerVariant : ""}`}
      aria-label="Investigation Copilot Conversation Area"
    >
      {/* Header (Only rendered in workspace mode, drawer has its own drawer header) */}
      {!isDrawer && (
        <div className={styles.conversationHeader}>
          <div className={styles.headerTitleGroup}>
            <span className={styles.cardBadge}>GROUNDED CONVERSATION</span>
            <h3 className={styles.cardTitle}>Investigation Dialogue</h3>
          </div>

          <div className={styles.headerActions}>
            <span className={styles.statusPill}>
              <span className={styles.statusDot} aria-hidden="true" />
              <span>Standby</span>
            </span>

            {(inputValue || feedbackNotice) && (
              <button
                type="button"
                className={styles.clearBtn}
                onClick={handleClear}
                aria-label="Clear conversation input"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Conversation Body */}
      <div className={styles.conversationBody}>
        {/* Empty State Prompt */}
        <div className={styles.emptyStatePrompt}>
          <div className={styles.copilotEmblem}>
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 2v4" />
              <path d="M12 18v4" />
              <path d="M4.93 4.93l2.83 2.83" />
              <path d="M16.24 16.24l2.83 2.83" />
              <path d="M2 12h4" />
              <path d="M18 12h4" />
              <path d="M4.93 19.07l2.83-2.83" />
              <path d="M16.24 7.76l2.83-2.83" />
            </svg>
          </div>

          <h4 className={styles.emptyHeading}>Investigation Copilot Standby</h4>
          <p className={styles.emptyDesc}>
            Load an investigation or satellite scene to activate evidence-grounded assistance.
          </p>
        </div>

        {/* Future Grounded Response Architecture Frame */}
        <div className={styles.groundedResponseCard}>
          <div className={styles.responseTop}>
            <span className={styles.responseSchemaTag}>Response Architecture Schema</span>
            <span className={styles.responseStateBadge}>Standby</span>
          </div>

          <div className={styles.responseGrid}>
            {groundedResponseSchema.map((item, idx) => (
              <div key={idx} className={styles.responseItem}>
                <span className={styles.itemLabel}>{item.label}</span>
                <span className={styles.itemValue}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Prompt Suggestions */}
        <CopilotPromptSuggestions onSelectSuggestion={handleSelectSuggestion} />

        {/* Prerequisite Alert if user submits */}
        {feedbackNotice && (
          <div className={styles.feedbackAlert} role="status">
            <span className={styles.feedbackDot} aria-hidden="true" />
            <p className={styles.feedbackText}>{feedbackNotice}</p>
          </div>
        )}

        {/* Trust & Safety Disclaimers */}
        <div className={styles.safetyBox}>
          <span className={styles.safetyIcon} aria-hidden="true">ℹ</span>
          <p className={styles.safetyText}>
            Copilot answers should be grounded in available investigation evidence. Missing or uncertain evidence must be surfaced rather than inferred. Copilot output is decision support, not a substitute for scientific validation or operational authority.
          </p>
        </div>
      </div>

      {/* Input Form Footer */}
      <form className={styles.inputForm} onSubmit={handleSubmit}>
        <div className={styles.inputWrapper}>
          <input
            ref={inputRef}
            type="text"
            className={styles.copilotInput}
            placeholder="Ask about the current investigation…"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (feedbackNotice) setFeedbackNotice(null);
            }}
            aria-label="Ask about the current investigation"
          />

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={!inputValue.trim()}
            aria-label="Submit Question"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
