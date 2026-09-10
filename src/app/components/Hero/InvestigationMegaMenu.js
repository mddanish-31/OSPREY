"use client";

import { useEffect, useRef } from "react";
import { INVESTIGATION_GROUPS } from "./navConfig";
import styles from "./InvestigationMegaMenu.module.css";

/**
 * InvestigationMegaMenu
 *
 * Compact floating liquid-glass mega menu for desktop navigation.
 * Displays the 4 primary investigation domains: SATELLITE, DRIFT & OCEAN, VESSELS, EVIDENCE.
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Whether the menu is visible
 * @param {function} props.onClose - Callback to close the menu
 * @param {function} props.onNavigate - Callback when a menu item is clicked
 */
export default function InvestigationMegaMenu({ isOpen, onClose, onNavigate }) {
  const menuRef = useRef(null);

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className={styles.megaMenuContainer}
      role="region"
      aria-label="Investigation Areas Menu"
    >
      <div className={styles.megaMenuInner}>
        {INVESTIGATION_GROUPS.map((group) => (
          <div key={group.title} className={styles.groupColumn}>
            <div className={styles.groupHeader}>
              <span className={styles.groupDot} aria-hidden="true" />
              <span className={styles.groupTitle}>{group.title}</span>
            </div>

            <div className={styles.itemList}>
              {group.items.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={styles.menuItem}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(item.href);
                  }}
                  role="menuitem"
                >
                  <span className={styles.itemLabel}>{item.label}</span>
                  <span className={styles.itemDesc}>{item.desc}</span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Subtle bottom highlight */}
      <div className={styles.bottomHighlight} aria-hidden="true" />
    </div>
  );
}
