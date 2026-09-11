/**
 * dashboardConfig.js
 *
 * Centralized taxonomy of OSPREY investigation workspaces and capabilities.
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
    label: "Overview",
    category: "OVERVIEW",
    description: "Command-center overview and unified investigation map",
    capabilities: [
      { id: "investigation-overview", name: "Investigation Overview", desc: "Unified operational picture and active investigation state" },
    ],
  },
  {
    id: "satellite",
    label: "Satellite",
    category: "SATELLITE",
    description: "Sentinel-1 SAR observation and optical cross-checking",
    capabilities: [
      { id: "sar-scene", name: "SAR Scene", desc: "C-Band Sentinel-1 backscatter scene viewer" },
      { id: "spill-detection", name: "AI Spill Detection", desc: "Surface dampening anomaly segmentation" },
      { id: "spill-characterization", name: "Spill Characterization", desc: "Geographic slick polygon and centroid calculation" },
      { id: "sentinel2-crosscheck", name: "Sentinel-2 Cross-check", desc: "Conditional multispectral daylight validation" },
    ],
  },
  {
    id: "drift",
    label: "Drift & Ocean",
    category: "DRIFT & OCEAN",
    description: "Hydrodynamic backward drift modeling and environmental forcing",
    capabilities: [
      { id: "drift-reconstruction", name: "Drift Reconstruction", desc: "OpenDrift / ERA5 / CMEMS backward vector modeling" },
      { id: "ocean-dynamics", name: "Ocean Dynamics", desc: "Current and wind field overlay inspection" },
      { id: "whatif-simulation", name: "What-if Simulation", desc: "Hypothetical release scenario forecasting" },
    ],
  },
  {
    id: "vessels",
    label: "Vessels",
    category: "VESSELS",
    description: "Spatiotemporal AIS correlation and behavioral anomaly detection",
    capabilities: [
      { id: "ais-correlation", name: "AIS Correlation", desc: "Historical vessel track spatiotemporal matching" },
      { id: "behavioural-fingerprint", name: "Behavioural Fingerprint", desc: "Route deviations, loitering, and broadcast gaps" },
      { id: "dark-vessel-detection", name: "Dark Vessel Detection", desc: "SAR contact vs AIS record mismatch cross-check" },
      { id: "vessel-ranking", name: "Vessel Ranking", desc: "Multi-factor candidate association prioritization" },
    ],
  },
  {
    id: "environment",
    label: "Environment",
    category: "ENVIRONMENT",
    description: "Coastal vulnerability and sensitive marine habitat exposure",
    capabilities: [
      { id: "environmental-risk", name: "Environmental Risk & Impact", desc: "Coastal exposure, sensitive marine habitats, and fisheries risk" },
    ],
  },
  {
    id: "evidence",
    label: "Evidence",
    category: "EVIDENCE",
    description: "Transparent multi-factor attribution and incident replay",
    capabilities: [
      { id: "explainability", name: "Evidence / Explainability", desc: "Transparent 7-factor association evidence matrix" },
      { id: "incident-replay", name: "Incident Replay", desc: "Interactive temporal evidence playback and what-if simulation" },
    ],
  },
  {
    id: "response",
    label: "Response",
    category: "RESPONSE",
    description: "Operational response prioritization, action planning, and surveillance monitoring",
    capabilities: [
      { id: "response-intelligence", name: "Response Intelligence", desc: "Evidence-based operational prioritization and monitoring" },
    ],
  },
  {
    id: "copilot",
    label: "AI Copilot",
    category: "INTELLIGENCE",
    description: "Contextual natural-language maritime intelligence assistant",
    capabilities: [
      { id: "ai-copilot", name: "Investigation Copilot", desc: "Interactive natural-language investigation queries" },
    ],
  },
  {
    id: "reports",
    label: "Reports",
    category: "OUTPUT",
    description: "Operational response dossier generation and alert exports",
    capabilities: [
      { id: "investigation-report", name: "Investigation Reports", desc: "Compile verified investigation evidence into a structured operational report" },
    ],
  },
];
