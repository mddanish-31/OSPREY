"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { TOP_NAV_LINKS, WORKSPACES } from "./dashboardConfig";
import styles from "./DashboardTopNav.module.css";

/**
 * DashboardTopNav
 *
 * Floating horizontal liquid-glass navigation header for the OSPREY investigation dashboard.
 * Features:
 * - Floating top-center navigation with contextual dropdowns
 * - Status telemetry badge
 * - Top-right utilities (Alerts, Profile, Exit to Landing)
 *
 * @param {object} props
 * @param {string} props.activeWorkspace - Currently active workspace ID
 * @param {function} props.onSelectWorkspace - Callback when a workspace is selected
 * @param {function} props.onToggleCopilot - Callback to open AI Copilot
 */
export default function DashboardTopNav({
  activeWorkspace,
  onSelectWorkspace,
  onToggleCopilot,
}) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const navRef = useRef(null);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Escape key closes dropdown
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setOpenDropdown(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleNavClick = (link) => {
    if (link.hasDropdown) {
      setOpenDropdown(openDropdown === link.id ? null : link.id);
    } else {
      setOpenDropdown(null);
      onSelectWorkspace(link.workspaceId);
    }
  };

  // Workspaces mapped to Investigation
  const investigationWorkspaces = WORKSPACES.filter((w) =>
    ["satellite", "drift", "vessels", "environment", "evidence", "response"].includes(w.id)
  );

  return (
    <header className={styles.topNavHeader} ref={navRef}>
      <div className={styles.topNavContainer}>
        {/* Left: Brand Link to Home */}
        <Link href="/" className={styles.brandLink} title="Return to Public Landing Page">
          <div className={styles.brandEmblemWrapper}>
            <div className={styles.brandPingRing} />
            <svg
              className={styles.brandEmblemIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 2L3 8l9 4 9-4-9-6z" />
              <path d="M3 8v5l9 6 9-6V8" />
              <path d="M12 12l-4 3 4 3 4-3-4-3z" />
            </svg>
          </div>
          <div className={styles.brandTextGroup}>
            <span className={styles.brandTitle}>OSPREY</span>
            <span className={styles.brandSubtitle}>INVESTIGATION DASHBOARD</span>
          </div>
        </Link>

        {/* Center: Floating Nav Pills */}
        <nav className={styles.navLinksPill} aria-label="Dashboard Top Navigation">
          {TOP_NAV_LINKS.map((link) => {
            const isSelected =
              activeWorkspace === link.workspaceId ||
              (link.id === "investigation" &&
                ["satellite", "drift", "vessels", "environment", "evidence", "response"].includes(
                  activeWorkspace
                )) ||
              (link.id === "intelligence" && activeWorkspace === "copilot");

            return (
              <div key={link.id} className={styles.navItemWrapper}>
                <button
                  type="button"
                  className={`${styles.navButton} ${isSelected ? styles.navButtonActive : ""}`}
                  onClick={() => handleNavClick(link)}
                  aria-expanded={openDropdown === link.id}
                  aria-haspopup={link.hasDropdown ? "true" : undefined}
                >
                  <span>{link.label}</span>
                  {link.hasDropdown && (
                    <span
                      className={`${styles.chevron} ${
                        openDropdown === link.id ? styles.chevronOpen : ""
                      }`}
                      aria-hidden="true"
                    >
                      ▾
                    </span>
                  )}
                </button>

                {/* Dropdown Menu for Investigation */}
                {openDropdown === "investigation" && link.id === "investigation" && (
                  <div className={styles.dropdownMenu} role="menu">
                    <div className={styles.dropdownHeader}>Investigation Workspaces</div>
                    {investigationWorkspaces.map((w) => (
                      <button
                        key={w.id}
                        type="button"
                        className={`${styles.dropdownItem} ${
                          activeWorkspace === w.id ? styles.dropdownItemActive : ""
                        }`}
                        onClick={() => {
                          onSelectWorkspace(w.id);
                          setOpenDropdown(null);
                        }}
                        role="menuitem"
                      >
                        <div className={styles.dropdownItemContent}>
                          <span className={styles.dropdownItemLabel}>{w.label}</span>
                          <span className={styles.dropdownItemDesc}>{w.description}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Dropdown Menu for Intelligence */}
                {openDropdown === "intelligence" && link.id === "intelligence" && (
                  <div className={styles.dropdownMenu} role="menu">
                    <div className={styles.dropdownHeader}>Intelligence Modules</div>
                    <button
                      type="button"
                      className={styles.dropdownItem}
                      onClick={() => {
                        onSelectWorkspace("copilot");
                        setOpenDropdown(null);
                      }}
                      role="menuitem"
                    >
                      <div className={styles.dropdownItemContent}>
                        <span className={styles.dropdownItemLabel}>Investigation Copilot</span>
                        <span className={styles.dropdownItemDesc}>
                          Natural-language multi-source investigation assistant
                        </span>
                      </div>
                    </button>
                    <button
                      type="button"
                      className={styles.dropdownItem}
                      onClick={() => {
                        onSelectWorkspace("evidence");
                        setOpenDropdown(null);
                      }}
                      role="menuitem"
                    >
                      <div className={styles.dropdownItemContent}>
                        <span className={styles.dropdownItemLabel}>Explainable Attribution</span>
                        <span className={styles.dropdownItemDesc}>
                          Multi-factor evidence matrices &amp; timeline replay
                        </span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Right: Essential Utilities */}
        <div className={styles.utilitiesGroup}>
          {/* Status Badge */}
          <div className={styles.statusChip} title="Data Ingestion State">
            <span className={styles.statusDot} />
            <span className={styles.statusText}>DATA STANDBY</span>
          </div>

          {/* AI Copilot Quick Trigger */}
          <button
            type="button"
            className={styles.utilityButton}
            onClick={() => onToggleCopilot()}
            title="Toggle AI Copilot"
            aria-label="Open AI Copilot"
          >
            <span className={styles.copilotSparkle} aria-hidden="true">✦</span>
            <span className={styles.utilityText}>Copilot</span>
          </button>

          {/* Return to Landing Page Link */}
          <Link href="/" className={styles.exitLink} title="Return to Landing Page">
            <span>Landing Page</span>
            <span className={styles.exitArrow} aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
