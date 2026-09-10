/**
 * dashboardConfig.js
 *
 * Centralized taxonomy of OSPREY's 19 application capabilities
 * grouped into 8 core operational workspaces.
 */

export const TOP_NAV_LINKS = [
  { id: "overview", label: "Overview", workspaceId: "overview" },
  { id: "investigation", label: "Investigation", workspaceId: "satellite", hasDropdown: true },
  { id: "intelligence", label: "Intelligence", workspaceId: "copilot", hasDropdown: true },
  { id: "reports", label: "Reports", workspaceId: "reports" },
];

export const WORKSPACES = [
  {
    id: "overview",
    number: "01",
    label: "Overview",
    category: "OVERVIEW",
    description: "Command-center overview and unified investigation map",
    capabilities: [
      { id: "investigation-overview", num: 1, name: "Investigation Overview", desc: "Unified operational picture and active investigation state" },
    ],
  },
  {
    id: "satellite",
    number: "02",
    label: "Satellite",
    category: "SATELLITE",
    description: "Sentinel-1 SAR observation and optical cross-checking",
    capabilities: [
      { id: "sar-scene", num: 2, name: "SAR Scene", desc: "C-Band Sentinel-1 backscatter scene viewer" },
      { id: "spill-detection", num: 3, name: "AI Spill Detection", desc: "Surface dampening anomaly segmentation" },
      { id: "spill-characterization", num: 4, name: "Spill Characterization", desc: "Geographic slick polygon and centroid calculation" },
      { id: "sentinel2-crosscheck", num: 5, name: "Sentinel-2 Cross-check", desc: "Conditional multispectral daylight validation" },
    ],
  },
  {
    id: "drift",
    number: "03",
    label: "Drift & Ocean",
    category: "DRIFT & OCEAN",
    description: "Hydrodynamic backward drift modeling and environmental forcing",
    capabilities: [
      { id: "drift-reconstruction", num: 6, name: "Drift Reconstruction", desc: "OpenDrift / ERA5 / CMEMS backward vector modeling" },
      { id: "ocean-dynamics", num: 7, name: "Ocean Dynamics", desc: "Current and wind field overlay inspection" },
      { id: "whatif-simulation", num: 14, name: "What-if Simulation", desc: "Hypothetical release scenario forecasting" },
    ],
  },
  {
    id: "vessels",
    number: "04",
    label: "Vessels",
    category: "VESSELS",
    description: "Spatiotemporal AIS correlation and behavioral anomaly detection",
    capabilities: [
      { id: "ais-correlation", num: 8, name: "AIS Correlation", desc: "Historical vessel track spatiotemporal matching" },
      { id: "behavioural-fingerprint", num: 9, name: "Behavioural Fingerprint", desc: "Route deviations, loitering, and broadcast gaps" },
      { id: "dark-vessel-detection", num: 10, name: "Dark Vessel Detection", desc: "SAR contact vs AIS record mismatch cross-check" },
      { id: "vessel-ranking", num: 11, name: "Vessel Ranking", desc: "Multi-factor candidate association prioritization" },
    ],
  },
  {
    id: "environment",
    number: "05",
    label: "Environment",
    category: "ENVIRONMENT",
    description: "Coastal vulnerability and sensitive marine habitat exposure",
    capabilities: [
      { id: "environmental-risk", num: 9, name: "Environmental Risk & Impact", desc: "Coastal exposure, sensitive marine habitats, and fisheries risk" },
    ],
  },
  {
    id: "evidence",
    number: "06",
    label: "Evidence",
    category: "EVIDENCE",
    description: "Transparent multi-factor attribution and incident replay",
    capabilities: [
      { id: "explainability", num: 8, name: "Evidence / Explainability", desc: "Transparent 7-factor association evidence matrix" },
      { id: "incident-replay", num: 13, name: "Incident Replay", desc: "Interactive temporal evidence playback and what-if simulation" },
    ],
  },
  {
    id: "response",
    number: "07",
    label: "Response",
    category: "RESPONSE",
    description: "Operational response prioritization, action planning, and surveillance monitoring",
    capabilities: [
      { id: "response-intelligence", num: 10, name: "Response Intelligence", desc: "Evidence-based operational prioritization and monitoring" },
    ],
  },
  {
    id: "copilot",
    number: "08",
    label: "AI Copilot",
    category: "INTELLIGENCE",
    description: "Contextual natural-language maritime intelligence assistant",
    capabilities: [
      { id: "ai-copilot", num: 11, name: "Investigation Copilot", desc: "Interactive natural-language investigation queries" },
    ],
  },
  {
    id: "reports",
    number: "09",
    label: "Reports",
    category: "OUTPUT",
    description: "Operational response dossier generation and alert exports",
    capabilities: [
      { id: "investigation-report", num: 12, name: "Investigation Reports", desc: "Compile verified investigation evidence into a structured operational report" },
    ],
  },
];
