"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TOP_NAV_ITEMS, INVESTIGATION_GROUPS } from "./navConfig";
import InvestigationMegaMenu from "./InvestigationMegaMenu";
import styles from "./HeroNavbar.module.css";

/**
 * HeroNavbar
 *
 * Floating liquid-glass navigation header.
 * Features:
 * - Desktop 4-column minimal Investigation Mega Menu
 * - IntersectionObserver active section highlighting
 * - Dynamic scroll state glass reinforcement
 * - Mobile hamburger menu with expandable Investigation accordion
 * - Accessible keyboard & click-outside controls
 * - Route-ready admin investigation CTA
 */
export default function HeroNavbar() {
  const [activeSection, setActiveSection] = useState("overview");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileAccordionOpen, setIsMobileAccordionOpen] = useState(false);

  // 1. Navbar Scroll Detection (Enhances glass density on scroll)
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 2. IntersectionObserver for Active Section Detection
  useEffect(() => {
    const sectionIds = ["overview", "capabilities", "how-it-works", "satellite-intelligence"];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (id === "capabilities" || id === "how-it-works") {
              setActiveSection("investigation");
            } else {
              setActiveSection(id);
            }
          }
        });
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0.1,
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  // 3. Smooth Scroll Navigation Handler
  const handleNavClick = (e, item) => {
    if (e) e.preventDefault();
    setIsMegaMenuOpen(false);
    setIsMobileMenuOpen(false);

    if (item.isMegaMenu) {
      setIsMegaMenuOpen(!isMegaMenuOpen);
      return;
    }

    const targetEl = document.getElementById(item.id || item.href?.replace("#", ""));
    if (targetEl) {
      setActiveSection(item.id || item.href?.replace("#", ""));
      targetEl.scrollIntoView({ behavior: "smooth" });
    } else if (item.id === "technology" || item.href === "#technology") {
      // Graceful fallback for future Technology section: scroll to bottom-most current section
      const lastSection = document.getElementById("satellite-intelligence");
      if (lastSection) {
        lastSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // 4. Handle Direct Target Navigation (e.g. from Mega Menu items)
  const handleDirectNavigate = (targetHref) => {
    setIsMegaMenuOpen(false);
    setIsMobileMenuOpen(false);

    const targetId = targetHref.replace("#", "");
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      if (targetId === "capabilities" || targetId === "how-it-works") {
        setActiveSection("investigation");
      } else {
        setActiveSection(targetId);
      }
      targetEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 5. Handle Escape Key to Close Menus
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (isMegaMenuOpen) setIsMegaMenuOpen(false);
        if (isMobileMenuOpen) setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMegaMenuOpen, isMobileMenuOpen]);

  return (
    <header className={`${styles.navHeader} ${isScrolled ? styles.navHeaderScrolled : ""}`}>
      <nav
        className={`${styles.navContainer} ${isScrolled ? styles.navContainerScrolled : ""}`}
        aria-label="Main Navigation"
      >
        {/* Brand Link */}
        <a
          href="#overview"
          className={styles.brandLink}
          onClick={(e) => handleNavClick(e, { id: "overview", href: "#overview" })}
          aria-label="OSPREY Home - Scroll to Overview"
        >
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
            <span className={styles.brandSubtitle}>Maritime Intelligence</span>
          </div>
        </a>

        {/* Center Desktop Navigation Links */}
        <div className={styles.navLinksList} role="menubar">
          {TOP_NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;

            if (item.isMegaMenu) {
              return (
                <button
                  key={item.label}
                  type="button"
                  className={`${styles.navLink} ${styles.navMegaButton} ${
                    isMegaMenuOpen || isActive ? styles.navLinkActive : ""
                  }`}
                  onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                  aria-expanded={isMegaMenuOpen}
                  aria-haspopup="true"
                  role="menuitem"
                >
                  <span>{item.label}</span>
                  <span
                    className={`${styles.chevron} ${isMegaMenuOpen ? styles.chevronOpen : ""}`}
                    aria-hidden="true"
                  >
                    ▾
                  </span>
                </button>
              );
            }

            return (
              <a
                key={item.label}
                href={item.href}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
                onClick={(e) => handleNavClick(e, item)}
                role="menuitem"
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </a>
            );
          })}
        </div>

        {/* Desktop Actions Cluster */}
        <div className={styles.navActions}>
          {/* Orbital Telemetry Status Chip */}
          <div className={styles.statusIndicator} title="Surveillance System State">
            <span className={styles.statusBeaconDot}>
              <span className={styles.statusBeaconPing} />
            </span>
            <span>ORBITAL ACTIVE</span>
          </div>

          {/* Primary Route-Ready Action Button */}
          <Link href="/admin/login" className={styles.navCtaButton}>
            <span>Start Investigation</span>
            <span className={styles.navCtaArrow} aria-hidden="true">→</span>
          </Link>

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            className={styles.mobileMenuToggle}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav-menu"
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {isMobileMenuOpen ? (
              <span className={styles.closeIcon}>✕</span>
            ) : (
              <span className={styles.hamburgerIcon}>
                <span className={styles.hamburgerBar} />
                <span className={styles.hamburgerBar} />
                <span className={styles.hamburgerBar} />
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Desktop Floating Mega Menu */}
      <InvestigationMegaMenu
        isOpen={isMegaMenuOpen}
        onClose={() => setIsMegaMenuOpen(false)}
        onNavigate={handleDirectNavigate}
      />

      {/* Mobile Liquid-Glass Navigation Drawer */}
      {isMobileMenuOpen && (
        <div
          id="mobile-nav-menu"
          className={styles.mobileMenuDrawer}
          role="menu"
          aria-label="Mobile Navigation"
        >
          <div className={styles.mobileNavLinksList}>
            {/* Overview */}
            <a
              href="#overview"
              className={`${styles.mobileNavLink} ${
                activeSection === "overview" ? styles.mobileNavLinkActive : ""
              }`}
              onClick={(e) => handleNavClick(e, { id: "overview", href: "#overview" })}
              role="menuitem"
            >
              <span className={styles.mobileNavLabel}>Overview</span>
              {activeSection === "overview" && <span className={styles.activeDot} />}
            </a>

            {/* Investigation Accordion */}
            <div className={styles.mobileAccordionContainer}>
              <button
                type="button"
                className={`${styles.mobileNavLink} ${styles.mobileAccordionTrigger} ${
                  activeSection === "investigation" ? styles.mobileNavLinkActive : ""
                }`}
                onClick={() => setIsMobileAccordionOpen(!isMobileAccordionOpen)}
                aria-expanded={isMobileAccordionOpen}
              >
                <span className={styles.mobileNavLabel}>Investigation</span>
                <span className={styles.accordionChevron}>
                  {isMobileAccordionOpen ? "▴" : "▾"}
                </span>
              </button>

              {isMobileAccordionOpen && (
                <div className={styles.accordionContent}>
                  {INVESTIGATION_GROUPS.map((group) => (
                    <div key={`mob-${group.title}`} className={styles.accordionGroup}>
                      <span className={styles.accordionGroupTitle}>{group.title}</span>
                      <div className={styles.accordionGroupItems}>
                        {group.items.map((item) => (
                          <a
                            key={`mob-${item.label}`}
                            href={item.href}
                            className={styles.accordionItemLink}
                            onClick={(e) => {
                              e.preventDefault();
                              handleDirectNavigate(item.href);
                            }}
                          >
                            <span>{item.label}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SAR Intelligence */}
            <a
              href="#satellite-intelligence"
              className={`${styles.mobileNavLink} ${
                activeSection === "satellite-intelligence" ? styles.mobileNavLinkActive : ""
              }`}
              onClick={(e) =>
                handleNavClick(e, {
                  id: "satellite-intelligence",
                  href: "#satellite-intelligence",
                })
              }
              role="menuitem"
            >
              <span className={styles.mobileNavLabel}>SAR Intelligence</span>
              {activeSection === "satellite-intelligence" && <span className={styles.activeDot} />}
            </a>

            {/* Technology */}
            <a
              href="#technology"
              className={`${styles.mobileNavLink} ${
                activeSection === "technology" ? styles.mobileNavLinkActive : ""
              }`}
              onClick={(e) => handleNavClick(e, { id: "technology", href: "#technology" })}
              role="menuitem"
            >
              <span className={styles.mobileNavLabel}>Technology</span>
              {activeSection === "technology" && <span className={styles.activeDot} />}
            </a>
          </div>

          {/* Mobile Footer */}
          <div className={styles.mobileMenuFooter}>
            <div className={styles.mobileStatusIndicator}>
              <span className={styles.statusBeaconDot}>
                <span className={styles.statusBeaconPing} />
              </span>
              <span>ORBITAL ACTIVE</span>
            </div>

            <Link
              href="/admin/login"
              className={styles.mobileCtaButton}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span>Start Investigation →</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
