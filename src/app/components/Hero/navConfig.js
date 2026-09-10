/**
 * navConfig.js
 *
 * Centralized navigation configuration for OSPREY.
 * Declares the top-level navbar items and the 4 minimal Investigation mega-menu groups.
 */

export const TOP_NAV_ITEMS = [
  { label: "Overview", href: "#overview", id: "overview" },
  { label: "Investigation", isMegaMenu: true, id: "investigation" },
  { label: "SAR Intelligence", href: "#satellite-intelligence", id: "satellite-intelligence" },
  { label: "Technology", href: "#technology", id: "technology" },
];

export const INVESTIGATION_GROUPS = [
  {
    title: "SATELLITE",
    items: [
      { label: "SAR Scene", href: "#satellite-intelligence", desc: "C-Band radar backscatter" },
      { label: "Spill Detection", href: "#satellite-intelligence", desc: "Candidate anomaly mask" },
      { label: "Sentinel-2", href: "#satellite-intelligence", desc: "Conditional optical check" },
    ],
  },
  {
    title: "DRIFT & OCEAN",
    items: [
      { label: "Origin Reconstruction", href: "#how-it-works", desc: "Backward vector drift" },
      { label: "Ocean Dynamics", href: "#how-it-works", desc: "Currents & wind vectors" },
      { label: "What-if Simulation", href: "#how-it-works", desc: "Hydrodynamic modeling" },
    ],
  },
  {
    title: "VESSELS",
    items: [
      { label: "AIS Correlation", href: "#how-it-works", desc: "Spatiotemporal alignment" },
      { label: "Behavioural Analysis", href: "#how-it-works", desc: "Anomaly fingerprinting" },
      { label: "Vessel Intelligence", href: "#how-it-works", desc: "Dark vessel cross-matching" },
    ],
  },
  {
    title: "EVIDENCE",
    items: [
      { label: "Explainability", href: "#how-it-works", desc: "Multi-factor attribution" },
      { label: "Incident Replay", href: "#how-it-works", desc: "Chronological audit trail" },
      { label: "Investigation Report", href: "#how-it-works", desc: "Response dossier export" },
    ],
  },
];
